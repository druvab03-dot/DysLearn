import { useState } from "react";

import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {

    const [page,setPage] = useState("landing");

    return(

        <>

            {

                page==="landing" &&

                <Landing
                    setShowLogin={() => setPage("login")}
                />

            }

            {

                page==="login" &&

                <Login/>

            }

            {

                page==="dashboard" &&

                <Dashboard/>

            }

        </>

    )

}

export default App;