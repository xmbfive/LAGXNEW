import icon from "../../../assets/icon.svg";

const BalanceCard = ({ point }: { point: string }) => {
    return (
        <div>
            <div className="h-40 relative overflow-hidden">
                <img src={icon} alt="stars" className="w-60 mx-auto" />
            </div>
            <p className="text-4xl font-poppins font-bold text-white text-center my-3">{Number(point).toFixed(2)}</p>
        </div>
    );
};

export default BalanceCard;