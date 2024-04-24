import { google } from "googleapis";

export type Row = {
    timestamp: Date,
    name: string,
    parents: string,
    kids: string,
    year: string,
    college: string
}

export async function getGoogleSheetsRows(): Promise<Row[]> {
    const private_key = process.env.SERVICE_ACCOUNT_PRIVATE_KEY?.replaceAll(`"`,``).replaceAll(`\\n`, `\n`);
    if (private_key == undefined) {
        throw new Error("No private key for Google ssheets found in environment variables.")
    }
    
    const auth = new google.auth.JWT({
        email: process.env.SERVICE_ACCOUNT_EMAIL,
        key: private_key,
        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    })

    const sheet = google.sheets("v4")
    const sheetsResponse = await sheet.spreadsheets.get({
        spreadsheetId: process.env.SHEET_ID,
        ranges: ["Responses!A:H"],
        includeGridData: true,
        auth: auth,
    });

    // Note: We assume that data exists.
    //@ts-ignore
    const rowData: Array<any> = sheetsResponse.data.sheets[0].data[0].rowData as Array<any>;

    rowData.shift() //Remove header

    //Extract string values from rowData
    const rawRows = rowData.map(r => r.values.map(
        (v: {formattedValue: string | undefined}) => v.formattedValue || ''
    ));

    //Organize rows into convienient data structure
    return rawRows.map(values => {
        return {
            timestamp: new Date(values[0]),
            name: values[2],
            year: values[3],
            parents: values[4],
            kids: values[5],
            college: values[6],
        };
    });
}