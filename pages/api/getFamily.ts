// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import type { StudentFamily} from "../model/types";

import { google } from "googleapis";

  error: string
}

export type SearchResult = {
    query: string,
    homeFamilies: Family[],
    advisingFamilies:Family[]
}
export type Family = {
    name: string,
    parents: string[],
    kids: string[],
    year: string
}

type Row = {
    name: string,
    parents: string,
    kids: string,
    year: string
}

async function getFamilies(): Promise<Family[]> {
    const auth = new google.auth.JWT({
        email: SERVICE_ACCOUNT_EMAIL,
        key: SERVICE_ACCOUNT_PRIVATE_KEY,
        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    })
    const sheet = google.sheets("v4")
    const sheetsResponse = await sheet.spreadsheets.get({
        spreadsheetId: SHEET_ID,
        ranges: ["Responses!A:H"],
        includeGridData: true,
        auth: auth,
    });
    const rowData: Array<any> = sheetsResponse.data.sheets[0].data[0].rowData
    rowData.shift() // Removes headers
    const rows: Row[] = rowData.map(r => {
        const values: Array<string> = r.values.map(v => v.formattedValue) as Array<string>;
        return {
            name: values[2],
            year: values[3],
            parents: values[4],
            kids: values[5],
        };
    });
    return rows.map(r => {
        return {
            name: r.name,
            year: r.year,
            parents: r.parents.split(/,+/).map(s=> s.trim()),
            kids: r.kids.split(/,+/).map(s=> s.trim())
        };
    })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResult | ErrorResponse>
) {

    const {query}: {query? : string} = req.query

    if (query == undefined) {
        res.status(400).json({
            error: "no query not specified"
        });
        return;
    }

    //Get all families from sheets
    const families: Family[] = await getFamilies();

    //TODO: Coalesce like familes
    const homeFamilies = families.filter(f => f.kids.includes(query));
    const advisingFamilies = families.filter(f => f.parents.includes(query));

    res.status(200).json({
        query, advisingFamilies, homeFamilies
    })
}


// ;(async () => {
//     const auth = new google.auth.JWT({
//         email: SERVICE_ACCOUNT_EMAIL,
//         key: SERVICE_ACCOUNT_PRIVATE_KEY,
//         scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
//     })
//     const sheet = google.sheets("v4")
//     const sheetsResponse = await sheet.spreadsheets.get({
//         spreadsheetId: SHEET_ID,
//         ranges: ["Responses!A:H"],
//         includeGridData: true,
//         auth: auth,
//     });
//     const rowData: Array<any> = sheetsResponse.data.sheets[0].data[0].rowData as Array<any> ;
//
//     rowData.shift() // Removes headers
//     rowData.forEach(r => {
//         const values: Array<string | undefined> = r.values.map(v => v.formattedValue) as Array<string | undefined>;
//         const row: Row = {
//             timestamp: values[0],
//             email: values[1],
//             name: values[2],
//             netid: values[3],
//             college: values[4],
//             parents: values[5],
//             siblings: values[6],
//             kids: values[7],
//         }
//
//         console.log("netid:\t"+row.netid);
//     })
// })()