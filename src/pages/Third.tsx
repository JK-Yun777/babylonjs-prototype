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
      </Suspense>
      <Door />
    </>
  );
}

export default Third;
