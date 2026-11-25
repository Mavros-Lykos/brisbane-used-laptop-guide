(function () {
  "use strict";

  var THEME_KEY = "brisbane-guide-theme";
  var CHECK_KEY = "brisbane-guide-checklist";

  function applyTheme(theme) {
    var t = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-bs-theme", t);
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem(THEME_KEY, t);
    var label = document.getElementById("theme-toggle-label");
    var icon = document.querySelector(".theme-toggle-icon");
    if (label) {
      label.textContent = t === "dark" ? "Light mode" : "Dark mode";
    }
    if (icon) {
      icon.textContent = t === "dark" ? "☀️" : "🌙";
    }
    var btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.setAttribute("aria-pressed", t === "dark" ? "true" : "false");
    }
  }

  function initTheme() {
    var stored = localStorage.getItem(THEME_KEY);
    var theme = stored === "dark" || stored === "light" ? stored : "light";
    applyTheme(theme);
    var btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        var current = document.documentElement.getAttribute("data-theme");
        applyTheme(current === "dark" ? "light" : "dark");
      });
    }
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