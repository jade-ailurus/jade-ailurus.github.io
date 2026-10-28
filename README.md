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
deployment. Only the redacted public CV belongs in this repository.

## Business card CV access

On October 29, 2026 the owner explicitly requested the full local CV for people
holding the business card QR link. Ordinary visits still use docs/cv.pdf.

card-cv.js recognizes a card access key in the URL fragment and decrypts
docs/card-cv.enc in the visitor's browser. The public asset contains only
AES-256-GCM ciphertext (12-byte nonce, ciphertext, 16-byte authentication tag).
The random key is supplied only by the physical QR and private local card files;
it must never be committed, added to HTML, or bundled with the public site.
The full PDF, QR image, and QR link must remain outside this repository.
This authorizes only encrypted card access; the public CV and public References
policy remain unchanged. Anyone given the complete QR link can view the full CV.

Within-page navigation keeps the decrypted CV available. Reloading after the
URL fragment has changed to an ordinary section requires scanning the QR again.
The encrypted CV is a snapshot; when updating it, use a fresh nonce and retain
the same private key to keep already-printed cards working. The plaintext source
and current QR are stored locally under OneDrive (2026/26_4 Fall and Card).
Do not replace the key unless intentionally retiring previously printed cards.
