(() => {
  document.querySelectorAll("[data-history-back]").forEach((button) => {
    button.addEventListener("click", (event) => {
      if (!document.referrer) return;
      try {
        if (new URL(document.referrer).origin !== location.origin || history.length <= 1) return;
        event.preventDefault();
        history.back();
      } catch {}
    });
  });
  const railHost = document.querySelector("[data-app-rail]");
  if (!railHost) return;

  const page = railHost.getAttribute("data-app-rail") || "boards";
  const tab = new URLSearchParams(location.search).get("tab") || "";
  const on = (id) => {
    if (id === "folders") return page === "boards" && tab !== "trash" ? " is-on" : "";
    if (id === "trash") return page === "boards" && tab === "trash" ? " is-on" : "";
    return "";
  };
  const aria = (id) => (on(id) ? ' aria-current="page"' : "");

  let me = null;
  try { me = JSON.parse(localStorage.getItem("avora.nodeSignedIn") || "null"); } catch {}
  const meEmail = me?.email || "";
  const meName = meEmail.split("@")[0] || "계정";
  const meMark = (meEmail[0] || "A").toUpperCase();

  railHost.classList.add("app-rail");
  railHost.innerHTML = `
    <button class="rail-plus" type="button" id="railPlusBtn" title="새 폴더" aria-label="새 폴더 만들기">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
    </button>
    <nav class="rail-nav" aria-label="작업 메뉴">
      <a class="rail-item${on("folders")}" href="boards.html"${aria("folders")} title="폴더" aria-label="폴더">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
      </a>
      <a class="rail-item${on("trash")}" href="boards.html?tab=trash"${aria("trash")} title="휴지통" aria-label="휴지통">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>
      </a>
    </nav>
    <div class="rail-foot">
      <button class="rail-me" type="button" id="railMeBtn" title="${meName} · 나" aria-label="내 계정">
        <span class="avatar a-purple" data-account-mark>${meMark}</span>
      </button>
      <div class="rail-me-pop" id="railMePop" hidden>
        <p data-account-name>${meName}</p>
        <span data-account-email>${meEmail}</span>
        <em>로그인됨</em>
        <button type="button" data-logout>로그아웃</button>
      </div>
    </div>
  `;

  document.getElementById("railPlusBtn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (typeof window.avoraCreateFolder === "function") {
      window.avoraCreateFolder();
      return;
    }
    location.href = "boards.html?create=1";
  });

  const railMeBtn = document.getElementById("railMeBtn");
  const railMePop = document.getElementById("railMePop");
  railMeBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (railMePop) railMePop.hidden = !railMePop.hidden;
  });
  railMePop?.addEventListener("click", (e) => {
    if (e.target.closest("[data-logout]")) return;
    e.stopPropagation();
  });
  document.addEventListener("click", () => {
    if (railMePop) railMePop.hidden = true;
  });

  const search = document.getElementById("libSearch");
  const cards = [...document.querySelectorAll("[data-name]")];
  const empty = document.getElementById("libEmpty");
  const end = document.getElementById("libEnd");
  const driveGrid = document.getElementById("driveFolderGrid");
  if (search && !driveGrid) {
    search.addEventListener("input", () => {
      const q = search.value.trim().toLowerCase();
      let n = 0;
      cards.forEach((c) => {
        const onCard = !q || (c.dataset.name || "").toLowerCase().includes(q);
        c.hidden = !onCard;
        if (onCard) n += 1;
      });
      if (empty) empty.hidden = n > 0;
      if (end) end.hidden = n === 0;
    });
  }

  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const key = group.getAttribute("data-filter-group");
    group.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-filter]");
      if (!btn) return;
      group.querySelectorAll("[data-filter]").forEach((b) => b.classList.toggle("is-on", b === btn));
      const val = btn.getAttribute("data-filter");
      document.querySelectorAll(`[data-${key}]`).forEach((card) => {
        card.hidden = val !== "all" && card.getAttribute(`data-${key}`) !== val;
      });
    });
  });
})();
