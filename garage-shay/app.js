/* בונה את תוכן האתר מתוך config.js – אין צורך לערוך קובץ זה */
(function () {
  const S = window.SITE;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const addrShort = `${S.address.street}, ${S.address.city}`;
  const addrFull = `${S.address.street}, ${S.address.area}, ${S.address.city}`;
  const q = encodeURIComponent(S.address.mapQuery);

  // ---- טקסטים פשוטים ----
  const values = {
    ...S,
    years: new Date().getFullYear() - S.founded,
    addressShort: addrShort,
    addressFull: addrFull
  };
  $$("[data-bind]").forEach((el) => {
    const v = values[el.dataset.bind];
    if (v !== undefined) el.textContent = v;
  });

  // ---- קישורים ----
  const waText = encodeURIComponent(`שלום ${S.shortName}, אשמח לקבוע טיפול לרכב`);
  const links = {
    tel: `tel:${S.phone.replace(/\D/g, "")}`,
    wa: `https://wa.me/${S.whatsapp}?text=${waText}`,
    mail: `mailto:${S.email}`,
    facebook: S.facebook,
    waze: `https://waze.com/ul?q=${encodeURIComponent(S.address.street + " " + S.address.city)}&navigate=yes`,
    gmaps: `https://www.google.com/maps/search/?api=1&query=${q}`
  };
  $$("[data-href]").forEach((el) => (el.href = links[el.dataset.href]));
  $("#map").src = `https://maps.google.com/maps?q=${q}&hl=he&z=16&output=embed`;
  $("#year").textContent = new Date().getFullYear();

  // ---- שירותים ----
  $("#servicesList").innerHTML = S.services
    .map((s) => `<article class="card"><div class="card__icon" aria-hidden="true">${s.icon}</div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p><a class="link" href="#book" data-service="${esc(s.title)}">להזמנה ←</a></article>`)
    .join("");
  $("#extrasList").innerHTML = S.extras.map((e) => `<div class="extra"><h4>${esc(e.title)}</h4><p>${esc(e.text)}</p></div>`).join("");

  const li = (arr) => arr.map((x) => `<li>${esc(x)}</li>`).join("");
  $("#facilityList").innerHTML = li(S.facility);
  $("#certList").innerHTML = li(S.certificates);
  $("#brandsList").innerHTML = S.brands.map((b) => `<span>${esc(b)}</span>`).join("");

  $("#reviewsList").innerHTML = S.reviews
    .map((r) => `<blockquote class="review"><div class="stars" aria-label="5 כוכבים">★★★★★</div><p>${esc(r.text)}</p><footer>— ${esc(r.name)}</footer></blockquote>`)
    .join("");

  $("#tipsList").innerHTML = S.tips.map((t) => `<details><summary>${esc(t.q)}</summary><p>${esc(t.a)}</p></details>`).join("");

  // ---- שעות ----
  $("#hoursTable").innerHTML = S.hours.map((h) => `<tr><th>${esc(h.days)}</th><td>${esc(h.time)}</td></tr>`).join("");
  const day = new Date().getDay(); // 0=ראשון
  const today = day <= 4 ? S.hours[0] : day === 5 ? S.hours[1] : S.hours[2];
  $("#todayHours").textContent = today.time;

  // ---- טופס הזמנה -> וואטסאפ ----
  const sel = $("#serviceSelect");
  sel.innerHTML = ["בחרו שירות", ...S.services.map((s) => s.title), "אחר"]
    .map((t, i) => `<option${i === 0 ? ' value=""' : ""}>${esc(t)}</option>`).join("");
  $$("[data-service]").forEach((a) => a.addEventListener("click", () => (sel.value = a.dataset.service)));

  $("#bookForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const lines = [
      `שלום ${S.shortName}, אשמח לקבוע טיפול:`,
      `שם: ${f.get("name")}`,
      `טלפון: ${f.get("phone")}`,
      f.get("car") && `רכב: ${f.get("car")}`,
      f.get("service") && `שירות: ${f.get("service")}`,
      f.get("notes") && `הערות: ${f.get("notes")}`
    ].filter(Boolean);
    window.open(`https://wa.me/${S.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
  });

  // ---- סרטון ----
  $(".video__play").addEventListener("click", () => {
    $("#video").innerHTML = `<iframe src="https://www.youtube.com/embed/${S.youtubeId}?autoplay=1&rel=0" title="מוסך שי ביצאת צדיק" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  });

  // ---- תפריט מובייל ----
  const burger = $(".burger"), nav = $("#nav");
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  $$("#nav a").forEach((a) => a.addEventListener("click", () => { nav.classList.remove("open"); burger.setAttribute("aria-expanded", false); }));

  // ---- הצהרת נגישות ----
  const A = S.accessibility;
  $("#a11yName").textContent = A.coordinator;
  $("#a11yNote").textContent = A.note;
  $("#a11yPhone").textContent = A.phone; $("#a11yPhone").href = `tel:${A.phone.replace(/\D/g, "")}`;
  $("#a11yMail").textContent = A.email; $("#a11yMail").href = `mailto:${A.email}`;
  $("#a11yBtn").addEventListener("click", () => $("#a11yDialog").showModal());
})();
