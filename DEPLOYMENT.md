# Deployment Guide — Primary Visual Lab

This application is built for 100% free-tier operation on **Vercel Hobby** + **MongoDB Atlas M0** + **GitHub**. No paid APIs, no paid storage, and no third-party email services are required.

---

## 1. MongoDB Atlas M0 (Free Tier) Setup
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free shared cluster (M0 sandbox, 512 MB storage).
3. Under **Security → Database Access**, create a user with `readWriteAnyDatabase` privileges.
4. Under **Security → Network Access**, add IP `0.0.0.0/0` (allow access from anywhere) so Vercel Serverless Functions can reach Atlas.
5. In **Database → Connect → Drivers**, copy the connection string:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
   ```

---

## 2. Vercel Deployment
1. Import the repository `https://github.com/mehedyk/SOLO-VIBE-CODING-CHAMPIONSHIP-2026` into Vercel.
2. Select Framework Preset: **Next.js**.
3. Configure Environment Variables in Vercel Project Settings:
   - `MONGODB_URI`: Your MongoDB Atlas connection URI (e.g., `mongodb+srv://...`).
   - `MONGODB_DB_NAME`: `primary_visual_lab`
   - `NODE_ENV`: `production`
4. Click **Deploy**.

---

## 3. Post-Deployment Verification Checklist
- [ ] Visit `https://your-deployment.vercel.app/` — verify automatic redirect to `/bn`.
- [ ] Check `/bn/lessons` and test search & filtering across Bangla and English.
- [ ] Complete a step-by-step subtraction and addition lesson in Classroom Presenter mode.
- [ ] Inspect browser headers: verify `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`.
- [ ] Test offline behavior: the application maintains local guest state even without active network.
