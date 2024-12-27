import React, { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../Components/UserContext';
import { Link } from 'react-router-dom';
import AdminMenuBar from '../../Components/Admin/AdminMenuBar';
import AdminHeader from '../../Components/Admin/AdminHeader';

export default function AdminDashboardPage() {
  const { user } = useContext(UserContext);
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    if (user?.user) { // Check for nested user object
      // Set full name from user context
      setFullName(`${user.user.firstName || ''} ${user.user.lastName || ''}`);
    }
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex'>
     
      <div className=''><AdminMenuBar/></div>
      <div><AdminHeader/></div>
      
      

    </div>
  );
}