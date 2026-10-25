function requiredText(form, field, label, { trim = true, minLength = 1, maxLength = Infinity } = {}) {
  const value = form?.[field];
  const normalizedValue = typeof value === 'string' && trim ? value.trim() : value;

  if (typeof normalizedValue !== 'string' || normalizedValue.length < minLength || normalizedValue.length > maxLength) {
    throw new Error(`${label} is required or has an invalid length.`);
  }

  return normalizedValue;
}

export function buildTravelerRegistrationPayload(form) {
  const interests = form?.travelInterests ?? [];
  if (!Array.isArray(interests) || interests.some((interest) => typeof interest !== 'string')) {
    throw new Error('Travel preferences must be a list of interests.');
  }

  return {
    fullName: requiredText(form, 'fullName', 'Full name', { minLength: 2, maxLength: 150 }),
    telephoneNumber: requiredText(form, 'telephoneNumber', 'Telephone number', { minLength: 7, maxLength: 20 }),
    email: requiredText(form, 'email', 'Email address', { maxLength: 254 }),
    password: requiredText(form, 'password', 'Password', { trim: false, minLength: 12, maxLength: 72 }),
    country: requiredText(form, 'country', 'Country', { minLength: 2, maxLength: 100 }),
    travelInterests: [...interests],
  };
}
