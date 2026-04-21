// ── Theme ────────────────────────────────────────────────────────────────────
(function() {
  const saved = localStorage.getItem('jf_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const html = document.documentElement;

  function updateIcon(theme) {
    if (icon) {
      icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
    }
  }
  updateIcon(html.getAttribute('data-theme'));

  if (btn) {
    btn.addEventListener('click', function() {
      const curr = html.getAttribute('data-theme');
      const next = curr === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('jf_theme', next);
      updateIcon(next);
    });
  }

  // ── Live score calculator ────────────────────────────────────────────────
  const taskInputs = document.querySelectorAll('.jf-task-input');
  const liveScore = document.getElementById('liveScore');
  const livePercent = document.getElementById('livePercent');
  const liveBar = document.getElementById('liveBar');
  const errorInput = document.getElementById('error_points');
  const multiplierInput = document.getElementById('multiplier');

  function recalc() {
    let sum = 0;
    taskInputs.forEach(inp => {
      const v = parseFloat(inp.value) || 0;
      sum += Math.min(Math.max(v, 0), 10); // clamp 0-10
    });
    const err = parseFloat(errorInput ? errorInput.value : 0) || 0;
    const mul = parseFloat(multiplierInput ? multiplierInput.value : 1) || 1;
    const result = Math.max(0, (sum - err) * mul);
    const pct = Math.min(100, (result / 30) * 100).toFixed(2);
    if (liveScore) liveScore.textContent = result.toFixed(2);
    if (livePercent) livePercent.textContent = pct + '%';
    if (liveBar) liveBar.style.width = pct + '%';
  }

  taskInputs.forEach(inp => inp.addEventListener('input', recalc));
  if (errorInput) errorInput.addEventListener('input', recalc);
  if (multiplierInput) multiplierInput.addEventListener('input', recalc);
  recalc();

  // ── Add judge modal ───────────────────────────────────────────────────────
  const addJudgeForm = document.getElementById('addJudgeForm');
  if (addJudgeForm) {
    addJudgeForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const data = {
        name: document.getElementById('judgeNameInput').value.trim(),
        position: document.getElementById('judgePositionInput').value.trim()
      };
      if (!data.name) return;
      const compId = addJudgeForm.dataset.comp;
      const res = await fetch(`/competition/${compId}/add-judge`, {
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)
      });
      if (res.ok) { location.reload(); }
    });
  }

  // ── Add rider modal ───────────────────────────────────────────────────────
  const addRiderForm = document.getElementById('addRiderForm');
  if (addRiderForm) {
    addRiderForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const data = {
        name: document.getElementById('riderNameInput').value.trim(),
        horse: document.getElementById('riderHorseInput').value.trim(),
        licence: document.getElementById('riderLicenceInput').value.trim(),
        category: document.getElementById('riderCategoryInput').value.trim(),
        start_number: parseInt(document.getElementById('riderStartInput').value) || 0,
        email: document.getElementById('riderEmailInput').value.trim(),
        phone: document.getElementById('riderPhoneInput').value.trim()
      };
      if (!data.name) return;
      const compId = addRiderForm.dataset.comp;
      const res = await fetch(`/competition/${compId}/add-rider`, {
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)
      });
      if (res.ok) { location.reload(); }
    });
  }

  // ── Add category ─────────────────────────────────────────────────────────
  const addCatForm = document.getElementById('addCategoryForm');
  if (addCatForm) {
    addCatForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const name = document.getElementById('newCategoryInput').value.trim();
      if (!name) return;
      const compId = addCatForm.dataset.comp;
      const res = await fetch(`/competition/${compId}/add-category`, {
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name})
      });
      if (res.ok) { location.reload(); }
    });
  }

  // ── Add licence ───────────────────────────────────────────────────────────
  const addLicForm = document.getElementById('addLicenceForm');
  if (addLicForm) {
    addLicForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const name = document.getElementById('newLicenceInput').value.trim();
      if (!name) return;
      const compId = addLicForm.dataset.comp;
      const res = await fetch(`/competition/${compId}/add-licence`, {
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name})
      });
      if (res.ok) { location.reload(); }
    });
  }

  // ── Export form filters ───────────────────────────────────────────────────
  function buildExportUrl(format) {
    const params = new URLSearchParams(window.location.search);
    const detailed = document.getElementById('exportDetailed')?.checked ? '1' : '0';
    params.set('detailed', detailed);
    const compId = document.getElementById('exportBtn')?.dataset.comp;
    if (!compId) return '#';
    return `/competition/${compId}/export/${format}?${params.toString()}`;
  }

  const excelBtn = document.getElementById('exportExcel');
  const pdfBtn = document.getElementById('exportPdf');
  if (excelBtn) excelBtn.addEventListener('click', () => { window.location = buildExportUrl('excel'); });
  if (pdfBtn) pdfBtn.addEventListener('click', () => { window.location = buildExportUrl('pdf'); });
});
