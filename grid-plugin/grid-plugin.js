const DEFAULT_COLUMNS = 3;

// Create the image grid layout
function createImageGrid(images, columns = DEFAULT_COLUMNS) {
    const gridContainer = document.createElement('div');
    gridContainer.className = 'img-grid';

    images.forEach(img => {
        const wrapper = document.createElement('div');
        wrapper.className = 'img-grid-item';

        const parentAnchor = img.closest('a');
        const imgClone = img.cloneNode(true);
        imgClone.style.cssText = 'width: 100%; height: auto;';

        if (parentAnchor) {
            const anchorClone = parentAnchor.cloneNode(false);
            anchorClone.appendChild(imgClone);
            wrapper.appendChild(anchorClone);
        } else {
            wrapper.appendChild(imgClone);
        }

        gridContainer.appendChild(wrapper);
    });

    return gridContainer;
}

// Create the link grid layout
function createLinkGrid(links) {
    const gridContainer = document.createElement('div');
    gridContainer.className = 'list-link-grid';

    links.forEach(link => {
        const href = link.getAttribute('href');
        const wrapper = document.createElement('a');
        wrapper.className = 'list-link-item';
        wrapper.href = href;

        const div = document.createElement('div');
        const raw = link.innerHTML;
        const lines = raw.split(/<br\s*\/?>/i).map(line => line.trim()).filter(Boolean);

        lines.forEach(text => {
            const p = document.createElement('p');
            p.innerHTML = text;
            div.appendChild(p);
        });

        wrapper.appendChild(div);
        gridContainer.appendChild(wrapper);
    });

    return gridContainer;
}

// Process the lists to convert them into grids (both image and link grids)
function processImageAndLinkLists(content) {
    const container = document.createElement('div');
    container.innerHTML = content;

    const lists = Array.from(container.getElementsByTagName('ul'));

    lists.forEach(list => {
        const allImages = list.querySelectorAll('img');
        const allLinks = list.querySelectorAll('a');

        // Check if the list contains images and transform to grid
        if (allImages.length >= 1) {
            const columns = list.getAttribute('data-columns') || DEFAULT_COLUMNS;
            const grid = createImageGrid(Array.from(allImages), parseInt(columns));
            list.parentNode.replaceChild(grid, list);
        }
        // Check if the list contains links and transform to grid
        else if (allLinks.length >= 1 && allImages.length === 0) {
            const grid = createLinkGrid(Array.from(allLinks));
            list.parentNode.replaceChild(grid, list);
        }
    });

    return container.innerHTML;
}

// Export as a default function plugin
export default function gridPlugin(hook) {
    hook.afterEach((html, next) => {
        const processedHtml = processImageAndLinkLists(html);
        next(processedHtml);
    });
}
