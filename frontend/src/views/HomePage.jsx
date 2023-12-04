import { useState, useEffect, useContext } from "react";
import {
  Button,
  Grid,
  IconButton,
  Typography,
  Pagination,
  Input,
  Box,
  Paper,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import Ads1 from "../assets/Ads1.png";

import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import { useHistory } from "react-router-dom";
import UsersService from "../services/user.service";

import JobCard from "../component/JobCard";
import FilterPopup from "../component/FilterPopup";
import RecruiterCard from "../component/recruiter/RecruiterCard";

function Item(props) {
  return <Paper>abc</Paper>;
}

const Home = (props) => {
  const userServ = new UsersService();
  let history = useHistory();
  const [searchInput, setSearchInput] = useState("");

  const [jobs, setJobs] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    query: "",
    jobType: {
      fullTime: false,
      partTime: false,
      wfh: false,
    },
    salary: [0, 100],
    duration: "0",
    sort: {
      salary: {
        status: false,
        desc: false,
      },
      duration: {
        status: false,
        desc: false,
      },
      rating: {
        status: false,
        desc: false,
      },
    },
  });

  const setPopup = useContext(SetPopupContext);
  useEffect(() => {
    getData();
  }, []);

  // Level
  useEffect(() => {
    async function getCompanies() {
      var companyData = await userServ.getAllRecruiter();
      const companies = [];
      for (let i = 0; i < companyData.length; i++) {
        if (companyData[i].level >= 0) {
          companies[i] = companyData[i];
        }
      }
      setCompanyList(companies);
      // console.log(companies);
    }
    getCompanies();
  }, []);

  const getData = () => {
    let searchParams = [];
    if (searchOptions.query !== "") {
      searchParams = [...searchParams, `q=${searchOptions.query}`];
    }
    if (searchOptions.jobType.fullTime) {
      searchParams = [...searchParams, `jobType=Full%20Time`];
    }
    if (searchOptions.jobType.partTime) {
      searchParams = [...searchParams, `jobType=Part%20Time`];
    }
    if (searchOptions.jobType.wfh) {
      searchParams = [...searchParams, `jobType=Work%20From%20Home`];
    }
    if (searchOptions.salary[0] !== 0) {
      searchParams = [
        ...searchParams,
        `salaryMin=${searchOptions.salary[0] * 1000}`,
      ];
    }
    if (searchOptions.salary[1] !== 100) {
      searchParams = [
        ...searchParams,
        `salaryMax=${searchOptions.salary[1] * 1000}`,
      ];
    }
    if (searchOptions.duration !== "0") {
      searchParams = [...searchParams, `duration=${searchOptions.duration}`];
    }

    let asc = [],
      desc = [];

    Object.keys(searchOptions.sort).forEach((obj) => {
      const item = searchOptions.sort[obj];
      if (item.status) {
        if (item.desc) {
          desc = [...desc, `desc=${obj}`];
        } else {
          asc = [...asc, `asc=${obj}`];
        }
      }
    });
    searchParams = [...searchParams, ...asc, ...desc];
    const queryString = searchParams.join("&");
    // console.log(queryString);
    let address = apiList.jobs;
    if (queryString !== "") {
      address = `${address}?${queryString}`;
    }

    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        // console.log(response.data);
        setJobs(
          response.data.filter((obj) => {
            const today = new Date();
            const deadline = new Date(obj.deadline);
            return deadline > today;
          })
        );
      })
      .catch((err) => {
        // console.log(err);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  return (
    <Grid container>
      <Grid
        container
        direction="column"
        alignItems="center"
        sx={{ padding: { md: "80px", xs: "20px" }, minHeight: "93vh" }}
      >
        <Grid
          item
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{
            backgroundColor: "primary.main",
            borderRadius: "20px",
            padding: { md: "100px", xs: "50px" },
          }}
        >
          <Grid item>
            <Typography
              variant="h2"
              align="center"
              sx={{
                fontWeight: "900",
                color: "common.white",
                typography: { xs: "h3", md: "h2" },
              }}
            >
              TÌM CÔNG VIỆC THỰC TẬP MỚI NHẤT
            </Typography>
            <br />
            <Typography
              variant="h5"
              align="center"
              sx={{ fontWeight: "500", color: "common.white" }}
            >
              Nhà tuyển dụng đang chờ bạn!
            </Typography>
            {/* Thanh tim kiem */}
            <Grid
              item
              container
              fullWidth
              sx={{
                margin: "20px auto 0 auto",
                border: "2px solid #36593C",
                borderRadius: "20px",
                padding: "0 0 0 20px",
                backgroundColor: "common.white",
              }}
            >
              <Grid item xs={1}>
                <IconButton
                  sx={{ height: "100%" }}
                  onClick={() =>
                    history.push({
                      pathname: "/tim-kiem",
                      search: `?search=${searchInput}`,
                    })
                  }
                >
                  <SearchIcon
                    sx={{
                      color: "common.black",
                    }}
                  />
                </IconButton>
              </Grid>
              <Grid item xs={8} md={9}>
                <Input
                  disableUnderline
                  sx={{ width: "100%", height: "100%" }}
                  placeholder="Tìm kiếm công việc, công ty,..."
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
              <Grid item xs={3} md={2}>
                <Button
                  sx={{
                    marginLeft: "3px",
                    height: "100%",
                    width: "100%",
                    borderRadius: "0 20px 20px 0",
                  }}
                  variant="contained"
                  onClick={() =>
                    history.push({
                      pathname: "/tim-kiem",
                      search: `?search=${searchInput}`,
                    })
                  }
                >
                  Tìm kiếm
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Quang cao */}
        <Grid
          container
          sx={{
            backgroundColor: "primary.main",
            marginTop: "50px",
            marginBottom: "50px",
            borderRadius: "20px",
            color: "common.white",
          }}
        >
          <Grid
            item
            xs={8}
            sx={{ padding: { md: "50px 80px", xs: "30px 50px" } }}
          >
            <Typography sx={{ typography: { xs: "h5", md: "h4" } }}>
              BẠN CÓ BIẾT?
              <br />
            </Typography>
            <Typography sx={{ typography: { xs: "p", md: "h5" } }}>
              Kỹ năng làm việc nhóm là một trong các kỹ năng quan trọng mà Nhà
              tuyển dụng cần bên cạnh kỹ năng cứng...
            </Typography>
          </Grid>
          <Grid
            item
            xs={4}
            sx={{ width: "100%", display: "flex", alignItems: "center" }}
          >
            <Box
              sx={{ width: "100%", padding: "30px 0" }}
              component="img"
              src={Ads1}
            />
          </Grid>
        </Grid>

        <Grid container item direction="column">
          <Typography
            align="center"
            sx={{
              fontWeight: "500",
              marginBottom: "30px",
              typography: { xs: "h4", md: "h2" },
            }}
          >
            TIN THỰC TẬP TỐT NHẤT VIỆT NAM
          </Typography>
          <Grid container item>
            {/* DS cong viec */}
            <Grid
              item
              container
              xs={12}
              sx={{ padding: { md: "0 20px 0 0", xs: "0" } }}
            >
              {jobs?.length > 0 ? (
                jobs?.map((job) => {
                  return (
                    <Grid
                      container
                      item
                      xs={12}
                      md={6}
                      lg={4}
                      sx={{ padding: "10px" }}
                    >
                      <JobCard job={job} />
                    </Grid>
                  );
                })
              ) : (
                <Grid
                  item
                  textAlign="center"
                  xs={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Typography textAlign="center" sx={{ mb: 3 }}>
                    Không tìm thấy Công việc phù hợp
                  </Typography>
                </Grid>
              )}
            </Grid>
            <Grid
              xs={12}
              item
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
              sx={{ marginTop: "30px" }}
            >
              <Pagination count={1} />
            </Grid>
          </Grid>
        </Grid>
        <Grid container item direction="column">
          <Typography
            align="center"
            sx={{
              fontWeight: "500",
              margin: "50px 0 30px 0",
              typography: { xs: "h4", md: "h2" },
            }}
          >
            NHÀ TUYỂN DỤNG HÀNG ĐẦU
          </Typography>
          <Grid container item>
            <Grid item container justifyContent="center" xs={12}>
              <Carousel
                sx={{ width: "100%" }}
                animation="slide"
                duration={2000}
                navButtonsAlwaysVisible={true}
                indicators={false}
              >
                {companyList?.length > 0 ? (
                  companyList?.map((company) => {
                    return (
                      <Grid
                        justifyContent="center"
                        item
                        container
                        xs={12}
                        md={4}
                        lg={3}
                        sx={{ padding: "5px" }}
                      >
                        <RecruiterCard company={company} />
                      </Grid>
                    );
                  })
                ) : (
                  <Typography sx={{ mb: 3 }}>
                    Không tìm thấy Nhà tuyển dụng phù hợp
                  </Typography>
                )}
              </Carousel>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <FilterPopup
        open={filterOpen}
        searchOptions={searchOptions}
        setSearchOptions={setSearchOptions}
        handleClose={() => setFilterOpen(false)}
        getData={() => {
          getData();
          setFilterOpen(false);
        }}
      />
    </Grid>
  );
};

export default Home;
