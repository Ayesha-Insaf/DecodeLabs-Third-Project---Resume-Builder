// =====================================================
// STATE (Phase 2: State Management — the single source of truth)
// =====================================================
const resumeData = {
  name: "",
  title: "",
  email: "",
  phone: "",
  summary: "",
  skills: [],       // array of strings
  experience: [],   // array of { role, company, duration }
  theme: "classic"
};

// =====================================================
// DOM REFERENCES (Targeting nodes — Wiring the Nerves)
// =====================================================
const nameInput      = document.querySelector('.js-name-input');
const jobTitleInput   = document.querySelector('.js-jobtitle-input');
const emailInput      = document.querySelector('.js-email-input');
const phoneInput      = document.querySelector('.js-phone-input');
const summaryInput    = document.querySelector('.js-summary-input');

const skillInput      = document.querySelector('.js-skill-input');
const addSkillBtn     = document.querySelector('.js-add-skill');

const expRoleInput     = document.querySelector('.js-exp-role');
const expCompanyInput  = document.querySelector('.js-exp-company');
const expDurationInput = document.querySelector('.js-exp-duration');
const addExpBtn         = document.querySelector('.js-add-exp');

const themeButtons    = document.querySelectorAll('.js-theme-btn');
const clearAllBtn     = document.querySelector('.js-clear-all');
const printBtn        = document.querySelector('.js-print-btn');

const previewCard      = document.querySelector('.js-resume-preview');
const previewAvatar    = document.querySelector('.js-preview-avatar');
const previewName      = document.querySelector('.js-preview-name');
const previewTitle     = document.querySelector('.js-preview-title');
const previewEmail     = document.querySelector('.js-preview-email');
const previewPhone     = document.querySelector('.js-preview-phone');
const previewSummary   = document.querySelector('.js-preview-summary');
const previewSkills    = document.querySelector('.js-preview-skills');
const previewExperience = document.querySelector('.js-preview-experience');

// =====================================================
// LOCAL STORAGE PERSISTENCE
// =====================================================
const STORAGE_KEY = 'resumeBuilderData';

// =====================================================
// SAVE TOAST — quietly confirms localStorage persistence
// =====================================================
const saveToast = document.createElement('div');
saveToast.className = 'save-toast';
saveToast.textContent = '✓ Saved';
document.body.appendChild(saveToast);

let toastTimeout = null;
let toastDebounce = null;
function flashSaveToast() {
  clearTimeout(toastDebounce);
  toastDebounce = setTimeout(() => {
    saveToast.classList.add('is-visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      saveToast.classList.remove('is-visible');
    }, 1100);
  }, 400);
}

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
    flashSaveToast();
  } catch (err) {
    console.error('Could not save resume data:', err);
  }
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    Object.assign(resumeData, parsed);

    // Reflect loaded state back into form inputs
    nameInput.value = resumeData.name;
    jobTitleInput.value = resumeData.title;
    emailInput.value = resumeData.email;
    phoneInput.value = resumeData.phone;
    summaryInput.value = resumeData.summary;
  } catch (err) {
    console.error('Could not load resume data:', err);
  }
}

// =====================================================
// PHASE 3: OUTPUT — render the preview from state
// =====================================================
function renderPreview() {
  // Basic fields (textContent only — never innerHTML, for XSS safety)
  previewName.textContent    = resumeData.name || "Your Name";
  previewTitle.textContent   = resumeData.title || "Your Job Title";
  previewEmail.textContent   = resumeData.email || "you@email.com";
  previewPhone.textContent   = resumeData.phone || "+00 000 0000";
  previewSummary.textContent = resumeData.summary || "Your professional summary will appear here as you type...";
  previewAvatar.textContent  = getInitials(resumeData.name);

  renderSkills();
  renderExperience();
  saveToStorage();
}

// Builds 1-2 letter initials from a full name, e.g. "Ayesha Khan" -> "AK"
function getInitials(fullName) {
  const trimmed = (fullName || '').trim();
  if (trimmed === '') return 'YN'; // fallback: "Your Name"

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function renderSkills() {
  previewSkills.innerHTML = ''; // safe: clearing before inserting our own created nodes

  if (resumeData.skills.length === 0) {
    const placeholder = document.createElement('span');
    placeholder.className = 'skill-placeholder';
    placeholder.textContent = 'No skills added yet';
    previewSkills.appendChild(placeholder);
    return;
  }

  resumeData.skills.forEach((skill, index) => {
    const tag = document.createElement('span');
    tag.className = 'skill-tag';

    const label = document.createElement('span');
    label.textContent = skill;

    const removeBtn = document.createElement('span');
    removeBtn.className = 'remove-skill';
    removeBtn.textContent = '✕';
    removeBtn.addEventListener('click', () => {
      resumeData.skills.splice(index, 1);
      renderPreview();
    });

    tag.appendChild(label);
    tag.appendChild(removeBtn);
    previewSkills.appendChild(tag);
  });
}

function renderExperience() {
  previewExperience.innerHTML = '';

  if (resumeData.experience.length === 0) {
    const placeholder = document.createElement('p');
    placeholder.className = 'exp-placeholder';
    placeholder.textContent = 'No experience added yet';
    previewExperience.appendChild(placeholder);
    return;
  }

  resumeData.experience.forEach((exp, index) => {
    const entry = document.createElement('div');
    entry.className = 'exp-entry';

    const roleLine = document.createElement('div');
    roleLine.className = 'exp-role';
    roleLine.textContent = exp.role;

    const removeBtn = document.createElement('span');
    removeBtn.className = 'remove-exp';
    removeBtn.textContent = '✕ remove';
    removeBtn.addEventListener('click', () => {
      resumeData.experience.splice(index, 1);
      renderPreview();
    });
    roleLine.appendChild(removeBtn);

    const companyLine = document.createElement('div');
    companyLine.className = 'exp-company';
    companyLine.textContent = exp.company;

    const durationLine = document.createElement('div');
    durationLine.className = 'exp-duration';
    durationLine.textContent = exp.duration;

    entry.appendChild(roleLine);
    entry.appendChild(companyLine);
    entry.appendChild(durationLine);
    previewExperience.appendChild(entry);
  });
}

// =====================================================
// PHASE 1: INPUT — event listeners (the IPO loop in action)
// =====================================================

nameInput.addEventListener('input', (e) => {
  resumeData.name = e.target.value;
  renderPreview();
});

jobTitleInput.addEventListener('input', (e) => {
  resumeData.title = e.target.value;
  renderPreview();
});

emailInput.addEventListener('input', (e) => {
  resumeData.email = e.target.value;
  renderPreview();
});

phoneInput.addEventListener('input', (e) => {
  resumeData.phone = e.target.value;
  renderPreview();
});

summaryInput.addEventListener('input', (e) => {
  resumeData.summary = e.target.value;
  renderPreview();
});

// ---- Skills ----
function addSkill() {
  const value = skillInput.value.trim();
  if (value === '') return; // basic validation, no empty tags

  resumeData.skills.push(value);
  skillInput.value = '';
  skillInput.focus();
  renderPreview();
}

addSkillBtn.addEventListener('click', addSkill);

skillInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addSkill();
  }
});

// ---- Experience ----
function addExperience() {
  const role = expRoleInput.value.trim();
  const company = expCompanyInput.value.trim();
  const duration = expDurationInput.value.trim();

  if (role === '' || company === '') return; // basic validation

  resumeData.experience.push({ role, company, duration });

  expRoleInput.value = '';
  expCompanyInput.value = '';
  expDurationInput.value = '';

  renderPreview();
}

addExpBtn.addEventListener('click', addExperience);

// ---- Theme switching (classList.toggle pattern from the brief) ----
themeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const selectedTheme = btn.dataset.theme;
    resumeData.theme = selectedTheme;

    // Update preview card theme class
    previewCard.className = 'resume-card theme-' + selectedTheme + ' js-resume-preview';

    // Update active state on buttons (is- prefix convention)
    themeButtons.forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');

    saveToStorage();
  });
});

// ---- Clear All ----
clearAllBtn.addEventListener('click', () => {
  const confirmed = confirm('This will clear all resume data. Continue?');
  if (!confirmed) return;

  resumeData.name = '';
  resumeData.title = '';
  resumeData.email = '';
  resumeData.phone = '';
  resumeData.summary = '';
  resumeData.skills = [];
  resumeData.experience = [];

  nameInput.value = '';
  jobTitleInput.value = '';
  emailInput.value = '';
  phoneInput.value = '';
  summaryInput.value = '';

  renderPreview();
});

// ---- Print / Save as PDF ----
printBtn.addEventListener('click', () => {
  window.print();
});

// =====================================================
// INIT — load saved data (if any) and render on page load
// =====================================================
loadFromStorage();
renderPreview();