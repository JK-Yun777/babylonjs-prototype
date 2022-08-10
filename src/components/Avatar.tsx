import { useState, useEffect, Suspense } from "react";

import {
  Engine,
  Scene,
  Model,
  SceneLoaderContextProvider,
} from "react-babylonjs";
import { Vector3, Color4, CannonJSPlugin } from "@babylonjs/core";
import "@babylonjs/loaders";

import "@babylonjs/core/Physics/physicsEngineComponent";
import * as CANNON from "cannon";

window.CANNON = CANNON;
const gravityVector = new Vector3(0, -9.81, 0);

function Avatar(props: any) {
  const [isShow, setIsShow] = useState(false);
  const [modelName, setModelName] = useState("");

  const onModelLoaded = (value: any) => {
    if (value) {
      setIsShow(true);
      setModelName(value.rootMesh.name);
    }
  };

  const closeDescriptionHandler = () => {
    setIsShow(false);
    props.onClick(false);
  };

  return (
    <>
      <Engine antialias adaptToDeviceRatio canvasId="modal-canvas">
        <Scene
          enablePhysics={[gravityVector, new CannonJSPlugin()]}
          clearColor={new Color4(0, 0, 0, 0.0000000000000001)}
        >
          <arcRotateCamera
            name="camera"
            target={new Vector3(0, 0.5, 0)}
            alpha={(4 * Math.PI) / 4}
            beta={-0.2 + Math.PI / 2}
            radius={1.5}
            angularSensibilityX={5000}
            angularSensibilityY={5000}
            wheelDeltaPercentage={0.01}
            minZ={0.001}
          />
          <hemisphericLight
            name="light1"
            intensity={1}
            direction={Vector3.Up()}
          />

          <SceneLoaderContextProvider>
            <Suspense fallback={null}>
              <Model
                name="Amy"
                reportProgress
                position={new Vector3(0, 0, 0)}
                rootUrl={"model/"}
                sceneFilename={"Amy.glb"}
                scaleToDimension={1}
                rotation={new Vector3(0, -1.6, 0)}
                onModelLoaded={onModelLoaded}
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
                        text={`Name: ${modelName}`}
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
                        onPointerClickObservable={closeDescriptionHandler}
                      >
                        <textBlock
                          name="text-button"
                          text="close"
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
        </Scene>
      </Engine>
    </>
  );
}

export default Avatar;
