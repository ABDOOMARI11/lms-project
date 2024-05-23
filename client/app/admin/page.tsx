"use client";
import React from "react";
import Heading from "../utils/Heading";
import AdminSidebar from "../components/Admin/sidebar/AdminSidebar";
import AdminProtected from "../hooks/adminProtected";
import DashboardHero from "../components/Admin/DashboardHero";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <AdminProtected>
        <Heading
        title="DAcademy -Admin"
        description="DAcademy is the first moroccan academy to learn and get help from teachers"
        keywords="Diagnostic, Cars, Mercedes, OFPPT"
      />
        <div className="flex min-h-screen dark:bg-slate-700">
          <div className="1500px:w-[16%] w-1/5 dark:bg-slate-700">
            <AdminSidebar />
          </div>
          <div className="w-[85%] dark:bg-slate-700">
            <DashboardHero isDashboard={true} />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;
