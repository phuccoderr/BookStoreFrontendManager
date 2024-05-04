import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
interface manager {
  title: string;
  description: string;
}

const ManagerHeader: React.FC<manager> = ({ title, description }) => {
  return (
    <>
      <h1 className="text-green-400 font-bold text-xl">{title}</h1>
      <span className="text-slate-600 text-sm">{description}</span>
    </>
  );
};

export default ManagerHeader;
