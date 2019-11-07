import React, { useRef, useEffect } from "react";

export default function Bufferr() {
  const myAudio = useRef();
  const myCanvas = useRef();
  useEffect(() => {
    const context = myCanvas.current.getContext("2d");
    context.fillStyle = "lightgray";
    context.fillRect(0, 0, myCanvas.current.width, myCanvas.current.height);
    context.fillStyle = "red";
    //context.strokeStyle = "white";
  });

  onseeked = () => {
    const context = myCanvas.current.getContext("2d");
    context.fillStyle = "lightgray";
    context.fillRect(0, 0, myCanvas.current.width, myCanvas.current.height);
    context.fillStyle = "red";
    const inc = myCanvas.current.width / myAudio.current.duration;
    for (let i = 0; i < myAudio.current.buffered.length; i++) {
      const startX = myAudio.current.buffered.start(i) * inc;
      const endX = myAudio.current.buffered.end(i) * inc;
      const width = endX - startX;
      //console.log(myAudio.current.buffered.start(i) * inc);
      context.fillRect(startX, 0, width, myCanvas.current.height);
      context.rect(startX, 0, width, myCanvas.current.height);
      //context.stroke();
    }
  };

  return (
    <div>
      <p>
        <audio
          ref={myAudio}
          id="my-audio"
          preload="metadata"
          onSeeked={() => onseeked()}
          onPlay={() => onseeked()}
          onProgress={() => onseeked()}
          controls
          src={
            "https://filerun.gregoirejoncour.xyz/wl/?id=W4LTQwpgDPbwI1Cdp58dGau1FhYCGGSm&path=02%20-%20Episode%20I%20-%20Duel%20of%20The%20Fates.flac&download=1"
          }
        />
      </p>
      <p>
        <canvas ref={myCanvas} id="my-canvas" width="300" height="20" />
      </p>
    </div>
  );
}
