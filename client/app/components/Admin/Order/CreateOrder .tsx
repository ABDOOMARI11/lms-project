import React, { useState, useEffect } from "react";
import { Box, Button, Modal } from "@mui/material";
import { DataGrid, GridRowsProp, GridColDef, GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import Loader from "../../Loader/Loader";
import { toast } from "react-hot-toast";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useCreateManualOrderMutation } from "@/redux/features/orders/ordersApi";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

type Course = {
  _id: string;
  name: string;
  ratings: number;
  purchased: number;
  createdAt: string;
};

const CreateOrder = () => {
  const [currentPage, setCurrentPage] = useState<"users" | "courses">("users");
  const [selectedUsers, setSelectedUsers] = useState<GridRowId[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<GridRowId[]>([]);
  const { isLoading: isLoadingUsers, data: usersData } = useGetAllUsersQuery({});
  const { isLoading: isLoadingCourses, data: coursesData } = useGetAllCoursesQuery({});
  const [createManualOrder, { isSuccess, isError }] = useCreateManualOrderMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Order created successfully");
      setSelectedCourses([]);
      setSelectedUsers([]);
    }
    if (isError) {
      toast.error("Failed to create order");
    }
  }, [isSuccess, isError]);

  const handleCreateOrder = async () => {
    try {
      const orderData = selectedUsers.map(userId => ({
        userId,
        courseId: selectedCourses[0], // Prend le premier cours sélectionné pour chaque utilisateur
      }));

      console.log("Order Data:", orderData);

      const response = await createManualOrder({
        userId: selectedUsers[0], // Utilise le premier utilisateur sélectionné
        courseId: selectedCourses[0], // Utilise le premier cours sélectionné
        payment_info: null // Définit les données de paiement si nécessaire
      });

      console.log("Server Response:", response);

      if (response.data.success) {
        toast.success("Order created successfully");
      } else {
        toast.error("Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
    }
  };

  const userColumns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "name", headerName: "Name", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 0.5 },
    { field: "role", headerName: "Role", flex: 0.5 },
    { field: "created_at", headerName: "Joined At", flex: 0.5 },
  ];

  const courseColumns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "title", headerName: "Course Title", flex: 1 },
    { field: "ratings", headerName: "Ratings", flex: 0.5 },
    { field: "purchased", headerName: "Purchased", flex: 0.5 },
    { field: "created_at", headerName: "Created At", flex: 0.5 },
  ];

  const userRows: GridRowsProp = usersData?.users.map((user: User) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.createdAt,
  })) || [];

  const courseRows: GridRowsProp = coursesData?.courses.map((course: Course) => ({
    id: course._id,
    title: course.name,
    ratings: course.ratings,
    purchased: course.purchased,
    created_at: course.createdAt,
  })) || [];

  return (
    <div className="pt-50">
      <br />
      <br />
      <br />
      <br />
      {currentPage === "users" ? (
        <div>
          {isLoadingUsers ? <Loader /> : (
            <DataGrid
              checkboxSelection
              rows={userRows}
              columns={userColumns}
              onRowSelectionModelChange={(ids: GridRowSelectionModel) => setSelectedUsers(ids)}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              pagination
              className=""
            />
          )}
          <Button variant="contained" onClick={() => setCurrentPage("courses")} style={{ backgroundColor: "#FF9900" }}>Next</Button>
        </div>
      ) : (
        <div>

          {isLoadingCourses ? <Loader /> : (
            <DataGrid
              checkboxSelection
              rows={courseRows}
              columns={courseColumns}
              onRowSelectionModelChange={(ids: GridRowSelectionModel) => setSelectedCourses(ids)}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              pagination
              className=""
            />
          )}
          <br />
          <br />
          <div className="flex justify-between w-[95%]">
            <Button variant="contained" onClick={() => setCurrentPage("users")} style={{ backgroundColor: "#FF9900" }}>Previous</Button>
            <Button
              variant="contained"
              onClick={handleCreateOrder}
              disabled={selectedCourses.length === 0}
              style={{ backgroundColor: "#374151", color: "white",  }}
            >
              Create Order
            </Button>

          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOrder;
