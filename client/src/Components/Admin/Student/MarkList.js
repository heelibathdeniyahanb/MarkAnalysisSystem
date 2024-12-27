import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MarkList = ({ studentId }) => {
  const [marks, setMarks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudentMarks();
  }, [studentId]);

  const fetchStudentMarks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://localhost:7106/api/Test/get-student-marks/${studentId}`);
      setMarks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch marks. Please try again later.');
      console.error('Error fetching marks:', err);
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

  if (!marks) return null;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">My Test Results</h1>
          <p className="text-gray-600">Student ID: {marks.studentId}</p>
          <p className="text-gray-600">Name: {marks.studentName}</p>
        </div>

        <div className="grid gap-4">
          {marks.marks.map((mark) => (
            <div key={mark.testId} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">{mark.testName}</h2>
                <span className="text-gray-600">{mark.dateConducted}</span>
              </div>
              
              <p className="text-gray-700 mb-2">{mark.testDescription}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Marks Obtained</p>
                  <p className="text-lg font-semibold">
                    {mark.marksObtained} / {mark.totalMarks}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Percentage</p>
                  <p className="text-lg font-semibold">
                    {((mark.marksObtained / mark.totalMarks) * 100).toFixed(2)}%
                  </p>
                </div>
              </div>

              {mark.remarks && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Remarks</p>
                  <p className="text-gray-700">{mark.remarks}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarkList;