import {
  Vector3,
  DeviceSourceManager,
  DeviceType,
  Matrix,
  Animation,
  MeshBuilder,
  StandardMaterial,
  CubeTexture,
  Texture,
  Color3,
  EasingFunction,
  CubicEase,
  ParticleSystem,
} from "@babylonjs/core";

import * as GUI from "@babylonjs/gui";

export const initializeMouseInput = function (
  scene: any,
  camera: any,
  canvas: any
) {
  // MOUSE CONFIG
  const currentPosition = { x: 0, y: 0, z: 0 };
  let clicked = false;
  let wheeled = false;

  canvas.addEventListener("wheel", function (evt: any) {
    if (evt) {
      wheeled = false;
    }
    scene.beforeRender = () => {
      let transformMatrix = Matrix.Zero();
      let localDirection = Vector3.Zero();
      let transformedDirection = Vector3.Zero();
      let isMoving = false;
      currentPosition.z = evt.wheelDeltaY;

      if (evt.wheelDeltaY > 0 && !wheeled) {
        localDirection.z = 0.3;
        isMoving = true;
      }

      if (evt.wheelDeltaY < 0 && !wheeled) {
        localDirection.z = -0.3;
        isMoving = true;
      }

      if (isMoving) {
        camera.getViewMatrix().invertToRef(transformMatrix);

        Vector3.TransformNormalToRef(
          localDirection,
          transformMatrix,
          transformedDirection
        );
        camera.position.addInPlace(transformedDirection);
        wheeled = true;
      }
    };
  });

  canvas.addEventListener("pointerdown", function (evt: any) {
    currentPosition.x = evt.clientX;
    currentPosition.y = evt.clientY;
    clicked = true;
  });

  canvas.addEventListener("pointermove", function (evt: any) {
    if (!clicked) {
      return;
    }

    const dx = evt.clientX - currentPosition.x;
    const dy = evt.clientY - currentPosition.y;

    const angleX = dy * 0.001;
    const angleY = dx * 0.001;

    camera.rotation.y -= angleY;
    camera.rotation.x -= angleX;

    currentPosition.x = evt.clientX;
    currentPosition.y = evt.clientY;
  });

  canvas.addEventListener("pointerup", function (evt: any) {
    clicked = false;
  });
};

export const initializeKeyboardInput = function (scene: any, camera: any) {
  const DSM = new DeviceSourceManager(scene.getEngine());
  // const deltaTimeInMillis = scene.getEngine().getDeltaTime();

  DSM.onDeviceConnectedObservable.add((device) => {
    // KEYBOARD CONFIG
    if (device.deviceType === DeviceType.Keyboard) {
      scene.onBeforeRenderObservable.add(() => {
        let transformMatrix = Matrix.Zero();
        let localDirection = Vector3.Zero();
        let transformedDirection = Vector3.Zero();
        let isMoving = false;

        // WSAD keys
        if (device.getInput(87) === 1) {
          localDirection.z = 0.05;
          isMoving = true;
        }
        if (device.getInput(83) === 1) {
          localDirection.z = -0.05;
          isMoving = true;
        }
        if (device.getInput(65) === 1) {
          localDirection.x = -0.05;
          isMoving = true;
        }
        if (device.getInput(68) === 1) {
          localDirection.x = 0.05;
          isMoving = true;
        }

        // Arrow keys (Left, Right, Up, Down)
        if (device.getInput(37) === 1) {
          camera.rotation.y -= 0.005;
        }
        if (device.getInput(39) === 1) {
          camera.rotation.y += 0.005;
        }
        if (device.getInput(38) === 1) {
          camera.rotation.x -= 0.005;
        }
        if (device.getInput(40) === 1) {
          camera.rotation.x += 0.005;
        }

        if (isMoving) {
          camera.getViewMatrix().invertToRef(transformMatrix);
          Vector3.TransformNormalToRef(
            localDirection,
            transformMatrix,
            transformedDirection
          );
          camera.position.addInPlace(transformedDirection);
        }
      });
    }

    // Move forward if 2 fingers are pressed against screen
    else if (!scene.beforeRender && device.deviceType === DeviceType.Touch) {
      scene.beforeRender = () => {
        let transformMatrix = Matrix.Zero();
        let localDirection = Vector3.Zero();
        let transformedDirection = Vector3.Zero();
        let isMoving = false;

        if (DSM.getDeviceSources(DeviceType.Touch).length === 2) {
          localDirection.z = 0.1;
          isMoving = true;
        }

        if (isMoving) {
          camera.getViewMatrix().invertToRef(transformMatrix);

          Vector3.TransformNormalToRef(
            localDirection,
            transformMatrix,
            transformedDirection
          );
          camera.position.addInPlace(transformedDirection);
        }
      };
    }
  });

  return DSM;
};

let fullscreenGUI: any;

function loadingScreen(text: string) {
  let loadingContainer = new GUI.Container()!;
  let loadingText = new GUI.TextBlock()!;

  if (!fullscreenGUI) {
    fullscreenGUI = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
  }

  if (text === "startLoading") {
    loadingContainer.zIndex = 1000;

    loadingText.text = "Loading...";
    loadingText.left = 0.5;
    loadingText.top = -100;
    loadingText.fontSize = 32;
    loadingText.color = "Darkblue";

    //background
    let loadingBackground = new GUI.Rectangle();
    loadingBackground.width = 10;
    loadingBackground.height = 10;
    loadingBackground.background = "Skyblue";
    loadingContainer.addControl(loadingBackground);

    fullscreenGUI.addControl(loadingContainer);
    loadingContainer.addControl(loadingText);
  } else if (text === "endLoading") {
    fullscreenGUI.dispose();
    loadingContainer.dispose();
    loadingText.dispose();
  }
}

interface ILoadingScreen {
  displayLoadingUI: () => void;
  hideLoadingUI: () => void;
  loadingUIBackgroundColor: string;
  loadingUIText: string;
}

export class CustomLoadingScreen implements ILoadingScreen {
  public loadingUIBackgroundColor!: string;
  public loadingUIText!: string;

  public displayLoadingUI() {
    loadingScreen("startLoading");
  }

  public hideLoadingUI() {
    loadingScreen("endLoading");
  }
}

const frameRate = 2;
let currentRadius: number;
let currentTarget: Vector3;

function getTargetAnimations(
  radius: number,
  target: Vector3,
  targetName: string
) {
  // camera zoom in animation
  const zoomIn = new Animation(
    "zoomIn",
    "radius",
    frameRate,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  const zoomIn_keys = [];

  zoomIn_keys.push({
    frame: 0,
    value: radius,
  });

  zoomIn_keys.push({
    frame: 1 * frameRate,
    value: radius - 3,
  });

  zoomIn.setKeys(zoomIn_keys);
  currentRadius = radius - 3;

  const easingFunction = new CubicEase();
  easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  zoomIn.setEasingFunction(easingFunction);

  //camera move forward
  const movein = new Animation(
    "moveIn",
    "target",
    frameRate,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  // for Room Model
  const movein_room_keys = [];

  movein_room_keys.push({
    frame: 0,
    value: Vector3.Zero(),
  });

  movein_room_keys.push({
    frame: 1 * frameRate,
    value: new Vector3(-1, -0.03, 1.2),
  });

  // for Store Model
  const movein_store_keys = [];

  movein_store_keys.push({
    frame: 0,
    value: Vector3.Zero(),
  });

  movein_store_keys.push({
    frame: 1 * frameRate,
    value: new Vector3(0.5, 0, 0),
  });

  // for MiniCity Model
  const movein_miniCity_keys = [];

  movein_miniCity_keys.push({
    frame: 0,
    value: Vector3.Zero(),
  });

  movein_miniCity_keys.push({
    frame: 1 * frameRate,
    value: new Vector3(0, 0.2, 3),
  });

  // for House Model
  const movein_house_keys = [];

  movein_house_keys.push({
    frame: 0,
    value: Vector3.Zero(),
  });

  movein_house_keys.push({
    frame: 1 * frameRate,
    value: new Vector3(0, 0, -2),
  });

  movein.setEasingFunction(easingFunction);

  switch (targetName) {
    case "room":
      movein.setKeys(movein_room_keys);
      currentTarget = new Vector3(-1, -0.03, 1.2);
      return [movein, zoomIn];

    case "store":
      movein.setKeys(movein_store_keys);
      currentTarget = new Vector3(0.5, 0, 0);
      return [movein, zoomIn];

    case "miniCity":
      movein.setKeys(movein_miniCity_keys);
      currentTarget = new Vector3(0, 0.2, 3);
      return [movein, zoomIn];

    case "house":
      movein.setKeys(movein_house_keys);
      currentTarget = new Vector3(0, 0, -2);
      return [movein, zoomIn];
  }
}

function getReturnAnimations(
  radius: number,
  target: Vector3,
  targetName: string
) {
  // camera zoom out animation
  const zoomOut = new Animation(
    "zoomOut",
    "radius",
    frameRate,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  const zoomOut_keys = [];

  zoomOut_keys.push({
    frame: 0,
    value: currentRadius,
  });

  zoomOut_keys.push({
    frame: 1 * frameRate,
    value: currentRadius + 3,
  });

  zoomOut.setKeys(zoomOut_keys);

  const easingFunction = new CubicEase();
  easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  zoomOut.setEasingFunction(easingFunction);

  const alpha = new Animation(
    "alpha",
    "alpha",
    frameRate,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  const alpha_keys = [];

  alpha_keys.push({
    frame: 0,
    value: 3.141592653589793,
  });

  alpha.setKeys(alpha_keys);
  alpha.setEasingFunction(easingFunction);

  const roomAlpha = new Animation(
    "roomAlpha",
    "alpha",
    frameRate,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  const roomAlpha_keys = [];

  roomAlpha_keys.push({
    frame: 0,
    value: 3.145,
  });

  roomAlpha_keys.push({
    frame: 1 * frameRate,
    value: 3.141592653589793,
  });

  roomAlpha.setKeys(roomAlpha_keys);
  roomAlpha.setEasingFunction(easingFunction);

  const beta = new Animation(
    "beta",
    "beta",
    frameRate,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  const beta_keys = [];

  beta_keys.push({
    frame: 0,
    value: 1.1786897756732628,
  });

  beta.setKeys(beta_keys);
  beta.setEasingFunction(easingFunction);

  //camera move forward
  const moveOut = new Animation(
    "moveOut",
    "target",
    frameRate,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  // for Room Model
  const moveOut_room_keys = [];

  moveOut_room_keys.push({
    frame: 0,
    value: currentTarget,
  });

  moveOut_room_keys.push({
    frame: 1 * frameRate,
    value: Vector3.Zero(),
  });

  // for Store Model
  const moveOut_store_keys = [];

  moveOut_store_keys.push({
    frame: 0,
    value: currentTarget,
  });

  moveOut_store_keys.push({
    frame: 1 * frameRate,
    value: Vector3.Zero(),
  });

  // for MiniCity Model
  const moveOut_miniCity_keys = [];

  moveOut_miniCity_keys.push({
    frame: 0,
    value: currentTarget,
  });

  moveOut_miniCity_keys.push({
    frame: 1 * frameRate,
    value: Vector3.Zero(),
  });

  const miniCityAlpha = new Animation(
    "miniCityAlpha",
    "alpha",
    frameRate,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  const miniCityAlpha_keys = [];

  miniCityAlpha_keys.push({
    frame: 0,
    value: 3.144,
  });

  miniCityAlpha_keys.push({
    frame: 1 * frameRate,
    value: 3.141592653589793,
  });

  miniCityAlpha.setKeys(miniCityAlpha_keys);
  miniCityAlpha.setEasingFunction(easingFunction);

  // for House Model
  const moveOut_house_keys = [];

  moveOut_house_keys.push({
    frame: 0,
    value: currentTarget,
  });

  moveOut_house_keys.push({
    frame: 1 * frameRate,
    value: Vector3.Zero(),
  });

  const houseAlpha = new Animation(
    "houseAlpha",
    "alpha",
    frameRate,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  const houseAlpha_keys = [];

  houseAlpha_keys.push({
    frame: 0,
    value: 3.144,
  });

  houseAlpha_keys.push({
    frame: 1 * frameRate,
    value: 3.141592653589793,
  });

  houseAlpha.setKeys(houseAlpha_keys);
  houseAlpha.setEasingFunction(easingFunction);

  moveOut.setEasingFunction(easingFunction);

  switch (targetName) {
    case "room":
      moveOut.setKeys(moveOut_room_keys);
      return [moveOut, zoomOut, roomAlpha, beta];

    case "store":
      moveOut.setKeys(moveOut_store_keys);
      return [moveOut, zoomOut];

    case "miniCity":
      moveOut.setKeys(moveOut_miniCity_keys);
      return [moveOut, zoomOut, miniCityAlpha, beta];

    case "house":
      moveOut.setKeys(moveOut_house_keys);
      return [moveOut, zoomOut, houseAlpha, beta];
  }
}

export function moveToTargetAnim(camera: any, scene: any, targetName: string) {
  const animations: any = getTargetAnimations(
    camera.radius,
    camera.target,
    targetName
  );

  if (animations) {
    const anim = scene.beginDirectAnimation(
      camera,
      animations,
      0,
      25 * frameRate,
      true
    );

    setTimeout(() => {
      anim.stop();
    }, 2000);
  }
}

export function returnToDefaultAnim(
  camera: any,
  scene: any,
  targetName: string
) {
  const animations = getReturnAnimations(
    camera.radius,
    camera.target,
    targetName
  );

  if (animations) {
    const anim = scene.beginDirectAnimation(
      camera,
      animations,
      0,
      25 * frameRate,
      true
    );

    setTimeout(() => {
      anim.stop();
    }, 2000);
  }
}

export function createSkybox(scene: any) {
  const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
  const skyboxMaterial = new StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new CubeTexture(
    "model/skyboxTextures/skybox",
    scene
  );
  skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
  skyboxMaterial.specularColor = new Color3(0, 0, 0);
  skybox.material = skyboxMaterial;
}

export function createParticle(scene: any, options: any) {
  const {
    capacity,
    URL,
    objectPosition,
    emitPosition,
    minEmitBox,
    maxEmitBox,
  } = options;

  const particleSystem = new ParticleSystem("particles", capacity, scene);
  particleSystem.particleTexture = new Texture(URL, scene);

  if (objectPosition) {
    const box = MeshBuilder.CreateBox("box", {});
    box.position = objectPosition;
    box.isVisible = false;
    particleSystem.emitter = box;
  } else {
    particleSystem.emitter = emitPosition;
  }

  particleSystem.minEmitBox = minEmitBox;
  particleSystem.maxEmitBox = maxEmitBox;

  return particleSystem;
}
