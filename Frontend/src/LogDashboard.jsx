import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api"; // Backend API URL

const LogDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [anomalies, setAnomalies] = useState([]);

  // Fetch Logs
  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/logs`);
      setLogs(response.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  // Fetch Anomalies
  const fetchAnomalies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/anomalies`);
      setAnomalies(response.data);
    } catch (error) {
      console.error("Error fetching anomalies:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchAnomalies();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-gray-800">AI-Powered Log & Anomaly Detection</h1>

      {/* Logs Table */}
      <div className="mt-6 bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-2xl font-semibold text-blue-600">Server Logs</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 mt-3">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border px-4 py-2 text-left">Timestamp</th>
                <th className="border px-4 py-2 text-left">Log Message</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <tr key={index} className="border hover:bg-gray-50">
                    <td className="px-4 py-2">{log.timestamp}</td>
                    <td className="px-4 py-2">{log.message}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center py-3 text-gray-500">No logs available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Anomalies Table */}
      <div className="mt-6 bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-2xl font-semibold text-red-600">Detected Anomalies</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-red-400 mt-3">
            <thead>
              <tr className="bg-red-100 text-red-700">
                <th className="border px-4 py-2 text-left">Timestamp</th>
                <th className="border px-4 py-2 text-left">Anomaly Description</th>
              </tr>
            </thead>
            <tbody>
              {anomalies.length > 0 ? (
                anomalies.map((anomaly, index) => (
                  <tr key={index} className="border hover:bg-red-50">
                    <td className="px-4 py-2">{anomaly.timestamp}</td>
                    <td className="px-4 py-2">{anomaly.description}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center py-3 text-gray-500">No anomalies detected</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refresh Buttons */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={fetchLogs}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
        >
          Refresh Logs
        </button>
        <button
          onClick={fetchAnomalies}
          className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-200"
        >
          Refresh Anomalies
        </button>
      </div>
    </div>
  );
};

export default LogDashboard;
