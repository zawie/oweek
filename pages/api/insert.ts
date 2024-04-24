// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Family } from '../../helper/family';
import { insertFamily } from '../../helper/db';

type ErrorResponse = {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse>
) {  
    const family: Family = req.body as Family

    insertFamily(family)
    
    res.status(200)
}