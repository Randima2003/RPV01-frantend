import { useState } from 'react';
import '../styles/AddDate.css';

const starterActivities = [
    { id: 1, day: 0, time: '08:00', duration: '2 hours', title: "Little Adam's peak trail", desc: 'Meet Nuwan for a gentle ridge walk through tea fields. Take in the valley views before the midday warmth.', location: "Little Adam's Peak, Ella", tag: 'Free entry', cost: 0 },
    { id: 2, day: 0, time: '10:30', duration: '90 min', title: 'Tea estate tour & tasting', desc: 'Follow the journey from leaf to cup, explore the tea-making process and enjoy a guided tasting of local blends.', location: 'Tea estate, Ella', tag: '2 travelers', cost: 2000 },
    { id: 3, day: 0, time: '14:30', duration: '90 min', title: 'Local craft workshop', desc: 'Slow down with a hands-on session led by a local maker. Create a small keepsake inspired by the hill country.', location: 'Ella town', tag: '2 travelers', cost: 1000 },
];

const initialExpenses = [
  { name: 'Tour guide', detail: '1 day × LKR 12,000', amount: 12000, icon: '👤' },
  // { name: 'Hotel', detail: '2 nights × LKR 9,000', amount: 18000, icon: '🏨' },
  // { name: 'Travel vehicle', detail: '3 days × LKR 3,000', amount: 9000, icon: '🚗' },
  { name: 'Activities', detail: '3,000 + 2,000 + 1,000', amount: 6000, icon: '⛰️' },
  // { name: 'Meals', detail: '3 days × LKR 2,000', amount: 6000, icon: '🍽️' },
];

function AddDate({ tripDetails = {}, onBack, onHome, onContinue, onSaveTrip }) {
  const [activeDay, setActiveDay] = useState(0);
  const [activities, setActivities] = useState(starterActivities);
  const [budget, setBudget] = useState(60000);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const destination = tripDetails.destination?.trim() || 'Ella';
  const tripDateRange = [tripDetails.startDate, tripDetails.endDate]
    .filter(Boolean)
    .map((date) => new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(`${date}T00:00:00`)))
    .join(' – ');
  const [saveMessage, setSaveMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const days = [
    { label: 'Day 1 · GUIDED', date: 'Thu, Nov 12', cost: 'LKR 3,000 activities' },
    { label: 'Day 2 · SELF-GUIDED', date: 'Fri, Nov 13', cost: 'LKR 2,000 activities' },
    { label: 'Day 3 · SELF-GUIDED', date: 'Sat, Nov 14', cost: 'LKR 1,000 activities' },
  ];

  const currentDayActivities = activities.filter((act) => act.day === activeDay);
  const daySubtotal = currentDayActivities.reduce((sum, act) => sum + act.cost, 0);

  const addActivity = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setActivities((current) => [...current, {
      id: Date.now(),
      day: activeDay,
      time: formData.get('time'),
      duration: formData.get('duration'),
      title: formData.get('title').trim(),
      desc: formData.get('description').trim(),
      location: formData.get('location').trim() || destination,
      tag: 'Personal plan',
      cost: Number(formData.get('cost')) || 0,
    }]);
    setShowActivityForm(false);
  };

  const saveTrip = async () => {
    if (!onSaveTrip) return true;
    setIsSaving(true);
    setSaveMessage('');
    try {
      await onSaveTrip({
        destination,
        startDate: tripDetails.startDate || null,
        endDate: tripDetails.endDate || null,
        visibility: tripDetails.visibility || 'friends',
        budget,
        activities,
      });
      setSaveMessage('Trip saved');
      return true;
    } catch (error) {
      setSaveMessage(error.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const continueToGuides = async () => {
    if (await saveTrip()) onContinue();
  };

  
  const totalEstimatedCost = initialExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const budgetUsedPercent = Math.min(Math.round((totalEstimatedCost / budget) * 100), 100);
  const roomToSpare = budget - totalEstimatedCost;

  return (
    <section className="itinerary-page">
      <button type="button" className="itinerary-btn-quiet" onClick={onBack}>← Back to trip details</button>
      <header className="itinerary-trip-header">
        <div className="itinerary-header-left">
          <h1>Your {destination} escape, thoughtfully planned.</h1>
          <p className="itinerary-trip-header__meta">
            <span>📍 {destination}</span>
            <span>📅 {tripDateRange || 'Choose your travel dates'}</span>
          </p>
          {saveMessage && <p className="itinerary-save-message" role="status">{saveMessage}</p>}
        </div>
        <button type="button" className="itinerary-button itinerary-button--primary" onClick={saveTrip} disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save trip'}
        </button>
        <img
          className="itinerary-trip-header__image"
          src="https://d1ynolcus8dvgv.cloudfront.net/2019/01/nine-arch-2-5.jpg"
          alt="Ella train landscape"
        />
      </header>

    
      <div className="itinerary-layout">
    
        <section className="itinerary-schedule">
          <div className="itinerary-section-heading">
            <div>
              <h2>Day-by-Day Activity Planner</h2>
            </div>
            <button type="button" className="itinerary-button itinerary-button--primary" onClick={() => setShowActivityForm((visible) => !visible)}>
              {showActivityForm ? 'Cancel activity' : '+ Add Activity'}
            </button>
          </div>

        
          <div className="itinerary-day-tabs">
            {days.map((day, index) => (
              <button
                key={index}
                className={`itinerary-day-tab ${activeDay === index ? 'is-active' : ''}`}
                onClick={() => setActiveDay(index)}
              >
                <span className="itinerary-day-label">{day.label}</span>
                <strong className="itinerary-day-date">{day.date}</strong>
                <small className="itinerary-day-cost">{day.cost}</small>
              </button>
            ))}
          </div>

          <div className="itinerary-section-subheading">
            <div>
              <h3>Trails, tea & local stories</h3>
              <p className="itinerary-subtext">Thursday, November 12 · 3 activities · With Nuwan</p>
            </div>
            <span className="itinerary-day-tag">DAY 1 OF 3</span>
          </div>

          <button type="button" className="itinerary-add-day-btn" onClick={() => setShowActivityForm(true)}>
            + Add Activity to Day {activeDay + 1}
          </button>

          {showActivityForm && (
            <form className="itinerary-add-activity-form" onSubmit={addActivity}>
              <label>Activity<input name="title" maxLength="100" placeholder="Activity name" required /></label>
              <label>Time<input name="time" type="time" defaultValue="16:00" required /></label>
              <label>Duration<input name="duration" placeholder="1 hour" maxLength="30" required /></label>
              <label>Estimated cost (LKR)<input name="cost" type="number" min="0" step="100" defaultValue="0" /></label>
              <label className="itinerary-add-activity-form__wide">Location<input name="location" placeholder={destination} maxLength="150" /></label>
              <label className="itinerary-add-activity-form__wide">Notes<textarea name="description" rows="2" maxLength="300" placeholder="What would you like to do?" /></label>
              <div className="itinerary-add-activity-form__actions">
                <button type="button" className="itinerary-btn-quiet" onClick={() => setShowActivityForm(false)}>Cancel</button>
                <button type="submit" className="itinerary-btn-primary">Add activity</button>
              </div>
            </form>
          )}

        
          <div className="itinerary-activity-list">
            {currentDayActivities.map((act) => (
              <article key={act.id} className="itinerary-activity-card">
                <div className="itinerary-activity-time">
                  <strong>{act.time}</strong>
                  <span>{act.duration}</span>
                </div>
                <div className="itinerary-activity-body">
                  <div className="itinerary-activity-title-row">
                    <h4>{act.title}</h4>
                    <button className="itinerary-more-btn">•••</button>
                  </div>
                  <p className="itinerary-activity-desc">{act.desc}</p>
                  <div className="itinerary-activity-footer">
                    <span className="itinerary-location">📍 {act.location}</span>
                    <div className="itinerary-cost-tag">
                      <strong>LKR {act.cost.toLocaleString()}</strong>
                      {act.tag && <span>{act.tag}</span>}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

        
          <div className="itinerary-day-subtotal-box">
            <div>
              <strong>Day {activeDay + 1} activity subtotal</strong>
              <p>For both travelers · Guide, stay, vehicle and meals are budgeted separately.</p>
            </div>
            <span className="itinerary-subtotal-amount">LKR {daySubtotal.toLocaleString()}</span>
          </div>
        </section>

        
        <aside className="itinerary-budget-sidebar">
          <div className="itinerary-budget-card">
            <div className="itinerary-budget-header">
              <h3>Live Budget Calculator</h3>
            </div>

            <div className="itinerary-budget-input-group">
              <label>Your trip budget <small>LKR - Sri Lankan rupee</small></label>
              <div className="itinerary-budget-field">
                <span>LKR</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                />
                
                <button className="btn-step" onClick={() => setBudget(b => Math.max(0, b - 5000))}>-</button>
                <button className="btn-step" onClick={() => setBudget(b => b + 5000)}>+</button>
              </div>
            </div>

            <div className="itinerary-budget-progress-block">
              <div className="itinerary-progress-text">
                <span>Budget used</span>
                <strong>{budgetUsedPercent}%</strong>
              </div>
              <div className="itinerary-progress-bar">
                <div className="itinerary-progress-fill" style={{ width: `${budgetUsedPercent}%` }}></div>
              </div>
              <div className="itinerary-spare-text">
                <span>Room to spare</span>
                <strong>LKR {roomToSpare.toLocaleString()}</strong>
              </div>
            </div>

            
            <div className="itinerary-expenses-list">
              <h5>ESTIMATED EXPENSES <span>LKR</span></h5>
              {initialExpenses.map((exp, i) => (
                <div key={i} className="itinerary-expense-row">
                  <span className="exp-icon">{exp.icon}</span>
                  <div className="exp-info">
                    <strong>{exp.name}</strong>
                    <small>{exp.detail}</small>
                  </div>
                  <strong className="exp-amount">{exp.amount.toLocaleString()}</strong>
                </div>
              ))}
            </div>

            
            <div className="itinerary-total-footer-card">
              <div className="total-top">
                <span>Total estimated cost</span>
                <strong>LKR {totalEstimatedCost.toLocaleString()}</strong>
              </div>
              <div className="total-bottom">
                <small>For both travelers - Entire trip</small>
                <small>LKR {(totalEstimatedCost / 2).toLocaleString()} / person</small>
              </div>
            </div>
          </div>
        </aside>
      </div>

      
      <footer className="itinerary-bottom-bar">
        <button type="button" className="itinerary-btn-quiet" onClick={onHome}>
          ← Back to Home Page
        </button>
        <button type="button" className="itinerary-btn-primary" onClick={continueToGuides} disabled={isSaving}>
          Continue / Find the Guides →
        </button>
      </footer>
    </section>
  );
}

export default AddDate;