import React, { useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import { useCourseBranch } from "../CourseBranchContext/CourseBranchContext";
import "./CashBook.css";

interface LedgerEntry {
  date: string;
  name: string;
  adm_no: string;
  amount: number;
  course: string;
  branch: string;
  batch: string;
}

const CashBook: React.FC = () => {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const { course, branch } = useCourseBranch();
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchData = async () => {
    if (!fromDate || !toDate) return;
    try {
      const response = await axios.get("http://localhost:4000/api/cashBook", {
        params: { course, branch, fromDate, toDate },
      });
      setEntries(response.data);
    } catch (err) {
      console.error("Error fetching cash book:", err);
    }
  };

  return (
    <div className="cashbook-container">
      <Navbar />
      <h2 className="cashbook-title">Cash Book Report</h2>

      <div className="cashbook-filters">
        <label>
          From:{" "}
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>
        <label>
          To:{" "}
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </label>
        <button onClick={fetchData}>Generate Report</button>
      </div>

      <table className="cashbook-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Admission No</th>
            <th>Name</th>
            <th>Course</th>
            <th>Branch</th>
            <th>Batch</th>
            <th>Amount Paid</th>
          </tr>
        </thead>
        <tbody>
          {entries.length > 0 ? (
            entries.map((entry, idx) => (
              <tr key={idx}>
                <td>{formatDate(entry.date)}</td>
                <td>{entry.adm_no}</td>
                <td>{entry.name}</td>
                <td>{entry.course}</td>
                <td>{entry.branch}</td>
                <td>{entry.batch}</td>
                <td>₹{entry.amount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>No records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CashBook;
