import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Child from '../../../Images/Child.png';

import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../../UserContext";

export default function Login() {
  const {setUser} = useContext(UserContext)
  const navigate = useNavigate()
  const [data, setData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading,setLoading]=useState(false)

  
 const loginUser = async (e) => {
        e.preventDefault();
        
        try {
            const {email, password} = data;

            if(!email || !password) {
                toast.error('Please fill all fields')
                return;
            }

            const response = await axios.post('https://localhost:7106/api/User/login',{email, password});
            
            const userData = response.data;
            console.log('User Data:', userData); // Add this log
        console.log('Role:', userData.user.role); // Add this log

            if(userData.error){
                toast.error(userData.error)
            } else{
                //update context and local storage
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));

                //clear form
                setData({
                    email: '',
                    password: ''
                });

                toast.success('Logged in successfully');

              
                if (userData.user.role === 0)
                  navigate('/admin-dashboard');
                else if (userData.user.role === 1)
                navigate('/student-dashboard');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            toast.error('Error logging in. Please try again');
        } 
    }
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setData(prev => ({
            ...prev,
            [name]: value
        }))
    }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src={Child}
          className="mx-auto h-14 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {(error ) && (
          <div className="mb-4 p-3 text-sm text-red-500 bg-red-100 rounded-md">
            {error }
          </div>
        )}

        <form onSubmit={loginUser} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-left">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={data.email}
                onChange={handleInputChange}
                required
                autoComplete="email"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
               
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="text-sm">
                <Link to="/forgot-password" className="font-semibold text-[#AF582B] hover:text-indigo-500">
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={data.password}
                onChange={handleInputChange}
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md bg-[#AF582B] px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-10 text-center text-sm">
          Not a member?{' '}
          <Link to="/signup" className="font-semibold text-[#AF582B] hover:text-indigo-500">
            Sign Up Here
          </Link>
        </p>
      </div>
    </div>
  );
}