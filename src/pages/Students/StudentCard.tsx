import React from "react";
import { useNavigate } from "react-router-dom";
import { faEnvelope, faPhone, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface StudentProps {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: String;
  payment: String;
}

const StudentCard: React.FC<{ student: StudentProps }> = ({ student }) => {
  const navigate = useNavigate();

  return (
    <div className="student-card">
      <div className="student-info">
        <h4>{student.name}</h4>
        <div className="tags">
        <span className={`status ${student.status?.toLowerCase() || 'unknown'}`}>{student.status}</span>
          <span className={`payment ${student.payment.toLowerCase()}`}>{student.payment}</span>
        </div>
        <p><FontAwesomeIcon icon={faPhone} /> {student.phone}</p>
        <p><FontAwesomeIcon icon={faEnvelope} /> {student.email}</p>
        <p><FontAwesomeIcon icon={faLocationDot} /> {student.address}</p>
        <button onClick={() => navigate(`/student/${student.id}`)}>View Details</button>
      </div>
    </div>
  );
};

export default StudentCard;
