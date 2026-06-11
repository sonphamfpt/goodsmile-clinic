const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  content = content.replace(/Bác sĩ Sarah Jenkins/g, 'Bác sĩ Nguyễn Hương');
  content = content.replace(/Dr\. Sarah Jenkins/g, 'Bác sĩ Nguyễn Hương');
  content = content.replace(/Sarah Jenkins/g, 'Nguyễn Hương');
  content = content.replace(/Bác sĩ Sarah/g, 'Bác sĩ Nguyễn Hương');
  content = content.replace(/Sarah/g, 'Hương');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js')) {
      replaceInFile(fullPath);
    }
  });
}

walkDir(directoryPath);
console.log('Done.');
