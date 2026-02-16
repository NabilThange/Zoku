const fs = require("fs");
const lines = fs.readFileSync(process.argv[2], "utf8").split("\n");
let depth = 0;
lines.slice(0, 150).forEach((line, i) => {
  for (const ch of line) {
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
  }
  if (/name:\s*["']/.test(line) || /image:\s*["']/.test(line)) {
    console.log("L" + (i + 1) + " depth=" + depth + " | " + line.trimEnd());
  }
});