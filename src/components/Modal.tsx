import { createPortal } from 'react-dom';

import { Page, Header, Main, MainPoll, MainResults, MainSettings, Position } from './index.js';
import type { IModalProps } from '../types.js';

export const Modal = ({ visible, page, poll, players, settings, request, setVisible, setPage, setPoll, setPlayers, setSettings, setRequest, resetPoll }: IModalProps) => {
    return createPortal(
        <div className={`modal-wrapper${visible ? ' flex' : ' hidden'}`} onClick={setVisible}>
            <main className="modal" onClick={(e) => e.stopPropagation()}>
                {page === 'settings' && (
                    <Page>
                        <Header title='Script Settings' setVisible={setVisible} />
                        <Main>
                            <MainSettings initialSettings={settings} setSettings={setSettings} setPage={setPage} />
                        </Main>
                    </Page>
                )}
                {page === 'poll' && (
                    <Page>
                        <Header title='Create Match Poll' setVisible={setVisible} />
                        <Main>
                            <MainPoll poll={poll} request={request} setPage={setPage} setRequest={setRequest} selectedCount={players.selectedCount} setPoll={setPoll} >
                                <Position position='Goalkeepers' players={players.byPosition.gk.map(id => players.byId[id])} setPlayers={setPlayers} />
                                <Position position='Defenders' players={players.byPosition.def.map(id => players.byId[id])} setPlayers={setPlayers} />
                                <Position position='Midfielders' players={players.byPosition.mid.map(id => players.byId[id])} setPlayers={setPlayers} />
                                <Position position='Forwards' players={players.byPosition.att.map(id => players.byId[id])} setPlayers={setPlayers} />
                            </MainPoll>
                        </Main>
                    </Page>
                )}
                {page === 'results' && (
                    <Page>
                        <Header title='Poll Results' setVisible={setVisible} />
                        <Main>
                            <MainResults poll={poll} request={request} setRequest={setRequest} resetPoll={resetPoll} />
                        </Main>
                    </Page>
                )}
            </main>
        </div>,
        document.getElementById('portal') as HTMLDivElement
    );
};