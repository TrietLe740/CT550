import React, { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import apiList from "../lib/apiList";
import {
  Box,
  Button,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  Modal,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Link,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useTheme } from "@mui/material/styles";
import { userType } from "../lib/isAuth";
import SwipeableViews from "react-swipeable-views";
import PropTypes from "prop-types";
import JobCard from "../component/JobCard";
import { SetPopupContext } from "../App";
import axios from "axios";
import FileUploadInput from "../component/FileUploadInput";

import NewsService from "../services/news.service";

export default function NewsDetailPage() {
  let history = useHistory();
  const newsServ = new NewsService();
  const [news, setNews] = useState();
  let location = useLocation();
  let path = location.pathname.split("/");
  let id = path[path.length - 1];

  useEffect(() => {
    async function getNews() {
      let dt = await newsServ.get(id);
      setNews(dt);
    }
    getNews();
  }, []);

  const handleClick = (location) => {
    history.push(location);
  };

  return (
    <Paper sx={{ padding: { md: "100px 200px", xs: "0" }, minHeight: "100vh" }}>
      <Grid container direction="column" textAlign="center">
        <Box
          component="img"
          sx={{
            margin: "0 auto",
            maxHeight: { xs: 150, sm: 250, md: 450, lg: 700 },
            maxWidth: { xs: 150, sm: 250, md: 450, lg: 700 },
          }}
          alt="banner"
          src={news?.img}
        />
        <Typography variant="h3">{news?.title}</Typography>
        <br />
        <Typography variant="p" textAlign="left">
          {news?.content}
        </Typography>
      </Grid>
    </Paper>
  );
}
