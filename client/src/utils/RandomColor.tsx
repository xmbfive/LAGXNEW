function RandomColor() { 
    const random = Math.floor(Math.random() * (6 - 1 + 1) + 1);
    switch (random) {
        case 1:
            return 'bg-cyan-700';
        case 2:
            return 'bg-red-700';
        case 3:
            return 'bg-orange-700';
        case 4:
            return 'bg-slate-700';
        case 5:
            return 'bg-lime-700';
        case 6:
            return 'bg-blue-700';
        default:
            return 'bg-blue-700';
    }
}
export default RandomColor;