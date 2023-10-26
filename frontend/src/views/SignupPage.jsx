import { useState, useContext } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import AllInboxIcon from "@mui/icons-material/AllInbox";
import PersonIcon from "@mui/icons-material/Person";

import axios from "axios";
import { Redirect } from "react-router-dom";
import PhoneInput from "react-phone-input-2";

import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import FileUploadInput from "../lib/FileUploadInput";
import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";

import LOGO from "../assets/logo_Hitern.png";

const Login = (props) => {
  const setPopup = useContext(SetPopupContext);

  const [loggedin, setLoggedin] = useState(isAuth());

  const [signupDetails, setSignupDetails] = useState({
    type: "applicant",
    email: "",
    password: "",
    tmpPassword: "",
    name: "",
    companyName: "",
    major: "",
    role: "",
    // education: [],
    education: "",
    skills: [],
    profile: "",
    bio: "",
    contactNumber: "",
  });

  const [phone, setPhone] = useState("");

  const [education, setEducation] = useState([
    {
      institutionName: "",
      startYear: "",
      endYear: "",
    },
  ]);

  const [inputErrorHandler, setInputErrorHandler] = useState({
    type: {
      value: "applicant",
      rules: [{ type: "required", message: "" }],
      error: false,
      message: "",
    },
    email: {
      value: "",
      // untouched: true,
      rules: [{ type: "required", message: "Email là bắt buộc" }],
      error: false,
      message: "",
    },
    password: {
      value: "",
      // untouched: true,
      rules: [{ type: "required", message: "Mật khẩu là bắt buộc" }],
      // required: true,
      error: false,
      message: "",
    },
    tmpPassword: {
      value: "",
      // untouched: true,
      // required: true,
      rules: [{ type: "required", message: "Nhập lại mật khẩu là bắt buộc" }],
      error: false,
      message: "",
    },
    name: {
      value: "",
      // untouched: true,
      rules: [{ type: "required", message: "Họ tên là bắt buộc" }],
      // required: true,
      error: false,
      message: "",
    },
    companyName: {
      value: "",
      // untouched: true,
      rules: [{ type: "required", message: "Tên công ty là bắt buộc" }],
      // required: true,
      error: false,
      message: "",
    },
  });

  const getFieldValue = (key) => {
    return inputErrorHandler[key]?.value || undefined;
  };
  const handleInput = (key, value) => {
    setInputErrorHandler((o) => {
      return {
        ...o,
        [key]: {
          value,
          error: false,
          message: "",
          rules: o[key].rules,
        },
      };
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
  const validatorForm = (form) => {
    const formValidate = {};
    Object.entries(form).forEach(([key, field]) => {
      if (field.rules) {
        let isInvalid = false;
        field.rules.forEach((rule) => {
          if (isInvalid) return;
          formValidate[key] = { ...field, error: false, message: "" };
          if (
            rule.type === "required" &&
            ["", null, undefined].includes(field.value)
          ) {
            isInvalid = true;
            formValidate[key] = {
              ...field,
              error: true,
              message: rule.message,
            };
          } else if (key === "password" || key === "tmpPassword") {
            console.log(field);
            if (field.value.length < 6) {
              isInvalid = true;
              formValidate[key] = {
                ...field,
                error: true,
                message: "Mật khẩu phải có ít nhất 6 ký tự",
              };
            } else if (form["tmpPassword"]?.value !== form["password"]?.value) {
              isInvalid = true;
              formValidate[key] = {
                ...field,
                error: true,
                message: "Mật khẩu không khớp",
              };
            }
          }
        });
      }
    });
    setInputErrorHandler(formValidate);
    console.log(formValidate);
  };
  const handleLogin = () => {
    const tmpErrorHandler = {};
    Object.keys(inputErrorHandler).forEach((obj) => {
      if (inputErrorHandler[obj].required && inputErrorHandler[obj].untouched) {
        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${obj[0].toUpperCase() + obj.substr(1)} is required`,
        };
      } else {
        tmpErrorHandler[obj] = inputErrorHandler[obj];
      }
    });

    const isValid = validatorForm(inputErrorHandler);

    setSignupDetails(updatedDetails);

    const verified = !Object.keys(tmpErrorHandler).some((obj) => {
      return tmpErrorHandler[obj].error;
    });
    const value = false;
    if (value) {
      let updatedDetails = {
        ...signupDetails,
        education: education
          .filter((obj) => obj.institutionName.trim() !== "")
          .map((obj) => {
            if (obj["endYear"] === "") {
              delete obj["endYear"];
            }
            return obj;
          }),
      };

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
      // setInputErrorHandler(tmpErrorHandler);
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
    <Paper elevation={3} sx={{ padding: "160px" }}>
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
            value={getFieldValue("type")}
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
            value={getFieldValue("name")}
            onChange={(event) => handleInput("name", event.target.value)}
            error={inputErrorHandler.name.error}
            variant="outlined"
          />
        </Grid>
        <Grid item>
          <EmailInput
            label="Email"
            value={getFieldValue("email")}
            onChange={(event) => {
              console.log(event.target.value);
              handleInput("email", event.target.value);
            }}
            inputErrorHandler={inputErrorHandler}
            handleInputError={handleInputError}
            required={true}
          />
        </Grid>

        {/* Mật khẩu */}
        <Grid item>
          <PasswordInput
            label="Mật khẩu"
            value={getFieldValue("password")}
            onChange={(event) => handleInput("password", event.target.value)}
            error={inputErrorHandler?.password?.error}
          />
        </Grid>
        {/* Nhập lại mật khẩu */}
        <Grid item>
          <PasswordInput
            label="Nhập lại mật khẩu"
            value={getFieldValue("tmpPassword")}
            onChange={(event) => handleInput("tmpPassword", event.target.value)}
            error={inputErrorHandler.tmpPassword.error}
          />
        </Grid>

        {/* Câu hỏi thêm */}
        {getFieldValue("type") === "applicant" ? (
          <>
            {/* Trường */}
            <Grid item>
              <TextField
                sx={{ width: "300px" }}
                label={`Tên trường đại học`}
                variant="outlined"
              />
            </Grid>

            {/* Ngành */}
            <Grid item>
              <InputLabel id="major-label">Ngành học</InputLabel>
              <Select
                sx={{ width: "300px" }}
                labelId="major-label"
                id="demo-simple-select-standard"
                onChange={(event) => handleInput("major", event.target.value)}
                label="Major"
              >
                <MenuItem value="">
                  <em>-Ngành-</em>
                </MenuItem>
                <MenuItem value={10}>Công nghệ thông tin</MenuItem>
              </Select>
            </Grid>

            {/* Chân dung */}
            <Grid item>
              <FileUploadInput
                label="Chân dung (.jpg/.png)"
                icon={<AllInboxIcon />}
                uploadTo={apiList.uploadProfileImage}
                handleInput={handleInput}
                identifier={"profile"}
              />
            </Grid>
          </>
        ) : (
          <>
            {/* Tên công ty */}
            <Grid item>
              <TextField
                sx={{ width: "300px" }}
                label="Tên công ty"
                value={getFieldValue("companyName")}
                onChange={(event) =>
                  handleInput("companyName", event.target.value)
                }
                error={inputErrorHandler.companyName.error}
                variant="outlined"
              />
            </Grid>

            {/* Vị trí công tác */}
            <Grid item>
              <InputLabel id="role-label">Vị trí công tác</InputLabel>
              <Select
                sx={{ width: "300px" }}
                labelId="role-label"
                id="demo-simple-select-standard"
                value={0}
                onChange={(event) => handleInput("role", event.target.value)}
                label="Role"
              >
                <MenuItem value={0}>
                  <em>-Chọn vị trí công tác-</em>
                </MenuItem>
                <MenuItem value={1}>Nhân viên</MenuItem>
                <MenuItem value={2}>Trưởng nhóm</MenuItem>
                <MenuItem value={3}>Phó phòng</MenuItem>
                <MenuItem value={4}>Trưởng phòng</MenuItem>
                <MenuItem value={5}>Phó giám đốc</MenuItem>
                <MenuItem value={6}>Giám đốc</MenuItem>
                <MenuItem value={7}>Tổng giám đốc</MenuItem>
              </Select>
            </Grid>

            <Grid item sx={{ width: "300px" }}>
              <TextField
                label="Thông tin mô tả (Tối đa 250 từ)"
                multiline
                rows={8}
                style={{ width: "100%" }}
                variant="outlined"
                value={getFieldValue("bio")}
                onChange={(event) => {
                  if (
                    event.target.value.split(" ").filter(function (n) {
                      return n !== "";
                    }).length <= 250
                  ) {
                    handleInput("bio", event.target.value);
                  }
                }}
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
              getFieldValue("type") === "applicant"
                ? handleLogin()
                : handleLoginRecruiter();
            }}
          >
            Đăng ký
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Login;
