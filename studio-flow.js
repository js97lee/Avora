(() => {
  const labels = [
    "프로젝트",
    "프로젝트 기획",
    "페르소나",
    "시트",
    "스토리보드",
    "컷씬",
    "오디오",
    "영상",
    "합치기",
  ];
  const steps = Array.from(document.querySelectorAll(".flow-step"));
  const pages = Array.from(document.querySelectorAll(".flow-page"));
  const prev = document.getElementById("flowPrev");
  const next = document.getElementById("flowNext");
  const footerLabel = document.getElementById("flowFooterLabel");
  const flowFooter = document.querySelector(".flow-footer");
  const studio = document.getElementById("studio");
  const chatToggle = document.getElementById("chatToggle");
  const lnbItems = Array.from(document.querySelectorAll(".ws-lnb-item"));
  const chatInput = document.getElementById("chatInput");
  const chatForm = document.getElementById("chatForm");
  const chatHead = document.getElementById("chatHead");
  const lnb = document.getElementById("workspaceLnb");
  const flowSubnav = document.getElementById("flowSubnav");
  const flowNav = document.querySelector(".flow-nav");
  const flowBack = document.getElementById("flowBack");
  const flowStepRoot = document.getElementById("flowStepRoot");
  const flowListTitle = document.getElementById("flowListTitle");
  const driveListPanel = document.getElementById("driveListPanel");
  const projectLibrary = document.getElementById("projectLibrary");
  const PROJECT_ID_KEY = "avora.activeProjectId";
  const PROJECT_NAME_KEY = "avora.activeProjectName";
  let current = 0;
  let generatingTimer = 0;
  let activeProjectId = sessionStorage.getItem(PROJECT_ID_KEY) || "";
  let activeProjectName = sessionStorage.getItem(PROJECT_NAME_KEY) || "";

  const inProject = () => Boolean(activeProjectId);

  const setAgentGenerating = (busy) => {
    if (chatHead) chatHead.classList.toggle("is-generating", Boolean(busy));
  };

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const swapPanels = (hideEl, showEl, { forward = true } = {}) => {
    const runShow = () => {
      if (!showEl) return;
      showEl.hidden = false;
      showEl.classList.remove("is-panel-out", "is-panel-out-back");
      showEl.classList.add(forward ? "is-panel-prep" : "is-panel-prep-back");
      // force reflow
      void showEl.offsetWidth;
      showEl.classList.add("is-panel-in");
      showEl.classList.remove("is-panel-prep", "is-panel-prep-back");
      window.setTimeout(() => showEl.classList.remove("is-panel-in"), 280);
    };

    if (!hideEl || hideEl.hidden) {
      runShow();
      return;
    }

    if (prefersReducedMotion) {
      hideEl.hidden = true;
      hideEl.classList.remove("is-panel-out", "is-panel-out-back", "is-panel-in", "is-panel-prep", "is-panel-prep-back");
      runShow();
      return;
    }

    hideEl.classList.add(forward ? "is-panel-out" : "is-panel-out-back");
    window.setTimeout(() => {
      hideEl.hidden = true;
      hideEl.classList.remove("is-panel-out", "is-panel-out-back", "is-panel-in", "is-panel-prep", "is-panel-prep-back");
      runShow();
    }, 180);
  };

  const syncProjectPanels = () => {
    const libraryOpen = inProject() && current === 0;
    const driveVisible = driveListPanel && !driveListPanel.hidden;
    const libraryVisible = projectLibrary && !projectLibrary.hidden;

    if (driveListPanel) driveListPanel.classList.remove("is-nested");

    if (libraryOpen) {
      if (!libraryVisible) {
        window.renderAvoraProjectLibrary?.(activeProjectId, activeProjectName);
        window.renderAvoraProcessCards?.(activeProjectId, activeProjectName);
        swapPanels(driveListPanel, projectLibrary, { forward: true });
      } else {
        window.renderAvoraProjectLibrary?.(activeProjectId, activeProjectName);
        window.renderAvoraProcessCards?.(activeProjectId, activeProjectName);
      }
    } else if (!inProject() && current === 0) {
      window.avoraDriveEnterFolder?.("root");
      if (!driveVisible) {
        swapPanels(projectLibrary, driveListPanel, { forward: false });
      } else if (projectLibrary && !projectLibrary.hidden) {
        swapPanels(projectLibrary, driveListPanel, { forward: false });
      } else if (projectLibrary) {
        projectLibrary.hidden = true;
      }
    } else {
      if (driveListPanel) driveListPanel.hidden = true;
      if (projectLibrary) projectLibrary.hidden = true;
    }
  };

  const syncDepthLock = () => {
    const inLib = inProject() && current === 0;
    const inProcess = inProject() && current >= 1;
    const inAny = inProject();
    const flowCrumb = document.getElementById("projectLibraryCrumb");

    if (flowNav) flowNav.classList.toggle("is-in-project", inAny);
    if (flowNav) flowNav.classList.toggle("is-library", inLib);
    if (flowSubnav) flowSubnav.classList.toggle("is-locked", !inProcess);
    if (flowStepRoot) flowStepRoot.hidden = true;
    if (flowListTitle) flowListTitle.hidden = inAny;
    if (flowBack) flowBack.hidden = true;
    if (flowCrumb) {
      flowCrumb.hidden = !inAny;
      const folderCrumb = document.getElementById("projectLibraryName");
      const folderCrumbLabel = document.getElementById("projectLibraryNameLabel");
      if (folderCrumb) {
        if (folderCrumbLabel && activeProjectName) folderCrumbLabel.textContent = activeProjectName;
        else if (activeProjectName) folderCrumb.textContent = activeProjectName;
        folderCrumb.classList.add("is-active");
        folderCrumb.classList.toggle("is-current", inLib);
        folderCrumb.setAttribute("aria-current", inLib ? "page" : "false");
      }
    }
    const activeCardTitle = document.getElementById("activeProjectCardTitle");
    if (activeCardTitle) {
      activeCardTitle.textContent = activeProjectName || "프로젝트";
    }
    // process cards re-rendered in syncProjectPanels
    if (lnb) {
      lnb.classList.toggle("is-locked", !inProcess);
      lnb.hidden = !inProcess;
      lnb.setAttribute("aria-disabled", inProcess ? "false" : "true");
      lnb.title = inProcess ? "" : "프로젝트 기획 단계에서 사용할 수 있습니다";
    }
    if (flowFooter) flowFooter.hidden = !inProcess;

    steps.forEach((step) => {
      const n = Number(step.getAttribute("data-step"));
      if (n === 0) {
        step.disabled = false;
        step.hidden = true;
        return;
      }
      step.disabled = !inProcess;
      step.classList.toggle("is-active", n === current);
    });

    lnbItems.forEach((item) => {
      item.disabled = !inProcess;
      if (!inProcess) item.classList.remove("is-active");
    });

    syncProjectPanels();
    if (inProcess || inLib) {
      window.hydrateAvoraProjectTexts?.(activeProjectId, activeProjectName);
    }
  };

  const goTo = (index) => {
    let nextIndex = Math.max(0, Math.min(labels.length - 1, index));
    if (nextIndex > 0 && !inProject()) nextIndex = 0;

    current = nextIndex;
    steps.forEach((step) => {
      const n = Number(step.getAttribute("data-step"));
      step.classList.toggle("is-active", n === current);
      step.classList.toggle("is-done", inProject() ? n > 0 && n < current : false);
    });
    pages.forEach((page) => {
      const n = Number(page.getAttribute("data-page"));
      const active = n === current;
      page.hidden = !active;
      page.classList.toggle("is-active", active);
    });
    if (prev) {
      prev.disabled = current === 0 && !inProject();
    }
    if (next) {
      if (!inProject()) {
        next.disabled = true;
      } else if (current === 0) {
        next.disabled = false;
        next.textContent = "기획 시작 →";
      } else {
        next.disabled = current === labels.length - 1;
        next.textContent = current === labels.length - 1 ? "마지막 단계" : "다음 단계 →";
      }
    }
    if (footerLabel) {
      if (!inProject()) footerLabel.textContent = "프로젝트";
      else if (current === 0) footerLabel.textContent = `${activeProjectName || "프로젝트"} · 저장 데이터`;
      else footerLabel.textContent = `${current} / 8 · ${labels[current]}`;
    }
    syncDepthLock();
  };

  const enterProject = (projectId, { toStep = 0, name = "" } = {}) => {
    if (!projectId) return;
    activeProjectId = String(projectId);
    activeProjectName = name || activeProjectName || "프로젝트";
    sessionStorage.setItem(PROJECT_ID_KEY, activeProjectId);
    sessionStorage.setItem(PROJECT_NAME_KEY, activeProjectName);
    goTo(Math.max(0, Number(toStep) || 0));
  };

  const leaveProject = () => {
    activeProjectId = "";
    activeProjectName = "";
    sessionStorage.removeItem(PROJECT_ID_KEY);
    sessionStorage.removeItem(PROJECT_NAME_KEY);
    window.avoraDriveEnterFolder?.("root");
    goTo(0);
  };

  window.setAvoraAgentGenerating = setAgentGenerating;
  window.setAvoraProjectReady = (ready, projectId, name) => {
    if (ready) enterProject(projectId || activeProjectId || `project-${Date.now()}`, { name });
    else leaveProject();
  };
  window.enterAvoraProject = enterProject;
  window.leaveAvoraProject = leaveProject;
  window.getAvoraActiveProject = () => ({
    id: activeProjectId,
    name: activeProjectName,
  });

  window.addEventListener("avora:enter-project", (event) => {
    const id = event.detail && event.detail.id;
    const toStep = event.detail && event.detail.toStep;
    const name = (event.detail && event.detail.name) || "";
    if (id) enterProject(id, { toStep: toStep == null ? 0 : toStep, name });
  });

  steps.forEach((step) => {
    step.addEventListener("click", () => {
      const n = Number(step.getAttribute("data-step")) || 0;
      if (n === 0) {
        if (inProject()) goTo(0);
        else leaveProject();
        return;
      }
      if (!inProject() || step.disabled) return;
      goTo(n);
    });
  });
  flowBack?.addEventListener("click", () => {
    if (current >= 1) goTo(0);
    else leaveProject();
  });
  document.querySelector("[data-library-back]")?.addEventListener("click", () => {
    leaveProject();
  });
  document.getElementById("projectLibraryName")?.addEventListener("click", () => {
    if (!inProject()) return;
    if (current === 0) return;
    goTo(0);
  });
  prev?.addEventListener("click", () => {
    if (current <= 0) leaveProject();
    else if (current === 1) goTo(0);
    else goTo(current - 1);
  });
  next?.addEventListener("click", () => {
    if (!inProject()) return;
    if (current === 0) goTo(1);
    else goTo(current + 1);
  });

  chatToggle?.addEventListener("click", () => {
    const collapsed = studio?.classList.toggle("is-chat-collapsed");
    chatToggle.setAttribute("aria-expanded", String(!collapsed));
  });

  chatForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!inProject()) return;
    const text = (chatInput?.value || "").trim();
    if (!text) return;
    setAgentGenerating(true);
    window.clearTimeout(generatingTimer);
    generatingTimer = window.setTimeout(() => setAgentGenerating(false), 2400);
    if (chatInput) chatInput.value = "";
  });

  lnbItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (!inProject() || current < 1 || item.disabled) return;
      lnbItems.forEach((el) => el.classList.toggle("is-active", el === item));
      const prompt = item.getAttribute("data-prompt");
      if (chatInput && prompt) {
        chatInput.value = prompt;
        chatInput.focus();
      }
      const key = item.getAttribute("data-lnb");
      if (key === "character") goTo(2);
      else if (key === "video") goTo(7);
    });
  });

  syncDepthLock();
  if (inProject()) goTo(0);
  else goTo(0);
})();
