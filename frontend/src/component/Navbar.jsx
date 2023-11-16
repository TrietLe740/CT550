import {
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";

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

  return (
    <AppBar
      position="static"
      sx={{
        padding: "10px 0",
        backgroundColor: "common.white",
        color: "common.black",
        width: "100%",
        boxShadow:
          "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Link to="/">
              <img className="logo" src={LOGO} alt="logo" />
            </Link>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
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
                      ></Typography>
                      Thêm việc làm
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
                  </>
                ) : (
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
                      ></Typography>
                      Công ty
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
                        Nộp đơn
                      </Typography>
                    </MenuItem>
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
            <Link to="/">
              <img className="logo" src={LOGO} alt="logo" />
            </Link>
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
                      marginRight: "10px",
                    }}
                  >
                    <NotificationsIcon />
                  </IconButton>
                </>
              ) : (
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
                    ></Typography>
                    Công ty
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
                      Nộp đơn
                    </Typography>
                  </MenuItem>
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
                      marginRight: "10px",
                    }}
                  >
                    <NotificationsIcon />
                  </IconButton>
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
            userType() === "recruiter" || userType() === "applicant" ? (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/2.jpg"
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
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
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography
                      textAlign="center"
                      onClick={() => handleClick("/ho-so")}
                    >
                      Hồ sơ
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography
                      textAlign="center"
                      onClick={() => handleClick("/dang-xuat")}
                    >
                      Đăng xuất
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
