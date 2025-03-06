import Script from "next/script";

export default function GoongMapLoader({ onLoad }: { onLoad: () => void }) {
  return (
    <div>
      <Script
        src="https://cdn.jsdelivr.net/npm/@goongmaps/goong-js/dist/goong-js.js"
        strategy="lazyOnload"
        onLoad={onLoad}
      />
      <link
          href="https://cdn.jsdelivr.net/npm/@goongmaps/goong-js/dist/goong-js.css"
          rel="stylesheet"
        />
    </div>
  );
}
