import { useContext, useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Paper,
  TextField,
  MenuItem,
} from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

import { SetPopupContext } from "../../App";

import apiList from "../../lib/apiList";
import AuthService from "../../services/auth.service";
import UsersService from "../../services/user.service";
import LocationsService from "../../services/location.service";
import { useLocation } from "react-router-dom";

const RecruiterEditProfile = (props) => {
  const authServ = new AuthService();
  const userServ = new UsersService();
  const locationServ = new LocationsService();

  const setPopup = useContext(SetPopupContext);
  const [locations, setLocations] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [communeList, setCommuneList] = useState([]);

  const [profileDetails, setProfileDetails] = useState({
    name: "",
    role: "",
    email: "",
    companyName: "",
    companyMail: "",
    website: "",
    bio: "",
    avatar: "",
    contactNumber: "",
    location: {
      no: "",
      province: "",
      district: "",
      commune: "",
    },
  });

  const [phone, setPhone] = useState("");

  const handleInput = (key, value) => {
    setProfileDetails({
      ...profileDetails,
      [key]: value,
    });
  };

  const handleLocationChange = (key, value) => {
    const location = { ...profileDetails.location, [key]: value };
    setProfileDetails({
      ...profileDetails,
      location,
    });
  };

  const handleUpdate = async () => {
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

    try {
      await userServ.update(updatedDetails);
      setPopup({
        open: true,
        severity: "success",
        message: "Cập nhật thành công!",
      });
    } catch (error) {
      setPopup({
        open: true,
        severity: "error",
        message: "Đã xảy ra lỗi",
      });
    }
  };

  let location = useLocation();
  let userId = location.pathname.slice(10);

  useEffect(() => {
    async function getUser() {
      const locations = await locationServ.getAll();
      setLocations(locations);
      const user = await authServ.get();
      setProfileDetails(user);
    }
    getUser();
  }, []);

  useEffect(() => {
    setDistrictList([]);
    const tmp = locations.find(
      (i) => i.name == profileDetails.location?.province
    );
    setDistrictList(tmp?.districts || []);
  }, [profileDetails]);

  useEffect(() => {
    setCommuneList([]);
    const tmp = districtList.find(
      (i) => i.name == profileDetails.location?.district
    );
    setCommuneList(tmp?.wards || []);
  }, [profileDetails]);

  return (
    <Paper>
      <Grid
        sx={{ padding: "100px" }}
        container
        item
        direction="column"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="h2">Quản lý thông tin công ty</Typography>
        </Grid>
        {/* --Noi dung-- */}
        <Grid container item xs={12} sx={{ width: "100%", marginTop: "50px" }}>
          <Grid
            container
            direction="column"
            xs={6}
            alignItems="stretch"
            spacing={3}
            sx={{ padding: "10px" }}
          >
            {/* --Phan chu tai khoan-- */}
            <Typography variant="h5" sx={{ marginLeft: "20px" }}>
              Chủ tài khoản
            </Typography>
            <Grid item>
              <TextField
                label="Họ và tên"
                value={profileDetails?.name}
                onChange={(event) => handleInput("name", event.target.value)}
                variant="outlined"
                fullWidth
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item>
              <TextField
                sx={{ width: "100%" }}
                select
                label="Vị trí"
                variant="outlined"
                value={profileDetails?.role}
                onChange={(event) => {
                  handleInput("role", event.target.value);
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
            <Grid item>
              <TextField
                type="text"
                sx={{ width: "100%" }}
                label="Email"
                variant="outlined"
                value={profileDetails?.email}
                disabled
              />
            </Grid>
          </Grid>
          {/* --Phan thong tin cong ty-- */}
          <Grid
            container
            direction="column"
            xs={6}
            alignItems="stretch"
            spacing={3}
            sx={{ padding: "10px" }}
          >
            <Typography variant="h5" sx={{ marginLeft: "20px" }}>
              Thông tin doanh nghiệp
            </Typography>
            <Grid item>
              <TextField
                label="Tên doanh nghiệp"
                value={profileDetails?.companyName}
                onChange={(event) =>
                  handleInput("companyName", event.target.value)
                }
                variant="outlined"
                fullWidth
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item>
              <TextField
                type="text"
                label="Email doanh nghiệp"
                value={profileDetails?.companyMail}
                onChange={(event) =>
                  handleInput("companyMail", event.target.value)
                }
                variant="outlined"
                fullWidth
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Website doanh nghiệp"
                value={profileDetails?.website}
                onChange={(event) => handleInput("website", event.target.value)}
                variant="outlined"
                fullWidth
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Thông tin mô tả"
                multiline
                rows={8}
                sx={{ width: "100%" }}
                variant="outlined"
                value={profileDetails?.bio}
                onChange={(event) => {
                  if (
                    event.target.value.split(" ").filter(function (n) {
                      return n != "";
                    }).length <= 250
                  ) {
                    handleInput("bio", event.target.value);
                  }
                }}
              />
            </Grid>
            <Grid
              item
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
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
            <Grid item container>
              <Grid item xs={3}>
                <TextField
                  label="Tòa nhà, ấp,..."
                  required
                  type="text"
                  variant="outlined"
                  value={profileDetails?.location?.no}
                  onChange={(event) => {
                    handleLocationChange("no", event.target.value);
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  select
                  id="province"
                  label="Tỉnh/Thành"
                  required
                  variant="outlined"
                  value={profileDetails?.location?.province}
                  onChange={(event) => {
                    handleLocationChange("province", event.target.value);
                  }}
                  fullWidth
                >
                  {locations.map((v, index) => (
                    <MenuItem key={index} value={v.name}>
                      {v.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  select
                  id="district"
                  label="Quận/Huyện"
                  required
                  variant="outlined"
                  fullWidth
                  value={profileDetails?.location?.district}
                  onChange={(event) => {
                    handleLocationChange("district", event.target.value);
                  }}
                >
                  {districtList?.map((v, index) => (
                    <MenuItem key={index} value={v.name}>
                      {v.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  select
                  id="commune"
                  label="Xã/Phường"
                  required
                  variant="outlined"
                  fullWidth
                  value={profileDetails?.location?.commune}
                  onChange={(event) => {
                    handleLocationChange("commune", event.target.value);
                  }}
                >
                  {communeList?.map((v, index) => (
                    <MenuItem key={index} value={v.name}>
                      {v.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            sx={{ padding: "10px 50px", marginTop: "30px" }}
            onClick={() => handleUpdate()}
          >
            Cập nhật thông tin
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RecruiterEditProfile;
