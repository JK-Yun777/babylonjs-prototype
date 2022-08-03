import { Suspense } from "react";

import SceneComponent from "../components/Scene";
import MainScene from "../components/MainScene";
import BackButton from "../components/BackButton";

function Fourth() {
  return (
    <>
      <SceneComponent componentName={"FPV"} />
      <Suspense fallback={null}>
        <BackButton />
        <MainScene />
      </Suspense>
    </>
  );
}

export default Fourth;
