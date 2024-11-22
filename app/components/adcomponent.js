import Script from 'next/script'

export default function AdComponent() {
  return (
    <>
      <Script
        src="https://alwingulla.com/88/tag.min.js"
        data-zone="115418"
        async
        data-cfasync="false"
        strategy="afterInteractive"
      />
      {/* You can add any other ad-related content here if needed */}
    </>
  )
}

