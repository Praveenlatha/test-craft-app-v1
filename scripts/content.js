let picking = false;
let hoveredElement;
let sourceCode;

// Inject toast element
const toast = document.createElement('div');
toast.id = 'toast';
toast.className = 'toast';
toast.textContent = 'Element picked!';
document.body.appendChild(toast);

function showToast(type = 'success') {
    toast.classList.add('show', type);
    setTimeout(() => {
        toast.classList.remove('show', type);
    }, 3000);
}

function startPicking() {
    picking = true;
    if (hoveredElement) {
        hoveredElement.classList.remove('element-picker-hovered');
    }
    document.addEventListener('mouseover', mouseOverHandler);
    document.addEventListener('mouseout', mouseOutHandler);
    document.addEventListener('click', clickHandler);
}

function stopPicking() {
    picking = false;
    document.removeEventListener('mouseover', mouseOverHandler);
    document.removeEventListener('mouseout', mouseOutHandler);
    document.removeEventListener('click', clickHandler);
}

function mouseOverHandler(e) {
    e.stopPropagation();
    e.preventDefault();
    hoveredElement = e.target;
    hoveredElement.classList.add('element-picker-hovered');
}

function mouseOutHandler(e) {
    e.stopPropagation();
    e.preventDefault();
    hoveredElement.classList.remove('element-picker-hovered');
}

function resizeCanvas(originalCanvas, width) {
    var height = originalCanvas.height / (originalCanvas.width / width);
    var resizedCanvas = document.createElement('canvas');
    var ctx = resizedCanvas.getContext('2d');
    resizedCanvas.width = width;
    resizedCanvas.height = height;
    ctx.drawImage(originalCanvas, 0, 0, width, height);
    return resizedCanvas;
}

async function clickHandler(e) {
    e.stopPropagation();
    e.preventDefault();
    stopPicking();
    hoveredElement.classList.remove('element-picker-hovered');
    source = hoveredElement.outerHTML;
    var canvas = await html2canvas(hoveredElement);
    canvas = resizeCanvas(canvas, 512);
    var screenShot = canvas.toDataURL();
    await chrome.runtime.sendMessage({ action: 'element-picked', source, screenShot });
    showToast();
}

async function takeScreenshot() {
    const canvas = html2canvas(document.body);
    canvas = resizeCanvas(canvas, 512);
    const screenshot =  canvas.toDataURL();
    await chrome.runtime.sendMessage({ action: 'screenshot-taken', screenshot });
}

chrome.runtime.onMessage.addListener((request) => {
    switch (request.action) {
        case 'start-picking':
            startPicking();
            break;
        case 'highlight-selected-element':
            if (hoveredElement) {
                hoveredElement.classList.add('element-picker-hovered');
            }
            break;
        case 'unhighlight-selected-element':
            if (hoveredElement) {
                hoveredElement.classList.remove('element-picker-hovered');
            }
            break;
        case 'take-screenshot':
            takeScreenshot();
        default:
            break;
    }
});
