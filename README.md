**Expense Management App**
This is a simple Expense Management application built with Node.js, Express, and MongoDB.

**Features**
**Categories:**

**Create, update, delete, and retrieve categories.**
Validate category name for uniqueness and absence of spaces.
**Expenses:**

**Create, update, delete, and retrieve expenses.**
**Validate expense date and amount.**
Getting Started
**Prerequisites**
Node.js installed on your machine.
MongoDB server running locally on mongodb://127.0.0.1:27017/exp-app-dec23.
**Installation**
**Clone the repository:**

git clone https://github.com/your-username/expense-management-app.git
**Install dependencies:**

cd expense-management-app
npm install
**Start the server:**
npm start
The server will be running on http://localhost:3068.

**API Endpoints**
**Get All Categories:**

GET /all-categories
**Get Single Category:**

GET /single-category/:id
**Update Category:**

PUT /update-category/:id
**Remove Category:**

DELETE /remove-category/:id
**Create Category:**

POST /create-categories
**List All Expenses:**

GET /list-expenses
**Get Single Expense:**

GET /single-expense/:id
**Update Expense:**

PUT /update-expense/:id
**Delete Expense:**

DELETE /delete-expense/:id
**Create Expense:**

POST /create-expenses
**Validation**
Request data is validated using Express Validator.
Detailed error messages are returned for validation failures.
Database
**MongoDB is used as the database.**
Connection string: mongodb://127.0.0.1:27017/exp-app-dec23
**Dependencies**
**Express**: Web framework for Node.js.
**Mongoose**: MongoDB object modeling for Node.js.
**Express Validator**: Validator middleware for Express.
Contributing
Feel free to contribute by opening issues, providing feedback, or submitting pull requests.

License
This project is licensed under the MIT License - see the LICENSE file for details.
