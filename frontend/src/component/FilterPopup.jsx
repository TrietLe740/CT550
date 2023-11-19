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
import LocationsService from "../services/location.service";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const FilterPopup = (props) => {
  const locationServ = new LocationsService();
  const { open, handleClose, searchOptions, setSearchOptions, getData } = props;
  const [filterOpen, setFilterOpen] = useState(false);

  const [locations, setLocations] = useState([]);
  useEffect(() => {
    async function getData() {
      const locations = await locationServ.getAll();
      console.log(locations);
      setLocations(locations);
    }
    getData();
  }, []);

  return (
    <Modal open={open} onClose={handleClose}>
      <Paper
        sx={{
          margin: "5% auto",
          padding: "50px 80px",
          outline: "none",
          maxWidth: "80%",
          borderRadius: "30px",
        }}
      >
        <Grid container direction="column" alignItems="center" spacing={3}>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Loại
            </Grid>
            <Grid container item xs={9} justifyContent="space-around">
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="offline"
                      checked={searchOptions.jobType.offline}
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
                  label="Làm việc trực tiếp"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="online"
                      checked={searchOptions.jobType.online}
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
                  label="Làm việc từ xa"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="flexible"
                      checked={searchOptions.jobType.flexible}
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
                  label="Linh hoạt"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Trợ phí
            </Grid>
            <Grid item xs={9}>
              <Slider
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => {
                  return value * (10000000 / 100);
                }}
                marks={[
                  { value: 0, label: "0" },
                  { value: 100, label: "10,000,000 VNĐ" },
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
              Thời gian thực tập
            </Grid>
            <Grid item xs={9}>
              <TextField
                select
                label="Thời gian thực tập"
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
                <MenuItem value="0">Tất cả</MenuItem>
                <MenuItem value="1">1 Tháng</MenuItem>
                <MenuItem value="3">3 Tháng</MenuItem>
                <MenuItem value="6">6 Tháng</MenuItem>
                <MenuItem value="7">Hơn 6 Tháng</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Sắp xếp
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
                    <Typography>Trợ phí</Typography>
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
                    <Typography>Thời gian</Typography>
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
                    <Typography>Đánh giá</Typography>
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
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Địa điểm
            </Grid>
            <Grid item xs={9}>
              <TextField
                select
                label="Địa điểm"
                variant="outlined"
                fullWidth
                value={searchOptions.location}
                onChange={(event) =>
                  setSearchOptions({
                    ...searchOptions,
                    location: event.target.value,
                  })
                }
              >
                <MenuItem value="0">Tất cả</MenuItem>
                {locations.map((v, index) => (
                  <MenuItem key={index} value={v.name}>
                    {v.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              style={{ padding: "10px 50px" }}
              onClick={() => getData()}
            >
              Tìm kiếm
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};

export default FilterPopup;
