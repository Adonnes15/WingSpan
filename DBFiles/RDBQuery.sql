CREATE TABLE [User] (
  [id] INT,
  [EmployeeName] VARCHAR(100),
  [username] VARCHAR(100),
  [password] VARCHAR(100),
  [stack/skillset] VARCHAR(200),
  [reportingMgr] INT,
  PRIMARY KEY ([id]),
  CONSTRAINT [FK_User.reportingMgr]
    FOREIGN KEY ([reportingMgr])
      REFERENCES [User]([id])
);

CREATE TABLE [Activity_monitor] (
  [EmployeeId] INT,
  [activityStatus] BINARY,
  [activityTIme] TIME,
  CONSTRAINT [FK_Activity_monitor.EmployeeId]
    FOREIGN KEY ([EmployeeId])
      REFERENCES [User]([id])
);

CREATE TABLE [Project] (
  [projectId] INT,
  [manager] INT,
  [status] VARCHAR(10),
  [description] VARCHAR(200),
  [url_repo] VARCHAR(200),
  PRIMARY KEY ([projectId]),
  CONSTRAINT [FK_Project.manager]
    FOREIGN KEY ([manager])
      REFERENCES [User]([id])
);

CREATE TABLE [team] (
  [teamId] INT,
  [projLinked] INT,
  [teamLead] INT,
  PRIMARY KEY ([teamId]),
  CONSTRAINT [FK_team.projLinked]
    FOREIGN KEY ([projLinked])
      REFERENCES [Project]([projectId]),
  CONSTRAINT [FK_team.teamLead]
    FOREIGN KEY ([teamLead])
      REFERENCES [User]([id])
);

CREATE TABLE [teamMember] (
  [memberID] INT,
  [teamId] INT,
  [teamRole] VARCHAR(20),
  CONSTRAINT [FK_teamMember.teamId]
    FOREIGN KEY ([teamId])
      REFERENCES [team]([teamId]),
  CONSTRAINT [FK_teamMember.memberID]
    FOREIGN KEY ([memberID])
      REFERENCES [User]([id])
);

CREATE TABLE [task] (
  [taskId] INT,
  [assignedTo] INT,
  [description] VARCHAR(200),
  [deadline] DATE,
  [AssignedDate] DATE,
  [createdBy] INT,
  [status] VARCHAR(10),
  [priority] VARCHAR(10),
  [url_repo] VARCHAR(200),
  PRIMARY KEY ([taskId]),
  CONSTRAINT [FK_task.createdBy]
    FOREIGN KEY ([createdBy])
      REFERENCES [User]([id]),
  CONSTRAINT [FK_task.assignedTo]
    FOREIGN KEY ([assignedTo])
      REFERENCES [User]([id])
);

CREATE TABLE [role] (
  [userId] INT,
  [role] VARCHAR(20),
  [permission] VARCHAR(50),
  PRIMARY KEY ([role]),
  CONSTRAINT [FK_role.userId]
    FOREIGN KEY ([userId])
      REFERENCES [User]([id])
);

