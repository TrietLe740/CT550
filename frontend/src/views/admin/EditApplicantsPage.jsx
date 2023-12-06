import {
  Avatar,
  IconButton,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";

import UsersService from "../../services/user.service";
import AuthService from "../../services/auth.service";
import SchoolsService from "../../services/school.service";

import { Link, useHistory, useLocation } from "react-router-dom";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import MajorsService from "../../services/major.service";
import apiList, { server } from "../../lib/apiList";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

import axios from "axios";
import UploadService from "../../services/upload.sevice";
import { SetPopupContext } from "../../App";
import FileUploadInput from "../../component/FileUploadInput";

export default function EditApplicantsPage() {
  const uploadServ = new UploadService();
  const userServ = new UsersService();
  const authServ = new AuthService();
  const majorServ = new MajorsService();
  const schoolServ = new SchoolsService();
  const setPopup = useContext(SetPopupContext);

  let history = useHistory();

  const handleClick = (location) => {
    history.push(location);
  };

  const initValue = {
    name: "",
    avatar: "",
    major: "",
    school: null,
    contactNumber: "",
    // skills: [],
    // activity: [],
    // award: [],
    // certificate: [],
    // exp: "",
    // interest: "",
    // target: "",
    email: "",
    resume: [],
    level: "",
    following: [],
    credit: 0,
  };

  const [inputErrorHandler, setInputErrorHandler] = useState({
    name: {
      vi_name: "Họ và tên",
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    major: {
      vi_name: "Ngành học",
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    school: {
      vi_name: "Trường học",
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

  useEffect(() => {
    console.log(inputErrorHandler);
  }, [inputErrorHandler]);

  const [phone, setPhone] = useState("");

  const [profileDetails, setProfileDetails] = useState(initValue);

  const [majors, setMajors] = useState({});
  const [schools, setSchools] = useState({});

  const handleInput = (key, value) => {
    setProfileDetails({
      ...profileDetails,
      [key]: value,
    });
  };

  // Cap nhat
  const handleUpdate = async () => {
    const tmpErrorHandler = {};
    console.log(profileDetails);
    Object.keys(inputErrorHandler).forEach((obj) => {
      if (
        inputErrorHandler[obj].required &&
        inputErrorHandler[obj].untouched &&
        !profileDetails[obj]
      ) {
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
      ...profileDetails,
    };

    if (phone !== "") {
      updatedDetails = {
        ...profileDetails,
        contactNumber: `+${phone}`,
      };
    } else {
      updatedDetails = {
        ...profileDetails,
        contactNumber: "",
      };
    }

    const verified = !Object.keys(tmpErrorHandler).some((obj) => {
      console.log(inputErrorHandler[obj].error);
      if (tmpErrorHandler[obj].error) return true;
      return false;
    });

    if (verified) {
      try {
        await userServ.updateIntern(updatedDetails);
        setPopup({
          open: true,
          severity: "success",
          message: "Cập nhật thành công",
        });
        getUser();
      } catch (error) {
        setPopup({
          open: true,
          severity: "error",
          message: "Thông tin cung cấp chưa đầy đủ",
        });
      }
    } else {
      setInputErrorHandler(tmpErrorHandler);
      setPopup({
        open: true,
        severity: "error",
        message: "Xin vui lòng cung cấp thông tin đúng yêu cầu",
      });
    }
  };

  const handleDeleteCV = async (cv, id) => {
    try {
      await uploadServ.adminDeleteCV(cv, id);
      setPopup({
        open: true,
        severity: "success",
        message: "Đã xóa CV thành công!",
      });
      getUser();
    } catch (error) {
      console.log(error);
    }
  };

  const getResume = (i) => {
    const address = `${apiList.downloadResume}/${profileDetails.resume[i].filename}`;
    axios(address, {
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const file = new Blob([response.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      })
      .catch((error) => {
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  let location = useLocation();
  let path = location.pathname.split("/");
  let id = path[path.length - 1];

  async function getUser() {
    const auth = await userServ.getIntern(id);
    const majors = await majorServ.getAll();
    const schools = await schoolServ.getAll();

    setProfileDetails({
      ...auth,
      school: auth?.school
        ? {
            value: auth?.school?.id,
            label: auth?.school?.name,
            ...(auth?.school || {}),
          }
        : null,
    });

    setMajors(
      majors?.[0].majors.map((item) => {
        return { label: item, value: item };
      }) || []
    );

    setSchools(
      schools?.map((item) => {
        return { label: item.name, value: item.id, ...item };
      })
    );
  }

  useEffect(() => {
    console.log(profileDetails);
    getUser();
  }, {});

  return (
    <Paper sx={{ padding: { md: "50px 100px", xs: "none" } }}>
      <Grid
        container
        sx={{
          padding: "30px",
        }}
      >
        <Grid
          item
          xs={12}
          justifyContent="left"
          sx={{ display: "flex", justifyContent: "left" }}
        >
          <Button
            sx={{ marginRight: "auto", justifyContent: "left" }}
            onClick={() => handleClick("/admin/thuc-tap-sinh")}
          >
            <ArrowBackIosNewIcon /> Quay lại
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          textAlign="center"
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Typography variant="h2">Quản lý thông tin sinh viên</Typography>
        </Grid>
        <Grid
          item
          container
          direction="column"
          xs={12}
          md={8}
          sx={{ padding: "20px" }}
        >
          <Grid item sx={{ marginTop: "20px" }}>
            <TextField
              type="text"
              sx={{ width: "100%", margin: "15px 0" }}
              label="Họ và tên"
              variant="outlined"
              value={profileDetails?.name}
              onChange={(event) => {
                handleInput("name", event.target.value);
              }}
              onBlur={(event) => {
                if (!profileDetails?.name) {
                  handleInputError("name", true, "Họ và tên là bắt buộc");
                } else {
                  handleInputError("name", false, "");
                }
              }}
              error={inputErrorHandler.name.error}
              inputErrorHandler={inputErrorHandler}
              handleInputError={handleInputError}
              required={true}
              helperText={inputErrorHandler.name.message}
            />
          </Grid>
          <Grid item sx={{ marginTop: "20px" }}>
            <TextField
              type="text"
              sx={{ width: "100%", margin: "15px 0" }}
              label="Link ảnh đại diện"
              variant="outlined"
              value={profileDetails?.avatar}
              onChange={(event) => {
                handleInput("avatar", event.target.value);
              }}
            />
          </Grid>
          <Grid item sx={{ marginTop: "20px" }}>
            <PhoneInput
              inputStyle={
                inputErrorHandler.contactNumber.error
                  ? { width: "100%", border: "1px solid red" }
                  : { width: "100%", border: "1px solid hsl(0, 0%, 80%)" }
              }
              placeholder="Số điện thoại"
              country={"vn"}
              value={profileDetails?.contactNumber}
              inputProps={{
                name: "Số điện thoại",
                required: true,
              }}
              onChange={(phone) => setPhone(phone)}
              onBlur={(event) => {
                if (!profileDetails?.contactNumber) {
                  handleInputError(
                    "contactNumber",
                    true,
                    "Số điện thoại là bắt buộc"
                  );
                } else {
                  handleInputError("contactNumber", false, "");
                }
              }}
            />
            <Typography variant="p" className="react-select-msg-error">
              {inputErrorHandler?.contactNumber.message}
            </Typography>
          </Grid>

          {/* Ngành */}
          <Grid sx={{ marginTop: "20px" }} item>
            <Select
              className={
                inputErrorHandler.major.error ? "react-select-error" : ""
              }
              placeholder={"Ngành"}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  height: "56px",
                  margin: "10px 0",
                }),
              }}
              options={majors}
              value={{
                value: profileDetails?.major,
                label: profileDetails?.major,
              }}
              onChange={(v) => {
                console.log(v);
                handleInput("major", v.value);
                handleInputError("major", false, "");
              }}
              required={true}
              onBlur={(event) => {
                if (!profileDetails?.major) {
                  handleInputError("major", true, "Ngành học là bắt buộc");
                } else {
                  handleInputError("major", false, "");
                }
              }}
            />
            <Typography variant="p" className="react-select-msg-error">
              {inputErrorHandler.major.message}
            </Typography>
          </Grid>

          {/* School */}
          <Grid sx={{ marginTop: "20px" }} item>
            <Select
              className={
                inputErrorHandler.school.error ? "react-select-error" : ""
              }
              placeholder="Trường"
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  height: "56px",
                  margin: "10px 0",
                }),
              }}
              options={schools}
              value={{
                value: profileDetails?.school?.value,
                label: profileDetails?.school?.label,
              }}
              onChange={(v) => {
                handleInput("school", v);
                handleInputError("school", false, "");
              }}
              onBlur={(event) => {
                if (!profileDetails?.school) {
                  handleInputError("school", true, "Trường học là bắt buộc");
                } else {
                  handleInputError("school", false, "");
                }
              }}
            />
            <Typography variant="p" className="react-select-msg-error">
              {inputErrorHandler.school.message}
            </Typography>
          </Grid>

          {/* Email */}
          {/* <Grid item sx={{ marginTop: "20px" }}>
            <TextField
              sx={{ width: "100%", margin: "15px 0" }}
              label="Email"
              variant="outlined"
              value={profileDetails?.email}
              disabled
            />
          </Grid> */}
          <Grid item>
            <Button
              variant="contained"
              sx={{ padding: "10px 50px", marginTop: "30px", width: "100%" }}
              onClick={() => handleUpdate()}
            >
              Lưu
            </Button>
          </Grid>
        </Grid>

        <Grid
          item
          container
          direction="column"
          xs={12}
          md={4}
          sx={{ padding: "20px", marginTop: { xs: "30px", md: "0" } }}
        >
          <Grid item container sx={{ marginTop: "30px" }}>
            <Grid
              item
              xs={12}
              sx={{
                border: "1px solid #48884A",
                borderRadius: "20px",
                padding: "20px",
              }}
            >
              <Typography variant="h6">Danh sách CV sinh viên</Typography>
              {profileDetails?.resume !== ""
                ? profileDetails?.resume?.map((v, key) => (
                    <Grid item container sx={{ mt: 1 }}>
                      <Grid
                        item
                        xs={8}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Typography variant="p">{v.originalname}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Button
                          sx={{ height: "100%" }}
                          onClick={() => getResume(key)}
                        >
                          Xem
                        </Button>
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton
                          variant="contained"
                          sx={{ marginLeft: "auto" }}
                          onClick={() => {
                            handleDeleteCV(v.filename, profileDetails?._id);
                          }}
                        >
                          <HighlightOffIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))
                : null}
              <br />
              <FileUploadInput
                onChangeCV={() => {
                  getAuth();
                }}
              />
            </Grid>

            {/* DS Following */}
            <Grid
              item
              xs={12}
              sx={{
                border: "1px solid #48884A",
                borderRadius: "20px",
                padding: "20px",
                mt: 4,
              }}
            >
              <Typography variant="h6">
                Nhà tuyển dụng mà sinh viên đang theo dõi
              </Typography>
              {profileDetails?.following !== ""
                ? profileDetails?.following?.map((v, key) => (
                    // TODO
                    <Grid item>abc </Grid>
                  ))
                : null}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
