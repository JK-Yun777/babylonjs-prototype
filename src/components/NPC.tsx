import { useEffect } from "react";

import { SceneLoader, Vector3 } from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";

import { scene } from "./Scene";

const Amy = {
  URL: "",
  scale: 0.3,
  position: new Vector3(0, 0, 0),
  panelPosition: new Vector3(0.2, 0.4, 0),
  rotation: Vector3.Zero(),
  buttonText: "Meet Amy",
};

const AJ = {
  URL: "",
  scale: 0.24,
  position: new Vector3(-1, 0, 2),
  panelPosition: new Vector3(-1.2, 0.4, 2),
  rotation: Vector3.Zero(),
  buttonText: "Meet AJ",
};

function create3DButton(text: string, position: Vector3) {
  const manager = new GUI.GUI3DManager(scene);

  const panel = new GUI.StackPanel3D();
  panel.margin = 0.05;

  manager.addControl(panel);
  panel.position = position;
  panel.scaling = new Vector3(0.15, 0.1, 0.1);

  const button = new GUI.Button3D("button");
  panel.addControl(button);

  const text1 = new GUI.TextBlock();
  text1.text = text;
  text1.color = "white";
  text1.fontSize = 50;
  button.content = text1;

  return { manager, button };
}

function NPC(props: any) {
  useEffect(() => {
    SceneLoader.ImportMesh(
      "",
      "model/",
      "Amy_Greeting.glb",
      scene,
      function (meshes, particleSystems, skeletons, animationGroups) {
        const { scale, position, panelPosition, rotation, buttonText } = Amy;

        const model = meshes[0];
        model.scaling.scaleInPlace(scale);
        model.rotation = rotation;
        model.position = position;

        const { manager, button } = create3DButton(buttonText, panelPosition);

        button.onPointerUpObservable.add(function () {
          props.onClick(true);
          manager.dispose();
        });
      }
    );

    SceneLoader.ImportMesh(
      "",
      "model/",
      "AJ_Greeting.glb",
      scene,
      function (meshes, particleSystems, skeletons, animationGroups) {
        const { scale, position, panelPosition, rotation, buttonText } = AJ;

        const model = meshes[0];
        model.scaling.scaleInPlace(scale);
        model.rotation = rotation;
        model.position = position;

        const { manager, button } = create3DButton(buttonText, panelPosition);

        button.onPointerUpObservable.add(function () {
          props.onClick(true);
          manager.dispose();
        });
      }
    );

    return () => {
      scene.dispose();
    };
  }, []);
  return null;
}

export default NPC;
