# ASR Tracker

## Loyiha tuzilishi
```
ASR/
├── backend/      → Render.com ga deploy
└── frontend/     → Vercel.com ga deploy
```

---

## 🔧 Local ishlatish

### Backend
```bash
cd backend
npm install
# .env faylini tekshiring (MongoDB URI to'g'ri bo'lsin)
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# .env faylini tekshiring (VITE_API_URL=http://localhost:5000/api)
npm run dev
```

---

## 🚀 Deploy qilish

### 1. MongoDB Atlas sozlash
1. [mongodb.com/atlas](https://mongodb.com/atlas) ga kiring
2. Yangi cluster yarating (M0 Free tier)
3. Database User yarating (username + parol)
4. Network Access → `0.0.0.0/0` qo'shing (hamma joydan kirish)
5. **Connection String** ni nusxalang: `mongodb+srv://...`

---

### 2. Backend → Render.com

1. [render.com](https://render.com) ga kiring → **New Web Service**
2. GitHub repo'ni ulang
3. Sozlamalar:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. **Environment Variables** qo'shing:
   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/asr_tracker` |
   | `FRONTEND_URL` | *(keyinroq Vercel URL qo'shasiz)* |
5. **Deploy** tugmasini bosing
6. Deploy tugagach **Render URL** ni nusxalang: `https://asr-backend.onrender.com`

---

### 3. Frontend → Vercel.com

1. [vercel.com](https://vercel.com) ga kiring → **New Project**
2. GitHub repo'ni ulang
3. Sozlamalar:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
4. **Environment Variables** qo'shing:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://asr-backend.onrender.com/api` |
5. **Deploy** tugmasini bosing
6. Deploy tugagach **Vercel URL** ni nusxalang: `https://asr-tracker.vercel.app`

---

### 4. Backend CORS ni yangilash

Vercel URL tayyor bo'lgach, Render dashboard'ga qayting:
- **Environment Variables** → `FRONTEND_URL` = `https://asr-tracker.vercel.app`
- Backend avtomatik restart bo'ladi ✅

---

## ✅ Tekshirish

Backend health check:
```
https://asr-backend.onrender.com/api/health
```
`{"status":"ok","message":"ASR Debt Tracker Backend is running"}` ko'rsatsa — ishlamoqda!
"# asr" 
