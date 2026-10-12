/* scenes.js — timeline engine + all scenes + window.renderAt(t). Deterministic: every frame depends on t only. */
(async function(){
const A=window.ART, FPS=30, DUR=Math.ceil(LINES[LINES.length-1].e);
const APP='ইসলামী বিশ্বকোষ ও আল হাদিস S2';
const clamp=(x,a,b)=>Math.min(b==null?1:b,Math.max(a==null?0:a,x));
const ease={out:p=>1-Math.pow(1-p,3),back:p=>{const c=1.70158;return 1+(c+1)*Math.pow(p-1,3)+c*Math.pow(p-1,2);},io:p=>p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2};
function rng(seed){let a=seed>>>0;return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const root=document.getElementById('root');
function E(parent,cls,css,html){const d=document.createElement('div');if(cls)d.className=cls;d.style.cssText='position:absolute;'+(css||'');if(html!=null)d.innerHTML=html;parent.appendChild(d);return d;}
const TR=[],WR=[];
function track(el,s,e,o){o=Object.assign({a:'fade',i:.45,o:.35},o||{});el.style.visibility='hidden';TR.push({el,s,e,o});return el;}
const PRE={fade:()=>'',rise:p=>'translateY('+((1-p)*70)+'px)',drop:p=>'translateY('+(-(1-p)*70)+'px)',pop:p=>'scale('+(.55+.45*p)+')',zoom:p=>'scale('+(1.3-.3*p)+')',sl:p=>'translateX('+(-(1-p)*110)+'px)',sr:p=>'translateX('+((1-p)*110)+'px)'};
function AT(parent,s,e,o,cls,css,html){return track(E(parent,cls,css,html),s,e,o);}
function words(parent,text,cls,s,e,css,hlfn){const box=E(parent,cls,css);const ws=text.split(/\s+/).filter(Boolean);const tot=ws.reduce((a,w)=>a+w.length,0);let acc=0;const dur=e-s;let inq=false;
 ws.forEach(w=>{const sp=document.createElement('span');sp.className='w'+(hlfn&&hlfn(w)?' hl':'');sp.textContent=w;box.appendChild(sp);const st=s+dur*acc/tot;acc+=w.length;WR.push({sp,st,en:st+.28});});return box;}
const ar=(parent,text,size,s,e,css)=>words(parent,text,'ar',s,e,'font-size:'+size+'px;'+(css||''));
const bn=(parent,text,size,s,e,css,h)=>words(parent,text,'bn',s,e,'font-size:'+size+'px;'+(css||''),h);
function ico(parent,svg,x,y,w,h,s,e,o,fn,css){return AT(parent,s,e,o,'','left:'+x+'px;top:'+y+'px;width:'+w+'px;height:'+h+'px;'+(css||''),svg);}
function glowAt(parent,cx,cy,sz,s,e,amp){return AT(parent,s,e,{i:.5,o:.4,fn:(el,t,lt)=>'scale('+(1+(amp||.06)*Math.sin(lt*4))+')'},'','left:'+(cx-sz/2)+'px;top:'+(cy-sz/2)+'px;width:'+sz+'px;height:'+sz+'px;',A.glow());}
function card(parent,x,y,w,h,s,e,o){const c=AT(parent,s,e,o||{a:'rise',i:.5},'card','left:'+x+'px;top:'+y+'px;width:'+w+'px;height:'+h+'px;');
 [[8,8,0],[w-78,8,90],[w-78,h-78,180],[8,h-78,270]].forEach(p=>E(c,'','left:'+p[0]+'px;top:'+p[1]+'px;width:70px;height:70px;transform:rotate('+p[2]+'deg)',A.corner()));return c;}
function logoBox(parent,x,y,size,s,e,o){return AT(parent,s,e,o,'logo','left:'+x+'px;top:'+y+'px;width:'+size+'px;height:'+size+'px;border-radius:22%','<img src="logo.png">');}
function badge(parent,x,y,w,s,e,o,fn){const k=w/554,h=158*k;return AT(parent,s,e,Object.assign({fn},o||{}),'badge','left:'+x+'px;top:'+y+'px;width:'+w+'px;height:'+h+'px;border-radius:'+(20*k)+'px','<img src="google-play-badge.png" style="left:'+(-46*k)+'px;top:'+(-46*k)+'px;width:'+(646*k)+'px;height:'+(250*k)+'px">');}
function pill(parent,txt,x,y,w,s,e,o,gold,size){return AT(parent,s,e,o||{a:'pop',i:.5},'chip bn'+(gold?' g':''),'left:'+x+'px;top:'+y+'px;width:'+w+'px;text-align:center;font-size:'+(size||64)+'px',txt);}
const ARROW=(c)=>A.svg('0 0 120 50','<path d="M12 25 H108 M32 8 L10 25 L32 42 M88 8 L110 25 L88 42" fill="none" stroke="'+c+'" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>');
const ARROW1=(c)=>A.svg('0 0 120 50','<path d="M10 25 H108 M88 8 L110 25 L88 42" fill="none" stroke="'+c+'" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>');
const pulse=(lt,f,a)=>1+(a||.05)*Math.sin(lt*f);

/* ================= BACKGROUND ================= */
const bg=E(root,'','left:0;top:0;width:1080px;height:1920px');
const pat=E(bg,'','left:0;top:0;width:1080px;height:1920px;opacity:.2;background-image:url("'+A.patternURI()+'");background-size:160px 160px');
const med=E(bg,'','left:-210px;top:200px;width:1500px;height:1500px;opacity:.15',A.medallion());
const glow=E(bg,'','left:0;top:0;width:1080px;height:1920px');
E(root,'','left:0;top:0;width:0;height:0').innerHTML=A.defs;
const rnd=rng(20240612),PART=[];
for(let i=0;i<48;i++){const sz=3+rnd()*6;PART.push({el:E(bg,'','width:'+sz+'px;height:'+sz+'px;border-radius:50%;background:radial-gradient(circle,#fff6dc,#e3c26b 60%,rgba(227,194,107,0));left:0;top:0'),x:rnd()*1080,y:rnd()*1920,sp:12+rnd()*30,ph:rnd()*6.28,dr:8+rnd()*20});}
E(bg,'','left:0;top:1750px;width:1080px;height:170px;opacity:.95',A.skyline());
const lanL=E(bg,'','left:8px;top:0;width:96px;height:256px;transform-origin:50% 0',A.lantern());
const lanR=E(bg,'','left:976px;top:0;width:96px;height:256px;transform-origin:50% 0',A.lantern());
E(root,'hair','left:0;top:30px;width:1080px');E(root,'hair','left:0;top:1890px;width:1080px');
E(root,'','left:0;top:0;width:1080px;height:1920px;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(0,0,0,.55) 100%)');
const TAGC={respectful:[200,190,110],informative:[90,200,170],solemn:[210,170,70],serious:[230,140,80],calm:[90,180,200],thoughtful:[160,140,230],warm:[240,160,80],compassionate:[240,130,160],optimistic:[255,215,90],friendly:[110,220,130],encouraging:[170,230,90],store:[248,211,107]};
function accentAt(t){let i=0;for(let k=0;k<LINES.length;k++){if(t>=LINES[k].s)i=k;}const cur=TAGC[LINES[i].tag]||TAGC.informative,prv=TAGC[(LINES[Math.max(0,i-1)]).tag]||cur,m=ease.io(clamp((t-LINES[i].s)/.6));return cur.map((c,j)=>Math.round(prv[j]+(c-prv[j])*m));}
function bgUpdate(t){const c=accentAt(t);glow.style.background='radial-gradient(circle at 50% 38%,rgba('+c+',.42),rgba('+c+',0) 58%)';
 pat.style.backgroundPosition=(t*7)+'px '+(t*4)+'px';med.style.transform='rotate('+(t*2.2)+'deg)';
 PART.forEach(p=>{const y=((p.y-p.sp*t)%1960+1960)%1960-20,x=p.x+Math.sin(t*.6+p.ph)*p.dr;p.el.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px)';p.el.style.opacity=(.2+.7*Math.abs(Math.sin(t*1.3+p.ph))).toFixed(2);});
 lanL.style.transform='rotate('+(5*Math.sin(t*1.1))+'deg)';lanR.style.transform='rotate('+(5*Math.sin(t*1.1+1.6))+'deg)';}

/* ================= BRAND BAR ================= */
const brand=E(root,'','left:60px;top:58px;width:960px;height:112px');
track(brand,2.5,78,{a:'drop',i:.5,o:.5});
E(brand,'logo','left:118px;top:6px;width:100px;height:100px;border-radius:24%;border-width:4px','<img src="logo.png">');
E(brand,'bn gold','left:236px;top:8px;width:700px;font-size:40px;text-align:left;font-weight:700;white-space:nowrap;line-height:1.3',APP);
E(brand,'bn','left:236px;top:62px;width:700px;font-size:30px;text-align:left;opacity:.85;line-height:1.3','আজকের হাদিস');

/* ================= STAGE + SCENES ================= */
const st=E(root,'','left:0;top:215px;width:1080px;height:1200px');
function scene(s,e,i){const d=E(st,'','left:0;top:0;width:1080px;height:1200px');track(d,s,e,{i:i==null?.35:i,o:.35});return d;}

/* S1 0–2.5 greeting */
(function(){const s=scene(0,2.5,0);
 for(let k=0;k<3;k++)AT(s,0,2.5,{i:0,o:0,fn:(el,t,lt)=>{const q=((lt*.9+k/3)%1);el.style.opacity=((1-q)*.7).toFixed(3);return 'scale('+(.95+.9*q)+')';}},'','left:280px;top:70px;width:520px;height:520px;border:5px solid #e3c26b;border-radius:28%');
 glowAt(s,540,330,900,0,2.5,.05);
 logoBox(s,280,70,520,0,2.5,{a:'pop',i:0,o:.2});
 ar(s,'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',96,.1,1.9,'left:20px;top:690px;width:1040px');
 AT(s,.4,2.5,{a:'zoom',i:.5},'','left:290px;top:900px;width:500px;height:38px',A.divider());})();

/* S2 2.5–6.5 title */
(function(){const s=scene(2.5,6.5);
 AT(s,2.5,6.5,{i:.6,fn:(el,t,lt)=>'rotate('+(lt*12)+'deg)'},'','left:40px;top:90px;width:1000px;height:1000px;opacity:.5',A.medallion());
 glowAt(s,540,600,950,2.5,6.5,.05);
 ar(s,'حَدِيثُ الْيَوْمِ',150,2.9,4.6,'left:20px;top:40px;width:1040px');
 ico(s,A.book(),160,380,760,498,3.2,6.5,{a:'pop',i:.6,fn:(el,t,lt)=>'translateY('+(Math.sin(lt*3)*8)+'px)'});
 AT(s,3.6,6.5,{a:'zoom',i:.5},'','left:290px;top:960px;width:500px;height:38px',A.divider());
 [[150,1010],[500,1040],[850,1010]].forEach((p,i)=>ico(s,A.star(),p[0],p[1],80,80,4+i*.3,6.5,{a:'pop',i:.4,fn:(el,t,lt)=>'rotate('+(lt*50)+'deg)'}));})();

/* S3 6.5–10.5 narrator */
(function(){const s=scene(6.5,10.5);
 const c=card(s,90,40,900,370,6.6,10.5);
 ar(c,'عَلْقَمَةُ بْنُ وَقَّاصٍ',104,6.9,8.4,'left:10px;top:40px;width:870px');
 ar(c,'اللَّيْثِيُّ رَحِمَهُ اللَّهُ',88,8.4,10.0,'left:10px;top:200px;width:870px');
 const cc=(x,s0)=>AT(s,s0,10.5,{a:'pop',i:.5},'circle','left:'+x+'px;top:560px;width:200px;height:200px','<div style="position:absolute;left:40px;top:40px;width:120px;height:120px">'+A.star()+'</div>');
 cc(130,7.2);cc(440,8.6);
 AT(s,8.4,10.5,{a:'sl',i:.4},'','left:340px;top:645px;width:90px;height:0;border-top:7px dotted #e3c26b');
 AT(s,9.6,10.5,{a:'sl',i:.4},'','left:650px;top:645px;width:110px;height:0;border-top:7px dotted #e3c26b');
 glowAt(s,870,660,360,9.8,10.5);
 ico(s,A.dome(),770,520,200,267,9.8,10.5,{a:'pop',i:.5});})();

/* S4 10.5–15 Umar on the minbar */
(function(){const s=scene(10.5,15);
 glowAt(s,540,380,950,10.5,15,.05);
 ico(s,A.minbar(['لَا إِلَٰهَ إِلَّا اللَّهُ','مُحَمَّدٌ رَسُولُ اللَّهِ']),240,60,600,760,10.7,15,{a:'pop',i:.6});
 const arcs=AT(s,12.2,15,{a:'fade',i:.4,fn:(el,t,lt)=>{['a1','a2','a3'].forEach((n,i)=>{const q=el.querySelector('.'+n);if(q)q.style.opacity=(.25+.75*Math.max(0,Math.sin(lt*6-i*.9))).toFixed(2);});}},'','left:780px;top:60px;width:220px;height:220px',A.arcs());
 const c=card(s,90,860,900,300,11.0,15);
 ar(c,'عُمَرُ بْنُ الْخَطَّابِ',100,11.3,12.9,'left:10px;top:30px;width:870px');
 ar(c,'رَضِيَ اللَّهُ عَنْهُ',86,12.9,14.5,'left:10px;top:160px;width:870px');})();

/* S5 15–18.5 the Messenger of Allah said */
(function(){const s=scene(15,18.5);
 const c=card(s,90,30,900,340,15.1,18.5);
 ar(c,'قَالَ رَسُولُ اللَّهِ',104,15.3,16.6,'left:10px;top:36px;width:870px');
 ar(c,'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ',88,16.6,18.1,'left:10px;top:190px;width:870px');
 AT(s,15,18.5,{i:.8,fn:(el,t,lt)=>'rotate('+(lt*14)+'deg)'},'','left:130px;top:380px;width:800px;height:800px;opacity:.28',A.burst());
 glowAt(s,540,800,800,15,18.5,.06);
 ico(s,A.dome(),250,420,560,747,15.4,18.5,{a:'rise',i:.7,fn:(el,t,lt)=>'scale('+pulse(lt,3,.015)+')'});})();

/* S6 18.5–36 the core text */
(function(){const s=scene(18.5,36);
 const c=card(s,50,20,980,720,18.6,36);
 ar(c,'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',92,18.7,20.7,'left:10px;top:40px;width:950px');
 ar(c,'وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',88,23.6,26.0,'left:10px;top:200px;width:950px');
 AT(c,28.6,36,{a:'zoom',i:.4},'','left:240px;top:350px;width:500px;height:38px',A.divider());
 ar(c,'فَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوْ امْرَأَةٍ يَنْكِحُهَا',62,28.7,32.3,'left:30px;top:400px;width:920px');
 ar(c,'فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ',66,32.6,35.5,'left:30px;top:580px;width:920px');
 const pair=(a,b,s0,e0,ar1,col)=>{pill(s,a,90,860,330,s0,e0,{a:'pop',i:.4});AT(s,s0+.15,e0,{a:'fade',i:.4},'','left:450px;top:880px;width:180px;height:75px',ar1(col));pill(s,b,660,860,330,s0+.25,e0,{a:'pop',i:.4},true);};
 pair('কাজ','নিয়ত',20.8,25.8,ARROW,'#e3c26b');
 pair('নিয়ত','ফল',26.0,28.4,ARROW1,'#e3c26b');
 glowAt(s,300,990,420,28.8,36);glowAt(s,780,990,420,30.6,36);
 ico(s,A.coins(),185,860,230,230,28.9,36,{a:'pop',i:.5,fn:(el,t,lt)=>'translateY('+(Math.sin(lt*3)*7)+'px)'});
 ar(s,'دُنْيَا',72,29.2,30.2,'left:130px;top:1090px;width:340px');
 AT(s,30.4,36,{a:'fade',i:.4},'ar gold','left:440px;top:930px;width:200px;font-size:72px;text-align:center','أَوْ');
 ico(s,A.ring(),665,860,230,230,30.7,36,{a:'pop',i:.5,fn:(el,t,lt)=>'translateY('+(Math.sin(lt*3+1)*7)+'px)'});
 ar(s,'امْرَأَةٌ',72,31.0,32.0,'left:610px;top:1090px;width:340px');})();

/* S7 36–38.5 the source */
(function(){const s=scene(36,38.5);
 glowAt(s,540,420,900,36,38.5);
 const cv=AT(s,36.1,38.5,{a:'rise',i:.5},'card','left:270px;top:20px;width:540px;height:760px;background:linear-gradient(160deg,#17705a,#06291f)');
 E(cv,'','left:20px;top:150px;width:470px;height:470px;opacity:.45',A.medallion());
 [[8,8,0],[462,8,90],[462,702,180],[8,702,270]].forEach(p=>E(cv,'','left:'+p[0]+'px;top:'+p[1]+'px;width:70px;height:70px;transform:rotate('+p[2]+'deg)',A.corner()));
 ar(cv,'صَحِيحُ الْبُخَارِيِّ',84,36.3,37.6,'left:10px;top:270px;width:510px');
 AT(s,36.5,38.5,{a:'zoom',i:.4},'','left:290px;top:830px;width:500px;height:38px',A.divider());
 const nb=AT(s,37.0,38.5,{a:'pop',i:.4},'chip','left:250px;top:900px;width:580px;text-align:center;padding:4px 30px');ar(nb,'الْحَدِيثُ رَقْمُ ١',78,37.1,38.0,'position:relative;width:100%');})();

/* S8 38.5–40.2 think */
(function(){const s=scene(38.5,40.2);
 AT(s,38.5,40.2,{i:.5,fn:(el,t,lt)=>'rotate('+(lt*20)+'deg)'},'','left:140px;top:160px;width:800px;height:800px;opacity:.4',A.burst());
 glowAt(s,540,540,900,38.5,40.2,.08);
 ico(s,A.bulb(),330,200,420,588,38.6,40.2,{a:'pop',i:.5});})();

/* S9 40.2–49.8 same act, two intentions */
(function(){const s=scene(40.2,49.8);
 const mat=(x,s0)=>ico(s,A.mat(),x,400,320,512,s0,49.8,{a:'pop',i:.5});
 mat(110,40.4);mat(650,40.4);
 AT(s,42.5,49.8,{a:'fade',i:.6,fn:(el,t,lt)=>{el.style.opacity=(.75+.25*Math.sin(lt*4)).toFixed(2);}},'','left:50px;top:90px;width:440px;height:500px',A.svg('0 0 440 500','<polygon points="190,0 250,0 410,500 30,500" fill="url(#gBeam)"/>'));
 ar(s,'لِلَّهِ',96,42.6,43.9,'left:90px;top:10px;width:360px');
 [[670,150],[790,120],[910,150]].forEach((p,i)=>ico(s,A.eye(),p[0]-30,p[1]+60,150,90,45.0+i*.35,49.8,{a:'pop',i:.35,fn:(el,t,lt)=>'translateX('+(Math.sin(lt*3+i)*6)+'px)'}));
 ar(s,'لِلنَّاسِ',96,45.0,46.4,'left:630px;top:10px;width:360px');
 AT(s,47.2,49.8,{a:'fade',i:.5},'','left:110px;top:950px;width:860px;height:60px',A.svg('0 0 860 60','<path d="M0 0 V36 H860 V0" fill="none" stroke="#e3c26b" stroke-width="7" stroke-linejoin="round"/>'));
 AT(s,47.4,49.8,{a:'pop',i:.4},'','left:470px;top:560px;width:140px;height:100px',A.svg('0 0 140 100','<rect x="10" y="14" width="120" height="22" rx="8" fill="'+'url(#gGold)'+'"/><rect x="10" y="62" width="120" height="22" rx="8" fill="url(#gGold)"/>'));
 pill(s,'একই রকম',300,1050,480,47.6,49.8,{a:'rise',i:.4},true,66);})();

/* S10 49.8–53 sky vs earth */
(function(){const s=scene(49.8,53);
 AT(s,49.8,53,{i:.5},'','left:0;top:0;width:1080px;height:560px;background:linear-gradient(180deg,rgba(120,210,230,.38),rgba(120,210,230,0))');
 AT(s,49.8,53,{i:.5},'','left:0;top:700px;width:1080px;height:500px;background:linear-gradient(0deg,rgba(2,12,10,.85),rgba(2,12,10,0))');
 const mv=(el,t,lt,dy)=>{const k=ease.io(clamp(lt/1.8));return 'translateY('+(dy*k)+'px)';};
 const mL=ico(s,A.mat(),150,400,240,384,49.9,53,{a:'fade',i:.4,fn:(el,t,lt)=>mv(el,t,lt,-360)});
 AT(s,49.9,53,{a:'fade',i:.4,fn:(el,t,lt)=>mv(el,t,lt,-360)},'','left:100px;top:0;width:340px;height:400px;opacity:.8',A.svg('0 0 340 400','<polygon points="150,0 190,0 300,400 40,400" fill="url(#gBeam)"/>'));
 ico(s,A.mat(),690,400,240,384,49.9,53,{a:'fade',i:.4,fn:(el,t,lt)=>mv(el,t,lt,380)});
 AT(s,51.0,53,{a:'pop',i:.4},'','left:500px;top:420px;width:80px;height:360px',A.svg('0 0 80 360','<path d="M40 14 V346 M16 40 L40 10 L64 40 M16 320 L40 350 L64 320" fill="none" stroke="#f8e7ae" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>'));
 AT(s,50.6,53,{a:'rise',i:.4},'bn gold','left:430:px;top:70px;width:220px;font-size:70px;font-weight:700'.replace(':px','px'),'আকাশ');
 AT(s,51.5,53,{a:'rise',i:.4},'bn gold','left:430px;top:1050px;width:220px;font-size:70px;font-weight:700','পাতাল');})();

/* S11 53–60 everyday acts become worship */
(function(){const s=scene(53,60);
 const cards=[['নামাজ',A.mat(),110,60,53.2,'0 0 0 0'],['রোজা',A.crescentStar(),590,60,54.4],['দান',A.charity(),110,500,55.5],['ঘুম',A.sleep(),590,500,57.0]];
 cards.forEach(c=>{const cx=c[2]+190,cy=c[3]+200;
  AT(s,c[4],60,{a:'pop',i:.5,fn:(el,t,lt)=>{const g=ease.io(clamp((t-58.0)/.6)),k=ease.io(clamp((t-58.7)/.6));el.style.borderColor='rgb(248,'+Math.round(194+37*g)+','+Math.round(107+60*g)+')';el.style.boxShadow='0 0 '+(60*g)+'px rgba(248,231,174,'+g+')';if(k>0){el.style.opacity=(1-k).toFixed(3);return 'translate('+((540-cx)*k)+'px,'+((520-cy)*k)+'px) scale('+(1-.7*k)+')';}return '';}},'card','left:'+c[2]+'px;top:'+c[3]+'px;width:380px;height:400px',
  '<div style="position:absolute;left:80px;top:24px;width:220px;height:260px">'+c[1]+'</div><div class="bn" style="position:absolute;left:0;top:296px;width:100%;font-size:68px;font-weight:700;color:#f8d36b">'+c[0]+'</div>');});
 AT(s,58.9,60,{i:.3,fn:(el,t,lt)=>'rotate('+(lt*60)+'deg) scale('+(.4+ease.out(clamp(lt/.6))*.8)+')'},'','left:240px;top:220px;width:600px;height:600px;opacity:.7',A.burst());
 AT(s,58.9,60,{a:'pop',i:.5},'','left:140px;top:420px;width:800px;height:200px');
 ar(s,'عِبَادَةٌ',170,59.0,59.7,'left:20px;top:410px;width:1040px;color:#fff;');})();

/* S12a 60–62.5 story of the heart */
(function(){const s=scene(60,62.5);
 glowAt(s,540,520,950,60,62.5,.06);
 ico(s,A.heart(),230,170,620,558,60.1,62.5,{a:'pop',i:.55,fn:(el,t,lt)=>'scale('+(1+.06*Math.abs(Math.sin(lt*4)))+')'});
 ar(s,'نِيَّةٌ',150,60.7,61.6,'left:20px;top:360px;width:1040px');})();

/* S12b 62.5–66 world sees deeds, Allah sees intention */
(function(){const s=scene(62.5,66);
 bn(s,'দুনিয়া',74,62.6,63.4,'left:60px;top:150px;width:420px;font-weight:700;color:#f8d36b');
 ico(s,A.eye(),90,300,360,216,62.7,66,{a:'pop',i:.5});
 bn(s,'কাজ',70,63.2,64.0,'left:60px;top:560px;width:420px');
 AT(s,64.2,66,{a:'fade',i:.4},'','left:495px;top:300px;width:90px;height:90px',A.svg('0 0 90 90','<path d="M10 45 H70 M52 22 L76 45 L52 68" fill="none" stroke="#e3c26b" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>'));
 bn(s,'আল্লাহ',74,64.2,65.0,'left:600px;top:150px;width:420px;font-weight:700;color:#f8d36b');
 glowAt(s,810,430,560,64.3,66,.08);
 ico(s,A.heart(),660,300,300,270,64.3,66,{a:'pop',i:.5,fn:(el,t,lt)=>'scale('+(1+.07*Math.abs(Math.sin(lt*5)))+')'});
 bn(s,'নিয়ত',70,65.0,65.8,'left:600px;top:610px;width:420px');})();

/* S13 66–69.5 pause one second */
(function(){const s=scene(66,69.5);
 glowAt(s,540,420,900,66,69.5,.05);
 AT(s,66.1,69.5,{a:'pop',i:.5,fn:(el,t,lt)=>{if(!el._r)el._r=el.querySelector('.swr');const k=clamp((lt-.5)/2.4);el._r.style.strokeDashoffset=(578*(1-k)).toFixed(1);return '';}},'','left:270px;top:90px;width:540px;height:612px',A.stopwatch());
 bn(s,'এক সেকেন্ড',110,66.7,68.2,'left:40px;top:790px;width:1000px;font-weight:700;color:#f8d36b');
 AT(s,67.4,69.5,{a:'pop',i:.4},'','left:340px;top:980px;width:400px;height:60px',A.divider());})();

/* S14 69.5–72 ask yourself why */
(function(){const s=scene(69.5,72);
 glowAt(s,540,420,950,69.5,72,.06);
 ico(s,A.question(),290,40,500,650,69.6,72,{a:'pop',i:.55,fn:(el,t,lt)=>'rotate('+(Math.sin(lt*3)*4)+'deg)'});
 bn(s,'কেন?',190,70.2,71.2,'left:40px;top:720px;width:1000px;font-weight:700;color:#f8d36b');})();

/* S15 72–74.8 sunrise */
(function(){const s=scene(72,74.8);
 AT(s,72,74.8,{i:.4},'','left:140px;top:30px;width:800px;height:470px;overflow:hidden;border-radius:400px 400px 30px 30px;background:linear-gradient(180deg,rgba(255,170,90,.35),rgba(255,230,150,.55))');
 const sun=AT(s,72,74.8,{i:.4,fn:(el,t,lt)=>'translateY('+((1-ease.out(clamp(lt/2.2)))*300)+'px)'},'','left:240px;top:60px;width:600px;height:600px;clip-path:inset(0 0 190px 0)',A.sun());
 AT(s,72,74.8,{i:.4},'','left:100px;top:490px;width:880px;height:8px;border-radius:4px;background:linear-gradient(90deg,transparent,#e3c26b,transparent)');
 pill(s,'নিয়ত ঠিক',230,600,620,72.2,74.8,{a:'pop',i:.45},false,78);
 pill(s,'জীবন ঠিক',230,770,620,73.3,74.8,{a:'pop',i:.45},true,78);
 ar(s,'إِنْ شَاءَ اللَّهُ',104,73.9,74.7,'left:20px;top:960px;width:1040px');})();

/* S16 74.8–78 share */
(function(){const s=scene(74.8,78);
 glowAt(s,540,300,700,74.8,78,.05);
 ico(s,A.book(),330,90,420,276,74.9,76.3,{a:'pop',i:.45});
 const btn=(x,svg,s0,fn)=>{AT(s,s0,78,{a:'pop',i:.45,fn},'circle','left:'+x+'px;top:420px;width:260px;height:260px','<div style="position:absolute;left:55px;top:55px;width:150px;height:150px">'+svg+'</div>');};
 btn(70,A.like(),76.3);btn(410,A.comment(),76.8);
 btn(750,A.share(),77.2,(el,t,lt)=>{el.style.boxShadow='0 0 '+(40+30*Math.abs(Math.sin(lt*6)))+'px rgba(248,231,174,.9)';return 'scale('+(1+.07*Math.abs(Math.sin(lt*6)))+')';});
 bn(s,'ভালো লাগলে',56,76.3,77.1,'left:20px;top:720px;width:320px;font-weight:700;color:#f8d36b');
 bn(s,'শেয়ার',70,77.2,78,'left:700px;top:710px;width:360px;font-weight:700;color:#f8d36b');})();

/* S17 78–82 call to action */
(function(){const s=scene(78,82);
 for(let k=0;k<3;k++)AT(s,78,82,{i:.3,o:0,fn:(el,t,lt)=>{const q=((lt*.9+k/3)%1);el.style.opacity=((1-q)*.7).toFixed(3);return 'scale('+(.95+.7*q)+')';}},'','left:340px;top:30px;width:400px;height:400px;border:5px solid #e3c26b;border-radius:28%');
 glowAt(s,540,230,760,78,82,.06);
 logoBox(s,340,30,400,78.05,82,{a:'pop',i:.5,fn:(el,t,lt)=>'scale('+pulse(lt,4,.025)+')'});
 bn(s,APP,64,78.3,79.7,'left:30px;top:470px;width:1020px;font-weight:700;color:#f8d36b');
 pill(s,'আজই ইনষ্টল করুন',250,690,580,79.2,82,{a:'pop',i:.45},true,62);
 badge(s,260,850,560,79.6,82,{a:'pop',i:.5},(el,t,lt)=>'scale('+pulse(lt,5,.035)+')');})();

/* ================= SUBTITLES ================= */
const sp=E(root,'','left:60px;top:1445px;width:960px;height:330px');sp.id='subpanel';
const SUBS=[];
LINES.forEach(L=>{const d=E(sp,'sub','left:0;top:0;width:100%;height:100%');const box=E(d,'st bn','position:relative;width:100%;font-weight:600;font-size:'+(L.text.length>62?52:60)+'px;line-height:1.38');
 const ws=L.text.split(/\s+/).filter(Boolean),tot=ws.reduce((a,w)=>a+w.length,0);let acc=0,inq=false;const dur=(L.e-L.s)*.86;
 ws.forEach(w=>{if(w.indexOf('❝')>=0)inq=true;const hl=inq||/নিয়ত|আল্লাহ|হাদিস|ইবাদত|শেয়ার|ইনষ্টল/.test(w);if(w.indexOf('❞')>=0)inq=false;
  const x=document.createElement('span');x.className='w'+(hl?' hl':'');x.textContent=w;box.appendChild(x);const t0=L.s+dur*acc/tot;acc+=w.length;WR.push({sp:x,st:t0,en:t0+.28});});
 track(d,L.s,L.e,{a:'fade',i:.15,o:.15});SUBS.push({d,box});});

/* progress bar */
E(root,'','left:60px;top:1850px;width:960px;height:8px;border-radius:4px;background:rgba(255,246,220,.18)');
const prog=E(root,'','left:60px;top:1850px;width:0;height:8px;border-radius:4px;background:linear-gradient(90deg,#a67c28,#f8e7ae)');

/* ================= renderAt ================= */
window.renderAt=function(t){
 t=clamp(t,0,DUR);
 for(let n=0;n<TR.length;n++){const k=TR[n],el=k.el,o=k.o;
  if(t<k.s||t>k.e){el.style.visibility='hidden';continue;}
  el.style.visibility='inherit';
  const pin=o.i<=0?1:clamp((t-k.s)/o.i),pout=o.o<=0?1:clamp((k.e-t)/o.o);
  el.style.opacity=((o.a==='pop'?clamp(pin*2.2):ease.out(pin))*ease.out(pout)).toFixed(3);
  const pre=PRE[o.a]?PRE[o.a](o.a==='pop'?ease.back(pin):ease.out(pin)):'';
  const ex=o.fn?o.fn(el,t,t-k.s,pin,pout):'';
  el.style.transform=pre+' '+(ex||'');}
 for(let n=0;n<WR.length;n++){const w=WR[n],p=ease.out(clamp((t-w.st)/(w.en-w.st)));w.sp.style.opacity=p.toFixed(3);w.sp.style.transform='translateY('+((1-p)*24)+'px)';}
 bgUpdate(t);prog.style.width=(960*t/DUR)+'px';};

/* ================= ready ================= */
try{await document.fonts.ready;}catch(e){}
await Promise.all(Array.from(document.images).map(i=>i.decode?i.decode().catch(()=>{}):Promise.resolve()));
/* shrink any subtitle that would overflow the panel */
SUBS.forEach(S=>{S.d.style.visibility='visible';S.d.style.opacity='1';let fs=parseFloat(S.box.style.fontSize);while(S.box.offsetHeight>268&&fs>40){fs-=2;S.box.style.fontSize=fs+'px';}});
window.renderAt(0);
window.__ready=true;
})();
