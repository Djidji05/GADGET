const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
};

const srcDir = path.join(__dirname, '../src');

walk(srcDir, (filePath) => {
    if (path.extname(filePath) === '.vue') {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;

        // 1. Supprimer les commentaires et lignes vides en début de template
        content = content.replace(/<template>[\s\n]+(<!--[\s\S]*?-->[\s\n]*)+/g, '<template>\n');
        content = content.replace(/<template>[\s\n]+/g, '<template>\n');

        // 2. Nettoyer les classes de marge redondantes sur le premier div
        // Si on a py-X et pt-Y ou pb-Z, on essaie de simplifier
        content = content.replace(/(class="[^"]*)\bpy-\d+\b\s+\bpt-\d+\b/g, '$1py-4');

        // 3. Supprimer les mt-0 ou pt-0 inutiles si déjà géré par le layout
        // (Optionnel selon les besoins spécifiques)

        if (content !== original) {
            fs.writeFileSync(filePath, content);
            console.log(`Cleaned: ${filePath}`);
        }
    }
});
