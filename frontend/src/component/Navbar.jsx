import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

import isAuth, { userType } from "../lib/isAuth";

import LOGO from "../assets/logo_Hitern.png";
import { Link } from "react-router-dom/cjs/react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Navbar = (props) => {
  const classes = useStyles();
  let history = useHistory();

  const handleClick = (location) => {
    console.log(location);
    history.push(location);
  };

  return (
    <AppBar className={classes.root} position="fixed">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          <Link to="/">
            <img className="logo" src={LOGO} alt="logo" />
          </Link>
        </Typography>
        {isAuth() ? (
          userType() === "recruiter" ? (
            <>
              <Button color="black" onClick={() => handleClick("/viec-lam")}>
                Việc làm
              </Button>
              <Button color="black" onClick={() => handleClick("/cong-viec")}>
                DS việc làm
              </Button>
              <Button color="black" onClick={() => handleClick("/ung-vien")}>
                DS Ứng cử viên
              </Button>
              <Button color="black" onClick={() => handleClick("/ho-so")}>
                Hồ sơ
              </Button>
              <Button color="black" onClick={() => handleClick("/dang-xuat")}>
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Button color="black" onClick={() => handleClick("/viec-lam")}>
                Việc làm
              </Button>
              <Button color="black" onClick={() => handleClick("/ung-vien")}>
                Nộp đơn
              </Button>
              <Button color="black" onClick={() => handleClick("/ho-so")}>
                Hồ sơ
              </Button>
              <Button color="black" onClick={() => handleClick("/dang-xuat")}>
                Đăng xuất
              </Button>
            </>
          )
        ) : (
          <>
            <Button color="black" onClick={() => handleClick("/dang-nhap")}>
              Đăng nhập
            </Button>
            <Button color="black" onClick={() => handleClick("/dang-ky")}>
              Đăng ký
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
