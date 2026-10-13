# Infinity Hub Contracting LLC — v5 "Heron" design

This version rebuilds the design system and page structure of heronaiapp.com using Infinity Hub's own content. Heron's flat drawings are replaced with live, full-colour 3D models with fine ink edge lines, and every photo and video comes from the `Asset` folder. No Heron text, artwork or code is used. Earlier versions (the Technical Services site and v4-3d) are unchanged.

## Open the site
Serve this folder over http (for example `python -m http.server` here, then open http://localhost:8000) or upload `index.html` with the `assets/` folder to any static host. It needs an internet connection for the fonts and the Three.js, GSAP and Lenis libraries.

## Design system (as on Heron)
- Off-white paper with grain, a fixed 1px page frame, ruler ticks and + crosshairs around every drawing.
- Nav built from cells with vertical dividers, mono uppercase labels and a red "Contact us" cell.
- Big uppercase grotesk headlines, small mono labels, one red accent. Two fonts only: **Inter Tight** and **Geist Mono**.
- Dark title bars, bracketed numbers [01], dashed dividers and box buttons with arrows.

## Page, top to bottom
| Section | What happens |
|---|---|
| Loader | **3D assembly**: on the paper sheet, a colour 3D building assembles itself in step with the stages 001–010: the ground slab lands, red setting-out pegs appear, columns rise, the first floor slab drops on, walls and glass fill in, the upper floor and roof follow, the shade canopy settles over the terrace, trees appear and a red sun rises. Each piece dissolves in with ink outlines while the camera slowly turns; a large % and the current stage show top left. |
| Hero | "Shaping tomorrow's landmark". The 3D elevation turns with the pointer. Two red markers link to Interior fit-out and Steel. A capabilities ticker runs below. |
| About | The shade canopy photo reveals over its own line drawing as you scroll, with a red sun. The statement lights up word by word. Industries slider. |
| Shade configurator | Replaces the old principles cards. Choose car parking, tensile sail or pergola; set bays or sails (1–6), which way the long side runs, frame finish (charcoal, white, bronze, galvanised, Infinity red) and canopy fabric or slat finish. A time slider (with play) and season (Dec / Mar / Jun) move a red sun along its real path over Dubai; the model casts live shadows. Readouts: covered area, cars sheltered, and how much of the footprint is shaded now, with a curve for the whole day. "Enquire about this setup" opens the enquiry form with the configuration filled in. Sizes and shade are labelled as indicative. |
| Pinned plan | "One contracting partner" / "For the whole project", then a colour 3D floor plan builds itself: the floor appears, walls rise one by one, furniture and glazing drop in, and the camera turns. Red markers follow the model and open stage details (site survey, scope & proposal, inspection). |
| Capabilities | One compact section: a 3D stage on the left and a simple list of six capabilities on the right (structural steel, civil & interior fit-out, mezzanines, car parking & building shades, sandwich panels, boxing rings). Opening an item swaps the model with a dissolve and shows its description, scope chips and an enquire button; the boxing ring adds 5×5 / 6×6 / 7×7 sizes. Parking shades link to the configurator. On phones the 3D stage moves into the open item. The full list of nine core capabilities runs in the hero ticker. |
| How we work | Pinned: a dark step bar and red line move between Understand, Plan, Build and Hand over. Each step is its own 3D scene: a survey sweep over the plan, three floating drawing sheets carrying the steel, shade and fit-out models, a portal frame erected piece by piece, and red inspection pins linked across the finished plan. |
| Our work | "From the workshop to the finished site": an accordion of four disciplines (structural steel, parking & building shades, civil & interior fit-out, planning & coordination). Opening one swaps the large image beside it: steel inspection photo, shade video, tiling photo, drawing review photo. |
| Contact + footer | Coordinates, red button, photo of a contemporary commercial building. Footer columns, contact details with copy, and a giant outlined "INFINITY HUB" drawing. |

The enquiry drawer prepares an email in the visitor's own mail app. It never claims to send.

## Finish pass
- Fewer lines: the drawing frames keep only their corner marks (no ruler ticks); dashed dividers are now single hairlines; the coordinate labels, the dashed guides round the footer wordmark and the red guide line in How we work are gone.
- Solid header and a clean sheet margin, so nothing shows through while scrolling.
- Section labels sit above their headings; the About statement runs on fewer, longer lines; buttons are sized to their labels.
- Pinned sections fit exactly between the header and the bottom of the sheet, so their notes are never cut off.
- Smoother motion: softer smooth-scroll and eased scrubbing on the pinned plan and the process.
- Phones: in How we work each note becomes a strip at the edge of its drawing, clear of the step bar.

## Content
All text comes from `Company_Profile.pdf`. No clients, figures or testimonials are invented. All images and the video come only from the `Asset` folder (the small generator mark in each image's corner is cropped off). No photos from the company profile, archives or other websites are used, so the section is called "Our work", not "Projects": the images illustrate the disciplines and are not presented as completed projects.

## Structure
- `index.html`: the website.
- `source/parts/`: `style.css`, `body.html`, `main.js` (content and motion) and `gl.js` (all 3D views, one shared WebGL canvas). `source/build.py` assembles them.

## Before going live
1. Connect the enquiry form to a real email service.
2. The company name follows the profile ("Contracting LLC"), not the current live site ("Technical Services").
