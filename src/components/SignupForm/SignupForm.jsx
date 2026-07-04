import "./SignupForm.css";

import { useState } from "react";
import ChildForm from "../ChildForm/ChildForm";

import Input from "../Input/Input";
import Button from "../Button/Button";
import VerificationInput from "../VerificationInput/VerificationInput";

function SignupForm() {
  const [children, setChildren] = useState([]);

  const addChild = () => {

    setChildren([...children, {}]);

  };

  return (
    <div className="signupForm">

      {/* Header */}

      <div className="signupHeader">

        <div>

          <h2>Create Account</h2>

          <p>Parent</p>

        </div>

        <div className="profileUpload">

          <div className="profileCircle">

            Add Photo

          </div>

        </div>

      </div>

      {/* Parent Details */}

      <Input
        label="Full Name"
        placeholder="Enter your full name"
      />

      <VerificationInput
        label="Email"
        type="email"
        placeholder="Enter your email"
      />

      <VerificationInput
        label="Phone Number"
        type="tel"
        placeholder="Enter your phone number"
      />

      <Input
        label="Password"
        type="password"
        placeholder="Create password"
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm password"
      />

{
    children.map((child, index) => (
        <ChildForm
            key={index}
            number={index + 1}
        />
    ))
}

<button
    className="addChildButton"
    onClick={addChild}
>
    + Add Child
</button>


      <Button>

        Create Account

      </Button>

    </div>
  );
}

export default SignupForm;