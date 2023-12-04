import { useContext, useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import PropTypes from "prop-types";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

import { SetPopupContext } from "../../App";

import apiList from "../../lib/apiList";
import AuthService from "../../services/auth.service";
import UsersService from "../../services/user.service";
import LocationsService from "../../services/location.service";
import { Link, useLocation } from "react-router-dom";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const RecruiterEditProfile = (props) => {
  const authServ = new AuthService();
  const userServ = new UsersService();
  const locationServ = new LocationsService();

  const setPopup = useContext(SetPopupContext);
  const [locations, setLocations] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [communeList, setCommuneList] = useState([]);

  const initValue = {
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
  };

  const [inputErrorHandler, setInputErrorHandler] = useState({
    name: {
      vi_name: "Họ và tên",
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    companyName: {
      vi_name: "Tên doanh nghiệp",
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    companyMail: {
      vi_name: "Email doanh nghiệp",
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    bio: {
      vi_name: "Thông tin mô tả",
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
    location: {
      vi_name: "Địa chỉ trụ sở",
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

  const handleInput = (key, value) => {
    setProfileDetails({
      ...profileDetails,
      [key]: value,
    });
  };

  // Tab
  const [valueTab, setValueTab] = useState(0);
  const handleChangeTab = (event, newValue) => {
    setValueTab(newValue);
  };

  const handleLocationChange = (key, value) => {
    const location = { ...profileDetails.location, [key]: value };
    setProfileDetails({
      ...profileDetails,
      location,
    });
  };

  const handleUpdate = async () => {
    const tmpErrorHandler = {};
    console.log(profileDetails);
    Object.keys(inputErrorHandler).forEach((obj) => {
      console.log(profileDetails[obj]);
      const validLocation =
        obj === "location"
          ? Object.keys(profileDetails[obj] || {}).filter((i) => !!i).length ==
            4
          : true;

      if (
        inputErrorHandler[obj].required &&
        inputErrorHandler[obj].untouched &&
        (!validLocation || !profileDetails[obj])
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
        await userServ.update(updatedDetails);
        setPopup({
          open: true,
          severity: "success",
          message: "Cập nhật thành công!",
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

  let location = useLocation();
  let userId = location.pathname.slice(10);

  async function getUser() {
    const locations = await locationServ.getAll();
    setLocations(locations);
    const user = await authServ.get();
    setProfileDetails(user);
  }

  useEffect(() => {
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
    <Paper sx={{ minHeight: "93vh" }}>
      <Grid
        sx={{ padding: "100px" }}
        container
        item
        direction="column"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="h2">Quản lý tài khoản</Typography>
        </Grid>

        {profileDetails?.level > 0 ? null : (
          <Typography
            variant="h7"
            textAlign="center"
            sx={{ color: "red", mt: 2 }}
          >
            Bạn cần cập nhật các thông tin bắt buộc bên dưới để sử dụng hệ
            thống!
          </Typography>
        )}
        {/* --Noi dung-- */}
        <Grid container item>
          <Grid item xs={2}>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={valueTab}
              onChange={handleChangeTab}
              aria-label="Vertical tabs example"
              sx={{ borderRight: 1, borderColor: "divider", marginTop: "60px" }}
            >
              <Tab label="Thông tin tài khoản" {...a11yProps(0)} />
              <Tab label="Cấp độ tài khoản" {...a11yProps(1)} />
              <Tab label="DS người follow bạn" {...a11yProps(2)} />
            </Tabs>
          </Grid>

          <Grid item xs={10}>
            {/* Tab1 */}
            <TabPanel value={valueTab} index={0}>
              <Grid
                container
                item
                xs={12}
                sx={{ width: "100%", marginTop: "50px" }}
              >
                <Grid
                  container
                  direction="column"
                  xs={12}
                  md={6}
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
                      onChange={(event) =>
                        handleInput("name", event.target.value)
                      }
                      onBlur={(event) => {
                        if (profileDetails?.name === "") {
                          handleInputError(
                            "name",
                            true,
                            "Họ và tên là bắt buộc"
                          );
                        } else {
                          handleInputError("name", false, "");
                        }
                      }}
                      error={inputErrorHandler.name.error}
                      inputErrorHandler={inputErrorHandler}
                      handleInputError={handleInputError}
                      required={true}
                      helperText={inputErrorHandler.name.message}
                      variant="outlined"
                      fullWidth
                      sx={{ width: "100%" }}
                    />
                  </Grid>

                  {/* Vị trí công tác */}
                  <Grid item>
                    <TextField
                      sx={{ width: "100%" }}
                      select
                      label="Vị trí công tác"
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

                  {/* Email */}
                  <Grid item>
                    <TextField
                      type="text"
                      sx={{ width: "100%", marginBottom: "50px" }}
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
                  xs={12}
                  md={6}
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
                      onBlur={(event) => {
                        if (profileDetails?.companyName === "") {
                          handleInputError(
                            "companyName",
                            true,
                            "Tên doanh nghiệp là bắt buộc"
                          );
                        } else {
                          handleInputError("companyName", false, "");
                        }
                      }}
                      error={inputErrorHandler.companyName.error}
                      inputErrorHandler={inputErrorHandler}
                      handleInputError={handleInputError}
                      required={true}
                      helperText={inputErrorHandler.companyName.message}
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
                      onBlur={(event) => {
                        if (profileDetails?.companyMail === "") {
                          handleInputError(
                            "companyMail",
                            true,
                            "Email doanh nghiệp là bắt buộc"
                          );
                        } else {
                          handleInputError("companyMail", false, "");
                        }
                      }}
                      error={inputErrorHandler.companyMail.error}
                      inputErrorHandler={inputErrorHandler}
                      handleInputError={handleInputError}
                      required={true}
                      helperText={inputErrorHandler.companyMail.message}
                      variant="outlined"
                      fullWidth
                      sx={{ width: "100%" }}
                    />
                  </Grid>
                  <Grid item container>
                    <Grid item xs={2}>
                      <Box
                        component="img"
                        sx={{
                          padding: "5px",
                          maxWidth: "100%",
                          boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
                        }}
                        alt="avt_company"
                        src={profileDetails?.avatar}
                      />
                    </Grid>
                    <Grid item xs={10}>
                      <TextField
                        label="Link Logo"
                        value={profileDetails?.avatar}
                        onChange={(event) =>
                          handleInput("avatar", event.target.value)
                        }
                        variant="outlined"
                        fullWidth
                        sx={{ width: "100%" }}
                      />
                    </Grid>
                  </Grid>
                  <Grid item>
                    <TextField
                      label="Website doanh nghiệp"
                      value={profileDetails?.website}
                      onChange={(event) =>
                        handleInput("website", event.target.value)
                      }
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
                      onBlur={(event) => {
                        if (profileDetails?.bio === "") {
                          handleInputError(
                            "bio",
                            true,
                            "Thông tin giới thiệu là bắt buộc"
                          );
                        } else {
                          handleInputError("bio", false, "");
                        }
                      }}
                      error={inputErrorHandler.bio.error}
                      inputErrorHandler={inputErrorHandler}
                      handleInputError={handleInputError}
                      required={true}
                      helperText={inputErrorHandler.bio.message}
                    />
                  </Grid>
                  <Grid
                    item
                    container
                    direction="column"
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <Grid item>
                      <PhoneInput
                        inputStyle={
                          inputErrorHandler.contactNumber.error
                            ? { width: "100%", border: "1px solid red" }
                            : {
                                width: "100%",
                                border: "1px solid hsl(0, 0%, 80%)",
                              }
                        }
                        placeholder="Số điện thoại"
                        country={"vn"}
                        value={profileDetails?.contactNumber}
                        inputProps={{
                          name: "Liên hệ",
                          required: true,
                        }}
                        onChange={(phone) => setPhone(phone)}
                        onBlur={(event) => {
                          if (profileDetails?.contactNumber === "") {
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
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="p"
                        className="react-select-msg-error"
                      >
                        {inputErrorHandler?.contactNumber.message}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item container>
                    <Grid item xs={3}>
                      <TextField
                        label="Tòa nhà, ấp,..."
                        type="text"
                        variant="outlined"
                        value={profileDetails?.location?.no}
                        onChange={(event) => {
                          handleLocationChange("no", event.target.value);
                        }}
                        fullWidth
                        onBlur={(event) => {
                          if (!profileDetails?.location?.no) {
                            handleInputError(
                              "location",
                              true,
                              "Địa chỉ trụ sở là bắt buộc"
                            );
                          } else {
                            handleInputError("location", false, "");
                          }
                        }}
                        error={inputErrorHandler.location.error}
                        inputErrorHandler={inputErrorHandler}
                        handleInputError={handleInputError}
                        required={true}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        select
                        id="province"
                        label="Tỉnh/Thành"
                        variant="outlined"
                        value={profileDetails?.location?.province}
                        onChange={(event) => {
                          handleLocationChange("province", event.target.value);
                        }}
                        fullWidth
                        onBlur={(event) => {
                          if (!profileDetails?.location?.province) {
                            handleInputError(
                              "location",
                              true,
                              "Địa chỉ trụ sở là bắt buộc"
                            );
                          } else {
                            handleInputError("location", false, "");
                          }
                        }}
                        error={inputErrorHandler.location.error}
                        inputErrorHandler={inputErrorHandler}
                        handleInputError={handleInputError}
                        required={true}
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
                        variant="outlined"
                        fullWidth
                        value={profileDetails?.location?.district}
                        onChange={(event) => {
                          handleLocationChange("district", event.target.value);
                        }}
                        onBlur={(event) => {
                          if (!profileDetails?.location?.district) {
                            handleInputError(
                              "location",
                              true,
                              "Địa chỉ trụ sở là bắt buộc"
                            );
                          } else {
                            handleInputError("location", false, "");
                          }
                        }}
                        error={inputErrorHandler.location.error}
                        inputErrorHandler={inputErrorHandler}
                        handleInputError={handleInputError}
                        required={true}
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
                        variant="outlined"
                        fullWidth
                        value={profileDetails?.location?.commune}
                        onChange={(event) => {
                          handleLocationChange("commune", event.target.value);
                        }}
                        onBlur={(event) => {
                          if (!profileDetails?.location?.commune) {
                            handleInputError(
                              "location",
                              true,
                              "Địa chỉ trụ sở là bắt buộc"
                            );
                          } else {
                            handleInputError("location", false, "");
                          }
                        }}
                        error={inputErrorHandler.location.error}
                        inputErrorHandler={inputErrorHandler}
                        handleInputError={handleInputError}
                        required={true}
                      >
                        {communeList?.map((v, index) => (
                          <MenuItem key={index} value={v.name}>
                            {v.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Typography variant="p" className="react-select-msg-error">
                      {inputErrorHandler.location.message}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container xs={12} justifyContent="center">
                <Button
                  variant="contained"
                  sx={{ padding: "10px 50px", marginTop: "30px" }}
                  onClick={() => handleUpdate()}
                >
                  Cập nhật thông tin
                </Button>
              </Grid>
            </TabPanel>

            {/* Tab2 */}
            <TabPanel value={valueTab} index={1}>
              <Grid item>
                <Typography variant="p">Xin chào,</Typography>
                <br />
                <Typography variant="p" sx={{ fontWeight: "bold" }}>
                  {profileDetails?.name}
                </Typography>
                <br />
                <Typography variant="p" sx={{ fontWeight: "bold" }}>
                  {profileDetails?.companyName}
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
                  {profileDetails?.credit}{" "}
                  <PaidIcon sx={{ color: "#FFB000" }} />
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
            </TabPanel>
            <TabPanel value={valueTab} index={2}>
              <Grid
                item
                sx={{
                  padding: "20px",
                  mt: 4,
                }}
              >
                <Typography variant="h6">Người dùng đang follow bạn</Typography>
                {profileDetails?.follower !== ""
                  ? profileDetails?.follower?.map((v, key) => (
                      // TODO
                      <Grid item>Nguyen Van A</Grid>
                    ))
                  : null}
              </Grid>
            </TabPanel>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RecruiterEditProfile;
