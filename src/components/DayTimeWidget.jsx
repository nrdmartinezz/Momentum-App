import { useContext, useEffect, useState } from 'react';
import { ClockContext, DATE_FORMATS } from '../context/ClockContext';

const DayTimeWidget = () => {
    const { hour12, dateFormat } = useContext(ClockContext);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showColon, setShowColon] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const blinkTimer = setInterval(() => {
            setShowColon(prevShowColon => !prevShowColon);
        }, 1000);

        return () => clearInterval(blinkTimer);
    }, []);

    const formatDate = (date) => {
        const options = DATE_FORMATS[dateFormat] || DATE_FORMATS.weekday;
        return date.toLocaleDateString('en-US', options);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: hour12 ? 'numeric' : '2-digit',
            minute: '2-digit',
            hour12,
        });
    };

    const timeString = formatTime(currentDate);
    const splitAt = timeString.indexOf(':');
    const hours = splitAt === -1 ? timeString : timeString.slice(0, splitAt);
    const minutes = splitAt === -1 ? '' : timeString.slice(splitAt + 1);

    return (
        <div className='day-time-widget adrianna-bold'>
            <div className='date-text'>{formatDate(currentDate)}</div>
            <div className='time-text'>
                {hours}
                <span style={{ visibility: showColon ? 'visible' : 'hidden' }}>:</span>
                {minutes}
            </div>
        </div>
    );
};

export default DayTimeWidget;