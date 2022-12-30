import { Link } from 'react-router-dom';
import './Header.scss';

export default function Header() {
  return(
    <nav className='Header'>
      <Link to="/">
        <img src='font.png'></img>
      </Link>
    </nav>
  )
}