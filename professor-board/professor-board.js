(() => {
  const STORAGE_KEY = "avora.professor-board.v1";
  const colors = ["#7055ad", "#477b97", "#967044", "#4f806e", "#955c7b", "#6267a1"];
  const avatarColors = ["#7055ad", "#477b97", "#967044", "#4f806e", "#955c7b", "#6267a1"];

  const initialStudents = [
    { id: "s1", name: "이지수", email: "jisoo.lee@univ.ac.kr", grade: 3, studentNo: "20231201" },
    { id: "s2", name: "박민재", email: "minjae.park@univ.ac.kr", grade: 3, studentNo: "20231208" },
    { id: "s3", name: "최하은", email: "haeun.choi@univ.ac.kr", grade: 2, studentNo: "20241214" },
    { id: "s4", name: "김서윤", email: "seoyun.kim@univ.ac.kr", grade: 4, studentNo: "20221203" },
    { id: "s5", name: "정현우", email: "hyunwoo.jung@univ.ac.kr", grade: 3, studentNo: "20231219" },
    { id: "s6", name: "윤다인", email: "dain.yoon@univ.ac.kr", grade: 2, studentNo: "20241221" },
    { id: "s7", name: "오준호", email: "junho.oh@univ.ac.kr", grade: 4, studentNo: "20221211" },
    { id: "s8", name: "한유진", email: "yujin.han@univ.ac.kr", grade: 3, studentNo: "20231227" },
    { id: "s9", name: "송지민", email: "jimin.song@univ.ac.kr", grade: 2, studentNo: "20241230" },
    { id: "s10", name: "임채원", email: "chaewon.lim@univ.ac.kr", grade: 4, studentNo: "20221224" },
    { id: "s11", name: "강도윤", email: "doyoon.kang@univ.ac.kr", grade: 3, studentNo: "20231302" },
    { id: "s12", name: "배수아", email: "sua.bae@univ.ac.kr", grade: 2, studentNo: "20241308" },
    { id: "s13", name: "조예린", email: "yerin.jo@univ.ac.kr", grade: 3, studentNo: "20231315" },
    { id: "s14", name: "문태오", email: "taeo.moon@univ.ac.kr", grade: 2, studentNo: "20241322" }
  ];

  const promptSets = {
    t1: [
      { v: "v.8", author: "이지수", studentId: "s1", ago: "18분 전", type: "video", label: "비디오", text: "밝은 아침의 캠퍼스 광장. 주인공을 향해 천천히 돌리 인하며 자연스러운 렌즈 플레어와 활기찬 학생들의 움직임을 담아줘.", change: "카메라 무빙과 시간대 구체화" },
      { v: "v.7", author: "박민재", studentId: "s2", ago: "1시간 전", type: "image", label: "이미지", text: "현대적인 캠퍼스 광장을 배경으로 밝고 친근한 대학생 캐릭터가 카메라를 바라보는 브랜드 숏폼의 첫 장면.", change: "캐릭터 표정과 배경 수정" },
      { v: "v.6", author: "최하은", studentId: "s3", ago: "어제", type: "script", label: "스크립트", text: "새로운 시작은 언제나 설렌다. 우리 학교에서 발견하는 가능성을 25초의 빠른 호흡으로 전달한다.", change: "핵심 메시지를 25초로 압축" }
    ],
    t2: [
      { v: "v.11", author: "김서윤", studentId: "s4", ago: "42분 전", type: "image", label: "이미지", text: "식물 잎의 기공이 열리고 빛 입자가 들어오는 과정을 교육용 3D 인포그래픽 스타일로 표현해줘.", change: "미세 구조의 시각적 정확도 개선" },
      { v: "v.10", author: "정현우", studentId: "s5", ago: "3시간 전", type: "script", label: "스크립트", text: "빛 에너지가 어떻게 포도당으로 전환되는지 중학생도 이해할 수 있는 세 단계 내레이션으로 설명한다.", change: "학습 난이도와 용어 조정" },
      { v: "v.9", author: "윤다인", studentId: "s6", ago: "어제", type: "video", label: "비디오", text: "엽록체 내부를 여행하는 듯한 매크로 카메라로 광합성 반응의 흐름을 8초 동안 보여준다.", change: "장면 길이와 카메라 설정 추가" }
    ],
    t3: [
      { v: "v.6", author: "오준호", studentId: "s7", ago: "2시간 전", type: "video", label: "비디오", text: "폐현수막이 세련된 가방으로 재탄생하는 과정을 탑뷰 타임랩스로 빠르게 연결해줘.", change: "전환 방식과 촬영 시점 변경" },
      { v: "v.5", author: "한유진", studentId: "s8", ago: "어제", type: "image", label: "이미지", text: "재활용 소재의 질감이 살아 있는 미니멀한 제품 사진, 뉴트럴 배경과 부드러운 자연광.", change: "재질감과 라이팅 보강" }
    ],
    t4: [
      { v: "v.4", author: "임채원", studentId: "s10", ago: "5시간 전", type: "script", label: "스크립트", text: "처음 캠퍼스를 방문한 신입생의 시선으로 강의실, 라운지, 도서관을 차례로 소개한다.", change: "관찰자 시점으로 내레이션 변경" },
      { v: "v.3", author: "강도윤", studentId: "s11", ago: "어제", type: "video", label: "비디오", text: "캠퍼스 지도를 따라 이동하는 라인 애니메이션과 실제 공간 영상을 매치 컷으로 연결한다.", change: "공간 전환 아이디어 추가" }
    ]
  };

  const initialTeams = [
    { id: "t1", name: "프레임 메이커스", project: "브랜드 숏폼 광고 제작", origin: "admin", color: colors[0], memberIds: ["s1","s2","s3"], scores: { s1: 42, s2: 34, s3: 24 }, promptTotal: 38, activity: "12분 전", weekly: 64 },
    { id: "t2", name: "그린 픽셀", project: "광합성 실험 가이드", origin: "admin", color: colors[1], memberIds: ["s4","s5","s6"], scores: { s4: 39, s5: 33, s6: 28 }, promptTotal: 46, activity: "42분 전", weekly: 71 },
    { id: "t3", name: "리버스 스튜디오", project: "업사이클링 브랜드 필름", origin: "admin", color: colors[2], memberIds: ["s7","s8","s9"], scores: { s7: 47, s8: 31, s9: 22 }, promptTotal: 27, activity: "2시간 전", weekly: 48 },
    { id: "t4", name: "모션 랩", project: "캠퍼스 오리엔테이션", origin: "admin", color: colors[3], memberIds: ["s10","s11","s12"], scores: { s10: 36, s11: 35, s12: 29 }, promptTotal: 17, activity: "5시간 전", weekly: 39 }
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
  const studentById = (id) => state.students.find((student) => student.id === id);
  const selectedTeam = () => state.teams.find((team) => team.id === state.selectedTeamId) || state.teams[0];
  const initialOf = (name) => name.slice(-2, -1) || name[0] || "?";
  const colorForStudent = (id) => avatarColors[Math.max(0, state.students.findIndex((student) => student.id === id)) % avatarColors.length];

  const loadState = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (stored?.teams?.length && stored?.students?.length) {
        const students = stored.students.map((student) => ({
          ...initialStudents.find((seed) => seed.id === student.id),
          ...student
        }));
        const teams = stored.teams.map((team, index) => ({ ...initialTeams.find((seed) => seed.id === team.id), ...team, color: colors[index % colors.length] }));
        return { teams, students, selectedTeamId: stored.selectedTeamId || stored.teams[0].id, sortRecent: true };
      }
    } catch (_) {}
    return { teams: structuredClone(initialTeams), students: structuredClone(initialStudents), selectedTeamId: "t1", sortRecent: true };
  };
  const state = loadState();
  let movingStudentId = null;

  const persist = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ teams: state.teams, students: state.students, selectedTeamId: state.selectedTeamId }));
  };

  let toastTimer = 0;
  const toast = (message) => {
    const el = $("#toast");
    el.textContent = message;
    el.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-on"), 1800);
  };

  const avatarMarkup = (student) => `<span class="avatar" style="background:${colorForStudent(student.id)}">${escapeHtml(initialOf(student.name))}</span>`;

  const renderMetrics = () => {
    const assignedIds = new Set(state.teams.flatMap((team) => team.memberIds));
    $("#teamCount").textContent = state.teams.length;
    $("#assignedCount").textContent = assignedIds.size;
    $("#unassignedCount").textContent = state.students.length - assignedIds.size;
    $("#promptCount").textContent = state.teams.reduce((sum, team) => sum + (team.promptTotal || 0), 0);
    $("#teamListCaption").textContent = `${state.teams.length}개 팀`;
  };

  const renderTeamList = () => {
    const query = $("#teamSearch").value.trim().toLowerCase();
    let teams = state.teams.filter((team) => {
      const memberText = team.memberIds.map((id) => studentById(id)?.name || "").join(" ");
      return `${team.name} ${team.project} ${memberText}`.toLowerCase().includes(query);
    });
    if (!state.sortRecent) teams = [...teams].sort((a, b) => a.name.localeCompare(b.name, "ko"));
    $("#teamList").innerHTML = teams.length ? teams.map((team, index) => {
      const members = team.memberIds.map(studentById).filter(Boolean);
      return `
        <button class="team-item${team.id === state.selectedTeamId ? " is-active" : ""}" type="button" data-team-id="${escapeHtml(team.id)}">
          <span class="team-item-symbol" style="--team-color:${team.color}">${String(index + 1).padStart(2,"0")}</span>
          <span class="team-item-copy"><b>${escapeHtml(team.name)}</b><span>${escapeHtml(team.project)}</span></span>
          <span class="team-item-meta">
            <span class="mini-avatars">${members.slice(0,4).map((student) => `<i class="mini-avatar" style="background:${colorForStudent(student.id)}">${escapeHtml(initialOf(student.name))}</i>`).join("")}</span>
            <em>${escapeHtml(team.activity || "방금 전")}</em>
          </span>
        </button>
      `;
    }).join("") : `<p class="student-empty">검색 결과가 없습니다.</p>`;
  };

  const renderMembers = (team) => {
    const members = team.memberIds.map(studentById).filter(Boolean);
    $("#memberList").innerHTML = members.length ? members.map((student) => {
      const score = team.scores[student.id] || Math.max(10, Math.floor(100 / members.length));
      return `
        <div class="member-row">
          <div class="member-person">${avatarMarkup(student)}<span><b>${escapeHtml(student.name)}</b><em>${escapeHtml(student.email)}</em></span></div>
          <span class="contribution-track"><i style="width:${Math.min(100, score * 2)}%"></i></span>
          <strong class="contribution-value">${score}%</strong>
          <div class="member-review-actions">
            <button type="button" data-student-workspace="${student.id}">노드 보기</button>
            <button type="button" data-student-work="${student.id}">작업물</button>
            <button class="remove-member" type="button" data-remove-student="${student.id}" title="팀에서 제외" aria-label="${escapeHtml(student.name)} 팀에서 제외">×</button>
          </div>
        </div>
      `;
    }).join("") : `<p class="student-empty">아직 배정된 학생이 없습니다. ‘계정 배정’을 눌러 멤버를 추가하세요.</p>`;
  };

  const renderPromptTimeline = (team) => {
    const filter = $("#promptTypeFilter").value;
    const prompts = (promptSets[team.id] || []).filter((prompt) => filter === "all" || prompt.type === filter);
    $("#promptTimeline").innerHTML = prompts.length ? prompts.map((prompt) => {
      const student = studentById(prompt.studentId) || { id: "none", name: prompt.author };
      return `
        <article class="prompt-entry">
          <span class="version-dot">${escapeHtml(prompt.v)}</span>
          <div class="prompt-card">
            <div class="prompt-card-head">
              <span class="prompt-author">${avatarMarkup(student)}<b>${escapeHtml(prompt.author)}</b><em>${escapeHtml(prompt.ago)}</em></span>
              <span class="prompt-kind is-${prompt.type}">${escapeHtml(prompt.label)}</span>
            </div>
            <p class="prompt-text">${escapeHtml(prompt.text)}</p>
            <span class="prompt-change">+ ${escapeHtml(prompt.change)}</span>
          </div>
        </article>
      `;
    }).join("") : `<p class="student-empty">이 유형의 프롬프트 기록이 없습니다.</p>`;
  };

  const renderRoleViews = () => {
    const assignedIds = new Set(state.teams.flatMap((team) => team.memberIds));
    const waiting = state.students.filter((student) => !assignedIds.has(student.id));

    $("#manageTeamGrid").innerHTML = state.teams.map((team, index) => {
      const members = team.memberIds.map(studentById).filter(Boolean);
      return `
        <article class="manage-team-card">
          <div class="manage-team-card-head">
            <span class="team-item-symbol" style="--team-color:${team.color}">${String(index + 1).padStart(2,"0")}</span>
            <div><b>${escapeHtml(team.name)}</b><em>${escapeHtml(team.project)}</em></div>
            ${team.origin === "admin" ? `<small class="managed-team-label">관리자 생성</small>` : `<small>자율 구성</small>`}
          </div>
          <div class="manage-members">
            ${members.length ? members.map((student) => `<span class="manage-member" title="${team.origin === "admin" ? "관리자 배정 계정" : "팀 참여 계정"}">${avatarMarkup(student)}<span>${escapeHtml(student.name)}</span>${team.origin === "admin" ? "<em>배정됨</em>" : ""}</span>`).join("") : `<span class="student-empty">배정된 멤버 없음</span>`}
          </div>
          <div class="manage-card-foot">
            <span>프롬프트 ${team.promptTotal || 0} · 이번 주 활동 ${team.weekly || 0}회</span>
            <div class="manage-card-actions">
              <button type="button" data-manage-open="${team.id}">상세 보기</button>
              <button type="button" data-manage-workspace="${team.id}">노드 검토</button>
              <button type="button" data-manage-work="${team.id}">작업물</button>
              <button type="button" data-manage-assign="${team.id}">멤버 배정</button>
            </div>
          </div>
        </article>
      `;
    }).join("");

    $("#waitingCount").textContent = `${waiting.length}명`;
    $("#waitingList").innerHTML = waiting.length ? waiting.map((student) => `
      <div class="waiting-person">${avatarMarkup(student)}<span><b>${escapeHtml(student.name)}</b><em>${escapeHtml(student.email)}</em></span></div>
    `).join("") : `<p class="student-empty">모든 학생의 배정이 완료됐습니다.</p>`;

    const teamFilter = $("#globalPromptTeam");
    const selectedFilter = teamFilter.value || "all";
    teamFilter.innerHTML = `<option value="all">전체 팀</option>${state.teams.map((team) => `<option value="${escapeHtml(team.id)}">${escapeHtml(team.name)}</option>`).join("")}`;
    teamFilter.value = state.teams.some((team) => team.id === selectedFilter) ? selectedFilter : "all";
    const maxPrompt = Math.max(1, ...state.teams.map((team) => team.promptTotal || 0));
    $("#promptRankList").innerHTML = [...state.teams].sort((a,b) => b.promptTotal - a.promptTotal).map((team) => `
      <div class="prompt-rank">
        <div class="prompt-rank-head"><span>${escapeHtml(team.name)}</span><b>${team.promptTotal || 0}</b></div>
        <span class="rank-track"><i style="width:${Math.round((team.promptTotal || 0) / maxPrompt * 100)}%"></i></span>
      </div>
    `).join("");
    renderGlobalPrompts();

    $("#rosterTotal").textContent = state.students.length;
    $("#rosterAssigned").textContent = assignedIds.size;
    $("#rosterWaiting").textContent = waiting.length;
    $("#studentRoster").innerHTML = state.students.map((student, index) => {
      const team = state.teams.find((item) => item.memberIds.includes(student.id));
      const score = team?.scores?.[student.id] || 0;
      return `
        <div class="student-table-row">
          <div class="student-table-person">${avatarMarkup(student)}<span><b>${escapeHtml(student.name)}</b><em>${escapeHtml(student.email)}</em></span></div>
          <span class="student-academic"><b>${student.grade}학년</b><em>${escapeHtml(student.studentNo)}</em></span>
          <span class="student-team-chip${team ? "" : " is-waiting"}" style="--team-color:${team?.color || "#f59e0b"}"><i></i>${escapeHtml(team?.name || "배정 대기")}</span>
          <span class="student-score"><span class="rank-track"><i style="width:${Math.min(100,score * 2)}%"></i></span><b>${score}%</b></span>
          <span class="student-last">${team ? ["오늘","어제","3일 전"][index % 3] : "활동 전"}</span>
          <button class="student-row-action" type="button" data-student-team="${student.id}">${team ? "팀 변경" : "팀 배정"}</button>
        </div>
      `;
    }).join("");
  };

  const renderGlobalPrompts = () => {
    const filter = $("#globalPromptTeam").value || "all";
    const records = state.teams
      .filter((team) => filter === "all" || team.id === filter)
      .flatMap((team) => (promptSets[team.id] || []).map((prompt, index) => ({ ...prompt, team, order: index })))
      .sort((a,b) => a.order - b.order);
    $("#globalPromptList").innerHTML = records.length ? records.map((record) => `
      <article class="global-prompt-card">
        <span class="global-prompt-version">${escapeHtml(record.v)}</span>
        <div class="global-prompt-main">
          <div class="global-prompt-meta"><b>${escapeHtml(record.team.name)}</b><span>·</span><span>${escapeHtml(record.author)}</span><span>·</span><span>${escapeHtml(record.ago)}</span><span class="prompt-kind is-${record.type}">${escapeHtml(record.label)}</span></div>
          <p>${escapeHtml(record.text)}</p>
          <span class="prompt-change">+ ${escapeHtml(record.change)}</span>
        </div>
      </article>
    `).join("") : `<p class="student-empty">표시할 프롬프트 기록이 없습니다.</p>`;
  };

  const renderDetail = () => {
    const team = selectedTeam();
    if (!team) return;
    $("#selectedTeamSymbol").textContent = String(state.teams.indexOf(team) + 1).padStart(2, "0");
    $("#selectedTeamSymbol").style.background = team.color;
    $("#selectedTeamName").textContent = team.name;
    $("#selectedTeamProject").textContent = team.project;
    $("#selectedTeamOrigin").hidden = team.origin !== "admin";
    $("#promptBadge").textContent = team.promptTotal || 0;
    $("#assignTeamName").textContent = team.name;
    $("#weeklyActivity").textContent = `${team.weekly || 0}회`;
    renderMembers(team);
    renderPromptTimeline(team);
  };

  const renderStudentPool = () => {
    const team = selectedTeam();
    const query = $("#studentSearch").value.trim().toLowerCase();
    const assignedElsewhere = new Set(state.teams.filter((item) => item.id !== team.id).flatMap((item) => item.memberIds));
    const students = state.students.filter((student) => {
      const matches = `${student.name} ${student.email}`.toLowerCase().includes(query);
      return matches && !team.memberIds.includes(student.id);
    });
    $("#studentPool").innerHTML = students.length ? students.map((student) => {
      const owner = state.teams.find((item) => item.memberIds.includes(student.id));
      return `
        <div class="student-option">
          ${avatarMarkup(student)}
          <div><b>${escapeHtml(student.name)}</b><em>${owner ? `${escapeHtml(owner.name)} 배정 중` : escapeHtml(student.email)}</em></div>
          <button type="button" data-assign-student="${student.id}">${assignedElsewhere.has(student.id) ? "팀 이동" : "배정"}</button>
        </div>
      `;
    }).join("") : `<p class="student-empty">배정 가능한 학생이 없습니다.</p>`;
  };

  const openMoveModal = (studentId) => {
    const student = studentById(studentId);
    const currentTeam = state.teams.find((team) => team.memberIds.includes(studentId));
    if (!student) return;
    movingStudentId = studentId;
    $("#moveStudentName").textContent = student.name;
    $("#moveTeamList").innerHTML = state.teams
      .filter((team) => !currentTeam || team.id !== currentTeam.id)
      .map((team) => `
        <button class="move-team-option" type="button" data-move-team="${escapeHtml(team.id)}">
          <span class="team-item-symbol" style="--team-color:${team.color}">${String(state.teams.indexOf(team) + 1).padStart(2, "0")}</span>
          <span><b>${escapeHtml(team.name)}</b><em>${escapeHtml(team.project)} · ${team.memberIds.length}명</em></span>
          <small>이 팀으로 이동 →</small>
        </button>
      `).join("");
    openModal("#moveModal");
  };

  const renderAll = () => {
    if (!selectedTeam() && state.teams.length) state.selectedTeamId = state.teams[0].id;
    renderMetrics();
    renderTeamList();
    renderDetail();
    renderRoleViews();
    persist();
  };

  const setDetailTab = (tab) => {
    $$(".detail-tabs button").forEach((button) => button.classList.toggle("is-active", button.dataset.detailTab === tab));
    $("#membersView").hidden = tab !== "members";
    $("#promptsView").hidden = tab !== "prompts";
  };

  const openModal = (id) => {
    $(id).hidden = false;
    requestAnimationFrame(() => $(id).querySelector("input")?.focus());
  };
  const closeModal = (id) => { $(id).hidden = true; };
  let reviewContext = null;

  const workspaceBoardForTeam = (team) => ({ t1: "sample", t2: "photo", t3: "sample", t4: "campus" }[team.id] || "new");
  const openWorkspaceReview = (team, student = null) => {
    if (!team) return;
    const params = new URLSearchParams({
      board: workspaceBoardForTeam(team),
      review: "1",
      team: team.name,
      project: team.project
    });
    if (student) {
      params.set("student", student.name);
      params.set("studentId", student.id);
    }
    window.open(`../workspace.html?${params.toString()}`, "_blank", "noopener");
  };

  const reviewWorks = (team, student = null) => {
    const owner = student?.name || team.name;
    const posters = ["../assets/app/shots/open.png", "../assets/app/shots/wide.png", "../assets/app/shots/leaf.png"];
    return [
      { id: "final", title: `${team.project} · 최종본`, meta: `${owner} · 00:28 · v.8`, duration: "00:28", poster: posters[Number(team.id.replace(/\D/g, "")) % posters.length] },
      { id: "scene", title: "장면 연결 검토본", meta: `${owner} · 00:15 · v.6`, duration: "00:15", poster: posters[(Number(team.id.replace(/\D/g, "")) + 1) % posters.length] },
      { id: "draft", title: "초기 콘셉트 편집본", meta: `${owner} · 00:09 · v.3`, duration: "00:09", poster: posters[(Number(team.id.replace(/\D/g, "")) + 2) % posters.length] }
    ];
  };

  const selectReviewWork = (work) => {
    $("#reviewPoster").src = work.poster;
    $("#reviewPoster").alt = work.title;
    $("#reviewDuration").textContent = work.duration;
    $("#reviewTime").textContent = "00:00";
    $("#reviewPlayer").classList.remove("is-playing");
    $("#reviewPlay").textContent = "▶";
    $$(".review-work-card", $("#reviewWorkList")).forEach((card) => card.classList.toggle("is-active", card.dataset.workId === work.id));
  };

  const openReviewModal = (team, student = null) => {
    if (!team) return;
    reviewContext = { team, student };
    const works = reviewWorks(team, student);
    $("#reviewModalTitle").textContent = student ? `${student.name} 작업물 검토` : `${team.name} 작업물 검토`;
    $("#reviewModalDescription").innerHTML = `<b>${escapeHtml(team.project)}</b>의 렌더 영상과 버전별 편집본을 확인합니다.`;
    $("#reviewWorkList").innerHTML = works.map((work, index) => `
      <button class="review-work-card${index === 0 ? " is-active" : ""}" type="button" data-work-id="${work.id}">
        <img src="${work.poster}" alt="" />
        <span><b>${escapeHtml(work.title)}</b><small>${escapeHtml(work.meta)}</small></span>
      </button>
    `).join("");
    selectReviewWork(works[0]);
    openModal("#reviewModal");
  };

  $("#teamList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-team-id]");
    if (!button) return;
    state.selectedTeamId = button.dataset.teamId;
    renderTeamList();
    renderDetail();
    persist();
  });

  $("#teamSearch").addEventListener("input", renderTeamList);
  $("#sortTeams").addEventListener("click", () => {
    state.sortRecent = !state.sortRecent;
    $("#sortTeams").firstChild.textContent = state.sortRecent ? "활동순 " : "이름순 ";
    renderTeamList();
  });

  $$(".detail-tabs button").forEach((button) => button.addEventListener("click", () => setDetailTab(button.dataset.detailTab)));
  $("#promptTypeFilter").addEventListener("change", () => renderPromptTimeline(selectedTeam()));
  $("#openTeamModal").addEventListener("click", () => openModal("#teamModal"));
  $$("[data-open-team]").forEach((button) => button.addEventListener("click", () => openModal("#teamModal")));
  $$("[data-close-modal]").forEach((button) => button.addEventListener("click", () => closeModal("#teamModal")));
  $("#openAssignModal").addEventListener("click", () => {
    $("#studentSearch").value = "";
    renderStudentPool();
    openModal("#assignModal");
  });
  $$("[data-close-assign]").forEach((button) => button.addEventListener("click", () => closeModal("#assignModal")));
  $$("[data-close-move]").forEach((button) => button.addEventListener("click", () => closeModal("#moveModal")));
  $("#studentSearch").addEventListener("input", renderStudentPool);

  $("#teamForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("#newTeamName").value.trim();
    const project = $("#newTeamProject").value.trim();
    if (!name || !project) return;
    const id = `t${Date.now()}`;
    state.teams.push({ id, name, project, origin: "admin", color: colors[state.teams.length % colors.length], memberIds: [], scores: {}, promptTotal: 0, activity: "방금 전", weekly: 0 });
    state.selectedTeamId = id;
    promptSets[id] = [];
    event.currentTarget.reset();
    closeModal("#teamModal");
    renderAll();
    toast(`${name} 팀을 만들었습니다.`);
  });

  $("#studentPool").addEventListener("click", (event) => {
    const button = event.target.closest("[data-assign-student]");
    if (!button) return;
    const studentId = button.dataset.assignStudent;
    const team = selectedTeam();
    const currentTeam = state.teams.find((item) => item.memberIds.includes(studentId));
    if (currentTeam && currentTeam.id !== team.id) {
      openMoveModal(studentId);
      return;
    }
    state.teams.forEach((item) => {
      item.memberIds = item.memberIds.filter((id) => id !== studentId);
      delete item.scores[studentId];
    });
    team.memberIds.push(studentId);
    team.scores[studentId] = Math.max(15, Math.round(100 / team.memberIds.length));
    team.activity = "방금 전";
    renderAll();
    renderStudentPool();
    toast(`${studentById(studentId).name} 계정을 ${team.name}에 배정했습니다.`);
  });

  $("#moveTeamList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-move-team]");
    if (!button || !movingStudentId) return;
    const student = studentById(movingStudentId);
    const targetTeam = state.teams.find((team) => team.id === button.dataset.moveTeam);
    if (!student || !targetTeam) return;
    state.teams.forEach((team) => {
      team.memberIds = team.memberIds.filter((id) => id !== movingStudentId);
      delete team.scores[movingStudentId];
    });
    targetTeam.memberIds.push(movingStudentId);
    targetTeam.scores[movingStudentId] = Math.max(15, Math.round(100 / targetTeam.memberIds.length));
    targetTeam.activity = "방금 전";
    closeModal("#moveModal");
    movingStudentId = null;
    renderAll();
    renderStudentPool();
    toast(`${student.name} 계정을 ${targetTeam.name}으로 이동했습니다.`);
  });

  $("#memberList").addEventListener("click", (event) => {
    const workspaceButton = event.target.closest("[data-student-workspace]");
    const workButton = event.target.closest("[data-student-work]");
    if (workspaceButton || workButton) {
      const student = studentById((workspaceButton || workButton).dataset.studentWorkspace || (workspaceButton || workButton).dataset.studentWork);
      if (workspaceButton) openWorkspaceReview(selectedTeam(), student);
      else openReviewModal(selectedTeam(), student);
      return;
    }
    const button = event.target.closest("[data-remove-student]");
    if (!button) return;
    const team = selectedTeam();
    const student = studentById(button.dataset.removeStudent);
    team.memberIds = team.memberIds.filter((id) => id !== student.id);
    delete team.scores[student.id];
    renderAll();
    toast(`${student.name} 계정 배정을 해제했습니다.`);
  });

  $("#openWorkspace").addEventListener("click", () => {
    openWorkspaceReview(selectedTeam());
  });
  $("#openDeliverables").addEventListener("click", () => openReviewModal(selectedTeam()));

  $("#manageTeamGrid").addEventListener("click", (event) => {
    const openButton = event.target.closest("[data-manage-open]");
    const assignButton = event.target.closest("[data-manage-assign]");
    const workspaceButton = event.target.closest("[data-manage-workspace]");
    const workButton = event.target.closest("[data-manage-work]");
    const teamId = openButton?.dataset.manageOpen || assignButton?.dataset.manageAssign || workspaceButton?.dataset.manageWorkspace || workButton?.dataset.manageWork;
    if (!teamId) return;
    state.selectedTeamId = teamId;
    renderAll();
    if (workspaceButton) {
      openWorkspaceReview(selectedTeam());
    } else if (workButton) {
      openReviewModal(selectedTeam());
    } else if (assignButton) {
      $("#studentSearch").value = "";
      renderStudentPool();
      openModal("#assignModal");
    } else {
      switchProfessorView("dashboard");
      setDetailTab("members");
    }
  });
  $("#globalPromptTeam").addEventListener("change", renderGlobalPrompts);
  $("#studentRoster").addEventListener("click", (event) => {
    const button = event.target.closest("[data-student-team]");
    if (button) openMoveModal(button.dataset.studentTeam);
  });
  $("#exportRoster").addEventListener("click", () => toast("수강생 명단을 CSV로 준비했습니다."));
  const renderInquiries = () => {
    let inquiries = [];
    try { inquiries = JSON.parse(localStorage.getItem("avora.admin-inquiries.v1") || "[]"); } catch {}
    $("#inquiryCount").textContent = `${inquiries.length}건`;
    $("#inquiryNotice").classList.toggle("is-empty", inquiries.length === 0);
    $("#inquiryList").innerHTML = inquiries.length ? inquiries.map((item) => `
      <article class="inquiry-item">
        <div class="inquiry-item-head"><b>${escapeHtml(item.sender || "학생")}</b><time>${new Date(item.createdAt).toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}</time></div>
        <p>${escapeHtml(item.message)}</p>
        <small>${escapeHtml(item.project || "프로젝트")} · Starry 문의</small>
      </article>
    `).join("") : `<p class="inquiry-empty">아직 도착한 학생 문의가 없습니다.</p>`;
  };
  $("#inquiryButton").addEventListener("click", (event) => {
    event.stopPropagation();
    renderInquiries();
    const pop = $("#inquiryPop");
    pop.hidden = !pop.hidden;
    $("#inquiryButton").setAttribute("aria-expanded", String(!pop.hidden));
  });
  $("#inquiryPop").addEventListener("click", (event) => event.stopPropagation());
  document.addEventListener("click", () => {
    $("#inquiryPop").hidden = true;
    $("#inquiryButton").setAttribute("aria-expanded", "false");
  });
  window.addEventListener("storage", (event) => {
    if (event.key === "avora.admin-inquiries.v1") renderInquiries();
  });
  $$("[data-close-review]").forEach((button) => button.addEventListener("click", () => closeModal("#reviewModal")));
  $("#reviewOpenWorkspace").addEventListener("click", () => {
    if (reviewContext) openWorkspaceReview(reviewContext.team, reviewContext.student);
  });
  $("#reviewWorkList").addEventListener("click", (event) => {
    const card = event.target.closest("[data-work-id]");
    if (!card || !reviewContext) return;
    const work = reviewWorks(reviewContext.team, reviewContext.student).find((item) => item.id === card.dataset.workId);
    if (work) selectReviewWork(work);
  });
  $("#reviewPlay").addEventListener("click", () => {
    const playing = $("#reviewPlayer").classList.toggle("is-playing");
    $("#reviewPlay").textContent = playing ? "Ⅱ" : "▶";
    $("#reviewTime").textContent = playing ? $("#reviewDuration").textContent : "00:00";
  });

  const switchProfessorView = (section) => {
    $$(".prof-section").forEach((view) => {
      const active = view.dataset.profView === section;
      view.hidden = !active;
      view.classList.toggle("is-active", active);
    });
    $$(".prof-nav-item").forEach((item) => item.classList.toggle("is-active", item.dataset.section === section));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  $$(".prof-nav-item").forEach((button) => button.addEventListener("click", () => {
    switchProfessorView(button.dataset.section);
  }));

  [$("#teamModal"), $("#assignModal"), $("#moveModal"), $("#reviewModal")].forEach((modal) => modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.hidden = true;
  }));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal("#teamModal");
      closeModal("#assignModal");
      closeModal("#moveModal");
      closeModal("#reviewModal");
    }
  });

  renderInquiries();
  renderAll();
})();
