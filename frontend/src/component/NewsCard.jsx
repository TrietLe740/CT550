import axios from "axios";
import { Chip, Grid, Paper, Typography, Link, Box } from "@mui/material";
import UsersService from "../services/user.service";

const NewsCard = (props) => {
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
          <Grid item container xs={3}>
            <Box
              component="img"
              sx={{
                width: "100%",
                boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
              }}
              alt="avt_company"
              src={news?.img}
            />
          </Grid>
          <Grid item container xs={9} sx={{ padding: "10px 30px" }}>
            <Grid item>
              <Typography variant="h5" fontWeight="bold">
                {news?.title}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="p"
                className="cut-off-text"
                sx={{ textAlign: "justify" }}
              >
                {news?.content}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Link>
    </Grid>
  );
};

export default NewsCard;
