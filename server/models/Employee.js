const mongoose = require('mongoose');

// Define the schema
const employeeSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            required: [true, 'Employee ID is required'],
            unique: true,
            trim: true,
        },
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        },
        department: {
            type: String,
            required: [true, 'Department is required'],
            enum: ['Development', 'Testing', 'DevOps', 'HR', 'Sales'],
        },
        joiningDate: {
            type: Date,
            required: [true, 'Joining date is required'],
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Create model from schema
const Employee = mongoose.model('Employee', employeeSchema);

// Export the model
module.exports = Employee;