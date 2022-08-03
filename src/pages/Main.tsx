import { Suspense, useEffect, useState } from "react";

import DescriptionBlock from "../components/DescriptionBlock";
import ModelCollection from "../components/ModelCollection";
import SceneComponent from "../components/Scene";
import Birds from "../components/Birds";

function Main() {
  const [isShow, setIsShow] = useState(false);
  const [path, setPath] = useState("");
  const [text, setText] = useState("");

  const descriptionShowHandler = (args: any) => {
    const { value, path } = args;

    if (value) {
      setIsShow(value);
    } else {
      setIsShow(value);
    }

    if (path === "room") {
      setPath(() => "/main");
      setText(() => "Go to Main Page");
    }

    if (path === "store") {
      setPath(() => "/fpv");
      setText(() => "Go to FPV Page");
    }

    if (path === "miniCity") {
      setPath(() => "/door");
      setText(() => "Go to Door Page");
    }

    if (path === "house") {
      setPath(() => "/video");
      setText(() => "Go to Video Page");
    }
  };

  return (
    <>
      <SceneComponent componentName={"modelCollection"} />
      <Suspense fallback={null}>
        <ModelCollection onClick={descriptionShowHandler} />
        <Birds />
      </Suspense>
      <DescriptionBlock path={path} isShow={isShow} text={text} />
    </>
  );
}

export default Main;
