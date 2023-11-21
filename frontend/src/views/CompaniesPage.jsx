import React, { useEffect, useState } from "react";
import UsersService from "../services/user.service";
import { Grid } from "@mui/material";
import RecruiterCard from "../component/recruiter/RecruiterCard";

export default function CompaniesPage() {
  const userServ = new UsersService();

  const [companyList, setCompanyList] = useState([]);

  useEffect(() => {
    async function getCompanies() {
      var companyData = await userServ.getAll();
      const companies = [];
      for (let i = 0; i < companyData.length; i++) {
        if (companyData[i].type === "recruiter" && companyData[i].level > 0) {
          companies[i] = companyData[i];
        }
      }
      setCompanyList(companies);
      console.log(companies);
    }
    getCompanies();
  }, []);
  return (
    <Grid container item>
      <Grid item container justifyContent="center" xs={12}>
        {companyList?.length > 0
          ? companyList?.map((company) => {
              return (
                <Grid item xs={3}>
                  <RecruiterCard company={company} />
                </Grid>
              );
            })
          : null}
      </Grid>
    </Grid>
  );
}
