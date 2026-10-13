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

                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "parent"
                    );


                    setAuthenticated(false);

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