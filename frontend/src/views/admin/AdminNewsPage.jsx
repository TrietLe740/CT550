import React, { useEffect, useState } from "react";
import NewsService from "../../services/news.service";
import {
  Button,
  Grid,
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
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useHistory } from "react-router-dom";

export default function AdminNewsPage() {
  const newsServ = new NewsService();
  const [newsList, setNewsList] = useState([]);

  let history = useHistory();

  useEffect(() => {
    async function getData() {
      let newsData = await newsServ.getAll();
      setNewsList(newsData);
    }
    getData();
  }, []);

  const handleClick = (location) => {
    history.push(location);
  };

  return (
    <TableContainer component={Paper} sx={{ padding: "50px 100px" }}>
      <Grid sx={{ display: "flex", justifyContent: "right" }}>
        <Button
          variant="outlined"
          sx={{
            marginLeft: "auto",
            justifyContent: "right",
          }}
          onClick={() => handleClick("/admin/tin-tuc/tao-moi")}
        >
          <AddIcon /> Tạo tin mới
        </Button>
      </Grid>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell align="left">ID</TableCell>
            <TableCell align="left">Bài viết</TableCell>
            <TableCell align="left">Ngày đăng</TableCell>
            <TableCell align="center">Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ color: "#000" }}>
          {newsList?.map((value, index) => {
            return (
              <TableRow key={index} company={value}>
                <TableCell align="left">{value?._id}</TableCell>
                <TableCell align="left">{value?.title}</TableCell>
                <TableCell align="left">{value?.dateOfPosting}</TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => handleClick(`/admin/tin-tuc/${value?._id}`)}
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
