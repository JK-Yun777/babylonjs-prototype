import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { useScene } from "react-babylonjs";
import {
  Vector3,
  GlowLayer,
  ActionManager,
  ExecuteCodeAction,
  CombineAction,
  SceneLoader,
  HemisphericLight,
  ArcRotateCamera,
  MeshAssetTask,
} from "@babylonjs/core";

import "@babylonjs/loaders";

import { moveToTargetAnim, returnToDefaultAnim } from "../utils";
import { scene, camera } from "./Scene";

const initCameraTargetVector = Vector3.Zero();
const initCameraRadius = 5.5;

function Store(props: any): React.ReactElement | null {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isReturned, setIsReturned] = useState(false);
  const [target, setTarget] = useState("");

  useEffect(() => {
    SceneLoader.ImportMesh(
      "",
      "model/",
      "storeWithoutPlane.glb",
      scene,
      function (meshes, particleSystems, skeletons, animationGroups) {
        const model = meshes[0];
        model.scaling.scaleInPlace(0.1);
        model.position = new Vector3(0.5, 0, 0);

        // const glow = new GlowLayer("glow", scene);
        // glow.intensity = 0.01;

        const meshA = meshes[1];
        meshA.actionManager = new ActionManager(meshA._scene);
        meshA.actionManager
          .registerAction(
            new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
              setIsZoomed((isZoomed) => !isZoomed);
              setTarget("store");
              props.onClick(true);
            })
          )!
          .then(
            new CombineAction(ActionManager.NothingTrigger, [
              new ExecuteCodeAction(ActionManager.OnPickTrigger, function (
                evt
              ) {
                setIsZoomed((isZoomed) => !isZoomed);
                setIsReturned(true);
                setTarget("store");

                props.onClick(false);
              }),
            ])
          );

        const meshB = meshes[5];
        meshB.actionManager = new ActionManager(meshB._scene);
        meshB.actionManager
          .registerAction(
            new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
              setIsZoomed((isZoomed) => !isZoomed);
              setTarget("store");
              props.onClick(true);
            })
          )!
          .then(
            new CombineAction(ActionManager.NothingTrigger, [
              new ExecuteCodeAction(ActionManager.OnPickTrigger, function (
                evt
              ) {
                setIsZoomed((isZoomed) => !isZoomed);
                setIsReturned(true);
                setTarget("store");
                props.onClick(false);
              }),
            ])
          );
      }
      // function (evt) {
      //   // console.log(evt);
      //   if (evt.loaded === totalContext) {
      //     setISProgressed(true);
      //   }
      //   setIsLoad(evt.loaded);
      // }
    );
  }, []);

  if (isZoomed) {
    console.log("11111");
    moveToTargetAnim(camera, scene, target);
  }

  if (!isZoomed && isReturned) {
    console.log("22222");
    returnToDefaultAnim(camera, scene, target);
  }

  const history = useHistory();

  const moveToClickHandler = () => {
    history.push("/fpv");
    // window.location.replace("/fpv");
  };

  return null;
}

export default Store;
