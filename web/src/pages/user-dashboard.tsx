import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../fetch/auth";

export const UserDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/user')
        } else {
            navigate('/signin')
        }
    }, [navigate]);

    return (

        <>
        </>
    )
}
