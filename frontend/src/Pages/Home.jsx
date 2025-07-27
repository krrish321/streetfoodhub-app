import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-yellow-200 to-orange-100 p-6">
      <div className="text-center space-y-6">
        <div className="text-6xl">🍴</div>
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text">
          Street Food Hub
        </h1>
        <p className="text-lg text-gray-600">
          Discover the best street food in your city!
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:from-orange-400 hover:to-red-400 transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
