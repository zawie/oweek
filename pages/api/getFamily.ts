// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Family, getFamilies } from '../../helper/family';
import { getClosestName, getRandomName} from '../../helper/name';

type ErrorResponse = {
  error: string
}

export type SearchResult = {
    queryMade: string | undefined,
    focusName: string,
    homeFamilies: Family[],
    advisingFamilies: Family[],
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResult | ErrorResponse>
) {
    const {query}: {query? : string} = req.query
  
    const families: Family[] = await getFamilies();

    //Find closest name to query
    const name = query != undefined 
        ? await getClosestName(query, families)
        : await getRandomName(families); //Select a random student if no query is specified.

    //Find all families associated with this name
    const homeFamilies = families.filter(f => f.kids.includes(name));
    const advisingFamilies = families.filter(f => f.parents.includes(name));

    res.status(200).json({
        focusName: name, 
        queryMade: query,
        advisingFamilies, 
        homeFamilies
    })
}