// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Family } from '../../helper/family';
import { getSimilarNames, normalize, denormalize} from '../../helper/name';
import { getAssociatedFamilies, getPeople, getRandomPerson } from '../../helper/db';
import { track } from '@vercel/analytics/server';

type ErrorResponse = {
  error: string
}

export type SearchResult = {
    queryMade?: string,
    focusName: string,
    homeFamilies: Family[],
    parentFamilies: Family[],
    newphewFamilies: Family[],
    grandFamilies: Family[],
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
    } else {
      const simNames = await getSimilarNames(query, people);
      if (simNames.length > 0) {
        name = simNames[0];
      } else {
        name = query;
      }
    }
    const analyticsPromise = track("Search", {random: query == undefined, query: query || "", name: name})

    const associatedFamiles = await getAssociatedFamilies(name);

    //Find all families associated with this name
    const homeFamilies = associatedFamiles.filter(f => f.kids.map(normalize).includes(normalize(name)));
    const parentFamilies = associatedFamiles.filter(f => f.parents.map(normalize).includes(normalize(name)));

    const siblings = homeFamilies.map(f => f.kids).flat().filter(k => normalize(k) != normalize(name));
    const newphewFamiliesPromise = Promise.all(siblings.map(normalize).map(async k => {
      const f = await getAssociatedFamilies(k)
      return f.filter(f => f.parents.map(normalize).includes(normalize(k)))
    })).then(r => r.flat())

    const kids = parentFamilies.map(f => f.kids).flat()
    const grandFamiliesPromise = Promise.all(kids.map(normalize).map(async k => {
      const f = await getAssociatedFamilies(k)
      return f.filter(f => f.parents.map(normalize).includes(normalize(k)))
    })).then(r => r.flat())

    const [newphewFamilies, grandFamilies] = await Promise.all([newphewFamiliesPromise, grandFamiliesPromise, analyticsPromise])
    res.status(200).json({
        focusName: denormalize(name, associatedFamiles), 
        queryMade: query,
        homeFamilies,
        parentFamilies, 
        newphewFamilies,
        grandFamilies
    })
}