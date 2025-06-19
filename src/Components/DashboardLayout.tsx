// import React from 'react'
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import SideBar from "./DashboardPages/SideBar";
import TopBar from "./DashboardPages/TopBar";

export default function DashboardLayout() {
  const { user } = useSelector((state: RootState) => state?.auth);
  // console.log(user);
  const navigate = useNavigate();
  useEffect(() => {
    if (user == null) {
      navigate("/");
    }
  }, []);
  return (
    <div className="flex flex-row max-w-screen min-h-screen h-screen max-h-screen px-4 overflow-scroll bg-zinc-200">
      <div>
        <SideBar />
      
      </div>
      <main className="flex-1 py-4">
        <TopBar />
        <Outlet />
      </main>
    </div>
  );
}
