const Faculty = require('../models/faculty');
const Students = require('../models/students');

const isHod = (req, res, next) => {
  if (req.user.isHod === true) {
    next();
  } else {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
};

const isFaculty = async (req, res, next) => {
  const isFaculty = await Faculty.findById(req.user._id);
  if (isFaculty) {
    next();
  } else {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
};
const isClassTeacher = (req, res, next) => {
  if (req.user.isClassIncharge === true) {
    next();
  } else {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
};
const isStudents = async (req, res, next) => {
  const isStudents = await Students.findById(req.user._id);
  if (isStudents) {
    next();
  } else {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
};
module.exports = {
  isHod,
  isFaculty,
  isClassTeacher,
  isStudents,
};
