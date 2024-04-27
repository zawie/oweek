import * as dotenv from 'dotenv';
import { getAllFamilies } from '../helper/db';

dotenv.config({path:'.env'})

import * as fs from 'fs';

const args = process.argv.slice(2)
const outputFile = args[0]

fs.writeFileSync(outputFile, '', 'utf8');

console.log("Downloding visible families")
getAllFamilies().then(families => { 
    families
    .map(f => JSON.stringify(f))
    .map(s => fs.appendFileSync(outputFile, s + '\n', 'utf8'))
})
