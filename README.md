# School Management System 

##  Introduction / Overview

**School Management System** is a comprehensive platform designed to streamline the management of students, teachers, parents, classes, lessons, exams, attendance, and more. It provides dedicated dashboards for **admin**, **teachers**, **students**, and **parents**, enabling efficient communication, data management, and real-time updates across the school ecosystem.

The system leverages modern web technologies and a robust database schema to ensure scalability, security, and ease of use for all stakeholders.

---

##  Goals of the Project

- Centralize and digitize school operations (attendance, results, events, announcements)
- Enable role-based access and workflows for admin, teachers, students, and parents
- Provide real-time updates and notifications
- Ensure secure data management and privacy
- Offer a user-friendly, responsive interface for all users

---

##  Architecture Overview

- **Frontend**: Next.js (App Router), Tailwind CSS, Clerk authentication
- **Backend**: Next.js, Prisma ORM
- **Database**: PostgreSQL (via Prisma)
- **Deployment**: Vercel (frontend), Supabase (database)

---

###  Frontend
- Built with **Next.js** (App Router)
- Modular, role-based dashboards
- **Tailwind CSS** for styling
- **Clerk** for authentication and user management
- Responsive and accessible UI

###  Backend
- **Next.js** for server-side logic
- **Prisma ORM** for database access
- Organized code: `lib/`, `components/`, `app/`
- Secure role-based route protection

###  Database
- **PostgreSQL** via **Prisma**
- Models: Admin, Teacher, Student, Parent, Class, Subject, Lesson, Exam, Assignment, Result, Attendance, Event, Announcement
- Relational schema with foreign keys and enums

---

##  Key Features

###  Student Features
- View personal profile, results, attendance, timetable
- Access assignments, exams, and announcements
- Communicate with teachers (announcements)

###  Teacher Features
- Manage classes, lessons, assignments, exams
- Record attendance and results
- View and communicate with students and parents

###  Admin Features
- Full CRUD for all entities (students, teachers, parents, classes, etc.)
- Manage events, announcements, and school-wide settings
- Role and access management

###  Parent Features
- View child’s attendance, results, timetable
- Receive announcements and event notifications

---

##  Tech Stack

- **Frontend**: Next.js, Tailwind CSS, Clerk
- **Backend**: Next.js, Prisma ORM
- **Database**: PostgreSQL
- **Other**: Zod (validation), React Hook Form, Recharts, Cloudinary (media), TypeScript

---

##  Database Design (ERD)

| Model         | Key Fields                                                      |
|--------------|-----------------------------------------------------------------|
| Admin        | id, username                                                    |
| Teacher      | id, username, name, surname, email, phone, address, subjects[]  |
| Student      | id, username, name, surname, email, phone, address, parentId    |
| Parent       | id, username, name, surname, email, phone, address, students[]  |
| Class        | id, name, capacity, supervisorId, gradeId, students[]           |
| Subject      | id, name, teachers[], lessons[]                                 |
| Lesson       | id, name, day, startTime, endTime, subjectId, classId, teacherId|
| Exam         | id, title, startTime, endTime, lessonId                         |
| Assignment   | id, title, startDate, dueDate, lessonId                         |
| Result       | id, score, examId, assignmentId, studentId                      |
| Attendance   | id, date, present, studentId, lessonId                          |
| Event        | id, title, description, startTime, endTime, classId             |
| Announcement | id, title, description, date, classId                           |

---

##  User Journey & Flow Diagram

###  Student Flow
Sign Up → Login → View Dashboard → Access Classes/Assignments/Results → View Announcements/Events

###  Teacher Flow
Login → Manage Classes/Lessons → Record Attendance/Results → Post Assignments/Exams → Announce Events

###  Parent Flow
Login → View Child Dashboard → Track Attendance/Results → Receive Announcements

###  Admin Flow
Login → Manage All Entities → Oversee School Data → Post Announcements/Events

---

##  Best Practices

- Secure authentication and role-based access (Clerk)
- Passwords and sensitive data never stored in frontend
- Modular, maintainable code structure
- RESTful API conventions
- Responsive, accessible UI (Tailwind CSS)
- Type safety (TypeScript, Zod)
- Version control (GitHub)

---

##  Author

**Hassan Mehmood**  
Full-Stack Developer | Next.js | Prisma | Scalable Web Apps

- ✉️ hassanmehmood.here@gmail.com

---

##  License

This project is licensed under the [MIT License](./LICENSE).
