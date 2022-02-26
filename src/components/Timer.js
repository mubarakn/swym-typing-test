import { forwardRef, useRef, useImperativeHandle, useEffect, useState } from 'react'

const Timer = forwardRef(({ seconds, onExpired }, ref) => {
    const timerId = useRef(null)
    const [remainingSeconds, setRemainingSeconds] = useState(0)
    const [started, toggleStarted] = useState(false)

    useEffect(() => {
        setRemainingSeconds(seconds)
    }, [seconds])

    useEffect(() => {
        if (remainingSeconds <= 0) {
            toggleStarted(false)
        }

        if (started) {
            timerId.current = setTimeout(() => {
                setRemainingSeconds(remainingSeconds-1)
            }, 1000);
        }
        else {
            if (seconds !== remainingSeconds) {
                if (typeof onExpired === 'function') {
                    onExpired(seconds - remainingSeconds)
                }
            }
            clearTimeout(timerId)
            
        }
        return () => clearTimeout(timerId)
    }, [started, remainingSeconds])

    useImperativeHandle(ref, () => ({
        start() {
            toggleStarted(true)
        },
        stop() {
            toggleStarted(false)
        },
        isRunning: started
    }), )

    const d = Number(remainingSeconds);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return (
        <div className='text-2xl'>
            {`${h > 0 ? `${h < 10 ? '0' : ''}${h}:`: '' }${`${m < 10 ? '0' : ''}${m}:`}${`${s < 10 ? '0' : ''}${s}`}`}
        </div>
    )
})

export default Timer