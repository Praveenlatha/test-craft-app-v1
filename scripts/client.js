/// <reference path="./typings/chrome.d.ts" />
//@ts-check

import { ENDPOINTS, MESSAGES, OPENAI_PROXY_BASE_URL, STORAGE } from './constants.js';

export class ApiClient {
    constructor(config) {
        this.config = config;
    }

    async ping() {
        const statusDescription = document.getElementById('status');
        await fetch(`${OPENAI_PROXY_BASE_URL}${ENDPOINTS.PING}`).then((res) => {
            if (res.status !== 200) {
                statusDescription.textContent = MESSAGES.FAILED;
                statusDescription.style.display = 'block';
            }
        });
    }

    // async generateSuggestions(context, requirements) {
    //     await fetch(`${OPENAI_PROXY_BASE_URL}${ENDPOINTS.PING}`).then((res) => {
    //         if (res.status !== 200) {
    //             statusDescription.textContent = MESSAGES.FAILED;
    //             statusDescription.style.display = 'block';
    //         }
    //     });
    // }

    async getDescription() {
        const url = `${OPENAI_PROXY_BASE_URL}${ENDPOINTS.DESCRIBE}`;
        const data = await chrome.storage.local.get([STORAGE.PAGE_SCREENSHOT]);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pageScreenshot: data[STORAGE.PAGE_SCREENSHOT] }),
        };

        const response = await fetch(url, options);
        if (response.status === 200) {
            console.log(response.json());
            return await response.json();
        } else {
            console.error(response);
        }
    }
}
