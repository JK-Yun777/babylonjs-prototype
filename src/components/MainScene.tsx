import { useEffect } from "react";
import { useHistory } from "react-router";

import {
  SceneLoader,
  Vector3,
  MeshBuilder,
  StandardMaterial,
  VideoTexture,
  ActionManager,
  ExecuteCodeAction,
  HemisphericLight,
  PointLight,
  Color3,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import Hls from "hls.js";

import { CustomLoadingScreen } from "../utils";
import SceneComponent, { scene, engine, camera } from "./Scene";
import Character from "./Character";

function MainScene(): React.ReactElement | null {
  useEffect(() => {
    camera.radius = 1;
    camera.alpha = (3.13 * Math.PI) / 4;
    camera.beta = -0.3 + Math.PI / 1.9;
    camera.minZ = 0.01;

    new HemisphericLight("hemiLight", new Vector3(1, 1, 0), scene);
    new PointLight("pointLight", new Vector3(0, -1, 0), scene);

    const loadingScreen = new CustomLoadingScreen();
    engine.loadingScreen = loadingScreen;
    engine.displayLoadingUI();

    SceneLoader.ImportMesh(
      "",
      "model/",
      "exhibition2.glb",
      scene,
      function (meshes, particleSystems, skeletons, animationGroups) {
        scene.executeWhenReady(() => {
          engine.hideLoadingUI();
          const booth = meshes[0];
          booth.scaling.scaleInPlace(0.1);
          booth.rotation = new Vector3(0.01, 2.34, 0);
          booth.receiveShadows = true;
          booth.checkCollisions = true;

          // creactVideo
          const videoUrl =
            "https://suwon-cdn.ezpmp.co.kr/Content/Lantour/KR/01_trip1920.m3u8";

          const parent = document.querySelector("#canvas");
          const video = document.createElement("video");
          video.setAttribute("src", videoUrl);
          video.muted = true;
          parent?.appendChild(video);

          const TV = MeshBuilder.CreatePlane(
            "plane",
            { width: 0.2, height: 0.127 },
            scene
          );
          TV.position = new Vector3(-0.155, 0.244, -0.04);
          TV.rotation = new Vector3(-0.02, -0.8, (2 * Math.PI) / 2);

          const videoMat = new StandardMaterial("videoMat", scene);
          const videoTexture = new VideoTexture(
            "video",
            video,
            scene,
            true,
            true
          );
          videoMat.backFaceCulling = true;
          videoMat.diffuseTexture = videoTexture;
          videoMat.emissiveColor = Color3.White();
          TV.material = videoMat;

          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(videoUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, function () {
              TV.actionManager = new ActionManager(scene);
              TV.actionManager.registerAction(
                new ExecuteCodeAction(ActionManager.OnPickTrigger, function (
                  event
                ) {
                  if (event) {
                    videoMat.backFaceCulling = false;
                    if (video.paused) {
                      video.play();
                      video.muted = false;
                    } else {
                      video.pause();
                    }
                  }
                })
              );
            });
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = videoUrl;

            video.addEventListener("loadedmetadata", function () {
              TV.actionManager = new ActionManager(scene);
              TV.actionManager.registerAction(
                new ExecuteCodeAction(ActionManager.OnPickTrigger, function (
                  event
                ) {
                  if (event) {
                    if (video.paused) {
                      video.play();
                      video.muted = false;
                    } else {
                      video.pause();
                    }
                  }
                })
              );
            });
          }
        });
      }
    );

    return () => {
      scene.dispose();
    };
  }, []);

  const history = useHistory();

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

  return (
    <>
      <SceneComponent componentName={"modelCollection"} />
      <Character />
    </>
  );
}

export default MainScene;
