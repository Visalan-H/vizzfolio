# Portfolio

Personal site of Visalan H, a full stack developer. Live at [visalan.me](https://visalan.me).

## Stack

- Astro 7, built to static HTML
- Tailwind CSS 4
- astro-icon with the Lucide and Simple Icons sets
- nginx in Docker serves the static build

## Where content lives

Projects, extensions, npm packages, experience and education all sit in `src/data/portfolio.json`. Edit that file and the pages update.

Screenshots go in `src/assets/projects` and `src/assets/extensions`. Each file name matches the `image` field of its entry in `portfolio.json`.

## Run locally

```bash
npm install
npm run dev      # dev server on http://localhost:4321
npm run build    # static build into dist/
npm run preview  # serve the built site
```

## Docker

```bash
docker build -t portfolio .
docker run -p 8080:80 portfolio
```

The site is then at http://localhost:8080.

## Keyboard shortcuts

On the homepage, outside text fields:

- `1` to `6` jump to College, Projects, Extensions, NPM Packages, Experience and Education.
- `7` opens LinkedIn.
- `8` opens the resume.

## Credits

The favicon is the Man Technologist emoji from Microsoft's [Fluent Emoji](https://github.com/microsoft/fluentui-emoji), MIT licensed, copyright Microsoft Corporation.
