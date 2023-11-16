import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import { Grid, Button, Typography, Paper } from "@mui/material";

import axios from "axios";
import { Redirect } from "react-router-dom";

import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";

import LOGO from "../assets/logo_Hitern.png";

const Login = (props) => {
  const setPopup = useContext(SetPopupContext);

  const [loggedin, setLoggedin] = useState(isAuth());

  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: {
      error: false,
      message: "",
    },
    password: {
      error: false,
      message: "",
    },
  });

  let history = useHistory();
  const handleClick = (location) => {
    console.log(location);
    history.push(location);
  };

  const handleInput = (key, value) => {
    setLoginDetails({
      ...loginDetails,
      [key]: value,
    });
  };

  const handleInputError = (key, status, message) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: {
        error: status,
        message: message,
      },
    });
  };

  const handleLogin = () => {
    const verified = !Object.keys(inputErrorHandler).some((obj) => {
      return inputErrorHandler[obj].error;
    });
    if (verified) {
      axios
        .post(apiList.login, loginDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(isAuth());
          setPopup({
            open: true,
            severity: "success",
            message: "Đăng nhập thành công",
          });
          console.log(response);
        })
        .catch((err) => {
          setPopup({
            open: true,
            severity: "error",
            message: err.response.data.message,
          });
          console.log(err.response);
        });
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "Xin vui lòng cung cấp thông tin đúng yêu cầu",
      });
    }
  };

  return loggedin ? (
    <Redirect to="/" />
  ) : (
    <Paper sx={{ padding: "50px", minHeight: "93vh" }}>
      <Grid container direction="column" spacing={4} alignItems="center">
        <Grid item>
          <img src={LOGO} alt="" width={300} />
        </Grid>
        <Grid item>
          <Typography variant="h6" component="h6">
            Đăng nhập tài khoản của bạn
          </Typography>
        </Grid>
        <Grid item>
          <EmailInput
            label="Email"
            value={loginDetails.email}
            onChange={(event) => handleInput("email", event.target.value)}
            inputErrorHandler={inputErrorHandler}
            handleInputError={handleInputError}
          />
        </Grid>
        <Grid item>
          <PasswordInput
            label="Mật khẩu"
            value={loginDetails.password}
            onChange={(event) => handleInput("password", event.target.value)}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={() => handleLogin()}>
            Đăng nhập
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Login;
