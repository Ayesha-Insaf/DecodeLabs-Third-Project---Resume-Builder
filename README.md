# Resume Builder with Live Preview

## How to run
Just open `index.html` in any browser. No build tools or server required.

## Folder Structure
```
resume-builder/
│
├── index.html          
├── css/
│   └── style.css       
├── js/
│   └── script.js       
```

## Features 
- **Buttons/toggles**: Theme switcher (Classic/Modern/Minimal), Add Skill, Add Experience, Clear All, Print
- **Basic user interaction**: typing in form fields, clicking buttons, pressing Enter to add a skill
- **Dynamic content update**: resume preview re-renders live as you type or add/remove items

## Concepts demonstrated
- IPO loop (Input → Process → Output) on every interaction
- State management via a single `resumeData` object
- `addEventListener` for all interactivity
- `classList` toggling for theme switching and active button state
- `document.createElement` / `appendChild` for dynamically generated skill tags and experience entries
- `textContent` used everywhere (never `innerHTML` for user data) to avoid XSS
- `js-` prefix for JS hooks, `is-` prefix for state classes
- `localStorage` persistence so data survives a page refresh
- Print-friendly CSS (`@media print`) to export/save as PDF

## Possible extensions
- Drag-to-reorder skills/experience
- Multiple resume profiles saved in localStorage
- Export as actual PDF via a library
- Profile photo upload (FileReader API)