import { useEffect, useState } from 'react';
import { getBookingMessages, sendBookingMessage } from '../api/auth';
import { openBookingSocket } from '../api/bookingSocket';
import '../styles/BookingChat.css';

function BookingChat({ bookingId, currentUser, otherName }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!bookingId) return undefined;

    let isActive = true;
    const socket = openBookingSocket();
    const appendMessage = (message) => {
      if (Number(message.bookingId) !== Number(bookingId)) return;
      setMessages((current) => current.some((item) => item.id === message.id)
        ? current
        : [...current, message]);
    };

    getBookingMessages(bookingId)
      .then(({ messages: loadedMessages }) => {
        if (isActive) setMessages(loadedMessages);
      })
      .catch((loadError) => {
        if (isActive) setError(loadError.message);
      });

    socket.on('connect', () => {
      socket.emit('booking:join', bookingId, (result) => {
        if (!result?.success && isActive) setError(result?.message || 'Could not join this conversation.');
      });
    });
    socket.on('booking:message', appendMessage);

    return () => {
      isActive = false;
      socket.off('booking:message', appendMessage);
      socket.disconnect();
    };
  }, [bookingId]);

  const submitMessage = async (event) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body || isSending) return;

    setIsSending(true);
    setError('');
    try {
      const { message } = await sendBookingMessage(bookingId, body);
      setMessages((current) => current.some((item) => item.id === message.id)
        ? current
        : [...current, message]);
      setDraft('');
    } catch (sendError) {
      setError(sendError.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="booking-chat" aria-label={`Conversation with ${otherName}`}>
      <header className="booking-chat__header">
        <div><strong>{otherName}</strong><span>Trip booking conversation</span></div>
        <span className="booking-chat__live"><i /> Live</span>
      </header>
      {error && <p className="booking-chat__error" role="alert">{error}</p>}
      <div className="booking-chat__messages" aria-live="polite">
        {messages.map((message) => {
          const isMine = Number(message.senderId) === Number(currentUser?.id);
          return (
            <article className={`booking-chat__message${isMine ? ' is-mine' : ''}`} key={message.id}>
              <span>{isMine ? 'You' : message.senderName}</span>
              <p>{message.body}</p>
              <time>{new Date(message.createdAt).toLocaleString()}</time>
            </article>
          );
        })}
        {messages.length === 0 && <p className="booking-chat__empty">No messages yet. Send the first update.</p>}
      </div>
      <form className="booking-chat__composer" onSubmit={submitMessage}>
        <input value={draft} onChange={(event) => setDraft(event.target.value)} maxLength="2000" placeholder={`Message ${otherName}`} aria-label="Message" />
        <button type="submit" disabled={!draft.trim() || isSending}>{isSending ? 'Sending…' : 'Send'}</button>
      </form>
    </section>
  );
}

export default BookingChat;
