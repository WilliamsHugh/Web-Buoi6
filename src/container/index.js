const Student = require("../models/Student");
const StudentService = require("../services/student.service");
const StudentController = require("../controllers/student.controller");

// Dependency Injection: wire up model → service → controller
const service = new StudentService(Student);
const controller = new StudentController(service);

module.exports = { service, controller };
