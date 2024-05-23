"use client"
import React, { FC, useState,useEffect } from 'react'
import { useFormik } from "formik"
import * as Yup from "yup"
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import { styles } from "../../styles/style"
import { signIn } from 'next-auth/react'
import { useTheme } from 'next-themes';
import { useLoginMutation } from '@/redux/features/auth/authApi'
import toast from 'react-hot-toast'
type Props = {
    setRoute: (route: string) => void;
    setOpen: (open: boolean) => void;
    refetch: () => void;
}

const schema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Please enter you email"),
    password: Yup.string().required("Please entre your password").min(6),
});
const Login: FC<Props> = ({ setRoute,setOpen,refetch }) => {

    
    const [show, setShow] = useState(false);
    const [login, { isSuccess, error }] = useLoginMutation();

    const { theme } = useTheme();
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

    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: schema,
        onSubmit: async ({ email, password }) => {
            await login({ email, password });
        }

    });
    useEffect(() => {
        if (isSuccess) {
            toast.success("Login Successfully!");
            setOpen(false);
            window.location.reload();
        }
        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData.data.message);
            }
        }
    }, [isSuccess, error]);
    
    
    const { errors, touched, values, handleChange, handleSubmit } = formik;

    return (
        <div className='w-full dark:bg-slate-700'>
    <h1 className={`${styles.title} flex items-center justify-center  dark:bg-slate-700`}>
        login with{' '}
        <img
          src={theme === 'light' ? logoLight : logoDark}
          alt="DA"
          className={`h-16 ${theme === 'light' ? 'ml-2' : 'ml-1'}`}
        />
      </h1>            <form onClick={handleSubmit}>
                <label
                    className={`${styles.label}`}
                    htmlFor='email'>
                    Enter your Email
                </label>
                <input
                    type="email"
                    name=''
                    value={values.email}
                    onChange={handleChange}
                    id='email'
                    placeholder='loginmail@gmail.com'
                    className={`${errors.email && touched.email} ${styles.input}`} />
                {errors.email && touched.email && (
                    <span className='text-red-500 pt-2 block'> {errors.email}</span>
                )}
                <div className="w-full mt-5 relative mb-1">
                    <label className={`${styles.label}`} htmlFor="email">
                        Enter your password
                    </label>
                    <input
                        type={!show ? "password" : "text"}
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        id="password"
                        placeholder="password!@%"
                        className={`${errors.password && touched.password && "border-red-500"
                            } ${styles.input}`}
                    />
                    {!show ? (
                        <AiOutlineEyeInvisible
                            className="absolute bottom-3 right-2 z-1 cursor-pointer"
                            size={20}
                            onClick={() => setShow(true)}
                        />
                    ) : (
                        <AiOutlineEye
                            className="absolute bottom-3 right-2 z-1 cursor-pointer"
                            size={20}
                            onClick={() => setShow(false)}
                        />
                    )}
                    {errors.password && touched.password && (
                        <span className="text-red-500 pt-2 block">{errors.password}</span>
                    )}
                </div>
                <div className="w-full mt-5">
                    <input type="submit" value="Login" className={`${styles.button}`} />
                </div>
                <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
                    Or join with
                </h5>
                <div className="flex items-center justify-center my-3">
          <FcGoogle
            size={30}
            className={`cursor-pointer mr-2 ${theme === 'light' ? 'text-black' : 'text-white'}`}
            onClick={() => signIn('google')}
          />
          <AiFillGithub
            size={30}
            className={`cursor-pointer ml-2 ${theme === 'light' ? 'text-black' : 'text-white'}`}
            onClick={() => signIn('github')}
          />
        </div>
                <h5 className="text-center pt-4 font-Poppins text-[14px]  text-black dark:text-white">
                    Not have any account?{" "}
                    <span
                        className="text-[#2190ff] pl-1 cursor-pointer"
                        onClick={() => setRoute("Sign-Up")}
                    >
                        Sign up
                    </span>
                </h5>
            </form>
        </div>
    )
}

export default Login