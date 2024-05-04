/// <reference path="../typings/chrome.d.ts" />
//@ts-check

import { FEATURE, MESSAGES, RESULT, STORAGE } from '../constants.js';
import { showResult, showToast } from '../result/common.js';

const testIdeasTestsContainer = document.getElementById('testIdeas');
const createTestsButton = document.getElementById('createTests');
const copyButton = document.getElementById('copyButton');

export default class TestIdeas {
    constructor() {
        this.initialize();
    }

    async initialize() {
        copyButton.addEventListener('click', async () => {
            try {
                const selectedIdeas = createTestsButton.disabled
                    ? testIdeasTestsContainer.textContent
                    : this.getCheckedIdeas().join('\n');
                await navigator.clipboard.writeText(selectedIdeas);
                showToast(RESULT.SUCCESS, MESSAGES.COPIED);
            } catch (err) {
                showToast(RESULT.ERROR, MESSAGES.FAILED);
            }
        });

        const backToMenu = document.getElementById('backToMenu');
        backToMenu.addEventListener('click', async () => {
            chrome.sidePanel.setOptions({ path: 'sidepanel/index.html' });
        });

        // createTestsButton.addEventListener('click', async () => {
        //     try {
        //         await chrome.storage.local.set({ [STORAGE.IDEAS]: getCheckedIdeas() });
        //         displayResultInNewWindow(chrome.runtime.getURL('pages/generatedTestsFromIdeas.html'));
        //     } catch (err) {
        //         showToast(RESULT.ERROR, MESSAGES.FAILED);
        //     }
        // });

        showResult(FEATURE.GENERATE_TEST_IDEAS);
    }

    finishIdeas() {
        ideas = document.querySelectorAll('label input');
        testIdeasTestsContainer.addEventListener('click', (event) => {
            if (event.target.matches('label input')) {
                let hasIdeasChecked = false;
                for (const idea of ideas) {
                    if (idea.checked) {
                        hasIdeasChecked = true;
                        break;
                    }
                }
                createTestsButton.disabled = !hasIdeasChecked;
            }
        });
    }

    getCheckedIdeas() {
        const checkedIdeas = [];
        for (const idea of ideas) {
            if (idea.checked) {
                checkedIdeas.push(idea.parentElement.textContent.trim());
            }
        }
        return checkedIdeas;
    }
}

new TestIdeas();