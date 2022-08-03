import { Suspense } from "react";

import SceneComponent from "../components/Scene";
import Booth from "../components/Booth";
import Door from "../components/Door";

function Third() {
  return (
    <>
      <SceneComponent componentName={"door"} />
      <Suspense fallback={null}>
        <Booth />
        <Door />
      </Suspense>
    </>
  );
}

export default Third;
