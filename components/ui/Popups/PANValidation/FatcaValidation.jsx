import Link from "next/link";
import React from "react";
import { enterPan } from "../../../../global/path/redirectPath";
import ButtonUI from "../../Button.component";

import Styles from "./PANValidation.module.css";

const FatcaValidation = () => {
  return (
    <div className={Styles.alertContainer}>
      <h1 className={Styles.alertTitle}>Fatca Declaration</h1>
      <div className={Styles.fatcaPara}>
        <p className={Styles.alertSubTitle}>
          I/We acknowledge and confirm that the information provided above is
          true and correct to the best of my/our knowledge and belief. In case
          any of the above specified information is found to be false or untrue
          or misleading or misrepresenting, I/We am/are aware that I/We may
          liable for it. I/We hereby authorize you [CAMS/Fund/AMC/Other
          participating entities] to disclose, share, rely, remit in any form,
          mode or manner, all / any of the information provided by me, including
          all changes, updates to such information as and when provided by me to
          / any of the Mutual Fund, its Sponsor, Asset Management Company,
          trustees, their employees / RTAs (&lsquo;the Authorized
          Parties&lsquo;) or any Indian or foreign governmental or statutory or
          judicial authorities / agencies including but not limited to the
          Financial Intelligence Unit-India (FIU-IND), the tax / revenue
          authorities in India or outside India wherever it is legally required
          and other investigation agencies without any obligation of advising
          me/us of the same. Further, I/We authorize to share the given
          information to other SEBI Registered Intermediaries /or any regulated
          intermediaries registered with SEBI / RBI / IRDA / PFRDA to facilitate
          single submission / update & for other relevant purposes. I/We also
          undertake to keep you informed in writing about any changes /
          modification to the above information in future and also undertake to
          provide any other additional information as may be required at your /
          Fund&lsquo;s end or by domestic or overseas regulators/ tax
          authorities. I/We authorize Fund/AMC/RTA to provide relevant
          information to upstream payors to enable withholding to occur and pay
          out any sums from my account or close or suspend my account(s) without
          any obligation of advising me of the same. The Central Board of Direct
          Taxes has notified Rules 114F to 114H, as part of the Income-tax
          Rules, 1962, which Rules require Indian financial institutions such as
          the Financial institution / Banks to seek additional personal, tax and
          beneficial owner information and certain certifications and
          documentation from all our account holders. In relevant cases,
          information will have to be reported to tax authorities/ appointed
          agencies. Towards compliance, we may also be required to provide
          information to any institutions such as withholding agents for the
          purpose of ensuring appropriate withholding from the account or any
          proceeds in relation thereto. Should there be any change in any
          information provided by you, please ensure you advise us promptly,
          i.e., within 30 days. Please note that you may receive more than one
          request for information if you have multiple relationships with RKSV
          Securities India pvt Ltd or its group entities. Therefore, it is
          important that you respond to our request, even if you believe you
          have already supplied any previously requested information.
        </p>
      </div>

      <div className={Styles.fatcaBtnContainer}>
        <ButtonUI>
          <Link href={enterPan}>
            <a>Done</a>
          </Link>
        </ButtonUI>
      </div>
    </div>
  );
};

export default FatcaValidation;
