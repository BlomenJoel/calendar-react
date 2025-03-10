type Props = {
    title: string
    description: string
    color: string | null
}

export function VisualizeGoal({ title, description, color }: Props) {
    return (
        <div className="w-[22.25rem]">
            <div
                style={color ? { backgroundColor: color } : {}}
                className={`relative shadow-md shadow-gray-600 rounded-lg w-80`}>
                <div className={`z-0 absolute -top-7 -right-14`}>
                    <div
                        style={color ? { backgroundColor: color } : {}}
                        className='rotate-90 origin-left text-xs pb-6 p-1 h-14 w-12 rounded-lg'>
                        {title}
                    </div>
                </div>
                <div
                    style={color ? { backgroundColor: color } : {}}
                    className={`relative rounded-lg p-1`}>
                    <h3 className='h-16'> {description}</h3>
                </div>
            </div>
        </div>
    )
}