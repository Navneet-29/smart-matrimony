const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    personalDetails: {
        fullname: { type: String, default: "" },
        age: { type: Number },
        gender: { type: String },
        religion: { type: String },
        location: { type: String },
        bio: { type: String },
        profilePic: { type: String } // Base64 string for images or PDFs
    },
    education: {
        degree: { type: String },
        field: { type: String }
    },
    professional: {
        jobTitle: { type: String },
        income: { type: Number }
    },
    preferences: {
        preferredAgeMin: { type: Number },
        preferredAgeMax: { type: Number },
        preferredReligion: { type: String },
        preferredEducation: { type: String },
        preferredGender: { type: String },
        weights: {
            religion: { type: Number, default: 30 },
            education: { type: Number, default: 40 },
            location: { type: Number, default: 30 }
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
