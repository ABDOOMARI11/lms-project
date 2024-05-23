'use client'
import React, { FC, useState } from "react";
import Protected from "../hooks/useProtected";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Profile from "../components/Profile/Profile";
import { useSelector } from "react-redux";
// import Footer from "../components/Footer";
import avatar from "../../public/assests/avatar.png";

type Props = {};

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(5);
  const [route, setRoute] = useState("Login");
  const {user} = useSelector((state:any) => state.auth);

  return (
    <div className="min-h-screen dark:bg-slate-700">
      <Protected>
      <Heading
        title="DAcademy"
        description="DAcademy is the first moroccan academy to learn and get help from teachers"
        keywords="Diagnostic, Cars, Mercedes, OFPPT"
      />
      <div className="dark:bg-slate-700" >
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />
        </div>
        <div>
        <Profile user={user} avatar={avatar} className="dark:bg-slate-700" />
        </div>
        {/* <Footer /> */}
      </Protected>
    </div>
  );
};

export default Page;
