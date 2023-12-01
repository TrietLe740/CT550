import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { Button, Grid, IconButton, Typography } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import GroupIcon from "@mui/icons-material/Group";
import WorkIcon from "@mui/icons-material/Work";

import UsersService from "../../services/user.service";
import JobsService from "../../services/jobs.service";

export default function AdminDashBoardPage() {
  let history = useHistory();
  const userServ = new UsersService();
  const jobsServ = new JobsService();
  const [companyList, setCompanyList] = useState([]);
  const [internList, setInternList] = useState([]);
  const [jobList, setJobList] = useState([]);
  const [jobs, setJobs] = useState([]);

  const handleClick = (location) => {
    history.push(location);
  };

  useEffect(() => {
    async function getData() {
      let usersData = await userServ.getAll();
      let jobsData = await jobsServ.getAll();
      const companies = [];
      const interns = [];

      for (let i = 0; i < usersData.length; i++) {
        if (usersData[i].type === "recruiter") {
          companies[i] = usersData[i];
        }
        if (usersData[i].type === "applicant") {
          interns[i] = usersData[i];
        }
      }

      setCompanyList(companies);
      setInternList(interns);
      setJobList(jobsData);
    }
    getData();
  }, []);

  return (
    <Grid container sx={{ padding: "20px 100px" }} direction="column">
      <Grid item container>
        {/* COMPANY */}
        <Grid item xs={3} sx={{ padding: "10px" }}>
          <Button
            sx={{
              width: "100%",
              backgroundColor: "secondary.main",
              color: "common.white",
              borderRadius: "10px",
            }}
            onClick={() => handleClick("/admin/cong-ty")}
          >
            <Grid item container>
              <Grid item xs={4} sx={{ padding: "15% 0" }}>
                <BusinessIcon />
              </Grid>
              <Grid item xs={8} container direction="column">
                <Typography variant="h8">
                  <br />
                  Công ty
                </Typography>
                <Typography variant="h3">{companyList?.length}</Typography>
              </Grid>
            </Grid>
          </Button>
        </Grid>

        {/* INTERN */}
        <Grid item xs={3} sx={{ padding: "10px" }}>
          <Button
            sx={{
              width: "100%",
              backgroundColor: "secondary.main",
              color: "common.white",
              borderRadius: "10px",
            }}
            onClick={() => handleClick("/admin/thuc-tap-sinh")}
          >
            <Grid item container>
              <Grid item xs={4} sx={{ padding: "15% 0" }}>
                <GroupIcon />
              </Grid>
              <Grid item xs={8} container direction="column">
                <Typography variant="h8">
                  <br />
                  Thực tập sinh
                </Typography>
                <Typography variant="h3">{internList?.length}</Typography>
              </Grid>
            </Grid>
          </Button>
        </Grid>

        {/* JOB */}
        <Grid item xs={3} sx={{ padding: "10px" }}>
          <Button
            sx={{
              width: "100%",
              backgroundColor: "secondary.main",
              color: "common.white",
              borderRadius: "10px",
            }}
            onClick={() => handleClick("/admin/tim-kiem-cong-viec")}
          >
            <Grid item container>
              <Grid item xs={4} sx={{ padding: "15% 0" }}>
                <WorkIcon />
              </Grid>
              <Grid item xs={8} container direction="column">
                <Typography variant="h8">
                  <br />
                  Việc thực tập
                </Typography>
                <Typography variant="h3">{jobList?.length}</Typography>
              </Grid>
            </Grid>
          </Button>
        </Grid>

        {/* ... */}
        <Grid item xs={3} sx={{ padding: "10px" }}>
          <Button
            sx={{
              width: "100%",
              backgroundColor: "secondary.main",
              color: "common.white",
              borderRadius: "10px",
            }}
          >
            <Grid item container>
              <Grid item xs={4} sx={{ padding: "15% 0" }}>
                <WorkIcon />
              </Grid>
              <Grid item xs={8} container direction="column">
                <Typography variant="h8">
                  <br />
                  ...
                </Typography>
                {/* <Typography variant="h3">{jobList?.length}</Typography> */}
              </Grid>
            </Grid>
          </Button>
        </Grid>
      </Grid>
      <Grid item container>
        Biểu đồ
      </Grid>
    </Grid>
  );
}
