import type { IContainerProps } from '../types.js';

export const Main = ({ children }: IContainerProps) => {
    return (
        <main>
            {children}
        </main>
    );
};