# Deploy to IONOS VPS

## 1. On your VPS — set up PostgreSQL database

```bash
sudo -u postgres psql
CREATE DATABASE qentropix_demo;
CREATE USER qentropix WITH PASSWORD 'choose-a-strong-password';
GRANT ALL PRIVILEGES ON DATABASE qentropix_demo TO qentropix;
\q
```

## 2. Clone the repo

```bash
cd /var/www
git clone https://github.com/qentropix/demo qentropix-demo
cd qentropix-demo
```

## 3. Set up environment variables

```bash
cp .env.example .env
nano .env
```

Fill in:
```
DATABASE_URL="postgresql://qentropix:your-password@localhost:5432/qentropix_demo"
SESSION_SECRET="generate-a-random-64-char-string"
NODE_ENV="production"
PORT=3001
CLIENT_URL="https://demo.qentropix.com"
DEMO_USERNAME="demo"
DEMO_PASSWORD="Qentro!!1"
```

## 4. Install dependencies and build

```bash
# Backend
npm install
npx prisma migrate deploy
node src/seed.js

# Frontend
cd client
npm install
npm run build
cd ..
```

## 5. Start with PM2

```bash
npm install -g pm2
pm2 start src/index.js --name qentropix-demo
pm2 save
pm2 startup
```

## 6. Nginx config

Add to your Nginx config (e.g. `/etc/nginx/sites-available/demo.qentropix.com`):

```nginx
server {
    listen 80;
    server_name demo.qentropix.com;

    location /primeenergy {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then enable and reload:
```bash
ln -s /etc/nginx/sites-available/demo.qentropix.com /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## 7. SSL (Let's Encrypt)

```bash
sudo certbot --nginx -d demo.qentropix.com
```

## Useful commands

```bash
pm2 logs qentropix-demo     # view logs
pm2 restart qentropix-demo  # restart after changes
pm2 status                  # check running status
```
