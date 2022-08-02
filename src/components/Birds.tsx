import { useEffect, useState } from "react";

import { MeshBuilder, SceneLoader, Vector3 } from "@babylonjs/core";
import "@babylonjs/loaders";
import SceneComponent, { camera, scene } from "./Scene";

export function Bird(props: any) {
  const [start] = useState(() => Math.random() * 2);
  const [positionZ, setPositionZ] = useState(0);

  useEffect(() => {
    let bird;
    let speed = bird === "stork" ? 0.25 : bird === "flamingo" ? 0.5 : 5;
    let factor =
      bird === "stork"
        ? 0.5 + Math.random()
        : bird === "flamingo"
        ? 0.25 + Math.random()
        : 1 + Math.random() - 0.5;
    const delta = scene.getEngine();
    SceneLoader.ImportMesh(
      "",
      "model/",
      "stork.glb",
      scene,
      function (meshes, particleSystems, skeletons, animationGroups) {
        const mesh = meshes[0];
        mesh.position.z = positionZ;

        console.log(mesh.position.z);
        // mesh.position.z +=
        // (10 / 60) * Math.PI * 2 * (delta.getDeltaTime() / 1000);

        scene.onBeforeRenderObservable.add(() => {
          if (mesh.rotation.y === 0) {
            mesh.position.z +=
              (10 / 60) * Math.PI * 2 * (delta.getDeltaTime() / 1000);
          }

          if (mesh.position.z > 5) {
            // mesh.rotation = new Vector3(0, 0.1, 0);
            mesh.rotate(new Vector3(0, 0.1, 0), delta.getDeltaTime() / 1000);
          }

          if (mesh.rotation.y === 0.1) {
            console.log("2222");
            mesh.position.z -= 0.03;
            console.log(mesh.position.z);
          }
          // mesh.position.y += 0.01;
          // mesh.rotation.y +=
          //   Math.sin((delta.getDeltaTime() * 0.5 + Math.random()) / 2) *
          //   Math.cos((delta.getDeltaTime() * 0.5 + Math.random()) / 2) *
          //   1.5;
        });
      }
    );
  }, []);
  return null;
}

// export function Birds() {
//   return (
//     <>
//       {new Array(1).fill(0).map((_, i) => {
//         const x =
//           (20 + Math.random() * 80) * (Math.round(Math.random()) ? -1 : 1);
//         const y = -10 + Math.random() * 20;
//         const z = -5 + Math.random() * 10;
//         const bird = ["stork", "parrot", "flamingo"][
//           Math.round(Math.random() * 2)
//         ];
//         let speed = bird === "stork" ? 0.25 : bird === "flamingo" ? 0.5 : 5;
//         let factor =
//           bird === "stork"
//             ? 0.5 + Math.random()
//             : bird === "flamingo"
//             ? 0.25 + Math.random()
//             : 1 + Math.random() - 0.5;
//         return (
//           <>
//             <Bird
//               key={i}
//               position={[x, y, z]}
//               rotation={[0, x > 0 ? Math.PI : 0, 0]}
//               speed={speed}
//               factor={factor}
//               url={`/${bird}.glb`}
//             />
//           </>
//         );
//       })}
//     </>
//   );
// }
