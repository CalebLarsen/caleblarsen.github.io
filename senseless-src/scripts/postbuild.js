const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', '..', 'assets', 'react-build');
const sourceHtmlPath = path.join(buildDir, 'index.html');
const destIncludePath = path.join(__dirname, '..', '..', '_includes', 'react_senseless_assets.html');

fs.readFile(sourceHtmlPath, 'utf8', (err, htmlData) => {
  if (err) {
    return console.error('Error reading React index.html:', err);
  }

  const head = htmlData.match(/<head>([\s\S]*?)<\/head>/);

  const linkMatches = head ? head[1].match(/<link.*?>/g) : null;
  const linkTags = linkMatches ? linkMatches.join('\n') : '';

  const scriptMatches = head ? head[1].match(/<script.*?<\/script>/g) : null;
  const scriptTags = scriptMatches ? scriptMatches.join('\n') : '';

  const finalContent = `\n${linkTags}\n${scriptTags}`;

  fs.mkdirSync(path.dirname(destIncludePath), { recursive: true });
  
  fs.writeFile(destIncludePath, finalContent, 'utf8', (err) => {
    if (err) {
      return console.error('Error writing Jekyll include file:', err);
    }
    console.log('Successfully created _includes/react_senseless_assets.html');
  });
});
