// script.js — Broadsomedia behavior engine (Option B)
(function(){
  // Utilities
  const q = sel => document.querySelector(sel);
  const qs = sel => Array.from(document.querySelectorAll(sel));

  /* ================== THEME CONTROL ================== */
  const themeToggle = q('.theme-toggle');
  const root = document.documentElement;
  const storedTheme = localStorage.getItem('bm_theme');

  if(storedTheme){
    root.classList.add(storedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.add(prefersDark ? 'dark' : 'light');
  }

  function toggleTheme(){
    if(root.classList.contains('dark')){
      root.classList.replace('dark','light');
      localStorage.setItem('bm_theme','light');
      themeToggle.textContent='🌙';
    } else {
      root.classList.replace('light','dark');
      localStorage.setItem('bm_theme','dark');
      themeToggle.textContent='☀️';
    }
    // Update hero heading color
    const heroHeading = q('.hero h1');
    if(heroHeading) heroHeading.style.color = getComputedStyle(root).getPropertyValue('--text');
  }
  themeToggle && themeToggle.addEventListener('click', toggleTheme);

  /* ================== MOBILE MENU ================== */
  const menuToggle = q('.menu-toggle');
  const nav = q('.nav');
  if(menuToggle && nav){
    menuToggle.addEventListener('click', ()=>{
      nav.classList.toggle('show');
      menuToggle.setAttribute('aria-expanded', nav.classList.contains('show'));
    });
  }

  /* ================== UPDATE YEAR ================== */
  const yearEl = q('#year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  /* ================== CONSENT BAR ================== */
  const consentBar = q('#consentBar');
  const accept = q('#acceptCookies');
  const reject = q('#rejectCookies');
  const consentKey = 'bm_consent';

  function setConsent(val){
    localStorage.setItem(consentKey, val);
    if(consentBar){
      consentBar.style.opacity = '0';
      setTimeout(()=> consentBar.style.display='none', 300);
    }
  }

  const existingConsent = localStorage.getItem(consentKey);
  if(existingConsent){
    if(consentBar) consentBar.style.display='none';
  } else {
    if(consentBar) consentBar.style.display='flex';
  }

  accept && accept.addEventListener('click', ()=>{ 
    setConsent('accepted'); 
    // Load analytics if needed
  });
  reject && reject.addEventListener('click', ()=> setConsent('rejected'));

  /* ================== LEAD FORM ================== */
  const form = q('#contactForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true; 
      submitBtn.textContent = 'Sending...';
      setTimeout(()=>{
        submitBtn.textContent = 'Sent ✓';
        form.reset();
        submitBtn.disabled = false;
      }, 900);
    });
  }

  /* ================== CTA BUTTON LINKS ================== */
  const ctaLinks = [
    {selector:'#ignite-cta', url:'https://tally.so/r/lbbGGB'},
    {selector:'#surge-cta', url:'https://tally.so/r/WOOWLa'},
    {selector:'#scheduleBtn', url:'https://cal.com/broadsomedia/secret'}
  ];

  ctaLinks.forEach(item => {
    const el = q(item.selector);
    if(el) el.addEventListener('click', ()=> window.open(item.url,'_blank'));
  });

  /* ================== SMALL ENHANCEMENTS ================== */
  document.addEventListener('mousedown', ()=> document.body.classList.add('using-mouse'));
  document.addEventListener('keydown', e=>{ if(e.key==='Tab') document.body.classList.remove('using-mouse') });

})();
// ------------------------
// THEME TOGGLE
// ------------------------
const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem("theme") || "light";
root.setAttribute("data-theme", savedTheme);
themeToggle.textContent = savedTheme === "dark" ? "🌙" : "🌞";
themeToggle.setAttribute("aria-pressed", savedTheme === "dark");

// Toggle theme
themeToggle.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    const newTheme = isDark ? "light" : "dark";

    root.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    themeToggle.textContent = newTheme === "dark" ? "🌙" : "🌞";
    themeToggle.setAttribute("aria-pressed", newTheme === "dark");
});

// ------------------------
// CONSENT + TRACKER LOADER
// ------------------------
const consentBanner = document.getElementById("consent-banner");
const acceptBtn = document.getElementById("accept-consent");
const rejectBtn = document.getElementById("reject-consent");

function injectScript(elem) {
    if (!elem) return;
    const src = elem.dataset.src;
    if (!src) return;

    const s = document.createElement("script");
    s.src = src;
    s.async = true;

    document.body.appendChild(s);
}

// Load GA init after the JS loads
function initGA() {
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'YOUR_GA_ID');
}

function loadAllTrackers() {
    injectScript(document.getElementById("ga-placeholder"));
    injectScript(document.getElementById("meta-placeholder"));
    injectScript(document.getElementById("tiktok-placeholder"));

    setTimeout(initGA, 800);
}

function hideConsent() {
    consentBanner.classList.add("hidden");
    setTimeout(() => (consentBanner.style.display = "none"), 400);
}

// Handle consent
acceptBtn.addEventListener("click", () => {
    localStorage.setItem("consent", "accepted");
    hideConsent();
    loadAllTrackers();
});

rejectBtn.addEventListener("click", () => {
    localStorage.setItem("consent", "rejected");
    hideConsent();
});

// Load based on past choice
const savedConsent = localStorage.getItem("consent");
if (savedConsent === "accepted") {
    hideConsent();
    loadAllTrackers();
}
if (savedConsent === "rejected") {
    hideConsent();
}

// ------------------------
// FORM BUTTON FEEDBACK
// ------------------------
const form = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");

form.addEventListener("submit", () => {
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    setTimeout(() => {
        submitBtn.textContent = "Sent ✓";
        submitBtn.disabled = false;
    }, 1200);
});
