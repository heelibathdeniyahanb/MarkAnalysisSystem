import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const TestAnalysis = () => {
    const [testComparisonData, setTestComparisonData] = useState([]);
    const [topStudentsData, setTopStudentsData] = useState([]);

    useEffect(() => {
        const fetchTestComparison = async () => {
            try {
                const response = await axios.get("https://localhost:7106/api/Test/compare-tests");
                setTestComparisonData(response.data);
            } catch (error) {
                console.error("Error fetching test comparison data:", error);
            }
        };

        const fetchTopStudents = async () => {
            try {
                const response = await axios.get("https://localhost:7106/api/Test/top-students");
                setTopStudentsData(response.data);
            } catch (error) {
                console.error("Error fetching top students data:", error);
            }
        };

        fetchTestComparison();
        fetchTopStudents();
    }, []);

    return (
        <div>
            <h3>Test and Student Analysis</h3>

            {/* Test Comparison Chart */}
            <div>
                <h4>Comparison of Maximum Average Marks by Test</h4>
                {testComparisonData.length > 0 ? (
                    <BarChart width={600} height={300} data={testComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="testId" label={{ value: "Test ID", position: "insideBottom", offset: -5 }} />
                        <YAxis label={{ value: "Average Marks", angle: -90, position: "insideLeft" }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="averageMarks" fill="#8884d8" name="Average Marks" />
                    </BarChart>
                ) : (
                    <p>Loading test comparison data...</p>
                )}
            </div>

            {/* Top Students Chart */}
            <div>
                <h4>Top 5 Students by Average Marks</h4>
                {topStudentsData.length > 0 ? (
                    <BarChart width={600} height={300} data={topStudentsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="studentId"
                            label={{ value: "Student ID", position: "insideBottom", offset: -5 }}
                            tickFormatter={(id) => `ID: ${id}`}
                        />
                        <YAxis label={{ value: "Average Marks", angle: -90, position: "insideLeft" }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="averageMarks" fill="#82ca9d" name="Average Marks" />
                    </BarChart>
                ) : (
                    <p>Loading top students data...</p>
                )}
            </div>
        </div>
    );
};

export default TestAnalysis;
