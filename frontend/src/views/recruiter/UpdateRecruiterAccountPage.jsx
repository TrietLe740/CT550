import { Button, Grid, Paper, Typography } from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";

import React, { useEffect, useState } from "react";
import AuthService from "../../services/auth.service";
import { Link, useHistory } from "react-router-dom";

export default function UpdateRecruiterAccountPage() {
  const [user, setUser] = useState();
  const authServ = new AuthService();

  let history = useHistory();

  const handleClick = (location) => {
    history.push(location);
  };

  useEffect(() => {
    async function getUser() {
      const auth = await authServ.get();
      setUser(auth);
      console.log(auth);
    }
    getUser();
  }, []);

  return (
    <Paper sx={{ minHeight: "93vh", padding: "50px" }}>
      <Typography variant="p" textAlign="center">
        Số xu khả dụng: {user?.credit} <PaidIcon sx={{ color: "#FFB000" }} />
      </Typography>
      <Button onClick={() => handleClick(`/tai-khoan/nap-tien`)}>
        Mua thêm xu
      </Button>
      <Typography variant="h4" textAlign="center">
        NÂNG CẤP TÀI KHOẢN
      </Typography>
      <Grid container sx={{ margin: "50px 0" }} justifyContent="center">
        {/* Gói 1 */}
        <Grid item container xs={12} md={4} sx={{ mt: "10px", mb: "10px" }}>
          <Grid
            item
            sx={{
              width: "80%",
              margin: "0 auto",
              textAlign: "center",
              border: "1px solid #48884A",
              borderRadius: "30px",
              padding: "20px",
            }}
          >
            <Typography variant="h5">Thường LV1</Typography>
            <Typography variant="p">Cần cho việc sử dụng hệ thống</Typography>
            <Typography variant="h4" sx={{ mt: 3, mb: 2 }}>
              MIỄN PHÍ
            </Typography>
            {user?.level == 0 ? (
              <Button variant="contained" sx={{ width: "90%", mb: "30px" }}>
                <Link
                  style={{ color: "#fff", textDecoration: "none" }}
                  to="/ho-so/chinh-sua"
                >
                  Hoàn thành ngay
                </Link>
              </Button>
            ) : (
              <Grid>
                <Button
                  disabled
                  variant="contained"
                  sx={{ width: "90%", mb: "30px" }}
                >
                  Đã nâng cấp
                </Button>
              </Grid>
            )}

            <hr />
            <Typography variant="p">Mở khóa việc sử dụng hệ thống</Typography>
            <br />
            <Typography variant="p">Cho phép tạo 5 việc làm mới</Typography>
          </Grid>
        </Grid>
        {/* Gói 2 */}
        <Grid item container xs={12} md={4} sx={{ mt: "10px", mb: "10px" }}>
          <Grid
            item
            sx={{
              width: "80%",
              margin: "0 auto",
              textAlign: "center",
              border: "1px solid #48884A",
              borderRadius: "30px",
              padding: "20px",
            }}
          >
            <Typography variant="h5">Pro LV2</Typography>
            <Typography variant="p">
              Mở khóa các chức năng mới của hệ thống v2.0
            </Typography>
            <Typography variant="h4" sx={{ mt: 3, mb: 2 }}>
              100 xu
            </Typography>
            {user?.level == 0 ? (
              <Button
                variant="contained"
                sx={{ width: "90%", mb: "30px" }}
                disabled
              >
                Nâng cấp
              </Button>
            ) : (
              <>
                {user?.level == 2 ? (
                  <Grid>
                    <Button
                      disabled
                      variant="contained"
                      sx={{ width: "90%", mb: "30px" }}
                    >
                      Đã nâng cấp
                    </Button>
                  </Grid>
                ) : (
                  <Button variant="contained" sx={{ width: "90%", mb: "30px" }}>
                    Nâng cấp
                  </Button>
                )}
              </>
            )}
            <hr />
            <Typography variant="p">
              Cho phép sử dụng tính tăng mới nhất trong tương lai (Vĩnh viễn)
            </Typography>
            <br />
            <Typography variant="p">Cho phép đăng 10 việc làm mới</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
