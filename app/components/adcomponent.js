import { useEffect } from 'react';

const AdComponent = () => {
  useEffect(() => {
    // Create the script element
    const script = document.createElement('script');

    // Set the script attributes
    script.src = "//scented-leather.com/bxX/VJsVd.G/lO0EYOW/cI/ieamm9NugZJU/lgkRP/TQUn3KNRj/g/5uN/zpMAtAN/Trc-2oO/DLkA3QNvAc";
    script.async = true;
    script.referrerPolicy = 'no-referrer-when-downgrade';

    // Add settings if needed
    script.settings = {};

    // Append the script to the document
    document.body.appendChild(script);

    // Clean up the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null; // The component doesn't need to render anything
};

export default AdComponent;
