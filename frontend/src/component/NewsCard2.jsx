import axios from "axios";
import { Chip, Grid, Paper, Typography, Link, Box } from "@mui/material";
import UsersService from "../services/user.service";

const NewsCard2 = (props) => {
  const { news } = props;

  return (
    <Grid
      container
      sx={{
        marginTop: "20px",
        minWidth: "200px",
        width: "100%",
        textDecoration: "none",
      }}
    >
      <Link
        href={`/tin-tuc/${news._id}`}
        sx={{ textDecoration: "none" }}
        target="_blank"
      >
        <Grid container sx={{ color: "common.black" }}>
          <Grid item container xs={12}>
            <Box
              component="img"
              sx={{
                width: "100%",
                height: "100%",
              }}
              alt="avt_company"
              src={news?.img}
            />
          </Grid>
          <Grid item container xs={12} sx={{ padding: "10px 0" }}>
            <Grid item>
              <Typography variant="h6" fontWeight="bold" textAlign="left">
                {news?.title}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Link>
    </Grid>
  );
};

export default NewsCard2;
