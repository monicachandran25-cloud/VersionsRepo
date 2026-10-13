# Infinity Hub Contracting LLC — 3D website (v4)

A separate, 3D version of the site built from the company profile PDF and the new logo with the tagline "Shaping Tomorrow's Landmark". The earlier Technical Services site in the parent folder is unchanged.

## Open the site
Serve this folder over http (for example `python -m http.server` here, then open http://localhost:8000) or upload `index.html` with the `assets/` folder to any static host. It needs an internet connection for the fonts and the 3D/animation libraries.

## Concept: from blueprint to landmark
Inspired by heronaiapp.com (technical, blueprint-like, bracketed labels, numbered steps, red callouts), but built in 3D. Each section is a sheet in a drawing set, keyed by an architectural grid bubble A–G. The footer is a drawing title block.

Two typefaces only: **Geist** for headings and text, **Geist Mono** for labels and readouts. One red from the logo for marks and highlights. Text contrast is at least 7:1 on both the dark and light sheets.

## The 7 sections
| Grid | Section | 3D / interaction |
|---|---|---|
| Loader | **3D loader** | On a dark sheet, a welding spark fabricates the Infinity mark as a glossy red 3D ribbon, following a dashed construction line while sparks fall. The stage list (001–010) ticks off and a large % counts up. At 100% the finished mark turns and flies toward you as the sheet lifts off the hero. Tap to skip. |
| A | **Hero**: "Shaping *tomorrow's* landmark." | Clean and minimal on a white page: light type with "tomorrow's" in logo red, a dark call-to-action, and one dark, detailed 3D building on the right (glazed rooms with warm light, timber pergola, fins, glass balustrade, planters, tree, solar panels, air-con units, cove lighting, red mast beacon). Drag to turn it. Four step cards play through on their own or on click and the model follows: 01 Requirement shows it as a line drawing, 02 Site survey sweeps a red scan plane over the lines, 03 Build raises the solid building floor by floor and assembles the pergola, 04 Handover switches every light on. A label pinned to the model names each step. |
| B | **About**: the "right contractor" statement, Mission, Vision | Statement words light up on scroll; the shade-structure video tilts flat in 3D as it arrives; Mission and Vision are 3D flip cards. |
| C | **Core capabilities** (7) | Clean two-column layout: a simple list on the left; on the right one 3D model (drag to rotate; boxing ring switches between 5m×5m, 6m×6m and 7m×7m) with the title, a short description, six key services and an enquire link underneath. Industries marquee below. |
| D | **How we work** (9 stages) | Pinned panel in a product-showcase layout. Left: a red feature card for the current stage with its own 3D object rising out of the top edge (drag to turn it): number, title, line, scope chips, objective, a 01–09 stage picker and a big next button. Right: a row of tinted cards for the other stages, each with a small 3D object popping out (clipboard, survey tripod, drawings, programme board, I-beam, truck with beams, steel frame, magnifier over a panel, handover key); the current one reads "Now viewing". Bottom: Plan / Prepare / Deliver tabs and Back / Next. Scrolling moves through the stages; every control jumps to its stage. |
| E | **Our work** (8 models) | A full-screen 3D corridor of the company's work, built as live models instead of photos: steel frame, car-parking shade, interior fit-out, mezzanine, tensile sails, boxing ring, spiral staircase and sandwich panels. Each turns on a dark plinth with a red ring. The section pins and scrolling flies the camera past them; the nearest (or hovered) model gets a caption with its number, name and category. Clicking a model opens that capability. Filters (Steel & fabrication, Shades, Interior, Events) regroup the corridor. |
| F | **Why Infinity Hub**: 8 reasons + Quality & Safety | One large rounded panel: heading, line and "Book our services" on the white left; on the right a blurred photo backdrop with tall photo cards (number, title, description). Arrows, swipe or arrow keys move through the eight reasons; the leading card opens its client benefit and the backdrop crossfades to its photo (hovering a card previews its photo). A "Tell us the scope" card ends the row. Below it, Quality & Safety is a minimal line drawing: three thin circles that draw themselves in and overlap on a pulsing red dot ("Your project"), with small dots orbiting each line. The list beside it (Quality, Safety, Communication) cycles on its own; hovering a word fills its circle red and fades the others. The commitment sits underneath as a quote with a red rule. |
| G | **Book our services** | Extruded 3D version of the logo's infinity mark that follows the pointer; contact details with copy buttons; enquiry form that prepares an email (it never claims to send). Skyline video in the background. |

The loader is a "system initialisation" log (001–010) with a live percentage that follows real loading. Tap to skip.

## Layout pass
Sections share one alignment system: Capabilities heading sits on the same columns as its panel; Mission and Vision text starts on one line; the How we work row has a clean left edge and no decoration behind numbers; Our work keeps its models below the heading and its captions clear of the controls; the footer title block is two columns on phones.

## Content sources
- All text comes from `Company_Profile.pdf` (Infinity Hub Contracting LLC). Nothing is invented: no clients, numbers or testimonials.
- Photos (Why Infinity Hub cards, `assets/img/w-*.webp`): six Unsplash photos (free under the Unsplash licence) plus the steel-site and skyline frames from the Asset folder, labelled "Illustrative photos" on the page. Our work uses 3D models only. The other `assets/img/u-*.webp` files are not used by the page and can be deleted.
- Videos: the three "Hero 1" clips and the steel-site clip from the Asset folder (watermark corner cropped, no audio).
- Logo: `Logo_With_Tagline.pdf`, converted to SVG (`assets/brand`): `full`, `lockup`, `word`, `mark` and `tag`, each in `-ink` (for light backgrounds) and `-rev` (for dark backgrounds).

## Contact details used (from the profile)
+971 4 344 9282 · +971 52 245 8325 · Info@infinityhubcontracting.com · 1002 DNI Building, Port Saeed, Deira, Dubai · www.infinityhubcontracting.com

## Structure
- `index.html`: the website.
- `source/parts/`: `style.css`, `body.html`, `main.js` (content, interactions, motion) and `three.js` (all 3D scenes). `source/build.py` assembles them into `index.html`.

## To confirm with the client
1. The company name differs from the current live site ("Technical Services" there, "Contracting LLC" in the profile). This version follows the profile.
2. Our work shows 3D models of each discipline, not real projects. The Why Infinity Hub cards use illustrative photos; swap in the company's own site photos when available.
3. The sandwich-panel sentence in the profile is cut off; the site completes it as "…cold-storage and modular projects."
4. Connect the enquiry form to a real email service when the site goes live.
