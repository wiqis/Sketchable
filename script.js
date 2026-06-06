const REPO = 'wiqis/Sketchable';
const API_URL = `https://api.github.com/repos/${REPO}/releases/latest`;

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    if (body.classList.contains('light-theme')) {
        body.classList.replace('light-theme', 'dark-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.replace('dark-theme', 'light-theme');
        localStorage.setItem('theme', 'light');
    }
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.replace('light-theme', 'dark-theme');
}

// Fetch Latest Release Logic
async function fetchLatestRelease() {
    const statusMsg = document.getElementById('status-msg');
    const versionInfo = document.getElementById('version-info');

    try {
        const response = await fetch(API_URL);
        
        // Handle 404 (No releases yet)
        if (response.status === 404) {
            statusMsg.innerText = "No public releases found yet. The app is being prepared for its first public launch.";
            versionInfo.innerText = "Coming Soon to Desktop";
            return;
        }

        if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
        
        const data = await response.json();
        const tag = data.tag_name;
        const assets = data.assets;

        versionInfo.innerText = `Latest Version: ${tag}`;
        statusMsg.innerText = "Latest stable version is ready for download.";

        assets.forEach(asset => {
            const name = asset.name.toLowerCase();
            const url = asset.browser_download_url;

            if (name.endsWith('.msi')) enableLink('dl-win', url);
            if (name.endsWith('.dmg')) enableLink('dl-mac', url);
            if (name.endsWith('.deb')) enableLink('dl-linux', url);
            if (name.endsWith('.apk')) enableLink('dl-apk', url);
        });

    } catch (error) {
        console.error('Fetch error:', error);
        statusMsg.innerText = "Note: Could not fetch latest release automatically. Please check the Play Store for mobile.";
    }
}

function enableLink(id, url) {
    const el = document.getElementById(id);
    if (el) {
        el.href = url;
        el.classList.remove('disabled');
        el.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', fetchLatestRelease);
