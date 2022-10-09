import { createRoot } from 'react-dom/client';
import { Storage } from './helpers/storage.js';
import { DarkMode } from './helpers/darkmode.js';
import { App } from './App.js';

const createElement = ({ id }: { id: string }) => {
    const element = document.createElement('div');
    element.setAttribute('id', id);
    element.setAttribute('class', 'user-script');
    return element;
};


/**
 * Firefox: document.body is not present @document-start
 * Chrome: document.body is already present @document-start
 */
const observer = new MutationObserver(async (mutations) => {
    if (document.body) {
        observer.disconnect();
        await init();
        return;
    }
    mutations.forEach(async mutation => {
        if (mutation.addedNodes[0] === document.body) {
            observer.disconnect();
            await init();
        }
    });
});
observer.observe(document.documentElement, { childList: true });

const init = async () => {
    const initialSettings = await Storage.getAll();

    const root = createElement({ id: 'root' });
    const portal = createElement({ id: 'portal' });

    document.body.appendChild(root);
    document.body.appendChild(portal);

    await DarkMode(initialSettings.darkMode);

    createRoot(root).render(<App initialSettings={initialSettings} />);
};