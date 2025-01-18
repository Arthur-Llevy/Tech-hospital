const formatDateTimeWithSlashes = (dateString: string): string => {
    const [year, month, day] = dateString.split("-");
    const formatedBirthDate = `${day}/${month}/${year}`;
    
    return formatedBirthDate;
}

export { formatDateTimeWithSlashes };