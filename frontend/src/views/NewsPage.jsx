import { Grid, Typography, Pagination, Paper } from "@mui/material";

import NewsCard from "../component/NewsCard";
import FilterPopup from "../component/FilterPopup";
import NewsService from "../services/news.service";
import { useEffect, useState } from "react";

export default function NewsPage() {
  const newsServ = new NewsService();
  const [newsList, setNewsList] = useState([]);
  useEffect(() => {
    async function getNews() {
      var newsData = await newsServ.getAll();
      setNewsList(newsData);
    }
    getNews();
  }, []);

  return (
    <Paper>
      <Grid
        container
        direction="column"
        alignItems="center"
        sx={{ minHeight: "93vh" }}
      >
        <Grid
          item
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{
            backgroundColor: "primary.main",
            padding: { md: "100px", xs: "30px" },
          }}
        >
          <Grid item sx={{ padding: "50px" }}>
            <Typography
              align="center"
              sx={{
                fontWeight: "900",
                color: "common.white",
              }}
              variant="h2"
            >
              NHỮNG BÀI VIẾT DÀNH CHO BẠN
            </Typography>
          </Grid>
        </Grid>

        <Grid
          container
          item
          direction="column"
          sx={{ mt: 3, padding: "30px 50px" }}
        >
          <Grid container item>
            {/* DS bản tin */}
            <Grid
              item
              container
              xs={12}
              sx={{ padding: { md: "0 20px 0 0", xs: "0" } }}
            >
              {newsList.length > 0 ? (
                newsList.map((news) => {
                  return (
                    <Grid container item>
                      <NewsCard news={news} />
                    </Grid>
                  );
                })
              ) : (
                <Typography sx={{ mb: 3 }}>
                  Không tìm thấy bản tin phù hợp
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item sx={{ mb: 5 }}>
          <Pagination
            count={newsList.length / 10 > 1 ? newsList.length / 10 : 1}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
