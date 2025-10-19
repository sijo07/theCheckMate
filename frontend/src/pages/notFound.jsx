import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <h2 className="text-3xl font-semibold mt-4">Page Not Found</h2>
      <p className="text-gray-400 mt-2">
        Oops! The page you are looking for doesn’t exist.
      </p>

      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-red-500 text-white text-lg font-semibold rounded-lg hover:bg-red-700 transition duration-300"
      >
        🔙 Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
