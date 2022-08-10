import { Suspense, useEffect, useState } from "react";

import SceneComponent, { scene } from "../components/Scene";
import BackButton from "../components/BackButton";
import SiteMap from "../components/SiteMap";
import Village from "../components/Village";
import NPC from "../components/NPC";
import ModalPortal from "../components/Portal";
import Avatar from "../components/Avatar";

function Fifth() {
  const [isShow, setIsShow] = useState(false);

  const openModalHandler = (value: any) => {
    if (value) {
      console.log("Open!!", value);
      setIsShow(true);
    }
  };

  const closeModalHandler = (value: any) => {
    if (!value) {
      console.log("close!!", value);
      setIsShow(false);
    }
  };
  return (
    <>
      <SceneComponent componentName={"village"} />
      <Suspense fallback={null}>
        <BackButton />
        <SiteMap componentName={"village"} />
        <Village />
        <NPC onClick={openModalHandler} />
      </Suspense>

      {isShow && (
        <ModalPortal isShow={isShow}>
          <Avatar onClick={closeModalHandler} />
        </ModalPortal>
      )}
    </>
  );
}

export default Fifth;
