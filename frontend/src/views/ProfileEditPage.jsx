import {
  Avatar,
  Button,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import UsersService from "../services/user.service";
import AuthService from "../services/auth.service";
import { Link } from "react-router-dom";
import DescriptionIcon from "@mui/icons-material/Description";
import FileUploadInput from "../component/FileUploadInput";
import MajorsService from "../services/major.service";
import UploadService from "../services/upload.sevice";
// import MultifieldInput from "../component/MultifieldInput";

// const MultifieldInput = (props) => {
//   const { education, setEducation } = props;

//   return (
//     <>
//       {/* {education.map((obj, key) => (
//         <Grid item container key={key}>
//           <Grid item xs={6}>
//             <TextField
//               sx={{ width: "100%" }}
//               label={`Trường`}
//               value={education[key].institutionName}
//               onChange={(event) => {
//                 const newEdu = [...education];
//                 newEdu[key].institutionName = event.target.value;
//                 setEducation(newEdu);
//               }}
//               variant="outlined"
//             />
//           </Grid>
//           <Grid item xs={3}>
//             <TextField
//               label="Năm bắt đầu"
//               value={obj.startYear}
//               variant="outlined"
//               type="number"
//               onChange={(event) => {
//                 const newEdu = [...education];
//                 newEdu[key].startYear = event.target.value;
//                 setEducation(newEdu);
//               }}
//             />
//           </Grid>
//           <Grid item xs={3}>
//             <TextField
//               label="Năm kết thúc"
//               value={obj.endYear}
//               variant="outlined"
//               type="number"
//               onChange={(event) => {
//                 const newEdu = [...education];
//                 newEdu[key].endYear = event.target.value;
//                 setEducation(newEdu);
//               }}
//             />
//           </Grid>
//         </Grid>
//       ))} */}
//       {/* <Grid item>
//         <Button
//           variant="contained"
//           color="secondary"
//           onClick={() =>
//             setEducation([
//               ...education,
//               {
//                 institutionName: "",
//                 startYear: "",
//                 endYear: "",
//               },
//             ])
//           }
//         >
//           Thêm
//         </Button>
//       </Grid> */}
//     </>
//   );
// };

// const MultifieldLink = (props) => {
//   const { slink, setSLink } = props;

//   return (
//     <>
//       {slink.map((obj, key) => (
//         <Grid item container key={key}>
//           <Grid item xs={6}>
//             <TextField
//               sx={{ width: "100%" }}
//               label={`Link #${key + 1}`}
//               value={slink[key].link}
//               onChange={(event) => {
//                 const newLink = [...slink];
//                 newLink[key].link = event.target.value;
//                 setSLink(newLink);
//               }}
//               variant="outlined"
//             />
//           </Grid>
//         </Grid>
//       ))}
//       <Grid item>
//         <Button
//           variant="contained"
//           color="secondary"
//           onClick={() =>
//             setSLink([
//               ...slink,
//               {
//                 link: "",
//               },
//             ])
//           }
//         >
//           Thêm
//         </Button>
//       </Grid>
//     </>
//   );
// };

export default function ProfileEditPage() {
  const userServ = new UsersService();
  const authServ = new AuthService();
  const majorServ = new MajorsService();
  const uploadServ = new UploadService();

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  const [profileDetails, setProfileDetails] = useState({
    name: "",
    education: [],
    skills: [],
    activity: [],
    award: [],
    certificate: [],
    contactNumber: "",
    email: "",
    exp: "",
    interest: "",
    target: "",
    major: "",
  });

  const [majors, setMajors] = useState({});

  useEffect(() => {
    async function getUser() {
      const auth = await authServ.get();
      const majors = await majorServ.getAll();
      setProfileDetails(auth);
      setMajors(
        majors?.[0].majors.map((item) => {
          return { label: item, value: item };
        }) || []
      );
      console.log(majors);
      console.log(auth);
    }
    getUser();
  }, []);

  const handleInput = (key, value) => {
    setProfileDetails({
      ...profileDetails,
      [key]: value,
    });
  };

  const handleUpdate = async () => {
    let updatedDetails = {
      ...profileDetails,
    };
    console.log(updatedDetails);
    try {
      await userServ.update(updatedDetails);
      alert("Cập nhật thành công!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Paper sx={{ padding: "100px" }}>
      <Grid
        container
        sx={{
          boxShadow:
            "0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)",
          margin: "0 auto",
          borderRadius: "30px",
          padding: "30px",
        }}
      >
        <Grid item container direction="column" xs={8} sx={{ padding: "20px" }}>
          <Grid item>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              CÀI ĐẶT THÔNG TIN CÁ NHÂN
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              sx={{ width: "100%", margin: "15px 0" }}
              label="Họ và tên"
              variant="outlined"
              value={profileDetails?.name}
              onChange={(event) => {
                handleInput("name", event.target.value);
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              sx={{ width: "100%", margin: "15px 0" }}
              label="Số điện thoại"
              variant="outlined"
              value={profileDetails?.contactNumber}
              onChange={(event) => {
                handleInput("contactNumber", event.target.value);
              }}
            />
          </Grid>
          <Grid item>
            <Typography variant="p">Ngành</Typography>
            <Select
              options={majors}
              value={{
                value: profileDetails.major,
                label: profileDetails.major,
              }}
              onChange={(v) => {
                handleInput("major", v.value);
                console.log(v);
              }}
            />
          </Grid>
          <Grid item></Grid>
          <Grid item>
            <TextField
              sx={{ width: "100%", margin: "15px 0" }}
              label="Email"
              variant="outlined"
              value={profileDetails?.email}
              disabled
            />
          </Grid>
          <Grid item></Grid>
          <Grid item>
            <Button
              variant="contained"
              sx={{ padding: "10px 50px", marginTop: "30px" }}
              onClick={() => handleUpdate()}
            >
              Lưu
            </Button>
          </Grid>
        </Grid>
        <Grid item container direction="column" xs={4} sx={{ padding: "20px" }}>
          <Grid item container>
            <Grid item xs={4}>
              <Avatar
                sx={{
                  width: "100px",
                  height: "100px",
                  border: "3px solid",
                }}
                src={profileDetails?.avatar}
              />
            </Grid>
            <Grid item xs={8}>
              <Typography variant="p">Chào mừng trở lại,</Typography>
              <br />
              <Typography variant="p" sx={{ fontWeight: "bold" }}>
                {profileDetails?.name}
              </Typography>
              <br />
              <Typography variant="p" sx={{ fontWeight: "bold" }}>
                {profileDetails?.level < 3
                  ? `Tài khoản cấp ${profileDetails?.level}`
                  : `Tài khoản cấp tối đa`}
              </Typography>
              <Link to={`/tai-khoan/nang-cap`}>
                <Button variant="contained" sx={{ marginTop: "10px" }}>
                  Nâng cấp tài khoản
                </Button>
              </Link>
            </Grid>
          </Grid>
          <Grid item container sx={{ marginTop: "30px" }}>
            <Grid item xs={12}>
              <Typography variant="h6">DS CV của bạn</Typography>

              <Link to={`/update-cv`}>
                <Button variant="contained" sx={{ marginTop: "10px" }}>
                  Upload CV
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
