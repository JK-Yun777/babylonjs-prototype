import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { SceneLoader, Vector3 } from "@babylonjs/core";
import "@babylonjs/loaders";

import { scene } from "./Scene";

const storkOptions = {
  URL: "",
  scale: 0.03,
  position: new Vector3(-1, 1.5, -5),
  rotateAxis: new Vector3(0, -1, 0),
  rotateAmount: 0.2,
};

const parrotOptions = {
  URL: "",
  scale: 0.03,
  position: new Vector3(-5, 1.5, 2.5),
  rotation: new Vector3(0, -0.7, 0),
  rotateAxis: new Vector3(0, 1, 0),
  rotateAmount: 0.1,
};

const flamingoOptions = {
  URL: "",
  scale: 0.03,
  position: new Vector3(-3, 1.7, 5),
  rotation: new Vector3(0, 0, 0),
  rotateAxis: new Vector3(0, -1, 0),
  rotateAmount: 0.2,
};

const FLYING_SPEED = 0.015;

function Birds() {
  useEffect(() => {
    // Add Stork model
    SceneLoader.ImportMesh(
      "",
      "model/",
      "stork.glb",
      scene,
      function (meshes, particleSystems, skeletons, animationGroups) {
        const { scale, position, rotateAxis, rotateAmount } = storkOptions;

        const mesh = meshes[0];
        mesh.scaling.scaleInPlace(scale);
        mesh.position = position;

        let distance = 0;

        scene.onBeforeRenderObservable.add(() => {
          mesh.movePOV(0, 0, FLYING_SPEED);
          distance += FLYING_SPEED;

          if (distance > 2.5) {
            mesh.rotate(rotateAxis, rotateAmount);
            distance--;
          }
        });
      }
    );

    // Add Parrot model
    SceneLoader.ImportMesh(
      "",
      "model/",
      "parrot.glb",
      scene,
      function (meshes, particleSystems, skeletons, animationGroups) {
        const { scale, position, rotation, rotateAxis, rotateAmount } =
          parrotOptions;

        const mesh = meshes[0];
        mesh.scaling.scaleInPlace(scale);
        mesh.position = position;
        mesh.rotation = rotation;

        let distance = 0;

        scene.onBeforeRenderObservable.add(() => {
          mesh.movePOV(0, 0, FLYING_SPEED);
          distance += FLYING_SPEED;

          if (distance > 2.5) {
            mesh.rotate(rotateAxis, rotateAmount);
            distance--;
          }
        });
      }
    );

    // Add Flamingo model
    SceneLoader.ImportMesh(
      "",
      "model/",
      "flamingo.glb",
      scene,
      function (meshes, particleSystems, skeletons, animationGroups) {
        const { scale, position, rotation, rotateAxis, rotateAmount } =
          flamingoOptions;

        const mesh = meshes[0];
        mesh.scaling.scaleInPlace(scale);
        mesh.position = position;
        mesh.rotation = rotation;

        let distance = 0;

        scene.onBeforeRenderObservable.add(() => {
          mesh.movePOV(0, 0, FLYING_SPEED);
          distance += FLYING_SPEED;

          if (distance > 2.5) {
            mesh.rotate(rotateAxis, rotateAmount);
            distance--;
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
  return null;
}

export default Birds;
