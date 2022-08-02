import { Suspense, useState } from "react";
import { Model, SceneLoaderContextProvider } from "react-babylonjs";
import {
  Vector3,
  GlowLayer,
  ActionManager,
  ExecuteCodeAction,
  CombineAction,
  ArcRotateCamera,
  HemisphericLight,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import { useHistory } from "react-router";

import { moveToTargetAnim, returnToDefaultAnim, fadeInAnim } from "../utils";

import { scene } from "../components/Scene";

const initCameraTargetVector = Vector3.Zero();
const initCameraRadius = 5.5;

function AnimationScenes(): React.ReactElement | null {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isReturned, setIsReturned] = useState(false);
  const [target, setTarget] = useState("");
  const [isShow, setIsShow] = useState(false);

  // const scene = useScene()!;

  const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);

  const camera2 = new ArcRotateCamera(
    "camera2",
    (4 * Math.PI) / 4,
    -0.5 + Math.PI / 1.99,
    initCameraRadius,
    initCameraTargetVector
  )!;

  camera2.upperBetaLimit = Math.PI / 2;
  camera2.upperAlphaLimit = 0.5 + Math.PI;
  camera2.lowerAlphaLimit = -0.5 + Math.PI;
  camera2.wheelDeltaPercentage = 0.01;
  camera2.angularSensibilityX = 5000;
  camera2.angularSensibilityY = 5000;

  scene.activeCameras!.push(camera2);
  camera2.attachControl(true);

  const modelLoadHandler = (model: any) => {
    let meshA;
    let meshB;

    if (model.rootMesh.name === "room") {
      meshA = model.meshes[1];
      meshB = model.meshes[2];
    }

    if (model.rootMesh.name === "store") {
      meshA = model.meshes[1];
      meshB = model.meshes[5];
    }

    if (model.rootMesh.name === "miniCity") {
      meshA = model.meshes[1];
      meshB = model.meshes[4];
    }

    if (model.rootMesh.name === "house") {
      meshA = model.meshes[0];
      meshB = model.meshes[1];
    }

    meshA.actionManager = new ActionManager(meshA._scene);
    meshA.actionManager
      .registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
          setIsZoomed((isZoomed) => !isZoomed);
          setTarget(model.rootMesh.name);
          setIsShow(true);
        })
      )
      .then(
        new CombineAction(ActionManager.NothingTrigger, [
          new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
            setIsZoomed((isZoomed) => !isZoomed);
            setIsReturned(true);
            setTarget(model.rootMesh.name);
            setIsShow(false);
          }),
        ])
      );

    meshB.actionManager = new ActionManager(meshA._scene);
    meshB.actionManager
      .registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
          setIsZoomed((isZoomed) => !isZoomed);
          setTarget(model.rootMesh.name);
          setIsShow(true);
        })
      )
      .then(
        new CombineAction(ActionManager.NothingTrigger, [
          new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
            setIsZoomed((isZoomed) => !isZoomed);
            setIsReturned(true);
            setTarget(model.rootMesh.name);
            setIsShow(false);
          }),
        ])
      );
  };

  if (isZoomed) {
    moveToTargetAnim(camera2, scene, target);
  }

  if (!isZoomed && isReturned) {
    returnToDefaultAnim(camera2, scene, target);
  }

  const history = useHistory();
  console.log("Anim history>>>>>>", history);

  const moveToClickHandler = () => {
    history.push("/fpv");
    // window.location.replace("/fpv");
  };

  return (
    <>
      <SceneLoaderContextProvider>
        <Suspense
          fallback={
            <box name="fallback" position={new Vector3(-2.5, -1.5, 0)} />
          }
        >
          <Model
            name="room"
            reportProgress
            rootUrl="model/"
            sceneFilename="roomWithoutPlane.glb"
            scaleToDimension={1}
            position={new Vector3(-1.5, -0.03, 1.5)}
            onModelLoaded={modelLoadHandler}
          />

          <Model
            name="store"
            reportProgress
            rootUrl="model/"
            sceneFilename="storeWithoutPlane.glb"
            scaleToDimension={1}
            position={new Vector3(0.5, 0, 0)}
            onModelLoaded={modelLoadHandler}
          />

          <Model
            name="miniCity"
            reportProgress
            rootUrl="model/"
            sceneFilename="miniCity.glb"
            scaleToDimension={1}
            position={new Vector3(0, 0.2, 3)}
            onModelLoaded={modelLoadHandler}
          />

          <Model
            name="house"
            reportProgress
            rootUrl="model/"
            sceneFilename="house.glb"
            scaleToDimension={1}
            position={new Vector3(0, 0, -2)}
            onModelLoaded={modelLoadHandler}
          />
        </Suspense>
      </SceneLoaderContextProvider>

      {isShow && (
        <adtFullscreenUi name="full=UI">
          <rectangle
            name="container"
            background="rgb(233, 255, 224)"
            thickness={0}
            cornerRadius={25}
            height="400px"
            width="300px"
            left="450px"
            alpha={1}
          >
            <stackPanel name="sp-container">
              <rectangle name="text-container" height="400px">
                <stackPanel
                  name="sp-header"
                  isVertical={false}
                  width="100%"
                  background="rgb(233, 255, 224)"
                >
                  <textBlock
                    name="description"
                    text="Winter is comming!"
                    color="black"
                    fontSize={28}
                    // fontStyle="bold"
                  />
                </stackPanel>
                <stackPanel
                  name="sp-footer"
                  paddingTop="330px"
                  paddingBottom="50px"
                >
                  <babylon-button
                    name="button"
                    width="250px"
                    height="50px"
                    background="rgb(255, 224, 224)"
                    cornerRadius={15}
                    onPointerClickObservable={moveToClickHandler}
                  >
                    <textBlock
                      name="text-button"
                      text="move to click"
                      // fontFamily="FontAwesome"
                      // fontStyle="bold"
                      fontSize={22}
                      color="black"
                    />
                  </babylon-button>
                </stackPanel>
              </rectangle>
            </stackPanel>
          </rectangle>
        </adtFullscreenUi>
      )}
    </>
  );
}

export default AnimationScenes;
