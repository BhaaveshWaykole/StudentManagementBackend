import Announcement from '../models/Announcement.js';
import Classroom from '../models/Classroom.js';

export const createAnnouncement = async (req, res) => {
    try {
        // Create a new announcement
        const newAnnouncement = await Announcement.create(req.body);

        await Classroom.findByIdAndUpdate(
            req.body.cId,
            { $push: { feed: newAnnouncement.id } }
        );

        res.status(201).json(newAnnouncement);
    } catch (error) {
        res.status(500).json({ error });
    }
}

export const getAnnouncement = async (req, res) => {
    try {
        const classroom = await Classroom.findById(req.params.id);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }
        const announcements = await Announcement.find({ _id: { $in: classroom.feed } });
        res.status(200).json(announcements);
    } catch (error) {
        console.error('Error retrieving announcements:', error);
        res.status(500).json({ message: 'An error occurred while retrieving announcements' });
    }

}

export const updateAnnouncement = async (req, res) => {
    try {
        // Update the announcement
        const updatedAnnouncement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.status(200).json(updatedAnnouncement);
    } catch (error) {
        console.error('Error updating announcement:', error);
        res.status(500).json({ message: 'An error occurred while updating announcement' });
    }
}

export const deleteAssignment = async (req, res) => {
    try {
        // Delete the announcement
        await Announcement.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).json({ message: 'An error occurred while deleting announcement' });
    }
}