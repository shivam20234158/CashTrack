import { useEffect, useState } from "react";
import { getProfile } from "../services/auth.service.js";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getProfile();
        setUser(data);
      } catch (error) {
        console.error("Profile load error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Recently";

  const badges = [
    {
      icon: "✓",
      label: "Verified Account",
      color: "text-indigo-500",
      bg: "bg-indigo-50 dark:bg-indigo-900/30",
    },
    {
      icon: "🔒",
      label: "Redis Blacklist Protected",
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-900/30",
    },
    {
      icon: "📊",
      label: "Smart Budgeting",
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-900/30",
    },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profile
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Your account information & session security
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        {/* Top banner */}
        <div className="h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Avatar + name */}
        <div className="px-6 pb-6">
          <div className="-mt-12 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-3xl text-white font-bold shadow-lg border-4 border-white dark:border-gray-800">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {user.name}
          </h2>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-0.5">
            {user.email}
          </p>

          <span className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Active Session
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 dark:border-gray-700" />

        {/* Info rows */}
        <div className="px-6 py-5 space-y-4">
          {[
            { label: "Full Name", value: user.name },
            { label: "Email Address", value: user.email },
            { label: "Member Since", value: memberSince },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {label}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="grid grid-cols-3 gap-4">
        {badges.map(({ icon, label, color, bg }) => (
          <div
            key={label}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 text-center shadow-sm hover:shadow-md transition-all"
          >
            <div
              className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center text-2xl mx-auto mb-3`}
            >
              {icon}
            </div>
            <p className={`text-xs font-semibold ${color}`}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
