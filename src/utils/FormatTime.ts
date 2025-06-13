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

// Nova função para formatar tempo em segundos para exibição "Xh Ymin"
export const FormatSecondsToHoursMinutes = (seconds: number): string => {
    if (seconds < 0) return '0h 0min';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}min`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}min`;
};

// Nova função para formatar tempo em minutos para exibição "Xh Ymin"
export const FormatMinutesToHoursMinutes = (minutes: number): string => {
    if (minutes < 0) return '0h 0min';
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0 && remainingMinutes > 0) return `${hours}h ${remainingMinutes}min`;
    if (hours > 0) return `${hours}h`;
    return `${remainingMinutes}min`;
};

// Função para converter minutos para segundos
export const MinutesToSeconds = (minutes: number): number => {
    return minutes * 60;
};

// Função para converter segundos para minutos
export const SecondsToMinutes = (seconds: number): number => {
    return Math.floor(seconds / 60);
};

// Função para validar e normalizar tempo (sempre retorna segundos)
export const NormalizeTimeToSeconds = (value: number, unit: 'seconds' | 'minutes' | 'hours'): number => {
    switch (unit) {
        case 'seconds':
            return Math.max(0, value);
        case 'minutes':
            return Math.max(0, value * 60);
        case 'hours':
            return Math.max(0, value * 3600);
        default:
            return Math.max(0, value);
    }
};

// Função para formatar tempo de uso diário (otimizada para dashboard)
export const FormatDailyUsage = (seconds: number): string => {
    if (seconds < 0) return '0h 0min';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    // Para uso diário, sempre mostrar horas mesmo que seja 0
    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}min`;
    if (hours > 0) return `${hours}h`;
    return `0h ${minutes}min`;
}; 