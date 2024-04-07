
import './NavBar.css';
import nav_logo from '../../assets/nav-logo.svg';
import nav_profile from '../../assets/nav-profile.svg';

function NavBar() {
  return (
    <div className="navbar">
      <img src={nav_logo} alt="" className="nav-logo" />
      <img src={nav_profile}  className='nav-profile' alt="" />
    </div>
  )
}

export default NavBar