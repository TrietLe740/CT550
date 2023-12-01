import axios from "axios";
import { Button, Grid, Paper, Box, Link, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const RecruiterCard = (props) => {
  const { company } = props;

  return (
    <Paper
      sx={{
        margin: "10px",
        padding: "20px",
        width: "380px",
        height: "380px",
        textDecoration: "none",
        borderRadius: "30px",
      }}
    >
      <Link
        href={`/cong-ty/${company?._id}`}
        sx={{ textDecoration: "none" }}
        target="_blank"
      >
        <Grid container columns sx={{ textAlign: "center" }}>
          {/* Ảnh đại diện công ty */}
          <Grid item xs={12} sx={{ height: "200px" }}>
            <Box
              component="img"
              sx={{
                margin: "0 auto",
                maxWidth: "200px",
                maxHeight: "200px",
                padding: "10px",
              }}
              alt="avt_company"
              src={company?.avatar}
            />
          </Grid>
          <Grid item xs={12} sx={{ mb: 2, height: "50px" }}>
            <Typography
              variant="h5"
              sx={{ color: "common.black", fontSize: "20px" }}
            >
              {company?.companyName.toUpperCase()}
            </Typography>
          </Grid>
          <Grid
            sx={{ display: "flex", justifyContent: "center", height: "50px" }}
            item
            xs={12}
          >
            <Button
              variant="outlined"
              sx={{ backgroundColor: "common.white" }}
              onClick={() => {
                // TODO
              }}
            >
              <AddIcon /> Theo dõi
            </Button>
          </Grid>
        </Grid>
      </Link>
    </Paper>
  );
};

export default RecruiterCard;
