const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const files = ['index.js', 'index.mjs'];

files.forEach(file => {
  const filePath = path.join(distDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    if (!content.startsWith('"use client"')) {
      content = '"use client";\n' + content;
      fs.writeFileSync(filePath, content);
      console.log(`✓ Added "use client" to ${file}`);
    }
  }
});
