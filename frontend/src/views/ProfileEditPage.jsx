import {
  Avatar,
  IconButton,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import UsersService from "../services/user.service";
import AuthService from "../services/auth.service";
import { Link } from "react-router-dom";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import MajorsService from "../services/major.service";
import apiList, { server } from "../lib/apiList";
import PhoneInput from "react-phone-input-2";
import axios from "axios";
import UploadService from "../services/upload.sevice";

export default function ProfileEditPage() {
  const uploadServ = new UploadService();
  const userServ = new UsersService();
  const authServ = new AuthService();
  const majorServ = new MajorsService();

  const initValue = {
    avatar: {},
    name: "",
    education: [],
    skills: [],
    activity: [],
    award: [],
    certificate: [],
    contactNumber: "",
    email: "",
    exp: "",
    resume: [],
    interest: "",
    target: "",
    major: "",
  };

  const [phone, setPhone] = useState("");

  const [profileDetails, setProfileDetails] = useState(initValue);

  const [majors, setMajors] = useState({});

  const handleInput = (key, value) => {
    setProfileDetails({
      ...profileDetails,
      [key]: value,
    });
  };

  const handleUpdate = async () => {
    let updatedDetails = {
      ...profileDetails,
    };
    console.log(updatedDetails);
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
    try {
      await userServ.update(updatedDetails);
      alert("Cập nhật thành công!");
    } catch (error) {
      console.log(error);
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
    console.log(address);
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
        console.log(error);
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
    setProfileDetails(auth);
    setMajors(
      majors?.[0].majors.map((item) => {
        return { label: item, value: item };
      }) || []
    );
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Paper sx={{ padding: "100px" }}>
      <Grid
        container
        sx={{
          boxShadow:
            "0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)",
          margin: "0 auto",
          borderRadius: "30px",
          padding: "30px",
        }}
      >
        <Grid item container direction="column" xs={8} sx={{ padding: "20px" }}>
          <Grid item>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              CÀI ĐẶT THÔNG TIN CÁ NHÂN
            </Typography>
          </Grid>
          <Grid item sx={{ marginTop: "20px" }}>
            <TextField
              sx={{ width: "100%", margin: "15px 0" }}
              label="Họ và tên"
              variant="outlined"
              value={profileDetails?.name}
              onChange={(event) => {
                handleInput("name", event.target.value);
              }}
            />
          </Grid>
          <Grid item sx={{ marginTop: "20px" }}>
            <PhoneInput
              inputStyle={{ width: "100%" }}
              inputProps={{
                name: "Liên hệ",
                required: true,
                autoFocus: true,
              }}
              country={"vn"}
              value={profileDetails?.contactNumber}
              onChange={(phone) => setPhone(phone)}
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
                console.log(v);
              }}
            />
          </Grid>
          {/* <Grid item></Grid> */}
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
              sx={{ padding: "10px 50px", marginTop: "30px" }}
              onClick={() => handleUpdate()}
            >
              Lưu
            </Button>
          </Grid>
        </Grid>
        <Grid item container direction="column" xs={4} sx={{ padding: "20px" }}>
          <Grid item container>
            <Grid item xs={4}>
              <Avatar
                sx={{
                  width: "100px",
                  height: "100px",
                  border: "3px solid",
                }}
                src={profileDetails?.avatar}
              />
            </Grid>
            <Grid item xs={8}>
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
              <Link to={`/tai-khoan/nang-cap`}>
                <Button variant="contained" sx={{ marginTop: "10px" }}>
                  Nâng cấp tài khoản
                </Button>
              </Link>
            </Grid>
          </Grid>
          <Grid item container sx={{ marginTop: "30px" }}>
            <Grid item xs={12}>
              <Typography variant="h6">DS CV của bạn</Typography>
              <ul>
                {profileDetails?.resume?.map((v, key) => (
                  <li>
                    <Link onClick={() => getResume(key)}>{v.originalname}</Link>
                    <IconButton
                      variant="contained"
                      sx={{ marginRight: "20px" }}
                      onClick={() => {
                        handleDeleteCV(v.filename);
                      }}
                    >
                      <HighlightOffIcon />
                    </IconButton>
                  </li>
                ))}
              </ul>
              <br />
              <Link to={`/update-cv`}>
                <Button variant="contained" sx={{ marginTop: "10px" }}>
                  Upload CV
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
