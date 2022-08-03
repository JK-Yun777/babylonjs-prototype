import { useState, useEffect } from "react";
import { useHistory } from "react-router";

import {
  Vector3,
  GlowLayer,
  ActionManager,
  ExecuteCodeAction,
  CombineAction,
  SceneLoader,
  ParticleSystem,
  Texture,
  MeshBuilder,
  Color4,
  Animation,
  PointerDragBehavior,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import { moveToTargetAnim, returnToDefaultAnim } from "../utils";
import { scene, camera } from "./Scene";

function ModelCollection(props: any): React.ReactElement | null {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isReturned, setIsReturned] = useState(false);
  const [target, setTarget] = useState("");

  useEffect(() => {
    // Add glow effect
    const glow = new GlowLayer("glow", scene);
    glow.intensity = 0.4;

    // Add snow
    const particleSystem = new ParticleSystem("particles", 2000, scene);

    particleSystem.particleTexture = new Texture("model/flare.png", scene);

    particleSystem.emitter = new Vector3(0, 10, 0);
    particleSystem.minEmitBox = new Vector3(10, 10, 10);
    particleSystem.maxEmitBox = new Vector3(-10, -10, -10);

    particleSystem.color1 = new Color4(1, 1, 1);
    particleSystem.color2 = new Color4(1, 1, 1);
    particleSystem.colorDead = new Color4(1, 1, 1);

    particleSystem.minSize = 0;
    particleSystem.maxSize = 0.2;

    particleSystem.minLifeTime = 4;
    particleSystem.maxLifeTime = 8;

    particleSystem.emitRate = 200;

    particleSystem.direction1 = new Vector3(1, -1, 1);
    particleSystem.direction2 = new Vector3(1, -1, 1);

    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 1;
    particleSystem.updateSpeed = 0.003;

    particleSystem.start();

    // Add Animation
    const frameRate = 20;
    const movedown = new Animation(
      "movedown",
      "beta",
      frameRate,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    const movedown_keys = [];

    movedown_keys.push({
      frame: 0,
      value: 1.8,
    });

    movedown_keys.push({
      frame: 1 * frameRate,
      value: 1.6,
    });

    movedown_keys.push({
      frame: 2 * frameRate,
      value: 1.4,
    });

    movedown_keys.push({
      frame: 3 * frameRate,
      value: 1.3,
    });

    movedown_keys.push({
      frame: 4 * frameRate,
      value: 1.2,
    });

    movedown_keys.push({
      frame: 5 * frameRate,
      value: 1.1786897756732628,
    });

    movedown.setKeys(movedown_keys);

    const zoomout = new Animation(
      "zoomout",
      "radius",
      frameRate,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    const zoomout_keys = [];

    zoomout_keys.push({
      frame: 0,
      value: 0.5,
    });

    zoomout_keys.push({
      frame: 1 * frameRate,
      value: 2,
    });

    zoomout_keys.push({
      frame: 2 * frameRate,
      value: 3,
    });

    zoomout_keys.push({
      frame: 3 * frameRate,
      value: 4,
    });

    zoomout_keys.push({
      frame: 4 * frameRate,
      value: 5,
    });

    zoomout_keys.push({
      frame: 5 * frameRate,
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
        5 * frameRate,
        false
      );
    } else {
      camera.alpha = (4 * Math.PI) / 4;
      camera.beta = -0.4 + Math.PI / 1.99;
      camera.radius = 5.5;
      camera.lowerRadiusLimit = 1.5;
    }

    // Add roomWithoutPlane model
    SceneLoader.ImportMesh(
      "",
      "model/",
      "roomWithoutPlane.glb",
      scene,
      function (meshes, particleSystems, skeletons, animationGroups) {
        const model = meshes[0];
        model.scaling.scaleInPlace(0.1);
        model.position = new Vector3(-1.5, -0.03, 1.5);

        const meshA = meshes[1];
        meshA.actionManager = new ActionManager(meshA._scene);
        meshA.actionManager
          .registerAction(
            new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
              setIsZoomed((isZoomed) => !isZoomed);
              setTarget("room");
              props.onClick({ value: true, path: "room" });
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
              props.onClick({ value: true, path: "room" });
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
              }),
            ])
          );
      }
    )!;

    // Add storeWithoutPlane model
    SceneLoader.ImportMesh(
      "",
      "model/",
      "storeWithoutPlane.glb",
      scene,
      function (meshes, particleSystems, skeletons, animationGroups) {
        const model = meshes[0];
        model.scaling.scaleInPlace(0.1);
        model.position = new Vector3(0.5, 0, 0);

        const meshA = meshes[1];
        meshA.actionManager = new ActionManager(meshA._scene);
        meshA.actionManager
          .registerAction(
            new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
              setIsZoomed((isZoomed) => !isZoomed);
              setTarget("store");
              props.onClick({ value: true, path: "store" });
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
              props.onClick({ value: true, path: "store" });
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
    )!;

    // Add miniCity model
    SceneLoader.ImportMesh(
      "",
      "model/",
      "miniCity.glb",
      scene,
      function (meshes, particleSystems, skeletons, animationGroups) {
        const model = meshes[0];
        model.scaling.scaleInPlace(0.1);
        model.position = new Vector3(0, 0.2, 3);

        const meshA = meshes[1];
        meshA.actionManager = new ActionManager(meshA._scene);
        meshA.actionManager
          .registerAction(
            new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
              setIsZoomed((isZoomed) => !isZoomed);
              setTarget("miniCity");
              props.onClick({ value: true, path: "miniCity" });
            })
          )!
          .then(
            new CombineAction(ActionManager.NothingTrigger, [
              new ExecuteCodeAction(ActionManager.OnPickTrigger, function (
                evt
              ) {
                setIsZoomed((isZoomed) => !isZoomed);
                setIsReturned(true);
                setTarget("miniCity");
                props.onClick(false);
              }),
            ])
          );

        const meshB = meshes[4];
        meshB.actionManager = new ActionManager(meshB._scene);
        meshB.actionManager
          .registerAction(
            new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
              setIsZoomed((isZoomed) => !isZoomed);
              setTarget("miniCity");
              props.onClick({ value: true, path: "miniCity" });
            })
          )!
          .then(
            new CombineAction(ActionManager.NothingTrigger, [
              new ExecuteCodeAction(ActionManager.OnPickTrigger, function (
                evt
              ) {
                setIsZoomed((isZoomed) => !isZoomed);
                setIsReturned(true);
                setTarget("miniCity");
                props.onClick(false);
              }),
            ])
          );
      }
    )!;

    // Add house model
    SceneLoader.ImportMesh(
      "",
      "model/",
      "house.glb",
      scene,
      function (meshes, particleSystems, skeletons, animationGroups) {
        const meshA = meshes[0];
        meshA.scaling.scaleInPlace(0.3);
        meshA.position = new Vector3(0, 0, -2);

        const box = MeshBuilder.CreateBox("box", {});
        box.position = new Vector3(0.6, 1.2, -2.35);
        box.isVisible = false;

        const particleSystem = new ParticleSystem("particles", 1, scene);
        particleSystem.particleTexture = new Texture("model/smoke.jpg");
        particleSystem.emitter = box;
        particleSystem.minEmitBox = new Vector3(-0.1, -0.1, -0.1);
        particleSystem.maxEmitBox = new Vector3(-0.1, -0.1, -0.1);
        particleSystem.start();

        meshA.actionManager = new ActionManager(meshA._scene);
        meshA.actionManager
          .registerAction(
            new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
              setIsZoomed((isZoomed) => !isZoomed);
              setTarget("house");
              props.onClick({ value: true, path: "house" });
              particleSystem.dispose();
            })
          )!
          .then(
            new CombineAction(ActionManager.NothingTrigger, [
              new ExecuteCodeAction(ActionManager.OnPickTrigger, function (
                evt
              ) {
                setIsZoomed((isZoomed) => !isZoomed);
                setIsReturned(true);
                setTarget("house");
                props.onClick(false);
              }),
            ])
          );

        const meshB = meshes[1];
        meshB.actionManager = new ActionManager(meshB._scene);
        meshB.actionManager
          .registerAction(
            new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
              setIsZoomed((isZoomed) => !isZoomed);
              setTarget("house");
              props.onClick({ value: true, path: "house" });
            })
          )!
          .then(
            new CombineAction(ActionManager.NothingTrigger, [
              new ExecuteCodeAction(ActionManager.OnPickTrigger, function (
                evt
              ) {
                setIsZoomed((isZoomed) => !isZoomed);
                setIsReturned(true);
                setTarget("house");
                props.onClick(false);
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
