import { useState, useEffect, useContext } from "react";
import {
  Button,
  Grid,
  IconButton,
  Typography,
  Pagination,
  Input,
} from "@mui/material";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";

import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import { useHistory } from "react-router-dom";

import JobCard from "../component/JobCard";
import FilterPopup from "../component/FilterPopup";

const Home = (props) => {
  let history = useHistory();
  const [searchInput, setSearchInput] = useState("");

  const [jobs, setJobs] = useState([]);
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
    console.log(queryString);
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
        console.log(response.data);
        setJobs(
          response.data.filter((obj) => {
            const today = new Date();
            const deadline = new Date(obj.deadline);
            return deadline > today;
          })
        );
      })
      .catch((err) => {
        console.log(err);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="center"
        sx={{ padding: "80px", minHeight: "93vh" }}
      >
        <Grid
          item
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{
            padding: "100px",
            backgroundColor: "primary.main",
            borderRadius: "20px",
          }}
        >
          <Grid item>
            <Typography
              variant="h2"
              align="center"
              sx={{ fontWeight: "900", color: "common.white" }}
            >
              TÌM CÔNG VIỆC THỰC TẬP MỚI NHẤT
            </Typography>
            <br />
            <Typography
              variant="h5"
              align="center"
              sx={{ fontWeight: "500", color: "common.white" }}
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </Typography>
            {/* Thanh tim kiem */}
            <Grid
              item
              fullWidth
              sx={{
                margin: "20px auto 0 auto",
                border: "2px solid #36593C",
                borderRadius: "20px",
                padding: "0 0 0 20px",
                backgroundColor: "common.white",
              }}
            >
              <IconButton
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
              <Input
                sx={{ width: "80%", height: "50px" }}
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
              <Button
                sx={{ marginLeft: "30px" }}
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

          {/* <Grid item>
            <IconButton
              sx={{ color: "common.white" }}
              onClick={() => setFilterOpen(true)}
              size="large"
            >
              <FilterListIcon />
            </IconButton>
          </Grid> */}
        </Grid>

        {/* Quang cao */}
        <Grid
          container
          sx={{
            backgroundColor: "primary.main",
            height: "200px",
            marginTop: "50px",
            marginBottom: "50px",
            borderRadius: "20px",
          }}
        >
          <Typography
            align="center"
            variant="p"
            sx={{
              padding: "50px",
              color: "common.white",
            }}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa
            ratione eius recusandae ducimus ipsam voluptatibus pariatur facilis
            repudiandae aut a, fuga necessitatibus. Placeat maiores temporibus,
            qui quod nesciunt perspiciatis quae.
          </Typography>
        </Grid>

        <Grid container item direction="column">
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: "500", marginBottom: "30px" }}
          >
            TIN THỰC TẬP TỐT NHẤT VIỆT NAM
          </Typography>
          <Grid container item>
            <Grid
              item
              xs={4}
              sx={{
                boxShadow:
                  "0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)",
                borderRadius: "30px",
                margin: "0 auto",
                height: "500px",
                marginTop: "10px",
                padding: "30px",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Có thể bạn quan tâm
              </Typography>
              <Grid>Đang cập nhật</Grid>
            </Grid>
            <Grid item container justifyContent="center" xs={8}>
              {jobs.length > 0 ? (
                jobs.map((job) => {
                  return <JobCard job={job} />;
                })
              ) : (
                <Typography variant="h5" style={{ textAlign: "center" }}>
                  Không tìm thấy việc làm phù hợp
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Pagination count={jobs.length / 10 > 1 ? jobs.length / 10 : 1} />
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
    </>
  );
};

export default Home;
