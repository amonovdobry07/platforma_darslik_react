import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "../components/layout/Layout";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProtectedRoute from "../routes/ProtectedRoute";
import Home from "../pages/Home";
import Courses from "../pages/Courses";
import CourseDetail from "../pages/CourseDetail";
import About from "../pages/About";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import StudentDashboard from "../pages/dashboard/StudentDashboard";
import InstructorDashboard from "../pages/dashboard/InstructorDashboard";
import useAuthStore from "../store/authStore";
import CreateCourse from "../pages/dashboard/CreateCourse";
import MyCourses from "../pages/dashboard/MyCourses";
import InstructorCourses from "../pages/dashboard/InstructorCourses";
import LessonViewer from "../pages/LessonViewer";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import MyCertificates from "../pages/dashboard/MyCertificates";
import { authAPI } from "../api/auth";
import ManageLessons from "../pages/dashboard/ManageLessons";
import EditCourse from "../pages/dashboard/EditCourse";
import ManageQuiz from "../pages/dashboard/ManageQuiz";
import InstructorStats from "../pages/dashboard/InstructorStats";
import useThemeStore from "../store/themeStore";
import Checkout from "../pages/Checkout";
import InstallPrompt from "../components/ui/InstallPrompt";

function App() {
  const { isAuthenticated, setUser, logout } = useAuthStore();
  const { theme, initTheme } = useThemeStore();

  // Theme'ni boshlanishida o'rnatish
  useEffect(() => {
    initTheme();
  }, []);

  // Auth tekshirish
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
      <Toaster
        position="top-right"
        theme={theme}
        toastOptions={{
          style: {
            background: "var(--bg-surface)",
            border: "1px solid var(--border-primary)",
            color: "var(--text-primary)",
          },
        }}
      />
      <InstallPrompt />
      <Routes>
        {/* ============ PUBLIC ROUTES (Layout bilan) ============ */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:id" element={<CourseDetail />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* ============ PROFILE & CHECKOUT (Auth required) ============ */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout/:courseId" element={<Checkout />} />
        </Route>

        {/* ============ LESSON VIEWER ============ */}
        <Route element={<ProtectedRoute />}>
          <Route path="/courses/:courseId/lessons" element={<LessonViewer />} />
          <Route
            path="/courses/:courseId/lessons/:lessonId"
            element={<LessonViewer />}
          />
        </Route>

        {/* ============ STUDENT DASHBOARD ============ */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/dashboard/student" element={<DashboardLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="courses" element={<MyCourses />} />
            <Route path="certificates" element={<MyCertificates />} />
          </Route>
        </Route>

        {/* ============ INSTRUCTOR DASHBOARD ============ */}
        <Route element={<ProtectedRoute allowedRoles={["instructor"]} />}>
          <Route path="/dashboard/instructor" element={<DashboardLayout />}>
            <Route index element={<InstructorDashboard />} />
            <Route path="courses" element={<InstructorCourses />} />
            <Route path="create" element={<CreateCourse />} />
            <Route path="edit/:id" element={<EditCourse />} />
            <Route path="lessons/:courseId" element={<ManageLessons />} />
            <Route path="quiz/:courseId/:lessonId" element={<ManageQuiz />} />
            <Route path="stats" element={<InstructorStats />} />
          </Route>
        </Route>

        {/* ============ 404 — ENG OXIRDA! ============ */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;