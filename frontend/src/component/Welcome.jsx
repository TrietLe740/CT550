import { Grid, Typography, Button } from "@material-ui/core";
import LOGO from "../assets/logo_Hitern.png";

const Welcome = (props) => {
  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      justify="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item xs={12}>
        <img src={LOGO} width={300} />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h2">Chào mừng đến với HIntern!</Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="h5" align="center">
          <br />
          HIntern là website tuyển dụng thực tập sinh. Hãy sẳn sàng bước vào
          hành trình tích lũy kinh nghiệm thực tế tại các doanh nghiệp
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <br />
        <Button color="black" href="/dang-nhap">
          Tham gia ngay!
        </Button>
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
      justify="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item>
        <Typography variant="h2">Error 404</Typography>
      </Grid>
    </Grid>
  );
};

export default Welcome;
