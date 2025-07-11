import Announcements from "@/components/Announcement";
import BigCalendarContainer from "@/components/BigCalenderContainer";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";


const ParentPage = async () => {
  const { userId } = await auth();
  const currentUserId = userId;

  const students = await prisma.student.findMany({
    where: {
      parentId: currentUserId!,
    },
  });

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col 2xl:flex-row">
      {/* LEFT */}
      <div className="">
        {students.map((student) => (
          <div className="w-full 2xl:w-2/3" key={student.id}>
            <div className="h-full bg-white p-4 rounded-md">
              <h1 className="text-xl font-semibold">
                Schedule ({student.name + " " + student.surname})
              </h1>
              <BigCalendarContainer type="classId" id={student.classId} />
            </div>
          </div>
        ))}
      </div>
      {/* RIGHT */}
      <div className="w-full 2xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  );
};

export default ParentPage;