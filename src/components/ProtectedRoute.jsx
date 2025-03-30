import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // If still loading auth state, show nothing or a spinner
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render children routes
  return <Outlet />;
};

export default ProtectedRoute;
