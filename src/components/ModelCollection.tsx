import { useState, useEffect } from "react";
import { useHistory } from "react-router";

import {
  Vector3,
  GlowLayer,
  ActionManager,
  ExecuteCodeAction,
  CombineAction,
  SceneLoader,
  Animation,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import {
  moveToTargetAnim,
  returnToDefaultAnim,
  createParticle,
} from "../utils";
import { scene, camera } from "./Scene";

const roomOptions = {
  URL: "",
  scale: 0.1,
  name: "room",
  position: new Vector3(-1.5, -0.03, 1.5),
};

const storeOptions = {
  URL: "",
  scale: 0.1,
  name: "store",
  position: new Vector3(0.5, 0, 0),
};

const miniCityOptions = {
  URL: "",
  scale: 0.1,
  name: "miniCity",
  position: new Vector3(0, 0.2, 3),
};

const houseOptions = {
  URL: "",
  scale: 0.3,
  name: "house",
  position: new Vector3(0, 0, -2),
};

const particleOptions = {
  capacity: 1,
  URL: "model/smoke.jpg",
  objectPosition: new Vector3(0.6, 1.2, -2.35),
  minEmitBox: new Vector3(-0.1, -0.1, -0.1),
  maxEmitBox: new Vector3(-0.1, -0.1, -0.1),
};

function ModelCollection(props: any): React.ReactElement | null {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isReturned, setIsReturned] = useState(false);
  const [target, setTarget] = useState("");

  useEffect(() => {
    // Add glow effect
    const glow = new GlowLayer("glow", scene);
    glow.intensity = 0.4;

    // Add Animation
    const FRAME_RATE = 20;
    const movedown = new Animation(
      "movedown",
      "beta",
      FRAME_RATE,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    const movedown_keys = [];

    movedown_keys.push({
      frame: 0,
      value: 1.8,
    });

    movedown_keys.push({
      frame: 1 * FRAME_RATE,
      value: 1.6,
    });

    movedown_keys.push({
      frame: 2 * FRAME_RATE,
      value: 1.4,
    });

    movedown_keys.push({
      frame: 3 * FRAME_RATE,
      value: 1.3,
    });

    movedown_keys.push({
      frame: 4 * FRAME_RATE,
      value: 1.2,
    });

    movedown_keys.push({
      frame: 5 * FRAME_RATE,
      value: 1.1786897756732628,
    });

    movedown.setKeys(movedown_keys);

    const zoomout = new Animation(
      "zoomout",
      "radius",
      FRAME_RATE,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    const zoomout_keys = [];

    zoomout_keys.push({
      frame: 0,
      value: 0.5,
    });

    zoomout_keys.push({
      frame: 1 * FRAME_RATE,
      value: 2,
    });

    zoomout_keys.push({
      frame: 2 * FRAME_RATE,
      value: 3,
    });

    zoomout_keys.push({
      frame: 3 * FRAME_RATE,
      value: 4,
    });

    zoomout_keys.push({
      frame: 4 * FRAME_RATE,
      value: 5,
    });

    zoomout_keys.push({
      frame: 5 * FRAME_RATE,
      value: 5.5,
    });

    zoomout.setKeys(zoomout_keys);

    const preURL = document.referrer;
    const moveDownAnim = preURL.lastIndexOf("video");

    if (moveDownAnim > 0) {
      scene.beginDirectAnimation(
        camera,
        [zoomout, movedown],
        0,
        5 * FRAME_RATE,
        false
      );
    } else {
      camera.alpha = (4 * Math.PI) / 4;
      camera.beta = -0.4 + Math.PI / 1.99;
      camera.radius = 5.5;
      camera.lowerRadiusLimit = 1.5;
    }

    let isZoomInClicked = false;
    let currentTarget = "";

    // Add Room model
    SceneLoader.ImportMesh(
      "",
      "model/",
      "roomWithoutPlane.glb",
      scene,
      function (meshes, particleSystems, skeletons, animationGroups) {
        const { scale, position, name } = roomOptions;

        const model = meshes[0];
        model.scaling.scaleInPlace(scale);
        model.position = position;

        const meshA = meshes[1];
        meshA.actionManager = new ActionManager(meshA._scene);
        meshA.actionManager
          .registerAction(
            new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
              if (!isZoomInClicked) {
                setIsZoomed((isZoomed) => !isZoomed);
                setTarget(name);
                props.onClick({ value: true, path: name });
                isZoomInClicked = true;
                currentTarget = name;
              }
            })
          )!
          .then(
            new CombineAction(ActionManager.NothingTrigger, [
              new ExecuteCodeAction(ActionManager.OnPickTrigger, function (
                evt
              ) {
                if (currentTarget === name) {
                  setIsZoomed((isZoomed) => !isZoomed);
                  setIsReturned(true);
                  setTarget(name);
                  props.onClick(false);
                  currentTarget = "";
                  isZoomInClicked = false;
                }
              }),
            ])
          );

        const meshB = meshes[2];
        meshB.actionManager = new ActionManager(meshB._scene);
        meshB.actionManager
          .registerAction(
            new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
              if (!isZoomInClicked) {
                setIsZoomed((isZoomed) => !isZoomed);
                setTarget(name);
                props.onClick({ value: true, path: name });
                isZoomInClicked = true;
                currentTarget = name;
              }
            })
          )!
          .then(
            new CombineAction(ActionManager.NothingTrigger, [
              new ExecuteCodeAction(ActionManager.OnPickTrigger, function (
                evt
              ) {
                if (currentTarget === name) {
                  setIsZoomed((isZoomed) => !isZoomed);
                  setIsReturned(true);
                  setTarget(name);
                  props.onClick(false);
                  currentTarget = "";
                  isZoomInClicked = false;
                }
              }),
            ])
          );
      }
    )!;

    // Add Store model
    SceneLoader.ImportMesh(
      "",
      "model/",
      "storeWithoutPlane.glb",
      scene,
      function (meshes, particleSystems, skeletons, animationGroups) {
        const { scale, position, name } = storeOptions;

        const model = meshes[0];
        model.scaling.scaleInPlace(scale);
        model.position = position;

        const meshA = meshes[1];
        meshA.actionManager = new ActionManager(meshA._scene);
        meshA.actionManager
          .registerAction(
            new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
              if (!isZoomInClicked) {
                setIsZoomed((isZoomed) => !isZoomed);
                setTarget(name);
                props.onClick({ value: true, path: name });
                isZoomInClicked = true;
                currentTarget = name;
              }
            })
          )!
          .then(
            new CombineAction(ActionManager.NothingTrigger, [
              new ExecuteCodeAction(ActionManager.OnPickTrigger, function (
                evt
              ) {
                if (currentTarget === storeOptions.name) {
                  setIsZoomed((isZoomed) => !isZoomed);
                  setIsReturned(true);
                  setTarget(name);
                  props.onClick(false);
                  currentTarget = "";
                  isZoomInClicked = false;
                }
              }),
            ])
          );

        const meshB = meshes[5];
        meshB.actionManager = new ActionManager(meshB._scene);
        meshB.actionManager
          .registerAction(
            new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
              if (!isZoomInClicked) {
                setIsZoomed((isZoomed) => !isZoomed);
                setTarget(name);
                props.onClick({ value: true, path: name });
                isZoomInClicked = true;
                currentTarget = name;
              }
            })
          )!
          .then(
            new CombineAction(ActionManager.NothingTrigger, [
              new ExecuteCodeAction(ActionManager.OnPickTrigger, function (
                evt
              ) {
                if (currentTarget === name) {
                  setIsZoomed((isZoomed) => !isZoomed);
                  setIsReturned(true);
                  setTarget(name);
                  props.onClick(false);
                  currentTarget = "";
                  isZoomInClicked = false;
                }
              }),
            ])
          );
      }
    )!;

    // Add MiniCity model
    SceneLoader.ImportMesh(
      "",
      "model/",
      "miniCity.glb",
      scene,
      function (meshes, particleSystems, skeletons, animationGroups) {
        const { scale, position, name } = miniCityOptions;

        const model = meshes[0];
        model.scaling.scaleInPlace(scale);
        model.position = position;

        const meshA = meshes[1];
        meshA.actionManager = new ActionManager(meshA._scene);
        meshA.actionManager
          .registerAction(
            new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
              if (!isZoomInClicked) {
                setIsZoomed((isZoomed) => !isZoomed);
                setTarget(name);
                props.onClick({ value: true, path: name });
                isZoomInClicked = true;
                currentTarget = name;
              }
            })
          )!
          .then(
            new CombineAction(ActionManager.NothingTrigger, [
              new ExecuteCodeAction(ActionManager.OnPickTrigger, function (
                evt
              ) {
                if (currentTarget === name) {
                  setIsZoomed((isZoomed) => !isZoomed);
                  setIsReturned(true);
                  setTarget(name);
                  props.onClick(false);
                  currentTarget = "";
                  isZoomInClicked = false;
                }
              }),
            ])
          );

        const meshB = meshes[4];
        meshB.actionManager = new ActionManager(meshB._scene);
        meshB.actionManager
          .registerAction(
            new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
              if (!isZoomInClicked) {
                setIsZoomed((isZoomed) => !isZoomed);
                setTarget(name);
                props.onClick({ value: true, path: name });
                isZoomInClicked = true;
                currentTarget = name;
              }
            })
          )!
          .then(
            new CombineAction(ActionManager.NothingTrigger, [
              new ExecuteCodeAction(ActionManager.OnPickTrigger, function (
                evt
              ) {
                if (currentTarget === name) {
                  setIsZoomed((isZoomed) => !isZoomed);
                  setIsReturned(true);
                  setTarget(name);
                  props.onClick(false);
                  currentTarget = "";
                  isZoomInClicked = false;
                }
              }),
            ])
          );
      }
    )!;

    // Add House model
    SceneLoader.ImportMesh(
      "",
      "model/",
      "house.glb",
      scene,
      function (meshes, particleSystems, skeletons, animationGroups) {
        const { scale, position, name } = houseOptions;

        const meshA = meshes[0];
        meshA.scaling.scaleInPlace(scale);
        meshA.position = position;

        const smoke = createParticle(scene, particleOptions);
        smoke.start();

        meshA.actionManager = new ActionManager(meshA._scene);
        meshA.actionManager
          .registerAction(
            new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
              if (!isZoomInClicked) {
                setIsZoomed((isZoomed) => !isZoomed);
                setTarget(name);
                props.onClick({ value: true, path: name });
                isZoomInClicked = true;
                currentTarget = name;
              }
            })
          )!
          .then(
            new CombineAction(ActionManager.NothingTrigger, [
              new ExecuteCodeAction(ActionManager.OnPickTrigger, function (
                evt
              ) {
                if (currentTarget === name) {
                  setIsZoomed((isZoomed) => !isZoomed);
                  setIsReturned(true);
                  setTarget(name);
                  props.onClick(false);
                  currentTarget = "";
                  isZoomInClicked = false;
                }
              }),
            ])
          );

        const meshB = meshes[1];
        meshB.actionManager = new ActionManager(meshB._scene);
        meshB.actionManager
          .registerAction(
            new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
              if (!isZoomInClicked) {
                setIsZoomed((isZoomed) => !isZoomed);
                setTarget(name);
                props.onClick({ value: true, path: name });
                isZoomInClicked = true;
                currentTarget = name;
              }
            })
          )!
          .then(
            new CombineAction(ActionManager.NothingTrigger, [
              new ExecuteCodeAction(ActionManager.OnPickTrigger, function (
                evt
              ) {
                if (currentTarget === name) {
                  setIsZoomed((isZoomed) => !isZoomed);
                  setIsReturned(true);
                  setTarget(name);
                  props.onClick(false);
                  currentTarget = "";
                  isZoomInClicked = false;
                }
              }),
            ])
          );
      }
    )!;

    return () => {
      scene.dispose();
    };
  }, []);

  if (isZoomed) {
    moveToTargetAnim(camera, scene, target);
  }

  if (!isZoomed && isReturned) {
    returnToDefaultAnim(camera, scene, target);
  }

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

  return null;
}

export default ModelCollection;
