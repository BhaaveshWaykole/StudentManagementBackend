import express from 'express';

const router = express.Router();
import {
    postStudent,
    getStudent,
    updateStudent,
    deleteStudent,
    getTotalAttendance,
    getAllStudentsOfClass,
    loginStudent,
    getStudentClasses
} from '../controllers/studentsController.js';
//Update :-
// router.put("/:id", updateStudent);
router.put('/:id', updateStudent)

// Delete :-
router.delete('/:id', deleteStudent)

// get a Student :-
// router.get('/:id', getStudent)
router.get('/:id', getStudent)

router.get('/studClass/:id', getAllStudentsOfClass)
router.get('/class/:id', getStudentClasses)

router.post('/register', postStudent)
router.post('/login', loginStudent);

router.get("/totalPresent/:id/", getTotalAttendance)
export default router