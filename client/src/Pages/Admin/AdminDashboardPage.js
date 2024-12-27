import React, { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../Components/UserContext';
import { Link } from 'react-router-dom';

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
    <div>
      <h1>Welcome, {fullName}!</h1>
      <div><Link to={'/user-list'}>Users</Link></div>
      <div><Link to={'/test-list'}>Tests</Link></div>
    </div>
  );
}