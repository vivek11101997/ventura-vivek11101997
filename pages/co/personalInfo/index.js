import React, { useEffect } from "react";
import PersonalInfoMain from "./../../../components/clientOnboarding/PersonalInfo/Index";
import { useRouter } from "next/router";
import MaritalStatusComponent from "../../../components/clientOnboarding/PersonalInfo/MaritalStatus.component";
const PersonalInfoPage = () => {
  const router = useRouter();

  useEffect(() => {
    void router.push(MaritalStatusComponent);
  }, []);

  return <>{}</>;
};

export default PersonalInfoPage;
