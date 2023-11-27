import TextField from "@mui/material/TextField";

const EmailInput = (props) => {
  const {
    label,
    value,
    onChange,
    inputErrorHandler,
    required,
    handleInputError,
  } = props;

  return (
    <TextField
      sx={{ width: "300px" }}
      label={label}
      variant="outlined"
      value={value}
      onChange={onChange}
      helperText={inputErrorHandler?.email?.message}
      onBlur={(event) => {
        if (event.target.value === "") {
          if (required) {
            handleInputError("email", true, "Email là bắt buộc");
          } else {
            handleInputError("email", false, "");
          }
        } else {
          const re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (re.test(String(event.target.value).toLowerCase())) {
            handleInputError("email", false, "");
          } else {
            handleInputError("email", true, "Định dạng email không chính xác");
          }
        }
      }}
      error={inputErrorHandler.email?.error}
    />
  );
};

export default EmailInput;
