import React, { useState, useEffect } from "react";
import axios from 'axios';
import qs from 'query-string';
import MyPlayer from "./components/MyPlayer";
import Auth from "./components/Auth";
import { Container, Grid, Typography, List, ListItem, ListItemIcon, ListItemText, TextField } from "@material-ui/core";
import FolderIcon from '@material-ui/icons/Folder';
import Audiotrack from '@material-ui/icons/Audiotrack';
import "./App.css";

// Add a request interceptor
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('tokens');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + JSON.parse(token).access_token;
    }
    return config;
  },
  error => {
    Promise.reject(error)
  }
);

axios.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    const originalRequest = error.config;
    const tokens = JSON.parse(localStorage.getItem('tokens'));
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const res = await (await axios.post(`${process.env.REACT_APP_API}/oauth2/token/`,
        qs.stringify({
          grant_type: "refresh_token",
          client_id: process.env.REACT_APP_CLIENT_ID,
          client_secret: process.env.REACT_APP_CLIENT_SECRET,
          refresh_token: tokens.refresh_token
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }))).data;
      localStorage.setItem('tokens', JSON.stringify(res))
      //if (res.status === 201) {
      // 1) put token to LocalStorage

      // 2) Change Authorization header
      //axios.defaults.headers.common['Authorization'] = 'Bearer ' + tokens.access_token;
      // 3) return originalRequest object with Axios.
      return axios(originalRequest);
      //}
    }
    // return Error object with Promise
    return Promise.reject(error);
  }
);


function App() {
  const [url, setUrl] = useState("");
  const [metadata, setMetadata] = useState("");
  const [thumbnail, setThumbnail] = useState("https://via.placeholder.com/100");
  const [urlData, setUrlData] = useState("");
  const [files, setFiles] = useState();
  const [folder, setFolder] = useState("/ROOT/HOME/Music");
  const [loader, setLoader] = useState();
  //process.env.PUBLIC_URL + "/hit1.ogg"
  const fetchAudio = async (path) => {
    const blob = (await axios.get(`${process.env.REACT_APP_API}/api.php/files/download?path=${encodeURIComponent(path)}`, {
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
        if (totalLength !== null) {
          setLoader(Math.round((progressEvent.loaded * 100) / totalLength));
        }
      }
    })).data;
    return URL.createObjectURL(blob);
  }
  const getMetadata = async (path) => {
    return (await axios.get(`${process.env.REACT_APP_API}/api.php/files/metadata?path=${encodeURIComponent(path)}`)).data;
  }
  const getThumbnail = async (path) => {
    const blob = (await axios.get(`${process.env.REACT_APP_API}/api.php/files/thumbnail?path=${encodeURIComponent(path)}`, {
      responseType: 'blob'
    })).data;
    return URL.createObjectURL(blob);
  }
  const browse = async (path) => {
    return (await axios.get(`${process.env.REACT_APP_API}/api.php/files/browse?path=${encodeURIComponent(path)}`)).data.data;
  }

  useEffect(() => {
    if (urlData) {
      setUrl("");
      fetchAudio(urlData).then(data => {
        setUrl(data);
        setLoader();
      });
      getThumbnail(urlData).then(data => setThumbnail(data));
      getMetadata(urlData).then(data => setMetadata(data));
    }
  }, [urlData])
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Auth />
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={(e) => {
            e.preventDefault();
            browse(folder).then(data => setFiles(data))
          }} noValidate autoComplete="off">
            <TextField
              id="standard-full-width"
              label="path"
              margin="normal"
              fullWidth
              value={folder} onChange={(e) => setFolder(e.target.value)}
            />
          </form>
        </Grid>
        <Grid item xs={1}>
          <img src={thumbnail} alt="test" className="cover" />
        </Grid>
        <Grid item xs={11}>
          <MyPlayer url={url} />
          <Typography variant="body1">{metadata && metadata.data.fieldsets[0] && metadata.data.fieldsets[0].fields[1] && metadata.data.fieldsets[0].fields[1].values}{loader && ' - ' + loader + '%'}</Typography>
        </Grid>
        {files &&
          <Grid item xs={12}>
            <Typography variant="h6">
              List
            </Typography>
            <List dense>
              <ListItem button onClick={() => { setFolder(files.meta.parentPath); browse(files.meta.parentPath).then(data => setFiles(data)) }}>
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText
                  primary={files.meta.parentPath}
                />
              </ListItem>
              {files.files.map((file, i) => {
                if (!file.is_dir) {
                  return <ListItem key={i} button onClick={() => setUrlData(files.meta.path + "/" + file.filename)}>
                    <ListItemIcon>
                      <Audiotrack />
                    </ListItemIcon>
                    <ListItemText
                      primary={file.filename}
                    />
                  </ListItem>
                } else {
                  return <ListItem key={i} button onClick={(e) => { e.preventDefault(); setFolder(files.meta.path + "/" + file.filename); browse(files.meta.path + "/" + file.filename).then(data => setFiles(data)) }}>
                    <ListItemIcon>
                      <FolderIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={file.filename}
                    />
                  </ListItem>
                }
              })}
            </List>
          </Grid>}
      </Grid>
    </Container>
  );
}

/*async function fetchAudio(path) {
  return fetch(`https://filerun.gregoirejoncour.xyz/api.php/files/download?path=${path}`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer CtjxfqCjTyNC3lVJPy80AjC3BfK12SjEosfc8Pqh'
    }
  })
    .then(response => response.blob())
    .then(blob => URL.createObjectURL(blob))
  //.then(res => blobToDataURL(res))
}*/

/*function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    let base64
    var a = new FileReader()
    a.readAsDataURL(blob)
    a.onload = function (e) {
      base64 = e.target.result
      resolve(base64)
    }
  })
}*/
export default App;
