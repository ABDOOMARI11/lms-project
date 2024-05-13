"use client"
import React, { FC, useState, useEffect } from 'react'
import { useFormik } from "formik"
import * as Yup from "yup"
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import { styles } from "../../styles/style"
import { signIn } from 'next-auth/react'
import { useTheme } from 'next-themes';
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import {toast} from 'react-hot-toast'

type Props = {
    setRoute: (route: string) => void;
}
const schema = Yup.object().shape({
    name: Yup.string().required("Please entre your name"),
    email: Yup.string().email("Invalid email").required("Please enter you email"),
    password: Yup.string().required("Please entre your password").min(6),
});
const SignUp: FC<Props> = ({ setRoute }) => {

    const [register,{data,error,isSuccess}] = useRegisterMutation(); 

    useEffect(() => {
        if(isSuccess){
           const message = data?.message || "Registration successful";
           toast.success(message);
           setRoute("Verification");
        }
        if(error){
         if("data" in error){
           const errorData = error as any;
           toast.error(errorData.data.message);
         }
        }
       }, [isSuccess,error]);

    const [show, setShow] = useState(false);
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
        initialValues: { name: "", email: "", password: "" },
        validationSchema: schema,
        onSubmit: async ({ name, email, password }) => {
            const data = {
                name,email,password
              };
              await register(data);
        }

    });

    const { errors, touched, values, handleChange, handleSubmit } = formik;

    return (
        <div className='w-full'>
            <h1 className={`${styles.title} flex items-center justify-center`}>
                join to{' '}
                <img
                    src={theme === 'light' ? logoLight : logoDark}
                    alt="DA"
                    className={`h-16 ${theme === 'light' ? 'ml-2' : 'ml-1'}`}
                />
            </h1>              <form onClick={handleSubmit}>


                <label className={`${styles.label}`} htmlFor="email">
                    Enter your Name
                </label>
                <input
                    type="text"
                    name=""
                    value={values.name}
                    onChange={handleChange}
                    id="name"
                    placeholder="Muhammed Ahmed"
                    className={`${errors.name && touched.name && "border-red-500"} ${styles.input
                        }`}
                />
                {errors.name && touched.name && (
                    <span className="text-red-500 pt-2 block">{errors.name}</span>
                )}
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
                    <input type="submit" value="Sign-Up" className={`${styles.button}`} />
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
                    Already have any account?{" "}
                    <span
                        className="text-[#2190ff] pl-1 cursor-pointer"
                        onClick={() => setRoute("Login")}
                    >
                        Sign in
                    </span>
                </h5>
            </form>
        </div>
    )
}

export default SignUp