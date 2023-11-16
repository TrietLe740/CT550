import React, { useState } from "react";
import FileUploadInput from "../component/FileUploadInput";
import { Grid, Typography } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import apiList from "../lib/apiList";

export default function UploadCVPage() {
  const [signupDetails, setSignupDetails] = useState({
    resume: "",
  });

  const handleInput = (key, value) => {
    setSignupDetails({
      ...signupDetails,
      [key]: value,
    });
  };

  return (
    <Grid container sx={{ padding: "50px", minHeight: "93vh" }}>
      <Typography variant="p">Tải lên CV của bạn</Typography>
      <Grid item sx={{ marginTop: "20px", width: "100%" }}>
        <FileUploadInput
          label="CV (.pdf)"
          icon={<DescriptionIcon />}
          uploadTo={apiList.uploadResume}
          handleInput={handleInput}
          identifier={"resume"}
        />
      </Grid>
    </Grid>
  );
}
