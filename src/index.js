#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const genai_1 = require("@google/genai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const program = new commander_1.Command();
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error(chalk_1.default.red('❌ Error: GEMINI_API_KEY belum diset di file .env'));
    process.exit(1);
}
const ai = new genai_1.GoogleGenAI({ apiKey });
program
    .name('stylesync')
    .description('AI-powered style translator & token guard')
    .argument('<shorthand>', 'Shorthand or natural description (e.g., "primary card with 16px padding")')
    .action(async (input) => {
    try {
        const configPath = path.resolve(process.cwd(), 'stylesync.config.json');
        let tokenContext = '{}';
        if (fs.existsSync(configPath)) {
            tokenContext = fs.readFileSync(configPath, 'utf-8');
        }
        else {
            console.log(chalk_1.default.yellow('⚠️ stylesync.config.json tidak ditemukan, menggunakan strict default.'));
        }
        const systemInstruction = `
        You are StyleSync Engine. Translate user shorthand/description into clean Tailwind CSS classes.
        MANDATORY RULES:
        - Only use design tokens provided in this config JSON: ${tokenContext}
        - NEVER hardcode arbitrary values (like bg-[#123456] or p-[13px]) if it violates tokens.
        - Output ONLY the CSS/Tailwind class string, no markdown block, no explanation, no quotes.
      `;
        console.log(chalk_1.default.blue('⏳ Translating & enforcing tokens...'));
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: input,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.1,
            }
        });
        const output = response.text?.trim() || '';
        console.log(chalk_1.default.green('\n✅ Result:'));
        console.log(chalk_1.default.bgGray.white.bold(` ${output} `));
    }
    catch (error) {
        console.error(chalk_1.default.red('❌ Error:', error.message || error));
    }
});
program.parse();
//# sourceMappingURL=index.js.map