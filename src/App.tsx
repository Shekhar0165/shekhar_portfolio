import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './pages/Home';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProjectManager from './pages/admin/ProjectManager';
import BlogManager from './pages/admin/BlogManager';
import MessagesViewer from './pages/admin/MessagesViewer';
import ResumeManager from './pages/admin/ResumeManager';
import TerminalConfigManager from './pages/admin/TerminalConfigManager';
import CategoryManager from './pages/admin/CategoryManager';
import SubscribersViewer from './pages/admin/SubscribersViewer';

import './styles/terminal.css';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          {/* Terminal Home — full viewport */}
          <Route path="/" element={<Home />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="projects" element={<ProjectManager />} />
              <Route path="blog" element={<BlogManager />} />
              <Route path="messages" element={<MessagesViewer />} />
              <Route path="resume" element={<ResumeManager />} />
              <Route path="terminal" element={<TerminalConfigManager />} />
              <Route path="categories" element={<CategoryManager />} />
              <Route path="subscribers" element={<SubscribersViewer />} />
            </Route>
          </Route>

          {/* Catch-all redirects to terminal */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
