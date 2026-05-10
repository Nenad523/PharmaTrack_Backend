# Plan: Symptom Search — Embedding implementacija

## Context

PharmaTrack frontend ima UI za pretragu lijekova po simptomima (`/api/v1/medications?mode=symptom`).
Frontend već šalje zahtjev na `GET /api/v1/medication/search?symptom=...`, ali taj endpoint ne postoji na backendu.

Cilj: implementirati backend endpoint koji prima simptom kao tekst, generiše embedding pomoću OpenAI,
poredi ga sa unaprijed sačuvanim embeddings lijekova (cosine similarity), i vraća top 5 najrelevantnijih.

---

## Redosljed implementacije

### 1. Instalirati OpenAI SDK

```bash
npm install openai
```

Dodati u `.env`:

```
OPENAI_API_KEY=sk-...
```

---

### 2. Dodati `embedding` kolonu u bazu

```sql
ALTER TABLE Medication ADD COLUMN embedding JSON;
```

---

### 3. Popraviti i pokrenuti skript za generisanje embeddings

**Fajl**: `src/common/scripts/generate-embeddings.ts` (već postoji, ali je neispravan)

Zamijeniti sadržaj sa:

```typescript
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
```

Pokrenuti jednom:

```bash
npx ts-node src/common/scripts/generate-embeddings.ts
```

---

### 4. Kreirati EmbeddingService

**Novi fajl**: `src/common/embedding/embedding.service.ts`

```typescript
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";

@Injectable()
export class EmbeddingService {
  private openai: OpenAI;

  constructor(private config: ConfigService) {
    this.openai = new OpenAI({ apiKey: this.config.get("OPENAI_API_KEY") });
  }

  async getEmbedding(text: string): Promise<number[]> {
    const res = await this.openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    return res.data[0].embedding;
  }

  cosineSimilarity(a: number[], b: number[]): number {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dot / (magA * magB);
  }
}
```

Registrovati u `MedicationModule` (dodati u providers i exports).

---

### 5. Dodati `searchBySymptom()` u MedicationRepository

**Fajl**: `src/medication/medication-repository.service.ts`

Injektovati `EmbeddingService` u konstruktor, zatim dodati metodu:

```typescript
async searchBySymptom(symptom: string) {
  // 1. Generiši embedding za uneseni simptom
  const symptomVector = await this.embeddingService.getEmbedding(symptom);

  // 2. Dohvati sve lijekove sa embeddings
  const rows = await this.databaseService.query<any[]>(
    "SELECT id, name, description, img_url, embedding FROM Medication WHERE isActive = 1 AND embedding IS NOT NULL"
  );

  // 3. Izračunaj cosine similarity za svaki lijek
  const scored = rows
    .map((med) => ({
      id: med.id,
      name: med.name,
      description: med.description,
      img_url: med.img_url,
      score: this.embeddingService.cosineSimilarity(
        symptomVector,
        JSON.parse(med.embedding) as number[]
      ),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return {
    success: true,
    data: scored.map(({ score: _score, ...med }) => med),
    count: scored.length,
  };
}
```

---

### 6. Dodati endpoint u Controller

**Fajl**: `src/medication/medication.controller.ts`

Postojeći endpoint `GET /api/v1/medication/search` prihvata `?name=`. Proširiti ga da podrži i `?symptom=`:

```typescript
@Get("search")
async search(
  @Query("name") name?: string,
  @Query("symptom") symptom?: string,
) {
  if (symptom) {
    return this.medicationService.searchBySymptom(symptom.trim());
  }
  if (!name || name.trim().length < 3) {
    throw new BadRequestException("Naziv mora imati najmanje 3 karaktera.");
  }
  return this.medicationService.searchAll(name.trim());
}
```

Ažurirati i `MedicationService` da prosljeđuje poziv repozitoriju.

---

### 7. Generisanje embeddings pri dodavanju novog lijeka

Kada se novi lijek doda u bazu (ako postoji taj endpoint), pozvati:

```typescript
const embedding = await this.embeddingService.getEmbedding(
  `${name} — ${description}`,
);
// sačuvati embedding zajedno sa lijekom
```

---

### 8. Kreirati plan fajl u backend repozitoriju

Kopirati ovaj fajl kao `docs/symptom-search-plan.md` u backend repo.

---

## Kritični fajlovi

| Fajl                                              | Promjena                      |
| ------------------------------------------------- | ----------------------------- |
| `src/common/scripts/generate-embeddings.ts`       | Zamijeniti sadržaj            |
| `src/common/embedding/embedding.service.ts`       | Kreirati novi                 |
| `src/medication/medication-repository.service.ts` | Dodati `searchBySymptom()`    |
| `src/medication/medication.service.ts`            | Delegirati poziv              |
| `src/medication/medication.controller.ts`         | Proširiti `search` endpoint   |
| `src/medication/medication.module.ts`             | Registrovati EmbeddingService |
| `.env`                                            | Dodati `OPENAI_API_KEY`       |

---

## Verifikacija

1. Pokrenuti `generate-embeddings.ts` → provjeriti u bazi da su embeddings popunjeni
2. `GET /api/v1/medication/search?symptom=glavobolja` → treba vratiti Brufen, Paracetamol Galenika, Andol
3. `GET /api/v1/medication/search?symptom=alergija` → treba vratiti Aerius, Pressing
4. `GET /api/v1/medication/search?name=bru` → i dalje radi normalno
5. Na frontendu: ulogovati se → kliknuti "Pretraga po simptomima" → upisati simptom → provjeriti rezultate
