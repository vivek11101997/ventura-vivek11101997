import React from "react";
import { useRouter } from 'next/router'
import BankAddedCard from "../Bank Details/AddBank/BankAddedCard.component";
import styles from "./Preview.module.css";
import { addBankAccount } from "../../../global/path/redirectPath";
const BankDetails = (props) => {
  const { PreviewData } = props;
  const router = useRouter()
  const HandelEdit = () => {
    router.push(`${addBankAccount}?redirect=P`)
  }
  return (
    <>
      <section className={styles.previewWrap}>
        <h2 className={`animate__animated ${styles.title}`}>Bank Details</h2>
        <button
          aria-label="Edit"
          onClick={HandelEdit}
          className={`${styles.btn}`}
        >
          Edit
          <span className={`icon-Arrow ${styles.editArrow}`}></span>
        </button>
        {PreviewData && (
          <BankAddedCard
            account_holder_name={PreviewData.personal_details.name.name}
            account_number={PreviewData.bank_details.account_no.account_no}
            ifsc={PreviewData.bank_details.ifsc_code.ifsc_code}
            branch={PreviewData.bank_details.branch_name.branch_name}
            bank_name={PreviewData.bank_details.bank_name.bank_name}
          />
        )}
      </section>
    </>
  );
};

export default BankDetails;
