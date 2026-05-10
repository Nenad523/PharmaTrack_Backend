import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class EmbeddingService {

    private openai: OpenAI;

    constructor(private config: ConfigService) {
        this.openai = new OpenAI({ apiKey : this.config.get("OPENAI_API_KEY")});
    }

    async getEmbedding(text: string) : Promise<number[]> {
        
        const response = await this.openai.embeddings.create({
            model: "text-embedding-3-small",
            input: text
        });

        return response.data[0].embedding;
    }

    cosineSimilarity(a: number[], b: number[]): number {
        const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
        const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
        const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
        return dot / (magA * magB);
    }
}
