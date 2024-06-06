import { styles } from "@/app/styles/style";
import Image from "next/image";
import React from "react";
import ReviewCard from "../Review/ReviewCard";

type Props = {};

export const reviews = [
  {
    name: "Aksel Jensen",
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
    profession: "Automotive Engineering Student | Lisbon,Portugal",
    comment:
      "I had the pleasure of exploring DAcademy, a website that provides an extensive range of courses on various automotive diagnostics and electrical systems. I was thoroughly impressed with my experience, as the website offers a comprehensive selection of courses that cater to different skill levels and interests. If you're looking to enhance your knowledge and skills in automotive technology, I highly recommend checking out DAcademy!",
  },
  {
    name: "Saber Ahmed",
    avatar: "https://randomuser.me/api/portraits/men/25.jpg",
    profession: "Automotive Technician | Sfax,Tunisia",
    comment:
      "Thanks for your amazing automotive systems tutorial channel! Your teaching style is outstanding, and the quality of your tutorials is top-notch. Your ability to break down complex topics into manageable parts, and cover diverse automotive systems and diagnostics topics is truly impressive. The practical applications and real-world examples you incorporate reinforce the theoretical knowledge and provide valuable insights. Your engagement with the audience fosters a supportive learning environment. Thank you for your dedication, expertise, and passion for teaching automotive technology, and keep up the fantastic work!",
  },
  {
    name: "Amina Abdelrahman",
    avatar: "https://randomuser.me/api/portraits/women/18.jpg",
    profession: "Electrical Systems Engineering Student | Alexandria,Egypt",
    comment:
      "Thanks for your amazing automotive systems tutorial channel! Your teaching style is outstanding, and the quality of your tutorials is top-notch. Your ability to break down complex topics into manageable parts, and cover diverse automotive systems and diagnostics topics is truly impressive. The practical applications and real-world examples you incorporate reinforce the theoretical knowledge and provide valuable insights. Your engagement with the audience fosters a supportive learning environment. Thank you for your dedication, expertise, and passion for teaching automotive technology, and keep up the fantastic work!",
  },
  {
    name: "Mina Long Lakhder",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    profession: "Junior Automotive Technician | Indonesia",
    comment:
      "I had the pleasure of exploring DAcademy, a website that provides an extensive range of courses on various automotive diagnostics and electrical systems. I was thoroughly impressed with my experience.",
  },
  {
    name: "Abbadi Ahmed",
    avatar: "https://randomuser.me/api/portraits/men/86.jpg",
    profession: "Automotive Electrical Engineer | Marrakech",
    comment:
      "Your content is very special. The thing I liked the most is that the videos are so detailed, covering everything extensively. This means that any beginner-level person can complete an integrated project after watching the videos. Thank you very much. I'm very excited for the next videos. Keep doing this amazing work.",
  },
  {
    name: "Xxalaina laurenski",
    avatar: "https://randomuser.me/api/portraits/women/86.jpg",
    profession: "Senior Automotive Technician | Montenegro",
    comment:
      "Join DAcademy! DAcademy focuses on practical applications rather than just teaching the theory behind automotive systems or diagnostics. I took a lesson on creating a web marketplace using React JS, and it was very helpful in teaching me the different stages involved in creating a project from start to finish. Overall, I highly recommend DAcademy to anyone looking to improve their automotive technology skills and build practical projects. DAcademy is a great resource that will help you take your skills to the next level.",
  },
];

const Reviews = (props: Props) => {
  return (
  <div className="w-[90%] 800px:w-[85%] m-auto">
      <div className="w-full 800px:flex items-center">
      <div className="800px:w-[50%] w-full">
        <Image
        src={require("../../../public/assests/reviews.png")}
        alt="business"
        width={700}
        height={700}
        />
        </div>
        <div className="800px:w-[50%] w-full">
          <h3 className={`${styles.title} 800px:!text-[40px]`}>
             <span className="text-gradient text-gradient bg-gradient-to-r from-orange-700 via-orange-400 to-orange-200  text-transparent bg-clip-text"> Our Students Are Our Strength</span>{" "}
        
          </h3>
          <br />
  
        </div>
        <br />
        <br />
       </div>
       <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-2 xl:gap-[35px] mb-12 border-0 md:[&>*:nth-child(3)]:!mt-[-60px] md:[&>*:nth-child(6)]:!mt-[-20px]">
        {reviews &&
            reviews.map((i, index) => <ReviewCard item={i} key={index} />)}
        </div>
  </div>
  );
};

export default Reviews;
