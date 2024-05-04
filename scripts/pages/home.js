/// <reference path="../typings/chrome.d.ts" />
//@ts-check

import { getCurrentTab } from '../utils.js';
import { ACTION, MESSAGES, STORAGE } from '../constants.js';
import Settings from './settings.js';

const automateBtn = document.getElementById('generate-tests');
const checkAccessibilityBtn = document.getElementById('check-accessibility');
const cypressBtn = document.getElementById('cypress');
const ellipsis = document.getElementsByClassName('ellipsis');
const generateTestIdeasBtn = document.getElementById('generate-test-ideas');
const javascriptBtn = document.getElementById('javascript');
const mainControls = document.getElementById('main-controls');
const pickerBtn = document.getElementById('start-picking');
const playwrightBtn = document.getElementById('playwright');
const pomOffBtn = document.getElementById('pom-off');
const pomOnBtn = document.getElementById('pom-on');
const screenshotContainer = document.getElementById('screenshot-container');
const screenShotImage = document.getElementById('screenshot-image');
const statusDescription = document.getElementById('status');
const typescriptBtn = document.getElementById('typescript');

// new
const notesButton = document.getElementById('notes');

export default class Home {
    constructor() {
        this.tab = getCurrentTab();
        this.addListeners();
        this.initializeState();
        new Settings();
    }

    async pickElement() {
        const queryOptions = { active: true, currentWindow: true };
        const tabs = await chrome.tabs.query(queryOptions);
        await chrome.tabs.sendMessage(tabs[0].id, { action: ACTION.START_PICKING });
    }

    async highlightElement(element) {
        const action =
            element.type == 'mouseenter' ? ACTION.HIGHLIGHT_ELEMENT : ACTION.UNHIGHLIGHT_ELEMENT;
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action });
        });
    }

    /**
     *
     * @param {string} message
     */
    updateControls(message) {
        statusDescription.innerHTML = message;
        statusDescription.style.display = 'block';
        automateBtn.disabled = true;
        pickerBtn.disabled = true;
        generateTestIdeasBtn.disabled = true;
        checkAccessibilityBtn.disabled = true;
    }

    addListeners() {
        const generateIdeas = 'pages/testIdeas.html';
        const notesPath = 'pages/notes/index.html';

        generateTestIdeasBtn.addEventListener('click', async () => {
            await chrome.sidePanel.setOptions({ path: generateIdeas });
        });

        notesButton.addEventListener('click', async () => {
            await chrome.sidePanel.setOptions({ path: notesPath });
        });

        automateBtn.addEventListener('click', () => {
            updateControls(MESSAGES.GENERATING_TESTS);
            displayResultInNewWindow(chrome.runtime.getURL('pages/generatedTests.html'));
        });

        checkAccessibilityBtn.addEventListener('click', () => {
            updateControls(MESSAGES.CHECKING_ACCESSIBILITY);
            displayResultInNewWindow(chrome.runtime.getURL('pages/checkAccessibility.html'));
        });

        pickerBtn.addEventListener('click', this.pickElement);
        pickerBtn.addEventListener('mouseenter', this.highlightElement);
        pickerBtn.addEventListener('mouseleave', this.highlightElement);

        // Update message and enable picker
        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            if (request.source === 'stream' && request.status == 'finished') {
                this.pickerBtn.disabled = false;
                this.statusDescription.textContent = MESSAGES.SUCCESS;
            } else if (request.source === 'stream' && request.status == 'error') {
                this.pickerBtn.disabled = false;
                this.statusDescription.textContent = MESSAGES.FAILED;
            }
        });
     
        chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
            switch (request.action) {
                case 'generate-ideas':
                    chrome.sidePanel.setOptions({ path: generateIdeas });
                    break;

                default:
                    break;
            }
        });
    }

    async initializeState() {
        const currentTabUrl = this.tab.url;

        const data = await chrome.storage.local.get([
            STORAGE.ELEMENT_PICKED,
            STORAGE.SITE_URL,
            STORAGE.ELEMENT_SCREENSHOT,
            STORAGE.PAGE_SCREENSHOT,
        ]);

        if (!data[STORAGE.SITE_URL] || data[STORAGE.SITE_URL] !== currentTabUrl) {
            await chrome.storage.local.remove([STORAGE.ELEMENT_PICKED, STORAGE.ELEMENT_SOURCE]);
            await chrome.storage.local.set({ [STORAGE.SITE_URL]: currentTabUrl });
            await chrome.runtime.sendMessage('take-screenshot');
        }

        if (data[STORAGE.ELEMENT_PICKED]) {
            automateBtn.disabled = false;
            generateTestIdeasBtn.disabled = false;
            checkAccessibilityBtn.disabled = false;
        } else {
            automateBtn.disabled = true;
            generateTestIdeasBtn.disabled = true;
            checkAccessibilityBtn.disabled = true;
        }

        if (data[STORAGE.ELEMENT_SCREENSHOT]) {
            screenShotImage.src = data[STORAGE.ELEMENT_SCREENSHOT];
            screenshotContainer.style.display = 'block';
        } else if (data[STORAGE.PAGE_SCREENSHOT]) {
            screenShotImage.src = data[STORAGE.PAGE_SCREENSHOT];
            screenshotContainer.style.display = 'block';
        }
    }
}
