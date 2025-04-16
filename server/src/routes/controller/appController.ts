import { NextFunction, Request, Response } from "express";
require("dotenv").config();
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
const saltRounds = 10;
import Pending from "../../schemas/pendingSchema";
import Student from "../../schemas/studentSchema";
import { getNextAdmissionNumber } from "../../utils/generateAdmNo";
import Course from "../../schemas/courseSchema";
import Branch from "../../schemas/branchSchema";
import { sendMail } from "../../utils/mailer";
import Login from "../../schemas/loginSchema";
 
export default class AppController {
  public static async Login(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
  // Registeration -> Pending Collection
  public static async RegisterPending(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        name,
        address,
        phone,
        email,
        dob,
        gender,
        religion,
        caste,
        nationality,
        fatherName,
        fatherOccupation,
        fatherPhone,
        motherName,
        motherOccupation,
        motherPhone,
        siblings,
        school,
        branch,
        course,
      } = req.body;

      const newStudent = new Pending({
        name,
        address,
        phone,
        email,
        dob,
        gender,
        religion,
        caste,
        nationality,
        fatherName,
        fatherOccupation,
        fatherPhone,
        motherName,
        motherOccupation,
        motherPhone,
        siblings,
        school,
        branch,
        course,
      });

      await newStudent.save();

      res.status(201).json({
        message: "Student registration submitted successfully!",
      });
    } catch (e) {
      console.log("Registration error:", e);
      res.status(500).json({ message: "Registration failed." });
    }
  }
  // Student Summary
  public static async GetStudents(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const students = await Student.find(
        {},
        "name phone email address status paymentStatus"
      );
      res.status(200).json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Failed to fetch students" });
    }
  }
  // Pending Student Summary
  public static async GetPendingStudents(req: Request, res: Response) {
    try {
      // const { course, branch } = req.query;
      const pendingStudents = await Pending.find();

      res.status(200).json(pendingStudents);
    } catch (error) {
      console.error("Error fetching pending students", error);
      res.status(500).json({ message: "Failed to fetch pending students" });
    }
  }
  // After Accepting Student
  public static async AcceptStudent(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const pendingStudent = await Pending.findById(id);
      if (!pendingStudent)
        return res.status(404).json({ message: "Student not found" });

      const adm_no = await getNextAdmissionNumber();

      // Generate random password
      const plainPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

      const approvedStudent = new Student({
        ...pendingStudent.toObject(),
        adm_no,
        status: "Active",
        paymentStatus: "Paid",
        approvedAt: new Date(),
        password: hashedPassword,
        username: pendingStudent.email,
        role: "user",
      });

      await approvedStudent.save();
      await Pending.findByIdAndDelete(id);
      
      // Save to Login collection
      const loginEntry = new Login({
        username: pendingStudent.email,
        password: plainPassword,
        role: "user",
      });

      await loginEntry.save();

      // Send email with login credentials
      const htmlContent = `
        <p>Hi ${pendingStudent.name},</p>
        <p>Your registration has been approved!</p>
        <p><strong>Username:</strong> ${pendingStudent.email}</p>
        <p><strong>Password:</strong> ${plainPassword}</p>
        <p>Please login and change your password after your first login.</p>
        <br/>
        <p>Thanks,<br/>Dance Class Management Team</p>
      `;

      await sendMail(
        pendingStudent.email,
        "Registration Approved",
        htmlContent
      );

      res.status(200).json({
        message: "Student approved and credentials sent via email",
        adm_no,
      });
    } catch (error) {
      console.error("Error accepting student:", error);
      res.status(500).json({ message: "Failed to approve student" });
    }
  }

  // Reject student method
  public static async RejectStudent(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const result = await Pending.findByIdAndDelete(id);
      if (!result)
        return res.status(404).json({ message: "Student not found" });

      res.status(200).json({ message: "Student rejected successfully" });
    } catch (error) {
      console.error("Error rejecting student:", error);
      res.status(500).json({ message: "Failed to reject student" });
    }
  }
  // Dropdown course
  public static async GetCourses(req: Request, res: Response) {
    try {
      const courses = await Course.find({}, "course");
      res.status(200).json(courses);
    } catch (err) {
      console.error("Error fetching courses:", err);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  }
  // Dropdown branch
  public static async GetBranches(req: Request, res: Response) {
    try {
      const branches = await Branch.find({}, "branch");
      res.status(200).json(branches);
    } catch (err) {
      console.error("Error fetching branches:", err);
      res.status(500).json({ message: "Failed to fetch branches" });
    }
  }
}
