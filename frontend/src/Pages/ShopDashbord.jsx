import { FaPhone, FaEnvelope, FaStore, FaBox, FaTruck, FaStar, FaChartLine, FaUsers, FaUtensils } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

export default function ShopOwnerDashboard() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shopName, setShopName] = useState("Your Shop");
  const [showNotice, setShowNotice] = useState(false);
  const [hoveredTooltip, setHoveredTooltip] = useState(null); // For tooltip hover

  // Show notice for first time user (only once per browser)
  useEffect(() => {
    if (!localStorage.getItem("shop_notice_shown")) {
      setShowNotice(true);
      localStorage.setItem("shop_notice_shown", "1");
    }
  }, []);

  // Fetch shop name from backend (not localStorage)
  useEffect(() => {
    fetch("http://localhost:5000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setShopName(data.shopName || "Your Shop");
      })
      .catch(() => setShopName("Your Shop"));
  }, []);

  useEffect(() => {
    // Fetch all suppliers with their items from backend
    fetch("http://localhost:5000/api/suppliers")
      .then(res => res.json())
      .then(data => {
        setSuppliers(data.suppliers || []);
        setLoading(false);
        toast.success(`Welcome back! Found ${data.suppliers?.length || 0} vendors`);
      })
      .catch(err => {
        setLoading(false);
        toast.error('Failed to load vendors');
      });
  }, []);

  // Random phone generator
  const getRandomPhone = () => {
    // Indian mobile number format
    const start = ["9", "8", "7", "6"][Math.floor(Math.random() * 4)];
    let num = start;
    for (let i = 0; i < 9; i++) num += Math.floor(Math.random() * 10);
    return num;
  };

  // Copy to clipboard and toast
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied: ${text}`);
  };

  // Notice content
  const notice = (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border-2 border-orange-200 text-center animate-fade-in">
        <div className="flex justify-center mb-4">
          <FaStar className="text-yellow-400 text-4xl drop-shadow" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-orange-700">Verified Seller Notice</h2>
        <p className="text-gray-700 mb-4">
          Jo <b>Verified Seller</b> hain, unke warehouse ko humari team ne personally jakar check kiya hai. Sab kuch hygienic aur safe paya gaya hai.<br />
          Ab aap bina hygiene ki chinta ke inse confidently buy kar sakte hain!
        </p>
        <button
          className="mt-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold shadow-lg hover:scale-105 transition"
          onClick={() => setShowNotice(false)}
        >
          Got it!
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto"></div>
          <p className="text-xl font-semibold text-gray-700 animate-pulse">Loading delicious vendors...</p>
        </div>
      </div>
    );
  }

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
          },
        }}
      />

      {/* First time notice */}
      {showNotice && notice}

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                <FaUtensils className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {shopName}
                </h1>
                <p className="text-sm text-gray-600">Food Vendor Management</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Vendors"
            value={suppliers.length}
            change="+12% from last month"
            icon={<FaStore />}
            gradient="from-blue-500 to-cyan-500"
            delay="0"
          />
          <StatsCard
            title="Active Orders"
            value="24"
            change="+5% from last month"
            icon={<FaBox />}
            gradient="from-green-500 to-emerald-500"
            delay="100"
          />
          <StatsCard
            title="Available Items"
            value={suppliers.reduce((acc, s) => acc + (s.items?.length || 0), 0)}
            change="+8% from last month"
            icon={<FaUtensils />}
            gradient="from-orange-500 to-yellow-500"
            delay="200"
          />
          <StatsCard
            title="Avg Delivery"
            value="2.5 days"
            change="-2h from last month"
            icon={<FaTruck />}
            gradient="from-purple-500 to-pink-500"
            delay="300"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <button
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-2xl font-medium shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            onClick={() => toast.success('Vendors view selected')}
          >
            <FaUsers />
            <span>Vendors</span>
          </button>
          <button
            className="bg-white/70 backdrop-blur-sm border border-orange-200 text-gray-700 px-8 py-3 rounded-2xl font-medium shadow-sm hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            onClick={() => toast.success('Items view selected')}
          >
            <FaBox />
            <span>Items</span>
          </button>
        </div>

        {/* Vendor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {suppliers.map((supplier, index) => (
            <div
              key={supplier._id}
              className="group bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-orange-100 animate-fade-in"
              style={{ animationDelay: `${500 + index * 100}ms` }}
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full transform -translate-x-12 translate-y-12"></div>

                <div className="relative z-10 flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{supplier.name}</h3>
                    <p className="text-orange-100 flex items-center space-x-2">
                      {/* Verified hover notice */}
                      <span
                        className="relative"
                        onMouseEnter={() => setHoveredTooltip(index)}
                        onMouseLeave={() => setHoveredTooltip(null)}
                      >
                        <FaStar className="text-yellow-300 text-lg cursor-pointer" />
                        {hoveredTooltip === index && (
                          <span
                            className="absolute left-8 top-0 z-50 w-72 bg-white border border-orange-200 rounded-xl shadow-lg px-4 py-3 text-sm text-gray-700"
                          >
                            Jo <b>Verified Seller</b> hain, unke warehouse ko humari team ne personally jakar check kiya hai. Sab kuch hygienic aur safe paya gaya hai.<br />
                            Ab aap bina hygiene ki chinta ke inse confidently buy kar sakte hain!
                          </span>
                        )}
                      </span>
                      <FaEnvelope className="text-sm cursor-pointer" onClick={() => handleCopy(getRandomPhone())} />
                      <span className="text-sm cursor-pointer" onClick={() => handleCopy(getRandomPhone())}>
                        {supplier.email}
                      </span>
                    </p>
                  </div>
                  <div className="bg-green-400 text-green-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    <div className="flex items-center space-x-1">
                      <FaStar className="text-xs" />
                      <span>Verified</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 p-2 rounded-xl">
                      <FaBox className="text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Items</p>
                      <p className="text-xl font-bold text-gray-800">{supplier.items?.length || 0}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-green-600">
                      <FaChartLine className="text-sm" />
                      <span className="text-sm font-medium">+15% this week</span>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Categories:</p>
                  <div className="flex flex-wrap gap-2">
                    {supplier.items?.slice(0, 3).map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {item.category}
                      </span>
                    )) || <span className="text-gray-500 text-sm">No categories</span>}
                    {supplier.items?.length > 3 && (
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                        +{supplier.items.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-orange-100">
                  <button
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-2xl font-medium shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 flex-grow mr-3"
                    onClick={() => {
                      navigate(`/vendor/${supplier._id}`);
                      toast.success(`Opening ${supplier.name} vendor page`);
                    }}
                  >
                    <FaStore />
                    <span>View Items</span>
                  </button>

                  <div className="flex space-x-2">
                    <button
                      className="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 p-3 rounded-2xl text-white shadow-lg transform hover:scale-110 transition-all duration-200"
                      onClick={() => handleCopy(getRandomPhone())}
                    >
                      <FaPhone />
                    </button>
                    <button
                      className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 p-3 rounded-2xl text-white shadow-lg transform hover:scale-110 transition-all duration-200"
                      onClick={() => handleCopy(getRandomPhone())}
                    >
                      <FaEnvelope />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {suppliers.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <FaStore className="text-white text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Vendors Found</h3>
            <p className="text-gray-600 mb-6">Start by adding your first food vendor to the platform</p>
            <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-2xl font-medium shadow-lg transform hover:scale-105 transition-all duration-200">
              Add Vendor
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatsCard({ title, value, change, icon, gradient, delay }) {
  return (
    <div
      className={`bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-orange-100 animate-fade-in group cursor-pointer`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`bg-gradient-to-r ${gradient} p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200`}>
            <div className="text-white text-xl">
              {icon}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-800 group-hover:scale-105 transition-transform duration-200">
              {value}
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className="flex items-center space-x-1">
            <FaChartLine className="text-green-500 text-xs" />
            <span className="text-xs font-medium text-green-600">{change}</span>
          </div>
        </div>
      </div>
    </div>
  );
}