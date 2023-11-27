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
    email: "",
    password: "",
    name: "",
    companyName: "",
    role: "",
    contactNumber: "",
    workplace: "",
    level: "0",
    tmpPassword: "",
    resume: [],
    avatar: "",
  });

  useEffect(() => {
    console.log(signupDetails);
  }, []);

  const [phone, setPhone] = useState("");

  // const [inputErrorHandler, setInputErrorHandler] = useState({
  //   type: {
  //     value: "applicant",
  //     rules: [{ type: "required", message: "" }],
  //     error: false,
  //     message: "",
  //   },
  //   email: {
  //     value: "",
  //     rules: [{ type: "required", message: "Email là bắt buộc" }],
  //     error: false,
  //     message: "",
  //   },
  //   password: {
  //     value: "",
  //     rules: [{ type: "required", message: "Mật khẩu là bắt buộc" }],
  //     error: false,
  //     message: "",
  //   },
  //   tmpPassword: {
  //     value: "",
  //     rules: [{ type: "required", message: "Nhập lại mật khẩu là bắt buộc" }],
  //     error: false,
  //     message: "",
  //   },
  //   name: {
  //     value: "",
  //     rules: [{ type: "required", message: "Họ tên là bắt buộc" }],
  //     error: false,
  //     message: "",
  //   },
  //   companyName: {
  //     value: "",
  //     rules: [{ type: "required", message: "Tên công ty là bắt buộc" }],
  //     error: false,
  //     message: "",
  //   },
  //   workplace: {
  //     value: "Chọn vị trí",
  //     rules: [{ type: "required", message: "Vị trí là bắt buộc" }],
  //     error: false,
  //     message: "",
  //   },
  // });

  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    password: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    name: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
  });

  // const getFieldValue = (key) => {
  //   return inputErrorHandler[key]?.value || undefined;
  // };

  // const handleInput = (key, value) => {
  //   setInputErrorHandler((o) => {
  //     return {
  //       ...o,
  //       [key]: {
  //         value,
  //         error: false,
  //         message: "",
  //         rules: o[key].rules,
  //       },
  //     };
  //   });
  // };

  const handleInput = (key, value) => {
    setSignupDetails({
      ...signupDetails,
      [key]: value,
    });
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

  // const validatorForm = (form) => {
  //   const formValidate = {};
  //   Object.entries(form).forEach(([key, field]) => {
  //     if (field.rules) {
  //       let isInvalid = false;
  //       field.rules.forEach((rule) => {
  //         if (isInvalid) return;
  //         formValidate[key] = { ...field, error: false, message: "" };
  //         if (
  //           rule.type === "required" &&
  //           ["", null, undefined].includes(field.value)
  //         ) {
  //           isInvalid = true;
  //           formValidate[key] = {
  //             ...field,
  //             error: true,
  //             message: rule.message,
  //           };
  //         } else if (key === "password" || key === "tmpPassword") {
  //           // console.log(field);
  //           if (field.value.length < 6) {
  //             isInvalid = true;
  //             formValidate[key] = {
  //               ...field,
  //               error: true,
  //               message: "Mật khẩu phải có ít nhất 6 ký tự",
  //             };
  //           } else if (form["tmpPassword"]?.value !== form["password"]?.value) {
  //             isInvalid = true;
  //             formValidate[key] = {
  //               ...field,
  //               error: true,
  //               message: "Mật khẩu không khớp",
  //             };
  //           }
  //         }
  //       });
  //     }
  //   });
  //   setInputErrorHandler(formValidate);
  //   // console.log(formValidate);
  // };

  const handleLogin = () => {
    const tmpErrorHandler = {};
    Object.keys(inputErrorHandler).forEach((obj) => {
      if (inputErrorHandler[obj].required && inputErrorHandler[obj].untouched) {
        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${obj[0].toUpperCase() + obj.substr(1)} là bắt buộc`,
        };
      } else {
        tmpErrorHandler[obj] = inputErrorHandler[obj];
      }
    });

    let updatedDetails = {
      ...signupDetails,
      // education: education
      //   .filter((obj) => obj.institutionName.trim() !== "")
      //   .map((obj) => {
      //     if (obj["endYear"] === "") {
      //       delete obj["endYear"];
      //     }
      //     return obj;
      //   }),
    };

    // const isValid = validatorForm(inputErrorHandler);

    setSignupDetails(updatedDetails);

    const verified = !Object.keys(tmpErrorHandler).some((obj) => {
      return tmpErrorHandler[obj].error;
    });
    // const value = false;
    if (verified) {
      // let updatedDetails = {
      //   ...signupDetails,
      //   // education: education
      //   //   .filter((obj) => obj.institutionName.trim() !== "")
      //   //   .map((obj) => {
      //   //     if (obj["endYear"] === "") {
      //   //       delete obj["endYear"];
      //   //     }
      //   //     return obj;
      //   //   }),
      // };

      axios
        .post(apiList.signup, updatedDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(isAuth());
          setPopup({
            open: true,
            severity: "success",
            message: "Đã đăng xuất tài khoản",
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

  const handleLoginRecruiter = () => {
    const tmpErrorHandler = {};
    Object.keys(inputErrorHandler).forEach((obj) => {
      if (inputErrorHandler[obj].required && inputErrorHandler[obj].untouched) {
        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${obj[0].toUpperCase() + obj.substr(1)} là bắt buộc`,
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

    // setSignupDetails(updatedDetails);

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

  return loggedin ? (
    <Redirect to="/" />
  ) : (
    <Grid elevation={3} sx={{ padding: "50px", minHeight: "93vh" }}>
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
            // value={getFieldValue("type")}
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
            // value={getFieldValue("name")}
            value={signupDetails.name}
            onChange={(event) => handleInput("name", event.target.value)}
            error={inputErrorHandler.name.error}
            variant="outlined"
            helperText={inputErrorHandler.name.message}
            onBlur={(event) => {
              if (event.target.value === "") {
                handleInputError("name", true, "Họ và tên là bắt buộc");
              } else if (event.target.value.type === "number") {
                handleInputError(
                  "name",
                  true,
                  "Vui lòng nhập đúng họ tên của bạn"
                );
              } else {
                handleInputError("name", false, "");
              }
            }}
            // inputErrorHandler={inputErrorHandler}
            // handleInputError={handleInputError}
            // required={true}
          />
        </Grid>
        <Grid item>
          <EmailInput
            label="Email"
            // value={getFieldValue("email")}
            value={signupDetails.email}
            onChange={(event) => {
              handleInput("email", event.target.value);
            }}
            error={inputErrorHandler.email.error}
            inputErrorHandler={inputErrorHandler}
            handleInputError={handleInputError}
            required={true}
            helperText={inputErrorHandler.email.message}
          />
        </Grid>

        {/* Mật khẩu */}
        <Grid item>
          <PasswordInput
            label="Mật khẩu"
            // value={getFieldValue("password")}
            value={signupDetails.password}
            onChange={(event) => handleInput("password", event.target.value)}
            error={inputErrorHandler.password.error}
            inputErrorHandler={inputErrorHandler}
            handleInputError={handleInputError}
            required={true}
            helperText={inputErrorHandler.password.message}
            onBlur={(event) => {
              if (event.target.value === "") {
                handleInputError("password", true, "Mật khẩu là bắt buộc");
              } else {
                handleInputError("password", false, "");
              }
            }}
          />
        </Grid>
        {/* Nhập lại mật khẩu */}
        <Grid item>
          <PasswordInput
            label="Nhập lại mật khẩu"
            value={signupDetails.tmpPassword}
            // value={getFieldValue("tmpPassword")}
            onChange={(event) => handleInput("tmpPassword", event.target.value)}
            // error={inputErrorHandler.tmpPassword.error}
            inputErrorHandler={inputErrorHandler}
            handleInputError={handleInputError}
            required={true}
            // helperText={inputErrorHandler.tmpPassword.message}
            onBlur={(event) => {
              if (event.target.value !== signupDetails.password) {
                handleInputError(
                  "tmpPassword",
                  true,
                  "Nhập lại mật khẩu chưa đúng"
                );
              }
            }}
          />
        </Grid>

        {/* Câu hỏi thêm */}
        {/* getFieldValue("type") */}
        {signupDetails.type === "applicant" ? null : (
          <>
            {/* Vị trí công tác */}
            <Grid item>
              <TextField
                sx={{ width: "300px" }}
                select
                label="Vị trí công tác"
                variant="outlined"
                value={signupDetails.workplace}
                // value={getFieldValue("workplace")}
                onChange={(event) => {
                  handleInput("workplace", event.target.value);
                }}
              >
                <MenuItem value="Chọn vị trí">-Chọn vị trí-</MenuItem>
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
                // value={getFieldValue("companyName")}
                onChange={(event) =>
                  handleInput("companyName", event.target.value)
                }
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
              // getFieldValue("type")
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
