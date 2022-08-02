import { useState, useEffect } from "react";
import { useHistory } from "react-router";

import {
  Vector3,
  GlowLayer,
  ActionManager,
  ExecuteCodeAction,
  CombineAction,
  SceneLoader,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import { moveToTargetAnim, returnToDefaultAnim } from "../utils";
import { scene, camera } from "./Scene";

function Room(props: any): React.ReactElement | null {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isReturned, setIsReturned] = useState(false);
  const [target, setTarget] = useState("");

  useEffect(() => {
    SceneLoader.ImportMesh(
      "",
      "model/",
      "roomWithoutPlane.glb",
      scene,
      function (meshes, particleSystems, skeletons, animationGroups) {
        const model = meshes[0];
        model.scaling.scaleInPlace(0.1);
        model.position = new Vector3(-1.5, -0.03, 1.5);

        const glow = new GlowLayer("glow", scene);
        glow.intensity = 0.3;

        const meshA = meshes[1];
        meshA.actionManager = new ActionManager(meshA._scene);
        meshA.actionManager
          .registerAction(
            new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
              setIsZoomed((isZoomed) => !isZoomed);
              setTarget("room");
              props.onClick(true);
              meshA.actionManager?.dispose();
            })
          )!
          .then(
            new CombineAction(ActionManager.NothingTrigger, [
              new ExecuteCodeAction(ActionManager.OnPickTrigger, function (
                evt
              ) {
                setIsZoomed((isZoomed) => !isZoomed);
                setIsReturned(true);
                setTarget("room");
                props.onClick(false);
                meshA.actionManager?.dispose();
              }),
            ])
          );

        const meshB = meshes[2];
        meshB.actionManager = new ActionManager(meshB._scene);
        meshB.actionManager
          .registerAction(
            new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
              setIsZoomed((isZoomed) => !isZoomed);
              setTarget("room");
              props.onClick(true);
              meshB.actionManager?.dispose();
            })
          )!
          .then(
            new CombineAction(ActionManager.NothingTrigger, [
              new ExecuteCodeAction(ActionManager.OnPickTrigger, function (
                evt
              ) {
                setIsZoomed((isZoomed) => !isZoomed);
                setIsReturned(true);
                setTarget("room");
                props.onClick(false);
                meshB.actionManager?.dispose();
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
    )!;
  }, []);

  if (isZoomed) {
    moveToTargetAnim(camera, scene, target);
  }

  if (!isZoomed && isReturned) {
    returnToDefaultAnim(camera, scene, target);
  }

  const history = useHistory();

  const moveToClickHandler = () => {
    history.push("/fpv");

    // window.location.replace("/fpv");
  };

  return null;
}

export default Room;
