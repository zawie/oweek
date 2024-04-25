import * as dotenv from 'dotenv';
import { Family } from "../helper/family";
import {parseNJson} from '../helper/njson'

dotenv.config({path:'.env.local'})

import * as fs from 'fs';
import { insertFamily } from '../helper/db';

// Use first argument as input file path
const args = process.argv.slice(2)
const inputFile = args[0]

// Clear file
const families = parseNJson<Family>(fs.readFileSync(inputFile, 'utf8'))

families.map(f => insertFamily(f))

console.log(`Uploaded families from ${inputFile} to KV! ⬆️`)
