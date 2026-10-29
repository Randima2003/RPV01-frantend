
import { useEffect, useMemo, useState } from 'react';
import { getGuides } from '../api/auth';
import '../styles/GuideSelect.css';

const formatMoney = (amount) =>
  `LKR ${Number(amount || 0).toLocaleString('en-LK')}`;

function GuideProfileDialog({
  guide,
  onClose,
  onRequest,
  requestingGuideId,
}) {
  if (!guide) return null;

  const isRequesting = requestingGuideId !== null;

  return (
    <div
      className="guide-dialog-backdrop"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isRequesting
        ) {
          onClose();
        }
      }}
    >
      <section
        className="guide-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-dialog-title"
      >
        <button
          className="guide-dialog__close"
          type="button"
          onClick={onClose}
          disabled={isRequesting}
          aria-label="Close guide profile"
        >
          ×
        </button>

        <img src={guide.image} alt={guide.name} />

        <div className="guide-dialog__content">
          <p className="guide-eyebrow">
            Local guide · {guide.location}
          </p>

          <h2 id="guide-dialog-title">{guide.name}</h2>

          <p className="guide-card__specialty">
            {guide.specialty}
          </p>

          <p>{guide.description}</p>

          <div className="guide-dialog__footer">
            <strong>
              {formatMoney(guide.price)} <span>/ day</span>
            </strong>

            <button
              type="button"
              className="guide-button guide-button--primary"
              onClick={() => onRequest(guide)}
              disabled={isRequesting}
            >
              {requestingGuideId === guide.id
                ? 'Sending…'
                : 'Request guide'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function GuideSelect({
  tripDetails = {},
  onBack,
  onRequestGuide,
}) {
  const [guides, setGuides] = useState([]);
  const [query] = useState('');
  const [specialty] = useState('all');
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [notice, setNotice] = useState('');
  const [noticeType, setNoticeType] = useState('info');
  const [isLoadingGuides, setIsLoadingGuides] = useState(true);
  const [guideLoadError, setGuideLoadError] = useState('');
  const [requestingGuideId, setRequestingGuideId] = useState(null);

  const destination = tripDetails.destination?.trim() || 'Ella';

  useEffect(() => {
    let isMounted = true;

    getGuides()
      .then(({ guides: registeredGuides, message }) => {
        if (!isMounted) return;

        if (!Array.isArray(registeredGuides)) {
          setGuideLoadError(
            message || 'Could not load local guides.'
          );
          return;
        }

        setGuides(registeredGuides);
      })
      .catch((error) => {
        if (isMounted) {
          setGuideLoadError(
            error.message || 'Could not load local guides.'
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingGuides(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleGuides = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return guides.filter((guide) => {
      const languages = Array.isArray(guide.languages)
        ? guide.languages
        : [];

      const searchableText = [
        guide.name || '',
        guide.location || '',
        guide.specialty || '',
        guide.description || '',
        ...languages,
      ]
        .join(' ')
        .toLowerCase();

      const matchesQuery =
        searchableText.includes(normalizedQuery);

      const matchesSpecialty =
        specialty === 'all' ||
        guide.specialty === specialty;

      return matchesQuery && matchesSpecialty;
    });
  }, [guides, query, specialty]);

  const requestGuide = async (guide) => {
    // Prevent duplicate submissions while a request is running.
    if (requestingGuideId !== null) return;

    if (!guide?.id) {
      setNoticeType('error');
      setNotice('Invalid guide information. Please refresh and try again.');
      return;
    }

    // Set the lock synchronously to prevent rapid repeated clicks.
    if (requestGuide.isLocked) return;
    requestGuide.isLocked = true;

    setRequestingGuideId(guide.id);
    setNotice('');
    setNoticeType('info');

    try {
      if (typeof onRequestGuide !== 'function') {
        throw new Error(
          'Booking request handler is not configured.'
        );
      }

      await onRequestGuide(guide);

      setNoticeType('success');
      setNotice(`Your request for ${guide.name} was sent.`);
      setSelectedGuide(null);
    } catch (error) {
      setNoticeType('error');
      setNotice(
        error.message ||
          'Could not send your request. Please try again.'
      );
    } finally {
      requestGuide.isLocked = false;
      setRequestingGuideId(null);
    }
  };

  return (
    <main className="guide-page">
      <div className="guide-page__container">
        <div className="guide-page__topbar">
          <button
            type="button"
            className="guide-back"
            onClick={onBack}
            disabled={requestingGuideId !== null}
          >
            ← Back to itinerary
          </button>

          <span className="guide-trip-label">
            Your trip · {destination}
          </span>
        </div>

        <header className="guide-page__heading">
          <div>
            <p className="guide-eyebrow">
              Find your local expert
            </p>

            <h1>
              Make your {destination} escape unforgettable.
            </h1>
          </div>

          <img
            className="guide-page__destination-image"
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85"
            alt={`${destination} landscape`}
          />
        </header>

        <section
          className="guide-results"
          aria-labelledby="guide-results-title"
        >
          <div className="guide-results__heading">
            <div>
              <p className="guide-eyebrow">
                Curated for your trip
              </p>
            </div>

            <div className="guide-filters" />
          </div>

          {notice && (
            <p
              className="guide-notice"
              role={noticeType === 'error' ? 'alert' : 'status'}
            >
              {notice}
            </p>
          )}

          {guideLoadError && (
            <p className="guide-notice" role="alert">
              Registered guides could not be loaded:{' '}
              {guideLoadError}
            </p>
          )}

          {isLoadingGuides && (
            <p className="guide-notice" role="status">
              Loading registered guides…
            </p>
          )}

          <div className="guide-grid">
            {visibleGuides.map((guide) => {
              const isRequesting =
                requestingGuideId !== null;

              return (
                <article
                  className="guide-card"
                  key={guide.id || guide.name}
                >
                  <div className="guide-card__photo-wrap">
                    <img
                      className="guide-card__photo"
                      src={guide.image}
                      alt={guide.name}
                      loading="lazy"
                    />
                  </div>

                  <div className="guide-card__body">
                    <p className="guide-card__location">
                      <span aria-hidden="true">●</span>{' '}
                      {guide.location}
                    </p>

                    <div className="guide-card__name-row">
                      <h3>{guide.name}</h3>
                    </div>

                    <p className="guide-card__specialty">
                      {guide.specialty}
                    </p>

                    <p className="guide-card__description">
                      {guide.description}
                    </p>

                    <div className="guide-card__footer">
                      <strong>
                        {formatMoney(guide.price)}{' '}
                        <span>/ day</span>
                      </strong>

                      <div className="guide-card__actions">
                        <button
                          type="button"
                          className="guide-button guide-button--quiet"
                          onClick={() => setSelectedGuide(guide)}
                          disabled={isRequesting}
                        >
                          View profile
                        </button>

                        <button
                          type="button"
                          className="guide-button guide-button--primary"
                          onClick={() => requestGuide(guide)}
                          disabled={isRequesting}
                        >
                          {requestingGuideId === guide.id
                            ? 'Sending…'
                            : 'Request guide'}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {!isLoadingGuides &&
            visibleGuides.length === 0 && (
              <p className="guide-empty" role="status">
                No guides match those filters.
              </p>
            )}
        </section>

        <footer className="guide-page__footer">
          <span>
            All guides are locally based and reviewed by travelers.
          </span>

          <button
            type="button"
            className="guide-back"
            onClick={onBack}
            disabled={requestingGuideId !== null}
          >
            Return to itinerary
          </button>
        </footer>
      </div>

      <GuideProfileDialog
        guide={selectedGuide}
        onClose={() => setSelectedGuide(null)}
        onRequest={requestGuide}
        requestingGuideId={requestingGuideId}
      />
    </main>
  );
}

export default GuideSelect;
