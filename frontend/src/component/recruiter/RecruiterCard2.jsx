import axios from "axios";
import { Button, Grid, Paper, Box, Link, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const RecruiterCard2 = (props) => {
  const { company } = props;

  return (
    <Link
      href={`/cong-ty/${company.userId}`}
      sx={{ textDecoration: "none" }}
      target="_blank"
    >
      <Paper
        sx={{
          margin: "10px",
          padding: "30px",
          width: "400px",
          height: "400px",
          textDecoration: "none",
          borderRadius: "30px",
        }}
      >
        <Grid container columns>
          {/* Ảnh đại diện công ty */}
          <Grid item xs={12}>
            <Box
              component="img"
              sx={{
                maxWidth: "100px",
                boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
              }}
              alt="avt_company"
              src="https://png.pngtree.com/template/20190317/ourlarge/pngtree-businessmanavataremployeesales-man-purple-business-logo-image_78692.jpg"
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <Typography variant="h6">{company?.companyName}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="p">{company?.bio}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Link>
  );
};

export default RecruiterCard2;
