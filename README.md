# Brisbane used laptop guide

Static buying guide (A$250–400, Brisbane/QLD, Linux-friendly).

## Live site

After GitHub Pages is enabled on `main` (root), the site is at:

**https://mavros-lykos.github.io/brisbane-used-laptop-guide/**

## One-shot deploy (local machine)

```bash
gh auth login
gh repo create brisbane-used-laptop-guide --public --source=. --remote=origin --push
gh api repos/Mavros-Lykos/brisbane-used-laptop-guide/pages -X POST -f build_type=legacy -f source[branch]=main -f source[path]=/
```

Or enable **Settings → Pages → Deploy from branch `main` / `(root)`** in the GitHub UI.