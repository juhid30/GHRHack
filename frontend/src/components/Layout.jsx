import React from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <div className="h-screen max-w-[100%] flex flex-col">
      <div className="h-[14.5%] p-4 w-full flex items-center justify-center">
        <div className="h-full w-[90%] rounded-[1.7rem] bg-white shadow-lg flex">
          <div className="h-full w-[20%] rounded-l-[1.7rem] flex items-center justify-center">
            <img src={logo} width={140} height={140} alt="Logo" />
          </div>
          <div className="h-full w-[70%] flex items-center justify-around">
            <div onClick={() => handleNavigation('/')} className="cursor-pointer">Home</div>
            <div onClick={() => handleNavigation('/dashboard')} className="cursor-pointer">Dashboard</div>
            <div onClick={() => handleNavigation('/view360')} className="cursor-pointer">Religious Tour</div>
            <div onClick={() => handleNavigation('/community')} className="cursor-pointer">Community</div>
          </div>
          <div className="h-full w-[10%] rounded-r-[1.7rem] flex items-center justify-center">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnlkoa53zZB468uxslQjXZtrnqUZpa04vaVg&s" className="rounded-full h-[3rem]" alt="" />
          </div>
        </div>
      </div>
      <div className="h-[100%] w-full">{children}</div>
    </div>
  );
};

export default Layout;
