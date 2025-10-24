import { Link, Outlet } from "react-router-dom";
import { Settings, Bell, Plus, Menu, X } from "lucide-react";
import { useState } from "react";
import Scrutz from "../assets/Scrutz.svg";
import Speaker from "../assets/Speaker.svg";
import Bulb from "../assets/Bulb.svg";
import Tick from "../assets/Tick.svg";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      <header className="lg:hidden h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="flex items-center space-x-2">
          <img src={Scrutz} alt="Scrutz" className="w-8 h-8" />
          <h1 className="text-xl font-bold text-[#004d40]">Scrutz</h1>
        </div>

        <div className="flex items-center space-x-2">
          <Bell size={20} className="text-gray-600 cursor-pointer" />
          <img
            src="https://i.pravatar.cc/40"
            alt="user"
            className="w-8 h-8 rounded-full"
          />
        </div>
      </header>

      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-green-950 bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-[#F0F4F4] flex flex-col transform transition-transform duration-300 ease-in-out
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        <div className="h-16 flex items-center justify-center bg-[#F0F4F4] lg:flex hidden">
          <img src={Scrutz} alt="Scrutz" />
          <h1 className="text-2xl font-bold text-[#004d40]">Scrutz</h1>
        </div>

        <div className="p-4 space-y-4 bg-[#F0F4F4] flex-1 overflow-y-auto">
          <Link
            to="/dashboard/newcampaign"
            className="flex items-center justify-center bg-[#004d40] text-white py-2 rounded-lg hover:bg-[#00695c] transition"
            onClick={() => setIsSidebarOpen(false)}
          >
            <Plus size={18} className="mr-2" /> New Campaign
          </Link>
          <nav className="space-y-2">
            <Link
              to="/dashboard/OverView"
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsSidebarOpen(false)}
            >
              <img src={Tick} alt="Overview" className="w-5 h-5" />
              <span>Overview</span>
            </Link>
            <Link
              to="/dashboard/campaign"
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsSidebarOpen(false)}
            >
              <img src={Speaker} alt="Campaign" className="w-5 h-5" />
              <span>Campaign</span>
            </Link>
            <button className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 w-full text-left">
              <img src={Bulb} alt="Market Intelligence" className="w-5 h-5" />
              <span>Market Intelligence</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 w-full text-left">
              <Settings size={18} />
              <span>Account Settings</span>
            </button>
          </nav>

          <div className="lg:hidden mt-8 text-sm text-gray-500">
            <div className="p-3 bg-white rounded-md text-center">
              <p className="font-medium mb-1">Need help?</p>
              <p className="text-xs">We're readily available to provide help</p>
              <button className="mt-2 px-3 py-1 text-white bg-[#004d40] rounded-md text-xs">
                Get help
              </button>
            </div>
          </div>
        </div>

        <div className="hidden lg:block p-4 mt-10 text-sm text-gray-500">
          <div className="p-3 bg-white rounded-md text-center">
            <p className="font-medium mb-1">Need help?</p>
            <p className="text-xs">We're readily available to provide help</p>
            <button className="mt-2 px-3 py-1 text-white bg-[#004d40] rounded-md text-xs">
              Get help
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col lg:ml-0">
        <header className="hidden lg:flex h-16 bg-white border-b border-gray-100 items-center justify-between px-6">
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

        <div className="lg:hidden px-4 pt-20 pb-4 bg-white border-b border-gray-100">
          <input
            type="text"
            placeholder="Search for anything..."
            className="border rounded-md px-4 py-2 w-full text-sm focus:outline-none focus:ring-1 focus:ring-[#004d40]"
          />
        </div>

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
