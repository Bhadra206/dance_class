import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./StaffDetails.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

export interface Staff {
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

const StaffDetails: React.FC = () => {
  const navigate = useNavigate();
  const { staffId } = useParams<{ staffId: string }>();
  const [staff, setStaff] = useState<Staff | null>(null);

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/staffDetails/${staffId}`
        );
        setStaff(res.data);
      } catch (err) {
        console.error("Error fetching staff details", err);
      }
    };

    if (staffId) {
      fetchStaffDetails();
    }
  }, [staffId]);

  if (!staff) return <div>Loading...</div>;
  const handleViewReceipt = () => {
    if (staff) {
      navigate("/ReceiptForm", { state: { staff } });
    }
  };
  const handleDelete = async () => {
    if (
      staff &&
      window.confirm("Are you sure you want to delete this staff?")
    ) {
      try {
        await axios.post(
          `http://localhost:4000//api/staffDetails${staff._id}`
        );
        alert("Staff moved to Past Staffs successfully!");
        navigate("/staffs");
      } catch (error) {
        console.error("Error moving staff:", error);
        alert("Failed to delete staff.");
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
      <div className="staff-details-container">
        <Navbar />
        <div className="heading-row">
          <h2 className="heading">Staff Details</h2>
          <button className="fees-button" onClick={handleViewReceipt}>
            Fees
          </button>
          <button className="delete-button" onClick={handleDelete}>
            Delete
          </button>
        </div>
        <div className="staff-table-container">
          <table className="staff-details-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Adm No:</td>
                <td>{staff.adm_no}</td>
              </tr>
              <tr>
                <td>Name:</td>
                <td>{staff.name}</td>
              </tr>
              <tr>
                <td>Address:</td>
                <td>{staff.address}</td>
              </tr>
              <tr>
                <td>Phone No:</td>
                <td>{staff.phone}</td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>{staff.email}</td>
              </tr>
              <tr>
                <td>Date of Birth</td>
                <td>
                  {(() => {
                    const date = new Date(staff.dob);
                    const day = String(date.getDate()).padStart(2, "0");
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const year = date.getFullYear();
                    return `${day}-${month}-${year}`;
                  })()}
                </td>
              </tr>
              <tr>
                <td>Gender:</td>
                <td>{staff.gender}</td>
              </tr>
              <tr>
                <td>Religion:</td>
                <td>{staff.religion}</td>
              </tr>
              <tr>
                <td>Caste:</td>
                <td>{staff.caste}</td>
              </tr>
              <tr>
                <td>Nationality:</td>
                <td>{staff.nationality}</td>
              </tr>
              <tr>
                <td>Father's Name:</td>
                <td>{staff.fatherName}</td>
              </tr>
              <tr>
                <td>Father's Occupation:</td>
                <td>{staff.fatherOccupation}</td>
              </tr>
              <tr>
                <td>Father's Phone No.:</td>
                <td>{staff.fatherPhone}</td>
              </tr>
              <tr>
                <td>Mother's Name:</td>
                <td>{staff.motherName}</td>
              </tr>
              <tr>
                <td>Mother's Occupation:</td>
                <td>{staff.motherOccupation}</td>
              </tr>
              <tr>
                <td>Mother's Phone No.:</td>
                <td>{staff.motherPhone}</td>
              </tr>
              <tr>
                <td>Siblings:</td>
                <td>{staff.siblings}</td>
              </tr>
              <tr>
                <td>School/College:</td>
                <td>{staff.school}</td>
              </tr>
              <tr>
                <td>Branch:</td>
                <td>{staff.branch}</td>
              </tr>
              <tr>
                <td>Course:</td>
                <td>{staff.course}</td>
              </tr>
              <tr>
                <td>Batch:</td>
                <td>{staff.batch}</td>
              </tr>
              <tr>
                <td>Time:</td>
                <td>{staff.time}</td>
              </tr>

              <tr>
                <td>Dues:</td>
                <td>₹{staff.dues ?? 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffDetails;
