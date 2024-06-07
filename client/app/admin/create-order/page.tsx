'use client'
import React from 'react'
import AdminSidebar from "../../components/Admin/sidebar/AdminSidebar";
import Heading from '../../utils/Heading';
import CreateCourse from "../../components/Admin/Course/CreateCourse";
import DashboardHeader from '../../components/Admin/DashboardHeader';
import CreateOrder from '@/app/components/Admin/Order/CreateOrder ';

type Props = {}

const page = (props: Props) => {
  return (
    <div>
       <Heading
        title="DAcademy-Admin"
        description="DAcademy is the first moroccan academy to learn and get help from teachers"
        keywords="Diagnostic, Cars, Mercedes, OFPPT"
      />
        <div className="flex">
            <div className="1500px:w-[16%] w-1/5">
                <AdminSidebar />
            </div>
            <div className="w-[85%]">
               <DashboardHeader />
               <br />
               <br />
               <CreateOrder /> 
            </div>
        </div>
    </div>
  )
}

export default page