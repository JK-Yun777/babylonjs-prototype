import { Suspense } from "react";

import SceneComponent from "../components/Scene";
import Booth from "../components/Booth";
import Door from "../components/Door";
import BackButton from "../components/BackButton";
import SiteMap from "../components/SiteMap";

function Third() {
  return (
    <>
      <SceneComponent componentName={"door"} />
      <Suspense fallback={null}>
        <BackButton />
        <SiteMap componentName={"door"} />
        <Booth />
        <Door />
      </Suspense>
    </>
  );
}

export default Third;
