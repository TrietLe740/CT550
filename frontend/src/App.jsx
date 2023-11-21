import { createContext, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Grid, ThemeProvider, createTheme, CssBaseline } from "@mui/material";

import Welcome, { ErrorPage } from "./views/WelcomePage.jsx";

import Navbar from "./component/Navbar.jsx";

import LoginPage from "./views/LoginPage.jsx";
import Logout from "./component/Logout.jsx";
import SignupPage from "./views/SignupPage.jsx";

import HomePage from "./views/HomePage.jsx";
import ApplicationsPage from "./views/ApplicationsPage.jsx";
import ProfilePage from "./views/ProfilePage.jsx";
import CreateJobs from "./views/recruiter/CreateJobs.jsx";
import MyJobs from "./views/recruiter/MyJobs.jsx";
import JobApplications from "./views/recruiter/JobApplications.jsx";
import AcceptedApplicants from "./views/recruiter/AcceptedApplicants.jsx";
import RecruiterEditProfile from "./views/recruiter/RecruiterEditProfile.jsx";

import SearchPage from "./views/SearchPage.jsx";
import NewsPage from "./views/NewsPage.jsx";
import CompaniesPage from "./views/CompaniesPage.jsx";
import CompanyDetailPage from "./views/CompanyDetailPage.jsx";

import MessagePopup from "./lib/MessagePopup.jsx";

import AdminLoginPage from "./views/admin/AdminLoginPage.jsx";

import isAuth, { userType } from "./lib/isAuth.jsx";
import JobDetailPage from "./views/JobDetailPage.jsx";
import ProfileEditPage from "./views/ProfileEditPage.jsx";
import UpdateAccountPage from "./views/UpdateAccountPage.jsx";
import UploadCVPage from "./views/UploadCVPage.jsx";
import Footer from "./component/Footer.jsx";

export const SetPopupContext = createContext();

function App() {
  const theme = createTheme({
    palette: {
      mode: "light",
      common: {
        black: "#000",
        white: "#fff",
      },
      primary: {
        main: "#48884A",
        light: "#E0EBB5",
        dark: "#36593C",
        contrastText: "#fff",
      },
      secondary: {
        main: "#EE9322",
      },
    },
    typoraphy: {
      fontFamily: "Inter",
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 700,
      fontWeightBold: 900,
      h1: {
        fontWeight: 900,
      },
      h2: {
        fontWeight: 700,
      },
      h3: {
        fontWeight: 400,
      },
      h5: {
        fontWeight: 300,
      },
      button: {
        fontWeight: 700,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {},
        },
      },
      TextField: {
        styleOverrides: {
          root: {
            width: "300px",
            marginLeft: "auto",
            marginRight: "auto",
            paddingBottom: 0,
            marginTop: 0,
          },
        },
      },
    },
  });
  const [popup, setPopup] = useState({
    open: false,
    severity: "",
    message: "",
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <SetPopupContext.Provider value={setPopup}>
          <Grid container direction="column">
            {/* Nav */}
            <Grid item>
              {location.pathname === "/admin/dang-nhap" ? <></> : <Navbar />}
            </Grid>
            {/* Main */}
            <Grid item>
              <Switch>
                <Route exact path="/">
                  <Welcome />
                </Route>
                <Route exact path="/dang-nhap">
                  <LoginPage />
                </Route>
                <Route exact path="/dang-ky">
                  <SignupPage />
                </Route>
                <Route exact path="/dang-xuat">
                  <Logout />
                </Route>
                <Route exact path="/viec-lam">
                  <HomePage />
                </Route>
                <Route exact path="/viec-lam/:id">
                  <JobDetailPage />
                </Route>
                <Route exact path="/tim-kiem">
                  <SearchPage />
                </Route>

                {/* Applicant */}
                <Route exact path="/ung-vien">
                  <ApplicationsPage />
                </Route>
                <Route exact path="/ho-so/thuc-tap-sinh/:id">
                  <ProfilePage />
                </Route>
                <Route exact path="/update-cv">
                  <UploadCVPage />
                </Route>

                {/* Profile */}
                <Route exact path="/ho-so/chinh-sua">
                  {userType() === "recruiter" ? (
                    <RecruiterEditProfile />
                  ) : (
                    <ProfileEditPage />
                  )}
                </Route>

                {/* Update Level Account */}
                <Route exact path="/tai-khoan/nang-cap">
                  <UpdateAccountPage />
                </Route>

                {/* Recruiter */}
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
                <Route exact path="/tin-tuc">
                  <NewsPage />
                </Route>
                <Route exact path="/cong-ty">
                  <CompaniesPage />
                </Route>
                <Route exact path="/cong-ty/:id">
                  <CompanyDetailPage />
                </Route>

                {/* Admin */}
                <Route exact path="/admin/dang-nhap">
                  <AdminLoginPage />
                </Route>

                {/* Error */}
                <Route>
                  <ErrorPage />
                </Route>
              </Switch>
            </Grid>
            {/* Footer */}
            <Grid item>
              {location.pathname === "/admin/dang-nhap" ? <></> : <Footer />}
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
    </ThemeProvider>
  );
}

export default App;
