import Footer from './components/Footer';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import { getCategoryStyle } from './utils/categoryColors';
import SkillChip from './components/SkillChip';
import SkillExtractor from './components/SkillExtractor';
import RecommendedJobs from './components/RecommendedJobs';
import RecommendedJobsPage from './pages/RecommendedJobsPage';
import CoverLetterGenerator from './components/CoverLetterGenerator';
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import CreateJobPage from "./pages/recruiter/CreateJobPage";
import EditJobPage from "./pages/recruiter/EditJobPage";
import ApplicantsPage from "./pages/recruiter/ApplicantsPage";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import JobDetailPage from './pages/JobDetailPage';

// Placeholder components for pages not yet built
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import PendingRecruitersPage from './pages/admin/PendingRecruitersPage';
import AdminJobsPage from './pages/admin/AdminJobsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
const JobListPage = () => <div>Job List Page</div>;
const SavedJobsPage = () => <div>Saved Jobs Page</div>;

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const RoleRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user?.role)) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/jobs" element={<JobListPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />

          {/* Protected routes - Job Seeker only */}
          <Route path="/profile" element={
            <PrivateRoute><ProfilePage /></PrivateRoute>
          } />
          <Route path="/profile/edit" element={
            <PrivateRoute><EditProfilePage /></PrivateRoute>
          } />
          <Route path="/profile/change-password" element={
            <PrivateRoute><ChangePasswordPage /></PrivateRoute>
          } />
          <Route path="/jobs/recommended" element={
            <RoleRoute allowedRoles={['jobSeeker']}><RecommendedJobsPage /></RoleRoute>
          } />
          <Route path="/jobs/saved" element={
            <RoleRoute allowedRoles={['jobSeeker']}><SavedJobsPage /></RoleRoute>
          } />

          {/* Protected routes - Recruiter only */}
          <Route path="/recruiter/dashboard" element={
            <RoleRoute allowedRoles={['recruiter']}><RecruiterDashboard /></RoleRoute>
          } />
          <Route path="/recruiter/jobs/create" element={
            <RoleRoute allowedRoles={['recruiter']}><CreateJobPage /></RoleRoute>
          } />
          <Route path="/recruiter/jobs/:id/edit" element={
            <RoleRoute allowedRoles={['recruiter']}><EditJobPage /></RoleRoute>
          } />
          <Route path="/recruiter/applicants/:jobId" element={
            <RoleRoute allowedRoles={['recruiter']}><ApplicantsPage /></RoleRoute>
          } />

          {/* Test routes (can be removed later) */}
          <Route path="/test-colors" element={
            <div style={{ padding: 40, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {["Frontend", "Backend", "AI/ML", "DevOps", "Data Engineering", "Other"].map(cat => (
                <span key={cat} style={{
                  ...getCategoryStyle(cat),
                  padding: '6px 14px',
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}>
                  {cat}
                </span>
              ))}
            </div>
          } />

          <Route path="/test-skills" element={
            <div style={{ padding: 40 }}>
              <h2 style={{ color: "#F9EAD2" }}>Skill Extractor Test</h2>
              <SkillExtractor initialSkills={["React", "Node.js", "Python"]} />
            </div>
          } />
          <Route path="/test-recommended" element={
            <div style={{ padding: 40 }}>
              <h2 style={{ color: "#F9EAD2" }}>Recommended Jobs Test</h2>
              <RecommendedJobs />
            </div>
          } />

          <Route path="/test-cover-letter" element={
            <div style={{ padding: 40, display: "flex", justifyContent: "center" }}>
              <CoverLetterGenerator jobId="test123" />
            </div>
          } />

{/* Admin routes */}
          <Route path="/admin/dashboard" element={
            <RoleRoute allowedRoles={['admin']}><AdminDashboard /></RoleRoute>
          } />
          <Route path="/admin/recruiters" element={
            <RoleRoute allowedRoles={['admin']}><PendingRecruitersPage /></RoleRoute>
          } />
          <Route path="/admin/jobs" element={
            <RoleRoute allowedRoles={['admin']}><AdminJobsPage /></RoleRoute>
          } />
          <Route path="/admin/users" element={
            <RoleRoute allowedRoles={['admin']}><AdminUsersPage /></RoleRoute>
          } />
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;