import { useState, useEffect, useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
import {
  Button,
  Grid,
  IconButton,
  Paper,
  Typography,
  Pagination,
  Input,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

import FilterListIcon from "@mui/icons-material/FilterList";

import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import { userType } from "../lib/isAuth";
import FilterPopup from "../component/FilterPopup";
import JobCard from "../component/JobCard";
import SearchBar from "../component/SearchBar";
import LocationsService from "../services/location.service";
import NewsService from "../services/news.service";
import NewsCard2 from "../component/NewsCard2";

export default function SearchPage() {
  const newsServ = new NewsService();
  const [newsList, setNewsList] = useState([]);
  useEffect(() => {
    async function getNews() {
      var newsData = await newsServ.getAll();
      setNewsList(newsData);
    }
    getNews();
  }, []);
  // const locationServ = new LocationsService();
  // const [location, setLocation] = useState([]);
  const search = useLocation().search;
  const searchParams = new URLSearchParams(search);
  const searchStr = searchParams.get("search");

  const [jobs, setJobs] = useState([]);

  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    query: searchStr,
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
    location: "",
  });

  useEffect(() => {
    // async function getLocation() {
    //   const locations = await locationServ.getAll();
    //   console.log(locations);
    //   setLocation(locations);
    // }
    setSearchOptions((value) => {
      return {
        ...value,
        // ...location,
        query: searchStr,
      };
    });
    // console.log(searchStr);
    getData(searchStr);
  }, [searchStr]);

  const setPopup = useContext(SetPopupContext);

  const getData = (search) => {
    let searchParams = [];
    if (search) {
      searchParams = [...searchParams, `q=${search}`];
    }
    if (searchOptions.jobType.offline) {
      searchParams = [...searchParams, `jobType=Offline`];
    }
    if (searchOptions.jobType.online) {
      searchParams = [...searchParams, `jobType=Online`];
    }
    if (searchOptions.jobType.flexible) {
      searchParams = [...searchParams, `jobType=Flexible`];
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

    if (!searchOptions.location) {
      searchParams = [...searchParams, `location=${searchOptions.location}`];
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
        setJobs(
          response.data.filter((obj) => {
            const today = new Date();
            const deadline = new Date(obj.deadline);
            return deadline > today;
          })
        );
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };
  return (
    <Paper>
      <Grid
        container
        xs={12}
        item
        sx={{ padding: { md: "100px", xs: "0" }, minHeight: "93vh" }}
      >
        <Grid item xs={12} sx={{ width: "100%" }}>
          <SearchBar />
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <IconButton onClick={() => setFilterOpen(true)} size="large">
            <FilterListIcon />
          </IconButton>
        </Grid>

        <Grid item container xs={12}>
          {/* Công việc xs=8 */}
          <Grid
            item
            xs={12}
            md={8}
            container
            direction="column"
            alignItems="stretch"
            justifyContent="center"
            sx={{ padding: "10px 20px 0 0" }}
          >
            {jobs.length > 0 ? (
              jobs.map((job) => {
                return <JobCard sx={{ width: "100%" }} job={job} />;
              })
            ) : (
              <Typography variant="h5" style={{ textAlign: "center" }}>
                Không tìm thấy việc làm phù hợp
              </Typography>
            )}
          </Grid>

          {/* Có thể bạn quan tâm xs=4 */}
          <Grid
            container
            item
            xs={12}
            md={4}
            direction="column"
            sx={{
              padding: "20px",
              borderRadius: "30px",
              margin: "30px 0 0 0",
              boxShadow:
                "0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Có thể bạn quan tâm
            </Typography>
            <Grid>
              {newsList.length > 0 ? (
                newsList.map((news) => {
                  return (
                    <Grid container item>
                      <NewsCard2 news={news} />
                    </Grid>
                  );
                })
              ) : (
                <Typography sx={{ mb: 3 }}>
                  Không tìm thấy bản tin phù hợp
                </Typography>
              )}
            </Grid>
          </Grid>
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
      <FilterPopup
        sx={{}}
        open={filterOpen}
        searchOptions={searchOptions}
        setSearchOptions={setSearchOptions}
        handleClose={() => setFilterOpen(false)}
        getData={() => {
          getData();
          setFilterOpen(false);
        }}
      />
    </Paper>
  );
}
