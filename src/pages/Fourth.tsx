import { Suspense } from "react";

import SceneComponent from "../components/Scene";
import MainScene from "../components/MainScene";

function Fourth() {
  return (
    <>
      <SceneComponent componentName={"FPV"} />
      <Suspense fallback={null}>
        <MainScene />
      </Suspense>
    </>
  );
}

export default Fourth;
