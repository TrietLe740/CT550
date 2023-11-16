import { useState, useContext, useEffect } from "react";
import { Grid, Button, TextField, LinearProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { SetPopupContext } from "../App";
import UploadService from "../services/upload.sevice";
import UsersService from "../services/user.service";

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
      alert("Upload thành công!");
    } catch (error) {
      console.log(error);
    }
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    //   onUploadProgress: (progressEvent) => {
    //     setUploadPercentage(
    //       parseInt(
    //         Math.round((progressEvent.loaded * 100) / progressEvent.total)
    //       )
    //     );
    //   },
    // })
    //   .then((response) => {
    //     console.log(response.data);
    //     handleInput(identifier, response.data.url);
    //     setPopup({
    //       open: true,
    //       severity: "success",
    //       message: response.data.message,
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(err.response);
    //     setPopup({
    //       open: true,
    //       severity: "error",
    //       message: err?.response?.data,
    //     });
    //   });
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
                  alert("Sai định dạng");
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
            style={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="secondary"
            style={{ width: "100%", height: "100%" }}
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
