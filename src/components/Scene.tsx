import { useEffect, useState } from "react";

import {
  Engine,
  HemisphericLight,
  Scene,
  Vector3,
  ArcRotateCamera,
  UniversalCamera,
  Color4,
  Color3,
  CannonJSPlugin,
  DirectionalLight,
} from "@babylonjs/core";
import "@babylonjs/core/Physics/physicsEngineComponent";
import * as CANNON from "cannon";

import { createSkybox } from "../utils";

export const canvasEl = document.querySelector("#canvas")!;
export const engine = new (Engine as any)(canvasEl, true);
export let scene = new Scene(engine);
export let camera: any;

window.CANNON = CANNON;
const gravityVector = new Vector3(0, -9.81, 0);

if (scene) {
  scene.clearColor = Color4.FromColor3(Color3.FromHexString("#f7f6f0"));
  scene.enablePhysics(gravityVector, new CannonJSPlugin());
  scene.collisionsEnabled = true;
}

const onSceneReady = (scene: any, name: string) => {
  if (name === "modelCollection") {
    camera = new ArcRotateCamera(
      "modelCam",
      (4 * Math.PI) / 4,
      1.8,
      9,
      Vector3.Zero()
    )!;
    camera.wheelDeltaPercentage = 0.01;

    camera.angularSensibilityX = 5000;
    camera.angularSensibilityY = 5000;

    camera.lowerAlphaLimit = (1.5 * Math.PI) / 2;
    camera.upperAlphaLimit = (2.5 * Math.PI) / 2;

    camera.lowerBetaLimit = (-0.8 + Math.PI) / 2;
    camera.upperBetaLimit = (0.2 + Math.PI) / 2;

    camera.lowerRadiusLimit = 0.4;
    camera.upperRadiusLimit = 10;
    camera.useBouncingBehavior = true;

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 1.5;

    createSkybox(scene);
  }

  if (name === "FPV") {
    camera = new UniversalCamera("FPVCam", new Vector3(2, 0.5, -25), scene);
    camera.setTarget(new Vector3(1, 0, -10));

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    // scene.fogMode = Scene.FOGMODE_LINEAR;
    // scene.fogDensity = 0.05;

    createSkybox(scene);
  }

  if (name === "door") {
    camera = new ArcRotateCamera(
      "doorCam",
      (-10 * Math.PI) / 4,
      -0.7 + Math.PI / 1.99,
      3,
      new Vector3(0, 3, -30)
    )!;
    camera.wheelDeltaPercentage = 0.01;

    camera.angularSensibilityX = 5000;
    camera.angularSensibilityY = 5000;

    camera.lowerRadiusLimit = 0.5;
    camera.upperRadiusLimit = 10;
    camera.useBouncingBehavior = true;

    const light1 = new DirectionalLight(
      "DirectionalLight",
      new Vector3(0, -1, 0),
      scene
    );
    const light2 = new HemisphericLight(
      "HemiLight",
      new Vector3(0, 1, -1),
      scene
    );
    light1.intensity = 0.25;

    createSkybox(scene);
  }

  if (name === "video") {
    camera = new UniversalCamera("videoCam", new Vector3(0, 0, -30), scene);

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 1;
  }

  if (name === "birds") {
    camera = new ArcRotateCamera(
      "birdsCam",
      (4 * Math.PI) / 4,
      -0.4 + Math.PI / 1.99,
      12,
      Vector3.Zero()
    )!;
    camera.wheelDeltaPercentage = 0.01;

    camera.angularSensibilityX = 5000;
    camera.angularSensibilityY = 5000;

    // camera.lowerRadiusLimit = 0.4;
    // camera.upperRadiusLimit = 10;
    camera.useBouncingBehavior = true;

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 1.5;

    createSkybox(scene);
  }

  if (name === "village") {
    camera = new ArcRotateCamera(
      "villageCam",
      2.7 + Math.PI / 2.2,
      5 + Math.PI / 2.2,
      13,
      Vector3.Zero()
    );
    camera.wheelDeltaPercentage = 0.01;

    camera.angularSensibilityX = 5000;
    camera.angularSensibilityY = 5000;

    camera.upperBetaLimit = Math.PI / 2.2;
    camera.lowerRadiusLimit = 2;
    camera.upperRadiusLimit = 15;

    camera.useBouncingBehavior = true;

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 1.5;

    createSkybox(scene);
  }

  const canvas = scene.getEngine().getRenderingCanvas();
  camera.attachControl(canvas, true);
};

const onRender = (scene: any) => {
  // console.log("Rendered!!", isShow);
  // if (box !== undefined) {
  //   const deltaTimeInMillis = scene.getEngine().getDeltaTime();
  //   const rpm = 10;
  //   box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
  // }
};
const SceneComponent = (props: any) => {
  const [canvas, setCanvas] = useState(canvasEl);

  useEffect(() => {
    if (canvas) {
      if (scene.isReady()) {
        onSceneReady(scene, props.componentName);
      } else {
        scene = new Scene(engine);

        if (scene.isReady()) {
          onSceneReady(scene, props.componentName);
        }

        // scene.onReadyObservable.add((scene) => {
        //   onSceneReady(scene, props.componentName);
        // });
      }

      engine.runRenderLoop(() => {
        if (typeof onRender === "function") {
          onRender(scene);
        }

        scene.render();
      });

      const resize = () => {
        scene.getEngine().resize();
      };

      if (window) {
        window.addEventListener("resize", resize);
      }

      return () => {
        // scene.getEngine().dispose();
        if (window) {
          window.removeEventListener("resize", resize);
        }
      };
    }
  }, [canvas]);

  return null;
};
export default SceneComponent;
