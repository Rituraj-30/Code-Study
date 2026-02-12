import "./index.css";
import Navbar from "./components/common/Navbar";
import HomePage from "./pages/HomePage";
import Footer from "./components/common/Footer";
import { Routes, Route, useLocation } from "react-router-dom"; // useLocation add kiya
import AboutUsPage from "./pages/AboutUsPage";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ContactUs from "./pages/ContactUs";
import NotesPage from "./pages/Notes";
import VerifyOtp from "./pages/VerifyOtp";
import AllCourses from "./pages/AllCourses";
import GetCourseDetails from "./pages/GetCourseDetails";
import PrivateRoute from "./components/auth/PrivateRoute";
import Dashboard from "./pages/DashborardPage/Dashboard";
import MyProfile from "./components/core/Dashboard/MyProfile.tsx";
import MyCourses from "./components/core/Dashboard/MyCourses.tsx";
import Settings from "./components/core/Dashboard/Settings.tsx";
import AddCourse from "./components/core/Dashboard/AddCourse.tsx";
import EditCourse from "./components/core/Dashboard/EditCourse.tsx";
import PageNotFound from "./pages/PageNotFound.tsx";
import InstructorRoute from "./components/auth/InstructorRoute.tsx";
import CourseBuilder from "./pages/DashborardPage/CourseBuilder.tsx";
import EnrolledCourses from "./pages/DashborardPage/EnrolledCourses.tsx";
import ViewCourse from "./pages/DashborardPage/ViewCourse.tsx";
import StudentRoute from "./components/auth/StudentRoute.tsx";
import UpdatePassword from "./components/auth/UpdatePassword.tsx";
import LiveClassSetup from "./components/core/LiveStream/LiveClassSetup.tsx";
import LiveStreamPage from "./components/core/LiveStream/LiveStreamPage.tsx";
import JoinLiveClass from "./components/core/LiveStream/JoinLiveClass.tsx";
import LiveStreamStudentPage from "./components/core/LiveStream/LiveStreamPage.student.tsx";

import AdminRoute from "./components/auth/AdminRoute.tsx";
import AdminDashboard from "./pages/Adminpage/AdminDashboard.tsx";
const App: React.FC = () => {
  const location = useLocation();

  const hideNavbarFooter =
    location.pathname.includes("/live-stream") ||
    location.pathname.includes("/view-course") ||
    location.pathname.includes("/dashboard/settings/update-password");

  const hideBoth = location.pathname.includes("/live-stream");

  return (
    <>
      {!hideBoth && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/courses" element={<AllCourses />} />

        {/* Protected Course Details Route */}
        <Route
          path="/courses/:courseId"
          element={
            <PrivateRoute>
              <GetCourseDetails />
            </PrivateRoute>
          }
        />

        {/* Dashboard Parent Route (Nested Routes) */}
        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          {/* Shared Routes */}
          <Route index element={<MyProfile />} />
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="settings" element={<Settings />} />
          <Route
            path="settings/update-password"
            element={
              <StudentRoute>
                <UpdatePassword />
              </StudentRoute>
            }
          />

          {/* Instructor Only Routes */}
          <Route
            path="my-courses"
            element={
              <InstructorRoute>
                <MyCourses />
              </InstructorRoute>
            }
          />
          <Route
            path="add-course"
            element={
              <InstructorRoute>
                <AddCourse />
              </InstructorRoute>
            }
          />
          <Route
            path="edit-course/:courseId"
            element={
              <InstructorRoute>
                <EditCourse />
              </InstructorRoute>
            }
          />
          <Route
            path="add-lecture/:courseId"
            element={
              <InstructorRoute>
                <CourseBuilder />
              </InstructorRoute>
            }
          />

          {/* Student Only Routes */}
          <Route
            path="enrolled-courses"
            element={
              <StudentRoute>
                <EnrolledCourses />
              </StudentRoute>
            }
          />

          <Route
            path="live/:courseId"
            element={
              <InstructorRoute>
                <LiveClassSetup />
              </InstructorRoute>
            }
          />
          <Route
            path="live-class"
            element={
              <StudentRoute>
                <JoinLiveClass />
              </StudentRoute>
            }
          />
        </Route>

        {/* View Course Route - No Footer/Navbar will be shown here */}
        <Route
          path="view-course/:courseId"
          element={
            <StudentRoute>
              <ViewCourse />
            </StudentRoute>
          }
        />

        {/* ✅ 2. Live Stream Page (Actual Video Call Screen) */}
        {/* Ise Dashboard ke bahar rakha hai taaki sidebar/padding disturb na kare */}
        <Route
          path="live-stream/instructor/:roomId"
          element={
            <InstructorRoute>
              <LiveStreamPage />
            </InstructorRoute>
          }
        />
        <Route
          path="live-stream/student/:roomId"
          element={
            <StudentRoute>
              <LiveStreamStudentPage />
            </StudentRoute>
          }
        />

        <Route
          path="admin-panel"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* 404 Page Not Found */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      {!hideNavbarFooter && <Footer />}
    </>
  );
};

export default App;
