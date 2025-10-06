import { useEffect, useState } from "react";
import "./BranchReport.css";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import jsPDF from "jspdf";

type Branch = { branch: string; time: string; day: string };

const BranchReport = () => {
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    const fetchBranchReport = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/branch/report");
        setBranches(res.data);
      } catch (err) {
        console.error("Error fetching branch report", err);
      }
    };
    fetchBranchReport();
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Title of the report
    doc.text("Branch Report", 14, 10);

    // Table headers
    const headers = ["Branch Name", "Time", "Day"];
    const startX = 14;
    let startY = 20; // Position for the first row (below the title)

    // Draw the table headers
    headers.forEach((header, index) => {
      doc.text(header, startX + index * 50, startY); // Adjust column spacing
    });

    // Draw a line below the headers
    startY += 10; // Move down to the next line after headers
    doc.line(startX, startY, startX + 150, startY); // Draw horizontal line

    // Draw the data rows
    branches.forEach((branch) => {
      startY += 10; // Move down for the next row

      // Add each data cell
      doc.text(branch.branch, startX, startY);
      doc.text(branch.time, startX + 50, startY); // Adjust for column
      doc.text(branch.day, startX + 100, startY); // Adjust for column
    });

    // Save the PDF
    doc.save("BranchReport.pdf");
  };

  return (
    <div className="container">
      <Navbar />
      <h2 className="branchReport-title">Branch Report</h2>

      <button className="download-btn" onClick={downloadPDF}>
        Download PDF
      </button>

      <table className="branch-table">
        <thead>
          <tr>
            <th>Branch</th>
            <th>Time</th>
            <th>Day</th>
          </tr>
        </thead>
        <tbody>
          {branches.map((branch, idx) => (
            <tr key={idx}>
              <td>{branch.branch}</td>
              <td>{branch.time}</td>
              <td>{branch.day}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BranchReport;
