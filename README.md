### A simple todo app to understand how

- `node`
- `typescript`
- `typeorm`
- `jest`

**works together to implement a restful API for your clients apps**

**Some key concepts covered**

- [x] resources in REST APIs
- [x] controllers for business logic
- [x] authentication and authorization
- [x] connecting postgres with an ORM
- [x] how to write tests for your API

#### Project folder structure

```
- Project level

README.md
config
dist
jest.config.js
node_modules
package-lock.json
package.json
src ( source code )
tsconfig.json

- src level

├── app.ts
├── server.ts
├── controllers
│   ├── todos.ts
│   └── users.ts
├── middlewares
│   └── authentication.ts
├── models
│   ├── Todo.ts
│   └── User.ts
├── routes
│   ├── todo.ts
│   ├── todos.ts
│   ├── user.ts
│   └── users.ts
├── tests
│   ├── setup
│   │   └── database.ts
│   └── system
│       ├── todo.test.ts
│       └── user.test.ts
└── utils
    ├── error.ts
    ├── jwt.ts
    ├── password.ts
    └── security.ts
```

_Note_ i am using a tool called `env-cmd` to manage my dev and test environment variables

**To run project on your local**

1. install postgres or any typeorm supported database.
2. run the following commands in your database

```psql -U postgres [ in your terminal ]

create database todo;
create database todo_test;
create user todo with encrypted password 'todo';
grant all privileges on database todo to todo;
grant all privileges on database todo to todo_test;
```

3. run `npm install`
4. start development server `npm start dev`
5. to run tests `npm test`
