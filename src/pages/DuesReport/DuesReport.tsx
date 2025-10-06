import { useEffect, useState } from "react";
import "./DuesReport.css";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import jsPDF from "jspdf";
import { useCourseBranch } from "../CourseBranchContext/CourseBranchContext";

type Due = {
  name: string;
  dues: number;
  batch: string;
};

const DuesReport = () => {
  const [dues, setDues] = useState<Due[]>([]);
  const { course: selectedCourse, branch: selectedBranch } = useCourseBranch();

  useEffect(() => {
    const fetchDuesReport = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/dues/report", {
          params: {
            course: selectedCourse,
            branch: selectedBranch,
          },
        });
        setDues(res.data);
      } catch (err) {
        console.log("Error fetching dues report", err);
      }
    };

    if (selectedCourse && selectedBranch) {
      fetchDuesReport();
    }
  }, [selectedCourse, selectedBranch]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Dues Report", 14, 15);

    const headers = ["Student Name", "Batch", "Amount"];
    const startX = 14;
    let startY = 25;

    // Table Headers
    headers.forEach((header, index) => {
      doc.text(header, startX + index * 50, startY);
    });

    startY += 10;
    doc.line(startX, startY, startX + 150, startY); // underline

    // Table Rows
    dues.forEach((due) => {
      startY += 10;
      doc.text(due.name, startX, startY);
      doc.text(due.batch, startX + 50, startY);
      doc.text(`₹${due.dues}`, startX + 100, startY);
    });

    doc.save("DuesReport.pdf");
  };

  return (
    <div className="container">
      <Navbar />
      <h2 className="duesReport-title">Dues Report</h2>

      <button className="download-btn" onClick={downloadPDF}>
        Download PDF
      </button>

      <table className="dues-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Batch</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {dues.map((due, idx) => (
            <tr key={idx}>
              <td>{due.name}</td>
              <td>{due.batch}</td>
              <td>₹{due.dues}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DuesReport;
