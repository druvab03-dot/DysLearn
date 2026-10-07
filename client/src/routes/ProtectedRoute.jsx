import {
    useEffect,
    useState
} from "react";

import {
    Navigate
} from "react-router-dom";

import {
    getCurrentParent
} from "../services/authService";


function ProtectedRoute({
    children
}) {

    const [checking, setChecking] =
        useState(true);

    const [authenticated, setAuthenticated] =
        useState(false);


    useEffect(() => {

        const checkAuthentication =
            async () => {

                const token =
                    localStorage.getItem(
                        "token"
                    );


                if (!token) {

                    setAuthenticated(false);
                    setChecking(false);

                    return;

                }


                try {

                    const data =
                        await getCurrentParent();


                    localStorage.setItem(
                        "parent",
                        JSON.stringify(
                            data.parent
                        )
                    );


                    setAuthenticated(true);


                } catch (error) {

                    if (
                        error.response?.status === 401 ||
                        error.response?.status === 403
                    ) {

                        localStorage.removeItem(
                            "token"
                        );

                        localStorage.removeItem(
                            "parent"
                        );

                        localStorage.removeItem(
                            "activeChild"
                        );


                        setAuthenticated(false);

                    } else if (localStorage.getItem("token")) {

                        // Retain authenticated session on temporary network issues
                        setAuthenticated(true);

                    } else {

                        setAuthenticated(false);

                    }

                } finally {

                    setChecking(false);

                }

            };


        checkAuthentication();

    }, []);


    if (checking) {

        return (
            <div>
                Checking authentication...
            </div>
        );

    }


    if (!authenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    return children;

}


export default ProtectedRoute;