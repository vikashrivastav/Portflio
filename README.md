# Vikas Shrivastava Portfolio

Responsive React + TypeScript portfolio with a local Express authentication API and protected dashboard.

## Run locally

```powershell
npm install
Copy-Item .env.example .env
```

Open `.env` and set your own local credentials, then run:

```powershell
npm run dev:full
```

Open the frontend URL shown by Vite, usually `http://localhost:5173/`.

- Portfolio: `/`
- Login: `/admin`
- Protected dashboard: `/dashboard`
- API health: `http://localhost:4000/api/health`

The local user data is created in `data/` and must not be committed.

## Push to GitHub safely

1. Confirm `.env` contains your real local password and `.env.example` contains placeholders only.
2. Confirm `.gitignore` is present.
3. Create a repository at https://github.com/new. Do not initialize it with another README.
4. From this folder run:

```powershell
git init
git branch -M main
git add .
git status
git diff --cached --name-only
git commit -m "Initial portfolio website"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Before committing, make sure these are absent from the staged file list:

```text
.env
 data/
node_modules/
dist/
uploads/
```

For future changes:

```powershell
git add .
git commit -m "Update portfolio"
git push
```

## Never commit

- `.env`
- Passwords, API keys, tokens, or database credentials
- `data/` local authentication files
- `node_modules/`
- `dist/` build output
- Private uploads

If a secret is ever pushed, change or revoke it immediately. Removing it from the latest file does not remove it from Git history.
