import Announcement from '../models/Announcement.js';
import Classroom from '../models/Classroom.js';
import Attendance from '../models/Attendance.js';
import Faculty from '../models/Faculty.js';
import Student from '../models/Student.js';
import classroom from '../models/Classroom.js';

// C
export const createClassroom = async (req, res) => {
    // check if class with the name, with same teacher with same batch, if we get a class then class already exist even one fails we will create a new class ofc.

    const getClass = await Classroom.findOne({ name: req.body.name, teachers: req.body.teachers, batch: req.body.batch });
    try {
        // const getFaculty = Faculty.findById(req.params.id)
        // create class -- get teacher id from param , maybe approach different later
        if (!(getClass)) {
            const newClassroom = new Classroom({
                name: req.body.name,
                teachers: req.body.teachers,
                batch: req.body.batch
            });
            const classroom = await newClassroom.save();

            // adding class to teacher table :-
            const updateTeacherPromises = newClassroom.teachers.map(async teacherId => {
                // Update attendanceRecord by pushing the student ID
                return Faculty.findByIdAndUpdate(
                    teacherId,
                    { $push: { classes: newClassroom.id } },
                    { new: true }
                );
            });

            // const updateFaculty = await Faculty.findByIdAndUpdate(
            //     req.body.id,
            //     { $push: { classes: newClassroom._id } },
            //     { new: true }
            // );
            // console.log("after")
            // Save User
            res.status(200).json(classroom)
            console.log(updateFaculty)
        } else {
            const Faculties = await Promise.all(getClass.teachers.map(async (teachersId) => {
                let teacher = await Faculty.findById(teachersId)
                return teacher.name
            }))
            res.status(503).json("Class already exist, with owner teachers : " + Faculties)
        }
        // console.log("done")
    } catch (err) {
        res.send(err)
    }
}

//U 
export const updateClassroom = async (req, res) => {
    const getClass = await Classroom.findById(req.params.id);
    if (getClass) {


        try {
            // get non common students and teachers so if any issue occurs and repeat of students and teacher passed should not disturb data/doc .. 
            const notCommonStudents = req.body.students.filter(studentId => !getClass.students.includes(studentId));
            const notCommonTeachers = req.body.teachers.filter(teacherId => !getClass.teachers.includes(teacherId));

            // update class :-
            const updatedClass = await Classroom.findByIdAndUpdate(
                req.params.id,
                {
                    $push: {
                        students: { $each: notCommonStudents },
                        teachers: { $each: notCommonTeachers }
                    }
                },
                { new: true }
            )

            // from the array of non common students for particular id add that class to them.
            await Student.updateMany(
                { _id: { $in: notCommonStudents } },
                { $push: { classes: updatedClass.id } }
            )

            // from the array of non common teachers for particular id add that class to them.
            await Faculty.updateMany(
                { _id: { $in: notCommonTeachers } },
                { $push: { classes: updatedClass.id } }
            )

            res.status(200).json(updatedClass)
        } catch (err) {
            res.status(503).json(err)
        }
    } else {
        res.status(404).json("class not found")
    }
}

// R
export const getClassroom = async (req, res) => {
    try {
        const getClass = await Classroom.findById(req.params.id);
        // console.log(getClass)
        res.status(200).json(getClass)
    } catch (err) {
        res.json(err)
    }
}

// D
export const deleteClassroom = async (req, res) => {
    try {
        const getClass = await Classroom.findById(req.params.id);
        const studentIds = getClass.students
        const getAttendance = await Attendance.find({ cId: getClass.id })
        // pull that class from classes , also pull attendance of that class from students
        await Student.updateMany(
            { _id: { $in: studentIds } },
            { $pull: { classes: req.params.id } }
        );
        await Attendance.deleteMany({ cId: getClass.id });
        await Classroom.findByIdAndDelete(req.params.id)
        res.status(200).json("Success")
        // console.log("done")
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// CURD

export const getAllClassrooms = async (req, res) => {
    try {
        const classrooms = await Classroom.find({});
        res.status(200).json(classrooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const postStudentInClass = async (req, res) => {
    try {
        const { studentPrn, facultyId } = req.body;
        const classroomId = req.params.id
        const getClass = await Classroom.findById(classroomId)
        const student = await Student.find({ prn: studentPrn });
        const faculty = await Faculty.findById(facultyId);
        student.class = classId;
        await student.save();
        getClass.updateOne(
            classroomId,
            { $push: { students: student._id } }
        )
        res.status(200).json(getClass);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

