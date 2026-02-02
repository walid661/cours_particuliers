# Getting Started with EduSoft

## 0. Install Node.js (Prerequisite)
Your system does not have Node.js installed.
1. Go to [nodejs.org](https://nodejs.org/).
2. Download and install the **LTS version**.
3. Restart your terminal/VS Code interactively.
4. Verify installation: `node -v` and `npm -v`.

## 1. Open Terminal
In VS Code, press **`Cmd` + `J`** or **`Ctrl` + `~`** to open the integrated terminal.

Alternatively, on macOS, press **`Cmd` + `Space`**, type `Terminal`, and press **Enter**.

## 2. Install Dependencies
Run this command in the project folder:
```bash
npm install
```

## 3. Configure Supabase Keys
Update `.env` with your real keys:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 4. Initialize Database
In the [Supabase Dashboard](https://supabase.com/dashboard):
1. Go to the **SQL Editor**.
2. Copy the contents of `seed.sql`.
3. Click **Run**.
4. Go to **Storage**, create a new public bucket named `documents` (if not created).

## 5. Start the App
Run:
```bash
npm run dev
```
