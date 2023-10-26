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
        fullWidth
        sx={{
          width: "100%",
          margin: "20px auto 0 auto",
          border: "2px solid #36593C",
          borderRadius: "20px",
          padding: "10px 20px",
          backgroundColor: "common.white",
        }}
      >
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
        <Input
          sx={{ width: "80%", height: "50px" }}
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
        <Button
          sx={{ marginLeft: "30px" }}
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
    </>
  );
};

export default SearchBar;
