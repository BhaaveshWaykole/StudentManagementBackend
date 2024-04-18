import Faculty from '../models/Faculty.js';
import Classroom from '../models/Classroom.js';

import bcrypt from 'bcrypt'

export const updateFaculty = async (req, res) => {
    // console.log("in")
    if (req.body.fId === req.params.id) {
        // console.log("In")
        try {
            // console.log("IN")
            console.log(req.body)
            const updateFaculty = await Faculty.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );
            console.log(updateFaculty)
            // console.log("updated")
            res.status(200).json(updateFaculty);
            // console.log("done")
        } catch (err) {
            return res.status(500).json(err)
        }
    } else {
        console.log("error")
    }
}

export const postFaculty = async (req, res) => {
    try {
        // Hash password - secure with size 10 hash
        // console.log("In")
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        // create a new user
        // console.log("before")
        const newFaculty = new Faculty({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        // console.log("after")
        // Save User
        const user = await newFaculty.save();
        res.status(200).json(user)
        // console.log("done")
    } catch (err) {
        res.send(err)
    }
}

export const getFaculty = async (req, res) => {
    // console.log("in")
    const fID = req.params.id
    try {
        // console.log("In")
        const getfaculty = await Faculty.findById(fID);
        res.status(200).json(getfaculty);
        // console.log("done")
    } catch (err) {
        return res.json(err)
    }
}

export const deleteTeacher = async (req, res) => {
    try {
        const deleteFaculty = await Faculty.findById(req.params.id);
        if (!deleteFaculty) {
            return res.status(404).json({ message: 'Faculty member not found' });
        }
        await Faculty.findByIdAndDelete(req.params.id);
        await Classroom.updateMany(
            { teachers: req.params.id },
            { $pull: { teachers: req.params.id } }
        );
        res.status(200).json({ message: 'Faculty member deleted successfully' });
    } catch (error) {
        // Handle errors
        console.error('Error deleting faculty member:', error);
        res.status(500).json({ message: 'An error occurred while deleting faculty member' });
    }
}

export const getFacultyClasses = async (req, res) => {
    const teacherId = req.params.id;

    try {
        // Find the teacher by ID
        const teacher = await Faculty.findById(teacherId);

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // Get the classes associated with the teacher
        const classes = await Classroom.find({ _id: { $in: teacher.classes } });

        res.status(200).json(classes);
    } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getClassFaculty = async (req, res) => {
    const classId = req.params.id;
    try {
        const foundClass = await Classroom.findById(classId);
        if (!foundClass) {
            return res.status(404).json({ message: 'Class not found' });
        }
        const facultyMembers = await Faculty.find({ classes: { $in: [foundClass.id] } });
        res.status(200).json(facultyMembers);
    } catch (err) {
        console.error('Error fetching faculty data:', err);
        res.status(500).json({ message: 'Error fetching faculty data' });
    }
}

export const loginFaculty = async (req, res) => {
    const { email, password, userType } = req.body;
    try {
        const faculty = await Faculty.findOne({ email });
        if (!faculty || !bcrypt.compareSync(password, faculty.password)) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        res.status(200).json(faculty);
    } catch (error) {
        console.error('faculty login failed:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};