const mongoose = require('mongoose');
const { comparePassword } = require('../utils/bcrypt.utils');
const { createAccessToken } = require('../utils/jwt.utils');
const schema = mongoose.Schema;

const StudentsSchema = new schema(
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
    prn: {
      type: String,
      required: true,
      unique: true,
    },
    dateofjoining: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    attendance: [
      {
        subject: String,
        attended: Boolean,
        semester: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

StudentsSchema.methods.generateAuthToken = function () {
  const student = {
    _id: this._id,
    name: this.name,
    email: this.email,
    prn: this.prn,
  };
  const token = createAccessToken(student);
  return { token, role: 'student' };
};

StudentsSchema.methods.comparePassword = async function (password) {
  const user = this;
  const isMatch = await comparePassword(password, user.password);
  return isMatch;
};
const Students = mongoose.model('Students', StudentsSchema);
module.exports = Students;
