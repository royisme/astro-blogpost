import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { format } from 'date-fns';
import { slug as slugger } from "github-slugger";

function getDistPath() {
    const distIndex = process.argv.findIndex(arg => arg.startsWith('--dist='));
    if (distIndex > -1 && process.argv[distIndex].includes('=')) {
      return process.argv[distIndex].split('=')[1];
    }
    return '.'; // Use the current directory if --dist is not specified
}


const createPost = (title: string, distPath: string) => {
  const slug = slugger(title);
  const date = format(new Date(), 'yyyy-MM-dd');
  const templatePath = join(__dirname, '..', 'templates', 'postTemplate.md');
  let content = readFileSync(templatePath, 'utf8');

  content = content.replace(/{{title}}/g, title).replace(/{{date}}/g, date);

  const filePath = join(distPath, `${slug}.md`);
  writeFileSync(filePath, content);
  console.log(`Post created: ${filePath}`);
};

const distPath = getDistPath(); // Get the output directory
const title = process.argv.find(arg => !arg.startsWith('--'));
if (!title) {
  console.error('Please provide a title for the post.');
  process.exit(1);
}

createPost(title, distPath);