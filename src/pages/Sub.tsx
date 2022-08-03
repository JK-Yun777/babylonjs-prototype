import { Suspense } from "react";

import SceneComponent from "../components/Scene";
import FPV from "../components/FPV";
import Car from "../components/Car";
import BackButton from "../components/BackButton";
import SiteMap from "../components/SiteMap";

function Sub() {
  return (
    <>
      <SceneComponent componentName={"FPV"} />
      <Suspense fallback={null}>
        <BackButton />
        <SiteMap componentName={"FPV"} />
        <FPV />
        <Car />
      </Suspense>
    </>
  );
}

export default Sub;
