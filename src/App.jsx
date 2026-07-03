import { useState } from "react";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>

      {!isLoggedIn ? (
        <Login setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <Dashboard />
      )}

    </div>
  );
}

export default App;