// ===== 整站的交互：左栏、时钟、卡片叠放、各页面内容、黑白开关、点击放大 =====
// 一般不需要改这个文件，内容都在 data.js 里

(() => {
	const S = window.SITE;
	const P = window.PROJECTS;
	const SIZES = window.SIZES || {};
	const page = document.body.dataset.page; // home | project | all | about
	const params = new URLSearchParams(location.search);

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
		return '<button class="switch" aria-label="Switch black / white background"></button>';
	}
	document.addEventListener('click', (e) => {
		if (!e.target.closest('.switch')) return;
		const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.theme = next;
		store.set('theme', next);
	});

	// ---------- 图片和视频 ----------
	const videoWatcher = new IntersectionObserver((entries) => {
		entries.forEach(({ target: v, isIntersecting }) => {
			v.dataset.visible = isIntersecting ? '1' : '';
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
	const current = page === 'project' ? params.get('p') : null;

	function renderSide() {
		const side = document.createElement('aside');
		side.className = 'side';
		side.innerHTML = `
			<div class="topline">
				<a class="pill" href="all.html">Show all projects</a>
				${switchHTML()}
			</div>
			<div class="masthead">
				<div class="name">${esc(S.fullName)}</div>
				<div class="clock"><span class="d"></span><br><span class="c"></span></div>
			</div>
			<div class="cards">
				<a class="card text${page === 'about' ? ' active' : ''}" href="about.html">About<p>${esc(S.about)}</p></a>
				${P.map((p) => `
				<div class="stack-item">
					<a class="card row${p.slug === current ? ' active' : ''}" href="${link(p)}">
						<img src="${thumb(p.cover)}" alt="" loading="lazy">
						<span><span class="t">${esc(p.title)}</span><span class="s">${esc(p.subtitle)}</span></span>
					</a>
				</div>`).join('')}
			</div>`;
		document.body.prepend(side);
		startClock(side);
		startStack(side);
		const active = $('.card.active', side);
		if (active && getComputedStyle(side).position === 'fixed') {
			side.scrollTop = Math.max(0, active.parentElement.offsetTop - side.clientHeight / 2);
		}
	}

	// 时钟：日期加城市和时间，每秒更新
	function startClock(root) {
		const d = $('.d', root);
		const c = $('.c', root);
		const dateFmt = new Intl.DateTimeFormat('en-US', { timeZone: S.timezone, weekday: 'long', month: 'long', day: 'numeric' });
		const timeFmt = new Intl.DateTimeFormat('en-GB', { timeZone: S.timezone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
		const tick = () => {
			const now = new Date();
			d.textContent = dateFmt.format(now);
			c.textContent = `${S.city}, ${timeFmt.format(now)}`;
		};
		tick();
		setInterval(tick, 1000);
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
				<div class="date">${p.year} · ${p.tags.join(', ')}</div>
				<h2>${esc(p.title)}</h2>
				<p class="lede">${esc(plain(p.text[0]))}</p>
				<div class="media">${mediaTag(p.cover, false)}</div>
			</a>`).join('');
	}

	// 项目页：大图、标题、两张文字卡、信息、其余图片
	function renderProject() {
		const i = P.findIndex((p) => p.slug === current);
		if (i < 0) {
			content.innerHTML = mobileTop() + '<div class="card prose"><p>Project not found.</p></div>';
			return;
		}
		const p = P[i];
		const next = P[(i + 1) % P.length];
		document.title = p.title + ' — ' + S.name;

		const media = (m, half) =>
			`<div class="media zoomable${isVideo(m) && !half ? ' video' : ''}" data-i="${p.media.indexOf(m)}"${half ? ` style="aspect-ratio:${half.toFixed(3)}"` : ''}>${mediaTag(m, false)}</div>`;

		// 比例相近的两张图并排，其余通栏；多出来的文字段落插在图片之间
		const rest = p.media.slice(1);
		const extraText = p.text.slice(2);
		const blocks = [];
		let count = 0;
		for (let k = 0; k < rest.length; k++) {
			const a = rest[k];
			const b = rest[k + 1];
			if (b && Math.abs(ratio(a) / ratio(b) - 1) < 0.25 && ratio(a) < 1.6) {
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
			${media(p.media[0])}
			<div class="card p-title"><h1>${esc(p.title)}</h1><p>${esc(p.subtitle)}</p></div>
			${t2
				? `<div class="two prose-pair">
					<div class="card prose"><div class="label">About the project</div><p>${t1}</p></div>
					<div class="card prose"><div class="label">&nbsp;</div><p>${t2}</p></div>
				</div>`
				: `<div class="card prose"><div class="label">About the project</div><p>${t1}</p></div>`}
			<dl class="card info">
				<div><dt>Year</dt><dd>${p.year}</dd></div>
				<div><dt>Services</dt><dd>${p.services.join('<br>')}</dd></div>
				<div><dt>Discipline</dt><dd>${p.tags.join('<br>')}</dd></div>
				<div>${p.format ? `<dt>Format</dt><dd>${p.format}</dd>` : ''}${p.credits ? `<dt>Credits</dt><dd>${esc(p.credits)}</dd>` : ''}</div>
			</dl>
			${blocks.join('')}
			<a class="card next" href="${link(next)}"><span><span class="muted">Next project</span><br>${esc(next.title)}</span>${'<span class="pill round">' + icons.arrow + '</span>'}</a>`;
		watchVideos(content);
		content.querySelectorAll('.zoomable').forEach((el) => {
			el.addEventListener('click', () => openLightbox(p.media, +el.dataset.i));
		});
	}

	// All projects：三列瀑布流加搜索
	function renderAll() {
		document.body.insertAdjacentHTML('afterbegin', `
			<div class="all-top">
				<label class="search"><input type="search" placeholder="I want to see..." aria-label="Search projects">${icons.arrow}</label>
				<div class="topline">
					${switchHTML()}
					<a class="pill round" href="index.html" aria-label="Close">${icons.close}</a>
				</div>
			</div>`);
		const input = $('.search input');
		input.value = params.get('q') || '';
		const draw = () => {
			const q = input.value.trim().toLowerCase();
			const list = P.filter((p) => !q || (p.title + ' ' + p.subtitle + ' ' + p.tags.join(' ') + ' ' + p.services.join(' ') + ' ' + p.year).toLowerCase().includes(q));
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
				: '<div class="empty">Nothing matches that yet.</div>';
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
		<button class="pill prev">Prev</button>
		<button class="pill next">Next</button>
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
	if (page === 'about') content.insertAdjacentHTML('afterbegin', mobileTop());
})();
