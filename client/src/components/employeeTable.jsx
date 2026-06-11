import React from 'react'

// Department badge colors
const DEPT_COLORS = {
  Development: 'dept-dev',
  Testing: 'dept-test',
  DevOps: 'dept-devops',
  HR: 'dept-hr',
  Sales: 'dept-sales',
}

function EmployeeTable({ employees, loading, onEdit, onDelete }) {

  // Show loading message while fetching data
  if (loading) {
    return <div className="table-state">Loading employees...</div>
  }

  // Show empty state if no employees found
  if (employees.length === 0) {
    return <div className="table-state">No employees found. Add your first employee!</div>
  }

  // Get initials from first and last name for avatar
  const getInitials = (firstName, lastName) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  // Format date to DD/MM/YYYY
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN')
  }

  return (
    <div className="table-wrapper">
      <table className="employee-table">

        {/* Table header */}
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Joining Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        {/* Table body - loop through employees */}
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id} className={!emp.active ? 'inactive-row' : ''}>

              {/* Employee ID */}
              <td><span className="emp-id">{emp.employeeId}</span></td>

              {/* Name with avatar initials */}
              <td>
                <div className="emp-cell">
                  <div className="avatar">
                    {getInitials(emp.firstName, emp.lastName)}
                  </div>
                  <span>{emp.firstName} {emp.lastName}</span>
                </div>
              </td>

              {/* Email */}
              <td>{emp.email}</td>

              {/* Department with color badge */}
              <td>
                <span className={`dept-badge ${DEPT_COLORS[emp.department]}`}>
                  {emp.department}
                </span>
              </td>

              {/* Joining date formatted */}
              <td>{formatDate(emp.joiningDate)}</td>

              {/* Active/Inactive status pill */}
              <td>
                <span className={`status-badge ${emp.active ? 'status-active' : 'status-inactive'}`}>
                  {emp.active ? 'Active' : 'Inactive'}
                </span>
              </td>

              {/* Edit and Delete action buttons */}
              <td>
                <div className="action-btns">

                  {/* Edit button - always enabled */}
                  <button
                    className="btn-edit"
                    onClick={() => onEdit(emp)}
                  >
                    Edit
                  </button>

                  {/* Delete button - only enabled if inactive */}
                  <button
                    className={`btn-delete ${emp.active ? 'btn-disabled' : ''}`}
                    onClick={() => onDelete(emp)}
                    disabled={emp.active}
                    title={emp.active ? 'Mark inactive to delete' : 'Delete employee'}
                  >
                    Delete
                  </button>

                </div>
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  )
}

export default EmployeeTable