import { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Home from './pages/Home';
import TravelHome from './pages/travel-Home';
import AddDate from './pages/Add-date';
import GuideSelect from './pages/guide-select';
import TravelerDashboard from './pages/TravelerDashboard';
import GuideDashboard from './pages/GuideDashboard';
import Permission from './pages/Permission';
import { createBooking, createTrip, getCurrentUser, logout, updateTrip } from './api/auth';
import './styles/App.css';
const featureCards = [
 {
   number: '01',
   category: 'SIGNATURE FEATURE',
   title: 'Hidden Local Gems',
   text: 'Find lesser-known places, local favorites and tips shared by people who know the area.',
   button: 'Explore local discoveries',
   image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85',
   action: 'planning',
 },
 {
   number: '02',
   category: 'LOCAL CONNECTIONS',
   title: 'Meet Your Local Experts',
   text: 'Discover local guides and people offering transport, stays, food and unique experiences.',
   button: 'Find local services',
   image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=85',
   action: 'planning',
 },
 {
   number: '03',
   category: 'PERSONALIZED JOURNEYS',
   title: 'Your Journey, Brought Together',
   text: 'Share your destinations, dates, group size and budget to shape a day-by-day travel plan.',
   button: 'Shape your journey',
   image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85',
   action: 'planning',
 },
 {
   number: '04',
   category: 'SMARTER PLANNING',
   title: 'Know the Cost Before You Go',
   text: 'Explore estimated costs for transport, stays, food and activities to plan within your budget.',
   button: 'Explore trip costs',
   image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=900&q=85',
   action: 'planning',
 },
 {
   number: '05',
   category: 'TRAVEL WITH CONFIDENCE',
   title: 'Permissions, Made Easier',
   text: 'Get help identifying required permits, preparing documents and completing applications for your journey.',
   button: 'Get permit assistance',
   image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=900&q=85',
   action: 'permissions',
 },
 {
   number: '06',
   category: 'INSIDER KNOWLEDGE',
   title: 'The Local Lowdown',
   text: 'Get destination-specific warnings, access conditions, local advice and practical tips before setting off.',
   button: 'Check before you go',
   image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=85',
   action: 'planning',
 },
];
;
const adventures = [
  { title: 'Sigiriya sunrise', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsMhsuEB_mpPtDszSbu4H-RVuGIXh3JkvaMkFQdizkAQ&s=10' },
  { title: 'Kandy culture', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR72h8mpsUmRITVruu60U8iIL5ZOtr2-9sqlp3k9pqeZQ&s=10' },
  { title: 'Ella highlands', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwvJjSEl6y4XNHWoFIycLQYmTr7H0wZpDj_5K-gZ4qGg&s=10' },
  { title: 'Southern coast', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReGuQdUPlcHfGozoYYi27akjfwD4wicql4otwjhlvCBw&s=10' },
];

function LandingView({ onStartPlanning, onOpenPermissions }) {
 return (
   <>
     <main className="home-page" id="home">
       <section className="hero-section">
         <h1>One app for all your travel planning needs</h1>
         <p>
           Create detailed itineraries, explore user-shared guides, and manage your bookings seamlessly — all in one place.
         </p>
         <button className="primary-button" onClick={onStartPlanning}>Start planning</button>
       </section>




       <section className="feature-section" id="features">


         <div className="feature-grid">
           {featureCards.map((card) => (
             <article key={card.number} className="feature-card">
               <div className="feature-image">
                 <img src={card.image} alt={card.title} loading="lazy" />
                 <span className="feature-number">{card.number}</span>
                 <span className="feature-icon">{card.icon}</span>
               </div>


               <div className="feature-card-content">
                 <span className="feature-category">{card.category}</span>
                 <h3>{card.title}</h3>
                 <p>{card.text}</p>


                 <button
                   type="button"
                   className="feature-link"
                   onClick={
                     card.action === 'permissions'
                       ? onOpenPermissions
                       : onStartPlanning
                   }
                 >
                   {card. button}
                   <span aria-hidden="true"> →</span>
                 </button>
               </div>
             </article>
           ))}
         </div>


         <button className="secondary-button" onClick={onStartPlanning}>
           Start planning your trip
         </button>
       </section>




       <section className="adventure-section" id="hotels">
         <h2>Find your next adventure</h2>
         <div className="adventure-grid">
           {adventures.map((item) => (
             <article key={item.title} className="adventure-card">
               <img src={item.image} alt={item.title} />
               <div className="adventure-copy">
                 <h3>{item.title}</h3>
                 <button type="button">Explore</button>
               </div>
             </article>
           ))}
         </div>
       </section>
     </main>


   </>
 );
}

function App() {
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [activePage, setActivePage] = useState('landing');
  const [selectedRole, setSelectedRole] = useState(null);
  const [tripDetails, setTripDetails] = useState({});
  const [pendingTrip, setPendingTrip] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [authMessage, setAuthMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    getCurrentUser()
      .then(({ user, status, success, message }) => {
        if (!isMounted) return;
        if (!user) {
          if (success === false && status !== 401) {
            setAuthMessage(message || 'Could not restore your session. Please try again.');
          }
          return;
        }
        setCurrentUser(user);
        setActivePage(user.role === 'guide' ? 'guide-dashboard' : 'dashboard');
      })
      .catch((error) => {
        if (isMounted) setAuthMessage(error.message || 'Could not restore your session. Please try again.');
      });
    return () => { isMounted = false; };
  }, []);

  const handleStartPlanning = () => {
    setActivePage('planner');
  };

  const tripPayload = (details) => ({
    destination: details.destination,
    startDate: details.startDate || null,
    endDate: details.endDate || null,
    visibility: details.visibility || 'friends',
    budget: Number(details.budget) || 60000,
    activities: details.activities || [],
  });

  const handleStartTrip = async (details) => {
    if (!currentUser) {
      setTripDetails({
        ...details,
        destination: details.destination.trim(),
        startDate: details.startDate || null,
        endDate: details.endDate || null,
        visibility: details.visibility || 'friends',
      });
      setAuthMessage('');
      setActivePage('itinerary');
      return;
    }
    if (currentUser.role !== 'traveler') {
      setAuthMessage('Only traveler accounts can create trips.');
      return;
    }

    try {
      const { trip } = await createTrip(tripPayload(details));
      setTripDetails({ ...details, ...trip });
      setAuthMessage('');
      setActivePage('itinerary');
    } catch (error) {
      setAuthMessage(error.message);
    }
  };

  const handleSaveTrip = async (details) => {
    if (!tripDetails.id && !currentUser) {
      setPendingTrip(details);
      setAuthMessage('Log in as a traveler to save your trip.');
      setActivePage('login');
      throw new Error('Log in as a traveler to save your trip.');
    }
    if (!tripDetails.id) throw new Error('Start a trip before saving the itinerary.');
    const { trip } = await updateTrip(tripDetails.id, tripPayload(details));
    setTripDetails((current) => ({ ...current, ...trip }));
    return trip;
  };

 const handleRequestGuide = async (guide) => {
  if (isCreatingBooking) {
    throw new Error('Your booking request is already being sent. Please wait.');
  }

  if (!currentUser || currentUser.role !== 'traveler') {
    throw new Error('Please log in with a traveler account to request a guide.');
  }

  if (!tripDetails.id || !guide?.id) {
    throw new Error(
      'Save your trip and choose a registered guide to send a request.'
    );
  }

  setIsCreatingBooking(true);

  try {
    const booking = await createBooking(tripDetails.id, {
      guideId: guide.id,
      offeredBudget: guide.price || 0,
      message: `Please guide me in ${tripDetails.destination}.`,
    });

    return booking;
  } finally {
    setIsCreatingBooking(false);
  }
};

  const handleFindGuides = () => {
    setActivePage('guides');
  };

  const handleAuthClick = () => {
    setAuthMessage('');
    setActivePage('login');
  };

  const navigateToLandingSection = (sectionId) => {
    setActivePage('landing');
    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  const handleLoginSuccess = async () => {
    const { user } = await getCurrentUser();
    if (!user) throw new Error('Sign in succeeded, but the account could not be loaded. Please try again.');
    setCurrentUser(user);
    setAuthMessage('');
    if (pendingTrip) {
      if (user.role !== 'traveler') {
        setAuthMessage('Sign in with a traveler account to save your trip.');
        setActivePage('guide-dashboard');
        return;
      }
      const { trip } = await createTrip(tripPayload(pendingTrip));
      setTripDetails({ ...pendingTrip, ...trip });
      setPendingTrip(null);
      setActivePage('itinerary');
      return;
    }
    setActivePage(user.role === 'guide' ? 'guide-dashboard' : 'dashboard');
  };

  const handleDashboardNavigation = () => {
    if (!currentUser) {
      setAuthMessage('Log in to view your dashboard.');
      setActivePage('login');
      return;
    }

    setAuthMessage('');
    setActivePage(currentUser.role === 'guide' ? 'guide-dashboard' : 'dashboard');
  };

  const handleGuideDashboardNavigation = () => {
    if (currentUser?.role !== 'guide') {
      setAuthMessage(currentUser
        ? 'The guide dashboard is only available to guide accounts.'
        : 'Log in with a guide account to open the guide dashboard.');
      setActivePage(currentUser ? 'dashboard' : 'login');
      return;
    }

    setAuthMessage('');
    setActivePage('guide-dashboard');
  };

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response?.success === false) {
        throw new Error(response.message || 'Could not log out. Please try again.');
      }
      setAuthMessage('');
      setCurrentUser(null);
      setActivePage('landing');
    } catch (error) {
      setAuthMessage(error.message);
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setActivePage('registration');
  };

  const handleBackToLogin = () => {
    setActivePage('login');
    setSelectedRole(null);
  };

  return (
    <div className="app-main">
      <Header
        onAuthClick={handleAuthClick}
        onHomeClick={() => navigateToLandingSection('home')}
        onHotelsClick={() => navigateToLandingSection('hotels')}
        currentUser={currentUser}
        onLogout={handleLogout}
        authMessage={authMessage}
        onDashboardClick={handleDashboardNavigation}
        isDashboard={activePage === 'dashboard'}
        onGuideDashboardClick={handleGuideDashboardNavigation}
        isGuideDashboard={activePage === 'guide-dashboard'}
        onPermissionClick={() => setActivePage('permission')}
        isPermission={activePage === 'permission'}
      />
      <main className="content-body">
        {activePage === 'landing' && (
          <LandingView onStartPlanning={handleStartPlanning} />
        )}
        {activePage === 'login' && <Login onRoleSelect={handleRoleSelect} onLoginSuccess={handleLoginSuccess} />}
        {activePage === 'registration' && <Home role={selectedRole} onBack={handleBackToLogin} />}
        {activePage === 'planner' && <TravelHome onStartTrip={handleStartTrip} />}
        {activePage === 'itinerary' && (
          <AddDate
            tripDetails={tripDetails}
            onBack={() => setActivePage('planner')}
            onHome={() => setActivePage('landing')}
            onContinue={handleFindGuides}
            onSaveTrip={handleSaveTrip}
          />
        )}
        {activePage === 'guides' && (
          <GuideSelect tripDetails={tripDetails} onBack={() => setActivePage('itinerary')} onRequestGuide={handleRequestGuide} />
        )}
        {activePage === 'dashboard' && (
          <TravelerDashboard currentUser={currentUser} onPlanTrip={() => setActivePage('planner')} />
        )}
        {activePage === 'guide-dashboard' && <GuideDashboard currentUser={currentUser} />}
        {activePage === 'permission' && (
          <Permission onCancel={() => setActivePage('landing')} />
        )}
      </main>
      {activePage === 'landing' && <Footer />}
    </div>
  );
}

export default App;
