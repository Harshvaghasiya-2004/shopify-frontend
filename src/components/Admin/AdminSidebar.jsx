import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import { FaBox, FaShoppingCart, FaStore } from "react-icons/fa";
import { useDispatch } from "react-redux";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/");
  };
  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/admin" className="text-2xl font-medium">
          Shopping
        </Link>
      </div>
      <h2 className="text-xl font-medium mb-6 text-center">Admin Dashboard</h2>
      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white px-4 py-2 rounded flex items-center space-x-2"
              : "text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-3 rounded flex items-center space-x-2"
          }
        >
          <FaUser />
          <span>Users</span>
        </NavLink>
        {/* Products */}
        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white px-4 py-2 rounded flex items-center space-x-2"
              : "text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded flex items-center space-x-2"
          }
        >
          <FaBox />
          <span>Products</span>
        </NavLink>

        {/* Orders */}
        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white px-4 py-2 rounded flex items-center space-x-2"
              : "text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded flex items-center space-x-2"
          }
        >
          <FaShoppingCart />
          <span>Orders</span>
        </NavLink>

        {/* Shop */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white px-4 py-2 rounded flex items-center space-x-2"
              : "text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded flex items-center space-x-2"
          }
        >
          <FaStore />
          <span>Shop</span>
        </NavLink>
      </nav>
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center justify-center space-x-2"
        >
          <FaSignOutAlt />
          <span> Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
