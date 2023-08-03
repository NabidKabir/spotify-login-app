import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Container, Button } from 'react-bootstrap';
import {useEffect, useState} from 'react';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000'
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
const RESPONSE_TYPE = 'token'

const scopes = ['user-read-currently-playing'];








function App() {
  const [token, setToken] = useState('')
  const [currentTrack, setCurrentTrack] = useState(null)

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")


    if (!token && hash) {
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

        window.location.hash = ""
        window.localStorage.setItem("token", token)
    }

    setToken(token)
    currentlyPlaying()
  }, [token])

  const logout = () => {
    setToken('')
    window.localStorage.removeItem('token')
  }

  async function currentlyPlaying(){
    var params = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }

    var currentPlay = await fetch('https://api.spotify.com/v1/me/player/currently-playing', params)
      .then(response => response.json())
      .then(data => {setCurrentTrack(data)})
  }


  return (
    <div className="App">
      <Container className='d-flex align-items-center justify-content-center' style={{minHeight:'100vh'}}>
          {!token ?
          <Button 
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${scopes}`} 
            className='btn btn-success'>Login</Button>
          : <Button 
            onClick={logout}
            className='btn btn-danger'>Logout</Button>}

      </Container>
    </div>
  );
}

export default App;
