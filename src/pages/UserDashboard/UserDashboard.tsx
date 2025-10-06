import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar2 from "../Navbar2/Navbar2";
import "./UserDashboard.css";

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

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        //console.log("Token from localStorage:", token);

        const res = await axios.get("http://localhost:4000/api/students/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        localStorage.setItem('student', JSON.stringify(res.data));
        setStudent(res.data);
      } catch (err) {
        console.error("Error fetching student details", err);
      }
    };

    fetchUserDetails();
  }, []);

  if (!student) return <div>Loading your dashboard...</div>;

  const handleUpdate = () => {
    navigate("/studentUpdateForm", { state: { student } });
  };

  return (
    <div className="student-details-container">
      <Navbar2 />
      <div className="heading-row">
        <h2 className="heading">Welcome, {student.name}</h2>
        <button className="update-button" onClick={handleUpdate}>
          Update
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
              <td>Admission No</td>
              <td>{student.adm_no}</td>
            </tr>
            <tr>
              <td>Name</td>
              <td>{student.name}</td>
            </tr>
            <tr>
              <td>Address</td>
              <td>{student.address}</td>
            </tr>
            <tr>
              <td>Phone</td>
              <td>{student.phone}</td>
            </tr>
            <tr>
              <td>Email</td>
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
              <td>Gender</td>
              <td>{student.gender}</td>
            </tr>
            <tr>
              <td>Religion</td>
              <td>{student.religion}</td>
            </tr>
            <tr>
              <td>Caste</td>
              <td>{student.caste}</td>
            </tr>
            <tr>
              <td>Nationality</td>
              <td>{student.nationality}</td>
            </tr>
            <tr>
              <td>Father's Name</td>
              <td>{student.fatherName}</td>
            </tr>
            <tr>
              <td>Father's Occupation</td>
              <td>{student.fatherOccupation}</td>
            </tr>
            <tr>
              <td>Father's Phone</td>
              <td>{student.fatherPhone}</td>
            </tr>
            <tr>
              <td>Mother's Name</td>
              <td>{student.motherName}</td>
            </tr>
            <tr>
              <td>Mother's Occupation</td>
              <td>{student.motherOccupation}</td>
            </tr>
            <tr>
              <td>Mother's Phone</td>
              <td>{student.motherPhone}</td>
            </tr>
            <tr>
              <td>Siblings</td>
              <td>{student.siblings}</td>
            </tr>
            <tr>
              <td>School/College</td>
              <td>{student.school}</td>
            </tr>
            <tr>
              <td>Branch</td>
              <td>{student.branch}</td>
            </tr>
            <tr>
              <td>Course</td>
              <td>{student.course}</td>
            </tr>
            <tr>
              <td>Dues</td>
              <td>₹{student.dues ?? 0}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentDashboard;
