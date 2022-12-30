import { Link } from 'react-router-dom';
import './Footer.scss';


export default function Footer() {
  return (
    <div className='Footer'>
      <p>© Malcolm Fuchs & Aleksandar Ilic</p>
      <span></span>
      <Link to="/Impressum">Impressum</Link>
    </div>
  )
}