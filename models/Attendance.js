import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    AId: {
        type: String,
    },
    // //owners 
    // teachers: {
    //     type: Array,
    //     default: []
    // },
    cId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    studentPresent: {
        type: Array,
        default: [],
    }
},
    { timestamps: true }
);

const attendance = mongoose.model("Attendance", attendanceSchema)
export default attendance;