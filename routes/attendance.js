import express from 'express';

const router = express.Router();
import {
    updateAttendance,
    createAttendance,
    getAttendance,
    deleteAttendance,
    getStudentsForAttendance
} from '../controllers/attendanceController.js';


// CRUD:-

// to create class taking id of teacher to add teacher's name ... change later if needed
router.post('/regAttendance', createAttendance)
router.put('/:id', updateAttendance)
router.get('/:id', getAttendance)
router.delete('/:id', deleteAttendance)


router.get("/remStudents/:id", getStudentsForAttendance) // remaining students of class.
// router.get('/:id', getStudent)

export default router