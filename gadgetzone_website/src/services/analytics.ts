export const analyticsService = {
  injectScripts() {
    const gaId = import.meta.env.VITE_GA_ID;
    const fbPixelId = import.meta.env.VITE_FB_PIXEL_ID;

    console.log('Analytics IDs:', { gaId, fbPixelId });

    if (gaId) {
      this.injectGA(gaId);
    }

    if (fbPixelId) {
      this.injectFBPixel(fbPixelId);
    }
  },

  injectGA(id: string) {
    if (document.getElementById('ga-script')) return;

    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    script1.id = 'ga-script';
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${id}');
    `;
    document.head.appendChild(script2);
    console.log('Google Analytics injected');
  },

  injectFBPixel(id: string) {
    if (document.getElementById('fb-pixel-script')) return;

    const script = document.createElement('script');
    script.id = 'fb-pixel-script';
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${id}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);

    const noscript = document.createElement('noscript');
    noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1" />`;
    document.body.appendChild(noscript);
    console.log('Facebook Pixel injected');
  },

  trackEvent(name: string, params: object = {}) {
    if (typeof window !== 'undefined') {
      if (window.gtag) {
        window.gtag('event', name, params);
      }
      if (window.fbq) {
        window.fbq('track', name, params);
      }
    }
  }
};

declare global {
  interface Window {
    gtag: any;
    fbq: any;
    dataLayer: any[];
  }
}
