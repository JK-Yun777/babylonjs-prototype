import { Suspense, useCallback, useEffect, useState } from "react";

import SceneComponent, { scene } from "../components/Scene";
import BackButton from "../components/BackButton";
import SiteMap from "../components/SiteMap";
import Village from "../components/Village";
import NPC from "../components/NPC";
import ModalPortal from "../components/Portal";
import TargetNPC from "../components/TargetNPC";

function Fifth() {
  const [isShow, setIsShow] = useState(false);
  const [NPCName, setNPCName] = useState("");

  const openModalHandler = (args: any) => {
    const { value, NPCName } = args;

    if (value) {
      setIsShow(true);
      setNPCName(() => NPCName);
    }
  };

  const closeModalHandler = (value: any) => {
    if (!value) {
      setIsShow(false);
      setNPCName("");
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
          <TargetNPC onClick={closeModalHandler} name={NPCName} />
        </ModalPortal>
      )}
    </>
  );
}

export default Fifth;
