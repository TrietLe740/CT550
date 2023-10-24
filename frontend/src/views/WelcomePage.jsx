import { Grid, Typography, Button, IconButton, Input } from "@mui/material";
import LOGO from "../assets/logo_Hitern.png";
import { useHistory } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

const Welcome = (props) => {
  let history = useHistory();
  const [searchInput, setSearchInput] = useState("");

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid
        container
        item
        xs={12}
        sx={{
          borderRadius: "20px 20px 200px 20px",
          backgroundColor: "primary.main",
          minHeight: "60vh",
          padding: "50px",
          marginTop: "100px",
        }}
      >
        <Grid container item xs={6} direction="column" sx={{ padding: "50px" }}>
          <Grid item>
            <Typography
              variant="h2"
              sx={{ color: "common.white", fontWeight: "bold" }}
              textAlign="left"
            >
              TÌM VIỆC CHẤT
              <br />
              NÂNG CAO TAY NGHỀ
            </Typography>
          </Grid>
          <Grid
            item
            sx={{
              border: "2px solid #36593C",
              borderRadius: "20px",
              padding: "0 0 0 20px",
              backgroundColor: "common.white",
            }}
          >
            <IconButton
              onClick={() =>
                history.push({
                  pathname: "/tim-kiem",
                  search: `?search=${searchInput}`,
                })
              }
            >
              <SearchIcon
                sx={{
                  color: "common.black",
                }}
              />
            </IconButton>
            <Input
              sx={{ height: "50px", width: "50%" }}
              placeholder="Tìm kiếm công việc, công ty,..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              onKeyPress={(ev) => {
                if (ev.key === "Enter") {
                  history.push({
                    pathname: "/tim-kiem",
                    search: `?search=${searchInput}`,
                  });
                }
              }}
            />
            <Button
              sx={{ marginLeft: "40px" }}
              variant="contained"
              onClick={() =>
                history.push({
                  pathname: "/tim-kiem",
                  search: `?search=${searchInput}`,
                })
              }
            >
              Tìm kiếm
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <img src="/src/assets/JOB.png" />
        </Grid>
      </Grid>
      {/* 2 */}
      <Grid item container sx={{ margin: "50px auto" }} xs={12}>
        <Grid item xs={12} textAlign="center">
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            NHÀ TUYỂN DỤNG HÀNG ĐẦU
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export const ErrorPage = (props) => {
  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item>
        <Typography variant="h2">Error 404</Typography>
      </Grid>
    </Grid>
  );
};

export default Welcome;
