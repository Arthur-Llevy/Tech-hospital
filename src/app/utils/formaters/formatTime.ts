const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(":");
    const formatedTime = `${hours}:${minutes}`;
    
    return formatedTime;
}

export { formatTime };