import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import Ajv from "ajv";

const schema = JSON.parse(
  fs.readFileSync("schema/participant.schema.json", "utf8")
);
const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
const validate = ajv.compile(schema);

const ROOT = "participants";
let checked = 0;
let failed = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".md")) checkFile(full);
  }
}

function checkFile(file) {
  checked++;
  let data;
  try {
    data = matter(fs.readFileSync(file, "utf8")).data;
  } catch (e) {
    failed++;
    console.error(`\n  x ${file}\n     could not parse frontmatter: ${e.message}`);
    return;
  }
  if (!validate(data)) {
    failed++;
    console.error(`\n  x ${file}`);
    for (const err of validate.errors) {
      console.error(`     ${err.instancePath || "(root)"} ${err.message}`);
    }
  }
}

if (fs.existsSync(ROOT)) walk(ROOT);

console.log(`\nChecked ${checked} participant file(s).`);
if (failed) {
  console.error(`${failed} file(s) failed validation.\n`);
  process.exit(1);
}
console.log("All participant cards are valid.\n");
