import React from "react";
import { styles } from "../styles/style";

const About = () => {
  return (
    <div className="text-black dark:text-white dark:bg-slate-700">
      <br />
      <h1 className={`${styles.title} 800px:!text-[45px]`}>
        What is <span className="text-gradient bg-gradient-to-r from-orange-700 via-orange-400 to-teal-300 text-transparent bg-clip-text">DAcademy?</span>
      </h1>
      
      <br />
      <div className="w-[95%] 800px:w-[85%] m-auto">
        <p className="text-[18px] font-Poppins">
          Welcome to <strong>DAcademy</strong>, the first <strong> <span className="text-gradient bg-gradient-to-r from-red-600 via-red-500 to-green-600 text-transparent bg-clip-text">Moroccan</span></strong> platform  dedicated to mastering all aspects of car diagnostics, automobile subjects, and vehicle technologies. Founded by Amin El Joulali and developed by Abdelmoughith EL AOUMARI, DAcademy aims to provide students with the knowledge and skills they need to excel in the automotive industry.
          <br />
          <br />
          At <strong>DAcademy</strong>, we believe in a comprehensive approach to learning. Our courses are meticulously designed to offer a balanced mix of practical and theoretical education. This unique blend ensures that our students not only understand the technical aspects of car diagnostics but also gain hands-on experience that is crucial in the real world.
          <br />
          <br />
          Our platform covers a wide range of topics including engine diagnostics, electronic systems, vehicle safety, and advanced diagnostic techniques. Each course is crafted by experts in the field and is regularly updated to keep up with the latest advancements in automotive technology.
          <br />
          <br />
          Whether you are a beginner eager to start your journey in car diagnostics or an experienced professional looking to enhance your skills, <strong>DAcademy</strong> has something for everyone. Our goal is to create a supportive and enriching learning environment where students can thrive.
          <br />
          <br />
          Join us at <strong>DAcademy</strong> and become a part of the future of automotive diagnostics. Together, we will drive innovation and excellence in the automotive industry. 🚗
          <br />
          <br />
          <strong>Amin El Joulali</strong> - Founder of DAcademy 🇲🇦
          <br />
          <strong>Abdelmoughith EL AOUMARI</strong> - Developer at DAcademy 🇲🇦
        </p>
        <br />
        <br />
      </div>
    </div>
  );
};

export default About;
