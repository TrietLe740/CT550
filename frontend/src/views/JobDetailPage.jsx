import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import apiList from "../lib/apiList";
import {
  Box,
  Button,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  Modal,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Link,
  Input,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useTheme } from "@mui/material/styles";
import { userType } from "../lib/isAuth";
import SwipeableViews from "react-swipeable-views";
import PropTypes from "prop-types";
import JobCard from "../component/JobCard";
import { SetPopupContext } from "../App";
import axios from "axios";
import FileUploadInput from "../component/FileUploadInput";

import UsersService from "../services/user.service";
import AuthService from "../services/auth.service";
import JobsService from "../services/jobs.service";
import UploadService from "../services/upload.sevice";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
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
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function JobDetailPage() {
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);
  const [sop, setSop] = useState("");

  const jobServ = new JobsService();
  const userServ = new UsersService();
  const authServ = new AuthService();
  const uploadServ = new UploadService();

  let location = useLocation();
  let jobId = location.pathname.slice(10);

  const [job, setJob] = useState();
  const [listJobConnect, setListJobConnect] = useState();

  const handleClose = () => {
    setOpen(false);
    setSop("");
  };

  async function getJob() {
    let dt = await jobServ.get(jobId);
    let listJob = await jobServ.getAll();
    let list = [];
    for (let i = 0; i < listJob.length; i++) {
      if (listJob[i].userId == dt.userId) {
        list[i] = listJob[i];
      }
    }
    setJob(dt);
    setListJobConnect(list);
  }

  useEffect(() => {
    getJob();
  }, []);

  const [company, setCompany] = useState();
  async function getCompany() {
    var us = await userServ.get(job.userId);
    setCompany(us);
    console.log(company);
  }
  useEffect(() => {
    getCompany();
  }, []);

  const [user, setUser] = useState();
  async function getAuth() {
    let auth = await authServ.get();
    setUser(auth);
  }
  useEffect(() => {
    getAuth();
  }, []);

  const dayPost = new Date(job?.dateOfPosting).toLocaleDateString("en-GB");
  const deadline = new Date(job?.deadline).toLocaleDateString("en-GB");

  // Tab
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    getCompany();
  };
  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const [resume, setResume] = useState(0);
  const handleChangeResume = (event) => {
    console.log(event.target.value);
    setResume(event.target.value);
  };

  // Apply button
  const handleApply = async (id) => {
    axios
      .post(
        `${apiList.jobs}/${job._id}/applications`,
        {
          sop: sop,
          resume: user.resume[resume],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        axios
          .post(
            `${apiList.user}/${user._id}`,
            {
              notification: {
                AID: user.userId,
                UID: user._id,
                title: "BẠN ĐÃ ỨNG TUYỂN VÀO MỘT CÔNG VIỆC",
                desc: `Đã gửi yêu cầu xin thực tập công việc ${job.title} đến nhà tuyển dụng ${company.companyName}`,
                type: "apply",
                link: "/ung-vien",
                createAt: "",
              },
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((response) => {
            console.log(response);
          })
          .catch((err) => {
            console.log(err.response);
          });

        axios
          .post(
            `${apiList.user}/${company._id}`,
            {
              notification: {
                AID: company.userId,
                UID: company._id,
                title: "BẠN CÓ ỨNG CỬ VIÊN MỚI",
                desc: `${user.name} đã xin thực tập công việc ${job.title} của bạn`,
                type: "apply",
                link: `/cong-viec/ung-vien/${job._id}`,
                createAt: "",
              },
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((response) => {
            console.log(response);
          })
          .catch((err) => {
            console.log(err.response);
          });
        handleClose();
      })
      .catch((err) => {
        console.log(err.response);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleClose();
      });
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

  return (
    <Paper sx={{ padding: "100px 200px", minHeight: "100vh" }}>
      <Grid container direction="column">
        <Grid
          item
          container
          sx={{
            padding: "30px",
            borderRadius: "30px",
            margin: "10px 0",
            boxShadow:
              "0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)",
          }}
        >
          <Grid xs={12} lg={3}>
            <Box
              component="img"
              sx={{
                width: "100%",
                padding: "10px",
              }}
              alt="avt_company"
              src="https://png.pngtree.com/template/20190317/ourlarge/pngtree-businessmanavataremployeesales-man-purple-business-logo-image_78692.jpg"
            />
          </Grid>
          <Grid
            xs={12}
            lg={9}
            container
            direction="column"
            sx={{ width: "100%", padding: "10px" }}
          >
            <Grid item>
              <Typography variant="h3" sx={{ fontWeight: "Bold" }}>
                {job?.title}
              </Typography>
              <br />
            </Grid>
            <Grid item>Địa điểm: {job?.location?.province}</Grid>
            <Grid item>Làm việc: {job?.jobType}</Grid>
            <Grid item>
              Thời hạn thực tập:{" "}
              {job?.duration > 0 ? `${job?.duration} Tháng` : `Linh hoạt`}
            </Grid>
            <Grid item>Hạn chót đăng ký: {deadline}</Grid>

            {/* Button */}
            <Grid item sx={{ marginTop: "20px" }}>
              <Button
                variant="contained"
                onClick={() => {
                  setOpen(true);
                }}
                disabled={userType() === "recruiter"}
              >
                Ứng tuyển
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid container>
          <Tabs
            value={value}
            onChange={handleChange}
            TabIndicatorProps={{
              style: {
                backgroundColor: "#48884A",
              },
            }}
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label="THÔNG TIN CHI TIẾT" {...a11yProps(0)} />
            <Tab label="THÔNG TIN CÔNG TY" {...a11yProps(1)} />
            <Tab label="DS VIỆC LÀM CỦA CÔNG TY" {...a11yProps(2)} />
          </Tabs>

          <Grid
            item
            container
            sx={{
              padding: "30px",
              borderRadius: "30px",
              margin: "10px 0",
              boxShadow:
                "0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)",
            }}
          >
            <SwipeableViews
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={value}
              onChangeIndex={handleChangeIndex}
            >
              <TabPanel value={value} index={0} dir={theme.direction}>
                <Grid item container>
                  <Grid item xs={12} lg={8}>
                    <Typography variant="p" sx={{ fontWeight: "bold" }}>
                      MÔ TẢ CÔNG VIỆC
                    </Typography>
                    <p>{job?.detail}</p>
                    <br />
                    <Typography variant="p" sx={{ fontWeight: "bold" }}>
                      ĐỊA ĐIỂM LÀM VIỆC
                    </Typography>
                    <p>
                      {`${job?.location?.no}, ${job?.location?.commune}, ${job?.location?.district}, ${job?.location?.province}`}
                    </p>
                    <br />
                    <Typography variant="p" sx={{ fontWeight: "bold" }}>
                      TRỢ PHÍ
                    </Typography>
                    <p>{job?.salary}</p>
                    <br />
                    <Typography variant="p" sx={{ fontWeight: "bold" }}>
                      HẠN NỘP HỒ SƠ
                    </Typography>
                    <p>{deadline}</p>

                    {/* Button */}
                    <Grid item xs={3}>
                      <Button
                        variant="contained"
                        onClick={() => {
                          setOpen(true);
                        }}
                        disabled={userType() === "recruiter"}
                      >
                        Ứng tuyển
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    lg={4}
                    sx={{
                      padding: "30px",
                      borderRadius: "30px",
                      margin: "10px 0",
                      backgroundColor: "primary.light",
                      maxHeight: "300px",
                    }}
                  >
                    <Typography variant="p" sx={{ fontWeight: "bold" }}>
                      NGÀY MỞ ĐĂNG KÝ
                    </Typography>
                    <p>{dayPost}</p>
                    <hr />
                    <Typography variant="p" sx={{ fontWeight: "bold" }}>
                      NGÀNH NGHỀ
                    </Typography>
                    <p>
                      {job?.majors.map((m) => (
                        <p>{m}</p>
                      ))}
                    </p>
                    <br />
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {company?.companyName}
                  <Link href={`/cong-ty/${company?._id}`} target="_blank">
                    <IconButton>
                      <OpenInNewIcon />
                    </IconButton>
                  </Link>
                </Typography>
                <br />
                <Typography variant="p" sx={{ fontWeight: "bold" }}>
                  Thông tin liên hệ: <br />
                </Typography>
                <Typography variant="p">{company?.contactNumber}</Typography>
                <br />
                <Typography variant="p" sx={{ fontWeight: "bold" }}>
                  Mô tả: <br />
                </Typography>
                <Typography variant="p">{company?.bio}</Typography>
              </TabPanel>
              <TabPanel value={value} index={2} dir={theme.direction}>
                {listJobConnect?.map((job) => {
                  return <JobCard sx={{ width: "100%" }} job={job} />;
                })}
              </TabPanel>
            </SwipeableViews>
          </Grid>
          <Grid item xs={12}>
            <Typography
              textAlign="center"
              variant="h5"
              sx={{ fontWeight: "bold", marginTop: "30px" }}
            >
              VIỆC LÀM LIÊN QUAN <br />
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      {/* Modal popup */}
      <Modal open={open} onClose={handleClose}>
        <Paper
          sx={{
            margin: "5px auto",
            padding: "20px",
            outline: "none",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            minWidth: "50%",
            maxWidth: "60%",
            alignItems: "center",
            borderRadius: "20px",
          }}
        >
          <TextField
            label="Gửi lời giới thiệu (Không quá 250 từ - Không bắt buộc)"
            multiline
            rows={8}
            sx={{ width: "100%", margin: "10px" }}
            variant="outlined"
            value={sop}
            onChange={(event) => {
              if (
                event.target.value.split(" ").filter(function (n) {
                  return n != "";
                }).length <= 250
              ) {
                setSop(event.target.value);
              }
            }}
          />

          <Typography variant="h5">Chọn CV ứng tuyển:</Typography>
          <Box
            sx={{
              border: "1px solid #000",
              width: "100%",
              padding: "10px 30px",
            }}
          >
            <Typography variant="h6">Kho CV của bạn:</Typography>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue={user?.resume?.[0]}
              value={resume}
              name="radio-buttons-group"
              onChange={handleChangeResume}
            >
              {user?.resume?.length > 0
                ? user?.resume?.map((v, i) => {
                    return (
                      <Grid container>
                        <Grid item xs={11}>
                          <FormControlLabel
                            value={i}
                            control={<Radio />}
                            label={v?.originalname}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <IconButton
                            key={i}
                            variant="contained"
                            onClick={() => {
                              handleDeleteCV(v.filename);
                            }}
                          >
                            <HighlightOffIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    );
                  })
                : null}
            </RadioGroup>
            <Grid item>
              <FileUploadInput />
            </Grid>
          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ padding: "10px 50px", marginTop: "20px" }}
            onClick={() => handleApply()}
          >
            Xác nhận
          </Button>
        </Paper>
      </Modal>
    </Paper>
  );
}
