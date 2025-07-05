"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
    ResultSchema,
    resultSchema
} from "@/lib/Schemas";
import {
    createAssignment,
    createResult,
    updateAssignment,
    updateResult,
} from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatDateTimeLocal } from "@/lib/clientUtils";

const ResultForm = ({
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
    } = useForm<ResultSchema>({
        resolver: zodResolver(resultSchema),
    });

    const [state, formAction] = useFormState(
        type === "create" ? createResult : updateResult,
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
            toast.success(`Result has been ${type}d!`);
            setOpen(false);
            router.refresh();
        }
    }, [state, router, type, setOpen]);

    const { examsOrAssignments } = relatedData;

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a new exam" : "Update the exam"}
            </h1>

            <div className="flex justify-between flex-wrap gap-4">
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Title</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("assignmentOrExamId")}
                        defaultValue={data?.assignmentOrExamId}
                    >
                        {examsOrAssignments.map((item: { id: number; title: string }, index: number) => (
                            <option value={item.id} key={index}>
                                {item.title}
                            </option>
                        ))}
                    </select>
                    {errors.assignmentOrExamId?.message && (
                        <p className="text-xs text-red-400">
                            {errors.assignmentOrExamId.message.toString()}
                        </p>
                    )}
                </div>
                <InputField
                    label="Score"
                    name="score"
                    type="number"
                    min={0}
                    max={100}
                    defaultValue={data?.score}
                    register={register}
                    error={errors?.score}
                />
                <InputField
                    label="Student Id"
                    name="studentId"
                    defaultValue={data?.studentId}
                    register={register}
                    error={errors?.studentId}
                />
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Type</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("type")}
                        defaultValue={data?.type}
                    >
                        <option value="assignment">Assignment</option>
                        <option value="exam">Exam</option>
                    </select>
                    {errors.type?.message && (
                        <p className="text-xs text-red-400">
                            {errors.type.message.toString()}
                        </p>
                    )}
                </div>
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

export default ResultForm;