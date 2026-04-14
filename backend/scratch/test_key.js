import admin from 'firebase-admin';

const rawKey = "-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDs7a3sHfvnhpVa\\nPjIUrLEtBR7jG8O55RkpaeCKqAfUjpSgH23oSF+er+y4bpQqXV+XcTiclXUbwMHh\\na1f/jdDJcGlvEZofI8UZO9CCvcExASezfXhcneYUYaZ7ewsQqScE6t/rNz/Kf8ch\\nr1OQNo7x4E6cZnm8O6XMEgA56wVk+tG4FLxJNh0xPOAxd62a9RpjO9lWHs6Z2QIy\\n8LUdXXzuGP/dDTCHmw+8kynY/uTC4QE8mB0P6VMxrUxpqxZQAy9s9oIdYNB//9CJ\\nhSOOl2xJU6kTDRna0O6UPQ9FB1W4W9N/dSnIf1HoeE1EOW38T5Qb24ldm0mbq/p7\\nPKmi2W2bAgMBAAECggEAaYlLzh/jDBQSZhLLSxNLjqK3yfEdo6oNpblgSFMlvcRP\\nJu4pDm1ijnSNzO+QtzhFctd/oJwggJ7BnhArMA3zIS+d/1gHX3SXALD4pawxqIr7\\nrMOogBTjnlOLDXjXCnJWi6W13XgMRb7aLEKFRflPfiVsztUEx9iH91lTWXk7O2l0\\n5MFobzk9hJu2rI1jLssCPklF3PinmY2sHY7tQkf7WwZyrQvt1leCKTEib0QqTEjz\\nTfoLdodb1H82eHTr1HIwriQtAqRMXjbz78149pJ8lRioRjLcpeafolOUERlhrdCN\\nnfT2SLlPSuLCXhmibG00T/h/A1/oY+nVmUWr87+0tQKBgQD4JdveFlGMx892ICyc\\nNi8sp6y8N/Pp9HkccSyVuFP0TJZWDtmFw8IKdoQIgbafmOwdLdF+ajRvzRXgD2Iu\\nxRcnTZ+k+MMnDfVrKEEtUXxiPKETxxZC93cggZahtno0xkvOmzF6DV77S/zaFC/T\\fxRG1AbklUYx9aE21emN0ZDoVwKBgQD0bO++LADBaprXczUIZ0iuAeTHzGbYKBWK\\nXEX7LOKDX6QWBQXMwvNCMDmjgFOVBK0B6wdgsOXbkUnjnD1+NMIha04njqKJnw0O\\nYq/ZYxYTDhXfBspJtkT6NsTxIqhgiPNnvW7TRYhVjqXot087a3s3IunKikxr6SSx\\n9z7ramdqXQKBgQDSIfUbDxlFtto2tK4yJiwyi1baGCOjxVNdw3S24F2vrb9M5sxK\\n2ueRRqUuMvG8GpovZ2JUw4jd9/SDRWOmKV4e+TusTr+rbcWaVX9D6hIDekYI4nk2\\ngipNy48MJ+M6l4UQUxlFutboxIM9BQUu+xjnlZq0rLfBjLhVIDXj00f7hwKBgQDj\\nFyczH7zf9sS/8YjPMu6ixJ2jR/QxViSVNR/LuqsE9eIEl0wJLwNFdnrGvp5MDvx\\nMUTcf94/PmBQ+UNks22+EO0+8VVv2XcO63+H0Hic4ZRObweYrqCtfB9EDjgz4GmM\\n88I4xjxhiTP53/3cLgL/eg+OnylbhPQT6KvrmyNT/QKBgEvEBNLLngrMyA3O5wPB\\nHNfjpQxlAL3DqzNbMZXlxxc+mvlESG4AJRacxu6lZvI51Gf+yKSa1VKadY/lH0Lj\\nKUTMjNlts828SjsGQ/UzwVBjnMn9KiVo2ar6uRLCrNpn/TQyxGYpQApnQZeawcnF\\nY8vaE/7kU9HeZFDrgVPhajJR\\n-----END PRIVATE KEY-----";

function fixKey(key) {
  // Method 1: Simple replace
  return key.replace(/\\n/g, '\n').replace(/^"|"$/g, '').trim();
}

function fixKeyAggressive(key) {
  let base64Content = key
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\\n/g, '')
    .replace(/\n/g, '')
    .replace(/\s+/g, '')
    .replace(/^"|"$/g, '');
    
  const lines = base64Content.match(/.{1,64}/g) || [];
  return `-----BEGIN PRIVATE KEY-----\n${lines.join('\n')}\n-----END PRIVATE KEY-----\n`;
}

const simple = fixKey(rawKey);
console.log("Simple key length:", simple.length);
try {
  admin.credential.cert({ projectId: "test", clientEmail: "test@test.com", privateKey: simple });
  console.log("Simple Method: Success!");
} catch (e) {
  console.log("Simple Method: Failed:", e.message);
}

const aggressive = fixKeyAggressive(rawKey);
console.log("Aggressive key length:", aggressive.length);
try {
  admin.credential.cert({ projectId: "test", clientEmail: "test@test.com", privateKey: aggressive });
  console.log("Aggressive Method: Success!");
} catch (e) {
  console.log("Aggressive Method: Failed:", e.message);
}

