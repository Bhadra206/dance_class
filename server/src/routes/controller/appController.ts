import { NextFunction, Request, Response } from "express";
require("dotenv").config();
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const saltRounds = 10;
import Pending from "../../schemas/pendingSchema";
import Student from "../../schemas/studentSchema";
import { getNextAdmissionNumber } from "../../utils/generateAdmNo";
import Course from "../../schemas/courseSchema";
import Branch from "../../schemas/branchSchema";
import Batch from "../../schemas/batchSchema";
import { sendMail } from "../../utils/mailer";
import Login from "../../schemas/loginSchema";
import PastStudent from "../../schemas/pastStudent";
import Admin from "../../schemas/adminSchema";
import Leave from "../../schemas/leaveSchema";
import LeaveStudent from "../../schemas/leaveStudentSchema";
import { sendPaymentConfirmation } from "../../utils/mailer";
import Dues from "../../schemas/duesSchema";
import Registration from "../../schemas/registrationSchema";
import Ledger from "../../schemas/legerSchema";

export default class AppController {
  //Login
  public static async Login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
console.log(username);
      // Find user in login collection
      const user = await Login.findOne({ username });
      console.log(user);

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid username" });
      }

      // Compare hashed password (now applies to all roles)
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log(isValidPassword);
      if (!isValidPassword) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid password" });
      }

      // Find student document for student-specific ID
      let studentDoc = null;

      if (user.role === "user") {
        // First, try finding in the main student collection
        studentDoc = await Student.findOne({ email: username });

        if (!studentDoc) {
          // If not found in Student, try the LeaveStudent collection
          console.log(
            `Student not found in Student collection. Checking LeaveStudent...`
          );
          studentDoc = await LeaveStudent.findOne({ email: username });

          if (!studentDoc) {
            // If not found in both collections
            return res.status(404).json({
              success: false,
              message:
                "Student record not found in both student and leave records",
            });
          } else {
            console.log("Student found in LeaveStudent collection");
          }
        } else {
          console.log("Student found in Student collection");
        }
        // Create JWT payload
        const payload = {
          id: user.role === "user" ? studentDoc._id : user._id,
          role: user.role,
        };

        const token = jwt.sign(
          payload,
          process.env.JWT_SECRET || "fallbackSecret",
          {
            expiresIn: "1d",
          }
        );
        // Return successful response
        res.status(200).json({
          success: true,
          token,
          user: {
            username: user.username,
            role: user.role,
            name: studentDoc?.name, // Send student name (if found)
            status: studentDoc?.status, // Send student status (active or inactive)
          },
        });
      }
    } catch (e) {
      console.log("Login error:", e);
      next(e);
    }
  }

  // Registration -> Pending Collection
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
        batch,
        time,
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
        batch,
        time,
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
      const { course, branch } = req.query;

      // Build dynamic filter
      const filter: any = {};
      if (course) filter.course = course;
      if (branch) filter.branch = branch;

      const students = await Student.find(
        filter,
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
      const { course, branch } = req.query;

      // Build the filter object dynamically
      const filter: any = {};
      if (course) filter.course = course;
      if (branch) filter.branch = branch;

      const pendingStudents = await Pending.find(filter);

      res.status(200).json(pendingStudents);
    } catch (error) {
      console.error("Error fetching pending students", error);
      res.status(500).json({ message: "Failed to fetch pending students" });
    }
  }

  // After Accepting Student -> Registration
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
        paymentStatus: "Unpaid",
        approvedAt: new Date(),
        password: hashedPassword,
        username: pendingStudent.email,
        role: "user",
        dues: 500,
      });

      await approvedStudent.save();
      await Pending.findByIdAndDelete(id);

      // Save to Registration collection
      const registrationEntry = new Registration({
        name: approvedStudent.name,
        course: approvedStudent.course,
        branch: approvedStudent.branch,
        batch: approvedStudent.batch,
        admissionNumber: approvedStudent.adm_no,
        phone: approvedStudent.phone,
        registrationDate: approvedStudent.createdAt,
      });

      await registrationEntry.save();

      // Save to Login collection
      const loginEntry = new Login({
        username: pendingStudent.email,
        password: hashedPassword,
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

  // Reject student
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

  //Dropdown Batches
  public static async GetBatches(req: Request, res: Response) {
    try {
      // Using aggregate to get distinct batches with their _id
      const batches = await Batch.aggregate([
        { $group: { _id: "$batch" } }, // Group by 'batch' field
        { $project: { _id: 1, batch: "$_id" } }, // Include _id and batch
      ]);
      res.status(200).json(batches);
    } catch (err) {
      console.error("Error fetching batches:", err);
      res.status(500).json({ message: "Failed to fetch batches" });
    }
  }

  // Dropdown Time
  public static async GetTime(req: Request, res: Response) {
    try {
      const time = await Batch.find({}, "time");
      res.status(200).json(time);
    } catch (err) {
      console.error("Error fetching time:", err);
      res.status(500).json({ message: "Failed to fetch time" });
    }
  }

  //Get student details for admin
  public static async GetStudentById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const student = await Student.findById(id);

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.status(200).json(student);
    } catch (error) {
      console.error("Error fetching student by ID:", error);
      res.status(500).json({ message: "Failed to fetch student" });
    }
  }

  //Delete Students
  public static async DeleteStudent(req: Request, res: Response) {
    try {
      const student = await Student.findById(req.params.id);
      if (!student)
        return res.status(404).json({ message: "Student not found" });

      // Save to PastStudents collection
      const pastStudent = new PastStudent(student.toObject());
      await pastStudent.save();

      // Remove from current collection
      await Student.findByIdAndDelete(req.params.id);

      res.status(200).json({ message: "Student moved to past successfully" });
    } catch (error) {
      console.error("Error moving student:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Payment method to handle dues and create receipt
  public static async PayDues(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId, name, batch, amount, month, date, course, branch } =
        req.body;

      console.log("Received payment request:", req.body); // Log the incoming data

      const today = new Date().toLocaleDateString();

      // 1. Find student
      const student = await Student.findById(studentId);
      if (!student) {
        console.error("Student not found with adm_no:");
        return res.status(404).json({ message: "Student not found" });
      }

      // 3. Validate dues
      if (amount > student.dues) {
        return res
          .status(400)
          .json({ message: `Payment exceeds dues: ${student.dues}` });
      }

      // 5. Update dues
      student.dues -= amount;
      if (student.dues === 0) {
        student.paymentStatus = "Paid";
      }

      await student.save();

      // 6. Save to ledger
      const ledgerEntry = new Ledger({
        date: new Date(date),
        name,
        adm_no: student.adm_no,
        amount,
        course,
        branch,
        batch,
        month,
      });
      await ledgerEntry.save();

      // 7. Send confirmation email
      await sendPaymentConfirmation(student.email, amount, today);

      res.status(200).json({ message: "Payment recorded and ledger updated" });
    } catch (error) {
      console.error("Error processing payment:", error); // Log detailed error
      res.status(500).json({ message: "Failed to process payment" });
    }
  }

  // Batch Details
  public static async GetAllBatches(req: Request, res: Response) {
    try {
      const batches = await Batch.find();
      res.status(200).json(batches);
    } catch (error) {
      console.error("Error fetching batches:", error);
      res.status(500).json({ message: "Failed to fetch batches" });
    }
  }

  // New Batch
  public static async CreateBatch(req: Request, res: Response) {
    try {
      const { batch, time, instructor, capacity } = req.body;

      const newBatch = new Batch({ batch, time, instructor, capacity });
      await newBatch.save();

      res.status(201).json(newBatch);
    } catch (error) {
      console.error("Error creating batch:", error);
      res.status(500).json({ message: "Failed to create batch" });
    }
  }

  // Update Batch
  public static async UpdateBatch(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { batch, time, instructor, capacity } = req.body;

      const updatedBatch = await Batch.findByIdAndUpdate(
        id,
        { batch, time, instructor, capacity },
        { new: true }
      );

      if (!updatedBatch) {
        return res.status(404).json({ message: "Batch not found" });
      }

      res.status(200).json(updatedBatch);
    } catch (error) {
      console.error("Error updating batch:", error);
      res.status(500).json({ message: "Failed to update batch" });
    }
  }

  // Delete Batch
  public static async DeleteBatch(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deletedBatch = await Batch.findByIdAndDelete(id);

      if (!deletedBatch) {
        return res.status(404).json({ message: "Batch not found" });
      }

      res.status(200).json({ message: "Batch deleted successfully" });
    } catch (error) {
      console.error("Error deleting batch:", error);
      res.status(500).json({ message: "Failed to delete batch" });
    }
  }

  // Course Details
  public static async GetAllCourses(req: Request, res: Response) {
    try {
      const courses = await Course.find();
      res.status(200).json(courses);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  }

  // New Course
  public static async CreateCourse(req: Request, res: Response) {
    try {
      const { course, duration, instructor, fees } = req.body;

      const newCourse = new Course({ course, duration, instructor, fees });
      await newCourse.save();

      res.status(201).json(newCourse);
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(500).json({ message: "Failed to create course" });
    }
  }

  // Update Course
  public static async UpdateCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { course, duration, instructor, fees } = req.body;

      const updatedCourse = await Course.findByIdAndUpdate(
        id,
        { course, duration, instructor, fees },
        { new: true }
      );

      if (!updatedCourse) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.status(200).json(updatedCourse);
    } catch (error) {
      console.error("Error updating course:", error);
      res.status(500).json({ message: "Failed to update course" });
    }
  }

  // Delete Course
  public static async DeleteCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deletedCourse = await Course.findByIdAndDelete(id);

      if (!deletedCourse) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      console.error("Error deleting course:", error);
      res.status(500).json({ message: "Failed to delete course" });
    }
  }

  // Branch Details
  public static async GetAllBranches(req: Request, res: Response) {
    try {
      const branches = await Branch.find();
      res.status(200).json(branches);
    } catch (error) {
      console.error("Error fetching branch:", error);
      res.status(500).json({ message: "Failed to fetch branch" });
    }
  }

  // New Branch
  public static async CreateBranch(req: Request, res: Response) {
    try {
      const { branch, time, day } = req.body;

      const newBranch = new Branch({ branch, time, day });
      await newBranch.save();

      res.status(201).json(newBranch);
    } catch (error) {
      console.error("Error creating branch:", error);
      res.status(500).json({ message: "Failed to create branch" });
    }
  }

  // Update Branch
  public static async UpdateBranch(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { branch, time, day } = req.body;

      const updatedBranch = await Branch.findByIdAndUpdate(
        id,
        { branch, time, day },
        { new: true }
      );

      if (!updatedBranch) {
        return res.status(404).json({ message: "Branch not found" });
      }

      res.status(200).json(updatedBranch);
    } catch (error) {
      console.error("Error updating branch:", error);
      res.status(500).json({ message: "Failed to update branch" });
    }
  }

  // Delete Branch
  public static async DeleteBranch(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deletedBranch = await Branch.findByIdAndDelete(id);

      if (!deletedBranch) {
        return res.status(404).json({ message: "Branch not found" });
      }

      res.status(200).json({ message: "Branch deleted successfully" });
    } catch (error) {
      console.error("Error deleting branch:", error);
      res.status(500).json({ message: "Failed to delete branch" });
    }
  }

  // Admin Details
  public static async GetAllAdmin(req: Request, res: Response) {
    try {
      const admin = await Admin.find();
      res.status(200).json(admin);
    } catch (error) {
      console.error("Error fetching admin:", error);
      res.status(500).json({ message: "Failed to fetch admin" });
    }
  }

  // New Admin
  public static async CreateAdmin(req: Request, res: Response) {
    try {
      const { username, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newAdmin = new Admin({ username, hashedPassword, role });
      await newAdmin.save();

      res.status(201).json(newAdmin);
      const loginEntry = new Login({
        username: newAdmin.username,
        password: hashedPassword,
        role: "Admin",
      });

      await loginEntry.save();
    } catch (error) {
      console.error("Error creating admin:", error);
      res.status(500).json({ message: "Failed to create admin" });
    }
  }

  // Update Admin
  public static async UpdateAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { username, password, role } = req.body;

      // First, find the current admin to get the existing username
      const currentAdmin = await Admin.findById(id);
      if (!currentAdmin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // Only hash the password if it was updated
      let hashedPassword = currentAdmin.password; // Retain current password if not changing it
      if (password) {
        hashedPassword = await bcrypt.hash(password, saltRounds); // Hash new password if provided
      }

      // Update the Admin collection
      const updatedAdmin = await Admin.findByIdAndUpdate(
        id,
        { username, password: hashedPassword, role },
        { new: true }
      );

      if (!updatedAdmin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // Update the Login collection
      const loginEntry = await Login.findOne({
        username: currentAdmin.username,
      });

      if (loginEntry) {
        loginEntry.username = updatedAdmin.username;
        loginEntry.password = hashedPassword;
        loginEntry.role = updatedAdmin.role.toLowerCase(); // normalize role if needed
        await loginEntry.save();
      } else {
        const newLoginEntry = new Login({
          username: updatedAdmin.username,
          password: hashedPassword,
          role: updatedAdmin.role.toLowerCase(),
        });
        await newLoginEntry.save();
      }

      res.status(200).json(updatedAdmin);
    } catch (error) {
      console.error("Error updating admin:", error);
      res.status(500).json({ message: "Failed to update admin" });
    }
  }

  // Delete Admin
  public static async DeleteAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Find the admin first
      const deletedAdmin = await Admin.findById(id);
      if (!deletedAdmin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // Remove the login entry
      await Login.findOneAndDelete({ username: deletedAdmin.username });

      // Remove the admin from the Admin collection
      await Admin.findByIdAndDelete(id);

      res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
      console.error("Error deleting admin:", error);
      res.status(500).json({ message: "Failed to delete admin" });
    }
  }

  //Change Password
  public static async ChangePassword(req: Request, res: Response) {
    const { username, newPassword } = req.body; // Get the new password from the request body

    try {
      // Find the user in the login collection
      const user = await Login.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "Invalid username" }); // Return if user is not found
      }

      // Hash the new password before updating
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update the password in the login collection
      user.password = hashedNewPassword;
      await user.save();

      // Respond with success
      res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get User Details
  public static async GetUserDetails(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      console.log("Received token:", token); // Debugging: Show the received token

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallbackSecret"
      );
      console.log("Decoded JWT:", decoded); // Debugging: Show the decoded JWT

      console.log("Looking for student with ID:", decoded.id);

      // First, try to find the student in the Student collection
      let student = await Student.findById(decoded.id).select("-password");

      // If not found in Student collection, try the LeaveStudent collection
      if (!student) {
        console.log(
          "Student not found in Student collection, checking LeaveStudent..."
        );
        student = await LeaveStudent.findById(decoded.id).select("-password");

        if (!student) {
          return res
            .status(404)
            .json({ message: "Student not found in both collections" });
        }
      }

      res.status(200).json(student);
    } catch (error) {
      console.error("Error fetching student details:", error); // Logging error
      res.status(500).json({ message: "Failed to fetch student details" });
    }
  }

  //Update Student Details
  public static async UpdateStudent(req: Request, res: Response) {
    try {
      const { id } = req.params;
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
        batch,
        time,
      } = req.body;

      // Get current student
      const currentStudent = await Student.findById(id);
      if (!currentStudent) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Update student info
      const updatedStudent = await Student.findByIdAndUpdate(
        id,
        {
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
          batch,
          time,
        },
        { new: true }
      );

      if (!updatedStudent) {
        return res.status(404).json({ message: "Failed to update student" });
      }

      // Update the login collection
      const loginEntry = await Login.findOne({
        username: currentStudent.email,
      });

      if (loginEntry) {
        loginEntry.username = updatedStudent.email;
        await loginEntry.save();
      } else {
        // In case the login entry was somehow missing, recreate it (rare edge case)
        const newLogin = new Login({
          username: updatedStudent.email,
          password: "changeme", // or some default if you're handling this edge case
          role: "user",
        });
        await newLogin.save();
      }

      return res.status(200).json(updatedStudent);
    } catch (err) {
      console.error("Error updating student:", err);
      return res.status(500).json({ message: "Failed to update student" });
    }
  }

  // Apply For Leave
  public static async ApplyLeave(req: Request, res: Response) {
    try {
      const { studentId, leaveStartDate, leaveEndDate } = req.body;

      if (!studentId || !leaveStartDate || !leaveEndDate) {
        return res
          .status(400)
          .json({ message: "Student ID, start and end dates are required." });
      }

      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      const leave = new Leave({
        studentId,
        leaveStartDate: new Date(leaveStartDate),
        leaveEndDate: new Date(leaveEndDate),
        course: student.course,
        branch: student.branch,
        batch: student.batch,
        time: student.time,
        status: "Pending",
      });
      await leave.save();
      return res
        .status(201)
        .json({ message: "Leave applied successfully", leave });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get the leave request
  public static async GetPendingLeaves(req: Request, res: Response) {
    try {
      const leaves = await Leave.find({ status: "Pending" }).populate(
        "studentId",
        "name email batch time course branch"
      );
      console.log("Fetched leaves:", leaves);
      return res.json(leaves);
    } catch (err) {
      console.error("GetPendingLeaves error:", err);
      // Temporarily include the error message in the response so you can see it in the browser console
      return res.status(500).json({
        message: "Server error",
        details: err instanceof Error ? err.message : err,
      });
    }
  }

  // Admin Approve Leave
  public static async ApproveLeave(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const leave = await Leave.findById(id);
      if (!leave) {
        return res.status(404).json({ message: "Leave not found" });
      }

      leave.status = "Approved";
      await leave.save();

      const student = await Student.findById(leave.studentId);
      if (!student)
        return res.status(404).json({ message: "Student not found" });

      const leaveStudent = new LeaveStudent({
        ...student.toObject(),
        status: "Inactive",
        leaveStartDate: leave.leaveStartDate,
        leaveEndDate: leave.leaveEndDate,
      });

      await leaveStudent.save();
      await Student.findByIdAndDelete(student._id);

      await sendMail(
        student.email,
        "Leave Request Approved",
        `<p>Dear ${
          student.name
        },</p><p>Your leave from <strong>${leave.leaveStartDate.toLocaleDateString(
          "en-IN"
        )}</strong> to <strong>${leave.leaveEndDate.toLocaleDateString(
          "en-IN"
        )}</strong> has been <span style="color:green;">approved</span>. You are now marked <strong>Inactive</strong> during this period.</p>`
      );

      res.status(200).json({
        message:
          "Leave approved, student moved to leave collection, and email sent.",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }

  //Admin reject leave
  public static async RejectLeave(req: Request, res: Response) {
    try {
      const leaveId = req.params.id;

      // Find the leave and populate student data
      const leave = await Leave.findById(leaveId).populate("studentId");
      if (!leave) {
        return res.status(404).json({ message: "Leave request not found" });
      }

      const student: any = leave.studentId;
      const studentEmail = student.email;
      const studentName = student.name;

      // Format leave start and end dates in Indian format (DD/MM/YYYY)
      const formattedStartDate = new Date(
        leave.leaveStartDate
      ).toLocaleDateString("en-IN");
      const formattedEndDate = new Date(leave.leaveEndDate).toLocaleDateString(
        "en-IN"
      );

      // Prepare email content
      const html = `
        <p>Dear <strong>${studentName}</strong>,</p>
        <p>Your leave request from <strong>${formattedStartDate}</strong> to <strong>${formattedEndDate}</strong> has been <span style="color: red;"><strong>rejected</strong></span>.</p>
        <p>Please reach out to the admin for further clarification.</p>
        <p>Best regards,<br/>Dance Class Admin</p>
      `;

      // Send rejection email
      try {
        await sendMail(studentEmail, "Leave Request Rejected", html);
      } catch (emailErr) {
        console.error("Error sending rejection email:", emailErr);
        return res
          .status(500)
          .json({ message: "Leave request rejected but email failed to send" });
      }

      // Delete the leave request
      await Leave.findByIdAndDelete(leaveId);

      return res
        .status(200)
        .json({ message: "Leave request rejected and email sent" });
    } catch (err) {
      console.error("RejectLeave error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  //Course Report
  public static async CourseReport(req: Request, res: Response) {
    try {
      const courses = await Course.find();
      res.json(courses);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch the Report" });
    }
  }

  //Batch Report
  public static async BatchReport(req: Request, res: Response) {
    try {
      const batches = await Batch.find();
      res.json(batches);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch the Report" });
    }
  }

  //Branch Report
  public static async BranchReport(req: Request, res: Response) {
    try {
      const branches = await Branch.find();
      res.json(branches);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch the Report" });
    }
  }

  //Past Student Report
  public static async PastStudentReport(req: Request, res: Response) {
    try {
      const { course, branch } = req.query;

      const filter: any = {};
      if (course) filter.course = course;
      if (branch) filter.branch = branch;

      const students = await PastStudent.find(filter);
      res.json(students);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch the Report" });
    }
  }

  //Dues Report
  public static async DuesReport(req: Request, res: Response) {
    try {
      const dues = await Dues.find();
      res.json(dues);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch the Report" });
    }
  }

  // Leave Student Summary
  public static async GetLeaveStudents(req: Request, res: Response) {
    try {
      const course = req.query.course as string | undefined;
      const branch = req.query.branch as string | undefined;

      const filter: any = {};
      if (course && course !== "all") filter.course = course;
      if (branch && branch !== "all") filter.branch = branch;

      const students = await LeaveStudent.find(
        filter,
        "name phone email address status paymentStatus"
      );

      res.status(200).json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Failed to fetch students" });
    }
  }

  //Registration Report
  public static async RegistrationReport(req: Request, res: Response) {
    try {
      const course = req.query.course as string | undefined;
      const branch = req.query.branch as string | undefined;

      const filter: any = {};
      if (course && course !== "all") filter.course = course;
      if (branch && branch !== "all") filter.branch = branch;

      const register = await Registration.find(filter);
      res.json(register);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch the Report" });
    }
  }

  // Leave student Report
  public static async LeaveStudentReport(req: Request, res: Response) {
    try {
      const course = req.query.course as string | undefined;
      const branch = req.query.branch as string | undefined;

      const filter: any = {};
      if (course && course !== "all") filter.course = course;
      if (branch && branch !== "all") filter.branch = branch;
      const students = await LeaveStudent.find(filter, {
        adm_no: 1,
        name: 1,
        course: 1,
        branch: 1,
        batch: 1,
        phone: 1,
        address: 1,
        leaveStartDate: 1,
        leaveEndDate: 1,
      });
      res.json(students);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to fetch the Report" });
    }
  }

  //Cash Book Report
  public static async GetCashBook(req: Request, res: Response) {
    try {
      const { course, branch, fromDate, toDate } = req.query;

      const filter: any = {
        date: {
          $gte: new Date(fromDate as string),
          $lte: new Date(toDate as string),
        },
      };

      if (course && course !== "all") filter.course = course;
      if (branch && branch !== "all") filter.branch = branch;

      const records = await Ledger.find(filter).sort({ date: 1 });

      res.json(records);
    } catch (error) {
      console.error("Error fetching cash book:", error);
      res.status(500).json({ message: "Failed to fetch cash book" });
    }
  }
  public static async GetLeaveStudentDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const student = await LeaveStudent.findById(id);

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.status(200).json(student);
    } catch (error) {
      console.error("Error fetching student by ID:", error);
      res.status(500).json({ message: "Failed to fetch student" });
    }
  }
}
