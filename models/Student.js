import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    prn: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    classes: {
        type: Array,
        default: []
    },
    photo: {
        type: String
    },
    attendance: {
        type: Array,
        default: [
            {
                classroom_id: {
                    type: String,
                    required: true
                },
                total_present: {
                    type: Number,
                    required: true
                },
                total_classes: {
                    //count of how many classes happened. needed for total attendance .
                    type: Number,
                    required: true
                }
            }
        ]
    },
    userType : {
        type : String,
        required : true
    }
},
);

const student = mongoose.model("Student", studentSchema)
export default student;