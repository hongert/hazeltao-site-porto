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
	const P = window.PROJECTS.map(localize);
	const SIZES = window.SIZES || {};
	const page = document.body.dataset.page; // home | project | all | about

	// ---------- 小工具 ----------
	const $ = (sel, root = document) => root.querySelector(sel);
	const isVideo = (name) => /\.mp4$/i.test(name);
	const src = (name) => (isVideo(name) ? 'videos/' : 'images/') + name;
	const thumb = (name) => (isVideo(name) ? src(name) : 'thumbs/' + name + '.jpg');
	const ratio = (name) => (SIZES[name] ? SIZES[name][0] / SIZES[name][1] : 16 / 9);
	const link = (p) => 'project.html?p=' + p.slug;
	const plain = (html) => html.replace(/<[^>]+>/g, '');
	const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
	const store = {
		get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
		set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
	};
	const icons = {
		close: '<svg viewBox="0 0 16 16"><path d="M3 3l10 10M13 3 3 13"/></svg>',
		arrow: '<svg viewBox="0 0 16 16"><path d="M2 8h12M9 3l5 5-5 5"/></svg>',
		back: '<svg viewBox="0 0 16 16"><path d="M14 8H2M7 3 2 8l5 5"/></svg>',
	};

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
			return `<video data-src="${src(name)}" muted loop playsinline preload="none"></video>`;
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
			<div class="topline end">
				${switchHTML()}
			</div>
			<div class="masthead">
				<a class="logo" href="index.html">${LOGO}</a>
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
		document.body.prepend(side);
		startStack(side);
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
			<a class="pill" href="index.html">${icons.back} ${esc(S.name)}</a>
			${switchHTML()}
		</div>`;
	}

	// 首页：每个项目一张卡片
	function renderHome() {
		content.innerHTML = P.map((p) => `
			<a class="card feature" href="${link(p)}">
				<div class="feat-head"><h2>${esc(p.title)}</h2><span class="deliv">${p.tags.map(esc).join(', ')}</span></div>
				<div class="media">${mediaTag(p.media[0], false)}</div>
			</a>`).join('');
		// 首页卡片和项目页顶部用同一张（可能是视频）
		watchVideos(content);
	}

	// 项目页：大图、标题、两张文字卡、信息、其余图片
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
		const extraText = p.text.slice(2);
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
		const allRows = (p.rows || []).concat(p.extraRows || []);
		if (allRows.length) {
			allRows.forEach((r) => {
				// { big, stack: [b, c] }：左边一张大图，右边上下叠两张小图
				if (!Array.isArray(r)) {
					const big = media(r.big, ratio(r.big));
					const stack = `<div class="stack">${media(r.stack[0])}${media(r.stack[1])}</div>`;
					// bigRight: true 时小图在左、大图在右
					blocks.push(`<div class="two grid2 reel">${r.bigRight ? stack + big : big + stack}</div>`);
					return;
				}
				const mat = p.mat ? ' matted' : '';
				blocks.push(r.length === 1
					? (p.mat ? `<div class="matted">${media(r[0])}</div>` : media(r[0]))
					: `<div class="jrow">${r.map((m) => `<div class="${mat.trim()}" style="flex:${ratio(m).toFixed(3)}">${media(m, ratio(m))}</div>`).join('')}</div>`);
			});
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

		const [t1, t2] = p.text;
		content.innerHTML = `
			${mobileTop()}
			${media(p.media[0], p.grid === 2 && SIZES[p.media[0]] ? ratio(p.media[0]) : undefined)}
			<div class="card p-title"><h1>${esc(p.title)}</h1><p>${esc(p.subtitle)}</p></div>
			${t2
				? `<div class="two prose-pair">
					<div class="card prose"><div class="label">${T('About the project')}</div><p>${t1}</p></div>
					<div class="card prose"><div class="label">&nbsp;</div><p>${t2}</p></div>
				</div>`
				: `<div class="card prose"><div class="label">${T('About the project')}</div><p>${t1}</p></div>`}
			<dl class="card info">
				<div><dt>${T('Year')}</dt><dd>${p.year}</dd></div>
				<div><dt>${T('Deliverables')}</dt><dd>${p.services.join('<br>')}</dd></div>
				<div>${p.format ? `<dt>${T('Format')}</dt><dd>${p.format}</dd>` : ''}${p.credits ? `<dt>${T('Credits')}</dt><dd>${esc(p.credits)}</dd>` : ''}</div>
			</dl>
			${blocks.join('')}
			<a class="card next" href="${link(next)}"><span><span class="muted">${T('Next project')}</span><br><span class="nt">${esc(next.title)}</span></span>${'<span class="pill round">' + icons.arrow + '</span>'}</a>`;
		if (p.syncVideos) content.querySelectorAll('video').forEach((v) => (v.dataset.sync = ''));
		watchVideos(content);
		content.querySelectorAll('.zoomable').forEach((el) => {
			el.addEventListener('click', () => openLightbox(p.media, +el.dataset.i));
		});
	}

	// All projects：三列瀑布流加搜索
	function renderAll() {
		document.body.insertAdjacentHTML('afterbegin', `
			<div class="all-top">
				<label class="search"><input type="search" placeholder="${T('I want to see...')}" aria-label="Search projects">${icons.arrow}</label>
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
				col.h += 1 / ratio(p.cover) + 0.2;
				col.html += `
					<a class="tile" href="${link(p)}">
						<div class="media">${mediaTag(p.cover, true)}</div>
						<span class="t">${esc(p.title)}</span>
						<span class="s">${esc(p.subtitle)}</span>
					</a>`;
			});
			content.innerHTML = list.length
				? `<div class="masonry">${cols.map((c) => `<div class="col">${c.html}</div>`).join('')}</div>`
				: `<div class="empty">${T('Nothing matches that yet.')}</div>`;
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
	if (page !== 'all') renderSide();
	if (page === 'home') renderHome();
	if (page === 'project') renderProject();
	if (page === 'all') renderAll();
	if (page === 'about') {
		if (lang === 'zh') document.querySelectorAll('[data-zh]').forEach((el) => (el.innerHTML = el.dataset.zh));
		content.insertAdjacentHTML('afterbegin', mobileTop());
	}
})();
