import React, { createContext, useContext, useState, useEffect } from "react";

interface CourseBranchContextType {
  course: string;
  branch: string;
  setCourse: (course: string) => void;
  setBranch: (branch: string) => void;
}

const CourseBranchContext = createContext<CourseBranchContextType | undefined>(
  undefined
);

export const CourseBranchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [course, setCourse] = useState<string>("");
  const [branch, setBranch] = useState<string>("");

  // Retrieve course and branch from localStorage if available
  useEffect(() => {
    const storedCourse = localStorage.getItem("course");
    const storedBranch = localStorage.getItem("branch");
    if (storedCourse) setCourse(storedCourse);
    if (storedBranch) setBranch(storedBranch);
  }, []);

  // Store course and branch to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("course", course);
    localStorage.setItem("branch", branch);
  }, [course, branch]);

  return (
    <CourseBranchContext.Provider
      value={{ course, branch, setCourse, setBranch }}
    >
      {children}
    </CourseBranchContext.Provider>
  );
};

export const useCourseBranch = () => {
  const context = useContext(CourseBranchContext);
  if (!context) {
    throw new Error(
      "useCourseBranch must be used within a CourseBranchProvider"
    );
  }
  return context;
};
