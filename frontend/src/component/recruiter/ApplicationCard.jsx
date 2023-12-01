import { useContext, useEffect } from "react";
import { useState } from "react";
import { SetPopupContext } from "../../App";
import {
  Button,
  Chip,
  Grid,
  Paper,
  Typography,
  Modal,
  Rating,
  Avatar,
} from "@mui/material";
import apiList, { server } from "../../lib/apiList";
import axios from "axios";

const ApplicationCard = (props) => {
  const { application, getData } = props;
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);

  const appliedOn = new Date(application.dateOfApplication);

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

  const getResume = () => {
    if (
      application.jobApplicant.resume &&
      application.jobApplicant.resume !== ""
    ) {
      const address = `${apiList.downloadResume}/${application.resume.filename}`;
      // console.log(address);
      axios(address, {
        method: "GET",
        responseType: "blob",
      })
        .then((response) => {
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        })
        .catch((error) => {
          // console.log(error);
          setPopup({
            open: true,
            severity: "error",
            message: "Error",
          });
        });
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "Không tìm thấy CV",
      });
    }
  };

  const updateStatus = (status) => {
    const address = `${apiList.applications}/${application._id}`;
    const statusData = {
      status: status,
      dateOfJoining: new Date().toISOString(),
    };
    axios
      .put(address, statusData, {
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
        axios
          .post(
            `${apiList.user}/${application.jobApplicant._id}`,
            {
              notification: {
                AID: application.jobApplicant.userId,
                UID: application.jobApplicant._id,
                title: "BẠN CÓ TIN CẬP NHẬT TRẠNG THÁI CÔNG VIỆC",
                desc: `Công việc ${application.job.title} mà bạn đang ứng tuyển đã được nhà tuyển dụng đưa vào danh sách ${status}`,
                type: "update",
                link: "/ung-vien",
                createAt: "",
              },
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((response) => {
            console.log(response);
          })
          .catch((err) => {
            console.log(err.response);
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

  useEffect(() => {
    getData();
  }, []);

  const buttonSet = {
    applied: (
      <>
        <Grid item xs>
          <Button
            variant="contained"
            sx={{
              background: colorSet["shortlisted"],
              color: "#ffffff",
              width: "100%",
            }}
            onClick={() => updateStatus("shortlisted")}
          >
            Xem xét
          </Button>
        </Grid>
        <Grid item xs>
          <Button
            variant="contained"
            sx={{
              background: colorSet["rejected"],
              color: "#ffffff",
              width: "100%",
            }}
            onClick={() => updateStatus("rejected")}
          >
            Từ chối
          </Button>
        </Grid>
      </>
    ),
    shortlisted: (
      <>
        <Grid item xs>
          <Button
            variant="contained"
            sx={{
              background: colorSet["accepted"],
              color: "#ffffff",
              width: "100%",
              height: "100%",
            }}
            onClick={() => updateStatus("accepted")}
          >
            Tiếp nhận
          </Button>
        </Grid>
        <Grid item xs>
          <Button
            variant="contained"
            sx={{
              background: colorSet["rejected"],
              color: "#ffffff",
              width: "100%",
              height: "100%",
            }}
            onClick={() => updateStatus("rejected")}
          >
            Từ chối
          </Button>
        </Grid>
      </>
    ),
    rejected: (
      <>
        <Grid item xs>
          <Paper
            sx={{
              background: colorSet["rejected"],
              color: "#ffffff",
              width: "100%",
            }}
          >
            Từ chối
          </Paper>
        </Grid>
      </>
    ),
    accepted: (
      <>
        <Grid item xs>
          <Paper
            sx={{
              background: colorSet["accepted"],
              color: "#ffffff",
              width: "100%",
              height: "100%",
              textAlign: "center",
              padding: "25% 0",
            }}
          >
            ĐÃ DUYỆT
          </Paper>
        </Grid>
      </>
    ),
    cancelled: (
      <>
        <Grid item xs>
          <Paper
            sx={{
              background: colorSet["cancelled"],
              color: "#ffffff",
            }}
          >
            Cancelled
          </Paper>
        </Grid>
      </>
    ),
    finished: (
      <>
        <Grid item xs>
          <Paper
            sx={{
              background: colorSet["finished"],
              color: "#ffffff",
            }}
          >
            Finished
          </Paper>
        </Grid>
      </>
    ),
  };

  return (
    <Paper
      elevation={3}
      container
      sx={{
        margin: "10px",
        padding: "20px",
        minWidth: "500px",
        textDecoration: "none",
        borderRadius: "30px",
      }}
    >
      <Grid container item>
        <Grid
          item
          xs={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar src={`${server}${application.jobApplicant.profile}`} />
        </Grid>
        <Grid container item xs={7} spacing={1} direction="column">
          <Grid item>
            <Typography variant="h5">
              {application.jobApplicant.name}
            </Typography>
          </Grid>
          <Grid item>
            <Rating
              value={
                application.jobApplicant.rating !== -1
                  ? application.jobApplicant.rating
                  : null
              }
              readOnly
            />
          </Grid>
          <Grid item>
            Ngày ứng tuyển: {appliedOn.toLocaleDateString("en-GB")}
          </Grid>
          <Grid item>Ngành học: {application?.jobApplicant?.major}</Grid>
          <Grid item>Trường: {application?.jobApplicant?.school}</Grid>
          <Grid item>
            Lời giới thiệu:{" "}
            {application.sop !== "" ? application.sop : "Not Submitted"}
          </Grid>
          <Grid item>
            {application.jobApplicant.skills.map((skill) => (
              <Chip label={skill} sx={{ marginRight: "2px" }} />
            ))}
          </Grid>
        </Grid>
        <Grid item container direction="column" xs={3}>
          <Grid item>
            <Button
              sx={{ width: "100%" }}
              variant="contained"
              onClick={() => getResume()}
            >
              Tải CV
            </Button>
          </Grid>
          <Grid item container xs>
            {buttonSet[application.status]}
          </Grid>
        </Grid>
      </Grid>

      <Modal open={open} onClose={handleClose}>
        <Paper>
          <Button
            variant="contained"
            sx={{ padding: "10px 50px" }}
            // onClick={() => changeRating()}
          >
            Submit
          </Button>
        </Paper>
      </Modal>
    </Paper>
  );
};

export default ApplicationCard;
