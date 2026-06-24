import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class EmbeddingService {

    private openai: OpenAI | null = null;
    private readonly apiKey: string | undefined;

    constructor(private config: ConfigService) {
        this.apiKey = this.config.get<string>('OPENAI_API_KEY');
    }

    private getClient(): OpenAI {
        if (!this.apiKey) {
            throw new ServiceUnavailableException(
                'Pretraga po simptomu nije dostupna jer OPENAI_API_KEY nije podesen.',
            );
        }

        if (!this.openai) {
            this.openai = new OpenAI({ apiKey: this.apiKey });
        }

        return this.openai;
    }

    async getEmbedding(text: string) : Promise<number[]> {
        const response = await this.getClient().embeddings.create({
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

    async transcribeAudio(buffer: Buffer, filename: string): Promise<string> {
        const { toFile } = await import('openai');
        const file = await toFile(buffer, filename, { type: 'audio/m4a' });
        const response = await this.getClient().audio.transcriptions.create({
            model: 'whisper-1',
            file,
            language: 'hr',
        });
        return response.text;
    }
}
