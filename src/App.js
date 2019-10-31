import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import './App.css';

function App() {
  const player = useRef();
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // Met à jour le titre du document via l’API du navigateur
    document.title = `PLAYER`;
  }, [played, duration]);
  //process.env.PUBLIC_URL + "/hit1.ogg"
  return (
    <div className="App">
      {format(duration * played)} / {format(duration)} reste -{format(duration * (1 - played))}<br />
      <Duration seconds={duration * played} />
      <ReactPlayer ref={player}
        progressInterval={50}
        playing={playing}
        onBuffer={() => console.log('onBuffer')}
        onSeek={e => console.log('onSeek', e)}
        onProgress={(e) => {
          //console.log('onProgress', e);
          if (!seeking) setPlayed(e.played);
        }}
        onDuration={(duration) => { setDuration(duration); }}
        url="https://filerun.gregoirejoncour.xyz/wl/?id=aUw8jvzQpPwkbGnggn0BHjhtN2niK0rW" />
      <input
        style={{ width: "100%", background: "black" }}
        type='range' min={0} max={1} step='any' value={played}
        onMouseDown={() => setSeeking(true)}
        onChange={(e) => {
          player.current.seekTo(parseFloat(e.target.value))
        }}
        onMouseUp={() => setSeeking(false)}
      />
      <button onClick={() => setPlaying(!playing)}>{playing ? "Pause" : "Play"}</button>
    </div>
  );
}

export function Duration({ className, seconds }) {
  return (
    <time dateTime={`P${Math.round(seconds)}S`} className={className}>
      {format(seconds)}
    </time>
  )
}

function format(seconds) {
  const date = new Date(seconds * 1000)
  const hh = date.getUTCHours()
  const mm = date.getUTCMinutes()
  const ss = pad(date.getUTCSeconds())
  const ms = pad(date.getMilliseconds())
  if (hh) {
    return `${hh}:${pad(mm)}:${ss}:${ms}`
  }
  return `${mm}:${ss}:${ms}`
}

function pad(string) {
  return ('0' + string).slice(-2)
}

export default App;
