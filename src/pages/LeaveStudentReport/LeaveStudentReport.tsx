import React, { useEffect, useState } from "react";
import axios from "axios";
import "./LeaveStudentReport.css";
import Navbar from "../Navbar/Navbar";
import jsPDF from "jspdf";
import { useCourseBranch } from "../CourseBranchContext/CourseBranchContext";

type LeaveStudent = {
  adm_no: number;
  name: string;
  course: string;
  branch: string;
  batch: string;
  phone: string;
  address: string;
  leaveStartDate: Date;
  leaveEndDate: Date;
};

const LeaveStudentReport: React.FC = () => {
  const [leaveStudents, setLeaveStudents] = useState<LeaveStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { course: selectedCourse, branch: selectedBranch } = useCourseBranch();

  const fetchLeaveReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:4000/api/leaveReport",
        {
          params: {
            course: selectedCourse,
            branch: selectedBranch,
          },
        }
      );

      // Parse dates
      const formattedData = response.data.map((student: any) => ({
        ...student,
        leaveStartDate: new Date(student.leaveStartDate),
        leaveEndDate: new Date(student.leaveEndDate),
      }));

      setLeaveStudents(formattedData);
    } catch (error) {
      console.error("Error fetching leave report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCourse && selectedBranch) {
      fetchLeaveReport();
    }
  }, [selectedCourse, selectedBranch]);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const downloadPDF = (leaveStudents: LeaveStudent[]) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Leave Student Report", 14, 15);

    const headers = [
      [
        "Admission No",
        "Name",
        "Course",
        "Branch",
        "Batch",
        "Phone",
        "Leave Start",
        "Leave End",
      ],
    ];

    const rows = leaveStudents.map((student) => [
      student.adm_no.toString(),
      student.name,
      student.course,
      student.branch,
      student.batch,
      student.phone,
      formatDate(student.leaveStartDate),
      formatDate(student.leaveEndDate),
    ]);

    (doc as any).autoTable({
      head: headers,
      body: rows,
      startY: 25,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save("LeaveStudentReport.pdf");
  };

  return (
    <div className="leave-report-container">
      <Navbar />
      <h2>Leave Report</h2>

      <button
        className="download-btn"
        onClick={() => downloadPDF(leaveStudents)}
      >
        Download PDF
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Admission Number</th>
              <th>Name</th>
              <th>Course</th>
              <th>Branch</th>
              <th>Batch</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Leave Start</th>
              <th>Leave End</th>
            </tr>
          </thead>
          <tbody>
            {leaveStudents.length > 0 ? (
              leaveStudents.map((student) => (
                <tr key={student.adm_no}>
                  <td>{student.adm_no}</td>
                  <td>{student.name}</td>
                  <td>{student.course}</td>
                  <td>{student.branch}</td>
                  <td>{student.batch}</td>
                  <td>{student.phone}</td>
                  <td>{student.address}</td>
                  <td>{formatDate(student.leaveStartDate)}</td>
                  <td>{formatDate(student.leaveEndDate)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9}>No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaveStudentReport;
