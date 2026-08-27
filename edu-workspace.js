(() => {
  const BLANK = "assets/edu/blank.svg";
  const META = {
    background: { label: "배경", color: "var(--bg-c)", w: 176, h: 154 },
    character: { label: "캐릭터", color: "var(--char-c)", w: 176, h: 154 },
    camera: { label: "카메라 룩", color: "var(--cam-c)", w: 176, h: 154 },
    shot: { label: "샷", color: "var(--shot-c)", w: 200, h: 176 },
    audio: { label: "오디오", color: "var(--audio-c)", w: 176, h: 154 },
    output: { label: "출력", color: "var(--out-c)", w: 176, h: 154 },
  };
  const TITLES = {
    photo: "광합성 실험 가이드",
    campus: "캠퍼스 오리엔테이션",
    sejong: "세종, 한글을 만들다",
    math: "분수 개념 3분 컷",
    water: "물의 순환",
    new: "새 시나리오",
  };
  const boardId = new URLSearchParams(location.search).get("board") || "photo";
  const boardName = TITLES[boardId] || "광합성 실험 가이드";
  document.getElementById("boardName").textContent = boardName;
  document.title = `${boardName} · 아보라Edu`;

  const state = {
    tool: "select",
    selectedId: "shot-01",
    cam: { x: 48, y: 56, scale: 0.92 },
    linking: null,
    dragging: null,
    panning: false,
    nodes: [
      { id: "bg-lab", type: "background", title: "실험실 · 낮", note: "창가 자연광", x: 40, y: 40 },
      { id: "char-arin", type: "character", title: "선생님 아린", note: "설명형 페르소나", x: 40, y: 230 },
      { id: "cam-wide", type: "camera", title: "와이드", note: "24mm 트래킹", x: 40, y: 420 },
      { id: "shot-01", type: "shot", title: "햇빛이 잎에 닿을 때", note: "도입 질문", duration: 4, prompt: "실험실에서 아린이 잎을 들어 보이며 질문한다.", x: 320, y: 40 },
      { id: "shot-02", type: "shot", title: "빛과 물, 두 재료", note: "실험 세팅", duration: 6, prompt: "하준이 램프를 잎에 비춘다.", x: 580, y: 230 },
      { id: "shot-03", type: "shot", title: "산소 방울", note: "결론 컷", duration: 5, prompt: "잎 가장자리 기포 클로즈업.", x: 840, y: 230 },
      { id: "out-final", type: "output", title: "최종 시퀀스", note: "16:9 · 15초", x: 1100, y: 230 },
    ],
    edges: [
      { from: "bg-lab", to: "shot-01" },
      { from: "char-arin", to: "shot-01" },
      { from: "cam-wide", to: "shot-01" },
      { from: "shot-01", to: "shot-02" },
      { from: "shot-02", to: "shot-03" },
      { from: "shot-03", to: "out-final" },
    ],
    comments: {
      "shot-01": [{ who: "하린", text: "질문 자막을 하단 중앙으로." }],
      "shot-03": [{ who: "민재", text: "기포가 더 잘 보이게 매크로로." }],
    },
  };

  const world = document.getElementById("world");
  const canvas = document.getElementById("canvas");
  const edgesSvg = document.getElementById("edges");
  const zoomLabel = document.getElementById("zoomLabel");
  const nodeById = (id) => state.nodes.find((n) => n.id === id);
  const uid = (p) => `${p}-${Math.random().toString(36).slice(2, 6)}`;
  const sizeOf = (n) => META[n.type];

  const applyCam = () => {
    const { x, y, scale } = state.cam;
    world.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    zoomLabel.textContent = `${Math.round(scale * 100)}%`;
    drawEdges();
  };
  const bezier = (x1, y1, x2, y2) => {
    const dx = Math.max(48, Math.abs(x2 - x1) * 0.42);
    return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
  };
  const portWorld = (n, which) => {
    const { w, h } = sizeOf(n);
    return { x: which === "out" ? n.x + w : n.x, y: n.y + h / 2 };
  };
  const drawEdges = () => {
    const { x, y, scale } = state.cam;
    const paths = state.edges.map((e) => {
      const a = nodeById(e.from);
      const b = nodeById(e.to);
      if (!a || !b) return "";
      const p1 = portWorld(a, "out");
      const p2 = portWorld(b, "in");
      return `<path class="edge" d="${bezier(p1.x * scale + x, p1.y * scale + y, p2.x * scale + x, p2.y * scale + y)}" />`;
    });
    if (state.linking?.preview) {
      const p = state.linking.preview;
      paths.push(`<path class="edge-preview" d="${bezier(p.x1, p.y1, p.x2, p.y2)}" />`);
    }
    edgesSvg.innerHTML = paths.join("");
  };

  const shotOrder = () => {
    const shots = state.nodes.filter((n) => n.type === "shot");
    const next = {};
    state.edges.forEach((e) => {
      const a = nodeById(e.from);
      const b = nodeById(e.to);
      if (a?.type === "shot" && b?.type === "shot") next[a.id] = b.id;
    });
    const targets = new Set(Object.values(next));
    let cur = shots.find((s) => !targets.has(s.id));
    const ordered = [];
    const seen = new Set();
    while (cur && !seen.has(cur.id)) {
      ordered.push(cur);
      seen.add(cur.id);
      cur = nodeById(next[cur.id]);
    }
    shots.forEach((s) => { if (!seen.has(s.id)) ordered.push(s); });
    return ordered;
  };

  const renderNodes = () => {
    world.innerHTML = state.nodes.map((n) => {
      const m = META[n.type];
      return `<article class="node node-${n.type} ${n.id === state.selectedId ? "is-selected" : ""}" data-id="${n.id}" style="left:${n.x}px;top:${n.y}px">
        <button class="port in" data-port="in" data-id="${n.id}"></button>
        <button class="port out" data-port="out" data-id="${n.id}"></button>
        <div class="node-head" style="color:${m.color}"><span>${m.label}</span>${n.duration ? `<span>${n.duration}s</span>` : ""}</div>
        <div class="thumb"><img src="${BLANK}" alt="Blank"></div>
        <div class="node-copy"><h3>${n.title}</h3><p>${n.note}</p></div>
      </article>`;
    }).join("");
  };

  const renderLibrary = () => {
    document.getElementById("libraryList").innerHTML = state.nodes
      .filter((n) => n.type !== "output")
      .map((n) => `<button type="button" class="lib-item ${n.id === state.selectedId ? "is-active" : ""}" data-focus="${n.id}">
        <span class="dot dot-${n.type === "background" ? "bg" : n.type === "character" ? "char" : n.type === "camera" ? "cam" : n.type === "audio" ? "audio" : "shot"}"></span>${n.title}
      </button>`).join("");
  };

  const incoming = (id) => state.edges.filter((e) => e.to === id).map((e) => nodeById(e.from)).filter(Boolean);

  const renderInspector = () => {
    const n = nodeById(state.selectedId);
    if (!n) return;
    document.getElementById("inspKicker").textContent = META[n.type].label;
    document.getElementById("inspTitle").textContent = n.title;
    const attached = incoming(n.id);
    document.getElementById("inspBody").innerHTML = `
      <label class="field"><span>이름</span><input id="inspName" value="${n.title}"></label>
      ${n.type === "shot" ? `<label class="field"><span>길이 (초)</span><input id="inspDur" type="number" value="${n.duration || 4}"></label>
        <label class="field"><span>샷 프롬프트</span><textarea id="inspPrompt">${n.prompt || ""}</textarea></label>` : `<label class="field"><span>메모</span><textarea id="inspNote">${n.note || ""}</textarea></label>`}
      <div class="field"><span>연결된 노드</span><div class="chip-row">${attached.length ? attached.map((a) => `<span class="chip">${META[a.type].label} · ${a.title}</span>`).join("") : `<span class="chip">없음</span>`}</div></div>
      <div class="field"><span>코멘트</span>${(state.comments[n.id] || [{ who: "지수", text: "이 노드에 코멘트를 남겨 보세요." }]).map((c) => `<div class="comment"><strong>${c.who}</strong><p>${c.text}</p></div>`).join("")}</div>
    `;
    document.getElementById("inspName")?.addEventListener("input", (e) => { n.title = e.target.value; renderAll(); });
    document.getElementById("inspDur")?.addEventListener("input", (e) => { n.duration = Number(e.target.value) || 4; renderAll(); });
    document.getElementById("inspPrompt")?.addEventListener("input", (e) => { n.prompt = e.target.value; });
    document.getElementById("inspNote")?.addEventListener("input", (e) => { n.note = e.target.value; renderNodes(); });
  };

  const renderTimeline = () => {
    const shots = shotOrder();
    const total = shots.reduce((s, n) => s + (n.duration || 4), 0);
    document.getElementById("tlMeta").textContent = `${total}초 · ${shots.length}샷`;
    document.getElementById("tlTrack").innerHTML = shots.map((n) => `
      <button type="button" class="tl-clip ${n.id === state.selectedId ? "is-active" : ""}" data-focus="${n.id}">
        <b>${n.duration}s</b><span>${n.title}</span>
      </button>`).join("");
  };

  const renderStory = () => {
    const shots = shotOrder();
    document.getElementById("storyGrid").innerHTML = shots.map((n, i) => `
      <article class="story-card" data-focus="${n.id}">
        <div class="thumb"><img src="${BLANK}" alt=""></div>
        <div class="node-copy"><h3>SHOT 0${i + 1} · ${n.title}</h3><p>${n.prompt || n.note}</p></div>
      </article>`).join("");
    document.getElementById("playerShots").innerHTML = shots.map((n, i) => `
      <button type="button" class="player-shot" data-focus="${n.id}">
        <img src="${BLANK}" alt=""><p>0${i + 1}. ${n.title}</p>
      </button>`).join("");
    const shot = nodeById(state.selectedId)?.type === "shot" ? nodeById(state.selectedId) : shots[0];
    if (shot) {
      document.getElementById("playerTitle").textContent = shot.title;
      document.getElementById("playerBadge").textContent = shot.id.replace("shot-", "SHOT ");
    }
  };

  const renderAll = () => {
    renderNodes();
    renderLibrary();
    renderInspector();
    renderTimeline();
    renderStory();
    applyCam();
  };

  const selectNode = (id) => {
    state.selectedId = id;
    renderAll();
  };

  const spawn = (type) => {
    const titles = { background: "새 배경", character: "새 캐릭터", camera: "새 카메라 룩", shot: "새 샷", audio: "새 오디오" };
    state.nodes.push({
      id: uid(type.slice(0, 2)),
      type,
      title: titles[type],
      note: "캔버스에 추가됨",
      duration: type === "shot" ? 4 : undefined,
      prompt: type === "shot" ? "장면 설명을 적어 주세요." : undefined,
      x: (160 - state.cam.x) / state.cam.scale,
      y: (100 - state.cam.y) / state.cam.scale,
    });
    state.selectedId = state.nodes.at(-1).id;
    renderAll();
  };

  const connect = (from, to) => {
    if (!from || !to || from === to) return;
    if (state.edges.some((e) => e.from === from && e.to === to)) return;
    state.edges.push({ from, to });
    drawEdges();
    renderInspector();
    renderTimeline();
  };

  document.querySelectorAll("[data-tool]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.tool = btn.dataset.tool;
      document.querySelectorAll("[data-tool]").forEach((b) => b.classList.toggle("is-active", b === btn));
    });
  });
  document.querySelectorAll("[data-spawn]").forEach((btn) => {
    btn.addEventListener("click", () => spawn(btn.dataset.spawn));
  });
  document.querySelectorAll(".view-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".view-tab").forEach((t) => t.classList.toggle("is-active", t === tab));
      document.querySelectorAll("[data-view-panel]").forEach((p) => {
        const on = p.dataset.viewPanel === tab.dataset.view;
        p.hidden = !on;
      });
    });
  });

  canvas.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".node") || e.target.closest(".port")) return;
    if (state.tool === "pan") {
      state.panning = { x: e.clientX - state.cam.x, y: e.clientY - state.cam.y };
    }
  });
  world.addEventListener("pointerdown", (e) => {
    const port = e.target.closest(".port");
    const card = e.target.closest(".node");
    if (port) {
      const n = nodeById(port.dataset.id);
      const p = portWorld(n, port.dataset.port);
      state.linking = {
        startPort: port.dataset.port,
        startId: n.id,
        preview: { x1: p.x * state.cam.scale + state.cam.x, y1: p.y * state.cam.scale + state.cam.y, x2: e.clientX, y2: e.clientY },
      };
      e.preventDefault();
      return;
    }
    if (card) {
      selectNode(card.dataset.id);
      const n = nodeById(card.dataset.id);
      state.dragging = {
        id: n.id,
        dx: e.clientX - (n.x * state.cam.scale + state.cam.x),
        dy: e.clientY - (n.y * state.cam.scale + state.cam.y),
      };
    }
  });
  window.addEventListener("pointermove", (e) => {
    if (state.linking) {
      state.linking.preview.x2 = e.clientX;
      state.linking.preview.y2 = e.clientY;
      document.querySelectorAll(".port").forEach((p) => p.classList.toggle("is-hot", p === document.elementFromPoint(e.clientX, e.clientY)?.closest(".port")));
      drawEdges();
      return;
    }
    if (state.dragging) {
      const n = nodeById(state.dragging.id);
      n.x = (e.clientX - state.dragging.dx - state.cam.x) / state.cam.scale;
      n.y = (e.clientY - state.dragging.dy - state.cam.y) / state.cam.scale;
      const el = world.querySelector(`[data-id="${n.id}"]`);
      if (el) { el.style.left = `${n.x}px`; el.style.top = `${n.y}px`; }
      drawEdges();
      return;
    }
    if (state.panning) {
      state.cam.x = e.clientX - state.panning.x;
      state.cam.y = e.clientY - state.panning.y;
      applyCam();
    }
  });
  window.addEventListener("pointerup", (e) => {
    if (state.linking) {
      const port = document.elementFromPoint(e.clientX, e.clientY)?.closest(".port");
      if (port) {
        const s = state.linking;
        if (s.startPort === "out" && port.dataset.port === "in") connect(s.startId, port.dataset.id);
        if (s.startPort === "in" && port.dataset.port === "out") connect(port.dataset.id, s.startId);
      }
      state.linking = null;
      drawEdges();
    }
    state.dragging = null;
    state.panning = false;
  });
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const wx = (mx - state.cam.x) / state.cam.scale;
    const wy = (my - state.cam.y) / state.cam.scale;
    const next = Math.min(1.5, Math.max(0.5, state.cam.scale * (e.deltaY > 0 ? 0.92 : 1.08)));
    state.cam.scale = next;
    state.cam.x = mx - wx * next;
    state.cam.y = my - wy * next;
    applyCam();
  }, { passive: false });

  document.getElementById("zoomIn").onclick = () => { state.cam.scale = Math.min(1.5, state.cam.scale * 1.1); applyCam(); };
  document.getElementById("zoomOut").onclick = () => { state.cam.scale = Math.max(0.5, state.cam.scale * 0.9); applyCam(); };
  document.getElementById("zoomFit").onclick = () => { state.cam = { x: 48, y: 56, scale: 0.92 }; applyCam(); };
  document.addEventListener("click", (e) => {
    const focus = e.target.closest("[data-focus]");
    if (focus) selectNode(focus.dataset.focus);
  });

  const shareModal = document.getElementById("shareModal");
  document.getElementById("shareBtn").onclick = () => { shareModal.hidden = false; };
  document.getElementById("closeShare").onclick = () => { shareModal.hidden = true; };
  document.getElementById("copyLink").onclick = async () => {
    try { await navigator.clipboard.writeText(document.getElementById("shareLink").value); } catch {}
  };

  const genModal = document.getElementById("genModal");
  const startGen = () => {
    genModal.hidden = false;
    document.getElementById("closeGen").hidden = true;
    let w = 8;
    const fill = document.getElementById("genFill");
    const st = document.getElementById("genStatus");
    const steps = ["노드 정렬…", "이미지 생성…", "시퀀스 합성…", "완료"];
    let i = 0;
    const t = setInterval(() => {
      w = Math.min(100, w + 20);
      fill.style.width = `${w}%`;
      st.textContent = steps[Math.min(i, steps.length - 1)];
      i += 1;
      if (w >= 100) { clearInterval(t); document.getElementById("closeGen").hidden = false; }
    }, 360);
  };
  document.getElementById("generateBtn").onclick = startGen;
  document.getElementById("tlGenerate").onclick = startGen;
  document.getElementById("closeGen").onclick = () => { genModal.hidden = true; };

  renderAll();
})();
