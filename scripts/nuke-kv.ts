import * as dotenv from 'dotenv';
import { getClient } from '../helper/db';

dotenv.config({path:'.env.local'})

getClient(false).flushall();
console.log("Nuked KV store! 💥")
