import React from "react";

import { useEffect, useRef } from "react";

const HoverShinyEffect = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    function mouseMoveEvent(e) {
      const { x, y } = containerRef.current.getBoundingClientRect();

      containerRef.current.style.setProperty("--py", e.clientY - y);
      containerRef.current.style.setProperty("--px", e.clientX - x);
    }
    containerRef.current.addEventListener("mousemove", mouseMoveEvent);

    function focusEvent(e) {
      const { x, y } = containerRef.current.getBoundingClientRect();

      let xax = e.clientX - x;
      let yax = e.clientY - y;

      let ripples = document.createElement("span");
      ripples.style.left = xax + "px";
      ripples.style.top = yax + "px";
      this.appendChild(ripples);

      setTimeout(() => {
        ripples.remove();
      }, 500);
    }

    containerRef.current.addEventListener("click", focusEvent);
  }, []);

  return <div ref={containerRef} className="shiny"></div>;
};

// Re-usable button component
const ButtonUI = (props) => {
  const { type, onClick, disabled, btnType, ariaLabel } = props;
  return (
    <>
      <button
        aria-label={ariaLabel || ""}
        className={[`btn`, [btnType]].join(" ")}
        type={type || "button"}
        onClick={onClick || void 0}
        disabled={disabled || false}
      >
        {props.children}

        <HoverShinyEffect />
      </button>
    </>
  );
};

export default ButtonUI;
