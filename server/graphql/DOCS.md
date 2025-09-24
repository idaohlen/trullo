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

### Get All Users
```graphql
query {
  users {
    id
    name
    email
    role
    createdAt
    updatedAt
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

## Tasks

### Get All Tasks
```graphql
query {
  tasks {
    id
    title
    description
    status
    createdAt
    updatedAt
    finishedAt
    assignedTo
    user { id name email }
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
    user { id name email }
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
  ) {
    id
    title
    status
    assignedTo
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
    status
    assignedTo
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
