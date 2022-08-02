import { Suspense, useState } from "react";

import DescriptionBlock from "../components/DescriptionBlock";
import ModelCollection from "../components/ModelCollection";
import SceneComponent from "../components/Scene";

function Main() {
  const [isShow, setIsShow] = useState(false);

  const descriptionShowHandler = (value: any) => {
    if (value) {
      setIsShow(value);
    } else {
      setIsShow(value);
    }
  };

  return (
    <>
      <SceneComponent componentName={"modelCollection"} />
      <Suspense fallback={null}>
        <ModelCollection onClick={descriptionShowHandler} />
      </Suspense>
      <DescriptionBlock path={"/fpv"} isShow={isShow} />
    </>
  );
}

export default Main;
