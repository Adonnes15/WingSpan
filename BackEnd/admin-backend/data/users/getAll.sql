SELECT e.*,m.EmployeeName AS manager_name,r.permission from [User] e LEFT JOIN [User] m ON e.reportingMgr=m.id LEFT JOIN [role] r ON e.roles = r.role
