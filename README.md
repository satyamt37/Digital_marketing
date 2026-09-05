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
  email:    "satyamt37@gmail.com",
  phone:    "+91 89594 59494",
  phoneRaw: "918959459494",   // used for tel: and wa.me links
  address:  "",               // add your address here; leave "" to hide the row
  emailjs:  { publicKey: "", serviceId: "", templateId: "" }   // see below
};
```

---

# 📧 Getting enquiries into your Gmail inbox (EmailJS)

The contact form uses **EmailJS**, which connects your own Gmail account and sends each
enquiry straight to it. No server, no database, free for 200 emails a month.

Until it's configured the form still works — it opens the visitor's own mail app with
everything pre-filled — so no enquiry is ever silently lost.

### Step 1 — Create the account
Go to **https://www.emailjs.com** and sign up (free plan is fine).

### Step 2 — Connect Gmail
`Email Services` → **Add New Service** → **Gmail** → *Connect Account* → sign in as
`satyamt37@gmail.com` and allow access.
Copy the **Service ID** (looks like `service_ab12cde`).

### Step 3 — Create the template
`Email Templates` → **Create New Template**.

Set these fields:

| Field | Value |
|---|---|
| **Subject** | `{{subject}}` |
| **To Email** | `satyamt37@gmail.com` |
| **From Name** | `Nimbus Reach Website` |
| **Reply To** | `{{reply_to}}` ← *important: lets you hit Reply and answer the customer* |

Then switch the body editor to **Code / HTML** mode and paste exactly this:

```html
{{{enquiry_html}}}
```

> Three curly braces, not two. Two braces would escape the HTML and you'd see raw tags.

Save, then copy the **Template ID** (looks like `template_xy34zab`).

### Step 4 — Get your Public Key
`Account` → `General` → copy the **Public Key**.

### Step 5 — Paste all three into the site
In `assets/js/site.js`:

```js
emailjs: {
  publicKey:  "aB1cD2eF3gH4iJ5kL",
  serviceId:  "service_ab12cde",
  templateId: "template_xy34zab"
}
```

### Step 6 — Push and test
```bash
git add -A && git commit -m "Configure EmailJS" && git push
```
Wait a minute for GitHub Pages, open the live contact page, and submit a test enquiry.
It should arrive in your Gmail within seconds.

---

### What the email looks like

A single clean table, in this order:

| | |
|---|---|
| **Name** | Rakesh Sharma |
| **Phone / WhatsApp** | 98765 43210 |
| **Email** | rakesh@example.com |
| **Business & city** | Sharma Sweets, Indore |
| **Interested in** | AI-generated video ads |
| **Monthly budget** | ₹15,000 – ₹30,000 |
| **Message** | *(what they typed)* |
| **Submitted** | 5 Sep 2026, 9:24 pm IST |
| **Sent from page** | the page they enquired from |

The subject line is `New enquiry — Sharma Sweets, Indore · AI-generated video ads`, so your
inbox list is scannable at a glance, and **Reply** goes straight to the customer.

### If it doesn't arrive
- Check Gmail's **Spam** and **Promotions** tabs, then mark as "Not spam" once.
- Open the browser console on the contact page — errors are logged with a `[Nimbus Reach]` prefix.
- Confirm all three IDs are filled in and the Gmail service shows *Connected* in EmailJS.
- EmailJS dashboard → **History** shows every send attempt and its result.

### Using a different template variable
If you'd rather build the email layout yourself in EmailJS, these variables are all available:
`{{from_name}}` `{{email}}` `{{phone}}` `{{business}}` `{{service}}` `{{budget}}`
`{{message}}` `{{submitted_at}}` `{{page_url}}` `{{subject}}` `{{reply_to}}`
`{{enquiry_text}}` (plain text version) and `{{{enquiry_html}}}` (the formatted table).

### Spam protection
The form has a hidden honeypot field and client-side validation. If spam ever becomes a
problem, turn on reCAPTCHA in the EmailJS template settings.

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
