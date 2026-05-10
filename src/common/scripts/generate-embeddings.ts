import * as mysql2 from "mysql2/promise";
import OpenAI from "openai";
import * as dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function run() {
  const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const [rows] = await pool.query<any[]>(
    "SELECT id, name, description FROM Medication WHERE isActive = 1",
  );

  for (const med of rows) {
    const input = `${med.name} — ${med.description}`;
    const res = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input,
    });
    const vector = JSON.stringify(res.data[0].embedding);
    await pool.query("UPDATE Medication SET embedding = ? WHERE id = ?", [
      vector,
      med.id,
    ]);
    console.log(`✓ ${med.name}`);
  }

  await pool.end();
  console.log("Gotovo!");
}

run();