import * as dotenv from 'dotenv';
import { deleteFamily, getClient } from '../helper/db';

dotenv.config({path:'.env'})
// Use first argument as output file path
const families = process.argv.slice(2)

console.log("Deleting families", families)
families.map(f => deleteFamily(f))
