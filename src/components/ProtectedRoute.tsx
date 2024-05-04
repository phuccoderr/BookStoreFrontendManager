import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC<{ role: string | undefined }> = ({ role }) => {
  const token = localStorage.getItem("access_token");
  const infoString = localStorage.getItem("info");
  const info = infoString ? JSON.parse(infoString) : null;
  if (role) {
    if (info.role !== role) {
      return <Navigate to="/403" />;
    }
  }

  return token ? <Outlet /> : <Navigate to="/login" replace={true} />;
};

export default ProtectedRoute;
