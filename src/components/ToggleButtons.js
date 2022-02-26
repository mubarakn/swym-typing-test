const ToggleButtons = ({containerClass, activeClass, borderColorClass, keys, values, value, onChange}) => {

    return (
        <div className={`flex items-center w-fit border ${borderColorClass} ${containerClass}`}>
            {keys.map((v, i) => {
                let aClass = values[i] === value ? activeClass : ''
                return (
                    <span
                        key={`${v}-${i}`}
                        className={`cursor-pointer px-2 py-1 ${aClass} ${i < values.length-1 ? `border-r ${borderColorClass}` : ''}`}
                        onClick={() => typeof onChange === 'function' && onChange(values[i])}
                        >
                        {v}
                    </span>
                )
            })}
        </div>
    )
}

export default ToggleButtons