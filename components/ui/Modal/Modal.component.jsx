import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import styles from "./Modal.module.css";

const Backdrop = (props) => {
  const { hideBackdrop } = props;
  return <div className={styles.backdrop} onClick={hideBackdrop} />;
};

const ModalOverlay = (props) => {
  const { hideBackdrop } = props;

  return (
    <div className={[styles.modal, styles[props.ModalType]].join(" ")}>
      <div className={styles.close} onClick={hideBackdrop}>
        <span className="icon-Close" aria-label="Close Modal"></span>
      </div>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
};

const Modal = (props) => {
  const { onClick, ModalType } = props;
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
          <ModalOverlay hideBackdrop={onClick} ModalType={ModalType}>
            {props.children}
          </ModalOverlay>,
          document.querySelector("#modal_overlays")
        )}
    </>
  );
};

export default Modal;
