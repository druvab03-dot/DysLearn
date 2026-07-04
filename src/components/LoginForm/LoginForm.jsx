import "./LoginForm.css";

import Input from "../Input/Input";
import Button from "../Button/Button";

function LoginForm() {
  return (
    <div className="loginForm">

      <Input
        label="Email or Phone Number"
        placeholder="Enter your email or phone number"
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
      />

      <button className="otpButton">
        Login with OTP instead
      </button>

      <Button>
        Login
      </Button>

      <div className="loginFooter">

        <label>

          <input type="checkbox"/>

          Remember Me

        </label>

        <button className="textButton">

          Forgot Password?

        </button>

      </div>

    </div>
  );
}

export default LoginForm;