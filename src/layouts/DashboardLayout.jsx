import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar.jsx";
import DashboardSidebar from "../components/layout/DashboardSidebar.jsx";
import { IconMenu } from "../components/common/Icons.jsx";

export default function DashboardLayout({ title, subtitle, sections }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-porcelain">
      <Navbar />
      <div className="mx-auto flex max-w-[1600px]">
        <DashboardSidebar title={title} subtitle={subtitle} sections={sections} open={open} onClose={() => setOpen(false)} />
        <div className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <button onClick={() => setOpen(true)} className="btn-outline mb-4 !py-2 lg:hidden">
            <IconMenu width={16} height={16} /> Menu
          </button>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
