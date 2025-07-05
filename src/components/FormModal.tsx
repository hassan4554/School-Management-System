"use client";

import {
    deleteAnnouncement,
    deleteAssignment,
    deleteAttendance,
    deleteClass,
    deleteEvent,
    deleteExam,
    deleteLesson,
    deleteParent,
    deleteResult,
    deleteStudent,
    deleteSubject,
    deleteTeacher,
} from "@/lib/actions";
import { FormContainerProps } from "@/lib/constants";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

const deleteActionMap = {
    subject: deleteSubject,
    class: deleteClass,
    teacher: deleteTeacher,
    student: deleteStudent,
    exam: deleteExam,
    assignment: deleteAssignment,
    result: deleteResult,
    lesson: deleteLesson,
    attendance: deleteAttendance,
    event: deleteEvent,
    announcement: deleteAnnouncement,
    parent: deleteParent,
};

const TeacherForm = dynamic(() => import("./Forms/Teacher"), {
    loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./Forms/Student"), {
    loading: () => <h1>Loading...</h1>,
});
const ClassForm = dynamic(() => import("./Forms/Class"), {
    loading: () => <h1>Loading...</h1>,
});
const ExamForm = dynamic(() => import("./Forms/Exam"), {
    loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import("./Forms/Subject"), {
    loading: () => <h1>Loading...</h1>,
});
const AssignmentForm = dynamic(() => import("./Forms/Assignment"), {
    loading: () => <h1>Loading...</h1>,
});
const ResultForm = dynamic(() => import("./Forms/Result"), {
    loading: () => <h1>Loading...</h1>,
});
const LessonForm = dynamic(() => import("./Forms/Lesson"), {
    loading: () => <h1>Loading...</h1>,
});
const AttendanceForm = dynamic(() => import("./Forms/Attendance"), {
    loading: () => <h1>Loading...</h1>,
});
const EventForm = dynamic(() => import("./Forms/Event"), {
    loading: () => <h1>Loading...</h1>,
});
const AnnouncementForm = dynamic(() => import("./Forms/Announcement"), {
    loading: () => <h1>Loading...</h1>,
});
const ParentForm = dynamic(() => import("./Forms/Parent"), {
    loading: () => <h1>Loading...</h1>,
});
// TODO: OTHER FORMS

const forms: {
    [key: string]: (
        setOpen: Dispatch<SetStateAction<boolean>>,
        type: "create" | "update",
        data?: any,
        relatedData?: any
    ) => JSX.Element;
} = {
    subject: (setOpen, type, data, relatedData) => (
        <SubjectForm
            type={type}
            data={data}
            setOpen={setOpen}
            relatedData={relatedData}
        />
    ),
    class: (setOpen, type, data, relatedData) => (
        <ClassForm
            type={type}
            data={data}
            setOpen={setOpen}
            relatedData={relatedData}
        />
    ),
    teacher: (setOpen, type, data, relatedData) => (
        <TeacherForm
            type={type}
            data={data}
            setOpen={setOpen}
            relatedData={relatedData}
        />
    ),
    student: (setOpen, type, data, relatedData) => (
        <StudentForm
            type={type}
            data={data}
            setOpen={setOpen}
            relatedData={relatedData}
        />
    ),
    exam: (setOpen, type, data, relatedData) => (
        <ExamForm
            type={type}
            data={data}
            setOpen={setOpen}
            relatedData={relatedData}
        />
    ),
    assignment: (setOpen, type, data, relatedData) => (
        <AssignmentForm
            type={type}
            data={data}
            setOpen={setOpen}
            relatedData={relatedData}
        />
    ),
    result: (setOpen, type, data, relatedData) => (
        <ResultForm
            type={type}
            data={data}
            setOpen={setOpen}
            relatedData={relatedData}
        />
    ),
    lesson: (setOpen, type, data, relatedData) => (
        <LessonForm
            type={type}
            data={data}
            setOpen={setOpen}
            relatedData={relatedData}
        />
    ),
    attendance: (setOpen, type, data, relatedData) => (
        <AttendanceForm
            type={type}
            data={data}
            setOpen={setOpen}
            relatedData={relatedData}
        />
    ),
    event: (setOpen, type, data, relatedData) => (
        <EventForm
            type={type}
            data={data}
            setOpen={setOpen}
            relatedData={relatedData}
        />
    ),
    announcement: (setOpen, type, data, relatedData) => (
        <AnnouncementForm
            type={type}
            data={data}
            setOpen={setOpen}
            relatedData={relatedData}
        />
    ),
    parent: (setOpen, type, data, relatedData) => (
        <ParentForm
            type={type}
            data={data}
            setOpen={setOpen}
            relatedData={relatedData}
        />
    ),
};

const FormModal = ({
    table,
    type,
    data,
    id,
    relatedData,
}: FormContainerProps & { relatedData?: any }) => {
    const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
    const bgColor =
        type === "create"
            ? "bg-lamaYellow"
            : type === "update"
                ? "bg-lamaSky"
                : "bg-lamaPurple";

    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Prevent background scroll
        if (open) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            // Restore scroll when modal unmounts
            document.body.style.overflow = "";
        };
    }, [open]);

    const Form = () => {
        const [state, formAction] = useFormState(deleteActionMap[table], {
            success: false,
            error: false,
        });

        const router = useRouter();

        useEffect(() => {
            if (state.success) {
                toast.success(`${table} has been deleted!`);
                setOpen(false);
                router.refresh();
            }
        }, [state, router]);

        return type === "delete" && id ? (
            <form action={formAction} className="p-4 flex flex-col gap-4">
                <input type="text | number" name="id" value={id} hidden />
                <span className="text-center font-medium">
                    All data will be lost. Are you sure you want to delete this {table}?
                </span>
                <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
                    Delete
                </button>
            </form>
        ) : type === "create" || type === "update" ? (
            forms[table](setOpen, type, data, relatedData)
        ) : (
            "Form not found!"
        );
    };

    return (
        <>
            <button
                className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
                onClick={() => setOpen(true)}
            >
                <Image src={`/${type}.png`} alt="" width={16} height={16} />
            </button>
            {open && (
                <div className="w-screen h-screen fixed left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md relative max-h-[95vh] overflow-y-scroll w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
                        <Form />
                        <div
                            className="absolute top-4 right-4 cursor-pointer"
                            onClick={() => setOpen(false)}
                        >
                            <Image src="/close.png" alt="" width={14} height={14} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FormModal;