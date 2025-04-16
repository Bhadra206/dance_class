// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useLocation } from "react-router-dom";
// import "./AddStudent.css";

// type PendingStudent = {
//   _id: string;
//   name: string;
//   course: string;
// };

// const useQuery = () => new URLSearchParams(useLocation().search);

// const AddStudent: React.FC = () => {
//   const query = useQuery();
//   const course = query.get("course") || "";
//   const branch = query.get("branch") || "";

//   const [pendingStudents, setPendingStudents] = useState<PendingStudent[]>([]);

//   useEffect(() => {
//     const fetchPending = async () => {
//       try {
//         const res = await axios.get("/api/pending", {
//           params: { course, branch },
//         });
//         setPendingStudents(res.data);
//       } catch (error) {
//         console.error("Failed to fetch pending students", error);
//       }
//     };

//     fetchPending();
//   }, [course, branch]);

//   const acceptStudent = async (id: string) => {
//     await axios.post(`/api/acceptStudent/${id}`);
//   };

//   const rejectStudent = async (id: string) => {
//     await axios.delete(`/api/rejectStudent/${id}`);
//   };

//   return (
//     <div className="add-students-container">
//       <h1>Add Students</h1>
//       <table className="students-table">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Course</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {pendingStudents.map((student) => (
//             <tr key={student._id}>
//               <td>{student.name}</td>
//               <td>{student.course}</td>
//               <td className="actions">
//                 <button className="accept" onClick={() => acceptStudent(student._id)}>✔️</button>
//                 <button className="reject" onClick={() => rejectStudent(student._id)}>🗑️</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AddStudent;

import React, { useEffect, useState } from "react";
import axios from "axios";
// import { useLocation } from "react-router-dom";
import "./AddStudent.css";

type PendingStudent = {
  _id: string;
  name: string;
  course: string;
};

// const useQuery = () => new URLSearchParams(useLocation().search);

const AddStudent: React.FC = () => {
  // const query = useQuery();
  // const course = query.get("course") || "defaultCourse"; // Assign a default value
  // const branch = query.get("branch") || "defaultBranch"; // Assign a default value

  const [pendingStudents, setPendingStudents] = useState<PendingStudent[]>([]);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/pending", {
          // params: { course, branch },
        });
        setPendingStudents(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Failed to fetch pending students", error);
        setPendingStudents([]); // Ensure it's an array on error
      }
    };

    fetchPending();
  }, []); //course, branch

  const acceptStudent = async (id: string) => {
    await axios.post(`http://localhost:4000/api/student/${id}`);
  };

  const rejectStudent = async (id: string) => {
    await axios.delete(`http://localhost:4000/api/pending${id}`);
  };

  return (
    <div
      className="container"
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="add-students-container">
        <h1>Add Students</h1>
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
