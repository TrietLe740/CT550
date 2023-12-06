import React from "react";
import UsersService from "../../services/user.service";
import { useState, useEffect } from "react";
import {
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useHistory } from "react-router-dom";
import JobsService from "../../services/jobs.service";

export default function AdminListJobPage() {
  const userServ = new UsersService();
  const jobServ = new JobsService();
  const [jobList, setJobList] = useState([]);

  let history = useHistory();

  useEffect(() => {
    async function getData() {
      let jobData = await jobServ.getAll();
      // let usersData = [];
      // for(let i=0; i<jobData.length; i++) {
      //   usersData[i] = await userServ.getRecruiter(jobData[i].userId);
      // }
      setJobList(jobData);
    }
    getData();
  }, []);

  const handleClick = (location) => {
    history.push(location);
  };

  return (
    <TableContainer component={Paper} sx={{ padding: "50px 100px" }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell align="left">ID</TableCell>
            <TableCell align="left">Công việc</TableCell>
            <TableCell align="left">Địa chỉ</TableCell>
            <TableCell align="left">Số vị trí tối đa</TableCell>
            <TableCell align="left">Số SV được duyệt</TableCell>
            <TableCell align="center">Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ color: "#000" }}>
          {jobList?.map((value, index) => {
            return (
              <TableRow key={index} company={value}>
                <TableCell align="left">{value?._id}</TableCell>
                <TableCell align="left">{value?.title}</TableCell>
                <TableCell align="left">{value?.location?.province}</TableCell>
                <TableCell align="left">{value?.maxPositions}</TableCell>
                <TableCell align="left">{value?.acceptedCandidates}</TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() =>
                      handleClick(`/admin/cong-viec/${value?._id}`)
                    }
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton>
                    <DeleteForeverIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
