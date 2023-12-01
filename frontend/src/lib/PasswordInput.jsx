import { useState } from "react";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const PasswordInput = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormControl
      sx={{ margin: "0 auto" }}
      variant="outlined"
      error={props.error ? props.error : null}
    >
      <InputLabel htmlFor="outlined-adornment-password">
        {props.label}
      </InputLabel>
      <OutlinedInput
        sx={{ width: "300px", margin: "0 auto" }}
        type={showPassword ? "text" : "password"}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={handleShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              size="large"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
        value={props.value}
        onChange={(event) => props.onChange(event)}
        onBlur={props.onBlur ? props.onBlur : null}
      />
      {props.helperText ? (
        <FormHelperText>{props.helperText}</FormHelperText>
      ) : null}
    </FormControl>
  );
};

export default PasswordInput;
