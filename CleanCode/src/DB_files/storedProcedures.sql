-- GET ALL USERS
CREATE PROCEDURE getAllusersInfo
AS
BEGIN
SELECT * FROM [User];
END
GO
--GET USER BY ID
CREATE PROCEDURE getByID @id INT
AS
SELECT * FROM [User] WHERE id=@id
GO
-- DELETE USER

CREATE PROCEDURE deleteUser @id INT
AS
DELETE FROM [User] WHERE id=@id

-- UPDATE STATUS

CREATE PROCEDURE updateUserInfo @EmployeeName VARCHAR, @username VARCHAR,@password VARCHAR,@skillset VARCHAR,@roles VARCHAR,@id INT,@manager_name VARCHAR
AS
UPDATE [User] SET EmployeeName = @EmployeeName,username = @username,password=@password,[stack/skillset] = @skillset,roles=(SELECT role FROM [role] WHERE role =@roles),reportingMgr = (SELECT id FROM [User] WHERE EmployeeName = @manager_name) WHERE id = @id

-- NEW USER ENTRY

CREATE PROCEDURE newUser @EmployeeName VARCHAR(100), @username VARCHAR(100),@password VARCHAR(100),@skillset VARCHAR(200),@roles VARCHAR(20),@manager_name VARCHAR(100)
AS
INSERT INTO [User](EmployeeName,username,password,[stack/skillset],reportingMgr,roles) VALUES(@EmployeeName,@username,@password,@skillset,(SELECT id FROM [User] WHERE EmployeeName = @manager_name),@roles)