"use client";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import { styles } from "../styles/style";
import CourseCard from "../components/Course/CourseCard";
import Footer from "../components/Footer";

type Props = {};

const Page = (props: Props) => {
  const searchParams = useSearchParams();
  const search = searchParams?.get("title");
  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});
  const { data: categoriesData } = useGetHeroDataQuery("categories", {});
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    if (data?.courses && categoriesData?.layout?.categories) {
      let filteredCourses = data.courses;

      if (category !== "All") {
        const selectedCategory = categoriesData.layout.categories.find(
          (cat) => cat.title === category
        );
        const categoryId = selectedCategory ? selectedCategory._id : null;

        if (categoryId) {
          filteredCourses = filteredCourses.filter(
            (item) => item.categories === categoryId
          );
        }
      }

      if (search) {
        filteredCourses = filteredCourses.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      setCourses(filteredCourses);
    }
  }, [data, categoriesData, category, search]);

  const categories = categoriesData?.layout?.categories;

  return (
    <div className="dark:bg-slate-700">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={1}
          />
          <div className="w-[95%] 800px:w-[85%] m-auto min-h-[70vh]">
            <Heading
              title={"All courses - DAcademy"}
              description="DAcademy is the first moroccan academy to learn and get help from teachers"
              keywords="Diagnostic, Cars, Mercedes, OFPPT"
            />
            <br />
            <div className="w-full flex items-center flex-wrap">
              <div
                className={`h-[35px] ${category === "All" ? "bg-orange-500" : "bg-teal-500"
                  } m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer`}
                onClick={() => setCategory("All")}
              >
                All
              </div>
              {categories &&
                categories.map((item: any, index: number) => (
                  <div key={index}>
                    <div
                      className={`h-[35px] ${category === item.title
                          ? "bg-orange-500"
                          : "bg-teal-500"
                        } m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer`}
                      onClick={() => setCategory(item.title)}
                    >
                      {item.title}
                    </div>
                  </div>
                ))}
            </div>
            {
              courses && courses.length === 0 && (
                <p className={`${styles.label} justify-center min-h-[50vh] flex items-center`}>
                  {search ? "No courses found!" : "No courses found in this category. Please try another one!"}
                </p>
              )
            }
            <br />
            <br />
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
              {courses &&
                courses.map((item: any, index: number) => (
                  <CourseCard item={item} key={index} />
                ))}
            </div>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Page;
