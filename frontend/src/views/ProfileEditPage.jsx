import {
  Avatar,
  IconButton,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";

import UsersService from "../services/user.service";
import AuthService from "../services/auth.service";
import SchoolsService from "../services/school.service";

import { Link } from "react-router-dom";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import MajorsService from "../services/major.service";
import apiList, { server } from "../lib/apiList";
import PhoneInput from "react-phone-input-2";
import axios from "axios";
import UploadService from "../services/upload.sevice";
import { SetPopupContext } from "../App";

export default function ProfileEditPage() {
  const uploadServ = new UploadService();
  const userServ = new UsersService();
  const authServ = new AuthService();
  const majorServ = new MajorsService();
  const schoolServ = new SchoolsService();
  const setPopup = useContext(SetPopupContext);

  const initValue = {
    name: "",
    avatar: "",
    major: "",
    school: {},
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

  const handleUpdate = async () => {
    const tmpErrorHandler = {};
    Object.keys(inputErrorHandler).forEach((obj) => {
      console.log(
        inputErrorHandler[obj].required && inputErrorHandler[obj].untouched
      );
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

    const verified = Object.keys(tmpErrorHandler).some((obj) => {
      console.log(inputErrorHandler[obj].error);
      if (tmpErrorHandler[obj].error) return false;
      return true;
    });

    if (verified) {
      try {
        await userServ.update(updatedDetails);
        setPopup({
          open: true,
          severity: "success",
          message: "Cập nhật thành công",
        });
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

  const handleDeleteCV = async (cv) => {
    try {
      await uploadServ.deleteCV(cv);
      alert("Xóa thành công!");
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

  async function getUser() {
    const auth = await authServ.get();
    const majors = await majorServ.getAll();
    const schools = await schoolServ.getAll();
    setProfileDetails({
      ...auth,
      school: {
        value: auth?.school?.id,
        label: auth?.school?.name,
        ...(auth?.school || {}),
      },
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
    console.log(schools);
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Paper sx={{ padding: { md: "100px", xs: "none" } }}>
      <Grid
        container
        sx={{
          boxShadow:
            "0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)",
          margin: "0 auto",
          borderRadius: { md: "30px", xs: "0" },
          padding: "30px",
        }}
      >
        <Grid
          item
          container
          direction="column"
          xs={12}
          md={8}
          sx={{ padding: "20px" }}
        >
          <Grid item>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              CÀI ĐẶT THÔNG TIN CÁ NHÂN
            </Typography>
          </Grid>
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
              helperText={inputErrorHandler.name.message}
            />
          </Grid>
          <Grid item sx={{ marginTop: "20px" }}>
            <PhoneInput
              inputStyle={{ width: "100%" }}
              placeholder="Số điện thoại"
              country={"vn"}
              value={profileDetails?.contactNumber}
              onChange={(phone) => setPhone(phone)}
              onBlur={(event) => {
                if (event.target.value === "") {
                  handleInputError(
                    "contactNumber",
                    true,
                    "Số điện thoại là bắt buộc"
                  );
                } else {
                  handleInputError("contactNumber", false, "");
                }
              }}
              error={inputErrorHandler.contactNumber.error}
              inputErrorHandler={inputErrorHandler}
              handleInputError={handleInputError}
              required={true}
              helperText={inputErrorHandler.contactNumber.message}
            />
          </Grid>
          <Grid sx={{ marginTop: "20px" }} item>
            <Select
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
                handleInput("major", v.value);
              }}
              onBlur={(event) => {
                if (event.target.value === "") {
                  handleInputError("major", true, "Ngành học là bắt buộc");
                } else {
                  handleInputError("major", false, "");
                }
              }}
              error={inputErrorHandler.major.error}
              inputErrorHandler={inputErrorHandler}
              handleInputError={handleInputError}
              required={true}
              helperText={inputErrorHandler.major.message}
            />
          </Grid>

          {/* School */}
          <Grid sx={{ marginTop: "20px" }} item>
            <Select
              placeholder={"Trường"}
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
              }}
            />
          </Grid>

          {/* Email */}
          <Grid item sx={{ marginTop: "20px" }}>
            <TextField
              sx={{ width: "100%", margin: "15px 0" }}
              label="Email"
              variant="outlined"
              value={profileDetails?.email}
              disabled
            />
          </Grid>
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
          <Grid item container>
            <Grid item xs={4} md={12} lg={4}>
              <Avatar
                sx={{
                  width: { lg: "90px", md: "80px", sm: "100px", xs: "80px" },
                  height: { lg: "90px", md: "80px", sm: "100px", xs: "80px" },
                  border: "3px solid",
                }}
                src={profileDetails?.avatar}
              />
            </Grid>
            <Grid item xs={8} md={12} lg={8}>
              <Typography variant="p">Chào mừng trở lại,</Typography>
              <br />
              <Typography variant="p" sx={{ fontWeight: "bold" }}>
                {profileDetails?.name}
              </Typography>
              <br />
              <Typography variant="p" sx={{ fontWeight: "bold" }}>
                {profileDetails?.level < 3
                  ? `Tài khoản cấp ${profileDetails?.level}`
                  : `Tài khoản cấp tối đa`}
              </Typography>
              <br />
              <Typography variant="p" sx={{ fontWeight: "bold" }}>
                Số Xu: {""}
                {profileDetails?.credit} <PaidIcon sx={{ color: "#FFB000" }} />
              </Typography>
              <br />
              <Link to={`/tai-khoan/nang-cap`}>
                <Button variant="contained" sx={{ marginTop: "10px" }}>
                  <Typography fontSize={13}>Nâng cấp tài khoản</Typography>
                </Button>
              </Link>
              <br />
              <Link to={`/tai-khoan/nap-tien`}>
                <Button variant="contained" sx={{ marginTop: "10px" }}>
                  <Typography fontSize={13}>Nạp Xu</Typography>
                </Button>
              </Link>
            </Grid>
          </Grid>

          {/* Danh sach CV */}
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
              <Typography variant="h6">Danh sách CV của bạn</Typography>
              {profileDetails?.resume !== ""
                ? profileDetails?.resume?.map((v, key) => (
                    <Grid item>
                      <Link onClick={() => getResume(key)}>
                        {v.originalname}
                      </Link>
                      <IconButton
                        variant="contained"
                        sx={{ marginRight: "20px" }}
                        onClick={() => {
                          handleDeleteCV(v.filename);
                        }}
                      >
                        <HighlightOffIcon />
                      </IconButton>
                    </Grid>
                  ))
                : null}
              <br />
              <Link to={`/update-cv`}>
                <Button variant="contained">Upload CV</Button>
              </Link>
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
                Nhà tuyển dụng bạn đang theo dõi
              </Typography>
              {profileDetails?.following !== ""
                ? profileDetails?.following?.map((v, key) => (
                    // TODO
                    <Grid item>abc </Grid>
                  ))
                : null}
              <br />
              <Link to={`/update-cv`}>
                <Button variant="contained">Upload CV</Button>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
