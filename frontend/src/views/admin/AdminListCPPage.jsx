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

export default function AdminListCPPage() {
  const userServ = new UsersService();
  const [companyList, setCompanyList] = useState([]);

  useEffect(() => {
    async function getData() {
      let usersData = await userServ.getAllRecruiter();
      setCompanyList(usersData);
    }
    getData();
  }, []);

  return (
    <TableContainer component={Paper} sx={{ padding: "50px 100px" }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell align="left">ID</TableCell>
            <TableCell align="left">Công ty</TableCell>
            <TableCell align="left">Địa chỉ</TableCell>
            <TableCell align="left">Liên hệ</TableCell>
            <TableCell align="center">Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ color: "#000" }}>
          {companyList?.map((value, index) => {
            return (
              <TableRow key={index} company={value}>
                <TableCell align="left">{value?._id}</TableCell>
                <TableCell align="left">{value?.companyName}</TableCell>
                <TableCell align="left">{value?.location?.district}</TableCell>
                <TableCell align="left">{value?.contactNumber}</TableCell>
                <TableCell align="center">
                  <Link href={`/admin/cong-ty/${value?._id}`} target="_blank">
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                  </Link>
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
