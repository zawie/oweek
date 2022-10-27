// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Family, getFamilies } from '../../helper/family';
import { getBestName, getRandomName} from '../../helper/name';

type ErrorResponse = {
  error: string
}

export type SearchResult = {
    queryMade?: string,
    focusName: string,
    homeFamilies: Family[],
    newphewFamilies: Family[],
    parentFamilies: Family[],
    grandFamilies: Family[],
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResult | ErrorResponse>
) {
    const {query}: {query? : string} = req.query
  
    const families: Family[] = await getFamilies();

    //Find closest name to query
    const name = query != undefined 
        ? await getBestName(query, families)
        : await getRandomName(families); //Select a random student if no query is specified.

    //Find all families associated with this name
    const homeFamilies = families.filter(f => f.kids.includes(name));
    const parentFamilies = families.filter(f => f.parents.includes(name));

    let kids: string[] = [];
    parentFamilies.forEach(family => {
      kids = kids.concat(family.kids);
    });
    const grandFamilies = families.filter(f => 
      f.parents.some(p => kids.includes(p))
    );

    let siblings: string[] = [];
    homeFamilies.forEach(family => {
      kids = kids.concat(family.kids);
    });
    const newphewFamilies = families.filter(f => 
      f.parents.some(p => siblings.includes(p))
    );
    
    res.status(200).json({
        focusName: name, 
        queryMade: query,
        homeFamilies,
        newphewFamilies,
        parentFamilies, 
        grandFamilies
    })
}