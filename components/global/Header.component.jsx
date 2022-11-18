import React from "react";
import Link from "next/link";
import styles from "../../styles/Header.module.css";
const Header = () => {
  return (
    <>
      <header className={styles.welcomeHead}>
        <div className={styles.welcomeHeadRow}>
          <Link href={"/"}>
            <img
              src="/images/whiteLogo.svg"
              alt="Ventura Logo"
              className={styles.logo}
            />
          </Link>
        </div>
      </header>
    </>
  );
};
export default Header;
