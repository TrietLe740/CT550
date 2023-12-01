import axios from "axios";
import {
  Button,
  Chip,
  Grid,
  Paper,
  TextField,
  Typography,
  Modal,
  Rating,
  Link,
  Avatar,
  Box,
} from "@mui/material";
import apiList, { server } from "../lib/apiList";

import { userType } from "../lib/isAuth";
import { useContext, useEffect, useState } from "react";
import { SetPopupContext } from "../App";
import UsersService from "../services/user.service";

const JobCard = (props) => {
  const userServ = new UsersService();
  const [profileDetails, setProfileDetails] = useState();
  const { job } = props;

  const [open, setOpen] = useState(false);
  const [sop, setSop] = useState("");

  const handleClose = () => {
    setOpen(false);
    setSop("");
  };

  useEffect(() => {
    async function getUser() {
      const user = await userServ.getRecruiter(job.recruiter._id);
      // console.log(user);
      setProfileDetails(user);
    }

    getUser();
  }, []);

  return (
    <Paper
      sx={{
        padding: "20px",
        marginTop: "20px",
        minWidth: "200px",
        width: "100%",
        textDecoration: "none",
        borderRadius: "30px",
      }}
    >
      <Link
        href={`/viec-lam/${job._id}`}
        sx={{ textDecoration: "none" }}
        target="_blank"
      >
        <Grid container>
          {/* Ảnh đại diện công ty */}
          <Grid item xs={3}>
            <Box
              component="img"
              sx={{
                width: "100%",
                padding: "10px",
              }}
              alt="avt_company"
              src={profileDetails?.avatar}
            />
          </Grid>

          {/* Phần thông tin */}
          <Grid
            container
            item
            spacing={1}
            xs={9}
            direction="column"
            sx={{ padding: "10px" }}
          >
            <Grid item>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {job.title}
              </Typography>
            </Grid>
            <Grid item>{job.recruiter?.companyName}</Grid>
            <Grid item>
              Số tháng thực tập:{" "}
              {job.duration > 0 ? `${job.duration} Tháng` : `Linh hoạt`}
            </Grid>
            <Grid item>
              <Chip
                label={job?.location?.province}
                style={{ marginRight: "5px" }}
              />
              <br />
              {job?.majors?.map((m) => (
                <Chip label={m} sx={{ marginRight: "5px", marginTop: "5px" }} />
              ))}
            </Grid>
          </Grid>
          {/* <Grid item xs={3}>
            <Button
              variant="contained"
              onClick={() => {
                setOpen(true);
              }}
              disabled={userType() === "recruiter"}
            >
              Ứng tuyển
            </Button>
          </Grid> */}
        </Grid>
        {/* <Modal open={open} onClose={handleClose}>
          <Paper>
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
              sx={{ padding: "10px 50px" }}
              onClick={() => handleApply()}
            >
              Submit
            </Button>
          </Paper>
        </Modal> */}
      </Link>
    </Paper>
  );
};

export default JobCard;
