import { Storage } from './storage.js';

export const DarkMode = async (darkMode?: boolean) => {
    if (typeof darkMode === 'undefined') {
        darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    darkMode
        ? (document.getElementById('portal') as HTMLDivElement).classList.add('modal-dark')
        : (document.getElementById('portal') as HTMLDivElement).classList.remove('modal-dark');

    await Storage.setValues({ items: { darkMode: darkMode } });
};