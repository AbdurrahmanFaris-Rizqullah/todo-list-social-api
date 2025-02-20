/* 
--- Prisma Client Instance ---
 dipakai untuk berkomunikasi dengan database, Agar Prisma tidak membuat koneksi database baru setiap kali API dipanggil untuk menghindari memory leaks.
*/

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
