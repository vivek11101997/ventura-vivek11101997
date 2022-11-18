import { useEffect } from "react";

const Script = () => {
  useEffect(() => {
    document.querySelectorAll(".animate__animated").forEach((item, index) => {
  item.className += " animate__fadeInUp animate__delay_" + index;
});
  }, []);
};

export default Script;
