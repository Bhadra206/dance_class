import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./ReceiptForm.css";
import Navbar from "../Navbar/Navbar";

interface Student {
  _id: string;
  name: string;
  adm_no: string;
  batch: string;
  course: string;
  branch: string;
}

interface Receipt {
  adm_no: string;
  studentId: string;
  name: string;
  batch: string;
  amount: number;
  month: string;
  date: string;
  course: string;
  branch: string;
}

const ReceiptForm: React.FC = () => {
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [date, setDate] = useState("");
  const location = useLocation();
  const { student } = location.state as { student: Student };

  const handleSubmit = async () => {
    if (!student) return alert("No student selected");

    const receipt: Receipt = {
      adm_no: student.adm_no,
      studentId: student._id,
      name: student.name,
      batch: student.batch,
      amount: parseFloat(amount),
      month,
      date,
      course: student.course,
      branch: student.branch,
    };

    try {
      await axios.post("http://localhost:4000/api/payDues", receipt);
      alert("Receipt saved and dues updated");
    } catch (err) {
      console.error(err);
      alert("Failed to save receipt");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-200 to-blue-400 relative overflow-hidden">
      <Navbar />
      <div className="form-container">
        <h2 className="heading">Receipt</h2>

        <div className="formgroup">
          <label className="label">Adm no.</label>
          <input className="input" value={student?.adm_no || ""} readOnly />
        </div>

        <div className="formgroup">
          <label className="label">Name</label>
          <input className="input" value={student?.name || ""} readOnly />
        </div>

        <div className="formgroup">
          <label className="label">Batch</label>
          <input className="input" value={student?.batch || ""} readOnly />
        </div>

        <div className="formgroup">
          <label className="label">Course</label>
          <input className="input" value={student?.course || ""} readOnly />
        </div>

        <div className="formgroup">
          <label className="label">Branch</label>
          <input className="input" value={student?.branch || ""} readOnly />
        </div>

        <div className="formgroup">
          <label className="label">Amount</label>
          <input
            className="input"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="formgroup">
          <label className="label">Month</label>
          <input
            className="input"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>

        <div className="formgroup">
          <label className="label">Date</label>
          <input
            className="input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button onClick={handleSubmit} className="button">
          Paid
        </button>
      </div>
    </div>
  );
};

export default ReceiptForm;
