import { useMemo, useRef, useState, type SubmitEvent } from 'react';
import { practice, mailtoWith } from '../data/practice';
import { FormSubmit, FormSuccess, FormError, type FormStatusKind } from './FormStatus';

export default function BookingForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<FormStatusKind>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const sendViaMailto = (formData: FormData): void => {
    const mailto = mailtoWith(
      `Booking Appointment - ${formData.get('service')}`,
      `Name: ${formData.get('name')}%0D%0AEmail: ${formData.get('email')}%0D%0APhone: ${formData.get('phone')}%0D%0AService: ${formData.get('service')}%0D%0ADate: ${formData.get('date')}%0D%0ATime: ${formData.get('time')}%0D%0AMessage: ${formData.get('message')}`
    );
    window.location.href = mailto;
    setStatus('success');
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    if (!formRef.current) {
      setStatus('error');
      setErrorMessage(
        `Form tidak tersedia. Coba refresh halaman. or call ${practice.phone.display}.`
      );
      return;
    }

    // ponytail: server has no date/time slots — fold into message; FormData only, no JSON, no secrets
    const formData = new FormData(formRef.current);
    const date = formData.get('date');
    const time = formData.get('time');
    if (date || time) {
      formData.set('message', `Preferred: ${date} @ ${time}\n\n${formData.get('message') || ''}`);
    }

    try {
      const r = await fetch('/api/contact', { method: 'POST', body: formData });
      if (!(r.headers.get('content-type') || '').includes('application/json')) {
        throw new Error('no api endpoint on this host');
      }
      const data = await r.json();
      if (r.ok && data.success) {
        setStatus('success');
        formRef.current.reset();
        return;
      }
      setStatus('error');
      setErrorMessage(data.error || `Failed to send. Please call ${practice.phone.display}.`);
    } catch {
      // No Pages Functions on this host (local dev / plain static) → mailto fallback
      if (formRef.current) sendViaMailto(new FormData(formRef.current));
    }
  };

  return (
    <div className="relative">
      {status === 'success' ? (
        <FormSuccess id="success_message_col" className="success h-100 p-40">
          <h3>Thank You For Your Order</h3>
          <p>
            We have received your request and will be processing it shortly. Click button below if
            you want to make another order.
          </p>
          <button type="button" className="btn-main" onClick={() => setStatus('idle')}>
            Re-order
          </button>
        </FormSuccess>
      ) : (
        <form ref={formRef} name="bookingForm" id="booking_form" onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-lg-12">
              <h3 className="mb-3">
                <i className="fa fa-envelope-o id-color me-2" aria-hidden="true"></i> Book Your
                Appointment
              </h3>
              <p>
                Book your appointment today for expert dental care tailored to your needs. Healthy,
                beautiful smiles start with a simple step, schedule now!
              </p>
              <div className="relative">
                <label htmlFor="service">Service</label>
                <select
                  name="service"
                  id="service"
                  className="form-control"
                  defaultValue=""
                  required
                >
                  <option disabled value="">
                    Select Service
                  </option>
                  <option value="General Dentistry">General Dentistry</option>
                  <option value="Cosmetic Dentistry">Cosmetic Dentistry</option>
                  <option value="Pediatric Dentistry">Pediatric Dentistry</option>
                  <option value="Restorative Dentistry">Restorative Dentistry</option>
                  <option value="Preventive Dentistry">Preventive Dentistry</option>
                  <option value="Orthodontics">Orthodontics</option>
                </select>
                <i
                  className="id-color icofont-simple-down absolute end-0 top-0 pe-3 pt-3"
                  aria-hidden="true"
                ></i>
              </div>
            </div>

            <div className="col-lg-6">
              <div id="date" className="input-group date relative" data-date-format="mm-dd-yyyy">
                <label htmlFor="booking_date">Preferred date</label>
                <i
                  className="id-color icofont-calendar absolute end-0 top-0 pe-3 pt-3"
                  aria-hidden="true"
                ></i>
                <input
                  className="form-control"
                  name="date"
                  id="booking_date"
                  type="date"
                  min={today}
                  required
                />
                <span className="input-group-addon">
                  <i className="glyphicon glyphicon-calendar" aria-hidden="true"></i>
                </span>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="relative">
                <label htmlFor="time">Preferred time</label>
                <select name="time" id="time" className="form-control" defaultValue="" required>
                  <option disabled value="">
                    Select Time
                  </option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="12:00">12:00</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                </select>
                <i
                  className="id-color icofont-simple-down absolute end-0 top-0 pe-3 pt-3"
                  aria-hidden="true"
                ></i>
              </div>
            </div>

            <div className="col-lg-4">
              <label htmlFor="name">Full name</label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                className="form-control"
                autoComplete="name"
                required
              />
            </div>

            <div className="col-lg-4">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                className="form-control"
                autoComplete="email"
                required
              />
            </div>

            <div className="col-lg-4">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                name="phone"
                id="phone"
                placeholder="Phone"
                className="form-control"
                autoComplete="tel"
                inputMode="tel"
                required
              />
            </div>

            <div className="col-lg-12">
              <label htmlFor="message">Message</label>
              <textarea
                name="message"
                id="message"
                className="form-control"
                placeholder="Message"
              ></textarea>
            </div>

            <div className="col-lg-12">
              <FormSubmit status={status} idleLabel="Send Appointment" />
            </div>
          </div>

          <FormError message={status === 'error' ? errorMessage : ''} />
        </form>
      )}
    </div>
  );
}
