/* eslint-env node */
const fs = require("fs");
const fileName = process.argv[2];

if (!fileName) {
  console.error("USAGE: node scripts/new-post.js post-file-name");
  process.exit(1);
}
