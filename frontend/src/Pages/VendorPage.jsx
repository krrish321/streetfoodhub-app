import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { FaShoppingCart, FaPlus, FaMinus, FaTrash, FaArrowLeft, FaStore, FaRupeeSign, FaHeart, FaStar, FaLeaf, FaFire } from 'react-icons/fa';

const VendorPage = () => {
  const { id } = useParams(); // id = supplierId
  const [items, setItems] = useState([]);
  const [vendorName, setVendorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/suppliers/${id}`)
      .then(res => res.json())
      .then(data => {
        setItems(data.items || []);
        setVendorName(data.name || "Vendor");
        setLoading(false);
        toast.success(`Welcome to ${data.name || "Vendor"}!`);
      })
      .catch(() => {
        setLoading(false);
        toast.error('Failed to load vendor items');
      });
  }, [id]);

  const addToCart = (item) => {
    setCart((prev) => {
      const found = prev.find((i) => i._id === item._id);
      if (found) {
        toast.success(`Added another ${item.name} to cart!`);
        return prev.map((i) =>
          i._id === item._id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      toast.success(`${item.name} added to cart!`);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => {
      const item = prev.find(i => i._id === itemId);
      if (item && item.qty > 1) {
        toast(`Removed one ${item.name}`, { icon: '➖' });
        return prev.map((i) =>
          i._id === itemId ? { ...i, qty: i.qty - 1 } : i
        );
      } else {
        toast.error(`${item?.name} removed from cart`);
        return prev.filter((i) => i._id !== itemId);
      }
    });
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.qty), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.qty, 0);
  };

  // Place order and send to backend
  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty!");
      return;
    }
    try {
      // Place one order per item (as per your backend)
      for (const cartItem of cart) {
        const res = await fetch(`http://localhost:5000/api/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId: cartItem._id })
        });
        if (!res.ok) {
          toast.error(`Failed to place order for ${cartItem.name}`);
          return;
        }
      }
      toast.success('Order placed successfully! 🎉');
      setCart([]);
    } catch (err) {
      toast.error('Server error!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-orange-500 border-t-transparent mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaStore className="text-orange-500 text-2xl animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800 animate-pulse">Loading Menu...</h2>
            <p className="text-gray-600">Preparing delicious items for you</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 2000,
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
      <div className="bg-white/80 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 p-3 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all duration-200"
                onClick={() => window.history.back()}
              >
                <FaArrowLeft />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {vendorName}
                </h1>
                <p className="text-sm text-gray-600 flex items-center space-x-2">
                  <FaStore className="text-xs" />
                  <span>Fresh & Delicious Menu</span>
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 p-3 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer">
                <FaShoppingCart className="text-xl" />
                {getTotalItems() > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-bounce">
                    {getTotalItems()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Items List */}
        <div className="flex-1">
          <div className="mb-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Our Delicious Menu</h2>
            <p className="text-gray-600">Fresh ingredients, authentic flavors</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.length > 0 ? (
              items.map((item, index) => (
                <div
                  key={item._id || index}
                  className="group bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-orange-100 animate-fade-in"
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  {/* Item Image Placeholder */}
                  <div className="bg-gradient-to-br from-orange-400 to-red-500 h-48 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <FaHeart className="text-white hover:text-red-300 cursor-pointer transition-colors duration-200" />
                    </div>
                    <div className="absolute bottom-4 left-4 space-y-1">
                      <div className="flex items-center space-x-1 text-white">
                        <FaStar className="text-yellow-300" />
                        <span className="text-sm font-medium">4.5</span>
                      </div>
                      <div className="flex space-x-2">
                        <span className="bg-green-400 text-green-900 px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                          <FaLeaf className="text-xs" />
                          <span>Fresh</span>
                        </span>
                        <span className="bg-red-400 text-red-900 px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                          <FaFire className="text-xs" />
                          <span>Spicy</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors duration-200">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.unit || item.category || "Premium Quality"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <FaRupeeSign className="text-green-600" />
                        <span className="text-2xl font-bold text-green-600">{item.price}</span>
                      </div>
                      
                      <button
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-2xl font-medium shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                        onClick={() => addToCart(item)}
                      >
                        <FaPlus />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-16 animate-fade-in">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <FaStore className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Items Available</h3>
                <p className="text-gray-600">This vendor hasn't added any items yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Cart Panel */}
        <div className="w-full max-w-sm">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-orange-100 sticky top-24 animate-fade-in" style={{animationDelay: '200ms'}}>
            {/* Cart Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-t-3xl text-white">
              <h2 className="text-2xl font-bold flex items-center space-x-3">
                <FaShoppingCart />
                <span>Your Cart</span>
              </h2>
              <p className="text-orange-100 text-sm mt-1">
                {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in cart
              </p>
            </div>

            {/* Cart Content */}
            <div className="p-6">
              {cart.length === 0 ? (
                <div className="text-center py-8 space-y-4">
                  <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
                    <FaShoppingCart className="text-gray-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Cart is empty</h3>
                    <p className="text-sm text-gray-600">Add some delicious items!</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item._id} className="bg-gray-50 rounded-2xl p-4 space-y-3 hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{item.name}</h4>
                          <p className="text-sm text-gray-600">₹{item.price} each</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-all duration-200"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-xl transition-colors duration-200"
                          >
                            <FaMinus className="text-sm" />
                          </button>
                          <span className="font-bold text-lg text-gray-800 min-w-[2rem] text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-green-100 hover:bg-green-200 text-green-600 p-2 rounded-xl transition-colors duration-200"
                          >
                            <FaPlus className="text-sm" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-800">₹{item.price * item.qty}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Cart Total */}
                  <div className="border-t border-gray-200 pt-4 mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-gray-800">Total:</span>
                      <span className="text-2xl font-bold text-green-600">₹{getTotalPrice()}</span>
                    </div>
                    
                    <button 
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                      onClick={handlePlaceOrder}
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorPage;