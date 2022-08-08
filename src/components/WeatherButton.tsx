import { useEffect } from "react";

import { Vector3, Color4 } from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";

import { createParticle } from "../utils";
import { scene } from "./Scene";

const particleOptions = {
  capacity: 2000,
  URL: "model/flare.png",
  emitPosition: new Vector3(0, 10, 0),
  minEmitBox: new Vector3(10, 10, 10),
  maxEmitBox: new Vector3(-10, -10, -10),
};

function WeatherButton() {
  useEffect(() => {
    let snow = createParticle(scene, particleOptions);
    snow.color1 = new Color4(1, 1, 1);
    snow.color2 = new Color4(1, 1, 1);
    snow.colorDead = new Color4(1, 1, 1);

    snow.minSize = 0.05;
    snow.maxSize = 0.1;

    snow.minLifeTime = 4;
    snow.maxLifeTime = 8;

    snow.emitRate = 200;

    snow.direction1 = new Vector3(1, -1, 1);
    snow.direction2 = new Vector3(1, -1, 1);

    snow.minEmitPower = 1;
    snow.maxEmitPower = 1;
    snow.updateSpeed = 0.003;
    snow.start();

    const fullScreenUI = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    const panel = new GUI.StackPanel();

    const snowBTN = GUI.Button.CreateImageOnlyButton("snow", "model/snow.png");
    const sunBTN = GUI.Button.CreateImageOnlyButton("sunny", "model/sun.png");

    panel.width = "120px";
    panel.height = "300px";
    panel.isVertical = false;

    panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;

    snowBTN.width = "45px";
    snowBTN.height = "52px";
    snowBTN.thickness = 0;
    snowBTN.paddingBottom = "10px";
    snowBTN.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

    sunBTN.width = "55px";
    sunBTN.height = "50px";
    sunBTN.thickness = 0;
    sunBTN.paddingLeft = "15px";
    sunBTN.paddingBottom = "10px";
    sunBTN.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

    panel.addControl(snowBTN);
    panel.addControl(sunBTN);
    fullScreenUI.addControl(panel);

    snowBTN.onPointerClickObservable.add(() => {
      snow.start();
    });

    sunBTN.onPointerClickObservable.add(() => {
      snow.stop();
    });

    return () => {
      fullScreenUI.dispose();
    };
  }, []);
  return null;
}

export default WeatherButton;
