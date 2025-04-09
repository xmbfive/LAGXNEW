
import toast from "react-hot-toast";
import { useGetSettingAdminQuery, useUpdateSettingMutation } from "../redux/api/SettingEndpoint";
import { useForm } from "react-hook-form";

const Setting = () => {
    const { data } = useGetSettingAdminQuery(undefined);
    const [TriggerUpdateData] = useUpdateSettingMutation();
    const { register, handleSubmit, reset } = useForm();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const HandleUpdateSetting = (e: any) => {
        toast.promise(
            TriggerUpdateData(e),
            {
                loading: 'loading',
                success: 'success',
                error: 'something went wrong!'
            }
        )
        reset();
    }
    return (
        <div className="min-h-screen">
            <form onSubmit={handleSubmit(HandleUpdateSetting)} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-3 rounded-xl bg-opacity-10 font-poppins">
                <label className="form-control w-full hidden">
                    <div className="label">
                        <span className="label-text">Secrect Code</span>
                    </div>
                    <input type="number" defaultValue={data?.data?.SecretCode} {...register(`SecretCode`)} placeholder="Login Code" className="input input-bordered w-full " />
                </label>

                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Channel Url</span>
                    </div>
                    <input type="url" defaultValue={data?.data?.StatusMedia} {...register(`StatusMedia`)} placeholder="Status Media" className="input input-bordered w-full " />
                </label>

                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Refer Comission</span>
                    </div>
                    <input type="text" className="input input-bordered w-full" defaultValue={data?.data?.ReferComission} {...register(`ReferComission`)} placeholder="Refer Comission" />
                </label>

                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Income Per Refer</span>
                    </div>
                    <input type="text" className="input input-bordered w-full" defaultValue={data?.data?.ReferReward} {...register(`ReferReward`)} placeholder="Refer Rewards" />
                </label>
                <label className="form-control w-full hidden">
                    <div className="label">
                        <span className="label-text">Mining Time in minute</span>
                    </div>
                    <input type="text" className="input input-bordered w-full" defaultValue={data?.data?.Mining_Time} {...register(`Mining_Time`)} placeholder="Mining Time in minute" />
                </label>
                <label className="form-control w-full hidden">
                    <div className="label">
                        <span className="label-text">Mining Rewards</span>
                    </div>
                    <input type="text" className="input input-bordered w-full" defaultValue={data?.data?.Mining_Rewards} {...register(`Mining_Rewards`)} placeholder="Mining Rewards" />
                </label>
                <button className="bg-white text-black p-3 rounded-xl font-poppins font-medium">Update</button>
            </form>
        </div>
    );
};

export default Setting;