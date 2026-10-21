import '../styles/Header.css';
import '../styles/GuideHeader.css';
import VLogo from '../assets/VLogo.png';

function GuideHeader({ currentUser, onLogout }) {
  const initials = (currentUser?.fullName || 'Guide')
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="app-header">
      <div className="header-shell gd-header-shell">
        <a className="brand-block" href="#home" aria-label="VentureVista home">
          <img src={VLogo} alt="VentureVista" className="header-logo" />
        </a>

        <nav className="main-nav gd-header-nav" aria-label="Guide navigation">
          <a href="#explore" className="nav-link">Explore</a>
          <a href="#my-trips" className="nav-link">My trips</a>
          <a href="#tour-guides" className="nav-link">Tour guides</a>
          <a href="#guide-dashboard" className="nav-link active" aria-current="page">
            Guide dashboard
          </a>
        </nav>

        <div className="header-actions gd-header-actions">
          <button className="gd-header__bell" type="button" aria-label="Notifications">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.7 21a2 2 0 0 1-3.4 0" />
            </svg>
          </button>
          <span className="gd-header__avatar" aria-label={currentUser?.fullName || 'Guide'}>{initials}</span>
          <button className="gd-header__logout" type="button" onClick={onLogout}>Log out</button>
        </div>
      </div>
    </header>
  );
}

export default GuideHeader;