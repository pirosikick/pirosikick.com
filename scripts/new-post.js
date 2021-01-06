/* eslint-env node */
const fs = require("fs");
const path = require("path");
const fileName = process.argv[2];

if (!fileName) {
  console.error("USAGE: node scripts/new-post.js post-file-name");
  process.exit(1);
}

const template = `---
title: ""
date: ${Math.floor(Date.now() / 1000)}
excerpt: ""

# coverImage: "/assets/${fileName}/some-image.jpg"
# ogImage:
#   url: "/assets/${fileName}/some-image.jpg"
---
`;

fs.writeFileSync(
  path.resolve(__dirname, `../_posts/${fileName}.md`),
  template,
  "utf8"
);
