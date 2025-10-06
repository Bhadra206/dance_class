import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RegistrationReport.css";
import { useCourseBranch } from "../CourseBranchContext/CourseBranchContext";
import Navbar from "../Navbar/Navbar";
import jsPDF from "jspdf";

interface Student {
  _id: string;
  name: string;
  course: string;
  branch: string;
  batch: string;
  admissionNumber: string;
  phone: string;
  registrationDate: string;
}

const RegistrationReport: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const { course: selectedCourse, branch: selectedBranch } = useCourseBranch();

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/registration", {
        params: {
          course: selectedCourse,
          branch: selectedBranch,
        },
      });
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    if (selectedCourse && selectedBranch) {
      fetchData();
    }
  }, [selectedCourse, selectedBranch]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Registration Report", 14, 10);

    const headers = [
      "Admission No",
      "Name",
      "Course",
      "Branch",
      "Batch",
      "Phone",
      "Date",
    ];

    const startX = 14;
    let startY = 20;

    // Draw headers
    headers.forEach((header, index) => {
      doc.text(header, startX + index * 30, startY);
    });

    startY += 10; // Move to next row

    // Draw rows
    students.forEach((s) => {
      const row = [
        s.admissionNumber,
        s.name,
        s.course,
        s.branch,
        s.batch,
        s.phone,
        new Date(s.registrationDate).toLocaleDateString(),
      ];

      row.forEach((cell, index) => {
        doc.text(String(cell), startX + index * 30, startY);
      });

      startY += 10;

      // Handle page overflow
      if (startY > 270) {
        doc.addPage();
        startY = 20;
      }
    });

    doc.save("RegistrationReport.pdf");
  };

  return (
    <div className="report-container">
      <Navbar />
      <h2 className="report-title">Registration Report</h2>

      <button onClick={downloadPDF} className="download-button">
        Download PDF
      </button>

      <table className="report-table">
        <thead>
          <tr>
            <th>Admission No</th>
            <th>Name</th>
            <th>Course</th>
            <th>Branch</th>
            <th>Batch</th>
            <th>Phone</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>{s.admissionNumber}</td>
              <td>{s.name}</td>
              <td>{s.course}</td>
              <td>{s.branch}</td>
              <td>{s.batch}</td>
              <td>{s.phone}</td>
              <td>{new Date(s.registrationDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegistrationReport;
