import { Suspense } from "react";

import SceneComponent from "../components/Scene";
import FPV from "../components/FPV";
import Car from "../components/Car";

function Sub() {
  return (
    <>
      <SceneComponent componentName={"FPV"} />
      <Suspense fallback={null}>
        <FPV />
        <Car />
      </Suspense>
    </>
  );
}

export default Sub;
