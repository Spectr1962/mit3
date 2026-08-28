"use client";

import { useEffect, useState, type FormHTMLAttributes } from "react";

export function NetworkAwareForm({ children, ...props }: FormHTMLAttributes<HTMLFormElement>) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const update = () => setIsOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return <form {...props} onSubmit={isOnline ? props.onSubmit : (event) => event.preventDefault()}><fieldset disabled={!isOnline} className="contents">{children}</fieldset></form>;
}
