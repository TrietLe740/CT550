import { useContext, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Paper,
  TextField,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import Select from "react-select";

import { SetPopupContext } from "../../App";

import apiList from "../../lib/apiList";
import { useEffect } from "react";
import LocationsService from "../../services/location.service";
import MajorsService from "../../services/major.service";

const CreateJobs = (props) => {
  const majorServ = new MajorsService();
  const locationServ = new LocationsService();
  const setPopup = useContext(SetPopupContext);

  const [jobDetails, setJobDetails] = useState({
    title: "",
    maxApplicants: 100,
    maxPositions: 30,
    deadline: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
      .toISOString()
      .substr(0, 16),
    jobType: "Offline",
    duration: 0,
    salary: 0,
    location: {
      no: "",
      province: "",
      district: "",
      commune: "",
    },
    major: [],
  });

  const [districtList, setDistrictList] = useState([]);
  const [communeList, setCommuneList] = useState([]);

  const [locations, setLocations] = useState([]);
  const [majors, setMajors] = useState([]);

  useEffect(() => {
    async function getData() {
      const locations = await locationServ.getAll();
      const majors = await majorServ.getAll();
      console.log(locations);
      setLocations(locations);
      setMajors(
        majors?.[0].majors.map((item) => {
          return { label: item, value: item };
        }) || []
      );
    }
    getData();
  }, []);

  useEffect(() => {
    setDistrictList([]);
    const tmp = locations.find((i) => i.name == jobDetails.location?.province);
    setDistrictList(tmp?.districts || []);
  }, [jobDetails]);

  useEffect(() => {
    console.log(jobDetails);
    setCommuneList([]);
    const tmp = districtList.find(
      (i) => i.name == jobDetails.location?.district
    );
    setCommuneList(tmp?.wards || []);
  }, [jobDetails]);

  const handleInput = (key, value) => {
    setJobDetails({
      ...jobDetails,
      [key]: value,
    });
  };

  const handleLocationChange = (key, value) => {
    const location = { ...jobDetails.location, [key]: value };
    setJobDetails({
      ...jobDetails,
      location,
    });
  };

  const handleUpdate = () => {
    console.log(jobDetails);
    axios
      .post(apiList.jobs, jobDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        setJobDetails({
          title: "",
          maxApplicants: 100,
          maxPositions: 30,
          deadline: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
            .toISOString()
            .substr(0, 16),
          jobType: "Offline",
          duration: 0,
          salary: 0,
          location: {
            no: "",
            province: "",
            district: "",
            commune: "",
          },
        });
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        console.log(err.response);
      });
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      sx={{ padding: "50px", minHeight: "93vh" }}
    >
      <Grid item>
        <Typography variant="h2">Đăng tin</Typography>
      </Grid>
      <Grid item container xs direction="column" justifyContent="center">
        <Grid item>
          <Paper
            sx={{
              padding: "20px",
              outline: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid container direction="column" alignItems="stretch" spacing={3}>
              <Grid item>
                <TextField
                  label="Tên công việc"
                  required
                  value={jobDetails.title}
                  onChange={(event) => handleInput("title", event.target.value)}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  select
                  label="Loại công việc"
                  required
                  variant="outlined"
                  value={jobDetails.jobType}
                  onChange={(event) => {
                    handleInput("jobType", event.target.value);
                  }}
                  fullWidth
                >
                  <MenuItem value="Offline">Offline</MenuItem>
                  <MenuItem value="Online">Online</MenuItem>
                  <MenuItem value="Flexible">Linh hoạt</MenuItem>
                </TextField>
              </Grid>
              <Grid item>
                <TextField
                  select
                  label="Thời gian thực tập"
                  required
                  variant="outlined"
                  value={jobDetails.duration}
                  onChange={(event) => {
                    handleInput("duration", event.target.value);
                  }}
                  fullWidth
                >
                  <MenuItem value={1}>1 Tháng</MenuItem>
                  <MenuItem value={3}>3 Tháng</MenuItem>
                  <MenuItem value={6}>6 Tháng</MenuItem>
                  <MenuItem value={7}>Hơn 6 Tháng</MenuItem>
                </TextField>
              </Grid>
              <Grid item>
                <TextField
                  label="Trợ phí"
                  required
                  type="number"
                  variant="outlined"
                  value={jobDetails.salary}
                  onChange={(event) => {
                    handleInput("salary", event.target.value);
                  }}
                  InputProps={{ inputProps: { min: 0 } }}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Hạn chót"
                  required
                  type="datetime-local"
                  value={jobDetails.deadline}
                  onChange={(event) => {
                    handleInput("deadline", event.target.value);
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Số lượng tối đa"
                  required
                  type="number"
                  variant="outlined"
                  value={jobDetails.maxApplicants}
                  onChange={(event) => {
                    handleInput("maxApplicants", event.target.value);
                  }}
                  InputProps={{ inputProps: { min: 1 } }}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Số vị trí được nhận tối đa"
                  required
                  type="number"
                  variant="outlined"
                  value={jobDetails.maxPositions}
                  onChange={(event) => {
                    handleInput("maxPositions", event.target.value);
                  }}
                  InputProps={{ inputProps: { min: 1 } }}
                  fullWidth
                />
              </Grid>
              <Grid item container>
                <Grid item xs={3}>
                  <TextField
                    label="Tòa nhà, ấp,..."
                    required
                    type="text"
                    variant="outlined"
                    onChange={(event) => {
                      handleLocationChange("no", event.target.value);
                    }}
                    InputProps={{ inputProps: { min: 1 } }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    select
                    id="province"
                    label="Tỉnh/Thành"
                    required
                    variant="outlined"
                    onChange={(event) => {
                      handleLocationChange("province", event.target.value);
                    }}
                    InputProps={{ inputProps: { min: 1 } }}
                    fullWidth
                  >
                    {locations.map((v, index) => (
                      <MenuItem key={index} value={v.name}>
                        {v.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    select
                    id="district"
                    label="Quận/Huyện"
                    required
                    variant="outlined"
                    InputProps={{ inputProps: { min: 1 } }}
                    fullWidth
                    onChange={(event) => {
                      handleLocationChange("district", event.target.value);
                    }}
                  >
                    {districtList?.map((v, index) => (
                      <MenuItem key={index} value={v.name}>
                        {v.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    select
                    id="commune"
                    label="Xã/Phường"
                    required
                    variant="outlined"
                    InputProps={{ inputProps: { min: 1 } }}
                    fullWidth
                    onChange={(event) => {
                      handleLocationChange("commune", event.target.value);
                    }}
                  >
                    {communeList?.map((v, index) => (
                      <MenuItem key={index} value={v.name}>
                        {v.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
              <Grid item>
                <Select
                  isMulti
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      height: "56px",
                      margin: "10px 0",
                    }),
                  }}
                  placeholder="Ngành nghề liên quan"
                  defaultValue={""}
                  options={majors}
                  onChange={(v) => {
                    handleInput("major", v.value);
                    console.log(v);
                  }}
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              sx={{ padding: "10px 50px", marginTop: "30px" }}
              onClick={() => handleUpdate()}
            >
              Tạo công việc
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CreateJobs;
