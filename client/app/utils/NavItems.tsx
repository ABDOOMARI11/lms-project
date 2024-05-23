import { url } from 'inspector';
import Link from 'next/link';
import React from 'react'

type Props = {
    activeItem :number;
    isMobile:boolean;
}
export const navItemsdata = [
    {
        name:"Home",
        url:"/"
    },
    {
        name:"Courses",
        url:"/courses"
    },
    {
        name:"About",
        url:"/about"
    },
    {
        name:"Policy",
        url:"/policy"
    },
    {
        name:"FAQ",
        url:"/faq"
    }
];

const NavItems: React.FC<Props> = ({ activeItem, isMobile }) => {
    return (
      <>
        {/* Desktop view */}
        <div className="hidden 800px:flex">
          {navItemsdata &&
            navItemsdata.map((item, index) => (
              <Link href={`${item.url}`} key={index} passHref>
                <span
                  className={`${
                    activeItem === index
                      ? "text-orange-500" 
                      : "dark:text-white text-black"
                  }
                          text-[19px] px-6 font-Poppins font-[400]`}
                >
                  {item.name}
                </span>
              </Link>
            ))}
        </div>
  
        {/* Mobile view */}
        {isMobile && (
          <div className="880px:hidden mt-5">
                    <div className="flex items-center justify-center mb-10">
                            <Link href={"/"} className='text-[25px] font-Poppins font-[500] text-black dark:text-white mr-4'>
                                DAcademy
                            </Link>
                        </div>
              {navItemsdata &&
                navItemsdata.map((item, index) => (
                  <Link href={item.url} key={index} passHref>
                    <span
                      className={`${
                        activeItem === index
                          ? "text-orange-500 "
                          : "dark:text-white text-black"
                      } text-[19px] px-6 font-Poppins font-[400] block mb-10`} 
                    >
                      {item.name}
                    </span>
                  </Link>
                ))}
            </div>
        )}
      </>
    );
  };
  
  

export default NavItems