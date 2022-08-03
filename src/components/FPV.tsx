import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { SceneLoader, GlowLayer, Vector3, Animation } from "@babylonjs/core";
import "@babylonjs/loaders";

import {
  initializeKeyboardInput,
  CustomLoadingScreen,
  initializeMouseInput,
} from "../utils";
import { scene, camera, canvasEl, engine } from "./Scene";

function FPV(): React.ReactElement | null {
  const history = useHistory();

  useEffect(() => {
    const loadingScreen = new CustomLoadingScreen();
    engine.loadingScreen = loadingScreen;
    engine.displayLoadingUI();

    const glow = new GlowLayer("glow", scene);
    glow.intensity = 1;

    SceneLoader.Append(
      "model/",
      "extendedCity.glb",
      scene,
      function (scene: any) {
        scene.executeWhenReady(function (newMeshes: any) {
          engine.hideLoadingUI();

          initializeKeyboardInput(scene, camera);
          initializeMouseInput(scene, camera, canvasEl);
        });
      },
      null,
      null,
      ".glb"
    );

    SceneLoader.ImportMesh(
      "",
      "model/",
      "HVGirl.glb",
      scene,
      function (newMeshes, particleSystems, skeletons, animationGroups) {
        const avatar = newMeshes[0];
        avatar.rotation = new Vector3(0, 0, 0);
        avatar.position.x = 2;
        avatar.position.y = 0.15;
        avatar.scaling.scaleInPlace(0.05);

        const walkMotion = animationGroups[2];
        const dancingMotion = animationGroups[1];

        walkMotion.start(true, 1.0, walkMotion.from, walkMotion.to, false);

        const avatarAnimation = new Animation(
          "avatarAnimation",
          "position.z",
          30,
          Animation.ANIMATIONTYPE_FLOAT,
          Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        const avatarKeys = [];

        avatarKeys.push({
          frame: 0,
          value: 6,
        });

        avatarKeys.push({
          frame: 200,
          value: -8,
        });

        avatarKeys.push({
          frame: 300,
          value: -15,
        });

        avatarKeys.push({
          frame: 400,
          value: -20,
        });

        avatarAnimation.setKeys(avatarKeys);

        avatar.animations = [];
        avatar.animations.push(avatarAnimation);

        const walkingAnim = scene.beginAnimation(avatar, 0, 400, false);
        walkingAnim.onAnimationEndObservable.add(() => {
          walkMotion.stop();
          dancingMotion.start(
            true,
            1.0,
            dancingMotion.from,
            dancingMotion.to,
            false
          );
        });
      }
    );

    return () => {
      scene.dispose();
    };
  }, []);

  useEffect(() => {
    return history.listen((location) => {
      if (history.action === "PUSH") {
        history.push(location.pathname);
      }

      if (history.action === "POP") {
        window.location.replace(location.pathname);
      }
    });
  }, []);

  return null;
}

export default FPV;
