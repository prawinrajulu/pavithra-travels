import fs from 'fs';

const serviceAccount = {
  "type": "service_account",
  "project_id": "pavithra-travels-12986",
  "private_key_id": "33d53d7cf63191e481f0fa569706a3c708743e87",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDubZSdjBERg5C7\nzYlUqWb7pG/yaM1IEFKtD2HLoBjf8EljcY9bI1rKFsj8/lLCQTGaHzNBOYadwMWx\nXqgUt1TA0Ie8gWmFJiT/7p+a3PNBnvwD6zoMEkdoSf5aZCdo6crl2yScobpDcpVz\nZX1vu1O4kjcdbPd72fpVNFKFA7SX7FWTOMOmGak3gCIj10laoKFz37pJI2TiihlS\nlg4zH6OciFeR7Cb2dq4YVjx6/hXjgHlmahs1yCF0rRbeYwoierbhv0sKQu0WwgO4\nYLIzOcHwysHgHXQP/0c+e6ovaFT4bA7kFp8t5Zr98ZYe84kRi8jhRe660pGt9/Do\n35RtDsJ9AgMBAAECggEAELVvtonAEXbjn/Gjt+HmRGjN6pJDHpN8Q8IB87vsulbT\nwcsNxZCI9oQZwjcNdC0O7ZLVq/K81xXRFODCDS+a2idS99gm3ayiZ6ggmcD1sCnU\n1e54YyutwuZ6k3mU1HKb5DdTDcH8tGjVheB9JaUeVR80CxUdk9mfBDUWOlmb4JCN\n+wkGOOiD133JcQhT0wjun+Q3h2KF5MxghJleSCuGxnLeCIKOznfooIeNADt2Hm4C\n8Es6BVAZibSLA4X3zKQwzDXrmI2AsN80J8vD5Cd3N4LBCbotFswxwQ/kbX0RP7p+\nEnzNZ+WJbubKwAkTZhR2K1sembF+cijoh93xXDe5YQKBgQD+m3kkl6CXMTWkOHsX\nT49NtiS91gKNKQCE17JkW9bn7uA129CgqMEwHRci4DuCNbTXJyr0zxt7jb4YUZgJ\nN+e4eWS6bEtMd2CRU6vBwRnCmY+Xnl963/cOGf+acUM8YRQnvl5oQ+F5dIQUKjdz\n+faJsOAfu0kOIs9+igCSkPFj4QKBgQDvu3OT20bD2U02gzV20fYv0AWgYB44pxYY\nzuVXn03O+s6UUdcO6C4xGv6USVcFVsAIg1LrkLWoi/KJGh9yFx/914BMOb3Bdd/H\ntBlUnXiIoTa0AWDXkFzq09IVNkBBjrtlYrvpyWXBVT4XoKkbSNZLpKfAYHpNkJKp\npjvX8sSyHQKBgG4pTu0qPe2s+Qyo83lOjy6MlLEem9P/3Z2cxi7uHboUfSZQiaA5\n4/yxWYVZh+X63tgItmleAwIefhV/mEzEx5nlzFNs79eR/1Jh5Xrb1g2A68QqXh2I\nMhkD3rgwMWs6hcH8eFScqj4mz875xSyFBsrkoNSZ8C4Rmb2icET6ObeBAoGAO/98\nE5sjgMyXyHbaIJy3sourfNHRfnhCzX6qY12ZSZ33qaM54Z82QE/zOwWH4+wsL3U+\ngXo8HKy5zJpfGFy1QwB2OZ2R4iMwGHj4hfbLPdarLC3UIN8egh71Sx3CwyWHvP4S\n7ZXcA6Dj42HwMMXv7AqPeVQsB9GRAyh5fbhihfkCgYBeL/r/mNHyqq3d63SihlPt\nKvPUrC6gANTbtgRjD4drhuP78Y4iW6aqMGvwmpcDYt2LDwKftrURM3GHYWYaSD1u\nC6+svEL+aT9NFHL7qa/yTWrq7sdAr01f/KnAfYqJz/8xh5zcs0oFOiTKPbgTI6s8\nzQOcvi3SAlLGlx1IBeWsqg==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@pavithra-travels-12986.iam.gserviceaccount.com"
};

const envContent = `FIREBASE_PROJECT_ID=${serviceAccount.project_id}
FIREBASE_PRIVATE_KEY="${serviceAccount.private_key.replace(/\n/g, '\\n')}"
FIREBASE_CLIENT_EMAIL=${serviceAccount.client_email}
FIREBASE_DATABASE_URL=https://pavithra-travels-12986.firebaseio.com
FIREBASE_API_KEY=AIzaSyAxND3gXtknsh_HNWPbVsSoYSQXj4UkPns
FIREBASE_AUTH_DOMAIN=pavithra-travels-12986.firebaseapp.com
FIREBASE_STORAGE_BUCKET=pavithra-travels-12986.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=916534369049
FIREBASE_APP_ID=1:916534369049:web:3d7928e957219b45590388
FIREBASE_MEASUREMENT_ID=G-BL2Z2DFYH8

# Server Config
port=10000
NODE_ENV=development
JWT_SECRET=1b21cf6437f22d5ef9503ea399172f98ac431d419cfbce038d5495339e129a3a8a55e056cf3ae96c905931575b41433ac82bbd3e7dddb5ba303aa1eaf3e06b02
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:5175,http://127.0.0.1:5173,http://127.0.0.1:5174,http://127.0.0.1:5175,http://10.123.76.166:5173
RESEND_API_KEY=re_UNBmmmmq_Nf8UJ251f44Z2KvLH76YGc71
OWNER_EMAIL=pprawin48@gmail.com
`;

fs.writeFileSync('.env', envContent);
console.log(".env file updated with correct Service Account credentials");
