import { useState, useEffect } from "react";

import { Vector3, SceneLoader } from "@babylonjs/core";
import "@babylonjs/loaders";

import { CustomLoadingScreen } from "../utils";
import { scene, engine } from "./Scene";

function Village() {
  useEffect(() => {
    const loadingScreen = new CustomLoadingScreen();
    engine.loadingScreen = loadingScreen;
    engine.displayLoadingUI();

    SceneLoader.ImportMesh(
      "",
      "https://assets.babylonjs.com/meshes/",
      "valleyvillage.glb",
      scene,
      function (meshes, particleSystems, skeletons, animationGroups) {
        engine.hideLoadingUI();
        const model = meshes[0];
        model.rotation = new Vector3(0, 0, 0);
      }
    );

    return () => {
      scene.dispose();
    };
  }, []);

  return null;
}

export default Village;
