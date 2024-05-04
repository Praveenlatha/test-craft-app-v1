/// <reference path="../scripts/typings/chrome.d.ts" />
//@ts-check

import { ApiClient } from '../scripts/client.js';
import Home from '../scripts/pages/home.js';
const APIClient = new ApiClient({});

APIClient.ping();

new Home();
