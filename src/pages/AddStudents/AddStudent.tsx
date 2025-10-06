import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./AddStudent.css";
import Navbar from "../Navbar/Navbar";

type PendingStudent = {
  _id: string;
  name: string;
  course: string;
};

const useQuery = () => new URLSearchParams(useLocation().search);

const AddStudent: React.FC = () => {
  const query = useQuery();
  const course = query.get("course") || "defaultCourse"; 
  const branch = query.get("branch") || "defaultBranch"; 

  const [pendingStudents, setPendingStudents] = useState<PendingStudent[]>([]);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/pending", {
           params: { course, branch },
         });
        setPendingStudents(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Failed to fetch pending students", error);
        setPendingStudents([]);
      }
    };

    if (course && branch) {
      fetchPending();
    }
  }, [course, branch]);

  const acceptStudent = async (id: string) => {
    await axios.post(`http://localhost:4000/api/student/${id}`);
  };

  const rejectStudent = async (id: string) => {
    await axios.delete(`http://localhost:4000/api/pending${id}`);
  };

  return (
    <div
      className="admin-dashboard-container"
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: `url('/Dance9.jpg')`, // 👈 use backticks and `url(...)`
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
    <div className="add-students-container">
      <Navbar/>
        <h1 className="title">Add Students</h1>
        {/* {pendingStudents.length === 0 ? ( */}
        {/*    <p>No pending students found.</p> */}
        {/* ) : ( */}
        <table className="students-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Course</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {pendingStudents.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.course}</td>
                <td className="actions">
                  <button
                    className="accept"
                    onClick={() => acceptStudent(student._id)}
                  >
                    ✔️
                  </button>
                  <button
                    className="reject"
                    onClick={() => rejectStudent(student._id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* )} */}
      </div>
    </div>
  );
};

export default AddStudent;
