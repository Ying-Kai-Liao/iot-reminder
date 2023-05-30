import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userid } = req.query;
  const userId = Array.isArray(userid) ? userid[0] : userid;
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid ID');
  }
  const userData = getUserData(userId);

  res.status(200).json({ data: userData });
}

function getUserData(userid: string) {
  // Implement your logic here to retrieve or process the user data based on the provided user ID
  // This can involve querying a database or performing any other necessary operations
  // For this example, we'll just return a dummy user object
  return {
    id: userid,
    name: 'John Doe',
    email: 'johndoe@example.com',
    // Include any other relevant user data
  };
}