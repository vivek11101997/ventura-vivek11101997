import { useRouter } from "next/router";
import React, { useEffect } from "react";

const LandingCo = () => {
  const cob_base_url_prod1 = useFlags(["cob_base_url_prod"]);
  const cob_base_url_prod = cob_base_url_prod1["cob_base_url_prod"].value;
  const cob_base_url_stage1 = useFlags(["cob_base_url_stage"]);
  const cob_base_url_stage = cob_base_url_stage1["cob_base_url_stage"].value;
  const cob_base_url_qa1 = useFlags(["cob_base_url_qa"]);
  const cob_base_url_qa = cob_base_url_qa1["cob_base_url_qa"].value;
  const object={
    cob_base_url_prod,
    cob_base_url_qa,
    cob_base_url_stage
  }
SetItemToLocalStorage("url",object)
const router=useRouter();
router.push("/co/mobile-register")

  
  return <></>;
};

export default LandingCo;
