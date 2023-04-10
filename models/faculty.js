const mongoose = require('mongoose');
const schema = mongoose.Schema;
const { encryptPassword, comparePassword } = require('../utils/bcrypt.utils');
const { createAccessToken } = require('../utils/jwt.utils');

const FacultySchema = new schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isHod: {
      type: Boolean,
      default: false,
    },
    isClassIncharge: {
      type: Boolean,
      default: false,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    department: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

FacultySchema.pre('save', async function (next) {
  let mentor = this;
  if (!mentor.isModified('password')) return next();
  const hash = await encryptPassword(mentor.password);
  mentor.password = hash;
  return next();
});

FacultySchema.methods.comparePassword = async function (password) {
  const user = this;
  const isMatch = await comparePassword(password, user.password);
  return isMatch;
};

FacultySchema.methods.generateAuthToken = function () {
  const faculty = this;
  const token = createAccessToken(faculty);
  return {
    token,
    role: faculty.isHod
      ? 'hod'
      : faculty.isClassIncharge
      ? 'classIncharge'
      : 'faculty',
  };
};
const Faculty = mongoose.model('faculty', FacultySchema);
module.exports = Faculty;
