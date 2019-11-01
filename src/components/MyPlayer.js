import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";

export default function MyPlayer({ url }) {
  const player = useRef();
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);

  let id;
  const playOnSeek = () => {
    if (!playing) {
      clearTimeout(id);
      if (!playing) setSeeking(true);
      id = setTimeout(() => {
        setSeeking(false);
      }, 125);
    }
  };

  return (
    <div>
      <Duration seconds={duration * played} /> / {format(duration)}
      <br />
      <ReactPlayer
        ref={player}
        height={0}
        progressInterval={0}
        playing={playing || seeking}
        //onBuffer={() => console.log("onBuffer")}
        //onSeek={e => console.log("onSeek", e)}
        onProgress={e => {
          //console.log('onProgress', e);
          setPlayed(e.played);
        }}
        onEnded={() => setPlaying(false)}
        onDuration={duration => {
          setDuration(duration);
        }}
        url={url}
      />
      <div>
        <input
          className="slider"
          id="myRange"
          type="range"
          min={0}
          max={1}
          step="any"
          value={played}
          onMouseDown={() => {
            //setSeeking(true);
          }}
          onInput={e => {
            player.current.seekTo(parseFloat(e.target.value));
            setPlayed(parseFloat(e.target.value));
            playOnSeek();
          }}
          onChange={() => {}}
          onMouseUp={() => {
            //setSeeking(false);
          }}
        />
        <progress max={1} value={played} className="progress" />
      </div>
      <button onClick={() => setPlaying(!playing)}>
        {playing ? "Pause" : "Play"}
      </button>
    </div>
  );
}

export function Duration({ className, seconds }) {
  return (
    <time dateTime={`P${Math.round(seconds)}S`} className={className}>
      {format(seconds)}
    </time>
  );
}

function format(seconds) {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = pad(date.getUTCSeconds());
  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`;
  }
  return `${mm}:${ss}`;
}

function pad(string) {
  return ("0" + string).slice(-2);
}
