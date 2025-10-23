import { Link, Outlet } from "react-router-dom";
import { LayoutDashboard, Settings, User, Bell, Plus } from "lucide-react";
import Scrutz from "../assets/Scrutz.svg";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-[] text-gray-800">
      <aside className="w-64 bg-[#F0F4F4] flex flex-col">
        <div className="h-16 flex items-center justify-center bg-[#F0F4F4] ">
          <img src={Scrutz} alt="" />
          <h1 className="text-2xl font-bold text-[#004d40]">Scrutz</h1>
        </div>

        <div className="p-4 space-y-4  bg-[#F0F4F4]">
          <Link
            to="/dashboard/newcampaign"
            className="flex items-center justify-center bg-[#004d40] text-white py-2 rounded-lg hover:bg-[#00695c] transition"
          >
            <Plus size={18} className="mr-2" /> New Campaign
          </Link>
          <nav className="space-y-2">
            <Link
              to="/dashboard/OverView"
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100"
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </Link>
            <Link
              to="/dashboard/campaign"
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100"
            >
              <User size={18} />
              <span>Campaign</span>
            </Link>
            <button className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100">
              <Settings size={18} />
              <span>Market Intelligence</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100">
              <Settings size={18} />
              <span>Account Settings</span>
            </button>
          </nav>
        </div>

        <div className=" p-4 mt-10  text-sm text-gray-500">
          <div className="p-3 bg-[#ffff]  rounded-md text-center">
            <p className="font-medium mb-1">Need help?</p>
            <p className="text-xs">We’re readily available to provide help</p>
            <button className="mt-2 px-3 py-1 text-white bg-[#004d40] rounded-md text-xs">
              Get help
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6">
          <input
            type="text"
            placeholder="Search for anything..."
            className="border rounded-md px-4 py-1.5 w-1/2 text-sm focus:outline-none focus:ring-1 focus:ring-[#004d40]"
          />
          <div className="flex items-center space-x-4">
            <Bell size={20} className="text-gray-600 cursor-pointer" />
            <div className="flex items-center space-x-2">
              <img
                src="https://i.pravatar.cc/40"
                alt="user"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium">BigTech ▾</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
