import * as dotenv from 'dotenv';
import { fetchFamilies } from "../helper/family";

dotenv.config({path:'.env.'})

import * as fs from 'fs';

// Use first argument as output file path
const args = process.argv.slice(2)
const outputFile = args[0]

fs.writeFileSync(outputFile, '', 'utf8');

// Fetch families and write to file in .njson format
fetchFamilies().then(families => { 
    families
    .map(f => JSON.stringify(f))
    .map(s => fs.appendFileSync(outputFile, s + '\n', 'utf8'))
})

console.log(`Downloaded families to ${+ outputFile} from Google sheets! ⬇️`)