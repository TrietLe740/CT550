import { useContext, useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { SetPopupContext } from "../App";

import AuthService from "../services/auth.service";
import UsersService from "../services/user.service";
import JobsService from "../services/jobs.service";

import EditIcon from "@mui/icons-material/Edit";
import { Link, useLocation } from "react-router-dom";
import JobCard from "../component/JobCard";

const CompanyDetailPage = (props) => {
  const [jobs, setJobs] = useState([]);

  let location = useLocation();
  let path = location.pathname.split("/");
  let id = path[path.length - 1];
  const setPopup = useContext(SetPopupContext);

  const [profileDetails, setProfileDetails] = useState({
    name: "",
    bio: "",
    contactNumber: "",
  });
  const authServ = new AuthService();
  const userServ = new UsersService();
  const jobServ = new JobsService();

  async function getUser() {
    const user = await userServ.get(id);
    setProfileDetails(user);
  }

  useEffect(() => {
    getUser();
  }, []);

  async function getJob() {
    getUser();
    const job = await jobServ.getAll();
    const list = [];
    for (let i = 0; i < job.length; i++) {
      if (job[i].userId === profileDetails?.userId) {
        list[i] = job[i];
      }
    }
    setJobs(list);
  }

  useEffect(() => {
    getJob();
  }, []);

  return (
    <Paper sx={{ padding: { md: "100px", xs: "0px" } }}>
      <Grid
        container
        direction="column"
        sx={{
          boxShadow:
            "0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)",
          margin: "0 auto",
          borderRadius: "30px",
        }}
      >
        {/* Giới thiệu */}
        <Grid
          item
          container
          justifyContent="center"
          sx={{
            width: "100%",
            borderRadius: { md: "30px 30px 0 0", xs: "0" },
            color: "common.white",
            backgroundColor: "primary.main",
          }}
        >
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              padding: { md: "20px 0 20px 50px", xs: "50px 0 10px 0" },
            }}
          >
            <Avatar
              sx={{
                width: { lg: "200px", xs: "100px" },
                height: { lg: "200px", xs: "100px" },
                border: "3px solid",
                margin: { xs: "0 auto" },
              }}
              src={profileDetails?.avatar}
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={9}
            sx={{
              padding: "20px 0 0 0",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                mb: 2,
                typography: { xs: "h4", md: "h2" },
              }}
            >
              {profileDetails?.companyName} <br />
            </Typography>
            <Typography variant="p">
              Website: {profileDetails?.website} <br />
            </Typography>
            <Typography variant="p">
              Số điện thoại: {profileDetails?.contactNumber} <br />
            </Typography>
            <Button
              sx={{ backgroundColor: "common.white", mt: 2, mb: 3 }}
              variant="outlined"
              onClick={() => {
                // TODO
              }}
            >
              <AddIcon /> Theo dõi
            </Button>
          </Grid>
        </Grid>
        {/* Thông tin */}
        <Grid
          item
          container
          sx={{
            width: "100%",
            borderRadius: "0 0 30px 30px",
            color: "common.black",
            padding: "30px 50px",
          }}
        >
          <Grid
            item
            xs={12}
            md={9}
            container
            sx={{
              padding: "20px",
            }}
          >
            <Grid item>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Giới thiệu công ty
              </Typography>
              <Grid item sx={{ padding: "10px 20px 10px 0" }}>
                <Typography variant="p" xs={{ textAlign: "justify" }}>
                  {profileDetails?.bio}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              padding: "20px",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Thông tin liên hệ
            </Typography>
            <Typography variant="p">
              Địa chỉ:{" "}
              {`${profileDetails?.location?.no}, ${profileDetails?.location?.commune}, ${profileDetails?.location?.district}, ${profileDetails?.location?.province}`}
            </Typography>
          </Grid>
        </Grid>
        <Grid item container sx={{ padding: "10px 50px" }}>
          <Grid item>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Tuyển dụng
            </Typography>
          </Grid>
          <Grid item container sx={{ mb: 5 }}>
            {jobs.length > 0
              ? jobs.map((job) => {
                  return (
                    <Grid item container>
                      <JobCard job={job} />
                    </Grid>
                  );
                })
              : null}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CompanyDetailPage;
