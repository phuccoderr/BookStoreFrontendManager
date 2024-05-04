import React from "react";
import ReactLoading from "react-loading";

const IsLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <ReactLoading
        type="spin"
        color="rgb(34 197 94)"
        height={"5%"}
        width={"5%"}
      />
    </div>
  );
};

export default IsLoading;
