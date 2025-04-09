import { Outlet } from "react-router-dom";
import BottomNavigation from "../shared/BottomNavigation";
import WebApp from "@twa-dev/sdk";
import logo from "../../assets/icon.svg";

// import { Helmet } from "react-helmet";

const MainLayout = () => {
    return (
        <div className="bg-black">
            {
                WebApp.platform === "android" || WebApp.platform === "android_x" || WebApp.platform === "ios" ?
                    <>
                        <div className="bg-black relative min-h-screen pb-[86px]">
                            <Outlet />
                        </div>
                        <div className="h-[86px] fixed">
                            <BottomNavigation />
                        </div>
                    </> :
                    <>
                        {
                            import.meta.env.DEV === true ?
                                <>
                                    <div className="bg-black relative min-h-screen pb-[86px]">
                                        <Outlet />
                                    </div>
                                    <div className="h-[86px] fixed">
                                        <BottomNavigation />
                                    </div>
                                </> :
                                <div className="min-h-screen flex justify-center items-center flex-col gap-3 p-3">
                                    <img src={logo} alt="logo" className="size-60 mx-auto" />
                                    <p className="font-montserrat text-center font-medium text-white">Woo! This app is designed for mobile devices. Please switch to a mobile device to access the app!</p>
                                </div>
                        }
                    </>
            }
        </div>
    );
};

export default MainLayout;