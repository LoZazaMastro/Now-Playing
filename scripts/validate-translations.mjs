import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(await readFile(resolve(root, "src/locales.json"), "utf8"));
const reference = catalog.en;
const issues = [];
const expectedLocales = ["en", "it", "es", "fr", "de", "pt-br", "ru", "ja", "ko", "zh"];

const actualLocales = Object.keys(catalog).sort();
const requiredLocales = [...expectedLocales].sort();
if (JSON.stringify(actualLocales) !== JSON.stringify(requiredLocales)) {
  const missing = requiredLocales.filter((locale) => !actualLocales.includes(locale));
  const extra = actualLocales.filter((locale) => !requiredLocales.includes(locale));
  issues.push(`locale set mismatch: missing [${missing.join(", ")}], extra [${extra.join(", ")}]`);
}

function placeholders(value) {
  return [...String(value).matchAll(/\{[A-Za-z0-9_]+\}/g)].map((match) => match[0]).sort();
}

function validateValue(locale, section, key, expected, actual) {
  const path = `${locale}.${section}.${key}`;
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual)) {
      issues.push(`${path}: expected an array`);
      return;
    }
    if (actual.length !== expected.length) {
      issues.push(`${path}: expected ${expected.length} items, found ${actual.length}`);
    }
    expected.forEach((item, index) => validateValue(locale, section, `${key}[${index}]`, item, actual[index]));
    return;
  }

  if (typeof actual !== "string" || actual.trim() === "") {
    issues.push(`${path}: missing or empty translation`);
    return;
  }
  const wanted = JSON.stringify(placeholders(expected));
  const found = JSON.stringify(placeholders(actual));
  if (wanted !== found) issues.push(`${path}: placeholders ${found} do not match ${wanted}`);
}

for (const [locale, sections] of Object.entries(catalog)) {
  const expectedSections = Object.keys(reference).sort();
  const actualSections = Object.keys(sections).sort();
  if (JSON.stringify(expectedSections) !== JSON.stringify(actualSections)) {
    issues.push(`${locale}: section set does not match English`);
    continue;
  }

  for (const [section, referenceValues] of Object.entries(reference)) {
    const values = sections[section];
    const expectedKeys = Object.keys(referenceValues).sort();
    const actualKeys = Object.keys(values ?? {}).sort();
    const extra = actualKeys.filter((key) => !expectedKeys.includes(key));
    if (extra.length) issues.push(`${locale}.${section}: extra [${extra.join(", ")}]`);
    for (const [key, expected] of Object.entries(referenceValues)) {
      if (!(key in (values ?? {}))) continue;
      validateValue(locale, section, key, expected, values[key]);
    }
  }
}

if (issues.length) {
  console.error(`Translation validation failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

const stringCount = Object.values(reference).reduce(
  (total, section) => total + Object.values(section).reduce((sum, value) => sum + (Array.isArray(value) ? value.length : 1), 0),
  0,
);
console.log(`Translations OK: ${Object.keys(catalog).length} locales, ${stringCount} strings per locale.`);
