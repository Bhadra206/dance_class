import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./StudentDetails.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

export interface Student {
  _id?: string;
  adm_no: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;
  religion: string;
  caste: string;
  nationality: string;
  fatherName: string;
  fatherOccupation: string;
  fatherPhone: string;
  motherName: string;
  motherOccupation: string;
  motherPhone: string;
  siblings: string;
  school: string;
  branch: string;
  course: string;
  batch: string;
  time: string;
  dues?: number;
}

const StudentDetails: React.FC = () => {
  const navigate = useNavigate();
  const { studentId } = useParams<{ studentId: string }>();
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/studentDetails/${studentId}`
        );
        setStudent(res.data);
      } catch (err) {
        console.error("Error fetching student details", err);
      }
    };

    if (studentId) {
      fetchStudentDetails();
    }
  }, [studentId]);

  if (!student) return <div>Loading...</div>;
  const handleViewReceipt = () => {
    if (student) {
      navigate("/ReceiptForm", { state: { student } });
    }
  };
  const handleDelete = async () => {
    if (
      student &&
      window.confirm("Are you sure you want to delete this student?")
    ) {
      try {
        await axios.post(
          `http://localhost:4000//api/studentDetails${student._id}`
        );
        alert("Student moved to Past Students successfully!");
        navigate("/students");
      } catch (error) {
        console.error("Error moving student:", error);
        alert("Failed to delete student.");
      }
    }
  };

  return (
    <div
      className="admin-dashboard-container"
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: `url('/Dance9.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="student-details-container">
        <Navbar />
        <div className="heading-row">
          <h2 className="heading">Student Details</h2>
          <button className="fees-button" onClick={handleViewReceipt}>
            Fees
          </button>
          <button className="delete-button" onClick={handleDelete}>
            Delete
          </button>
        </div>
        <div className="student-table-container">
          <table className="student-details-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Adm No:</td>
                <td>{student.adm_no}</td>
              </tr>
              <tr>
                <td>Name:</td>
                <td>{student.name}</td>
              </tr>
              <tr>
                <td>Address:</td>
                <td>{student.address}</td>
              </tr>
              <tr>
                <td>Phone No:</td>
                <td>{student.phone}</td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>{student.email}</td>
              </tr>
              <tr>
                <td>Date of Birth</td>
                <td>
                  {(() => {
                    const date = new Date(student.dob);
                    const day = String(date.getDate()).padStart(2, "0");
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const year = date.getFullYear();
                    return `${day}-${month}-${year}`;
                  })()}
                </td>
              </tr>
              <tr>
                <td>Gender:</td>
                <td>{student.gender}</td>
              </tr>
              <tr>
                <td>Religion:</td>
                <td>{student.religion}</td>
              </tr>
              <tr>
                <td>Caste:</td>
                <td>{student.caste}</td>
              </tr>
              <tr>
                <td>Nationality:</td>
                <td>{student.nationality}</td>
              </tr>
              <tr>
                <td>Father's Name:</td>
                <td>{student.fatherName}</td>
              </tr>
              <tr>
                <td>Father's Occupation:</td>
                <td>{student.fatherOccupation}</td>
              </tr>
              <tr>
                <td>Father's Phone No.:</td>
                <td>{student.fatherPhone}</td>
              </tr>
              <tr>
                <td>Mother's Name:</td>
                <td>{student.motherName}</td>
              </tr>
              <tr>
                <td>Mother's Occupation:</td>
                <td>{student.motherOccupation}</td>
              </tr>
              <tr>
                <td>Mother's Phone No.:</td>
                <td>{student.motherPhone}</td>
              </tr>
              <tr>
                <td>Siblings:</td>
                <td>{student.siblings}</td>
              </tr>
              <tr>
                <td>School/College:</td>
                <td>{student.school}</td>
              </tr>
              <tr>
                <td>Branch:</td>
                <td>{student.branch}</td>
              </tr>
              <tr>
                <td>Course:</td>
                <td>{student.course}</td>
              </tr>
              <tr>
                <td>Batch:</td>
                <td>{student.batch}</td>
              </tr>
              <tr>
                <td>Time:</td>
                <td>{student.time}</td>
              </tr>

              <tr>
                <td>Dues:</td>
                <td>₹{student.dues ?? 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
