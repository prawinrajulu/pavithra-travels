const testContent = "MII\\nEvg";
console.log("Original:", testContent);
const stripped = testContent.replace(/[^A-Za-z0-9+/=]/g, '');
console.log("Stripped (Current Logic):", stripped);

const fixed = testContent.replace(/\\n/g, '').replace(/[^A-Za-z0-9+/=]/g, '');
console.log("Stripped (Fixed Logic):", fixed);


// Check if there are any non-base64 characters in the content
const content = rawKey
  .replace(/-----BEGIN PRIVATE KEY-----/g, '')
  .replace(/-----END PRIVATE KEY-----/g, '')
  .replace(/\\n/g, '')
  .replace(/\n/g, '')
  .replace(/\s+/g, '');

const invalidChars = [];
for (let i = 0; i < content.length; i++) {
  if (!content[i].match(/[A-Za-z0-9+/=]/)) {
    invalidChars.push({ char: content[i], code: content[i].charCodeAt(0), pos: i, context: content.substring(Math.max(0, i-5), Math.min(content.length, i+5)) });
  }
}
console.log("Invalid characters found:", invalidChars);

console.log("Content length:", content.length);

// RSA 2048 private keys are usually 1192 bytes raw, which is ~1590 chars base64.
// But some can be longer.
