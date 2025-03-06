/* eslint-disable @typescript-eslint/no-explicit-any */
import Script from "next/script";
import { useEffect} from "react";

export default function GoongMapLoader({ onLoad }: { onLoad: () => void }) {
  useEffect(() => {
    // Nếu GoongJS đã được tải trước đó, gọi onLoad ngay lập tức
    if ((window as any).goongjs) {
      onLoad();
    }
  }, []);
  return (
    <div>
      <Script
        src="https://cdn.jsdelivr.net/npm/@goongmaps/goong-js/dist/goong-js.js"
        strategy="lazyOnload"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/@goongmaps/goong-js/dist/goong-js.css"
        rel="stylesheet"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/@goongmaps/goong-geocoder@1.1.1/dist/goong-geocoder.min.js"
        strategy="lazyOnload"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/@goongmaps/goong-geocoder@1.1.1/dist/goong-geocoder.css"
        rel="stylesheet"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.min.js"
        strategy="lazyOnload"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js"
        strategy="lazyOnload"
        onLoad={onLoad}
      />
    </div>
  );
}
