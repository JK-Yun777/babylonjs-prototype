import { Suspense } from "react";

import SceneComponent from "../components/Scene";
import FPV from "../components/FPV";
import Car from "../components/Car";
import BackButton from "../components/BackButton";

function Sub() {
  return (
    <>
      <SceneComponent componentName={"FPV"} />
      <Suspense fallback={null}>
        <BackButton />
        <FPV />
        <Car />
      </Suspense>
    </>
  );
}

export default Sub;
