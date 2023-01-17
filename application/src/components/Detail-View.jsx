import { Link } from 'react-router-dom';
import './Detail-View.scss';


export default function DetailView() {
  return (
    <nav className='DetailView'>
      <Link to="/">
        <p>Startseite</p>
        <img alt='Startseite' src='start.svg'></img>
      </Link>
      <Link to="/Impressum">
        <p>Impressum</p>
        <img alt='Impressum' src='impressum.svg'></img>
      </Link>
    </nav>
  )
}