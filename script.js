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
        date: `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`,
        seed: seed
    };
}

function applyDailyColor() {
    const colorBox = document.getElementById('dailyColorBox');
    const colorNote = document.getElementById('dailyColorNote');

    if (colorBox && colorNote) {
        const daily = getDailyColor();
        colorBox.style.background = daily.gradient;
        colorNote.innerHTML = `// color = dailyGradient(seed=${daily.seed})<br>// generated @ NYC ${daily.date}<br>// have a nice day :)`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Apply daily color
    applyDailyColor();
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
