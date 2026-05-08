const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
};

const viewsDir = path.join(__dirname, '../src/views');

walk(viewsDir, (filePath) => {
    if (path.extname(filePath) === '.vue') {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;

        const rootDivRegex = /<template>\s*<div\s+class="([^"]*)"/i;
        const match = content.match(rootDivRegex);

        if (match) {
            let classes = match[1];

            if (classes.includes('container') && classes.includes('mx-auto')) {
                classes = classes.replace(/\bpy-\d+\b/g, '').replace(/\bpt-\d+\b/g, '').replace(/\bpb-\d+\b/g, '').trim();
                classes = `${classes} pt-4 pb-12`.replace(/\s+/g, ' ');
                content = content.replace(rootDivRegex, `<template>\n  <div class="${classes}"`);
            }
        }

        if (content !== original) {
            fs.writeFileSync(filePath, content);
            console.log(`Standardized: ${filePath}`);
        }
    }
});
