import Login from "./pages/Login/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Registration from "./pages/Registration/Registration";
import ChangePassword from "./pages/ChangePassword/ChandePassword";
import StudentSummary from "./pages/Students/StudentSummary";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import AddStudent from "./pages/AddStudents/AddStudent";
import BatchDetails from "./pages/BatchDetails/BatchDetails";
import StudentDetails from "./pages/StudentDetails/StudentDetails";
import ReceiptForm from "./pages/ReceiptForm/ReceiptForm";
import AddBatch from "./pages/AddBatch/AddBatch";
import CourseDetails from "./pages/CourseDetails/CourseDetails";
import AddCourse from "./pages/AddCourse/AddCourse";
import BranchDetails from "./pages/BranchDetails/BranchDetails";
import AddBranch from "./pages/AddBranch/AddBranch";
import AdminDetails from "./pages/AdminDetails/AdminDetails";
import AddAdmin from "./pages/AddAdmin/AddAdmin";
import UserDetails from "./pages/UserDashboard/UserDashboard";
import StudentUpdateForm from "./pages/StudentUpdateForm/StudentUpdateForm";
import LeaveForm from "./pages/LeaveForm/LeaveForm";
import LeaveApproval from "./pages/LeaveApproval/LeaveApproval";
import CourseReport from "./pages/CourseReport/CourseReport";
import BatchReport from "./pages/BatchReport/BatchReport";
import BranchReport from "./pages/BranchReport/BranchReport";
import PastStudentReport from "./pages/PastStudentReport/PastStudentReport";
import DuesReport from "./pages/DuesReport/DuesReport";
import LeaveStudentSummary from "./pages/LeaveStudentSummary/LeaveStudentSummary";
import RegistrationReport from "./pages/RegistrationReport/RegistrationReport";
import LeaveStudentReport from "./pages/LeaveStudentReport/LeaveStudentReport"
import CashBook from "./pages/CashBook/CashBook";
import LeaveStudentDetails from "./pages/LeaveStudentDetail/LeaveStudentDetail";
import StaffSummary from "./pages/StaffSummary/StaffSummary";
import StaffDetails from "./pages/StaffDetails/StaffDetails";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/students" element={<StudentSummary />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/addStudent" element={<AddStudent />} />
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route path="/batchDetails" element={<BatchDetails />} />
        <Route path="/AddBatch" element={<AddBatch />} />
        <Route path="/studentDetails/:studentId" element={<StudentDetails />} />
        <Route path="/ReceiptForm" element={<ReceiptForm />} />
        <Route path="/courseDetails" element={<CourseDetails />} />
        <Route path="/AddCourse" element={<AddCourse />} />
        <Route path="/branchDetails" element={<BranchDetails />} />
        <Route path="/addBranch" element={<AddBranch />} />
        <Route path="/adminDetails" element={<AdminDetails />} />
        <Route path="/addAdmin" element={<AddAdmin />} />
        <Route path="/userDashboard" element={<UserDetails />} />
        <Route path="/studentUpdateForm" element={<StudentUpdateForm />} />
        <Route path="/leaveForm" element={<LeaveForm />} />
        <Route path="/leaveApproval" element={<LeaveApproval />} />
        <Route path="/courseReport" element={<CourseReport />} />
        <Route path="/batchReport" element={<BatchReport />} />
        <Route path="/branchReport" element={<BranchReport />} />
        <Route path="/pastStudentReport" element={<PastStudentReport />} />
        <Route path="/duesReport" element={<DuesReport />} />
        <Route path="/leavestudent" element={<LeaveStudentSummary />} />
        <Route path="/registrationReport" element={<RegistrationReport />} />
        <Route path="/leaveReport" element={<LeaveStudentReport />} />
        <Route path="/cashBook" element={<CashBook />} />
        <Route path="/leavestudentDetails/:studentId" element={<LeaveStudentDetails />} />
        <Route path="/staff" element={<StaffSummary />} />
        <Route path="/staffDetails/:id" element={<StaffDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
