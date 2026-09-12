(() => {
  const BLANK = "assets/edu/blank.svg";
  const SIZE = {
    image: { w: 320, h: 468, portY: 188 },
    video: { w: 560, h: 520, portY: 188 },
    audio: { w: 320, h: 390, portY: 130 },
    text: { w: 320, h: 420, portY: 150 },
    upscale: { w: 420, h: 640, portY: 240 },
    edit: { w: 360, h: 520, portY: 188 },
    director: { w: 360, h: 430, portY: 180 },
    analyze: { w: 340, h: 400, portY: 160 },
    script: { w: 520, h: 620, portY: 200 },
    ref: { w: 320, h: 420, portY: 188 },
  };
  const NODE_TITLE = {
    text: "텍스트",
    image: "이미지",
    video: "비디오",
    audio: "오디오",
    edit: "스마트 편집",
    director: "디렉터 콘솔",
    analyze: "스마트 분석",
    script: "스크립트 생성기",
    ref: "참조 노드",
    upscale: "고화질",
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
  document.getElementById("boardName").textContent = TITLES[boardId] || TITLES.photo;
  document.title = `${TITLES[boardId] || TITLES.photo} · 아보라Edu`;

  const PROMPT = "실험실 창가에서 선생님이 잎을 들어 보이며 질문한다. 긴장된 표정, 차네 클로즈업에서 항공정면으로 전환, 35mm 필름, 사실적인 속도감과 모션 블러.";
  const IMG_PROMPT = "실험실 창가, 선생님이 잎을 들어 보이는 클로즈업, 사실적인 조명.";
  const TEXT_PROMPT = "광합성은 어떻게 일어날까?";
  const AUDIO_PROMPT = "잎이 빛을 받으면 양분을 만들어요.";
  const EDIT_PROMPT = "실험 자막만 남기고 배경 잡음을 줄여 주세요.";
  const SCRIPT_OUT = "선생님: 이 잎이 빛을 받으면 어떤 일이 생길까요?\n학생: 양분을 만들어요!\n선생님: 맞아요. 그걸 광합성이라고 합니다.";
  const STORY_DEFAULT = "실험실 창가에서 선생님이 잎을 들어 보이며 묻는다. 잎에 빛이 닿고, 학생들이 양분을 만든다고 대답한다.";
  const STORY_SHOTS = [
    { t: "오프닝", d: "2s", src: "assets/edu/shots/open.png", line: "선생님이 창가에서 잎을 들어 질문을 던진다." },
    { t: "핵심 클로즈업", d: "2s", src: "assets/edu/shots/leaf.png", line: "잎에 빛이 닿고 물이 움직인다." },
    { t: "반응", d: "2s", src: "assets/edu/shots/class.png", line: "학생들이 양분이라고 대답한다." },
    { t: "정리", d: "2s", src: "assets/edu/shots/idea.png", line: "빛·잎·양분이 한 장면으로 정리된다." },
  ];
  const SHOTS = [
    { t: "클로즈업", d: "2s" },
    { t: "항공정면", d: "2s" },
    { t: "컷어웨이", d: "1s" },
  ];
  const TRY_STORY = {
    script: "각본: 실험실 창가. 선생님이 잎을 들고 묻는다. \"이 잎이 빛을 받으면?\" 학생들이 양분이라고 답한다.",
    character: "캐릭터: 호기심 많은 하은과 선생님. 하은이 창가 화분의 잎을 관찰하다가 빛이 양분이 되는 순간을 발견한다.",
    write: "",
  };
  const LOOKS = {
    palette: [
      { id: "cyclic-green", name: "시클릭 그린", genre: "스릴러", shot: "open", pal: ["#0b3d2a", "#1a7a4c", "#3cb371", "#c6e35b", "#efe39a", "#142016"], overlay: "rgba(18,110,55,.55)", filter: "saturate(1.25) contrast(1.18) brightness(.92)" },
      { id: "cool-blue", name: "쿨 블루", genre: "느와르", shot: "class", pal: ["#071525", "#12344d", "#2a6a8a", "#7eb6d4", "#d7eef8", "#0b1020"], overlay: "rgba(20,70,120,.55)", filter: "saturate(1.1) contrast(1.2) brightness(.88)" },
      { id: "moon-blue", name: "문빛 블루", genre: "드라마", shot: "leaf", pal: ["#0b1c3a", "#1c4b7a", "#3d7cc0", "#8eb8ea", "#e8f3ff", "#152238"], overlay: "rgba(40,90,170,.5)", filter: "saturate(.95) contrast(1.12) brightness(.9)" },
      { id: "warm-gold", name: "웜 골드", genre: "서사", shot: "idea", pal: ["#3a230c", "#8a5a16", "#d4a017", "#f0d48a", "#fff4d2", "#2a1a0c"], overlay: "rgba(180,120,30,.48)", filter: "sepia(.25) saturate(1.2) contrast(1.1)" },
      { id: "cine-amber", name: "시네마틱 앰버", genre: "액션", shot: "open", pal: ["#2a1008", "#7a2e0c", "#d45a12", "#f0a040", "#ffe1b0", "#1a0c08"], overlay: "rgba(190,70,10,.55)", filter: "saturate(1.35) contrast(1.22) brightness(.9)" },
      { id: "crimson", name: "크림슨 패션", genre: "멜로", shot: "class", pal: ["#2a0a12", "#7a1428", "#c41e3a", "#e87878", "#f8d0d0", "#1a080c"], overlay: "rgba(160,20,40,.5)", filter: "saturate(1.3) contrast(1.15) hue-rotate(-8deg)" },
      { id: "pastel", name: "파스텔 드림", genre: "청춘", shot: "leaf", pal: ["#2a2448", "#5a4c8a", "#8a7cc4", "#c4b8e8", "#f0e8ff", "#1c1830"], overlay: "rgba(120,100,190,.42)", filter: "saturate(.85) contrast(.95) brightness(1.05)" },
      { id: "earth", name: "어스 톤", genre: "다큐", shot: "idea", pal: ["#2a2218", "#6a5438", "#a88858", "#d4c4a0", "#f4ecd8", "#1c1810"], overlay: "rgba(120,90,50,.45)", filter: "sepia(.35) saturate(.9) contrast(1.08)" },
      { id: "noir", name: "하이키 느와르", genre: "느와르", shot: "open", pal: ["#000", "#2a2a2a", "#6a6a6a", "#b0b0b0", "#fff", "#111"], overlay: "rgba(0,0,0,.2)", filter: "grayscale(1) contrast(1.35) brightness(.95)" },
      { id: "baroque", name: "바로크 레드", genre: "시대극", shot: "class", pal: ["#1a0808", "#5a1414", "#a02820", "#d4a04a", "#f8e8c8", "#140808"], overlay: "rgba(120,30,20,.5)", filter: "saturate(1.15) contrast(1.2) sepia(.2)" },
      { id: "diner", name: "웜 다이너", genre: "코미디", shot: "idea", pal: ["#2a1c10", "#6a4420", "#c47828", "#e8c070", "#70a070", "#1c140c"], overlay: "rgba(150,90,30,.4)", filter: "saturate(1.15) contrast(1.05) brightness(1.02)" },
      { id: "teal-orange", name: "틸 앤 오렌지", genre: "블록버스터", shot: "leaf", pal: ["#0c2a2a", "#1a6a6a", "#3cb0a0", "#e09040", "#f0d090", "#102020"], overlay: "rgba(20,90,90,.4)", filter: "saturate(1.28) contrast(1.18) hue-rotate(-8deg)" },
    ],
    light: [
      { id: "window-soft", name: "창가 소프트라이트", genre: "교육 드라마", shot: "open", pal: ["#1c2430", "#8ecae6", "#f0d2b0", "#fff"], overlay: "rgba(255,236,210,.18)", filter: "brightness(1.06) contrast(.98)" },
      { id: "golden-hour", name: "골든아워", genre: "서사", shot: "idea", pal: ["#3a220c", "#e09030", "#ffd166", "#fff3cc"], overlay: "rgba(255,160,40,.28)", filter: "brightness(1.08) saturate(1.2) contrast(1.05)" },
      { id: "moonlight", name: "문라이트", genre: "드라마", shot: "leaf", pal: ["#0b1c3a", "#3d7cc0", "#cfe3ff", "#fff"], overlay: "rgba(80,120,200,.28)", filter: "brightness(.86) contrast(1.18) saturate(.9)" },
      { id: "hard-spot", name: "하드 스포트", genre: "스릴러", shot: "class", pal: ["#000", "#222", "#f4d35e", "#fff"], overlay: "rgba(0,0,0,.25)", filter: "contrast(1.4) brightness(.88)" },
      { id: "overcast", name: "오버캐스트", genre: "다큐", shot: "open", pal: ["#2a3038", "#8a96a4", "#d0d6dc", "#fff"], overlay: "rgba(180,190,200,.2)", filter: "saturate(.7) brightness(1.04) contrast(.92)" },
      { id: "practical", name: "프랙티컬 램프", genre: "코미디", shot: "class", pal: ["#1a1208", "#c47828", "#ffe1a0", "#fff"], overlay: "rgba(255,180,80,.22)", filter: "brightness(1.02) saturate(1.1) contrast(1.08)" },
      { id: "backlight", name: "역광 실루엣", genre: "액션", shot: "open", pal: ["#0a0a0a", "#3a2a18", "#f0c070", "#fff"], overlay: "rgba(0,0,0,.3)", filter: "contrast(1.35) brightness(.82) saturate(1.1)" },
      { id: "fluorescent", name: "교실 형광등", genre: "교육", shot: "class", pal: ["#1c2420", "#9ae6b0", "#e8fff0", "#fff"], overlay: "rgba(180,255,210,.12)", filter: "brightness(1.1) saturate(.85) hue-rotate(20deg)" },
    ],
    art: [
      { id: "classroom", name: "현대 교실", genre: "교육 드라마", shot: "open", pal: ["#1a222c", "#9ec9e6", "#4b3a8c", "#f0d2b0"], overlay: "rgba(80,90,120,.12)", filter: "none" },
      { id: "lab", name: "실험실", genre: "사이언스", shot: "leaf", pal: ["#132016", "#3fa356", "#f4d35e", "#8fd3ff"], overlay: "rgba(40,80,50,.16)", filter: "saturate(1.1)" },
      { id: "minimal", name: "미니멀 세트", genre: "아트필름", shot: "idea", pal: ["#16141f", "#7c3aed", "#3fa356", "#f4d35e"], overlay: "rgba(40,30,70,.18)", filter: "saturate(.9) contrast(1.08)" },
      { id: "field-doc", name: "현장 다큐", genre: "다큐", shot: "class", pal: ["#1b1d28", "#3b82c4", "#c45c3b", "#f3c7a3"], overlay: "rgba(60,50,40,.14)", filter: "saturate(.8) contrast(1.05)" },
      { id: "fairytale", name: "동화 미술", genre: "아동", shot: "idea", pal: ["#241e33", "#ffd166", "#4caf5a", "#8b5cf6"], overlay: "rgba(140,90,180,.16)", filter: "saturate(1.25) brightness(1.05)" },
      { id: "period", name: "시대극 미술", genre: "시대극", shot: "open", pal: ["#2a1810", "#8a5a16", "#c41e3a", "#f8e8c8"], overlay: "rgba(90,50,20,.22)", filter: "sepia(.28) contrast(1.12)" },
    ],
  };
  const SHOT_SRC = {
    open: "assets/edu/shots/open.png",
    leaf: "assets/edu/shots/leaf.png",
    class: "assets/edu/shots/class.png",
    idea: "assets/edu/shots/idea.png",
    wide: "assets/edu/shots/wide.png",
    backlight: "assets/edu/shots/backlight.png",
    cutaway: "assets/edu/shots/cutaway.png",
    insert: "assets/edu/shots/insert.png",
  };

  const state = {
    selectedId: "sc-01",
    plusFrom: null,
    cam: { x: boardId === "new" ? 48 : 24, y: boardId === "new" ? 72 : 48, scale: boardId === "new" ? 0.78 : 0.42 },
    dragging: null,
    panning: false,
    coach: boardId === "new" ? -1 : 0,
    look: { tab: "palette", palette: null, light: null, art: null },
    groups: boardId === "new" ? [
      { id: "g1", no: "01", title: "기획 · 톤과 장르", x: 8, y: 0, w: 560, h: 700 },
    ] : [
      { id: "g1", no: "01", title: "기획 · 톤과 장르", x: 8, y: 0, w: 560, h: 700 },
      { id: "g2", no: "02", title: "스토리보드", x: 596, y: 0, w: 680, h: 700 },
      { id: "g3", no: "03", title: "샷 변형", x: 1308, y: 0, w: 520, h: 900 },
      { id: "g4", no: "04", title: "영상", x: 1860, y: 0, w: 720, h: 700 },
    ],
    nodes: boardId === "new" ? [
      { id: "sc-01", type: "script", title: "스크립트 생성기", x: 40, y: 48, ready: false, prompt: "" },
    ] : [
      { id: "sc-01", type: "script", title: "스크립트 생성기", x: 40, y: 48, ready: false, prompt: "" },
      { id: "img-s1", type: "image", compact: true, title: "이미지", x: 624, y: 48, ready: true, shot: "오프닝", src: "assets/edu/shots/open.png", prompt: IMG_PROMPT },
      { id: "img-s2", type: "image", compact: true, title: "이미지", x: 772, y: 48, ready: true, shot: "핵심 클로즈업", src: "assets/edu/shots/leaf.png", prompt: "잎에 빛이 닿는 클로즈업" },
      { id: "img-s3", type: "image", compact: true, title: "이미지", x: 920, y: 48, ready: true, shot: "반응", src: "assets/edu/shots/class.png", prompt: "학생들이 대답한다" },
      { id: "img-s4", type: "image", compact: true, title: "이미지", x: 1068, y: 48, ready: true, shot: "정리", src: "assets/edu/shots/idea.png", prompt: "빛·잎·양분 한 컷" },
      { id: "img-v1", type: "image", compact: true, title: "이미지", x: 1344, y: 48, ready: true, shot: "와이드", src: "assets/edu/shots/wide.png", prompt: "같은 장면 와이드" },
      { id: "img-v2", type: "image", compact: true, title: "이미지", x: 1492, y: 48, ready: true, shot: "역광", src: "assets/edu/shots/backlight.png", prompt: "역광 실루엣" },
      { id: "img-v3", type: "image", compact: true, title: "이미지", x: 1344, y: 228, ready: true, shot: "컷어웨이", src: "assets/edu/shots/cutaway.png", prompt: "학생 컷어웨이" },
      { id: "img-v4", type: "image", compact: true, title: "이미지", x: 1492, y: 228, ready: true, shot: "인서트", src: "assets/edu/shots/insert.png", prompt: "개념 인서트" },
      { id: "vid-01", type: "video", title: "비디오", x: 1896, y: 48, ready: false, prompt: PROMPT },
    ],
    edges: boardId === "new" ? [] : [
      { from: "sc-01", to: "img-s1" },
      { from: "sc-01", to: "img-s2" },
      { from: "sc-01", to: "img-s3" },
      { from: "sc-01", to: "img-s4" },
      { from: "img-s2", to: "img-v1" },
      { from: "img-s2", to: "img-v2" },
      { from: "img-s2", to: "img-v3" },
      { from: "img-s2", to: "img-v4" },
      { from: "img-s1", to: "vid-01" },
      { from: "img-v1", to: "vid-01" },
    ],
  };

  const world = document.getElementById("world");
  const canvas = document.getElementById("canvas");
  const edgesSvg = document.getElementById("edges");
  const addMenu = document.getElementById("addMenu");
  const coachEl = document.getElementById("coach");
  const framePop = document.getElementById("framePop");
  const nodeById = (id) => state.nodes.find((n) => n.id === id);
  const uid = (p) => `${p}-${Math.random().toString(36).slice(2, 6)}`;
  const sizeOf = (n) => {
    if (n.compact && (n.type === "image" || n.type === "ref")) return { w: 132, h: 158, portY: 68 };
    return SIZE[n.type] || SIZE.image;
  };
  const veil = (n) => n.busy ? `<div class="busy-veil"><span class="spin"></span><p>${n.busy}</p></div>` : "";
  const sendBtn = (n) => `
    <button class="send-btn" type="button" data-run="generate" data-id="${n.id}" ${n.busy ? "disabled" : ""}>
      ${n.busy ? `<span class="spin spin-sm"></span>` : "↑"}
    </button>`;
  const lookBy = (tab, id) => (LOOKS[tab] || []).find((x) => x.id === id);
  const activeLooks = () => ["palette", "light", "art"].map((tab) => lookBy(tab, state.look[tab])).filter(Boolean);
  const lookLine = () => {
    const items = activeLooks();
    if (!items.length) return "";
    const names = items.map((x) => x.name);
    const genre = items.find((x) => x.genre)?.genre;
    return genre ? `${names.join(" · ")} · ${genre}` : names.join(" · ");
  };
  const palDots = (look) => (look?.pal || []).map((c) => `<i style="background:${c}"></i>`).join("");
  const applyLookCss = () => {
    const app = document.querySelector(".app");
    const items = activeLooks();
    app.classList.toggle("has-look", items.length > 0);
    const pal = lookBy("palette", state.look.palette);
    const light = lookBy("light", state.look.light);
    const art = lookBy("art", state.look.art);
    app.style.setProperty("--look-filter", [pal?.filter, light?.filter, art?.filter].filter((x) => x && x !== "none").join(" ") || "none");
    app.style.setProperty("--look-overlay", pal?.overlay || "transparent");
    app.style.setProperty("--look-light", light?.overlay || "transparent");
  };
  const lookModal = document.getElementById("lookModal");
  const lookGrid = document.getElementById("lookGrid");
  const renderLookGrid = () => {
    const tab = state.look.tab;
    const selected = state.look[tab];
    document.querySelectorAll("[data-look-tab]").forEach((b) => b.classList.toggle("is-on", b.dataset.lookTab === tab));
    lookGrid.innerHTML = LOOKS[tab].map((look) => `
      <button type="button" class="look-card ${selected === look.id ? "is-on" : ""}" data-pick-look="${look.id}">
        <div class="look-still" style="--card-overlay:${look.overlay};--card-filter:${look.filter}">
          <img src="${SHOT_SRC[look.shot]}" alt="">
          <span class="look-grade"></span>
          <span class="look-apply">적용</span>
        </div>
        <div class="look-pal">${palDots(look)}</div>
        <b>${look.name}</b>
        <em>${look.genre}</em>
      </button>`).join("");
  };

  const STEPS = [
    { text: "먼저 비주얼 스타일로 톤과 장르를 잡고, 이야기를 적으면 같은 색감의 이미지가 붙습니다.", hint: "look" },
    { text: "「비디오」노드를 선택하세요.", hint: "menu" },
    { text: "이 이미지로 첫 번째 영상을 만들어 보세요. 크레딧은 필요하지 않습니다.", hint: "send" },
    { text: "고화질 노드로 이어 해상도를 올려 보세요.", hint: "enhance" },
  ];

  let placeCursors = () => {};

  const applyCam = () => {
    const { x, y, scale } = state.cam;
    world.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    canvas.style.backgroundPosition = `${x}px ${y}px`;
    canvas.style.backgroundSize = `${22 * scale}px ${22 * scale}px`;
    document.getElementById("zoomLabel").textContent = `${Math.round(scale * 100)}%`;
    drawEdges();
    placeMenu();
    placeCoach();
    placeCursors();
  };

  const portWorld = (n, which) => {
    const s = sizeOf(n);
    return { x: which === "out" ? n.x + s.w : n.x, y: n.y + s.portY };
  };

  const bezier = (x1, y1, x2, y2) => {
    const dx = Math.max(40, Math.abs(x2 - x1) * 0.45);
    return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
  };

  const drawEdges = () => {
    const { x, y, scale } = state.cam;
    const paths = state.edges.map((e) => {
      const a = nodeById(e.from);
      const b = nodeById(e.to);
      if (!a || !b) return "";
      const p1 = portWorld(a, "out");
      const p2 = portWorld(b, "in");
      const d = bezier(p1.x * scale + x, p1.y * scale + y, p2.x * scale + x, p2.y * scale + y);
      const live = !!(a.busy || b.busy);
      return `<path class="edge${live ? " is-live" : ""}" d="${d}" />`;
    }).join("");
    edgesSvg.innerHTML = paths;
  };

  const imageHTML = (n) => n.compact ? `
    <article class="node node-thumb" data-id="${n.id}" style="left:${n.x}px;top:${n.y}px">
      <div class="media media-thumb ${n.ready ? "" : "media-empty"}">
        ${veil(n)}
        ${n.ready ? `<img src="${n.src || BLANK}" alt=""><span class="look-wash"></span>` : ""}
      </div>
      <span class="thumb-label">${n.shot || n.title || "이미지"}</span>
      <button class="plus-btn" type="button" data-plus="${n.id}">+</button>
    </article>` : `
    <article class="node node-image" data-id="${n.id}" style="left:${n.x}px;top:${n.y}px">
      <div class="node-meta"><span>이미지${n.shot ? ` · ${n.shot}` : ""}</span><span>${n.size || "350 × 350"}</span></div>
      <div class="media media-sq ${n.ready ? "" : "media-empty"}">
        ${veil(n)}
        ${n.ready ? `<img src="${n.src || BLANK}" alt=""><span class="look-wash"></span>` : `<span>프롬프트로 이미지 생성</span>`}
      </div>
      ${lookLine() ? `<div class="look-strip"><span class="look-dots">${palDots(lookBy("palette", state.look.palette) || lookBy("light", state.look.light))}</span><em>${lookLine()}</em></div>` : ""}
      <div class="prompt-dock narrow">
        <textarea data-prompt="${n.id}" placeholder="이미지 설명">${n.prompt || ""}</textarea>
        <div class="prompt-foot"><span>이미지 · 1:1</span>${sendBtn(n)}</div>
      </div>
      <button class="plus-btn" type="button" data-plus="${n.id}">+</button>
    </article>`;

  const videoHTML = (n) => `
    <article class="node node-video" data-id="${n.id}" style="left:${n.x}px;top:${n.y}px">
      <div class="node-meta"><span>▶ 비디오 ${n.ready ? "노드 1" : ""}</span></div>
      ${n.ready ? `
        <div class="toolbar" data-bar="${n.id}">
          <button type="button" data-run="enhance" data-id="${n.id}">고화질</button>
          <button type="button" data-run="tool" data-id="${n.id}" data-label="구간 리메이크 중…">구간 리메이크</button>
          <button type="button" data-run="tool" data-id="${n.id}" data-label="분석 중…">스마트 분석</button>
          <button type="button" data-run="tool" data-id="${n.id}" data-label="자막 정리 중…">자동 자막 제거</button>
          <button type="button" data-run="tool" data-id="${n.id}" data-label="음성 분리 중…">음성 영상 분리</button>
          <button type="button" data-run="tool" data-id="${n.id}" data-label="피사체 제거 중…">피사체 제거</button>
          <button type="button" data-frame="${n.id}">현재 프레임 캡처</button>
        </div>` : ""}
      <div class="media media-wide ${n.ready ? "" : "media-empty"}">
        ${veil(n)}
        ${n.ready ? `<span class="ai-tag">AI</span><img src="${BLANK}" alt=""><span class="look-wash"></span><div class="player-ui"><span>▶</span><span>0:00</span><span class="bar"><span></span></span><span>0:05</span></div>` : `<span class="play-mark">▶</span>`}
      </div>
      <div class="prompt-dock">
        <div class="prompt-tools">
          <button class="chip" type="button">+ 참고</button>
          <button class="chip" type="button">표시</button>
          <button class="chip" type="button">특수효과</button>
          <button class="chip" type="button">캐릭터 라이브러리</button>
          <button class="chip" type="button">카메라 무빙</button>
        </div>
        <div class="prompt-body">
          <div class="ref-thumb"><img src="${BLANK}" alt=""></div>
          <textarea data-prompt="${n.id}">${n.prompt || ""}</textarea>
        </div>
        <div class="prompt-foot">
          <span>MiniMax H3 · 올인원 참조 · 16:9 · 5s</span>
          ${sendBtn(n)}
        </div>
      </div>
      <button class="plus-btn" type="button" data-plus="${n.id}">+</button>
    </article>`;

  const upscaleHTML = (n) => `
    <article class="node node-upscale" data-id="${n.id}" style="left:${n.x}px;top:${n.y}px">
      <div class="node-meta"><span>▶ 고화질${n.ready ? "(완료)" : "(1080P)"}</span></div>
      <div class="media media-up ${n.ready ? "" : "media-empty"}">
        ${veil(n)}
        ${n.ready ? `<img src="${BLANK}" alt=""><span class="ai-tag">4K</span>` : "파라미터를 설정해 고화질 비디오 생성"}
      </div>
      <div class="settings">
        <h3>비디오 고화질</h3>
        <label class="row"><span>모델 선택</span><select><option>Topazlabs</option></select></label>
        <div class="row"><span>해상도</span>
          <div class="seg-wrap">
            <button class="seg is-on" type="button">1080P</button>
            <button class="seg" type="button">2K</button>
            <button class="seg" type="button">4K</button>
          </div>
        </div>
        <label class="row"><span>프레임 보간</span><select><option>보간 없음</option></select></label>
        <label class="row"><span>슬로우 모션 배율</span><select><option>1x</option></select></label>
        <div class="settings-foot">
          <button class="go-btn" type="button" data-run="upscale" data-id="${n.id}" ${n.busy ? "disabled" : ""}>
            ${n.busy ? `<span class="spin spin-sm"></span>` : "⚡ 24"}
          </button>
        </div>
      </div>
      <button class="plus-btn" type="button" data-plus="${n.id}">+</button>
    </article>`;

  const textHTML = (n) => `
    <article class="node node-tool" data-id="${n.id}" style="left:${n.x}px;top:${n.y}px">
      <div class="node-meta"><span>텍스트</span><span>타이틀 카드</span></div>
      <div class="media media-text ${n.ready ? "is-ready" : "media-empty"}">
        ${veil(n)}
        ${n.ready ? `<p class="title-card">${n.prompt || TEXT_PROMPT}</p>` : `<span>수업 타이틀을 생성합니다</span>`}
      </div>
      <div class="prompt-dock narrow">
        <textarea data-prompt="${n.id}" placeholder="화면에 올릴 문장">${n.prompt || TEXT_PROMPT}</textarea>
        <div class="prompt-foot"><span>자막 · 타이틀</span>${sendBtn(n)}</div>
      </div>
      <button class="plus-btn" type="button" data-plus="${n.id}">+</button>
    </article>`;

  const audioHTML = (n) => `
    <article class="node node-tool" data-id="${n.id}" style="left:${n.x}px;top:${n.y}px">
      <div class="node-meta"><span>오디오</span><span>${n.ready ? "0:12" : "TTS"}</span></div>
      <div class="media media-audio ${n.ready ? "" : "media-empty"}">
        ${veil(n)}
        ${n.ready ? `<span class="wave"></span><span>▶ 선생님 보이스 · 0:12</span>` : `<span>내레이션을 생성합니다</span>`}
      </div>
      <div class="tool-chips">
        <button type="button" data-mode="teacher" data-node="${n.id}" class="${(n.mode || "teacher") === "teacher" ? "is-on" : ""}">선생님</button>
        <button type="button" data-mode="student" data-node="${n.id}" class="${n.mode === "student" ? "is-on" : ""}">학생</button>
      </div>
      <div class="prompt-dock narrow">
        <textarea data-prompt="${n.id}" placeholder="읽을 문장">${n.prompt || AUDIO_PROMPT}</textarea>
        <div class="prompt-foot"><span>보이스 · 한국어</span>${sendBtn(n)}</div>
      </div>
      <button class="plus-btn" type="button" data-plus="${n.id}">+</button>
    </article>`;

  const editHTML = (n) => `
    <article class="node node-tool" data-id="${n.id}" style="left:${n.x}px;top:${n.y}px">
      <div class="node-meta"><span>스마트 편집 <em>BETA</em></span></div>
      <div class="media media-sq ${n.ready ? "" : "media-empty"}">
        ${veil(n)}
        ${n.ready ? `<span class="ai-tag">EDIT</span><img src="${BLANK}" alt="">` : `<span>원본을 편집합니다</span>`}
      </div>
      <div class="tool-chips">
        <button type="button" data-mode="remake" data-node="${n.id}" class="${(n.mode || "remake") === "remake" ? "is-on" : ""}">구간 리메이크</button>
        <button type="button" data-mode="remove" data-node="${n.id}" class="${n.mode === "remove" ? "is-on" : ""}">피사체 제거</button>
        <button type="button" data-mode="caption" data-node="${n.id}" class="${n.mode === "caption" ? "is-on" : ""}">자막 정리</button>
      </div>
      <div class="prompt-dock narrow">
        <textarea data-prompt="${n.id}">${n.prompt || EDIT_PROMPT}</textarea>
        <div class="prompt-foot"><span>편집 적용</span>${sendBtn(n)}</div>
      </div>
      <button class="plus-btn" type="button" data-plus="${n.id}">+</button>
    </article>`;

  const directorHTML = (n) => `
    <article class="node node-tool" data-id="${n.id}" style="left:${n.x}px;top:${n.y}px">
      <div class="node-meta"><span>디렉터 콘솔 <em>NEW</em></span><span>3샷</span></div>
      <ol class="shot-list">
        ${(n.shots || SHOTS).map((s, i) => `
          <li class="shot-row">
            <div class="shot-thumb ${n.ready ? "" : "is-empty"}">${n.ready ? `<img src="${BLANK}" alt="">` : i + 1}</div>
            <div><b>샷 ${i + 1}</b><span>${s.t} · ${s.d}</span></div>
          </li>`).join("")}
      </ol>
      <div class="prompt-foot dock-pad">
        <span>시퀀스 구성</span>
        <button class="go-btn" type="button" data-run="sequence" data-id="${n.id}" ${n.busy ? "disabled" : ""}>
          ${n.busy ? `<span class="spin spin-sm"></span>` : "생성"}
        </button>
      </div>
      ${veil(n)}
      <button class="plus-btn" type="button" data-plus="${n.id}">+</button>
    </article>`;

  const analyzeHTML = (n) => `
    <article class="node node-tool" data-id="${n.id}" style="left:${n.x}px;top:${n.y}px">
      <div class="node-meta"><span>스마트 분석</span></div>
      <div class="analyze-box">
        ${veil(n)}
        ${n.ready ? `
          <p><b>5.0s</b> · 16:9 · 클로즈업</p>
          <p>핵심 동작: 잎을 들어 질문</p>
          <p>시선: 카메라 → 잎 → 학생</p>
          <p>권장 다음 샷: 실험 클로즈업</p>` : `<p class="muted-copy">연결된 노드를 읽고 샷 리듬을 제안합니다.</p>`}
      </div>
      <div class="prompt-foot dock-pad">
        <span>장면 리포트</span>
        <button class="go-btn" type="button" data-run="analyze" data-id="${n.id}" ${n.busy ? "disabled" : ""}>
          ${n.busy ? `<span class="spin spin-sm"></span>` : "분석"}
        </button>
      </div>
      <button class="plus-btn" type="button" data-plus="${n.id}">+</button>
    </article>`;

  const scriptHTML = (n) => `
    <article class="node node-script node-tool" data-id="${n.id}" style="left:${n.x}px;top:${n.y}px">
      <div class="node-meta"><span>스크립트 생성기</span><span>${lookLine() || "톤 · 장르"}</span></div>
      <div class="script-card ${n.ready ? "is-ready" : "is-empty"}">
        ${veil(n)}
        ${n.ready ? `
          <div class="story-grid">
            ${(n.shots || STORY_SHOTS).map((s) => `
              <figure>
                <div class="still-wrap"><img src="${s.src}" alt="${s.t}"><span class="look-wash"></span></div>
                <figcaption>${s.t}</figcaption>
              </figure>`).join("")}
          </div>` : `
          <div class="script-empty">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 6h16M4 12h16M4 18h10"/></svg>
            <p>시도:</p>
            <button type="button" data-try="script" data-node="${n.id}">각본으로 스토리보드 스크립트 생성</button>
            <button type="button" data-try="character" data-node="${n.id}">캐릭터로 스토리보드 스크립트 생성</button>
            <button type="button" data-try="write" data-node="${n.id}">직접 스토리보드 작성</button>
          </div>`}
      </div>
      <div class="prompt-dock story-dock">
        <div class="story-dock-top">
          <button class="chip" type="button">+ 참조 이미지</button>
          <button class="chip look-chip" type="button" data-open-look="1">${state.look.palette || state.look.light || state.look.art ? lookLine() : "비주얼 스타일"}</button>
        </div>
        <textarea data-prompt="${n.id}" placeholder="스토리 단편, 이야기를 설명하면 스토리보드 이미지를 만들어 드립니다">${n.prompt || ""}</textarea>
        <div class="story-dock-foot">
          <span class="model-chip">✦ Avora Director</span>
          <button class="bolt-btn" type="button" data-run="script" data-id="${n.id}" ${n.busy ? "disabled" : ""} aria-label="생성">
            ${n.busy ? `<span class="spin spin-sm"></span>` : `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h7l-1 8 10-14h-7z"/></svg>`}
          </button>
        </div>
      </div>
      <button class="plus-btn" type="button" data-plus="${n.id}">+</button>
    </article>`;

  const refHTML = (n) => `
    <article class="node node-image" data-id="${n.id}" style="left:${n.x}px;top:${n.y}px">
      <div class="node-meta"><span>참조 노드</span><span>${n.mode || "스타일"}</span></div>
      <div class="media media-sq ${n.ready ? "" : "media-empty"}">
        ${veil(n)}
        ${n.ready ? `<img src="${BLANK}" alt=""><span class="ai-tag">REF</span>` : `<span>캐릭터·배경·스타일 참조</span>`}
      </div>
      <div class="tool-chips">
        <button type="button" data-mode="character" data-node="${n.id}" class="${n.mode === "character" ? "is-on" : ""}">캐릭터</button>
        <button type="button" data-mode="bg" data-node="${n.id}" class="${n.mode === "bg" ? "is-on" : ""}">배경</button>
        <button type="button" data-mode="style" data-node="${n.id}" class="${(n.mode || "style") === "style" ? "is-on" : ""}">스타일</button>
      </div>
      <div class="prompt-foot dock-pad">
        <span>이 보드의 참조로 사용</span>
        <button class="go-btn" type="button" data-run="generate" data-id="${n.id}" ${n.busy ? "disabled" : ""}>
          ${n.busy ? `<span class="spin spin-sm"></span>` : "연결"}
        </button>
      </div>
      <button class="plus-btn" type="button" data-plus="${n.id}">+</button>
    </article>`;

  const simpleHTML = (n) => `
    <article class="node" data-id="${n.id}" style="left:${n.x}px;top:${n.y}px">
      <div class="node-meta"><span>${n.title}</span></div>
      <div class="media media-sq media-empty"><span>${n.title}</span></div>
      <button class="plus-btn" type="button" data-plus="${n.id}">+</button>
    </article>`;

  const renderGroups = () => (state.groups || []).map((g) => `
    <section class="board-group" data-group="${g.id}" style="left:${g.x}px;top:${g.y}px;width:${g.w}px;height:${g.h}px">
      <header>${g.no}: ${g.title}</header>
    </section>`).join("");

  const renderNodes = () => {
    world.innerHTML = renderGroups() + state.nodes.map((n) => {
      if (n.type === "image") return imageHTML(n);
      if (n.type === "video") return videoHTML(n);
      if (n.type === "upscale") return upscaleHTML(n);
      if (n.type === "text") return textHTML(n);
      if (n.type === "audio") return audioHTML(n);
      if (n.type === "edit") return editHTML(n);
      if (n.type === "director") return directorHTML(n);
      if (n.type === "analyze") return analyzeHTML(n);
      if (n.type === "script") return scriptHTML(n);
      if (n.type === "ref") return refHTML(n);
      return simpleHTML(n);
    }).join("");
  };

  const openMenu = (id, btn) => {
    state.plusFrom = id;
    addMenu.hidden = false;
    const r = btn.getBoundingClientRect();
    addMenu.style.left = `${r.right + 10}px`;
    addMenu.style.top = `${r.top - 24}px`;
    addMenu.querySelectorAll("button").forEach((b) => b.classList.toggle("is-hot", b.dataset.spawn === "video" && state.coach === 1));
  };

  const placeMenu = () => {
    if (addMenu.hidden || !state.plusFrom) return;
    const btn = world.querySelector(`[data-plus="${state.plusFrom}"]`);
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    addMenu.style.left = `${r.right + 10}px`;
    addMenu.style.top = `${Math.max(60, r.top - 24)}px`;
  };

  const placeCoach = () => {
    if (state.coach < 0) {
      coachEl.hidden = true;
      return;
    }
    coachEl.hidden = false;
    const step = STEPS[state.coach];
    if (!step) { coachEl.hidden = true; return; }
    document.getElementById("coachText").textContent = step.text;
    document.getElementById("coachStep").textContent = `${state.coach + 1}/4`;
    document.getElementById("coachPrev").hidden = state.coach === 0;
    let anchor = world.querySelector(`[data-plus="${state.selectedId || "sc-01"}"]`);
    if (state.coach === 0) {
      const r = canvas.getBoundingClientRect();
      coachEl.style.left = `${r.left + 16}px`;
      coachEl.style.top = "60px";
      return;
    }
    if (state.coach === 1 && !addMenu.hidden) anchor = addMenu;
    if (state.coach === 2) anchor = world.querySelector(".node-video [data-run='generate']") || anchor;
    if (state.coach === 3) anchor = world.querySelector("[data-run='enhance']") || world.querySelector(".node-upscale") || anchor;
    if (!anchor) { coachEl.style.left = "420px"; coachEl.style.top = "180px"; return; }
    const r = anchor.getBoundingClientRect();
    coachEl.style.left = `${Math.min(window.innerWidth - 300, r.right + 16)}px`;
    coachEl.style.top = `${Math.max(70, r.top - 10)}px`;
  };

  const renderAll = () => {
    renderNodes();
    applyLookCss();
    applyCam();
  };

  const storyboardFrom = (prompt) => {
    const story = (prompt || "").trim() || STORY_DEFAULT;
    return STORY_SHOTS.map((s) => ({
      ...s,
      prompt: `${story} — ${s.t}. ${s.line}${lookLine() ? ` / ${lookLine()}` : ""}`,
    }));
  };

  const spawnStoryImages = (src, shots) => {
    if (!(state.groups || []).some((g) => g.id === "g2")) {
      state.groups.push({ id: "g2", no: "02", title: "스토리보드", x: 596, y: 0, w: 680, h: 700 });
    }
    const kids = state.edges
      .filter((e) => e.from === src.id)
      .map((e) => nodeById(e.to))
      .filter((n) => n && n.type === "image");
    shots.forEach((shot, i) => {
      let node = kids[i];
      if (!node) {
        const id = uid("img");
        node = {
          id,
          type: "image",
          compact: true,
          title: "이미지",
          x: 624 + (i % 4) * 148,
          y: 48 + Math.floor(i / 4) * 176,
          prompt: shot.prompt,
          ready: false,
          src: shot.src,
          shot: shot.t,
        };
        state.nodes.push(node);
        state.edges.push({ from: src.id, to: id });
      } else {
        node.prompt = shot.prompt;
        node.src = shot.src;
        node.shot = shot.t;
        node.ready = false;
        node.compact = true;
      }
      window.setTimeout(() => startJob(node.id, "generate"), 280 + i * 420);
    });
  };

  const startJob = (id, kind, label) => {
    const n = nodeById(id);
    if (!n || n.busy) return;
    if (kind === "generate" && n.type === "script") kind = "script";
    const jobs = {
      generate: { label: "생성 중…", ms: 1300, fn: (x) => {
        x.ready = true;
        if (x.type === "image") {
          x.src = x.src || STORY_SHOTS[0].src;
        }
        if (x.type === "video" && state.coach === 2) state.coach = 3;
        if (x.type === "script") x.note = SCRIPT_OUT;
      } },
      sequence: { label: "시퀀스 구성 중…", ms: 1400, fn: (x) => { x.ready = true; } },
      analyze: { label: "분석 중…", ms: 1100, fn: (x) => { x.ready = true; } },
      script: { label: "스토리보드 생성 중…", ms: 1400, fn: (x) => {
        if (!x.prompt) x.prompt = STORY_DEFAULT;
        const shots = storyboardFrom(x.prompt);
        x.ready = true;
        x.shots = shots;
        x.note = shots.map((s, i) => `샷 ${i + 1}. ${s.t}\n${s.line}`).join("\n\n");
        spawnStoryImages(x, shots);
      } },
      upscale: { label: "고화질 변환 중…", ms: 1500, fn: (x) => { x.ready = true; } },
      tool: { label: label || "처리 중…", ms: 1000, fn: () => {} },
      enhance: { label: "고화질 연결 중…", ms: 900, fn: (x) => {
        if (state.nodes.some((q) => q.type === "upscale")) return;
        const nid = uid("up");
        state.nodes.push({ id: nid, type: "upscale", title: "고화질", x: x.x + 640, y: x.y, ready: false });
        state.edges.push({ from: x.id, to: nid });
      } },
    };
    const job = jobs[kind];
    if (!job) return;
    n.busy = job.label;
    renderAll();
    window.setTimeout(() => {
      const cur = nodeById(id);
      if (!cur) return;
      job.fn(cur);
      cur.busy = "";
      renderAll();
    }, job.ms);
  };

  const spawnFrom = (type) => {
    const src = nodeById(state.plusFrom);
    if (!src || !NODE_TITLE[type]) return;
    const kind = type;
    const id = uid(kind.slice(0, 2));
    const siblings = state.edges.filter((e) => e.from === src.id).length;
    const prompts = { video: PROMPT, image: IMG_PROMPT, text: TEXT_PROMPT, audio: AUDIO_PROMPT, edit: EDIT_PROMPT, script: "" };
    const node = {
      id,
      type: kind,
      title: NODE_TITLE[kind] || kind,
      compact: kind === "image",
      x: src.x + sizeOf(src).w + 56,
      y: src.y + siblings * (kind === "image" ? 168 : 280),
      prompt: prompts[kind] || "",
      ready: false,
      mode: kind === "edit" ? "remake" : kind === "audio" ? "teacher" : kind === "ref" ? "style" : "",
      shots: kind === "director" ? SHOTS.map((s) => ({ ...s })) : undefined,
    };
    state.nodes.push(node);
    state.edges.push({ from: src.id, to: id });
    state.selectedId = id;
    if (kind === "video" && state.coach === 1) state.coach = 2;
    addMenu.hidden = true;
    renderAll();
  };

  canvas.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".node") || e.target.closest(".plus-btn") || e.target.closest(".add-menu")) return;
    addMenu.hidden = true;
    state.panning = { x: e.clientX - state.cam.x, y: e.clientY - state.cam.y };
  });

  world.addEventListener("pointerdown", (e) => {
    const plus = e.target.closest("[data-plus]");
    if (plus) {
      e.stopPropagation();
      openMenu(plus.dataset.plus, plus);
      if (state.coach === 0) state.coach = 1;
      placeCoach();
      return;
    }
    if (e.target.closest("button") || e.target.closest("textarea") || e.target.closest("select")) return;
    const card = e.target.closest(".node");
    if (card) {
      state.selectedId = card.dataset.id;
      const n = nodeById(card.dataset.id);
      state.dragging = {
        id: n.id,
        dx: e.clientX - (n.x * state.cam.scale + state.cam.x),
        dy: e.clientY - (n.y * state.cam.scale + state.cam.y),
      };
    }
  });

  world.addEventListener("keydown", (e) => {
    const ta = e.target.closest(".story-dock [data-prompt]");
    if (!ta) return;
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      startJob(ta.dataset.prompt, "script");
    }
  });

  world.addEventListener("input", (e) => {
    const ta = e.target.closest("[data-prompt]");
    if (ta) {
      const n = nodeById(ta.dataset.prompt);
      if (n) n.prompt = ta.value;
    }
    const note = e.target.closest("[data-note]");
    if (note) {
      const n = nodeById(note.dataset.note);
      if (n) n.note = note.value;
    }
  });

  world.addEventListener("click", (e) => {
    const openLook = e.target.closest("[data-open-look]");
    if (openLook) {
      lookModal.hidden = false;
      renderLookGrid();
      return;
    }
    const tryBtn = e.target.closest("[data-try]");
    if (tryBtn) {
      const n = nodeById(tryBtn.dataset.node);
      if (!n) return;
      if (tryBtn.dataset.try === "write") {
        world.querySelector(`[data-prompt="${n.id}"]`)?.focus();
        return;
      }
      n.prompt = TRY_STORY[tryBtn.dataset.try] || STORY_DEFAULT;
      renderAll();
      startJob(n.id, "script");
      return;
    }
    const mode = e.target.closest("[data-mode]");
    if (mode) {
      const n = nodeById(mode.dataset.node);
      if (n) { n.mode = mode.dataset.mode; renderAll(); }
      return;
    }
    const run = e.target.closest("[data-run]");
    if (run) {
      startJob(run.dataset.id, run.dataset.run, run.dataset.label);
      return;
    }
    const frame = e.target.closest("[data-frame]");
    if (frame) {
      const r = frame.getBoundingClientRect();
      framePop.hidden = false;
      framePop.style.left = `${r.left}px`;
      framePop.style.top = `${r.bottom + 8}px`;
      return;
    }
    const seg = e.target.closest(".seg");
    if (seg) {
      seg.parentElement.querySelectorAll(".seg").forEach((s) => s.classList.toggle("is-on", s === seg));
    }
  });

  window.addEventListener("pointermove", (e) => {
    if (state.dragging) {
      const n = nodeById(state.dragging.id);
      n.x = (e.clientX - state.dragging.dx - state.cam.x) / state.cam.scale;
      n.y = (e.clientY - state.dragging.dy - state.cam.y) / state.cam.scale;
      const el = world.querySelector(`[data-id="${n.id}"]`);
      if (el) { el.style.left = `${n.x}px`; el.style.top = `${n.y}px`; }
      drawEdges();
      placeMenu();
      placeCoach();
      return;
    }
    if (state.panning) {
      state.cam.x = e.clientX - state.panning.x;
      state.cam.y = e.clientY - state.panning.y;
      applyCam();
    }
  });
  window.addEventListener("pointerup", () => { state.dragging = null; state.panning = false; });

  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const wx = (mx - state.cam.x) / state.cam.scale;
    const wy = (my - state.cam.y) / state.cam.scale;
    const next = Math.min(1.4, Math.max(0.4, state.cam.scale * (e.deltaY > 0 ? 0.92 : 1.08)));
    state.cam.scale = next;
    state.cam.x = mx - wx * next;
    state.cam.y = my - wy * next;
    applyCam();
  }, { passive: false });

  document.getElementById("zoomIn").onclick = () => { state.cam.scale = Math.min(1.4, state.cam.scale * 1.1); applyCam(); };
  document.getElementById("zoomOut").onclick = () => { state.cam.scale = Math.max(0.4, state.cam.scale * 0.9); applyCam(); };

  addMenu.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-spawn]");
    if (!btn || btn.disabled) return;
    spawnFrom(btn.dataset.spawn);
  });

  document.getElementById("coachNext").onclick = () => {
    state.coach = Math.min(3, state.coach + 1);
    if (state.coach === 1) {
      const btn = world.querySelector('[data-plus="img-s1"]') || world.querySelector("[data-plus]");
      if (btn) openMenu(btn.dataset.plus, btn);
    }
    placeCoach();
  };
  document.getElementById("coachPrev").onclick = () => {
    state.coach = Math.max(0, state.coach - 1);
    if (state.coach === 0) addMenu.hidden = true;
    placeCoach();
  };

  document.querySelectorAll("[data-side]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-side]").forEach((b) => b.classList.toggle("is-on", b === btn));
      document.querySelectorAll("[data-side-panel]").forEach((p) => {
        p.classList.toggle("is-on", p.dataset.sidePanel === btn.dataset.side);
        p.hidden = p.dataset.sidePanel !== btn.dataset.side;
      });
    });
  });

  document.querySelectorAll("[data-owner]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-owner]").forEach((b) => b.classList.toggle("is-on", b === btn));
      document.querySelectorAll("[data-owner-view]").forEach((v) => {
        const on = v.dataset.ownerView === btn.dataset.owner;
        v.classList.toggle("is-on", on);
        v.hidden = !on;
      });
    });
  });

  document.querySelector(".canvas-pick")?.addEventListener("click", () => {
    document.querySelector("[data-side='canvas']")?.click();
  });

  document.querySelectorAll("[data-kit]").forEach((btn) => {
    btn.addEventListener("click", () => spawnFromKit(btn.dataset.kit));
  });

  const spawnFromKit = (type) => {
    state.plusFrom = state.selectedId || state.nodes[0]?.id;
    spawnFrom(type);
  };

  document.getElementById("addCanvas")?.addEventListener("click", () => {
    const list = document.querySelector("[data-side-panel='canvas']");
    const n = list.querySelectorAll(".canvas-item").length + 1;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "canvas-item";
    btn.textContent = `캔버스 ${n}`;
    list.insertBefore(btn, document.getElementById("addCanvas"));
    document.querySelector(".canvas-pick").textContent = `캔버스 ${n} ▾`;
    list.querySelectorAll(".canvas-item").forEach((b) => b.classList.toggle("is-on", b === btn));
  });

  document.querySelector("[data-side-panel='canvas']")?.addEventListener("click", (e) => {
    const item = e.target.closest(".canvas-item");
    if (!item) return;
    document.querySelectorAll(".canvas-item").forEach((b) => b.classList.toggle("is-on", b === item));
    document.querySelector(".canvas-pick").textContent = `${item.textContent} ▾`;
  });

  const agentLog = document.getElementById("agentLog");
  const chatHead = document.getElementById("chatHead");
  const pushAgent = (text, me = false) => {
    agentLog.querySelector(".empty")?.remove();
    const div = document.createElement("div");
    div.className = me ? "bubble is-me" : "bubble";
    div.textContent = text;
    agentLog.appendChild(div);
    agentLog.scrollTop = agentLog.scrollHeight;
  };

  const runAgent = (text) => {
    pushAgent(text, true);
    const t = text.toLowerCase();
    chatHead.classList.add("is-generating");
    window.setTimeout(() => {
      const done = (msg) => {
        chatHead.classList.remove("is-generating");
        pushAgent(msg);
      };
      if (t.includes("스토리") || t.includes("이야기") || t.includes("각본") || t.includes("스크립트") || t.includes("스토리보드")) {
        let sc = state.nodes.find((q) => q.type === "script");
        if (!sc) {
          state.plusFrom = state.selectedId || state.nodes[0]?.id;
          spawnFrom("script");
          sc = state.nodes[state.nodes.length - 1];
        }
        sc.prompt = text;
        startJob(sc.id, "script");
        window.setTimeout(() => done("이야기를 샷으로 나누고 이미지를 만들고 있습니다. 오른쪽에 스토리보드가 붙습니다."), 900);
        return;
      }
      if (t.includes("고화질") || t.includes("upscale")) {
        const src = state.nodes.find((n) => n.type === "video") || state.nodes[0];
        if (src) startJob(src.id, "enhance");
        window.setTimeout(() => done("고화질 노드를 비디오 뒤에 이었습니다. 해상도를 고르고 생성해 보세요."), 980);
        return;
      }
      if (t.includes("비디오") || t.includes("영상")) {
        const vid = state.nodes.find((n) => n.type === "video");
        if (vid) startJob(vid.id, "generate");
        window.setTimeout(() => done("이미지 참조로 비디오를 생성했습니다. 프롬프트를 다듬거나 고화질로 이어갈 수 있어요."), 1400);
        return;
      }
      if (t.includes("샷") || t.includes("다음")) {
        state.plusFrom = "vid-01";
        spawnFrom("image");
        done("다음 샷용 이미지 노드를 추가했습니다. +로 비디오를 이으면 됩니다.");
        return;
      }
      done("캔버스의 이미지→비디오 흐름을 유지하면서, 원하시면 고화질이나 다음 샷을 붙일 수 있습니다.");
    }, 420);
  };

  document.querySelectorAll("[data-agent]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const map = { video: "비디오 생성해줘", upscale: "고화질 연결해줘", shot: "다음 샷 제안해줘" };
      runAgent(map[btn.dataset.agent] || btn.textContent);
    });
  });

  document.getElementById("agentForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("agentInput");
    const val = input.value.trim();
    if (!val) return;
    input.value = "";
    runAgent(val);
  });
  document.getElementById("agentInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      document.getElementById("agentForm").requestSubmit();
    }
  });

  const sharePop = document.getElementById("sharePop");
  const mePop = document.getElementById("mePop");
  const presentPop = document.getElementById("presentPop");
  const presentMode = document.getElementById("presentMode");
  const closePops = () => {
    sharePop.hidden = true;
    mePop.hidden = true;
    presentPop.hidden = true;
  };
  const togglePop = (el) => {
    const open = el.hidden;
    closePops();
    el.hidden = !open;
  };
  document.getElementById("shareBtn").onclick = (e) => { e.stopPropagation(); togglePop(sharePop); };
  document.getElementById("meBtn").onclick = (e) => { e.stopPropagation(); togglePop(mePop); };
  document.getElementById("presentMenuBtn").onclick = (e) => { e.stopPropagation(); togglePop(presentPop); };
  document.getElementById("copyLink").onclick = async () => {
    const btn = document.getElementById("copyLink");
    try { await navigator.clipboard.writeText(document.getElementById("shareLink").value); } catch {}
    btn.textContent = "복사됨";
    setTimeout(() => { btn.textContent = "링크 복사"; }, 1200);
  };
  document.getElementById("shareInvite").onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById("shareEmail").value.trim();
    const role = document.getElementById("shareRole").value === "edit" ? "편집 가능" : "보기만";
    if (!email) return;
    const li = document.createElement("li");
    const short = email.slice(0, 1).toUpperCase();
    li.innerHTML = `<span class="avatar a-rose">${short}</span> ${email} · ${role} <em>초대됨</em>`;
    document.getElementById("sharePeople").appendChild(li);
    document.getElementById("shareEmail").value = "";
  };

  const PEERS = [
    { key: "민", name: "민재", wx: 280, wy: 118 },
    { key: "하", name: "하은", wx: 620, wy: 72 },
  ];
  const remotes = new Map();
  placeCursors = () => {
    const { x, y, scale } = state.cam;
    document.querySelectorAll(".live-cursor").forEach((el) => {
      if (el.dataset.remote) {
        const peer = remotes.get(el.dataset.remote);
        if (!peer || peer.wx == null) return;
        el.style.left = `${x + peer.wx * scale}px`;
        el.style.top = `${y + peer.wy * scale}px`;
        return;
      }
      const peer = PEERS.find((p) => p.key === el.dataset.peer);
      if (!peer) return;
      el.style.left = `${x + peer.wx * scale}px`;
      el.style.top = `${y + peer.wy * scale}px`;
    });
  };
  const wanderPeers = () => {
    PEERS.forEach((peer, i) => {
      const n = state.nodes[i % state.nodes.length];
      const s = sizeOf(n);
      peer.wx = n.x + 40 + Math.random() * Math.max(40, s.w - 80);
      peer.wy = n.y + 24 + Math.random() * 80;
    });
    placeCursors();
  };

  document.getElementById("frameOk").onclick = () => { framePop.hidden = true; };
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".share-wrap") && !e.target.closest(".me-wrap") && !e.target.closest(".present-wrap")) {
      closePops();
    }
  });

  let presentIndex = 0;
  const focusNode = (n) => {
    const s = sizeOf(n);
    const rect = canvas.getBoundingClientRect();
    state.selectedId = n.id;
    state.cam.scale = 0.92;
    state.cam.x = rect.width / 2 - (n.x + s.w / 2) * state.cam.scale;
    state.cam.y = rect.height / 2 - (n.y + s.h / 2) * state.cam.scale + 18;
    renderAll();
    world.querySelectorAll(".node").forEach((el) => el.classList.toggle("is-present-focus", el.dataset.id === n.id));
  };
  const syncPresentLabel = () => {
    document.getElementById("presentStep").textContent = `${presentIndex + 1}/${state.nodes.length}`;
    document.getElementById("presentCount").textContent = `${3 + remotes.size}명`;
  };
  const startPresent = (fromCurrent) => {
    closePops();
    document.body.classList.add("is-presenting");
    presentMode.hidden = false;
    if (fromCurrent && state.selectedId) {
      const i = state.nodes.findIndex((n) => n.id === state.selectedId);
      presentIndex = i >= 0 ? i : 0;
    } else {
      presentIndex = 0;
    }
    syncPresentLabel();
    focusNode(state.nodes[presentIndex]);
  };
  const stopPresent = () => {
    document.body.classList.remove("is-presenting");
    presentMode.hidden = true;
    world.querySelectorAll(".node").forEach((el) => el.classList.remove("is-present-focus"));
    applyCam();
  };
  const stepPresent = (dir) => {
    presentIndex = (presentIndex + dir + state.nodes.length) % state.nodes.length;
    syncPresentLabel();
    focusNode(state.nodes[presentIndex]);
  };
  document.getElementById("presentBtn").onclick = () => startPresent(false);
  document.getElementById("presentPop").onclick = (e) => {
    const btn = e.target.closest("[data-present]");
    if (!btn) return;
    startPresent(btn.dataset.present === "current");
  };
  document.getElementById("presentPrev").onclick = () => stepPresent(-1);
  document.getElementById("presentNext").onclick = () => stepPresent(1);
  document.getElementById("exitPresent").onclick = stopPresent;
  document.addEventListener("keydown", (e) => {
    if (presentMode.hidden) return;
    if (e.key === "Escape") stopPresent();
    if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); stepPresent(1); }
    if (e.key === "ArrowLeft") stepPresent(-1);
  });

  const extras = document.getElementById("presence");
  const liveBox = document.getElementById("liveCursors");
  const meId = sessionStorage.getItem("avora-peer") || (() => {
    const id = (crypto.randomUUID && crypto.randomUUID()) || `p-${Date.now()}`;
    sessionStorage.setItem("avora-peer", id);
    return id;
  })();
  const meProfile = { name: "지수", short: "지", color: "#7c3aed" };
  document.querySelector("#meBtn .avatar").textContent = meProfile.short;
  document.querySelector("#mePop p").textContent = meProfile.name;
  document.getElementById("meBtn").title = `${meProfile.name} · 나`;
  const renderRemotes = () => {
    extras.querySelectorAll("[data-remote]").forEach((el) => el.remove());
    liveBox.querySelectorAll("[data-remote]").forEach((el) => el.remove());
    const meBtnWrap = extras.querySelector(".me-wrap");
    remotes.forEach((peer) => {
      const av = document.createElement("button");
      av.type = "button";
      av.dataset.remote = peer.id;
      av.className = "avatar a-green";
      av.title = `${peer.name} · 접속 중`;
      av.textContent = peer.short;
      extras.insertBefore(av, meBtnWrap);
      if (peer.wx != null) {
        const cur = document.createElement("div");
        cur.className = "live-cursor";
        cur.dataset.remote = peer.id;
        cur.style.setProperty("--peer", peer.color || "#059669");
        cur.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M1 1 7.5 14.5 9 8.5 15 7z"/></svg><span>${peer.name}</span>`;
        liveBox.appendChild(cur);
      }
    });
    document.getElementById("presentCount").textContent = `${3 + remotes.size}명`;
    placeCursors();
  };
  if ("BroadcastChannel" in window) {
    const channel = new BroadcastChannel(`avora-edu-${boardId}`);
    channel.onmessage = (ev) => {
      const msg = ev.data || {};
      if (!msg.id || msg.id === meId) return;
      const existed = remotes.has(msg.id);
      const prev = remotes.get(msg.id) || { id: msg.id, name: msg.name || "게스트", short: msg.short || "게", color: msg.color || "#059669" };
      remotes.set(msg.id, { ...prev, ...msg, at: Date.now() });
      const hasCursor = liveBox.querySelector(`[data-remote="${CSS.escape(msg.id)}"]`);
      if (!existed || (msg.wx != null && !hasCursor)) renderRemotes();
      else placeCursors();
    };
    const beat = () => {
      channel.postMessage({ type: "here", id: meId, name: meProfile.name, short: meProfile.short, color: meProfile.color });
      const now = Date.now();
      let gone = false;
      [...remotes.keys()].forEach((id) => {
        if (now - remotes.get(id).at > 6000) { remotes.delete(id); gone = true; }
      });
      if (gone) renderRemotes();
    };
    beat();
    setInterval(beat, 2500);
    canvas.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      channel.postMessage({
        type: "cursor",
        id: meId,
        name: meProfile.name,
        short: meProfile.short,
        color: meProfile.color,
        wx: (e.clientX - r.left - state.cam.x) / state.cam.scale,
        wy: (e.clientY - r.top - state.cam.y) / state.cam.scale,
      });
    });
  }

  lookModal.addEventListener("click", (e) => {
    if (e.target === lookModal) lookModal.hidden = true;
    const tab = e.target.closest("[data-look-tab]");
    if (tab) {
      state.look.tab = tab.dataset.lookTab;
      renderLookGrid();
      return;
    }
    const pick = e.target.closest("[data-pick-look]");
    if (pick) {
      state.look[state.look.tab] = pick.dataset.pickLook;
      renderLookGrid();
      renderAll();
    }
  });
  document.getElementById("lookClose").onclick = () => { lookModal.hidden = true; };
  document.getElementById("lookReset").onclick = () => {
    state.look.palette = null;
    state.look.light = null;
    state.look.art = null;
    renderLookGrid();
    renderAll();
  };

  renderAll();
  placeCursors();
  setInterval(wanderPeers, 2600);
})();
