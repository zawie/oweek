// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Family } from '../../helper/family';
import { getSimilarNames, normalize, denormalize} from '../../helper/name';
import { getAssociatedFamilies, getPeople, getRandomPerson } from '../../helper/db';

type ErrorResponse = {
  error: string
}

export type SearchResult = {
    queryMade?: string,
    focusName: string,
    homeFamilies: Family[],
    parentFamilies: Family[],
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResult | ErrorResponse>
) {
    const {query}: {query? : string} = req.query
      
    const people = await getPeople();

    //Find closest name to query
    let name: string;
    if (query == undefined) {
      name = await getRandomPerson();
      console.log("RANDOM", name)
    } else {
      const simNames = await getSimilarNames(query, people);
      if (simNames.length > 0) {
        name = simNames[0];
      } else {
        name = query;
      }
      console.log("SELECTED", name)
    }

    const associatedFamiles = await getAssociatedFamilies(name);

    console.log(associatedFamiles)
    //Find all families associated with this name
    const homeFamilies = associatedFamiles.filter(f => f.kids.map(normalize).includes(normalize(name)));
    const parentFamilies = associatedFamiles.filter(f => f.parents.map(normalize).includes(normalize(name)));

    res.status(200).json({
        focusName: denormalize(name, associatedFamiles), 
        queryMade: query,
        homeFamilies,
        parentFamilies, 
    })
}