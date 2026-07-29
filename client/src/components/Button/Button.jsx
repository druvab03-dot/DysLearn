import "./Button.css";

function Button({
    children,
    type = "button",
    onClick,
    disabled = false,
    className = "",
}) {
    return (
        <button
            type={type}
            className={`primaryButton ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

export default Button;