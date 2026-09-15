(() => {
  const AUTH_KEY = "avora.nodeSignedIn";
  const NEXT_KEY = "avora.nodeNext";

  const file = () => (location.pathname.split("/").pop() || "home.html");
  const isLanding = () => {
    const p = file();
    return p === "" || p === "home.html" || p === "index.html";
  };
  const session = () => {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY) || "null"); }
    catch { return null; }
  };
  const setNext = (url) => { if (url) sessionStorage.setItem(NEXT_KEY, url); };
  const takeNext = () => {
    const next = sessionStorage.getItem(NEXT_KEY) || "boards.html";
    sessionStorage.removeItem(NEXT_KEY);
    return next;
  };

  if (!isLanding() && !session()) {
    setNext(file() + location.search + location.hash);
    location.replace("index.html?login=1");
    return;
  }

  const modalHtml = `
    <section id="authGate" class="auth-gate" hidden>
      <div class="auth-modal-wrap">
        <button class="auth-close" type="button" id="authClose" aria-label="닫기">×</button>
        <div class="auth-modal" role="dialog" aria-modal="true" aria-labelledby="authWelcome">
          <div class="auth-modal-left">
            <div class="auth-brand">
              <img src="assets/app/avora-logo.png" alt="AVORA" class="auth-logo" />
            </div>
            <h1 id="authWelcome" class="auth-welcome">
              Welcome to
              <img src="assets/app/avora-logo.png" alt="AVORA" class="auth-welcome-logo" />
            </h1>
            <p class="auth-tagline">노드로 스토리보드를 잇고, 영상을 만듭니다.</p>
            <div id="emailAuthPanel" class="email-auth-panel" data-auth-mode="login">
              <div class="auth-tabs" role="tablist" aria-label="인증 방식">
                <button id="showLogin" class="auth-tab is-active" type="button" role="tab" aria-selected="true">로그인</button>
                <button id="showRegister" class="auth-tab" type="button" role="tab" aria-selected="false">회원가입</button>
              </div>
              <form id="loginForm" class="auth-form is-active">
                <input name="email" type="email" placeholder="이메일" required />
                <input name="password" type="password" placeholder="비밀번호" minlength="8" required />
                <button class="primary" type="submit">로그인</button>
              </form>
              <form id="registerForm" class="auth-form" hidden>
                <input name="name" placeholder="이름" required />
                <input name="email" type="email" placeholder="이메일" required />
                <input name="password" type="password" placeholder="비밀번호 8자 이상" minlength="8" required />
                <button class="primary" type="submit">회원가입</button>
              </form>
            </div>
            <p id="authMessage" class="auth-message"></p>
            <button id="workspaceAccessButton" class="auth-workspace-btn" type="button">워크스페이스 들어가기</button>
            <a class="auth-professor-link" href="login/professer/">
              <span>관리자 계정이신가요?</span>
              <strong>관리자 로그인 →</strong>
            </a>
            <div class="auth-footer">
              <p class="auth-hint">마이 프로젝트와 노드 캔버스를 쓰려면 로그인하세요.</p>
              <p class="auth-legal">
                계속 진행하면 <a href="privacy.html">개인정보처리방침</a>,
                <a href="terms.html">이용약관</a>,
                <a href="content-policy.html">콘텐츠 운영정책</a> 및
                <a href="privacy-data-deletion.html">개인정보 삭제 안내</a>에 동의한 것으로 간주됩니다.
              </p>
            </div>
          </div>
          <aside class="auth-modal-right" aria-hidden="true">
            <div class="auth-art">
              <video src="assets/landing/auth-loop.mp4" muted loop autoplay playsinline preload="metadata"></video>
              <div class="auth-art-shade"></div>
              <div class="auth-art-copy">
                <span>AVORA WORKFLOW</span>
                <strong>아이디어에서 완성 영상까지,<br />하나의 흐름으로 연결하세요.</strong>
                <p>스크립트 · 이미지 · 비디오 노드를 팀과 함께 만듭니다.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  `;

  const ensureModal = () => {
    if (document.getElementById("authGate")) return;
    document.body.insertAdjacentHTML("beforeend", modalHtml);
    const panel = document.getElementById("emailAuthPanel");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const showLogin = document.getElementById("showLogin");
    const showRegister = document.getElementById("showRegister");

    const setMode = (mode) => {
      const isLogin = mode === "login";
      panel.setAttribute("data-auth-mode", mode);
      loginForm.hidden = !isLogin;
      loginForm.classList.toggle("is-active", isLogin);
      registerForm.hidden = isLogin;
      registerForm.classList.toggle("is-active", !isLogin);
      showLogin.classList.toggle("is-active", isLogin);
      showRegister.classList.toggle("is-active", !isLogin);
    };

    showLogin.onclick = () => setMode("login");
    showRegister.onclick = () => setMode("register");
    document.getElementById("authClose").onclick = closeAuth;
    document.getElementById("authGate").addEventListener("click", (e) => {
      if (e.target.id === "authGate") closeAuth();
    });
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      enter(String(new FormData(loginForm).get("email") || "studio@avora.local").trim());
    });
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      enter(String(new FormData(registerForm).get("email") || "studio@avora.local").trim());
    });
    document.getElementById("workspaceAccessButton").onclick = () => enter("workspace@avora.local");
    setMode("login");
  };

  const openAuth = (next) => {
    if (next) setNext(next);
    if (!isLanding()) {
      location.href = "index.html?login=1";
      return;
    }
    ensureModal();
    document.getElementById("authGate").hidden = false;
    document.body.classList.add("auth-open");
  };

  const closeAuth = () => {
    const gate = document.getElementById("authGate");
    if (gate) gate.hidden = true;
    document.body.classList.remove("auth-open");
  };

  const enter = (email) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ email, role: "student", at: Date.now() }));
    location.href = takeNext();
  };

  const signOut = () => {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(NEXT_KEY);
    location.href = "index.html";
  };

  const goAuthed = (url) => {
    if (session()) location.href = url;
    else openAuth(url);
  };

  const paintHeader = () => {
    const user = session();
    const loginBtn = document.getElementById("loginBtn");
    const account = document.getElementById("accountMenu");
    const letter = user ? (user.email[0] || "A").toUpperCase() : "A";
    const name = user ? (user.email.split("@")[0] || "계정") : "";
    if (user) {
      if (loginBtn) loginBtn.hidden = true;
      if (account) account.hidden = false;
    } else {
      if (loginBtn) loginBtn.hidden = false;
      if (account) account.hidden = true;
    }
    document.querySelectorAll("[data-account-mark]").forEach((el) => { el.textContent = letter; });
    document.querySelectorAll("[data-account-email]").forEach((el) => { el.textContent = user?.email || ""; });
    document.querySelectorAll("[data-account-name]").forEach((el) => { el.textContent = name; });
    document.querySelectorAll("[data-account-title]").forEach((el) => {
      el.title = user ? `${name} · 나` : "계정";
    });
  };

  const init = () => {
    paintHeader();

    document.getElementById("loginBtn")?.addEventListener("click", () => openAuth("boards.html"));
    document.getElementById("workspaceBtn")?.addEventListener("click", (e) => {
      e.preventDefault();
      goAuthed("boards.html");
    });
    document.getElementById("logoutBtn")?.addEventListener("click", signOut);
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-logout]")) signOut();
    });

    const accountBtn = document.getElementById("accountBtn");
    const accountPop = document.getElementById("accountPop");
    accountBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (accountPop) accountPop.hidden = !accountPop.hidden;
    });
    accountPop?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (e.target.closest("[data-logout]")) signOut();
    });
    document.addEventListener("click", () => {
      if (accountPop) accountPop.hidden = true;
    });

    const storyForm = document.getElementById("storyPromptForm");
    const storyPrompt = document.getElementById("storyPrompt");
    const storyBoard = document.getElementById("storyBoard");
    storyForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const prompt = (storyPrompt?.value || "").trim();
      if (!prompt) {
        storyPrompt?.focus();
        return;
      }
      const board = storyBoard?.value || "new";
      const url = `workspace.html?board=${encodeURIComponent(board)}&prompt=${encodeURIComponent(prompt)}`;
      goAuthed(url);
    });

    document.querySelectorAll("[data-fill-prompt]").forEach((card) => {
      card.addEventListener("click", () => {
        if (storyPrompt) storyPrompt.value = card.getAttribute("data-fill-prompt") || "";
        if (storyBoard && card.dataset.board) storyBoard.value = card.dataset.board;
        document.querySelectorAll("[data-fill-prompt]").forEach((c) => c.classList.toggle("is-on", c === card));
        storyPrompt?.focus();
      });
    });

    const user = session();
    if (user) {
      const meName = document.querySelector("#mePop p");
      if (meName) meName.textContent = user.email.split("@")[0];
    }

    if (isLanding() && new URLSearchParams(location.search).get("login") === "1") {
      if (session()) location.replace(takeNext());
      else openAuth();
    }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
