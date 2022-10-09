import { useState } from 'react';
import { Button, Icon } from './index.js';
import type { IModalProps } from '../types.js';

type Props = Pick<IModalProps, 'poll' | 'request' | 'setRequest' | 'resetPoll'>;
type StateProps = { poll: boolean, clipboard: boolean; reddit: boolean; discord: boolean; };

export const MainResults = ({ poll, request, setRequest, resetPoll }: Props) => {
    const [visited, setVisited] = useState<StateProps>({ poll: false, clipboard: false, discord: false, reddit: false });

    const copyToClipboard = async () => {
        poll.url && await navigator.clipboard.writeText(poll.url);
        setVisited(prev => ({ ...prev, clipboard: true }));
        setTimeout(() => { setVisited(prev => ({ ...prev, clipboard: false })); }, 2000);
    };

    const submitOnDiscord = async () => {
        if (visited.discord) {
            return;
        }

        await setRequest({ type: 'discord' });
        setVisited(prev => ({ ...prev, discord: true }));
    };

    const openExternal = (type: 'poll' | 'reddit') => {
        if (type === 'poll') {
            window.open(poll.url, '_blank', 'noreferrer');
        }

        else if (type === 'reddit') {
            window.open(`https://www.reddit.com/r/Barca/submit?title=${poll.title}&url=${poll.url}`, '_blank', 'noreferrer');
            setVisited(prev => ({ ...prev, reddit: true }));
        }
    };

    return (
        <>
            <div id='area-results'>
                <label>
                    <span>Poll URL:</span>
                    <input type="text" value={poll.url} readOnly />
                </label>
                <ul className='icon-list'>
                    <li data-text="Visit poll">
                        <Icon type={visited.poll ? 'check' : 'link'} onClick={() => openExternal('poll')}></Icon>
                    </li>
                    <li data-text="Copy to clipboard">
                        <Icon type={visited.clipboard ? 'check' : 'clipboard'} onClick={copyToClipboard}></Icon>
                    </li>
                    <li data-text="Post on Reddit">
                        <Icon type={visited.reddit ? 'check' : 'reddit'} onClick={() => openExternal('reddit')}></Icon>
                    </li>
                    <li data-text="Post on Discord">
                        {request?.state === 'fetching'
                            ? <Icon type="loading"></Icon>
                            : <Icon type={visited.discord ? 'check' : 'discord'} onClick={visited.discord ? () => void (0) : submitOnDiscord}></Icon>
                        }
                    </li>
                </ul>
            </div>
            <footer>
                <Button text='Create another poll' onClick={resetPoll} />
            </footer>
        </>
    );
};