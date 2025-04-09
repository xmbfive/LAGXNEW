import React, { useEffect } from "react";
import { useLoginBySceretMutation } from "../redux/api/SettingEndpoint";
import { useNavigate } from "react-router-dom";

const AdminProtector = ({ children }: { children: React.ReactNode }) => {
    const [TriggerSecret, { data, status, isLoading }] = useLoginBySceretMutation();
    const secret = sessionStorage.getItem("secret");
    const naviagte = useNavigate();

    useEffect(() => {
        if (secret) {
            TriggerSecret(secret);
        } else {
            naviagte("/auth/0/admin/login");
        }
    }, [secret, TriggerSecret, naviagte]);

    useEffect(() => {
        switch (status) {
            case "fulfilled":
                if (data?.data?.ping === false) {
                    naviagte("/auth/0/admin/login");
                }
                break;

            case "rejected":
                naviagte("/auth/0/admin/login");
                break;
        }
    }, [data?.data?.ping, naviagte, status]);

    return (
        <div className="min-h-screen relative">
            {
                isLoading &&
                <div className="min-h-screen absolute z-50 bg-black/10 backdrop-blur-sm w-full flex justify-center items-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            }
            {children}
        </div>
    );
}
export default AdminProtector;
