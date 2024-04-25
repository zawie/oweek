// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Family, validate } from '../../helper/family';
import {v4 as uuidv4} from 'uuid';
import { insertFamily } from '../../helper/db';

type ErrorResponse = {
  error?: string
  uuid?: string
}

type Response = {
  uuid: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse | Response>
) {  
    const family: Family = req.body as Family

    if (req.method !== 'PUT') {
      res.status(405).send({ error: 'Only PUT requests allowed' })
      return
    }

    //TODO: Validate family object, return 400 on error

    const v = validate(family)
    if (!v.valid) {
      console.log("Invalid family provided: ", family, v.errors)
      res.status(400).send({ error: 'Invalid family provided.' })
      return
    }

    const uuid = uuidv4()
    family.uuid = uuid
    family.createdAt = new Date()
    try {
      await insertFamily(family)
      console.log("Inserted family: ", family)
      res.status(201).send({ uuid })
    } catch (err) {
      console.error("Failed to insert family: ", family, err)
      res.status(500).send({ error: 'Oops! An unknown error occured.', uuid})
    }

}