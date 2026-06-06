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
    if (!statusMsg) return;

    try {
        console.log('Fetching latest release from:', API_URL);
        const response = await fetch(API_URL);
        
        if (response.status === 404) {
            statusMsg.textContent = "Note: Public desktop releases are currently being prepared.";
            return;
        }

        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const data = await response.json();
        console.log('Latest release data:', data);
        
        let foundPlatforms = [];

        data.assets.forEach(asset => {
            const name = asset.name.toLowerCase();
            const url = asset.browser_download_url;
            console.log('Checking asset:', name);

            if (name.endsWith('.msi')) { bindLink('dl-win', url); foundPlatforms.push('Windows'); }
            if (name.endsWith('.dmg')) { bindLink('dl-mac', url); foundPlatforms.push('macOS'); }
            if (name.endsWith('.deb')) { bindLink('dl-linux', url); foundPlatforms.push('Linux'); }
            if (name.endsWith('.apk')) { bindLink('dl-apk', url); foundPlatforms.push('Android (Direct)'); }
        });

        if (foundPlatforms.length > 0) {
            statusMsg.textContent = `Latest version found for: ${foundPlatforms.join(', ')}.`;
        } else {
            statusMsg.textContent = "Latest version found, but no matching desktop binaries were detected yet.";
        }

    } catch (e) {
        console.error('Release fetch error:', e);
        statusMsg.textContent = "Note: Public desktop releases are currently being prepared.";
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
