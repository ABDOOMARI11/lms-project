import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Ratings from "@/app/utils/Ratings";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoCheckmarkDoneOutline, IoCloseOutline } from "react-icons/io5";
import { format } from "timeago.js";
import CourseContentList from "../Course/CourseContentList";
import { Elements } from "@stripe/react-stripe-js";
import CheckOutForm from "../Payment/CheckOutForm";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Image from "next/image";
import { VscVerifiedFilled } from "react-icons/vsc";
import { FaCreditCard, FaMoneyBill } from 'react-icons/fa';
type Props = {
  data: any;
  stripePromise: any;
  clientSecret: string;
  setRoute: any;
  setOpen: any;

};

const CourseDetails = ({
  data,
  stripePromise,
  clientSecret,
  setRoute,
  setOpen: openAuthModal,
}: Props) => {
  const { data: userData, refetch } = useLoadUserQuery(undefined, {});
  const [user, setUser] = useState<any>();
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'bank' | null>(null);

  useEffect(() => {
    setUser(userData?.user);
  }, [userData]);

  const discountPercentage = ((data?.estimatedPrice - data?.price) / data?.estimatedPrice) * 100;
  const discountPercentagePrice = discountPercentage.toFixed(0);

  const isPurchased = user && user?.courses?.find((item: any) => item._id === data._id);

  const handleOrder = (e: any) => {
    if (user) {
      setOpen(true);
    } else {
      setRoute("Login");
      openAuthModal(true);
    }
  };

  return (
    <div className="w-[90%] 800px:w-[90%] m-auto py-5">
      <div className="w-full flex flex-col-reverse 800px:flex-row">
        <div className="w-full 800px:w-[65%] 800px:pr-5">
          <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
            {data?.name}
          </h1>
          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center">
              <Ratings rating={data?.ratings} />
              <h5 className="text-black dark:text-white">
                {data?.reviews?.length} Reviews
              </h5>
            </div>
            <h5 className="text-black dark:text-white">
              {data?.purchased} Students
            </h5>
          </div>
          <br />
          <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
            What you will learn from this course?
          </h1>
          <div>
            {data?.benefits?.map((item: any, index: number) => (
              <div className="w-full flex 800px:items-center py-2" key={index}>
                <div className="w-[15px] mr-1">
                  <IoCheckmarkDoneOutline size={20} className="text-black dark:text-white" />
                </div>
                <p className="pl-2 text-black dark:text-white">{item?.title}</p>
              </div>
            ))}
            <br />
            <br />
          </div>
          <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
            What are the prerequisites for starting this course?
          </h1>
          {data?.prerequisites?.map((item: any, index: number) => (
            <div className="w-full flex 800px:items-center py-2" key={index}>
              <div className="w-[15px] mr-1">
                <IoCheckmarkDoneOutline size={20} className="text-black dark:text-white" />
              </div>
              <p className="pl-2 text-black dark:text-white">{item?.title}</p>
            </div>
          ))}
          <br />
          <br />
          <div>
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              Course Overview
            </h1>
            <CourseContentList data={data?.courseData} isDemo={true} />
          </div>
          <br />
          <br />
          {/* Course description */}
          <div className="w-full">
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              Course Details
            </h1>
            <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden text-black dark:text-white">
              {data?.description}
            </p>
          </div>
          <br />
          <br />
          <div className="w-full">
            <div className="800px:flex items-center">
              <Ratings rating={data?.ratings} />
              <div className="mb-2 800px:mb-[unset]" />
              <h5 className="text-[25px] font-Poppins text-black dark:text-white">
                {Number.isInteger(data?.ratings)
                  ? data?.ratings.toFixed(1)
                  : data?.ratings.toFixed(2)}{" "}
                Course Rating • {data?.reviews?.length} Reviews
              </h5>
            </div>
            <br />
            {/* Displaying reviews */}
            {(data?.reviews && [...data?.reviews].reverse())?.map(
              (item: any, index: number) => (
                <div className="w-full pb-4" key={index}>
                  <div className="flex">
                    <div className="w-[50px] h-[50px]">
                      <Image
                        src={
                          item.user.avatar
                            ? item.user.avatar.url
                            : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                        }
                        width={50}
                        height={50}
                        alt=""
                        className="w-[50px] h-[50px] rounded-full object-cover"
                      />
                    </div>
                    <div className="hidden 800px:block pl-2">
                      <div className="flex items-center">
                        <h5 className="text-[18px] pr-2 text-black dark:text-white">
                          {item.user.name}
                        </h5>
                        <Ratings rating={item.rating} />
                      </div>
                      <p className="text-black dark:text-white">{item.comment}</p>
                      <small className="text-[#000000d1] dark:text-[#ffffff83]">
                        {format(item.createdAt)} •
                      </small>
                    </div>
                    <div className="pl-2 flex 800px:hidden items-center">
                      <h5 className="text-[18px] pr-2 text-black dark:text-white">
                        {item.user.name}
                      </h5>
                      <Ratings rating={item.rating} />
                    </div>
                  </div>
                  {item.commentReplies.map((i: any, index: number) => (
                    <div className="w-full flex 800px:ml-16 my-5" key={index}>
                      <div className="w-[50px] h-[50px]">
                        <Image
                          src={
                            i.user.avatar
                              ? i.user.avatar.url
                              : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                          }
                          width={50}
                          height={50}
                          alt=""
                          className="w-[50px] h-[50px] rounded-full object-cover"
                        />
                      </div>
                      <div className="pl-2">
                        <div className="flex items-center">
                          <h5 className="text-[20px]">{i.user.name}</h5>{" "}
                          <VscVerifiedFilled className="text-[#0095F6] ml-2 text-[20px]" />
                        </div>
                        <p>{i.comment}</p>
                        <small className="text-[#ffffff83]">
                          {format(i.createdAt)} •
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
        <div className="w-full 800px:w-[35%] relative">
          <div className="sticky top-[100px] left-0 z-50 w-full">
            <CoursePlayer videoUrl={data?.demoUrl} />
            <div className="flex items-center">
              <h1 className="pt-5 text-[25px] text-black dark:text-white">
                {data?.price === 0 ? "Free" : data?.price + " MAD"}
              </h1>
              {data?.price < data?.estimatedPrice && (
                <div className="pl-5 flex items-center">
                  <h4 className="line-through text-[16px] text-black dark:text-white">
                    {data?.estimatedPrice} MAD
                  </h4>
                  <h4 className="text-[16px] text-[#32a852]">
                    {discountPercentagePrice}% OFF
                  </h4>
                </div>
              )}
            </div>
            <div className="flex items-center">
              {isPurchased ? (
                <Link
                  className={`${styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-orange-500 dark:text-white`}
                  href={`/course-access/${data._id}`}
                >
                  Enter to Course
                </Link>
              ) : (
                <div
                  className={`${styles.button} !w-[195px] my-3 font-Poppins cursor-pointer !bg-orange-500 dark:text-white`}
                  onClick={handleOrder}
                >
                  Buy Now {data?.price} MAD
                </div>
              )}
            </div>
            <br />
          </div>
        </div>
      </div>
      <>
        {open && (
          <div className="w-full h-screen bg-[#00000036] fixed top-0 left-0 z-50 flex items-center justify-center ">
            <div className="w-[500px] min-h-[500px] bg-white rounded-xl shadow p-3 dark:bg-slate-700">
              <div className="w-full flex justify-end">
                <IoCloseOutline
                  size={40}
                  className="text-black cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>
              {!paymentMethod && (
                <div className="w-full flex flex-col items-center ">
                  <h2 className="text-[20px] font-Poppins font-[600] text-black dark:text-white  mb-5">
                    Choose Payment Method
                  </h2>
                  <h2 className="text-[20px] font-Poppins font-[500] text-black dark:text-white  mb-5">
                    pay by
                  </h2>
                  <br />
                  <br />
                  <br />
                  <div className="flex flex-col items-center">
                    <button
                      className={`${styles.button} flex items-center justify-center !w-[200px] my-3 font-Poppins cursor-pointer !bg-slate-800 pr-5`}
                      onClick={() => setPaymentMethod('stripe')}
                    >
                      <FaCreditCard size={25} className="text-white" />
                      <span className="mr-1">   </span> {/* Ajout d'un petit espace */}
                      <span className="text-white ">Card</span>
                    </button>
                    <button
                      className={`${styles.button} flex items-center justify-center !w-[200px] my-3 font-Poppins cursor-pointer !bg-orange-500 pr-5`}
                      onClick={() => setPaymentMethod('bank')}
                    >
                      <FaMoneyBill size={20} className="text-white" />
                      <span className="mr-1">   </span> {/* Ajout d'un petit espace */}
                      <span className="text-white ">Bank Transfer</span>
                    </button>

                  </div>
                </div>
              )}
              {paymentMethod === 'stripe' && stripePromise && clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckOutForm
                      setOpen={setOpen}
                      data={data}
                      user={user}
                      refetch={refetch}
                      setPaymentMethod={setPaymentMethod} // Utilisez setPaymentMethod directement
                    />
                  </Elements>

                </Elements>
              )}
              {paymentMethod === 'bank' && (
                <div className="w-full flex flex-col items-center">
                  <Image
                    src="/assests/logo.png"
                    alt="CIH Bank Logo"
                    width={100}
                    height={100}
                    className="mb-5"
                  />
                  <h2 className="text-[20px] font-Poppins font-[600] text-black dark:text-white mb-5">
                    Bank Transfer Details
                  </h2>
                  <p className="text-[18px] text-black dark:text-white">Account Number: 4 2302 0139</p>
                  <p className="text-[18px] text-black dark:text-white">RIB: 230 201 3999444211030700 06</p>
                  <ol className="list-decimal list-inside text-[16px] text-black dark:text-white mt-2">
                      <li>Transfer <strong>{data?.price} MAD</strong> to the above account.</li>
                      <li>Contact support with your payment details.</li>
                      <li>Send the payment receipt to <strong className="text-[14px] text-orange-500">dacademy.sup1@gmail.com</strong>.</li>
                    </ol>
                  <br />
                  <br />
                  <br />
                  <div className="flex justify-between w-full px-5">
                    <button
                      className={`${styles.button} !w-[200px] my-3 font-Poppins cursor-pointer !bg-slate-800 text-white`}
                      onClick={() => setPaymentMethod(null)}
                    >
                      Go Back
                    </button>
                    <button
                      className={`${styles.button} !w-[200px] my-3 font-Poppins cursor-pointer !bg-orange-500 text-white`}
                      onClick={() => setOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default CourseDetails;
