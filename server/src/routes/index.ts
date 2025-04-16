import express from "express";
import AppController from "./controller/appController";

const router = express.Router();

// router.get("/slots", AppController.slots);
router.post("/api/login", AppController.Login);
router.post("/api/pending", AppController.RegisterPending);
router.get("/api/student", AppController.GetStudents);
router.get("/api/pending", AppController.GetPendingStudents);
router.post("/api/student/:id", AppController.AcceptStudent);
router.delete("/api/pending/:id", AppController.RejectStudent);
router.get("/api/course", AppController.GetCourses);
router.get("/api/branch", AppController.GetBranches);
export default router;
