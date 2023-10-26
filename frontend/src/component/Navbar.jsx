import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Typography,
  Button,
  Container,
  Grid,
  TextField,
  Box,
  IconButton,
  InputAdornment,
  Input,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { useHistory } from "react-router-dom";
import isAuth, { userType } from "../lib/isAuth";

import LOGO from "../assets/logo_Hitern.png";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { Fragment, useState } from "react";

const Navbar = (props) => {
  let history = useHistory();
  const [searchInput, setSearchInput] = useState("");

  const handleClick = (location) => {
    console.log(location);
    history.push(location);
  };

  // Underline Tab
  const [value, setValue] = useState();

  return (
    <Container maxWidth="lg">
      {/* <Box> */}
      <AppBar
        position="fixed"
        sx={{
          padding: "10px 0",
          backgroundColor: "common.white",
          width: "100%",
          boxShadow:
            "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
        }}
      >
        <Toolbar>
          <Typography variant="h6">
            <Link to="/">
              <img className="logo" src={LOGO} alt="logo" />
            </Link>
          </Typography>
          {isAuth() ? (
            userType() === "recruiter" ? (
              <>
                <Tabs>
                  <Tab
                    label="Việc làm"
                    onClick={() => handleClick("/viec-lam")}
                  />

                  <Tab
                    label="Thêm việc làm"
                    onClick={() => handleClick("/dang-tin")}
                  />

                  <Tab
                    label="DS việc làm"
                    onClick={() => handleClick("/cong-viec")}
                  />

                  <Tab
                    label="DS Ứng cử viên"
                    onClick={() => handleClick("/ds-dang-thuc-tap")}
                  />
                </Tabs>
                {/* Right Nav */}
                <Grid
                  item
                  sx={{
                    marginLeft: "auto",
                    border: "1px solid #000",
                    borderRadius: "30px",
                    padding: "0 0 0 20px",
                    maxWidth: "400px",
                  }}
                >
                  <Input
                    placeholder="Tìm kiếm"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    onKeyPress={(ev) => {
                      if (ev.key === "Enter") {
                        history.push({
                          pathname: "/tim-kiem",
                          search: `?search=${searchInput}`,
                        });
                      }
                    }}
                  />

                  <IconButton
                    sx={{
                      borderRadius: "50%",
                      backgroundColor: "primary.main",
                      color: "common.white",
                      marginLeft: "10px",
                    }}
                    onClick={() =>
                      history.push({
                        pathname: "/tim-kiem",
                        search: `?search=${searchInput}`,
                      })
                    }
                  >
                    <SearchIcon />
                  </IconButton>
                </Grid>
                <IconButton
                  sx={{
                    marginLeft: "20px",
                  }}
                >
                  <NotificationsIcon />
                </IconButton>
                <Button
                  variant="contained"
                  sx={{ marginLeft: "10px" }}
                  onClick={() => handleClick("/ho-so")}
                >
                  Hồ sơ
                </Button>
                <Button
                  variant="contained"
                  sx={{ marginLeft: "10px" }}
                  onClick={() => handleClick("/dang-xuat")}
                >
                  Đăng xuất
                </Button>
              </>
            ) : (
              // Applicant
              <>
                <Tabs
                  value={value}
                  TabIndicatorProps={{
                    style: {
                      backgroundColor: "#48884A",
                    },
                  }}
                  onChange={(e, value) => setValue(value)}
                >
                  <Tab
                    label=" Việc làm"
                    onClick={() => handleClick("/viec-lam")}
                  />
                  <Tab
                    label="Công ty"
                    onClick={() => handleClick("/cong-ty")}
                  />
                  <Tab
                    label="Tin tức"
                    onClick={() => handleClick("/tin-tuc")}
                  />
                  <Tab
                    label="Nộp đơn"
                    onClick={() => handleClick("/ung-vien")}
                  />
                </Tabs>
                {/* Right Nav */}
                <Grid
                  item
                  sx={{
                    marginLeft: "auto",
                    border: "1px solid #000",
                    borderRadius: "30px",
                    padding: "0 0 0 20px",
                    maxWidth: "400px",
                  }}
                >
                  <Input
                    placeholder="Tìm kiếm"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    onKeyPress={(ev) => {
                      if (ev.key === "Enter") {
                        history.push({
                          pathname: "/tim-kiem",
                          search: `?search=${searchInput}`,
                        });
                      }
                    }}
                  />

                  <IconButton
                    sx={{
                      borderRadius: "50%",
                      backgroundColor: "primary.main",
                      color: "common.white",
                      marginLeft: "10px",
                    }}
                    onClick={() =>
                      history.push({
                        pathname: "/tim-kiem",
                        search: `?search=${searchInput}`,
                      })
                    }
                  >
                    <SearchIcon />
                  </IconButton>
                </Grid>
                <IconButton
                  sx={{
                    marginLeft: "20px",
                  }}
                >
                  <NotificationsIcon />
                </IconButton>
                <Button
                  sx={{
                    marginLeft: "20px",
                  }}
                  variant="contained"
                  onClick={() => handleClick("/ho-so")}
                >
                  Hồ sơ
                </Button>

                <Button
                  sx={{
                    marginLeft: "10px",
                  }}
                  variant="contained"
                  onClick={() => handleClick("/dang-xuat")}
                >
                  Đăng xuất
                </Button>
              </>
            )
          ) : (
            <>
              <Button
                sx={{
                  marginLeft: "auto",
                }}
                variant="outlined"
                onClick={() => handleClick("/dang-nhap")}
              >
                Đăng nhập
              </Button>
              <Button
                sx={{
                  margin: "0 0 0 20px",
                }}
                variant="contained"
                onClick={() => handleClick("/dang-ky")}
              >
                Đăng ký tài khoản mới
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      {/* </Box> */}
    </Container>
  );
};

export default Navbar;
