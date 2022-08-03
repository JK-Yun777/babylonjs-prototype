import { useEffect } from "react";

import { SceneLoader, Vector3 } from "@babylonjs/core";
import "@babylonjs/loaders";

import { scene } from "./Scene";

function Birds() {
  useEffect(() => {
    SceneLoader.ImportMesh(
      "",
      "model/",
      "stork.glb",
      scene,
      function (meshes, particleSystems, skeletons, animationGroups) {
        const mesh = meshes[0];
        mesh.scaling.scaleInPlace(0.03);
        mesh.position = new Vector3(-1, 1.5, -5);

        let distance = 0;
        let step = 0.015;

        scene.onBeforeRenderObservable.add(() => {
          mesh.movePOV(0, 0, step);
          distance += step;

          if (distance > 2.5) {
            mesh.rotate(new Vector3(0, -1, 0), 0.2);
            distance--;
          }
        });
      }
    );

    SceneLoader.ImportMesh(
      "",
      "model/",
      "parrot.glb",
      scene,
      function (meshes, particleSystems, skeletons, animationGroups) {
        const mesh = meshes[0];
        mesh.scaling.scaleInPlace(0.03);
        mesh.position = new Vector3(-5, 1.5, 2);
        mesh.rotation = new Vector3(0, -0.7, 0);

        let distance = 0;
        let step = 0.015;

        scene.onBeforeRenderObservable.add(() => {
          mesh.movePOV(0, 0, step);
          distance += step;

          if (distance > 2.5) {
            mesh.rotate(new Vector3(0, 1, 0), 0.1);
            distance--;
          }
        });
      }
    );

    SceneLoader.ImportMesh(
      "",
      "model/",
      "flamingo.glb",
      scene,
      function (meshes, particleSystems, skeletons, animationGroups) {
        const mesh = meshes[0];
        mesh.scaling.scaleInPlace(0.03);
        mesh.position = new Vector3(-3, 1.7, 5);
        mesh.rotation = new Vector3(0, 0, 0);

        let distance = 0;
        let step = 0.015;

        scene.onBeforeRenderObservable.add(() => {
          mesh.movePOV(0, 0, step);
          distance += step;

          if (distance > 2.5) {
            mesh.rotate(new Vector3(0, -1, 0), 0.2);
            distance--;
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

export default Birds;
