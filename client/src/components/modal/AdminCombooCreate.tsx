import { useForm } from "react-hook-form";
import { Combo } from "../../types/Combo.interface";
import { useCreateComboMutation } from "../../redux/api/ComboEndpoint";
import toast from "react-hot-toast";

const AdminCombooCreate = ({ NewCombo, setNewCombo }: { NewCombo: boolean, setNewCombo: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const { register, handleSubmit, reset } = useForm<Combo>();
    const [TriggerCreateCombo] = useCreateComboMutation();


    const HandleNewTask = (e: Combo) => {
        const toastId = toast.loading("Uploading your image...");
        const formData = new FormData();
        formData.append('image', e.image[0]);
        fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`, {
            method: "POST",
            body: formData,
        })
            .then(res => res.json())
            .then(async data => {
                if (data?.success) {
                    try {
                        await TriggerCreateCombo({
                            image: data.data.url,
                            sort: e.sort
                        });

                        toast.success("Task created successfully! 🎉", {
                            id: toastId,
                            duration: 3000,
                        });
                        reset();
                    } catch (error) {
                        toast.error("Failed to create task. Please try again. ❌", {
                            id: toastId,
                            duration: 3000,
                        });
                    }
                } else {
                    toast.error("Image upload failed. Please try again! 🚨", {
                        id: toastId,
                        duration: 3000,
                    });
                }
            })
            .catch(error => {
                console.error("Error uploading image:", error);
                toast.error("Error uploading the image. Check your network and try again! 📶", {
                    id: toastId,
                    duration: 3000,
                });
            });
    };



    return (
        <div>
            <dialog id="my_modal_1" className="modal" open={NewCombo}>
                <div className="modal-box bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10">
                    <form onSubmit={handleSubmit(HandleNewTask)} className="">
                        <h3 className="font-bold text-lg font-tektur">New Combo!</h3>

                        <label className="form-control w-full relative">
                            <div className="label">
                                <span className="label-text font-tektur">Image*</span>
                            </div>
                            <input type="file" required placeholder="image..." {...register("image")} className="file-input file-input-bordered w-full font-tektur" />
                        </label>

                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text font-tektur">Sort: (1,2,3 or no)*</span>
                            </div>
                            <input type="text" required placeholder="sort..." {...register('sort')} className="input input-bordered w-full font-tektur" />
                        </label>

                        <div className="flex justify-between items-center gap-3 mt-3">
                            <button type="submit" className="bg-white text-black font-bold font-tektur p-2 w-full rounded-lg flex-1">Save</button>
                            <button type="button" onClick={() => setNewCombo(false)} className="bg-white text-black font-bold font-tektur p-2 w-full rounded-lg flex-1">Cancel</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default AdminCombooCreate;