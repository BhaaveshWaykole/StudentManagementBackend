import express from 'express';
const router = express.Router();

import {
    createAnnouncement,
    getAnnouncement,
    updateAnnouncement,
    deleteAssignment
} from '../controllers/announcementController.js'

router.post('/regAnnouncement', createAnnouncement);

router.get('/:id', getAnnouncement);

router.put('/:id', updateAnnouncement);

router.delete('/:id', deleteAssignment);
export default router