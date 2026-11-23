// ===== 整站的交互：左栏、时钟、卡片叠放、各页面内容、黑白开关、点击放大 =====
// 一般不需要改这个文件，内容都在 data.js 里

(() => {
	const S = window.SITE;
	const params = new URLSearchParams(location.search);

	// ---------- 中英切换（中文内容在 data.zh.js） ----------
	const ZH = window.ZH;
	const lang = document.documentElement.lang === 'zh-Hans' && ZH ? 'zh' : 'en';
	const T = (en) => (lang === 'zh' && ZH.ui[en]) || en;
	const term = (en) => (lang === 'zh' && ZH.terms[en]) || en;
	const localize = (p) => {
		if (lang !== 'zh') return p;
		const z = ZH.projects[p.slug] || {};
		return {
			...p,
			en: p,
			title: z.title || p.title,
			subtitle: z.subtitle || p.subtitle,
			text: z.text || p.text,
			credits: z.credits || p.credits,
			tags: p.tags.map(term),
			services: p.services.map(term),
		};
	};
	const P = window.PROJECTS.filter((p) => !p.hidden).map(localize); // hidden: true 的项目不显示
	const SIZES = window.SIZES || {};
	// 当前版本号（取自 site.js?v=...），读 about.html 时带上，避免浏览器用旧缓存
	const VER = (() => { try { return new URL(document.currentScript.src).searchParams.get('v') || ''; } catch (e) { return ''; } })();
	const page = document.body.dataset.page; // home | project | all | about

	// ---------- 小工具 ----------
	const $ = (sel, root = document) => root.querySelector(sel);
	const isVideo = (name) => /\.mp4$/i.test(name);
	const src = (name) => (isVideo(name) ? 'videos/' : 'images/') + name;
	const thumb = (name) => (isVideo(name) ? src(name) : 'thumbs/' + name + '.jpg');
	const ratio = (name) => (SIZES[name] ? SIZES[name][0] / SIZES[name][1] : 16 / 9);
	const ALT = window.SITE_ALT ? (typeof window.SITE_ALT === 'string' ? window.SITE_ALT : 'alt/') : '';
	// 左栏只放 About me（正式网站和 alt 副本都是）
	const ABOUT_SIDE = true;
	const link = (p) => ALT + 'project.html?p=' + p.slug;
	const plain = (html) => html.replace(/<[^>]+>/g, '');
	const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
	// 防止孤字（widow）：把最后两个英文单词，或最后两个中文字绑在一起不换行
	const nw = (s) => { s = String(s); if (s.trim().split(/\s+/).length <= 2) return '<span class="nw">' + esc(s) + '</span>'; const m = s.match(/(?:^|\s)((?:in|of|the|a|an|to|for|and|on|at|&)\s+\S+\s+\S+)$/i) || s.match(/\S+\s+\S+$/) || s.match(/[　-鿿＀-￯]{2}$/); if (!m) return esc(s); const k = m[1] || m[0]; const i = s.length - k.length; return esc(s.slice(0, i)) + '<span class="nw">' + esc(k) + '</span>'; };
	// 手机首页：指定标题的换行位置（只在标题文字一致时生效）
	const M_BREAKS = { 'sweetness-in-four-seasons': ['Sweetness in', 'Four Seasons'], 'serenseek': ['‘Serenseek’', '寻真'], 'wuzhen-theater-festival': ['Wuzhen Theater', 'Festival'] };
	const homeTitle = (p) => { const b = M_BREAKS[p.slug]; if (b && b.join(' ') === String(p.title).trim()) return b.map((x) => '<span class="nw">' + esc(x) + '</span>').join(' <br class="m-br">'); return nw(p.title); };
	// 交付项：每一项不拆开；最后一项是单个词时，和前一项绑在一起
	const nwTags = (tags) => { const t = tags.map(esc); if (t.length > 1 && !/\s/.test(t[t.length - 1])) { const last = t.pop(); t[t.length - 1] = t[t.length - 1] + ', ' + last; } return t.map((x) => '<span class="nw">' + x + '</span>').join(', '); };
	const store = {
		get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
		set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
	};
	const icons = {
		close: '<svg viewBox="0 0 16 16"><path d="M3 3l10 10M13 3 3 13"/></svg>',
		arrow: '<svg viewBox="0 0 16 16"><path d="M2 8h12M9 3l5 5-5 5"/></svg>',
		back: '<svg viewBox="0 0 16 16"><path d="M14 8H2M7 3 2 8l5 5"/></svg>',
	};

	// 导航里的 All projects 按钮
	const allBtn = () => `<a class="pill" href="${ALT}all.html">${lang === 'zh' ? '全部项目' : 'All projects'}</a>`;

	// 返回上一页的小箭头：从本站别的页面来的就后退，否则回首页
	const backBtn = () => `<button class="pill round back-btn" aria-label="${lang === 'zh' ? '返回' : 'Back'}">${icons.back}</button>`;
	document.addEventListener('click', (e) => {
		if (!e.target.closest('.back-btn')) return;
		let same = false;
		try { same = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch (err) {}
		if (same && history.length > 1) history.back();
		else location.href = ALT + 'index.html';
	});

	// 小 logo 按钮 + 名字和职位（项目页、All projects 页左上角）
	const homeId = () => `<a class="home-id" href="${ALT}index.html"><span class="pill round home-logo">${LOGO}</span><span class="home-name">${esc(S.fullName)}<br><span>${lang === 'zh' ? '平面设计师' : 'Graphic Designer'}</span></span></a>`;

	// ---------- 黑白背景开关 ----------
	function switchHTML() {
		const langBtn = `<button class="pill lang" aria-label="Switch language / 切换语言"><span${lang === 'en' ? ' class="on"' : ''}>EN</span> / <span${lang === 'zh' ? ' class="on"' : ''}>CN</span></button>`;
		return `<span class="toggles">${langBtn}<button class="switch" aria-label="Switch black / white background"></button></span>`;
	}
	document.addEventListener('click', (e) => {
		if (!e.target.closest('.lang')) return;
		store.set('lang', lang === 'zh' ? 'en' : 'zh');
		location.reload();
	});
	document.addEventListener('click', (e) => {
		if (!e.target.closest('.switch')) return;
		const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.theme = next;
		store.set('themeOverride', JSON.stringify({ theme: next, until: window.siteTheme ? window.siteTheme.nextSwitch() : 0 }));
	});

	// ---------- 图片和视频 ----------
	const videoWatcher = new IntersectionObserver((entries) => {
		entries.forEach(({ target: v, isIntersecting }) => {
			v.dataset.visible = isIntersecting ? '1' : '';
			if (v.dataset.sync !== undefined) {
				if (isIntersecting) startSyncGroup();
				return;
			}
			if (isIntersecting) {
				if (!v.src) {
					v.muted = true;
					v.src = v.dataset.src;
					v.addEventListener('canplay', () => v.dataset.visible && v.play().catch(() => {}), { once: true });
				}
				v.play().catch(() => {});
			} else {
				v.pause();
			}
		});
	}, { rootMargin: '200px' });

	// 同一组视频（data-sync）：任何一个进入画面时，整组一起加载、一起从头播放，之后各自循环
	let syncStart = 0;
	function startSyncGroup() {
		if (syncStart) return;
		syncStart = -1;
		const vs = [...document.querySelectorAll('video[data-sync]')];
		const ready = Promise.all(vs.map((v) => new Promise((ok) => {
			v.muted = true;
			v.preload = 'auto';
			if (!v.src) v.src = v.dataset.src;
			if (v.readyState >= 3) ok();
			else v.addEventListener('canplay', ok, { once: true });
		})));
		// 网络慢时最多等 6 秒，之后照样一起开始
		Promise.race([ready, new Promise((ok) => setTimeout(ok, 6000))]).then(() => {
			vs.forEach((v) => { v.pause(); v.currentTime = 0; });
			syncStart = performance.now();
			vs.forEach((v) => v.play().catch(() => {}));
		});
	}
	// 不跳转（跳转在这些视频里会卡回开头），而是微调播放速度追上共同时钟
	setInterval(() => {
		if (syncStart <= 0) return;
		const now = (performance.now() - syncStart) / 1000;
		document.querySelectorAll('video[data-sync]').forEach((v) => {
			if (!v.duration || v.paused) return;
			let diff = (now % v.duration) - v.currentTime;
			if (diff > v.duration / 2) diff -= v.duration;
			if (diff < -v.duration / 2) diff += v.duration;
			v.playbackRate = Math.abs(diff) < 0.04 ? 1 : 1 + Math.max(-0.15, Math.min(0.15, diff * 0.5));
		});
	}, 250);

	function mediaTag(name, small) {
		if (isVideo(name)) {
			// poster：视频还没加载或被手机省电模式拦住自动播放时，先显示第一帧
			return `<video data-src="${src(name)}" poster="thumbs/${name}.jpg" muted loop playsinline autoplay preload="none"></video>`;
		}
		const [w, h] = SIZES[name] || ['', ''];
		return `<img src="${small ? thumb(name) : src(name)}" width="${w}" height="${h}" loading="lazy" alt="">`;
	}

	function watchVideos(root) {
		root.querySelectorAll('video[data-src]').forEach((v) => videoWatcher.observe(v));
	}

	// ---------- 左栏 ----------
	// logo：颜色跟着黑白模式走（用文字颜色）
	const LOGO = `<svg viewBox="64 49.8 127.7 123.4" role="img" aria-label="${esc(S.fullName)}"><path d="M175.6,172.91c2.75-.15,5.17-1.02,7.52-2.23,1.36-.7,2.47-1.54,3.53-2.63,1.07-1.09,2.01-2.19,2.7-3.59.9-1.8,1.7-3.66,2.06-5.68.62-3.51-.18-7.02-1.93-10.07-.65-1.73-1.46-3.23-2.58-4.68-1.28-1.72-2.74-3.11-4.25-4.64-3.38-3.45-7.08-6.41-11.34-8.74.4-1.24.75-2.31.62-3.51-.46-4.22-4.38-6.04-8.45-5.97l-6.69.12c-1.8.01-3.49-.09-5.26-.36l-6.35-2.8c-1.94-.85-3.7-1.79-5.55-3.08l7.05-.16,9.29-.03c2.36,0,4.61.65,6.88,1.17l7.58,1.72c4.51,1.03,9.03,1.44,13.67,1.37,1.89-.03,3.61-.51,5.09-1.66,1.16-.9.38-3.42-.63-4.87l-1.07-1.12c.68-.53,1.17-1.1,1.53-1.84.87-1.79,1.28-3.54-.36-4.51-1.36-.8-2.77-1.23-4.39-1.26-4.1-.07-8.13.15-12.15,1.04l-9.17,2.03c-2.32.52-4.58,1.2-6.97,1.19l-8.07-.02-8.3-.16c1.89-1.29,3.71-2.18,5.65-3.13l6.37-2.78c2.19-.31,4.31-.39,6.53-.3l5.36.08c4.11.06,8.03-1.8,8.42-6.06.11-1.2-.29-2.27-.6-3.42,3.5-1.97,6.69-4.18,9.49-6.96l4.24-4.23,2.83-3.6,1.6-3.22c1.56-3.13,2.56-6.54,1.9-10.08-.46-2.43-1.4-4.72-2.72-6.81-3.83-6.09-11.55-8.08-18.46-7.38-1.66.17-3.27.59-4.8,1.18-4.13,1.59-6.39,5.01-8.42,8.8-1.12,2.09-1.82,4.19-2.4,6.48l-2.22,8.85c-.67,2.66-1.49,5.19-2.51,7.71-.95,2.37-2.28,4.41-3.88,6.37-2.46,3.04-4.71,5.54-8.57,6.83l-.25-.84c-1.78-.68-2.66.56-4.04.4.18-.81.66-1.56.52-2.27-.28-.79-1.55-.58-2.1-.15-.29.23-.65.38-.93.47l-.35-2.91-1.13-6.92-.26-.52-.59-3.24c-.03-.15-.36-.38-.5-.34-.11.04-.34.25-.36.39l-.58,3.21-.26.55-1.11,6.79-.37,3.02-.94-.51c-.48-.26-.88-.44-1.44-.33-.2.04-.51.15-.61.28-.09.13-.11.5-.07.67l.53,1.88c-1.57-.12-2.46-1.12-4.03-.46l-.26.82c-2.58-.82-5.06-2.69-6.78-4.7-2.41-2.81-4.55-5.46-5.88-9.01-.87-2.33-1.65-4.6-2.25-7.02l-2.28-9.06c-.57-2.27-1.26-4.34-2.36-6.4-2.39-4.48-4.85-7.91-9.89-9.37-2.48-.72-4.86-.91-7.48-.76-3.94.23-7.74,1.3-10.91,3.73-3.29,2.52-5.4,6.54-6.15,10.58-.65,3.5.22,6.98,1.92,10.02.7,1.93,1.65,3.55,2.94,5.14,1.72,2.18,3.66,4.01,5.68,5.93,2.88,2.74,6.04,5.05,9.53,6.99-.31,1.03-.65,2.03-.62,3.14.05,1.91,1.07,3.74,2.65,4.81,1.71,1.16,3.72,1.56,5.76,1.53l5.5-.08c2.18-.09,4.24,0,6.4.3,4,1.71,8.31,3.4,12.02,5.92l-8.31.16-8.07.02c-5.36.02-15.47-4.54-28.28-4.26-1.71.04-3.25.5-4.63,1.43-1.38.93-.86,2.8-.06,4.41.36.74.92,1.32,1.55,1.79-1.52.94-2.67,3.7-2.23,5.21.4,1.38,3.4,2.36,5.39,2.4,12.99.24,22.8-4.26,28.27-4.25l9.28.03,7.15.14c-1.71,1.14-3.4,2.11-5.28,2.94l-6.72,2.97c-1.72.26-3.37.36-5.12.36l-6.83-.12c-4.06-.07-7.98,1.79-8.41,5.98-.12,1.2.24,2.31.62,3.5-3.49,1.96-6.77,4.22-9.62,7.08l-4.17,4.17c-1.21,1.21-2.17,2.58-3.08,4.03l-1.33,2.81c-1.63,3.07-2.55,6.51-1.88,10.02.77,4.04,2.87,8.07,6.17,10.59,2.09,1.59,4.51,2.6,7.05,3.18,2.19.5,4.34.58,6.59.55,1.47-.02,2.84-.32,4.26-.67,5.08-1.25,7.56-4.46,10.02-8.84,1.28-2.28,2.09-4.6,2.72-7.14l2.23-8.95,1.46-4.8c1.12-3.68,2.97-6.91,5.47-9.83,1.29-1.5,2.5-2.94,4.12-4.09,1.23-.87,2.51-1.65,3.92-2l.19.75c.04.16,1.16.5,2.3.03.57-.24,1.03-.34,1.75-.41l-.52,1.79c-.06.21-.05.63.07.77.23.27,1.1.46,1.82.04l1.14-.66.35,2.97,1.13,6.9.26.56.59,3.21c.03.15.33.36.47.35.11-.01.36-.21.38-.33l.6-3.2c.02-.12.2-.43.25-.54l1.13-6.91.36-3.01,1.11.64c.75.43,1.61.25,1.84-.02.11-.13.16-.55.11-.71l-.55-1.85c.68.06,1.16.18,1.73.41,1.12.45,2.27.19,2.35-.08l.21-.7c3.69,1.19,5.85,3.57,8.22,6.39,2.37,2.8,4.13,5.9,5.2,9.41l1.49,4.91,2.27,9.06c.59,2.37,1.33,4.54,2.5,6.68,2.57,4.7,5.01,7.94,10.42,9.27,1.71.42,3.35.72,5.12.63l2.95-.16Z"/></svg>`;
	const current = page === 'project' ? params.get('p') : null;

	function renderSide() {
		const side = document.createElement('aside');
		side.className = 'side';
		side.innerHTML = `
			<div class="topline side-nav">
				<span class="toggles">${page !== 'home' ? backBtn() : ''}${page === 'project' ? homeId() : ''}</span>
				${switchHTML()}
			</div>
			<div class="masthead">
				<a class="logo" href="${ALT}index.html">${LOGO}</a>
				<div class="name">${esc(S.fullName)}</div>
				<div class="role">${lang === 'zh' ? '平面设计师' : 'Graphic Designer'}</div>
			</div>
			<div class="cards">
				<a class="card text${page === 'about' ? ' active' : ''}" href="about.html">${T('About')}${S.about ? `<p>${esc(S.about)}</p>` : ''}</a>
				${P.map((p) => `
				<div class="stack-item">
					<a class="card row${p.slug === current ? ' active' : ''}" href="${link(p)}">
						<img src="${thumb(p.thumb || p.cover)}" alt="" loading="lazy"${p.thumbPos ? ` style="object-position:${p.thumbPos}"` : ''}>
						<span><span class="t">${esc(p.title)}</span><span class="s">${esc(p.subtitle)}</span></span>
					</a>
				</div>`).join('')}
			</div>`;
		if (ABOUT_SIDE) {
			// 左栏：一句话介绍 + About / Work / Playground / Contact 四个入口 + 联系方式（作品优先，简历放在 About 页）
			const cards = $('.cards', side);
			cards.className = 'side-nav-list';
			const zh = lang === 'zh';
			const item = (label, href, note, on) => `<a href="${href}"${on ? ' class="on"' : ''}><span>${label}</span><span>${note}</span></a>`;
			cards.innerHTML = `
				<nav class="side-links">
					${item(zh ? '关于' : 'About', 'about.html', '→', page === 'about')}
					${item(zh ? '作品' : 'Work', ALT + 'all.html', '→', false)}
					${item('Playground', 'playground.html', '→', false)}
					<button class="side-drop" aria-expanded="false"><span>${zh ? '联系' : 'Contact'}</span><span>↓</span></button>
					<div class="side-drop-body"><a href="mailto:${S.email}">${esc(S.email)}</a><a href="https://www.instagram.com/${S.instagram}/" target="_blank" rel="noopener">@${esc(S.instagram)}</a></div>
				</nav>`;
		}
		const drop = $('.side-drop', side);
		if (drop) drop.onclick = () => {
			const open = drop.parentElement.classList.toggle('drop-open');
			drop.setAttribute('aria-expanded', open);
		};
		document.body.prepend(side);
		if (!ABOUT_SIDE) startStack(side);
		const active = $('.card.active', side);
		if (active && getComputedStyle(side).position === 'fixed') {
			side.scrollTop = Math.max(0, active.parentElement.offsetTop - side.clientHeight / 2);
		}
	}

	// 卡片叠放：还没滚到的卡片在底部叠成一摞，越往后越小
	function startStack(side) {
		const items = [...side.querySelectorAll('.stack-item')];
		let tops = [];
		const fixed = () => getComputedStyle(side).position === 'fixed';

		function measure() {
			items.forEach((it) => (it.style.position = 'static'));
			const base = fixed() ? side.getBoundingClientRect().top - side.scrollTop : -scrollY;
			tops = items.map((it) => it.getBoundingClientRect().top - base);
			items.forEach((it) => (it.style.position = ''));
			update();
		}

		function update() {
			const viewTop = fixed() ? side.scrollTop : scrollY;
			const viewH = fixed() ? side.clientHeight : innerHeight;
			const limit = viewTop + viewH - 12;
			let depth = 0;
			items.forEach((it, i) => {
				const card = it.firstElementChild;
				const stuck = tops[i] + it.offsetHeight > limit;
				it.classList.toggle('stuck', stuck);
				it.style.zIndex = stuck ? 200 - depth : 100 - i;
				if (stuck) {
					card.style.transform = `translateY(${depth * 12}px) scale(${1 - depth * 0.05})`;
					card.style.opacity = depth > 2 ? 0 : 1;
					depth++;
				} else {
					card.style.transform = '';
					card.style.opacity = '';
				}
			});
		}

		side.addEventListener('scroll', update, { passive: true });
		addEventListener('scroll', update, { passive: true });
		addEventListener('resize', measure);
		addEventListener('load', measure);
		measure();
	}

	// ---------- 右栏内容 ----------
	const content = $('.content');

	function mobileTop() {
		return `<div class="topline mobile-top">
			<span class="toggles">${backBtn()}<a class="pill" href="${ALT}index.html">${esc(S.name)}</a>${allBtn()}</span>
			${switchHTML()}
		</div>`;
	}

	// 首页：每个项目一张卡片
	function renderHome() {
		// 顶部：整屏大图轮播，随机顺序，淡入淡出（电脑上）
		// 固定的节奏：浅 深 浅 浅 深 浅 深（相近的放在一起，深色穿插在浅色里）；每次从随机的一张开始
		const SEQ = ['huayings-recipe', 'wuzhen-theater-festival', 'arboretum', 'held-still', 'taohe', 'edge-of-visibility', 'find-your-voice', 'serenseek'];
		const seq = SEQ.map((k) => P.find((p) => p.slug === k)).filter(Boolean).concat(P.filter((p) => !SEQ.includes(p.slug)));
		const st0 = Math.floor(Math.random() * seq.length);
		const order = seq.slice(st0).concat(seq.slice(0, st0));
		// 画面比屏幕宽很多、裁切会显得局促的图：完整显示，四周用同一张图的模糊放大版铺满
		const FIT = ['arboretum', 'wuzhen-theater-festival'];
		// 裁切时保留画面重心：横向位置 / 纵向位置（没写的默认居中）
		const POS = { 'wuzhen-theater-festival': '0% 50%' };
		const pos = (p) => (POS[p.slug] ? ` style="object-position:${POS[p.slug]}"` : '');
		const heroMedia = (name, first, st = '') => isVideo(name)
			? `<video src="${src(name)}" poster="thumbs/${name}.jpg" muted loop playsinline preload="${first ? 'auto' : 'metadata'}"${first ? ' autoplay' : ''}${st}></video>`
			: `<img src="${src(name)}" alt="" loading="${first ? 'eager' : 'lazy'}"${st}>`;
		const hero = `
			<div class="hero-slides">
				${order.map((p, i) => `<a class="hero-slide${i === 0 ? ' on' : ''}${FIT.includes(p.slug) ? ' fit' : ''}" href="${link(p)}">${FIT.includes(p.slug) ? `<span class="hero-bg" style="background-image:url('${isVideo(p.media[0]) ? 'thumbs/' + p.media[0] + '.jpg' : thumb(p.media[0])}')"></span>` : ''}${heroMedia(p.media[0], i === 0, FIT.includes(p.slug) ? '' : pos(p))}<span class="hero-cap"><span class="hc-t">${esc(p.title)}</span><span class="hc-d">${esc(p.tags.join(', '))}</span></span></a>`).join('')}
			</div>`;
		content.innerHTML = hero + `<div class="home-grid">${P.map((p) => `
			<a class="card feature" href="${link(p)}">
				<div class="feat-head"><h2>${homeTitle(p)}</h2><span class="deliv">${nwTags(p.tags)}</span></div>
				<div class="media">${mediaTag(p.media[0], false).replace(/^<(img|video)/, '<$1' + pos(p))}</div>
			</a>`).join('')}</div>`;
		// 首页卡片和项目页顶部用同一张（可能是视频）
		watchVideos($('.home-grid', content));
		startHero($('.hero-slides', content));
		if (window.MOBILE_LAYOUT === 'nav') renderMobileNav();
	}

	function startHero(box) {
		const slides = [...box.querySelectorAll('.hero-slide')];
		if (slides.length < 2) return;
		let cur = 0;
		const show = (n) => {
			const prev = slides[cur];
			cur = (n + slides.length) % slides.length;
			const s = slides[cur];
			const v = $('video', s);
			if (v) { v.preload = 'auto'; v.currentTime = 0; v.play().catch(() => {}); }
			s.classList.add('on');
			prev.classList.remove('on');
			const pv = $('video', prev);
			if (pv) setTimeout(() => pv.pause(), 1200);
			// 提前加载下一张
			const nx = slides[(cur + 1) % slides.length].querySelector('img');
			if (nx) nx.loading = 'eager';
		};
		// 开场动画还在播时先不轮播，等幕布拉开后再开始
		let timer = null;
		const begin = () => { if (document.getElementById('intro')) return setTimeout(begin, 300); timer = setInterval(() => show(cur + 1), 4500); };
		begin();
		document.addEventListener('visibilitychange', () => {
			clearInterval(timer);
			if (!document.hidden) timer = setInterval(() => show(cur + 1), 4500);
		});
	}

	// 手机版（预览）：顶部导航卡片 + 大图 + 作品索引 + About me + Contact
	function renderMobileNav(barOnly) {
		// 手机首页大图：竖条形状，取 Serenseek 的玻璃立牌
		const hero = P.find((p) => p.slug === 'serenseek') || P[0];
		const heroImg = 'Serenseek_scene8.png';
		const nav = document.createElement('div');
		nav.className = 'mnav';
		nav.innerHTML = `
			<header class="mnav-bar" id="top">
				<div class="mnav-row">
					<a class="mnav-brand" href="${ALT}index.html">${LOGO}<span>${esc(S.fullName)}</span></a>
					${switchHTML()}
				</div>
				<nav class="mnav-links">
					<a href="${barOnly ? ALT + 'index.html' : ''}#work">${lang === 'zh' ? '作品' : 'Work'}</a>
					<a href="${barOnly ? ALT + 'index.html' : ''}#about">${T('About me')}</a>
					<a href="${barOnly ? ALT + 'index.html' : ''}#contact">${lang === 'zh' ? '联系' : 'Contact'}</a>
				</nav>
			</header>
			<a class="mnav-hero" href="${link(hero)}">
				${P.map((p, i) => `<img src="hero/${p.slug}.jpg" alt="" class="${i === 0 ? 'on' : ''}"${i ? ' loading="lazy"' : ''}>`).join('')}
				<span class="mnav-cap">${esc(P[0].title)}</span>
				<span class="mnav-dots">${P.map((p, i) => `<i class="${i === 0 ? 'on' : ''}"></i>`).join('')}</span>
			</a>
			<a class="mnav-cta" href="#work">${lang === 'zh' ? '查看作品' : 'View work'} →</a>
			<section class="mnav-work" id="work">
				<div class="mnav-head"><span>${lang === 'zh' ? '作品' : 'Work'}</span><span>${String(P.length).padStart(2, '0')} ${lang === 'zh' ? '个项目' : 'projects'}</span></div>
				${P.map((p, i) => `
				<a class="mnav-item" href="${link(p)}">
					<div class="mnav-txt">
						<div class="num">${String(i + 1).padStart(2, '0')}</div>
						<div class="t">${nw(p.title)}</div>
						<div class="s">${esc(p.subtitle)}</div>
					</div>
					<div class="mnav-thumb"><img src="${thumb(p.thumb || p.cover)}" alt="" loading="lazy"></div>
				</a>`).join('')}
			</section>
			<section class="mnav-about" id="about"></section>
			<a class="mnav-cta" href="#top">${lang === 'zh' ? '回到顶部' : 'Back to top'} ↑</a>`;
		if (barOnly) {
			nav.innerHTML = $('.mnav-bar', nav).outerHTML;
			nav.classList.add('bar-only');
			document.body.prepend(nav);
			return;
		}
		document.body.prepend(nav);
		watchVideos(nav);
		// 大图幻灯片：每 2.6 秒淡入下一个项目，链接和项目名跟着换
		const heroEl = $('.mnav-hero', nav);
		const slides = [...heroEl.querySelectorAll('img')], dots = [...heroEl.querySelectorAll('.mnav-dots i')];
		let cur = 0;
		const show = (n) => {
			cur = (n + slides.length) % slides.length;
			slides.forEach((im, i) => im.classList.toggle('on', i === cur));
			dots.forEach((d, i) => d.classList.toggle('on', i === cur));
			heroEl.href = link(P[cur]);
			$('.mnav-cap', heroEl).textContent = P[cur].title;
		};
		if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(() => show(cur + 1), 2600);
		// About me 和 Contact 直接取自 about.html
		fetch('about.html?v=' + VER).then((r) => r.text()).then((h) => {
			const main = new DOMParser().parseFromString(h, 'text/html').querySelector('main.content');
			if (!main) return;
			if (lang === 'zh') main.querySelectorAll('[data-zh]').forEach((el) => (el.innerHTML = el.dataset.zh));
			$('.mnav-about', nav).innerHTML = main.innerHTML;
			const c = [...nav.querySelectorAll('.mnav-about .cv')].find((el) => /Contact|联系方式/.test(el.textContent));
			if (c) c.id = 'contact';
		});
	}

	// 项目页：大图、标题、两张文字卡、信息、其余图片
	// 署名：'Photography Credits: A, B, C. Creative Director: D' → 每个角色一组，名字一行一个
	function creditsHTML(c) {
		if (!c) return '';
		return c.split(/[.。]\s*(?=[^.。]+[:：])/).map((seg) => {
			const m = seg.match(/^\s*([^:：]+)[:：]\s*(.+?)[.。]?\s*$/);
			if (!m) return `<div><dt>${T('Credits')}</dt><dd>${esc(seg)}</dd></div>`;
			const names = m[2].split(/\s*[,，、]\s*/).map(esc).join('<br>');
			return `<div><dt>${esc(m[1].trim())}</dt><dd>${names}</dd></div>`;
		}).join('');
	}

	function renderProject() {
		const i = P.findIndex((p) => p.slug === current);
		if (i < 0) {
			content.innerHTML = mobileTop() + `<div class="card prose"><p>${T('Project not found.')}</p></div>`;
			return;
		}
		const p = P[i];
		const next = P[(i + 1) % P.length];
		document.title = p.title + ' — ' + S.name;

		const media = (m, half) =>
			`<div class="media zoomable${isVideo(m) && !half ? ' video' : ''}" data-i="${p.media.indexOf(m)}"${half ? ` style="aspect-ratio:${half.toFixed(3)}"` : ''}>${mediaTag(m, false)}</div>`;

		// 比例相近的两张图并排，其余通栏；多出来的文字段落插在图片之间
		// extraRows 里的图片单独排在最后，不参与上面的自动排版
		const extra = (p.extraRows || []).flat().flatMap((r) => (typeof r === 'string' ? [r] : [r.big, ...r.stack]));
		const rest = p.media.slice(1).filter((m) => !extra.includes(m));
		const extraText = []; // 文字全部放在左栏，右边只放图片
		const blocks = [];
		let count = 0;
		// grid: 2 的项目：文字下面的图片/视频一律两列并排
		if (p.grid === 2) {
			for (let k = 0; k < rest.length; k += 2) {
				const a = rest[k];
				const b = rest[k + 1];
				// 竖版 reel：左边保持原比例不裁，右边上下叠两张填满同样高度
				if (SIZES[a] && ratio(a) < 1 && b && rest[k + 2]) {
					blocks.push(`<div class="two grid2 reel">${media(a, ratio(a))}<div class="stack">${media(b)}${media(rest[k + 2])}</div></div>`);
					k++;
					continue;
				}
				// 统一裁成同一比例（默认 4:3），排得整齐
				const r = p.gridRatio || 4 / 3;
				blocks.push(`<div class="two grid2">${media(a, r)}${b ? media(b, r) : ''}</div>`);
			}
			rest.length = 0;
		}
		// rows：自己指定每一排放哪几张；同一排的图等高、按原比例分配宽度，不裁切
		const rowHTML = (r) => {
			// { solo, width, align }：单张图，缩小到指定宽度，靠左或靠右，留出空白
			if (r.solo) return `<div class="solo-off" style="width:${r.width || '66%'};margin-${r.align === 'right' ? 'left' : 'right'}:auto">${media(r.solo, ratio(r.solo))}</div>`;
			// { big, stack: [b, c] }：左边一张大图，右边上下叠两张小图（bigRight: true 时大图在右）
			if (!Array.isArray(r)) {
				const big = media(r.big, ratio(r.big));
				const stack = `<div class="stack">${media(r.stack[0])}${media(r.stack[1])}</div>`;
				return `<div class="two grid2 reel">${r.bigRight ? stack + big : big + stack}</div>`;
			}
			const mat = p.mat ? ' matted' : '';
			return r.length === 1
				? (p.mat ? `<div class="matted">${media(r[0])}</div>` : media(r[0], isVideo(r[0]) && SIZES[r[0]] ? ratio(r[0]) : undefined))
				: `<div class="jrow">${r.map((m) => `<div class="${mat.trim()}" style="flex:${ratio(m).toFixed(3)}">${media(m, ratio(m))}</div>`).join('')}</div>`;
		};
		// sections：按交付内容分组，每组一段；左栏对应的交付内容会随滚动高亮
		if (p.sections) {
			const enTags = (p.en || p).tags;
			p.sections.forEach((sec) => blocks.push(`<div class="p-sec" data-i="${enTags.indexOf(sec.tag)}">${sec.rows.map(rowHTML).join('')}</div>`));
			rest.length = 0;
		}
		const allRows = (p.rows || []).concat(p.extraRows || []);
		if (allRows.length) {
			allRows.forEach((r) => blocks.push(rowHTML(r)));
			rest.length = 0;
		}
		for (let k = 0; k < rest.length; k++) {
			const a = rest[k];
			const b = rest[k + 1];
			const solo = p.solo || [];
			const twoVideos = b && isVideo(a) && isVideo(b);
			if (b && !solo.includes(a) && !solo.includes(b) && (twoVideos || (Math.abs(ratio(a) / ratio(b) - 1) < 0.25 && ratio(a) < 1.6))) {
				blocks.push(`<div class="two">${media(a, ratio(a))}${media(b, ratio(a))}</div>`);
				k++;
			} else {
				blocks.push(media(a));
			}
			count++;
			if (count % 3 === 0 && extraText.length) {
				blocks.push(`<div class="card prose"><p>${extraText.shift()}</p></div>`);
			}
		}
		extraText.forEach((t) => blocks.push(`<div class="card prose"><p>${t}</p></div>`));

		// 项目文字：电脑上放在左栏，右边只放图片；手机上左栏隐藏，文字放在第一张图下面
		const textHTML = `
			<div class="p-text">
				<div class="p-first">
					<div class="p-title"><h1>${nw(p.title)}</h1><p>${nw(p.subtitle)}</p></div>
					<div class="prose"><div class="label">${T('About the project')}</div>${p.text.map((t) => `<p>${t}</p>`).join('')}</div>
				</div>
				<dl class="info">
					<div><dt>${T('Deliverables')}</dt><dd>${p.tags.map((t, i) => p.sections ? `<span class="dl-tag" data-i="${i}">${esc(t)}</span>` : esc(t)).join('<br>')}</dd></div>
					${p.format ? `<div><dt>${T('Format')}</dt><dd>${p.format}</dd></div>` : ''}
					${creditsHTML(p.credits)}
				</dl>
				<a class="next" href="${link(next)}"><span><span class="muted">${T('Next project')}</span><br><span class="nt">${esc(next.title)}</span></span>${'<span class="pill round">' + icons.arrow + '</span>'}</a>
			</div>`;
		const sideSlot = $('.side .side-nav-list');
		if (sideSlot) {
			sideSlot.className = 'side-project';
			sideSlot.innerHTML = textHTML;
		}
		content.innerHTML = `
			${mobileTop()}
			${media(p.media[0], p.grid === 2 && SIZES[p.media[0]] ? ratio(p.media[0]) : undefined).replace('class="media ', 'class="media p-hero ')}
			<div class="p-text-mobile">${textHTML}</div>
			${blocks.join('')}
			<div class="p-text-mobile p-next-mobile"><div class="p-text">${(textHTML.match(/<a class="next"[\s\S]*?<\/a>/) || [''])[0]}</div></div>`;
		if (p.syncVideos) content.querySelectorAll('video').forEach((v) => (v.dataset.sync = ''));
		watchVideos(content);
		content.querySelectorAll('.zoomable').forEach((el) => {
			el.addEventListener('click', () => openLightbox(p.media, +el.dataset.i));
		});
		if (p.sections) spySections(String(Math.max(0, (p.en || p).tags.indexOf(p.heroTag))));
	}

	// 详情页：滚动到哪一组图片，左栏对应的交付内容就高亮（其余变灰）；点交付内容跳到那一组
	function spySections(heroI = '0') {
		const secs = [...content.querySelectorAll('.p-sec')];
		const tags = [...document.querySelectorAll('.dl-tag')];
		if (!secs.length) return;
		document.querySelectorAll('.info').forEach((el) => el.classList.add('spy'));
		let last = -1;
		const update = () => {
			// 还在顶部大图时，高亮顶部大图所属的那一项（heroTag，默认第一项）
			let i = heroI;
			secs.forEach((s) => { if (s.getBoundingClientRect().top < innerHeight * 0.55) i = s.dataset.i; });
			if (i === last) return;
			last = i;
			tags.forEach((t) => t.classList.toggle('on', t.dataset.i === i));
		};
		let raf = 0;
		addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); }, { passive: true });
		addEventListener('resize', update);
		update();
		tags.forEach((t) => t.addEventListener('click', () => {
			const s = secs.find((x) => x.dataset.i === t.dataset.i);
			if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}));
	}

	// All projects：三列瀑布流加搜索
	function renderAll() {
		document.body.insertAdjacentHTML('afterbegin', `
			<div class="all-top">
				<div class="all-left">${homeId()}<label class="search"><input type="search" placeholder="${T('I want to see...')}" aria-label="Search projects">${icons.arrow}</label></div>
				<div class="topline">
					${switchHTML()}
					<a class="pill round" href="index.html" aria-label="Close">${icons.close}</a>
				</div>
			</div>`);
		const input = $('.search input');
		input.value = params.get('q') || '';
		const draw = () => {
			const q = input.value.trim().toLowerCase();
			const hay = (p) => [p, p.en || p].map((x) => x.title + ' ' + x.subtitle + ' ' + x.tags.join(' ') + ' ' + x.services.join(' ')).join(' ') + ' ' + p.year;
			const list = P.filter((p) => !q || hay(p).toLowerCase().includes(q));
			// 按顺序从左到右放进最短的一列
			const n = innerWidth <= 760 ? 2 : 3;
			const cols = Array.from({ length: n }, () => ({ h: 0, html: '' }));
			list.forEach((p) => {
				const col = cols.reduce((a, b) => (b.h < a.h - 0.01 ? b : a));
				// 封面和首页卡片用同一张（可能是视频，比如 Arboretum 的动态）
				const cover = p.media[0];
				col.h += 1 / ratio(cover) + 0.2;
				col.html += `
					<a class="tile" href="${link(p)}">
						<div class="media">${mediaTag(cover, true)}</div>
						<span class="t">${esc(p.title)}</span>
						<span class="s">${esc(p.subtitle)}</span>
					</a>`;
			});
			content.innerHTML = list.length
				? `<div class="masonry">${cols.map((c) => `<div class="col">${c.html}</div>`).join('')}</div>`
				: `<div class="empty">${T('Nothing matches that yet.')}</div>`;
			watchVideos(content);
		};
		input.addEventListener('input', draw);
		let wasMobile = innerWidth <= 760;
		addEventListener('resize', () => {
			if ((innerWidth <= 760) !== wasMobile) {
				wasMobile = !wasMobile;
				draw();
			}
		});
		draw();
	}

	// ---------- 点击放大（可左右翻页） ----------
	const lb = document.createElement('div');
	lb.className = 'lightbox';
	lb.innerHTML = `
		<div class="stage"></div>
		<button class="pill round close" aria-label="Close">${icons.close}</button>
		<button class="pill prev">${T('Prev')}</button>
		<button class="pill next">${T('Next')}</button>
		<div class="count"></div>`;
	document.body.append(lb);
	let lbList = [];
	let lbIndex = 0;

	function showLightbox() {
		const m = lbList[lbIndex];
		$('.stage', lb).outerHTML = isVideo(m)
			? `<video class="stage" src="${src(m)}" autoplay muted loop playsinline controls></video>`
			: `<img class="stage" src="${src(m)}" alt="">`;
		$('.count', lb).textContent = `${lbIndex + 1} / ${lbList.length}`;
	}
	function openLightbox(list, i) {
		lbList = list;
		lbIndex = i;
		showLightbox();
		lb.classList.add('open');
	}
	function closeLightbox() {
		lb.classList.remove('open');
		$('.stage', lb).outerHTML = '<div class="stage"></div>';
	}
	function step(d) {
		lbIndex = (lbIndex + d + lbList.length) % lbList.length;
		showLightbox();
	}
	lb.addEventListener('click', (e) => {
		if (e.target.closest('.prev')) step(-1);
		else if (e.target.closest('.next')) step(1);
		else if (!e.target.closest('video')) closeLightbox();
	});
	document.addEventListener('keydown', (e) => {
		if (!lb.classList.contains('open')) return;
		if (e.key === 'Escape') closeLightbox();
		if (e.key === 'ArrowLeft') step(-1);
		if (e.key === 'ArrowRight') step(1);
	});

	// ---------- 开始 ----------
	// 手机版首页排版预览：grid | mix | swipe（只在 alt 副本里用）
	if (window.MOBILE_LAYOUT) document.body.classList.add('m-' + window.MOBILE_LAYOUT);
	// 预览不同导航样式：?nav=a|b|c
	const NAVSTYLE = new URLSearchParams(location.search).get('nav') || (window.MOBILE_LAYOUT === 'nav' ? 'd' : '');
	if (NAVSTYLE) document.body.classList.add('nav-' + NAVSTYLE);
	if (page !== 'all') renderSide();
	if (page === 'home') renderHome();
	if (page === 'project') renderProject();
	if (page === 'project' && window.MOBILE_LAYOUT === 'nav') renderMobileNav(true);
	if (page === 'all') renderAll();
	// 底部版权：一直固定在屏幕右下角，压在内容上面
	document.body.insertAdjacentHTML('beforeend', `<div class="site-foot">© ${new Date().getFullYear()} ${esc(S.fullName)}. All rights reserved.</div>`);
	if (page === 'about') {
		if (lang === 'zh') document.querySelectorAll('[data-zh]').forEach((el) => (el.innerHTML = el.dataset.zh));
		content.insertAdjacentHTML('afterbegin', mobileTop());
		// 名字：HONGER 和 (HAZEL) 轮流淡入淡出（参考 2x4.org 顶部）
		const sw = $('.nm-swap');
		if (sw && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
			const ws = [...sw.children];
			let k = 0;
			// 宽度固定为较长的那个词，TAO 不动
			const fit = () => (sw.style.width = Math.max(...ws.map((w) => w.scrollWidth)) + 'px');
			fit();
			if (document.fonts) document.fonts.ready.then(fit);
			setInterval(() => {
				ws[k].classList.remove('on');
				k = (k + 1) % ws.length;
				ws[k].classList.add('on');
			}, 2600);
		}
	}
})();
