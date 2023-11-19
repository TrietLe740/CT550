import { useHistory, Link } from "react-router-dom";
import { useState } from "react";
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
  Badge,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";

import isAuth, { userType } from "../lib/isAuth";

import LOGO from "../assets/logo_Hitern.png";
import AuthService from "../services/auth.service";
import { useEffect } from "react";

const Navbar = (props) => {
  let history = useHistory();
  const [searchInput, setSearchInput] = useState("");
  const authServ = new AuthService();

  const [user, setUser] = useState();

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

  useEffect(() => {
    async function getUser() {
      const auth = await authServ.get();
      setUser(auth);
      console.log(auth);
    }
    getUser();
  }, []);

  return (
    <AppBar
      position="static"
      sx={{
        padding: "10px 20px",
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
            {/* <Link to="/">
              <img className="logo" src={LOGO} alt="logo" />
            </Link> */}
            <Grid
              item
              sx={{
                margin: "0 auto",
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
                <IconButton
                  sx={{
                    marginLeft: "20px",
                    marginRight: "10px",
                  }}
                >
                  <Badge badgeContent={17} color="error">
                    {/* Thong bao */}
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <Tooltip>
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{
                      border: "1px solid",
                      borderColor: "primary.main",
                      padding: "5px 5px 5px 15px",
                      borderRadius: "30px",
                      backgroundColor: "primary.main",
                    }}
                  >
                    <Typography
                      variant="h8"
                      sx={{
                        textAlign: "left",
                        fontWeight: "bold",
                        fontSize: "12px",
                        marginRight: "10px",
                        color: "common.white",
                      }}
                    >
                      Xin chào!
                      <br />
                      {user?.name}
                    </Typography>
                    <Avatar
                      sx={{ border: "1px solid", borderColor: "primary.light" }}
                      alt="Remy Sharp"
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
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography
                      textAlign="center"
                      onClick={() => handleClick("/ho-so/chinh-sua")}
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
