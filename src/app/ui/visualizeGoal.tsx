type Props = {
    title: string
    description: string
    color: string
}

export function VisualizeGoal({ title, description, color }: Props) {
    return (
        <div
            style={{ backgroundColor: color }}
            className={`relative shadow-md shadow-gray-600 rounded-lg w-80`}>
            <div className={`z-0 absolute -top-7 -right-14`}>
                <div
                    style={{ backgroundColor: color }}
                    className='rotate-90 origin-left text-xs pb-6 p-1 h-14 w-12 rounded-lg'>
                    {title}
                </div>
            </div>
            <div
                style={{ backgroundColor: color }}
                className={`relative rounded-lg p-1`}>
                <h3 className='h-16'> {description}</h3>
            </div>
        </div>
    )
}