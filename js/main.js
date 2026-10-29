
document.addEventListener('DOMContentLoaded', () => {

  const landingPage = document.querySelector('.campaign-landing-page');

  function updateScale() {
    if (!landingPage) return;
    const width = window.innerWidth;
    if (width > 768) {
      const scale = width / 1920;
      landingPage.style.zoom = scale;
      landingPage.style.width = '1920px';
      landingPage.style.maxWidth = 'none';
    } else {
      landingPage.style.zoom = '';
      landingPage.style.width = '';
      landingPage.style.maxWidth = '';
    }
  }

  updateScale();
  window.addEventListener('resize', updateScale);


  const views = {
    homepage: document.getElementById('view-homepage'),
    register: document.getElementById('view-register'),
    login: document.getElementById('view-login'),
    page3: document.getElementById('view-page3'),
    page3_2a: document.getElementById('view-page3-2a'),
    page3_2b: document.getElementById('view-page3-2b'),
    page4: document.getElementById('view-page4'),
    page5: document.getElementById('view-page5'),
    page6: document.getElementById('view-page6')
  };

  function getTargetUrl(viewName) {
    const isAtRoot = !!document.getElementById('view-homepage');
    const pageBase = isAtRoot ? 'pages/' : '';
    const homePath = isAtRoot ? 'index.html' : '../index.html';

    const viewPageMap = {
      homepage: homePath,
      register: pageBase + 'page-2.html#dang-ky',
      login: pageBase + 'page-2.html#dang-nhap',
      page3: pageBase + 'page-3.html',
      page3_2a: pageBase + 'page-3.html#page-3-2a',
      page3_2b: pageBase + 'page-3.html#page-3-2b',
      page4: pageBase + 'page-4.html',
      page5: pageBase + 'page-5.html',
      page6: pageBase + 'page-6.html'
    };

    return viewPageMap[viewName];
  }

  function showView(viewName, updateHash = true) {
    const targetEl = views[viewName];
    if (targetEl) {
      Object.keys(views).forEach((key) => {
        const viewEl = views[key];
        if (viewEl) {
          if (key === viewName) {
            viewEl.classList.add('active');
          } else {
            viewEl.classList.remove('active');
          }
        }
      });

      if (updateHash) {
        const hashMap = {
          homepage: '#homepage',
          register: '#dang-ky',
          login: '#dang-nhap',
          page3: '#page-3',
          page3_2a: '#page-3-2a',
          page3_2b: '#page-3-2b',
          page4: '#page-4',
          page5: '#page-5',
          page6: '#page-6'
        };
        if (hashMap[viewName] && window.location.hash !== hashMap[viewName]) {
          window.history.pushState(null, '', hashMap[viewName]);
        }
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
      updateScale();
      return;
    }

    const targetUrl = getTargetUrl(viewName);
    if (targetUrl) {
      window.location.href = targetUrl;
    }
  }
  window.showView = showView;

  function handleHashRoute() {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#dang-ky' || hash === '#register') {
      showView('register', false);
    } else if (hash === '#dang-nhap' || hash === '#login') {
      showView('login', false);
    } else if (hash === '#page-3-2a' || hash === '#survey-2a') {
      showView('page3_2a', false);
    } else if (hash === '#page-3-2b' || hash === '#survey-2b') {
      showView('page3_2b', false);
    } else if (hash === '#page-3' || hash === '#game' || hash === '#survey') {
      showView('page3', false);
    } else if (hash === '#page-4' || hash === '#page4' || hash === '#cau-hoi-kien-thuc' || hash === '#quiz') {
      showView('page4', false);
    } else if (hash === '#page-5' || hash === '#page5' || hash === '#bai-dang-facebook' || hash === '#facebook') {
      showView('page5', false);
    } else if (hash === '#page-6' || hash === '#page6' || hash === '#nop-bai-thanh-cong' || hash === '#thanh-cong') {
      showView('page6', false);
    } else if (hash === '#homepage') {
      showView('homepage', false);
    } else {
      if (views.homepage) {
        showView('homepage', false);
      } else if (views.register) {
        showView('register', false);
      } else if (views.page3) {
        showView('page3', false);
      } else if (views.page4) {
        showView('page4', false);
      } else if (views.page5) {
        showView('page5', false);
      } else if (views.page6) {
        showView('page6', false);
      }
    }
  }

  window.addEventListener('hashchange', handleHashRoute);
  handleHashRoute();

  const STORAGE_KEY_ACCOUNTS = 'jnto_user_accounts';
  const STORAGE_KEY_CURRENT = 'jnto_current_player';

  function getAccounts() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error(e);
    }
    const defaultAccounts = [

    ];
    saveAccounts(defaultAccounts);
    return defaultAccounts;
  }

  function saveAccounts(accounts) {
    try {
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
    } catch (e) {
      console.error(e);
    }
  }

  function setCurrentPlayer(username) {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT, username);
    } catch (e) {
      console.error(e);
    }
    updatePlayerDisplay(username);
  }

  function getCurrentPlayer() {
    try {
      return localStorage.getItem(STORAGE_KEY_CURRENT) || 'Người chơi';
    } catch (e) {
      return 'Người chơi';
    }
  }

  function clearCurrentPlayer() {
    try {
      localStorage.removeItem(STORAGE_KEY_CURRENT);
    } catch (e) {
      console.error(e);
    }
    updatePlayerDisplay('Người chơi');
  }

  function updatePlayerDisplay(username) {
    const playerEl = document.getElementById('player-username');
    if (playerEl) {
      playerEl.textContent = username || 'Người chơi';
    }
  }

  updatePlayerDisplay(getCurrentPlayer());

  const authToast = document.getElementById('auth-toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer = null;

  if (authToast && authToast.parentElement !== document.body) {
    document.body.appendChild(authToast);
  }

  function showToast(message) {
    if (!authToast || !toastMessage) return;
    if (authToast.parentElement !== document.body) {
      document.body.appendChild(authToast);
    }
    toastMessage.textContent = message;
    authToast.classList.remove('hidden');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      authToast.classList.add('hidden');
    }, 2800);
  }

  function setupPasswordToggle(buttonId, inputId) {
    const btn = document.getElementById(buttonId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.style.opacity = isPassword ? '0.65' : '1';
    });
  }

  setupPasswordToggle('btn-toggle-register-pwd', 'register-password');
  setupPasswordToggle('btn-toggle-login-pwd', 'login-password');

  function setupCheckboxRow(rowId, checkboxId, iconContainerClass) {
    const row = document.getElementById(rowId);
    const checkbox = document.getElementById(checkboxId);
    if (!row || !checkbox) return;

    function renderState() {
      const iconWrap = row.querySelector('.' + iconContainerClass);
      if (!iconWrap) return;

      const imgPrefix = document.getElementById('view-homepage') ? '' : '../';
      if (checkbox.checked) {
        row.setAttribute('aria-checked', 'true');
        iconWrap.innerHTML = `
          <picture>
            <source media="(max-width: 768px)" srcset="${imgPrefix}img/img-mobile/page%202/Page2.1%20-%20%C4%91%C4%83ng%20k%C3%BD/icon-mark.webp">
            <img src="${imgPrefix}img/img-desktop/page 2/Page2.1 - Đăng ký/icon-mark.webp" alt="✓" class="checkbox-img">
          </picture>
        `;
      } else {
        row.setAttribute('aria-checked', 'false');
        iconWrap.innerHTML = `
          <picture>
            <source media="(max-width: 768px)" srcset="${imgPrefix}img/img-mobile/page%202/Page2.1%20-%20%C4%91%C4%83ng%20k%C3%BD/icon-checkpoint.webp">
            <img src="${imgPrefix}img/img-desktop/page 2/Page2.1 - Đăng ký/icon-checkpoint.webp" alt="" class="checkbox-img">
          </picture>
        `;
      }
    }

    row.addEventListener('click', (e) => {
      if (e.target.closest('#link-open-terms')) return;
      checkbox.checked = !checkbox.checked;
      renderState();
    });

    row.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        checkbox.checked = !checkbox.checked;
        renderState();
      }
    });

    renderState();
  }

  setupCheckboxRow('row-terms-1', 'check-terms-1', 'check-1-icon');
  setupCheckboxRow('row-terms-2', 'check-terms-2', 'check-2-icon');

  const siteLogoHome = document.getElementById('site-logo-home');
  if (siteLogoHome) {
    siteLogoHome.addEventListener('click', (e) => {
      e.preventDefault();
      showView('homepage');
    });
  }

  const btnOpenJoin = document.getElementById('btn-open-join');
  if (btnOpenJoin) {
    btnOpenJoin.addEventListener('click', () => {
      showView('register');
    });
  }

  const linkGoLogin = document.getElementById('link-go-login');
  if (linkGoLogin) {
    linkGoLogin.addEventListener('click', (e) => {
      e.preventDefault();
      showView('login');
    });
  }

  const linkGoRegister = document.getElementById('link-go-register');
  if (linkGoRegister) {
    linkGoRegister.addEventListener('click', (e) => {
      e.preventDefault();
      showView('register');
    });
  }

  const btnCloseRegisterError = document.getElementById('btn-close-register-error');
  const registerErrorBox = document.getElementById('register-error-box');
  if (btnCloseRegisterError && registerErrorBox) {
    btnCloseRegisterError.addEventListener('click', () => {
      registerErrorBox.classList.add('hidden');
    });
  }

  const btnCloseLoginError = document.getElementById('btn-close-login-error');
  const loginErrorBox = document.getElementById('login-error-box');
  if (btnCloseLoginError && loginErrorBox) {
    btnCloseLoginError.addEventListener('click', () => {
      loginErrorBox.classList.add('hidden');
    });
  }

  const registerForm = document.getElementById('register-form');
  const btnSubmitRegister = document.getElementById('btn-submit-register');
  const registerUsernameInput = document.getElementById('register-username');
  const registerPasswordInput = document.getElementById('register-password');
  const checkTerms1 = document.getElementById('check-terms-1');
  const checkTerms2 = document.getElementById('check-terms-2');

  function handleRegister() {
    const username = (registerUsernameInput ? registerUsernameInput.value.trim() : '');
    const password = (registerPasswordInput ? registerPasswordInput.value.trim() : '');

    if (!username) {
      showToast('Vui lòng nhập Tên đăng nhập.');
      if (registerUsernameInput) registerUsernameInput.focus();
      return;
    }

    if (!password) {
      showToast('Vui lòng nhập Mật khẩu.');
      if (registerPasswordInput) registerPasswordInput.focus();
      return;
    }

    if (!checkTerms1 || !checkTerms1.checked) {
      showToast('Vui lòng đọc và đồng ý với Điều kiện & Điều khoản để tiếp tục.');
      return;
    }

    if (!checkTerms2 || !checkTerms2.checked) {
      showToast('Vui lòng đồng ý cho Ban tổ chức sử dụng thông tin để liên hệ và trao giải.');
      return;
    }

    const accounts = getAccounts();
    const isDuplicate = accounts.some(
      (acc) => acc.username.toLowerCase() === username.toLowerCase()
    );

    if (isDuplicate) {
      if (registerErrorBox) {
        registerErrorBox.classList.remove('hidden');
        registerErrorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (registerErrorBox) {
      registerErrorBox.classList.add('hidden');
    }

    accounts.push({ username, password });
    saveAccounts(accounts);

    showToast('🎉 Đăng ký thành công! Đang chuyển sang trang Đăng nhập...');

    const loginUsernameInput = document.getElementById('login-username');
    if (loginUsernameInput) {
      loginUsernameInput.value = username;
    }

    if (registerForm) registerForm.reset();
    if (checkTerms1) checkTerms1.checked = false;
    if (checkTerms2) checkTerms2.checked = false;
    setupCheckboxRow('row-terms-1', 'check-terms-1', 'check-1-icon');
    setupCheckboxRow('row-terms-2', 'check-terms-2', 'check-2-icon');

    setTimeout(() => {
      showView('login');
      const loginPasswordInput = document.getElementById('login-password');
      if (loginPasswordInput) {
        loginPasswordInput.focus();
      }
    }, 700);
  }

  if (btnSubmitRegister) {
    btnSubmitRegister.addEventListener('click', handleRegister);
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleRegister();
    });
  }

  const loginForm = document.getElementById('login-form');
  const btnSubmitLogin = document.getElementById('btn-submit-login');
  const loginUsernameInput = document.getElementById('login-username');
  const loginPasswordInput = document.getElementById('login-password');

  function handleLogin() {
    const username = (loginUsernameInput ? loginUsernameInput.value.trim() : '');
    const password = (loginPasswordInput ? loginPasswordInput.value.trim() : '');

    if (!username) {
      showToast('Vui lòng nhập Tên đăng nhập.');
      if (loginUsernameInput) loginUsernameInput.focus();
      return;
    }

    if (!password) {
      showToast('Vui lòng nhập Mật khẩu.');
      if (loginPasswordInput) loginPasswordInput.focus();
      return;
    }

    const accounts = getAccounts();
    const matchedAccount = accounts.find(
      (acc) => acc.username.toLowerCase() === username.toLowerCase() && acc.password === password
    );

    if (!matchedAccount) {
      if (loginErrorBox) {
        loginErrorBox.classList.remove('hidden');
        loginErrorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (loginErrorBox) {
      loginErrorBox.classList.add('hidden');
    }

    setCurrentPlayer(matchedAccount.username);
    showToast(`✨ Chào mừng ${matchedAccount.username} đã đăng nhập thành công!`);

    if (loginPasswordInput) {
      loginPasswordInput.value = '';
    }

    setTimeout(() => {
      showView('page3');
    }, 500);
  }

  if (btnSubmitLogin) {
    btnSubmitLogin.addEventListener('click', handleLogin);
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleLogin();
    });
  }

  const STORAGE_KEY_SURVEY = 'jnto_survey_responses';

  function setupOtherInput(inputId, radioOrCheckboxSelector) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const targetOption = document.querySelector(radioOrCheckboxSelector);
    if (!targetOption) return;

    input.addEventListener('focus', () => {
      targetOption.checked = true;
    });

    input.addEventListener('input', () => {
      targetOption.checked = true;
    });
  }

  setupOtherInput('q2-khac-text', 'input[name="q2_khuvuc"][value="khac"]');
  setupOtherInput('q4-2a-khac-text', 'input[name="q4_quantam"][value="Khác"]');
  setupOtherInput('q6-2a-khac-text', 'input[name="q6_thongtin_2a"][value="Khác"]');
  setupOtherInput('q4-2b-khac-text', 'input[name="q4_datungden"][value="Khác"]');
  setupOtherInput('q5-2b-khac-text', 'input[name="q5_muondi"][value="Khác"]');
  setupOtherInput('q7-2b-khac-text', 'input[name="q7_thongtin_2b"][value="Khác"]');

  const btnSurvey31Next = document.getElementById('btn-survey-3-1-next');
  if (btnSurvey31Next) {
    btnSurvey31Next.addEventListener('click', () => {
      const q1 = document.querySelector('input[name="q1_tuoi"]:checked');
      if (!q1) {
        showToast('Vui lòng chọn Độ tuổi của bạn (Câu 1).');
        return;
      }

      const q2 = document.querySelector('input[name="q2_khuvuc"]:checked');
      if (!q2) {
        showToast('Vui lòng chọn Khu vực sinh sống (Câu 2).');
        return;
      }

      const q3 = document.querySelector('input[name="q3_kinhnghiem"]:checked');
      if (!q3) {
        showToast('Vui lòng chọn Kinh nghiệm du lịch Nhật Bản (Câu 3).');
        return;
      }

      const currentAnswers = {
        q1_tuoi: q1.value,
        q2_khuvuc: q2.value === 'khac' ? `Khác: ${(document.getElementById('q2-khac-text')?.value || '').trim()}` : q2.value,
        q3_kinhnghiem: q3.value
      };
      try {
        localStorage.setItem(STORAGE_KEY_SURVEY, JSON.stringify(currentAnswers));
      } catch (e) {
        console.error(e);
      }

      if (q3.value === 'da-tung-di-muon-lai' || q3.value === 'da-tung-di-chua-ke-hoach') {
        showView('page3_2b');
      } else {
        showView('page3_2a');
      }
    });
  }

  const btnSurvey32aSubmit = document.getElementById('btn-survey-3-2a-submit');
  if (btnSurvey32aSubmit) {
    btnSurvey32aSubmit.addEventListener('click', () => {
      const q4Checked = Array.from(document.querySelectorAll('input[name="q4_quantam"]:checked')).map(el => {
        if (el.value === 'Khác') {
          return `Khác: ${(document.getElementById('q4-2a-khac-text')?.value || '').trim()}`;
        }
        return el.value;
      });

      if (q4Checked.length === 0) {
        showToast('Vui lòng chọn ít nhất một vùng bạn quan tâm (Câu 4).');
        return;
      }

      const q5 = document.querySelector('input[name="q5_hinhthuc_2a"]:checked');
      if (!q5) {
        showToast('Vui lòng chọn hình thức du lịch mong muốn (Câu 5).');
        return;
      }

      const q6Checked = Array.from(document.querySelectorAll('input[name="q6_thongtin_2a"]:checked')).map(el => {
        if (el.value === 'Khác') {
          return `Khác: ${(document.getElementById('q6-2a-khac-text')?.value || '').trim()}`;
        }
        return el.value;
      });

      if (q6Checked.length === 0) {
        showToast('Vui lòng chọn nguồn thông tin bạn thường tìm hiểu (Câu 6).');
        return;
      }

      try {
        const prev = JSON.parse(localStorage.getItem(STORAGE_KEY_SURVEY) || '{}');
        const finalResults = {
          ...prev,
          branch: '3.2.a (Chưa từng đi)',
          q4_quantam: q4Checked,
          q5_hinhthuc: q5.value,
          q6_thongtin: q6Checked,
          submittedAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY_SURVEY, JSON.stringify(finalResults));
      } catch (e) {
        console.error(e);
      }

      showToast('🎉 Nộp bài khảo sát thành công! Cảm ơn bạn đã tham gia.');
      setTimeout(() => {
        openModal('modal-survey-success');
      }, 700);
    });
  }

  const btnSurvey32bSubmit = document.getElementById('btn-survey-3-2b-submit');
  if (btnSurvey32bSubmit) {
    btnSurvey32bSubmit.addEventListener('click', () => {
      const q4Checked = Array.from(document.querySelectorAll('input[name="q4_datungden"]:checked')).map(el => {
        if (el.value === 'Khác') {
          return `Khác: ${(document.getElementById('q4-2b-khac-text')?.value || '').trim()}`;
        }
        return el.value;
      });

      if (q4Checked.length === 0) {
        showToast('Vui lòng chọn vùng bạn đã từng đến (Câu 4).');
        return;
      }

      const q5Checked = Array.from(document.querySelectorAll('input[name="q5_muondi"]:checked')).map(el => {
        if (el.value === 'Khác') {
          return `Khác: ${(document.getElementById('q5-2b-khac-text')?.value || '').trim()}`;
        }
        return el.value;
      });

      if (q5Checked.length === 0) {
        showToast('Vui lòng chọn vùng bạn muốn đi trong tương lai (Câu 5).');
        return;
      }

      const q6 = document.querySelector('input[name="q6_hinhthuc_2b"]:checked');
      if (!q6) {
        showToast('Vui lòng chọn hình thức du lịch mong muốn (Câu 6).');
        return;
      }

      const q7Checked = Array.from(document.querySelectorAll('input[name="q7_thongtin_2b"]:checked')).map(el => {
        if (el.value === 'Khác') {
          return `Khác: ${(document.getElementById('q7-2b-khac-text')?.value || '').trim()}`;
        }
        return el.value;
      });

      if (q7Checked.length === 0) {
        showToast('Vui lòng chọn nguồn thông tin bạn thường tìm hiểu (Câu 7).');
        return;
      }

      try {
        const prev = JSON.parse(localStorage.getItem(STORAGE_KEY_SURVEY) || '{}');
        const finalResults = {
          ...prev,
          branch: '3.2.b (Đã từng đi)',
          q4_datungden: q4Checked,
          q5_muondi: q5Checked,
          q6_hinhthuc: q6.value,
          q7_thongtin: q7Checked,
          submittedAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY_SURVEY, JSON.stringify(finalResults));
      } catch (e) {
        console.error(e);
      }

      showToast('🎉 Nộp bài khảo sát thành công! Cảm ơn bạn đã tham gia.');
      setTimeout(() => {
        openModal('modal-survey-success');
      }, 700);
    });
  }

  const btnSurveyToHome = document.getElementById('btn-survey-to-home');
  const btnSurveyToQuiz = document.getElementById('btn-survey-to-quiz');

  if (btnSurveyToHome) {
    btnSurveyToHome.addEventListener('click', () => {
      closeModal('modal-survey-success');
      showView('homepage');
    });
  }

  if (btnSurveyToQuiz) {
    btnSurveyToQuiz.addEventListener('click', () => {
      closeModal('modal-survey-success');
      showView('page4');
    });
  }

  const btnQuizSubmit = document.getElementById('btn-quiz-submit');
  if (btnQuizSubmit) {
    btnQuizSubmit.addEventListener('click', () => {
      const q1 = document.querySelector('input[name="quiz_mc_q1"]:checked');
      if (!q1) {
        showToast('Vui lòng chọn câu trả lời cho Câu 1 (Trắc nghiệm).');
        return;
      }

      const q2 = document.querySelector('input[name="quiz_mc_q2"]:checked');
      if (!q2) {
        showToast('Vui lòng chọn câu trả lời cho Câu 2 (Trắc nghiệm).');
        return;
      }

      const q3 = document.querySelector('input[name="quiz_mc_q3"]:checked');
      if (!q3) {
        showToast('Vui lòng chọn câu trả lời cho Câu 3 (Trắc nghiệm).');
        return;
      }

      const essay1 = (document.getElementById('quiz-essay-q1')?.value || '').trim();
      if (!essay1) {
        showToast('Vui lòng nhập câu trả lời cho Câu 1 (Tự luận).');
        document.getElementById('quiz-essay-q1')?.focus();
        return;
      }

      const essay2 = (document.getElementById('quiz-essay-q2')?.value || '').trim();
      if (!essay2) {
        showToast('Vui lòng nhập câu trả lời cho Câu 2 (Tự luận).');
        document.getElementById('quiz-essay-q2')?.focus();
        return;
      }

      try {
        const quizData = {
          q1_niseko: q1.value,
          q2_itsukushima: q2.value,
          q3_kintaikyo: q3.value,
          essay1_sapporo: essay1,
          essay2_okayama: essay2,
          submittedAt: new Date().toISOString()
        };
        localStorage.setItem('jnto_knowledge_quiz', JSON.stringify(quizData));
      } catch (e) {
        console.error(e);
      }

      showToast('🎉 Nộp bài thành công! Đang chuyển sang phần Bài Đăng Facebook...');
      setTimeout(() => {
        showView('page5');
      }, 1500);
    });
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');

    const remainingActive = document.querySelectorAll('.modal-backdrop.active');
    if (remainingActive.length === 0) {
      document.body.style.overflow = '';
    }
  }

  document.querySelectorAll('[data-close-modal]').forEach((button) => {
    button.addEventListener('click', () => {
      const modalId = button.getAttribute('data-close-modal');
      closeModal(modalId);
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop.id);
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-backdrop.active');
      if (activeModal) {
        closeModal(activeModal.id);
      }
    }
  });

  const btnOpenRules = document.getElementById('btn-open-rules');
  const btnRulesToJoin = document.getElementById('btn-rules-to-join');
  const linkOpenTerms = document.getElementById('link-open-terms');

  if (btnOpenRules) {
    btnOpenRules.addEventListener('click', () => openModal('modal-rules'));
  }

  if (linkOpenTerms) {
    linkOpenTerms.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('modal-rules');
    });
  }

  if (btnRulesToJoin) {
    btnRulesToJoin.addEventListener('click', () => {
      closeModal('modal-rules');
      showView('register');
    });
  }

  const btnOpenPrivacy = document.getElementById('btn-open-privacy');
  const btnOpenCookie = document.getElementById('btn-open-cookie');
  const policyPrivacy = document.getElementById('policy-content-privacy');
  const policyCookie = document.getElementById('policy-content-cookie');

  if (btnOpenPrivacy) {
    btnOpenPrivacy.addEventListener('click', () => {
      if (policyPrivacy) policyPrivacy.classList.remove('hidden');
      if (policyCookie) policyCookie.classList.add('hidden');
      openModal('modal-policy');
    });
  }

  if (btnOpenCookie) {
    btnOpenCookie.addEventListener('click', () => {
      if (policyPrivacy) policyPrivacy.classList.add('hidden');
      if (policyCookie) policyCookie.classList.remove('hidden');
      openModal('modal-policy');
    });
  }

  const btnCopyHashtag = document.getElementById('btn-copy-hashtag');
  const fbHashtagBox = document.getElementById('fb-hashtag-box');
  const fbHashtagText = document.getElementById('fb-hashtag-text');

  function copyHashtagToClipboard() {
    const textToCopy = (fbHashtagText?.innerText || '#visitJP_Chugoku #visitJP_Hokkaido #nhatban_vedepvotan').trim();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('📋 Đã sao chép hashtag vào bộ nhớ tạm!');
      }).catch(() => {
        fallbackCopyText(textToCopy);
      });
    } else {
      fallbackCopyText(textToCopy);
    }
  }

  function fallbackCopyText(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast('📋 Đã sao chép hashtag vào bộ nhớ tạm!');
    } catch (err) {
      showToast('Vui lòng bôi đen và nhấn Ctrl+C để sao chép hashtag.');
    }
    document.body.removeChild(textarea);
  }

  if (btnCopyHashtag) {
    btnCopyHashtag.addEventListener('click', (e) => {
      e.stopPropagation();
      copyHashtagToClipboard();
    });
  }

  if (fbHashtagBox) {
    fbHashtagBox.addEventListener('click', () => {
      copyHashtagToClipboard();
    });
  }

  const btnFbSubmit = document.getElementById('btn-fb-submit');
  const inputFbLink = document.getElementById('fb-post-url');
  const formFbSubmission = document.getElementById('form-fb-submission');
  const btnFbToHome = document.getElementById('btn-fb-to-home');

  function handleFbSubmission(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const link = (inputFbLink?.value || '').trim();
    if (link) {
      try {
        const fbData = {
          postUrl: link,
          submittedAt: new Date().toISOString()
        };
        localStorage.setItem('jnto_facebook_submission', JSON.stringify(fbData));
      } catch (err) {
        console.error(err);
      }
    }

    showToast('🎉 Nộp bài dự thi Facebook thành công!');
    showView('page6');
  }
  window.handleFbSubmission = handleFbSubmission;

  if (btnFbSubmit) {
    btnFbSubmit.addEventListener('click', handleFbSubmission);
  }

  if (formFbSubmission) {
    formFbSubmission.addEventListener('submit', handleFbSubmission);
  }

  if (btnFbToHome) {
    btnFbToHome.addEventListener('click', () => {
      closeModal('modal-fb-success');
      showView('homepage');
    });
  }

  const btnP6Home = document.getElementById('btn-p6-home');
  if (btnP6Home) {
    btnP6Home.addEventListener('click', () => {
      showView('homepage');
    });
  }
});
