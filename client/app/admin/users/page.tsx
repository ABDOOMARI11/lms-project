'use client'
import DashboardHero from '@/app/components/Admin/DashboardHero'
import AdminProtected from '@/app/hooks/adminProtected'
import Heading from '@/app/utils/Heading'
import React from 'react'
import AdminSidebar from "../../components/Admin/sidebar/AdminSidebar";
import AllUsers from "../../components/Admin/Users/AllUsers";

type Props = {}

const page = (props: Props) => {
  return (
    <div>
      <AdminProtected>
      <Heading
        title="DAcademy-Admin"
        description="DAcademy is the first moroccan academy to learn and get help from teachers"
        keywords="Diagnostic, Cars, Mercedes, OFPPT"
      />
        <div className="flex h-screen dark:bg-slate-700">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%] dark:bg-slate-700">
            <DashboardHero />
            <div className='dark:bg-slate-700'>
            <AllUsers />
            </div>
          </div>
        </div>
      </AdminProtected>
    </div>
  )
}

export default page