import { Icon } from './index.js';
import type { IModalProps } from '../types.js';

type Props = Pick<IModalProps, 'setVisible'> & {
    title: string;
};

export const Header = ({ title, setVisible }: Props) => {
    return (
        <header>
            <h2>{title}</h2>
            <Icon type='close' onClick={setVisible} />
        </header>
    );
};