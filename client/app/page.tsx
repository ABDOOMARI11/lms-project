"use client"
import React, { FC } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header"
import { useState } from "react";
import Hero from "./components/Route/Hero"

interface Props { }

const Page: FC<Props> = (propos) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route,setRoute] = useState("Login")
  return (
    <div>
      <Heading
        title="DAcademy"
        description="DAcademy is the first moroccan academy to learn and  get help from teachers"
        keywords="Diagnostic,Cars,Mercedes,OFPPT"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <Hero/>
    </div>
  )
};

export default Page;