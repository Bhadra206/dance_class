import Login from "./pages/Login/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Registration from "./pages/Registration/Registration";
import ChangePassword from "./pages/ChangePassword/ChandePassword";
import StudentSummary from "./pages/Students/StudentSummary";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import AddStudent from "./pages/AddStudents/AddStudent";
import BatchDetails from "./pages/BatchDetails/BatchDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/students" element={<StudentSummary />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/AddStudent" element={<AddStudent />} />
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route path="/BatchDetals" element={<BatchDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
