# Deploy to VPS (Webuzo) — https://nia.yt

This guide covers hosting this Next.js app online via **GitHub** → **VPS with Webuzo**, using the domain **https://nia.yt**.

---

## 1. Push code to GitHub

On your machine (in the project folder):

```bash
# If you haven’t initialized git yet
git init
git add .
git commit -m "Initial commit"

# Create a new repo on https://github.com/new (e.g. my-app-1), then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repository name.

---

## 2. Point domain nia.yt to your VPS

At your **domain registrar** (where you bought nia.yt):

- Add an **A record**:
  - **Host**: `@` (or leave blank for root domain)
  - **Value**: your VPS **public IP**
  - TTL: 300–3600

- Optional: **www** subdomain  
  - **Host**: `www`  
  - **Value**: same VPS IP  
  - TTL: 300–3600  

Wait for DNS to propagate (a few minutes to 48 hours). Check with:

```bash
ping nia.yt
```

---

## 3. Prepare the VPS (Webuzo panel)

### 3.1 SSH into the server

```bash
ssh root@YOUR_VPS_IP
```

(Or use the user Webuzo created for you.)

### 3.2 Install Node.js (if not already installed)

Webuzo may already include Node. Check:

```bash
node -v
npm -v
```

If not, install Node 18+ (LTS):

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3.3 Clone the repo and build

Pick a directory where the app will run (e.g. under your home or Webuzo’s app path):

```bash
cd /home
# Or e.g. /var/www if that’s your Webuzo web root
sudo mkdir -p nia.yt
sudo chown $USER:$USER nia.yt
cd nia.yt

git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git .
npm ci
npm run build
```

Then copy static assets into the standalone output (required for CSS/images):

```bash
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
```

---

## 4. Run the Next.js app on the VPS

With `output: "standalone"`, run the app from the **project root** (so `server.js` finds `.next/standalone/.next/static` and `public`):

```bash
cd /home/nia.yt
node .next/standalone/server.js
```

By default it listens on port **3000**. Keep it running in the background with **PM2**:

```bash
sudo npm install -g pm2
pm2 start .next/standalone/server.js --name nia-yt
pm2 save
pm2 startup
```

Or, if you prefer `next start` (no standalone):

```bash
npm run start
# Then with PM2:
pm2 start npm --name "nia-yt" -- start
pm2 save
pm2 startup
```

---

## 5. Webuzo: add domain and proxy to Node

In **Webuzo**:

1. **Add domain**  
   - Add **nia.yt** (and optionally **www.nia.yt**) as a domain in the panel.

2. **Proxy to Node.js**  
   - If Webuzo has an **“Application”** or **“Node.js”** section, create an app that:
     - **Domain**: nia.yt  
     - **Port**: 3000  
     - **Start command**: e.g. `node .next/standalone/server.js` or `npm run start`  
   - If there’s no Node.js app type, use **Nginx (or Apache) as reverse proxy** (see below).

### Optional: Nginx reverse proxy (if Webuzo uses Nginx)

Create or edit the vhost for **nia.yt** so that Nginx proxies to your Node app:

```nginx
server {
    listen 80;
    server_name nia.yt www.nia.yt;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Reload Nginx:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## 6. SSL (HTTPS) for https://nia.yt

In Webuzo, use **SSL / Let’s Encrypt**:

- Find the **SSL** or **HTTPS** section.
- Select domain **nia.yt** and issue a certificate (e.g. Let’s Encrypt).
- Enable **“Force HTTPS”** so http://nia.yt redirects to https://nia.yt.

If you manage Nginx yourself, you can use **Certbot**:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d nia.yt -d www.nia.yt
```

---

## 7. Checklist

| Step | Action |
|------|--------|
| 1 | Code pushed to GitHub |
| 2 | A record for nia.yt → VPS IP |
| 3 | Node.js 18+ on VPS |
| 4 | Clone repo, `npm ci`, `npm run build` |
| 5 | Run app (standalone: `node .next/standalone/server.js` or `next start`) with PM2 |
| 6 | Webuzo: add domain nia.yt and proxy to port 3000 (or Nginx proxy) |
| 7 | SSL for nia.yt (Webuzo or Certbot) |

After that, **https://nia.yt** should serve your Next.js app.

---

## 8. Updating the site

On the VPS:

```bash
cd /home/nia.yt
git pull
npm ci
npm run build
pm2 restart nia-yt
```

---

## Notes

- **Standalone**: The repo is configured with `output: "standalone"` in `next.config.ts`, so the server runs from `.next/standalone` and doesn’t need the full `node_modules` in production.
- **Port**: The app listens on **3000**; ensure firewall allows it if you test with `curl http://localhost:3000` and ensure only Nginx/Webuzo (or Apache) is exposed on 80/443.
