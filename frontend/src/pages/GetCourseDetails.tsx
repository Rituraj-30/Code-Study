import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetCourseDetailsQuery } from "../services/authApi";
import HighlightText from "../components/common/HighlightText";
import {
  Loader2,
  Globe,
  Award,
  Users,
  IndianRupee,
  ShoppingCart,
  CheckCircle2,
  Info,
  MonitorPlay,
  Video,
  ClipboardList,
  PlayCircle,
} from "lucide-react";
import TestimonialSlider from "../components/core/Homepage/TestimonialSlider";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import axios from "axios";
import { studentEndpoints } from "../services/apis";

/* ================= HELPER ================= */
const normalizeToArray = (value: any): string[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useGetCourseDetailsQuery(courseId);
  const { user, token } = useSelector((state: any) => ({
    user: state.profile?.user,
    token: state.auth?.token,
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#000814] flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-400" size={40} />
      </div>
    );
  }

  const course = data?.data?.courseDetails;
      console.log("course ->",course)


  // ENROLLED CHECK  
  const isEnrolled =
    course?.studentsEnrolled?.some(
      (studentId: string) => studentId === user?._id
    ) || false;

    console.log("isEnrolled ->",isEnrolled)

  /* ================= VERIFY PAYMENT ================= */
  const verifyPayment = async (response: any) => {
    const toastId = toast.loading("Verifying payment...");
    try {
      await axios.post(
        studentEndpoints.COURSE_VERIFY_API,
        {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          coursesId: [courseId],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.dismiss(toastId);
      toast.success("Payment Successful! Welcome to the course.");

      navigate("/dashboard/enrolled-courses");
    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error("Could not verify payment");
    }
  };

  /* ================= BUY COURSE ================= */
  const handleBuyCourse = async () => {
    if (!token) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    if (user?.accountType === "Instructor") {
      toast.error("Instructor can't buy courses");
      return;
    }

    const toastId = toast.loading("Processing order...");
    try {
      // 1. Capture Payment (Backend Order Creation)
      const res = await axios.post(
        studentEndpoints.COURSE_PAYMENT_API,
        { coursesId: [courseId] },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const orderData = res.data.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY , 
        amount: orderData.amount,
        currency: orderData.currency,
        name: "CodeStudy",
        description: `Purchase of ${course?.courseName}`,
        image: course?.thumbnail,
        order_id: orderData.id,
        handler: function (response: any) {
          // Jab user pay kar dega, ye function chalega
          verifyPayment(response);
        },
        prefill: {
          name: `${user?.firstName} ${user?.lastName}`,
          email: user?.email,
        },
        theme: {
          color: "#22D3EE",
        },
      };

      toast.dismiss(toastId);
      
      // 3. Open Razorpay Modal
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      
      rzp.on("payment.failed", function () {
        toast.error("Payment Failed! Please try again.");
      });

    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error(error?.response?.data?.message || "Order creation failed");
    }
  };

  /* ================= CONTINUE LEARNING ================= */
  const handleContinueLearning = () => {
    navigate(`/dashboard/enrolled-courses`);
  };

  const reviewsForSlider =
    course?.ratingAndReviews?.map((item: any) => ({
      _id: item._id,
      rating: item.rating,
      review: item.review,
      user: {
        firstName: item.user?.firstName,
        lastName: item.user?.lastName,
        image: item.user?.image,
      },
      course: { courseName: course?.courseName || "Course" },
    })) || [];

  return (
    <div className="min-h-screen bg-[#000814] text-white pb-10">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="lg:grid lg:grid-cols-12 gap-6">
          
          {/* LEFT SIDE */}
          <div className="lg:col-span-8 space-y-6">

            {/* HEADER */}
            <div>
              <nav className="text-cyan-400 text-xs font-bold flex gap-2">
                <HighlightText text="Courses" />
                <span>/</span>
                <span>{course?.category?.name}</span>
              </nav>

              <h1 className="text-3xl md:text-4xl font-black mt-2">
                {course?.courseName}
              </h1>

              <p className="text-gray-400 mt-2 max-w-xl">
                {course?.courseDescription}
              </p>

              <div className="flex flex-wrap gap-2 mt-3 text-[10px]">
                <Badge icon={<Users size={12} />} text={`${course?.studentsEnrolled.length || 0} Enrolled`} />
                <Badge icon={<Globe size={12} />} text="Hindi / English" />
                <Badge icon={<Award size={12} />} text="Certified" yellow />
                <Badge icon={<MonitorPlay size={12} />} text="Recorded" />
                <Badge icon={<Video size={12} />} text="Live Classes" />
              </div>
            </div>

            {/* INSTRUCTOR */}
            <div className="bg-[#000d1f] border border-white/5 rounded-2xl p-6">
              <h2 className="text-sm font-bold uppercase mb-4">
                <HighlightText text="Instructor" />
              </h2>

              <div className="flex items-center gap-4">
                <img
                  src={course?.instructor?.image}
                  className="w-16 h-16 rounded-full border border-cyan-500"
                  alt="instructor"
                />
                <div>
                  <p className="font-bold text-lg">
                    {course?.instructor?.firstName} {course?.instructor?.lastName}
                  </p>
                  <p className="text-xs text-gray-400">Professional Instructor</p>
                </div>
              </div>
            </div>

            {/* WHAT YOU WILL LEARN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Section title="What you'll Learn">
                {normalizeToArray(course?.whatYouWillLearn).map((item, i) => (
                  <ListItem key={i} text={item} />
                ))}
              </Section>

              {course?.instructions?.length > 0 && (
                <Section title="Instructions">
                  {normalizeToArray(course.instructions).map((item, i) => (
                    <InstructionItem key={i} text={item} />
                  ))}
                </Section>
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-4 lg:sticky top-10">
            <div className="bg-[#001428] border border-white/10 rounded-2xl p-5">
              <img src={course?.thumbnail} className="rounded-lg mb-4 aspect-video object-cover" alt="thumbnail" />

              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-gray-400 uppercase">Price</span>
                <div className="flex items-center text-2xl font-black">
                  <IndianRupee size={18} />
                  {course?.price}
                </div>
              </div>

              {/* BUTTON */}
              {isEnrolled ? (
                <button
                  onClick={handleContinueLearning}
                  className="w-full bg-cyan-400 text-black font-black py-3 rounded-lg flex justify-center gap-2"
                >
                  <PlayCircle size={20} />
                  CONTINUE LEARNING
                </button>
              ) : (
                <button
                  onClick={handleBuyCourse}
                  className="w-full bg-cyan-500 text-black font-black py-3 rounded-lg flex justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  BUY NOW
                </button>
              )}

              <div className="mt-4 bg-white/5 rounded-lg p-3">
                <div className="flex gap-2 text-cyan-400 text-xs font-bold">
                  <ClipboardList size={14} /> Course Includes
                </div>
                <ul className="mt-2 text-xs text-gray-400 space-y-1">
                  <li>✓ Lifetime access</li>
                  <li>✓ Certificate</li>
                  <li>✓ Mobile & TV access</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {reviewsForSlider.length > 0 && (
        <div className="mt-10 border-t border-white/5 pt-8 px-4">
          <TestimonialSlider data={reviewsForSlider} heading={false} />
        </div>
      )}
    </div>
  );
};

/* ================= REUSABLE ================= */
const Section = ({ title, children }: any) => (
  <div className="bg-[#000d1f] border border-white/5 rounded-2xl p-6">
    <h2 className="text-sm font-bold uppercase mb-4">
      <HighlightText text={title} />
    </h2>
    {children}
  </div>
);

const ListItem = ({ text }: any) => (
  <div className="flex gap-2">
    <CheckCircle2 size={14} className="text-cyan-500 mt-1" />
    <p className="text-xs text-gray-300">{text}</p>
  </div>
);

const InstructionItem = ({ text }: any) => (
  <div className="flex gap-2">
    <Info size={14} className="text-purple-400 mt-1" />
    <p className="text-xs text-gray-300">{text}</p>
  </div>
);

const Badge = ({ icon, text, yellow }: any) => (
  <div
    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px]
    ${
      yellow
        ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
        : "bg-white/5 border-white/10"
    }`}
  >
    {icon}
    <span>{text}</span>
  </div>
);

export default CourseDetails;