const ShowBalance = ({ amount }: { amount: string }) => {
    return (
        <div className="bg-white px-4 py-1 w-fit rounded-full bg-opacity-10 text-white">
            <p className="font-tektur">
                {Number(amount).toFixed(2)} <span className="font-ubuntu">{import.meta.env.VITE_SYMBOL}</span>
            </p>
        </div>
    );
};

export default ShowBalance;