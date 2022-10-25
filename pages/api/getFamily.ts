// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { google } from "googleapis";

const SHEET_ID = "1MGXOWXowIdSEXNqsdb2iAU1Lla56SrJr8GmyvzXoFgU"
const SERVICE_ACCOUNT_EMAIL = "sheet-reader@oweek-genealogy.iam.gserviceaccount.com"
const SERVICE_ACCOUNT_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDCjCCkXHcpVM+j\nOe6Kl65qH9RI70fYfdY3aOOF8AprImRIKqmcSwiymY+uRFFU2dmTKLpSZfKNilvw\nYQkiJ3kZQ0k65KZrq2w7brR0npAIsW6O5Hs29U/jNF0rv2eFw7qKEZThFmDIK3+w\nfPWU8AIYQW4s4zPxGkshzsIemasUzVY0VUu8Dx/YqZnnuyzkA+QTLCx3VXpE6MC8\nMPfcGlcAmETVfglLTNgY6LCN2BaGYdNR3JrSM4pcEdmbvB3XTWWejitXQH4nP8rt\nwxTcYYH2naE8si0qWX8zXGvroYitB8E32lpWBofNWoZUrOiw6aYiqJn/JhuNZuJi\ncJTYz2xzAgMBAAECggEALgW3LRqgp9rj2cG5H/kc7gcEkZJlZR3zoJ0EAenUlR6I\nKZhKEmqfrpxsJHYN5Ww5r7nZRefPFtOtxzI1VmqPF75WowN3KQ5e5rpcHyBpg1zy\nAgSj707d7Ko1BkXbyAWS6dmZ5huEnqXHqakN8YNLg5Bq71x6K6WkM2W1f0ar9Znq\nHUth5jP6fO/urBhpvQZxF37HoUBh9pxdvOdRDQdx16R3vVdIRARDPDGh47sQtTm+\nhrAQr+SOZR9SCC3dwEzTpkMdU9F7jGfTPpKDIplcuYtsL4F1RSdEVGGcd3QsDH2s\nNVJvgpdSdvLTpJgjVUiYWTo+mghsjAK21Yyl7DxJqQKBgQDggGt1wHSfHh+eBwv5\nzYMydpP/ztN7KM94Tro9VN1+X7IWN8DkAPp8qOl/IrsaJlkuY0aTBIrrOZ66rfIs\noiio1YEo6cB6Rpqv0dsRLDQ64nfZFN4JSLcTWaM/XVjI/eQLZT3q+AcSJY4JWY5b\nbb1y0Yt3KhunqnonqnLcevYseQKBgQDd19HXFFlw2neQAG+yE9l4hWemk7fuRGiJ\nZCRCGP4iXPqApyaK5Pn0McWlXMw3aREcaJg8qQWbQE8OIKP04xmxBNAmzCLBW/Hz\nvsFwIazF1nJSP/4At2Um/cd1tGR7NniyP3M/Y9Rcfo3jYCmO+yFXZCBVgy4gXAnz\nXDLujdBNSwKBgQDO6i2g6s/R896qNM5530ujkBzaMdNC+Rs3REBs1LIMjsDBr4NN\n4gT8LmZ+8hDGij+5/HAIgrBTGtlML5Q8RPz6l0Wi4savLDHYCLBDBJ3jA+X4Iz5+\nChIKeJx4g12YakDrq9VEonNJ62kc/vixFdT9ZVqIazvv7bUGqBeTVJVd6QKBgCff\nOVzh0G2DJoggO/MStDyAJa//zsgpTWycLhQfL9X3RiLHaBsAqpgkNfTRp/axkJy9\ng9crPdG4jjzoyu8hviVdyxeeCwUbxHHdsCC6PLZWI7f6vmlcjPakGCxknsaydKD8\n3HbhN3LkYBYk23NSWZy+Zz1XVXwFbthpktHjdTPfAoGAHwCobFhCq7XeRpZAsaUl\nIU4HcUFIqwSKMy996fQE6JpVNmQ3GBp/YYLniIRUUqGz+5Fd41PwH5b6YUkKfKYG\nHrxGJuzR3aVnZlGL3lVUdcQmku6qeAlWEi/fxrM31RLsy2mLFQzXobyEAviPzJT8\nesdFBBadBl62OeFuhJmDpmo=\n-----END PRIVATE KEY-----\n";

type ErrorResponse = {
  error: string
}

export type SearchResult = {
    focusName: string,
    homeFamilies: Family[],
    advisingFamilies:Family[]
}
export type Family = {
    name: string,
    parents: string[],
    kids: string[],
    year: string,
    college: string
}

type Row = {
    timestamp: Date,
    name: string,
    parents: string,
    kids: string,
    year: string,
    college: string
}

let cachedRows: Row[]
let lastUpdate: number = 0
const timeToLive = 3*60*1000 // 3 minutes

async function getRows(): Promise<Array<any>> {
    const t = new Date().getTime();
    if (lastUpdate + timeToLive < t ) {
        console.log("Fetching and processing row data from google sheets...")
        //Query google
        // console.log("Getting Google auth...")
        const auth = new google.auth.JWT({
            email: SERVICE_ACCOUNT_EMAIL,
            key: SERVICE_ACCOUNT_PRIVATE_KEY,
            scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
        })
        // console.log("Make Google Sheets API reqeust...")
        const sheet = google.sheets("v4")
        const sheetsResponse = await sheet.spreadsheets.get({
            spreadsheetId: SHEET_ID,
            ranges: ["Responses!A:H"],
            includeGridData: true,
            auth: auth,
        });
        // console.log("Processing Google sheets data...")
        // @ts-ignore
        const rowData: Array<any> = sheetsResponse.data.sheets[0].data[0].rowData as Array<any>;
        rowData.shift();
        lastUpdate = t;
    
        let rows: Row[] = rowData.map(r => {
            const values: Array<string> = r.values.map((v: {formattedValue: string}) => v.formattedValue) as Array<string>;
            return {
                timestamp: new Date(values[0]) || "",
                name: values[2] || "",
                year: values[3] || "",
                parents: values[4] || "",
                kids: values[5] || "",
                college: values[6] || "",
            };
        });

        // Filter out duplicate names (keep first instance)
        const usedNames: Set<string> = new Set<string>();
        rows = rows.reverse().filter((row: Row) => {
            const name = row.name.toLowerCase();
            let isUsed: boolean = usedNames.has(name);
            if (!isUsed) {
                //@ts-ignore
                for (const u of usedNames.values()) {
                    const dist = levenshtein(u, name); 
                    // console.log("Distance of", u,name,dist)
                    //Consider very similar oweek group names as the same
                    if (dist < 5) {
                        isUsed = true;
                        break;
                    }
                }
            }
            usedNames.add(name);
            return !isUsed;
        })

        // console.log(usedNames)
        // console.log(rows.map(r => r.name))

        // console.log("Rows processed!")
        console.log("Fresh rows processed and cached!")
        cachedRows = rows;
    } else {
        console.log("Using cached rows data.")
    }
    return cachedRows
}

async function getFamilies(): Promise<Family[]> {
    const rows: Row[] = await getRows();

    return rows.map(r => {
        return {
            name: r.name,
            year: r.year,
            parents: r.parents.split(/,+/).map(s=> s.trim()).filter(s => s.length > 0),
            kids: r.kids.split(/,+/).map(s=> s.trim()).filter(s => s.length > 0),
            college: r.college,
        };
    })
}

//@ts-ignore
const levenshtein = function (s1, s2): number {
    //       discuss at: http://phpjs.org/functions/levenshtein/
    //      original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
    //      bugfixed by: Onno Marsman
    //       revised by: Andrea Giammarchi (http://webreflection.blogspot.com)
    // reimplemented by: Brett Zamir (http://brett-zamir.me)
    // reimplemented by: Alexander M Beedie
    //        example 1: levenshtein('Kevin van Zonneveld', 'Kevin van Sommeveld');
    //        returns 1: 3

    if (s1 == s2) {
        return 0;
    }

    var s1_len = s1.length;
    var s2_len = s2.length;
    if (s1_len === 0) {
        return s2_len;
    }
    if (s2_len === 0) {
        return s1_len;
    }

    // BEGIN STATIC
    var split = false;
    try {
        split = !('0')[0];
    } catch (e) {
        // Earlier IE may not support access by string index
        split = true;
    }
    // END STATIC
    if (split) {
        s1 = s1.split('');
        s2 = s2.split('');
    }

    var v0 = new Array(s1_len + 1);
    var v1 = new Array(s1_len + 1);

    var s1_idx = 0,
        s2_idx = 0,
        cost = 0;
    for (s1_idx = 0; s1_idx < s1_len + 1; s1_idx++) {
        v0[s1_idx] = s1_idx;
    }
    var char_s1 = '',
        char_s2 = '';
    for (s2_idx = 1; s2_idx <= s2_len; s2_idx++) {
        v1[0] = s2_idx;
        char_s2 = s2[s2_idx - 1];

        for (s1_idx = 0; s1_idx < s1_len; s1_idx++) {
            char_s1 = s1[s1_idx];
            cost = (char_s1 == char_s2) ? 0 : 1;
            var m_min = v0[s1_idx + 1] + 1;
            var b = v1[s1_idx] + 1;
            var c = v0[s1_idx] + cost;
            if (b < m_min) {
                m_min = b;
            }
            if (c < m_min) {
                m_min = c;
            }
            v1[s1_idx + 1] = m_min;
        }
        var v_tmp = v0;
        v0 = v1;
        v1 = v_tmp;
    }
    return v0[s1_len];
}

async function getClosestName(query: string): Promise<string> {
    let bestMatch: string = query;
    let best: number = Number.MAX_VALUE;

    //Yeah, that's me!
    if (query.toLowerCase() == "zawie") 
        return "Adam Zawierucha"

    const families: Family[] = await getFamilies();
    const queryParts = query.toLowerCase().split(/ /);

    families.forEach(f =>
        f.kids.concat(f.parents).forEach((name: string) => {
            if (name.toLowerCase() == query.toLowerCase()) {
                best = -1
                bestMatch = name
            }

            //Bias if one part matches exactly
            let mult: number = 1;
            const nameParts = name.toLowerCase().split(/ /);
            queryParts.forEach(p => {
                if (nameParts.includes(p))
                    mult *= 0.1
            });

            const dist = levenshtein(query.toLowerCase(), name.toLowerCase())*mult;
            if (dist < best) {
                best = dist;
                bestMatch = name;
            }
        })
    );

    // console.log(best, bestMatch, query)
    if (best > 3)
        return query
    return bestMatch;
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

    const name:string = await getClosestName(query);

    //Get all families from sheets
    const families: Family[] = await getFamilies();
    const homeFamilies = families.filter(f => f.kids.includes(name));
    const advisingFamilies = families.filter(f => f.parents.includes(name));

    res.status(200).json({
        focusName: name, advisingFamilies, homeFamilies
    })
}