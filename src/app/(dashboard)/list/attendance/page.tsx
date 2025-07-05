// import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { Attendance, Lesson, Prisma, Student } from "@/generated/prisma";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import FormContainer from "@/components/FormContainer";

type AttendanceList = Attendance & { student: Student } & { lesson: Lesson }


const AttendanceListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
    const { userId, sessionClaims } = await auth();
    const currentUserId = userId
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    const columns = [
        {
            header: "Lesson",
            accessor: "lesson",
        },
        {
            header: "Student",
            accessor: "student",
        },
        {
            header: "Date",
            accessor: "date",
            className: "hidden md:table-cell",
        },
        {
            header: "Status",
            accessor: "status",
            className: "hidden md:table-cell",
        },
        ...(role === 'admin' ? [{
            header: "Actions",
            accessor: "action",
        }] : []),
    ];

    const renderRow = (item: AttendanceList) => (
        <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
        >
            <td className="flex items-center gap-4 p-4">{item.lesson.name}</td>
            <td>{item.student.name}</td>
            <td className="hidden md:table-cell">
                {new Intl.DateTimeFormat("en-US").format(item.date)}
            </td>
            <td>{item.present ? "present" : "absent"}</td>
            <td>
                <div className="flex items-center gap-2">
                    {(role === "admin" || role === "teacher") && (
                        <>
                            <FormContainer table="attendance" type="update" data={item} />
                            <FormContainer table="attendance" type="delete" id={item.id} />
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
    const { page, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;

    const query: Prisma.AttendanceWhereInput = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "search":
                        query.OR = [
                            { lesson: { name: { contains: value, mode: "insensitive" } } },
                            { student: { name: { contains: value, mode: "insensitive" } } },
                        ];
                        break;
                    default:
                        break;
                }
            }
        }
    }

    switch (role) {
        case "admin":
            break;
        case "teacher":
            query.lesson = { teacherId: currentUserId! }
            break;

        case "student":
            query.studentId = currentUserId!;
            break;

        case "parent":
            query.student = {
                parentId: currentUserId!,
            };
            break;
        default:
            break;
    }

    const [data, count] = await prisma.$transaction([
        prisma.attendance.findMany({
            where: query,
            include: {
                student: true,
                lesson: true
            },
            take: ITEMS_PER_PAGE,
            skip: ITEMS_PER_PAGE * (p - 1),
        }),
        prisma.attendance.count({ where: query }),
    ]);

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">
                    All Attendances
                </h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/filter.png" alt="" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/sort.png" alt="" width={14} height={14} />
                        </button>
                        {(role === "admin" || role === "teacher") && <FormContainer table="attendance" type="create" />}
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={data} />
            {/* PAGINATION */}
            <Pagination page={p} count={count} />
        </div>
    );
};

export default AttendanceListPage;