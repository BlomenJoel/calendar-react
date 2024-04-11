type Props = {
    title: string
    onClick: () => void
}

export function ButtonPrimary({ title, onClick }: Props) {
    return (
        <button onClick={onClick}>
            {title}
        </button>
    )
}