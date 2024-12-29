import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [userToView, setUserToView] = useState(null);

    // Fetch users
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://localhost:7106/api/User/all-users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Error loading users');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;

        try {
            await axios.delete(`https://localhost:7106/api/User/delete/${userToDelete.id}`);
            setUsers(users.filter(u => u.id !== userToDelete.id));
            toast.success('User deleted successfully');
            setDeleteModalOpen(false);
            setUserToDelete(null);
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Error deleting user');
        }
    };

    const handleViewClick = (user) => {
        setUserToView(user);
        setViewModalOpen(true);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4 mt-16">
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            
            <div className="overflow-x-auto mt-10">
                <table className="min-w-full bg-zinc-900">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-center">Name</th>
                            <th className="px-6 py-3 text-center">Email</th>
                            <th className="px-6 py-3 text-center">Role</th>
                            <th className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b">
                                <td className="px-6 py-4">{`${user.firstName} ${user.lastName}`}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{user.role === 0 ? 'Admin' : 'Student'}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleDeleteClick(user)}
                                        className="bg-orange-700 text-white px-4 py-2 rounded hover:bg-orange-600"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => handleViewClick(user)}
                                        className="bg-green-900 text-white px-4 py-2 rounded hover:bg-green-800 ml-5"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg max-w-sm mx-auto">
                        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                        <p>Are you sure you want to delete {userToDelete?.firstName} {userToDelete?.lastName}?</p>
                        <div className="mt-4 flex justify-end space-x-3">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="px-4 py-2 border rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View User Modal */}
            {viewModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg max-w-md mx-auto">
                        <h3 className="text-lg font-semibold mb-4">User Details</h3>
                        <p><strong>Name:</strong> {`${userToView?.firstName} ${userToView?.lastName}`}</p>
                        <p><strong>Email:</strong> {userToView?.email}</p>
                        <p><strong>Student Id:</strong> {userToView?.studentId}</p>
                        <p><strong>Role:</strong> {userToView?.role === 0 ? 'Admin' : 'Student'}</p>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setViewModalOpen(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
