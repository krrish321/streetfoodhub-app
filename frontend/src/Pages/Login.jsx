import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"

const Login = () => {
  const [userType, setUserType] = useState("vendor");
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const apiUrl = "http://localhost:5000/api/auth";
    try {
      if (isSignup) {
        // Registration
        const res = await fetch(`${apiUrl}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userType,
            email,
            password,
            shopName: userType === "owner" ? shopName : undefined,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          alert("Registration successful! Please login.");
          setIsSignup(false);
          setEmail("");
          setPassword("");
          setShopName("");
        } else {
          alert(data.message || "Registration failed");
        }
      } else {
        // Login
        const res = await fetch(`${apiUrl}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userType,
            email,
            password,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          
          // Navigate according to userType
          if (userType === "owner") {
            navigate("/shop");
            toast.success("Login successful as Shop Owner!");
          } else if (userType === "vendor") {
            navigate("/supplier");
            toast.success("Login successful as Vendor!");
          } else {
            alert("Unknown user type");
          }
        } else {
          alert(data.message || "Login failed");
        }
      }
    } catch (err) {
      alert("Server error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-300 to-orange-500 flex items-center justify-center p-10 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-10 space-y-4 text-center">
        <div className="text-4xl">🍴</div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
          Street Food Hub
        </h1>
        <p className="text-sm text-gray-500">
          Join the most delicious street food community!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="font-semibold">Choose your role</label>
            <div className="mt-2 space-y-2">
              <div
                className={`flex items-center p-3 rounded-lg border cursor-pointer ${
                  userType === "vendor" ? "border-orange-400 bg-orange-50" : "border-gray-200"
                }`}
                onClick={() => setUserType("vendor")}
              >
                <input
                  type="radio"
                  checked={userType === "vendor"}
                  onChange={() => setUserType("vendor")}
                  className="mr-3"
                />
                <div>
                  <div className="font-semibold">Street Food Vendor</div>
                  <div className="text-sm text-gray-500">Sell your delicious street food</div>
                </div>
              </div>
              <div
                className={`flex items-center p-3 rounded-lg border cursor-pointer ${
                  userType === "owner" ? "border-orange-400 bg-orange-50" : "border-gray-200"
                }`}
                onClick={() => setUserType("owner")}
              >
                <input
                  type="radio"
                  checked={userType === "owner"}
                  onChange={() => setUserType("owner")}
                  className="mr-3"
                />
                <div>
                  <div className="font-semibold">Shop Owner</div>
                  <div className="text-sm text-gray-500">Manage your street food business</div>
                </div>
              </div>
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 focus:outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Shop Name Field for Signup only */}
          {isSignup && (
            <div>
              <label className="block mb-1">Shop Name</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 focus:outline-none"
                placeholder="Enter your shop name"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                required
              />
            </div>
          )}

          {/* Password Field */}
          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2 focus:outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded font-semibold hover:from-orange-400 hover:to-red-400 transition"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isSignup
              ? `Sign up as ${userType === "vendor" ? "Vendor" : "Shop Owner"}`
              : `Login as ${userType === "vendor" ? "Vendor" : "Shop Owner"}`}
          </button>
        </form>

        {/* Switch to Signup/Login */}
        <div className="text-sm text-gray-500 text-center">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsSignup(false)}
                className="text-orange-500 font-semibold hover:underline"
              >
                Login here
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setIsSignup(true)}
                className="text-orange-500 font-semibold hover:underline"
              >
                Sign up here
              </button>
            </>
          )}
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="text-sm text-gray-500 hover:text-black transition"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default Login;