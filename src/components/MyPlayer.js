import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import {
  //Button,
  //Switch,
  Typography,
  Grid,
  Slider,
  Box,
  IconButton,
  makeStyles
} from "@material-ui/core";
import {
  VolumeDown,
  VolumeUp,
  Pause,
  PlayArrow,
  Loop
} from "@material-ui/icons";
const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(0.5)
  }
}));
export default function MyPlayer({ url }) {
  const classes = useStyles();
  const player = useRef();
  const myCanvas = useRef();
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loop, setLoop] = useState(false);
  const [volume, setVolume] = useState(0.5);

  // eslint-disable-next-line no-unused-vars
  const loader = () => {
    const context = myCanvas.current.getContext("2d");
    const videoElem = player.current.getInternalPlayer();
    const inc = myCanvas.current.width / duration;
    context.fillStyle = "lightgray";
    context.fillRect(0, 0, myCanvas.current.width, myCanvas.current.height);
    context.fillStyle = "gray";
    for (let i = 0; i < videoElem.buffered.length; i++) {
      const startX = videoElem.buffered.start(i) * inc;
      const endX = videoElem.buffered.end(i) * inc;
      const width = endX - startX;
      context.fillRect(startX, 0, width, myCanvas.current.height);
      context.rect(startX, 0, width, myCanvas.current.height);
    }
  };

  useEffect(() => {
    if (url === "") {
      setDuration(0);
      setPlayed(0);
    }
  }, [url])

  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <Grid item>
        <IconButton
          className={classes.margin}
          size="small"
          onClick={() => setPlaying(!playing)}
        >
          {playing ? <Pause /> : <PlayArrow />}
        </IconButton>
        <IconButton
          className={classes.margin}
          size="small"
          onClick={() => setLoop(!loop)}
        >
          <Loop color={loop ? "inherit" : "disabled"} />
        </IconButton>
      </Grid>

      <Grid item xs>
        <Typography align="center">
          <Duration seconds={duration * played} /> / {format(duration)}
        </Typography>
      </Grid>
      <Grid
        container
        item
        xs={4}
        md={4}
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid item xs={2} align="center">
          <VolumeDown />
        </Grid>
        <Grid item xs={8}>
          <Slider
            value={volume}
            min={0}
            max={1}
            step={0.05}
            onChange={(e, newValue) => setVolume(newValue)}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={2} align="center">
          <VolumeUp />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <ReactPlayer
          ref={player}
          height={0}
          width={0}
          progressInterval={0}
          playing={playing}
          onProgress={e => {
            setPlayed(e.played);
            //loader();
          }}
          onDuration={duration => {
            setDuration(duration);
          }}
          //onBufferEnd={() => loader()}
          onEnded={() => setPlaying(false)}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          url={url}
          loop={loop}
          volume={volume}
          playbackRate={1}
        />
        <Box height="25px">
          <progress max={1} value={played} className="progress" />
          <canvas ref={myCanvas} className="my-canvas" />
          <input
            className="slider"
            id="myRange"
            type="range"
            min={0}
            max={1}
            step="any"
            value={played}
            onInput={e => {
              player.current.seekTo(parseFloat(e.target.value));
            }}
            readOnly
          />
        </Box>
      </Grid>
    </Grid>
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
