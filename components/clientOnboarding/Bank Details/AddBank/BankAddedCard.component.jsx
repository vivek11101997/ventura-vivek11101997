import React from "react";
import styles from "./AddBank.module.css";

const BankAddedCard = (props) => {
  const { account_holder_name, account_number, ifsc, branch, bank_name } =
    props;
  return (
    <div className={`animate__animated ${styles.card}`}>
      <div className={styles.accountInfo}>
        <div className={styles.accountHolder}>
          <p className={styles.acHolderName}>{account_holder_name}</p>
          <p className={styles.bankName}>{bank_name}</p>
        </div>
      </div>

      <ul className={styles.acTable}>
        <li>
          <p className={styles.tableTitle}>Acc. No.</p>
          <p className={styles.tableValue}>{account_number}</p>
        </li>
        <li>
          <p className={styles.tableTitle}>IFSC code</p>
          <p className={styles.tableValue}>{ifsc}</p>
        </li>
        <li>
          <p className={styles.tableTitle}>Branch</p>
          <p className={styles.tableValue}>{branch}</p>
        </li>
      </ul>
    </div>
  );
};

export default BankAddedCard;
