import { styles } from "@/app/styles/style";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import React, { FC, useEffect, useState } from "react";

type Props = {
  courseInfo: any;
  setCourseInfo: (courseInfo: any) => void;
  active: number;
  setActive: (active: number) => void;
};

const CourseInformation: FC<Props> = ({
  courseInfo,
  setCourseInfo,
  active,
  setActive,
}) => {
  const [dragging, setDragging] = useState(false);
  const { data, error, isLoading } = useGetHeroDataQuery("categories", {});
  const [categories, setCategories] = useState([]);

  useEffect(() => {

    if (data) {
      setCategories(data?.layout?.categories || []);
    }
  }, [data, error, isLoading]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setActive(active + 1);
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        setCourseInfo({ ...courseInfo, thumbnail: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        setCourseInfo({ ...courseInfo, thumbnail: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="w-[80%] m-auto mt-24 bg-tra">
      <form onSubmit={handleSubmit} className={`${styles.label}`}>
        <div>
          <label htmlFor="">Course Name</label>
          <input
            type="name"
            name=""
            required
            value={courseInfo.name}
            onChange={(e: any) =>
              setCourseInfo({ ...courseInfo, name: e.target.value })
            }
            id="name"
            placeholder="Course title"
            className={`
            ${styles.input}`}
          />
        </div>
        <br />
        <div className="mb-5">
          <label className={`${styles.label}`}>Course Description</label>
          <textarea
            name=""
            id=""
            cols={30}
            rows={8}
            placeholder="course description ......"
            className={`${styles.input} !h-min !py-2`}
            value={courseInfo.description}
            onChange={(e: any) =>
              setCourseInfo({ ...courseInfo, description: e.target.value })
            }
          ></textarea>
        </div>
        <br />
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label className={`${styles.label}`}>Course Price</label>
            <input
              type="number"
              name=""
              required
              value={courseInfo.price}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, price: e.target.value })
              }
              id="price"
              placeholder="100"
              className={`
            ${styles.input}`}
            />
          </div>
          <div className="w-[50%]">
            <label className={`${styles.label} w-[50%]`}>
              Estimated Price (optional)
            </label>
            <input
              type="number"
              name=""
              value={courseInfo.estimatedPrice}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, estimatedPrice: e.target.value })
              }
              id="price"
              placeholder="300"
              className={`
            ${styles.input}`}
            />
          </div>
        </div>
        <br />
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label className={`${styles.label}`} htmlFor="email">
              Course Tags
            </label>
            <input
              type="text"
              required
              name=""
              value={courseInfo.tags}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, tags: e.target.value })
              }
              id="tags"
              placeholder="Cars,OFPPT,Automative mechanic,Electric systems"
              className={`
            ${styles.input}`}
            />
          </div>
          <div className="w-[50%]">
            <label className={`${styles.label} w-[50%]`}>
              Course Categories
            </label>
            <select
              name=""
              id=""
              className={`${styles.input} bg-transparent`}
              value={courseInfo.categoriesData}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, categories: e.target.value })
              }
            >
              <option value="" className="dark:text-black">Select Category</option>
              {categories && categories.length > 0 ? (
                categories.map((item: any) => (
                  <option value={item._id} key={item._id} className="dark:text-black text-black bg-transparent">
                    {item.title}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No categories available
                </option>
              )}
            </select>
          </div>
        </div>
        <br />
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label className={`${styles.label}`} htmlFor="level">Course Level</label>
            <select
              name="level"
              id="level"
              value={courseInfo.level}
              onChange={(e) => setCourseInfo({ ...courseInfo, level: e.target.value })}
              className={`${styles.input} dark:text-black text-black bg-transparent` }
              required
            >
              <option value=""  className="dark:text-black"disabled>Select Level</option>
              <option value="Beginner" className="dark:text-black">Beginner</option>
              <option value="Intermediate" className="dark:text-black">Intermediate</option>
              <option value="Advanced" className="dark:text-black">Advanced</option>
            </select>
          </div>

          <div className="w-[50%]">
            <label className={`${styles.label} w-[50%]`}>Demo Url</label>
            <input
              type="text"
              name=""
              required
              value={courseInfo.demoUrl}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, demoUrl: e.target.value })
              }
              id="demoUrl"
              placeholder="eer74fd"
              className={`
            ${styles.input}`}
            />
          </div>
        </div>
        <br />
        <div className="w-full">
          <input
            type="file"
            accept="image/*"
            id="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file"
            className={`w-full min-h-[10vh]  p-3 border flex items-center justify-center border-orange-500 ${dragging ? "bg-blue-500" : "bg-transparent"
              }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {courseInfo.thumbnail ? (
              <img
                src={courseInfo.thumbnail}
                alt=""
                className="max-h-full w-full object-cover"
              />
            ) : (
              <span className="text-black dark:text-white">
                Drag and drop your thumbnail here or click to browse
              </span>
            )}
          </label>
        </div>
        <br />
        <div className="w-full flex items-center justify-end">
          <input
            type="submit"
            value="Next"
            className="w-full 800px:w-[180px] h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
          />
        </div>
        <br />
        <br />
      </form>
    </div>
  );
};

export default CourseInformation;
