import Footer from './components/Footer';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import JobDetailPage from './pages/JobDetailPage';

// Placeholder components (teammates will replace these)
const HomePage = () => <div>Home Page</div>;
const LoginPage = () => <div>Login Page</div>;
const RegisterPage = () => <div>Register Page</div>;
const ForgotPasswordPage = () => <div>Forgot Password Page</div>;
const ResetPasswordPage = () => <div>Reset Password Page</div>;
const JobListPage = () => <div>Job List Page</div>;
const RecommendedJobsPage = () => <div>Recommended Jobs Page</div>;
const SavedJobsPage = () => <div>Saved Jobs Page</div>;
const RecruiterDashboard = () => <div>Recruiter Dashboard</div>;
const CreateJobPage = () => <div>Create Job Page</div>;

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
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/jobs" element={<JobListPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />

          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/profile/edit" element={<PrivateRoute><EditProfilePage /></PrivateRoute>} />
          <Route path="/profile/change-password" element={<PrivateRoute><ChangePasswordPage /></PrivateRoute>} />
          <Route path="/jobs/recommended" element={<RoleRoute allowedRoles={['jobSeeker']}><RecommendedJobsPage /></RoleRoute>} />
          <Route path="/jobs/saved" element={<RoleRoute allowedRoles={['jobSeeker']}><SavedJobsPage /></RoleRoute>} />
          <Route path="/recruiter/dashboard" element={<RoleRoute allowedRoles={['recruiter']}><RecruiterDashboard /></RoleRoute>} />
          <Route path="/recruiter/jobs/create" element={<RoleRoute allowedRoles={['recruiter']}><CreateJobPage /></RoleRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;