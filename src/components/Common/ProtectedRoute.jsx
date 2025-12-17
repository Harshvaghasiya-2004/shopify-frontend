import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  // Not logged in OR role mismatch
  if (!user || (role && user.role !== role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
