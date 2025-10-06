import { useEffect, useState } from "react";
import "./BatchReport.css";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import jsPDF from "jspdf";

type Batch = {
  batch: string;
  time: string;
  instructor: string;
  capacity: number;
};

const BatchReport = () => {
  const [batches, setBatches] = useState<Batch[]>([]);

  useEffect(() => {
    const fetchBatchReport = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/batch/report");
        setBatches(res.data);
      } catch (err) {
        console.error("Error fetching batch report", err);
      }
    };
    fetchBatchReport();
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Batch Report", 14, 10);

    // Manually create the table structure
    const headers = ["Batch Name", "Time", "Instructor", "Capacity"];
    const startX = 14; // Start position for the first column
    let startY = 20; // Start position for the first row (below the title)

    // Draw the table headers
    headers.forEach((header, index) => {
      doc.text(header, startX + index * 50, startY); // Adjust column spacing
    });

    // Draw a line below the headers
    startY += 10; // Move down to the next line after headers
    doc.line(startX, startY, startX + 200, startY); // Draw horizontal line

    // Draw the data rows
    batches.forEach((batch) => {
      startY += 10; // Move down for the next row

      // Add each data cell
      doc.text(batch.batch, startX, startY);
      doc.text(batch.time, startX + 50, startY); // Adjust for column
      doc.text(batch.instructor, startX + 100, startY); // Adjust for column
      doc.text(String(batch.capacity), startX + 150, startY); // Adjust for column
    });

    // Save the PDF
    doc.save("BatchReport.pdf");
  };

  return (
    <div className="container">
      <Navbar />
      <h2 className="batchReport-title">Batch Report</h2>

      <button className="download-btn" onClick={downloadPDF}>
        Download PDF
      </button>

      <table className="batch-table">
        <thead>
          <tr>
            <th>Batch Name</th>
            <th>Time</th>
            <th>Instructor</th>
            <th>Capacity</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((batch, idx) => (
            <tr key={idx}>
              <td>{batch.batch}</td>
              <td>{batch.time}</td>
              <td>{batch.instructor}</td>
              <td>{batch.capacity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BatchReport;
