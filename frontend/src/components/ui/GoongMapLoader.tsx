import Script from "next/script";
import { useState, useEffect } from "react";

export default function GoongMapLoader({ onLoad }: { onLoad: () => void }) {
  const totalScripts = 4; // Số script cần tải
  const setLoadedScripts = useState(0)[1];

  const handleScriptLoad = () => {
    setLoadedScripts((prev) => {
      const newCount = prev + 1;
      if (newCount === totalScripts) {
        setTimeout(onLoad, 0);
      }
      return newCount;
    });
  };

  useEffect(() => {
    // Nếu GoongJS đã được tải trước đó, gọi onLoad ngay lập tức
    if (typeof (window as any).goongjs !== "undefined") {
      onLoad();
    }
  }, []);

  return (
    <div>
      {/* Goong JS */}
      <Script
        src="https://cdn.jsdelivr.net/npm/@goongmaps/goong-js/dist/goong-js.js"
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
      />
      <link
        href="https://cdn.jsdelivr.net/npm/@goongmaps/goong-js/dist/goong-js.css"
        rel="stylesheet"
      />

      {/* Goong Geocoder */}
      <Script
        src="https://cdn.jsdelivr.net/npm/@goongmaps/goong-geocoder@1.1.1/dist/goong-geocoder.min.js"
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
      />
      <link
        href="https://cdn.jsdelivr.net/npm/@goongmaps/goong-geocoder@1.1.1/dist/goong-geocoder.css"
        rel="stylesheet"
      />

      {/* ES6-Promise */}
      <Script
        src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.min.js"
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js"
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
      />
    </div>
  );
}
