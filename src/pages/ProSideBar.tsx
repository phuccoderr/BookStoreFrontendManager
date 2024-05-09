import React, { Dispatch, ReactNode, useState } from "react";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { CiMenuBurger } from "react-icons/ci";
import { FaUserFriends } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { RiFileUserLine } from "react-icons/ri";
import { BiCategory } from "react-icons/bi";
import { MdProductionQuantityLimits } from "react-icons/md";
import { RiCustomerService2Line } from "react-icons/ri";

interface customItem {
  title: string;
  to: string;
  icon: ReactNode;
  selected: string;
  setSelected: Dispatch<string>;
}
const Item = ({ title, to, icon, selected, setSelected }: customItem) => {
  return (
    <MenuItem
      active={selected === title}
      icon={icon}
      onClick={() => setSelected(title)}
      component={<Link to={to} />}
      className="hover:bg-green-400"
    >
      <h1 className="text-xs font-bold text-gray-600">{title}</h1>
    </MenuItem>
  );
};

const ProSideBar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>("");
  const handleIsCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };
  return (
    <div className="min-h-screen bg-white">
      <Sidebar collapsed={isCollapsed}>
        <Menu className=" min-h-screen">
          <MenuItem
            onClick={handleIsCollapsed}
            icon={isCollapsed ? <CiMenuBurger /> : undefined}
          >
            {!isCollapsed && (
              <div className="flex justify-between items-center">
                <h1 className="font-bold text-green-400 p-2 text-2xl">
                  GROUP 12
                </h1>
                <div className="p-2 rounded">
                  <CiMenuBurger />
                </div>
              </div>
            )}
          </MenuItem>
          <div className={`${isCollapsed ? undefined : "pl-1"}`}>
            <Item
              title="Documentation"
              to="/"
              icon={<MdOutlineDashboard />}
              selected={selected}
              setSelected={setSelected}
            ></Item>
            <h1 className="text-gray-500 ml-4 p-2 font-bold text-base">Data</h1>
            <Item
              title="USERS"
              to="/users"
              icon={<FaUserFriends />}
              selected={selected}
              setSelected={setSelected}
            ></Item>
            <Item
              title="AUTHORS"
              to="/authors"
              icon={<RiFileUserLine />}
              selected={selected}
              setSelected={setSelected}
            ></Item>
            <Item
              title="CATEGORIES"
              to="/categories"
              icon={<BiCategory />}
              selected={selected}
              setSelected={setSelected}
            ></Item>

            <Item
              title="PRODUCTS"
              to="/products"
              icon={<MdProductionQuantityLimits />}
              selected={selected}
              setSelected={setSelected}
            ></Item>

            <Item
              title="CUSTOMERS"
              to="/customers"
              icon={<RiCustomerService2Line />}
              selected={selected}
              setSelected={setSelected}
            ></Item>
          </div>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default ProSideBar;
