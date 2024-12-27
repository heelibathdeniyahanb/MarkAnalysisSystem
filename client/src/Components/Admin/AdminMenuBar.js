import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaFlask, FaChartBar, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

export default function AdminMenuBar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: '/admin-dashboard', label: 'Dashboard', icon: <FaHome /> },
    { path: '/user-list', label: 'Users', icon: <FaUsers /> },
    { path: '/test-list', label: 'Tests', icon: <FaFlask /> },
    { path: '/analyst-page', label: 'Analysis', icon: <FaChartBar /> },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={toggleMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar Navigation */}
      <div className={`
        fixed lg:static
        h-screen w-60
        bg-gray-800 text-white
        shadow-lg flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out
        z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col items-start p-4 space-y-4 mt-5">
          {menuItems.map((item) => (
            <Link
              to={item.path}
              key={item.label}
              onClick={closeMenu}
              className={`
                flex items-center w-full p-2 rounded-md transition
                ${location.pathname === item.path
                  ? 'bg-orange-500 text-white'
                  : 'hover:bg-gray-700 hover:text-orange-500'
                }
              `}
            >
              <div className="mr-3">{item.icon}</div>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="p-4">
          <button className="flex items-center w-full p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
            <FaSignOutAlt className="mr-3" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
}