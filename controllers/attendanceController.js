import Classroom from '../models/Classroom.js';
import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';

// C 
export const createAttendance = async (req, res) => {
    console.log("Zian says Hi");
    try {
        const dateToFind = req.body.date;
        const classToFind = req.body.cId;
        //         // console.log(dateToFind)
        const attendanceRecordDate = await Attendance.findOne({ date: dateToFind, cId: classToFind })
        
        if (!(attendanceRecordDate)) {
            // create attendance obj
            const attendanceClass = new Attendance({
                cId: req.body.cId, // take class id for which class attendance is getting created.
                date: req.body.date,
                studentPresent: req.body.studentPresent
            })
            // save attendance obj to db
            
            console.log("Hello");
            await attendanceClass.save();
            console.log(attendanceClass);

            // find the classroom in which attendance is created -> class id in body given.Then update that class attendance array give the attendance id to class ->> attendance -(put attendance id here) attendance id.
            const updateClassroom = await Classroom.findByIdAndUpdate(
                attendanceClass.cId,
                { $push: { attendance: attendanceClass.id } },
                { new: true }
            );
            // for (const studentId of req.body.studentPresent) {
            //     await Student.findByIdAndUpdate(
            //         studentId,
            //         { $push: { attendance: attendanceClass.id } }
            //     );
            // }      
                  //similarly for students :-
            // but mostly no need as of this as while crreating a attendance one cannot give student as parameter from frontend .. remove later if needed similarly in create attendance obj remove studentPresent when remove this.
            const updateStudentPromises = attendanceClass.studentPresent.map(async studentId => {
            //     // Update attendanceRecord by pushing the student ID
                return Student.findByIdAndUpdate(
                    studentId,
                    { $push: { attendance: attendanceClass.id } },
                    { new: true }
                );
            });

            res.status(200).json(attendanceClass)
        } else {
            res.status(503).json("attendance already exist.")
        }
    } catch (err) {
        res.status(err)
    }
}

// U
// updating student in attendance
export const updateAttendance = async (req, res) => {
    try {
        const getAttendance = await Attendance.findById(req.params.id);
        const classId = await Classroom.findOne({ _id: req.body.cId })
        if (classId.id === getAttendance.cId) {
            try {
                const getStudids = getAttendance.studentPresent
                // filter all those student ids not present in attendance already so that we will get attendance to mark of student which is requested by teacher to mark, andit just ensures if already marked it will skip those 
                const notCommonStudents = req.body.studentPresent.filter(studentId => !getStudids.includes(studentId));
                // filter - returns array of student who are not present.

                if (notCommonStudents > 0) {
                    // Update getAttendance by pushing the student ID
                    const updateAttendees = await Attendance.findByIdAndUpdate(
                        req.params.id,
                        {
                            $push: {
                                studentPresent: { $each: notCommonStudents }
                            }
                        },
                        { new: true }
                    );

                    await Student.updateMany(
                        { _id: { $in: notCommonStudents } },
                        { $push: { attendance: updateAttendees.id } }
                    )
                    res.status(200).json(getAttendance.studentPresent);
                    // res.status(200).json("Success");
                }
                // const updatedAttendees = await Promise.all(updateAttendeesPromises);
            }
            catch (err) {
                res.status(200).json(err);
            }
        } else {
            res.status(503).json("attendance does not exist")
        }
    } catch (err) {
        res.status(err)
    }
}

// R :
export const getAttendance = async (req, res) => {
    const aId = req.params.id;
    try {
        const getAttendance = await Attendance.findById(aId)
        res.status(200).json(getAttendance);
    } catch (err) {
        res.status(err)
    }
}
// D :
export const deleteAttendance = async (req, res) => {
    try {
        if (req.params.id === req.body.attId) {
            try {
                const studIds = await Student.find({ attendance: req.params.id })
                // promise all -> used to handle multiple async requests in map() concurrently
                // can use attendance : {$each} too instead
                const studIdlist = await Promise.all(studIds.map(async (ids) => {
                    // pull used to delete or pull of a specific record.
                    await Student.updateOne(
                        { _id: ids.id },
                        { $pull: { attendance: req.params.id } }
                    )
                }))
                await Attendance.findByIdAndDelete(req.params.id) // deletes the main atendance .. Hence the output erase the attendance also attendance of student of that deleted record -> consistency
                res.status(200).json("Attendance has been deleted");
            } catch (err) {
                return res.status(500).json(err);
            }
        } else {
            return res.status(403).json("Unable to delete");
        }
    } catch (err) {
        res.status(err)
    }
}

export const getStudentsForAttendance = async (req, res) => {
    // console.log("hi")
    const getAttendanceDoc = await Attendance.findById(req.params.id);
    const getClassroomDoc = await Classroom.findById(getAttendanceDoc.cId);
    try {
        const attendanceArr = getAttendanceDoc.studentPresent
        const studenArr = getClassroomDoc.students
        const studentsWithoutAttendance = studenArr.filter(student => !attendanceArr.includes(student));
        res.status(200).json(studentsWithoutAttendance)
    } catch (err) {
        res.status(503).json(err)
    }
}

export const getAbsentStudentsForAttendance = async (req, res) => {
    // console.log("hi")
    const getAttendanceDoc = await Attendance.findById(req.params.id);
    const getClassroomDoc = await Classroom.findById(getAttendanceDoc.cId);
    try {
        const attendanceArr = getAttendanceDoc.studentPresent
        const studenArr = getClassroomDoc.students
        const studentsWithoutAttendance = studenArr.filter(student => !attendanceArr.includes(student));
        res.status(200).json(studentsWithoutAttendance)
    } catch (err) {
        res.status(503).json(err)
    }
}




// Under update attendance if needed :- check once at final .
//
// get a particular student where attendance -> class id and student class id is same i.e student is in that class in which attendance is being marked (which is in id in paramater).

// Might not need this method above prolly -> cause while displaying attendance to mark already show array of students in that class only hence no need to check if the attendance  class id and stud class id matches as students of that class will be displayed only i.e class.student array. then mark so without this can work
// get student from non common students.

// const getStudsInclass = await Student.find({ _id: { $in: notCommonStudents } });

// check frm which if the person is in class and attendance -> class id is same.
// const attendanceStuds = getStudsInclass.filter(stud => stud.classes.some(classId => classId.toString() === getAttendance.cId.toString()));
//