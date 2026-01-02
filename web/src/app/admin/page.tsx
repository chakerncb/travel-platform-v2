"use client";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header with gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome Back! 👋
          </h1>
          <p className="text-blue-100 text-lg">
            Here's what's happening with your platform today.
          </p>
        </div>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {/* Destinations Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-6 shadow-xl transition-all hover:shadow-2xl hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-blue-900/20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
                <span className="text-xs font-medium text-white">+12%</span>
              </div>
            </div>
            <h4 className="text-4xl font-bold text-white mb-2">156</h4>
            <p className="text-blue-100 font-medium">Total Destinations</p>
          </div>
        </div>

        {/* Agencies Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 shadow-xl transition-all hover:shadow-2xl hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 to-emerald-900/20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
                <span className="text-xs font-medium text-white">+8%</span>
              </div>
            </div>
            <h4 className="text-4xl font-bold text-white mb-2">89</h4>
            <p className="text-emerald-100 font-medium">Travel Agencies</p>
          </div>
        </div>

        {/* Bookings Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 p-6 shadow-xl transition-all hover:shadow-2xl hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 to-purple-900/20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
                <span className="text-xs font-medium text-white">+24%</span>
              </div>
            </div>
            <h4 className="text-4xl font-bold text-white mb-2">1,234</h4>
            <p className="text-purple-100 font-medium">Total Bookings</p>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-6 shadow-xl transition-all hover:shadow-2xl hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 to-amber-900/20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
                <span className="text-xs font-medium text-white">+18%</span>
              </div>
            </div>
            <h4 className="text-4xl font-bold text-white mb-2">$45.2K</h4>
            <p className="text-amber-100 font-medium">Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Quick Actions & Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 rounded-xl bg-blue-600 p-4 text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/50">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">Add New Destination</span>
            </button>
            <button className="w-full flex items-center gap-3 rounded-xl bg-emerald-600 p-4 text-white transition-all hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/50">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">Add Travel Agency</span>
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-400"></div>
              <p className="text-sm text-gray-300">New destination added: <span className="text-white font-medium">Paris, France</span></p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-blue-400"></div>
              <p className="text-sm text-gray-300">Agency verified: <span className="text-white font-medium">Adventure Tours</span></p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-purple-400"></div>
              <p className="text-sm text-gray-300">New booking received: <span className="text-white font-medium">Tokyo Package</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
