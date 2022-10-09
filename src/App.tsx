import { useState, useEffect, useRef, StrictMode } from 'react';

import { Modal, Toggle } from './components';
import type { IModalProps } from './types.js';

import { playerList } from './data/players.js';
import { postStrawpoll, postDiscordWebhook } from './helpers/fetch.js';

export const App = ({ initialSettings }: { initialSettings: IModalProps['settings'] }) => {
    const [visible, _setVisible] = useState<IModalProps['visible']>(false);
    const [page, _setPage] = useState<IModalProps['page']>('poll');
    const [settings, _setSettings] = useState<IModalProps['settings']>(initialSettings);
    const [players, _setPlayers] = useState<IModalProps['players']>(playerList);
    const [request, _setRequest] = useState<IModalProps['request']>();
    const [poll, _setPoll] = useState<IModalProps['poll']>({ title: '[Poll] - MOTM vs Opponent (H/A)', titleEdited: false });

    const firstRender = useRef(true);

    const setPoll: IModalProps['setPoll'] = ({ items }) => {
        _setPoll((prev) => ({ ...prev, ...items }));
    };

    const setVisible: IModalProps['setVisible'] = () => {
        _setVisible((prev) => !prev);
    };

    const setPage: IModalProps['setPage'] = ({ page }) => {
        _setPage(page);
    };

    const setSettings: IModalProps['setSettings'] = ({ items }) => {
        _setSettings((prev) => ({ ...prev, ...items }));
    };

    const setPlayers: IModalProps['setPlayers'] = ({ id }) => {
        if (typeof id !== 'number') {
            _setPlayers(playerList);
        } else if (Number.isInteger(id)) {
            _setPlayers((prev) => ({
                ...prev,
                byId: {
                    ...prev.byId,
                    [prev.byId[id].id]: { ...prev.byId[id], selected: !prev.byId[id].selected },
                },
                selectedCount: prev.byId[id].selected ? prev.selectedCount - 1 : prev.selectedCount + 1,
            }));
        }
    };

    const setRequest: IModalProps['setRequest'] = async ({ type }) => {
        if (!type) {
            _setRequest(undefined);
        } else {
            try {
                _setRequest({ state: 'fetching' });

                if (type === 'strawpoll') {
                    const res = await postStrawpoll(poll.title, players, settings);

                    if (!res.user) {
                        throw new Error('Error: Invalid API key');
                    }

                    _setRequest({ state: 'complete', payload: res });
                    setPoll({ items: { url: res.url } });
                    setPage({ page: 'results' });
                } else if (type === 'discord') {
                    const res = await postDiscordWebhook(settings.discordWebhook!, poll);
                    _setRequest({ state: 'complete', payload: res });
                }
            } catch (error) {
                if (error instanceof Response) {
                    alert(`Error (${error.status}): ${error.statusText}`);
                    _setRequest({ state: 'error', payload: error });
                }
                if (error instanceof Error) {
                    alert(error.message);
                    _setRequest({ state: 'error', payload: error });
                }
                console.error(error);
            }
        }
    };

    const resetPoll = async () => {
        await setRequest({});
        setPoll({ items: { title: '[Poll] - MOTM vs Opponent (H/A)', titleEdited: false } });
        setPlayers({});
        setPage({ page: 'poll' });
    };

    useEffect(() => {
        if (firstRender.current) {
            if (
                (['strawpollKey', 'strawpollExpiry', 'discordWebhook', 'darkMode'] as (keyof IModalProps['settings'])[]).some(
                    (key) => typeof settings[key] === 'undefined'
                )
            ) {
                setPage({ page: 'settings' });
            }

            firstRender.current = false;
            return;
        }
    }, [settings]);

    return (
        <StrictMode>
            <Modal
                visible={visible}
                page={page}
                players={players}
                settings={settings}
                request={request}
                poll={poll}
                setPlayers={setPlayers}
                setPage={setPage}
                setPoll={setPoll}
                setVisible={setVisible}
                setSettings={setSettings}
                setRequest={setRequest}
                resetPoll={resetPoll}
            />
            <Toggle visible={visible} setVisible={setVisible} />
        </StrictMode>
    );
};
