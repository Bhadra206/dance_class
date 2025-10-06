import { useEffect, useState } from "react";
import "./PastStudentReport.css";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import jsPDF from "jspdf";
import { useCourseBranch } from "../CourseBranchContext/CourseBranchContext";

type PastStudent = {
  name: string;
  course: string;
  batch: string;
  branch: string;
  time: string;
  phone: string;
  address: string;
};

const PastStudentReport = () => {
  const [students, setStudents] = useState<PastStudent[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  // const [selectedCourse, setSelectedCourse] = useState("");
  // const [selectedBranch, setSelectedBranch] = useState("");
  const { course: selectedCourse, branch: selectedBranch } = useCourseBranch();

  // useEffect(() => {
  //   const fetchDropdowns = async () => {
  //     const [courseRes, branchRes] = await Promise.all([
  //       axios.get("http://localhost:4000/api/courses"),
  //       axios.get("http://localhost:4000/api/branches"),
  //     ]);
  //     setCourses(courseRes.data.map((c: any) => c.name));
  //     setBranches(branchRes.data.map((b: any) => b.name));
  //   };
  //   fetchDropdowns();
  // }, []);

  useEffect(() => {
    const fetchPastStudents = async () => {
      try {
        const params: any = {};
        if (selectedCourse) params.course = selectedCourse;
        if (selectedBranch) params.branch = selectedBranch;

        const res = await axios.get("http://localhost:4000/api/paststudent/report", { params });
        setStudents(res.data);
      } catch (err) {
        console.error("Error fetching past student report");
      }
    };
    fetchPastStudents();
  }, [selectedCourse, selectedBranch]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Past Student Report", 14, 10);

    // Manually create table headers
    const headers = ["Name", "Course", "Batch", "Branch", "Time", "Phone", "Address"];
    const startX = 14;
    let startY = 20;

    // Draw headers
    headers.forEach((header, index) => {
      doc.text(header, startX + index * 30, startY);  // Adjust column width with * 30
    });

    startY += 10; // Move down after headers

    // Draw horizontal line below headers
    doc.line(startX, startY, startX + 210, startY); // Full page width

    // Draw data rows
    students.forEach((student) => {
      startY += 10; // Move down for the next row
      doc.text(student.name, startX, startY);
      doc.text(student.course, startX + 30, startY);
      doc.text(student.batch, startX + 60, startY);
      doc.text(student.branch, startX + 90, startY);
      doc.text(student.time, startX + 120, startY);
      doc.text(student.phone, startX + 150, startY);
      doc.text(student.address, startX + 180, startY);
    });

    // Save the PDF
    doc.save("PastStudentReport.pdf");
  };

  return (
    <div className="container">
      <Navbar />
      <h2 className="past-title">Past Student Report</h2>

      <div className="filters">
        {/* <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
          <option value="">All Courses</option>
          {courses.map((c, idx) => <option key={idx} value={c}>{c}</option>)}
        </select>

        <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
          <option value="">All Branches</option>
          {branches.map((b, idx) => <option key={idx} value={b}>{b}</option>)}
        </select> */}

        <button onClick={downloadPDF}>Download PDF</button>
      </div>

      <table className="past-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Course</th>
            <th>Batch</th>
            <th>Branch</th>
            <th>Time</th>
            <th>Phone</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, idx) => (
            <tr key={idx}>
              <td>{s.name}</td>
              <td>{s.course}</td>
              <td>{s.batch}</td>
              <td>{s.branch}</td>
              <td>{s.time}</td>
              <td>{s.phone}</td>
              <td>{s.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PastStudentReport;
