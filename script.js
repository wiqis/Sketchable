const REPO = 'wiqis/Sketchable';
const API_URL = `https://api.github.com/repos/${REPO}/releases/latest`;

// Theme Switching
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    if (body.classList.contains('light-theme')) {
        body.classList.replace('light-theme', 'dark-theme');
        localStorage.setItem('sketchable-theme', 'dark');
    } else {
        body.classList.replace('dark-theme', 'light-theme');
        localStorage.setItem('sketchable-theme', 'light');
    }
});

// Restore Theme
if (localStorage.getItem('sketchable-theme') === 'dark') {
    body.classList.replace('light-theme', 'dark-theme');
}

// Release Fetching
async function initReleases() {
    const statusMsg = document.getElementById('status-msg');

    try {
        const response = await fetch(API_URL);
        
        if (response.status === 404) {
            statusMsg.innerText = "Note: Public desktop releases are currently being prepared.";
            return;
        }

        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        statusMsg.innerText = `Latest version found. Desktop downloads are now active.`;
        
        data.assets.forEach(asset => {
            const name = asset.name.toLowerCase();
            const url = asset.browser_download_url;

            if (name.endsWith('.msi')) bindLink('dl-win', url);
            if (name.endsWith('.dmg')) bindLink('dl-mac', url);
            if (name.endsWith('.deb')) bindLink('dl-linux', url);
            if (name.endsWith('.apk')) bindLink('dl-apk', url);
        });

    } catch (e) {
        console.warn('Release fetch failed. This is expected if the public repo has no releases yet.');
        if (statusMsg) {
            statusMsg.innerText = "Note: Public desktop releases are currently being prepared.";
        }
    }
}

function bindLink(id, url) {
    const el = document.getElementById(id);
    if (el) {
        el.href = url;
        el.classList.remove('disabled');
        el.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', initReleases);
