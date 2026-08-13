"use client";

import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

// Watches the enclosing form's submit lifecycle and shows a single
// loading → success toast per submit (works for any button in the form,
// including delete buttons that use formAction).
function FormToastWatcher({ loadingText, successText }: { loadingText: string; successText: string }) {
  const { pending } = useFormStatus();
  const toastId = useRef<string | number | null>(null);
  const wasPending = useRef(false);

  useEffect(() => {
    if (pending && !wasPending.current) {
      wasPending.current = true;
      toastId.current = toast.loading(loadingText);
    } else if (!pending && wasPending.current) {
      wasPending.current = false;
      if (toastId.current !== null) toast.success(successText, { id: toastId.current });
      toastId.current = null;
    }
  }, [pending, loadingText, successText]);

  return null;
}

type AdminFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
  loadingText?: string;
  successText?: string;
};

// Drop-in replacement for <form action={...}> in admin pages that adds a
// toast indicator on submit.
export default function AdminForm({
  action,
  children,
  className,
  loadingText = "Сохранение…",
  successText = "Готово",
}: AdminFormProps) {
  return (
    <form action={action} className={className}>
      <FormToastWatcher loadingText={loadingText} successText={successText} />
      {children}
    </form>
  );
}
