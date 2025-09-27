
# GraphQL - Queries and Mutations

## Auth

### Register User
```graphql
mutation {
  registerUser(
    name: "Jonas",
    email: "jonas@trello.com"
    password: "Password1!"
  ) {
    token
    user { id name email role }
  }
}
```

### Login User
```graphql
mutation {
  loginUser(
    email: "user@trello.com",
    password: "Password1!"
  ) {
    token
    user { id name email role }
  }
}
```

> **Tip:** Copy the `token` from the response and set it in the HTTP headers for authenticated requests:
> - As a cookie: `Cookie: Bearer YOUR_TOKEN_HERE`

### Logout User
```graphql
mutation {
  logoutUser
}
```

---

## Users

### Me (Current User)
```graphql
query {
  me {
    id
    name
    email
    role
    createdAt
    updatedAt
    }
}
```

### Get All Users (with search, pagination)
```graphql
query {
  users(page: 1, limit: 10, search: "Jonas") {
    items {
      id
      name
      email
      role
      createdAt
      updatedAt
    }
    totalCount
    hasNextPage
    hasPreviousPage
    currentPage
    totalPages
  }
}
```

### Get User by ID
```graphql
query {
  user(id: "USER_ID") {
    id
    name
    email
    role
    createdAt
    updatedAt
  }
}
```

### Update User (Admin or Self)
```graphql
mutation {
  updateUser(
    id: "USER_ID"
    name: "New Name"
    email: "new@email.com"
    password: "newPassword123!"
    currentPassword: "oldPassword123!"
  ) {
    id
    name
    email
    role
  }
}
```

### Update User Role (Admin only)
```graphql
mutation {
  updateUserRole(userId: "USER_ID", role: ADMIN) {
    id
    name
    email
    role
  }
}
```

### Delete User (Admin or Self)
```graphql
mutation {
  deleteUser(id: "USER_ID")
}
```

### Get Roles
```graphql
query {
  roles
}
```

---

## Projects

### Get Project by ID
```graphql
query {
  project(id: "PROJECT_ID") {
    id
    title
    description
    ownerId
    owner {
      name
      email
    }
    members
    membersList {
      id
      name
      email
    }
    createdAt
    updatedAt
  }
}
```

### Get My Projects
```graphql
query {
  myProjects(page: 1, limit: 10) {
    items {
      id
      title
      description
      ownerId
      owner {
        name
        email
      }
      members
      membersList {
        id
        name
        email
      }
      createdAt
      updatedAt
    }
    totalCount
    hasNextPage
    hasPreviousPage
    currentPage
    totalPages
  }
}
```

### Add Project
```graphql
mutation {
  addProject(
    title: "New Project"
    description: "Project details"
    ownerId: "USER_ID"
    members: ["USER_ID_1", "USER_ID_2"]
  ) {
    id
    title
    description
    ownerId
    members
    createdAt
    updatedAt
  }
}
```

### Update Project
```graphql
mutation {
  updateProject(
    id: "PROJECT_ID"
    title: "Updated Title"
    description: "Updated description"
    ownerId: "USER_ID"
    members: ["USER_ID_1", "USER_ID_2"]
  ) {
    id
    title
    description
    ownerId
    members
    createdAt
    updatedAt
  }
}
```

### Delete Project
```graphql
mutation {
  deleteProject(id: "PROJECT_ID")
}
```

### Add Project Member
```graphql
mutation {
  addProjectMember(projectId: "PROJECT_ID", userId: "USER_ID") {
    id
    members
    membersList {
      id
      name
      email
    }
  }
}
```

### Remove Project Member
```graphql
mutation {
  removeProjectMember(projectId: "PROJECT_ID", userId: "USER_ID") {
    id
    members
    membersList {
      id
      name
      email
    }
  }
}
```

### Join Project
```graphql
mutation {
  joinProject(projectId: "PROJECT_ID") {
    id
    members
    membersList {
      id
      name
      email
    }
  }
}
```

### Leave Project
```graphql
mutation {
  leaveProject(projectId: "PROJECT_ID") {
    id
    members
    membersList {
      id
      name
      email
    }
  }
}
```

### Get All Projects (with search, pagination)
```graphql
query {
  projects(page: 1, limit: 10, search: "Black Sabbath") {
    items {
      id
      title
      description
      ownerId
      owner {
        name
        email
      }
      members
      membersList {
        id
        name
        email
      }
      createdAt
      updatedAt
    }
    totalCount
    hasNextPage
    hasPreviousPage
    currentPage
    totalPages
  }
}
```

---

## Tasks

### Get All Tasks (paginated)
```graphql
query {
  tasks(page: 1, limit: 10) {
    items {
      id
      title
      description
      status
      createdAt
      updatedAt
      finishedAt
      assignedTo
      assignee { id name email }
      finisher { id name email }
      projectId
    }
    totalCount
    hasNextPage
    hasPreviousPage
    currentPage
    totalPages
  }
}
```

### Get Task by ID
```graphql
query {
  task(id: "TASK_ID") {
    id
    title
    description
    status
    createdAt
    updatedAt
    finishedAt
    assignedTo
    assignee { id name email }
    finisher { id name email }
    projectId
  }
}
```

### Get Project Tasks
```graphql
query {
  projectTasks(projectId: "PROJECT_ID", page: 1, limit: 10) {
    items {
      id
      title
      description
      status
      createdAt
      updatedAt
      finishedAt
      assignedTo
      assignee { id name email }
      finisher { id name email }
      projectId
    }
    totalCount
    hasNextPage
    hasPreviousPage
    currentPage
    totalPages
  }
}
```

### Get My Tasks
```graphql
query {
  myTasks(page: 1, limit: 10) {
    items {
      id
      title
      description
      status
      createdAt
      updatedAt
      finishedAt
      assignedTo
      assignee { id name email }
      finisher { id name email }
      projectId
    }
    totalCount
    hasNextPage
    hasPreviousPage
    currentPage
    totalPages
  }
}
```

### Add Task
```graphql
mutation {
  addTask(
    title: "New Task"
    description: "Task details"
    status: TO_DO
    assignedTo: "USER_ID"
    projectId: "PROJECT_ID"
  ) {
    id
    title
    description
    status
    assignedTo
    assignee { id name email }
    projectId
    createdAt
    updatedAt
  }
}
```

### Update Task
```graphql
mutation {
  updateTask(
    id: "TASK_ID"
    title: "Updated Title"
    description: "Updated description"
    status: IN_PROGRESS
    assignedTo: "USER_ID"
  ) {
    id
    title
    description
    status
    assignedTo
    assignee { id name email }
    projectId
    createdAt
    updatedAt
  }
}
```

### Delete Task
```graphql
mutation {
  deleteTask(id: "TASK_ID")
}
```

### Get Task Status Values
```graphql
query {
  taskStatusValues
}
```

---

## Debugging Tips

- Use the login mutation to get a token, then set it in the HTTP headers for all authenticated requests.
- If you get `UNAUTHORIZED` or `UNAUTHENTICATED` errors, check your token and header/cookie settings.
- Use the Apollo Sandbox/Studio "Headers" tab to set cookies or authorization headers.
- For mutations that require admin, use a user with the `ADMIN` role.
- For self-or-admin mutations, you can use either your own user ID or an admin account.
