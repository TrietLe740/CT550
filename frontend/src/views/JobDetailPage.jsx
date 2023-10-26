import React, { useEffect, useState } from "react";
// import axios from "axios";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
// import apiList from "../lib/apiList";
import { Box, Button, Grid, Paper, Tab, Tabs, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { userType } from "../lib/isAuth";
import JobsService from "../services/jobs.service";
import SwipeableViews from "react-swipeable-views";
import PropTypes from "prop-types";

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
  const jobServ = new JobsService();

  let location = useLocation();
  let jobId = location.pathname.slice(10);

  const [job, setJob] = useState();

  async function getJob() {
    var dt = await jobServ.get(jobId);
    setJob(dt);
  }

  useEffect(() => {
    getJob();
  }, []);

  const dayPost = new Date(job?.dateOfPosting).toLocaleDateString();
  const deadline = new Date(job?.deadline).toLocaleDateString();

  // Tab
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeIndex = (index) => {
    setValue(index);
  };

  // Apply button
  const handleApply = () => {
    // axios
    //   .post(
    //     `${apiList.jobs}/${job._id}/applications`,
    //     {
    //       sop: sop,
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //       },
    //     }
    //   )
    //   .then((response) => {
    //     setPopup({
    //       open: true,
    //       severity: "success",
    //       message: response.data.message,
    //     });
    //     handleClose();
    //   })
    //   .catch((err) => {
    //     console.log(err.response);
    //     setPopup({
    //       open: true,
    //       severity: "error",
    //       message: err.response.data.message,
    //     });
    //     handleClose();
    //   });
  };

  //   useEffect(() => {
  //     getData();
  //   }, []);

  //   const getData = () => {
  //     let address = apiList.jobs;
  //     address = `${address}/${location.pathname.slice(10)}`;
  //     console.log(address);

  //     axios
  //       .get(address, {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       })
  //       .then((response) => {
  //         console.log(response.data);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         setPopup({
  //           open: true,
  //           severity: "error",
  //           message: "Error",
  //         });
  //       });
  //   };

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
          <Grid xs={3}>
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
            xs={9}
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
            <Grid item>Địa điểm thực tập: {job?.place}</Grid>
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
                  handleApply();
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
            <Tab label="VIỆC LÀM KHÁC TỪ CÔNG TY" {...a11yProps(2)} />
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
                  <Grid item xs={8}>
                    <Typography variant="p" sx={{ fontWeight: "bold" }}>
                      MÔ TẢ CÔNG VIỆC
                    </Typography>
                    <p>
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                      Quae adipisci similique fugiat commodi esse dolores quo
                      nulla corrupti. Reprehenderit perferendis culpa aliquid
                      aperiam, saepe explicabo a dolores eligendi consequatur
                      ea.
                    </p>
                    <br />
                    <Typography variant="p" sx={{ fontWeight: "bold" }}>
                      YÊU CẦU CÔNG VIỆC
                    </Typography>
                    <p>
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                      Quae adipisci similique fugiat commodi esse dolores quo
                      nulla corrupti. Reprehenderit perferendis culpa aliquid
                      aperiam, saepe explicabo a dolores eligendi consequatur
                      ea.
                    </p>
                    <br />
                    <Typography variant="p" sx={{ fontWeight: "bold" }}>
                      ĐỊA ĐIỂM LÀM VIỆC
                    </Typography>
                    <p>
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                      Quae adipisci similique fugiat commodi esse dolores quo
                      nulla corrupti. Reprehenderit perferendis culpa aliquid
                      aperiam, saepe explicabo a dolores eligendi consequatur
                      ea.
                    </p>
                    <br />
                    <Typography variant="p" sx={{ fontWeight: "bold" }}>
                      QUYỀN LỢI
                    </Typography>
                    <p>
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                      Quae adipisci similique fugiat commodi esse dolores quo
                      nulla corrupti. Reprehenderit perferendis culpa aliquid
                      aperiam, saepe explicabo a dolores eligendi consequatur
                      ea.
                    </p>
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
                          handleApply();
                        }}
                        disabled={userType() === "recruiter"}
                      >
                        Ứng tuyển
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={4}
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
                Item Two
              </TabPanel>
              <TabPanel value={value} index={2} dir={theme.direction}>
                Item Three
              </TabPanel>
            </SwipeableViews>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
