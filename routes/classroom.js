import express from 'express';

const router = express.Router();
import {
    getClassroom,
    createClassroom,
    updateClassroom,
    deleteClassroom,
    getAllClassrooms,
    postStudentInClass
} from '../controllers/classroomController.js';

// to create class taking id of teacher to add teacher's name ... change later if needed
router.post('/regClass', createClassroom)
router.put('/:id', updateClassroom)
router.get('/:id', getClassroom)
router.delete('/:id', deleteClassroom)
router.get('/' , getAllClassrooms)
router.post('/:id', postStudentInClass)
// router.put('/:id', getClassroom)
// router.put('/:id', deleteClassroom)

// router.get('/:id', getStudent)

export default router