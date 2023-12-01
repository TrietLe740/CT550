import { useState, useEffect, useContext } from "react";
import { Button, Chip, Grid, Paper, Typography, Modal } from "@mui/material";
import Rating from "@mui/material/Rating";
import axios from "axios";

import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";

const ApplicationTile = (props) => {
  const { application } = props;
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(application.job.rating);

  const appliedOn = new Date(application.dateOfApplication);
  const joinedOn = new Date(application.dateOfJoining);

  const fetchRating = () => {
    axios
      .get(`${apiList.rating}?id=${application.job._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setRating(response.data.rating);
        // console.log(response.data);
      })
      .catch((err) => {
        // console.log(err.response);
        // console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  const changeRating = () => {
    axios
      .put(
        apiList.rating,
        { rating: rating, jobId: application.job._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        // console.log(response.data);
        setPopup({
          open: true,
          severity: "success",
          message: "Rating updated successfully",
        });
        fetchRating();
        setOpen(false);
      })
      .catch((err) => {
        // console.log(err.response);
        // console.log(err);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        fetchRating();
        setOpen(false);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const colorSet = {
    applied: "#3454D1",
    shortlisted: "#DC851F",
    accepted: "#09BC8A",
    rejected: "#D1345B",
    deleted: "#B49A67",
    cancelled: "#FF8484",
    finished: "#4EA5D9",
  };

  return (
    <Paper elevation={3} sx={{ margin: "20px 100px", borderRadius: "30px" }}>
      <Grid container sx={{ padding: "30px 50px", borderRadius: "30px" }}>
        <Grid container item xs={9} spacing={1} direction="column">
          <Grid item>
            <Typography variant="h5" fontWeight="bold">
              {application.job.title}
            </Typography>
          </Grid>
          <Grid item>Đăng bởi: {application.recruiter.companyName}</Grid>
          <Grid item>Loại: {application.job.jobType}</Grid>
          <Grid item>
            Trợ phí:{" "}
            {application.job.salary > 0
              ? `${application.job.salary}/Tháng`
              : `Không có`}
          </Grid>
          <Grid item>
            Thời gian thực tập :{" "}
            {application.job.duration > 0
              ? `${application.job.duration} Tháng`
              : `Linh hoạt`}
          </Grid>
          <Grid item>
            {application.job.skillsets?.map((skill) => (
              <Chip label={skill} sx={{ marginRight: "2px" }} />
            ))}
          </Grid>
          <Grid item>
            Ứng tuyển vào ngày: {appliedOn.toLocaleDateString("en-GB")}
          </Grid>
          {application.status === "accepted" ||
          application.status === "finished" ? (
            <Grid item>
              Tham gia vào ngày: {joinedOn.toLocaleDateString("en-GB")}
            </Grid>
          ) : null}
        </Grid>
        <Grid item container direction="column" xs={3}>
          <Grid item xs>
            <Paper
              sx={{
                background: colorSet[application.status],
                color: "#fff",
                width: "100%",
                height: "100%",
                fontWeight: "bold",
              }}
            >
              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
                variant="p"
              >
                {application.status.toUpperCase()}
              </Typography>
            </Paper>
          </Grid>
          {application.status === "accepted" ||
          application.status === "finished" ? (
            <Grid item>
              <Button
                sx={{ width: "100%" }}
                variant="contained"
                color="primary"
                onClick={() => {
                  fetchRating();
                  setOpen(true);
                }}
              >
                Đánh giá công việc
              </Button>
            </Grid>
          ) : null}
        </Grid>
      </Grid>
      <Modal open={open} onClose={handleClose}>
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "30%",
            alignItems: "center",
          }}
        >
          <Rating
            name="simple-controlled"
            style={{ marginBottom: "30px" }}
            value={rating === -1 ? null : rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ padding: "10px 50px" }}
            onClick={() => changeRating()}
          >
            Xác nhận
          </Button>
        </Paper>
      </Modal>
    </Paper>
  );
};

const Applications = (props) => {
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(apiList.applications, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setApplications(response.data);
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
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item sx={{ marginTop: "100px", marginBottom: "50px" }}>
        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
          CÔNG VIỆC BẠN ĐANG ỨNG TUYỂN
        </Typography>
      </Grid>
      <Grid
        container
        item
        direction="column"
        sx={{ width: "100%" }}
        alignItems="stretch"
        justify="center"
      >
        {applications.length > 0 ? (
          applications?.map((obj) => (
            <Grid item>
              <ApplicationTile application={obj} />
            </Grid>
          ))
        ) : (
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Chưa có công việc ứng tuyển
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default Applications;
