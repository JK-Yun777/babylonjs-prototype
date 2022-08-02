import { useEffect } from "react";

import {
  Vector3,
  Vector4,
  StandardMaterial,
  Texture,
  MeshBuilder,
  Animation,
} from "@babylonjs/core";

import { scene } from "./Scene";
import earcut from "earcut";

export const buildCar = (scene: any) => {
  const outline = [new Vector3(-0.3, 0, -0.1), new Vector3(0.2, 0, -0.1)];

  for (let i = 0; i < 20; i++) {
    outline.push(
      new Vector3(
        0.2 * Math.cos((i * Math.PI) / 40),
        0,
        0.2 * Math.sin((i * Math.PI) / 40) - 0.1
      )
    );
  }

  outline.push(new Vector3(0, 0, 0.1));
  outline.push(new Vector3(-0.3, 0, 0.1));

  const faceUV = [];
  faceUV[0] = new Vector4(0, 0.5, 0.38, 1);
  faceUV[1] = new Vector4(0, 0, 1, 0.5);
  faceUV[2] = new Vector4(0.38, 1, 0, 0.5);

  const carMat = new StandardMaterial("carMat", scene);
  carMat.diffuseTexture = new Texture(
    "https://assets.babylonjs.com/environments/car.png",
    scene
  );

  const car = MeshBuilder.ExtrudePolygon(
    "car",
    {
      shape: outline,
      depth: 0.2,
      faceUV: faceUV,
      wrap: true,
    },
    scene,
    earcut
  );
  car.material = carMat;

  const wheelUV = [];
  wheelUV[0] = new Vector4(0, 0, 1, 1);
  wheelUV[1] = new Vector4(0, 0.5, 0, 0.5);
  wheelUV[2] = new Vector4(0, 0, 1, 1);

  const wheelMat = new StandardMaterial("wheelMat", scene);
  wheelMat.diffuseTexture = new Texture(
    "https://assets.babylonjs.com/environments/wheel.png",
    scene
  );

  const wheelRB = MeshBuilder.CreateCylinder(
    "wheelRB",
    {
      diameter: 0.125,
      height: 0.05,
      faceUV: wheelUV,
    },
    scene
  );
  wheelRB.material = wheelMat;
  wheelRB.parent = car;
  wheelRB.position.z = -0.1;
  wheelRB.position.x = -0.2;
  wheelRB.position.y = 0.035;

  const wheelRF = wheelRB.clone("wheelRF");
  wheelRF.position.x = 0.1;

  const wheelLB = wheelRB.clone("wheelLB");
  wheelLB.position.y = -0.2 - 0.035;

  const wheelLF = wheelRF.clone("wheelLF");
  wheelLF.position.y = -0.2 - 0.035;

  //wheel animation
  const animWheel = new Animation(
    "wheelAnimation",
    "rotation.y",
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );

  const wheelKeys = [];

  wheelKeys.push({
    frame: 0,
    value: 0,
  });

  wheelKeys.push({
    frame: 30,
    value: 2 * Math.PI,
  });

  animWheel.setKeys(wheelKeys);

  wheelRB.animations = [];
  wheelRB.animations.push(animWheel);

  wheelRF.animations = [];
  wheelRF.animations.push(animWheel);

  wheelLB.animations = [];
  wheelLB.animations.push(animWheel);

  wheelLF.animations = [];
  wheelLF.animations.push(animWheel);

  scene.beginAnimation(wheelRB, 0, 30, true);
  scene.beginAnimation(wheelRF, 0, 30, true);
  scene.beginAnimation(wheelLB, 0, 30, true);
  scene.beginAnimation(wheelLF, 0, 30, true);

  return car;
};

function Car() {
  useEffect(() => {
    const car = buildCar(scene);
    car.scaling = new Vector3(3, 3, 3);
    car.rotation.x = -Math.PI / 2;
    car.rotation.z = Math.PI / 2;
    car.position.y = 0.6;
    car.position.x = 0.5;

    const animCar = new Animation(
      "carAnimation",
      "position.z",
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );

    const carKeys = [];

    carKeys.push({
      frame: 0,
      value: 6,
    });

    carKeys.push({
      frame: 50,
      value: -8,
    });

    carKeys.push({
      frame: 100,
      value: -15,
    });

    carKeys.push({
      frame: 150,
      value: -20,
    });

    carKeys.push({
      frame: 200,
      value: -15,
    });

    carKeys.push({
      frame: 250,
      value: -8,
    });

    carKeys.push({
      frame: 300,
      value: 6,
    });

    animCar.setKeys(carKeys);

    car.animations = [];
    car.animations.push(animCar);

    scene.beginAnimation(car, 0, 300, true);

    return () => {
      scene.dispose();
    };
  }, []);

  return null;
}

export default Car;
