# hazeltao-site-porto

hazeltao.design 的新版本，版式和交互参考 portorocha.com（只参考布局，图片、文字都是自己的，字体沿用旧站）。
纯 HTML + CSS + JavaScript，不需要安装任何东西。原来的网站在 `hazeltao-site`，这个文件夹和它互不影响。

## 页面

| 文件 | 内容 |
| --- | --- |
| `index.html` | 首页：左栏名字、时钟、项目卡片（往下滚时没滚到的卡片在底部叠成一摞），右栏每个项目一张大卡片 |
| `project.html?p=项目名` | 项目页（自动生成）：大图、标题、文字卡片、信息、其余图片，点图可放大翻页 |
| `all.html` | Show all projects：三列瀑布流加搜索 |
| `about.html` | 简历，直接改这个文件里的文字 |

左上角的开关切换黑白背景，会记住访客的选择。

## 文件

| 文件 | 内容 |
| --- | --- |
| `data.js` | **所有项目的文字和图片都在这里**；时钟的城市和左栏 About 文字也在最上面 |
| `style.css` | 颜色、字体、圆角、间距（最上面 `:root` 改整站） |
| `site.js` | 交互，一般不用改 |
| `sizes.js` | 图片尺寸表，用来排版 |
| `images/` `videos/` | 原图和视频（从 hazeltao-site 复制） |
| `thumbs/` | 小图（900px），文件名是原图名后面加 `.jpg` |

## 预览

VS Code 打开这个文件夹，安装 Live Server，右键 `index.html` → Open with Live Server。

## 加一个新项目

1. 图片放进 `images/`，视频放进 `videos/`
2. 在 `data.js` 的 `window.PROJECTS` 里复制一整段 `{ ... },`，改 slug（网址用，只能英文和横线）、标题、副标题、年份、media、text
3. 给封面做小图（Mac 终端里，在这个文件夹下运行）：

```
sips -s format jpeg -Z 900 images/新图片.jpg --out thumbs/新图片.jpg.jpg
```

## 字体

和旧站一样：优先用 Monument Grotesk Mono（电脑上装了才会显示），否则用免费的 Google 字体 DM Mono。
