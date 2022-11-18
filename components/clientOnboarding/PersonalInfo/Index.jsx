import React from "react";

import TradingExperience from "./TradingExperience.component";
import Header from "../../global/Header.component";

const PersonalInfoMain = () => {
  return (
    <>
      <Header />
      <section className="ContainerBG">
        <div className="containerMini">
          <TradingExperience />
        </div>
      </section>
    </>
  );
};

export default PersonalInfoMain;
