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



// Placeholder components (teammates will replace these)
const HomePage = () => <div>Home Page</div>;
const LoginPage = () => <div>Login Page</div>;
const RegisterPage = () => <div>Register Page</div>;
const ForgotPasswordPage = () => <div>Forgot Password Page</div>;
const ResetPasswordPage = () => <div>Reset Password Page</div>;
const ProfilePage = () => <div>Profile Page</div>;
const EditProfilePage = () => <div>Edit Profile Page</div>;
const ChangePasswordPage = () => <div>Change Password Page</div>;
const JobListPage = () => <div>Job List Page</div>;
const JobDetailPage = () => <div>Job Detail Page</div>;
const SavedJobsPage = () => <div>Saved Jobs Page</div>;
const RecruiterDashboard = () => <div>Recruiter Dashboard</div>;
const CreateJobPage = () => <div>Create Job Page</div>;

// PrivateRoute: only authenticated users
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// RoleRoute: authenticated + specific role
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

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;