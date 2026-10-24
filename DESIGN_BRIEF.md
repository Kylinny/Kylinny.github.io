# Personal Archive — Design Brief

This document is the working source of truth for the visual direction and product requirements of Junyi's personal site. Update it whenever a design or content decision is made.

## Core intent

Create a personal website that feels like entering a living digital archive rather than reading a conventional résumé. It should communicate curiosity, individual perspective, photography, travel, and work through an editorial, futuristic interface.

The visitor journey is intentional:

1. Enter a short, cinematic welcome signal.
2. Scroll through a dissolve transition into a full-screen globe centered on San Francisco.
3. Reveal the concise personal introduction beside the globe.
4. Explore field notes, travel, photography, and deeper location pages.

## Visual language

- **Mood:** futuristic, atmospheric, polished, subtly hacker-inspired.
- **Avoid:** heavy “green code rain,” generic cyberpunk, or visual noise that makes the site feel like a gaming template.
- **Palette:** near-black base, deep navy / midnight blue surfaces, cool silver typography, and a restrained electric cyan signal color.
- **Typography:** clean editorial sans-serif for large headlines; monospace type for coordinates, metadata, interface labels, and system messages.
- **Texture:** fine film grain, thin grid lines, scanning lines, faint glows, and low-opacity orbital geometry.
- **Motion:** slow and intentional. Use small glitch offsets, signal pulses, smooth page/section transitions, and responsive hover states. Motion should never block reading.

### Color tokens

| Token | Intended use | Current value |
| --- | --- | --- |
| `--ink` | Primary page background | `#03060d` |
| `--navy` | Deep blue surface | `#06152b` |
| `--navy2` | Brighter blue surface / panel | `#0a2345` |
| `--silver` | Main text and display type | `#d5dce7` |
| `--muted` | Secondary labels | `#77869c` |
| `--cyan` | Signals, active details, interactions | `#80f1ff` |

## Homepage

### Entry / welcome screen

The site opens as a full-screen entry experience, not a conventional navigation header.

- Main word: `WELCOME`.
- The word is paired with a small number of blinking signal lights, sparse technical labels, and restrained byte strings.
- Background is black-to-deep-navy, with a faint perspective grid.
- A blinking down arrow stays in the lower-right corner to guide the visitor.
- Visitor can click the arrow or scroll to enter the main site.
- Entering should dissolve the welcome screen into the globe view rather than navigate to a conventional hero.

### Main content order

1. **Full-screen SF globe** — the first content scene after the welcome dissolve; it shows `HEY, I'M JUNYI` and the one-line Uber/SF introduction.
2. **IDENTITY / PROFILE** — personal photograph, expanded profile, location/current focus/contact channel.
3. **JOURNEY.LOG** — the chronological record of places, fused directly with the interactive globe.
4. **Footer** — compact archive signature and return-to-top link.

## Content principles

- Personal introduction stays concise, human, and first-person.
- Current introduction: “Hey, I’m Junyi. Currently working at Uber in SF.”
- The site should feel like an evolving record, not a finished corporate profile.
- Photography should be central in the travel/location sections.
- Use short editorial notes and location metadata instead of overly long blocks of text.
- Do not publish private information, precise home location, or photo EXIF/GPS metadata unintentionally.

## Journey timeline

- The chronological travel record replaces the standalone experience list on the homepage.
- Each timeline row should contain a date or date range, city/region, coordinates, one-line memory or theme, image(s), tags, and optional external links.
- Selecting a timeline row rotates/focuses the globe on its marker. It should later open a location detail page.
- Keep professional experience available as a future separate page or compact profile link rather than competing with the journey experience on the homepage.

## Globe, travel, and field notes

The globe is a signature interaction, but it belongs after the personal introduction—not as the opening screen.

### Globe interaction

- A 3D-style or canvas globe supports drag to rotate and scroll/pinch to zoom where practical.
- Locations appear as restrained glowing signal markers.
- Hover should reveal a place name/coordinate.
- Clicking a marker or geographic region moves the visitor to a dedicated location page, e.g. `/places/tokyo`.
- The transition can use an interface message such as:

  ```text
  > opening location: TOKYO
  > loading field notes...
  ```

### Location detail page

Each page should contain:

- A location title and coordinate/date metadata.
- A photo sequence or gallery.
- Personal travel notes / mini-blog entry.
- Curated tags such as `#coffee`, `#architecture`, `#nightwalk`, `#hiking`, or `#museum`.
- A link to the relevant Google Maps place, review, or curated list.

### Google Maps integration

- The website maintains its own curated list of locations, tags, descriptions, images, and Google Maps URLs.
- Prefer direct external links to the Google Maps place, a share link for a specific review, and/or the public Google Maps profile/list.
- Do **not** plan on automatically importing all reviews written by the site owner: Google does not offer a suitable public API for reliably retrieving a single person's full review history.
- An optional embedded map may be used per location later. Google Maps Embed API needs an API key and billing account even though Embed requests are normally free.
- Before linking to a profile, ensure Google Maps contributions are intended to be public.

## Current implementation

- Static site, compatible with GitHub Pages and the repository's existing Jekyll build workflow.
- Homepage assets: `index.html`, `styles.css`, `script.js`.
- Current globe is a lightweight custom canvas interaction to avoid a heavy dependency for the first release.
- Current portrait asset: `assets/images/profile-rome.jpg` — black-and-white image taken in Rome. It is shown in the IDENTITY section with a subtle scanline/system-label treatment.
- Placeholder text that must be replaced before public release:
  - biography and current location
  - dated journey entries
  - `HELLO@YOURDOMAIN.COM`
  - generic Google Maps link
  - sample globe locations / field notes

## Delivery and publishing

- Primary repository: `https://github.com/Kylinny/Kylinny.github.io`
- Primary Pages URL: `https://kylinny.github.io`
- Preserve existing `CNAME` whenever updating the site, because it controls the current custom-domain configuration.
- Work is currently committed locally and connected to the repository, but has not yet been pushed.

## Future iterations

1. Add real portrait and photography assets, optimized for web delivery.
2. Replace placeholder profile and journey metadata.
3. Create a structured dataset for chronology, locations, tags, images, and Google Maps links.
4. Build reusable location/blog detail pages.
5. Upgrade globe markers to load from that dataset and link to their pages.
6. Add accessibility refinements: reduced-motion support, keyboard interaction for globe alternatives, semantic image alt text, and contrast checks.
