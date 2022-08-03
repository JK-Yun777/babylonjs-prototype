import { useEffect } from "react";
import { useHistory } from "react-router";

import {
  MeshBuilder,
  Color3,
  StandardMaterial,
  VideoTexture,
  ActionManager,
  ExecuteCodeAction,
  Vector3,
  Texture,
  Mesh,
  Animation,
} from "@babylonjs/core";

import "@babylonjs/loaders";
import * as GUI from "@babylonjs/gui";

import { CustomLoadingScreen } from "../utils";
import SceneComponent, { scene, camera, engine } from "./Scene";
import BackButton from "./BackButton";

function getVideoThumbnail(videoPlayer: any, seekTo = 0) {
  return new Promise((resolve, reject) => {
    videoPlayer.addEventListener("loadedmetadata", () => {
      if (videoPlayer.duration < seekTo) {
        reject("video is too short.");
        return;
      }
      // delay seeking or else 'seeked' event won't fire on Safari
      setTimeout(() => {
        videoPlayer.currentTime = seekTo;
      }, 0);

      videoPlayer.addEventListener("seeked", () => {
        const canvas = document.createElement("canvas");
        canvas.width = videoPlayer.videoWidth;
        canvas.height = videoPlayer.videoHeight;

        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
        ctx.canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.75
        );
      });
    });
  });
}

function Video(): React.ReactElement | null {
  useEffect(() => {
    // Add TV
    const TV = MeshBuilder.CreatePlane(
      "plane",
      { width: 30, height: 15, sideOrientation: Mesh.DOUBLESIDE },
      scene
    );

    TV.position = new Vector3(0, 0, 20);
    TV.rotation = new Vector3((-2 * Math.PI) / 2, 0, 0);
    camera.lockedTarget = TV;

    const videoMat = new StandardMaterial("videoMat", scene);
    const videoTexture = new VideoTexture(
      "video",
      ["model/video.mp4"],
      scene,
      false,
      true,
      VideoTexture.TRILINEAR_SAMPLINGMODE,
      {
        autoPlay: false,
        autoUpdateTexture: true,
      }
    );
    videoMat.backFaceCulling = false;
    videoMat.diffuseTexture = videoTexture;
    videoMat.emissiveColor = Color3.White();

    TV.material = videoMat;

    const htmlVideo = videoTexture.video;
    // for IOS
    // htmlVideo.setAttribute("webkit-playsinline", "webkit-playsinline");
    // htmlVideo.setAttribute("playsinline", "true");
    htmlVideo.setAttribute("muted", "true");
    htmlVideo.setAttribute("autoplay", "false");

    getVideoThumbnail(htmlVideo);

    // Add Animation
    const frameRate = 20;
    const movein = new Animation(
      "movein",
      "position",
      frameRate,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    const movein_keys = [];

    movein_keys.push({
      frame: 0,
      value: new Vector3(0, 0, -30),
    });

    movein_keys.push({
      frame: 3 * frameRate,
      value: new Vector3(0, 0, -25),
    });

    movein_keys.push({
      frame: 6 * frameRate,
      value: new Vector3(0, 0, -20),
    });

    movein_keys.push({
      frame: 9 * frameRate,
      value: new Vector3(0, 2, -15),
    });

    movein_keys.push({
      frame: 12 * frameRate,
      value: new Vector3(0, 4, -10),
    });

    movein_keys.push({
      frame: 15 * frameRate,
      value: new Vector3(0, 6, -5),
    });

    movein_keys.push({
      frame: 18 * frameRate,
      value: new Vector3(0, 8, 0),
    });

    movein.setKeys(movein_keys);

    const moveup = new Animation(
      "moveup",
      "position",
      frameRate,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    const moveup_keys = [];

    moveup_keys.push({
      frame: 0,
      value: new Vector3(0, 0, 20),
    });

    moveup_keys.push({
      frame: 9 * frameRate,
      value: new Vector3(0, 2, 15),
    });

    moveup_keys.push({
      frame: 12 * frameRate,
      value: new Vector3(0, 4, 10),
    });

    moveup_keys.push({
      frame: 15 * frameRate,
      value: new Vector3(0, 6, 5),
    });

    moveup_keys.push({
      frame: 18 * frameRate,
      value: new Vector3(0, 8, 0),
    });

    moveup.setKeys(moveup_keys);

    let timer: any;
    let cameraAnim: any;
    let TVAnim: any;

    // Add button
    const fullScreenUI = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const panel = new GUI.StackPanel();
    panel.paddingTop = "430px";
    panel.paddingBottom = "50px";

    const button = GUI.Button.CreateSimpleButton(
      "button",
      "Dive into the metaverse"
    );

    button.width = 0.2;
    button.height = "40px";
    button.thickness = 0;
    button.color = "rgb(255, 156, 189)";
    button.background = "rgb(255, 224, 224)";

    panel.addControl(button);
    fullScreenUI.addControl(panel);

    button.onPointerClickObservable.add(() => {
      fullScreenUI.dispose();

      timer = setTimeout(() => {
        cameraAnim = scene.beginDirectAnimation(
          camera,
          [movein],
          0,
          18 * frameRate,
          false
        );

        cameraAnim.onAnimationEndObservable.add(() => {
          window.location.replace("/");
        });

        TVAnim = scene.beginDirectAnimation(
          TV,
          [moveup],
          0,
          18 * frameRate,
          false
        );
      }, 19000);

      if (htmlVideo.paused) {
        htmlVideo.play();
      } else {
        htmlVideo.pause();
      }
    });

    // scene.onPointerUp = (event) => {
    //   fullScreenUI.dispose()
    //   if (event) {
    //     videoTexture.video.play();
    //     timer = setTimeout(() => {
    //       cameraAnim = scene.beginDirectAnimation(
    //         camera,
    //         [movein],
    //         0,
    //         18 * frameRate,
    //         false
    //       );

    //       cameraAnim.onAnimationEndObservable.add(() => {
    //         window.location.replace("/");
    //       });

    //       const videoAnim = scene.beginDirectAnimation(
    //         TV,
    //         [moveup],
    //         0,
    //         18 * frameRate,
    //         false
    //       );
    //     }, 19000);
    //   }
    // };

    return () => {
      scene.dispose();
      clearTimeout(timer);
      fullScreenUI.dispose();
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
      <SceneComponent componentName={"video"} />
      <BackButton />
    </>
  );
}

export default Video;
