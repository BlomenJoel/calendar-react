type Props = {
    title: string
    onClick: () => void
    disabled?: boolean
}

export function ButtonPrimary({ title, onClick, disabled }: Props) {
    return (
        <button className="border border-black px-4 py-1 text-sm rounded-md disabled:bg-gray-500 bg-white text-gray-900 disabled:text-gray-700" onClick={onClick} disabled={disabled}>
            {title}
        </button>
    )
}