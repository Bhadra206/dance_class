import { useEffect, useState } from "react";
import "./CourseReport.css";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import jsPDF from "jspdf";

type Course = {
  course: string;
  duration: string;
  fees: number;
  instructor: string;
};

const CourseReport = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourseReport = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/course/report");
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching course report", err);
      }
    };

    fetchCourseReport();
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Title of the report
    doc.text("Course Report", 14, 10);

    // Manually create the table structure
    const headers = ["Course Name", "Duration", "Fees", "Instructor"];
    const startX = 14; // Start position for the first column
    let startY = 20;  // Start position for the first row (below the title)

    // Draw the table headers
    headers.forEach((header, index) => {
      doc.text(header, startX + index * 40, startY); // 40px for column spacing
    });

    // Draw a line below the headers
    startY += 10; // Move down to the next line after headers
    doc.line(startX, startY, startX + 160, startY); // Draw horizontal line

    // Draw the data rows
    courses.forEach((course) => {
      startY += 10; // Move down for the next row

      // Manually add each cell's data
      doc.text(course.course, startX, startY);
      doc.text(course.duration, startX + 40, startY); // Adjust for column
      doc.text(`₹${course.fees}`, startX + 80, startY); // Adjust for column
      doc.text(course.instructor, startX + 120, startY); // Adjust for column
    });

    // Save the PDF
    doc.save("CourseReport.pdf");
  };

  return (
    <div className="container">
      <Navbar />
      <h2 className="courseReport-title">Course Report</h2>

      <button className="download-btn" onClick={downloadPDF}>
        Download PDF
      </button>

      <table className="course-table">
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Duration</th>
            <th>Fees</th>
            <th>Instructor</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, idx) => (
            <tr key={idx}>
              <td>{course.course}</td>
              <td>{course.duration}</td>
              <td>{course.fees}</td>
              <td>{course.instructor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseReport;
