import { useContext, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Paper,
  TextField,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import axios from "axios";
import Select from "react-select";

import { SetPopupContext } from "../../App";

import apiList from "../../lib/apiList";
import { useEffect } from "react";
import MajorsService from "../../services/major.service";

import AuthService from "../../services/auth.service";
import { useHistory } from "react-router-dom";

const CreateNewsPage = (props) => {
  const authServ = new AuthService();
  const majorServ = new MajorsService();
  const setPopup = useContext(SetPopupContext);

  let history = useHistory();

  const initValue = {
    title: "",
    img: "",
    content: "",
    majors: "",
  };
  const [newsDetails, setJobDetails] = useState(initValue);

  const [majors, setMajors] = useState([]);

  const [user, setUser] = useState();
  async function getAuth() {
    let auth = await authServ.get();
    setUser(auth);
  }
  useEffect(() => {
    getAuth();
  }, []);

  const handleClick = (location) => {
    history.push(location);
  };

  useEffect(() => {
    async function getData() {
      const majors = await majorServ.getAll();
      setMajors(
        majors?.[0].majors.map((item) => {
          return { label: item, value: item };
        }) || []
      );
    }
    getData();
  }, []);

  const handleInput = (key, value) => {
    setJobDetails({
      ...newsDetails,
      [key]: value,
    });
  };

  const handleMajorChange = (value) => {
    const major = value?.map((item) => {
      return item.value;
    });
    setJobDetails({
      ...newsDetails,
      major,
    });
  };

  const handleUpdate = () => {
    axios
      .post(apiList.news, newsDetails, {
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
          img: "",
          content: "",
          majors: "",
        });
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
      });
  };

  return (
    <Grid
      container
      direction="column"
      sx={{ padding: { md: "50px 200px", xs: "50px 0" }, minHeight: "93vh" }}
    >
      <Grid
        item
        xs={12}
        justifyContent="left"
        sx={{ display: "flex", justifyContent: "left" }}
      >
        <Button
          sx={{ marginRight: "auto", justifyContent: "left" }}
          onClick={() => handleClick("/admin/tin-tuc")}
        >
          <ArrowBackIosNewIcon /> Quay lại
        </Button>
      </Grid>
      <Grid item>
        <Typography variant="h2" textAlign="center">
          Đăng tin
        </Typography>
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
                  label="Tiêu đề bài viết"
                  required
                  value={newsDetails.title}
                  onChange={(event) => handleInput("title", event.target.value)}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Ảnh bìa bài viết"
                  required
                  value={newsDetails.img}
                  onChange={(event) => handleInput("img", event.target.value)}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  multiline
                  rows={8}
                  label="Nội dung bài viết"
                  value={newsDetails?.content}
                  required
                  onChange={(event) =>
                    handleInput("content", event.target.value)
                  }
                  variant="outlined"
                  fullWidth
                />
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
                  maxLength={5}
                  aria-valuemax={5}
                  placeholder="Ngành nghề liên quan"
                  // value={newsDetails?.major}
                  options={majors}
                  onChange={(v) => {
                    handleMajorChange(v);
                  }}
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              sx={{ padding: "10px 50px", marginTop: "30px" }}
              onClick={() => handleUpdate()}
            >
              Tạo bài viết
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CreateNewsPage;
