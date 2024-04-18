import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
    aId: {
        type: String
    },
    teacher: {
        type: String,
        required: true
    },
    content : {
        type: String,
        required: true
    },
    cId : {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
},
    { timestamps: true }
)

const announcement = mongoose.model("announcement", announcementSchema)
export default announcement