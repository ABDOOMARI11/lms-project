"use client"
import React, { FC, useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";
import  Footer from "./components/Footer";
import Courses from "./components/Route/Courses";
import FAQ from "./components/FAQ/FAQ";
import Reviews from "./components/Route/Reviews";

interface Props {}

const Page: FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");

  return (
    <>
    <div className="dark:bg-slate-700">
      
      <Heading
        title="DAcademy"
        description="DAcademy is the first moroccan academy to learn and get help from teachers"
        keywords="Diagnostic, Cars, Mercedes, OFPPT"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <Hero />
      <Courses/>
      <Reviews />

      <FAQ />

      <Footer />
      </div>
    </>
  );
};

export default Page;
