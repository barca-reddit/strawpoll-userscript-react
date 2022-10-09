type Props = {
    text: string;
    form?: string;
    loading?: boolean;
    disabled?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any
}

export const Button = ({ text, form, loading, disabled, onClick }: Props) => {
    if (loading) {
        return (
            <button className="button loading" disabled>
                {text && (<span>{text}</span>)}
            </button>
        );
    }
    return (
        <button className="button" disabled={disabled ? true : false} {...(form && { form: form })} {...(onClick && { onClick })}>
            {text && (<span>{text}</span>)}
        </button>
    );
};