import axios from "axios";
import { Button, Grid, Paper, Box, Link } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const RecruiterCard = (props) => {
  const { company } = props;

  return (
    <Paper
      sx={{
        margin: "10px",
        padding: "20px",
        minWidth: "300px",
        minHeight: "300px",
        textDecoration: "none",
        borderRadius: "30px",
      }}
    >
      <Link
        href={`/cong-ty/${company._id}`}
        sx={{ textDecoration: "none" }}
        target="_blank"
      >
        <Grid container columns>
          {/* Ảnh đại diện công ty */}
          <Grid item xs={12}>
            <Box
              component="img"
              sx={{
                width: "100%",
                padding: "10px",
              }}
              alt="avt_company"
              src="https://png.pngtree.com/template/20190317/ourlarge/pngtree-businessmanavataremployeesales-man-purple-business-logo-image_78692.jpg"
            />
          </Grid>
          <Grid sx={{ display: "flex", justifyContent: "center" }} item xs={12}>
            <Button
              variant="outlined"
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
