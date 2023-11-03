import { Button, Grid, TextField } from "@mui/material";

const MultifieldInput = (props) => {
  const { value, setValue } = props;

  return (
    <>
      {value.map((obj, key) => (
        <Grid item container key={key}>
          <Grid item xs={6}>
            <TextField
              label={`Thông tin #${key + 1}`}
              value={value[key].institutionName}
              onChange={(event) => {
                const newInfor = [...value];
                newInfor[key].institutionName = event.target.value;
                setValue(newInfor);
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Start Year"
              value={obj.startYear}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newInfor = [...value];
                newInfor[key].startYear = event.target.value;
                setValue(newInfor);
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="End Year"
              value={obj.endYear}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newInfor = [...value];
                newInfor[key].endYear = event.target.value;
                setValue(newInfor);
              }}
            />
          </Grid>
        </Grid>
      ))}
      <Grid item style={{ alignSelf: "center" }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() =>
            setValue([
              ...value,
              {
                institutionName: "",
                startYear: "",
                endYear: "",
              },
            ])
          }
        >
          Add another institution details
        </Button>
      </Grid>
    </>
  );
};

export default MultifieldInput;
