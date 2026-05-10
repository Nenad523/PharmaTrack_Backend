/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { MedicationDto } from './dto/medication-dto';
import { DatabaseService } from '../database/database.service';
import { MedicationCard } from './types/medication-list.type';
import { MedicationPanel } from './types/medication-panel.type';
import { MedicationRow } from './types/medication-row';
import { Doses } from './types/medication-doses.type';
import { EmbeddingService } from '../common/embedding/embedding.service';

@Injectable()
export class MedicationRepository {

    constructor(
        private db: DatabaseService,
        private embeddingService: EmbeddingService
               ) {}

    async searchAll(name: string){
        
        try {

            const medications = await this.db.query<MedicationCard[]>(
                'SELECT id, name, description, img_url FROM Medication WHERE name LIKE ? AND isActive = 1',
                [`%${name}%`]
            );
        
            if (medications.length === 0){
                return {
                         data: [],
                         message: `Lijek sa nazivom "${name}" ne postoji u sistemu.`
                }
            }
            
            return {
                success: true,
                data: medications,
                count: medications.length
            }

        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške.');
        }
    }

    async searchOne(id: number){
        
        try {
            
                const rows = await this.db.query<MedicationRow[]>(
                                   `SELECT 
                                    M.id,
                                    M.name,
                                    M.description,
                                    M.img_url,
                                    AI.id AS activeIngredient_id,
                                    AI.name AS activeIngredient_name
                                    FROM Medication M
                                    LEFT JOIN Medication_ActiveIngredient MAI 
                                        ON M.id = MAI.medication_id
                                    LEFT JOIN ActiveIngredient AI 
                                        ON AI.id = MAI.activeIngredient_id
                                    WHERE M.isActive = 1 AND M.id = ?`,
                                    [id]
                              );

            if (rows.length === 0){
                throw new NotFoundException(`Lijek sa ID-em ${id} ne postoji.`);
            }
            
            const medicationMap = new Map<number, MedicationPanel>();

            for (const row of rows){
                if (!medicationMap.has(row.id)){
                    medicationMap.set(row.id, {
                        id: row.id,
                        name: row.name,
                        description: row.description,
                        img_url: row.img_url,
                        activeIngredients: [],
                    });
                }

                if (row.activeIngredient_id) {
                    medicationMap.get(row.id)!.activeIngredients.push({
                    id: row.activeIngredient_id,
                    name: row.activeIngredient_name
                });
                }
            }

            const result = Array.from(medicationMap.values())[0];

            return {    
                success: true,
                data: result
            }

        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške.');
        }
    }

    async searchDoses(id: number){
        
        try {
            
            const rows = await this.db.query<Doses[]>(
                                   `SELECT 
                                    D.id,
                                    D.strength
                                    FROM Medication M
                                    LEFT JOIN Doses D 
                                        ON M.id = D.medication_id
                                    WHERE M.id = ? AND D.isActive = 1`,
                                    [id]
            );
            
            if (rows.length === 0){
                return {
                         data: [],
                         message: `Lijek sa ID-em ${id} nema aktivnih doza.`
                }
            }

            return {
                success: true,
                data: rows,
                count: rows.length
            }

        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške.');
        }
    }

    async getAlternatives(id: number){
        
        try {
            
            const rows = await this.db.query<MedicationCard[]>(
                                   `SELECT DISTINCT
                                    M.id,
                                    M.name,
                                    M.description,
                                    M.img_url,
                                    M.isActive
                                    FROM Medication M
                                    LEFT JOIN Medication_ActiveIngredient MAI
                                        ON M.id = MAI.medication_id
                                    WHERE M.id <> ? AND MAI.activeIngredient_id IN (
                                        SELECT MAI1.activeIngredient_id from Medication_ActiveIngredient MAI1
                                        WHERE MAI1.medication_id = ?)`,
                                    [id, id]
            );

            if (rows.length === 0){
                return {
                         data: [],
                         message: `Lijek sa ID-em ${id} nema alternativnih lijekova.`
                }
            }

            return {
                success: true,
                data: rows,
                count: rows.length
            }

        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške.');
        }
    }

    async getPopular(){

        try {
            
            const rows = await this.db.query<string[]>(
                'SELECT name FROM Medication M ORDER BY search_count DESC LIMIT 7'
            );

            if (rows.length === 0){
                return {
                         data: [],
                         message: `Nijedan lijek još nije pretražen.`
                }
            }

            return {
                success: true,
                data: rows
            }

        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške.');
        }
    }

    async searchBySymptom(symptom: string){

        // 1. Generisati embedding za uneseni simptom
        const symptomVector = await this.embeddingService.getEmbedding(symptom);

        // 2. Dohvati sve lijekove sa embeddings
        const rows = await this.db.query<any[]>(
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
}
