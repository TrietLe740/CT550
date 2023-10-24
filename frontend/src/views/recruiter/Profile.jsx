import { useContext, useEffect, useState } from "react";
import { Button, Grid, Typography, Paper, TextField } from "@mui/material";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

import { SetPopupContext } from "../../App";

import apiList from "../../lib/apiList";

const Profile = (props) => {
  const setPopup = useContext(SetPopupContext);

  const [profileDetails, setProfileDetails] = useState({
    name: "",
    bio: "",
    contactNumber: "",
  });

  const [phone, setPhone] = useState("");

  const handleInput = (key, value) => {
    setProfileDetails({
      ...profileDetails,
      [key]: value,
    });
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = () => {
    axios
      .get(apiList.user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setProfileDetails(response.data);
        setPhone(response.data.contactNumber);
      })
      .catch((err) => {
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  const handleUpdate = () => {
    let updatedDetails = {
      ...profileDetails,
    };
    if (phone !== "") {
      updatedDetails = {
        ...profileDetails,
        contactNumber: `+${phone}`,
      };
    } else {
      updatedDetails = {
        ...profileDetails,
        contactNumber: "",
      };
    }

    axios
      .put(apiList.user, updatedDetails, {
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
    <>
      <Grid
        sx={{ padding: "100px" }}
        container
        item
        direction="column"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="h2">Thông tin doanh nghiệp</Typography>
        </Grid>
        <Grid item xs style={{ width: "100%" }}>
          <Paper
            style={{
              padding: "20px",
              outline: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              //   width: "60%",
            }}
          >
            <Grid container direction="column" alignItems="stretch" spacing={3}>
              <Grid item>
                <TextField
                  label="Tên doanh nghiệp"
                  value={profileDetails.name}
                  onChange={(event) => handleInput("name", event.target.value)}
                  // className={classes.inputBox}
                  variant="outlined"
                  fullWidth
                  style={{ width: "100%" }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Thông tin mô tả)"
                  multiline
                  rows={8}
                  style={{ width: "100%" }}
                  variant="outlined"
                  value={profileDetails.bio}
                  onChange={(event) => {
                    if (
                      event.target.value.split(" ").filter(function (n) {
                        // eslint-disable-next-line eqeqeq
                        return n != "";
                      }).length <= 250
                    ) {
                      handleInput("bio", event.target.value);
                    }
                  }}
                />
              </Grid>
              <Grid
                item
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <PhoneInput
                  country={"vn"}
                  value={phone}
                  onChange={(phone) => setPhone(phone)}
                  style={{ width: "auto" }}
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              style={{ padding: "10px 50px", marginTop: "30px" }}
              onClick={() => handleUpdate()}
            >
              Cập nhật thông tin
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Profile;
