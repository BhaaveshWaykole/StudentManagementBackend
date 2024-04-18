import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
    fId : {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    classes: {
        type: Array,
        default: []
    },
    photo: {
        type: String
    }
})

const faculty = mongoose.model("Faculty", facultySchema)
export default faculty