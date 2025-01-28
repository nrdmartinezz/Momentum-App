import { useEffect, useState } from 'react';

const DayTimeWidget = () => {
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
        const options = { month: 'short', day: 'numeric', weekday: 'long' };
        return date.toLocaleDateString('en-US', options);
    };

    const formatTime = (date) => {
        const options = { hour: 'numeric', minute: 'numeric', hour12: true };
        return date.toLocaleTimeString('en-US', options);
    };

    const timeString = formatTime(currentDate);
    const [hours, minutes] = timeString.split(':');

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