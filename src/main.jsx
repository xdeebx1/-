import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { A, F as FILMS, S as SONGS } from './data';
import './styles.css';

const byYear = (a, b) => (a.y == null ? Infinity : a.y) - (b.y == null ? Infinity : b.y);
const yearLabel = year => year == null ? 'غير محددة' : ar(year);
const F = [...FILMS].sort(byYear);
const S = [...SONGS].sort(byYear);
const K = { sing: 'الغناء', act: 'التمثيل', dir: 'الإخراج', comp: 'التلحين', lyr: 'كتابة الكلمات' };
const ar = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const no = i => ar(String(i + 1).padStart(3, '0'));
const nz = s => s.toLowerCase().replace(/[\u064B-\u0652\u0640]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه');
const dg = s => s.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
const bd = y => (y.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).match(/\d+/) || [0])[0];
const AM = Object.fromEntries(A.map(x => [x.id, x]));
const FM = Object.fromEntries(F.map(x => [x.id, x]));
const SM = Object.fromEntries(S.map(x => [x.id, x]));
const AR = A.filter(x => x.w.length);

const IMG = {
  'artist:umm': { u: '/images/artist-umm.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'أم كلثوم في صورة فوتوغرافية بجوار الأهرامات' },
  'artist:halim': { u: '/images/artist-halim.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'عبد الحليم حافظ في صورة فوتوغرافية' },
  'artist:wahab': { u: '/images/film-wardaabyad.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'محمد عبد الوهاب في ملصق فيلم الوردة البيضاء (1933)' },
  'artist:farid': { u: '/images/artist-farid.jpg', c: 'ويكيميديا كومنز · CC BY-SA ٣٫٠', alt: 'فريد الأطرش ممثلاً ومطرباً يحمل العود' },
  'artist:asmahan': { u: '/images/artist-asmahan.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'أسمهان في صورة شخصية بالأبيض والأسود' },
  'artist:laila': { u: '/images/artist-laila.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'ليلى مراد في صورة شخصية بالأبيض والأسود في الأربعينيات' },
  'artist:sabah': { u: '/images/artist-sabah.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'صباح في صورة من عام 1961' },
  'artist:faten': { u: '/images/film-faten.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'فاتن حمامة في صورة فوتوغرافية' },
  'artist:shadia': { u: '/images/film-shadia.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'شادية في صورة فوتوغرافية من عام 1957' },
  'artist:omar': { u: '/images/artist-omar.jpg', c: 'ويكيميديا كومنز · CC0', alt: 'عمر الشريف في بطولة بريدج بأمستردام عام 1967' },
  'artist:ismail': { u: '/images/film-ismail.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'إسماعيل ياسين في صورة فوتوغرافية' },
  'artist:soad': { u: '/images/film-zoza.jpg', c: 'ويكيميديا كومنز · الملكية العامة', alt: 'سعاد حسني في صورة فوتوغرافية' },
  'artist:hind': { u: '/images/film-hind.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'هند رستم في صورة فوتوغرافية من خمسينيات القرن العشرين' },
  'artist:nadia': { u: '/images/artist-nadia.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'نادية لطفي في صورة فوتوغرافية' },
  'artist:tahia': { u: '/images/artist-tahia.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'تحية كاريوكا في صورة فوتوغرافية' },
  'artist:samia': { u: '/images/artist-samia.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'سامية جمال في صورة فوتوغرافية' },
  'artist:rihani': { u: '/images/artist-rihani.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'نجيب الريحاني في صورة فوتوغرافية' },
  'artist:wahbi': { u: '/images/artist-wahbi.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'يوسف وهبي في صورة فوتوغرافية' },
  'artist:meligy': { u: '/images/film-meligy.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'محمود المليجي في لقطة من فيلم سيف الجلاد (1944)' },
  'artist:rushdy': { u: '/images/artist-rushdy.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'رشدي أباظة في صورة فوتوغرافية' },
  'artist:zulfikar': { u: '/images/artist-zulfikar.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'صلاح ذو الفقار في صورة فوتوغرافية' },
  'artist:wagdi': { u: '/images/artist-wagdi.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'أنور وجدي في صورة فوتوغرافية' },
  'film:intisar': { u: '/images/artist-asmahan.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'أسمهان بطلة فيلم انتصار الشباب (1941)' },
  'film:wardaabyad': { u: '/images/film-wardaabyad.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'ملصق فيلم الوردة البيضاء (1933)' },
  'film:wedad': { u: '/images/film-wedad.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'أم كلثوم في فيلم وداد (1936)' },
  'film:salama': { u: '/images/film-salama.png', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'لقطة من فيلم سلامة (1945)' },
  'film:ghazl': { u: '/images/film-ghazl.jpg', c: 'ويكيميديا كومنز · الملكية العامة', alt: 'نجيب الريحاني مع بعض الممثلين في كواليس غزل البنات (1949)' },
  'film:afrita': { u: '/images/film-afrita.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'فريد الأطرش وسامية جمال في عفريتة هانم (1949)' },
  'film:sira': { u: '/images/film-faten.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'فاتن حمامة بطلة صراع في الوادي (1954)' },
  'film:ismailg': { u: '/images/film-ismail.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'إسماعيل ياسين بطل إسماعيل ياسين في الجيش (1955)' },
  'film:lahn': { u: '/images/artist-halim.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'عبد الحليم حافظ بطل لحن الوفاء (1955)' },
  'film:shabab': { u: '/images/film-shadia.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'شادية بطلة شباب امرأة (1956)' },
  'film:bab': { u: '/images/film-hind.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'هند رستم بطلة باب الحديد (1958)' },
  'film:bayn': { u: '/images/film-faten.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'فاتن حمامة بطلة بين الأطلال (1959)' },
  'film:doaa': { u: '/images/film-faten.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'فاتن حمامة بطلة دعاء الكروان (1959)' },
  'film:zawja': { u: '/images/film-shadia.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'شادية بطلة الزوجة الثانية (1967)' },
  'film:abi': { u: '/images/artist-halim.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'عبد الحليم حافظ بطل أبي فوق الشجرة (1969)' },
  'film:ard': { u: '/images/film-meligy.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'محمود المليجي ويوسف وهبي في لقطة من فيلم سيف الجلاد (1944)، والمليجي بطل الأرض' },
  'film:zoza': { u: '/images/film-zoza.jpg', c: 'ويكيميديا كومنز · الملكية العامة', alt: 'سعاد حسني في لقطة من فيلم خلي بالك من زوزو (1972)' },
  'film:karnak': { u: '/images/film-karnak.jpg', c: 'ويكيميديا كومنز · الملكية العامة', alt: 'ملصق فيلم الكرنك (1975)' },
  'film:mummy': { u: '/images/film-mummy.jpg', c: 'ويكيميديا كومنز · الملكية العامة المصرية', alt: 'ملصق فيلم المومياء لعام ١٩٦٩' }
};

function LinkName({ name }) {
  const a = A.find(x => x.ar === name);
  return a ? <a href={`#/artist/${a.id}`}>{name}</a> : name;
}

function Placeholder({ label, cls = '', itemKey }) {
  const image = itemKey ? IMG[itemKey] : null;
  if (image) return <figure className={`ph ${cls} photo`}><img src={image.u} alt={image.alt || label} loading="lazy" /></figure>;
  return <figure className={`ph ${cls}`} role="img" aria-label={label}>
    <span>{cls === 'portrait' ? 'صورة أرشيفية' : 'صورة'}<br />تُستكمل من مصدر موثّق</span>
  </figure>;
}

function Header({ openQuick }) {
  const [open, setOpen] = useState(false);
  const route = (location.hash.replace('#/', '').split('/')[0] || 'home');
  const mapped = { artist: 'artists', film: 'works', song: 'works' }[route] || route;
  useEffect(() => setOpen(false), [route]);
  return <header className="bar">
    <a className="mark" href="#/" aria-label="الرئيسية"><b>سينماتيك</b><i>Egyptian Golden Age</i></a>
    <button className="menu" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(v => !v)}>القائمة</button>
    <nav id="nav" className={open ? 'open' : ''} aria-label="التصفح الرئيسي">
      <a href="#/artists" aria-current={mapped === 'artists' ? 'page' : undefined}>الوجوه</a>
      <a href="#/works" aria-current={mapped === 'works' ? 'page' : undefined}>الأعمال</a>
      <a href="#/timeline" aria-current={mapped === 'timeline' ? 'page' : undefined}>العصور</a>
      <a id="sb" href="#/search" aria-current={mapped === 'search' ? 'page' : undefined} onClick={e => { e.preventDefault(); openQuick(); }}>بحث</a>
    </nav>
  </header>;
}

function Crumb({ section, title, current }) {
  return <p className="crumb"><a href="#/">الرئيسية</a><span>‹</span><a href={section}>{title}</a><span>‹</span>{current}</p>;
}

function PrevNext({ items, i, type }) {
  if (i < 0) return null;
  return <p className="pn">
    {i > 0 ? <a className="prev" href={`#/${type}/${items[i - 1].id}`}>→ {items[i - 1].ar}</a> : <span />}
    {i < items.length - 1 ? <a className="next" href={`#/${type}/${items[i + 1].id}`}>{items[i + 1].ar} ←</a> : <span />}
  </p>;
}

function ShareAndTail({ related = [], items, i, type }) {
  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: document.title, url: location.href }); } catch {}
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(location.href);
    }
  };
  return <>
    {related.length > 0 && <div className="sec"><h2>قد يهمك أيضًا</h2><p>{related.map((x, n) => <React.Fragment key={x[0]}>{n ? ' · ' : ''}<a href={x[0]}>{x[1]}</a></React.Fragment>)}</p></div>}
    <p className="share"><button className="sh" type="button" onClick={share}>مشاركة الصفحة</button></p>
    <PrevNext items={items} i={i} type={type} />
  </>;
}

function Home() {
  const featuredSong = SM.enta;
  const featuredFilm = FM.wedad;
  const featuredFilmImage = IMG[`film:${featuredFilm.id}`];
  const featuredArtist = AM.asmahan;
  const featuredArtistImage = IMG[`artist:${featuredArtist.id}`];
  const artistFilm = FM.intisar;
  const eras = [
    { href: '#/timeline/1933', period: '١٩٢٧–١٩٣٩', title: 'البدايات', work: 'الوردة البيضاء · ١٩٣٣', image: IMG['film:wardaabyad'] },
    { href: '#/timeline/1949', period: '١٩٤٠–١٩٥٩', title: 'زمن الكبار', work: 'غزل البنات · ١٩٤٩', image: IMG['film:ghazl'] },
    { href: '#/timeline/1969', period: '١٩٦٠–١٩٧٧', title: 'الشاشة تتجدد', work: 'المومياء · ١٩٦٩', image: IMG['film:mummy'] }
  ];
  return <section className="view">
    <div className="home-grid">
      <div className="years" aria-hidden="true"><span>١٩٢٧</span><span className="dash"></span><span>١٩٧٧</span></div>
      <div className="home-lead">
        <p className="kicker">أرشيف ثقافي · نصف قرن من الفن المصري</p>
        <h1>كانت القاهرة <em>تُغنّي</em><br />وكانت الشاشة تُصغي</h1>
        <p className="lede">فهرس مفتوح لوجوه السينما والموسيقى المصرية بين أول فيلم روائي طويل ورحيل عبد الحليم. كل بطاقة تقود إلى أخرى: مطربة إلى ملحّنها، وفيلم إلى مخرجه، وأغنية إلى سنتها.</p>
        <a className="btn" href="#/artists">افتح الفهرس</a>
      </div>
      <figure className="ph tall photo" aria-label="صورة أم كلثوم"><img src="/images/artist-umm.jpg" alt="أم كلثوم في صورة شخصية من عام ١٩٦٧" loading="lazy" /><figcaption>أم كلثوم · بطاقة رقم ٠٠١</figcaption></figure>
    </div>
    <div className="strip" aria-label="مختارات">
      <a href="#/artist/umm"><small>٠٠١</small><b>أم كلثوم</b><i>Umm Kulthum</i></a>
      <a href="#/artist/halim"><small>٠٠٢</small><b>عبد الحليم حافظ</b><i>Abdel Halim Hafez</i></a>
      <a href="#/film/doaa"><small>فيلم</small><b>دعاء الكروان</b><i>١٩٥٩</i></a>
      <a href="#/song/enta"><small>أغنية</small><b>أنت عمري</b><i>١٩٦٤</i></a>
    </div>
    <p className="counts">في الفهرس الآن: {ar(A.length)} اسمًا · {ar(F.length)} فيلمًا · {ar(S.length)} أغانٍ</p>
    <section className="home-eras" aria-labelledby="home-eras-title">
      <header className="home-eras-head">
        <p className="kicker">من الأرشيف</p>
        <h2 id="home-eras-title">ابدأ الرحلة من هنا</h2>
        <p>ثلاث محطات في حكاية الغناء والسينما المصرية.</p>
      </header>
      <div className="home-era-grid">
        {eras.map(era => <a className="home-era-card" href={era.href} key={era.href}>
          <img src={era.image.u} alt={era.image.alt} loading="lazy" />
          <div className="home-era-copy">
            <small>{era.period}</small>
            <h3>{era.title}</h3>
            <span>{era.work}</span>
          </div>
        </a>)}
      </div>
    </section>
    <article className="home-story" aria-labelledby="home-story-title">
      <figure className="home-story-photo ph photo">
        <img src={IMG['artist:umm'].u} alt="أم كلثوم في صورة فوتوغرافية من عام ١٩٦٧" loading="lazy" />
        <figcaption>أم كلثوم</figcaption>
      </figure>
      <div className="home-story-copy">
        <p className="kicker">حكاية من الأرشيف · {ar(featuredSong.y)}</p>
        <h2 id="home-story-title"><a href={`#/song/${featuredSong.id}`}>{featuredSong.ar}</a></h2>
        <p>من أشهر الأعمال المشتركة، وتنسج الأغنية حكاية حب طويلة في صياغة عاطفية.</p>
        <p className="home-story-credits"><b>غناء</b> <LinkName name={featuredSong.s} /> · <b>تلحين</b> <LinkName name={featuredSong.c} /> · <b>كلمات</b> {featuredSong.l}</p>
      </div>
    </article>
    <article className="home-story" aria-labelledby="home-film-title">
      <figure className="home-story-photo ph photo">
        <img src={featuredFilmImage.u} alt={featuredFilmImage.alt} loading="lazy" />
        <figcaption>{featuredFilm.ar} · {ar(featuredFilm.y)}</figcaption>
      </figure>
      <div className="home-story-copy">
        <p className="kicker">حكاية فيلم · {ar(featuredFilm.y)}</p>
        <h2 id="home-film-title"><a href={`#/film/${featuredFilm.id}`}>{featuredFilm.ar}</a></h2>
        <p>ظهرت أم كلثوم في «وداد» في تجربة سينمائية مبكرة جمعت الغناء بالدراما على الشاشة.</p>
        <p className="home-story-credits"><b>إخراج</b> <LinkName name={featuredFilm.d} /> · <b>بطولة</b> {featuredFilm.c.split('،').map((name, index) => <React.Fragment key={name}>{index ? ' · ' : ''}<LinkName name={name} /></React.Fragment>)}</p>
      </div>
    </article>
    <article className="home-story home-person-story" aria-labelledby="home-person-title">
      <figure className="home-story-photo ph photo">
        <img src={featuredArtistImage.u} alt={featuredArtistImage.alt} loading="lazy" />
        <figcaption>{featuredArtist.ar}</figcaption>
      </figure>
      <div className="home-story-copy">
        <p className="kicker">وجه من الأرشيف</p>
        <h2 id="home-person-title"><a href={`#/artist/${featuredArtist.id}`}>{featuredArtist.ar}</a></h2>
        <p>{featuredArtist.t}</p>
        <p className="home-story-credits"><b>من أفلامها</b> <a href={`#/film/${artistFilm.id}`}>{artistFilm.ar}</a> · {ar(artistFilm.y)}</p>
      </div>
    </article>
  </section>;
}

function Artists({ filter = 'all' }) {
  const [sort, setSort] = useState('i');
  const [decade, setDecade] = useState('all');
  const rows = useMemo(() => {
    const items = A.map((a, i) => ({ ...a, i }));
    if (sort === 'n') items.sort((a, b) => a.ar.localeCompare(b.ar, 'ar'));
    if (sort === 'b') items.sort((a, b) => bd(a.y) - bd(b.y));
    return items;
  }, [sort]);
  const visible = rows.filter(a => (filter === 'all' || (filter === 'back' ? a.r.includes('dir') || a.r.includes('comp') || a.r.includes('lyr') : a.r.includes(filter))) &&
    (decade === 'all' || Math.floor(Number(bd(a.y)) / 10) * 10 === Number(decade)));
  const letters = [...new Set(A.map(a => nz(a.ar)[0]))].sort((a, b) => a.localeCompare(b, 'ar'));
  const clear = () => { setDecade('all'); location.hash = '#/artists'; setSort('i'); };
  return <section className="view"><header className="head"><p className="kicker">الفهرس العام</p><h1>الوجوه</h1>
    <div className="filters" role="group" aria-label="تصفية">
      {[['all','الكل'],['sing','الغناء'],['act','التمثيل'],['back','الإخراج والتلحين والكلمات']].map(([v,l]) =>
        <button key={v} type="button" className={filter === v ? 'on' : ''} aria-pressed={filter === v} onClick={() => location.hash = `#/artists/${v}`}>{l}</button>)}
    </div>
    <div className="filters" role="group" aria-label="سنة الميلاد">
      {[['all','كل المواليد'],['1880','مواليد ١٨٨٠'],['1890','مواليد ١٨٩٠'],['1900','مواليد ١٩٠٠'],['1910','مواليد ١٩١٠'],['1920','مواليد ١٩٢٠'],['1930','مواليد ١٩٣٠'],['1940','مواليد ١٩٤٠']].map(([v,l]) =>
        <button key={v} type="button" className={decade === v ? 'on' : ''} aria-pressed={decade === v} onClick={() => setDecade(v)}>{l}</button>)}
    </div>
    <p className="alpha" aria-label="فهرس أبجدي">{letters.map(c => <button key={c} type="button" className="al" onClick={() => {
      setSort('n');
      setTimeout(() => document.querySelector(`[data-letter="${c}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0);
    }}>{c}</button>)}</p>
    <select className="sort" value={sort} onChange={e => setSort(e.target.value)} aria-label="الترتيب"><option value="i">الترتيب: حسب الفهرس</option><option value="n">أبجديًا</option><option value="b">الأقدم ميلادًا</option></select>
    <p className="count" aria-live="polite">{ar(visible.length)} نتيجة</p><button className="clear" type="button" hidden={filter === 'all' && decade === 'all'} onClick={clear}>مسح التصفية</button>
  </header><ol className="index">{visible.map(a => a.w.length
    ? <li key={a.id} data-letter={nz(a.ar)[0]}><a href={`#/artist/${a.id}`}><span className="no">{no(a.i)}</span><b>{a.ar}</b><i>{a.en}</i><span className="yr">{a.y}</span></a></li>
    : <li key={a.id} data-letter={nz(a.ar)[0]}><span className="rowin"><span className="no">{no(a.i)}</span><b>{a.ar}</b><i>{a.en}</i><span className="yr">{a.y} · بلا أعمال بعد</span></span></li>)}</ol>{visible.length === 0 && <p className="empty">لا نتائج بهذه التصفية.</p>}</section>;
}

function spotifyTrackId(record = {}, spotifyUrl = '') {
  if (record.spotifyTrackId) return String(record.spotifyTrackId).trim();
  if (record.trackId) return String(record.trackId).trim();
  const candidate = record.spotifyUrl || spotifyUrl;
  if (!candidate) return '';
  const match = String(candidate).match(/(?:open\.spotify\.com\/(?:embed\/)?track\/|spotify:track:)([A-Za-z0-9]+)/);
  return match?.[1] || '';
}

function formatAudioTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

function AudioPlayer({ src, title, onPlayingChange }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      setError('');
      try {
        await audio.play();
      } catch {
        setError('تعذر تشغيل المقطع. يرجى التحقق من مصدر الصوت والمحاولة مجددًا.');
      }
    } else {
      audio.pause();
    }
  };

  const updateDuration = event => {
    const audioDuration = event.currentTarget.duration;
    setDuration(Number.isFinite(audioDuration) ? audioDuration : 0);
  };

  return <div>
    <audio
      ref={audioRef}
      className="audio-source"
      aria-hidden="true"
      preload="none"
      src={src}
      onTimeUpdate={event => setCurrentTime(event.currentTarget.currentTime)}
      onLoadedMetadata={updateDuration}
      onDurationChange={updateDuration}
      onPlay={() => { setPlaying(true); onPlayingChange?.(true); }}
      onPause={() => { setPlaying(false); onPlayingChange?.(false); }}
      onEnded={() => { setPlaying(false); setCurrentTime(0); onPlayingChange?.(false); }}
      onError={() => setError('تعذر تحميل المقطع الصوتي. يرجى المحاولة لاحقًا.')}
    />
    <div className="audio-player">
      <button
        className="audio-play"
        type="button"
        aria-label={`${playing ? 'إيقاف مؤقت' : 'تشغيل'} ${title}`}
        onClick={togglePlayback}
      >
        <span className="audio-icon" data-playing={playing} aria-hidden="true" />
      </button>
      <div className="audio-timeline">
        <input
          className="audio-seek"
          type="range"
          dir="ltr"
          min="0"
          max={duration || 0}
          step="0.1"
          value={Math.min(currentTime, duration)}
          aria-label={`موضع التشغيل في ${title}`}
          aria-valuetext={`${formatAudioTime(currentTime)} من ${formatAudioTime(duration)}`}
          disabled={!duration}
          onChange={event => {
            const time = Number(event.target.value);
            audioRef.current.currentTime = time;
            setCurrentTime(time);
          }}
        />
        <div className="audio-times" aria-hidden="true" dir="ltr">
          <span>{formatAudioTime(currentTime)}</span>
          <span>{formatAudioTime(duration)}</span>
        </div>
      </div>
    </div>
    {error && <p className="audio-error" role="status">{error}</p>}
  </div>;
}

function SpotifyEmbed({ record = {}, title = '', spotifyUrl = '', compact = false, onPlayingChange }) {
  if (record.audioUrl) {
    return <div className="spotify-player">
      {!compact && <h2>استماع</h2>}
      <AudioPlayer src={record.audioUrl} title={title} onPlayingChange={onPlayingChange} />
    </div>;
  }
  const trackId = spotifyTrackId(record, spotifyUrl);
  if (!trackId) {
    return <p className="note">لا يوجد مسار Spotify مضاف لتشغيل «{title}» حاليًا.</p>;
  }
  return <div className="spotify-player">
    {!compact && <h2>استماع على Spotify</h2>}
    <iframe
      title={`تشغيل ${title} على Spotify`}
      src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
      width="100%"
      height={compact ? '152' : '352'}
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      style={{ display: 'block', maxWidth: '100%', borderRadius: '12px' }}
    />
  </div>;
}

function ArtistPreviews({ artist, songs }) {
  const [open, setOpen] = useState(false);
  return <div className="sec">
    <h2>الموسيقى</h2>
    <p>تشغيل الأعمال المضافة سابقًا عبر المشغّلات المتاحة داخل الصفحة.</p>
    <button className="sh" type="button" onClick={() => setOpen(v => !v)} aria-expanded={open}>
      {open ? 'إخفاء المعاينات' : 'تشغيل معاينات الأعمال'}
    </button>
    {open && songs.slice(0, 8).map(song => <div key={song.href}>
      <h2><a href={song.href}>{song.title}</a></h2>
      {(() => {
        const record = S.find(x => x.ar === song.title);
        return <SpotifyEmbed record={record} title={song.title} compact />;
      })()}
    </div>)}
  </div>;
}

function Artist({ id }) {
  const a = AM[id];
  if (!a) return <NotFound />;
  const i = A.indexOf(a);
  const works = a.w.map(x => {
    const film = x[0] === 'f';
    const o = (film ? FM : SM)[x.slice(2)];
    if (!o) return null;
    let role = '—';
    if (film) role = [o.d === a.ar && 'إخراج', o.c.includes(a.ar) && 'بطولة'].filter(Boolean).join(' و') || '—';
    else role = o.s === a.ar ? 'غناء' : o.c === a.ar ? 'تلحين' : o.l === a.ar ? 'كلمات' : '—';
    return { y: o.y, href: `#/${film ? 'film' : 'song'}/${o.id}`, title: o.ar, kind: film ? 'فيلم' : 'أغنية', role };
  }).filter(Boolean).sort(byYear);
  const co = A.filter(b => b !== a && b.w.some(x => a.w.includes(x)));
  const related = AR.filter(b => b !== a && b.r[0] === a.r[0] && !co.includes(b)).slice(0, 5).map(b => [`#/artist/${b.id}`, b.ar]);
  const linkedSongs = works.filter(w => w.kind === 'أغنية');
  const filmWorks = works.filter(w => w.kind === 'فيلم');
  const nonFilmWorks = works.filter(w => w.kind !== 'فيلم');
  return <section className="view"><Crumb section="#/artists" title="الوجوه" current={a.ar} />
    <article className="profile"><Placeholder label={`صورة ${a.ar}`} cls="portrait" itemKey={`artist:${a.id}`} /><div className="profile-text">
      <p className="kicker">بطاقة {no(i)} · {a.r.map(x => K[x]).join(' · ')}</p><h1>{a.ar}</h1><p className="latin">{a.en}</p><p className="pull">{a.t}</p>
      <dl className="facts">
        <div><dt>السنوات</dt><dd>{a.y}</dd></div>
        {a.birthPlace && <div><dt>مكان الميلاد</dt><dd>{a.birthPlace}</dd></div>}
        {a.realName && <div><dt>الاسم الحقيقي</dt><dd>{a.realName}</dd></div>}
        {a.nickname && <div><dt>اسم الشهرة</dt><dd>{a.nickname}</dd></div>}
        {a.deathPlace && <div><dt>مكان الوفاة</dt><dd>{a.deathPlace}</dd></div>}
        <div><dt>المجال</dt><dd>{a.r.map(x => K[x]).join(' · ')}</dd></div>
      </dl>
      {a.bio && <div className="sec"><h2>السيرة</h2>{a.bio.map((p,n) => <p key={n}>{p}</p>)}</div>}
      {a.family && <div className="sec"><h2>الأسرة</h2><p>{a.family}</p></div>}
      {a.r.includes('act') && <div className="sec"><h2>المسيرة السينمائية</h2>{filmWorks.length ? <div className="tw"><table className="works"><thead><tr><th>السنة</th><th>الفيلم</th><th>الصفة</th></tr></thead><tbody>{filmWorks.map(w => <tr key={w.href}><td>{yearLabel(w.y)}</td><td><a href={w.href}>{w.title}</a></td><td>{w.role}</td></tr>)}</tbody></table></div> : <p className="note">لا توجد أفلام مفهرسة لهذا الممثل بعد.</p>}{a.filmographyUrl && <p><a href={a.filmographyUrl} target="_blank" rel="noreferrer">الفيلموجرافيا الكاملة للأفلام على السينما.كوم ↗</a></p>}</div>}
      {nonFilmWorks.length > 0 && <div className="sec"><h2>{a.r.includes('act') ? 'أعمال أخرى' : 'أعماله'}</h2><div className="tw"><table className="works"><thead><tr><th>السنة</th><th>العمل</th><th>النوع</th><th>الصفة</th></tr></thead><tbody>{nonFilmWorks.map(w => <tr key={w.href}><td>{yearLabel(w.y)}</td><td><a href={w.href}>{w.title}</a></td><td>{w.kind}</td><td>{w.role}</td></tr>)}</tbody></table></div></div>}
      {co.length > 0 && <div className="sec"><h2>شاركه في أعمال</h2><p>{co.map((b, n) => <React.Fragment key={b.id}>{n ? ' · ' : ''}<a href={`#/artist/${b.id}`}>{b.ar}</a></React.Fragment>)}</p></div>}
      {linkedSongs.length > 0 && <ArtistPreviews artist={a} songs={linkedSongs} />}
    </div></article><ShareAndTail related={related} items={AR} i={AR.indexOf(a)} type="artist" /></section>;
}

function Film({ id }) {
  const f = FM[id];
  if (!f) return <NotFound />;
  const i = F.indexOf(f);
  const related = F.filter(x => x !== f && (x.d === f.d || Math.abs(x.y - f.y) <= 3)).slice(0, 5).map(x => [`#/film/${x.id}`, x.ar]);
  return <section className="view"><Crumb section="#/works" title="الأعمال" current={f.ar} />
    <article className="profile"><Placeholder label={`ملصق ${f.ar}`} cls="portrait" itemKey={`film:${f.id}`} /><div className="profile-text">
      <p className="kicker">بطاقة {no(i)} · فيلم</p><h1>{f.ar}</h1><p className="latin">{f.en}</p><p className="pull">فيلم مصري من إخراج {f.d}.</p>
      <dl className="facts"><div><dt>إخراج</dt><dd><LinkName name={f.d} /></dd></div><div><dt>بطولة</dt><dd>{(f.c||'').split('،').filter(Boolean).map((name, n) => <React.Fragment key={name}>{n ? ' · ' : ''}<LinkName name={name} /></React.Fragment>)}</dd></div><div><dt>السنة</dt><dd>{ar(f.y)}</dd></div>{f.author && <div><dt>المؤلف أو المصدر الأدبي</dt><dd>{f.author}</dd></div>}</dl>
      {f.summary && <div className="sec"><h2>نبذة</h2><p>{f.summary}</p></div>}
    </div></article><ShareAndTail related={related} items={F} i={i} type="film" /></section>;
}

function Song({ id }) {
  const [playingSong, setPlayingSong] = useState(null);
  const s = SM[id];
  if (!s) return <NotFound />;
  const i = S.indexOf(s);
  const isPlaying = playingSong === id;
  const singer = A.find(artist => artist.ar === s.s);
  const singerPhoto = singer ? IMG[`artist:${singer.id}`] : null;
  const related = [...S.filter(x => x !== s).map(x => [`#/song/${x.id}`, x.ar]), ...F.filter(x => s.y != null && Math.abs(x.y - s.y) <= 3).map(x => [`#/film/${x.id}`, x.ar])].slice(0, 5);
  return <section className="view"><Crumb section="#/works" title="الأعمال" current={s.ar} />
    <article className="song"><div className={`vinyl${isPlaying ? ' is-playing' : ''}`} aria-hidden="true">{singerPhoto && <img className="vinyl-portrait" src={singerPhoto.u} alt="" />}</div><div><p className="kicker">أغنية{ s.y == null ? '' : ` · ${ar(s.y)}` }</p><h1>{s.ar}</h1><p className="latin">{s.en}</p>
      <dl className="facts"><div><dt>غناء</dt><dd><LinkName name={s.s} /></dd></div>{s.c && <div><dt>تلحين</dt><dd><LinkName name={s.c} /></dd></div>}{s.l && <div><dt>كلمات</dt><dd><LinkName name={s.l} /></dd></div>}</dl>{!s.lyrics && <p>لم تُضف الكلمات بعد.</p>}</div></article>
    <SpotifyEmbed record={s} title={s.ar} onPlayingChange={playing => {
      setPlayingSong(current => {
        if (playing) return id;
        return current === id ? null : current;
      });
    }} />
      {s.summary && <section className="sec"><h2>نبذة</h2><p>{s.summary}</p></section>}
      {s.lyrics && <section className="sec lyrics-section"><h2>كلمات الأغنية</h2><div className="lyrics-text" lang="ar" dir="rtl">{(Array.isArray(s.lyrics) ? s.lyrics : s.lyrics.split('\n')).filter(line => line.trim()).map((line, index) => <p key={index}>{line}</p>)}</div></section>}
    <ShareAndTail related={related} items={S} i={i} type="song" /></section>;
}

function Works({ filter = 'all' }) {
  const [decade, setDecade] = useState('all');
  const works = [...F.map(o => ({ type: 'film', o })), ...S.map(o => ({ type: 'song', o }))].sort((a, b) => byYear(a.o, b.o));
  const visible = works.filter(w => (filter === 'all' || w.type === filter) && (decade === 'all' || (w.o.y != null && Math.floor(w.o.y / 10) * 10 === Number(decade))));
  return <section className="view"><header className="head"><p className="kicker">السينما والموسيقى</p><h1>الأعمال</h1>
    <div className="filters" role="group" aria-label="تصفية">{[['all','الكل'],['film','الأفلام'],['song','الأغاني']].map(([v,l]) => <button key={v} type="button" className={filter === v ? 'on' : ''} onClick={() => location.hash = `#/works/${v}`}>{l}</button>)}</div>
    <div className="filters" role="group" aria-label="العقد">{[['all','كل العقود'],['1930','الثلاثينيات'],['1940','الأربعينيات'],['1950','الخمسينيات'],['1960','الستينيات'],['1970','السبعينيات']].map(([v,l]) => <button key={v} type="button" className={decade === v ? 'on' : ''} onClick={() => setDecade(v)}>{l}</button>)}</div>
    <p className="count">{ar(visible.length)} نتيجة</p><button className="clear" type="button" hidden={filter === 'all' && decade === 'all'} onClick={() => { setDecade('all'); location.hash = '#/works'; }}>مسح التصفية</button>
  </header><ol className="index">{visible.map((w, i) => <li key={`${w.type}-${w.o.id}`}><a href={`#/${w.type}/${w.o.id}`}><span className="no">{no(i)}</span><b>{w.o.ar}</b><i>{w.o.en}</i><span className="yr">{w.type === 'film' ? 'فيلم · ' : 'أغنية · '}{yearLabel(w.o.y)}</span></a></li>)}</ol>{visible.length === 0 && <p className="empty">لا نتائج بهذه التصفية.</p>}</section>;
}

function Timeline() {
  const ev = { 1927: ['صدور فيلم «ليلى»، من أوائل الأفلام الروائية الطويلة المصرية.'], 1934: ['بدء الإذاعة المصرية الرسمية.'], 1935: ['تأسيس استوديو مصر.'], 1952: ['ثورة يوليو وتحوّل المشهد الفني والإعلامي.'], 1975: [<><a href="#/artist/umm">رحيل أم كلثوم</a>.</>], 1977: [<><a href="#/artist/halim">رحيل عبد الحليم حافظ</a>.</>] };
  F.forEach(f => { ev[f.y] ||= []; ev[f.y].push(<>فيلم <a href={`#/film/${f.id}`}>«{f.ar}»</a> · إخراج <LinkName name={f.d} /></>); });
  S.filter(s => s.y != null).forEach(s => { ev[s.y] ||= []; ev[s.y].push(<>أغنية <a href={`#/song/${s.id}`}>«{s.ar}»</a> · غناء <LinkName name={s.s} /></>); });
  const decades = [[1930,'الثلاثينيات'],[1940,'الأربعينيات'],[1950,'الخمسينيات'],[1960,'الستينيات'],[1970,'السبعينيات']];
  return <section className="view"><header className="head"><p className="kicker">نصف قرن</p><h1>العصور</h1></header>
    <ol className="tl">{Object.keys(ev).sort((a,b) => a-b).map(y => <li key={y}><time><a href={`#/timeline/${y}`}>{ar(y)}</a></time><div>{ev[y].map((t,n) => <p key={n}>{t}</p>)}</div></li>)}</ol>
    <section className="decades"><h2>تصفّح بالعقود</h2><div id="dec">{decades.map(([start,title]) => {
      const items = [...F.map(f => [f.y, `#/film/${f.id}`, f.ar]), ...S.map(s => [s.y, `#/song/${s.id}`, s.ar])].filter(x => x[0] >= start && x[0] < start + 10).sort((a,b) => a[0]-b[0]);
      return <div className="dec" key={title}><h3>{title}</h3><ul>{items.map(x => <li key={x[1]}><small>{ar(x[0])}</small><a href={x[1]}>{x[2]}</a></li>)}</ul></div>;
    })}</div></section></section>;
}

const ERA_PROFILES = {
  1927: {
    title: 'بدايات السينما الغنائية',
    summary: 'يُعد عام ١٩٢٧ من أعلام التحول المبكر في السينما المصرية، إذ شهد صدور فيلم «ليلى» في مرحلة كانت فيها الشاشة العربية تبني لغتها السردية الخاصة وتنتقل تدريجيًا من التجارب القصيرة إلى الفيلم الروائي الطويل.',
    context: 'في هذه المرحلة بدأت مؤسسات صناعة الصورة تتكوّن، وظهر التقاء الموسيقى بالتمثيل بوصفه عنصرًا حاضرًا في الهوية البصرية والفنية للسينما المصرية.',
    singing: [
      'لم يكن الغناء في عام ١٩٢٧ قد استقر داخل نموذج الفيلم الروائي كما استقر لاحقًا في الثلاثينيات والأربعينيات. كانت الأغنية لا تزال تمتد عبر الحفلات والمناسبات الدينية والمجالس العامة وخشبة المسرح، بينما كان الجمهور يتعرّف إلى المطربين بصورة مباشرة أو عبر الأسطوانات والإذاعة النامية.',
      'جاءت العلاقة بين الغناء والسينما في بدايتها من خبرة ممثلين ومطربين عرفوا المسرح قبل الشاشة. لذلك لم تكن الأغنية مجرد إضافة تجارية؛ بل كانت طريقة لإنشاء شخصية الفنان، وإطالة اللحظة العاطفية، وصنع ذاكرة جماهيرية يمكن أن تعيش خارج العرض نفسه.',
      'اتسع دور المطربة والمطرب تدريجيًا ليصبح اسمًا يمكن أن يجذب الجمهور إلى المسرح والسينما معًا، وهي الصلة التي ستبلغ نضجها في أفلام محمد عبد الوهاب وأم كلثوم وفريد الأطرش وغيرهم.'
    ],
    cinema: [
      'يُذكَر عام ١٩٢٧ بصورة رئيسية بصدد أول فيلم روائي طويل في مصر وهو «ليلى»، بعد سلسلة من تجارب السينما المبكرة التي كانت قصيرة أو وثائقية أو مرتبطة بعروض مسرحية. كان التحول إلى الفيلم الروائي يعني ربط الصورة بقصة مترابطة وزمن طويل وشخصيات قادرة على بناء المعنى.',
      'كان منتجو تلك المرحلة والمخرجون والمصورون يحاولون اكتشاف قواعد المونتاج والإضاءة والإيقاع السينمائي، كما كان الجمهور يتعلم مشاهدته أيضًا. لذلك تحمل أولى الأعمال معالم التجريب والإصرار على نقل أنماط معروفة من المسرح والأدب إلى الشاشة.',
      'مهد ظهور «ليلى» لما سيصبح نموذجًا واضحًا في العقود التالية: النجوم الذين انتقلوا من المسرح والإذاعة إلى الشاشة، والملحنون الذين كتبوا لجمهور واسع، والمخرجون الذين جمعوا الكوميديا والدراما والغناء في فيلم واحد.'
    ],
    theater: [
      'كان المسرح قبل دخول الغناء والتمثيل بقوة إلى السينما هو المدرسة الأساسية للكثير من الممثلين والمطربين والمخرجين. تقدم الفرق المسرحية نصًا عربيًا أمام جمهور حاضر، وتبني الحوار والحركة والإيقاع والاتصال المباشر، وهي مهارات انتقلت إلى موقع التصوير.',
      'شهدت القاهرة والمدن المصرية في هذه المرحلة حراكًا مسرحيًا جمع المسرح الكوميدي والملحمى والغنائي والتمثيلي. وكانت شخصية الممثل المسرحي أقرب إلى النجومية في الشارع، مما جعل انتقاله إلى الفيلم خطوة طبيعية.',
      'ساعدت هذه الجذور في تشكيل الأسلوب المصري للدراما السينمائية المبكرة؛ فقد حافظت الكوميديا والملودراما واللقطات الموسيقية على أثر الخطاب المسرحي، حتى اكتسبت السينما تدريجيًا لغتها الخاصة.'
    ],
    image: null
  },
  1933: {
    title: 'بداية نجوم النصف القرن',
    summary: 'شهد عام ١٩٣٣ ظهور فيلم «الوردة البيضاء»، وهي محطة مبكرة في علاقة السينما بالغناء، وتقديم محمد عبد الوهاب في عمل جمع بين الصورة والموسيقى.',
    context: 'أسهمت أفلام هذا العقد في ترسيخ نجمة المطربين والمطربات داخل الشاشة، ومنح الجمهور نجومًا تتواصل شهرتهم عبر الإذاعة والسينما.',
    singing: [
      'بدأت الكلمة والألحان تتداخل بقوة مع شخصية الفنان السينمائي. فلم يعد المطرب مجرد صوت مسموع أو موهبة تسجيلية، بل أصبح صاحب حضور بصري يمكن للجمهور أن يتابعه في لحنه وحواره ودوره الدرامي.',
      'جاء محمد عبد الوهاب في «الوردة البيضاء» بوصفه مطربًا وملحّنًا وممثلًا، وقدمه السينما في صورة لم تكن شائعة بنفس الوضوح في الجيل السابق. ربط هذا النموذج بين الموسيقى وتأليف شخصية الفيلم، وأتاح للأغنية أن تتحول إلى جزء من القصة.',
      'خلال عشرينيات وثلاثينيات القرن، أصبحت الأسطوانات والإذاعة والأسواق الفنية عنصرًا واحدًا، حيث يخرج المطرب من الحفلة إلى الشاشة ويستمر ذكره بالأغنية والملصق والنقد.'
    ],
    cinema: [
      'كانت السينما في ١٩٣٣ تواجه تحديًا في الجمع بين الدراما والغناء دون تحويل الفيلم إلى عرض موسيقي منفصل. نجح «الوردة البيضاء» في تقديم هذا التوازن عبر شخصية شاب يريد الموسيقى ويتعلم ويواجه القواعد الاجتماعية.',
      'أدى محمد عبد الوهاب دورًا يقترب من سيرته الفنية دون أن يكون وثائقيًا صِرفًا، ما سمح للجمهور بتصديق المطرب بصفته بطلًا سينمائيًا. وتحول الازدواجية—المطرب والملحن—إلى قيمة فنية يمكن استغلالها في التأليف والإخراج.',
      'مثل هذا النوع من الأفلام قاعدة لما سيصبح نموذجًا موسيقيًا واضحًا في الخمسينيات والستينيات: مطرب يحمل فيلمًا، وأغنيات تُدعم الحبكة، وصناعة تضع الصورة والصوت في إنتاج واحد.'
    ],
    theater: [
      'ترسخت في هذه السنون أهمية الممثل المسرحي الذي يستطيع الغناء والتحدث والحركة أمام الكاميرا. وجد الممثلون خبرةً في بناء المشهد المسرحي، بينما اعتمدت السينما على المسرح لتوفير نجومها ونصوصها وطرائق حوارها.',
      'ساهمت الفرق المسرحية في انتشار أسلوب الأداء المسرحي المباشر، الذي كان مناسبًا لحالات الدراما والكوميديا الغنائية الأولى، قبل أن تتطور تقنيات الإخراج إلى مشاهد أقرب إلى الواقع.'
    ],
    image: 'film:wardaabyad'
  },
  1934: {
    title: 'الإذاعة المصرية تبدأ',
    summary: 'بدأت الإذاعة المصرية خدماتها الرسمية عام ١٩٣٤، فصارت الصوت حاضرًا بانتظام داخل البيوت المصرية ووسيلة جديدة لتكوين الذائقة العامة.',
    context: 'منحت الإذاعة الأغنية والتسجيلات الموسيقية انتشارًا واسعًا، وربطت نجوم المطربين بموعد ثابت للجمهور وحدثت حوارًا يوميًا وشهريًا مع الموسيقى.',
    image: null
  },
  1935: {
    title: 'تأسيس استوديو مصر',
    summary: 'تأسس استوديو مصر عام ١٩٣٥ ليصبح إحدى أهم القواعد الصناعية للسينما المصرية، ويجمع الإنتاج والإدارة والتقنيات الفنية في مؤسسة متخصصة.',
    context: 'مهد الاستوديو لعقدٍ من الإنتاج المتصل، وساهم في ظهور أفلام غنائية وروائية خالدة، وفي تنظيم العمل بين المخرجين والملحّنين والممثلين.',
    image: null
  },
  1936: {
    title: 'وداد ومسار الغناء السينمائي',
    summary: 'صدر عام ١٩٣٦ فيلم «وداد»، والذي جمع أم كلثوم في أحد أهم تجاربها السينمائية المبكرة مع الإخراج السينمائي والدراما الغنائية.',
    context: 'مثل هذا الفيلم لحظة واضحة في تطور نجمة الغناء على الشاشة، وتحول الأغنية إلى جزء من الحبكة وبناء الشخصيات.',
    image: 'film:wedad'
  },
  1949: {
    title: 'عام الكوميديا والفن الجماعي',
    summary: 'يُعد عام ١٩٤٩ محطة مزدحمة بظهور أفلام مثل «غزل البنات» و«عفريتة هانم»، في صورة تمزج الكوميديا والغناء والأغاني الشعبية.',
    context: 'جمعت هذه الأعمال نجومًا من مجالات التمثيل والغناء والرقص والإخراج، وأسهمت في تثبيت لغة السينما المصرية الواسعة الانتشار.',
    image: 'film:ghazl'
  },
  1952: {
    title: 'ثورة يوليو والمشهد الفني',
    summary: 'تعد ثورة يوليو ١٩٥٢ نقطة فاصلة في مصر، وامتد أثرها إلى الإعلام والسينما والمؤسسات الثقافية، وإلى موضوعات الفن وشكل الإنتاج.',
    context: 'تغيرت علاقات المجتمع بالدولة والإعلام، وبدأت الشاشة تتناول قضايا اجتماعية ووطنية أكثر وضوحًا إلى جانب الكوميديا والغناء.',
    image: null
  },
  1959: {
    title: 'كلاسيكيات الدراما الغنائية',
    summary: 'شهد عام ١٩٥٩ صدور «دعاء الكروان» و«بين الأطلال»، في لحظة نضجت فيها الدراما المصرية والاقتباس الأدبي والسينما الغنائية.',
    context: 'قامت هذه الأفلام على توظيف الممثلين والموسيقى والكلمات في سرد أعمق، وارتبطت ببدايات فيلم المطبخ الواقعي والدراما الجماهيرية.',
    image: 'film:doaa'
  },
  1969: {
    title: 'الواقعية والتجريب في شباك الستينيات',
    summary: 'جاء عام ١٩٦٩ بنهايات عقدٍ حافل، وشهد صدور «المومياء» و«أبي فوق الشجرة» في مسارين مختلفين من السينما المصرية.',
    context: 'بين التجريب البصري والدراما العاطفية، أكد هذا العام تنوع السينما المصرية وقدرتها على الجمع بين المآسي الشخصية والتفكير البصري.',
    image: 'film:mummy'
  },
  1975: {
    title: 'رحيل أم كلثوم',
    summary: 'رحلت أم كلثوم في عام ١٩٧٥ بعد مسيرة امتدت عبر الإذاعة والسينما والأغنية العربية، وتركت أثرًا يشمل الذائقة ووسائل الإنتاج والهوية الثقافية.',
    context: 'صُدرت أعمال سينمائية كبرى في العام نفسه، بما فيها «الكرنك»، في زمن انتهت فيه مرحلة من العصور الذهبية واستمر تأثيرها في الجيل التالي.',
    image: 'artist:umm'
  },
  1977: {
    title: 'رحيل عبد الحليم حافظ',
    summary: 'رحيل عبد الحليم حافظ عام ١٩٧٧ غيّر مشهد الغناء المصري والعربي، بعد مسيرة جمع فيها المطرب والممثل والأغنية السينمائية في صورة واحدة.',
    context: 'استمرت أغانيه وأفلامه حاضرةً في الذاكرة، وكرست ذكرى نجومية صنعتها السينما والإذاعة والتسجيلات في عقود متصلة.',
    image: 'artist:halim'
  }
};

function EraParagraphs({ value }) {
  const paragraphs = Array.isArray(value) ? value : [value];
  return paragraphs.filter(Boolean).map((paragraph, index) =>
    <p key={index}>{paragraph}</p>
  );
}

function Era({ id }) {
  const y = Number(id);
  const profile = ERA_PROFILES[y] || {
    title: `ذاكرة عام ${ar(y)}`,
    summary: `يتميّز عام ${ar(y)} بموضعه ضمن مسار السينما والموسيقى المصرية، وتظهر فيه الأعمال المرتبطة بعقله الفني ووجوهه المشاركة.`,
    context: [
      `يقدّم الأرشيف في هذه الصفحة أعمال عام ${ar(y)} وشركاءها الفنيين، بوصفها نقاط وصول إلى السياق الأوسع لعصر جمع الغناء والسينما والإذاعة والمسرح في منتج ثقافي واحد.`,
      `لا ينبغي قراءة الحدث الفني منفردًا؛ فالنجومية في هذا العصر كانت مبنية على الانتقال بين المنصات. المطرب يغني في الإذاعة ويظهر على الشاشة، والممثل يتعلم من خشبة المسرح، والملحن والشاعر يدعمان صورة النجوم وحكاياتهم.`,
      `تمنح أعمال الأرشيف المرتبطة بهذا العام طريقة لدراسة التداخل بين الفنون، لا باعتباره مجرد تخصصات منفصلة، بل باعتباره سوقًا ذاكرة وجمهورًا يتغيرون مع الموسيقى والإعلام والسياسة والحياة اليومية.`
    ],
    singing: [
      `يوثق الأرشيف في عام ${ar(y)} جانبًا من حركة الغناء المرتبط بالأفلام والألحان والمطربين. تتنوع أصوات هذا العام بين المطربين الذين سبق لهم الوصول إلى الجمهور والوجوه التي كانت في بداية الطريق.`,
      'كان الغناء قد أصبح صناعة تحتاج إلى اسم معروف وكلمات واضحة ولحن يلائم المقام الذي يعيشه الجمهور، كذلك إلى الإذاعة والأسطوانة والحفلات التي تحافظ على الاستمرارية.'
    ],
    cinema: [
      `ترتبط السينما في عام ${ar(y)} بالاتجاهات السائدة في الإخراج والتمثيل والدراما، سواء كانت الكوميديا أو الميلودراما أو الواقعية أو الفيلم الغنائي.`,
      'تعاون المخرجون مع مطربين وممثلين جاءوا من مسارح مختلفة، وتحولت نجومية الشاشة إلى علاقة مركبة تجمع الضحكة والوجع والتاريخ والصوت.'
    ],
    theater: [
      'ظل المسرح مصدرًا للكثير من الموهوبين الذين انتقلوا إلى السينما والإذاعة. الطقوس المسرحية في بناء الشخصية والحوار، وشدة وجود الممثل أمام الجمهور، ظلت حاضرة حتى في أفلام الاستوديو.',
      'تستحق المسرحيات والأدوار المسرحية لدورها في إعداد الجيل الفني؛ فهي بيئة التعليم والتعلم والتجريب، حيث يتقاطع النائب والراقص والمطرب والمخرج داخل فرقة واحدة.'
    ]
  };
  const films = F.filter(f => f.y === y);
  const songs = S.filter(s => s.y === y);
  const artists = [...new Set([
    ...films.flatMap(f => [f.d, ...(f.c || '').split('،').filter(Boolean)]),
    ...songs.flatMap(s => [s.s, s.c, s.l].filter(Boolean))
  ])];
  const image = profile.image ? IMG[profile.image] : null;
  const fixedYears = [1927,1934,1935,1952,1975,1977];
  const years = [...new Set([
    ...fixedYears,
    ...F.map(f => f.y).filter(Boolean),
    ...S.map(s => s.y).filter(Boolean)
  ])].sort((a,b) => a-b);
  const i = years.indexOf(y);
  return <section className="view era-page">
    <Crumb section="#/timeline" title="العصور" current={ar(y)} />
    <article className="era-article">
      {image
        ? <figure className="era-hero ph photo"><img src={image.u} alt={image.alt} loading="lazy" /><figcaption>{image.c}</figcaption></figure>
        : <figure className="era-hero era-placeholder" role="img" aria-label={`أرشيف بصري لعام ${ar(y)}`}><span>{ar(y)}</span></figure>}
      <div className="era-content">
        <p className="kicker">صفحة عصر · {ar(y)}</p>
        <h1>{profile.title}</h1>
        <p className="era-year" dir="ltr">{ar(y)}</p>
        <p className="pull">{profile.summary}</p>
        <section className="era-overview"><h2>السياق الفني والثقافي</h2><EraParagraphs value={profile.context} /></section>
        <section className="era-domain">
          <h2><span>١</span> الغناء</h2>
          {profile.singing
            ? <EraParagraphs value={profile.singing} />
            : <EraParagraphs value={songs.length
              ? `برزت في هذا العام أغاني صنعت حضورها عبر الأصوات والملحّنين والكلمات، ومن أبرزها أعمال مسجلة في الأرشيف في هذا العام.`
              : `لم تُسجل أغنية ضمن فهرس الأعمال بعام ${ar(y)}، مع استمرار الغناء والإذاعة في التأثير على المشهد الفني العام.`} />}
          {songs.length > 0 && <div className="era-links"><b>الأغاني:</b>{songs.map((s,n) => <React.Fragment key={s.id}>{n ? ' · ' : ''}<a href={`#/song/${s.id}`}>{s.ar}</a></React.Fragment>)}</div>}
        </section>
        <section className="era-domain">
          <h2><span>٢</span> التمثيل والسينما</h2>
          {profile.cinema
            ? <EraParagraphs value={profile.cinema} />
            : <EraParagraphs value={films.length
              ? `شهد عام ${ar(y)} حضورًا سينمائيًا توثقه أفلام الأرشيف، وتجمع هذه الأعمال بين إخراج وممثلين وطرائق سردية مختلفة.`
              : `لم تُسجل أفلام مفهرسة بعام ${ar(y)}، لكن يظل التمثيل السينمائي حاضرًا في تطور الصناعة وارتباطه بالمسرح والغناء.`} />}
          {films.length > 0 && <div className="era-links"><b>الأفلام:</b>{films.map((f,n) => <React.Fragment key={f.id}>{n ? ' · ' : ''}<a href={`#/film/${f.id}`}>{f.ar}</a></React.Fragment>)}</div>}
          {films.length > 0 && <div className="era-links"><b>الممثلون وصنّاع السينما:</b>{artists.filter(name => A.find(a => a.ar === name && (a.r.includes('act') || a.r.includes('dir')))).map((name,n) => { const artist = A.find(a => a.ar === name); return <React.Fragment key={name}>{n ? ' · ' : ''}<a href={`#/artist/${artist.id}`}>{name}</a></React.Fragment>; })}</div>}
        </section>
        <section className="era-domain">
          <h2><span>٣</span> المسرح</h2>
          {profile.theater
            ? <EraParagraphs value={profile.theater} />
            : <EraParagraphs value="كان المسرح مصدراً أساسياً للممثلين والدراما واللغة البصرية في المشهد المصري؛ وتدفقت خبراته إلى السينما والإذاعة والغناء طوال هذه المرحلة." />}
        </section>
        {artists.length > 0 && <section className="era-overview"><h2>وجوه مرتبطة بهذا العام</h2><p>{artists.map((name,n) => { const artist = A.find(a => a.ar === name); return <React.Fragment key={name}>{n ? ' · ' : ''}{artist ? <a href={`#/artist/${artist.id}`}>{name}</a> : name}</React.Fragment>; })}</p></section>}
      </div>
    </article>
    <p className="pn">
      {i > 0 ? <a className="prev" href={`#/timeline/${years[i-1]}`}>→ {ERA_PROFILES[years[i-1]]?.title || `ذاكرة عام ${ar(years[i-1])}`}</a> : <span />}
      {i < years.length - 1 ? <a className="next" href={`#/timeline/${years[i+1]}`}>{ERA_PROFILES[years[i+1]]?.title || `ذاكرة عام ${ar(years[i+1])}`} ←</a> : <span />}
    </p>
  </section>;
}

function About() {
  return <section className="view about"><header className="head"><p className="kicker">عن المشروع</p><h1>عن الأرشيف</h1></header>
    <p>سينماتيك أرشيف عام يجمع وجوه الغناء والسينما المصرية ويربط بينها: كل فنان بأعماله، وكل عمل بصنّاعه وسنته.</p><h2>كيف نكتب المعلومات</h2>
    <p>نكتب ما نتأكد منه فقط. التواريخ المختلف عليها تُكتب «حوالي»، وما لا يُعرف يُترك فارغًا بدل التخمين.</p><h2>المصادر والتراخيص</h2>
    <p>تُوثّق مصادر الصور وتراخيصها في قائمة المراجع. إذا لم تتوفر صورة موثوقة للفيلم نفسه، نستخدم صورة موثقة لبطل أو بطلة العمل. لا نستخدم صورًا مولّدة على أنها تاريخية. تُضاف كلمات الأغاني عند توافر نص موثوق وحقوق نشره. المشروع في مرحلة الإعداد وتُراجع معلوماته قبل النشر.</p>
    <p><a href="#/sources">راجع قائمة المراجع والتراخيص</a></p></section>;
}

function Sources() {
  const sourceRows = [
    ...A.filter(a => a.sources?.length).map(a => [a.ar, a.sources]),
    ...F.filter(f => f.sources?.length).map(f => [f.ar, f.sources]),
    ...S.filter(s => s.sources?.length).map(s => [s.ar, s.sources])
  ];
  const unique = new Map();
  sourceRows.forEach(([label, sources]) => sources.forEach(url => {
    const current = unique.get(url) || [];
    if (!current.includes(label)) current.push(label);
    unique.set(url, current);
  }));
  const imageRows = [
    ['أم كلثوم','https://commons.wikimedia.org/wiki/File:Umm_Kulthum_1969.jpg','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['عبد الحليم حافظ','https://commons.wikimedia.org/wiki/File:Abdel_Halim_Hafez.jpg','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['صباح','https://commons.wikimedia.org/wiki/File:Sabah_(1961).jpg','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['فاتن حمامة','https://commons.wikimedia.org/wiki/File:Faten_Hamama.jpg','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['شادية','https://commons.wikimedia.org/wiki/File:Shadia_1957.jpg','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['عمر الشريف','https://commons.wikimedia.org/wiki/File:Bridge_demonstratie_van_Omar_Sharif_in_RAI,_v.l.n.r._Van_Heusden_,_Omar_Sharif_,,_Bestanddeelnr_920-9137.jpg','ويكيميديا كومنز · CC0'],
    ['إسماعيل ياسين','https://commons.wikimedia.org/wiki/File:Ismail_Yassin.jpg','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['سعاد حسني','https://commons.wikimedia.org/wiki/File:Suad_Husni.jpg','ويكيميديا كومنز · الملكية العامة'],
    ['هند رستم','https://commons.wikimedia.org/wiki/File:Hind_Rostom_1950s.jpg','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['نادية لطفي','https://commons.wikimedia.org/wiki/File:Nadia_Lutfi_2.jpg','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['تحية كاريوكا','https://commons.wikimedia.org/wiki/File:Taheyya_Kariokka.jpg','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['سامية جمال','https://commons.wikimedia.org/wiki/File:Samia_Gamal.jpg','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['نجيب الريحاني','https://commons.wikimedia.org/wiki/File:Naguib_el-Rihani.jpg','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['يوسف وهبي','https://commons.wikimedia.org/wiki/File:Yousef_wahby.jpg','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['رشدي أباظة','https://commons.wikimedia.org/wiki/File:Rushdy_Abaza.jpg','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['صلاح ذو الفقار','https://commons.wikimedia.org/wiki/File:Salah_Zulfikar.jpg','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['أنور وجدي','https://commons.wikimedia.org/wiki/File:Anwar_Wagdi.jpg','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['محمود المليجي','https://commons.wikimedia.org/wiki/File:%D9%8A%D9%88%D8%B3%D9%81_%D9%88%D9%87%D8%A8%D9%8A_%D9%88%D9%85%D8%AD%D9%85%D9%88%D8%AF_%D8%A7%D9%84%D9%85%D9%84%D9%8A%D8%AC%D9%8A.jpg','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['فريد الأطرش','https://commons.wikimedia.org/wiki/File:6464hoss.jpg','ويكيميديا كومنز · CC BY-SA ٣٫٠'],
    ['أسمهان','https://commons.wikimedia.org/wiki/File:Asmahan_photo.jpg','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['ليلى مراد','https://commons.wikimedia.org/wiki/File:Laila_Mourad.jpg','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['الوردة البيضاء','https://commons.wikimedia.org/wiki/File:The_White_Rose_(1933).jpg','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['وداد','https://commons.wikimedia.org/wiki/File:Umm_kulthoum_as_Wedad.jpg','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['سلامة','https://commons.wikimedia.org/wiki/File:Umm_kulthoum_as_Salamah.png','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['غزل البنات','https://commons.wikimedia.org/wiki/File:%D8%BA%D8%B2%D9%84_%D8%A7%D9%84%D8%A8%D9%86%D8%A7%D8%AA.jpg','ويكيميديا كومنز · الملكية العامة'],
    ['عفريتة هانم','https://commons.wikimedia.org/wiki/File:Samiaetfarid.jpg','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['خلي بالك من زوزو','https://commons.wikimedia.org/wiki/File:Suad_Husni.jpg','ويكيميديا كومنز · الملكية العامة'],
    ['الكرنك','https://commons.wikimedia.org/wiki/File:El-Karnak.jpg','ويكيميديا كومنز · الملكية العامة'],
    ['انتصار الشباب – أسمهان','https://commons.wikimedia.org/wiki/File:Asmahan_photo.jpg','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['فاتن حمامة – صراع في الوادي، بين الأطلال، دعاء الكروان','https://commons.wikimedia.org/wiki/File:Faten_Hamama.jpg','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['إسماعيل ياسين – إسماعيل ياسين في الجيش','https://commons.wikimedia.org/wiki/File:Ismail_Yassin.jpg','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['عبد الحليم حافظ – لحن الوفاء، أبي فوق الشجرة','https://commons.wikimedia.org/wiki/File:Abdel_Halim_Hafez.jpg','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['شادية – شباب امرأة، الزوجة الثانية','https://commons.wikimedia.org/wiki/File:Shadia_1957.jpg','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['هند رستم – باب الحديد','https://commons.wikimedia.org/wiki/File:Hind_Rostom_1950s.jpg','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['محمود المليجي – الأرض','https://commons.wikimedia.org/wiki/File:%D9%8A%D9%88%D8%B3%D9%81_%D9%88%D9%87%D8%A8%D9%8A_%D9%88%D9%85%D8%AD%D9%85%D9%88%D8%AF_%D8%A7%D9%84%D9%85%D9%84%D9%8A%D8%AC%D9%8A.jpg','ويكيميديا كومنز · الملكية العامة المصرية'],
    ['المومياء','https://commons.wikimedia.org/wiki/File:The_Night_of_Counting_the_Years_(1969).jpg','ويكيميديا كومنز · الملكية العامة المصرية']
  ];
  return <section className="view about">
    <header className="head"><p className="kicker">المراجع والتراخيص</p><h1>قائمة المصادر</h1></header>
    <h2>المراجع المستخدمة</h2>
    {[...unique].map(([url, labels]) => <p key={url}><a href={url} target="_blank" rel="noreferrer">{url}</a><br /><span className="latin">{labels.join(' · ')}</span></p>)}
    <h2>اعتمادات الصور</h2>
    {imageRows.map(([label, url, license]) => <p key={label}><b>{label}</b><br /><a href={url} target="_blank" rel="noreferrer">{url}</a><br />{license}</p>)}
  </section>;
}

function NotFound() {
  return <section className="view"><header className="head"><p className="kicker">٤٠٤</p><h1>هذه البطاقة غير موجودة</h1></header><p>ربما تغيّر الرابط. ابدأ من <a href="#/artists">الوجوه</a> أو <a href="#/works">الأعمال</a>، أو اضغط <kbd>/</kbd> للبحث.</p></section>;
}

const allCards = [
  ...A.map(a => [a.ar, a.en, `#/artist/${a.id}`, a.y, 'فنان']),
  ...F.map(f => [f.ar, f.en, `#/film/${f.id}`, `${f.y} ${f.d} ${f.c}`, 'فيلم']),
  ...S.map(s => [s.ar, s.en, `#/song/${s.id}`, [s.y, s.l, s.c, s.s].filter(Boolean).join(' '), 'أغنية'])
];
function searchCards(query) {
  const q = dg(nz(query.trim()));
  if (!q) return [];
  return allCards.filter(i => dg(nz(`${i[0]} ${i[1]} ${i[3]}`)).includes(q));
}
function Search() {
  const [q, setQ] = useState('');
  const results = searchCards(q);
  const random = () => { const all = allCards.map(i => i[2]); location.hash = all[Math.random() * all.length | 0]; };
  return <section className="view"><header className="head"><p className="kicker">بحث في الفهرس</p><h1>ابحث</h1></header>
    <p><button className="btn" type="button" onClick={random}>بطاقة عشوائية</button></p><label className="sr" htmlFor="q">اسم أو عنوان</label>
    <input id="q" type="search" placeholder="اكتب اسمًا أو عنوانًا…" autoComplete="off" value={q} onChange={e => setQ(e.target.value)} />
    <ul className="res" aria-live="polite">{q.trim() && results.length === 0 ? <li>لا نتائج</li> : results.map(i => <li key={i[2]}><a href={i[2]}><b>{i[0]}</b><i>{i[1]}</i><small>{i[4]}</small></a></li>)}</ul></section>;
}

function Footer() {
  return <><footer className="foot"><div className="foot-grid"><div><h2>سينماتيك</h2><p>أرشيف ثقافي للغناء والسينما المصرية.</p></div><div><h2>الأقسام</h2><a href="#/artists">الوجوه</a><a href="#/works">الأعمال</a><a href="#/timeline">العصور</a></div><div><h2>عن المشروع</h2><a href="#/about">عن الأرشيف</a><a href="#/sources">المراجع والتراخيص</a><a href="#/search">بحث</a></div></div><p className="small">صور الأفلام وأبطالها موثقة المصدر والترخيص في قائمة المراجع.</p></footer><button className="top" aria-label="العودة لأعلى" onClick={() => scrollTo({top: 0, behavior: 'smooth'})}>↑</button></>;
}

function QuickSearch({ open, onClose }) {
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState(0);
  const results = searchCards(q).slice(0, 8);
  useEffect(() => { if (open) setTimeout(() => document.querySelector('#oq')?.focus(), 0); }, [open]);
  useEffect(() => setSelected(0), [q]);
  if (!open) return null;
  const choose = i => { location.hash = i[2]; onClose(); };
  return <div className="ov" role="dialog" aria-modal="true" aria-label="بحث سريع" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="ovbox"><input id="oq" type="search" placeholder="اكتب اسمًا أو عنوانًا…" autoComplete="off" value={q} onChange={e => setQ(e.target.value)}
      onKeyDown={e => { if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(v => results.length ? (v + 1) % results.length : 0); } if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(v => results.length ? (v + results.length - 1) % results.length : 0); } if (e.key === 'Enter' && results[selected]) choose(results[selected]); }}/>
      <ul className="res">{q.trim() && results.length === 0 ? <li>لا نتائج</li> : results.map((i,n) => <li key={i[2]}><a href={i[2]} className={n === selected ? 'sel' : ''} onClick={onClose}><b>{i[0]}</b><i>{i[1]}</i><small>{i[4]}</small></a></li>)}</ul>
      <p className="hint">↑↓ للتنقل · Enter للفتح · Esc للإغلاق</p>
    </div></div>;
}

function App() {
  const [, setHash] = useState(location.hash);
  const [quick, setQuick] = useState(false);
  useEffect(() => {
    const update = () => { setHash(location.hash); scrollTo(0, 0); setQuick(false); };
    addEventListener('hashchange', update);
    return () => removeEventListener('hashchange', update);
  }, []);
  useEffect(() => {
    const onScroll = () => document.querySelector('.top')?.classList.toggle('show', scrollY > 600);
    addEventListener('scroll', onScroll);
    return () => removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    const key = e => {
      if (e.key === 'Escape') setQuick(false);
      if ((e.key === '/' || e.code === 'Slash') && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); setQuick(true); }
      if (!quick && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        const cls = e.key === 'ArrowRight' ? '.prev' : '.next';
        document.querySelector(`.view:not([hidden]) .pn ${cls}`)?.click();
      }
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [quick]);
  const parts = location.hash.replace('#/', '').split('/');
  const route = parts[0] || 'home';
  const id = parts[1];
  let view;
  if (route === 'home') view = <Home />;
  else if (route === 'artists') view = <Artists filter={id || 'all'} />;
  else if (route === 'artist') view = <Artist id={id} />;
  else if (route === 'works') view = <Works filter={id || 'all'} />;
  else if (route === 'film') view = <Film id={id} />;
  else if (route === 'song') view = <Song id={id} />;
  else if (route === 'timeline' && id) view = <Era id={id} />;
  else if (route === 'timeline') view = <Timeline />;
  else if (route === 'about') view = <About />;
  else if (route === 'sources') view = <Sources />;
  else if (route === 'search') view = <Search />;
  else view = <NotFound />;
  useEffect(() => {
    const names = route === 'artist' ? AM[id]?.ar : route === 'film' ? FM[id]?.ar : route === 'song' ? SM[id]?.ar : route === 'timeline' && id ? ERA_PROFILES[Number(id)]?.title : null;
    const labels = { artists:'الوجوه', works:'الأعمال', timeline:'العصور', search:'بحث', about:'عن الأرشيف', sources:'المراجع والتراخيص', nf:'غير موجود' };
    document.title = route === 'home' ? 'سينماتيك — أرشيف الغناء والسينما المصرية' : `${names || labels[route] || 'غير موجود'} — سينماتيك`;
  }, [route, id]);
  return <><a className="skip" href="#main" onClick={e => {e.preventDefault(); document.querySelector('#main')?.focus();}}>تخطَّ إلى المحتوى</a><Header openQuick={() => setQuick(true)} /><main id="main" tabIndex="-1">{view}</main><Footer /><QuickSearch open={quick} onClose={() => setQuick(false)} /></>;
}

createRoot(document.getElementById('root')).render(<App />);
