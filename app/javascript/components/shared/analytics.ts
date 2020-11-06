import * as React from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    analytics: any;
  }
}

export const usePageViews = () => {
  const location = useLocation();
  React.useEffect(() => {
    window.analytics.page(location.pathName);
  }, [location]);
};

export const registerIdentity = (id, email, name, companyId, companyName) => {
  window.analytics.identify(id, {
    email,
    name,
    company: {
      id: companyId,
      name: companyName,
    },
  });
};
