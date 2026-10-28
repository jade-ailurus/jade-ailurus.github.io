# Jaehyun Park — academic website

A static academic website with the essential introduction, research, background,
and contact information on one page.

## Structure

- `index.html`: the main profile, ordered as introduction, Education,
  Publication, Projects, Research Experience, Awards & Scholarships,
  Service and Leadership, Skills, and Posts. The top navigation groups these as
  Research (Publication, Projects, Research Experience), Background
  (Awards, Service, Skills), and Posts. The CV link in the introduction opens
  the public PDF.
  `#coursework` smoothly opens the course list in Education.
- `profile.css` and `profile.js`: the main profile's presentation and interactions.
- `academic.css`: shared typography and colors for supporting pages.
- `docs/cv.pdf`: the public CV.
- `projects/`: concise project details.
- `letters/academic-journey.html`: "Designing my academic path: Mathematical Modeling for Complex Systems", linked
  from the introduction's academic-journey link and Posts.
- `blog/post-1.html` and `blog/post-2.html`: posts with a TBD body, using the
  same template as the academic-journey essay.
- `blog.html`, `blog/`, `philosophy.html`, and `philosophy/`: retained supporting
  pages; the five removed essays are excluded from the post listings.
- `styles.css`, `list.css`, `post.css`, and `script.js`: styles and interactions
  used by the existing article and listing pages.
- `about.html`, `projects.html`, `publications.html`, and `tmi.html`: compatibility
  redirects to sections of the main profile.
- `documents.html` and `cv.html`: compatibility redirects to the public CV.

## Updating content

Keep the profile, project summaries, and public CV consistent. Clearly distinguish
work in preparation from submitted or published work, and describe only results
and contributions that can be substantiated.

Use the supplied CV as the source of truth for profile content. Preserve its
wording and facts except for explicitly requested redactions; do not add inferred
research claims, rewrite personal statements, or omit details without direction.
Keep section and item order as requested. Use four type sizes (48, 28, 20, 16px),
black text on white, and blue for content hyperlinks. Navigation is black, with
the currently viewed section in bold. Preserve supplied essay text; the two
technical posts intentionally show only TBD until their content is provided.
Use `Mon YYYY–Mon YYYY` for date ranges and `Mon YYYY–present` for ongoing work.
Keep semester-only and year-only dates at their original precision.

Confidential research titles and technical details must be omitted from every
public file, including HTML source, metadata, downloadable documents, and assets.
Visual blur does not remove information from the source. Use a neutral placeholder
when a manuscript cannot yet be described publicly. Keep private CV source files
and unredacted application materials outside this repository.

## Local preview

Run this command from the repository directory:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Open <http://127.0.0.1:8000/>. This starts a local preview; changing these files does
not by itself publish the site. Review the public files before deploying.

## Publishing

GitHub Pages serves the repository root from `main` at
<https://jade-ailurus.github.io/>. Pushing a reviewed commit to `main` triggers
deployment. The default download remains the redacted public CV. The separately authorized
full CV for printed-card visitors is described below.

## Already-printed business card CV

On October 29, 2026, the owner explicitly selected the existing printed QR
address (about.html) for access to the full local CV, acknowledging that anyone
who knows that address can view it. This is an explicit exception for the full
download, including its existing contents, to the general public-CV restrictions.
Do not regenerate the physical QR or replace the default public CV.

- about.html redirects to index.html?from=card#about.
- card-cv.js selects docs/cv-full.pdf only when from=card.
- Ordinary homepage visits, cv.html, and documents.html still use docs/cv.pdf.
- The homepage References section remains unpublished.
- docs/cv-full.pdf is a separate, publicly accessible copy of the approved full
  CV. The route is a version selector, not an authentication or access boundary.
  Do not describe this download as password protected or truly private.
- Navigation within the profile retains the query. A fresh ordinary homepage
  visit has the public CV; no browser storage grants persistent full-CV mode.

The full PDF source is the owner's local Jaehyun_Park_CV.pdf in OneDrive under
2026/26_4 Fall. Keep future full-CV updates separate from the public docs/cv.pdf.
