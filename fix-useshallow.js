const fs = require('fs');

const files = [
  'src/components/results/RT60Chart.tsx',
  'src/components/SaveDialog.tsx',
  'src/components/parameter-config/image-source-tab/ImageSourceTab.tsx',
  'src/components/parameter-config/RT60Tab.tsx'
];

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Add useShallow import if not present
    if (!content.includes('useShallow')) {
      const reactImport = content.match(/import React.*from ['"]react['"]/);
      if (reactImport) {
        content = content.replace(
          reactImport[0],
          reactImport[0] + "\nimport { useShallow } from 'zustand/react/shallow';"
        );
        modified = true;
      }
    }

    // Fix patterns like: useResult(state=>pickProps
    const pattern1 = /(use(?:Result|Container|Solver|Material|AppStore))\((state|store)\s*=>\s*pickProps\(/g;
    if (pattern1.test(content)) {
      content = content.replace(pattern1, '$1(useShallow($2 => pickProps(');
      // Close the extra parenthesis at the end of the expression
      content = content.replace(/pickProps\([^\)]+\),\s*(state|store)\.[^\)]+\)\)/g, (match) => {
        return match.slice(0, -1) + '))';
      });
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(file, content);
      console.log('Fixed: ' + file);
    } else {
      console.log('No changes needed: ' + file);
    }
  } catch(e) {
    console.log('Error with ' + file + ': ' + e.message);
  }
});

console.log('Done!');
