
import React, { useState, useEffect } from 'react';

import { FaPlus,FaEdit,FaBookOpen,FaCheckCircle,FaSearch } from 'react-icons/fa';
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = '/api';

// Main component for admin dashboard
export default function TestList()  {
  const [tests, setTests] = useState([]);
  const [showAddTest, setShowAddTest] = useState(false);
  const [showAddMarks, setShowAddMarks] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://localhost:7106/api/Test/get-all-tests');
      setTests(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tests. Please try again later.');
      console.error('Error fetching tests:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Test Management System</h1>
        <button
          onClick={() => setShowAddTest(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FaPlus size={20} />
          Add New Test
        </button>
      </div>

      <div className="grid gap-6">
        {tests.map((test) => (
          <TestCard
            key={test.id}
            test={test}
            onAddMarks={() => {
              setSelectedTest(test);
              setShowAddMarks(true);
            }}
          />
        ))}
      </div>

      {showAddTest && (
        <AddTestModal
          onClose={() => setShowAddTest(false)}
          onTestAdded={fetchTests}
        />
      )} 

       {showAddMarks && (
        <AddMarksModal
          test={selectedTest}
          onClose={() => {
            setShowAddMarks(false);
            setSelectedTest(null);
          }}
          onMarksAdded={fetchTests}
        />
      )}
    </div>
  );
};

// Component for displaying individual test cards
const TestCard = ({ test, onAddMarks }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{test.testName}</h2>
          <p className="text-gray-600">{test.dateConducted}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
          >
            <FaBookOpen size={20} />
            {showDetails ? 'Hide Details' : 'View Details'}
          </button>
          <button
            onClick={onAddMarks}
            className="flex items-center gap-1 text-green-600 hover:text-green-800"
          >
            <FaCheckCircle size={20} />
            Add Marks
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4">
          <p className="text-gray-700 mb-2">{test.testDescription}</p>
          <p className="font-semibold">Total Marks: {test.totalMarks}</p>
          
          <div className="mt-4 overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Student ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Marks</th>
                  <th className="px-4 py-2 text-left">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {test.students?.map((student) => (
                  <tr key={student.studentId} className="border-t">
                    <td className="px-4 py-2">{student.studentId}</td>
                    <td className="px-4 py-2">{student.studentName}</td>
                    <td className="px-4 py-2">{student.marksObtained}</td>
                    <td className="px-4 py-2">
                      {((student.marksObtained / test.totalMarks) * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Modal component for adding new test
const AddTestModal = ({ onClose, onTestAdded }) => {
  const [formData, setFormData] = useState({
    testName: '',
    testDescription: '',
    dateConducted: '',
    totalMarks: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Parse the date to get year, month, day
      const date = new Date(formData.dateConducted);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // JavaScript months are 0-based
      const day = date.getDate();
      const dayOfWeek = date.getDay();

      // Construct query parameters
      const params = new URLSearchParams({
        testName: formData.testName,
        testDescription: formData.testDescription,
        year: year,
        month: month,
        day: day,
        dayOfWeek: dayOfWeek,
        totalMarks: formData.totalMarks
      });

      // Make the API call with query parameters
      await axios.post(`https://localhost:7106/api/Test/add-test?${params.toString()}`);
      
      onTestAdded();
      onClose();
    } catch (err) {
      setError('Failed to add test. Please try again.');
      console.error('Error adding test:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Test</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Test Name</label>
            <input
              type="text"
              value={formData.testName}
              onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.testDescription}
              onChange={(e) => setFormData({ ...formData, testDescription: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date Conducted</label>
            <input
              type="date"
              value={formData.dateConducted}
              onChange={(e) => setFormData({ ...formData, dateConducted: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Marks</label>
            <input
              type="number"
              value={formData.totalMarks}
              onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
              min="0"
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Test'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



const AddMarksModal = ({ test, onClose, onMarksAdded }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('https://localhost:7106/api/User/all-users');
      const filteredStudents = response.data.filter(user => user.role === 1);
      setStudents(filteredStudents.map(student => ({
        ...student,
        marksObtained: '',
        remarks: ''
      })));
    } catch (err) {
      setError('Failed to fetch students. Please try again.');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarksChange = (studentId, field, value) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.studentId === studentId
          ? { ...student, [field]: value }
          : student
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Get all students who have marks entered
      const studentsWithMarks = students.filter(student => student.marksObtained);

      if (studentsWithMarks.length === 0) {
        setError('Please enter marks for at least one student.');
        return;
      }

      // Submit marks for each student
      const promises = studentsWithMarks.map(async (student) => {
        const params = new URLSearchParams({
          testId: test.testId.toString(), // Make sure we're using the correct property
          studentId: student.studentId.toString(),
          marksObtained: student.marksObtained.toString(),
          remarks: student.remarks || ''
        });

        return axios.post(`https://localhost:7106/api/Test/add-mark?${params.toString()}`);
      });

      // Wait for all requests to complete
      await Promise.all(promises);
      
      onMarksAdded();
      onClose();
    } catch (err) {
      setError('Failed to save marks. Please try again.');
      console.error('Error saving marks:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && students.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <p>Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Marks - {test.testName}</h2>
          <div className="text-gray-600">
            Total Marks: {test.totalMarks}
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Student ID</th>
                  <th className="px-4 py-2 text-left">Student Name</th>
                  <th className="px-4 py-2 text-left">Marks (Max: {test.totalMarks})</th>
                  <th className="px-4 py-2 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.studentId} className="border-t">
                    <td className="px-4 py-2">{student.studentId}</td>
                    <td className="px-4 py-2">{student.studentName}</td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={student.marksObtained}
                        onChange={(e) => handleMarksChange(student.studentId, 'marksObtained', e.target.value)}
                        className="w-24 rounded-md border border-gray-300 p-1"
                        min="0"
                        max={test.totalMarks}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={student.remarks}
                        onChange={(e) => handleMarksChange(student.studentId, 'remarks', e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-1"
                        placeholder="Optional remarks"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save All Marks'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};