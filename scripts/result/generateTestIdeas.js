let createTestsButton;
let testIdeasTestsContainer;
let ideas;

document.addEventListener('DOMContentLoaded', () => {
    testIdeasTestsContainer = document.getElementById('testIdeas');
    createTestsButton = document.getElementById('createTests');
    const copyButton = document.getElementById('copyButton');

    copyButton.addEventListener('click', async () => {
        try {
            const selectedIdeas = createTestsButton.disabled
                ? testIdeasTestsContainer.textContent
                : getCheckedIdeas().join('\n');
            await navigator.clipboard.writeText(selectedIdeas);
            showToast(RESULT.SUCCESS, MESSAGES.COPIED);
        } catch (err) {
            showToast(RESULT.ERROR, MESSAGES.FAILED);
        }
    });

    createTestsButton.addEventListener('click', async () => {
        try {
            await chrome.storage.local.set({ [STORAGE.IDEAS]: getCheckedIdeas() });
            displayResultInNewWindow(chrome.runtime.getURL('pages/generatedTestsFromIdeas.html'));
        } catch (err) {
            showToast(RESULT.ERROR, MESSAGES.FAILED);
        }
    });

    showResult(FEATURE.GENERATE_TEST_IDEAS);
});

function finishIdeas() {
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

    const editButtons = document.querySelectorAll('button.edit-btn');
    editButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            const btn = event.currentTarget;
            const label = btn.parentNode;

            const span = label.querySelector('span.test-idea-text');
            const input = label.querySelector('span.test-idea-text input');

            if (input.type === 'checkbox') {
                btn.disabled = true;
                var textNode = [...span.childNodes].filter((node) => {
                    return node.nodeType == Node.TEXT_NODE;
                })[0];

                if (textNode) {
                    const ideaText = textNode.textContent;
                    span.removeChild(textNode);

                    input.type = 'text';
                    input.value = ideaText;

                    input.classList.add('editing-idea');

                    input.addEventListener('blur', () => {
                        const newText = input.value;
                        input.value = '';
                        input.type = 'checkbox';
                        const textNode = document.createTextNode(newText);
                        const br = span.querySelector('br');
                        span.insertBefore(textNode, br);
                        input.classList.remove('editing-idea');
                        btn.disabled = false;
                    });

                    input.addEventListener('keydown', (event) => {
                        if (event.key === 'Enter' || event.key === 'Escape') {
                            input.blur();
                        }
                    });

                    input.focus();
                }
            }
        });
    });
}

function getCheckedIdeas() {
    const checkedIdeas = [];
    for (const idea of ideas) {
        if (idea.checked) {
            checkedIdeas.push(idea.parentElement.textContent.trim());
        }
    }
    return checkedIdeas;
}
