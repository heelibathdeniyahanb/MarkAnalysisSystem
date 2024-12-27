import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import { UserContext } from '../UserContext';

export default function ProfileSettings() {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: ''
  });

  useEffect(() => {
    if (user?.user?.id) {
      fetchUserData(user.user.id);
    } else {
      setLoading(false);
    }
  }, [user?.user?.id]);

  const fetchUserData = async (id) => {
    try {
      const response = await axios.get(`https://localhost:7106/api/User/get-user/${id}`);
      const userData = response.data;
      
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
        address: userData.address || ''
      });
      setLoading(false);
    } catch (err) {
      console.error('API fetch error:', err);
      setError('Failed to fetch user data');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.user?.id) {
      setError('User ID not found');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `https://localhost:7106/api/User/update-user/${user.user.id}`,
        formData
      );
      
      setUser(prevUser => ({
        ...prevUser,
        user: {
          ...prevUser.user,
          ...formData
        }
      }));
      
      setIsEditing(false);
      setLoading(false);
    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to update profile');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to current user data
    if (user?.user) {
      setFormData({
        firstName: user.user.firstName || '',
        lastName: user.user.lastName || '',
        email: user.user.email || '',
        phoneNumber: user.user.phoneNumber || '',
        address: user.user.address || ''
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
        <button 
          onClick={() => setError(null)} 
          className="ml-4 underline hover:no-underline"
        >
          Dismiss
        </button>
      </div>
    );
  }

  const InputField = ({ icon: Icon, label, name, type = "text" }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="text-gray-400" />
        </div>
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          disabled={!isEditing}
          className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 
            focus:outline-none focus:ring-1 focus:ring-orange-500 
            disabled:bg-gray-50 disabled:text-gray-500"
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-neutral-900 rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-semibold ">Profile Settings</h1>
          <p className="text-gray-600 mt-1">Manage your profile information</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField 
              icon={FaUser} 
              label="First Name" 
              name="firstName" 
            />
            <InputField 
              icon={FaUser} 
              label="Last Name" 
              name="lastName" 
            />
            <InputField 
              icon={FaEnvelope} 
              label="Email" 
              name="email" 
              type="email" 
            />
            <InputField 
              icon={FaPhone} 
              label="Phone Number" 
              name="phoneNumber" 
              type="tel" 
            />
            <div className="md:col-span-2">
              <InputField 
                icon={FaMapMarkerAlt} 
                label="Address" 
                name="address" 
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 
                    hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-orange-500 text-white rounded-md 
                    hover:bg-orange-600 transition-colors disabled:bg-orange-300"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <FaSpinner className="animate-spin mr-2" />
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-orange-500 text-white rounded-md 
                  hover:bg-orange-600 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}