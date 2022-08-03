import { useEffect } from "react";
import { useHistory } from "react-router";

import {
  Vector3,
  MeshBuilder,
  StandardMaterial,
  Animation,
  Texture,
} from "@babylonjs/core";

import { scene, camera } from "./Scene";

function Door() {
  const frameRate = 20;

  useEffect(() => {
    const door = MeshBuilder.CreateBox(
      "door",
      { width: 2, height: 4, depth: 0.1 },
      scene
    );
    const doorMat = new StandardMaterial("doorMat", scene);
    doorMat.diffuseTexture = new Texture("model/door.jpg", scene);
    door.material = doorMat;

    const hinge = MeshBuilder.CreateBox("hinge", {}, scene);
    hinge.isVisible = false;
    door.parent = hinge;
    hinge.position.y = 2;
    door.position.x = -1;

    const movein = new Animation(
      "movein",
      "target",
      frameRate,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    const movein_keys = [];

    movein_keys.push({
      frame: 0,
      value: new Vector3(0, 5, -30),
    });

    movein_keys.push({
      frame: 3 * frameRate,
      value: new Vector3(0, 2, -10),
    });

    movein_keys.push({
      frame: 5 * frameRate,
      value: new Vector3(0, 2, -10),
    });

    movein_keys.push({
      frame: 8 * frameRate,
      value: new Vector3(-2, 2, 3),
    });

    movein.setKeys(movein_keys);

    const sweep = new Animation(
      "sweep",
      "rotation.y",
      frameRate,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    const sweep_keys = [];

    sweep_keys.push({
      frame: 0,
      value: 0,
    });

    sweep_keys.push({
      frame: 3 * frameRate,
      value: 0,
    });

    sweep_keys.push({
      frame: 5 * frameRate,
      value: Math.PI / 3,
    });

    sweep_keys.push({
      frame: 8 * frameRate,
      value: Math.PI / 3,
    });

    // door close
    // sweep_keys.push({
    //   frame: 15 * frameRate,
    //   value: 0,
    // });

    sweep.setKeys(sweep_keys);

    const cameraAnim = scene.beginDirectAnimation(
      camera,
      [movein],
      0,
      25 * frameRate,
      false
    );
    const doorOpenAnim = scene.beginDirectAnimation(
      hinge,
      [sweep],
      0,
      25 * frameRate,
      false
    );

    cameraAnim.onAnimationEndObservable.add(() => {
      ground.isVisible = false;
      wall1.isVisible = false;
      wall2.isVisible = false;
      wall3.isVisible = false;
      wall4.isVisible = false;
      wall5.isVisible = false;
      door.isVisible = false;
    });

    // doorOpenAnim.onAnimationEndObservable.add(() => {
    //   console.log("doorOpenAnim end!!");
    // });

    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 30, height: 5 },
      scene
    );

    const groundMat = new StandardMaterial("groundMat", scene);
    groundMat.diffuseTexture = new Texture("model/ground.jpg", scene);
    groundMat.diffuseTexture.hasAlpha = true;
    ground.material = groundMat;

    const wall1 = MeshBuilder.CreateBox(
      "wall1",
      { width: 8, height: 6, depth: 0.1 },
      scene
    );
    wall1.position.x = -6;
    wall1.position.y = 3;

    const wall1Mat = new StandardMaterial("wall1Mat", scene);
    wall1Mat.diffuseTexture = new Texture("model/wall.jpg", scene);
    wall1.material = wall1Mat;

    const wall2 = MeshBuilder.CreateBox(
      "wall2",
      { width: 4, height: 6, depth: 0.1 },
      scene
    );
    wall2.position.x = 2;
    wall2.position.y = 3;

    const wall2Mat = new StandardMaterial("wall2Mat", scene);
    wall2Mat.diffuseTexture = new Texture("model/wall.jpg", scene);
    wall2.material = wall2Mat;

    const wall3 = MeshBuilder.CreateBox(
      "wall3",
      { width: 2, height: 2, depth: 0.1 },
      scene
    );
    wall3.position.x = -1;
    wall3.position.y = 5;

    const wall3Mat = new StandardMaterial("wall3Mat", scene);
    wall3Mat.diffuseTexture = new Texture("model/wall.jpg", scene);
    wall3.material = wall3Mat;

    const wall4 = MeshBuilder.CreateBox(
      "wall4",
      { width: 7, height: 6, depth: 0.1 },
      scene
    );
    wall4.rotation.y = Math.PI / 2;
    wall4.position.x = -10;
    wall4.position.y = 3;
    wall4.position.z = 3.5;

    const wall4Mat = new StandardMaterial("wall5Mat", scene);
    wall4Mat.diffuseTexture = new Texture("model/wall.jpg", scene);
    wall4.material = wall4Mat;

    const wall5 = MeshBuilder.CreateBox(
      "wall5",
      { width: 7, height: 6, depth: 0.1 },
      scene
    );
    wall5.rotation.y = Math.PI / 2;
    wall5.position.x = 4;
    wall5.position.y = 3;
    wall5.position.z = 3.5;

    const wall5Mat = new StandardMaterial("wall6Mat", scene);
    wall5Mat.diffuseTexture = new Texture("model/wall.jpg", scene);
    wall5.material = wall5Mat;

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

  return null;
}

export default Door;
