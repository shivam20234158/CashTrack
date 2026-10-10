import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-950 px-4 text-center">
      <h1 className="text-8xl font-bold text-indigo-600">404</h1>
      <h2 className="text-3xl font-semibold mt-4 text-gray-900 dark:text-white">
        Oops! Page Not Found 😕
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-md"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;
