import { createContext, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Grid, CssBaseline } from "@mui/material";

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
import DepositMoneyPage from "./views/DepositMoneyPage.jsx";

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
import UpdateRecruiterAccountPage from "./views/recruiter/UpdateRecruiterAccountPage.jsx";

import Footer from "./component/Footer.jsx";

import AdminDashBoardPage from "./views/admin/AdminDashBoardPage.jsx";
import AdminListCPPage from "./views/admin/AdminListCPPage.jsx";
import AdminListInternPage from "./views/admin/AdminListInternPage.jsx";
import EditApplicantsPage from "./views/admin/EditApplicantsPage.jsx";
import AdminListJobPage from "./views/admin/AdminListJobPage.jsx";
import EditJobPage from "./views/admin/EditJobPage.jsx";
import AdminNewsPage from "./views/admin/AdminNewsPage.jsx";
import CreateNewsPage from "./views/admin/CreateNewsPage.jsx";
import AdminServicesPage from "./views/admin/AdminServicesPage.jsx";
import EditCPPage from "./views/admin/EditCPPage.jsx";
import ApplicationPage from "./views/recruiter/ApplicationPage.jsx";
import EditNewsPage from "./views/admin/EditNewsPage.jsx";
import NewsPageDetail from "./views/NewsPageDetail.jsx";

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
        dark: "#a75c00",
        contrastText: "#fff",
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
              {location.pathname === "/admin/dang-nhap" ? null : <Navbar />}
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
                <Route exact path="/tai-khoan/nap-tien">
                  <DepositMoneyPage />
                </Route>

                {/* Applicant */}
                <Route exact path="/ung-vien">
                  <ApplicationsPage />
                </Route>
                <Route exact path="/ho-so">
                  <ProfilePage />
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
                  {userType() === "recruiter" ? (
                    <UpdateRecruiterAccountPage />
                  ) : (
                    <UpdateAccountPage />
                  )}
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
                <Route exact path="/ho-so/:id">
                  <ApplicationPage />
                </Route>
                <Route exact path="/tin-tuc">
                  <NewsPage />
                </Route>
                <Route exact path="/tin-tuc/:id">
                  <NewsPageDetail />
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
                <Route exact path="/admin/bang-dieu-khien">
                  <AdminDashBoardPage />
                </Route>

                <Route exact path="/admin/cong-ty">
                  <AdminListCPPage />
                </Route>
                <Route exact path="/admin/cong-ty/:id">
                  <EditCPPage />
                </Route>

                <Route exact path="/admin/thuc-tap-sinh">
                  <AdminListInternPage />
                </Route>
                <Route exact path="/admin/thuc-tap-sinh/:id">
                  <EditApplicantsPage />
                </Route>

                <Route exact path="/admin/cong-viec">
                  <AdminListJobPage />
                </Route>
                <Route exact path="/admin/cong-viec/:id">
                  <EditJobPage />
                </Route>

                <Route exact path="/admin/tin-tuc">
                  <AdminNewsPage />
                </Route>
                <Route exact path="/admin/tin-tuc/tao-moi">
                  <CreateNewsPage />
                </Route>
                <Route exact path="/admin/tin-tuc/:id">
                  <EditNewsPage />
                </Route>

                <Route exact path="/admin/dich-vu">
                  <AdminServicesPage />
                </Route>

                {/* Error */}
                <Route>
                  <ErrorPage />
                </Route>
              </Switch>
            </Grid>
            {/* Footer */}
            <Grid item>
              {location.pathname === "/admin/dang-nhap" ||
              location.pathname === "/dang-nhap" ||
              location.pathname === "/dang-ky" ? null : (
                <>{userType() === "admin" ? null : <Footer />}</>
              )}
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
