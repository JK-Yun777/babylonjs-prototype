import { useEffect } from "react";
import { useHistory } from "react-router";
import * as GUI from "@babylonjs/gui";

function DescriptionBlock(props: any) {
  const history = useHistory();
  const path = props.path;
  const text = props.text;
  const fullScreenUI = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  useEffect(() => {
    let timer: any;
    if (props.isShow) {
      timer = setTimeout(() => createDescriptionBlock(text), 1000);
    }

    return () => {
      fullScreenUI.dispose();
      clearTimeout(timer);
    };
  }, [props]);

  function createDescriptionBlock(text: string) {
    const container = new GUI.Rectangle();
    container.left = "450px";
    container.cornerRadius = 25;
    container.width = "300px";
    container.height = "400px";
    container.thickness = 0;
    container.background = "rgb(233, 255, 224)";
    container.alpha = 1;
    // container.adaptWidthToChildren = true;
    // container.adaptHeightToChildren = true;
    fullScreenUI.addControl(container);

    const spContainer = new GUI.StackPanel();
    container.addControl(spContainer);

    const textContainer = new GUI.Rectangle();
    textContainer.height = "400px";
    spContainer.addControl(textContainer);

    const spHeader = new GUI.StackPanel();
    spHeader.width = "300px";
    spHeader.background = "rgb(233, 255, 224)";
    textContainer.addControl(spHeader);

    const description = new GUI.TextBlock();
    description.text = text;
    description.color = "black";
    description.fontSize = 28;
    description.resizeToFit = true;
    spHeader.addControl(description);

    //   description.onLinesReadyObservable.add(() => {
    //   const textHeight = description.fontOffset.height * description.lines.length;
    //   const ratioHeights = description.parent!.heightInPixels / textHeight;
    //   const textWidth = description.lines[0].width;
    //   const ratioWidths = description.parent!.widthInPixels / textWidth;
    //   if (ratioWidths < 1) {
    //     description.fontSize = parseFloat(description.fontSizeInPixels) * ratioWidths + "px";
    //   }
    // });

    const spFooter = new GUI.StackPanel();
    spFooter.paddingTop = "330px";
    spFooter.paddingBottom = "50px";
    textContainer.addControl(spFooter);

    const button = GUI.Button.CreateSimpleButton("button", "move to click");
    button.width = "250px";
    button.height = "50px";
    button.color = "white";
    button.background = "rgb(255, 224, 224)";
    button.cornerRadius = 15;
    spFooter.addControl(button);

    const moveToClickHandler = () => {
      history.push(path);
      // window.location.replace(path);
      fullScreenUI.dispose();
    };

    button.onPointerClickObservable.add(() => {
      moveToClickHandler();
    });
  }

  return null;
}

export default DescriptionBlock;
