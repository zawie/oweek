import { google } from "googleapis";
import { stringSimilarity } from './similarity';

const SHEET_ID = "1MGXOWXowIdSEXNqsdb2iAU1Lla56SrJr8GmyvzXoFgU"
const SERVICE_ACCOUNT_EMAIL = "sheet-reader@oweek-genealogy.iam.gserviceaccount.com"
const SERVICE_ACCOUNT_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDCjCCkXHcpVM+j\nOe6Kl65qH9RI70fYfdY3aOOF8AprImRIKqmcSwiymY+uRFFU2dmTKLpSZfKNilvw\nYQkiJ3kZQ0k65KZrq2w7brR0npAIsW6O5Hs29U/jNF0rv2eFw7qKEZThFmDIK3+w\nfPWU8AIYQW4s4zPxGkshzsIemasUzVY0VUu8Dx/YqZnnuyzkA+QTLCx3VXpE6MC8\nMPfcGlcAmETVfglLTNgY6LCN2BaGYdNR3JrSM4pcEdmbvB3XTWWejitXQH4nP8rt\nwxTcYYH2naE8si0qWX8zXGvroYitB8E32lpWBofNWoZUrOiw6aYiqJn/JhuNZuJi\ncJTYz2xzAgMBAAECggEALgW3LRqgp9rj2cG5H/kc7gcEkZJlZR3zoJ0EAenUlR6I\nKZhKEmqfrpxsJHYN5Ww5r7nZRefPFtOtxzI1VmqPF75WowN3KQ5e5rpcHyBpg1zy\nAgSj707d7Ko1BkXbyAWS6dmZ5huEnqXHqakN8YNLg5Bq71x6K6WkM2W1f0ar9Znq\nHUth5jP6fO/urBhpvQZxF37HoUBh9pxdvOdRDQdx16R3vVdIRARDPDGh47sQtTm+\nhrAQr+SOZR9SCC3dwEzTpkMdU9F7jGfTPpKDIplcuYtsL4F1RSdEVGGcd3QsDH2s\nNVJvgpdSdvLTpJgjVUiYWTo+mghsjAK21Yyl7DxJqQKBgQDggGt1wHSfHh+eBwv5\nzYMydpP/ztN7KM94Tro9VN1+X7IWN8DkAPp8qOl/IrsaJlkuY0aTBIrrOZ66rfIs\noiio1YEo6cB6Rpqv0dsRLDQ64nfZFN4JSLcTWaM/XVjI/eQLZT3q+AcSJY4JWY5b\nbb1y0Yt3KhunqnonqnLcevYseQKBgQDd19HXFFlw2neQAG+yE9l4hWemk7fuRGiJ\nZCRCGP4iXPqApyaK5Pn0McWlXMw3aREcaJg8qQWbQE8OIKP04xmxBNAmzCLBW/Hz\nvsFwIazF1nJSP/4At2Um/cd1tGR7NniyP3M/Y9Rcfo3jYCmO+yFXZCBVgy4gXAnz\nXDLujdBNSwKBgQDO6i2g6s/R896qNM5530ujkBzaMdNC+Rs3REBs1LIMjsDBr4NN\n4gT8LmZ+8hDGij+5/HAIgrBTGtlML5Q8RPz6l0Wi4savLDHYCLBDBJ3jA+X4Iz5+\nChIKeJx4g12YakDrq9VEonNJ62kc/vixFdT9ZVqIazvv7bUGqBeTVJVd6QKBgCff\nOVzh0G2DJoggO/MStDyAJa//zsgpTWycLhQfL9X3RiLHaBsAqpgkNfTRp/axkJy9\ng9crPdG4jjzoyu8hviVdyxeeCwUbxHHdsCC6PLZWI7f6vmlcjPakGCxknsaydKD8\n3HbhN3LkYBYk23NSWZy+Zz1XVXwFbthpktHjdTPfAoGAHwCobFhCq7XeRpZAsaUl\nIU4HcUFIqwSKMy996fQE6JpVNmQ3GBp/YYLniIRUUqGz+5Fd41PwH5b6YUkKfKYG\nHrxGJuzR3aVnZlGL3lVUdcQmku6qeAlWEi/fxrM31RLsy2mLFQzXobyEAviPzJT8\nesdFBBadBl62OeFuhJmDpmo=\n-----END PRIVATE KEY-----\n";

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

let cachedFamilies: Family[]
let lastUpdate: number = 0
const timeToLive = 3*60*1000 //3 minutes

export async function getFamilies(): Promise<Array<Family>> {
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
                    const sim = stringSimilarity(u, name); 
                    //Consider very similar oweek group names as the same
                    // console.log(u, name, sim);
                    if (sim > 0.7) {
                        isUsed = true;
                        break;
                    }
                }
            }
            usedNames.add(name);
            return !isUsed;
        })

        cachedFamilies = rows.map(r => {
            return {
                name: r.name,
                year: r.year,
                parents: r.parents.split(/,+/).map(s=> s.trim()).filter(s => s.length > 0),
                kids: r.kids.split(/,+/).map(s=> s.trim()).filter(s => s.length > 0),
                college: r.college,
            };
        })

    } else {
        console.log("Using cached rows data.")
    }
    return cachedFamilies
}