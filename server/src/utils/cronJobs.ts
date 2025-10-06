// utils/cronJobs.ts
import cron from "node-cron";
import LeaveStudent from "../schemas/leaveStudentSchema";
import Student from "../schemas/studentSchema";
import { sendMail } from "../utils/mailer";

// Define your course fee or dues amount (assuming you have a constant or a way to get this value)
const COURSE_FEE = 1500; // Example: You can fetch the fee from a course schema or configuration

// This cron job will run at midnight on the 1st of every month
cron.schedule("0 0 1 * *", async () => {
  try {
    // Get today's date for comparison
    const today = new Date();

    // Step 1: Reactivate students whose leave period has ended
    const studentsToReactivate = await LeaveStudent.find({
      leaveEndDate: { $lt: today },
    });

    for (const leaveStudent of studentsToReactivate) {
      const { _id, ...studentData } = leaveStudent.toObject();

      // Update status to Active
      studentData.status = "Active";

      // Add back to student collection
      await Student.create(studentData);

      // Remove from leaveStudent collection
      await LeaveStudent.findByIdAndDelete(leaveStudent._id);

      // Send welcome back email
      const html = `
        <p>Dear <strong>${leaveStudent.name}</strong>,</p>
        <p>Welcome back! Your leave period has ended and your status is now <strong>Active</strong>.</p>
        <p>We’re excited to have you back at the dance class!</p>
        <p>Best regards,<br/>Dance Class Admin</p>
      `;
      await sendMail(leaveStudent.email, "Welcome Back to Class", html);
    }

    console.log("Cron Job: Leave reactivation complete.");

    // Step 2: Add dues to all students on the 1st of the month
    const students = await Student.find({});

    for (const student of students) {
      if (student.status === "Active") {
        // Add the course fee to student's dues
        student.dues += COURSE_FEE; // Adjust based on the student's course fee if applicable

        // Save the updated student record
        await student.save();

        // Send email notification about dues
        const html = `
          <p>Dear <strong>${student.name}</strong>,</p>
          <p>Your monthly fee of ₹${COURSE_FEE} has been added to your dues for this month. Please pay before the 10th of ${today.toLocaleString("default", { month: "long" })}.</p>
          <p>Best regards,<br/>Dance Class Admin</p>
        `;
        await sendMail(student.email, "Monthly Fee Payment Reminder", html);
      }
    }

    console.log("Cron Job: Dues added and notifications sent.");

  } catch (err) {
    console.error("Cron Job Error:", err);
  }
});
