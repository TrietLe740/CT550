import { useHistory } from "react-router-dom";
import { useState } from "react";
import {
  Link,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Box,
  IconButton,
  Input,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
  Badge,
  Popover,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";

import isAuth, { userType } from "../lib/isAuth";
import PubSub from "pubsub-js";

import LOGO from "../assets/logo_Hitern.png";
import LOGO2 from "../assets/logo_Hitern2.png";
import AuthService from "../services/auth.service";
import { useEffect } from "react";

const Navbar = (props) => {
  let history = useHistory();
  const [searchInput, setSearchInput] = useState("");
  const authServ = new AuthService();

  const [user, setUser] = useState();

  const handleClick = (location) => {
    history.push(location);
  };

  const [value, setValue] = useState();

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClickNoti = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseNoti = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    async function getUser() {
      const auth = await authServ.get();
      setUser(auth);
    }
    getUser();
    // console.log("sub RELOAD_PROFILE");
    const sub = PubSub.subscribe("RELOAD_PROFILE", (msg, data) => {
      getUser();
    });
    return () => {
      PubSub.unsubscribe(sub);
    };
  }, []);

  return (
    <AppBar
      position="static"
      sx={{
        padding: "10px 0px",
        backgroundColor: "common.white",
        color: "common.black",
        boxShadow:
          "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {userType() === "admin" ? (
            // Admin
            <Link
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                cursor: "pointer",
              }}
              onClick={() => handleClick("/admin/bang-dieu-khien")}
            >
              <img className="logo" src={LOGO2} alt="logo" />
            </Link>
          ) : (
            // Recruiter & Applicant
            <Link
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                cursor: "pointer",
              }}
              onClick={() => handleClick("/")}
            >
              <img className="logo" src={LOGO} alt="logo" />
            </Link>
          )}

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon sx={{ marginRight: "30px" }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {isAuth() ? (
                userType() === "recruiter" ? (
                  <Grid container item xs={7}>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography
                        textAlign="center"
                        onClick={() => handleClick("/viec-lam")}
                      >
                        Việc làm
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography
                        textAlign="center"
                        onClick={() => handleClick("/dang-tin")}
                      >
                        Thêm việc làm
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography
                        textAlign="center"
                        onClick={() => handleClick("/cong-viec")}
                      >
                        DS việc làm
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography
                        textAlign="center"
                        onClick={() => handleClick("/ds-dang-thuc-tap")}
                      >
                        DS Ứng cử viên
                      </Typography>
                    </MenuItem>
                  </Grid>
                ) : // Applicant
                userType() === "applicant" ? (
                  <>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography
                        textAlign="center"
                        onClick={() => handleClick("/viec-lam")}
                      >
                        Việc làm
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography
                        textAlign="center"
                        onClick={() => handleClick("/cong-ty")}
                      >
                        Công ty
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography
                        textAlign="center"
                        onClick={() => handleClick("/tin-tuc")}
                      >
                        Tin tức
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography
                        textAlign="center"
                        onClick={() => handleClick("/ung-vien")}
                      >
                        Đơn đã nộp
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography
                        textAlign="center"
                        onClick={() => handleClick("/ho-so")}
                      >
                        Hồ sơ
                      </Typography>
                    </MenuItem>
                  </>
                ) : (
                  // Admin
                  <>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography
                        textAlign="center"
                        onClick={() => handleClick("/admin/bang-dieu-khien")}
                      >
                        Bảng điều khiển
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography
                        textAlign="center"
                        onClick={() => handleClick("/admin/cong-ty")}
                      >
                        Công ty
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography
                        textAlign="center"
                        onClick={() => handleClick("/admin/thuc-tap-sinh")}
                      >
                        Thực tập sinh
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography
                        textAlign="center"
                        onClick={() => handleClick("/admin/cong-viec")}
                      >
                        Tìm kiếm công việc
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography
                        textAlign="center"
                        onClick={() => handleClick("/admin/tin-tuc")}
                      >
                        Tin tức
                      </Typography>
                    </MenuItem>
                    {/* <MenuItem onClick={handleCloseNavMenu}>
                      <Typography
                        textAlign="center"
                        onClick={() => handleClick("/admin/dich-vu")}
                      >
                        Gói dịch vụ
                      </Typography>
                    </MenuItem> */}
                  </>
                )
              ) : (
                <>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography
                      textAlign="center"
                      onClick={() => handleClick("/dang-nhap")}
                    >
                      Đăng nhập
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography
                      textAlign="center"
                      onClick={() => handleClick("/dang-ky")}
                    >
                      Đăng ký
                    </Typography>
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {/* Tìm kiếm */}
            {isAuth() ? (
              userType() === "recruiter" || userType() === "applicant" ? (
                <Grid
                  item
                  container
                  sx={{
                    margin: "0 auto",
                    border: "1px solid #000",
                    borderRadius: "30px",
                    padding: "0 0 0 10px",
                  }}
                >
                  <Grid item xs={9}>
                    <Input
                      placeholder="Tìm kiếm"
                      disableUnderline
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
                  </Grid>

                  <Grid item xs={3}>
                    <IconButton
                      sx={{
                        borderRadius: "50%",
                        backgroundColor: "primary.main",
                        color: "common.white",
                        marginLeft: "auto",
                        display: "flex",
                        justifyContent: "right",
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
                </Grid>
              ) : null
            ) : null}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {isAuth() ? (
              userType() === "recruiter" ? (
                <>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography
                      textAlign="center"
                      onClick={() => handleClick("/viec-lam")}
                    >
                      Việc làm
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography
                      textAlign="center"
                      onClick={() => handleClick("/dang-tin")}
                    >
                      Thêm việc làm
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography
                      textAlign="center"
                      onClick={() => handleClick("/cong-viec")}
                    >
                      DS việc làm
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography
                      textAlign="center"
                      onClick={() => handleClick("/ds-dang-thuc-tap")}
                    >
                      DS Ứng cử viên
                    </Typography>
                  </MenuItem>
                  {/* Right Nav */}
                  <Grid
                    item
                    container
                    sx={{
                      marginLeft: "auto",
                      marginRight: "20px",
                      border: "1px solid #000",
                      borderRadius: "30px",
                      padding: "0 0 0 20px",
                      maxWidth: "300px",
                    }}
                  >
                    <Grid item xs={9}>
                      <Input
                        placeholder="Tìm kiếm"
                        sx={{ height: "100%" }}
                        disableUnderline
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
                    </Grid>

                    <Grid item xs={3}>
                      <IconButton
                        sx={{
                          borderRadius: "50%",
                          backgroundColor: "primary.main",
                          color: "common.white",
                          marginLeft: "auto",
                          display: "flex",
                          justifyContent: "right",
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
                  </Grid>
                </>
              ) : userType() === "applicant" ? (
                userType() === "applicant" ? (
                  // Applicant
                  <>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography
                        textAlign="center"
                        onClick={() => handleClick("/viec-lam")}
                      >
                        Việc làm
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography
                        textAlign="center"
                        onClick={() => handleClick("/cong-ty")}
                      >
                        Công ty
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography
                        textAlign="center"
                        onClick={() => handleClick("/tin-tuc")}
                      >
                        Tin tức
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography
                        textAlign="center"
                        onClick={() => handleClick("/ung-vien")}
                      >
                        Đơn đã nộp
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography
                        textAlign="center"
                        onClick={() => handleClick("/ho-so")}
                      >
                        Hồ sơ
                      </Typography>
                    </MenuItem>
                    {/* Right Nav */}
                    <Grid
                      item
                      container
                      sx={{
                        marginLeft: "auto",
                        border: "1px solid #000",
                        borderRadius: "30px",
                        padding: "0 0 0 20px",
                        maxWidth: "400px",
                        display: "flex",
                        alignItem: "center",
                      }}
                    >
                      <Grid item xs={10}>
                        <Input
                          sx={{ height: "100%" }}
                          placeholder="Tìm kiếm"
                          disableUnderline
                          value={searchInput}
                          onChange={(event) =>
                            setSearchInput(event.target.value)
                          }
                          onKeyPress={(ev) => {
                            if (ev.key === "Enter") {
                              history.push({
                                pathname: "/tim-kiem",
                                search: `?search=${searchInput}`,
                              });
                            }
                          }}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        sx={{ display: "flex", justifyContent: "right" }}
                      >
                        <IconButton
                          sx={{
                            borderRadius: "50%",
                            backgroundColor: "primary.main",
                            color: "common.white",
                            marginLeft: "auto",
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
                    </Grid>
                  </>
                ) : (
                  <>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography
                        textAlign="center"
                        onClick={() => handleClick("/viec-lam")}
                      >
                        Việc làm
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography
                        textAlign="center"
                        onClick={() => handleClick("/cong-ty")}
                      >
                        Công ty
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography
                        textAlign="center"
                        onClick={() => handleClick("/tin-tuc")}
                      >
                        Tin tức
                      </Typography>
                    </MenuItem>
                  </>
                )
              ) : (
                // Admin
                <>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography
                      textAlign="center"
                      onClick={() => handleClick("/admin/bang-dieu-khien")}
                    >
                      Bảng điều khiển
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography
                      textAlign="center"
                      onClick={() => handleClick("/admin/cong-ty")}
                    >
                      Công ty
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography
                      textAlign="center"
                      onClick={() => handleClick("/admin/thuc-tap-sinh")}
                    >
                      Thực tập sinh
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography
                      textAlign="center"
                      onClick={() => handleClick("/admin/cong-viec")}
                    >
                      Công việc
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography
                      textAlign="center"
                      onClick={() => handleClick("/admin/tin-tuc")}
                    >
                      Tin tức
                    </Typography>
                  </MenuItem>
                  {/* <MenuItem onClick={handleCloseNavMenu}>
                    <Typography
                      textAlign="center"
                      onClick={() => handleClick("/admin/dich-vu")}
                    >
                      Gói dịch vụ
                    </Typography>
                  </MenuItem> */}
                </>
              )
            ) : (
              <>
                <MenuItem
                  sx={{ marginLeft: "auto" }}
                  onClick={handleCloseNavMenu}
                >
                  <Typography
                    textAlign="center"
                    onClick={() => handleClick("/dang-nhap")}
                  >
                    Đăng nhập
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography
                    textAlign="center"
                    onClick={() => handleClick("/dang-ky")}
                  >
                    Đăng ký
                  </Typography>
                </MenuItem>
              </>
            )}
          </Box>

          {isAuth() ? (
            userType() === "recruiter" ||
            userType() === "applicant" ||
            userType() === "admin" ? (
              <Box sx={{ flexGrow: 0 }}>
                <Grid container>
                  <Grid item container xs={6} sm={6} md={6} lg={4}>
                    <IconButton>
                      <Badge
                        badgeContent={user?.notification?.length}
                        color="error"
                      >
                        {/* Thong bao */}
                        <IconButton
                          aria-describedby={id}
                          variant="contained"
                          onClick={handleClickNoti}
                        >
                          <NotificationsIcon />
                        </IconButton>
                        <Popover
                          id={id}
                          open={open}
                          anchorEl={anchorEl}
                          onClose={handleCloseNoti}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                          sx={{ marginTop: "20px", maxHeight: "50vh" }}
                        >
                          <Grid container direction="column">
                            <Grid item sx={{ padding: "10px 20px 0 20px" }}>
                              <Typography variant="h6">
                                Thông báo của bạn
                              </Typography>
                            </Grid>
                            {user?.notification?.length > 0
                              ? user?.notification
                                  ?.slice(0)
                                  .reverse()
                                  .map((v) => {
                                    return (
                                      <Link
                                        sx={{ color: "common.black" }}
                                        href={v?.notification?.link}
                                        underline="none"
                                      >
                                        <Grid
                                          item
                                          sx={{
                                            maxWidth: "500px",
                                            padding: "10px 20px",
                                            backgroundColor: "primary.light",
                                            borderTop: "1px, solid #000",
                                          }}
                                        >
                                          <Typography
                                            variant="h6"
                                            sx={{ fontSize: "12pt" }}
                                          >
                                            {v?.notification?.title}
                                          </Typography>
                                          <Typography
                                            variant="p"
                                            sx={{ fontSize: "10pt" }}
                                          >
                                            {v?.notification?.desc}
                                          </Typography>
                                        </Grid>
                                      </Link>
                                    );
                                  })
                              : null}
                          </Grid>
                        </Popover>
                      </Badge>
                    </IconButton>
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={8}>
                    <Tooltip>
                      <IconButton
                        onClick={handleOpenUserMenu}
                        sx={{
                          border: "1px solid",
                          borderColor: {
                            xs: "common.white",
                            lg: "primary.main",
                          },
                          padding: "5px 5px 5px 5px",
                          borderRadius: "30px",
                          backgroundColor: {
                            xs: "common.white",
                            lg: "primary.main",
                          },
                        }}
                      >
                        <Typography
                          variant="h8"
                          sx={{
                            textAlign: "left",
                            fontWeight: "bold",
                            fontSize: { md: "12px" },
                            marginRight: "10px",
                            marginLeft: "10px",
                            color: "common.white",
                          }}
                          display={{ xs: "none", lg: "block" }}
                        >
                          Xin chào!
                          <br />
                          {user?.name}
                        </Typography>
                        <Avatar
                          sx={{
                            border: "1px solid",
                            borderColor: "primary.light",
                          }}
                          alt="avatar"
                          src={user?.avatar}
                        />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      sx={{ marginTop: "45px" }}
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                    >
                      {userType() !== "admin" ? (
                        <MenuItem onClick={handleCloseUserMenu}>
                          <Typography
                            textAlign="center"
                            onClick={() => handleClick("/ho-so/chinh-sua")}
                          >
                            Cài đặt thông tin cá nhân
                          </Typography>
                        </MenuItem>
                      ) : null}
                      <MenuItem onClick={handleCloseUserMenu}>
                        <Typography
                          textAlign="center"
                          onClick={() => handleClick("/dang-xuat")}
                        >
                          Đăng xuất
                        </Typography>
                      </MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
              </Box>
            ) : null
          ) : null}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
