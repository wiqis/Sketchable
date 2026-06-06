const REPO = 'wiqis/Sketchable';
const API_URL = `https://api.github.com/repos/${REPO}/releases/latest`;

async function fetchLatestRelease() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch release info');
        
        const data = await response.json();
        const version = data.tag_name;
        const assets = data.assets;

        document.getElementById('version-tag').innerText = `Latest Version: ${version}`;

        // Map assets to download buttons
        assets.forEach(asset => {
            const name = asset.name.toLowerCase();
            const url = asset.browser_download_url;

            if (name.endsWith('.msi')) {
                updateButton('dl-windows', url);
            } else if (name.endsWith('.dmg')) {
                updateButton('dl-macos', url);
            } else if (name.endsWith('.deb')) {
                updateButton('dl-linux', url);
            } else if (name.endsWith('.apk')) {
                document.getElementById('apk-link').href = url;
            }
        });

    } catch (error) {
        console.error('Error fetching latest release:', error);
        document.getElementById('version-tag').innerText = 'Could not load latest version. Please check back later.';
    }
}

function updateButton(id, url) {
    const card = document.getElementById(id);
    if (card) {
        const btn = card.querySelector('.btn-download');
        btn.href = url;
    }
}

document.addEventListener('DOMContentLoaded', fetchLatestRelease);
