import type { IModalProps } from '../types.js';

type Props = Pick<IModalProps, 'visible' | 'setVisible'>;

export const Toggle = ({ visible, setVisible }: Props) => {
    return (
        <div className={`modal-toggle ${visible ? 'hidden' : 'flex'}`} onClick={setVisible}>
            Create Match Poll
        </div>
    );
}; 