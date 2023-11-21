import { useState, useContext, useEffect } from "react";
import { Grid, Button, TextField, LinearProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { SetPopupContext } from "../App";
import UploadService from "../services/upload.sevice";

const FileUploadInput = (props) => {
  const uploadServ = new UploadService();
  const setPopup = useContext(SetPopupContext);

  const [file, setFile] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const handleUpload = async () => {
    const data = new FormData();
    data.append("file", file);

    try {
      await uploadServ.uploadResume(data);
      // console.log(uploadData);
      setPopup({
        open: true,
        severity: "success",
        message: "Upload CV thành công!",
      });
      location.href("http://localhost:3000/ho-so/chinh-sua");
    } catch (error) {
      console.log(error);
      setPopup({
        open: true,
        severity: "error",
        message: "Đã có lỗi xảy ra!",
      });
    }
  };

  return (
    <Grid container item xs={12} direction="column" className={props.className}>
      <Grid container item xs={12} spacing={0}>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            component="label"
            style={{ width: "100%", height: "100%" }}
          >
            {props.icon}
            <input
              accept=".pdf"
              type="file"
              style={{ display: "none" }}
              onChange={(event) => {
                console.log(event.target.files);
                if (event.target.files[0].type == "application/pdf") {
                  setUploadPercentage(0);
                  setFile(event.target.files[0]);
                } else {
                  setPopup({
                    open: true,
                    severity: "error",
                    message: "Sai định dạng!",
                  });
                }
              }}
            />
          </Button>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label={props.label}
            value={file ? file.name || "" : ""}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            sx={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="secondary"
            sx={{ width: "100%", height: "100%" }}
            onClick={() => handleUpload()}
            disabled={file ? false : true}
          >
            <CloudUploadIcon />
          </Button>
        </Grid>
      </Grid>
      <Grid item>
        {uploadPercentage !== 0 ? (
          <Grid item xs={12} style={{ marginTop: "10px" }}>
            <LinearProgress variant="determinate" value={uploadPercentage} />
          </Grid>
        ) : null}
      </Grid>
    </Grid>
  );
};

export default FileUploadInput;
