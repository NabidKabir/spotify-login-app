import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Container, Button, Card } from 'react-bootstrap';
import {useEffect, useState} from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000'
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
const RESPONSE_TYPE = 'token'

const scopes = ['user-read-currently-playing'];

var spotify = new SpotifyWebApi()


function App() {
  const [token, setToken] = useState('')
  const [currentTrack, setCurrentTrack] = useState([])


  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")


    if (!token && hash) {
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

        window.location.hash = ""
        window.localStorage.setItem("token", token)
    }

    setToken(token)
    spotify.setAccessToken(token)
    console.log(spotify.getAccessToken())
  }, [])

  const logout = () => {
    setToken('')
    window.localStorage.removeItem('token')
  }

  async function currentlyPlaying() {
    try {
      var params = {
        method: 'GET',
        headers: {

          'Authorization': 'Bearer ' + token
        }
      }

      var response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', params);

      if (!response.ok) {
        // Check if the response is not successful (HTTP status code outside the 200-299 range)
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data && data.item) {
        setCurrentTrack(data.item);
      } else {
        setCurrentTrack(null);
      }
    } catch (err) {
      console.log('Error fetching currently playing track:', err);
      setCurrentTrack(null);
    }
  }

  useEffect(() => {
    // Fetch the currently playing track when the token changes
    spotify.getUserPlaylists()
    .then(
      function(data){
        console.log('User playlists', data)
      },
      function(err){
        console.log(err)
      }
    )
    spotify.getMyCurrentPlayingTrack()
    .then(data => {console.log('Currently Playing', data)
      setCurrentTrack([data.item.album.images[0].url, data.item.artists[0].name, data.item.name])})
  }
  ,[])

  return (
    <div className="App">
      <Container className='d-flex align-items-center justify-content-center' style={{minHeight:'100vh'}}>
          {!token ?
          <Button 
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${scopes}`} 
            className='btn btn-success'>Login</Button>
          : 
          <Container>
          <Button 
            onClick={logout}
            className='btn btn-danger'>Logout</Button>
            <h1 className='mx-auto'>Here is what you are playing!</h1>
            <Card style={{ width: '25rem' }} className='mt-4 mx-auto'>
              <Card.Img src = {currentTrack[0]}/>
              <Card.Title>{'' + currentTrack[1] + ' - ' + currentTrack[2]}</Card.Title>
            </Card>
          </Container>
          }

      </Container>
    </div>
  );
}

export default App;
