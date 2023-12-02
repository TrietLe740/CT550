import { useState, useContext, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
} from "@mui/material";

import axios from "axios";
import { Redirect } from "react-router-dom";
import PhoneInput from "react-phone-input-2";

import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";

import LOGO from "../assets/logo_Hitern.png";

const SignupPage = (props) => {
  const setPopup = useContext(SetPopupContext);

  const [loggedin, setLoggedin] = useState(isAuth());

  const [signupDetails, setSignupDetails] = useState({
    type: "applicant",
    name: "",
    email: "",
    password: "",
    companyName: "",
    role: "",
    level: 0,
    tmpPassword: "",
  });

  const [phone, setPhone] = useState("");

  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: {
      vi_name: "Email",
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    password: {
      vi_name: "Mật khẩu",
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    name: {
      vi_name: "Họ và tên",
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    tmpPassword: {
      vi_name: "Nhập lại mật khẩu",
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    role: {
      vi_name: "Chọn vị trí",
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    companyName: {
      vi_name: "Tên công ty",
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    contactNumber: {
      vi_name: "Số điện thoại",
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
  });

  const handleInput = (key, value) => {
    if (signupDetails.type === "recruiter") {
      setSignupDetails({
        ...signupDetails,
        [key]: value,
      });
    } else if (signupDetails.type === "applicant") {
      const { type, name, email, password } = signupDetails;
      setSignupDetails({
        type,
        name,
        email,
        password,
        [key]: value,
      });
    }
  };

  const handleInputError = (key, status, message) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: {
        required: true,
        untouched: false,
        error: status,
        message: message,
      },
    });
  };

  const handleLogin = () => {
    const tmpErrorHandler = {};
    Object.keys(inputErrorHandler).forEach((obj) => {
      console.log(
        inputErrorHandler[obj].required && inputErrorHandler[obj].untouched
      );
      console.log(obj);
      if (signupDetails[obj] == undefined) return;
      if (inputErrorHandler[obj].required && inputErrorHandler[obj].untouched) {
        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${inputErrorHandler[obj].vi_name} là bắt buộc`,
        };
        console.log(obj);
      } else {
        tmpErrorHandler[obj] = inputErrorHandler[obj];
        console.log(tmpErrorHandler[obj]);
      }
    });

    let updatedDetails = {
      ...signupDetails,
    };

    setSignupDetails(updatedDetails);

    const verified = !Object.keys(tmpErrorHandler).some((obj) => {
      // console.log(inputErrorHandler[obj].error);
      if (tmpErrorHandler[obj].error) return true;
      return false;
    });

    if (verified) {
      axios
        .post(apiList.signup, updatedDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(isAuth());
          setPopup({
            open: true,
            severity: "success",
            message: "Đăng nhập thành công",
          });
          PubSub.publish("RELOAD_PROFILE", null);
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
      setInputErrorHandler(tmpErrorHandler);
      setPopup({
        open: true,
        severity: "error",
        message: "Xin vui lòng cung cấp thông tin đúng yêu cầu",
      });
    }
  };

  const handleLoginRecruiter = () => {
    const tmpErrorHandler = {};
    Object.keys(inputErrorHandler).forEach((obj) => {
      if (inputErrorHandler[obj].required && inputErrorHandler[obj].untouched) {
        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${inputErrorHandler[obj].vi_name} là bắt buộc`,
        };
      } else {
        tmpErrorHandler[obj] = inputErrorHandler[obj];
      }
    });

    let updatedDetails = {
      ...signupDetails,
    };
    if (phone !== "") {
      updatedDetails = {
        ...signupDetails,
        contactNumber: `+${phone}`,
      };
    } else {
      updatedDetails = {
        ...signupDetails,
        contactNumber: "",
      };
    }

    const verified = !Object.keys(tmpErrorHandler).some((obj) => {
      return tmpErrorHandler[obj].error;
    });

    console.log(updatedDetails);

    if (verified) {
      axios
        .post(apiList.signup, updatedDetails)
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
      setInputErrorHandler(tmpErrorHandler);
      setPopup({
        open: true,
        severity: "error",
        message: "Xin vui lòng cung cấp thông tin đúng yêu cầu",
      });
    }
  };

  useEffect(() => {
    console.log(signupDetails);
  }, []);

  return loggedin ? (
    <Redirect to="/" />
  ) : (
    <Grid
      elevation={3}
      sx={{ padding: { md: "50px", xs: "50px 0" }, minHeight: "93vh" }}
    >
      <Grid container direction="column" spacing={4} alignItems="center">
        <Grid item>
          <img src={LOGO} alt="" width={300} />
        </Grid>
        <Grid item>
          <Typography variant="h6" component="h6">
            Chào mừng đến với HIntern!
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            sx={{ width: "300px" }}
            select
            label="Đăng ký với vai trò"
            variant="outlined"
            value={signupDetails.type}
            onChange={(event) => {
              handleInput("type", event.target.value);
            }}
          >
            <MenuItem value="applicant">Thực tập sinh</MenuItem>
            <MenuItem value="recruiter">Cơ quan nơi thực tập</MenuItem>
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            sx={{ width: "300px" }}
            label="Họ và tên"
            type="text"
            value={signupDetails.name}
            onChange={(event) => handleInput("name", event.target.value)}
            onBlur={(event) => {
              if (event.target.value === "") {
                handleInputError("name", true, "Họ và tên là bắt buộc");
              } else {
                handleInputError("name", false, "");
              }
            }}
            error={inputErrorHandler.name.error}
            inputErrorHandler={inputErrorHandler}
            handleInputError={handleInputError}
            required={true}
            variant="outlined"
            helperText={inputErrorHandler.name.message}
          />
        </Grid>
        <Grid item>
          <EmailInput
            label="Email"
            value={signupDetails.email}
            error={inputErrorHandler.email.error}
            inputErrorHandler={inputErrorHandler}
            handleInputError={handleInputError}
            required={true}
            helperText={inputErrorHandler.email.message}
            onChange={(event) => {
              handleInput("email", event.target.value);
            }}
          />
        </Grid>

        {/* Mật khẩu */}
        <Grid item>
          <PasswordInput
            label="Mật khẩu"
            value={signupDetails.password}
            onChange={(event) => handleInput("password", event.target.value)}
            error={inputErrorHandler.password.error}
            inputErrorHandler={inputErrorHandler}
            handleInputError={handleInputError}
            helperText={inputErrorHandler.password.message}
            onBlur={(event) => {
              if (event.target.value === "") {
                handleInputError("password", true, "Mật khẩu là bắt buộc");
              } else {
                const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
                if (re.test(String(event.target.value))) {
                  handleInputError("password", false, "");
                } else {
                  handleInputError(
                    "password",
                    true,
                    "Mật khẩu phải có tối thiểu tám ký tự, ít nhất một chữ cái và một số"
                  );
                }
              }
            }}
          />
        </Grid>
        {/* Nhập lại mật khẩu */}
        <Grid item>
          <PasswordInput
            label="Nhập lại mật khẩu"
            value={signupDetails.tmpPassword}
            onChange={(event) => handleInput("tmpPassword", event.target.value)}
            error={inputErrorHandler.tmpPassword.error}
            inputErrorHandler={inputErrorHandler}
            handleInputError={handleInputError}
            required={true}
            helperText={inputErrorHandler.tmpPassword.message}
            onBlur={(event) => {
              if (event.target.value === "") {
                handleInputError(
                  "tmpPassword",
                  true,
                  "Nhập lại mật khẩu là bắt buộc"
                );
              } else {
                if (event.target.value !== signupDetails.password) {
                  handleInputError(
                    "tmpPassword",
                    true,
                    "Nhập lại mật khẩu chưa đúng"
                  );
                } else {
                  handleInputError("tmpPassword", false, "");
                }
              }
            }}
          />
        </Grid>

        {/* Câu hỏi thêm */}
        {signupDetails.type === "applicant" ? (
          <Grid></Grid>
        ) : (
          <>
            {/* Vị trí công tác */}
            <Grid item>
              <TextField
                sx={{ width: "300px" }}
                select
                label="Vị trí công tác"
                variant="outlined"
                value={signupDetails.role}
                onChange={(event) => {
                  handleInput("role", event.target.value);
                  handleInputError("role", false, "");
                }}
                error={inputErrorHandler.role.error}
                inputErrorHandler={inputErrorHandler}
                handleInputError={handleInputError}
                required={true}
                helperText={inputErrorHandler.role.message}
                onBlur={(event) => {
                  if (event.target.value === "") {
                    handleInputError(
                      "role",
                      true,
                      "Vị trí công tác là bắt buộc"
                    );
                  } else {
                    handleInputError("role", false, "");
                  }
                }}
              >
                <MenuItem value="Nhân viên">Nhân viên</MenuItem>
                <MenuItem value="Trưởng nhóm">Trưởng nhóm</MenuItem>
                <MenuItem value="Phó phòng">Phó phòng</MenuItem>
                <MenuItem value="Trưởng phòng">Trưởng phòng</MenuItem>
                <MenuItem value="Phó giám đốc">Phó giám đốc</MenuItem>
                <MenuItem value="Giám đốc">Giám đốc</MenuItem>
                <MenuItem value="Tổng giám đốc">Tổng giám đốc</MenuItem>
              </TextField>
            </Grid>

            {/* Tên công ty */}
            <Grid item>
              <TextField
                sx={{ width: "300px" }}
                label="Tên công ty"
                value={signupDetails.companyName}
                error={inputErrorHandler.companyName.error}
                inputErrorHandler={inputErrorHandler}
                handleInputError={handleInputError}
                required={true}
                helperText={inputErrorHandler.companyName.message}
                onChange={(event) => {
                  handleInput("companyName", event.target.value);
                  handleInputError("companyName", false, "");
                }}
                onBlur={(event) => {
                  if (event.target.value === "") {
                    handleInputError(
                      "companyName",
                      true,
                      "Tên công ty là bắt buộc"
                    );
                  } else {
                    handleInputError("companyName", false, "");
                  }
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <PhoneInput
                country={"vn"}
                value={phone}
                onChange={(phone) => setPhone(phone)}
              />
            </Grid>
          </>
        )}

        {/* Đăng ký */}
        <Grid item>
          <Button
            variant="contained"
            onClick={() => {
              signupDetails.type === "applicant"
                ? handleLogin()
                : handleLoginRecruiter();
            }}
          >
            Đăng ký
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SignupPage;
