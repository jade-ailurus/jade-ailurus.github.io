// Run after adding a post: node tools/sync-analytics.cjs
// Verify without writing: node tools/sync-analytics.cjs --check
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const check = process.argv.includes('--check');
const skip = new Set(['.git', '.local', 'node_modules', 'docs', 'images', 'tools']);
let pages = 0;
const missing = [];
function visit(directory) {
  for (const item of fs.readdirSync(directory, {withFileTypes: true})) {
    const file = path.join(directory, item.name);
    if (item.isDirectory()) { if (!skip.has(item.name)) visit(file); continue; }
    if (!item.isFile() || !item.name.endsWith('.html')) continue;
    let text = fs.readFileSync(file, 'utf8');
    if (/<meta\b[^>]*http-equiv=["']refresh["']/i.test(text)) continue;
    pages++;
    const prefix = path.relative(path.dirname(file), root).split(path.sep).join('/');
    const asset = name => (prefix ? prefix + '/' : '') + name;
    const lines = ['analytics-config.js', 'analytics.js'].map(name => '  <script src="' + asset(name) + '" defer></script>');
    if (lines.every(line => text.includes(line))) continue;
    missing.push(path.relative(root, file));
    if (!check) {
      const newline = text.includes('\r\n') ? '\r\n' : '\n';
      text = text.replace(/^[ \t]*<script\b[^>]*src=["'][^"']*analytics(?:-config)?\.js["'][^>]*><\/script>\r?\n/gm, '');
      if (!text.includes('</head>')) throw new Error('Missing head: ' + file);
      fs.writeFileSync(file, text.replace('</head>', lines.join(newline) + newline + '</head>'));
    }
  }
}
visit(root);
if (check && missing.length) {
  console.error('Analytics scripts missing from: ' + missing.join(', '));
  process.exitCode = 1;
} else console.log('Analytics coverage: ' + pages + ' content pages; ' + missing.length + (check ? ' missing.' : ' updated.'));
