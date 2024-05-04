import { ApiClient } from '../../scripts/client.js';

const client = new ApiClient();
const description = document.getElementById('suggestions');

const backToMenu = document.getElementById('backToMenu');
backToMenu.addEventListener('click', async () => {
    chrome.sidePanel.setOptions({ path: 'sidepanel/index.html' });
});

client.getDescription().then((res) => {
    description.textContent = res.message;
});
