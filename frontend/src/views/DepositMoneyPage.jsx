import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import React, { useEffect, useState } from "react";
import AuthService from "../services/auth.service";
import PaymentService from "../services/payment.service";
import { useHistory } from "react-router-dom";

export default function DepositMoneyPage() {
  let history = useHistory();

  const authServ = new AuthService();
  const paymentServ = new PaymentService();
  const initValue = {
    name: "",
    cardNumber: "",
    cvv: "",
    month: "",
    year: "",
    credit: "",
  };

  const handleClick = (location) => {
    history.push(location);
  };

  const [inputErrorHandler, setInputErrorHandler] = useState({
    name: {
      vi_name: "Tên chủ thẻ",
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    cardNumber: {
      vi_name: "Số tài khoản",
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    cvv: {
      vi_name: "Mã bảo mật CVV",
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    month: {
      vi_name: "Tháng hết hạn thẻ",
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    year: {
      vi_name: "Năm hết hạn thẻ",
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    credit: {
      vi_name: "Số xu nạp",
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
  });

  const handleInputError = (key, status, message) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: {
        required: true,
        untouched: false,
        error: status,
        message: message,
      },
    });
  };

  useEffect(() => {
    console.log(inputErrorHandler);
  }, [inputErrorHandler]);

  const [profileDetails, setProfileDetails] = useState(initValue);

  const handleChangePayment = (key, value) => {
    setProfileDetails({
      ...profileDetails,
      paymentCard: {
        ...(profileDetails?.paymentCard || {}),
        [key]: value,
      },
    });
  };

  const handleInput = (key, value) => {
    setProfileDetails({
      ...profileDetails,
      [key]: value,
    });
  };

  const handlePayment = async () => {
    const tmpErrorHandler = {};
    console.log(profileDetails);
    Object.keys(inputErrorHandler).forEach((obj) => {
      if (
        inputErrorHandler[obj].required &&
        inputErrorHandler[obj].untouched &&
        !profileDetails[obj]
      ) {
        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${inputErrorHandler[obj].vi_name} là bắt buộc`,
        };
      } else {
        tmpErrorHandler[obj] = inputErrorHandler[obj];
      }
    });

    let updatedDetails = {
      ...profileDetails,
    };

    const verified = !Object.keys(tmpErrorHandler).some((obj) => {
      console.log(inputErrorHandler[obj].error);
      if (tmpErrorHandler[obj].error) return true;
      return false;
    });

    if (verified) {
      try {
        await paymentServ.payment(updatedDetails);
        setPopup({
          open: true,
          severity: "success",
          message: "Thanh toán thành công",
        });
        getUser();
      } catch (error) {
        setPopup({
          open: true,
          severity: "error",
          message: "Thông tin cung cấp chưa đầy đủ",
        });
      }
    } else {
      setInputErrorHandler(tmpErrorHandler);
      setPopup({
        open: true,
        severity: "error",
        message: "Xin vui lòng cung cấp thông tin đúng yêu cầu",
      });
    }
  };

  async function getUser() {
    const auth = await authServ.get();

    setProfileDetails({
      userId: auth._id,
    });
  }

  useEffect(() => {
    console.log(profileDetails);
    getUser();
  }, {});

  return (
    <Paper
      sx={{ minHeight: "93vh", padding: { xs: "50px 0", md: "50px 100px" } }}
    >
      <Grid container item direction="column" alignItems="center">
        <Grid item>
          <Typography variant="h2">Trang nạp xu</Typography>
        </Grid>
        <Grid
          sx={{ padding: { md: "50px 100px}", xs: "0" } }}
          item
          container
          direction="column"
        >
          <Grid container item>
            <Grid
              md={6}
              xs={12}
              item
              textAlign="left"
              sx={{ mt: 4, padding: "0 50px" }}
            >
              <Grid sx={{ padding: "10px" }}>
                <Typography variant="p" textAlign="center">
                  Bạn muốn nâng cấp tài khoản?
                </Typography>
                <br />
                <Button onClick={() => handleClick(`/tai-khoan/nang-cap`)}>
                  Nâng cấp ngay
                </Button>
              </Grid>
              <Grid
                sx={{
                  border: "1px solid #48884A",
                  padding: "10px",
                  borderRadius: "10px",
                  mt: 5,
                }}
              >
                <Typography>Bảng giá</Typography>
                <Typography>
                  1 lần thanh toán: 100 xu{" "}
                  <PaidIcon sx={{ color: "#FFB000" }} /> = 100.000VNĐ
                </Typography>
              </Grid>
            </Grid>
            <Grid item md={6} xs={12} sx={{ mt: 2 }}>
              <Card variant="outlined" sx={{ mt: 2 }}>
                <CardContent>
                  <Box component="form">
                    <TextField
                      label="Tên chủ thẻ"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={profileDetails?.paymentCard?.name}
                      onChange={(event) => {
                        const value = event.target.value;
                        console.log(value.toUpperCase());
                        handleChangePayment("name", value.toUpperCase());
                      }}
                      onBlur={(event) => {
                        if (!profileDetails?.paymentCard?.name) {
                          handleInputError(
                            "name",
                            true,
                            "Tên chủ thẻ là bắt buộc"
                          );
                        } else {
                          handleInputError("name", false, "");
                        }
                      }}
                      error={inputErrorHandler.name.error}
                      inputErrorHandler={inputErrorHandler}
                      handleInputError={handleInputError}
                      required={true}
                      helperText={inputErrorHandler.name.message}
                    />

                    <TextField
                      label="Số tài khoản"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      type="number"
                      inputProps={{ maxLength: 16 }}
                      value={profileDetails?.paymentCard?.cardNumber}
                      onChange={(event) =>
                        handleChangePayment("cardNumber", event.target.value)
                      }
                      onBlur={(event) => {
                        if (!profileDetails?.paymentCard?.cardNumber) {
                          handleInputError(
                            "cardNumber",
                            true,
                            "Số tài khoản là bắt buộc"
                          );
                        } else {
                          handleInputError("cardNumber", false, "");
                        }
                      }}
                      error={inputErrorHandler.cardNumber.error}
                      inputErrorHandler={inputErrorHandler}
                      handleInputError={handleInputError}
                      required={true}
                      helperText={inputErrorHandler.cardNumber.message}
                    />

                    <TextField
                      label="CVV"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      type="number"
                      inputProps={{ maxLength: 3, min: 0 }}
                      onChange={(event) =>
                        handleChangePayment("cvv", event.target.value)
                      }
                      onBlur={(event) => {
                        if (!profileDetails?.paymentCard?.cvv) {
                          handleInputError("cvv", true, "Mã bảo mật CVV");
                        } else {
                          handleInputError("cvv", false, "");
                        }
                      }}
                      error={inputErrorHandler.cvv.error}
                      inputErrorHandler={inputErrorHandler}
                      handleInputError={handleInputError}
                      required={true}
                      helperText={inputErrorHandler.cvv.message}
                    />

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          label="Tháng"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          type="number"
                          inputProps={{ min: 1, max: 12 }}
                          onChange={(event) =>
                            handleChangePayment("month", event.target.value)
                          }
                          onBlur={(event) => {
                            if (!profileDetails?.paymentCard?.month) {
                              handleInputError(
                                "month",
                                true,
                                "Tháng hết hạn của thẻ là bắt buộc"
                              );
                            } else {
                              handleInputError("month", false, "");
                            }
                          }}
                          error={inputErrorHandler.month.error}
                          inputErrorHandler={inputErrorHandler}
                          handleInputError={handleInputError}
                          required={true}
                          helperText={inputErrorHandler.month.message}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Năm"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          type="number"
                          inputProps={{ min: 2016 }}
                          onChange={(event) =>
                            handleChangePayment("year", event.target.value)
                          }
                          onBlur={(event) => {
                            if (!event.target.value) {
                              handleInputError(
                                "year",
                                true,
                                "Năm hết hạn của thẻ là bắt buộc"
                              );
                            } else {
                              handleInputError("year", false, "");
                            }
                          }}
                          error={inputErrorHandler.year.error}
                          inputErrorHandler={inputErrorHandler}
                          handleInputError={handleInputError}
                          required={true}
                          helperText={inputErrorHandler.year.message}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Số xu"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          type="number"
                          inputProps={{ min: 100, max: 10000 }}
                          onChange={(event) =>
                            handleChangePayment("credit", event.target.value)
                          }
                          onBlur={(event) => {
                            if (!profileDetails?.paymentCard?.credit) {
                              handleInputError(
                                "credit",
                                true,
                                "Số xu muốn nạp là bắt buộc"
                              );
                            } else {
                              handleInputError("credit", false, "");
                            }
                          }}
                          error={inputErrorHandler.credit.error}
                          inputErrorHandler={inputErrorHandler}
                          handleInputError={handleInputError}
                          required={true}
                          helperText={inputErrorHandler.credit.message}
                        />
                      </Grid>
                    </Grid>

                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => handlePayment()}
                    >
                      Thanh toán
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
