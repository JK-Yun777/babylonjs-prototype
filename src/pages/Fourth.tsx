import { Suspense } from "react";

import SceneComponent from "../components/Scene";
import { Bird } from "../components/Birds";

function Fourth() {
  return (
    <>
      <SceneComponent componentName={"birds"} />
      <Suspense fallback={null}>
        <Bird />
      </Suspense>
    </>
  );
}

export default Fourth;
