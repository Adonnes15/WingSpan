import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import EmployeeCrud from './employeeCRUD.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <EmployeeCrud />
  </StrictMode>,
)
