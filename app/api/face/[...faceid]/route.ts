import { NextResponse } from "next/server";
import getIncidentByUserId from "@/app/actions/getUserIncident";

interface IParams {
    faceid?: string;
}

export async function GET(
    request: Request,
    { params }: { params: IParams }
) {
    const { faceid } = params;
    let response = 'no incidents find';
    if(faceid) {
        let userId = '';
        switch (faceid) {
            case '0':
                userId = '64807b117dfbadacd3cc2328';
                break;
            case '1':
                userId = '64807b73dd3e08f6b29a7481';
                break;
            default:
                break;
        }
        if (userId !== ''){
            response = await getIncidentByUserId(userId);
        }
    }

    return NextResponse.json({
        status: 'ok',
        message: response,
    })
}

