import "./App.css";
import Sidebar from "./components/Sidebar";
import SidebarGerenciar from "./pages/UsersPages/SidebarGerenciar";
import EditProcessPage from "./pages/EditProcessPage/EditProcessPage";
import ProcessPage from "./pages/ProcessPage/ProcessPage";
import "./App.css";
import RegisterProcessPage from "./pages/RegisterProcessPage/RegisterProcessPage";
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation, Navigate } from "react-router-dom";
import RegisterUsersPage from "./pages/RegisterUserPage/RegisterUsersPage";
import UsersPage from "./pages/UsersPages/UsersPage";
import CalendarPage from "./pages/CalendarPage/CalendarPage";
import EditUsers from "./pages/OptionsUsersPage/EditUsers";
import DistributionPage from "./pages/DistributionProcessPage/DistributionPage";
import DeleteUserModal from "./pages/UsersPages/DeleteModal";

import LoginPage from "./pages/LoginPage/LoginPage";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import ReportsPage from "./pages/ReportsPage/ReportsPage";

const Layout = () => {
  const location = useLocation();

  // Condicional para exibir diferentes Sidebars
  const isUserPage = location.pathname.startsWith("/user");

  return (
    <div className="layout">
      {isUserPage ? <SidebarGerenciar /> : <Sidebar />}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/" element={<Layout />}>
            <Route path="/register-process" element={<PrivateRoute element={<RegisterProcessPage />} />} />
            <Route path="/process" element={<PrivateRoute element={<ProcessPage />} />} />
            <Route path="/user/register-user" element={<PrivateRoute element={<RegisterUsersPage />} />} />
            <Route path="/process/edit/:id" element={<PrivateRoute element={<EditProcessPage />} />} />
            <Route path="/user" element={<PrivateRoute element={<UsersPage />} />} />
            <Route path="/calendar-page" element={<PrivateRoute element={<CalendarPage />} />} />
            {/* <Route path="/edit-user/:id" element={<PrivateRoute element={<EditUsers />} />} /> */}
            <Route path="/user/edit-user/:id" element={<EditUsers />} />
            <Route path="/user/distribution" element={<DistributionPage />} />
            <Route path="/modal" element={<DeleteUserModal />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
