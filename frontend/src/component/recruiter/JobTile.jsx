import { useState, useEffect, useContext } from "react";
import Select from "react-select";

import {
  Button,
  Chip,
  Grid,
  Paper,
  TextField,
  Typography,
  Modal,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import Rating from "@mui/material/Rating";

import axios from "axios";
import { SetPopupContext } from "../../App";
import apiList from "../../lib/apiList";
import MajorsService from "../../services/major.service";

const JobTile = (props) => {
  const majorServ = new MajorsService();

  let history = useHistory();
  const { job, getData } = props;
  const setPopup = useContext(SetPopupContext);

  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [jobDetails, setJobDetails] = useState(job);

  console.log(jobDetails);

  const [majors, setMajors] = useState({});

  useEffect(() => {
    async function getMajor() {
      const majors = await majorServ.getAll();
      setMajors(
        majors?.[0].majors.map((item) => {
          return { label: item, value: item };
        }) || []
      );
    }
    getMajor();
  }, []);

  const handleInput = (key, value) => {
    setJobDetails({
      ...jobDetails,
      [key]: value,
    });
  };

  const handleClick = (location) => {
    history.push(location);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleDelete = () => {
    console.log(job._id);
    axios
      .delete(`${apiList.jobs}/${job._id}`, {
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
        getData();
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

  const handleJobUpdate = () => {
    axios
      .put(`${apiList.jobs}/${job._id}`, jobDetails, {
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
        getData();
        handleCloseUpdate();
      })
      .catch((err) => {
        console.log(err.response);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleCloseUpdate();
      });
  };

  const postedOn = new Date(job.dateOfPosting);

  return (
    <Paper elevation={3}>
      <Grid container sx={{ padding: "30px" }}>
        <Grid container item xs={9} spacing={1} direction="column">
          <Grid item>
            <Typography variant="h5">{job.title}</Typography>
          </Grid>
          <Grid item>
            <Rating value={job.rating !== -1 ? job.rating : null} readOnly />
          </Grid>
          <Grid item>Loại: {job.jobType}</Grid>
          <Grid item>
            Trợ phí: {job.salary ? `${job.salary} VNĐ/Tháng}` : `Không có`}
          </Grid>
          <Grid item>
            Thời gian thực tập:{" "}
            {job.duration > 0 ? `${job.duration} Tháng` : `Linh động`}
          </Grid>
          <Grid item>
            Ngày đăng tuyển: {postedOn.toLocaleDateString("en-GB")}
          </Grid>
          <Grid item>Số lượng tối đa: {job.maxApplicants}</Grid>
          <Grid item>
            Số chỗ tiếp nhận còn lại:{" "}
            {job.maxPositions - job.acceptedCandidates}
          </Grid>
          <Grid item>
            Ngành nghề liên quan:
            <br />
            {job.majors.map((m) => (
              <Chip label={m} sx={{ marginRight: "2px" }} />
            ))}
          </Grid>
          <Grid item>
            Địa chỉ:{" "}
            {`${job?.location?.no}, ${job?.location?.commune}, ${job?.location?.district}, ${job?.location?.province}`}
          </Grid>
        </Grid>
        <Grid item container direction="column" xs={3}>
          <Grid item xs>
            <Button
              sx={{ width: "100%", height: "100%" }}
              variant="contained"
              onClick={() => handleClick(`/cong-viec/ung-vien/${job._id}`)}
            >
              Xem DS ứng viên
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={() => {
                setOpenUpdate(true);
              }}
              sx={{
                width: "100%",
                background: "#FC7A1E",
                color: "#fff",
              }}
            >
              Cập nhật công việc
            </Button>
          </Grid>
          <Grid item>
            <Button
              sx={{ width: "100%", background: "#D71313" }}
              variant="contained"
              onClick={() => {
                setOpen(true);
              }}
            >
              Xóa công việc
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Modal open={open} onClose={handleClose}>
        <Paper
          sx={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "30%",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" sx={{ marginBottom: "10px" }}>
            Bạn có chắc chắn muốn xóa?
          </Typography>
          <Grid container justifyContent="center" spacing={5}>
            <Grid item>
              <Button
                variant="contained"
                sx={{ padding: "10px 50px", backgroundColor: "#D71313" }}
                onClick={() => handleDelete()}
              >
                Xóa
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                sx={{ padding: "10px 50px" }}
                onClick={() => handleClose()}
              >
                Thoát
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
      <Modal open={openUpdate} onClose={handleCloseUpdate}>
        <Paper
          sx={{
            margin: "2% auto",
            padding: "30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: "80%",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" sx={{ marginBottom: "10px" }}>
            Cập nhật thông tin
          </Typography>
          <Grid container direction="column" sx={{ margin: "10px" }}>
            <Grid item>
              <TextField
                label="Tên công việc"
                type="text"
                disabled
                value={jobDetails.title}
                onChange={(event) => {
                  handleInput("title", event.target.value);
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
                sx={{ marginTop: "20px" }}
                label="Hạn chót"
                type="datetime-local"
                value={jobDetails.deadline.substr(0, 16)}
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
            <Grid item container sx={{ marginTop: "20px" }}>
              <Grid item xs={6}>
                <TextField
                  sx={{ paddingRight: "10px" }}
                  label="Số lượng tối đa"
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
              <Grid item xs={6}>
                <TextField
                  sx={{ paddingLeft: "10px" }}
                  label="Số chỗ tiếp nhận còn lại"
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
            </Grid>
            <Grid item>
              <Select
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    height: "56px",
                    margin: "20px 0",
                  }),
                }}
                closeMenuOnSelect={false}
                isMulti
                options={majors}
                defaultValue={{
                  value: jobDetails?.major,
                  label: jobDetails?.major,
                }}
                onChange={(v) => {
                  handleInput("major", v.value);
                }}
              />
            </Grid>
          </Grid>
          <Grid container justifyContent="center" spacing={5}>
            <Grid item>
              <Button
                variant="contained"
                sx={{ padding: "10px 10px", width: "150px" }}
                onClick={() => handleJobUpdate()}
              >
                Cập nhật
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                sx={{ padding: "10px 10px", width: "150px" }}
                onClick={() => handleCloseUpdate()}
              >
                Thoát
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    </Paper>
  );
};

export default JobTile;
