import React, { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import NavItems from "../utils/NavItems";
import ThemeSwitcher from "../utils/ThemeSwitcher";
import { useTheme } from 'next-themes';
import { HiOutlineUserCircle, HiOutlineMenuAlt3 } from "react-icons/hi";
import CustomModal from "../utils/CustomModal";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";
import Verification from "../components/Auth/Verfication";
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { useSession } from 'next-auth/react';
import { useSocialAuthMutation } from '@/redux/features/auth/authApi';
import toast from 'react-hot-toast';
import Loader from './Loader/Loader';
import avatar from "../../public/assests/avatar.png";
import Image from 'next/image';
import { styles } from "../../app/styles/style"

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
}

const Header: FC<Props> = ({ activeItem, setOpen, route, open, setRoute }) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { theme } = useTheme();
  const { data: userData, isLoading, refetch } = useLoadUserQuery(undefined, {});
  const { data } = useSession();
  const [logout, setLogout] = useState(false);
  const [socialAuth, { isSuccess, error }] = useSocialAuthMutation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logoLight, setLogoLight] = useState('/assests/LOGO DA BLACK.png');
  const [logoDark, setLogoDark] = useState('/assests/LOGO DA WHITE.png');
  useEffect(() => {
    if (theme === 'dark') {
      setLogoLight('/assests/LOGO DA BLACK.png');
      setLogoDark('/assests/LOGO DA WHITE.png');
    } else {
      setLogoLight('/assests/LOGO DA BLACK.png');
      setLogoDark('/assests/LOGO DA WHITE.png');
    }

  }, [theme]);

  useEffect(() => {
    if (!isLoading) {
      if (!userData) {
        if (data) {
          socialAuth({
            email: data?.user?.email,
            name: data?.user?.name,
            avatar: data.user?.image,
          });
          console.log(data);
        }
      }
      if (data === null) {
        if (isSuccess) {
          setIsLoggedIn(true);
          toast.success("Login Successfully");
        }
      }
      if (data === null && !isLoading && !userData) {
        setLogout(true);
      }
    }
  }, [data, userData, isLoading]);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setActive(true);
      } else {
        setActive(false);
      }
    });
  }

  const handleMenuClick = () => {
    setOpenSidebar(true);
  };

  const handleClose = () => {
    setOpenSidebar(false);
  };

  return (
    <>

      <div className='w-full relative dark:bg-slate-800'>
        <div className={`${active ? "dark:bg-opacity-50   fixed top-0 left-0 w-full h-[80px] z-[80] border-b  shadow-xl transition duration-500" : "w-full  h-[80px] z-[80] "}`}>
          <div className='w-[95%] 800px:w-[92%] m-auto py-2 h-full'>
            <div className='w-full h-[80px] flex items-center justify-between p-3'>
              <div className="flex items-center">
                <Link href={"/"} className='text-[25px] font-Poppins font-[500] text-black dark:text-white mr-4'>
                  <img src={theme === 'light' ? logoLight : logoDark} alt="DA" className="h-16" />
                </Link>
              </div>
              <div className='flex items-center space-x-4 group'>
                <NavItems
                  activeItem={activeItem}
                  isMobile={false}
                />
                <ThemeSwitcher />
                {userData?.user ? (
                  <div className="flex items-center space-x-2">
                    <p className={`${styles.label}`}>{userData.user.name}</p>
                    <Link href="/profile">
                      <Image
                        src={userData.user.avatar.url ? userData.user.avatar.url : avatar}
                        alt="no photo"
                        width={30}
                        height={30}
                        className="w-[30px] h-[30px] rounded-full cursor-pointer"
                        style={{ border: activeItem === 5 ? "2px solid #37a39a" : "none" }}
                      />
                    </Link>
                  </div>
                ) : (
                  <HiOutlineUserCircle
                    size={25}
                    className="hidden 800px:block cursor-pointer dark:text-white text-black"
                    onClick={() => setOpen(true)}
                  />
                )}


                {/* only for mobile */}

                <div className="800px:hidden">
                  <HiOutlineMenuAlt3
                    size={25}
                    className="cursor-pointer dark:text-white text-black"
                    onClick={handleMenuClick}
                  />
                </div>

              </div>
            </div>
          </div>
          {/* mobile sidebar */}
          {openSidebar && (
            <div
              className='fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#000000024]'
              onClick={handleClose}
              id='screen'
            >
              <div className="w-[70%] fixed z-[9999999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
                <NavItems
                  activeItem={activeItem}
                  isMobile={true} // Pass isMobile as true for mobile sidebar
                />
                <br />
                <br />
                <p className='text-[16px] px-2 pl-5 text-black dark:text-white'>
                  Copyright &copy; 2024 DAcademy
                </p>
              </div>
            </div>
          )}
        </div>
        {route === "Login" && (
          <>
            {open && (
              <CustomModal
                open={open}
                setOpen={setOpen}
                setRoute={setRoute}
                activeItem={activeItem}
                component={Login}
              //   refetch={refetch}
              />
            )}
          </>
        )}
        {route === "Sign-Up" && (
          <>
            {open && (
              <CustomModal
                open={open}
                setOpen={setOpen}
                setRoute={setRoute}
                activeItem={activeItem}
                component={SignUp}
              //   refetch={refetch}
              />
            )}
          </>
        )}
        {route === "Verification" && (
          <>
            {open && (
              <CustomModal
                open={open}
                setOpen={setOpen}
                setRoute={setRoute}
                activeItem={activeItem}
                component={Verification}
              //   refetch={refetch}
              />
            )}
          </>
        )}
      </div>

    </>
  );
};

export default Header;