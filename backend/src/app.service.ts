import { Injectable, NotFoundException } from '@nestjs/common';
import { DOMAIN } from './app.controller';
import { Pool } from "pg";
import { GoogleGenerativeAI } from "@google/generative-ai";

@Injectable()
export class AppService {
  pool;
  model;

  constructor() {
    this.pool = new Pool({
      host: process.env.PGHOST || "localhost",
      port: Number(process.env.PGPORT || 5432),
      user: process.env.PGUSER || "postgres",
      password: process.env.PGPASSWORD || "postgres",
      database: process.env.PGDATABASE || "factdrop",
    });
    
    // Remplacez par votre clé API obtenue sur Google AI Studio
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    this.model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview", generationConfig: { responseMimeType: "application/json" } });
  }

  getHello(): string {
    return 'Welcome to FactDrop API.';
  }

  async getDomains(): Promise<Array<DOMAIN>> {
    const result = await this.pool.query(
      "SELECT id, name FROM domains ORDER BY id ASC"
    );
    if (!result) {
      throw new NotFoundException("Did not find domains.");
    }
    return result.rows;
  }

  async getFacts(domains: Array<DOMAIN>): Promise<Array<string>> {
    try {
       if (!Array.isArray(domains)) {
        domains = [domains];
      }

      const prompts: Array<string> = [];
      domains.map((domain) => (domain as DOMAIN).name).forEach((domain) => {
        prompts.push(`Peux-tu m'écrire dans un tableau JSON de chaîne de caractères et seulement retourner ce tableau, ${Math.round(10/domains.length)} faits aléatoires de 150 caractères à propos de ce domaine: ${domain}`);
      })

      const results = await Promise.all(prompts.map((prompt) => this.model.generateContent(prompt)));
      let output: Array<string> = [];
      results.forEach((result) => {
        output = [...output, ...JSON.parse(result.response.text())];
      });

      const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          // Choisir un index aléatoire entre 0 et i
          const j = Math.floor(Math.random() * (i + 1));
          
          // Échanger les éléments array[i] et array[j]
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };

      return shuffleArray(output);
      
    } catch (error) {
      throw error;
    }
  }

}
