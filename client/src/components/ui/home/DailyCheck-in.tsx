import toast from "react-hot-toast";
import { useDailyCheckingMutation, useDailyCheckingStatusQuery } from "../../../redux/api/ExtraTaskEndpoint";
import { IoIosCheckboxOutline, IoMdClose } from "react-icons/io";
import { useState } from "react";

const DailyChecking = () => {
    const [triggerDailyChecking] = useDailyCheckingMutation();
    const { data: checkingStatus } = useDailyCheckingStatusQuery(undefined);
    let additionalPoints = 0;
    const [open_checkin, close_check_in] = useState(false);

    if (checkingStatus?.age === 1) {
        additionalPoints = 69;
    } else if (checkingStatus?.age === 2) {
        additionalPoints = 150;
    } else if (checkingStatus?.age === 3) {
        additionalPoints = 300;
    } else if (checkingStatus?.age === 4) {
        additionalPoints = 600;
    } else if (checkingStatus?.age === 5) {
        additionalPoints = 800;
    } else if (checkingStatus?.age >= 6) {
        additionalPoints = 1200;
    }


    const days = [
        { day: 1, points: 69 },
        { day: 2, points: 150 },
        { day: 3, points: 300 },
        { day: 4, points: 600 },
        { day: 5, points: 800 },
        { day: 6, points: 1200 },
    ];

    return (
        <div className="relative py-4">
            <dialog id="my_modal_5" open={open_checkin} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box bg-black border-t">
                    <div className="flex justify-center items-center relative">
                        <div className="text-center">
                            <p className="font-poppins text-2xl font-medium text-white">Daily Rewards</p>
                            <p className="font-poppins text-sm font-medium text-white text-opacity-50">
                                +{additionalPoints} {import.meta.env.VITE_SYMBOL}
                            </p>
                        </div>
                        <div className="absolute right-0" onClick={() => close_check_in(false)}>
                            <IoMdClose className="text-3xl text-black bg-white p-1 rounded-full bg-opacity-50" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-5">
                        {days.map((item) => (
                            <div
                                key={item.day}
                                className={`p-4 rounded-md cursor-pointer ${additionalPoints === item.points ? "bg-white text-black" : "bg-black text-white"
                                    }`}
                            >
                                <p className="font-poppins font-bold text-xl">Day {item.day}</p>
                                <p className="font-poppins text-opacity-90 text-sm">
                                    +{item.points.toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            toast.promise(
                                triggerDailyChecking(undefined),
                                {
                                    loading: 'loading',
                                    success: 'success',
                                    error: 'something went wrong!'
                                }
                            );
                            close_check_in(false);
                        }}
                        className="font-poppins mt-5 text-black bg-white p-3 w-full rounded-lg text-xl font-bold">Get ${import.meta.env.VITE_SYMBOL}</button>
                </div>
            </dialog>

            <div className="flex items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                    <IoIosCheckboxOutline className="text-3xl text-white" />

                    <div className="">
                        <p className="font-ubuntu text-sm text-white capitalize font-medium">Daily check-in</p>
                        <p className="font-ubuntu text-xs text-white capitalize text-opacity-60">+{additionalPoints} {import.meta.env.VITE_SYMBOL}</p>
                    </div>
                </div>

                <div className="">
                    {
                        checkingStatus?.hasClaimed === true ?
                            <div className="px-5 py-1 w-fit bg-white font-poppins rounded-full bg-opacity-20 text-white text-opacity-50">Claimed</div> :
                            <div className="px-5 cursor-pointer py-1 w-fit bg-white text-black font-poppins rounded-full" onClick={() => close_check_in(true)}>Check-in</div>
                    }
                </div>
            </div>
            <div className="absolute bottom-0 w-[80vw] h-[1px] bg-[#EDFD5D80] bg-opacity-50 right-0"></div>
        </div>
    );
};

export default DailyChecking;