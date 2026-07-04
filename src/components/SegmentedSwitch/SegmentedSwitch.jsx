import "./SegmentedSwitch.css";

function SegmentedSwitch({ active, setActive }) {
  return (
    <div className="segment">

      <button
        className={active === "login" ? "active" : ""}
        onClick={() => setActive("login")}
      >
        Login
      </button>

      <button
        className={active === "signup" ? "active" : ""}
        onClick={() => setActive("signup")}
      >
        Create Account
      </button>

    </div>
  );
}

export default SegmentedSwitch;