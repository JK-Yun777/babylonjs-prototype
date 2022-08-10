import { useEffect } from "react";
import ReactDom from "react-dom";

const ModalPortal = ({ isShow, children }: any) => {
  const el = document.getElementById("modal")!;

  useEffect(() => {
    if (isShow) {
      el.style.visibility = "visible";
    }

    return () => {
      el.style.visibility = "hidden";
    };
  }, [isShow, el.style]);

  return ReactDom.createPortal(children, el);
};

export default ModalPortal;
