# vivek-sharma.github.io

Personal academic website for Vivek Sharma — Neuroscientist, Postdoctoral Researcher at the Donders Institute for Brain, Cognition and Behaviour, Radboud University.

Plain HTML/CSS/JS. No build step, no dependencies to install.

## File structure

```
index.html        the whole site (one page)
style.css          styling
script.js          publications list + the animated phase-portrait graphic
assets/
  vsharma_cv.pdf    your CV, linked from the "Download CV" button
README.md          this file
```

## Publish it on GitHub Pages (free hosting, ~10 minutes)

You don't need to know how to code for this — just follow the steps.

**1. Create the repository**
- Go to [github.com/new](https://github.com/new)
- Repository name: `vivekmodgill.github.io` (must be exactly `<your-github-username>.github.io` if you want it at the root of your own domain-like URL — e.g. since your GitHub username is `vivekmodgill`, name it `vivekmodgill.github.io`)
- Set it to **Public**
- Don't tick "Add a README" (you already have one)
- Click **Create repository**

**2. Upload the files**
- On the new repository's page, click **uploading an existing file**
- Drag in `index.html`, `style.css`, `script.js`, `README.md`, and the `assets` folder (with `vsharma_cv.pdf` inside)
- Scroll down, click **Commit changes**

**3. Turn on Pages**
- Go to the repository's **Settings** tab → **Pages** (left sidebar)
- Under "Build and deployment", set **Source** to **Deploy from a branch**
- Branch: `main`, folder: `/ (root)` → **Save**
- Wait 1–2 minutes; GitHub will show you the live URL, typically:
  `https://vivekmodgill.github.io/`

That's it — the site is live and free, and stays live as long as the repo does.

## Making changes later

Edit any file directly on GitHub (click the pencil icon on the file page) or, if you prefer working locally:

```bash
git clone https://github.com/vivekmodgill/vivekmodgill.github.io.git
cd vivekmodgill.github.io
# edit files
git add .
git commit -m "Update site"
git push
```

Changes go live automatically within a minute or two of pushing.

## Things you may want to update

- **Publications list**: edit the `publications` array at the top of `script.js` — add new entries as you publish.
- **CV**: replace `assets/vsharma_cv.pdf` with a newer export whenever your CV changes; keep the filename the same and the download button keeps working.
- **Custom domain** (optional): if you ever buy your own domain (e.g. `viveksharma.com`), add a `CNAME` file with the domain name and point your domain's DNS at GitHub Pages — see [GitHub's custom domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
