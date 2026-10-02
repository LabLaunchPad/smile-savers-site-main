import { useState, useRef, type SubmitEvent } from 'react';
import { practice, mailtoWith } from '../data/practice';
import { FormSubmit, FormSuccess, FormError, type FormStatusKind } from './FormStatus';

export default function ContactForm() {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<FormStatusKind>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const sendViaMailto = (formData: FormData): void => {
    const mailtoLink = mailtoWith(
      `New Contact from ${formData.get('name')}`,
      `${formData.get('message')}%0D%0A%0D%0AFrom: ${formData.get('name')} (${formData.get('email')}, ${formData.get('phone')})`
    );
    window.location.href = mailtoLink;
    setStatus('success');
  };

  const sendEmail = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    if (!form.current) {
      setStatus('error');
      setErrorMessage(`Form unavailable. Please call ${practice.phone.display}.`);
      return;
    }

    // ponytail: FormData only (multipart contract) — no JSON, no secrets, browser sets the boundary
    const formData = new FormData(form.current);
    try {
      const r = await fetch('/api/contact', { method: 'POST', body: formData });
      if (!(r.headers.get('content-type') || '').includes('application/json')) {
        throw new Error('no api endpoint on this host');
      }
      const data = await r.json();
      if (r.ok && data.success) {
        setStatus('success');
        form.current.reset();
        return;
      }
      setStatus('error');
      setErrorMessage(data.error || `Failed to send. Please call ${practice.phone.display}.`);
    } catch {
      // No Pages Functions on this host (local dev / plain static) → mailto fallback
      if (form.current) sendViaMailto(new FormData(form.current));
    }
  };

  return (
    <div className="bg-color-op-1 rounded-1 p-40">
      <h3>Get In Touch</h3>
      <form
        ref={form}
        onSubmit={sendEmail}
        name="contactForm"
        id="contact_form"
        className="form-border"
      >
        <div className="mb-4">
          <label htmlFor="name">Your name</label>
          <input
            type="text"
            name="name"
            id="name"
            className="form-control"
            placeholder="Your Name"
            autoComplete="name"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email">Your email</label>
          <input
            type="email"
            name="email"
            id="email"
            className="form-control"
            placeholder="Your Email"
            autoComplete="email"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone">Your phone</label>
          <input
            type="tel"
            name="phone"
            id="phone"
            className="form-control"
            placeholder="Your Phone"
            autoComplete="tel"
            inputMode="tel"
            required
          />
        </div>

        <div className="mb20 mb-4">
          <label htmlFor="message">Your message</label>
          <textarea
            name="message"
            id="message"
            className="form-control"
            placeholder="Your Message"
            required
          ></textarea>
        </div>

        <FormSubmit status={status} idleLabel="Send Message" className="mt20" />

        {status === 'success' && (
          <FormSuccess id="success_message" className="success">
            Your message has been sent successfully.
          </FormSuccess>
        )}

        <FormError message={status === 'error' ? errorMessage : ''} />
      </form>
    </div>
  );
}
