export const getInitial = (name) => {
    if(!name) return '';

    const initial = name[0].toUpperCase();
    return initial
}