import { useRef } from 'react';
import { Button } from './index.js';
import type { IModalProps, IContainerProps, IPlayer } from '../types.js';

type PlayerProps = Pick<IModalProps, 'setPlayers'> & {
    player: IPlayer;
}

const Player = ({ player, setPlayers }: PlayerProps) => {
    const onClick = (id: IPlayer['number']) => {
        setPlayers({ id: id });
    };

    return (
        <div className={`player ${player.selected ? 'selected' : ''}`} onClick={() => onClick(player.id)}>
            <span className='number'>{player.number}</span>
            <img src={player.photo} alt={player.name} />
            <span className='name'>{player.name}</span>
        </div>
    );
};

type PositionProps = Pick<IModalProps, 'setPlayers'> & {
    position: string;
    players: IPlayer[];
}

export const Position = ({ position, players, setPlayers }: PositionProps) => {
    return (
        <section>
            <h3>{position}</h3>
            <div className='players'>
                {players.map(player => (
                    <Player key={player.number} player={player} setPlayers={setPlayers}></Player>
                ))}
            </div>
        </section>
    );
};

type Props = Pick<IModalProps, 'poll' | 'request' | 'setPage' | 'setPoll' | 'setRequest'> & IContainerProps & {
    selectedCount: number
}

interface CustomInput extends HTMLInputElement {
    dataset: {
        edited: string;
    }
}

export const MainPoll = ({ children, poll, request, selectedCount, setPage, setPoll, setRequest }: Props) => {
    const titleRef = useRef<CustomInput>(null);

    const submitForm = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (titleRef.current?.dataset.edited !== 'true') {
            titleRef.current?.setCustomValidity('Please edit the poll title.');
            titleRef.current?.reportValidity();
        }
        else {
            setPoll({ items: { title: titleRef.current.value } });
            await setRequest({ type: 'strawpoll' });
        }
    };

    const setEdited = () => {
        if (titleRef.current?.dataset?.edited) {
            titleRef.current.dataset.edited = 'true';
            titleRef.current.setCustomValidity('');
        }
    };

    return (
        <>
            <div className='player-list'>
                {children}
            </div>
            <footer>
                <form id="form-poll">
                    <input ref={titleRef} className='big' type="text" defaultValue={poll.title} data-edited="false" onInput={setEdited} required />
                    <Button
                        text='Create Poll'
                        disabled={selectedCount < 11 ? true : false}
                        onClick={submitForm}
                        {...request?.state === 'fetching' && { loading: true }}
                    />
                    <Button text='Settings' onClick={() => setPage({ page: 'settings' })} />
                </form>
            </footer>
        </>
    );
};