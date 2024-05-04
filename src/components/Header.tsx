import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("info");
    navigate("/login");
  };
  const infoString = localStorage.getItem("info");
  const info = infoString ? JSON.parse(infoString) : null;
  return (
    <div className="flex items-center justify-between p-2 bg-slate-100 h-16">
      {info ? (
        <>
          <div className="flex justify-start items-center gap-2">
            <img src={info.photo} className="rounded-full" width="15%" />
            <Link to="/account">
              <h1>{info.name}</h1>
            </Link>
          </div>
          <div className="p-2 cursor-pointer" onClick={handleLogout}>
            <h1 className="font-bold">Đăng xuất</h1>
          </div>
        </>
      ) : (
        <Link to="/login">Đăng nhập</Link>
      )}
    </div>
  );
};

export default Header;
