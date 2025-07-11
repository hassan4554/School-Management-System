import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { FormContainerProps } from "@/lib/constants";
import { auth } from "@clerk/nextjs/server";

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
    let relatedData = {};
    const { userId, sessionClaims } = await auth();
    const currentUserId = userId
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    if (type !== "delete") {
        switch (table) {
            case "subject":
                const subjectTeachers = await prisma.teacher.findMany({
                    select: { id: true, name: true, surname: true },
                });
                relatedData = { teachers: subjectTeachers };
                break;
            case "class":
                const classGrades = await prisma.grade.findMany({
                    select: { id: true, level: true },
                });
                const classTeachers = await prisma.teacher.findMany({
                    select: { id: true, name: true, surname: true },
                });
                relatedData = { teachers: classTeachers, grades: classGrades };
                break;
            case "teacher":
                const teacherSubjects = await prisma.subject.findMany({
                    select: { id: true, name: true },
                });
                relatedData = { subjects: teacherSubjects };
                break;
            case "student":
                const studentGrades = await prisma.grade.findMany({
                    select: { id: true, level: true },
                });
                const studentClasses = await prisma.class.findMany({
                    include: { _count: { select: { students: true } } },
                });
                relatedData = { classes: studentClasses, grades: studentGrades };
                break;
            case "exam":
                const examLessons = await prisma.lesson.findMany({
                    where: {
                        ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
                    },
                    select: { id: true, name: true },
                });
                relatedData = { lessons: examLessons };
                break;
            case "assignment":
                const assignmentLessons = await prisma.lesson.findMany({
                    where: {
                        ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
                    },
                    select: { id: true, name: true },
                });
                relatedData = { lessons: assignmentLessons };
                break;
            case "result":
                const assignments = await prisma.assignment.findMany({
                    where: {
                        ...(role === "teacher" ? { lesson: { teacherId: currentUserId! } } : {}),
                    },
                    select: { id: true, title: true },
                });
                const exams = await prisma.exam.findMany({
                    where: {
                        ...(role === "teacher" ? { lesson: { teacherId: currentUserId! } } : {}),
                    },
                    select: { id: true, title: true },
                });
                relatedData = { examsOrAssignments: [...assignments, ...exams] };
                break;
            case "lesson":
                const lessonSubjects = await prisma.subject.findMany({
                    select: { id: true, name: true },
                });
                const lessonClasses = await prisma.class.findMany({
                    select: { id: true, name: true },
                });
                const lessonTeachers = await prisma.teacher.findMany({
                    select: { id: true, name: true, surname: true },
                });
                relatedData = { subjects: lessonSubjects, classes: lessonClasses, teachers: lessonTeachers };
                break;
            case "attendance":
                const attendanceLessons = await prisma.lesson.findMany({
                    where: {
                        ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
                    },
                    select: { id: true, name: true },
                });
                const attendanceStudents = await prisma.student.findMany({
                    select: { id: true, name: true },
                });
                relatedData = { lessons: attendanceLessons, students: attendanceStudents };
                break;
            case "event":
                const eventClasses = await prisma.class.findMany({
                    select: { id: true, name: true }
                })
                relatedData = { classes: eventClasses }
                break;
            case "announcement":
                const announcementClasses = await prisma.class.findMany({
                    select: { id: true, name: true }
                })
                relatedData = { classes: announcementClasses }
                break;
            case "parent":
                const parentStudents = await prisma.student.findMany({
                    select: { id: true, name: true },
                });
                relatedData = { studentsData: parentStudents };
                break;
            default:
                break;
        }
    }

    return (
        <div className="">
            <FormModal
                table={table}
                type={type}
                data={data}
                id={id}
                relatedData={relatedData}
            />
        </div>
    );
};

export default FormContainer;