import type { ReactNode } from 'react';

// Shared submit/success/error UI for the booking + contact islands.
// Visuals, ids, classes and roles are passed through byte-identical;
// per-form copy, placement and fallback logic stay in each form.
export type FormStatusKind = 'idle' | 'sending' | 'success' | 'error';

export function FormSubmit({
  status,
  idleLabel,
  className,
}: {
  status: FormStatusKind;
  idleLabel: string;
  className?: string;
}) {
  return (
    <div id="submit" className={className} aria-live="polite">
      <input
        type="submit"
        id="send_message"
        value={status === 'sending' ? 'Sending...' : idleLabel}
        className="btn-main"
        disabled={status === 'sending'}
      />
    </div>
  );
}

export function FormSuccess({
  id,
  className,
  children,
}: {
  id: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <div id={id} className={className} style={{ display: 'block' }} role="status">
      {children}
    </div>
  );
}

export function FormError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div id="error_message" className="error" style={{ display: 'block' }} role="alert">
      {message}
    </div>
  );
}
