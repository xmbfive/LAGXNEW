import { useEffect, useState, FC } from "react";
import AdminCombooCreate from "../components/modal/AdminCombooCreate";
import {
    useAllComboListForAdminQuery,
    useDeleteComboMutation,
    useDeleteComboTrackingMutation,
} from "../redux/api/ComboEndpoint";
import { Combo } from "../types/Combo.interface";
import toast from "react-hot-toast";

const ComboManagement: FC = () => {
    const [isNewComboModalOpen, setIsNewComboModalOpen] = useState(false);

    const { data: comboData } = useAllComboListForAdminQuery(undefined);
    const [deleteCombo, { status: deleteComboStatus, error: deleteComboError }] = useDeleteComboMutation();
    const [
        resetTracking,
        { status: resetTrackingStatus, error: resetTrackingError },
    ] = useDeleteComboTrackingMutation();

    useEffect(() => {
        if (deleteComboStatus === "fulfilled") {
            toast.success("Combo Deleted Successfully!");
        } else if (deleteComboStatus === "rejected") {
            handleError(deleteComboError, "Combo not deleted. Try again!");
        }
    }, [deleteComboStatus, deleteComboError]);

    useEffect(() => {
        if (resetTrackingStatus === "fulfilled") {
            toast.success("Reset Successfully!");
        } else if (resetTrackingStatus === "rejected") {
            handleError(resetTrackingError, "Reset not successful. Try again!");
        }
    }, [resetTrackingStatus, resetTrackingError]);

    const handleError = (error: unknown, fallbackMessage: string) => {
        let errorMessage = fallbackMessage;
    
        if (typeof error === "object" && error !== null && "data" in error) {
            const errorData = error as { data?: { errorMessage?: string } };
            if (errorData.data?.errorMessage) {
                errorMessage = errorData.data.errorMessage;
            }
        }
    
        toast.error(errorMessage);
    };
    

    return (
        <div>
            <AdminCombooCreate NewCombo={isNewComboModalOpen} setNewCombo={setIsNewComboModalOpen} />

            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => setIsNewComboModalOpen(true)}
                    className="bg-white px-3 py-2 bg-opacity-10 rounded-xl font-ubuntu font-medium text-white"
                >
                    New Combo
                </button>
                <button
                    onClick={() => resetTracking(undefined)}
                    className="bg-white px-3 py-2 bg-opacity-10 rounded-xl font-ubuntu font-medium text-white"
                >
                    Reset
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Index</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comboData?.data?.map((combo: Combo) => (
                            <tr key={combo._id}>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle h-12 w-12">
                                                <img
                                                    src={combo.image}
                                                    alt={`Combo ${combo.index}`}
                                                    className="rounded-xl"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold truncate max-w-xs">{combo.image}</div>
                                            <div className="text-sm opacity-50">SORT: {combo.sort}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{combo.index}</td>
                                <td>
                                    <button
                                        className="btn btn-ghost btn-xs"
                                        onClick={() => deleteCombo({ _id: combo._id })}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComboManagement;
