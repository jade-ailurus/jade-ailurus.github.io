// ========================================
// Hover interaction - highlight selected, fade others
// ========================================

// ========================================
// Daily Random Color Generator (NYC Time)
// ========================================
function getDailyColor() {
    // Get current date in New York timezone
    const nyDate = new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York' });
    const [month, day, year] = nyDate.split('/').map(Number);

    // Create seed from date (YYYYMMDD format)
    const seed = year * 10000 + month * 100 + day;

    // Seeded random number generator (mulberry32)
    function mulberry32(a) {
        return function() {
            let t = a += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }

    const rand = mulberry32(seed);

    // Generate 3 colors for gradient (HSL for nicer colors)
    function randomHSL() {
        const h = Math.floor(rand() * 360);
        const s = 50 + Math.floor(rand() * 30); // 50-80%
        const l = 65 + Math.floor(rand() * 20); // 65-85%
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    const color1 = randomHSL();
    const color2 = randomHSL();
    const color3 = randomHSL();

    return {
        gradient: `linear-gradient(135deg, ${color1} 0%, ${color2} 50%, ${color3} 100%)`,
        date: `${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}.${year}`,
        seed: seed
    };
}

function applyDailyColor() {
    const colorBox = document.getElementById('dailyColorBox');
    const colorNote = document.getElementById('dailyColorNote');

    if (colorBox && colorNote) {
        const daily = getDailyColor();
        colorBox.style.background = daily.gradient;
        colorNote.innerHTML = `// color = dailyGradient(seed=${daily.seed})<br>// refreshes every midnight (US EST)<br>// may today's color bring you luck :)`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Apply daily color
    applyDailyColor();

    // ========================================
    // Sidebar Toggle
    // ========================================
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');

    if (sidebarToggle) {
        // Check if mobile
        const isMobile = () => window.innerWidth <= 900;

        // Check saved sidebar state (desktop only)
        const savedSidebarState = localStorage.getItem('sidebarCollapsed');
        if (savedSidebarState === 'true' && !isMobile()) {
            document.body.classList.add('sidebar-collapsed');
        }

        sidebarToggle.addEventListener('click', () => {
            if (isMobile()) {
                // Mobile: toggle full-screen overlay
                document.body.classList.toggle('sidebar-open');
            } else {
                // Desktop: collapse/expand sidebar
                document.body.classList.toggle('sidebar-collapsed');
                const isCollapsed = document.body.classList.contains('sidebar-collapsed');
                localStorage.setItem('sidebarCollapsed', isCollapsed);
            }
        });

        // Close mobile sidebar when clicking a link
        if (sidebar) {
            sidebar.querySelectorAll('.sidebar-link').forEach(link => {
                link.addEventListener('click', () => {
                    if (isMobile()) {
                        document.body.classList.remove('sidebar-open');
                    }
                });
            });
        }

        // Close mobile sidebar when resizing to desktop
        window.addEventListener('resize', () => {
            if (!isMobile()) {
                document.body.classList.remove('sidebar-open');
            }
        });
    }

    // ========================================
    // Sticky Table of Contents (for post pages)
    // ========================================
    const postContent = document.querySelector('.post-content');
    const postHeader = document.querySelector('.post-header');

    if (postContent && postHeader) {
        const headings = postContent.querySelectorAll('h2');

        if (headings.length > 0) {
            // Create sticky TOC element
            const stickyToc = document.createElement('nav');
            stickyToc.className = 'sticky-toc';

            // Create header row (current section + button)
            const tocHeader = document.createElement('div');
            tocHeader.className = 'toc-header';

            // Create current section display
            const tocCurrent = document.createElement('span');
            tocCurrent.className = 'toc-current';
            tocCurrent.textContent = headings[0].textContent;
            tocHeader.appendChild(tocCurrent);

            // Create expand button
            const expandBtn = document.createElement('button');
            expandBtn.className = 'toc-expand-btn';
            expandBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>';
            expandBtn.addEventListener('click', () => {
                stickyToc.classList.toggle('expanded');
            });
            tocHeader.appendChild(expandBtn);

            stickyToc.appendChild(tocHeader);

            // Create links container
            const tocLinks = document.createElement('div');
            tocLinks.className = 'toc-links';

            // Add IDs to headings and create TOC links
            headings.forEach((heading, index) => {
                const id = `section-${index}`;
                heading.id = id;

                const link = document.createElement('a');
                link.href = `#${id}`;
                link.className = 'toc-link';
                link.textContent = heading.textContent;

                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    stickyToc.classList.remove('expanded');
                    const yOffset = -120;
                    const y = heading.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                });

                tocLinks.appendChild(link);
            });

            stickyToc.appendChild(tocLinks);

            // Insert TOC into body (fixed position)
            document.body.appendChild(stickyToc);

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!stickyToc.contains(e.target)) {
                    stickyToc.classList.remove('expanded');
                }
            });

            // Show/hide TOC based on first h2 position
            const firstHeading = headings[0];

            function updateTocVisibility() {
                const firstHeadingTop = firstHeading.getBoundingClientRect().top;

                // Show TOC when first h2 reaches top of viewport
                if (firstHeadingTop < 80) {
                    stickyToc.classList.add('visible');
                } else {
                    stickyToc.classList.remove('visible');
                    stickyToc.classList.remove('expanded');
                }

                // Update current section and active link
                let currentSection = null;
                let currentHeadingText = headings[0].textContent;

                headings.forEach((heading) => {
                    const rect = heading.getBoundingClientRect();
                    if (rect.top <= 150) {
                        currentSection = heading.id;
                        currentHeadingText = heading.textContent;
                    }
                });

                // Update current section display
                tocCurrent.textContent = currentHeadingText;

                // Update active link in dropdown
                tocLinks.querySelectorAll('.toc-link').forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
                });
            }

            window.addEventListener('scroll', updateTocVisibility);
            updateTocVisibility();
        }
    }
    const hexWrapper = document.querySelector('.hex-wrapper');
    const vertices = document.querySelectorAll('.vertex');

    if (hexWrapper && vertices.length) {
        vertices.forEach(vertex => {
            const index = vertex.getAttribute('data-index');

            vertex.addEventListener('mouseenter', () => {
                hexWrapper.classList.add('has-hover');
                vertex.classList.add('active');
                document.querySelectorAll(`.dot-v${index}`).forEach(dot => {
                    dot.classList.add('active');
                });
            });

            vertex.addEventListener('mouseleave', () => {
                hexWrapper.classList.remove('has-hover');
                vertex.classList.remove('active');
                document.querySelectorAll('.dot').forEach(dot => {
                    dot.classList.remove('active');
                });
            });
        });
    }

    // ========================================
    // Theme Toggle
    // ========================================
    const themeToggle = document.getElementById('themeToggle');

    if (themeToggle) {
        // Check saved theme or system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            let newTheme;
            if (currentTheme === 'dark') {
                newTheme = 'light';
            } else if (currentTheme === 'light') {
                newTheme = 'dark';
            } else {
                // No theme set, toggle from system preference
                newTheme = prefersDark ? 'light' : 'dark';
            }

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
});
