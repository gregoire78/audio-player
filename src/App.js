import React from "react";
import MyPlayer from "./components/MyPlayer";
import { Container } from "@material-ui/core";
import "./App.css";

function App() {
  //process.env.PUBLIC_URL + "/hit1.ogg"
  return (
    <Container>
      <MyPlayer url="https://filerun.gregoirejoncour.xyz/wl/?id=PMJbNd9NTzEjmkxi1ZvXGYd8MXZEEYHk" />
      <MyPlayer url="https://filerun.gregoirejoncour.xyz/wl/?id=hktSHhIqd4igWJrtgFO5mpvhFKeBGXuw" />
      <MyPlayer url="https://filerun.gregoirejoncour.xyz/wl/?id=aUw8jvzQpPwkbGnggn0BHjhtN2niK0rW" />
      <MyPlayer url="https://filerun.gregoirejoncour.xyz/wl/?id=ep7rLbBMc4koG4Hv1SW6LJNMTklfqakA" />
      <MyPlayer url="https://filerun.gregoirejoncour.xyz/wl/?id=W4LTQwpgDPbwI1Cdp58dGau1FhYCGGSm&path=02%20-%20Episode%20I%20-%20Duel%20of%20The%20Fates.flac&download=1" />
      <MyPlayer url="https://filerun.gregoirejoncour.xyz/wl/?id=j2J5tCTAOAcJT3xfUYs50eq8FYxrNurf" />
      <MyPlayer url="https://filerun.gregoirejoncour.xyz/wl/?id=BteInMtpQB2wpgQmOeg7pa6PClQFXdgg" />
      <MyPlayer url="https://filerun.gregoirejoncour.xyz/wl/?id=6IIzfv1Iqf78CpXOrC2DzhyQNQUaBGx5" />
    </Container>
  );
}

export default App;
