
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Tutors from "./pages/Tutors";
import Tutoring from "./pages/Tutoring";
import Tasks from "./pages/Tasks";
import Resources from "./pages/Resources";
import BoardNotes from "./pages/resources/BoardNotes";
import CompetitiveExams from "./pages/resources/CompetitiveExams";
import SoftSkills from "./pages/resources/SoftSkills";
import StudyPlanner from "./pages/resources/StudyPlanner";
import Community from "./pages/Community";
import Blog from "./pages/Blog";
import Shorts from "./pages/Shorts";
import NotFound from "./pages/NotFound";
import UserProfile from "./pages/UserProfile";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import TutorProfile from "./pages/TutorProfile";
import SessionTimeout from "./components/common/SessionTimeout";

// Admin Panel Routes
import AdminDashboard from "./pages/admin/Dashboard";
import AdminTasks from "./pages/admin/Tasks";
import AdminResources from "./pages/admin/Resources";
import AdminBlogs from "./pages/admin/Blogs";
import AdminShorts from "./pages/admin/Shorts";
import FeaturedContent from "./pages/admin/FeaturedContent";

// Create the queryClient outside the component
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/tutor-profile" element={<TutorProfile />} />
            <Route path="/tutors" element={<Tutors />} />
            <Route path="/tutoring" element={<Tutoring />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resources/board-notes" element={<BoardNotes />} />
            <Route path="/resources/competitive-exams" element={<CompetitiveExams />} />
            <Route path="/resources/soft-skills" element={<SoftSkills />} />
            <Route path="/resources/study-planner" element={<StudyPlanner />} />
            <Route path="/community" element={<Community />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/shorts" element={<Shorts />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Admin Panel Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/tasks" element={<AdminTasks />} />
            <Route path="/admin/resources" element={<AdminResources />} />
            <Route path="/admin/blogs" element={<AdminBlogs />} />
            <Route path="/admin/shorts" element={<AdminShorts />} />
            <Route path="/admin/featured-content" element={<FeaturedContent />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <SessionTimeout />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
