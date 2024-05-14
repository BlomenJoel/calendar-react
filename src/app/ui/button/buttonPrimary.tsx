type Props = {
    title: string
    onClick: () => void
}

export function ButtonPrimary({ title, onClick }: Props) {
    return (
        <button className="border border-black px-4 py-1 text-sm rounded-md" onClick={onClick}>
            {title}
        </button>
    )
}