import * as dotenv from 'dotenv';
import { fetchFamilies } from "../helper/family";

dotenv.config({path:'.env.local'})

console.log("Importing families from Google Sheets...")

//Write 'Hello, world!' to file namd hello.txt
import * as fs from 'fs';

// Use first argument as output file path
const args = process.argv.slice(2)
const outputFile = args[0]

// Clear file
fs.writeFileSync(outputFile, '', 'utf8');

// Fetch families and write to file in .njson format
fetchFamilies().then(families => { 
    families
    .map(f => JSON.stringify(f))
    .map(s => fs.appendFileSync(outputFile, s + '\n', 'utf8'))
})
