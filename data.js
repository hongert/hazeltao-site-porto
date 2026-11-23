// ===== 全站内容都在这里：改文字、加项目、换图片只需要改这个文件 =====
// media 里写 images/ 或 videos/ 文件夹里的文件名；.mp4 结尾会自动当成视频
// cover 是左边卡片的小图、首页卡片和 All projects 页用的封面图
// subtitle 是左边卡片和项目页里标题下面那一行小字

window.SITE = {
	name: 'Hazel Tao',
	fullName: 'Honger (Hazel) Tao',
	email: 'heizedesign@gmail.com',
	instagram: 'sol.studioooo',
	now: [
		'MFA Graphic Design, ArtCenter College of Design (Sept 2025 – May 2027)',
		'BA Design, Washington University in St. Louis (Sept 2023 – May 2025)',
		'BFA Graphic Design, Boston University (Jan 2022 – May 2023)',
	],
	updated: '03.20.2026',
	// 左上角时钟显示的城市和时区
	city: 'Los Angeles',
	timezone: 'America/Los_Angeles',
	// 左栏 About 小卡片下面的一句话；留空就只显示 About
	about: '',
};

window.PROJECTS = [
	{
		slug: 'arboretum',
		title: 'Arboretum',
		subtitle: 'Rebrand Proposal',
		year: 2025,
		tags: ['Branding Design', 'Identity Design', 'Merchandise', 'Exhibit Design', 'Editorial Design'],
		services: ['Rebrand Proposal', 'Motion', 'Merchandise', 'Spatial', 'Website'],
		format: '',
		cover: 'GS3_FA25_HazelTao_Website4_v2.jpg',
		thumb: 'Screenshot-2026-02-13-at-11.32.01AM.png',
		media: [
			'Arboretum-Motion-Long-Final.mp4', 'GS3_FA25_-HazelTao_Promo3.mp4', 'J-A-Long-LED-Motion.mp4',
			'GS3_FA25_HazelTao_swag4.jpg', 'GS3_FA25_HazelTao_Website4_v2.jpg', 'GS3_FA25_HazelTao_Website3.jpg',
			'GS3_FA25_HazelTao_Website2.jpg', 'GS3_FA25_HazelTao_Swag2.jpg', 'GS3_FA25_HazelTao_3D-Application1.jpg',
			'GS3_FA25_-HazelTao_Spatial1.jpg',
			'Screenshot-2026-02-13-at-11.32.12AM.png', 'Screenshot-2026-02-13-at-11.32.01AM.png',
			'Arboretum-Instagram-Mockup.png', 'GS3_FA25_HazelTao_Website6.jpg', 'GS3_FA25_HazelTao_Website5.jpg',
			'GS3_FA25_HazelTao_Website7.jpg', 'GS3_FA25_-HazelTao_Swag1.jpg',
			'Arboretum_BrandBible_20-21.jpg', 'Arboretum_BrandBible_26-27.jpg', 'Arboretum_BrandBible_24-25.jpg',
			'Arboretum_BrandBible_32-33.jpg', 'Arboretum_BrandBible_50-51.jpg', 'Arboretum_BrandBible_40-41.jpg',
		],
		// 按交付内容分组排列图片（顺序和上面的 tags 一致）；第一张动态是顶部大图，属于品牌设计
		sections: [
			{ tag: 'Branding Design', rows: [
				['Screenshot-2026-02-13-at-11.32.12AM.png', 'Screenshot-2026-02-13-at-11.32.01AM.png'],
			] },
			{ tag: 'Identity Design', rows: [
				['Arboretum-Instagram-Mockup.png', 'GS3_FA25_HazelTao_Website6.jpg'],
				['GS3_FA25_HazelTao_Website5.jpg', 'GS3_FA25_HazelTao_Website7.jpg'],
			] },
			{ tag: 'Merchandise', rows: [
				['GS3_FA25_HazelTao_Swag2.jpg', 'GS3_FA25_HazelTao_3D-Application1.jpg'],
				['GS3_FA25_HazelTao_swag4.jpg', 'GS3_FA25_-HazelTao_Swag1.jpg'],
			] },
			{ tag: 'Exhibit Design', rows: [
				['J-A-Long-LED-Motion.mp4'],
				['GS3_FA25_-HazelTao_Promo3.mp4', 'GS3_FA25_HazelTao_Website3.jpg'],
				['GS3_FA25_HazelTao_Website2.jpg'],
				['GS3_FA25_HazelTao_Website4_v2.jpg', 'GS3_FA25_-HazelTao_Spatial1.jpg'],
			] },
			// Brand Bible 内页
			{ tag: 'Editorial Design', rows: [
				['Arboretum_BrandBible_20-21.jpg', 'Arboretum_BrandBible_26-27.jpg'],
				['Arboretum_BrandBible_24-25.jpg'],
				['Arboretum_BrandBible_32-33.jpg', 'Arboretum_BrandBible_50-51.jpg'],
				['Arboretum_BrandBible_40-41.jpg'],
			] },
		],
		text: [
			"A rebrand proposal for the <a href=\"https://arboretum.org/\">LA Arboretum &amp; Botanic Garden</a>, aimed at connecting it with a new audience of Millennials and Gen Z across LA County. But a rebrand doesn’t have to erase what came before: the peacock in the logo and the garden’s existing colors stay, reworked rather than replaced.",
			"The letterforms stretch in different proportions, the way plants grow at different speeds: some fast, some slow. I paired them with macro photography, close enough to almost smell the leaves, to make the garden feel alive for that younger audience.",
			"I first planned a pop-up with weekly workshops. Then I looked at the Arboretum’s calendar and found it already full of fun activities, like movie nights and watercolor classes. The garden wasn’t short on things to do; most people my age just didn’t know about them. So the project became about visibility: merchandise, a website, and a conceptual collaboration with Jennifer Steinkamp, an LA artist and UCLA professor whose immersive projections of trees, flowers, and fruit sit right between nature and spectacle—the kind of experience that draws people in right now.",
		],
		credits: 'Photography Credits: Yizhang Ding, @Bleachfeel, Jennifer Steinkamp',
	},
	{
		slug: 'taohe',
		title: 'Taohe',
		subtitle: 'Branding Design',
		year: 2026,
		tags: ['Branding Design', 'Digital Design', 'Stationery', 'Packaging', 'Brand Application', 'Product Photography'],
		services: ['Brand Strategy', 'Identity System', 'Packaging', 'E-commerce', 'Social'],
		format: '',
		cover: 'Taohe_social_3.jpg',
		thumb: 'Taohe_logo_motion_frame.jpg',
		media: [
			'Taohe_logo_motion_FIN.mp4',
			'Taohe_mobile_site.mp4', 'Taohe_social_3.jpg', 'Taohe_Instagram_Story.jpg', 'Taohe_product_web-copy.jpg',
			'Taohe_Stationary_Mockup.jpg', 'Taohe_pencil_mockup.jpg', 'Taohe_File_envelope.jpg', 'Taohe_PostCard_Mockup.jpg',
			'Taohe_package.jpg', 'Taohe_tape_mockup.jpg', 'taohe_boxes.jpg',
			'Taohe_StoreFront_week12.jpg', 'Taohe_StoreFront_3.jpg', 'TaoheHM_wrapping.jpg', 'taohe-hm_envelope.jpg', 'taohe-hm_shoppingbag.jpg', 'Taohe_DSCF0250.jpg', 'Taohe_DSCF0267.jpg',
			'Taohe_DSCF0187.jpg', 'Taohe_DSCF0008.jpg', 'Taohe_DSCF0083.jpg', 'Taohe_DSCF0132.jpg', 'Taohe_DSCF0263.jpg', 'Taohe_DSCF0221.jpg',
		],
		// 按交付内容分组；顶部的 logo 动态属于品牌设计
		sections: [
			{ tag: 'Digital Design', rows: [
				['Taohe_mobile_site.mp4'],
				['Taohe_social_3.jpg', 'Taohe_Instagram_Story.jpg'],
				['Taohe_product_web-copy.jpg'],
			] },
			{ tag: 'Stationery', rows: [
				['Taohe_Stationary_Mockup.jpg'],
				['Taohe_pencil_mockup.jpg', 'Taohe_File_envelope.jpg'],
				['Taohe_PostCard_Mockup.jpg'],
			] },
			{ tag: 'Packaging', rows: [
				['Taohe_package.jpg', 'Taohe_tape_mockup.jpg'],
				['taohe_boxes.jpg'],
			] },
			// 和 Herman Miller 的合作：店面、室内、包装、吊牌
			{ tag: 'Brand Application', rows: [
				['Taohe_StoreFront_week12.jpg'],
				['Taohe_StoreFront_3.jpg', 'TaoheHM_wrapping.jpg'],
				['taohe-hm_envelope.jpg', 'taohe-hm_shoppingbag.jpg'],
				['Taohe_DSCF0250.jpg', 'Taohe_DSCF0267.jpg'],
			] },
			{ tag: 'Product Photography', rows: [
				['Taohe_DSCF0187.jpg', 'Taohe_DSCF0008.jpg'],
				['Taohe_DSCF0083.jpg'],
				['Taohe_DSCF0132.jpg', 'Taohe_DSCF0263.jpg'],
				['Taohe_DSCF0221.jpg'],
			] },
		],
		text: [
			"My family dyes wool in Puyuan, China’s sweater town. As we expanded into making our own ready-to-wear, I noticed almost no one was working with yak wool—and in the U.S., most shoppers know cashmere but have barely heard of yak. TAOHE is the brand I built to fill that gap.",
			"I wanted to show that a traditional material can be pure and unadorned and still read as luxury. Researching competitors, I found that luxury cashmere tends to speak in thin, italic, delicate serifs. TAOHE goes the other way: heavy letterforms that carry the warmth and weight of yak wool, and type that rises and falls like the Tibetan mountains.",
			"My first logo sketches mapped Tibet itself, with abstract mountains and even coordinates, but they started to look like an outdoor gear brand. This is a family business, so the name had to be ours. “Tao” (陶) is my family name; “He” (和) means togetherness, and the rising stroke in the logo is the second tone you hear when you say it in Mandarin.",
		],
		credits: 'Photography Credits: Kin Codel, Honger (Hazel) Tao. Creative Director: Zaul Ocana',
	},
	{
		slug: 'held-still',
		title: 'Held Still',
		subtitle: 'Exhibition Design',
		year: 2026,
		tags: ['Exhibit Design', 'Book Design'],
		services: ['Exhibition Identity', 'Poster', 'Merchandise', 'Motion'],
		format: '',
		cover: 'Heldstill_display3.JPG',
		syncVideos: true,
		credits: 'Image Credits: Sarah Ball, Eska Marsh, Irving Penn, Paula Siebra, Nicolas Party, Lucas Blalock, Rachel Ruysch, Michael Borremans',
		thumb: 'HeldStill_Flag.jpg',
		media: [
			'HeldStill_Flag.jpg', 'HeldStill_BigFlag.jpg', 'Heldstill_display3.JPG', 'HeldStill_Ticket.jpg',
			'HeldStill_IDCard.jpg', 'Heldstill_display_3.jpg', 'Heldstill_display_5.jpg', 'Heldstill_display_4.jpg',
			'Heldstill_display_6.jpg',
			'HeldStill_FlipThrough-copy.mp4', 'HeldStill_FlipThrough-copy-2.mp4', 'HeldStill_FlipThrough-copy-3.mp4',
			'HeldStill_FlipThrough-copy-4.mp4', 'HeldStill_FlipThrough-copy-5.mp4', 'HeldStill_FlipThrough-copy-6.mp4',
		],
		// 按交付内容分组；顶部旗帜属于展览设计
		heroTag: 'Exhibit Design',
		sections: [
			{ tag: 'Exhibit Design', rows: [
				['HeldStill_BigFlag.jpg'],
				['Heldstill_display3.JPG', 'HeldStill_Ticket.jpg'],
				['HeldStill_IDCard.jpg'],
			] },
			{ tag: 'Book Design', rows: [
				['Heldstill_display_3.jpg'],
				['Heldstill_display_5.jpg', 'Heldstill_display_4.jpg'],
				['Heldstill_display_6.jpg'],
				['HeldStill_FlipThrough-copy.mp4', 'HeldStill_FlipThrough-copy-2.mp4'],
				['HeldStill_FlipThrough-copy-3.mp4', 'HeldStill_FlipThrough-copy-4.mp4'],
				['HeldStill_FlipThrough-copy-5.mp4', 'HeldStill_FlipThrough-copy-6.mp4'],
			] },
		],
		text: [
			"Years ago, I painted a still life of flowers and fruit, and I started with the hydrangea, because it would wilt first. The finished canvas showed everything at its best, but each object was caught at a different moment and stitched together. That is what draws me to still life: it looks frozen, yet time was passing the whole time it was painted. Held Still: When Time Becomes Visible gathers eight artists working in the genre, from Rachel Ruysch in the 17th century to Lucas Blalock today.",
			"The identity is built on the frame as a consistent super symbol. It always appears as a pair of diagonal corners that mimic the edges of a canvas and hold each work. The super symbol scales up across posters, banners, tickets and merchandise.",
			"The exhibition catalog is a long, narrow book of more than 200 pages, a push back against the big square gallery book. My first layouts set the text in static blocks; feedback pushed me to arrange it more organically, the way objects sit in a still life.",
		],
	},
	{
		slug: 'edge-of-visibility',
		title: 'Edge of Visibility',
		subtitle: 'Exhibit Design',
		year: 2025,
		tags: ['Identity Design', 'Exhibit Design'],
		services: ['Installation', 'Poster Series', 'Typography', 'Motion'],
		format: '',
		cover: 'EdgeOfVisibility_Mockup_08.png',
		thumb: 'EdgeOfVisibility_Mockup_14.png',
		media: [
			'EdgeOfVisibility_Motion_03.mp4', 'EdgeOfVisibility_Mockup_13.png',
			'EdgeOfVisibility_Mockup_14.png', 'EdgeOfVisibility_Mockup_02.png', 'EdgeOfVisibility_Mockup_01.png',
		],
		// 按交付内容分组；顶部手机动态属于视觉识别
		heroTag: 'Identity Design',
		sections: [
			{ tag: 'Identity Design', rows: [
				['EdgeOfVisibility_Mockup_13.png'],
			] },
			{ tag: 'Exhibit Design', rows: [
				['EdgeOfVisibility_Mockup_14.png', 'EdgeOfVisibility_Mockup_02.png'],
				['EdgeOfVisibility_Mockup_01.png'],
			] },
		],
		text: [
			"Watching JR’s documentary Paper and Glue, I realized that designers have a kind of superpower: we don’t need to be present for our work to affect people. JR’s paper portraits, pasted onto prison walls, changed how inmates saw the world outside their cells. I wanted my work to do something similar for people who pass things every day without really seeing them. That is where Edge of Visibility began.",
			"I built the project around Biomorphism, a movement grounded in organic forms from nature, like shells, cells, and the way living things grow. Type became the image: letters stretch and compress like growing forms, and the O’s in BIOMORPHISM turn into a shell and a sea urchin.",
			"The brief limited me to black, white, and one other color, which felt restrictive at first. I went back and forth between brown and yellow for a long time before choosing yellow: lively, untraditional, and full of life. The system travels across gallery walls, LED screens, and billboards, asking people to slow down, read, and rethink what they have missed.",
		],
	},
	{
		slug: 'sweetness-in-four-seasons', hidden: true, // 暂时不在网站上显示
		title: 'Sweetness in Four Seasons',
		subtitle: 'Risograph Design',
		year: 2026,
		tags: ['Calendar Design'],
		services: ['Print Design', 'Risograph', 'Calendar'],
		format: '',
		cover: 'IMG_5826.jpg',
		thumbPos: '61% 50%',
		media: [
			'IMG_5826.jpg',
			'Riso_scan_00.jpg', 'Riso_scan_01.jpg', 'Riso_scan_02.jpg',
			'Riso_scan_03.jpg', 'Riso_scan_04_straight.jpg', 'Riso_scan_05.jpg',
			'Riso_scan_06.jpg', 'Riso_scan_07.jpg', 'Riso_scan_08.jpg',
			'Riso_scan_09.jpg', 'Riso_scan_10.jpg', 'Riso_scan_11.jpg',
			'Riso_scan_12.jpg',
		],
		mat: true,
		// 两张一排，只有 6 月是整行大图
		rows: [
			['Riso_scan_00.jpg', 'Riso_scan_01.jpg'],
			['Riso_scan_02.jpg', 'Riso_scan_03.jpg'],
			['Riso_scan_04_straight.jpg', 'Riso_scan_05.jpg'],
			['Riso_scan_06.jpg'],
			['Riso_scan_07.jpg', 'Riso_scan_08.jpg'],
			['Riso_scan_09.jpg', 'Riso_scan_10.jpg'],
			['Riso_scan_11.jpg', 'Riso_scan_12.jpg'],
		],
		text: [
			'Sweetness In Four Season is a limited-edition desktop calendar project exploring the intersections of time, nature, and print craftsmanship. Centered around the concept of "phenological slices of time," the project translates the unique weather patterns, seasonal fruits, and emotional resonance of each month into abstract geometric compositions and distinct RISO spot-color overlays.',
		],
	},
	{
		slug: 'pied-piper', hidden: true, // 暂时不在网站上显示
		title: 'Pied Piper',
		subtitle: 'Album Design',
		year: 2024,
		tags: ['Album Design', 'Merchandise'],
		services: ['Illustration', 'Album Art'],
		format: '',
		cover: 'PiedPiper_vinyl_set.png',
		thumb: 'PiedPiper_CD_cover.jpg',
		media: ['PiedPiper_vinyl_set.png', 'FINALp3.png', 'FINALp4.jpg', 'FINALp5-copy.png'],
		text: [
			'<i>Pied Piper</i> creates a cohesive visual system for a Red Velvet-inspired album by illustrating a storyline based on key lyrics from five selected songs: “Cosmic,” “Peek-A-Boo,” “Bad Boy,” “Russian Roulette,” and “Feel My Rhythm.” Drawing from a personal concept of two contrasting realms—the gray, numbing Old World and the vibrant, dreamlike New World—the five illustrations visually narrate a transformation. Through symbolic imagery and evolving color palettes, the project shows Red Velvet’s members breaking through the bleakness, seducing the inhabitants into a utopia, and ultimately blending the two worlds into one cohesive vision.',
		],
	},
	{
		slug: 'serenseek',
		title: '‘Serenseek’ 寻真',
		subtitle: 'Branding Design',
		year: 2024,
		tags: ['Environmental', 'Branding Design', 'Packaging'],
		services: ['Branding Design', 'Spatial', 'Packaging', 'Stationery'],
		format: '',
		cover: 'Serenseek_main.png',
		thumb: 'Serenseek_main.png',
		media: [
			'Serenseek_main.png', 'Serenseek_scene1.png', 'Serenseek_scene5_v2.png', 'Serenseek_cup_hand.png',
			'Serenseek_flatlay.png', 'Serenseek_scene8.png', 'Serenseek_scene10.png',
			'Serenseek_scene9.png', 'Serenseek_scene11.jpg',
		],
		// 按交付内容分组；顶部招牌属于空间设计
		heroTag: 'Environmental',
		sections: [
			{ tag: 'Environmental', rows: [
				['Serenseek_scene5_v2.png'],
				['Serenseek_scene8.png', 'Serenseek_scene10.png'],
				['Serenseek_scene9.png'],
			] },
			{ tag: 'Branding Design', rows: [
				['Serenseek_flatlay.png'],
				['Serenseek_scene11.jpg'],
			] },
			{ tag: 'Packaging', rows: [
				['Serenseek_scene1.png', 'Serenseek_cup_hand.png'],
			] },
		],
		text: [
			"My father loves tea, but whenever he visits me in the U.S., the only place he can enjoy it is my living room. There is a coffee shop on every corner, yet almost nowhere to sit down and taste tea properly. Serenseek is the teahouse I wish he had.",
			"The name joins serene and seek. Its Chinese name, 寻真, means “seeking truth”: finding your true self, and a promise that the tea itself is genuine. The color palette comes straight from the leaves: white tea, green tea, black tea.",
			"I imagined Serenseek in New York City, for people in their late twenties to forties who grab coffee on the go and could reach for tea the same way. I debated how traditional the identity should feel, then chose abstract gradient shapes over classic tea motifs, so the brand reads as contemporary while staying calm. In a city as chaotic as New York, it is a place to slow down and rest.",
		],
	},
	{
		slug: 'wuzhen-theater-festival', hidden: true, // 暂时不在网站上显示
		title: 'Wuzhen Theater Festival',
		subtitle: 'Branding Design',
		year: 2024,
		tags: ['Branding Design', 'Identity Design', 'Catalog Design'],
		services: ['Branding Design', 'Identity System'],
		format: '',
		cover: 'Wuzhen_main_cropped.png',
		thumb: 'Wuzhen_flag_display.png',
		media: ['Wuzhen_main_cropped.png', 'FINALp3-2.jpg', 'FINALp4.jpeg'],
		text: [
			'This branding project reimagines the visual identity of the Wuzhen Theatre Festival, an international celebration of performance and art held in the rapidly modernizing city of Wuzhen, China. As a native of the region, I was inspired to create a design system that reflects the city’s growing global presence and cultural vibrancy. Moving away from the outdated water-ink textures and muddled logo of past years, my new design embraces bold colors, simplified shapes, and theatrical motifs to capture the festival’s spirit of joy, openness, and creativity.',
		],
	},
	{
		slug: 'huayings-recipe',
		title: 'Huaying’s Recipe',
		subtitle: 'Print Design',
		year: 2024,
		tags: ['Print Design', 'Calendar Design'],
		services: ['Calendar', 'Illustration', 'Print Design'],
		format: '',
		cover: 'Huaying_main.png',
		thumb: 'Huaying_calendar_unfolded.png',
		media: ['Huaying_main.png', 'FINALp2-03.png', 'FINALp2-04.png'],
		text: [
			"A red-and-green paper calendar hung on my grandmother’s kitchen wall. She tore off a page every day but never threw it away: she folded each one into a little box that we used as bone dishes at dinner. Huaying always said she wanted to teach me every one of her best dishes, but we never had the chance to. <i>Huaying’s Recipe</i> turns that calendar into the recipes she meant to pass down.",
			"Each month holds one of her signature dishes, ordered by season and festival. When the weather turns cold, she starts making drunken chicken, which has to rest at room temperature and would spoil in the heat.",
			"I chose Risograph before I started designing. Simple, abstract shapes and warm ink colors bring back her kitchen and the red apron she always wore. The calendar unfolds like an accordion into one long strip, so she can hang it on her wall just like her old one.",
		],
	},
	{
		slug: 'find-your-voice',
		title: 'Find Your Voice',
		subtitle: 'Editorial Design',
		year: 2024,
		tags: ['Booklet Design'],
		services: ['Editorial Design', 'Typography'],
		format: '22×11”',
		cover: 'Interconnection.png',
		thumb: 'Interconnection.png',
		media: [
			'Interconnection.png',
			'1771977244038-086e7f39-f791-4595-a5f4-bbad5819a0a6_3.jpg', '1771977244038-086e7f39-f791-4595-a5f4-bbad5819a0a6_4.jpg',
			'1771977244038-086e7f39-f791-4595-a5f4-bbad5819a0a6_5.jpg', '1771977244038-086e7f39-f791-4595-a5f4-bbad5819a0a6_6.jpg',
			'1771977244038-086e7f39-f791-4595-a5f4-bbad5819a0a6_7.jpg', '1771977244038-086e7f39-f791-4595-a5f4-bbad5819a0a6_8.jpg',
			'1771977244038-086e7f39-f791-4595-a5f4-bbad5819a0a6_9.jpg', '1771977244038-086e7f39-f791-4595-a5f4-bbad5819a0a6_10.jpg',
			'1771977244038-086e7f39-f791-4595-a5f4-bbad5819a0a6_11.jpg', '1771977244038-086e7f39-f791-4595-a5f4-bbad5819a0a6_12.jpg',
		],
		// 图片节奏：通栏和两张并排交替
		rows: [
			['1771977244038-086e7f39-f791-4595-a5f4-bbad5819a0a6_3.jpg'],
			['1771977244038-086e7f39-f791-4595-a5f4-bbad5819a0a6_4.jpg', '1771977244038-086e7f39-f791-4595-a5f4-bbad5819a0a6_5.jpg'],
			['1771977244038-086e7f39-f791-4595-a5f4-bbad5819a0a6_6.jpg'],
			['1771977244038-086e7f39-f791-4595-a5f4-bbad5819a0a6_7.jpg', '1771977244038-086e7f39-f791-4595-a5f4-bbad5819a0a6_8.jpg'],
			['1771977244038-086e7f39-f791-4595-a5f4-bbad5819a0a6_9.jpg'],
			['1771977244038-086e7f39-f791-4595-a5f4-bbad5819a0a6_10.jpg'],
			['1771977244038-086e7f39-f791-4595-a5f4-bbad5819a0a6_11.jpg', '1771977244038-086e7f39-f791-4595-a5f4-bbad5819a0a6_12.jpg'],
		],
		text: [
			'“Find Your Voice” is an editorial-length typographic design created for my “Typography II” project, titled “Interconnection.” The goal of this project was to establish an organized structure for both written and visual content while allowing room for theme and variation to keep the reader continuously engaged.',
		],
	},
	{
		slug: 'lume', hidden: true, // 暂时不在网站上显示
		title: 'Lume',
		subtitle: 'Branding Design',
		year: 2024,
		tags: ['Identity Design'],
		services: ['Branding Design', 'Editorial Design', 'Stationery'],
		format: '',
		cover: 'Lume-Front-Cover-Mockuo.jpg',
		thumb: 'Lume-Busniess-Card-Mockup.jpg',
		solo: ['Lume-Spread-Mockuop.jpg'],
		media: [
			'SP25-Lume-Statement-Page.jpg',
			'Lume-Busniess-Card-Mockup.jpg', 'Lume-Busniess-Card-Mockup-2.jpg',
			'Lume-Front-Cover-Mockuo.jpg', 'Lume-Inner-Spread-Mockup.jpg', 'Lume-Spread-Mockuop.jpg',
		],
		text: [
			'Lume is a semi-branding project designed to provide thoughtful services for pet funerals. Although I am not a pet owner myself, being surrounded by friends and family who are has made me aware of the need for aftercare services that are visible, dignified, and well-established.',
			'Lume does not aim to depict death in a desperate or hopeless way. Instead, the brand seeks to provide a sense of comfort, reassurance, and reliability. This is primarily achieved through transparency, layered visual elements, and subtle, muted design choices. The goal is to create an identity that feels gentle, trustworthy, and emotionally supportive, offering a meaningful experience for pet owners navigating a difficult time.',
		],
	},
];
