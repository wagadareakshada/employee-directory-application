const express = require('express');
const router = express.Router();

// Import all controller functions
const {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
} = require('../controllers/employeeController');

// /api/employees
router.route('/')
    .get(getEmployees)
    .post(createEmployee);

// /api/employees/:id
router.route('/:id')
    .get(getEmployeeById)
    .put(updateEmployee)
    .delete(deleteEmployee);

// Export router
module.exports = router;