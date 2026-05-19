"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const generative_ai_1 = require("@google/generative-ai");
let AppService = class AppService {
    pool;
    model;
    constructor() {
        this.pool = new pg_1.Pool({
            host: process.env.PGHOST || "localhost",
            port: Number(process.env.PGPORT || 5432),
            user: process.env.PGUSER || "postgres",
            password: process.env.PGPASSWORD || "postgres",
            database: process.env.PGDATABASE || "factdrop",
        });
        const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview", generationConfig: { responseMimeType: "application/json" } });
    }
    getHello() {
        return 'Welcome to FactDrop API.';
    }
    async getDomains() {
        const result = await this.pool.query("SELECT id, name FROM domains ORDER BY id ASC");
        if (!result) {
            throw new common_1.NotFoundException("Did not find domains.");
        }
        return result.rows;
    }
    async getFacts(domains) {
        try {
            if (!Array.isArray(domains)) {
                domains = [domains];
            }
            const prompts = [];
            domains.map((domain) => domain.name).forEach((domain) => {
                prompts.push(`Peux-tu m'écrire dans un tableau JSON de chaîne de caractères et seulement retourner ce tableau, ${Math.round(10 / domains.length)} faits aléatoires de 150 caractères à propos de ce domaine: ${domain}`);
            });
            const results = await Promise.all(prompts.map((prompt) => this.model.generateContent(prompt)));
            let output = [];
            results.forEach((result) => {
                output = [...output, ...JSON.parse(result.response.text())];
            });
            const shuffleArray = (array) => {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            };
            return shuffleArray(output);
        }
        catch (error) {
            throw error;
        }
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AppService);
//# sourceMappingURL=app.service.js.map