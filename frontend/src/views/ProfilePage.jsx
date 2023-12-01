import { useContext, useEffect, useState } from "react";
import { Grid, Typography, Paper, Avatar, IconButton } from "@mui/material";

import { SetPopupContext } from "../App";

import AuthService from "../services/auth.service";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";

const Profile = (props) => {
  const setPopup = useContext(SetPopupContext);

  const [profileDetails, setProfileDetails] = useState({
    name: "",
    bio: "",
    contactNumber: "",
  });
  const authServ = new AuthService();

  useEffect(() => {
    async function getUser() {
      const user = await authServ.get();
      setProfileDetails(user);
    }
    getUser();
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
          }}
        >
          <Grid item xs={3} sx={{ padding: "20px 0 20px 50px" }}>
            <Avatar
              sx={{ width: "200px", height: "200px", border: "3px solid" }}
              src={profileDetails?.avatar}
            />
          </Grid>
          <Grid item xs={8} sx={{ padding: "20px 0 0 0" }}>
            <Typography variant="h3" sx={{ fontWeight: "bold" }}>
              {profileDetails?.name}
            </Typography>
            <p>Ngành: {profileDetails?.major}</p>
            <p>Số điện thoại: {profileDetails?.contactNumber}</p>
          </Grid>
          {/* <Grid item xs={1}>
            <Link to={`/ho-so/chinh-sua`}>
              <IconButton
                variant="contained"
                sx={{
                  marginTop: "20px",
                  marginRight: "50px",
                  color: "common.white",
                }}
              >
                <EditIcon />
              </IconButton>
            </Link>
          </Grid> */}
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
          <Grid item xs={3} sx={{ padding: "20px 0 20px 50px" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              HỌC VẤN
            </Typography>
            <p>
              {profileDetails?.education?.map((value) => {
                {
                  `Trường ${value.institutionName}`;
                }
                {
                  `Khóa ${value.startYear} - ${value.endYear}`;
                }
                <br />;
              })}
            </p>
            <br />
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              HOẠT ĐỘNG
            </Typography>
            <p>
              {profileDetails?.activities?.map((value) => {
                {
                  value;
                }
                <br />;
              })}
            </p>
            <br />
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              CHỨNG CHỈ
            </Typography>
            <p>
              {profileDetails?.certificates?.map((value) => {
                {
                  value;
                }
                <br />;
              })}
            </p>
            <br />
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              GIẢI THƯỞNG
            </Typography>
            <p>
              {profileDetails?.awards?.map((value) => {
                {
                  value;
                }
                <br />;
              })}
            </p>
          </Grid>
          <Grid item xs={9} sx={{ padding: "20px 0 0 0" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              MỤC TIÊU NGHỀ NGHIỆP
            </Typography>
            <p>{profileDetails?.target}</p>
            <br />
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              SỞ THÍCH
            </Typography>
            <p>{profileDetails?.interest}</p>
            <br />
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              KINH NGHIỆM LÀM VIỆC/SẢN PHẨM THỰC HIỆN
            </Typography>
            <p>{profileDetails?.exp}</p>
            <br />
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
