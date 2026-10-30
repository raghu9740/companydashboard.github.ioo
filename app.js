const API_URL = "http://localhost:5000/api/companies";
const localCompanies = [
  {name:"Google",industry:"Technology / EdTech",employees:182000,country:"United Kingdom",city:"London"},
  {name:"Amazon Web Services",industry:"Cloud Computing",employees:150000,country:"United Kingdom",city:"London"},
  {name:"Dell Technologies",industry:"Hardware / IT Services",employees:120000,country:"United Kingdom",city:"London"},
  {name:"HP Inc",industry:"Computing Hardware",employees:58000,country:"United States",city:"Palo Alto"},
  {name:"Canva Education",industry:"Design Software",employees:4000,country:"Australia",city:"Sydney"},
  {name:"Acer",industry:"Consumer Electronics",employees:7500,country:"Switzerland",city:"Zurich"},
  {name:"Promethean",industry:"Interactive Displays",employees:650,country:"United Kingdom",city:"Blackburn"},
  {name:"ClassLink",industry:"Education Software",employees:250,country:"United States",city:"Clifton"},
  {name:"Seesaw",industry:"EdTech Platform",employees:320,country:"United States",city:"San Francisco"},
  {name:"BenQ",industry:"Display Technology",employees:3200,country:"United Kingdom",city:"London"}
];
const els = {
  company: document.querySelector("#companyFilter"),
  industry: document.querySelector("#industryFilter"),
  country: document.querySelector("#countryFilter"),
  track: document.querySelector("#cardsTrack"),
  viewport: document.querySelector("#cardsViewport"),
  empty: document.querySelector("#emptyState"),
  shown: document.querySelector("#shownCount"),
  total: document.querySelector("#totalCount"),
  countries: document.querySelector("#countryCount"),
  industries: document.querySelector("#industryCount"),
  chip: document.querySelector("#resultChip"),
  active: document.querySelector("#activeCount"),
  toast: document.querySelector("#toast")
};
let companies = [];
let toastTimer;
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function initials(name) {
  const words = name.split(/\s+/);
  return (words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2)).toUpperCase();
}
function uniqueValues(field) {
  return [...new Set(companies.map(company => company[field]))].sort((a,b) => a.localeCompare(b));
}
function fillSelect(select, values, allLabel) {
  const previous = select.value;
  select.innerHTML = `<option value="">${allLabel}</option>` + values.map(value => `<option value="${escapeHTML(value)}">${escapeHTML(value)}</option>`).join("");
  if (values.includes(previous)) select.value = previous;
}
function setupFilters() {
  fillSelect(els.company, companies.map(c => c.name).sort((a,b) => a.localeCompare(b)), "All companies");
  fillSelect(els.industry, uniqueValues("industry"), "All industries");
  fillSelect(els.country, uniqueValues("country"), "All countries");
}
function formatEmployees(value) {
  return Number(value).toLocaleString("en-US");
}
function cardMarkup(company, index) {
  return `<article class="company-card" style="animation-delay:${Math.min(index*35,280)}ms">
    <div class="card-top"><div class="company-monogram">${escapeHTML(initials(company.name))}</div><span class="card-number">#${String(index+1).padStart(2,"0")}</span></div>
    <h4>${escapeHTML(company.name)}</h4>
    <span class="industry-tag" title="${escapeHTML(company.industry)}">${escapeHTML(company.industry)}</span>
    <div class="card-divider"></div>
    <div class="detail-row"><span class="detail-icon">♙</span><div><span class="detail-label">Employee count</span><span class="detail-value">${formatEmployees(company.employees)}</span></div></div>
    <div class="detail-row"><span class="detail-icon">◎</span><div><span class="detail-label">Country</span><span class="detail-value">${escapeHTML(company.country)}</span></div></div>
    <div class="detail-row"><span class="detail-icon">⌖</span><div><span class="detail-label">City</span><span class="detail-value">${escapeHTML(company.city)}</span></div></div>
  </article>`;
}
function getFilteredCompanies() {
  const company = els.company.value;
  const industry = els.industry.value;
  const country = els.country.value;
  return companies.filter(item =>
    (!company || item.name === company) &&
    (!industry || item.industry === industry) &&
    (!country || item.country === country)
  );
}
function render() {
  const filtered = getFilteredCompanies();
  els.track.innerHTML = filtered.map(cardMarkup).join("");
  els.empty.hidden = filtered.length !== 0;
  els.viewport.style.display = filtered.length ? "block" : "none";
  document.querySelector(".scroll-hint").style.display = filtered.length > 1 ? "flex" : "none";
  els.shown.textContent = filtered.length;
  els.total.textContent = companies.length;
  els.countries.textContent = new Set(filtered.map(c => c.country)).size;
  els.industries.textContent = new Set(filtered.map(c => c.industry)).size;
  els.chip.textContent = `${filtered.length} ${filtered.length === 1 ? "result" : "results"}`;
  const active = [els.company.value, els.industry.value, els.country.value].filter(Boolean).length;
  els.active.textContent = `${active} active`;
  els.viewport.scrollTo({left:0,behavior:"smooth"});
}
function clearFilters() {
  els.company.value = "";
  els.industry.value = "";
  els.country.value = "";
  render();
  showToast("All filters cleared");
}
function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2300);
}
async function loadCompanies() {
  // The standalone HTML works immediately with the included seed data.
  // If the Express API is running, fetch the live database/API data instead.
  try {
    const response = await fetch(API_URL, {signal: AbortSignal.timeout(1200)});
    if (!response.ok) throw new Error("API unavailable");
    const data = await response.json();
    if (Array.isArray(data) && data.length) {
      companies = data.map(item => ({
        name: item.name || item.companyName,
        industry: item.industry,
        employees: Number(item.employees),
        country: item.country,
        city: item.city
      }));
      showToast("Connected to backend API");
    } else {
      companies = localCompanies;
    }
  } catch (error) {
    companies = localCompanies;
    showToast("Showing bundled demo data");
  }
  setupFilters();
  render();
  document.querySelector("#loadingMessage")?.remove();
}
[els.company, els.industry, els.country].forEach(select => select.addEventListener("change", render));
document.querySelector("#clearBtn").addEventListener("click", clearFilters);
document.querySelector("#emptyClear").addEventListener("click", clearFilters);
document.querySelector("#scrollLeft").addEventListener("click", () => els.viewport.scrollBy({left:-480,behavior:"smooth"}));
document.querySelector("#scrollRight").addEventListener("click", () => els.viewport.scrollBy({left:480,behavior:"smooth"}));
loadCompanies();
