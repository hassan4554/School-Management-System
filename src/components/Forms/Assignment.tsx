"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
    AssignementSchema,
    assignementSchema,
} from "@/lib/Schemas";
import {
    createAssignment,
    updateAssignment,
} from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatDateTimeLocal } from "@/lib/clientUtils";

const AssignmentForm = ({
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
    } = useForm<AssignementSchema>({
        resolver: zodResolver(assignementSchema),
    });

    const [state, formAction] = useFormState(
        type === "create" ? createAssignment : updateAssignment,
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
            toast.success(`Assignment has been ${type}d!`);
            setOpen(false);
            router.refresh();
        }
    }, [state, router, type, setOpen]);

    const { lessons } = relatedData;

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a new exam" : "Update the exam"}
            </h1>

            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Assignment title"
                    name="title"
                    defaultValue={data?.title}
                    register={register}
                    error={errors?.title}
                />
                <InputField
                    label="Start Date"
                    name="startDate"
                    defaultValue={formatDateTimeLocal(data?.startDate)}
                    register={register}
                    error={errors?.startDate}
                    type="datetime-local"
                />
                <InputField
                    label="End Date"
                    name="dueDate"
                    defaultValue={formatDateTimeLocal(data?.dueDate)}
                    register={register}
                    error={errors?.dueDate}
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
                    <label className="text-xs text-gray-500">Lesson</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("lessonId")}
                        defaultValue={data?.teachers}
                    >
                        {lessons.map((lesson: { id: number; name: string }) => (
                            <option value={lesson.id} key={lesson.id}>
                                {lesson.name}
                            </option>
                        ))}
                    </select>
                    {errors.lessonId?.message && (
                        <p className="text-xs text-red-400">
                            {errors.lessonId.message.toString()}
                        </p>
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

export default AssignmentForm;