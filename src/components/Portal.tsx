import { useEffect } from "react";
import { createPortal } from "react-dom";

const ModalPortal = ({ isShow, children }: any) => {
  const el = document.getElementById("modal")!;

  useEffect(() => {
    if (isShow) {
      el.style.visibility = "visible";
    }

    return () => {
      el.style.visibility = "hidden";
    };
  }, []);

  return createPortal(children, el);
};

export default ModalPortal;
