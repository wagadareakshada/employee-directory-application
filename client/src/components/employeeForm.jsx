import { useState, useEffect } from 'react'
import { createEmployee, updateEmployee } from '../services/employeeService'

// Department options for dropdown
const DEPARTMENTS = ['Development', 'Testing', 'DevOps', 'HR', 'Sales']

// Empty form initial state
const EMPTY_FORM = {
  employeeId: '',
  firstName: '',
  lastName: '',
  email: '',
  department: '',
  joiningDate: '',
  active: true,
}

function EmployeeForm({ initialData, onSuccess, onCancel }) {

  // State to store form field values
  const [formData, setFormData] = useState(EMPTY_FORM)

  // State to store validation error messages
  const [errors, setErrors] = useState({})

  // State to show loading while submitting
  const [loading, setLoading] = useState(false)

  // State to show API error message
  const [apiError, setApiError] = useState('')

  // If editing, pre-fill form with existing employee data
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Format date to YYYY-MM-DD for date input field
        joiningDate: initialData.joiningDate
          ? new Date(initialData.joiningDate).toISOString().split('T')[0]
          : '',
      })
    } else {
      // If adding, reset form to empty
      setFormData(EMPTY_FORM)
    }
  }, [initialData])

  // Validate form fields before submitting
  const validate = () => {
    const newErrors = {}
    if (!formData.employeeId.trim()) newErrors.employeeId = 'Employee ID is required'
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.department) newErrors.department = 'Department is required'
    if (!formData.joiningDate) newErrors.joiningDate = 'Joining date is required'
    return newErrors
  }

  // Handle input change for all fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      // For checkbox use checked, for others use value
      [name]: type === 'checkbox' ? checked : value,
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form first
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setApiError('')

    try {
      if (initialData) {
        // If editing - call update API
        await updateEmployee(initialData._id, formData)
      } else {
        // If adding - call create API
        await createEmployee(formData)
      }
      // Tell parent component form was successful
      onSuccess()
    } catch (err) {
      // Show error from backend
      setApiError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="employee-form">

      {/* Show API error if any */}
      {apiError && <div className="alert alert-error">{apiError}</div>}

      <div className="form-grid">

        {/* Employee ID - disabled when editing */}
        <div className="form-group">
          <label>Employee ID</label>
          <input
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            placeholder="e.g. JT-001"
            disabled={!!initialData}
          />
          {errors.employeeId && <span className="error-msg">{errors.employeeId}</span>}
        </div>

        {/* Department dropdown */}
        <div className="form-group">
          <label>Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
          >
            <option value="">Select department</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {errors.department && <span className="error-msg">{errors.department}</span>}
        </div>

        {/* First Name */}
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First name"
          />
          {errors.firstName && <span className="error-msg">{errors.firstName}</span>}
        </div>

        {/* Last Name */}
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last name"
          />
          {errors.lastName && <span className="error-msg">{errors.lastName}</span>}
        </div>

        {/* Email */}
        <div className="form-group form-full">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@jetatech.com"
          />
          {errors.email && <span className="error-msg">{errors.email}</span>}
        </div>

        {/* Joining Date */}
        <div className="form-group">
          <label>Joining Date</label>
          <input
            type="date"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
          />
          {errors.joiningDate && <span className="error-msg">{errors.joiningDate}</span>}
        </div>

        {/* Active checkbox */}
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
            />
            <span>Active Employee</span>
          </label>
        </div>

      </div>

      {/* Form action buttons */}
      <div className="form-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : initialData ? 'Update Employee' : 'Add Employee'}
        </button>
      </div>

    </form>
  )
}

export default EmployeeForm