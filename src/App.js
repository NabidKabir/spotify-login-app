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

  const getToken = () => {
    var urlParams = new URLSearchParams(window.location.hash.replace('#', '?'))
    return urlParams.get('access_token')
  }

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")


    if (!token && hash) {
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

        window.location.hash = ""
        window.localStorage.setItem("token", token)
    }

    setToken(token)
  }, [])

  const logout = () => {
    setToken('')
    window.localStorage.removeItem('token')
  }

  console.log(token)

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
