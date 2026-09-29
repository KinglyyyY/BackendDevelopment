# Exam01B — TODO APP

**Name:** Aryan Malik  
**SAP ID:** 590011847

A simple Express, EJS and MongoDB application in the same style as the existing lab work.

[Faculty question](https://upessocs.github.io/Lectures/Backend%20Development/Lab/Exam%2001%20B.md)

## Requirements implemented

- Add a task with a title, description, urgent checkbox and important checkbox.
- Reject empty or whitespace-only titles. Description is optional.
- Save both flags as booleans and generate `createdAt` on the server when adding a task.
- Fetch tasks from MongoDB and render the four groups with EJS.
- Delete a selected task using its MongoDB ObjectId.
- Use CSS Grid for the matrix layout (the chosen bonus requirement).

| Group | Urgent | Important |
|---|---|---|
| Do | Yes | Yes |
| Schedule | No | Yes |
| Delegate | Yes | No |
| Eliminate | No | No |

## Run

From this folder:

```bash
npm ci
cp .env.example .env
npm start
```

The example uses the examiner's MongoDB URL `mongodb://127.0.0.1:27017`, database `todo_lab` and collection `tasks`. MongoDB must be running. If using Atlas for home practice, set `MONGODB_URI` in `.env` to your working Atlas connection string and allow your current IP in Atlas Network Access. Keep `DB_NAME=todo_lab`. Do not upload `.env`.

Open http://localhost:3000. Stop another app using port 3000 first, or change `PORT` in `.env`.

## Routes and files

| Method | Route | Purpose |
|---|---|---|
| GET | `/` | Render the task matrix |
| GET | `/tasks/new` | Render the add-task form |
| POST | `/tasks` | Validate and insert a task, then redirect |
| POST | `/tasks/:id/delete` | Delete the task, then redirect |

`app.js` contains the connection and routes. `views/index.ejs` renders the matrix, `views/new.ejs` renders the form, and `public/style.css` styles both pages. One MongoClient is reused; the HTTP server starts after the database connection succeeds.

## Verification and screenshot

Run this version locally with MongoDB and check that each urgency/importance combination lands in the correct quadrant, then try adding and deleting a task. Save a screenshot of the running matrix as `screenshot.png` before submission.
