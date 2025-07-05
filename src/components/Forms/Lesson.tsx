"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
    LessonSchema,
    lessonSchema,
} from "@/lib/Schemas";
import {
    createLesson,
    updateLesson,
} from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatDateTimeLocal } from "@/lib/clientUtils";

const LessonForm = ({
    type,
    data,
    setOpen,
    relatedData,
}: {
    type: "create" | "update";
    data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: any;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LessonSchema>({
        resolver: zodResolver(lessonSchema),
    });

    const [state, formAction] = useFormState(
        type === "create" ? createLesson : updateLesson,
        {
            success: false,
            error: false,
        }
    );

    const onSubmit = handleSubmit((data) => {
        formAction(data);
    });

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast.success(`Lesson has been ${type}d!`);
            setOpen(false);
            router.refresh();
        }
    }, [state, router, type, setOpen]);

    const { subjects, classes, teachers } = relatedData || {};

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a new lesson" : "Update the lesson"}
            </h1>

            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Lesson Name"
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors?.name}
                />
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Day</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("day")}
                        defaultValue={data?.day}
                    >
                        <option disabled value="">Select Day</option>
                        <option value="MONDAY">Monday</option>
                        <option value="TUESDAY">Tuesday</option>
                        <option value="WEDNESDAY">Wednesday</option>
                        <option value="THURSDAY">Thursday</option>
                        <option value="FRIDAY">Friday</option>
                    </select>
                    {errors.day?.message && (
                        <p className="text-xs text-red-400">{errors.day.message.toString()}</p>
                    )}
                </div>
                <InputField
                    label="Start Time"
                    name="startTime"
                    defaultValue={formatDateTimeLocal(data?.startTime)}
                    register={register}
                    error={errors?.startTime}
                    type="datetime-local"
                />
                <InputField
                    label="End Time"
                    name="endTime"
                    defaultValue={formatDateTimeLocal(data?.endTime)}
                    register={register}
                    error={errors?.endTime}
                    type="datetime-local"
                />
                {data && (
                    <InputField
                        label="Id"
                        name="id"
                        defaultValue={data?.id}
                        register={register}
                        error={errors?.id}
                        hidden
                    />
                )}
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Subject</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("subjectId")}
                        defaultValue={data?.subjectId}
                    >
                        <option disabled value="">Select Subject</option>
                        {subjects && subjects.map((subject: { id: number; name: string }) => (
                            <option value={subject.id} key={subject.id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
                    {errors.subjectId?.message && (
                        <p className="text-xs text-red-400">{errors.subjectId.message.toString()}</p>
                    )}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Class</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("classId")}
                        defaultValue={data?.classId}
                    >
                        <option disabled value="">Select Class</option>
                        {classes && classes.map((cls: { id: number; name: string }) => (
                            <option value={cls.id} key={cls.id}>
                                {cls.name}
                            </option>
                        ))}
                    </select>
                    {errors.classId?.message && (
                        <p className="text-xs text-red-400">{errors.classId.message.toString()}</p>
                    )}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Teacher</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("teacherId")}
                        defaultValue={data?.teacherId}
                    >
                        <option disabled value="">Select Teacher</option>
                        {teachers && teachers.map((teacher: { id: string; name: string; surname: string }) => (
                            <option value={teacher.id} key={teacher.id}>
                                {teacher.name} {teacher.surname}
                            </option>
                        ))}
                    </select>
                    {errors.teacherId?.message && (
                        <p className="text-xs text-red-400">{errors.teacherId.message.toString()}</p>
                    )}
                </div>
            </div>
            {state.error && (
                <span className="text-red-500">Something went wrong!</span>
            )}
            <button className="bg-blue-400 text-white p-2 rounded-md">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default LessonForm;