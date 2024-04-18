import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from 'cors'

import studentsRoute from './routes/students.js'
import teachersRoute from './routes/teacher.js'
import classroomRoute from './routes/classroom.js'
import attendanceRoute from './routes/attendance.js'
import announcementRoute from './routes/announcements.js'

const app = express();
dotenv.config()

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Connected to db")
})

app.use(express.json())
app.use(cors())
// app.use(helmet())
// app.use(morgan("common"))
app.use('/api/students', studentsRoute);
app.use('/api/teachers', teachersRoute);
app.use('/api/classroom', classroomRoute);
app.use('/api/attendance', attendanceRoute);
app.use('/api/announcement', announcementRoute);

app.listen(8000, () => {
    console.log('Student ZIA 8000 :)');
  });