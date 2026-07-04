import "./Input.css";

function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="inputGroup">
      <label>{label}</label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default Input;