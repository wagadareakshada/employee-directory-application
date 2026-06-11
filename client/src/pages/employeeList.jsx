import { useState, useEffect } from 'react'
import { getEmployees, deleteEmployee } from '../services/employeeService'
import EmployeeTable from '../components/EmployeeTable'
import EmployeeForm from '../components/EmployeeForm'

function EmployeeList() {

  // State to store all employees from database
  const [employees, setEmployees] = useState([])
  
  // State to show loading spinner while fetching data
  const [loading, setLoading] = useState(false)
  
  // State to show/hide the add/edit form modal
  const [showForm, setShowForm] = useState(false)
  
  // State to store employee being edited (null means add mode)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  
  // State to show error messages
  const [error, setError] = useState('')
  
  // State to show success messages
  const [success, setSuccess] = useState('')

  // Fetch employees when component mounts (page loads)
  useEffect(() => {
    fetchEmployees()
  }, [])

  // Function to fetch all employees from backend
  const fetchEmployees = async () => {
    setLoading(true)
    try {
      const data = await getEmployees()
      setEmployees(data.data)
    } catch (err) {
      setError('Failed to fetch employees')
    } finally {
      // Stop loading whether success or error
      setLoading(false)
    }
  }

  // Open empty form for adding new employee
  const handleAddClick = () => {
    setSelectedEmployee(null)
    setShowForm(true)
  }

  // Open form pre-filled with employee data for editing
  const handleEditClick = (employee) => {
    setSelectedEmployee(employee)
    setShowForm(true)
  }

  // Delete employee after confirmation
  const handleDeleteClick = async (employee) => {
    // Show confirmation dialog before deleting
    if (!window.confirm(`Are you sure you want to delete ${employee.firstName}?`)) return
    try {
      await deleteEmployee(employee._id)
      setSuccess('Employee deleted successfully!')
      // Refresh the employee list after deletion
      fetchEmployees()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete employee')
    }
  }

  // Called when form is submitted successfully
  const handleFormSuccess = () => {
    setShowForm(false)
    setSelectedEmployee(null)
    // Refresh list to show updated data
    fetchEmployees()
    setSuccess(selectedEmployee ? 'Employee updated!' : 'Employee added!')
  }

  // Close form without saving
  const handleFormCancel = () => {
    setShowForm(false)
    setSelectedEmployee(null)
  }

  // Auto clear success and error messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('')
        setError('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success, error])

  // Calculate stats for the stat cards
  const totalEmployees = employees.length
  const activeEmployees = employees.filter(emp => emp.active).length
  const inactiveEmployees = employees.filter(emp => !emp.active).length

  return (
    <div className="container">

      {/* Navbar with title and add button */}
      <nav className="navbar">
        <h1 className="nav-title">Employee Directory</h1>
        <button className="btn-primary" onClick={handleAddClick}>
          + Add Employee
        </button>
      </nav>

      {/* Success and error message alerts */}
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Stats cards showing employee counts */}
      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Total Employees</p>
          <p className="stat-value blue">{totalEmployees}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Active</p>
          <p className="stat-value green">{activeEmployees}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Inactive</p>
          <p className="stat-value red">{inactiveEmployees}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Departments</p>
          <p className="stat-value">{[...new Set(employees.map(e => e.department))].length}</p>
        </div>
      </div>

      {/* Employee table component */}
      <EmployeeTable
        employees={employees}
        loading={loading}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Modal form for add/edit - only shown when showForm is true */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              {/* Title changes based on add or edit mode */}
              <h2>{selectedEmployee ? 'Edit Employee' : 'Add Employee'}</h2>
              <button className="modal-close" onClick={handleFormCancel}>✕</button>
            </div>
            <EmployeeForm
              initialData={selectedEmployee}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}

    </div>
  )
}

export default EmployeeList