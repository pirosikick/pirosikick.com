/* eslint-env node */
const fs = require("fs");
const path = require("path");
const makeDir = require("make-dir");
const fileName = process.argv[2];

if (!fileName) {
  console.error("USAGE: node scripts/new-post.js post-file-name");
  process.exit(1);
}

const today = new Date();
const template = `---
title: ""
date: ${Math.floor(today.getTime() / 1000)}
excerpt: ""

# coverImage: "/assets/${fileName}/some-image.jpg"
# ogImage: "/assets/posts/${fileName}/og.jpg"
---
`;

const y = today.getFullYear();
const m = String(today.getMonth() + 1).padStart(2, "0");
const dir = path.resolve(__dirname, `../_posts/${y}/${m}`);
makeDir.sync(dir);

fs.writeFileSync(path.join(dir, `${fileName}.md`), template, "utf8");
