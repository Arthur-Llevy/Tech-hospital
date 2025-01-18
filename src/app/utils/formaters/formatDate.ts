const formatDateTimeWithSlashes = (dateString: string): string => {
    const [year, month, day] = dateString.split("-");
    const formatedBirthDate = `${day}/${month}/${year}`;
    
    return formatedBirthDate;
}

const formatDateToString = (day: number, month: number, year: number): string => {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    return `${day} de ${months[month]} de ${year}`
}

export { formatDateTimeWithSlashes, formatDateToString };