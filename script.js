// ========================================
// Hover interaction - highlight selected, fade others
// ========================================

document.addEventListener('DOMContentLoaded', () => {
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
