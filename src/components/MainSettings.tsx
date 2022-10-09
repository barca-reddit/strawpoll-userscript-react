import { useState, useRef } from 'react';
import { Storage } from '../helpers/storage.js';
import { DarkMode } from '../helpers/darkmode.js';

import { Button } from './index.js';
import type { IModalProps } from '../types.js';

type Props = Pick<IModalProps, 'setPage' | 'setSettings'> & {
    initialSettings: IModalProps['settings']
};

const isDarkMode = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const MainSettings = ({ initialSettings, setPage, setSettings }: Props) => {
    const [darkMode, setDarkMode] = useState<IModalProps['settings']['darkMode']>(initialSettings.darkMode ?? isDarkMode());

    const formRef = useRef<HTMLFormElement>(null);
    const strawpollApiKeyRef = useRef<HTMLInputElement>(null);
    const strawpollExpiryRef = useRef<HTMLInputElement>(null);
    const discordWebhookRef = useRef<HTMLInputElement>(null);

    const submitForm = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (formRef.current?.checkValidity()) {
            e.preventDefault();

            const localSettings: IModalProps['settings'] = {
                strawpollKey: strawpollApiKeyRef.current?.value,
                strawpollExpiry: strawpollExpiryRef.current?.valueAsNumber,
                discordWebhook: discordWebhookRef.current?.value,
                darkMode: darkMode
            };

            await Storage.setValues({ items: localSettings });
            setSettings({ items: localSettings });
            setPage({ page: 'poll' });
        }
    };

    const toggleDarkMode = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.currentTarget.checked;
        await DarkMode(checked);
        setDarkMode(checked);
        setSettings({ items: { darkMode: checked } });
    };

    /**
     * use pattern attribute for initial input validation.
     * @see https://stackoverflow.com/a/45929979/3258251
     */
    return (
        <>
            <div id="script-info">
                <img src={GM.info.script.icon} alt="Script logo" />
                <h1>{GM.info.script.name}</h1>
                <h4>
                    <a href="https://github.com/barca-reddit/strawpoll-userscript-react" rel="noreferrer" target="_blank">v.{GM.info.script.version}</a>{` • ${GM.info.platform.browserName} (${GM.info.platform.browserVersion}) • ${GM.info.platform.os} (${GM.info.platform.arch})`}
                </h4>
                <span>{GM.info.script.description}</span>
            </div>
            <form id="form-settings" ref={formRef}>
                <label>
                    <span>Strawpoll API key:</span>
                    <input type="text" ref={strawpollApiKeyRef} defaultValue={initialSettings.strawpollKey ?? ''}
                        autoComplete='off' spellCheck="false" minLength={20} maxLength={40} pattern='.{20,40}' placeholder="Enter your API key here..." required />
                </label>
                <label>
                    <span>Discord Webhook URL:</span>
                    <input type="text" ref={discordWebhookRef} defaultValue={initialSettings.discordWebhook ?? ''}
                        autoComplete='off' spellCheck="false" minLength={20} pattern=".{20,}" placeholder="Enter your Discord webook URL here..." required />
                </label>
                <label>
                    <span>Poll expiry (hours):</span>
                    <input type="number" ref={strawpollExpiryRef} defaultValue={initialSettings.strawpollExpiry ?? 72}
                        min="0" max="168" step="1" autoComplete='off' required />
                </label>
                <label>
                    <span>Dark mode:</span>
                    <input type="checkbox" checked={darkMode} onChange={(e) => toggleDarkMode(e)} />
                </label>
            </form>
            <footer>
                <Button text='Save Settings' onClick={(e) => submitForm(e)} form='form-settings' />
            </footer>
        </>
    );
};