"use client";
import React, { useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import About from "./About";
import Footer from "../components/Footer";

type Props = {};

const Page = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(2);
  const [route, setRoute] = useState("Login");

  return (
    <div className="dark:bg-slate-700">
      <Heading
        title="About us - DAcademy"
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
      <About />
      <br />
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default Page;
