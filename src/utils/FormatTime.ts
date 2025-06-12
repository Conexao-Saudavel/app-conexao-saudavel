export const ConvertTimeToReadableFormat = (timeInMillis: number): string => {
    const totalSeconds = Math.floor(timeInMillis / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Create readable format
    const hourText = hours > 0 ? `${hours} h${hours > 1 ? 's' : ''}` : '';
    const minuteText = minutes > 0 ? `${minutes} m` : '';
    const secondText = hours > 0 ? '' : (seconds > 0 ? `${seconds} s` : '');

    // Join the parts together and trim any extra spaces
    return [hourText, minuteText, secondText].filter(Boolean).join(' ').trim() || '0 m';
};

export const FormatTimeForDisplay = (timeInMillis: number): string => {
    const totalSeconds = Math.floor(timeInMillis / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
};

export const GetTimeInMinutes = (timeInMillis: number): number => {
    return Math.floor(timeInMillis / (1000 * 60));
};

export const GetTimeInHours = (timeInMillis: number): number => {
    return Math.floor(timeInMillis / (1000 * 60 * 60));
}; 