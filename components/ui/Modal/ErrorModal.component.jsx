import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import styles from "./Modal.module.css";
import { useRouter } from "next/router";
const Backdrop = (props) => {
  const { hideBackdrop } = props;
  return <div className={styles.backdrop} />;
};

const ModalOverlay = (props) => {
  const router = useRouter();
  const { hideBackdrop, redirectTo } = props;
  return (
    <div className={[styles.modal, styles[props.ModalType]].join(" ")}>
      <div className={styles.close} onClick={hideBackdrop}>
        <span
          className="icon-Close"
          aria-label="Close Modal"
          onClick={() => router.push(redirectTo)}
        ></span>
      </div>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
};

const ErrorModal = (props) => {

  const { onClick, ModalType, redirectTo } = props;
  const [pageMounted, setPageMounted] = useState(false);

  useEffect(() => {
    setPageMounted(true);
    return () => setPageMounted(false);
  }, []);

  return (
    <>
      {pageMounted &&
        createPortal(
          <Backdrop hideBackdrop={onClick} />,
          document.querySelector("#modal_overlays")
        )}
      {pageMounted &&
        createPortal(
          <ModalOverlay
            hideBackdrop={onClick}
            ModalType={ModalType}
            redirectTo={redirectTo || ""}
          >
            <div className="center">
              <h3 className="title">{props.errorMsg}</h3>
            </div>
          </ModalOverlay>,
          document.querySelector("#modal_overlays")
        )}
    </>
  );
};

export default ErrorModal;
