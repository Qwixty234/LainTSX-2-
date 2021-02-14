import React, { useEffect, useState } from "react";
import { useStore } from "../../store";
import { a, useTrail } from "@react-spring/three";
import SiteBigLetter from "./SiteBigLetter";
import usePrevious from "../../hooks/usePrevious";
import { getNodeHud } from "../../utils/node-utils";
import sleep from "../../utils/sleep";

const MainYellowTextAnimator = (props: { visible?: boolean }) => {
  const activeNode = useStore((state) => state.activeNode);
  const subscene = useStore((state) => state.mainSubscene);
  const prevData = usePrevious({ subscene });

  const [text, setText] = useState(
    useStore.getState().activeNode.node_name.split("")
  );

  const [trail, set] = useTrail(text.length, () => ({
    posX: getNodeHud(useStore.getState().activeNode.matrixIndices!).big_text[0],
    posY: getNodeHud(useStore.getState().activeNode.matrixIndices!).big_text[1],
    config: { duration: 280 },
  }));

  useEffect(() => {
    (async () => {
      const hud = getNodeHud(activeNode.matrixIndices!);

      if (subscene === "level_selection") {
        await sleep(400);
        set({ posX: -0.02, posY: 0.005 });

        await sleep(600);
        setText("JumpTo".split(""));
      } else {
        await sleep(400);
        set({ posX: hud.big_text[0], posY: hud.big_text[1] });

        await sleep(600);
        setText(activeNode.node_name.split(""));
      }
    })();
  }, [activeNode, prevData?.subscene, set, subscene]);

  return (
    <a.group position-z={10} visible={props.visible}>
      {trail.map(({ posX, posY }, idx) => (
        <a.group
          key={idx}
          position-x={posX}
          position-y={posY}
          position-z={-8.7}
          scale={[0.04, 0.06, 0.04]}
        >
          <SiteBigLetter letter={text[idx]} letterIdx={idx} key={idx} />
        </a.group>
      ))}
    </a.group>
  );
};

export default MainYellowTextAnimator;