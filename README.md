# Nimbus Reach — digital marketing website

A fast, static marketing website for a digital marketing studio that serves neighbourhood
businesses — salons, cafés, gyms, clinics, boutiques, jewellers and local shops.

**Live site:** https://satyamt37.github.io/Digital_marketing/

---

## What's inside

| Page | File | What it covers |
|---|---|---|
| Home | `index.html` | Hero, stats, services, process, case studies, pricing, testimonials, FAQ |
| Services | `services.html` | AI video, real shoots, Meta/Google ads, local SEO, social, WhatsApp, websites |
| Our Work | `work.html` | Nine case studies with metrics |
| Pricing | `pricing.html` | Three monthly plans, one-off packages, what's *not* included |
| About | `about.html` | Founder note, principles, team, timeline |
| Contact | `contact.html` | Enquiry form, direct contact details, FAQs |
| 404 | `404.html` | Not-found page |

```
assets/
  css/style.css   — the whole design system, one file
  js/site.js      — config, nav, reveals, counters, FAQ, contact form
  img/            — favicon + social share image (SVG)
```

## Tech

Plain HTML, CSS and vanilla JavaScript. **No framework, no build step, no database.**
Open `index.html` in a browser and it works. Deployed with GitHub Pages.

---

## Edit your contact details in one place

Open `assets/js/site.js` and change the top block. Every page picks it up automatically.

```js
window.NR_CONFIG = {
  email:     "satyamt37@gmail.com",
  phone:     "+91 89594 59494",
  phoneRaw:  "918959459494",   // used for tel: and wa.me links
  address:   "",               // add your address here; leave "" to hide the row
  accessKey: ""                // see below
};
```

## Making the contact form email you (2 minutes)

The form works right now — with no key set it opens the visitor's mail app with everything
pre-filled. To have enquiries land in your inbox automatically instead:

1. Go to **https://web3forms.com** and enter `satyamt37@gmail.com`.
2. They email you an **access key** immediately. No account, no card, free tier is generous.
3. Paste it into `accessKey` in `assets/js/site.js`.
4. Commit and push — done. Every submission arrives as an email with the name, phone,
   business, service, budget and message.

The form already includes a honeypot field and client-side validation to keep spam down.

---

## Running it locally

Just open `index.html`. Or, for a proper local server:

```bash
python -m http.server 8080
# then visit http://localhost:8080
```

## Deploying changes

```bash
git add -A
git commit -m "Update copy"
git push
```

GitHub Pages rebuilds within a minute or two.

---

## Things to swap for real content

- Case study names, photos and metrics in `work.html` and `index.html`
- Testimonials in `index.html`
- Team names in `about.html`
- Social links in every footer (currently `#`)
- Photos are hotlinked from Unsplash — replace with your own shoots when you have them

The footer carries a disclaimer noting that the sample figures are illustrative. Keep it
there until the case studies are real ones.
