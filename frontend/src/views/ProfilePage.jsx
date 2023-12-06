import { useContext, useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Box,
} from "@mui/material";

import { SetPopupContext } from "../App";

import AuthService from "../services/auth.service";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import ApplicationService from "../services/application.service";
import isAuth from "../lib/isAuth";

const Profile = (props) => {
  const setPopup = useContext(SetPopupContext);

  const [profileDetails, setProfileDetails] = useState({
    name: "",
    bio: "",
    contactNumber: "",
  });
  const [application, setApplication] = useState([]);
  const authServ = new AuthService();
  const applicationServ = new ApplicationService();

  useEffect(() => {
    async function getUser() {
      const user = await authServ.get();
      setProfileDetails(user);
    }

    // async function getApplication() {
    //   const
    // }
    getUser();
  }, []);

  return (
    <Paper sx={{ padding: "50px 100px" }}>
      <Grid
        container
        direction="column"
        sx={{
          boxShadow:
            "0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)",
          borderRadius: "30px",
          margin: "0 auto",
          maxWidth: "1312px",
          minHeight: "1538px",
        }}
      >
        <Grid
          item
          container
          sx={{
            backgroundColor: "primary.main",
            width: "100%",
            borderRadius: "30px 30px 0 0",
            color: "common.white",
            padding: "30px",
          }}
        >
          {isAuth ? (
            <Grid item xs={12}>
              <Link to={`/ho-so/chinh-sua`}>
                <IconButton
                  variant="contained"
                  sx={{
                    marginLeft: "auto",
                    display: "flex",
                    color: "common.white",
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Link>
            </Grid>
          ) : null}

          <Grid item xs={12} md={4}>
            <Avatar
              sx={{
                width: "200px",
                height: "200px",
                border: "3px solid",
                margin: "0 auto",
              }}
              src={profileDetails?.avatar}
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              padding: "20px 0 0 0",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: "bold" }}>
              {profileDetails?.name}
            </Typography>
            <p>Ngành: {profileDetails?.major}</p>
            <p>Số điện thoại: {profileDetails?.contactNumber}</p>
          </Grid>
        </Grid>
        <Grid
          item
          container
          sx={{
            width: "100%",
            borderRadius: "0 0 30px 30px",
            color: "common.black",
          }}
        >
          <Grid
            item
            container
            direction="column"
            xs={4}
            sx={{ padding: "20px 30px 20px 50px" }}
          >
            <Grid item>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 5 }}>
                HỌC VẤN
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="p" textAlign="justify">
                Sinh viên ngành {profileDetails?.major}
              </Typography>
            </Grid>
            <br />
            <Grid item container>
              <Grid item xs={12} md={8}>
                <Typography variant="p" textAlign="justify">
                  Trường {profileDetails?.school?.name}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  component="img"
                  sx={{
                    width: "100px",
                  }}
                  alt="logo"
                  src={profileDetails?.school?.logo_url}
                />
              </Grid>
            </Grid>
            <br />
          </Grid>
          <Grid item xs={8} sx={{ padding: "20px 0 0 0" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              LỊCH SỬ THỰC TẬP
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Profile;
