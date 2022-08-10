import { useEffect, useState } from "react";

import * as GUI from "@babylonjs/gui";

const clickHandler = (num: number) => {
  switch (num) {
    case 0:
      window.location.replace("/");
      break;

    case 1:
      window.location.replace("/fpv");
      break;

    case 2:
      window.location.replace("/door");
      break;

    case 3:
      window.location.replace("/main");
      break;

    case 4:
      window.location.replace("/video");
      break;

    case 5:
      window.location.replace("/village");
      break;
  }
};

const createHamburgerMenuHandler = (fullScreenUI: any) => {
  const image = GUI.Button.CreateImageOnlyButton("button", "model/menu.png");

  image.width = 0.03;
  image.height = 0.06;
  image.thickness = 0;
  image.paddingTop = "10px";
  image.paddingRight = "10px";
  image.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  image.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;

  fullScreenUI.addControl(image);

  return image;
};

const createSelectBoxHandler = (
  fullScreenUI: any,
  currentComponent: number
) => {
  const siteMap = new GUI.RadioGroup("");
  siteMap.addRadio("Home", clickHandler);
  siteMap.addRadio("FPV", clickHandler);
  siteMap.addRadio("Door", clickHandler);
  siteMap.addRadio("Main", clickHandler);
  siteMap.addRadio("video", clickHandler);
  siteMap.addRadio("village", clickHandler);

  siteMap._setSelectorButtonBackground(currentComponent, "skyblue");
  siteMap._setSelectorButtonColor(currentComponent, "skyblue");

  const selectBox = new GUI.SelectionPanel("selectBox", [siteMap]);
  selectBox.width = 0.06;
  selectBox.height = 0.3;
  selectBox.thickness = 0;
  selectBox.fontSize = "16px";
  selectBox.paddingTop = "-20px";
  selectBox.background = "Black";
  selectBox.color = "White";
  selectBox.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  selectBox.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;

  fullScreenUI.addControl(selectBox);

  return selectBox;
};

function SiteMap(props: any) {
  const [currentComponent, setCurrentComponent] = useState(0);

  useEffect(() => {
    switch (props.componentName) {
      case "modelCollection":
        setCurrentComponent(0);
        break;

      case "FPV":
        setCurrentComponent(1);
        break;

      case "door":
        setCurrentComponent(2);
        break;

      case "main":
        setCurrentComponent(3);
        break;

      case "video":
        setCurrentComponent(4);
        break;

      case "village":
        setCurrentComponent(5);
        break;
    }
  }, [props, currentComponent]);

  useEffect(() => {
    const fullScreenUI = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    const image = createHamburgerMenuHandler(fullScreenUI);

    image.onPointerEnterObservable.add(() => {
      const selectBox = createSelectBoxHandler(fullScreenUI, currentComponent);

      selectBox.onPointerOutObservable.add(() => {
        selectBox.dispose();
      });
    });

    return () => {
      fullScreenUI.dispose();
    };
  }, [currentComponent]);

  return null;
}

export default SiteMap;
