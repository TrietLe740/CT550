import { useContext, useEffect, useState } from "react";
import { Grid, Typography, Paper, Avatar, IconButton } from "@mui/material";

import { SetPopupContext } from "../App";

import AuthService from "../services/auth.service";
import UsersService from "../services/user.service";
import EditIcon from "@mui/icons-material/Edit";
import { Link, useLocation } from "react-router-dom";

const CompanyDetailPage = (props) => {
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

  useEffect(() => {
    async function getUser() {
      const user = await userServ.get(id);
      console.log(user);
      setProfileDetails(user);
    }
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Paper sx={{ padding: "100px" }}>
      <Grid
        container
        direction="column"
        sx={{
          boxShadow:
            "0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)",
          borderRadius: "30px",
          margin: "0 auto",
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
          }}
        >
          <Grid item xs={3} sx={{ padding: "20px 0 20px 50px" }}>
            <Avatar
              sx={{ width: "200px", height: "200px", border: "3px solid" }}
              // src={profileDetails?.avatar}
              src="https://png.pngtree.com/template/20190317/ourlarge/pngtree-businessmanavataremployeesales-man-purple-business-logo-image_78692.jpg"
            />
          </Grid>
          <Grid item xs={8} sx={{ padding: "20px 0 0 0" }}>
            <Typography variant="h3" sx={{ fontWeight: "bold" }}>
              {profileDetails?.companyName}
            </Typography>
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
          <Grid item xs={9} sx={{ padding: "20px 0 20px 50px" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Giới thiệu công ty
            </Typography>
          </Grid>
          <Grid item xs={3} sx={{ padding: "20px 0 0 0" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Thông tin liên hệ
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CompanyDetailPage;
