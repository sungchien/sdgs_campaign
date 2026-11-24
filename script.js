/**
 * ==========================================================================
 * 《格外美好》生活倡議專案 — 互動腳本 (script.js)
 * 對應架構：index.html & style.css (SDG 12.3 格外品剩食搶救行動)
 * 技術規範：純原生 Vanilla JavaScript (ES6+)，無第三方相依套件
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ------------------------------------------------------------------------
     0. 全域常數與本機儲存鍵值設定
     ------------------------------------------------------------------------ */
  const CONFIG = {
    BASE_SUPPORTER_COUNT: 1248,
    STORAGE_KEY_PLEDGED: 'sdgs_pledged',
    STORAGE_KEY_COUNT: 'sdgs_supporter_count',
    STORAGE_KEY_USER: 'sdgs_pledged_user',
    COUPON_CODE: 'UGLYWOOD85',
    THANK_YOU_TITLE: '感謝你！永續倡議者',
    THANK_YOU_MESSAGE:
      '你的承諾已成功加入倡議！我們已將格外品選購地圖與專屬小農優惠碼發送至你的信箱。'
  };

  /* ------------------------------------------------------------------------
     1. 取得頁面核心 DOM 元件（防禦性選取）
     ------------------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const navAnchors = document.querySelectorAll('#navbar a[href^="#"]');

  const btnMicroCta = document.getElementById('btn-micro-cta');
  const quizFeedback = document.getElementById('quiz-feedback');
  const problemSection = document.getElementById('problem');

  const btnEngagementCta = document.getElementById('btn-engagement-cta');
  const recipeFeedback = document.getElementById('recipe-feedback');

  const pledgeForm = document.getElementById('pledge-form');
  const userNameInput = document.getElementById('user-name');
  const userRoleSelect = document.getElementById('user-role');
  const pledgeCheckbox = document.getElementById('pledge-check');
  const submitBtn = pledgeForm ? pledgeForm.querySelector('.btn-cta') : null;
  const formMessage = document.getElementById('form-message');

  const counterEl = document.getElementById('counter');
  const pledgeWall = document.getElementById('pledge-wall');

  /* ------------------------------------------------------------------------
     2. 共用工具函式 (Utility Helpers)
     ------------------------------------------------------------------------ */

  /**
   * 格式化千分位數字（例如：1248 -> "1,248"）
   * @param {number} num
   * @returns {string}
   */
  const formatNumber = (num) => Number(num).toLocaleString('en-US');

  /**
   * 安全讀取 localStorage 中的累計支持者人數
   * @returns {number}
   */
  const getCurrentCount = () => {
    try {
      const savedCount = localStorage.getItem(CONFIG.STORAGE_KEY_COUNT);
      const parsed = savedCount ? parseInt(savedCount, 10) : NaN;
      return !Number.isNaN(parsed) && parsed >= CONFIG.BASE_SUPPORTER_COUNT
        ? parsed
        : CONFIG.BASE_SUPPORTER_COUNT;
    } catch (error) {
      return CONFIG.BASE_SUPPORTER_COUNT;
    }
  };

  /**
   * 使用原生 Web Animations API 觸發元素強調跳動動畫（無須操作內嵌樣式）
   * @param {HTMLElement | null} element
   */
  const triggerHighlightPulse = (element) => {
    if (!element || typeof element.animate !== 'function') return;
    element.animate(
      [
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(1.12)', opacity: 0.85 },
        { transform: 'scale(1)', opacity: 1 }
      ],
      {
        duration: 480,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
      }
    );
  };

  /**
   * 計算固定導覽列高度並執行平滑位移滾動
   * @param {string} targetSelector
   */
  const smoothScrollWithOffset = (targetSelector) => {
    if (!targetSelector || targetSelector === '#') return;
    const targetEl = document.querySelector(targetSelector);
    if (!targetEl) return;

    const navbarHeight = navbar ? navbar.offsetHeight : 0;
    const extraSpacing = 16;
    const targetTop =
      targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight - extraSpacing;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: 'smooth'
    });
  };

  /* ------------------------------------------------------------------------
     3. 模組一：平滑錨點滾動導航與行動版漢堡選單
     ------------------------------------------------------------------------ */
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navLinks.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  if (navAnchors.length > 0) {
    navAnchors.forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        const href = anchor.getAttribute('href');
        if (!href || !href.startsWith('#')) return;

        const targetEl = document.querySelector(href);
        if (!targetEl) return;

        event.preventDefault();

        // 若行動版選單處於展開狀態，點擊連結後自動收合
        if (navLinks && navLinks.classList.contains('is-open')) {
          navLinks.classList.remove('is-open', 'active');
          if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'false');
          }
        }

        smoothScrollWithOffset(href);
      });
    });
  }

  /* ------------------------------------------------------------------------
     4. 模組二：第一階微行動（Micro-CTA）與第二階體驗行動互動
     ------------------------------------------------------------------------ */
  if (btnMicroCta) {
    btnMicroCta.addEventListener('click', () => {
      // 在 Hero 區顯示外宿蔬果赤字評估結果
      if (quizFeedback) {
        quizFeedback.innerHTML =
          '<strong>【外宿蔬果赤字計算結果】</strong>以每週外食 14 餐估算，外宿生平均每日膳食纖維攝取不足 <strong>42%</strong>！改用格外品蔬果開伙，每月可現省 <strong>$1,200 元</strong>並減少 <strong>18 公斤碳排</strong>。';
        quizFeedback.hidden = false;
        triggerHighlightPulse(quizFeedback);
      }

      // 平滑滾動至痛點數據錨點區並突顯數據卡片
      if (problemSection) {
        smoothScrollWithOffset('#problem');
        const dataGrid = problemSection.querySelector('.data-cards-grid');
        window.setTimeout(() => {
          triggerHighlightPulse(dataGrid);
        }, 450);
      }
    });
  }

  if (btnEngagementCta && recipeFeedback) {
    btnEngagementCta.addEventListener('click', () => {
      recipeFeedback.innerHTML =
        '<strong>已解鎖《快煮鍋 15 分鐘格外品深夜食譜》：</strong>① 微瑕牛番茄滑蛋豆腐煲 ② 彎曲小黃瓜蒜香雞胸拌麵 ③ 雙腳紅蘿蔔濃湯燉飯。快到下方簽署公約領取小農食材優惠碼！';
      recipeFeedback.hidden = false;
      triggerHighlightPulse(recipeFeedback);
    });
  }

  /* ------------------------------------------------------------------------
     5. 模組三 & 四：倡議承諾表單驗證、計數器即時連動與 LocalStorage 記憶
     ------------------------------------------------------------------------ */

  /**
   * 將按鈕切換為「已簽署」的連貫記憶狀態
   */
  const applyPledgedButtonState = () => {
    if (!submitBtn) return;
    submitBtn.textContent = '已簽署！感謝您的支持';
    submitBtn.classList.add('is-pledged');
    submitBtn.setAttribute('aria-label', '已完成外宿採購公約簽署，感謝您的支持');
  };

  /**
   * 顯示表單回饋訊息卡片（成功或錯誤提示）
   * @param {'success' | 'error'} type
   * @param {string} title
   * @param {string} bodyText
   * @param {boolean} includeCoupon
   */
  const renderFormFeedback = (type, title, bodyText, includeCoupon = false) => {
    if (!formMessage) return;

    formMessage.classList.remove('is-success', 'is-error');
    formMessage.classList.add(type === 'success' ? 'is-success' : 'is-error');

    // 清空既有內容並安全建立 DOM 節點
    formMessage.textContent = '';

    const titleEl = document.createElement('strong');
    titleEl.textContent = title;
    formMessage.appendChild(titleEl);

    const descEl = document.createElement('p');
    descEl.textContent = bodyText;
    formMessage.appendChild(descEl);

    if (includeCoupon) {
      const couponEl = document.createElement('p');
      couponEl.textContent = `專屬合作小農 85 折優惠碼：【 ${CONFIG.COUPON_CODE} 】`;
      formMessage.appendChild(couponEl);
    }

    formMessage.hidden = false;
    triggerHighlightPulse(formMessage);
  };

  /**
   * 建立新加入倡議者的精緻單線條 SVG 肖像頭像容器（微捲短髮＋丹寧翻領外套＋嫩芽胸針）
   * @returns {HTMLDivElement}
   */
  const createSingleLineAvatar = () => {
    const svgNs = 'http://www.w3.org/2000/svg';
    const avatarWrap = document.createElement('div');
    avatarWrap.className = 'author-avatar author-avatar-mint';
    avatarWrap.setAttribute('aria-hidden', 'true');

    const svg = document.createElementNS(svgNs, 'svg');
    svg.setAttribute('class', 'author-portrait-svg');
    svg.setAttribute('viewBox', '0 0 80 80');

    const strokes = [
      {
        cls: 'portrait-line',
        d: 'M40,13 C25,13 18.5,24 20.5,38 C21,42 22,45 24,47'
      },
      {
        cls: 'portrait-line',
        d: 'M40,13 C55,13 61.5,24 59.5,38 C59,42 58,45 56,47'
      },
      {
        cls: 'portrait-line',
        d: 'M40,16 Q33,24 25.5,32.5 M40,16 Q47,24 54.5,32.5'
      },
      {
        cls: 'portrait-line',
        d: 'M25.5,33 C25.5,43 32,51.5 40,51.5 C48,51.5 54.5,43 54.5,33'
      },
      {
        cls: 'portrait-line-soft',
        d: 'M29.5,31 Q33,29.5 36.5,31 M43.5,31 Q47,29.5 50.5,31'
      },
      {
        cls: 'portrait-line',
        d: 'M30,36 Q33,34 36,36 M44,36 Q47,34 50,36'
      },
      {
        cls: 'portrait-line-soft',
        d: 'M40,36 L39.2,42.2 Q40.2,43.2 41.4,42.4'
      },
      {
        cls: 'portrait-line',
        d: 'M35.5,45.8 Q40,48.8 44.5,45.8'
      },
      {
        cls: 'portrait-line',
        d: 'M35,50 L34.5,59 M45,50 L45.5,59'
      },
      {
        cls: 'portrait-line',
        d: 'M12,82 C14,66 23.5,60 32,58.8 L28.5,67.5 L35.5,69.5 L38,82'
      },
      {
        cls: 'portrait-line',
        d: 'M68,82 C66,66 56.5,60 48,58.8 L51.5,67.5 L44.5,69.5 L42,82'
      },
      {
        cls: 'portrait-line-soft',
        d: 'M34.5,59.5 Q40,63.5 45.5,59.5'
      },
      {
        cls: 'portrait-accent',
        d: 'M49,69.5 Q53,65 56.5,66.5 Q54.5,70.5 49,69.5'
      }
    ];

    strokes.forEach(({ cls, d }) => {
      const path = document.createElementNS(svgNs, 'path');
      path.setAttribute('class', cls);
      path.setAttribute('d', d);
      svg.appendChild(path);
    });

    avatarWrap.appendChild(svg);
    return avatarWrap;
  };

  /**
   * 將新簽署者的聲援卡片動態加入承諾牆頂端
   * @param {string} name
   * @param {string} role
   */
  const prependSupporterCard = (name, role) => {
    if (!pledgeWall) return;

    const article = document.createElement('article');
    article.className = 'testimonial-card';

    const quote = document.createElement('p');
    quote.className = 'testimonial-quote';
    quote.textContent = `「我已正式簽署《外宿生格外品友善採購公約》！從今天起用實際行動支持台灣小農格外品，省荷包又為地球減少剩食碳排！」`;

    const footer = document.createElement('footer');
    footer.className = 'testimonial-author';

    const meta = document.createElement('div');
    meta.className = 'author-meta';

    const strongName = document.createElement('strong');
    strongName.className = 'author-name';
    strongName.textContent = `${name}（新加入倡議者）`;

    const spanDept = document.createElement('span');
    spanDept.className = 'author-dept';
    spanDept.textContent = role;

    meta.appendChild(strongName);
    meta.appendChild(spanDept);
    footer.appendChild(createSingleLineAvatar());
    footer.appendChild(meta);
    article.appendChild(quote);
    article.appendChild(footer);

    pledgeWall.prepend(article);
    triggerHighlightPulse(article);
  };

  // 頁面載入時：初始化計數器並檢查本機簽署狀態記憶
  let currentSupporters = getCurrentCount();
  if (counterEl) {
    counterEl.textContent = formatNumber(currentSupporters);
  }

  try {
    const hasPledged = localStorage.getItem(CONFIG.STORAGE_KEY_PLEDGED) === 'true';
    if (hasPledged) {
      applyPledgedButtonState();
      const savedUser = localStorage.getItem(CONFIG.STORAGE_KEY_USER);
      if (savedUser && formMessage) {
        renderFormFeedback(
          'success',
          `歡迎回來，${savedUser}！`,
          '你已完成《外宿生格外品友善採購公約》簽署，可隨時使用下方專屬優惠碼向合作小農訂購。',
          true
        );
      }
    }
  } catch (error) {
    // 忽略無痕模式或禁用 localStorage 時的存取限制
  }

  // 監聽承諾表單提交事件
  if (pledgeForm) {
    pledgeForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const rawName = userNameInput ? userNameInput.value.trim() : '';
      const selectedRole = userRoleSelect
        ? userRoleSelect.value
        : '校外租屋青年與惜食夥伴';
      const isChecked = pledgeCheckbox ? pledgeCheckbox.checked : false;

      // 驗證 1：檢查暱稱是否填寫
      if (!rawName) {
        renderFormFeedback(
          'error',
          '請輸入你的暱稱',
          '填寫你的稱謂或外宿暱稱，即可加入惜食承諾牆並領取優惠碼！'
        );
        if (userNameInput) userNameInput.focus();
        return;
      }

      // 驗證 2：檢查承諾勾選框是否已勾選
      if (!isChecked) {
        renderFormFeedback(
          'error',
          '請勾選同意採購公約',
          '請先勾選上方承諾方塊，確認願意優先選購營養價值 100% 相同的格外品蔬果。'
        );
        if (pledgeCheckbox) pledgeCheckbox.focus();
        return;
      }

      // 驗證通過：計數器加 1 並觸發數字跳動動畫
      currentSupporters += 1;
      if (counterEl) {
        counterEl.textContent = formatNumber(currentSupporters);
        triggerHighlightPulse(counterEl);
      }

      // 顯示專屬感謝對話卡片與優惠碼
      renderFormFeedback(
        'success',
        CONFIG.THANK_YOU_TITLE,
        CONFIG.THANK_YOU_MESSAGE,
        true
      );

      // 將支持者動態加入承諾牆
      prependSupporterCard(rawName, selectedRole);

      // 寫入本機狀態記憶 (localStorage)
      try {
        localStorage.setItem(CONFIG.STORAGE_KEY_PLEDGED, 'true');
        localStorage.setItem(CONFIG.STORAGE_KEY_COUNT, String(currentSupporters));
        localStorage.setItem(CONFIG.STORAGE_KEY_USER, rawName);
      } catch (error) {
        // 忽略瀏覽器隱私模式寫入限制
      }

      // 重設表單欄位並更新按鈕為已簽署狀態
      pledgeForm.reset();
      applyPledgedButtonState();
    });
  }
});