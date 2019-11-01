import React from "react";
import MyPlayer from "./components/MyPlayer";
import "./App.css";

function App() {
  //process.env.PUBLIC_URL + "/hit1.ogg"
  return (
    <div className="App">
      <MyPlayer url="https://filerun.gregoirejoncour.xyz/wl/?id=PMJbNd9NTzEjmkxi1ZvXGYd8MXZEEYHk" />
      <MyPlayer url="https://filerun.gregoirejoncour.xyz/wl/?id=hktSHhIqd4igWJrtgFO5mpvhFKeBGXuw" />
      <MyPlayer url="https://filerun.gregoirejoncour.xyz/wl/?id=aUw8jvzQpPwkbGnggn0BHjhtN2niK0rW" />
    </div>
  );
}

export default App;
