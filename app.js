(function () {
  "use strict";

  var THEME_KEY = "brisbane-guide-theme";
  var CHECK_KEY = "brisbane-guide-checklist";

  var THEMES = {
    light: { label: "Light", hint: "Default · easy reading", mode: "light", swatch: ["#f8f9fa", "#0d6efd", "#212529"] },
    dark: { label: "Dark", hint: "Low glare at night", mode: "dark", swatch: ["#212529", "#6ea8fe", "#dee2e6"] },
    midnight: { label: "Midnight", hint: "Deep blue · cyan accents", mode: "dark", swatch: ["#0f172a", "#38bdf8", "#e2e8f0"] },
    ocean: { label: "Ocean", hint: "Calm teal · daytime", mode: "light", swatch: ["#ecf8f6", "#0d9488", "#134e4a"] },
    forest: { label: "Forest", hint: "Green · outdoor feel", mode: "light", swatch: ["#f1f8f2", "#2d6a4f", "#1b4332"] },
    dusk: { label: "Dusk", hint: "Purple · evening", mode: "dark", swatch: ["#1e1b2e", "#a78bfa", "#ede9fe"] },
    paper: { label: "Paper", hint: "Warm sepia · print-like", mode: "light", swatch: ["#faf7f2", "#b45309", "#44403c"] },
    contrast: { label: "High contrast", hint: "Accessibility", mode: "light", swatch: ["#ffffff", "#0000cc", "#000000"] }
  };

  function isValidTheme(id) {
    return Object.prototype.hasOwnProperty.call(THEMES, id);
  }

  function applyTheme(themeId) {
    var id = isValidTheme(themeId) ? themeId : "light";
    var meta = THEMES[id];
    document.documentElement.setAttribute("data-theme", id);
    document.documentElement.setAttribute("data-bs-theme", meta.mode);
    localStorage.setItem(THEME_KEY, id);

    document.querySelectorAll(".theme-option").forEach(function (btn) {
      var active = btn.getAttribute("data-theme-id") === id;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    var current = document.getElementById("theme-menu-current");
    if (current) current.textContent = meta.label;

    var trigger = document.getElementById("theme-menu-trigger");
    if (trigger) trigger.setAttribute("aria-label", "Theme: " + meta.label + ". Open theme menu");
  }

  function buildThemeMenu() {
    var grid = document.getElementById("theme-grid");
    if (!grid) return;

    Object.keys(THEMES).forEach(function (id) {
      var t = THEMES[id];
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "theme-option";
      btn.setAttribute("data-theme-id", id);
      btn.setAttribute("aria-pressed", "false");

      var sw = document.createElement("div");
      sw.className = "theme-option-swatch";
      t.swatch.forEach(function (c) {
        var span = document.createElement("span");
        span.style.background = c;
        sw.appendChild(span);
      });

      var label = document.createElement("span");
      label.className = "theme-option-label";
      label.textContent = t.label;

      var hint = document.createElement("span");
      hint.className = "theme-option-hint";
      hint.textContent = t.hint;

      btn.appendChild(sw);
      btn.appendChild(label);
      btn.appendChild(hint);

      btn.addEventListener("click", function () {
        applyTheme(id);
      });

      grid.appendChild(btn);
    });
  }

  function initTheme() {
    var stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark" && !isValidTheme(stored)) stored = "dark";
    buildThemeMenu();
    applyTheme(isValidTheme(stored) ? stored : "light");
  }

  function loadChecks() {
    try {
      var raw = localStorage.getItem(CHECK_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveChecks(state) {
    localStorage.setItem(CHECK_KEY, JSON.stringify(state));
  }

  function initChecklist() {
    var list = document.getElementById("inspection-checklist");
    var progress = document.getElementById("checklist-progress");
    var clearBtn = document.getElementById("checklist-clear");
    if (!list) return;

    var items = list.querySelectorAll("[data-check-id]");
    var state = loadChecks();

    function renderItem(li) {
      var id = li.getAttribute("data-check-id");
      var done = !!state[id];
      li.classList.toggle("done", done);
      li.classList.toggle("list-group-item-success", done);
      var box = li.querySelector(".check-box");
      if (box) box.textContent = done ? "✓" : "";
      li.setAttribute("aria-checked", done ? "true" : "false");
    }

    function updateProgress() {
      if (!progress) return;
      var n = 0;
      items.forEach(function (li) {
        if (state[li.getAttribute("data-check-id")]) n++;
      });
      progress.textContent = n + " / " + items.length + " checked";
    }

    items.forEach(function (li) {
      li.setAttribute("role", "checkbox");
      li.setAttribute("tabindex", "0");
      renderItem(li);
      function toggle() {
        var id = li.getAttribute("data-check-id");
        state[id] = !state[id];
        saveChecks(state);
        renderItem(li);
        updateProgress();
      }
      li.addEventListener("click", toggle);
      li.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      });
    });
    updateProgress();

    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        state = {};
        saveChecks(state);
        items.forEach(renderItem);
        updateProgress();
      });
    }
  }

  function init() {
    initTheme();
    initChecklist();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();