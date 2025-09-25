const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', '..', 'senseless');
const sourceHtmlPath = path.join(buildDir, 'index.html');
const destHtmlPath = path.join(buildDir, '..', 'senseless.html');

const frontMatter = `---
layout: default
title: Senseless
---
`;

fs.readFile(sourceHtmlPath, 'utf8', (err, data) => {
  if (err) {
    return console.log('Error reading index.html:', err);
  }

  const newContent = frontMatter + data;

  fs.writeFile(destHtmlPath, newContent, 'utf8', (err) => {
    if (err) {
      return console.log('Error writing new Jekyll page:', err);
    }
    console.log('Success!');
  });
});
