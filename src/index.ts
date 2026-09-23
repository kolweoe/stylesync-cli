#!/usr/bin/env node
import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const program = new Command();
const apiKey = process.env.GEMINI_API_KEY;

function localTranslateMock(input: string, tokens: any): string {
  const lower = input.toLowerCase();
  let result: string[] = [];
  
  if (lower.includes('card')) {
    result.push('rounded-lg shadow-sm border border-slate-200');
  }
  
  const primaryColor = tokens.colors?.primary || '#2563eb';
  const surfaceColor = tokens.colors?.surface || '#f8fafc';

  if (lower.includes('primary')) {
    result.push(`bg-[${primaryColor}] text-white`);
  } else if (lower.includes('surface')) {
    result.push(`bg-[${surfaceColor}]`);
  }
  
  if (lower.includes('32px') || lower.includes('padding 32') || lower.includes('p-8')) {
    result.push('p-8');
  } else if (lower.includes('16px') || lower.includes('padding 16') || lower.includes('p-4')) {
    result.push('p-4');
  } else if (lower.includes('8px') || lower.includes('padding 8') || lower.includes('p-2')) {
    result.push('p-2');
  }

  return result.length > 0 ? result.join(' ') : 'p-4 bg-slate-50';
}

program
  .name('stylesync')
  .description('AI-powered style translator & token guard')
  .argument('[shorthand]', 'Shorthand or natural description')
  .option('--init', 'Initialize a default stylesync.config.json')
  .option('-c, --config <path>', 'Path to custom config file', 'stylesync.config.json')
  .action(async (shorthand: string | undefined, options: { init?: boolean; config: string }) => {
    try {
      const configPath = path.resolve(process.cwd(), options.config);

      if (options.init) {
        const defaultTemplate = {
          colors: { primary: "#4f46e5", surface: "#f1f5f9" },
          spacing: { sm: "8px", md: "16px", lg: "32px" }
        };

        if (fs.existsSync(configPath)) {
          console.log(chalk.yellow(`⚠️ File konfigurasi sudah ada di ${options.config}`));
        } else {
          fs.writeFileSync(configPath, JSON.stringify(defaultTemplate, null, 2), 'utf-8');
          console.log(chalk.green(`✅ Berhasil membuat file konfigurasi: ${options.config}`));
        }
        return;
      }

      if (!shorthand) {
        console.log(chalk.red('❌ Error: Mohon masukkan deskripsi shorthand.'));
        process.exit(1);
      }

      let tokenContext: any = {};
      let rawConfig = '{}';
      
      if (fs.existsSync(configPath)) {
        rawConfig = fs.readFileSync(configPath, 'utf-8');
        tokenContext = JSON.parse(rawConfig);
      } else {
        console.log(chalk.yellow(`⚠️ Config (${options.config}) tidak ditemukan, menggunakan strict default.`));
      }

      console.log(chalk.blue('⏳ Translating & enforcing tokens...'));

      if (!apiKey || apiKey.startsWith('AQ.')) {
        console.log(chalk.yellow('ℹ️ Menggunakan Local Guard/Mock Engine.'));
        const output = localTranslateMock(shorthand, tokenContext);
        console.log(chalk.green('\n✅ Result (Mock Mode):'));
        console.log(chalk.bgGray.white.bold(` ${output} `));
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `
        You are StyleSync Engine. Translate user shorthand/description into clean Tailwind CSS classes.
        MANDATORY RULES:
        - Only use design tokens provided in this config JSON: ${rawConfig}
        - NEVER hardcode arbitrary values if it violates tokens.
        - Output ONLY the CSS/Tailwind class string, no markdown block, no explanation, no quotes.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: shorthand,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.1,
        }
      });

      const output = response.text?.trim() || '';
      console.log(chalk.green('\n✅ Result:'));
      console.log(chalk.bgGray.white.bold(` ${output} `));

    } catch (error: any) {
      console.error(chalk.red('❌ Error:', error.message || error));
    }
  });

program.parse();
