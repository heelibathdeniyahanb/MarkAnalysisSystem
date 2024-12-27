import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../UserContext';
import { FaSearch, FaBell, FaRegEnvelope, FaCaretDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function AdminHeader() {
  const { user } = useContext(UserContext);
  const [fullName, setFullName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (user?.user) {
      setFullName(`${user.user.firstName || ''} ${user.user.lastName || ''}`);
    }
  }, [user]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-16 bg-gray-50 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <header className=" w-5/6  shadow-md fixed top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Greeting Section */}
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl truncate">
              {greeting}, <span className="text-orange-500">{fullName}!</span>
            </h2>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Actions Section */}
          <div className="flex items-center space-x-6">
           

            {/* Notifications
            <button
              className="relative p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <FaBell size={18} className="text-gray-500 hover:text-orange-500" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-orange-500"></span>
            </button> */}

          

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div
                className="h-10 w-10 rounded-full bg-orange-500 text-white 
                flex items-center justify-center font-semibold text-lg"
              >
                {fullName.charAt(0)}
              </div>
              <Link to={'/profile-view'}><button
                className="flex items-center text-gray-700 hover:text-orange-500 
                transition-colors"
              >
                <span className="text-sm font-medium">Profile</span>
                <FaCaretDown size={14} className="ml-1" />
              </button></Link>
              
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
