import React, { useEffect, useState } from "react";
import "./registration.css";
// import Navbar from "../Navbar/Navbar";
import InputElement from "./InputElement/InputElement";
import axios from "axios";

const Registration: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    dob: "",
    gender: "",
    religion: "",
    caste: "",
    nationality: "",
    fatherName: "",
    fatherOccupation: "",
    fatherPhone: "",
    motherName: "",
    motherOccupation: "",
    motherPhone:"",
    siblings: "",
    school: "",
    branch: "",
    course: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields = [
      "name",
      "address",
      "phone",
      "email",
      "dob",
      "gender",
      "religion",
      "caste",
      "nationality",
      "fatherName",
      "fatherOccupation",
      "fatherPhone",
      "motherName",
      "motherOccupation",
      "motherPhone",
      "siblings",
      "branch",
      "course",
    ];

    for (let field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        alert(`${field.replace(/([A-Z])/g, " $1")} is required`);
        return;
      }
    }

    try {
      const res = await axios.post(
        "http://localhost:4000/api/pending",
        formData
      );
      alert("Registration submitted for admin approval!");
      console.log("Server response:", res.data);

      // Optionally reset form
      // setFormData({
      //   name: "",
      //   address: "",
      //   phone: "",
      //   email: "",
      //   dob: "",
      //   gender: "",
      //   religion: "",
      //   caste: "",
      //   nationality: "",
      //   fatherName: "",
      //   fatherOccupation: "",
      //   fatherPhone: "",
      //   motherName: "",
      //   motherOccupation: "",
      //   motherPhone:"",
      //   siblings: "",
      //   school: "",
      //   branch: "",
      //   course: "",
      // });
    } catch (error) {
      console.error("Form submission error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };
  const [courseOptions, setCourseOptions] = useState<
    { _id: string; course: string }[]
  >([]);
  const [branchOptions, setBranchOptions] = useState<
    { _id: string; branch: string }[]
  >([]);

  useEffect(() => {
    axios.get("http://localhost:4000/api/course").then((res) => {
      setCourseOptions(res.data);
    });

    axios.get("http://localhost:4000/api/branch").then((res) => {
      setBranchOptions(res.data);
    });
  }, []);

  return (
    <>
      {/* <Navbar/> */}
      {/* <div className="registration-container"> */}
      <div
        style={{ width: "100vw", display: "flex", justifyContent: "center" }}
      >
        <h1 className="reg-title">Registration</h1>
      </div>

      <form className="registration-form" onSubmit={handleSubmit}>
        {/* Left Form Fields */}
        <div className="form-left">
          <InputElement
            label="Name:"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <div className="form-group">
            <label>Address:</label>
            <div>
              <textarea name="address" onChange={handleChange}></textarea>
            </div>
          </div>

          <InputElement
            label="Phone No:"
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <InputElement
            label="Email:"
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <InputElement
            label="Date of Birth:"
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />

          <InputElement
            label="Gender:"
            type="radio"
            name="gender"
            onChange={handleChange}
          />

          <InputElement
            label="Religion:"
            type="text"
            name="religion"
            value={formData.religion}
            onChange={handleChange}
          />

          <InputElement
            label="Caste:"
            type="text"
            name="caste"
            value={formData.caste}
            onChange={handleChange}
          />

          <InputElement
            label="Nationality:"
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
          />

          <InputElement
            label="Father's Name:"
            type="text"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
          />

          <InputElement
            label="Father’s Occupation:"
            type="text"
            name="fatherOccupation"
            value={formData.fatherOccupation}
            onChange={handleChange}
          />

          <InputElement
            label="Father’s Phone No.:"
            type="text"
            name="fatherPhone"
            value={formData.fatherPhone}
            onChange={handleChange}
          />

          <InputElement
            label="Mother’s Name:"
            type="text"
            name="motherName"
            value={formData.motherName}
            onChange={handleChange}
          />

          <InputElement
            label="Mother’s Occupation:"
            type="text"
            name="motherOccupation"
            value={formData.motherOccupation}
            onChange={handleChange}
          />

          <InputElement
            label="Mother’s Phone No.:"
            type="text"
            name="motherPhone"
            value={formData.motherPhone}
            onChange={handleChange}
          />

          <InputElement
            label="Siblings:"
            type="text"
            name="siblings"
            value={formData.siblings}
            onChange={handleChange}
          />

          <InputElement
            label="School/College:"
            type="text"
            name="school"
            value={formData.school}
            onChange={handleChange}
          />

          <div className="form-group">
            <label>Course:</label>
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
            >
              <option value="">Select Course</option>
              {courseOptions.map((courseObj) => (
                <option key={courseObj._id} value={courseObj.course}>
                  {courseObj.course}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Branch:</label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
            >
              <option value="">Select Branch</option>
              {branchOptions.map((branchObj) => (
                <option key={branchObj._id} value={branchObj.branch}>
                  {branchObj.branch}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Submit Button */}
        <button type="submit" className="submit-btn">
          Sign Up
        </button>
      </form>
      {/* </div> */}
    </>
  );
};

export default Registration;
