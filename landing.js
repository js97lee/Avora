(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const mountAurora = (canvas) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = 0;
    let height = 0;
    let raf = 0;
    let t = 0;

    const resize = () => {
      const stage = canvas.parentElement;
      if (!stage) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = stage.clientWidth;
      height = stage.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawRibbon = (time, opts) => {
      const { y, amp, thick, hue, alpha, speed, phase } = opts;
      ctx.beginPath();
      for (let x = -40; x <= width + 40; x += 8) {
        const n1 = Math.sin((x * 0.0045) + time * speed + phase);
        const n2 = Math.sin((x * 0.011) - time * (speed * 0.7) + phase * 1.4);
        const yy = y + n1 * amp + n2 * (amp * 0.35);
        if (x === -40) ctx.moveTo(x, yy);
        else ctx.lineTo(x, yy);
      }
      ctx.strokeStyle = `hsla(${hue}, 85%, 62%, ${alpha})`;
      ctx.lineWidth = thick;
      ctx.lineCap = "round";
      ctx.stroke();
    };

    const frame = () => {
      t += 0.016;
      ctx.clearRect(0, 0, width, height);

      const glow = ctx.createRadialGradient(
        width * 0.5,
        height * 0.72,
        20,
        width * 0.5,
        height * 0.72,
        Math.max(width, height) * 0.55
      );
      glow.addColorStop(0, "rgba(124, 58, 237, 0.28)");
      glow.addColorStop(0.45, "rgba(59, 130, 246, 0.12)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.filter = "blur(18px)";
      drawRibbon(t, { y: height * 0.68, amp: 42, thick: 54, hue: 268, alpha: 0.28, speed: 0.9, phase: 0.2 });
      drawRibbon(t, { y: height * 0.72, amp: 34, thick: 42, hue: 250, alpha: 0.24, speed: 1.1, phase: 1.4 });
      drawRibbon(t, { y: height * 0.76, amp: 28, thick: 34, hue: 210, alpha: 0.18, speed: 0.75, phase: 2.2 });
      drawRibbon(t, { y: height * 0.7, amp: 20, thick: 18, hue: 290, alpha: 0.2, speed: 1.35, phase: 0.8 });
      ctx.restore();

      if (!reduceMotion) raf = requestAnimationFrame(frame);
    };

    resize();
    frame();
    window.addEventListener("resize", () => {
      resize();
      if (reduceMotion) frame();
    });
  };

  document.querySelectorAll("[data-aurora]").forEach(mountAurora);

  const toastHost = document.getElementById("avoraToastHost");
  let toastTimer = 0;

  const showToast = (message, { tone = "warn" } = {}) => {
    if (!toastHost) return;
    toastHost.innerHTML = "";
    const toast = document.createElement("div");
    toast.className = `avora-toast is-${tone}`;
    toast.setAttribute("role", "status");
    toast.innerHTML = `
      <span class="avora-toast-icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <circle cx="12" cy="12" r="9"/>
          <path d="M12 8v5"/>
          <path d="M12 16.5h.01"/>
        </svg>
      </span>
      <p class="avora-toast-msg">${message}</p>
      <button type="button" class="avora-toast-close" aria-label="닫기">×</button>
    `;
    toastHost.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("is-in"));

    const dismiss = () => {
      toast.classList.remove("is-in");
      toast.classList.add("is-out");
      window.setTimeout(() => toast.remove(), 220);
    };
    toast.querySelector(".avora-toast-close")?.addEventListener("click", dismiss);
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(dismiss, 3200);
  };

  const promptForm = document.getElementById("storyPromptForm");
  const prompt = document.getElementById("storyPrompt");

  promptForm?.addEventListener("submit", (event) => {
    const value = (prompt?.value || "").trim();
    if (!value) {
      event.preventDefault();
      showToast("이 입력칸을 입력해 주세요.");
      prompt?.focus();
      promptForm.classList.add("is-invalid");
      window.setTimeout(() => promptForm.classList.remove("is-invalid"), 600);
      return;
    }
    if (prompt) prompt.value = value;
  });

  document.querySelectorAll(".prompt-chip, .inspire-card").forEach((chip) => {
    chip.addEventListener("click", () => {
      if (!prompt) return;
      prompt.value = chip.getAttribute("data-prompt") || chip.textContent.trim();
      prompt.focus();
    });
  });

  const formatInput = document.getElementById("storyFormat");
  const avatarInput = document.getElementById("storyAvatar");
  const avatarToggle = document.getElementById("avatarToggle");
  const formatPicker = document.getElementById("formatPicker");
  const formatTrigger = document.getElementById("formatTrigger");
  const formatMenu = formatPicker?.querySelector(".format-menu");
  const formatLabel = formatTrigger?.querySelector(".format-trigger-label");
  const iconReels = formatTrigger?.querySelector(".format-icon-reels");
  const iconWide = formatTrigger?.querySelector(".format-icon-16x9");

  if (avatarToggle) {
    avatarToggle.addEventListener("click", () => {
      const on = avatarToggle.getAttribute("aria-pressed") !== "true";
      avatarToggle.setAttribute("aria-pressed", on ? "true" : "false");
      avatarToggle.classList.toggle("is-on", on);
      avatarToggle.title = on ? "아바타 사용" : "아바타 미사용";
      if (avatarInput) avatarInput.value = on ? "1" : "0";
    });
  }

  const setFormatOpen = (open) => {
    if (!formatPicker || !formatTrigger || !formatMenu) return;
    formatPicker.classList.toggle("is-open", open);
    formatTrigger.setAttribute("aria-expanded", open ? "true" : "false");
    formatMenu.hidden = !open;
  };

  const applyFormat = (format, label) => {
    if (formatInput) formatInput.value = format;
    if (formatLabel) formatLabel.textContent = label;
    if (iconReels && iconWide) {
      iconReels.hidden = format !== "reels";
      iconWide.hidden = format !== "16x9";
    }
    formatPicker?.querySelectorAll(".format-option").forEach((opt) => {
      const active = opt.getAttribute("data-format") === format;
      opt.classList.toggle("is-active", active);
      opt.setAttribute("aria-selected", active ? "true" : "false");
    });
  };

  if (formatTrigger && formatMenu) {
    formatTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      setFormatOpen(formatMenu.hidden);
    });

    formatMenu.querySelectorAll(".format-option").forEach((opt) => {
      opt.addEventListener("click", (e) => {
        e.stopPropagation();
        applyFormat(opt.getAttribute("data-format") || "reels", opt.getAttribute("data-label") || "Reels");
        setFormatOpen(false);
      });
    });

    document.addEventListener("click", (e) => {
      if (!formatPicker.contains(e.target)) setFormatOpen(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setFormatOpen(false);
    });
  }

  document.querySelectorAll("[data-reel]").forEach((card) => {
    const video = card.querySelector("video");
    const toggle = card.querySelector(".reel-toggle");
    if (!video || !toggle) return;

    const sync = () => {
      card.classList.toggle("is-paused", video.paused);
      toggle.setAttribute("aria-label", video.paused ? "재생" : "일시정지");
    };

    toggle.addEventListener("click", async () => {
      if (video.paused) {
        try {
          await video.play();
        } catch (_) {
          /* autoplay policies */
        }
      } else {
        video.pause();
      }
      sync();
    });

    video.addEventListener("play", sync);
    video.addEventListener("pause", sync);
    sync();
  });
})();
