function updateControls(message) {
    statusDescription.innerHTML = message;
    statusDescription.style.display = 'block';
    automateBtn.disabled = true;
    pickerBtn.disabled = true;
    generateTestIdeasBtn.disabled = true;
    checkAccessibilityBtn.disabled = true;
};

generateTestIdeasBtn.addEventListener('click', async () => {
    updateControls(MESSAGES.GENERATING_TEST_IDEAS);
    await chrome.sidePanel.setOptions({ path: generateIdeas });
    // await chrome.runtime.sendMessage({ action: 'generate-ideas'});
    // displayResultInNewWindow(chrome.runtime.getURL('pages/generatedIdeas.html'));
});

automateBtn.addEventListener('click', () => {
    updateControls(MESSAGES.GENERATING_TESTS);
    displayResultInNewWindow(chrome.runtime.getURL('pages/generatedTests.html'));
});

checkAccessibilityBtn.addEventListener('click', () => {
    updateControls(MESSAGES.CHECKING_ACCESSIBILITY);
    displayResultInNewWindow(chrome.runtime.getURL('pages/checkAccessibility.html'));
});
