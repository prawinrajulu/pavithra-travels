# Deployment & Production Checklist

Complete checklist for preparing Pavithra Travels for production deployment.

## Pre-Deployment Checklist

### Security & Environment
- [ ] Generate strong JWT_SECRET (use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- [ ] Update all `.env` files with production values
- [ ] Remove all console.log statements from backend
- [ ] Enable Firestore security rules (security rules provided in FIREBASE_SETUP.md)
- [ ] Setup Firebase Authentication providers
- [ ] Configure CORS origins for production domain
- [ ] Setup HTTPS for backend API
- [ ] Enable Firebase email verification

### Database
- [ ] Backup Firestore data before deployment
- [ ] Create Firestore indexes (if using complex queries)
- [ ] Setup data validation rules
- [ ] Create admin user for managing content
- [ ] Populate destination/temple data

### Backend
- [ ] Build TypeScript: `npm run build`
- [ ] Test production build locally: `npm start`
- [ ] Setup environment variables on hosting platform
- [ ] Configure error logging (Sentry, LogRocket, etc.)
- [ ] Setup monitoring and alerts
- [ ] Test all API endpoints
- [ ] Verify authentication flow

### Frontend
- [ ] Update `VITE_API_URL` to production API endpoint
- [ ] Build production bundle: `npm run build`
- [ ] Test production build: `npm run preview`
- [ ] Optimize images and assets
- [ ] Setup analytics (Google Analytics, etc.)
- [ ] Configure error tracking
- [ ] Test on multiple browsers

### Testing
- [ ] Unit tests for critical functions
- [ ] Integration tests for API endpoints
- [ ] E2E tests for user workflows
- [ ] Load testing on API
- [ ] Security scanning
- [ ] Performance optimization

---

## Deployment Options

### Option 1: Firebase Functions (Recommended)

#### Setup
1. Install Firebase CLI:
```bash
npm install -g firebase-tools
firebase login
firebase init functions
```

2. Move backend code to `functions/` directory

3. Update `functions/package.json` with dependencies

#### Deploy
```bash
firebase deploy --only functions,hosting
```

**Pros:**
- Easy Firebase integration
- Auto-scaling
- Low cost for small projects
- Built-in monitoring

**Cons:**
- Cold start latency
- Limited function size
- Firebase-dependent

### Option 2: Heroku

#### Setup
1. Create `Procfile`:
```
web: npm start
```

2. Create `runtime.txt`:
```
node-16.19.0
```

#### Deploy
```bash
heroku create pavithra-travels-api
git push heroku main
heroku config:set FIREBASE_PROJECT_ID=...
# Set all env variables
```

**Pros:**
- Simple deployment
- Good documentation
- Auto-scaling available

**Cons:**
- Paid service
- Cold start issues
- Limited customization

### Option 3: AWS EC2 / Lightsail

#### Setup
1. Create EC2 instance (Node.js AMI)
2. SSH into instance
3. Clone repository
4. Install dependencies: `npm install`
5. Build: `npm run build`
6. Setup PM2 or systemd for auto-restart

#### Deploy
```bash
git pull origin main
npm install
npm run build
pm2 restart api
```

**Pros:**
- Full control
- Scalable
- Multiple regions available

**Cons:**
- More complex setup
- Need to manage infrastructure
- Higher cost

### Option 4: Railway / Render / Fly.io

#### Setup
1. Connect GitHub repository
2. Set environment variables in dashboard
3. Configure build command: `npm run build`
4. Configure start command: `npm start`
5. Deploy

**Pros:**
- Modern alternatives to Heroku
- Easy GitHub integration
- Reasonable pricing

**Cons:**
- Smaller ecosystems
- Less documentation

---

## Environment Variables - Production

### Backend (.env.production)
```env
FIREBASE_PROJECT_ID=pavithra-travels-prod
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@pavithra-travels-prod.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://pavithra-travels-prod.firebaseio.com

PORT=3001
NODE_ENV=production

# Use strong secret in production
JWT_SECRET=your-128-character-random-string-here
JWT_EXPIRES_IN=7d

# Update to production frontend URL
CORS_ORIGIN=https://www.pavithratravels.com

# Logging
LOG_LEVEL=info
```

### Frontend (.env.production)
```env
VITE_API_URL=https://api.pavithratravels.com/api

VITE_FIREBASE_API_KEY=your-production-api-key
VITE_FIREBASE_AUTH_DOMAIN=pavithra-travels-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=pavithra-travels-prod
VITE_FIREBASE_STORAGE_BUCKET=pavithra-travels-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

---

## Post-Deployment

### Monitoring
- [ ] Setup error tracking (Sentry)
- [ ] Monitor API response times
- [ ] Track 4xx and 5xx errors
- [ ] Monitor database usage
- [ ] Setup cost alerts on Firebase
- [ ] Monitor CORS issues

### Maintenance
- [ ] Weekly backups of Firestore
- [ ] Monthly security updates
- [ ] Review error logs regularly
- [ ] Update dependencies quarterly
- [ ] Performance optimization reviews

### User Communication
- [ ] Setup status page
- [ ] Document API changes
- [ ] Setup email notifications for downtime
- [ ] Create FAQ for common issues

---

## Scaling Considerations

### Database
- Firestore auto-scales, but watch costs
- Add indexes for complex queries
- Archive old conversations monthly
- Consider sharding large collections

### Backend
- Add caching layer (Redis)
- Implement rate limiting
- Setup CDN for static assets
- Load balancing for multiple instances

### Storage
- Implement image optimization
- Auto-delete old/unused images
- Setup compression

---

## Backup & Recovery

### Daily Backup Strategy
```bash
# Firestore Export (monthly)
gcloud firestore export gs://your-bucket/exports
```

### Recovery Procedures
1. Database corruption: Restore from backup
2. Security breach: Rotate credentials, audit logs
3. Performance issues: Scale resources, optimize queries
4. Data loss: Restore from backup

---

## Performance Optimization

### Backend
```typescript
// Add caching
import { Router } from 'express';
import { cache } from 'express-redis-cache';

const router = Router();
const cacheMiddleware = cache({
  expire: 60 * 5 // 5 minutes
});

router.get('/destinations', cacheMiddleware, destinationsHandler);
```

### Firestore
```typescript
// Use collection groups for efficient queries
const query = db.collectionGroup('messages')
  .where('status', '==', 'unread')
  .limit(10);
```

### Frontend
```typescript
// Code splitting
const DestinationsPage = lazy(() => import('./pages/Destinations'));
const BookingPage = lazy(() => import('./pages/Booking'));
```

---

## Cost Optimization

### Firebase (Typical Monthly Costs)
- **Firestore**: $0.06/doc read, $0.18/doc write
- **Storage**: $0.020/GB month
- **Functions**: First 2M calls/month free

### Tips to Reduce Costs
1. Batch operations (combine multiple writes)
2. Implement request deduplication
3. Archive old data regularly
4. Use Realtime Database for frequent updates
5. Cache at application level

---

## Monitoring Dashboard (Recommended Setup)

### Metrics to Track
```
- API Response Time (p50, p95, p99)
- Error Rate (4xx, 5xx percentage)
- Database Operations (reads, writes/min)
- User Registrations (daily, weekly)
- Active Users (daily, monthly)
- Revenue/Bookings (if applicable)
- Cost (daily Firebase spend)
```

### Tools
- Error Tracking: [Sentry](https://sentry.io)
- Monitoring: [DataDog](https://www.datadoghq.com)
- Analytics: [Mixpanel](https://mixpanel.com)
- Status Page: [Statuspage.io](https://www.statuspage.io)

---

## Incident Response

### API Down
1. Check Firebase status dashboard
2. Review recent deploys
3. Check error logs
4. Rollback if needed
5. Notify users if > 15 min downtime

### Database Issues
1. Check Firestore quota
2. Review slow queries
3. Optimize indexes
4. Increase capacity if needed
5. Monitor recovery

### Security Breach
1. Immediately rotate credentials
2. Review access logs
3. Invalidate existing tokens
4. Force password reset for users
5. Audit all changes
6. Communicate with users

---

## SSL/HTTPS Setup

### SSL Certificate (Let's Encrypt)
```bash
# Using Certbot
sudo certbot certonly --standalone -d api.pavithratravels.com
```

### Update Backend
```typescript
import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('/path/to/private.key'),
  cert: fs.readFileSync('/path/to/certificate.crt'),
};

https.createServer(options, app).listen(443);
```

---

## Domain & DNS Setup

### DNS Records
```
A Record: api.pavithratravels.com → Your API IP
CNAME: www.pavithratravels.com → Your Frontend Hosting
MX Records: For email notifications
TXT Record: For SPF/DKIM/DMARC
```

### SSL/Domain (Recommended)
- Use CloudFlare for DNS and DDoS protection
- Enable HTTPS redirect
- Setup automatic SSL renewals

---

## Final Pre-Launch Checklist

- [ ] All tests passing
- [ ] Security audit completed
- [ ] Performance benchmarks met
- [ ] Error tracking configured
- [ ] Monitoring setup
- [ ] Backup strategy in place
- [ ] Team trained on operations
- [ ] Documentation complete
- [ ] SLA defined
- [ ] Support process defined
- [ ] 24/7 on-call schedule setup
- [ ] Incident response plan documented

---

## Post-Launch (Day 1)

- [ ] Monitor API performance continuously
- [ ] Check error logs every hour
- [ ] Verify user registration flow
- [ ] Monitor database usage
- [ ] Check all integrations working
- [ ] Monitor cost
- [ ] Be ready for rollback if needed

---

## Success Criteria

✅ API response time < 200ms (p95)
✅ Uptime > 99.5%
✅ Error rate < 0.1%
✅ Database operations < $100/month
✅ Zero security issues
✅ User satisfaction > 4.5/5

---

Good luck with your deployment! 🚀
