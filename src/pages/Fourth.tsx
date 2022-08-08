import { Suspense } from "react";

import SceneComponent from "../components/Scene";
import MainScene from "../components/MainScene";
import BackButton from "../components/BackButton";
import SiteMap from "../components/SiteMap";

function Fourth() {
  return (
    <>
      <SceneComponent componentName={"FPV"} />
      <Suspense fallback={null}>
        <BackButton />
        <SiteMap componentName={"main"} />
        <MainScene />
      </Suspense>
    </>
  );
}

export default Fourth;
