type Props = {
    label: string
    value: boolean
    setValue: (event: boolean) => void
}

export function CheckboxInput({ label, value, setValue }: Props) {
    return (
        <>
            <label className="text-black bg-black h-12 w-12" htmlFor={label}>{label}: </label>
            <input id={label} type="checkbox" className={`text-black`}
                name={label}
                checked={value}
                onChange={
                    (e) => {
                        setValue(e.target.checked)
                    }
                } />
        </>
    )
}