import { ITask } from "../admin/TaskManagement";
import NormalTaskCard from "../components/shared/NormalTaskCard";
import { useGetIncompleteTaskListQuery } from "../redux/api/TaskEndpoint";
import { Link } from "react-router-dom";
import { usePointTableQuery } from "../redux/api/UserEndpoint";
import BalanceCard from "../components/ui/home/BalanceCard";
import TaskSkelaton from "../components/ui/home/TaskSkelaton";
import DailyChecking from "../components/ui/home/DailyCheck-in";


const Home = () => {
    const { data, isLoading } = useGetIncompleteTaskListQuery(undefined);
    const { data: pointData } = usePointTableQuery(undefined);

    return (
        <div className="min-h-screen relative p-3">
            <div className="relative h-14 bg-[#BA0C0C] rounded-xl hidden">
                <img src="https://doghousesclonev01.vercel.app/scorebg.svg" alt="blurb" className="w-full h-full absolute z-0 object-cover" />
                <div className="flex justify-center items-center gap-1 text-white font-poppins z-10 relative h-full text-xl font-medium">
                    {import.meta.env.VITE_PROJECT_NAME}
                </div>
            </div>

            <div className="bg-white bg-opacity-10 p-5 rounded-xl my-3 relative overflow-hidden">
                <div className="bg-[#7F6244] h-24 -top-10 blur-3xl absolute z-0 w-full"></div>
                <div className="relative z-10">
                    <BalanceCard point={pointData?.data?.points?.point ? pointData?.data?.points?.point : 0} />
                </div>

                <Link to={'/wallet-connect'} className="bg-[#7F6244] text-black px-5 py-2 rounded-2xl gap-1 font-medium flex justify-center items-center font-poppins">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M14.1839 17.7069C13.6405 18.6507 13.3688 19.1226 13.0591 19.348C12.4278 19.8074 11.5723 19.8074 10.941 19.348C10.6312 19.1226 10.3595 18.6507 9.81613 17.7069L5.52066 10.2464C4.76864 8.94024 4.39263 8.28717 4.33762 7.75894C4.2255 6.68236 4.81894 5.65591 5.80788 5.21589C6.29309 5 7.04667 5 8.55383 5H15.4462C16.9534 5 17.7069 5 18.1922 5.21589C19.1811 5.65591 19.7745 6.68236 19.6624 7.75894C19.6074 8.28717 19.2314 8.94024 18.4794 10.2464L14.1839 17.7069ZM11.1 16.3412L6.56139 8.48002C6.31995 8.06185 6.19924 7.85276 6.18146 7.68365C6.14523 7.33896 6.33507 7.01015 6.65169 6.86919C6.80703 6.80002 7.04847 6.80002 7.53133 6.80002H7.53134L11.1 6.80002V16.3412ZM12.9 16.3412L17.4387 8.48002C17.6801 8.06185 17.8008 7.85276 17.8186 7.68365C17.8548 7.33896 17.665 7.01015 17.3484 6.86919C17.193 6.80002 16.9516 6.80002 16.4687 6.80002L12.9 6.80002V16.3412Z" fill="#000"></path></svg>
                    Withdraw to wallet
                </Link>
            </div>

            <div className="carousel rounded-box w-full h-fit hidden">
                <div className="carousel-item w-64 mr-4 relative">
                    <div className="bg-white w-full bg-opacity-10 p-3 rounded-xl relative">
                        <p className="uppercase font-poppins font-medium text-xl text-white">Follow {import.meta.env.VITE_PROJECT_NAME}</p>
                        <p className="capitalize font-poppins text-sm text-white text-opacity-80">Follow {import.meta.env.VITE_PROJECT_NAME} on X(Twitter)</p>
                        <div className="my-2 bottom-3 absolute">
                            <Link to={'https://x.com/AlphaStar_Tg'} className="px-5 py-1 w-fit bg-white font-poppins rounded-full text-black ">Follow</Link>
                        </div>
                    </div>
                </div>
                <div className="carousel-item w-64 ">
                    <div className="bg-white bg-opacity-10 p-3 rounded-xl">
                        <p className="uppercase font-poppins font-medium text-xl text-white">Subscribe Telegram</p>
                        <p className="capitalize font-poppins font-medium text-sm text-white text-opacity-80">Join {import.meta.env.VITE_PROJECT_NAME} community channel</p>
                        <div className="my-2">
                            <Link className="px-5 py-1 bg-white text-black font-poppins rounded-full" to={import.meta.env.VITE_PROJECT_COMMUNITY}>Join</Link>
                        </div>
                    </div>
                </div>
            </div>
            <p className="mt-5 font-poppins text-xl text-white">Complete Tasks & Earn </p>
            <DailyChecking/>
            {
                isLoading ?
                    <div className="flex flex-col gap-3">
                        <TaskSkelaton />
                        <TaskSkelaton />
                    </div> :
                    data?.data?.length > 0 &&
                    data?.data?.map((item: ITask, index: number) => (
                        <NormalTaskCard item={item} key={index} />
                    ))

            }
        </div>
    );
};

export default Home;