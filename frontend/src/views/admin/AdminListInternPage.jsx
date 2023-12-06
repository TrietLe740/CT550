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

export default function AdminListInternPage() {
  const userServ = new UsersService();
  const [internList, setInternList] = useState([]);

  let history = useHistory();

  useEffect(() => {
    async function getData() {
      let usersData = await userServ.getAllIntern();
      setInternList(usersData);
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
            <TableCell align="left">Họ và tên</TableCell>
            <TableCell align="left">Ngành học</TableCell>
            <TableCell align="left">Trường</TableCell>
            <TableCell align="left">Cấp độ</TableCell>
            <TableCell align="center">Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ color: "#000" }}>
          {internList?.map((value, index) => {
            return (
              <TableRow key={index} company={value}>
                <TableCell align="left">{value?._id}</TableCell>
                <TableCell align="left">{value?.name}</TableCell>
                <TableCell align="left">{value?.major}</TableCell>
                <TableCell align="left">{value?.school?.name}</TableCell>
                <TableCell align="left">{value?.level}</TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() =>
                      handleClick(`/admin/thuc-tap-sinh/${value?._id}`)
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
