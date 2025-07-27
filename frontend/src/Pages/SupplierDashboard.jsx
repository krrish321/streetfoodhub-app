import React, { useState, useEffect } from "react";
import { FaBoxOpen, FaClipboardList, FaShippingFast, FaCheckCircle, FaPlusCircle, FaUpload, FaEdit, FaUserAlt, FaStore, FaChartLine, FaImage } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';

const SupplierDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", stock: "", price: "", category: "", photo: "" });

  // Fetch orders from backend (poll every 5 seconds)
  useEffect(() => {
    const supplierId = JSON.parse(localStorage.getItem("user"))?.supplierId;
    if (!supplierId) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/suppliers/${supplierId}/orders`);
        if (res.ok) {
          const data = await res.json();
          setOrders(
            data.map((order, idx) => ({
              id: order._id || idx + 1,
              item: order.item?.name || "Unknown",
              status: order.status || "Pending"
            }))
          );
        }
      } catch (err) {
        // Optionally show error
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  // Order status update with backend sync
  const updateOrderStatus = async (id, newStatus) => {
    // Update backend first
    try {
      const res = await fetch(`http://localhost:5000/api/suppliers/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        toast.error("Failed to update order status!");
        return;
      }
    } catch (err) {
      toast.error("Server error while updating order!");
      return;
    }

    // Update local state
    setOrders((prev) =>
      prev
        .map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
        .filter((order) => !(order.id === id && newStatus === "Delivered"))
    );
    const order = orders.find(o => o.id === id);
    if (newStatus === "Shipped") {
      toast.success(`📦 ${order.item} has been shipped!`);
    } else if (newStatus === "Delivered") {
      toast.success(`✅ ${order.item} delivered successfully!`);
    } else if (newStatus === "Pending") {
      toast(`⏳ ${order.item} status changed to pending`, { icon: '📋' });
    }
  };

  // Order status counts
  const statusCounts = orders.reduce(
    (acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    },
    { Pending: 0, Shipped: 0, Delivered: 0 }
  );

  // Item upload to backend
  const handleItemUpload = async () => {
    const supplierId = JSON.parse(localStorage.getItem("user"))?.supplierId;
    if (!supplierId) {
      toast.error("Supplier not logged in!");
      return;
    }

    if (
      !newItem.name ||
      isNaN(Number(newItem.stock)) ||
      isNaN(Number(newItem.price)) ||
      !newItem.category
    ) {
      toast.error("Please enter valid item details (stock and price must be numbers)");
      return;
    }

    const itemData = {
      name: newItem.name,
      stock: Number(newItem.stock),
      price: Number(newItem.price),
      category: newItem.category,
      photo: ""
    };

    try {
      toast.loading("Uploading item...", { id: 'upload' });
      const res = await fetch(`http://localhost:5000/api/suppliers/${supplierId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData)
      });
      if (res.ok) {
        toast.success("🎉 Item uploaded successfully!", { id: 'upload' });
        setNewItem({ name: "", stock: "", price: "", category: "", photo: "" });
      } else {
        toast.error("Upload failed. Please try again!", { id: 'upload' });
      }
    } catch (err) {
      toast.error("Server error. Please check your connection!", { id: 'upload' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#FED7B7',
            color: '#C2410C',
            fontWeight: '500',
            borderRadius: '16px',
            border: '1px solid #FDBA74',
          },
        }}
      />

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                <FaUserAlt className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Supplier Dashboard
                </h1>
                <p className="text-gray-600 flex items-center space-x-2 mt-1">
                  <FaStore className="text-sm" />
                  <span>Manage your food business</span>
                </p>
              </div>
            </div>



            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl font-medium shadow-lg flex items-center space-x-2">
              <FaChartLine />
              <span>Active Supplier</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-orange-100 animate-fade-in group">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-10 -translate-y-10"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Orders</p>
                  <p className="font-bold text-3xl group-hover:scale-110 transition-transform duration-200">{orders.length}</p>
                </div>
                <FaClipboardList className="text-2xl opacity-80" />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center space-x-1 text-green-600">
                <FaChartLine className="text-sm" />
                <span className="text-sm font-medium">+12% this month</span>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-orange-100 animate-fade-in group" style={{ animationDelay: '100ms' }}>
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-10 -translate-y-10"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Shipped Orders</p>
                  <p className="font-bold text-3xl group-hover:scale-110 transition-transform duration-200">{statusCounts["Shipped"]}</p>
                </div>
                <FaShippingFast className="text-2xl opacity-80" />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center space-x-1 text-green-600">
                <FaChartLine className="text-sm" />
                <span className="text-sm font-medium">+8% this week</span>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-orange-100 animate-fade-in group" style={{ animationDelay: '200ms' }}>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-10 -translate-y-10"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Delivered Orders</p>
                  <p className="font-bold text-3xl group-hover:scale-110 transition-transform duration-200">{statusCounts["Delivered"]}</p>
                </div>
                <FaCheckCircle className="text-2xl opacity-80" />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center space-x-1 text-green-600">
                <FaChartLine className="text-sm" />
                <span className="text-sm font-medium">+5% this week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Item Upload Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-orange-100 overflow-hidden animate-fade-in" style={{ animationDelay: '300ms' }}>
          {/* Form Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
            <h2 className="text-2xl font-bold flex items-center space-x-3">
              <FaPlusCircle className="text-2xl" />
              <span>Upload New Item</span>
            </h2>
            <p className="text-purple-100 mt-1">Add your new Stock</p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Item Name</label>
                <input
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g., Delicious Pizza"
                  className="w-full p-4 border-2 border-orange-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Stock Quantity</label>
                <input
                  value={newItem.stock}
                  onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                  placeholder="Enter stock count"
                  className="w-full p-4 border-2 border-orange-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  type="number"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Price (₹)</label>
                <input
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  placeholder="Enter price"
                  className="w-full p-4 border-2 border-orange-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  type="number"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <input
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  placeholder="e.g., Main Course"
                  className="w-full p-4 border-2 border-orange-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-gray-700">Photo</label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={(e) => setNewItem({ ...newItem, photo: e.target.files[0] })}
                    className="w-full p-4 border-2 border-orange-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  />
                  <FaImage className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            <button
              onClick={handleItemUpload}
              className="mt-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-3"
            >
              <FaUpload />
              <span>Upload Item</span>
            </button>
          </div>
        </div>

        {/* Order List */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-orange-100 overflow-hidden animate-fade-in" style={{ animationDelay: '400ms' }}>
          {/* Table Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6 text-white">
            <h2 className="text-2xl font-bold flex items-center space-x-3">
              <FaBoxOpen className="text-2xl" />
              <span>Your Orders</span>
            </h2>
            <p className="text-indigo-100 mt-1">Manage and track your orders</p>
          </div>

          <div className="p-8">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <FaBoxOpen className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h3>
                <p className="text-gray-600">Orders will appear here once customers start ordering</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-orange-200">
                      <th className="py-4 px-6 text-left font-bold text-gray-800 bg-orange-50 rounded-l-2xl">Order ID</th>
                      <th className="py-4 px-6 text-left font-bold text-gray-800 bg-orange-50">Item</th>
                      <th className="py-4 px-6 text-left font-bold text-gray-800 bg-orange-50">Status</th>
                      <th className="py-4 px-6 text-left font-bold text-gray-800 bg-orange-50 rounded-r-2xl">Change Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr
                        key={order.id}
                        className="border-b border-orange-100 hover:bg-orange-50/50 transition-colors duration-200 animate-fade-in"
                        style={{ animationDelay: `${500 + index * 100}ms` }}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                              {order.id}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-gray-800">{order.item}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-bold ${order.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : order.status === 'Shipped'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700'
                              }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="p-3 border-2 border-orange-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm font-medium"
                          >
                            <option value="Pending">📋 Pending</option>
                            <option value="Shipped">📦 Shipped</option>
                            <option value="Delivered">✅ Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>






            )}
          </div>



        </div>

        {/* Hygiene Verified Info Box */}
        <div className="max-w-7xl mx-auto px-6 mt-6">
          <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-900 p-5 rounded-2xl shadow-md flex items-start space-x-4">
            <div className="text-2xl">🧼</div>
            <div>
              <h3 className="text-lg font-semibold">Hygiene Verified</h3>
              <p className="text-sm">
                To proceed, you need to submit your warehouse details on streetfood@gmail.com. Within 24 hours, our team will visit your location for a hygiene and safety inspection. <br />

                If your facility meets our standards, you’ll be approved to sell on our site. If not, unfortunately, you won’t be eligible. <br />

                You must submit your request within 7 days to be considered. <br />
              </p>
            </div>
          </div>
        </div>
      </div>


    </div>


  );
};

export default SupplierDashboard;