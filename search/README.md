# Aura Search Box 🔍

A premium, highly aesthetic dark-theme search box interface featuring interactive glassmorphic design and direct integration with **Formspree** or **FormSubmit** to log searches.

This application is ready to run out of the box and is configured to be hosted on **GitHub Pages**.

## Features

- 🎨 **Visuals**: Ambient glowing orbs, glowing states, modern typography, and glassmorphic card containers.
- ⚙️ **Dual Integrations**: Support for both Formspree (Form Dashboard) and FormSubmit (Direct Email forwarding).
- ⚙️ **Setting Drawer**: Click the gear icon to dynamically change service provider, target endpoints, CAPTCHA settings, and submission modes.
- 🚀 **AJAX / Redirect Modes**:
  - **AJAX (Default)**: Keeps the user on the page, captures query metadata, and shows a mock results page with JSON payload details.
  - **Redirect**: Triggers standard HTML form redirection to the provider's completion page.
- 🕒 **History Tracker**: Keeps a local record of recent search queries for re-execution or clearing.
- ⌨️ **Keyboard Shortcut**: Press `/` anywhere on the page to automatically focus the search input. Press `Escape` to close drawers or blur fields.

## Configuration & Usage

By default, the search box is pre-configured to use the provided Formspree endpoint:
`https://formspree.io/f/xpqvqgra`

### Customizing the Endpoint:
1. Click the **Gear Icon** in the top-right corner to open the Settings panel.
2. Select your provider (**Formspree** or **FormSubmit**).
3. Input your target **Formspree ID/URL** or **FormSubmit Email Address**.
4. Choose the submission execution (**AJAX** or **Redirect**).
5. Click **Save Configuration** (Settings will persist in `localStorage` for future visits).

---

## Hosting on GitHub

To host this search box on your GitHub account, follow these simple steps:

### Step 1: Stage and Commit the Files
In your terminal, navigate to the project directory and stage/commit only the files inside the `search/` folder to avoid staging unrelated workspace changes:
```bash
git add search/
git commit -m "feat: Add premium search box with Formspree telemetry logging"
```

### Step 2: Push to GitHub
Push the commit to your main branch on GitHub:
```bash
git push origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub.
2. Click on the **Settings** tab.
3. Scroll down the left sidebar and select **Pages** (under the "Code and automation" section).
4. Under **Build and deployment**, set the Source to **Deploy from a branch**.
5. Select your branch (e.g., `main` or `master`) and change the folder from `/ (root)` to `/search` (or keep it as `/ (root)` if you move these files to the root of your repository).
6. Click **Save**.

Within a few minutes, GitHub will publish your site, and you will receive a URL (e.g., `https://username.github.io/repository-name/search/`).

---

## Technical Details

- **Frontend**: Pure HTML5, CSS3 Variables, and vanilla ES6+ Javascript.
- **Provider Forms**:
  - Formspree submissions are posted via JSON to: `https://formspree.io/f/{formId}`.
  - FormSubmit submissions are posted to: `https://formsubmit.co/ajax/{email}` (for AJAX) or `https://formsubmit.co/{email}` (for Redirects).
