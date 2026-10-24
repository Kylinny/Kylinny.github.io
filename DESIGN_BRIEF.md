# Personal Archive — Design Brief

This document is the working source of truth for the visual direction and product requirements of Junyi's personal site. Update it whenever a design or content decision is made.

## Core intent

Create a personal website that feels like entering a living digital archive rather than reading a conventional résumé. It should communicate curiosity, individual perspective, photography, travel, and work through an editorial, futuristic interface.

The visitor journey is intentional:

1. Enter a short, cinematic welcome screen.
2. Scroll through a dissolve transition into a full-screen globe centered on San Francisco.
3. Reveal the concise personal introduction beside the globe.
4. Explore field notes, travel, photography, and deeper location pages.

## Visual language

- **Mood:** futuristic, atmospheric, polished, subtly hacker-inspired—but never performatively technical.
- **Avoid:** heavy “green code rain,” generic cyberpunk, or visual noise that makes the site feel like a gaming template.
- **Palette:** near-black base, deep navy / midnight blue surfaces, cool silver typography, and a restrained electric cyan accent color.
- **Typography:** clean editorial sans-serif for large headlines; monospace type for coordinates, metadata, interface labels, and system messages.
- **Texture:** fine film grain, thin grid lines, scanning lines, faint glows, and low-opacity orbital geometry.
- **Motion:** slow and intentional. Use small glitch offsets, soft light pulses, smooth page/section transitions, and responsive hover states. Motion should never block reading.

### Color tokens

| Token | Intended use | Current value |
| --- | --- | --- |
| `--ink` | Primary page background | `#03060d` |
| `--navy` | Deep blue surface | `#06152b` |
| `--navy2` | Brighter blue surface / panel | `#0a2345` |
| `--silver` | Main text and display type | `#d5dce7` |
| `--muted` | Secondary labels | `#77869c` |
| `--cyan` | Active details and interactions | `#80f1ff` |

## Homepage

### Entry / welcome screen

The site opens as a full-screen entry experience, not a conventional navigation header.

- Main word: `WELCOME`, typed out one character at a time with a blinking terminal-style caret; it must not appear as a complete word on load.
- The word is paired with a small number of blinking lights, sparse archive labels, and restrained byte strings.
- Background is black-to-deep-navy, with a faint perspective grid.
- Three stacked, blinking down chevrons stay in the lower-right corner as the only visual guide; do not include “scroll to enter” text.
- Visitor can click the chevrons or scroll to enter the main site.
- Entering should dissolve the welcome screen into the globe view rather than navigate to a conventional hero.

### Main content order

1. **Floating globe + right timeline** — after the welcome dissolve, a slowly rotating night-time Earth sits on the left. A fixed vertical timeline sits on the right, ordered by date. The Earth has a subtle animated star field, city-light shimmer, and blue atmospheric rim.
2. **Floating story points** — clicking a point or its timeline item smoothly zooms the Earth to that region. The globe dims to a semi-transparent background and that location's content card floats over the left side; there are no detail pages or conventional section navigation.
3. **Default state** — immediately after the welcome screen dissolves, focus and open the San Francisco story card. It is the current home-base introduction.

## Content principles

- Personal introduction stays concise, human, and first-person.
- Current introduction: “Hey, I’m Junyi. Currently working at Uber in SF.”
- The site should feel like an evolving record, not a finished corporate profile.
- Photography should be central in the travel/location sections.
- Use short editorial notes and location metadata instead of overly long blocks of text.
- Do not publish private information, precise home location, or photo EXIF/GPS metadata unintentionally.

## Journey timeline and globe

- The globe itself is the timeline and archive interface; do not add a separate long scrolling timeline.
- Each story point contains a city/region, date or date range, one-line memory or theme, image(s), tags, and optional Google Maps links.
- Selecting a point opens a same-page overlay card, activates its right-side timeline row, and focuses the globe on the location. It never navigates to a new detail page.
- Do not add a close icon to a story card. A click on the globe's non-marker area or elsewhere outside a card/timeline should dissolve the card and restore the globe; clicking another point switches directly to the new card.
- Every story card with supplied photos shows exactly one cover image and a `MORE PHOTOS >>` control below it. Do not dissolve images in the intro card. Text-only stories do not show a gallery control until photos are supplied.
- `MORE PHOTOS >>` opens a full-screen, same-page Gallery Mode: an unclipped responsive image grid with the location title and a `← GLOBE` return control. This is the portfolio view for the location.
- Current real story points are St. Louis (school years), San Francisco (intro), and Rome (field image); add more only when Junyi supplies the actual travel data.
- Group story points primarily by **region** (for example North America, Europe, East Asia) because visitors explore spatially. Use themes such as photography, food, work, walking, and architecture as secondary tags within each place card.

## Globe, travel, and field notes

The globe is the primary interaction and the opening site experience after the welcome dissolve.

### Globe interaction

- Dragging the globe supports unlimited horizontal 360° rotation and a controlled vertical tilt; timeline selections still smoothly return the view to the chosen location. When idle, the globe makes one complete rotation every 24 hours, starting from the San Francisco orientation.

- A 3D-style or canvas globe supports drag to rotate and scroll/pinch to zoom where practical.
- The only globe interaction label is `ROTATE * SELECT`.
- The first SF view uses a cinematic low-orbit composition rather than a wireframe globe. Animation comes from the star field, city-light shimmer, atmosphere, and floating locator; it remains lightweight enough for a static GitHub Pages site.
- Render real global land contours in a fine, low-contrast silver-blue line. Show continental coastlines only, never a dense grid or political country-boundary map.
- Locations appear as restrained glowing markers.
- Hover should reveal a place name/coordinate.
- Clicking a marker opens the place's content card in the current view.

### Story card

Each same-page card should contain:

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
- Rome story timestamp: `2025.09`. Its cover is `assets/images/profile-rome.jpg` (St. Peter's Square); Gallery Mode includes it and `assets/images/rome-colosseum.jpg` (Colosseum). The card is image-led, with no descriptive body copy.
- Photos in story cards and Gallery Mode must preserve their original aspect ratio and complete composition; never use cover-cropping or a visible photo frame. The single cover should float directly in the semi-transparent card. Additional photos belong in Gallery Mode, without an automatic dissolve sequence.
- San Francisco story timestamps: `2023.05—08` and `2024.10—PRESENT`.
- San Francisco cover image: `assets/images/sf-00-golden-gate.jpg` (foggy Golden Gate Bridge). Its Gallery Mode includes that cover, `assets/images/sf-01.jpg` through `assets/images/sf-03.jpg`, and `assets/images/sf-gallery-01.jpg` through `assets/images/sf-gallery-05.jpg`.
- St. Louis story timestamp: `2021.09—2024.05`. It is initially text-only and can receive a cover and Gallery Mode when Junyi supplies photos.
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
4. Expand reusable same-page story cards with the supplied field-note data.
5. Upgrade globe markers to load from that dataset.
6. Add accessibility refinements: reduced-motion support, keyboard interaction for globe alternatives, semantic image alt text, and contrast checks.
