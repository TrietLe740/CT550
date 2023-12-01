import {
  Grid,
  Typography,
  Button,
  IconButton,
  Input,
  Paper,
  TextField,
  Modal,
  Chip,
  Rating,
  FormControlLabel,
  Checkbox,
  Slider,
  MenuItem,
  Box,
  Link,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useEffect, useState } from "react";
import UsersService from "../services/user.service";
import JobsService from "../services/jobs.service";
import RecruiterCard from "../component/recruiter/RecruiterCard";
import Ads1 from "../assets/Ads1.png";
import Ads2 from "../assets/Ads2.png";
import isAuth from "../lib/isAuth";

const FilterPopup = (props) => {
  const { open, handleClose, searchOptions, setSearchOptions, getData } = props;
  return (
    <Modal open={open} onClose={handleClose}>
      <Paper
        style={{
          padding: "50px",
          outline: "none",
          minWidth: "50%",
        }}
      >
        <Grid container direction="column" alignItems="center" spacing={3}>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Job Type
            </Grid>
            <Grid
              container
              item
              xs={9}
              justifyContent="space-around"
              // alignItems="center"
            >
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="fullTime"
                      checked={searchOptions.jobType.fullTime}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Full Time"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="partTime"
                      checked={searchOptions.jobType.partTime}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Part Time"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="wfh"
                      checked={searchOptions.jobType.wfh}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Work From Home"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Salary
            </Grid>
            <Grid item xs={9}>
              <Slider
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => {
                  return value * (100000 / 100);
                }}
                marks={[
                  { value: 0, label: "0" },
                  { value: 100, label: "100000" },
                ]}
                value={searchOptions.salary}
                onChange={(event, value) =>
                  setSearchOptions({
                    ...searchOptions,
                    salary: value,
                  })
                }
              />
            </Grid>
          </Grid>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Duration
            </Grid>
            <Grid item xs={9}>
              <TextField
                select
                label="Duration"
                variant="outlined"
                fullWidth
                value={searchOptions.duration}
                onChange={(event) =>
                  setSearchOptions({
                    ...searchOptions,
                    duration: event.target.value,
                  })
                }
              >
                <MenuItem value="0">All</MenuItem>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4">4</MenuItem>
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="6">6</MenuItem>
                <MenuItem value="7">7</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Sort
            </Grid>
            <Grid item container direction="row" xs={9}>
              <Grid
                item
                container
                xs={4}
                justifyContent="space-around"
                alignItems="center"
                style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
              >
                <Grid item>
                  <Checkbox
                    name="salary"
                    checked={searchOptions.sort.salary.status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          salary: {
                            ...searchOptions.sort.salary,
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="salary"
                  />
                </Grid>
                <Grid item>
                  <label for="salary">
                    <Typography>Salary</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort.salary.status}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          salary: {
                            ...searchOptions.sort.salary,
                            desc: !searchOptions.sort.salary.desc,
                          },
                        },
                      });
                    }}
                    size="large"
                  >
                    {searchOptions.sort.salary.desc ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
              <Grid
                item
                container
                xs={4}
                justifyContent="space-around"
                alignItems="center"
                style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
              >
                <Grid item>
                  <Checkbox
                    name="duration"
                    checked={searchOptions.sort.duration.status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          duration: {
                            ...searchOptions.sort.duration,
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="duration"
                  />
                </Grid>
                <Grid item>
                  <label for="duration">
                    <Typography>Duration</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort.duration.status}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          duration: {
                            ...searchOptions.sort.duration,
                            desc: !searchOptions.sort.duration.desc,
                          },
                        },
                      });
                    }}
                    size="large"
                  >
                    {searchOptions.sort.duration.desc ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
              <Grid
                item
                container
                xs={4}
                justifyContent="space-around"
                alignItems="center"
                style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
              >
                <Grid item>
                  <Checkbox
                    name="rating"
                    checked={searchOptions.sort.rating.status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          rating: {
                            ...searchOptions.sort.rating,
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="rating"
                  />
                </Grid>
                <Grid item>
                  <label for="rating">
                    <Typography>Rating</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort.rating.status}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          rating: {
                            ...searchOptions.sort.rating,
                            desc: !searchOptions.sort.rating.desc,
                          },
                        },
                      });
                    }}
                    size="large"
                  >
                    {searchOptions.sort.rating.desc ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              style={{ padding: "10px 50px" }}
              onClick={() => getData()}
            >
              Apply
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};

const Welcome = (props) => {
  const jobServ = new JobsService();
  const userServ = new UsersService();

  const [companyList, setCompanyList] = useState([]);

  let history = useHistory();
  const [searchInput, setSearchInput] = useState("");

  const [filterOpen, setFilterOpen] = useState(false);

  const [jobs, setJobs] = useState([]);
  async function getJob() {
    var dt = await jobServ.getAll();
    setJobs(dt);
  }

  const handleClick = (location) => {
    history.push(location);
  };

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
    //   .get(address, {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     },
    //   })
    //   .then((response) => {
    //     console.log(response.data);
    //     setJobs(
    //       response.data.filter((obj) => {
    //         const today = new Date();
    //         const deadline = new Date(obj.deadline);
    //         return deadline > today;
    //       })
    //     );
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     setPopup({
    //       open: true,
    //       severity: "error",
    //       message: "Error",
    //     });
    //   });
  };

  useEffect(() => {
    getJob();
  }, []);

  // Chỉ khi > lv1
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
    }
    getCompanies();
  }, []);

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      sx={{ padding: "30px", minHeight: "93vh" }}
    >
      {/* 1 */}
      <Grid
        container
        item
        sx={{
          borderRadius: {
            md: "20px 20px 200px 20px",
            xs: "20px 20px 100px 20px",
          },
          backgroundColor: "primary.main",
          padding: "50px",
        }}
      >
        <Grid container item>
          <Grid item xs={6} sx={{ color: "common.white" }}>
            <Typography
              sx={{
                fontWeight: "bold",
                typography: { lg: "h2", sm: "h4", xs: "h6" },
              }}
            >
              TÌM VIỆC CHẤT
              <br />
              NÂNG CAO TAY NGHỀ
            </Typography>
            <Typography
              variant="p"
              sx={{
                display: { md: "block", xs: "none" },
                textAlign: "justify",
              }}
            >
              Bạn đang là sinh viên hoặc mới tốt nghiệp và muốn tìm một công
              việc thực tập để nâng cao tay nghề và học hỏi kinh nghiệm?
              <br />
              Hãy để HItern hỗ trợ bạn!
            </Typography>
            <Button
              onClick={() => handleClick("/dang-nhap")}
              variant="contained"
              sx={{
                backgroundColor: "secondary.main",
                mt: 2,
              }}
            >
              Tham gia ngay
            </Button>
          </Grid>

          <Grid item xs={6}>
            <Box
              component="img"
              sx={{
                maxHeight: { xs: 150, sm: 250, md: 450, lg: 700 },
                maxWidth: { xs: 150, sm: 250, md: 450, lg: 700 },
              }}
              alt="banner"
              src="/src/assets/JOB.png"
            />
          </Grid>
        </Grid>
      </Grid>
      {/* 2 */}
      {isAuth() ? (
        <Grid>
          <Grid container item direction="column">
            <Typography
              variant="h4"
              align="center"
              sx={{
                fontWeight: "500",
                margin: "50px 0",
                typography: { xs: "h5", md: "h4", lg: "h3" },
              }}
            >
              NHÀ TUYỂN DỤNG HÀNG ĐẦU
            </Typography>
            <Grid container item>
              <Grid item container justifyContent="center" xs={12}>
                {companyList?.length > 0
                  ? companyList?.map((company) => {
                      return (
                        <Grid
                          item
                          container
                          lg={3}
                          md={4}
                          sm={6}
                          xs={12}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <RecruiterCard company={company} />
                        </Grid>
                      );
                    })
                  : null}
              </Grid>
            </Grid>
          </Grid>
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
          <Box sx={{ width: "100%" }} component="img" src={Ads2} />
        </Grid>
      ) : null}
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

export const ErrorPage = (props) => {
  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item>
        <Typography variant="h2">Error 404</Typography>
      </Grid>
    </Grid>
  );
};

export default Welcome;
