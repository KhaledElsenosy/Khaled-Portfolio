/* jshint esversion: 6 */
'use strict';

/* Stars background - reactive to mouse move */
(function () {
  const canvas = document.getElementById('star-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  const STAR_COUNT = 260;
  const stars = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function initStars() {
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        baseX: 0,
        baseY: 0,
        radius: randomBetween(0.3, 2.2),
        alpha: randomBetween(0.2, 1),
        speed: randomBetween(0.008, 0.025),   // twinkle speed
        depth: randomBetween(0.5, 3),          // parallax depth (higher = more movement)
        twinkleOffset: Math.random() * Math.PI * 2,
        color: pickStarColor(),
      });
      stars[i].baseX = stars[i].x;
      stars[i].baseY = stars[i].y;
    }
  }

  function pickStarColor() {
    const colors = ['#ffffff', '#c7d2fe', '#a5b4fc', '#e879f9', '#67e8f9', '#fde68a'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  let tick = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Smooth follow mouse
    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    tick++;

    stars.forEach(s => {
      // Parallax offset based on mouse position
      const offsetX = ((targetX / W) - 0.5) * s.depth * 60;
      const offsetY = ((targetY / H) - 0.5) * s.depth * 60;

      const px = s.baseX + offsetX;
      const py = s.baseY + offsetY;

      // Twinkle
      const twinkle = 0.5 + 0.5 * Math.sin(tick * s.speed + s.twinkleOffset);
      const alpha = s.alpha * (0.4 + 0.6 * twinkle);

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(px, py, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.fill();

      // Glow for brighter stars
      if (s.radius > 1.4 && twinkle > 0.7) {
        ctx.globalAlpha = alpha * 0.35;
        ctx.beginPath();
        ctx.arc(px, py, s.radius * 3, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(px, py, 0, px, py, s.radius * 3);
        grad.addColorStop(0, s.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fill();
      }

      ctx.restore();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
  window.addEventListener('resize', () => { resize(); initStars(); });

  resize();
  initStars();
  draw();
})();

/* Typewriter effect for roles */
(function () {
  const el = document.getElementById('typed');
  if (!el) return;

  const roles = [
    'Data Analytics Expert',
    'Flutter Developer',
    'Custom Software Developer',
    'Desktop App Specialist',
    'Website Architect',
    'Automation Engineer'
  ];

  let ri = 0, ci = 0, deleting = false;

  function type() {
    const current = roles[ri];
    if (!deleting) {
      el.textContent = current.slice(0, ++ci);
      if (ci === current.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      el.textContent = current.slice(0, --ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(type, deleting ? 55 : 95);
  }
  type();
})();

/* Nav scroll and active link toggle */
(function () {
  const nav = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);

    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  });

  // Hamburger Menu Toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
    });

    // Close menu when a link is clicked
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
  }

  // Multi-language logic
  const langBtn = document.getElementById('lang-switch');
  const translations = {
    en: {
      navHome: 'Home', navAbout: 'About', navSkills: 'Skills', navProjects: 'Projects', navContact: 'Contact',
      heroGreeting: "Hello, I'm", heroName: "Khaled", heroNameAccent: "El-Senoussi",
      heroSubtitle: "I build high-quality software experiences, specializing in Data Analytics, Custom Software, Desktop Apps, Websites, and Automations for 3+ years.",
      viewWork: "View My Work", getInTouch: "Get In Touch",
      statYears: "Years Exp", statProjects: "Projects", statClients: "Clients",
      aboutTag: "Who I Am", aboutTitle: "About Me",
      aboutP1: "I'm a passionate <strong>Software Developer</strong> and <strong>Data Analytics Expert</strong> with over 3 years of experience. I specialize in crafting elegant solutions for data analytics, custom software, desktop applications, websites, and process automations.",
      aboutP2: "From enterprise-grade HR systems to interactive web platforms, I bring a blend of technical depth and creative vision to every project. I thrive in fast-paced environments where innovation and performance matter.",
      aboutP3: "When I'm not coding, I'm exploring open-source projects, learning new frameworks, and contributing to the developer community.",
      edu: "Education", eduVal: "B.Sc. Computer Science",
      loc: "Location", locVal: "Available Worldwide",
      exp: "Experience", expVal: "3+ Years Professional",
      foc: "Focus", focVal: "Software, Analytics & Websites",
      skillsTag: "What I Know", skillsTitle: "My Skills",
      frontend: "Frontend", backend: "Backend", tools: "Tools & More",
      projectsTag: "What I've Built", projectsTitle: "Featured Projects",
      liveDemo: "Live Demo", dashboardBtn: "Dashboard", processBtn: "Process",
      hrTitle: "HR Management System",
      hrDesc: "A full-featured enterprise HR system with employee management, payroll reports, attendance tracking, and role-based authentication.",
      dashTitle: "Real-time Dashboard",
      dashDesc: "An analytics dashboard with live data streaming, interactive charts, and user management, built with React and Firebase.",
      lumTitle: "Luminary AI Studio",
      lumDesc: "A state-of-the-art AI image generation studio that transforms text prompts into stunning visual art using advanced machine learning models.",
      portTitle: "Portfolio Website",
      portDesc: "This very portfolio — designed from scratch with parallax star animations, glassmorphism, and advanced CSS/JS interactions.",
      proj5Title: "Global Layoffs & Job Market Intelligence",
      proj5Desc: "A comprehensive Power BI dashboard analyzing global layoff trends, market impacts, and industry-wise job intelligence with interactive data visualizations.",
      proj6Title: "Global YouTube Statistics",
      proj6Desc: "A data-driven analysis using Jupyter Notebook to extract insights and future predictions for YouTube channels globally. Includes data cleaning, EDA, and predictive machine learning models.",
      projectsNote: "Many of my professional projects are protected by Non-Disclosure Agreements (NDAs) and cannot be displayed publicly. Feel free to contact me for a detailed discussion of my professional experience.",
      contactTag: "Let's Talk", contactTitle: "Get In Touch",
      contactP: "I'm always open to new opportunities, collaborations, or just a friendly chat about technology. Feel free to reach out!",
      formName: "Your Name", formEmail: "Your Email", formMsg: "Your Message", sendBtn: "Send Message 🚀",
      footerDesc: "© 2026 Khaled El-Senoussi. Built with passion & pixels.",
    },
    ar: {
      navHome: 'الرئيسية', navAbout: 'عني', navSkills: 'مهاراتي', navProjects: 'مشاريعي', navContact: 'اتصل بي',
      heroGreeting: "أهلاً، أنا", heroName: "خالد", heroNameAccent: "السنوسي",
      heroSubtitle: "أقوم ببناء برامج مخصصه عالية الجودة، متخصص في تحليل البيانات، تطبيقات سطح المكتب، المواقع الإلكترونية، والأتمتة لأكثر من 3 سنوات.",
      viewWork: "عرض أعمالي", getInTouch: "تواصل معي",
      statYears: "سنوات خبرة", statProjects: "مشروع", statClients: "عميل",
      aboutTag: "من أنا", aboutTitle: "عن <span class='accent'>نفسي</span>",
      aboutP1: "أنا <strong>مطور برمجيات</strong> و <strong>خبير في تحليل البيانات</strong> شغوف بخبرة تزيد عن 3 سنوات. أتخصص في صياغة حلول مبتكرة لتحليل البيانات، البرمجيات المخصصة، تطبيقات سطح المكتب، المواقع الإلكترونية، وأتمتة العمليات.",
      aboutP2: "من تطوير أنظمة الموارد البشرية المتكاملة إلى بناء منصات الويب الحديثة، أهتم دائماً بتقديم حلول برمجية تجمع بين الدقة التقنية وسهولة الاستخدام. أحب العمل في المشاريع التي تتطلب التفكير خارج الصندوق والإنجاز المتقن.",
      aboutP3: "عندما لا أقوم بالبرمجة، أستكشف المشاريع مفتوحة المصدر، وأتعلم أطر عمل جديدة، وأساهم في مجتمع المطورين.",
      edu: "التعليم", eduVal: "بكالوريوس علوم الحاسب",
      loc: "الموقع", locVal: "متاح في جميع أنحاء العالم",
      exp: "الخبرة", expVal: "3+ سنوات مهنية",
      foc: "التركيز", focVal: "البرمجيات، التحليلات والمواقع",
      skillsTag: "ماذا أعرف", skillsTitle: "مهاراتي",
      frontend: "واجهة المستخدم", backend: "تطوير الأنظمة والبيانات", tools: "الأدوات والمزيد",
      projectsTag: "ما قمت ببنائه", projectsTitle: "المشاريع <span class='accent'>المميزة</span>",
      liveDemo: "عرض حي", dashboardBtn: "لوحة التحكم", processBtn: "المراحل",
      hrTitle: "نظام إدارة الموارد البشرية",
      hrDesc: "نظام موارد بشرية متكامل للمؤسسات مع إدارة الموظفين، تقارير الرواتب، تتبع الحضور، والمصادقة المستندة إلى الأدوار.",
      dashTitle: "لوحة تحكم فورية",
      dashDesc: "لوحة تحكم تحليلية مع بث بيانات حي، رسوم بيانية تفاعلية، وإدارة المستخدمين، تم بناؤها باستخدام React و Firebase.",
      lumTitle: "استوديو لوميناري للذكاء الاصطناعي",
      lumDesc: "استوديو متطور لتوليد الصور بالذكاء الاصطناعي يقوم بتحويل الأوامر النصية إلى فن بصري مذهل باستخدام نماذج تعلم آلي متقدمة.",
      portTitle: "موقع المحفظة الشخصية",
      portDesc: "هذا الموقع نفسه — تم تصميمه من الصفر مع رسوم متحركة، وتصميم glassmorphism، وتفاعلات CSS/JS متقدمة.",
      proj5Title: "تحليل عمليات التسريح العالمية واستخبارات سوق العمل",
      proj5Desc: "لوحة تحكم شاملة في Power BI تحلل اتجاهات التسريح العالمية، وتأثيرات السوق، واستخبارات الوظائف على مستوى الصناعة مع تصورات بيانات تفاعلية.",
      proj6Title: "إحصائيات اليوتيوب العالمية",
      proj6Desc: "تحليل مدفوع بالبيانات باستخدام Jupyter Notebook لاستخراج الرؤى والتوقعات المستقبلية لقنوات اليوتيوب عالميًا. يتضمن تنظيف البيانات، EDA، ونماذج تعلم آلي تنبؤية.",
      projectsNote: "العديد من مشاريعي الاحترافية محمية باتفاقيات عدم الإفصاح (NDAs) ولا يمكن عرضها علنًا. لا تتردد في الاتصال بي لمناقشة تفصيلية لخبرتي المهنية.",
      contactTag: "دعنا نتحدث", contactTitle: "تواصل <span class='accent'>معي</span>",
      contactP: "أنا متاح دائمًا للفرص الجديدة، أو التعاون، أو مجرد دردشة ودية حول التكنولوجيا. لا تتردد في التواصل!",
      formName: "اسمك", formEmail: "بريدك الإلكتروني", formMsg: "رسالتك", sendBtn: "إرسال الرسالة 🚀",
      footerDesc: "© 2026 خالد السنوسي. صُنع بشغف ودقة.",
    }
  };

  let currentLang = 'en';

  langBtn && langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    langBtn.textContent = currentLang === 'en' ? 'EN / AR' : 'AR / EN';
    updateTranslations();
  });

  function updateTranslations() {
    const t = translations[currentLang];

    // Navbar
    const navLinksArr = document.querySelectorAll('.nav-link');
    navLinksArr[0].textContent = t.navHome;
    navLinksArr[1].textContent = t.navAbout;
    navLinksArr[2].textContent = t.navSkills;
    navLinksArr[3].textContent = t.navProjects;
    navLinksArr[4].textContent = t.navContact;

    // Hero
    document.querySelector('.hero-greeting').textContent = t.heroGreeting;
    // For name, we might want to keep it simple or use the localized one
    document.querySelector('.hero-name').innerHTML = `${t.heroName}<br /><span class="hero-name-accent">${t.heroNameAccent}</span>`;
    document.querySelector('.hero-subtitle').textContent = t.heroSubtitle;
    document.querySelector('.btn-primary[href="#projects"]').textContent = t.viewWork;
    document.querySelector('.btn-ghost[href="#contact"]').textContent = t.getInTouch;

    const stats = document.querySelectorAll('.stat');
    stats[0].querySelector('.stat-label').textContent = t.statYears;
    stats[1].querySelector('.stat-label').textContent = t.statProjects;
    stats[2].querySelector('.stat-label').textContent = t.statClients;

    // About
    document.querySelector('#about .section-tag').textContent = t.aboutTag;
    document.querySelector('#about .section-title').innerHTML = t.aboutTitle;
    const aboutParas = document.querySelectorAll('.about-text p');
    aboutParas[0].innerHTML = t.aboutP1;
    aboutParas[1].textContent = t.aboutP2;
    aboutParas[2].textContent = t.aboutP3;
    document.querySelector('.about-text .btn-primary').textContent = t.getInTouch;

    const infoCards = document.querySelectorAll('.info-card');
    infoCards[0].querySelector('h4').textContent = t.edu;
    infoCards[0].querySelector('p').textContent = t.eduVal;
    infoCards[1].querySelector('h4').textContent = t.loc;
    infoCards[1].querySelector('p').textContent = t.locVal;
    infoCards[2].querySelector('h4').textContent = t.exp;
    infoCards[2].querySelector('p').textContent = t.expVal;
    infoCards[3].querySelector('h4').textContent = t.foc;
    infoCards[3].querySelector('p').textContent = t.focVal;

    // Skills
    document.querySelector('#skills .section-tag').textContent = t.skillsTag;
    document.querySelector('#skills .section-title').innerHTML = t.skillsTitle;
    const skillCats = document.querySelectorAll('.skill-cat-title');
    skillCats[0].textContent = t.frontend;
    skillCats[1].textContent = t.backend;
    skillCats[2].textContent = t.tools;

    // Projects
    document.querySelector('#projects .section-tag').textContent = t.projectsTag;
    document.querySelector('#projects .section-title').innerHTML = t.projectsTitle;

    document.querySelectorAll('.proj-btn:not(.dashboard-btn):not(.process-btn)').forEach(b => b.textContent = t.liveDemo);
    document.querySelectorAll('.dashboard-btn').forEach(b => b.textContent = t.dashboardBtn);
    document.querySelectorAll('.process-btn').forEach(b => b.textContent = t.processBtn);

    const p1 = document.querySelector('#proj-1 .project-info');
    p1.querySelector('h3').textContent = t.hrTitle;
    p1.querySelector('p').textContent = t.hrDesc;

    const p2 = document.querySelector('#proj-2 .project-info');
    p2.querySelector('h3').textContent = t.dashTitle;
    p2.querySelector('p').textContent = t.dashDesc;

    const p3 = document.querySelector('#proj-3 .project-info');
    p3.querySelector('h3').textContent = t.lumTitle;
    p3.querySelector('p').textContent = t.lumDesc;

    const p4 = document.querySelector('#proj-4 .project-info');
    p4.querySelector('h3').textContent = t.portTitle;
    p4.querySelector('p').textContent = t.portDesc;

    const p5 = document.querySelector('#proj-5 .project-info');
    p5.querySelector('h3').textContent = t.proj5Title;
    p5.querySelector('p').textContent = t.proj5Desc;

    const p6 = document.querySelector('#proj-6 .project-info');
    p6.querySelector('h3').textContent = t.proj6Title;
    p6.querySelector('p').textContent = t.proj6Desc;

    document.querySelector('.projects-note').textContent = t.projectsNote;

    // Contact
    document.querySelector('#contact .section-tag').textContent = t.contactTag;
    document.querySelector('#contact .section-title').innerHTML = t.contactTitle;
    document.querySelector('.contact-info p').textContent = t.contactP;

    const placeholders = [t.formName, t.formEmail, t.formMsg];
    const labels = document.querySelectorAll('.contact-form label');
    // Filter to exclude hidden inputs
    const inputs = document.querySelectorAll('.contact-form input:not([type="hidden"]), .contact-form textarea');
    inputs.forEach((input, i) => {
      if (placeholders[i]) {
        input.placeholder = placeholders[i];
        if (labels[i]) labels[i].textContent = placeholders[i];
      }
    });
    document.getElementById('submit-btn').textContent = t.sendBtn;

    // Footer
    document.querySelector('footer p').textContent = t.footerDesc;
  }

  // Modal for projects (GIFs/Images)
  const triggers = document.querySelectorAll('.demo-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', e => {
      e.preventDefault();
      const imagesAttr = trigger.getAttribute('data-images');
      let urls = imagesAttr ? imagesAttr.split(',') : [trigger.getAttribute('href')];
      openProjectModal(urls, trigger);
    });
  });

  function openProjectModal(urls, trigger) {
    let currentIndex = 0;
    const overlay = document.createElement('div');
    overlay.className = 'gif-overlay';

    const card = trigger.closest('.project-card');
    const rect = card.getBoundingClientRect();

    const modal = document.createElement('div');
    modal.className = 'gif-modal';

    modal.style.top = rect.top + 'px';
    modal.style.left = rect.left + 'px';
    modal.style.width = rect.width + 'px';
    modal.style.height = rect.height + 'px';

    const img = document.createElement('img');
    img.src = urls[currentIndex];
    img.className = 'gif-img';

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.className = 'gif-close';

    modal.appendChild(img);
    modal.appendChild(closeBtn);

    if (urls.length > 1) {
      const prevBtn = document.createElement('button');
      prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
      prevBtn.className = 'gif-nav gif-prev';

      const nextBtn = document.createElement('button');
      nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
      nextBtn.className = 'gif-nav gif-next';

      modal.appendChild(prevBtn);
      modal.appendChild(nextBtn);

      const updateImg = () => {
        img.style.opacity = '0';
        setTimeout(() => {
          img.src = urls[currentIndex];
          img.style.opacity = '1';
        }, 200);
      };

      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + urls.length) % urls.length;
        updateImg();
      });

      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % urls.length;
        updateImg();
      });
    }

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.classList.add('active');
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }, 10);

    const close = () => {
      overlay.classList.remove('active');
      modal.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => overlay.remove(), 400);
    };

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  }
})();

/* Reveal animations on scroll */
(function () {
  const els = document.querySelectorAll(
    '.info-card, .skill-category, .project-card, .about-text, .about-cards, .contact-info, .contact-form, .section-header'
  );
  els.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
})();

/* Animate skill bars when they show up */
(function () {
  const bars = document.querySelectorAll('.bar-fill');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.w + '%';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  bars.forEach(b => io.observe(b));
})();

/* Contact form submission (using FormSubmit) */
(function () {
  const form = document.getElementById('contact-form');
  const msgEl = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        msgEl.classList.add('show');
        form.reset();
        setTimeout(() => msgEl.classList.remove('show'), 5000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        if (window.location.protocol === 'file:') {
          alert('FormSubmit does not work on local files (file:///URL). Please host your site or use a local server like Live Server to test the contact form.');
        } else {
          alert(errorData.message || 'Oops! There was a problem sending your message.');
        }
      }
    } catch (error) {
      if (window.location.protocol === 'file:') {
        alert('FormSubmit does not work on local files (file:///URL). Please host your site or use a local server like Live Server to test the contact form.');
      } else {
        alert('Oops! There was a problem sending your message. Please try again later.');
      }
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
})();

/* 3D Tilt on the profile pic */
(function () {
  const wrapper = document.querySelector('.hero-image-wrapper');
  if (!wrapper) return;

  wrapper.addEventListener('mousemove', e => {
    if (window.innerWidth <= 768) return;
    const rect = wrapper.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rotateX = -dy * 10;
    const rotateY = dx * 10;
    wrapper.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  wrapper.addEventListener('mouseleave', () => {
    wrapper.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
    wrapper.style.transition = 'transform 0.6s ease';
  });

  wrapper.addEventListener('mouseenter', () => {
    wrapper.style.transition = 'transform 0.1s ease';
  });
})();

// Initial Translation Call
updateTranslations();