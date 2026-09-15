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
  const BLANK = "assets/app/blank.svg";
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
    script: "스크립트",
    ref: "참조 노드",
    upscale: "고화질",
  };
  const ico = (paths) =>
    `<svg class="node-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  const NODE_ICO = {
    image: ico(`<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5"/><path d="m21 15.5-4.8-4.8a1.6 1.6 0 0 0-2.2 0L7 18"/>`),
    video: ico(`<rect x="2.5" y="6" width="14" height="12" rx="2"/><path d="m16.5 10 5-2.5v9l-5-2.5z"/>`),
    audio: ico(`<path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 10v4"/>`),
    text: ico(`<path d="M5 6h14M12 6v12M8 18h8"/>`),
    edit: ico(`<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M6.2 6.2l2.1 2.1M15.7 15.7l2.1 2.1M17.8 6.2l-2.1 2.1M8.3 15.7l-2.1 2.1"/>`),
    director: ico(`<path d="M3 9h18v11H3z"/><path d="m3 9 4-5h14l-4 5"/><path d="M8 4 12 9M16 4l4 5"/>`),
    analyze: ico(`<path d="M4 19V5M4 19h16"/><path d="M8 15v-4M12 15V8M16 15v-7"/>`),
    script: ico(`<path d="M7 3h8l5 5v13H7z"/><path d="M15 3v5h5M10 13h6M10 17h4"/>`),
    ref: ico(`<path d="M7 4h10v16l-5-3-5 3z"/>`),
    upscale: ico(`<path d="M4 14v6h6M20 10V4h-6M14 4l6 6M10 20 4 14"/>`),
  };
  const kicker = (type, label) => `<span class="node-kicker">${NODE_ICO[type] || NODE_ICO.image}${label}</span>`;
  const SLASH_PRESETS = [
    { id: "cam9", label: "멀티 카메라 9분할", hint: "같은 장면을 9개 구도로 확장" },
    { id: "story4", label: "스토리 4분할", hint: "10~15초 이야기 흐름" },
    { id: "board25", label: "25분할 스토리보드", hint: "연속 컷 촘촘히 설계" },
    { id: "light", label: "영화급 조명", hint: "빛 방향·분위기 보정" },
    { id: "turn3", label: "캐릭터 3면도", hint: "정면·측면·후면" },
    { id: "after3", label: "3초 후", hint: "이어질 화면 추론" },
    { id: "before5", label: "5초 전", hint: "이전 컷 역추론" },
    { id: "charSheet", label: "캐릭터 설정", hint: "외형·의상 설정 이미지" },
    { id: "storyboard", label: "스토리보드", hint: "숏폼용 연속 보드" },
    { id: "directing", label: "디렉팅 보드", hint: "액션·카메라 힌트 포함" },
  ];
  const IMG_TOOLS = [
    { id: "pano", label: "파노라마" },
    { id: "angle", label: "다각도" },
    { id: "light", label: "조명" },
    { id: "grid9", label: "9분할" },
    { id: "edit", label: "기본 편집" },
    { id: "split", label: "그리드 분할" },
    { id: "annotate", label: "주석" },
    { id: "flip", label: "회전·미러" },
    { id: "group", label: "분컷 그룹" },
  ];
  const NODE_STACKS = {
    text: [
      { id: "plain", label: "일반 텍스트", hint: "프롬프트 / 메모 / 카피 입력" },
      { id: "write", label: "AI 작성", hint: "LLM으로 내용 생성" },
      { id: "prompt", label: "프롬프트 생성", hint: "이미지·영상용 프롬프트 변환" },
      { id: "summarize", label: "요약", hint: "긴 텍스트 압축" },
      { id: "expand", label: "확장", hint: "아이디어 → 상세 묘사" },
      { id: "translate", label: "번역", hint: "다국어 변환" },
      { id: "rewrite", label: "재작성", hint: "톤·문체·길이 변경" },
      { id: "story", label: "스토리", hint: "로그라인 / 시놉시스 / 트리트먼트" },
      { id: "structure", label: "구조화", hint: "JSON / Shot List / Scene 데이터" },
    ],
    image: [
      { id: "t2i", label: "Text → Image", hint: "텍스트로 이미지 생성" },
      { id: "i2i", label: "Image → Image", hint: "이미지 기반 재생성" },
      { id: "multi", label: "Multi Reference", hint: "여러 이미지 조합" },
      { id: "character", label: "Character", hint: "캐릭터 일관성 생성" },
      { id: "style", label: "Style Reference", hint: "화풍/룩 유지" },
      { id: "edit", label: "Edit", hint: "부분 수정 / Inpaint" },
      { id: "expand", label: "Expand", hint: "Outpaint" },
      { id: "remove", label: "Remove", hint: "객체/배경 제거" },
      { id: "upscale", label: "Upscale", hint: "해상도 향상" },
      { id: "variation", label: "Variation", hint: "베리에이션 생성" },
      { id: "grid9", label: "9-Cut Grid", hint: "한 장면을 9개 카메라 구도로 분할" },
      { id: "character-sheet", label: "Character Sheet", hint: "캐릭터 턴어라운드와 표정 시트" },
    ],
    video: [
      { id: "t2v", label: "Text → Video", hint: "텍스트 기반 영상" },
      { id: "i2v", label: "Image → Video", hint: "이미지 애니메이션" },
      { id: "startend", label: "Start → End", hint: "시작/끝 프레임 영상" },
      { id: "r2v", label: "Reference → Video", hint: "캐릭터/영상 참조" },
      { id: "v2v", label: "Video → Video", hint: "스타일/내용 변환" },
      { id: "extend", label: "Extend", hint: "영상 길이 확장" },
      { id: "motion", label: "Motion Control", hint: "움직임 참조" },
      { id: "camera", label: "Camera Motion", hint: "Dolly/Pan/Tilt/Orbit" },
      { id: "lipsync", label: "Lip Sync", hint: "음성 기반 립싱크" },
      { id: "upscale", label: "Upscale", hint: "영상 화질 개선" },
    ],
    edit: [
      { id: "remove", label: "Remove", hint: "객체 삭제" },
      { id: "replace", label: "Replace", hint: "객체 교체" },
      { id: "background", label: "Background", hint: "배경 제거/교체" },
      { id: "relight", label: "Relight", hint: "조명 변경" },
      { id: "reframe", label: "Reframe", hint: "16:9 → 9:16 등" },
      { id: "extend", label: "Extend", hint: "화면 확장" },
      { id: "style", label: "Style Transfer", hint: "스타일 변경" },
      { id: "character", label: "Face/Character", hint: "캐릭터 수정" },
      { id: "composite", label: "Composite", hint: "여러 이미지 합성" },
      { id: "cleanup", label: "Cleanup", hint: "아티팩트 제거" },
    ],
    director: [
      { id: "camera", label: "Camera", hint: "Shot Size / Angle" },
      { id: "lens", label: "Lens", hint: "18/24/35/50/85mm" },
      { id: "movement", label: "Movement", hint: "Pan/Tilt/Dolly/Truck/Crane" },
      { id: "composition", label: "Composition", hint: "중앙/삼분할/대칭" },
      { id: "subject", label: "Subject", hint: "인물 위치·방향" },
      { id: "lighting", label: "Lighting", hint: "Key/Fill/Rim/시간대" },
      { id: "color", label: "Color", hint: "Color Science / LUT / Tone" },
      { id: "depth", label: "Depth", hint: "DOF / Focus" },
      { id: "blocking", label: "Blocking", hint: "인물·오브젝트 배치" },
      { id: "continuity", label: "Continuity", hint: "이전 샷 설정 유지" },
    ],
    analyze: [
      { id: "img-desc", label: "Image Describe", hint: "이미지 → 설명" },
      { id: "vid-desc", label: "Video Describe", hint: "영상 → 설명" },
      { id: "prompt", label: "Prompt Extract", hint: "이미지 → 생성 프롬프트" },
      { id: "scene", label: "Scene Detect", hint: "영상 씬 분리" },
      { id: "shot", label: "Shot Detect", hint: "샷 분리" },
      { id: "character", label: "Character Detect", hint: "등장인물 분석" },
      { id: "object", label: "Object Detect", hint: "사물 분석" },
      { id: "composition", label: "Composition", hint: "구도 분석" },
      { id: "camera", label: "Camera Analysis", hint: "렌즈/앵글/카메라워크 추론" },
      { id: "color", label: "Color Analysis", hint: "컬러 팔레트 분석" },
      { id: "audio", label: "Audio Analysis", hint: "음성/BGM/SFX 분석" },
    ],
    audio: [
      { id: "tts", label: "Text → Speech", hint: "TTS" },
      { id: "clone", label: "Voice Clone", hint: "보이스 참조" },
      { id: "s2s", label: "Speech → Speech", hint: "목소리 변환" },
      { id: "music", label: "Music", hint: "BGM 생성" },
      { id: "sfx", label: "SFX", hint: "효과음 생성" },
      { id: "ambience", label: "Ambience", hint: "환경음 생성" },
      { id: "dubbing", label: "Dubbing", hint: "자동 더빙" },
      { id: "separate", label: "Separate", hint: "Voice/Music 분리" },
      { id: "cleanup", label: "Cleanup", hint: "노이즈 제거" },
      { id: "mastering", label: "Mastering", hint: "음량/음질 정리" },
    ],
    script: [
      { id: "logline", label: "Idea → Logline", hint: "아이디어 한 줄 정리" },
      { id: "synopsis", label: "Synopsis", hint: "시놉시스" },
      { id: "treatment", label: "Treatment", hint: "트리트먼트" },
      { id: "character", label: "Character", hint: "캐릭터 설정" },
      { id: "world", label: "World", hint: "세계관 설정" },
      { id: "act", label: "Act", hint: "Act 구조" },
      { id: "sequence", label: "Sequence", hint: "시퀀스 분할" },
      { id: "scene", label: "Scene", hint: "씬 생성" },
      { id: "shot", label: "Shot", hint: "샷 생성" },
      { id: "dialogue", label: "Dialogue", hint: "대사" },
      { id: "narration", label: "Narration", hint: "내레이션" },
      { id: "storyboard", label: "Storyboard", hint: "스토리보드 변환" },
    ],
    ref: [
      { id: "character", label: "Character", hint: "캐릭터 Reference" },
      { id: "face", label: "Face", hint: "얼굴 Reference" },
      { id: "product", label: "Product", hint: "제품 Reference" },
      { id: "object", label: "Object", hint: "오브젝트 Reference" },
      { id: "location", label: "Location", hint: "장소 Reference" },
      { id: "style", label: "Style", hint: "스타일 Reference" },
      { id: "color", label: "Color", hint: "컬러 Reference" },
      { id: "camera", label: "Camera", hint: "촬영 Reference" },
      { id: "motion", label: "Motion", hint: "모션 Reference" },
      { id: "voice", label: "Voice", hint: "음성 Reference" },
      { id: "music", label: "Music", hint: "음악 Reference" },
    ],
  };
  const STACK_DEFAULT = {
    text: "plain",
    image: "t2i",
    video: "i2v",
    edit: "remove",
    director: "camera",
    analyze: "img-desc",
    audio: "tts",
    script: "storyboard",
    ref: "style",
  };
  const MODE_ALIAS = { teacher: "tts", student: "tts", remake: "replace", caption: "cleanup", bg: "location" };
  const stackIdOf = (n) => {
    const list = NODE_STACKS[n.type];
    if (!list?.length) return "";
    const raw = MODE_ALIAS[n.mode] || n.mode || STACK_DEFAULT[n.type];
    return list.some((s) => s.id === raw) ? raw : (STACK_DEFAULT[n.type] || list[0].id);
  };
  const stackOf = (n) => {
    const list = NODE_STACKS[n.type] || [];
    const id = stackIdOf(n);
    return list.find((s) => s.id === id) || list[0] || { id: "", label: NODE_TITLE[n.type] || n.type, hint: "" };
  };
  const stackPick = (n) => {
    const list = NODE_STACKS[n.type];
    if (!list?.length) return "";
    const cur = stackIdOf(n);
    return `<select class="stack-pick${n.compact ? " is-sm" : ""}" data-stack="${n.id}" aria-label="${NODE_TITLE[n.type] || n.type} 세부 기능">${list.map((s) => `<option value="${s.id}"${s.id === cur ? " selected" : ""}>${s.label}</option>`).join("")}</select>`;
  };
  const TITLES = {
    photo: "광합성 실험 가이드",
    campus: "캠퍼스 오리엔테이션",
    sejong: "세종, 한글을 만들다",
    math: "분수 개념 3분 컷",
    water: "물의 순환",
    new: "프로젝트 00",
    blank: "프로젝트 00",
    sample: "Sample 프로젝트",
  };
  const searchParams = new URLSearchParams(location.search);
  const landingPrompt = (searchParams.get("prompt") || "").trim();
  const boardId = searchParams.get("board") || "photo";
  const reviewMode = searchParams.get("review") === "1";
  const reviewStudent = (searchParams.get("student") || "").trim();
  const reviewTeam = (searchParams.get("team") || "").trim();
  const reviewProject = (searchParams.get("project") || "").trim();
  const projectNameKey = `avora-project-name:${boardId}`;
  const projectName = reviewProject || localStorage.getItem(projectNameKey) || TITLES[boardId] || TITLES.photo;
  document.getElementById("boardName").textContent = projectName;
  document.title = `${projectName} · 아보라`;
  if (reviewMode) {
    document.body.classList.add("is-admin-review");
    const reviewChip = document.createElement("div");
    reviewChip.className = "admin-review-chip";
    const reviewLabel = document.createElement("b");
    reviewLabel.textContent = "관리자 검토 모드";
    const reviewCopy = document.createElement("span");
    reviewCopy.textContent = [reviewTeam, reviewStudent].filter(Boolean).join(" · ") || projectName;
    reviewChip.append(reviewLabel, reviewCopy);
    document.querySelector(".topbar-left")?.append(reviewChip);
  }

  const PROMPT = "실험실 창가에서 선생님이 잎을 들어 보이며 질문한다. 긴장된 표정, 차네 클로즈업에서 항공정면으로 전환, 35mm 필름, 사실적인 속도감과 모션 블러.";
  const IMG_PROMPT = "실험실 창가, 선생님이 잎을 들어 보이는 클로즈업, 사실적인 조명.";
  const TEXT_PROMPT = "광합성은 어떻게 일어날까?";
  const AUDIO_PROMPT = "잎이 빛을 받으면 양분을 만들어요.";
  const EDIT_PROMPT = "실험 자막만 남기고 배경 잡음을 줄여 주세요.";
  const SCRIPT_OUT = "선생님: 이 잎이 빛을 받으면 어떤 일이 생길까요?\n학생: 양분을 만들어요!\n선생님: 맞아요. 그걸 광합성이라고 합니다.";
  const STORY_DEFAULT = "실험실 창가에서 선생님이 잎을 들어 보이며 묻는다. 잎에 빛이 닿고, 학생들이 양분을 만든다고 대답한다.";
  const STORY_SHOTS = [
    { t: "오프닝", d: "2s", src: "assets/app/shots/open.png", line: "선생님이 창가에서 잎을 들어 질문을 던진다." },
    { t: "핵심 클로즈업", d: "2s", src: "assets/app/shots/leaf.png", line: "잎에 빛이 닿고 물이 움직인다." },
    { t: "반응", d: "2s", src: "assets/app/shots/class.png", line: "학생들이 양분이라고 대답한다." },
    { t: "정리", d: "2s", src: "assets/app/shots/idea.png", line: "빛·잎·양분이 한 장면으로 정리된다." },
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

  const buildSampleWorkspace = () => {
    const pad = 32;
    const gap = 36;
    const categories = [
      { type: "text", label: "텍스트", prompt: "15초 브랜드 필름의 핵심 메시지를 명료하게 정리해 주세요." },
      { type: "script", label: "스크립트", prompt: "낯선 도시에서 자신의 목소리를 발견하는 주인공의 30초 이야기를 구성해 주세요." },
      { type: "image", label: "이미지", prompt: "비가 그친 새벽 도심, 보라색 네온과 젖은 아스팔트, 시네마틱 와이드 샷." },
      { type: "video", label: "비디오", prompt: "인물을 따라 천천히 돌리 인하며 네온 반사가 흐르는 5초 시네마틱 영상." },
      { type: "edit", label: "스마트 편집", prompt: "주인공은 유지하고 배경의 불필요한 행인과 간판을 자연스럽게 정리해 주세요." },
      { type: "director", label: "디렉터 콘솔", prompt: "감정이 고조되는 순간을 35mm 렌즈와 느린 돌리 인으로 연출합니다." },
      { type: "analyze", label: "스마트 분석", prompt: "현재 장면의 구도, 카메라, 컬러와 개선 포인트를 분석해 주세요." },
      { type: "audio", label: "오디오", prompt: "차분하지만 긴장감 있는 내레이션과 빗소리 기반의 앰비언스를 생성해 주세요." },
      { type: "ref", label: "참조", prompt: "이 이미지를 캐릭터와 룩의 일관성 참조로 사용합니다." },
      { type: "upscale", label: "고화질", prompt: "최종 영상을 4K 마스터 품질로 업스케일합니다." },
    ];
    const groups = [];
    const nodes = [];
    let groupX = 8;
    categories.forEach(({ type, label, prompt }, categoryIndex) => {
      const modes = NODE_STACKS[type] || [{ id: "master", label: "4K Upscale", hint: "최종 출력 화질 개선" }];
      const size = SIZE[type] || SIZE.image;
      const columns = size.w >= 500 ? 3 : 4;
      const rows = Math.ceil(modes.length / columns);
      const groupWidth = pad * 2 + columns * size.w + (columns - 1) * gap;
      const groupHeight = 128 + rows * size.h + Math.max(0, rows - 1) * gap;
      const group = {
        id: `sample-g-${type}`,
        no: String(categoryIndex + 1).padStart(2, "0"),
        title: `${label} 노드 · ${modes.length}개 유즈케이스`,
        x: groupX,
        y: 24,
        w: groupWidth,
        h: groupHeight,
      };
      groups.push(group);
      modes.forEach((mode, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);
        nodes.push({
          id: `sample-${type}-${mode.id}`,
          type,
          title: `${label} · ${mode.label}`,
          compact: false,
          x: pad + column * (size.w + gap),
          y: 48 + row * (size.h + gap),
          prompt: `${mode.label}: ${prompt}`,
          ready: type === "ref",
          src: type === "ref" ? "assets/app/shots/open.png" : "",
          mode: mode.id,
          shots: type === "director" ? SHOTS.map((shot) => ({ ...shot })) : undefined,
          folder: type === "audio" ? "audio" : type === "image" || type === "ref" ? "scene" : "new",
          shot: mode.label,
          group: group.id,
        });
      });
      groupX += groupWidth + 64;
    });
    return { groups, nodes, edges: [] };
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
    open: "assets/app/shots/open.png",
    leaf: "assets/app/shots/leaf.png",
    class: "assets/app/shots/class.png",
    idea: "assets/app/shots/idea.png",
    wide: "assets/app/shots/wide.png",
    backlight: "assets/app/shots/backlight.png",
    cutaway: "assets/app/shots/cutaway.png",
    insert: "assets/app/shots/insert.png",
  };

  const isBlank = boardId === "blank";
  const isFresh = boardId === "new" || isBlank;
  const isSample = boardId === "sample";
  const sampleWorkspace = isSample ? buildSampleWorkspace() : null;
  const state = {
    selectedId: isBlank ? "" : isSample ? sampleWorkspace.nodes[0]?.id || "" : "sc-01",
    plusFrom: null,
    cam: { x: isFresh ? 48 : 24, y: isFresh ? 72 : 48, scale: isFresh ? 0.78 : isSample ? 0.32 : 0.42 },
    dragging: null,
    panning: false,
    coach: -1,
    look: { tab: "palette", palette: null, light: null, art: null },
    folderNames: { new: "새 폴더", audio: "음향 효과", character: "캐릭터", scene: "장면", prop: "소품", style: "스타일" },
    folderOpen: { new: false, audio: false, character: true, scene: true, prop: false, style: false },
    folders: ["new", "audio", "character", "scene", "prop", "style"],
    assetQuery: "",
    inspect: null,
    mediaToolsNode: "",
    library: [
      { id: "lib-char-1", folder: "character", name: "스크린샷 2026-09-13 오후 4.41.27", src: "assets/app/inspire/inspire-01-character.png", author: "Jisu Lee", createdAt: "2026-09-15 05:32" },
    ],
    crewOn: { writer: true, cd: true },
    crewOpen: "writer",
    selectedGroup: "",
    frameEdit: false,
    stackView: false,
    dockTab: "canvas",
    dockOpen: false,
    spawnAt: null,
    movingGroup: null,
    resizing: null,
    groups: isBlank ? [] : isSample ? sampleWorkspace.groups : boardId === "new" ? [
      { id: "g1", no: "01", title: "기획 · 톤과 장르", x: 8, y: 0, w: 560, h: 700 },
    ] : [
      { id: "g1", no: "01", title: "기획 · 톤과 장르", x: 8, y: 0, w: 560, h: 700 },
      { id: "g2", no: "02", title: "스토리보드", x: 596, y: 0, w: 680, h: 700 },
      { id: "g3", no: "03", title: "샷 변형", x: 1308, y: 0, w: 520, h: 900 },
      { id: "g4", no: "04", title: "영상", x: 1860, y: 0, w: 720, h: 700 },
    ],
    nodes: isBlank ? [] : isSample ? sampleWorkspace.nodes : boardId === "new" ? [
      { id: "sc-01", type: "script", title: "스크립트", x: 40, y: 48, ready: false, prompt: landingPrompt, folder: "new", group: "g1" },
    ] : [
      { id: "sc-01", type: "script", title: "스크립트", x: 40, y: 48, ready: false, prompt: landingPrompt, folder: "new", group: "g1" },
      { id: "img-s1", type: "image", compact: true, title: "이미지", x: 624, y: 48, ready: true, shot: "오프닝", src: "assets/app/shots/open.png", prompt: IMG_PROMPT, folder: "scene", group: "g2" },
      { id: "img-s2", type: "image", compact: true, title: "이미지", x: 772, y: 48, ready: true, shot: "핵심 클로즈업", src: "assets/app/shots/leaf.png", prompt: "잎에 빛이 닿는 클로즈업", folder: "scene", group: "g2" },
      { id: "img-s3", type: "image", compact: true, title: "이미지", x: 920, y: 48, ready: true, shot: "반응", src: "assets/app/shots/class.png", prompt: "학생들이 대답한다", folder: "scene", group: "g2" },
      { id: "img-s4", type: "image", compact: true, title: "이미지", x: 1068, y: 48, ready: true, shot: "정리", src: "assets/app/shots/idea.png", prompt: "빛·잎·양분 한 컷", folder: "scene", group: "g2" },
      { id: "img-v1", type: "image", compact: true, title: "이미지", x: 1344, y: 48, ready: true, shot: "와이드", src: "assets/app/shots/wide.png", prompt: "같은 장면 와이드", folder: "scene", group: "g3" },
      { id: "img-v2", type: "image", compact: true, title: "이미지", x: 1492, y: 48, ready: true, shot: "역광", src: "assets/app/shots/backlight.png", prompt: "역광 실루엣", folder: "scene", group: "g3" },
      { id: "img-v3", type: "image", compact: true, title: "이미지", x: 1344, y: 228, ready: true, shot: "컷어웨이", src: "assets/app/shots/cutaway.png", prompt: "학생 컷어웨이", folder: "prop", group: "g3" },
      { id: "img-v4", type: "image", compact: true, title: "이미지", x: 1492, y: 228, ready: true, shot: "인서트", src: "assets/app/shots/insert.png", prompt: "개념 인서트", folder: "prop", group: "g3" },
      { id: "vid-01", type: "video", title: "비디오", x: 1896, y: 48, ready: false, prompt: PROMPT, folder: "scene", group: "g4" },
    ],
    edges: isBlank || boardId === "new" ? [] : isSample ? sampleWorkspace.edges : [
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
  const starryAgent = document.getElementById("starryAgent");
  const starryStatus = document.getElementById("starryStatus");
  const starryPose = document.getElementById("starryPose");
  const nodeById = (id) => state.nodes.find((n) => n.id === id);
  const uid = (p) => `${p}-${Math.random().toString(36).slice(2, 6)}`;
  const sizeOf = (n) => {
    if (n.compact && (n.type === "image" || n.type === "ref")) return { w: 132, h: 186, portY: 68 };
    return SIZE[n.type] || SIZE.image;
  };
  const GROUP_PAD = 32;
  const RESIZE = {
    n: { x: 0, y: 1, w: 0, h: -1 },
    s: { x: 0, y: 0, w: 0, h: 1 },
    e: { x: 0, y: 0, w: 1, h: 0 },
    w: { x: 1, y: 0, w: -1, h: 0 },
    ne: { x: 0, y: 1, w: 1, h: -1 },
    nw: { x: 1, y: 1, w: -1, h: -1 },
    se: { x: 0, y: 0, w: 1, h: 1 },
    sw: { x: 1, y: 0, w: -1, h: 1 },
  };
  const groupById = (id) => (state.groups || []).find((g) => g.id === id);
  const nodesInGroup = (gid) => state.nodes.filter((n) => n.group === gid);
  const layoutSampleWorkspace = () => {
    if (!isSample) return;
    const pad = 32;
    const gap = 72;
    let groupX = 8;
    (state.groups || []).forEach((group) => {
      const nodes = nodesInGroup(group.id);
      const elements = nodes.map((node) => world.querySelector(`.node[data-id="${node.id}"]`));
      const maxWidth = Math.max(320, ...elements.map((el) => el?.offsetWidth || 0));
      const maxHeight = Math.max(220, ...elements.map((el) => el?.offsetHeight || 0));
      const columns = Math.min(nodes.length, maxWidth >= 500 ? 3 : 4);
      const rows = Math.ceil(nodes.length / columns);
      nodes.forEach((node, index) => {
        node.x = pad + (index % columns) * (maxWidth + gap);
        node.y = 48 + Math.floor(index / columns) * (maxHeight + gap);
        const el = elements[index];
        if (el) {
          el.style.left = `${node.x}px`;
          el.style.top = `${node.y}px`;
        }
      });
      group.x = groupX;
      group.y = 24;
      group.w = pad * 2 + columns * maxWidth + Math.max(0, columns - 1) * gap;
      group.h = 104 + rows * maxHeight + Math.max(0, rows - 1) * gap;
      const groupEl = world.querySelector(`.board-group[data-group="${group.id}"]`);
      if (groupEl) {
        groupEl.style.left = `${group.x}px`;
        groupEl.style.top = `${group.y}px`;
        groupEl.style.width = `${group.w}px`;
        groupEl.style.height = `${group.h}px`;
      }
      groupX += group.w + 96;
    });
  };
  const originOf = (n) => {
    const g = n?.group ? groupById(n.group) : null;
    return g ? { x: g.x, y: g.y } : { x: 0, y: 0 };
  };
  const worldOf = (n) => {
    const o = originOf(n);
    return { x: o.x + n.x, y: o.y + n.y };
  };
  const worldFromEvent = (e) => {
    const r = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left - state.cam.x) / state.cam.scale,
      y: (e.clientY - r.top - state.cam.y) / state.cam.scale,
    };
  };
  const groupAtWorld = (wx, wy) => {
    const gs = state.groups || [];
    for (let i = gs.length - 1; i >= 0; i -= 1) {
      const g = gs[i];
      if (wx >= g.x && wy >= g.y && wx <= g.x + g.w && wy <= g.y + g.h) return g;
    }
    return null;
  };
  const sequenceNodes = (gid) => {
    const kids = nodesInGroup(gid);
    if (kids.length < 2) return kids.slice().sort((a, b) => a.x - b.x || a.y - b.y);
    const inGroup = new Set(kids.map((n) => n.id));
    const incoming = new Map(kids.map((n) => [n.id, 0]));
    state.edges.forEach((e) => {
      if (inGroup.has(e.from) && inGroup.has(e.to)) incoming.set(e.to, (incoming.get(e.to) || 0) + 1);
    });
    const starts = kids.filter((n) => !incoming.get(n.id)).sort((a, b) => a.x - b.x || a.y - b.y);
    const seen = new Set();
    const out = [];
    const walk = (n) => {
      if (!n || seen.has(n.id)) return;
      seen.add(n.id);
      out.push(n);
      state.edges
        .filter((e) => e.from === n.id && inGroup.has(e.to))
        .map((e) => nodeById(e.to))
        .filter(Boolean)
        .sort((a, b) => a.y - b.y || a.x - b.x)
        .forEach(walk);
    };
    starts.forEach(walk);
    kids.filter((n) => !seen.has(n.id)).sort((a, b) => a.x - b.x || a.y - b.y).forEach((n) => out.push(n));
    return out;
  };
  const SEQ_GAP = 36;
  const SEQ_TOP = 40;
  const layoutSlotInGroup = (g, n) => {
    const sz = sizeOf(n);
    const others = nodesInGroup(g.id).filter((x) => x.id !== n.id);
    const innerR = g.w - GROUP_PAD;
    if (!others.length) return { x: GROUP_PAD, y: SEQ_TOP };
    const lowest = Math.max(...others.map((o) => o.y));
    const row = others.filter((o) => Math.abs(o.y - lowest) < 28);
    const right = row.reduce((acc, o) => (o.x + sizeOf(o).w > acc.x + sizeOf(acc).w ? o : acc));
    const rs = sizeOf(right);
    let x = right.x + rs.w + SEQ_GAP;
    let y = right.y;
    if (x + sz.w > innerR) {
      x = GROUP_PAD;
      y = Math.max(...row.map((o) => o.y + sizeOf(o).h)) + SEQ_GAP;
    }
    return { x: Math.round(x), y: Math.round(y) };
  };
  const clampNodeInGroup = (n, g) => {
    if (!g) return;
    const sz = sizeOf(n);
    const maxX = Math.max(GROUP_PAD, g.w - GROUP_PAD - sz.w);
    const maxY = Math.max(GROUP_PAD, g.h - GROUP_PAD - sz.h);
    n.x = Math.min(Math.max(GROUP_PAD, n.x), maxX);
    n.y = Math.min(Math.max(GROUP_PAD, n.y), maxY);
  };
  const unlinkFromGroup = (n, gid) => {
    const members = new Set(nodesInGroup(gid).map((x) => x.id));
    state.edges = state.edges.filter((e) => {
      const a = members.has(e.from);
      const b = members.has(e.to);
      if (e.from === n.id && a && b) return false;
      if (e.to === n.id && a && b) return false;
      return true;
    });
  };
  const linkIntoSequence = (n, gid) => {
    const others = nodesInGroup(gid).filter((x) => x.id !== n.id);
    if (!others.length) return;
    const linked = state.edges.some((e) =>
      (e.from === n.id && others.some((o) => o.id === e.to)) ||
      (e.to === n.id && others.some((o) => o.id === e.from))
    );
    if (linked) return;
    const last = sequenceNodes(gid).filter((x) => x.id !== n.id).pop();
    if (last) state.edges.push({ from: last.id, to: n.id });
  };
  const placeIntoGroup = (n, gid) => {
    if (!n) return false;
    const at = worldOf(n);
    const prev = n.group || "";
    const next = gid || "";
    if (prev === next) {
      if (next) {
        const g = groupById(next);
        clampNodeInGroup(n, g);
        expandGroupToFit(g);
      }
      return false;
    }
    if (prev) unlinkFromGroup(n, prev);
    const g = next ? groupById(next) : null;
    n.group = next;
    if (!g) {
      n.x = Math.round(at.x);
      n.y = Math.round(at.y);
      return false;
    }
    const slot = layoutSlotInGroup(g, n);
    n.x = slot.x;
    n.y = slot.y;
    linkIntoSequence(n, g.id);
    expandGroupToFit(g);
    return true;
  };
  const paintDropTarget = (gid, n) => {
    world.querySelectorAll(".board-group").forEach((el) => {
      const on = !!(gid && el.dataset.group === gid);
      el.classList.toggle("is-drop", on);
      let ghost = el.querySelector(".seq-ghost");
      const joining = on && n && (n.group || "") !== gid;
      if (!joining) {
        ghost?.remove();
        return;
      }
      const g = groupById(gid);
      const slot = layoutSlotInGroup(g, n);
      const sz = sizeOf(n);
      if (!ghost) {
        ghost = document.createElement("div");
        ghost.className = "seq-ghost";
        el.appendChild(ghost);
      }
      ghost.style.left = `${slot.x}px`;
      ghost.style.top = `${slot.y}px`;
      ghost.style.width = `${sz.w}px`;
      ghost.style.height = `${Math.min(sz.h, 240)}px`;
    });
  };
  const paintNode = (n) => {
    const el = world.querySelector(`[data-id="${n.id}"]`);
    if (el) { el.style.left = `${n.x}px`; el.style.top = `${n.y}px`; }
  };
  const paintGroup = (g) => {
    if (!g) return;
    const el = world.querySelector(`[data-group="${g.id}"]`);
    if (!el) return;
    el.style.left = `${g.x}px`;
    el.style.top = `${g.y}px`;
    el.style.width = `${g.w}px`;
    el.style.height = `${g.h}px`;
  };
  const kidBounds = (g) => {
    const kids = nodesInGroup(g.id);
    if (!kids.length) return null;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    kids.forEach((n) => {
      const s = sizeOf(n);
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + s.w);
      maxY = Math.max(maxY, n.y + s.h);
    });
    return { minX, minY, maxX, maxY, kids };
  };
  const expandGroupToFit = (g) => {
    if (!g) return;
    const box = kidBounds(g);
    if (!box) return;
    if (box.minX < GROUP_PAD) {
      const dx = GROUP_PAD - box.minX;
      g.x -= dx;
      g.w += dx;
      box.kids.forEach((n) => { n.x += dx; });
      box.maxX += dx;
    }
    if (box.minY < GROUP_PAD) {
      const dy = GROUP_PAD - box.minY;
      g.y -= dy;
      g.h += dy;
      box.kids.forEach((n) => { n.y += dy; });
      box.maxY += dy;
    }
    g.w = Math.max(Number(g.w) || 0, box.maxX + GROUP_PAD);
    g.h = Math.max(Number(g.h) || 0, box.maxY + GROUP_PAD);
  };
  const clampGroupResize = (g, next) => {
    let { x, y, w, h } = next;
    w = Math.max(240, w);
    h = Math.max(180, h);
    const dx = x - g.x;
    const dy = y - g.y;
    const kids = nodesInGroup(g.id);
    if (dx || dy) kids.forEach((n) => { n.x -= dx; n.y -= dy; });
    g.x = x;
    g.y = y;
    g.w = w;
    g.h = h;
    expandGroupToFit(g);
    kids.forEach(paintNode);
  };
  state.nodes.forEach((n) => {
    const g = n.group ? groupById(n.group) : null;
    if (!g) return;
    n.x -= g.x;
    n.y -= g.y;
  });
  (state.groups || []).forEach(expandGroupToFit);
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
    placeMediaTools();
  };

  const portWorld = (n, which) => {
    const fallback = sizeOf(n);
    const el = world.querySelector(`.node[data-id="${n.id}"]`);
    if (el) {
      const anchor = which === "out" ? el.querySelector(".plus-btn") : el;
      const rect = anchor?.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      if (rect) {
        const screenX = which === "out" ? rect.left + rect.width / 2 : rect.left;
        const screenY = rect.top + rect.height / 2;
        return {
          x: (screenX - canvasRect.left - state.cam.x) / state.cam.scale,
          y: (screenY - canvasRect.top - state.cam.y) / state.cam.scale,
        };
      }
    }
    const s = {
      w: el?.offsetWidth || fallback.w,
      h: el?.offsetHeight || fallback.h,
    };
    const w = worldOf(n);
    return { x: which === "out" ? w.x + s.w : w.x, y: w.y + s.h / 2 };
  };

  const ortho = (x1, y1, x2, y2) => {
    const mid = x1 + Math.max(36, (x2 - x1) * 0.5);
    const r = Math.min(16, Math.abs(y2 - y1) / 2, Math.max(8, Math.abs(x2 - mid) / 2));
    if (Math.abs(y2 - y1) < 3) return { d: `M ${x1} ${y1} H ${x2}`, mx: (x1 + x2) / 2, my: y1 };
    const s = y2 >= y1 ? 1 : -1;
    if (r < 3) return { d: `M ${x1} ${y1} H ${mid} V ${y2} H ${x2}`, mx: mid, my: (y1 + y2) / 2 };
    return {
      d: `M ${x1} ${y1} H ${mid - r} Q ${mid} ${y1} ${mid} ${y1 + s * r} V ${y2 - s * r} Q ${mid} ${y2} ${mid + r} ${y2} H ${x2}`,
      mx: mid,
      my: (y1 + y2) / 2,
    };
  };

  const drawEdges = () => {
    const { x, y, scale } = state.cam;
    const paths = state.edges.map((e) => {
      const a = nodeById(e.from);
      const b = nodeById(e.to);
      if (!a || !b) return "";
      const p1 = portWorld(a, "out");
      const p2 = portWorld(b, "in");
      const x1 = p1.x * scale + x;
      const y1 = p1.y * scale + y;
      const x2 = p2.x * scale + x;
      const y2 = p2.y * scale + y;
      const { d, mx, my } = ortho(x1, y1, x2, y2);
      const live = !!(a.busy || b.busy);
      return `
        <path class="edge${live ? " is-live" : ""}" d="${d}" />
        <g class="edge-cut" data-cut-edge="1" data-from="${e.from}" data-to="${e.to}" transform="translate(${mx} ${my})">
          <circle class="edge-cut-hit" r="14" />
          <circle class="edge-cut-disk" r="11" />
          <path class="edge-cut-mark" d="M-5 0 H5" />
        </g>`;
    }).join("");
    edgesSvg.innerHTML = paths;
  };
  const cutEdge = (from, to) => {
    state.edges = state.edges.filter((ed) => !(ed.from === from && ed.to === to));
    renderAll();
  };

  const slashRow = (n) => `
    <div class="slash-row" data-slash-for="${n.id}">
      <button type="button" class="slash-trigger" data-slash-open="${n.id}" title="Slash 빠른 기능">/</button>
      <div class="slash-chips">
        ${SLASH_PRESETS.slice(0, 5).map((p) => `
          <button type="button" class="slash-chip" data-slash="${p.id}" data-id="${n.id}" title="${p.hint}">${p.label}</button>`).join("")}
        <button type="button" class="slash-chip slash-more" data-slash-more="${n.id}">더보기</button>
      </div>
    </div>`;

  const rangeSetting = (label, value, min, max, suffix = "") => `
    <label class="mode-range">
      <span>${label}<b>${value}${suffix}</b></span>
      <input type="range" min="${min}" max="${max}" value="${value}" />
    </label>`;

  const imageModeVisual = (n) => {
    const mode = stackIdOf(n);
    if (mode === "grid9") {
      const shots = [
        ["EWS", "wide.png"], ["WS", "open.png"], ["MS", "class.png"],
        ["MCU", "idea.png"], ["CU", "leaf.png"], ["ECU", "insert.png"],
        ["LOW", "backlight.png"], ["HIGH", "cutaway.png"], ["OTS", "class.png"],
      ];
      return `
        <div class="mode-visual mode-grid9">
          ${shots.map(([label, src], index) => `
            <figure><img src="assets/app/shots/${src}" alt="${label} 구도"><span>${String(index + 1).padStart(2, "0")}</span><figcaption>${label}</figcaption></figure>
          `).join("")}
        </div>
        <div class="mode-summary"><b>9개 카메라 구도</b><span>화면비 16:9 · 동일 인물/조명 잠금</span></div>`;
    }
    if (mode === "character-sheet") {
      const views = [["정면", "50%"], ["3/4", "42%"], ["측면", "62%"], ["후면", "74%"]];
      return `
        <div class="mode-visual character-sheet">
          <div class="character-turnaround">
            ${views.map(([label, pos]) => `<figure><img src="assets/app/inspire/inspire-01-character.png" style="object-position:${pos} center" alt="${label}"><figcaption>${label}</figcaption></figure>`).join("")}
          </div>
          <div class="expression-strip">
            ${["기본", "미소", "놀람", "집중"].map((label, index) => `<span><img src="assets/app/inspire/inspire-01-character.png" alt=""><em>${label}</em><i style="--exp:${index}"></i></span>`).join("")}
          </div>
        </div>
        <div class="mode-summary"><b>캐릭터 ID 잠금</b><span>의상 A · 전신 턴어라운드 · 표정 4종</span></div>`;
    }
    return "";
  };

  const cameraMotionPanel = (n) => {
    if (!["camera", "motion"].includes(stackIdOf(n))) return "";
    return `
      <section class="node-mode-settings camera-motion-settings">
        <div class="mode-settings-title"><b>${stackIdOf(n) === "camera" ? "카메라 워크" : "모션 컨트롤"}</b><span>KEYFRAME 01 → 02</span></div>
        <div class="motion-path"><i class="motion-start">A</i><span><b></b></span><i class="motion-end">B</i></div>
        <div class="mode-field-grid">
          <label><span>Movement</span><select><option>Dolly In</option><option>Pan Left</option><option>Orbit Right</option><option>Crane Up</option></select></label>
          <label><span>Easing</span><select><option>Ease In-Out</option><option>Linear</option><option>Ease Out</option></select></label>
        </div>
        ${rangeSetting("이동 강도", 42, 0, 100, "%")}
        ${rangeSetting("회전 각도", 18, -180, 180, "°")}
      </section>`;
  };

  const directorModePanel = (n) => {
    const mode = stackIdOf(n);
    if (mode === "camera") return `
      <section class="node-mode-settings">
        <div class="mode-settings-title"><b>카메라 앵글</b><span>SHOT SETUP</span></div>
        <div class="angle-preview"><span class="angle-horizon"></span><i class="angle-subject">SUBJECT</i><b>−12°</b></div>
        <div class="mode-field-grid">
          <label><span>Shot Size</span><select><option>Medium Close-Up</option><option>Wide Shot</option><option>Close-Up</option></select></label>
          <label><span>Angle</span><select><option>Low Angle</option><option>Eye Level</option><option>High Angle</option><option>Dutch Angle</option></select></label>
          <label><span>Height</span><input value="1.2 m" /></label>
          <label><span>Tilt</span><input value="-12°" /></label>
        </div>
      </section>`;
    if (mode === "lens") return `
      <section class="node-mode-settings">
        <div class="mode-settings-title"><b>렌즈 설정</b><span>FULL FRAME</span></div>
        <div class="lens-dial"><strong>35</strong><span>mm</span><i></i></div>
        ${rangeSetting("초점 거리", 35, 18, 135, "mm")}
        ${rangeSetting("조리개", 28, 14, 160, "")}
        <div class="mode-field-grid"><label><span>Focus</span><select><option>Subject Eye</option><option>Manual</option></select></label><label><span>DOF</span><select><option>Shallow</option><option>Deep</option></select></label></div>
      </section>`;
    if (mode === "movement") return `
      <section class="node-mode-settings">
        <div class="mode-settings-title"><b>카메라 이동</b><span>5.0 SEC</span></div>
        <div class="motion-path is-director"><i class="motion-start">IN</i><span><b></b></span><i class="motion-end">OUT</i></div>
        <div class="mode-field-grid"><label><span>Move</span><select><option>Slow Dolly In</option><option>Orbit</option><option>Handheld</option></select></label><label><span>Speed</span><select><option>0.6× Slow</option><option>1.0× Normal</option></select></label></div>
        ${rangeSetting("이동 거리", 180, 20, 400, "cm")}
      </section>`;
    if (mode === "lighting") return `
      <section class="node-mode-settings lighting-settings">
        <div class="mode-settings-title"><b>3점 조명</b><span>LIGHTING PLOT</span></div>
        <div class="light-plot">
          <i class="light-subject">S</i><button type="button" class="light-point key">KEY<b>45°</b></button><button type="button" class="light-point fill">FILL<b>−35°</b></button><button type="button" class="light-point rim">RIM<b>135°</b></button>
        </div>
        <div class="mode-field-grid"><label><span>Color Temp.</span><select><option>4300K Neutral</option><option>3200K Warm</option><option>5600K Daylight</option></select></label><label><span>Key : Fill</span><select><option>2 : 1</option><option>4 : 1</option><option>8 : 1</option></select></label></div>
        ${rangeSetting("Key 강도", 78, 0, 100, "%")}
      </section>`;
    const generic = {
      composition: ["구도 가이드", "Rule of Thirds", "Head Room", "12%"],
      subject: ["피사체 설정", "Frame Left", "Eye Line", "Camera"],
      color: ["컬러 사이언스", "ARRI LogC", "LUT", "Neutral Film"],
      depth: ["심도와 포커스", "Rack Focus", "Near → Subject", "2.4m"],
      blocking: ["블로킹", "Mark A → B", "Facing", "Camera Left"],
      continuity: ["연속성", "Previous Shot", "Axis", "180° 유지"],
    }[mode] || ["연출 설정", stackOf(n).label, "Preset", "Default"];
    return `
      <section class="node-mode-settings">
        <div class="mode-settings-title"><b>${generic[0]}</b><span>DIRECTING</span></div>
        <div class="mode-field-grid"><label><span>Preset</span><select><option>${generic[1]}</option></select></label><label><span>${generic[2]}</span><input value="${generic[3]}" /></label></div>
        ${rangeSetting("적용 강도", 65, 0, 100, "%")}
      </section>`;
  };

  const imageHTML = (n) => n.compact ? `
    <article class="node node-thumb" data-id="${n.id}" data-scope="${n.group ? "seq" : "shared"}" style="left:${n.x}px;top:${n.y}px">
      <div class="media media-thumb ${n.ready ? "" : "media-empty"}">
        ${veil(n)}
        ${n.ready ? `<img src="${n.src || BLANK}" alt=""><span class="look-wash"></span>` : ""}
      </div>
      <span class="thumb-label">${kicker("image", n.shot || n.title || stackOf(n).label)}</span>
      ${stackPick(n)}
      <button class="plus-btn" type="button" data-plus="${n.id}">+</button>
    </article>` : `
    <article class="node node-image" data-id="${n.id}" data-scope="${n.group ? "seq" : "shared"}" style="left:${n.x}px;top:${n.y}px">
      <div class="node-meta">${kicker("image", "이미지")}${stackPick(n)}</div>
      ${imageModeVisual(n) || `<div class="media media-sq ${n.ready ? "" : "media-empty"}">
        ${veil(n)}
        ${n.ready ? `<img src="${n.src || BLANK}" alt=""><span class="look-wash"></span>` : `<span>${stackOf(n).hint}</span>`}
        <button class="icon-btn media-tools-trigger" type="button" data-media-tools="${n.id}" aria-label="이미지 도구 열기" title="이미지 도구">⋯</button>
      </div>`}
      ${lookLine() ? `<div class="look-strip"><span class="look-dots">${palDots(lookBy("palette", state.look.palette) || lookBy("light", state.look.light))}</span><em>${lookLine()}</em></div>` : ""}
      ${slashRow(n)}
      <div class="prompt-dock narrow">
        <textarea data-prompt="${n.id}" placeholder="/ 로 빠른 기능 · ${stackOf(n).hint}">${n.prompt || ""}</textarea>
        <div class="prompt-foot"><span>${stackOf(n).label}</span>${sendBtn(n)}</div>
      </div>
      <button class="plus-btn" type="button" data-plus="${n.id}">+</button>
    </article>`;

  const videoHTML = (n) => `
    <article class="node node-video" data-id="${n.id}" data-scope="${n.group ? "seq" : "shared"}" style="left:${n.x}px;top:${n.y}px">
      <div class="node-meta">${kicker("video", "비디오")}${stackPick(n)}</div>
      ${n.ready ? `
        <div class="toolbar" data-bar="${n.id}">
          <button type="button" data-run="enhance" data-id="${n.id}">고화질</button>
          <button type="button" data-run="tool" data-id="${n.id}" data-label="구간 리메이크 중…">구간 리메이크</button>
          <button type="button" data-run="tool" data-id="${n.id}" data-label="분석 중…">스마트 분석</button>
          <button type="button" data-run="tool" data-id="${n.id}" data-label="영상 합성 중…">영상 합성</button>
          <button type="button" data-run="tool" data-id="${n.id}" data-label="음성 분리 중…">음성/배경음 분리</button>
          <button type="button" data-run="tool" data-id="${n.id}" data-label="오디오/비디오 분리 중…">오디오/비디오 분리</button>
          <button type="button" data-run="tool" data-id="${n.id}" data-label="스마트 이어쓰기 중…">스마트 이어쓰기</button>
          <button type="button" data-frame="${n.id}">현재 프레임 캡처</button>
        </div>` : ""}
      <div class="media media-wide ${n.ready ? "" : "media-empty"}">
        ${veil(n)}
        ${n.ready ? `<span class="ai-tag">AI</span><img src="${BLANK}" alt=""><span class="look-wash"></span><div class="player-ui"><span>▶</span><span>0:00</span><span class="bar"><span></span></span><span>0:05</span></div>` : `<span class="play-mark">▶</span>`}
      </div>
      ${cameraMotionPanel(n)}
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
          <textarea data-prompt="${n.id}" placeholder="${stackOf(n).hint}">${n.prompt || ""}</textarea>
        </div>
        <div class="prompt-foot">
          <span>${stackOf(n).label} · ${stackOf(n).hint}</span>
          ${sendBtn(n)}
        </div>
      </div>
      <button class="plus-btn" type="button" data-plus="${n.id}">+</button>
    </article>`;

  const upscaleHTML = (n) => `
    <article class="node node-upscale" data-id="${n.id}" data-scope="${n.group ? "seq" : "shared"}" style="left:${n.x}px;top:${n.y}px">
      <div class="node-meta">${kicker("upscale", `고화질${n.ready ? "(완료)" : "(1080P)"}`)}</div>
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
    <article class="node node-tool" data-id="${n.id}" data-scope="${n.group ? "seq" : "shared"}" style="left:${n.x}px;top:${n.y}px">
      <div class="node-meta">${kicker("text", "텍스트")}${stackPick(n)}</div>
      <div class="media media-text ${n.ready ? "is-ready" : "media-empty"}">
        ${veil(n)}
        ${n.ready ? `<p class="title-card">${n.prompt || TEXT_PROMPT}</p>` : `<span>${stackOf(n).hint}</span>`}
      </div>
      <div class="prompt-dock narrow">
        <textarea data-prompt="${n.id}" placeholder="${stackOf(n).hint}">${n.prompt || TEXT_PROMPT}</textarea>
        <div class="prompt-foot"><span>${stackOf(n).label}</span>${sendBtn(n)}</div>
      </div>
      <button class="plus-btn" type="button" data-plus="${n.id}">+</button>
    </article>`;

  const audioHTML = (n) => `
    <article class="node node-tool" data-id="${n.id}" data-scope="${n.group ? "seq" : "shared"}" style="left:${n.x}px;top:${n.y}px">
      <div class="node-meta">${kicker("audio", "오디오")}${stackPick(n)}</div>
      <div class="media media-audio ${n.ready ? "" : "media-empty"}">
        ${veil(n)}
        ${n.ready ? `<span class="wave"></span><span>▶ ${stackOf(n).label} · 0:12</span>` : `<span>${stackOf(n).hint}</span>`}
      </div>
      <div class="prompt-dock narrow">
        <textarea data-prompt="${n.id}" placeholder="${stackOf(n).hint}">${n.prompt || AUDIO_PROMPT}</textarea>
        <div class="prompt-foot"><span>${stackOf(n).label}</span>${sendBtn(n)}</div>
      </div>
      <button class="plus-btn" type="button" data-plus="${n.id}">+</button>
    </article>`;

  const editHTML = (n) => `
    <article class="node node-tool" data-id="${n.id}" data-scope="${n.group ? "seq" : "shared"}" style="left:${n.x}px;top:${n.y}px">
      <div class="node-meta">${kicker("edit", "스마트 편집 <em>BETA</em>")}${stackPick(n)}</div>
      <div class="media media-sq ${n.ready ? "" : "media-empty"}">
        ${veil(n)}
        ${n.ready ? `<span class="ai-tag">EDIT</span><img src="${BLANK}" alt="">` : `<span>${stackOf(n).hint}</span>`}
      </div>
      <div class="prompt-dock narrow">
        <textarea data-prompt="${n.id}" placeholder="${stackOf(n).hint}">${n.prompt || EDIT_PROMPT}</textarea>
        <div class="prompt-foot"><span>${stackOf(n).label}</span>${sendBtn(n)}</div>
      </div>
      <button class="plus-btn" type="button" data-plus="${n.id}">+</button>
    </article>`;

  const directorHTML = (n) => `
    <article class="node node-tool" data-id="${n.id}" data-scope="${n.group ? "seq" : "shared"}" style="left:${n.x}px;top:${n.y}px">
      <div class="node-meta">${kicker("director", "디렉터 콘솔 <em>NEW</em>")}${stackPick(n)}</div>
      ${directorModePanel(n)}
      <ol class="shot-list director-shot-summary">
        ${(n.shots || SHOTS).map((s, i) => `
          <li class="shot-row">
            <div class="shot-thumb ${n.ready ? "" : "is-empty"}">${n.ready ? `<img src="${BLANK}" alt="">` : i + 1}</div>
            <div><b>샷 ${i + 1}</b><span>${s.t} · ${s.d}</span></div>
          </li>`).join("")}
      </ol>
      <div class="prompt-foot dock-pad">
        <span>${stackOf(n).label} · ${stackOf(n).hint}</span>
        <button class="go-btn" type="button" data-run="sequence" data-id="${n.id}" ${n.busy ? "disabled" : ""}>
          ${n.busy ? `<span class="spin spin-sm"></span>` : "생성"}
        </button>
      </div>
      ${veil(n)}
      <button class="plus-btn" type="button" data-plus="${n.id}">+</button>
    </article>`;

  const analyzeHTML = (n) => `
    <article class="node node-tool" data-id="${n.id}" data-scope="${n.group ? "seq" : "shared"}" style="left:${n.x}px;top:${n.y}px">
      <div class="node-meta">${kicker("analyze", "스마트 분석")}${stackPick(n)}</div>
      <div class="analyze-box">
        ${veil(n)}
        ${n.ready ? `
          <p><b>5.0s</b> · 16:9 · 클로즈업</p>
          <p>핵심 동작: 잎을 들어 질문</p>
          <p>시선: 카메라 → 잎 → 학생</p>
          <p>권장 다음 샷: 실험 클로즈업</p>` : `<p class="muted-copy">${stackOf(n).hint}</p>`}
      </div>
      <div class="prompt-foot dock-pad">
        <span>${stackOf(n).label}</span>
        <button class="go-btn" type="button" data-run="analyze" data-id="${n.id}" ${n.busy ? "disabled" : ""}>
          ${n.busy ? `<span class="spin spin-sm"></span>` : "분석"}
        </button>
      </div>
      <button class="plus-btn" type="button" data-plus="${n.id}">+</button>
    </article>`;

  const scriptHTML = (n) => `
    <article class="node node-script node-tool" data-id="${n.id}" data-scope="${n.group ? "seq" : "shared"}" style="left:${n.x}px;top:${n.y}px">
      <div class="node-meta">${kicker("script", "스크립트")}${stackPick(n)}</div>
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
        <textarea data-prompt="${n.id}" placeholder="${stackOf(n).hint}">${n.prompt || ""}</textarea>
        <div class="story-dock-foot">
          <span class="model-chip">✦ Avora Directing</span>
          <button class="bolt-btn" type="button" data-run="script" data-id="${n.id}" ${n.busy ? "disabled" : ""} aria-label="생성">
            ${n.busy ? `<span class="spin spin-sm"></span>` : `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h7l-1 8 10-14h-7z"/></svg>`}
          </button>
        </div>
      </div>
      <button class="plus-btn" type="button" data-plus="${n.id}">+</button>
    </article>`;

  const refHTML = (n) => `
    <article class="node node-image" data-id="${n.id}" data-scope="${n.group ? "seq" : "shared"}" style="left:${n.x}px;top:${n.y}px">
      <div class="node-meta">${kicker("ref", "참조 노드")}${stackPick(n)}</div>
      <div class="media media-sq ${n.ready ? "" : "media-empty"}">
        ${veil(n)}
        ${n.ready ? `<img src="${BLANK}" alt=""><span class="ai-tag">REF</span>` : `<span>${stackOf(n).hint}</span>`}
        <button class="icon-btn media-tools-trigger" type="button" data-media-tools="${n.id}" aria-label="이미지 도구 열기" title="이미지 도구">⋯</button>
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
    <article class="node" data-id="${n.id}" data-scope="${n.group ? "seq" : "shared"}" style="left:${n.x}px;top:${n.y}px">
      <div class="node-meta">${kicker(n.type, n.title)}</div>
      <div class="media media-sq media-empty"><span>${n.title}</span></div>
      <button class="plus-btn" type="button" data-plus="${n.id}">+</button>
    </article>`;

  const nodeHTML = (n) => {
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
  };

  const renderGroups = () => (state.groups || []).map((g) => {
    const kids = nodesInGroup(g.id);
    const on = state.frameEdit && state.selectedGroup === g.id;
    return `
    <section class="board-group${on ? " is-on" : ""}" data-group="${g.id}" aria-label="작은 캔버스 ${g.title}" style="left:${g.x}px;top:${g.y}px;width:${g.w}px;height:${g.h}px">
      <header class="board-tag" data-group-drag="${g.id}" role="button" tabindex="0" aria-label="${g.title} 작은 캔버스 이동"><b>${g.no}</b><span class="item-label">${g.title}</span></header>
      <div class="board-nodes">${kids.map(nodeHTML).join("")}</div>
      ${["nw", "n", "ne", "w", "e", "sw", "s", "se"].map((dir) => `<i class="mini-handle" data-resize="${dir}" data-group="${g.id}" role="slider" aria-label="${dir} 크기 조절"></i>`).join("")}
    </section>`;
  }).join("");

  const renderNodes = () => {
    const nested = new Set();
    (state.groups || []).forEach((g) => nodesInGroup(g.id).forEach((n) => nested.add(n.id)));
    world.innerHTML = renderGroups() + state.nodes.filter((n) => !nested.has(n.id)).map(nodeHTML).join("");
  };

  const ADD_TYPES = ["text", "image", "video", "edit", "director", "analyze", "audio", "script", "ref"];
  const ADD_BADGE = { edit: "BETA", director: "NEW", script: "NEW" };
  const renderAddMenu = () => {
    addMenu.innerHTML = `
      <p class="add-menu-title">이 노드를 참조하여 생성</p>
      <div class="add-menu-cols">
        <div class="add-menu-main">
          ${ADD_TYPES.map((type) => `
            <button type="button" data-spawn-type="${type}"${type === "video" ? ' data-tour="video"' : ""}>
              ${NODE_ICO[type] || ""}${NODE_TITLE[type]}${ADD_BADGE[type] ? `<em>${ADD_BADGE[type]}</em>` : ""}
              <span class="add-chevron">›</span>
            </button>`).join("")}
        </div>
        <div class="add-menu-stack" id="addMenuStack" hidden></div>
      </div>`;
  };
  const showAddStacks = (type) => {
    const panel = addMenu.querySelector("#addMenuStack");
    if (!panel) return;
    addMenu.querySelectorAll("[data-spawn-type]").forEach((b) => {
      if (!b.dataset.spawnStack) b.classList.toggle("is-on", b.dataset.spawnType === type);
    });
    const list = NODE_STACKS[type] || [];
    panel.hidden = !list.length;
    panel.innerHTML = list.map((s) => `
      <button type="button" data-spawn-type="${type}" data-spawn-stack="${s.id}">
        <b>${s.label}</b>
        <small>${s.hint}</small>
      </button>`).join("");
    requestAnimationFrame(clampAddMenu);
  };

  const clampAddMenu = () => {
    if (addMenu.hidden) return;
    const gap = 16;
    const r = addMenu.getBoundingClientRect();
    if (r.right > window.innerWidth - gap) {
      addMenu.style.left = `${Math.max(340, window.innerWidth - r.width - gap)}px`;
    }
    if (!addMenu.style.bottom && r.bottom > window.innerHeight - gap) {
      addMenu.style.top = `${Math.max(60, r.top - (r.bottom - window.innerHeight + gap))}px`;
    }
  };

  const setAddMenuTitle = () => {
    const title = addMenu.querySelector(".add-menu-title");
    if (title) title.textContent = state.plusFrom ? "이 노드를 참조하여 생성" : "보드에 노드 추가";
  };
  const openMenu = (id, btn) => {
    state.plusFrom = id;
    addMenu.hidden = false;
    setAddMenuTitle();
    const r = btn.getBoundingClientRect();
    addMenu.style.left = `${r.right + 10}px`;
    if (r.top > window.innerHeight / 2) {
      addMenu.style.top = "auto";
      addMenu.style.bottom = `${Math.max(16, window.innerHeight - r.bottom)}px`;
    } else {
      addMenu.style.bottom = "";
      addMenu.style.top = `${Math.max(60, r.top - 24)}px`;
    }
    addMenu.querySelectorAll("[data-spawn-type]").forEach((b) => {
      if (b.dataset.spawnStack) return;
      b.classList.toggle("is-hot", b.dataset.spawnType === "video" && state.coach === 1);
    });
    if (state.coach === 1) showAddStacks("video");
    else {
      const panel = addMenu.querySelector("#addMenuStack");
      if (panel) panel.hidden = true;
      addMenu.querySelectorAll("[data-spawn-type]").forEach((b) => b.classList.remove("is-on"));
    }
  };
  const openDockAddMenu = (btn) => {
    state.plusFrom = "";
    addMenu.hidden = false;
    setAddMenuTitle();
    const r = btn.getBoundingClientRect();
    addMenu.style.left = `${Math.min(r.left, window.innerWidth - 460)}px`;
    addMenu.style.top = "auto";
    addMenu.style.bottom = `${Math.max(16, window.innerHeight - r.top + 10)}px`;
    const panel = addMenu.querySelector("#addMenuStack");
    if (panel) panel.hidden = true;
    addMenu.querySelectorAll("[data-spawn-type]").forEach((b) => {
      b.classList.remove("is-hot", "is-on");
    });
  };

  const placeMenu = () => {
    if (addMenu.hidden) return;
    if (state.plusFrom) {
      const btn = world.querySelector(`[data-plus="${state.plusFrom}"]`);
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      addMenu.style.left = `${r.right + 10}px`;
      if (r.top > window.innerHeight / 2) {
        addMenu.style.top = "auto";
        addMenu.style.bottom = `${Math.max(16, window.innerHeight - r.bottom)}px`;
      } else {
        addMenu.style.bottom = "";
        addMenu.style.top = `${Math.max(60, r.top - 24)}px`;
      }
      return;
    }
    const btn = document.querySelector("[data-add-node]");
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    addMenu.style.left = `${Math.min(r.left, window.innerWidth - 460)}px`;
    addMenu.style.top = "auto";
    addMenu.style.bottom = `${Math.max(16, window.innerHeight - r.top + 10)}px`;
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

  const CORE_TYPES = ["script", "image", "video", "audio", "text"];
  const FOLDER_KIND = { new: "image", audio: "audio", character: "image", scene: "image", prop: "image", style: "ref" };
  const folderOf = (n) => {
    if (n.folder && state.folders.includes(n.folder)) return n.folder;
    if (n.type === "audio") return "audio";
    if (n.type === "script" || n.type === "text" || n.type === "director") return "new";
    if (n.type === "ref" && n.mode === "character") return "character";
    if (n.type === "ref" || n.type === "upscale" || n.type === "analyze") return "style";
    if (n.type === "image" || n.type === "video" || n.type === "edit") return "scene";
    return "new";
  };
  const fileLabel = (n) => n.shot || n.title || NODE_TITLE[n.type] || n.type;
  const ICO = {
    chev: `<svg class="folder-chev" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m9 6 6 6-6 6"/></svg>`,
    folder: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`,
    image: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 16 5-6 4 4 3-4 4 6"/></svg>`,
  };
  const libById = (id) => state.library.find((a) => a.id === id);
  const inspectOn = () => {
    const cur = state.inspect;
    if (!cur) return { lib: null, node: null };
    if (cur.kind === "lib") {
      const lib = libById(cur.id);
      return { lib, node: lib?.nodeId ? nodeById(lib.nodeId) : null };
    }
    return { lib: null, node: nodeById(cur.id) };
  };
  const fileActive = (libId, nodeId) => {
    const cur = state.inspect;
    if (!cur) return nodeId && nodeId === state.selectedId;
    if (cur.kind === "lib") return cur.id === libId;
    return cur.id === nodeId;
  };
  const thumbOf = (src, fallback) => src
    ? `<img class="asset-thumb" src="${src}" alt="" />`
    : `<span class="asset-thumb" aria-hidden="true">${fallback || ICO.image}</span>`;

  const renderInspect = () => {
    const el = document.getElementById("assetInspect");
    if (!el) return;
    const kitOn = document.querySelector("[data-side-panel='kit']")?.classList.contains("is-on");
    const { lib, node } = inspectOn();
    const item = lib || node;
    if (!kitOn || !item) {
      el.hidden = true;
      return;
    }
    const title = lib ? lib.name : fileLabel(node);
    const src = lib?.src || node?.src || "";
    const author = lib?.author || "Jisu Lee";
    const when = lib?.createdAt || new Date().toISOString().slice(0, 16).replace("T", " ");
    const kind = node?.type || "image";
    const kicker = kind === "video" ? "비디오 노드" : kind === "audio" ? "오디오 노드" : kind === "script" ? "스크립트 노드" : "이미지 노드 1";
    document.getElementById("assetInspectKicker").querySelector("span").textContent = kicker;
    document.getElementById("assetInspectTitle").textContent = title;
    document.getElementById("assetInspectAuthor").textContent = author;
    document.getElementById("assetInspectWhen").textContent = when;
    document.getElementById("assetInspectMedia").innerHTML = src ? `<img src="${src}" alt="" />` : ICO.image;
    document.getElementById("assetAddCanvas").textContent = (lib?.nodeId || node) ? "캔버스에서 보기" : "캔버스에 추가";
    el.hidden = false;
  };

  const renderAssetTree = () => {
    const tree = document.getElementById("assetTree");
    if (!tree) return;
    const q = (state.assetQuery || "").trim().toLowerCase();
    const linked = new Set(state.library.map((a) => a.nodeId).filter(Boolean));
    tree.innerHTML = state.folders.map((id) => {
      const libs = state.library.filter((a) => a.folder === id && (!q || a.name.toLowerCase().includes(q)));
      const nodes = state.nodes.filter((n) => folderOf(n) === id && !linked.has(n.id) && (!q || fileLabel(n).toLowerCase().includes(q)));
      const open = state.folderOpen[id];
      const files = [
        ...libs.map((a) => `
          <button type="button" class="asset-file${fileActive(a.id, a.nodeId) ? " is-on" : ""}" data-lib="${a.id}"${a.nodeId ? ` data-node="${a.nodeId}"` : ""}>
            ${thumbOf(a.src)}
            <span class="item-label">${a.name}</span>
            <span class="asset-more" data-more="1" aria-label="더보기">⋯</span>
          </button>`),
        ...nodes.map((n) => `
          <button type="button" class="asset-file${fileActive("", n.id) ? " is-on" : ""}" data-node="${n.id}">
            ${thumbOf(n.src)}
            <span class="item-label">${fileLabel(n)}</span>
            <span class="asset-more" data-more="1" aria-label="더보기">⋯</span>
          </button>`),
      ].join("");
      return `
        <div class="asset-folder${open ? " is-open" : ""}" data-folder="${id}">
          <div class="folder-row" data-folder="${id}">
            ${ICO.chev}
            ${ICO.folder}
            <span class="item-label">${state.folderNames[id] || "폴더"}</span>
          </div>
          <div class="folder-kids"${open ? "" : " hidden"}>${files}</div>
        </div>`;
    }).join("");
    renderInspect();
  };

  const focusAsset = (id) => {
    const n = nodeById(id);
    if (!n) return;
    state.selectedId = id;
    const sz = sizeOf(n);
    const at = worldOf(n);
    const r = canvas.getBoundingClientRect();
    state.cam.x = r.width / 2 - (at.x + sz.w / 2) * state.cam.scale;
    state.cam.y = r.height / 2 - (at.y + sz.h / 2) * state.cam.scale;
    renderAll();
  };

  const STARRY_POSES = new Set(["basic", "smile", "wink", "curious", "focus", "thinking", "love", "excited", "tired", "surprised", "greeting", "hello"]);
  const setStarryPose = (pose) => {
    if (!starryPose || !STARRY_POSES.has(pose) || starryPose.dataset.pose === pose) return;
    starryPose.dataset.pose = pose;
    starryPose.src = `assets/app/starry-poses/${pose}.png`;
  };
  const starryPoseForMessage = (text) => {
    const t = String(text || "").toLowerCase();
    if (t.includes("피곤") || t.includes("힘들") || t.includes("실패") || t.includes("안 돼") || t.includes("에러")) return "tired";
    if (t.includes("놀라") || t.includes("대박") || t.includes("헉") || t.includes("와!")) return "surprised";
    if (t.includes("사랑") || t.includes("최고") || t.includes("마음에 들어")) return "love";
    if (t.includes("신나") || t.includes("재밌") || t.includes("기대")) return "excited";
    if (t.includes("안녕") || t.includes("하이")) return "hello";
    if (t.includes("인사") || t.includes("반가")) return "greeting";
    if (t.includes("윙크")) return "wink";
    if (t.includes("?") || t.includes("왜") || t.includes("뭐") || t.includes("어떻게")) return "curious";
    if (t.includes("생각") || t.includes("고민") || t.includes("아이디어") || t.includes("기획")) return "thinking";
    if (t.includes("만들") || t.includes("생성") || t.includes("분석") || t.includes("스토리") || t.includes("영상")) return "focus";
    if (t.includes("좋아") || t.includes("고마워") || t.includes("잘했")) return "smile";
    return "basic";
  };
  const starryPoseForStep = (step, intentPose) => {
    if (/준비|완성|시작/.test(step)) return "excited";
    if (/정리|나누|맞추|넣고|붙이고/.test(step)) return "thinking";
    if (/읽고|확인|분석|생성|변환|고화질/.test(step)) return "focus";
    return intentPose || "basic";
  };
  const updateStarry = (forcedLabel = "", workingOverride, forcedPose = "") => {
    if (!starryAgent || !starryStatus) return;
    const busyNode = state.nodes.find((node) => node.busy);
    const chatBusy = chatHead?.classList.contains("is-generating");
    const working = workingOverride ?? Boolean(forcedLabel || busyNode || chatBusy);
    starryAgent.classList.toggle("is-working", working);
    starryStatus.textContent = forcedLabel || busyNode?.busy || (chatBusy ? "요청을 정리 중…" : "준비됐어요");
    setStarryPose(forcedPose || (busyNode ? "focus" : chatBusy ? (starryAgent.dataset.intentPose || "thinking") : "basic"));
  };

  const renderAll = () => {
    renderNodes();
    layoutSampleWorkspace();
    renderAssetTree();
    renderCanvasDock();
    applyLookCss();
    applyCam();
    placeMediaTools();
    updateStarry();
  };

  const placeMediaTools = () => {
    const bar = document.getElementById("mediaTools");
    if (!bar) return;
    const n = nodeById(state.mediaToolsNode);
    const show = n && state.selectedId === n.id && (n.type === "image" || n.type === "ref") && !n.compact;
    if (!show) {
      bar.hidden = true;
      return;
    }
    bar.hidden = false;
    bar.innerHTML = `<span class="media-tools-label">이미지 도구</span>${IMG_TOOLS.map((t) => `
      <button type="button" data-img-tool="${t.id}" data-id="${n.id}">${t.label}</button>`).join("")}`;
    const el = world.querySelector(`[data-id="${n.id}"]`);
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cr = canvas.getBoundingClientRect();
    const half = bar.offsetWidth / 2;
    const center = r.left - cr.left + r.width / 2;
    bar.style.left = `${Math.min(Math.max(center, half + 8), cr.width - half - 8)}px`;
    const above = r.top - cr.top - bar.offsetHeight - 8;
    bar.style.top = `${above >= 8 ? above : Math.min(cr.height - bar.offsetHeight - 8, r.top - cr.top + 38)}px`;
  };

  const nextCanvasNo = () => {
    const used = new Set((state.groups || []).map((g) => Number.parseInt(g.no, 10)).filter((n) => Number.isFinite(n)));
    let n = 1;
    while (used.has(n)) n += 1;
    return String(n).padStart(2, "0");
  };

  const paintFrameEdit = () => {
    world.querySelectorAll(".board-group").forEach((el) => {
      el.classList.toggle("is-on", !!(state.frameEdit && el.dataset.group === state.selectedGroup));
    });
    renderCanvasDock();
  };

  const selectFrame = (g, edit) => {
    if (!g) return;
    state.selectedGroup = g.id;
    state.frameEdit = !!edit;
    paintFrameEdit();
  };

  const clearFrameEdit = () => {
    if (!state.selectedGroup && !state.frameEdit) return;
    state.selectedGroup = "";
    state.frameEdit = false;
    paintFrameEdit();
  };

  const focusGroup = (g) => {
    if (!g) return;
    const r = canvas.getBoundingClientRect();
    state.cam.x = r.width / 2 - (g.x + g.w / 2) * state.cam.scale;
    state.cam.y = r.height / 2 - (g.y + g.h / 2) * state.cam.scale;
    state.selectedGroup = g.id;
    state.frameEdit = true;
    renderAll();
  };

  const beginMoveGroup = (g, e) => {
    state.movingGroup = {
      id: g.id,
      sx: e.clientX,
      sy: e.clientY,
      x: g.x,
      y: g.y,
      live: false,
    };
  };

  const fitAllGroups = () => {
    const groups = state.groups || [];
    if (!groups.length) return;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    groups.forEach((g) => {
      minX = Math.min(minX, g.x);
      minY = Math.min(minY, g.y);
      maxX = Math.max(maxX, g.x + g.w);
      maxY = Math.max(maxY, g.y + g.h);
    });
    const r = canvas.getBoundingClientRect();
    const pad = 64;
    const bw = Math.max(240, maxX - minX + pad * 2);
    const bh = Math.max(180, maxY - minY + pad * 2);
    const scale = Math.min(1.2, Math.max(0.28, Math.min((r.width - 32) / bw, (r.height - 96) / bh)));
    state.cam.scale = scale;
    state.cam.x = r.width / 2 - (minX + (maxX - minX) / 2) * scale;
    state.cam.y = r.height / 2 - (minY + (maxY - minY) / 2) * scale;
  };

  const layoutStackColumn = () => {
    const groups = [...(state.groups || [])].sort((a, b) => Number(a.no) - Number(b.no));
    if (!groups.length) return groups;
    const gap = 72;
    const maxW = Math.max(...groups.map((g) => g.w));
    let y = 0;
    groups.forEach((g) => {
      g.x = Math.round((maxW - g.w) / 2);
      g.y = y;
      y += g.h + gap;
    });
    return groups;
  };

  const fitStackTop = (groups) => {
    if (!groups.length) return;
    const r = canvas.getBoundingClientRect();
    let minX = Infinity, minY = Infinity, maxX = -Infinity;
    groups.forEach((g) => {
      minX = Math.min(minX, g.x);
      minY = Math.min(minY, g.y);
      maxX = Math.max(maxX, g.x + g.w);
    });
    const bw = Math.max(240, maxX - minX);
    const scale = Math.min(0.92, Math.max(0.36, (r.width - 96) / (bw + 48)));
    state.cam.scale = scale;
    state.cam.x = r.width / 2 - (minX + bw / 2) * scale;
    state.cam.y = 36 - minY * scale;
  };

  const stackCanvases = () => {
    const groups = [...(state.groups || [])].sort((a, b) => Number(a.no) - Number(b.no));
    groups.forEach((g) => {
      if (g.rowX == null) {
        g.rowX = g.x;
        g.rowY = g.y;
      }
    });
    layoutStackColumn();
    state.stackView = true;
    state.selectedGroup = "";
    state.frameEdit = false;
    fitStackTop(groups);
    renderAll();
  };

  const unstackCanvases = () => {
    (state.groups || []).forEach((g) => {
      if (g.rowX != null) {
        g.x = g.rowX;
        g.y = g.rowY;
      }
    });
    state.stackView = false;
    fitAllGroups();
    renderAll();
  };

  const nodeDockLabel = (n) => {
    const st = stackOf(n);
    const name = n.shot || n.title || NODE_TITLE[n.type] || n.type;
    return st.label && st.label !== name ? `${name} · ${st.label}` : name;
  };
  const nodeDockChip = (n) => `
    <button type="button" class="canvas-dock-item${state.selectedId === n.id ? " is-on" : ""}" data-focus-node="${n.id}">
      <b class="dock-node-ico">${NODE_ICO[n.type] || ""}</b>
      <span class="item-label">${nodeDockLabel(n)}</span>
    </button>`;
  const renderCanvasDock = () => {
    const list = document.getElementById("canvasDockList");
    const addBtn = document.getElementById("canvasDockAdd");
    if (!list) return;
    if (state.dockTab === "node") {
      const seqs = [...(state.groups || [])].sort((a, b) => Number(a.no) - Number(b.no)).map((g) => {
        const kids = sequenceNodes(g.id);
        if (!kids.length) return "";
        return `<div class="dock-seq">
          <button type="button" class="dock-seq-label" data-focus-group="${g.id}">${g.no} ${g.title}</button>
          ${kids.map(nodeDockChip).join("")}
        </div>`;
      }).join("");
      const loose = state.nodes.filter((n) => !n.group);
      const board = `<div class="dock-seq">
        <p class="dock-seq-label">공통 참조</p>
        ${loose.length ? loose.map(nodeDockChip).join("") : `<p class="dock-seq-empty">시퀀스 밖에 두면 전체가 참고합니다</p>`}
      </div>`;
      list.innerHTML = board + seqs;
    } else {
      list.innerHTML = (state.groups || []).map((g) => `
        <button type="button" class="canvas-dock-item${state.selectedGroup === g.id ? " is-on" : ""}" data-focus-group="${g.id}">
          <b>${g.no}</b><span class="item-label">${g.title}</span>
        </button>`).join("");
    }
    if (addBtn) addBtn.hidden = false;
    list.hidden = !state.dockOpen || !list.innerHTML.trim();
    document.querySelectorAll("[data-dock-tab]").forEach((tab) => {
      const on = tab.dataset.dockTab === state.dockTab;
      tab.classList.toggle("is-on", on);
      tab.setAttribute("aria-selected", on ? "true" : "false");
      tab.setAttribute("aria-expanded", on && state.dockOpen ? "true" : "false");
    });
    document.getElementById("stackCanvases")?.classList.toggle("is-on", !!state.stackView);
    document.getElementById("stackCanvases")?.setAttribute("aria-pressed", state.stackView ? "true" : "false");
  };

  const CANVAS_WORKFLOWS = {
    preproduction: {
      title: "프리 프로덕션",
      nodes: [
        { type: "text", title: "콘셉트 브리프", prompt: "로그라인, 타깃, 톤앤매너와 핵심 메시지를 정리합니다." },
        { type: "script", title: "트리트먼트", prompt: "콘셉트 브리프를 장면과 비트 단위의 트리트먼트로 발전시킵니다." },
        { type: "director", title: "샷 설계" },
      ],
    },
    storyboard: {
      title: "스토리보드",
      nodes: [
        { type: "script", title: "스크립트", prompt: "장면을 샷 단위로 분해합니다." },
        { type: "image", title: "와이드 샷", compact: true, shot: "와이드 샷", from: 0 },
        { type: "image", title: "미디엄 샷", compact: true, shot: "미디엄 샷", from: 0 },
        { type: "image", title: "클로즈업", compact: true, shot: "클로즈업", from: 0 },
        { type: "image", title: "인서트 샷", compact: true, shot: "인서트 샷", from: 0 },
      ],
    },
    "image-video": {
      title: "이미지 → 영상",
      nodes: [
        { type: "image", title: "키 비주얼", prompt: "영상의 시작 프레임과 룩을 생성합니다." },
        { type: "video", title: "모션 생성", prompt: "카메라 무빙과 피사체 동작을 적용합니다." },
        { type: "upscale", title: "마스터 업스케일" },
      ],
    },
    postproduction: {
      title: "포스트 프로덕션",
      nodes: [
        { type: "video", title: "편집본", prompt: "선택한 테이크를 기준으로 편집 흐름을 구성합니다." },
        { type: "edit", title: "컬러·리터치", prompt: "컬러 매칭, 리터치와 화면 정리를 적용합니다." },
        { type: "audio", title: "사운드 마감", prompt: "대사, 효과음과 배경 음악의 밸런스를 정리합니다." },
      ],
    },
  };

  const createMiniCanvas = (options = {}) => {
    const groups = state.groups || (state.groups = []);
    const no = nextCanvasNo();
    const last = state.stackView
      ? groups.reduce((acc, g) => (!acc || g.y + g.h > acc.y + acc.h ? g : acc), null)
      : groups.reduce((acc, g) => (!acc || g.x + g.w > acc.x + acc.w ? g : acc), null);
    const g = {
      id: uid("g"),
      no,
      title: options.title || "새 캔버스",
      x: state.stackView ? 0 : (last ? last.x + last.w + 48 : 40),
      y: state.stackView ? (last ? last.y + last.h + 72 : 0) : (last ? last.y : 24),
      w: options.w || 560,
      h: options.h || 700,
    };
    groups.push(g);
    if (state.stackView) {
      layoutStackColumn();
      fitStackTop(groups);
    }
    if (options.focus !== false) focusGroup(g);
    return g;
  };

  const createWorkflowCanvas = (templateId) => {
    if (templateId === "blank") {
      createMiniCanvas();
      return;
    }
    const workflow = CANVAS_WORKFLOWS[templateId];
    if (!workflow) return;
    const g = createMiniCanvas({ title: workflow.title, w: 1480, h: 720, focus: false });
    const created = [];
    workflow.nodes.forEach((spec, index) => {
      const type = spec.type;
      const node = {
        id: uid(type.slice(0, 2)),
        type,
        title: spec.title || NODE_TITLE[type],
        compact: !!spec.compact,
        x: 0,
        y: 0,
        prompt: spec.prompt || "",
        ready: false,
        mode: STACK_DEFAULT[type] || "",
        shots: type === "director" ? SHOTS.map((shot) => ({ ...shot })) : undefined,
        folder: type === "audio" ? "audio" : type === "image" ? "scene" : "new",
        shot: spec.shot || "",
        group: g.id,
      };
      const slot = layoutSlotInGroup(g, node);
      node.x = slot.x;
      node.y = slot.y;
      state.nodes.push(node);
      created.push(node);
      if (index > 0) {
        const source = created[Number.isInteger(spec.from) ? spec.from : index - 1];
        if (source) state.edges.push({ from: source.id, to: node.id });
      }
    });
    expandGroupToFit(g);
    state.selectedId = created[0]?.id || "";
    focusGroup(g);
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
          x: 28 + (i % 4) * 148,
          y: 48 + Math.floor(i / 4) * 176,
          prompt: shot.prompt,
          ready: false,
          src: shot.src,
          shot: shot.t,
          group: "g2",
        };
        state.nodes.push(node);
        state.edges.push({ from: src.id, to: id });
      } else {
        node.group = node.group || "g2";
        node.prompt = shot.prompt;
        node.src = shot.src;
        node.shot = shot.t;
        node.ready = false;
        node.compact = true;
      }
      window.setTimeout(() => startJob(node.id, "generate"), 280 + i * 420);
    });
    expandGroupToFit(groupById("g2"));
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
        if (!isSample) spawnStoryImages(x, shots);
      } },
      upscale: { label: "고화질 변환 중…", ms: 1500, fn: (x) => { x.ready = true; } },
      tool: { label: label || "처리 중…", ms: 1000, fn: () => {} },
      enhance: { label: "고화질 연결 중…", ms: 900, fn: (x) => {
        if (state.nodes.some((q) => q.type === "upscale")) return;
        const nid = uid("up");
        state.nodes.push({ id: nid, type: "upscale", title: "고화질", x: x.x + 640, y: x.y, ready: false, group: x.group });
        state.edges.push({ from: x.id, to: nid });
        if (x.group) expandGroupToFit(groupById(x.group));
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

  const spawnFrom = (type, folderId, stackId) => {
    const src = nodeById(state.plusFrom);
    if (!src || !NODE_TITLE[type]) return;
    const kind = type;
    const id = uid(kind.slice(0, 2));
    const siblings = state.edges.filter((e) => e.from === src.id).length;
    const prompts = { video: PROMPT, image: IMG_PROMPT, text: TEXT_PROMPT, audio: AUDIO_PROMPT, edit: EDIT_PROMPT, script: "" };
    const srcAt = worldOf(src);
    const mode = stackId || STACK_DEFAULT[kind] || "";
    const node = {
      id,
      type: kind,
      title: NODE_TITLE[kind] || kind,
      compact: false,
      x: 0,
      y: 0,
      prompt: prompts[kind] || "",
      ready: false,
      mode,
      shots: kind === "director" ? SHOTS.map((s) => ({ ...s })) : undefined,
      folder: folderId || (kind === "audio" ? "audio" : kind === "image" ? "scene" : kind === "ref" ? "style" : "new"),
      group: src.group || "",
    };
    if (src.group && groupById(src.group)) {
      const slot = layoutSlotInGroup(groupById(src.group), node);
      node.x = slot.x;
      node.y = slot.y;
    } else {
      node.x = srcAt.x + sizeOf(src).w + 56;
      node.y = srcAt.y + siblings * (kind === "image" ? 168 : 280);
    }
    state.nodes.push(node);
    state.edges.push({ from: src.id, to: id });
    if (src.group) expandGroupToFit(groupById(src.group));
    state.selectedId = id;
    if (kind === "video" && state.coach === 1) state.coach = 2;
    addMenu.hidden = true;
    renderAll();
  };

  const spawnFree = (type, stackId) => {
    if (!NODE_TITLE[type]) return;
    const kind = type;
    const id = uid(kind.slice(0, 2));
    const prompts = { video: PROMPT, image: IMG_PROMPT, text: TEXT_PROMPT, audio: AUDIO_PROMPT, edit: EDIT_PROMPT, script: "" };
    const mode = stackId || STACK_DEFAULT[kind] || "";
    const r = canvas.getBoundingClientRect();
    const groups = state.groups || [];
    const shared = state.nodes.filter((n) => !n.group);
    const last = shared[shared.length - 1];
    const left = groups.length ? Math.min(...groups.map((g) => g.x)) : (r.width * 0.5 - state.cam.x) / state.cam.scale;
    const drop = state.spawnAt;
    const x = drop ? drop.x : (last ? last.x : Math.max(8, left - 380));
    const y = drop ? drop.y : (last ? last.y + sizeOf(last).h + 32 : 24);
    state.spawnAt = null;
    const node = {
      id,
      type: kind,
      title: NODE_TITLE[kind] || kind,
      compact: false,
      x,
      y,
      prompt: prompts[kind] || "",
      ready: false,
      mode,
      shots: kind === "director" ? SHOTS.map((s) => ({ ...s })) : undefined,
      folder: kind === "audio" ? "audio" : kind === "image" ? "scene" : kind === "ref" ? "style" : "new",
      group: "",
    };
    state.nodes.push(node);
    state.selectedId = id;
    state.dockTab = "node";
    addMenu.hidden = true;
    renderAll();
  };

  canvas.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".node") || e.target.closest(".plus-btn") || e.target.closest(".add-menu") || e.target.closest("[data-group-drag]") || e.target.closest("[data-resize]") || e.target.closest(".board-group") || e.target.closest(".item-rename") || e.target.closest("[data-cut-edge]") || e.target.closest(".media-tools")) return;
    addMenu.hidden = true;
    state.mediaToolsNode = "";
    placeMediaTools();
    clearFrameEdit();
    state.panning = { x: e.clientX - state.cam.x, y: e.clientY - state.cam.y };
  });
  canvas.addEventListener("dblclick", (e) => {
    if (reviewMode) return;
    if (e.target.closest(".node") || e.target.closest(".board-group") || e.target.closest(".plus-btn") || e.target.closest(".add-menu") || e.target.closest(".media-tools") || e.target.closest(".canvas-dock")) return;
    e.preventDefault();
    const pt = worldFromEvent(e);
    state.spawnAt = { x: Math.round(pt.x), y: Math.round(pt.y) };
    state.plusFrom = "";
    addMenu.hidden = false;
    setAddMenuTitle();
    const panel = addMenu.querySelector("#addMenuStack");
    if (panel) panel.hidden = true;
    addMenu.querySelectorAll("[data-spawn-type]").forEach((b) => b.classList.remove("is-hot", "is-on"));
    addMenu.style.left = `${Math.min(e.clientX + 12, window.innerWidth - 460)}px`;
    if (e.clientY > window.innerHeight / 2) {
      addMenu.style.top = "auto";
      addMenu.style.bottom = `${Math.max(16, window.innerHeight - e.clientY + 12)}px`;
    } else {
      addMenu.style.bottom = "";
      addMenu.style.top = `${Math.max(60, e.clientY - 24)}px`;
    }
  });
  edgesSvg.addEventListener("click", (e) => {
    const cut = e.target.closest("[data-cut-edge]");
    if (!cut) return;
    e.stopPropagation();
    cutEdge(cut.dataset.from, cut.dataset.to);
  });

  world.addEventListener("pointerdown", (e) => {
    if (reviewMode && (e.target.closest(".node") || e.target.closest(".board-group") || e.target.closest("[data-cut-edge]"))) return;
    if (e.target.closest(".item-rename")) return;
    const plus = e.target.closest("[data-plus]");
    if (plus) {
      e.stopPropagation();
      openMenu(plus.dataset.plus, plus);
      if (state.coach === 0) state.coach = 1;
      placeCoach();
      return;
    }
    const handle = e.target.closest("[data-resize]");
    if (handle) {
      e.stopPropagation();
      const g = groupById(handle.dataset.group);
      if (!g) return;
      selectFrame(g, true);
      state.resizing = {
        id: g.id,
        dir: handle.dataset.resize,
        sx: e.clientX,
        sy: e.clientY,
        x: g.x,
        y: g.y,
        w: g.w,
        h: g.h,
      };
      return;
    }
    const tag = e.target.closest("[data-group-drag]");
    if (tag) {
      e.stopPropagation();
      const g = groupById(tag.dataset.groupDrag);
      if (!g) return;
      selectFrame(g, true);
      beginMoveGroup(g, e);
      return;
    }
    if (e.target.closest("button") || e.target.closest("textarea") || e.target.closest("select") || e.target.closest("input")) return;
    const card = e.target.closest(".node");
    if (card) {
      state.selectedId = card.dataset.id;
      if (state.mediaToolsNode !== card.dataset.id) state.mediaToolsNode = "";
      const n = nodeById(card.dataset.id);
      state.frameEdit = false;
      state.selectedGroup = n?.group || "";
      paintFrameEdit();
      renderAssetTree();
      const o = originOf(n);
      state.dragging = {
        id: n.id,
        dx: e.clientX - ((o.x + n.x) * state.cam.scale + state.cam.x),
        dy: e.clientY - ((o.y + n.y) * state.cam.scale + state.cam.y),
      };
      if (n.group) world.querySelector(`[data-group="${n.group}"] .board-nodes`)?.classList.add("is-drag-out");
      renderCanvasDock();
      return;
    }
    const groupEl = e.target.closest(".board-group");
    if (groupEl) {
      e.stopPropagation();
      const g = groupById(groupEl.dataset.group);
      if (!g) return;
      selectFrame(g, true);
      beginMoveGroup(g, e);
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

  world.addEventListener("change", (e) => {
    const pick = e.target.closest("[data-stack]");
    if (!pick) return;
    const n = nodeById(pick.dataset.stack);
    if (!n) return;
    n.mode = pick.value;
    renderAll();
  });

  world.addEventListener("click", (e) => {
    const mediaToolsToggle = e.target.closest("[data-media-tools]");
    if (mediaToolsToggle) {
      const id = mediaToolsToggle.dataset.mediaTools;
      state.selectedId = id;
      state.mediaToolsNode = state.mediaToolsNode === id ? "" : id;
      renderAll();
      return;
    }
    const slashMore = e.target.closest("[data-slash-more]");
    if (slashMore) {
      const row = slashMore.closest(".slash-row");
      if (!row) return;
      row.classList.toggle("is-open");
      if (row.classList.contains("is-open")) {
        row.querySelector(".slash-chips").innerHTML = SLASH_PRESETS.map((p) => `
          <button type="button" class="slash-chip" data-slash="${p.id}" data-id="${slashMore.dataset.slashMore}" title="${p.hint}">${p.label}</button>`).join("");
      }
      return;
    }
    const slash = e.target.closest("[data-slash]");
    if (slash) {
      const n = nodeById(slash.dataset.id);
      const preset = SLASH_PRESETS.find((p) => p.id === slash.dataset.slash);
      if (!n || !preset) return;
      if (n.type === "image" && preset.id === "cam9") n.mode = "grid9";
      if (n.type === "image" && ["charSheet", "turn3"].includes(preset.id)) n.mode = "character-sheet";
      n.prompt = `/${preset.label}: ${preset.hint}`;
      n.shot = preset.label;
      renderAll();
      startJob(n.id, "generate", `${preset.label} 생성 중…`);
      return;
    }
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
    if (state.movingGroup) {
      const g = groupById(state.movingGroup.id);
      if (!g) return;
      const px = e.clientX - state.movingGroup.sx;
      const py = e.clientY - state.movingGroup.sy;
      if (!state.movingGroup.live) {
        if (Math.hypot(px, py) < 5) return;
        state.movingGroup.live = true;
      }
      const dx = px / state.cam.scale;
      const dy = py / state.cam.scale;
      g.x = state.movingGroup.x + dx;
      g.y = state.movingGroup.y + dy;
      paintGroup(g);
      drawEdges();
      placeMenu();
      placeCoach();
      return;
    }
    if (state.resizing) {
      const g = groupById(state.resizing.id);
      const spec = RESIZE[state.resizing.dir];
      if (!g || !spec) return;
      const dx = (e.clientX - state.resizing.sx) / state.cam.scale;
      const dy = (e.clientY - state.resizing.sy) / state.cam.scale;
      clampGroupResize(g, {
        x: state.resizing.x + spec.x * dx,
        y: state.resizing.y + spec.y * dy,
        w: state.resizing.w + spec.w * dx,
        h: state.resizing.h + spec.h * dy,
      });
      paintGroup(g);
      return;
    }
    if (state.dragging) {
      const n = nodeById(state.dragging.id);
      const o = originOf(n);
      n.x = (e.clientX - state.dragging.dx - state.cam.x) / state.cam.scale - o.x;
      n.y = (e.clientY - state.dragging.dy - state.cam.y) / state.cam.scale - o.y;
      paintNode(n);
      drawEdges();
      const pt = worldFromEvent(e);
      paintDropTarget(groupAtWorld(pt.x, pt.y)?.id || "", n);
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
  window.addEventListener("pointerup", (e) => {
    if (state.dragging) {
      const n = nodeById(state.dragging.id);
      if (n) {
        const pt = worldFromEvent(e);
        const hit = groupAtWorld(pt.x, pt.y);
        placeIntoGroup(n, hit?.id || "");
      }
      paintDropTarget("");
      renderAll();
    }
    state.dragging = null;
    state.panning = false;
    state.movingGroup = null;
    state.resizing = null;
  });

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

  document.getElementById("stackCanvases")?.addEventListener("click", () => {
    if (state.stackView) unstackCanvases();
    else stackCanvases();
  });
  document.getElementById("canvasDock")?.addEventListener("click", (e) => {
    if (e.target.closest("#stackCanvases")) return;
    const createToggle = e.target.closest("#canvasDockAdd");
    if (createToggle) {
      state.dockOpen = false;
      renderCanvasDock();
      const menu = document.getElementById("dockCreateMenu");
      const open = menu.hidden;
      menu.hidden = !open;
      createToggle.setAttribute("aria-expanded", open ? "true" : "false");
      return;
    }
    const canvasTemplate = e.target.closest("[data-canvas-template]");
    if (canvasTemplate) {
      const menu = document.getElementById("dockCreateMenu");
      menu.hidden = true;
      document.getElementById("canvasDockAdd")?.setAttribute("aria-expanded", "false");
      createWorkflowCanvas(canvasTemplate.dataset.canvasTemplate);
      return;
    }
    const createKind = e.target.closest("[data-create-kind]");
    if (createKind) {
      const menu = document.getElementById("dockCreateMenu");
      menu.hidden = true;
      document.getElementById("canvasDockAdd")?.setAttribute("aria-expanded", "false");
      openDockAddMenu(document.getElementById("canvasDockAdd"));
      return;
    }
    const tab = e.target.closest("[data-dock-tab]");
    if (tab) {
      const same = state.dockTab === tab.dataset.dockTab;
      state.dockTab = tab.dataset.dockTab;
      state.dockOpen = same ? !state.dockOpen : true;
      document.getElementById("dockCreateMenu").hidden = true;
      document.getElementById("canvasDockAdd")?.setAttribute("aria-expanded", "false");
      renderCanvasDock();
      return;
    }
    const nodeItem = e.target.closest("[data-focus-node]");
    if (nodeItem) {
      state.dockOpen = false;
      focusAsset(nodeItem.dataset.focusNode);
      return;
    }
    const item = e.target.closest("[data-focus-group]");
    if (!item || item.querySelector(".item-rename")) return;
    state.dockOpen = false;
    focusGroup(groupById(item.dataset.focusGroup));
  });
  document.getElementById("canvasDock")?.addEventListener("dblclick", (e) => {
    const item = e.target.closest("[data-focus-group]");
    if (!item) return;
    e.preventDefault();
    e.stopPropagation();
    startRename(item);
  });
  world.addEventListener("dblclick", (e) => {
    const tag = e.target.closest("[data-group-drag]");
    if (!tag) return;
    e.preventDefault();
    e.stopPropagation();
    state.movingGroup = null;
    startRename(tag);
  });

  document.getElementById("mediaTools")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-img-tool]");
    if (!btn) return;
    e.stopPropagation();
    const n = nodeById(btn.dataset.id);
    const tool = IMG_TOOLS.find((t) => t.id === btn.dataset.imgTool);
    if (!n || !tool) return;
    if (n.type === "image" && tool.id === "grid9") n.mode = "grid9";
    n.prompt = `[${tool.label}] ${n.prompt || stackOf(n).hint}`;
    startJob(n.id, "tool", `${tool.label} 처리 중…`);
  });

  addMenu.addEventListener("pointerover", (e) => {
    const typeBtn = e.target.closest("[data-spawn-type]");
    if (!typeBtn || typeBtn.dataset.spawnStack) return;
    showAddStacks(typeBtn.dataset.spawnType);
  });
  addMenu.addEventListener("click", (e) => {
    const stackBtn = e.target.closest("[data-spawn-stack]");
    if (stackBtn) {
      if (state.plusFrom) spawnFrom(stackBtn.dataset.spawnType, "", stackBtn.dataset.spawnStack);
      else spawnFree(stackBtn.dataset.spawnType, stackBtn.dataset.spawnStack);
      return;
    }
    const typeBtn = e.target.closest("[data-spawn-type]");
    if (!typeBtn) return;
    showAddStacks(typeBtn.dataset.spawnType);
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
      if (btn.dataset.side === "kit" && !state.inspect && state.library[0]) {
        state.inspect = { kind: "lib", id: state.library[0].id };
        renderAssetTree();
      } else {
        renderInspect();
      }
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

  document.querySelector("[data-side-panel='kit']")?.addEventListener("click", (e) => {
    const tool = e.target.closest("[data-asset-tool]");
    if (tool) {
      const act = tool.dataset.assetTool;
      if (act === "search") {
        const wrap = document.getElementById("assetSearchWrap");
        wrap.hidden = !wrap.hidden;
        if (!wrap.hidden) document.getElementById("assetSearch")?.focus();
        tool.classList.toggle("is-on", !wrap.hidden);
      }
      if (act === "list") tool.classList.add("is-on");
      if (act === "filter") tool.classList.toggle("is-on");
      return;
    }
    if (e.target.closest("#addFolder")) {
      const id = uid("fd");
      const n = state.folders.filter((f) => (state.folderNames[f] || "").startsWith("새 폴더")).length + 1;
      state.folders.push(id);
      state.folderNames[id] = n > 1 ? `새 폴더 ${n}` : "새 폴더";
      state.folderOpen[id] = true;
      renderAssetTree();
      const row = document.querySelector(`.folder-row[data-folder="${id}"]`);
      if (row) startRename(row);
      return;
    }
    const more = e.target.closest("[data-more]");
    if (more) {
      const file = more.closest(".asset-file");
      if (file) showCtx(e, { kind: "file", id: file.dataset.node, lib: file.dataset.lib, el: file });
      return;
    }
    const file = e.target.closest(".asset-file");
    if (file) {
      if (file.querySelector(".item-rename")) return;
      if (file.dataset.lib) state.inspect = { kind: "lib", id: file.dataset.lib };
      else if (file.dataset.node) state.inspect = { kind: "node", id: file.dataset.node };
      renderAssetTree();
      return;
    }
    const row = e.target.closest(".folder-row");
    if (row && e.detail < 2 && !row.querySelector(".item-rename")) {
      const id = row.dataset.folder;
      state.folderOpen[id] = !state.folderOpen[id];
      renderAssetTree();
    }
  });

  document.getElementById("assetSearch")?.addEventListener("input", (e) => {
    state.assetQuery = e.target.value || "";
    renderAssetTree();
  });

  const spawnFromKit = (folderId) => {
    state.plusFrom = state.selectedId || state.nodes[0]?.id;
    spawnFrom(FOLDER_KIND[folderId] || "image", folderId);
  };

  const pageIcon = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M7 3h8l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M15 3v5h5"/></svg>`;
  const itemName = (el) => el.querySelector(".item-label")?.textContent.trim() || el.textContent.trim();
  const startRename = (host) => {
    const label = host.querySelector(".item-label, .tab-label");
    if (!label || host.querySelector(".item-rename")) return;
    const orig = label.textContent.trim();
    const input = document.createElement("input");
    input.className = "item-rename";
    input.value = orig;
    input.setAttribute("aria-label", "이름 수정");
    label.replaceWith(input);
    input.focus();
    input.select();
    const finish = (ok) => {
      if (!input.isConnected) return;
      const name = ok ? (input.value.trim() || orig) : orig;
      const span = document.createElement(label.tagName.toLowerCase());
      span.className = label.className;
      if (label.dataset.agentName != null) span.dataset.agentName = "";
      span.textContent = name;
      input.replaceWith(span);
      if (host.classList.contains("board-name-host")) {
        localStorage.setItem(projectNameKey, name);
        document.title = `${name} · 아보라`;
      }
      if (host.classList.contains("canvas-item") && host.classList.contains("is-on")) {
        const pick = document.querySelector(".canvas-pick");
        if (pick) pick.textContent = `${name} ▾`;
      }
      if (host.dataset.folder) {
        state.folderNames[host.dataset.folder] = name;
      }
      const canvasId = host.dataset.groupDrag || host.dataset.focusGroup;
      if (canvasId) {
        const g = groupById(canvasId);
        if (g) g.title = name;
        renderAll();
        return;
      }
      if (host.dataset.lib) {
        const item = libById(host.dataset.lib);
        if (item) item.name = name;
        renderInspect();
      }
      if (host.dataset.node) {
        const n = nodeById(host.dataset.node);
        if (n) {
          if (n.shot) n.shot = name;
          else n.title = name;
          renderAll();
        }
      }
    };
    input.addEventListener("click", (e) => e.stopPropagation());
    input.addEventListener("dblclick", (e) => e.stopPropagation());
    input.addEventListener("keydown", (e) => {
      e.stopPropagation();
      if (e.key === "Enter") { e.preventDefault(); finish(true); }
      if (e.key === "Escape") { e.preventDefault(); finish(false); }
    });
    input.addEventListener("blur", () => finish(true));
  };

  document.getElementById("sidebar")?.addEventListener("dblclick", (e) => {
    const host = e.target.closest(".folder-row, .asset-file, .canvas-item, .rename-host, [data-side]");
    if (!host || e.target.closest(".item-rename") || e.target.closest(".folder-add") || host.id === "addCanvas" || host.id === "addFolder") return;
    e.preventDefault();
    e.stopPropagation();
    startRename(host);
  }, true);

  const ctxMenu = document.getElementById("ctxMenu");
  let ctxTarget = null;
  const hideCtx = () => {
    if (ctxMenu) ctxMenu.hidden = true;
    ctxTarget = null;
  };
  const showCtx = (e, target) => {
    e.preventDefault();
    e.stopPropagation();
    ctxTarget = target;
    const del = ctxMenu.querySelector('[data-ctx="delete"]');
    if (del) del.hidden = target.kind === "page" && document.querySelectorAll(".canvas-item").length < 2;
    ctxMenu.hidden = false;
    const x = Math.min(e.clientX, window.innerWidth - 148);
    const y = Math.min(e.clientY, window.innerHeight - 88);
    ctxMenu.style.left = `${x}px`;
    ctxMenu.style.top = `${y}px`;
  };

  const removeNodes = (ids) => {
    const set = new Set(ids);
    state.nodes = state.nodes.filter((n) => !set.has(n.id));
    state.edges = state.edges.filter((ed) => !set.has(ed.from) && !set.has(ed.to));
    if (set.has(state.selectedId)) state.selectedId = state.nodes[0]?.id || null;
    if (set.has(state.plusFrom)) state.plusFrom = state.selectedId;
  };

  const deleteFolder = (id) => {
    const ids = state.nodes.filter((n) => folderOf(n) === id).map((n) => n.id);
    removeNodes(ids);
    state.library = state.library.filter((a) => a.folder !== id);
    state.folders = state.folders.filter((f) => f !== id);
    delete state.folderNames[id];
    delete state.folderOpen[id];
    renderAll();
  };

  document.getElementById("sidebar")?.addEventListener("contextmenu", (e) => {
    if (e.target.closest(".folder-add") || e.target.closest("#addFolder") || e.target.closest("#addCanvas") || e.target.closest(".item-rename")) return;
    const file = e.target.closest(".asset-file");
    if (file) {
      showCtx(e, { kind: "file", id: file.dataset.node, lib: file.dataset.lib, el: file });
      return;
    }
    const folder = e.target.closest(".folder-row");
    if (folder) {
      showCtx(e, { kind: "folder", id: folder.dataset.folder, el: folder });
      return;
    }
    const page = e.target.closest(".canvas-item");
    if (page) {
      showCtx(e, { kind: "page", el: page });
    }
  });

  ctxMenu?.addEventListener("click", (e) => {
    const act = e.target.closest("[data-ctx]")?.dataset.ctx;
    const target = ctxTarget;
    hideCtx();
    if (!act || !target) return;
    if (act === "rename") {
      const el = target.kind === "folder"
        ? document.querySelector(`.folder-row[data-folder="${target.id}"]`)
        : target.kind === "file"
          ? document.querySelector(target.lib ? `.asset-file[data-lib="${target.lib}"]` : `.asset-file[data-node="${target.id}"]`)
          : target.el;
      if (el) startRename(el);
      return;
    }
    if (act === "delete") {
      if (target.kind === "folder") deleteFolder(target.id);
      if (target.kind === "file") {
        if (target.lib) {
          state.library = state.library.filter((a) => a.id !== target.lib);
          if (state.inspect?.kind === "lib" && state.inspect.id === target.lib) state.inspect = null;
        } else if (target.id) {
          removeNodes([target.id]);
          if (state.inspect?.kind === "node" && state.inspect.id === target.id) state.inspect = null;
        }
        renderAll();
      }
      if (target.kind === "page") {
        const pages = document.querySelectorAll(".canvas-item");
        if (pages.length < 2) return;
        const wasOn = target.el.classList.contains("is-on");
        target.el.remove();
        if (wasOn) {
          const first = document.querySelector(".canvas-item");
          if (first) {
            first.classList.add("is-on");
            document.querySelector(".canvas-pick").textContent = `${itemName(first)} ▾`;
          }
        }
      }
    }
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#ctxMenu")) hideCtx();
    if (!e.target.closest("#canvasDockCluster")) {
      const menu = document.getElementById("dockCreateMenu");
      if (menu) menu.hidden = true;
      document.getElementById("canvasDockAdd")?.setAttribute("aria-expanded", "false");
      if (state.dockOpen) {
        state.dockOpen = false;
        renderCanvasDock();
      }
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      hideCtx();
      if (state.inspect) {
        state.inspect = null;
        renderAssetTree();
      }
    }
  });

  document.getElementById("addCanvas")?.addEventListener("click", () => {
    const list = document.querySelector("[data-side-panel='canvas']");
    const n = list.querySelectorAll(".canvas-item").length + 1;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "canvas-item";
    btn.innerHTML = `${pageIcon}<span class="item-label">페이지 ${n}</span>`;
    list.insertBefore(btn, document.getElementById("addCanvas"));
    document.querySelector(".canvas-pick").textContent = `페이지 ${n} ▾`;
    list.querySelectorAll(".canvas-item").forEach((b) => b.classList.toggle("is-on", b === btn));
  });

  document.querySelector("[data-side-panel='canvas']")?.addEventListener("click", (e) => {
    const item = e.target.closest(".canvas-item");
    if (!item || item.querySelector(".item-rename")) return;
    document.querySelectorAll(".canvas-item").forEach((b) => b.classList.toggle("is-on", b === item));
    document.querySelector(".canvas-pick").textContent = `${itemName(item)} ▾`;
  });

  const CREW_PICO = {
    writer: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="10" fill="#f5d76e"/><circle cx="16" cy="16" r="8.2" fill="#f3c7a0"/><ellipse cx="13.1" cy="15.2" rx="2.1" ry="2.3" fill="#fff"/><ellipse cx="18.9" cy="15.2" rx="2.1" ry="2.3" fill="#fff"/><circle cx="13.2" cy="15.4" r=".85" fill="#3b2416"/><circle cx="19" cy="15.4" r=".85" fill="#3b2416"/><path d="M12.2 19.2c1.4 1.4 4.2 1.5 5.6.1" fill="none" stroke="#c45c3b" stroke-width="1.1" stroke-linecap="round"/><path d="M10.4 15.2h2.2M17.4 15.2h2.2M15.2 15.2h1.6" fill="none" stroke="#3b2416" stroke-width="1.15"/><rect x="22.2" y="7.2" width="2.2" height="10" rx="1" transform="rotate(28 23.3 12.2)" fill="#7c3aed"/><rect x="22.5" y="6.4" width="1.6" height="2.2" rx=".5" transform="rotate(28 23.3 7.5)" fill="#f8f4ff"/></svg>`,
    cd: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="10" fill="#7c3aed"/><path d="M8.5 13c.4-5 4-8.2 7.5-8.2S23 8 23.4 13H8.5z" fill="#2e1065"/><circle cx="16" cy="14.5" r="3.4" fill="#1c1424"/><circle cx="16" cy="18" r="7.6" fill="#e8b894"/><path d="M9.8 16.2h12.4" stroke="#1c1424" stroke-width="2.4" stroke-linecap="round"/><circle cx="13.1" cy="16.2" r="2.1" fill="#111"/><circle cx="18.9" cy="16.2" r="2.1" fill="#111"/><circle cx="13.6" cy="15.8" r=".55" fill="#fff"/><circle cx="19.4" cy="15.8" r=".55" fill="#fff"/><path d="M13 20.6c1.2 1.2 3.6 1.3 5 0" fill="none" stroke="#c45c3b" stroke-width="1.1" stroke-linecap="round"/><path d="M23.2 9.2 26 12.4l-1.3.9-2.8-3.2z" fill="#f4d35e"/></svg>`,
    board: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="10" fill="#fb7185"/><circle cx="16" cy="17" r="8" fill="#f3c7a0"/><circle cx="13.2" cy="16.2" r="1" fill="#3b2416"/><circle cx="18.8" cy="16.2" r="1" fill="#3b2416"/><path d="M13.2 19.6c1.2 1.3 3.4 1.3 4.6 0" fill="none" stroke="#c45c3b" stroke-width="1.1" stroke-linecap="round"/><rect x="7.2" y="6.4" width="5.2" height="6.4" rx="1" fill="#fff"/><rect x="13.4" y="5.6" width="5.2" height="6.4" rx="1" fill="#fff"/><rect x="19.6" y="6.4" width="5.2" height="6.4" rx="1" fill="#fff"/><path d="M8.4 8.8h2.8M14.6 8h2.8M20.8 8.8h2.8" stroke="#7c3aed" stroke-width="1.2"/><circle cx="10" cy="11.2" r=".7" fill="#f4d35e"/><circle cx="16" cy="10.4" r=".7" fill="#22c55e"/><circle cx="22.2" cy="11.2" r=".7" fill="#38bdf8"/></svg>`,
    dp: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="10" fill="#14b8a6"/><path d="M7 13.2h18v3.2H7z" fill="#115e59"/><path d="M9.2 8.4h13.6l1.6 4.8H7.6z" fill="#134e4a"/><circle cx="16" cy="19" r="7.4" fill="#f3c7a0"/><circle cx="13.4" cy="18.4" r="1" fill="#3b2416"/><circle cx="18.6" cy="18.4" r="1" fill="#3b2416"/><path d="M13.4 21.6c1.1 1.2 3.1 1.2 4.2 0" fill="none" stroke="#c45c3b" stroke-width="1.1" stroke-linecap="round"/><rect x="21.4" y="17.2" width="7.2" height="5.2" rx="1.2" fill="#111"/><circle cx="24.2" cy="19.8" r="1.5" fill="#7dd3fc"/><rect x="20.2" y="18.6" width="1.6" height="2.4" rx=".4" fill="#333"/></svg>`,
    cast: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="10" fill="#f59e0b"/><circle cx="12.2" cy="16.4" r="7.2" fill="#e8b894"/><circle cx="20.6" cy="17.2" r="7.2" fill="#f3c7a0"/><circle cx="10.6" cy="15.6" r=".95" fill="#3b2416"/><circle cx="14.2" cy="15.6" r=".95" fill="#3b2416"/><path d="M10.6 18.6c.9 1 2.5 1.1 3.4.1" fill="none" stroke="#c45c3b" stroke-width="1" stroke-linecap="round"/><circle cx="18.8" cy="16.4" r=".95" fill="#3b2416"/><circle cx="22.6" cy="16.4" r=".95" fill="#3b2416"/><path d="M18.8 19.5c1 1.1 2.7 1.1 3.7 0" fill="none" stroke="#c45c3b" stroke-width="1" stroke-linecap="round"/><path d="M16 8.4 16.8 10.6 19 11.2 16.8 12 16 14.2 15.2 12 13 11.2 15.2 10.6z" fill="#fde68a"/></svg>`,
    editor: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="10" fill="#64748b"/><rect x="6" y="6.4" width="20" height="6.4" rx="1.4" fill="#0f172a"/><rect x="8" y="7.6" width="2.2" height="4" rx=".4" fill="#f8fafc"/><rect x="12.2" y="7.6" width="2.2" height="4" rx=".4" fill="#f8fafc"/><rect x="16.4" y="7.6" width="2.2" height="4" rx=".4" fill="#c4b5fd"/><rect x="20.6" y="7.6" width="2.2" height="4" rx=".4" fill="#f8fafc"/><circle cx="16" cy="19.2" r="7.6" fill="#f3c7a0"/><circle cx="13.4" cy="18.6" r="1" fill="#3b2416"/><circle cx="18.6" cy="18.6" r="1" fill="#3b2416"/><path d="M13.4 21.8c1.1 1.2 3.1 1.2 4.2 0" fill="none" stroke="#c45c3b" stroke-width="1.1" stroke-linecap="round"/><path d="M22.6 21.4 26.4 25M22.6 25l3.8-3.6" stroke="#f8fafc" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    sound: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="10" fill="#38bdf8"/><path d="M8.2 13.6c0-6.2 15.6-6.2 15.6 0" fill="none" stroke="#0f172a" stroke-width="2.4" stroke-linecap="round"/><rect x="6.4" y="13.2" width="4.2" height="9.2" rx="2" fill="#0f172a"/><rect x="21.4" y="13.2" width="4.2" height="9.2" rx="2" fill="#0f172a"/><circle cx="16" cy="18.2" r="7.2" fill="#f3c7a0"/><circle cx="13.6" cy="17.8" r="1" fill="#3b2416"/><circle cx="18.4" cy="17.8" r="1" fill="#3b2416"/><path d="M13.6 20.8c1 1.1 2.8 1.1 3.8 0" fill="none" stroke="#c45c3b" stroke-width="1.1" stroke-linecap="round"/><path d="M24.8 8.4c1.4 1.2 2.2 3 2.2 4.8" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  };

  const CREW = [
    {
      id: "writer", name: "대본작가",
      harness: "각본·대사·장면 리듬만 다룹니다. 스크립트 폴더에 쌓입니다.",
      jobs: [{ key: "script", label: "각본 쓰기" }, { key: "dialogue", label: "대사 다듬기" }],
    },
    {
      id: "cd", name: "크리에이티브 디렉터",
      harness: "톤·장르·무드를 고정합니다. 비주얼 스타일이 이후 샷에 이어집니다.",
      jobs: [{ key: "mood", label: "무드 잡기" }, { key: "look", label: "비주얼 스타일" }],
    },
    {
      id: "board", name: "스토리보드 아티스트",
      harness: "샷 구성과 컷 나눔. 이미지 폴더에 스토리보드가 붙습니다.",
      jobs: [{ key: "storyboard", label: "스토리보드 뽑기" }, { key: "shot", label: "다음 샷" }],
    },
    {
      id: "dp", name: "촬영감독",
      harness: "렌즈, 라이팅, 카메라 무빙. 샷 프롬프트에 촬영 지시를 넣습니다.",
      jobs: [{ key: "camera", label: "카메라 무빙" }, { key: "light", label: "조명 잡기" }],
    },
    {
      id: "cast", name: "캐릭터 슈퍼바이저",
      harness: "얼굴과 페르소나 일관성. 같은 캐릭터가 컷을 넘어도 유지됩니다.",
      jobs: [{ key: "character", label: "캐릭터 고정" }],
    },
    {
      id: "editor", name: "편집장",
      harness: "컷 리듬, 다음 샷, 고화질 연결. 영상 폴더의 흐름을 다듬습니다.",
      jobs: [{ key: "shot", label: "다음 컷" }, { key: "upscale", label: "고화질" }],
    },
    {
      id: "sound", name: "사운드 디자이너",
      harness: "대사, 효과음, 음악. 오디오 폴더에만 쌓입니다.",
      jobs: [{ key: "audio", label: "보이스 입히기" }],
    },
  ];

  const openChat = () => document.querySelector("[data-side='assets']")?.click();

  const renderCrew = () => {
    const list = document.getElementById("crewList");
    if (!list) return;
    list.innerHTML = CREW.map((c) => {
      const on = !!state.crewOn[c.id];
      const open = state.crewOpen === c.id;
      return `
        <article class="crew-card${on ? " is-on" : ""}${open ? " is-open" : ""}" data-crew="${c.id}">
          <div class="crew-card-top">
            <span class="crew-mark">${CREW_PICO[c.id] || ""}</span>
            <div class="crew-copy">
              <strong>${c.name}</strong>
              <em>${on ? "이 보드에 배정됨" : "대기"}</em>
            </div>
            <button type="button" class="crew-assign" data-crew-toggle="${c.id}">${on ? "배정됨" : "배정"}</button>
          </div>
          ${open ? `
            <p class="crew-harness">${c.harness}</p>
            <div class="crew-jobs">
              ${c.jobs.map((j) => `<button type="button" data-crew-job="${j.key}" data-crew-from="${c.id}">${j.label}</button>`).join("")}
            </div>` : ""}
        </article>`;
    }).join("");
  };

  const agentLog = document.getElementById("agentLog");
  const chatHead = document.getElementById("chatHead");
  const CHAT_STAR = `<svg class="chat-step-star" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1.8 13.85 10.15 22.2 12 13.85 13.85 12 22.2 10.15 13.85 1.8 12 10.15 10.15Z"/></svg>`;
  const pushAgent = (text, me = false, from = "") => {
    agentLog.querySelector(".empty")?.remove();
    const div = document.createElement("div");
    div.className = me ? "bubble is-me" : "bubble";
    if (!me && from) {
      const tag = document.createElement("span");
      tag.className = "bubble-from";
      tag.textContent = from;
      div.appendChild(tag);
    }
    div.appendChild(document.createTextNode(text));
    agentLog.appendChild(div);
    agentLog.scrollTop = agentLog.scrollHeight;
  };
  const agentSteps = (t) => {
    if (t.includes("브리프") || t.includes("기획")) return ["보드 브리프를 읽고 있습니다", "장면 흐름을 정리하고 있습니다"];
    if (t.includes("무드") || t.includes("톤") || t.includes("장르") || t.includes("스타일") || t.includes("조명") || t.includes("비주얼")) {
      return ["톤과 장르를 확인하고 있습니다", "비주얼 스타일을 맞추고 있습니다"];
    }
    if (t.includes("스토리") || t.includes("이야기") || t.includes("각본") || t.includes("스크립트") || t.includes("스토리보드") || t.includes("대사") || t.includes("대본")) {
      return ["이야기를 읽고 있습니다", "샷으로 나누고 있습니다", "스토리보드를 준비하고 있습니다"];
    }
    if (t.includes("카메라") || t.includes("무빙") || t.includes("렌즈")) return ["선택한 샷을 확인하고 있습니다", "카메라 무빙을 넣고 있습니다"];
    if (t.includes("캐릭터") || t.includes("페르소나") || t.includes("얼굴")) return ["캐릭터 고정을 확인하고 있습니다", "컷 사이 얼굴을 맞추고 있습니다"];
    if (t.includes("오디오") || t.includes("보이스") || t.includes("사운드") || t.includes("대사 입")) return ["사운드 트랙을 확인하고 있습니다", "오디오 노드를 붙이고 있습니다"];
    if (t.includes("고화질") || t.includes("upscale")) return ["원본 해상도를 읽고 있습니다", "고화질 노드를 잇고 있습니다"];
    if (t.includes("비디오") || t.includes("영상")) return ["참조 샷을 읽고 있습니다", "비디오 생성을 시작하고 있습니다"];
    if (t.includes("샷") || t.includes("다음") || t.includes("컷")) return ["현재 샷을 확인하고 있습니다", "다음 컷을 준비하고 있습니다"];
    return ["요청을 읽고 있습니다", "캔버스 흐름을 확인하고 있습니다"];
  };
  const startTrace = (steps, onStep) => {
    agentLog.querySelector(".empty")?.remove();
    agentLog.querySelector(".chat-trace.is-busy")?.remove();
    const trace = document.createElement("div");
    trace.className = "chat-trace is-busy";
    trace.setAttribute("aria-live", "polite");
    agentLog.appendChild(trace);
    let i = 0;
    let timer = 0;
    const addStep = () => {
      if (!trace.isConnected) return;
      const live = trace.querySelector(".chat-step.is-live");
      if (live) {
        live.classList.remove("is-live");
        live.classList.add("is-done");
      }
      if (i >= steps.length) return;
      const row = document.createElement("div");
      row.className = "chat-step is-live";
      row.innerHTML = `<span class="chat-step-rail">${CHAT_STAR}<i class="chat-step-line"></i></span><p>${steps[i]}</p>`;
      trace.appendChild(row);
      onStep?.(steps[i], i);
      agentLog.scrollTop = agentLog.scrollHeight;
      i += 1;
      if (i < steps.length) timer = window.setTimeout(addStep, 420);
    };
    addStep();
    return {
      finish() {
        window.clearTimeout(timer);
        trace.classList.remove("is-busy");
        const live = trace.querySelector(".chat-step.is-live");
        if (live) {
          live.classList.remove("is-live");
          live.classList.add("is-done");
        }
      },
    };
  };

  const addInspectToCanvas = () => {
    const { lib, node } = inspectOn();
    if (node) {
      focusAsset(node.id);
      return;
    }
    if (!lib) return;
    const srcNode = nodeById(state.selectedId) || state.nodes[0];
    if (!srcNode) return;
    const kind = FOLDER_KIND[lib.folder] || "image";
    const id = uid("im");
    state.nodes.push({
      id,
      type: kind,
      title: lib.name,
      compact: kind === "image",
      x: srcNode.x + sizeOf(srcNode).w + 56,
      y: srcNode.y + 48,
      prompt: lib.name,
      ready: true,
      src: lib.src,
      folder: lib.folder,
      shot: lib.name,
      mode: STACK_DEFAULT[kind] || "",
    });
    state.edges.push({ from: srcNode.id, to: id });
    lib.nodeId = id;
    state.selectedId = id;
    renderAll();
    focusAsset(id);
  };

  document.getElementById("assetInspectClose")?.addEventListener("click", () => {
    state.inspect = null;
    renderAssetTree();
  });
  document.getElementById("assetAddCanvas")?.addEventListener("click", addInspectToCanvas);
  document.getElementById("assetAddAgent")?.addEventListener("click", () => {
    const { lib, node } = inspectOn();
    const name = lib?.name || (node ? fileLabel(node) : "");
    if (!name) return;
    document.querySelector("[data-side='assets']")?.click();
    pushAgent(`「${name}」을 컨텍스트에 넣었습니다. 이 에셋을 기준으로 이어서 작업할 수 있습니다.`, false, "에셋");
  });

  const runAgent = (text, from = "Avora Directing") => {
    pushAgent(text, true);
    const t = text.toLowerCase();
    const intentPose = starryPoseForMessage(t);
    starryAgent.dataset.intentPose = intentPose;
    updateStarry("요청을 이해하는 중…", true, intentPose);
    const steps = agentSteps(t);
    const trace = startTrace(steps, (step, index) => {
      updateStarry(step, true, index === 0 ? intentPose : starryPoseForStep(step, intentPose));
    });
    chatHead.classList.add("is-generating");
    window.setTimeout(() => {
      const done = (msg) => {
        trace.finish();
        chatHead.classList.remove("is-generating");
        pushAgent(msg, false, from);
        if (state.nodes.some((node) => node.busy)) {
          updateStarry();
        } else {
          const donePose = intentPose === "love" ? "love" : intentPose === "hello" || intentPose === "greeting" ? "wink" : "smile";
          updateStarry("완료했어요", false, donePose);
          window.setTimeout(() => {
            delete starryAgent.dataset.intentPose;
            updateStarry();
          }, 1200);
        }
      };
      if (t.includes("브리프") || t.includes("기획")) {
        done("이 보드는 실험실 창가에서 잎과 빛을 잇는 교육 단편입니다. 배정된 크루에게 각본·무드·샷을 나눠 맡기면 됩니다.");
        return;
      }
      if (t.includes("무드") || t.includes("톤") || t.includes("장르") || t.includes("스타일") || t.includes("조명") || t.includes("비주얼")) {
        lookModal.hidden = false;
        done("무드를 먼저 고정합니다. 팔레트·조명·미술을 고르면 이후 샷이 같은 색감으로 맞춰집니다.");
        return;
      }
      if (t.includes("스토리") || t.includes("이야기") || t.includes("각본") || t.includes("스크립트") || t.includes("스토리보드") || t.includes("대사") || t.includes("대본")) {
        let sc = state.nodes.find((q) => q.type === "script");
        if (!sc) {
          state.plusFrom = state.selectedId || state.nodes[0]?.id;
          spawnFrom("script");
          sc = state.nodes[state.nodes.length - 1];
        }
        sc.prompt = text;
        startJob(sc.id, "script");
        window.setTimeout(() => done("이야기를 샷으로 나누고 이미지를 만들고 있습니다. 스크립트·이미지 폴더에 쌓입니다."), 900);
        return;
      }
      if (t.includes("카메라") || t.includes("무빙") || t.includes("렌즈")) {
        const n = nodeById(state.selectedId) || state.nodes.find((q) => q.type === "video");
        if (n) n.prompt = `${n.prompt || ""} 차네 클로즈업에서 항공정면으로 전환, 35mm, 모션 블러.`.trim();
        renderAll();
        done("선택한 샷에 카메라 무빙을 넣었습니다. 프롬프트를 확인하고 생성하면 됩니다.");
        return;
      }
      if (t.includes("캐릭터") || t.includes("페르소나") || t.includes("얼굴")) {
        done("같은 얼굴이 컷을 넘도록 캐릭터를 고정했습니다. 캐릭터 라이브러리에서 아린·하은을 이 보드에 쓸 수 있습니다.");
        return;
      }
      if (t.includes("오디오") || t.includes("보이스") || t.includes("사운드") || t.includes("대사 입")) {
        state.plusFrom = state.selectedId || state.nodes[0]?.id;
        spawnFrom("audio");
        done("오디오 노드를 붙였습니다. 사운드 폴더에 쌓입니다.");
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
      if (t.includes("샷") || t.includes("다음") || t.includes("컷")) {
        state.plusFrom = state.selectedId || "vid-01";
        spawnFrom("image");
        done("다음 샷용 이미지 노드를 추가했습니다. 이미지 폴더에 쌓입니다.");
        return;
      }
      done("배정된 크루 기준으로 캔버스 흐름을 유지합니다. 각본, 무드, 샷, 사운드 중 맡길 일을 말해 주세요.");
    }, Math.max(980, steps.length * 460));
  };

  document.getElementById("crewList")?.addEventListener("click", (e) => {
    const toggle = e.target.closest("[data-crew-toggle]");
    if (toggle) {
      e.stopPropagation();
      const id = toggle.dataset.crewToggle;
      state.crewOn[id] = !state.crewOn[id];
      if (state.crewOn[id]) state.crewOpen = id;
      renderCrew();
      return;
    }
    const job = e.target.closest("[data-crew-job]");
    if (job) {
      const role = CREW.find((c) => c.id === job.dataset.crewFrom);
      if (role && !state.crewOn[role.id]) {
        state.crewOn[role.id] = true;
        renderCrew();
      }
      const map = {
        script: "이 장면의 각본을 써줘",
        dialogue: "대사를 짧게 다듬어줘",
        mood: "무드를 잡아줘",
        look: "비주얼 스타일을 고정해줘",
        storyboard: "스토리보드를 뽑아줘",
        shot: "다음 샷을 제안해줘",
        camera: "카메라 무빙을 넣어줘",
        light: "조명을 잡아줘",
        character: "캐릭터를 고정해줘",
        upscale: "고화질로 연결해줘",
        audio: "보이스를 입혀줘",
      };
      openChat();
      runAgent(map[job.dataset.crewJob] || job.textContent, role?.name || "Avora Directing");
      return;
    }
    const card = e.target.closest("[data-crew]");
    if (card) {
      state.crewOpen = state.crewOpen === card.dataset.crew ? "" : card.dataset.crew;
      renderCrew();
    }
  });

  document.querySelectorAll("[data-agent]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const map = { brief: "보드 브리프 정리해줘", video: "비디오 생성해줘", shot: "다음 샷 제안해줘" };
      runAgent(map[btn.dataset.agent] || btn.textContent);
    });
  });

  document.getElementById("agentForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("agentInput");
    const val = input.value.trim();
    if (!val) return;
    input.value = "";
    document.getElementById("assetMentionPop").hidden = true;
    runAgent(val);
  });
  const agentInput = document.getElementById("agentInput");
  const mentionPop = document.getElementById("assetMentionPop");
  let mentionStart = -1;
  let mentionItems = [];
  let mentionIndex = 0;
  const mentionEsc = (value) => String(value || "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[ch]));
  const mentionAssets = () => [
    ...state.library.map((a) => ({
      key: `lib:${a.id}`, name: a.name, src: a.src, kind: "에셋",
    })),
    ...state.nodes.map((n) => ({
      key: `node:${n.id}`, name: fileLabel(n), src: n.src, kind: NODE_TITLE[n.type] || "노드",
    })),
  ].filter((item, i, all) => item.name && all.findIndex((x) => x.name === item.name) === i);
  const paintMentions = () => {
    mentionPop.querySelectorAll(".asset-mention-item").forEach((el, i) => {
      el.classList.toggle("is-on", i === mentionIndex);
    });
  };
  const renderMentions = () => {
    const caret = agentInput.selectionStart;
    const before = agentInput.value.slice(0, caret);
    const match = before.match(/@([^@\n]*)$/);
    if (!match) {
      mentionPop.hidden = true;
      mentionStart = -1;
      return;
    }
    mentionStart = caret - match[0].length;
    const query = match[1].trim().toLowerCase();
    mentionItems = mentionAssets()
      .filter((item) => !query || item.name.toLowerCase().includes(query))
      .slice(0, 8);
    mentionIndex = 0;
    mentionPop.innerHTML = `<p class="asset-mention-head">에셋 호출</p>` + (mentionItems.length
      ? mentionItems.map((item, i) => `
        <button type="button" class="asset-mention-item${i === 0 ? " is-on" : ""}" data-mention-index="${i}">
          ${item.src
            ? `<img src="${mentionEsc(item.src)}" alt="" />`
            : `<span class="asset-mention-thumb">${ICO.image}</span>`}
          <span class="asset-mention-copy">
            <strong>${mentionEsc(item.name)}</strong>
            <span>${mentionEsc(item.kind)}</span>
          </span>
        </button>`).join("")
      : `<p class="asset-mention-head">일치하는 에셋이 없습니다</p>`);
    mentionPop.hidden = false;
  };
  const pickMention = (index) => {
    const item = mentionItems[index];
    if (!item || mentionStart < 0) return;
    const caret = agentInput.selectionStart;
    const mention = `@[${item.name}] `;
    agentInput.value = agentInput.value.slice(0, mentionStart) + mention + agentInput.value.slice(caret);
    const next = mentionStart + mention.length;
    agentInput.setSelectionRange(next, next);
    mentionPop.hidden = true;
    mentionStart = -1;
    agentInput.focus();
  };
  agentInput.addEventListener("input", renderMentions);
  agentInput.addEventListener("click", renderMentions);
  mentionPop.addEventListener("click", (e) => {
    const item = e.target.closest("[data-mention-index]");
    if (item) pickMention(Number(item.dataset.mentionIndex));
  });
  agentInput.addEventListener("keydown", (e) => {
    if (!mentionPop.hidden && mentionItems.length && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      mentionIndex = (mentionIndex + (e.key === "ArrowDown" ? 1 : -1) + mentionItems.length) % mentionItems.length;
      paintMentions();
      return;
    }
    if (!mentionPop.hidden && e.key === "Escape") {
      e.preventDefault();
      mentionPop.hidden = true;
      return;
    }
    if (!mentionPop.hidden && e.key === "Enter" && mentionItems.length) {
      e.preventDefault();
      pickMention(mentionIndex);
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      document.getElementById("agentForm").requestSubmit();
    }
  });
  renderCrew();

  const sharePop = document.getElementById("sharePop");
  const renderClassTeamShare = () => {
    const fallbackTeams = {
      photo: { id: "t2", name: "그린 픽셀", project: "광합성 실험 가이드", members: ["김서윤", "정현우", "윤다인"] },
      campus: { id: "t4", name: "모션 랩", project: "캠퍼스 오리엔테이션", members: ["임채원", "강도윤", "배수아"] },
      sample: { id: "t1", name: "프레임 메이커스", project: "브랜드 숏폼 광고 제작", members: ["이지수", "박민재", "최하은"] }
    };
    let assigned = null;
    try {
      const classState = JSON.parse(localStorage.getItem("avora.professor-board.v1") || "null");
      const signedIn = JSON.parse(localStorage.getItem("avora.nodeSignedIn") || "null");
      const student = classState?.students?.find((item) => item.email === signedIn?.email);
      const team = classState?.teams?.find((item) =>
        (student && item.memberIds?.includes(student.id)) ||
        (reviewTeam && item.name === reviewTeam) ||
        item.id === fallbackTeams[boardId]?.id
      );
      if (team?.origin === "self") return;
      if (team) {
        assigned = {
          name: team.name,
          project: team.project,
          members: (team.memberIds || []).map((id) => classState.students.find((item) => item.id === id)?.name).filter(Boolean)
        };
      }
    } catch {}
    assigned ||= fallbackTeams[boardId] || (reviewTeam ? { name: reviewTeam, project: reviewProject || projectName, members: reviewStudent ? [reviewStudent] : [] } : null);
    if (!assigned) return;
    const block = document.getElementById("classTeamShare");
    block.hidden = false;
    document.getElementById("classTeamName").textContent = assigned.name;
    document.getElementById("classTeamProject").textContent = assigned.project;
    const people = document.getElementById("classTeamMembers");
    people.replaceChildren(...assigned.members.map((name) => {
      const avatar = document.createElement("span");
      avatar.className = "class-team-member";
      avatar.textContent = name.slice(-2, -1) || name[0];
      avatar.title = `${name} · 관리자 배정`;
      return avatar;
    }));
  };
  renderClassTeamShare();
  const mePop = document.getElementById("mePop");
  const presentPop = document.getElementById("presentPop");
  const presentMode = document.getElementById("presentMode");
  const presentLoading = document.getElementById("presentLoading");
  const presentLoadingStatus = document.getElementById("presentLoadingStatus");
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
      if (!n) return;
      const s = sizeOf(n);
      const at = worldOf(n);
      peer.wx = at.x + 40 + Math.random() * Math.max(40, s.w - 80);
      peer.wy = at.y + 24 + Math.random() * 80;
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
    const at = worldOf(n);
    const rect = canvas.getBoundingClientRect();
    state.selectedId = n.id;
    state.cam.scale = 0.92;
    state.cam.x = rect.width / 2 - (at.x + s.w / 2) * state.cam.scale;
    state.cam.y = rect.height / 2 - (at.y + s.h / 2) * state.cam.scale + 18;
    renderAll();
    world.querySelectorAll(".node").forEach((el) => el.classList.toggle("is-present-focus", el.dataset.id === n.id));
  };
  const syncPresentLabel = () => {
    document.getElementById("presentStep").textContent = `${presentIndex + 1}/${state.nodes.length}`;
    document.getElementById("presentCount").textContent = `${3 + remotes.size}명`;
  };
  const enterPresent = (fromCurrent) => {
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
  let presentLoadingTimer = 0;
  const startPresent = (fromCurrent) => {
    closePops();
    window.clearTimeout(presentLoadingTimer);
    presentLoading.hidden = false;
    presentLoadingStatus.textContent = "장면을 불러오는 중";
    requestAnimationFrame(() => presentLoading.classList.add("is-visible"));
    window.setTimeout(() => { presentLoadingStatus.textContent = "노드 흐름을 연결하는 중"; }, 800);
    window.setTimeout(() => { presentLoadingStatus.textContent = "재생 준비 완료"; }, 1900);
    presentLoadingTimer = window.setTimeout(() => {
      presentLoading.classList.remove("is-visible");
      window.setTimeout(() => {
        presentLoading.hidden = true;
        enterPresent(fromCurrent);
      }, 240);
    }, 2800);
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
  const meProfile = {
    name: "Jisu Lee",
    short: "지",
    email: "js97lee@gmail.com",
    uuid: "a7f3c2e1-9b4d-4e8a-b1c0-6d5e4f3a2b1c",
    color: "#7c3aed",
    credits: 100,
  };
  const paintMe = () => {
    document.getElementById("meAvatar").textContent = meProfile.short;
    document.getElementById("meHeadAvatar").textContent = meProfile.short;
    document.getElementById("meName").textContent = meProfile.name;
    document.getElementById("meEmail").textContent = meProfile.email;
    document.getElementById("creditCount").textContent = String(meProfile.credits);
    document.getElementById("meBtn").title = `${meProfile.name} · 나`;
  };
  paintMe();
  document.getElementById("copyUuid")?.addEventListener("click", async (e) => {
    e.stopPropagation();
    const btn = e.currentTarget;
    try { await navigator.clipboard.writeText(meProfile.uuid); } catch {}
    const prev = btn.childNodes[0].textContent;
    btn.childNodes[0].textContent = "복사됨";
    setTimeout(() => { btn.childNodes[0].textContent = prev || "UUID"; }, 1000);
  });
  document.querySelector("[data-me-pref='lang']")?.addEventListener("click", (e) => {
    e.stopPropagation();
    const el = document.getElementById("meLangLabel");
    el.textContent = el.textContent === "한국어" ? "English" : "한국어";
  });
  document.querySelector("[data-me-pref='theme']")?.addEventListener("click", (e) => {
    e.stopPropagation();
    const el = document.getElementById("meThemeLabel");
    el.textContent = el.textContent === "다크" ? "라이트" : "다크";
  });
  const renderRemotes = () => {
    extras.querySelectorAll("[data-remote]").forEach((el) => el.remove());
    liveBox.querySelectorAll("[data-remote]").forEach((el) => el.remove());
    remotes.forEach((peer) => {
      const av = document.createElement("button");
      av.type = "button";
      av.dataset.remote = peer.id;
      av.className = "avatar a-green";
      av.title = `${peer.name} · 접속 중`;
      av.textContent = peer.short;
      extras.appendChild(av);
      if (peer.wx != null) {
        const cur = document.createElement("div");
        cur.className = "live-cursor";
        cur.dataset.remote = peer.id;
        cur.style.setProperty("--peer", peer.color || "#059669");
        cur.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M1 1 7.5 14.5 9 8.5 15 7z"/></svg><span>${peer.name}</span>`;
        liveBox.appendChild(cur);
      }
    });
    const count = document.getElementById("presentCount");
    if (count) count.textContent = `${3 + remotes.size}명`;
    placeCursors();
  };
  if ("BroadcastChannel" in window) {
    const channel = new BroadcastChannel(`avora-${boardId}`);
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
  document.getElementById("starryToggle")?.addEventListener("click", () => {
    starryAgent?.classList.toggle("is-minimized");
  });
  const starryContact = document.getElementById("starryContact");
  const starryContactPop = document.getElementById("starryContactPop");
  const starryContactInput = document.getElementById("starryContactInput");
  const starryContactGuide = document.getElementById("starryContactGuide");
  const starryContactCount = document.getElementById("starryContactCount");
  const openStarryContact = () => {
    if (!starryContactPop) return;
    starryAgent?.classList.remove("is-minimized");
    starryContactPop.hidden = false;
    starryContact?.setAttribute("aria-expanded", "true");
    starryContactGuide.textContent = "현재 프로젝트 화면과 함께 관리자에게 전달됩니다.";
    window.setTimeout(() => starryContactInput?.focus(), 0);
  };
  const closeStarryContact = () => {
    if (!starryContactPop) return;
    starryContactPop.hidden = true;
    starryContact?.setAttribute("aria-expanded", "false");
  };
  starryContact?.addEventListener("click", (event) => {
    event.stopPropagation();
    if (starryContactPop?.hidden) openStarryContact();
    else closeStarryContact();
  });
  starryContact?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openStarryContact();
  });
  document.getElementById("starryContactClose")?.addEventListener("click", closeStarryContact);
  starryContactPop?.addEventListener("click", (event) => event.stopPropagation());
  document.addEventListener("click", closeStarryContact);
  starryContactInput?.addEventListener("input", () => {
    starryContactCount.textContent = `${starryContactInput.value.length} / 500`;
  });
  document.getElementById("starryContactForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = starryContactInput.value.trim();
    if (!message) return;
    let sender = { email: "student@avora.local" };
    let inquiries = [];
    try { sender = JSON.parse(localStorage.getItem("avora.nodeSignedIn") || "null") || sender; } catch {}
    try { inquiries = JSON.parse(localStorage.getItem("avora.admin-inquiries.v1") || "[]"); } catch {}
    inquiries.unshift({
      id: `inquiry-${Date.now()}`,
      message,
      project: projectName,
      boardId,
      team: reviewTeam || "",
      student: reviewStudent || "",
      sender: sender.email || "student@avora.local",
      status: "new",
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("avora.admin-inquiries.v1", JSON.stringify(inquiries.slice(0, 100)));
    starryContactInput.value = "";
    starryContactCount.textContent = "0 / 500";
    starryContactGuide.textContent = "관리자에게 전달했어요. 답변이 오면 Starry가 알려드릴게요.";
    updateStarry("문의 전송 완료", false, "smile");
    window.setTimeout(() => updateStarry(), 1800);
  });

  renderAddMenu();
  renderAll();
  placeCursors();
  setInterval(wanderPeers, 2600);
})();
