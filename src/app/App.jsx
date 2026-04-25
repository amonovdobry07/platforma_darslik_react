import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "../components/layout/Layout";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProtectedRoute from "../routes/ProtectedRoute";
import Home from "../pages/Home";
import Courses from "../pages/Courses";
import CourseDetail from "../pages/CourseDetail"; // ← BU QATOR
import About from "../pages/About";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import StudentDashboard from "../pages/dashboard/StudentDashboard";
import InstructorDashboard from "../pages/dashboard/InstructorDashboard";
import useAuthStore from "../store/authStore";
import CreateCourse from "../pages/dashboard/CreateCourse";
import MyCourses from "../pages/dashboard/MyCourses";
import InstructorCourses from "../pages/dashboard/InstructorCourses";
import LessonViewer from '../pages/LessonViewer'
import Profile from "../pages/Profile";
import { authAPI } from "../api/auth";

import ManageLessons from '../pages/dashboard/ManageLessons'
import EditCourse from '../pages/dashboard/EditCourse'

function App() {
  const { isAuthenticated, setUser, logout } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && isAuthenticated) {
      authAPI
        .getMe()
        .then((data) => setUser(data))
        .catch(() => logout());
    }
  }, []);

  return (
    <>
      <Toaster position="top-right" theme="dark" richColors />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:id" element={<CourseDetail />} />{" "}
          {/* ← BU QATOR */}
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Auth required */}
        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<Profile />} /> {/* ← YANGI */}
        </Route>

        {/* Lesson Viewer (alohida layout) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/courses/:courseId/lessons" element={<LessonViewer />} />
          <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonViewer />} />
        </Route>

        {/* Student Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/dashboard/student" element={<DashboardLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="courses" element={<MyCourses />} /> {/* ← YANGI */}
          </Route>
        </Route>

        {/* Instructor Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={['instructor']} />}>
          <Route path="/dashboard/instructor" element={<DashboardLayout />}>
            <Route index element={<InstructorDashboard />} />
            <Route path="courses" element={<InstructorCourses />} />
            <Route path="create" element={<CreateCourse />} />
            <Route path="edit/:id" element={<EditCourse />} />  {/* ← YANGI */}
            <Route path="lessons/:courseId" element={<ManageLessons />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
