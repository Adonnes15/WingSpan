import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'bootstrap';

const defaultEmployee = {
  EmployeeName: '',
  username: '',
  password: '',
  'stack/skillset': '',
  manager_name:'',
};

const API_URL = "http://localhost:1433/api/users";

const EmployeeCrud = () => {
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState(defaultEmployee);
  const [editing, setEditing] = useState(false);
  const [EmployeeID, setEmployeeID] = useState(null);

  useEffect(() => {
    fetchEmployees();
  });

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL);
      setEmployees(response.data.empData || []);
    } catch (error) {
      console.error(error);
    }
  };

  const editEmployee = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      if (response.data && response.data.empData) {
        setEmployee(response.data.empData[0]);
        setEmployeeID(id);
        setEditing(true);

        // Show modal programmatically
        const modalElement = document.getElementById('employeeModal');
        const modal = new Modal(modalElement);
        modal.show();
      } else {
        toast.error("Invalid employee data.");
      }
    } catch (error) {
      toast.error("Error loading employee data");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAndUpdate = async () => {
    try {
      if (editing) {
        console.log(employee)
        // if (employee.reportingMgr.length==0){
        //   employee.reportingMgr=null;
        // }
        await axios.put(`${API_URL}/${EmployeeID}`, employee);
        toast.success("Employee updated");
      } 
      else {
        console.log("hello",employee.manager_name)
        // if (employee.reportingMgr.length==0){
        //   employee.reportingMgr=null;
        // }
        await axios.post(API_URL,employee);
        toast.success("Employee added");
      }
      fetchEmployees();
      setEmployee(defaultEmployee);
      setEditing(false);
      document.querySelector('#employeeModal .btn-close').click(); // Close modal
    } catch (error) {
      console.log(error)
      toast.error("Operation failed");
    }
  };

  const deleteEmployee = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        toast.success("Employee deleted");
        fetchEmployees();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h1>Employee CRUD Ops</h1>

      <button
        className="btn btn-primary mb-3"
        data-bs-toggle="modal"
        data-bs-target="#employeeModal"
        onClick={() => {
          setEmployee(defaultEmployee);
          setEditing(false);
        }}
      >
        Add New Employee
      </button>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Username</th>
            <th>password</th>
            <th>Stack/Skillset</th>
            <th>reporting Manager(Self Join)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.EmployeeName}</td>
                <td>{emp.username}</td>
                <td>{emp.password}</td>
                <td>{emp['stack/skillset']}</td>
                <td>{emp.manager_name}</td>
                <td>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => editEmployee(emp.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteEmployee(emp.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No employees found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      <div
        className="modal fade"
        id="employeeModal"
        tabIndex="-1"
        aria-labelledby="employeeModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="employeeModalLabel">
                {editing ? "Edit Employee" : "Add Employee"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <input
                type="text"
                name="EmployeeName"
                placeholder="Enter name"
                value={employee.EmployeeName || ''}
                onChange={handleInputChange}
                className="form-control mb-3"
              />
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                value={employee.username || ''}
                onChange={handleInputChange}
                className="form-control mb-3"
              />
              <input
                type="text"
                name="password"
                placeholder="Enter password"
                value={employee.password || ''}
                onChange={handleInputChange}
                className="form-control mb-3"
              />
              <input
                type="text"
                name='stack/skillset'
                placeholder="Enter skillz"
                value={employee['stack/skillset'] || ''}
                onChange={handleInputChange}
                className="form-control mb-3"
              />
              <input
                type="text"
                name="manager_name"
                placeholder="Manager"
                value={employee.manager_name || ''}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button type="button" className="btn btn-primary" onClick={handleAddAndUpdate}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCrud;
