import { Suspense } from "react";

import SceneComponent from "../components/Scene";
import Booth from "../components/Booth";
import Door from "../components/Door";
import BackButton from "../components/BackButton";

function Third() {
  return (
    <>
      <SceneComponent componentName={"door"} />
      <Suspense fallback={null}>
        <BackButton />
        <Booth />
        <Door />
      </Suspense>
    </>
  );
}

export default Third;
