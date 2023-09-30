import { createContext, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import { Grid, makeStyles } from "@material-ui/core";

import Welcome, { ErrorPage } from "./component/Welcome.jsx";

import Navbar from "./component/Navbar.jsx";

import Login from "./component/Login.jsx";
import Logout from "./component/Logout.jsx";
import Signup from "./component/Signup.jsx";

import Home from "./component/Home.jsx";
import Applications from "./component/Applications.jsx";
import Profile from "./component/Profile.jsx";
import CreateJobs from "./component/recruiter/CreateJobs.jsx";
import MyJobs from "./component/recruiter/MyJobs.jsx";
import JobApplications from "./component/recruiter/JobApplications.jsx";
import AcceptedApplicants from "./component/recruiter/AcceptedApplicants.jsx";
import RecruiterProfile from "./component/recruiter/Profile.jsx";

import MessagePopup from "./lib/MessagePopup.jsx";
// eslint-disable-next-line no-unused-vars
import isAuth, { userType } from "./lib/isAuth.jsx";

const useStyles = makeStyles((theme) => ({
  body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "98vh",
    paddingTop: "64px",
    boxSizing: "border-box",
    width: "100%",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // padding: "30px",
  },
  btn: {
    backgroundColor: "#48884A",
    color: "white",
  },
}));

export const SetPopupContext = createContext();

function App() {
  const classes = useStyles();
  const [popup, setPopup] = useState({
    open: false,
    severity: "",
    message: "",
  });
  return (
    <BrowserRouter>
      <SetPopupContext.Provider value={setPopup}>
        <Grid container direction="column">
          <Grid item xs>
            <Navbar />
          </Grid>
          <Grid item className={classes.body}>
            <Switch>
              <Route exact path="/">
                <Welcome />
              </Route>
              <Route exact path="/dang-nhap">
                <Login />
              </Route>
              <Route exact path="/dang-ky">
                <Signup />
              </Route>
              <Route exact path="/dang-xuat">
                <Logout />
              </Route>
              <Route exact path="/viec-lam">
                <Home />
              </Route>
              <Route exact path="/ung-vien">
                <Applications />
              </Route>
              <Route exact path="/ho-so">
                {userType() === "recruiter" ? (
                  <RecruiterProfile />
                ) : (
                  <Profile />
                )}
              </Route>
              <Route exact path="/dang-tin">
                <CreateJobs />
              </Route>
              <Route exact path="/cong-viec">
                <MyJobs />
              </Route>
              <Route exact path="/cong-viec/ung-vien/:jobId">
                <JobApplications />
              </Route>
              <Route exact path="/ds-dang-thuc-tap">
                <AcceptedApplicants />
              </Route>
              <Route>
                <ErrorPage />
              </Route>
            </Switch>
          </Grid>
        </Grid>
        <MessagePopup
          open={popup.open}
          setOpen={(status) =>
            setPopup({
              ...popup,
              open: status,
            })
          }
          severity={popup.severity}
          message={popup.message}
        />
      </SetPopupContext.Provider>
    </BrowserRouter>
  );
}

export default App;
