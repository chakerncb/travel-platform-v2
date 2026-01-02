"use client";
import { signOut, useSession } from "next-auth/react";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminHeader = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-999 flex w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl shadow-xl">
      <div className="flex flex-grow items-center justify-between px-4 py-4 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-99999 block rounded-lg border border-gray-700 bg-gray-800 p-1.5 shadow-lg transition-all hover:bg-gray-700 lg:hidden"
          >
            <svg
              className="stroke-current text-gray-700 dark:text-gray-300"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 7H21"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M3 12H21"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M3 17H21"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-gray-800/50 px-4 py-2 border border-gray-700">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-sm font-bold text-white">{session?.user?.email?.charAt(0).toUpperCase() || "A"}</span>
              </div>
              <span className="text-sm font-medium text-gray-300">
                {session?.user?.email || "Admin User"}
              </span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-red-500/50 transition-all hover:from-red-700 hover:to-red-800 hover:shadow-red-500/70"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
