import { useEffect, useState } from "react";
import RandomColor from "../utils/RandomColor";
import toast from "react-hot-toast";
import { useAllComboListForUserQuery, useMatchComboMutation } from "../redux/api/ComboEndpoint";
import { Combo } from "../types/Combo.interface";

type Image = {
    url: string;
};

const Comboo = () => {
    const [imageList, setImageList] = useState<Image[]>([]);
    const { data: comboListData, isLoading: isComboListLoading } = useAllComboListForUserQuery(undefined);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let error: any = "";
    const [TriggerCombo, { data: comboResponse, isLoading: isMatching, status, error: err }] = useMatchComboMutation();
    error = err;
    const handleImageClick = (url: string) => {
        if (imageList.some((item) => item.url === url)) {
            toast.error("You have already picked this image!");
            return;
        }

        if (imageList.length < 3) {
            setImageList((prev) => [...prev, { url }]);
        } else {
            toast.error("You have already picked 3 pictures!");
        }
    };

    const handleMatchCombo = () => {
        if (imageList.length < 3) {
            toast.error("Please select at least 3 pictures before proceeding.");
            return;
        }

        TriggerCombo({ combo: imageList });
    };

    useEffect(() => {
        if (status === "fulfilled" && comboResponse?.data?.success) {
            toast.success("You successfully completed the task and earned 500 points");
        } else if (status === "rejected") {
            toast.error(error?.data?.errorMessage || "Combo did not match. Try again!");
        }
    }, [status]);

    if (isComboListLoading || isMatching) {
        return (
            <div className="p-3 bg-black h-screen w-full flex justify-center items-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="p-3">
            <div className="flex justify-center items-center flex-col my-5">
                <p className="font-poppins text-2xl text-white font-medium">Daily combo</p>
                <p className="font-poppins text-sm text-white font-normal">Find the currect combination </p>
            </div>
            <div className="grid grid-cols-3 gap-3 bg-white bg-opacity-40 rounded-lg p-2 justify-center items-center">
                {imageList.map((item, i) => (
                    <div
                        key={`image-${i}`}
                        className={`${RandomColor()} size-24 p-1 mx-auto rounded-xl flex justify-center items-center shadow-sm shadow-white`}
                    >
                        <img src={item.url} alt={`Selected Image ${i + 1}`} className="rounded-2xl" />
                    </div>
                ))}
                {Array.from({ length: Math.max(0, 3 - imageList.length) }).map((_, i) => (
                    <div
                        key={`placeholder-${i}`}
                        className={`${RandomColor()} p-1 size-24 mx-auto rounded-xl flex justify-center items-center shadow-sm shadow-white`}
                    ></div>
                ))}
            </div>

            <div className="grid grid-cols-3 w-full justify-center gap-2 items-center mt-10">
                {comboListData?.data?.map((item: Combo, i: number) => (
                    <div
                        key={`combo-${i}`}
                        onClick={() => handleImageClick(item.image)}
                        className={`${RandomColor()} mx-auto p-1 size-24 object-cover rounded-xl flex justify-center items-center shadow-sm shadow-white cursor-pointer`}
                    >
                        <img src={item.image} alt={`Combo Image ${i + 1}`} className="rounded-2xl" />
                    </div>
                ))}
            </div>

            <div className="my-5">
                <p className="font-poppins font-normal text-white">Please select the correct combination</p>
                <button
                    onClick={handleMatchCombo}
                    className="w-full p-3 cursor-pointer bg-white bg-opacity-20 text-white font-ubuntu font-medium text-xl my-3 flex justify-center items-center rounded-xl"
                    disabled={isMatching}
                >
                    {isMatching ? "Checking..." : "Check"}
                </button>
            </div>
        </div>
    );
};

export default Comboo;
