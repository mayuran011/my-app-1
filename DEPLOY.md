# Deploy to VPS (Webuzo) — https://nia.yt

This guide covers hosting this Next.js app online via **GitHub** → **VPS with Webuzo**, using the domain **https://nia.yt**.

**Deployment path on server:** `/home/mayu/git/my-app-1` (via Webuzo Git Version Control).

| Purpose | URL |
|--------|-----|
| **Remote (GitHub)** | https://github.com/mayuran011/my-app-1 |
| **Clone URL (server)** | `ssh://mayu@newjaffnatamil.com:22/home/mayu/git/my-app-1` |

---

## Deploy via Webuzo Git Version Control

1. In **Webuzo** go to **Git™ Version Control**.
2. Click **Create** to add a new repository.
3. **Clone from GitHub** into the path Webuzo uses for your user (e.g. `/home/mayu/git/my-app-1`):
   - **Repository URL:** `https://github.com/mayuran011/my-app-1.git` (or `git@github.com:mayuran011/my-app-1.git` for SSH).
   - **Repository path:** `/home/mayu/git/my-app-1` (or let Webuzo create it; ensure the path is under your home and you have write access).
   - For **private** repos, configure access first (e.g. Personal Access Token or SSH key); Webuzo’s UI may prompt for credentials when cloning.
4. After the clone completes, the repo will appear in the list (e.g. **my-app-1** → path `/home/mayu/git/my-app-1`).
5. To **update** the code later: use **Manage** → pull/update, or run on the server: `cd /home/mayu/git/my-app-1 && git pull`.

Then **build** the app (see below) and either run it via **Webuzo Application Manager** or the **Quick fix** (PM2).

---

## Build and run via Webuzo Node.js Application Manager

The Application Manager only **runs** your app; it does not run `npm install` or `npm run build` for you. Do the build once (via SSH or a one-time script), then configure the app in the panel.

### Step 1: Build the app once (SSH)

SSH into the server and run:

```bash
cd /home/mayu/git/my-app-1
npm ci || npm install
npm run build:deploy
```

After this, `.next/standalone/server.js` and the copied `public` and `.next/static` will exist. You only need to run this again after `git pull` or when you change the code.

### Step 2: Fill in the Application Manager form

In **Webuzo → Application Manager**, create a **Self Managed** Node.js app and use these values:

| Field | Value |
|-------|--------|
| **Port** | `3000` (or keep `30000` if your panel uses it; then set **Environment variable** `PORT=30000` and use the same port in the reverse proxy). |
| **Application Name** | `nia-yt` (or any name you like). |
| **Deployment Domain** | `nia.yt` |
| **Base Application URL** | `nia.yt/` |
| **Application Path** | In the editable part (after `/home/mayu/`), enter: **`git/my-app-1`**. Full path = `/home/mayu/git/my-app-1`. |
| **Application type** | Node.js 22 (already set). |
| **Application startup file** | **`.next/standalone/server.js`** |
| **Deployment Environment** | **Production** |
| **Start Command** | **`node .next/standalone/server.js`** (or, if the panel uses port 30000: **`PORT=30000 node .next/standalone/server.js`**). |
| **Stop Command** | Leave empty, or `pkill -f "node .next/standalone/server.js"` if the panel requires something. |

If the panel has an **Environment Variables** section, add **`PORT`** = **`3000`** (or **`30000`** if you kept that port) so the app listens on the port Webuzo’s proxy uses.

Click **Create**. Webuzo will start the app and route **nia.yt** to it. If the app was already built (Step 1), it should respond immediately.

### Step 3: After code updates

When you pull new code, rebuild and restart:

1. **SSH:** `cd /home/mayu/git/my-app-1 && git pull && npm ci && npm run build:deploy`
2. In **Application Manager**, use **Restart** (or Stop then Start) for the **nia-yt** app.

### 503 Service Unavailable / App stopped

If **nia.yt** shows **503 Service Unavailable**, the reverse proxy is working but the Node app is not running.

1. **Start the app:** In **Application Manager → List Application**, find **nia.yt** and click the **green Start** button (Start/Stop column). Status should change from stopped (red) to running.
2. **If it won’t stay running:** Check that the app was built (Step 1 above). On the server run: `ls /home/mayu/git/my-app-1/.next/standalone/server.js`. If missing, run `cd /home/mayu/git/my-app-1 && npm run build:deploy`.
3. **Port match:** Your app is on **port 30000**. In the app’s **Edit** form, set **Start Command** to **`PORT=30000 node .next/standalone/server.js`** and add **Environment variable** **PORT** = **30000** so the app listens on 30000 and the proxy can reach it.

---

## Quick fix: get https://nia.yt online

If the repo is already at `/home/mayu/git/my-app-1` but the site is still not loading, run these on the VPS **in order**:

**1. Build the app and prepare standalone output**
```bash
cd /home/mayu/git/my-app-1
npm ci || npm install
npm run build:deploy
```

**2. Start the app and keep it running with PM2**

Use an **absolute path** and **`--cwd`** so PM2 restarts correctly after reboot (relative paths do not preserve working directory):

```bash
# Install PM2 once (if needed)
sudo npm install -g pm2
# Start the app (standalone): absolute path + cwd for reliable restart after reboot
pm2 start /home/mayu/git/my-app-1/.next/standalone/server.js --name nia-yt --cwd /home/mayu/git/my-app-1
# Or if that fails, use: pm2 start npm --name "nia-yt" --cwd /home/mayu/git/my-app-1 -- start
pm2 save
pm2 startup
```
Run the command that `pm2 startup` prints (e.g. `sudo env PATH=...`) so the app restarts on reboot.

**3. Point the domain at the app**
- In **Webuzo**: add domain **nia.yt** and set up a **reverse proxy** (or “Node.js app”) to **http://127.0.0.1:3000**.
- Or with **Nginx**: add a server block for `nia.yt` that `proxy_pass http://127.0.0.1:3000;` (see section 5 below), then `sudo nginx -t && sudo systemctl reload nginx`.

**4. Open HTTPS (optional but recommended)**  
In Webuzo: SSL / Let’s Encrypt for **nia.yt**, then enable “Force HTTPS”.

**Check:** `pm2 list` should show `nia-yt` running; `curl http://127.0.0.1:3000` should return the site. If that works but https://nia.yt does not, the domain or reverse proxy (step 3) is the issue.

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

Replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repository name. Ensure **`package-lock.json`** is committed and pushed so `npm ci` works on the VPS; if it’s missing, the deploy guide uses `npm install` as a fallback.

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

### 3.3 GitHub authentication (required for clone on VPS)

If the repo is **public**, you can clone without logging in:

```bash
git clone https://github.com/mayuran011/my-app-1.git .
```

If the repo is **private**, GitHub no longer accepts account passwords for Git. Use one of these:

**Option A – Personal Access Token (HTTPS)**  
1. On GitHub: **Settings → Developer settings → Personal access tokens → Tokens (classic)**.  
2. Generate a new token with at least the **`repo`** scope.  
3. On the VPS when you run `git clone`, use your **GitHub username** and, when asked for password, paste the **token** (not your GitHub password).

**Option B – SSH (no prompt after setup)**  
1. On the VPS: `ssh-keygen -t ed25519 -C "vps-nia" -f ~/.ssh/id_ed25519 -N ""`  
2. Show public key: `cat ~/.ssh/id_ed25519.pub`  
3. On GitHub: **Settings → SSH and GPG keys → New SSH key**; paste the key.  
4. Clone with SSH instead of HTTPS:  
   `git clone git@github.com:mayuran011/my-app-1.git .`

---

### 3.4 Clone the repo and build

Use an **empty** directory. If the folder already exists and is not empty, clear it first:

```bash
# Option A: Fresh empty directory (or use Webuzo Git Version Control to clone to /home/mayu/git/my-app-1)
sudo mkdir -p /home/mayu/git/my-app-1
sudo chown $USER:$USER /home/mayu/git/my-app-1
cd /home/mayu/git/my-app-1
git clone https://github.com/mayuran011/my-app-1.git .
# When prompted: Username = mayuran011, Password = your Personal Access Token (not GitHub password)
```

If you get **"fatal: destination path '.' already exists and is not an empty directory"** or **"Authentication failed"** (e.g. after entering your GitHub password), see **3.3** (use a Personal Access Token or SSH). Then:

```bash
# Clear folder and clone again
cd /home/mayu/git
rm -rf my-app-1
mkdir my-app-1
cd my-app-1
git clone https://github.com/mayuran011/my-app-1.git .
# Or with SSH: git clone git@github.com:mayuran011/my-app-1.git .
```

Then install dependencies and build. Use `npm install` if `package-lock.json` is missing from the repo (e.g. not yet pushed); otherwise `npm ci` is preferred:

```bash
cd /home/mayu/git/my-app-1
npm ci || npm install
npm run build:deploy
```

(`build:deploy` runs the build and copies `public` and `.next/static` into the standalone output.)

---

## 4. Run the Next.js app on the VPS

With `output: "standalone"`, run the app from the **project root** (so `server.js` finds `.next/standalone/.next/static` and `public`):

```bash
cd /home/mayu/git/my-app-1
node .next/standalone/server.js
```

By default it listens on port **3000**. Keep it running in the background with **PM2**. Use an **absolute path** and **`--cwd`** so the app restarts correctly after reboot:

```bash
sudo npm install -g pm2
pm2 start /home/mayu/git/my-app-1/.next/standalone/server.js --name nia-yt --cwd /home/mayu/git/my-app-1
pm2 save
pm2 startup
```

Or, if you prefer `next start` (no standalone):

```bash
npm run start
# Then with PM2 (--cwd required for correct restart after reboot):
pm2 start npm --name "nia-yt" --cwd /home/mayu/git/my-app-1 -- start
pm2 save
pm2 startup
```

---

## 5. Webuzo: add domain and proxy to Node

In **Webuzo**:

1. **Add domain**  
   - Add **nia.yt** (and optionally **www.nia.yt**) as a domain in the panel.

2. **Proxy to Node.js**  
   - Use **Application Manager** (Node.js / Self Managed) and fill the form as in **“Build and run via Webuzo Node.js Application Manager”** above (domain **nia.yt**, path **git/my-app-1**, start command **`node .next/standalone/server.js`**, port **3000** or **30000** to match the panel).  
   - If you don’t use Application Manager, use **Nginx (or Apache) as reverse proxy** (see below).

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
| 4 | Clone repo to `/home/mayu/git/my-app-1` (Webuzo Git or SSH), then `npm ci`, `npm run build:deploy` |
| 5 | Run app from `/home/mayu/git/my-app-1` (standalone or `next start`) with PM2 |
| 6 | Webuzo: add domain nia.yt and proxy to port 3000 (or Nginx proxy) |
| 7 | SSL for nia.yt (Webuzo or Certbot) |

After that, **https://nia.yt** should serve your Next.js app.

---

## 8. Updating the site (GitHub updated but nia.yt not changed yet)

After you **push to GitHub**, the live site **does not update by itself**. You must update and rebuild on the VPS, then restart the app.

**On the VPS (SSH):**

```bash
cd /home/mayu/git/my-app-1
git pull
npm ci || npm install
npm run build:deploy
```

**Then restart the app** in one of these ways:

- **If you use PM2:**  
  `pm2 restart nia-yt`

- **If you use Webuzo Application Manager:**  
  Open **Application Manager → List Application**, find **nia.yt**, and click **Restart** (or Stop then Start).

After that, reload **https://nia.yt** to see the changes.

---

## Notes

- **Standalone**: The repo is configured with `output: "standalone"` in `next.config.ts`, so the server runs from `.next/standalone` and doesn’t need the full `node_modules` in production.
- **Port**: The app listens on **3000**; ensure firewall allows it if you test with `curl http://localhost:3000` and ensure only Nginx/Webuzo (or Apache) is exposed on 80/443.
