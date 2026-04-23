# Starship Prompt Colors

A tiny static web app for visually editing foreground/background colors used by a segmented Starship prompt theme.

## Run locally

Open `index.html` directly in your browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Features

- Live prompt preview with powerline separators.
- Theme selector with duplicate/reset controls.
- Color picker + editable hex input for each palette key.
- Generated `starship.toml` block for the active theme.
- Download button to save generated TOML.
