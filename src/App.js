import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Container, Button } from 'react-bootstrap';

const clientID = process.env.REACT_APP_CLIENT_ID;
const clientSECRET = process.env.REACT_APP_CLIENT_SECRET;
const redirectURI = 'http://localhost:3000/callback'

const scopes = ['user-read-currently-playing'];

window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${encodeURIComponent(redirectURI)}&scope=${encodeURIComponent(scopes.join(' '))}&response_type=code`;





function App() {
  return (
    <div className="App">
      <Container className='d-flex align-items-center justify-content-center' style={{minHeight:'100vh'}}>
        <Button className='btn btn-success'>Login</Button>
      </Container>
    </div>
  );
}

export default App;
