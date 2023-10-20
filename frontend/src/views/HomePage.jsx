import { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  Modal,
  Slider,
  FormControlLabel,
  MenuItem,
  Checkbox,
  Pagination,
  Rating,
  Input,
} from "@mui/material";
import axios from "axios";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SearchIcon from "@mui/icons-material/Search";

import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import { userType } from "../lib/isAuth";
import { useHistory } from "react-router-dom";

const JobTile = (props) => {
  // const classes = useStyles();
  const { job } = props;
  const setPopup = useContext(SetPopupContext);

  const [open, setOpen] = useState(false);
  const [sop, setSop] = useState("");

  const handleClose = () => {
    setOpen(false);
    setSop("");
  };

  const handleApply = () => {
    console.log(job._id);
    console.log(sop);
    axios
      .post(
        `${apiList.jobs}/${job._id}/applications`,
        {
          sop: sop,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        handleClose();
      })
      .catch((err) => {
        console.log(err.response);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleClose();
      });
  };

  const deadline = new Date(job.deadline).toLocaleDateString();

  return (
    <Paper
      elevation={3}
      sx={{ margin: "10px", padding: "20px", width: "500px" }}
    >
      <Grid container>
        <Grid container item xs={9} spacing={1} direction="column">
          <Grid item>
            <Typography variant="h5">{job.title}</Typography>
          </Grid>
          <Grid item>
            <Rating value={job.rating !== -1 ? job.rating : null} readOnly />
          </Grid>
          <Grid item>Loại: {job.jobType}</Grid>
          <Grid item>
            Trợ phí: {job.salary > 0 ? `${job.salary} VNĐ/Tháng` : `Không`}
          </Grid>
          <Grid item>
            Số tháng thực tập:{" "}
            {job.duration > 0 ? `${job.duration} Tháng` : `Linh hoạt`}
          </Grid>

          <Grid item>Đăng bởi: {job.recruiter.name}</Grid>
          <Grid item>Hạn chót: {deadline}</Grid>
          <Grid item>Ngành nghề liên quan: {job?.majors?.join("; ")}</Grid>

          <Grid item>
            {job.skillsets.map((skill) => (
              <Chip label={skill} style={{ marginRight: "2px" }} />
            ))}
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            onClick={() => {
              setOpen(true);
            }}
            disabled={userType() === "recruiter"}
          >
            Ứng tuyển
          </Button>
        </Grid>
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        // className={classes.popupDialog}
      >
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "50%",
            alignItems: "center",
          }}
        >
          <TextField
            label="Write SOP (upto 250 words)"
            multiline
            rows={8}
            style={{ width: "100%", marginBottom: "30px" }}
            variant="outlined"
            value={sop}
            onChange={(event) => {
              if (
                event.target.value.split(" ").filter(function (n) {
                  return n !== "";
                }).length <= 250
              ) {
                setSop(event.target.value);
              }
            }}
          />
          <Button
            variant="contained"
            style={{ padding: "10px 50px" }}
            onClick={() => handleApply()}
          >
            Submit
          </Button>
        </Paper>
      </Modal>
    </Paper>
  );
};

const FilterPopup = (props) => {
  // const classes = useStyles();
  const { open, handleClose, searchOptions, setSearchOptions, getData } = props;
  return (
    <Modal
      open={open}
      onClose={handleClose}
      // className={classes.popupDialog}
    >
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        style={{ padding: "80px", minHeight: "93vh" }}
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

        <Grid
          container
          item
          alignItems="stretch"
          justifyContent="center"
          direction="column"
          sx={{}}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: "500", marginBottom: "30px" }}
          >
            TIN THỰC TẬP TỐT NHẤT VIỆT NAM
          </Typography>
          <Grid container alignItems="stretch" justifyContent="center">
            {jobs.length > 0 ? (
              jobs.map((job) => {
                return <JobTile job={job} />;
              })
            ) : (
              <Typography variant="h5" style={{ textAlign: "center" }}>
                Không tìm thấy việc làm phù hợp
              </Typography>
            )}
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
