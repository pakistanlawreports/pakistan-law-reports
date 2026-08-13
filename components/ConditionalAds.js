'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

const EXCLUDED_PATH_PREFIXES = [
  '/judgments/',
  '/legal-texts',
  '/lawyers/',
];

const ALLOWED_EXCEPTIONS = ['/lawyers/profile/'];

function isExcluded(pathname) {
  if (ALLOWED_EXCEPTIONS.some((p) => pathname.startsWith(p))) return false;
  if (pathname === '/lawyers') return false;
  return EXCLUDED_PATH_PREFIXES.some((p) => pathname.startsWith(p));
}

export default function ConditionalAds() {
  const pathname = usePathname();

  if (isExcluded(pathname)) {
    return null;
  }

  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0555529856361728"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <Script
        async
        src="https://fundingchoicesmessages.google.com/i/pub-0555529856361728?ers=1"
        strategy="afterInteractive"
      />
      <Script id="googlefc-present" strategy="afterInteractive">
        {`(function() {function signalGooglefcPresent() {if (!window.frames['googlefcPresent']) {if (document.body) {const iframe = document.createElement('iframe'); iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;'; iframe.style.display = 'none'; iframe.name = 'googlefcPresent'; document.body.appendChild(iframe);} else {setTimeout(signalGooglefcPresent, 0);}}}signalGooglefcPresent();})();`}
      </Script>
    </>
  );
}
