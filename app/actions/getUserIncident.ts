import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

export default async function getIncidentByUserId ( userId?: string , time?: string ) {
    try {
        const currentUser = await getCurrentUser();
        const userid = userId ? userId : currentUser?.id;
        if (!userid) throw new Error("No user provided");

        const date = time ? new Date(time) : new Date();
        date.setHours(0,0,0,0);

        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const incidents = await prisma.incident.findMany({
            where: {
                userId: userid,
                time: {
                    gte: date,
                    lt: nextDate,
                },
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return incidents
    } catch (error: any) {
        return error
    }
}