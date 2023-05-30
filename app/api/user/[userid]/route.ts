import { NextResponse } from "next/server";

interface IParams {
  userid?: string;
}
export async function POST(
  request: Request, 
  { params }: { params: IParams }
) {
  const { userid } = params;

  if (!userid || typeof userid !== 'string') {
    return NextResponse.json({
      error: 'Invalid userId',
    });
  }

  const userData = {id: userid, content: 'Tested Sucess'};

  return NextResponse.json(userData);
}