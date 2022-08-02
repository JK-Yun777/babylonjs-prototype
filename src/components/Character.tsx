import { useMemo, useEffect } from "react";

import {
  SceneLoader,
  Vector3,
  MeshBuilder,
  PhysicsImpostor,
  ActionManager,
  ExecuteCodeAction,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import { scene } from "./Scene";

interface InputMapType {
  [index: string]: boolean;
}

function Character(): React.ReactElement | null {
  function createInputMap() {
    const inputMap: InputMapType = {};
    scene.actionManager = new ActionManager(scene);
    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";
      })
    );
    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";
      })
    );

    return inputMap;
  }

  const inputMap = useMemo(createInputMap, []);

  useEffect(() => {
    SceneLoader.ImportMesh(
      "",
      "model/",
      "HVGirl.glb",
      scene,
      function (newMeshes, particleSystems, skeletons, animationGroups) {
        const avatar = newMeshes[0];

        const authoredStartPosition = new Vector3(-0.2, 0, -0.5);
        const authoredCenterMassOffset = new Vector3(0, 0, 0);

        avatar.position = authoredCenterMassOffset;

        const bodyVisible = false;
        const box = MeshBuilder.CreateBox(
          "box1",
          { width: 4, height: 4, depth: 0.01 },
          scene
        );
        box.rotation = new Vector3(Math.PI / 2, 0.78, 0);
        box.position = new Vector3(0, 0.01, 0);
        box.isVisible = bodyVisible;
        // avatar.addChild(box);

        if (scene) {
          box.physicsImpostor = new PhysicsImpostor(
            box,
            PhysicsImpostor.BoxImpostor,
            { mass: 0 },
            scene
          );

          avatar.physicsImpostor = new PhysicsImpostor(
            avatar,
            PhysicsImpostor.NoImpostor,
            { mass: 0 },
            scene
          );
        }

        avatar.position = authoredStartPosition;
        avatar.scaling.scaleInPlace(0.01);

        // Add animations
        const heroSpeed = 0.03;
        const heroSpeedBackwards = 0.01;
        const heroRotationSpeed = 0.1;

        let animating = true;

        const walkAnim = scene.getAnimationGroupByName("Walking")!;
        const walkBackAnim = scene.getAnimationGroupByName("WalkingBack")!;
        const idleAnim = scene.getAnimationGroupByName("Idle")!;
        const sambaAnim = scene.getAnimationGroupByName("Samba")!;

        //Rendering loop (executed for everyframe)
        scene.onBeforeRenderObservable.add(() => {
          let keydown = false;
          //Manage the movements of the character (e.g. position, direction)
          if (inputMap["w"]) {
            avatar.moveWithCollisions(avatar.forward.scaleInPlace(heroSpeed));
            keydown = true;
          }
          if (inputMap["s"]) {
            avatar.moveWithCollisions(
              avatar.forward.scaleInPlace(-heroSpeedBackwards)
            );
            keydown = true;
          }
          if (inputMap["a"]) {
            avatar.rotate(Vector3.Up(), -heroRotationSpeed);
            keydown = true;
          }
          if (inputMap["d"]) {
            avatar.rotate(Vector3.Up(), heroRotationSpeed);
            keydown = true;
          }
          if (inputMap["b"]) {
            keydown = true;
          }

          //Manage animations to be played
          if (keydown) {
            if (!animating) {
              animating = true;
              if (inputMap["s"]) {
                //Walk backwards
                walkBackAnim.start(
                  true,
                  1.0,
                  walkBackAnim.from,
                  walkBackAnim.to,
                  false
                );
              } else if (inputMap["b"]) {
                //Samba!
                sambaAnim.start(true, 1.0, sambaAnim.from, sambaAnim.to, false);
              } else {
                //Walk
                walkAnim.start(true, 1.0, walkAnim.from, walkAnim.to, false);
              }
            }
          } else {
            if (animating) {
              //Default animation is idle when no key is down
              idleAnim.start(true, 1.0, idleAnim.from, idleAnim.to, false);

              //Stop all animations besides Idle Anim when no key is down
              sambaAnim.stop();
              walkAnim.stop();
              walkBackAnim.stop();

              //Ensure animation are played only once per rendering loop
              animating = false;
            }
          }
        });
      }
    );
    return () => {
      scene.dispose();
    };
  }, []);

  return null;
}

export default Character;
