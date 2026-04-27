import { useEffect, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import useAuthStore from "../store/authStore";
import useThemeStore from "../store/themeStore";
import { authAPI } from "../api/auth";
import Loading from "../components/ui/Loading";
import InstallPrompt from "../components/ui/InstallPrompt";

// ============ LAYOUT (eager load - hamma sahifada kerak) ============
import Layout from "../components/layout/Layout";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProtectedRoute from "../routes/ProtectedRoute";

// ============ LAZY LOADED PAGES (kerak bo'lganda yuklanadi) ============
// Public pages
const Home = lazy(() => import("../pages/Home"));
const Courses = lazy(() => import("../pages/Courses"));
const CourseDetail = lazy(() => import("../pages/CourseDetail"));
const About = lazy(() => import("../pages/About"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const NotFound = lazy(() => import("../pages/NotFound"));

// Authenticated pages
const Profile = lazy(() => import("../pages/Profile"));
const Checkout = lazy(() => import("../pages/Checkout"));
const LessonViewer = lazy(() => import("../pages/LessonViewer"));

// Student dashboard
const StudentDashboard = lazy(() => import("../pages/dashboard/StudentDashboard"));
const MyCourses = lazy(() => import("../pages/dashboard/MyCourses"));
const MyCertificates = lazy(() => import("../pages/dashboard/MyCertificates"));

// Instructor dashboard
const InstructorDashboard = lazy(() => import("../pages/dashboard/InstructorDashboard"));
const InstructorCourses = lazy(() => import("../pages/dashboard/InstructorCourses"));
const CreateCourse = lazy(() => import("../pages/dashboard/CreateCourse"));
const EditCourse = lazy(() => import("../pages/dashboard/EditCourse"));
const ManageLessons = lazy(() => import("../pages/dashboard/ManageLessons"));
const ManageQuiz = lazy(() => import("../pages/dashboard/ManageQuiz"));
const InstructorStats = lazy(() => import("../pages/dashboard/InstructorStats"));

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
      
      <Suspense fallback={<Loading fullScreen />}>
        <Routes>
          {/* ============ PUBLIC ROUTES ============ */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:id" element={<CourseDetail />} />
            <Route path="about" element={<About />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* ============ PROFILE & CHECKOUT ============ */}
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

          {/* ============ 404 ============ */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;