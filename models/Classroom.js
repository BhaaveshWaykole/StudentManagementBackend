import mongoose from "mongoose";

const classroomSchema = new mongoose.Schema({
    classroomID: {
        type: String
    },
    batch : {
        type : String,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    students: {
        type: Array,
        default: []
    },
    //owners 
    teachers: {
        type: Array,
        default: []
    },
    //announcements : 
    feed: {
        type: Array,
        default: []
    },
    attendance: {
        type: Array,
        default: []
    }
},
    { timestamps: true }
);

const classroom = mongoose.model("Classroom", classroomSchema)
export default classroom;