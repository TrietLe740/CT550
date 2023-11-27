import React from "react";
import LOGO from "../assets/logo_Hitern_White.png";
import { Grid, Link, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Grid
      container
      sx={{
        minHeight: "500px",
        backgroundColor: "primary.dark",
        padding: "50px 20px",
      }}
    >
      <Grid
        item
        xs={12}
        md={4}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Link href="/">
          <img className="logo_footer" src={LOGO} alt="logo" />
        </Link>
      </Grid>
      <Grid
        item
        container
        xs={12}
        md={8}
        sx={{
          color: "common.white",
          padding: "0 10px",
        }}
      >
        <Grid item xs={4}>
          <Typography sx={{ mt: 3, mb: 2 }} variant="h6" component="div">
            Về HItern
          </Typography>
          <Typography sx={{ mt: 3, mb: 2 }} variant="p" component="div">
            Giới thiệu
          </Typography>
          <Typography sx={{ mt: 3, mb: 2 }} variant="p" component="div">
            Tuyển dụng
          </Typography>
          <Typography sx={{ mt: 3, mb: 2 }} variant="p" component="div">
            Liên hệ
          </Typography>
          <Typography sx={{ mt: 3, mb: 2 }} variant="p" component="div">
            Hỏi đáp
          </Typography>
          <Typography sx={{ mt: 3, mb: 2 }} variant="p" component="div">
            Chính sách bảo mật
          </Typography>
          <Typography sx={{ mt: 3, mb: 2 }} variant="p" component="div">
            Điều khoản dịch vụ
          </Typography>
          <Typography sx={{ mt: 3, mb: 2 }} variant="p" component="div">
            Quy chế hoạt động
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography sx={{ mt: 3, mb: 2 }} variant="h6" component="div">
            Hồ sơ của bạn
          </Typography>
          <Typography sx={{ mt: 3, mb: 2 }} variant="p" component="div">
            Quản lý thông tin của bạn
          </Typography>
          <Typography sx={{ mt: 3, mb: 2 }} variant="p" component="div">
            Hướng dẫn viết CV
          </Typography>
          <Typography sx={{ mt: 3, mb: 2 }} variant="p" component="div">
            Review CV
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography sx={{ mt: 3, mb: 2 }} variant="h6" component="div">
            Xây dựng sự nghiệp
          </Typography>
          <Typography sx={{ mt: 3, mb: 2 }} variant="p" component="div">
            Công việc thực tập tốt nhất
          </Typography>
          <Typography sx={{ mt: 3, mb: 2 }} variant="p" component="div">
            Công ty nổi bật nhất
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
