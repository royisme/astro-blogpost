#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname} from 'path';
import { format } from 'date-fns';
import { slug } from 'github-slugger';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
function getDistPath() {
    const distIndex = process.argv.findIndex(arg => arg.startsWith('--dist='));
    if (distIndex > -1 && process.argv[distIndex].includes('=')) {
      return process.argv[distIndex].split('=')[1];
    }
    return '.'; // Use the current directory if --dist is not specified
}

const createPost = (title: string, distPath: string) => {
  const postSlug = slug(title);
  const date = new Date().toISOString();
  const templatePath = join(__dirname, '../src', 'templates', 'postTemplate.md');
  let content = readFileSync(templatePath, 'utf8');

  content = content.replace(/{{title}}/g, title)
            .replace(/{{date}}/g, date)
            .replace(/{{slug}}/g, postSlug);

  const filePath = join(distPath, `${postSlug}.md`);
  writeFileSync(filePath, content);
  console.log(`Post created: ${filePath}`);
};

const distPath = getDistPath(); // Get the output directory
const title = process.argv.slice(2).find(arg => !arg.startsWith('--'));
if (!title) {
  console.error('Please provide a title for the post.');
  process.exit(1);
}

createPost(title, distPath);