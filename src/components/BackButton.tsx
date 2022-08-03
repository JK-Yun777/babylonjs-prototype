import { useEffect } from "react";
import { useHistory } from "react-router";

import * as GUI from "@babylonjs/gui";

function BackButton() {
  const history = useHistory();

  useEffect(() => {
    const fullScreenUI = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const image = GUI.Button.CreateImageOnlyButton("button", "model/home.png");

    image.width = 0.03;
    image.height = 0.06;
    image.thickness = 0;
    image.paddingTop = "10px";
    image.paddingLeft = "10px";
    image.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    image.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;

    fullScreenUI.addControl(image);

    image.onPointerClickObservable.add(() => {
      window.location.replace("/");
    });

    return () => {
      fullScreenUI.dispose();
    };
  }, []);
  return null;
}

export default BackButton;
