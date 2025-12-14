import { sql } from "@vercel/postgres";
const run = async () => {
  const r = await sql`SELECT id,name,location,rating,content,language,created_at FROM reviews ORDER BY id DESC LIMIT 5;`;
  console.log(r.rows);
};
run();
