import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BatchDetails.css";

interface Batch {
  batchName: string;
  time: string;
  instructorName: string;
  studentCapacity: number;
}

const BatchDetails: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/batch");
        setBatches(res.data);
      } catch (error) {
        console.error("Failed to fetch batches:", error);
      }
    };

    fetchBatches();
  }, []);

  return (
    <div
      className="container"
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="batch-details-container">
        <div className="batch-header">
          <h1 className="batch-title">Batch Details</h1>
          <button className="add-batch-button">Add Batch</button>
        </div>
        <div className="overflow-x-auto">
          <table className="batch-table">
            <thead>
              <tr>
                <th>Batch</th>
                <th>Time</th>
                <th>Name of the Instructor</th>
                <th>Student Capacity</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch, index) => (
                <tr key={index}>
                  <td>{batch.batchName}</td>
                  <td>{batch.time}</td>
                  <td>{batch.instructorName}</td>
                  <td>{batch.studentCapacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BatchDetails;
