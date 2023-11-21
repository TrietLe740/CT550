import React from "react";
import { useState } from "react";
import { Button, Grid, IconButton, Input } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const SearchBar = (prop) => {
  const history = useHistory();
  const [searchInput, setSearchInput] = useState("");
  return (
    <>
      {/* Thanh tim kiem */}
      <Grid
        item
        container
        xs={12}
        fullWidth
        sx={{
          width: "100%",
          border: "2px solid #36593C",
          borderRadius: "20px",
          padding: "10px 20px",
          backgroundColor: "common.white",
        }}
      >
        <Grid item xs={1}>
          <IconButton
            onClick={() =>
              history.push({
                pathname: "/tim-kiem",
                search: `?search=${searchInput}`,
              })
            }
          >
            <SearchIcon
              sx={{
                color: "common.black",
              }}
            />
          </IconButton>
        </Grid>
        <Grid item xs={9} xl={10}>
          <Input
            disableUnderline
            sx={{ width: "100%" }}
            placeholder="Tìm kiếm công việc, công ty,..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyPress={(ev) => {
              if (ev.key === "Enter") {
                history.push({
                  pathname: "/tim-kiem",
                  search: `?search=${searchInput}`,
                });
              }
            }}
          />
        </Grid>
        <Grid item xs={2} xl={1}>
          <Button
            variant="contained"
            onClick={() =>
              history.push({
                pathname: "/tim-kiem",
                search: `?search=${searchInput}`,
              })
            }
          >
            Tìm kiếm
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default SearchBar;
