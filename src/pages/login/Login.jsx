import { useState } from "react";
import "./Login.css";

function Login({ setIsLoggedIn }) {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="container">
        <div className="backgroundLetters">
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter, index) => (
            <span
                key={index}
                style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
                }}
            >
            {letter}
             </span>
             
             ))}
        </div>

      {!showLogin ? (
        
        
        <div
          className="logoBox"
          onClick={() => setShowLogin(true)}
        >
          <span className="shortText">DL</span>
          <span className="fullText">DysLearn</span>
        </div>

      ) : (
        

        <div className="loginBox">
          
          <h1>DysLearn</h1>
          <p>Helping Children Learn Better</p>

          <input
            type="email"
            placeholder="Enter Email"
          />

          <input
            type="password"
            placeholder="Enter Password"
          />

          <button onClick={() => setIsLoggedIn(true)}>
            Login
          </button>

        </div>

      )}

    </div>
  );
}

export default Login;