'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

/* ─── Teams ──────────────────────────────────────────────── */
const TEAMS = [
  { name: 'Brasil',     flag: '🇧🇷', abbr: 'BRA', c1: '#00843D', c2: '#FFCD00', foil: ['#00843D','#005c2b','#009940'], text: '#FFCD00', jersey: 'yellow and green Brazil Seleção Brasileira soccer jersey' },
  { name: 'Argentina',  flag: '🇦🇷', abbr: 'ARG', c1: '#6CACE4', c2: '#FFFFFF', foil: ['#b8860b','#daa520','#ffd700'], text: '#003087', jersey: 'light blue and white Argentina Albiceleste stripes soccer jersey' },
  { name: 'França',     flag: '🇫🇷', abbr: 'FRA', c1: '#002395', c2: '#FFFFFF', foil: ['#b8860b','#daa520','#ffd700'], text: '#002395', jersey: 'dark blue France Les Bleus soccer jersey' },
  { name: 'Alemanha',   flag: '🇩🇪', abbr: 'GER', c1: '#2a2a2a', c2: '#FFFFFF', foil: ['#888','#aaa','#ccc'], text: '#ffffff', jersey: 'white Germany national team soccer jersey' },
  { name: 'Portugal',   flag: '🇵🇹', abbr: 'POR', c1: '#C8102E', c2: '#FFFFFF', foil: ['#b8860b','#daa520','#ffd700'], text: '#C8102E', jersey: 'red Portugal national team soccer jersey' },
  { name: 'Espanha',    flag: '🇪🇸', abbr: 'ESP', c1: '#AA151B', c2: '#FFFFFF', foil: ['#AA151B','#c0392b','#e74c3c'], text: '#AA151B', jersey: 'red Spain La Roja soccer jersey' },
  { name: 'Holanda',    flag: '🇳🇱', abbr: 'NED', c1: '#FF4F00', c2: '#FFFFFF', foil: ['#b8860b','#daa520','#ffd700'], text: '#FF4F00', jersey: 'orange Netherlands Oranje soccer jersey' },
  { name: 'Itália',     flag: '🇮🇹', abbr: 'ITA', c1: '#0066CC', c2: '#FFFFFF', foil: ['#0066CC','#0047a0','#003d8a'], text: '#0066CC', jersey: 'blue Italy Azzurri soccer jersey' },
  { name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', abbr: 'ENG', c1: '#CF091D', c2: '#FFFFFF', foil: ['#b8860b','#daa520','#ffd700'], text: '#CF091D', jersey: 'white England Three Lions soccer jersey' },
  { name: 'Marrocos',   flag: '🇲🇦', abbr: 'MAR', c1: '#C1272D', c2: '#FFFFFF', foil: ['#b8860b','#daa520','#ffd700'], text: '#C1272D', jersey: 'red Morocco national team soccer jersey' },
  { name: 'Japão',      flag: '🇯🇵', abbr: 'JPN', c1: '#003087', c2: '#FFFFFF', foil: ['#003087','#001a4d','#002470'], text: '#003087', jersey: 'dark blue Japan Samurai Blue soccer jersey' },
  { name: 'Uruguai',    flag: '🇺🇾', abbr: 'URU', c1: '#4B9CD3', c2: '#FFFFFF', foil: ['#b8860b','#daa520','#ffd700'], text: '#003087', jersey: 'light blue Uruguay Celeste soccer jersey' },
];
type Team = typeof TEAMS[0];

const POSITIONS_FULL = ['Atacante','Meia-Atacante','Ponta Direita','Centroavante','Meia'];
const POS_ABBR       = ['ATK',     'CAM',          'PNT',         'CA',          'MEI'];

function rnd(a:number,b:number){ return Math.floor(Math.random()*(b-a+1))+a; }
function pick<T>(arr:T[]):T{ return arr[Math.floor(Math.random()*arr.length)]; }

/* ─── Image utils ────────────────────────────────────────── */
function resizeImage(file:File,maxSize=1024):Promise<string>{
  return new Promise((res,rej)=>{
    const img=new window.Image(), url=URL.createObjectURL(file);
    img.onload=()=>{
      const s=Math.min(1,maxSize/Math.max(img.width,img.height));
      const c=document.createElement('canvas');
      c.width=Math.round(img.width*s); c.height=Math.round(img.height*s);
      c.getContext('2d')!.drawImage(img,0,0,c.width,c.height);
      URL.revokeObjectURL(url); res(c.toDataURL('image/jpeg',0.92));
    };
    img.onerror=rej; img.src=url;
  });
}
function loadImg(src:string):Promise<HTMLImageElement>{
  return new Promise((res,rej)=>{
    const img=new window.Image();
    if(!src.startsWith('data:')) img.crossOrigin='anonymous';
    img.onload=()=>res(img); img.onerror=rej; img.src=src;
  });
}
function rrect(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number){
  ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arc(x+w-r,y+r,r,-Math.PI/2,0);
  ctx.lineTo(x+w,y+h-r);ctx.arc(x+w-r,y+h-r,r,0,Math.PI/2);ctx.lineTo(x+r,y+h);
  ctx.arc(x+r,y+h-r,r,Math.PI/2,Math.PI);ctx.lineTo(x,y+r);ctx.arc(x+r,y+r,r,Math.PI,3*Math.PI/2);
  ctx.closePath();
}

/* ─── Panini Card HTML (preview) ─────────────────────────── */
function FigurinhaCard({imageUrl,team,name,posIdx,jerseyNum,bday,height,weight,ovr,size=300}:{
  imageUrl:string;team:Team;name:string;posIdx:number;jerseyNum:number;
  bday:string;height:string;weight:string;ovr:number;size?:number;
}){
  const s=size/300;
  const H=Math.round(420*s);
  const topH=44*s;
  const botH=112*s;
  const [f1,f2,f3]=team.foil;
  return(
    <div style={{display:'inline-block',borderRadius:14*s,padding:3*s,background:`linear-gradient(135deg,${f1},${f2},${f3},${f2},${f1})`,boxShadow:`0 0 30px ${team.c1}66, 0 20px 60px rgba(0,0,0,0.7)`}}>
      <div style={{position:'relative',width:size,height:H,borderRadius:12*s,overflow:'hidden',background:`linear-gradient(145deg,${f1} 0%,${f2} 25%,${f3} 50%,${f2} 75%,${f1} 100%)`}}>
        <div style={{position:'absolute',inset:0,backgroundImage:`repeating-linear-gradient(45deg,rgba(255,255,255,0.10) 0,rgba(255,255,255,0) 4px,rgba(0,0,0,0.06) 8px),repeating-linear-gradient(-45deg,rgba(255,255,255,0.07) 0,rgba(255,255,255,0) 5px,rgba(0,0,0,0.05) 10px)`}}/>
        <div style={{position:'absolute',right:-6*s,bottom:botH+10*s,fontSize:220*s,fontWeight:900,fontStyle:'italic',lineHeight:1,color:team.c1,opacity:0.22,userSelect:'none',letterSpacing:'-0.04em',zIndex:1}}>{jerseyNum}</div>
        <motion.div animate={{x:['-150%','200%']}} transition={{repeat:Infinity,duration:4.5,ease:'linear',repeatDelay:3}} style={{position:'absolute',inset:0,zIndex:5,pointerEvents:'none',background:'linear-gradient(105deg,transparent 28%,rgba(255,255,255,0.22) 45%,rgba(255,255,255,0.3) 50%,rgba(255,255,255,0.22) 55%,transparent 72%)'}}/>
        <div style={{position:'absolute',top:0,left:0,right:0,height:topH,background:team.c1,display:'flex',alignItems:'center',justifyContent:'space-between',padding:`0 ${10*s}px`,zIndex:6}}>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:0}}>
            <span style={{color:'#fff',fontWeight:900,fontStyle:'italic',fontSize:14*s,letterSpacing:'0.06em',lineHeight:1}}>FIFA</span>
            <span style={{color:'rgba(255,255,255,0.6)',fontSize:6*s,letterSpacing:'0.15em',lineHeight:1}}>WORLD CUP</span>
          </div>
          <span style={{color:team.text,fontSize:9*s,fontWeight:700,letterSpacing:'0.12em'}}>COPA MUNDO 2026</span>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:20*s,lineHeight:1}}>{team.flag}</div>
            <div style={{color:'rgba(255,255,255,0.7)',fontSize:8*s,fontWeight:700,letterSpacing:'0.1em'}}>{team.abbr}</div>
          </div>
        </div>
        <div style={{position:'absolute',top:topH,left:0,right:0,bottom:botH,zIndex:2}}>
          <Image src={imageUrl} alt="Player" fill unoptimized style={{objectFit:'cover',objectPosition:'center top'}}/>
          <div style={{position:'absolute',bottom:0,left:0,right:0,height:60*s,background:'linear-gradient(to top,rgba(255,255,255,0.8),transparent)'}}/>
          <div style={{position:'absolute',top:10*s,left:10*s,background:'rgba(0,0,0,0.72)',borderRadius:8*s,padding:`${6*s}px ${10*s}px`,textAlign:'center',minWidth:42*s}}>
            <div style={{color:team.text,fontWeight:900,fontSize:28*s,lineHeight:1,fontStyle:'italic'}}>{ovr}</div>
            <div style={{color:'rgba(255,255,255,0.5)',fontWeight:700,fontSize:8*s,letterSpacing:'0.12em'}}>OVR</div>
          </div>
        </div>
        <div style={{position:'absolute',bottom:0,left:0,right:0,height:botH,background:'#ffffff',zIndex:6,padding:`${8*s}px ${10*s}px ${6*s}px`,display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
          <div>
            <div style={{fontSize:(name.length>12?14:17)*s,fontWeight:800,color:'#111',letterSpacing:'0.01em',lineHeight:1.1,textTransform:'uppercase'}}>
              {name.includes(' ')
                ? <>{name.split(' ').slice(0,-1).join(' ')}{' '}<strong>{name.split(' ').slice(-1)[0]}</strong></>
                : <strong>{name}</strong>}
            </div>
            <div style={{fontSize:8*s,color:'#666',marginTop:2*s,letterSpacing:'0.03em'}}>{bday}&nbsp;&nbsp;|&nbsp;&nbsp;{height} m&nbsp;&nbsp;|&nbsp;&nbsp;{weight} kg</div>
          </div>
          <div style={{background:team.c1,borderRadius:4*s,padding:`${3*s}px ${8*s}px`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span style={{color:'#fff',fontSize:9*s,fontWeight:700,letterSpacing:'0.05em'}}>BibCar FC&nbsp;·&nbsp;{POSITIONS_FULL[posIdx]}</span>
            <div style={{display:'flex',alignItems:'center',gap:4*s}}>
              <div style={{width:18*s,height:18*s,borderRadius:3*s,overflow:'hidden',flexShrink:0,background:'#fff'}}>
                <Image src="/logo.png" alt="BibCar" width={18} height={18} style={{objectFit:'contain',width:'100%',height:'100%'}}/>
              </div>
              <span style={{color:team.text,fontSize:9*s,fontWeight:900,letterSpacing:'0.1em'}}>BIBCAR</span>
            </div>
          </div>
          <div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:4*s}}>
            <span style={{fontSize:12*s}}>{team.flag}</span>
            <span style={{color:'#999',fontSize:7*s,letterSpacing:'0.1em'}}>{team.abbr}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Canvas Story 1080×1920 ─────────────────────────────── */
async function generateStoryBlob(resultUrl:string,team:Team,name:string,posIdx:number,jerseyNum:number,bday:string,height:string,weight:string,cardNum:number,ovr:number):Promise<Blob>{
  const W=1080,H=1920;
  const canvas=document.createElement('canvas');
  canvas.width=W; canvas.height=H;
  const ctx=canvas.getContext('2d')!;
  const playerSrc=`/api/fal/proxy-image?url=${encodeURIComponent(resultUrl)}`;
  const [playerImg,logoImg]=await Promise.all([loadImg(playerSrc),loadImg('/logo.png')]);
  const [f1,f2,f3]=team.foil;
  const bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#060606'); bg.addColorStop(0.5,team.c1+'14'); bg.addColorStop(1,'#040404');
  ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
  const spots:[number,number,number,string][]=[
    [W*0.18,0,620,team.c1+'38'],[W*0.82,0,500,team.c2+'28'],
    [W*0.5,H,700,team.c1+'22'],[W*0.5,H*0.5,400,'#7F00FF22'],
  ];
  spots.forEach(([sx,sy,sr,sc])=>{
    const sg=ctx.createRadialGradient(sx,sy,0,sx,sy,sr);
    sg.addColorStop(0,sc); sg.addColorStop(1,'transparent');
    ctx.fillStyle=sg; ctx.fillRect(0,0,W,H);
  });
  ctx.fillStyle='rgba(255,255,255,0.035)';
  for(let gx=40;gx<W;gx+=68) for(let gy=40;gy<H;gy+=68){ ctx.beginPath(); ctx.arc(gx,gy,1.8,0,Math.PI*2); ctx.fill(); }
  const barN=54,barW=Math.floor(W/barN),barGap=4;
  const barFn=(i:number,f1:number,f2:number,f3:number,base:number,a1:number,a2:number,a3:number)=>{
    const t=i/(barN-1);
    return Math.max(10,base+Math.sin(t*Math.PI*f1)*a1+Math.sin(t*Math.PI*f2+0.6)*a2+Math.sin(t*Math.PI*f3+1.3)*a3);
  };
  for(let i=0;i<barN;i++){
    const bH=barFn(i,4,9,16,80,90,55,28);
    const bX=i*barW+barGap/2;
    const grad=ctx.createLinearGradient(0,H-bH,0,H);
    grad.addColorStop(0,team.c1+'ee'); grad.addColorStop(0.6,team.c1+'66'); grad.addColorStop(1,team.c1+'11');
    ctx.fillStyle=grad; rrect(ctx,bX,H-bH,barW-barGap,bH,3); ctx.fill();
  }
  for(let i=0;i<barN;i++){
    const bH=barFn(i,5,11,18,50,65,38,20)*0.65;
    const bX=i*barW+barGap/2;
    const grad=ctx.createLinearGradient(0,0,0,bH);
    grad.addColorStop(0,team.c1+'cc'); grad.addColorStop(0.6,team.c1+'44'); grad.addColorStop(1,team.c1+'00');
    ctx.fillStyle=grad; rrect(ctx,bX,0,barW-barGap,bH,3); ctx.fill();
  }
  const vig=ctx.createRadialGradient(W/2,H/2,300,W/2,H/2,900);
  vig.addColorStop(0,'transparent'); vig.addColorStop(1,'rgba(0,0,0,0.55)');
  ctx.fillStyle=vig; ctx.fillRect(0,0,W,H);
  ctx.save();
  ctx.globalAlpha=0.55; ctx.drawImage(logoImg,W-88,28,52,52); ctx.globalAlpha=1;
  ctx.font='bold 18px Arial'; ctx.fillStyle='#C13EFF'; ctx.textAlign='right';
  ctx.fillText('BibCar',W-18,94);
  ctx.restore();
  ctx.textAlign='center';
  ctx.font='bold 80px Arial'; ctx.fillStyle='#ffffff';
  ctx.fillText('FUI CONVOCADO!',W/2,180);
  ctx.font='42px Arial'; ctx.fillStyle='rgba(255,255,255,0.55)';
  ctx.fillText(`${team.flag}  Seleção de ${team.name}  ·  Copa 2026`,W/2,246);
  const cW=620,cH=868,cX=(W-cW)/2,cY=300,cR=18;
  const topH=80,botH=210;
  ctx.save();
  rrect(ctx,cX-4,cY-4,cW+8,cH+8,cR+4);
  const border=ctx.createLinearGradient(cX,cY,cX+cW,cY+cH);
  [f1,f2,f3,f2,f1].forEach((c,i,a)=>border.addColorStop(i/(a.length-1),c));
  ctx.strokeStyle=border; ctx.lineWidth=7; ctx.stroke();
  ctx.restore();
  ctx.save();
  rrect(ctx,cX,cY,cW,cH,cR); ctx.clip();
  const foil=ctx.createLinearGradient(cX,cY,cX+cW,cY+cH);
  [f1,f2,f3,f2,f1].forEach((c,i,a)=>foil.addColorStop(i/(a.length-1),c));
  ctx.fillStyle=foil; ctx.fillRect(cX,cY,cW,cH);
  ctx.save();
  for(let i=-cH;i<cW+cH;i+=12){ ctx.strokeStyle='rgba(255,255,255,0.07)'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(cX+i,cY); ctx.lineTo(cX+i+cH,cY+cH); ctx.stroke(); }
  ctx.restore();
  ctx.save();
  ctx.globalAlpha=0.18; ctx.fillStyle=team.c1;
  ctx.font='bold italic 400px Arial'; ctx.textAlign='right';
  ctx.fillText(String(jerseyNum),cX+cW-10,cY+topH+cH*0.7);
  ctx.globalAlpha=1; ctx.restore();
  ctx.fillStyle=team.c1; ctx.fillRect(cX,cY,cW,topH);
  ctx.font='bold italic 32px Arial'; ctx.fillStyle='#fff'; ctx.textAlign='left';
  ctx.fillText('FIFA',cX+20,cY+32);
  ctx.font='9px Arial'; ctx.fillStyle='rgba(255,255,255,0.6)';
  ctx.fillText('WORLD CUP',cX+20,cY+52);
  ctx.font='bold 26px Arial'; ctx.fillStyle=team.text; ctx.textAlign='center';
  ctx.fillText('COPA MUNDO 2026',cX+cW/2,cY+48);
  ctx.font='52px Arial'; ctx.textAlign='right';
  ctx.fillText(team.flag,cX+cW-46,cY+58);
  ctx.font='bold 20px Arial'; ctx.fillStyle='rgba(255,255,255,0.75)';
  ctx.fillText(team.abbr,cX+cW-14,cY+68);
  const pY=cY+topH,pH=cH-topH-botH;
  const scale=Math.max(cW/playerImg.naturalWidth,pH/playerImg.naturalHeight);
  const dw=playerImg.naturalWidth*scale,dh=playerImg.naturalHeight*scale;
  const dx=cX+(cW-dw)/2,dy=pY;
  ctx.save(); rrect(ctx,cX,pY,cW,pH,0); ctx.clip();
  ctx.drawImage(playerImg,dx,dy,dw,dh);
  ctx.restore();
  const fade=ctx.createLinearGradient(0,pY+pH-120,0,pY+pH);
  fade.addColorStop(0,'transparent'); fade.addColorStop(1,'rgba(255,255,255,0.9)');
  ctx.fillStyle=fade; ctx.fillRect(cX,pY+pH-120,cW,120);
  ctx.fillStyle='#ffffff'; ctx.fillRect(cX,cY+cH-botH,cW,botH);
  const nName=name.toUpperCase();
  const parts=nName.split(' ');
  const firstName=parts.slice(0,-1).join(' ');
  const lastName=parts.slice(-1)[0]||nName;
  const nY=cY+cH-botH+48;
  ctx.fillStyle='#111';
  if(firstName){ ctx.font=`500 ${nName.length>12?38:46}px Arial`; ctx.textAlign='left'; ctx.fillText(firstName+' ',cX+18,nY); const fw=ctx.measureText(firstName+' ').width; ctx.font=`bold ${nName.length>12?38:46}px Arial`; ctx.fillText(lastName,cX+18+fw,nY); }
  else { ctx.font=`bold ${nName.length>12?38:46}px Arial`; ctx.textAlign='left'; ctx.fillText(lastName,cX+18,nY); }
  ctx.font='22px Arial'; ctx.fillStyle='#777'; ctx.textAlign='left';
  ctx.fillText(`${bday}  |  ${height} m  |  ${weight} kg`,cX+18,nY+34);
  ctx.fillStyle=team.c1; rrect(ctx,cX+12,cY+cH-botH+90,cW-24,52,8); ctx.fill();
  ctx.font='bold 24px Arial'; ctx.fillStyle='#fff'; ctx.textAlign='left';
  ctx.fillText(`BibCar FC · ${POSITIONS_FULL[posIdx]}`,cX+24,cY+cH-botH+122);
  ctx.drawImage(logoImg,cX+cW-80,cY+cH-botH+95,44,44);
  ctx.font='bold 20px Arial'; ctx.fillStyle=team.text; ctx.textAlign='right';
  ctx.fillText('BIBCAR',cX+cW-84,cY+cH-botH+120);
  ctx.font='32px Arial'; ctx.textAlign='right';
  ctx.fillText(team.flag,cX+cW-12,cY+cH-12);
  ctx.font='bold 16px Arial'; ctx.fillStyle='#999';
  ctx.fillText(`#${cardNum}`,cX+20,cY+cH-14);
  ctx.fillStyle='rgba(0,0,0,0.72)'; rrect(ctx,cX+14,cY+topH+14,80,96,12); ctx.fill();
  ctx.font='bold 54px Arial'; ctx.fillStyle=team.text; ctx.textAlign='center';
  ctx.fillText(String(ovr),cX+54,cY+topH+68);
  ctx.font='bold 18px Arial'; ctx.fillStyle='rgba(255,255,255,0.5)';
  ctx.fillText('OVR',cX+54,cY+topH+88);
  ctx.restore();
  const bY=cY+cH+48;
  const pillW=360,pillH=72,pillX=(W-pillW)/2;
  const pillGrad=ctx.createLinearGradient(pillX,bY,pillX+pillW,bY);
  pillGrad.addColorStop(0,'#7F00FF'); pillGrad.addColorStop(1,'#C13EFF');
  ctx.fillStyle=pillGrad; rrect(ctx,pillX,bY,pillW,pillH,36); ctx.fill();
  ctx.drawImage(logoImg,pillX+18,bY+14,44,44);
  ctx.font='bold 38px Arial'; ctx.fillStyle='#fff'; ctx.textAlign='left';
  ctx.fillText('BibCar',pillX+72,bY+49);
  ctx.font='bold italic 24px Arial'; ctx.fillStyle='rgba(255,255,255,0.55)';
  ctx.textAlign='right'; ctx.fillText('o app de corridas da Copa',pillX+pillW-16,bY+49);
  ctx.font='26px Arial'; ctx.fillStyle='rgba(255,255,255,0.28)';
  ctx.textAlign='center'; ctx.fillText('bibcarbrasil.com.br',W/2,bY+pillH+36);
  ctx.font='bold 36px Arial'; ctx.fillStyle='rgba(255,255,255,0.65)';
  ctx.fillText('#Copa2026  #BibCar  #FigurinhaIA',W/2,bY+pillH+80);
  return new Promise(res=>canvas.toBlob(b=>res(b!),'image/png'));
}

/* ─── Team Roulette ──────────────────────────────────────── */
function TeamRoulette({onDone}:{onDone:(t:Team)=>void}){
  const [idx,setIdx]=useState(0); const [done,setDone]=useState(false);
  const winner=useRef(pick(TEAMS));
  useEffect(()=>{
    let i=0,delay=55,stopped=false;
    function step(){
      if(stopped) return; setIdx(c=>(c+1)%TEAMS.length); i++;
      if(i>24) delay=Math.min(delay+32,520);
      if(delay>=520){stopped=true;setDone(true);setIdx(TEAMS.indexOf(winner.current));setTimeout(()=>onDone(winner.current),700);return;}
      setTimeout(step,delay);
    }
    setTimeout(step,delay); return()=>{stopped=true;};
  },[]);// eslint-disable-line
  const t=done?winner.current:TEAMS[idx];
  return(
    <div style={{textAlign:'center',padding:'48px 0'}}>
      <p style={{color:'rgba(255,255,255,0.4)',fontSize:12,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:20}}>Sorteando seu time…</p>
      <motion.div key={t.abbr} initial={{opacity:0,scale:0.88}} animate={{opacity:1,scale:1}} transition={{duration:0.06}}
        style={{display:'inline-flex',flexDirection:'column',alignItems:'center',gap:10,background:`linear-gradient(135deg,${t.c1}33,${t.foil[1]}22)`,border:`2px solid ${t.c1}88`,borderRadius:20,padding:'22px 44px',minWidth:220}}>
        <span style={{fontSize:64}}>{t.flag}</span>
        <span style={{color:'#fff',fontWeight:900,fontSize:24}}>{t.name}</span>
        <span style={{color:t.c1==='#2a2a2a'?'#ccc':t.c1,fontWeight:700,fontSize:13,letterSpacing:'0.2em'}}>{t.abbr}</span>
      </motion.div>
    </div>
  );
}

/* ─── Team Picker Grid ───────────────────────────────────── */
function TeamPickerGrid({onPick,onRandom}:{onPick:(t:Team)=>void;onRandom:()=>void}){
  const [selected,setSelected]=useState<string|null>(null);
  const handlePick=(t:Team)=>{
    if(selected) return;
    setSelected(t.abbr);
    setTimeout(()=>onPick(t),420);
  };
  return(
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
      <p style={{textAlign:'center',color:'rgba(255,255,255,0.42)',fontSize:12,letterSpacing:'0.13em',textTransform:'uppercase',marginBottom:16}}>
        Escolha a seleção ou deixa o sorteio decidir
      </p>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginBottom:18}}>
        {TEAMS.map(t=>{
          const isSelected=selected===t.abbr;
          const accent=t.c1==='#2a2a2a'?'#888':t.c1;
          return(
            <motion.button
              key={t.abbr}
              whileHover={!selected?{scale:1.06,y:-3}:undefined}
              whileTap={!selected?{scale:0.96}:undefined}
              animate={isSelected?{scale:[1,1.12,1],boxShadow:[`0 0 0px ${accent}00`,`0 0 32px ${accent}88`,`0 0 20px ${accent}66`]}:undefined}
              transition={{duration:0.4}}
              onClick={()=>handlePick(t)}
              style={{
                background: isSelected?`linear-gradient(135deg,${accent}44,${accent}22)`:'rgba(255,255,255,0.04)',
                border:`1.5px solid ${isSelected?accent:'rgba(255,255,255,0.1)'}`,
                borderRadius:14,padding:'14px 6px 10px',cursor:selected?'default':'pointer',
                textAlign:'center',transition:'background 0.15s,border-color 0.15s',
                outline:'none',
              }}
            >
              <div style={{fontSize:34,lineHeight:1,marginBottom:6}}>{t.flag}</div>
              <div style={{color:isSelected?'#fff':'rgba(255,255,255,0.75)',fontSize:10,fontWeight:700,letterSpacing:'0.03em',lineHeight:1.2}}>{t.name}</div>
            </motion.button>
          );
        })}
      </div>

      <div style={{textAlign:'center'}}>
        <button onClick={onRandom} style={{
          background:'linear-gradient(135deg,#7F00FF,#A930F0)',
          color:'#fff',fontWeight:900,padding:'13px 34px',
          borderRadius:999,border:'none',fontSize:'0.95rem',
          cursor:'pointer',boxShadow:'0 8px 28px rgba(127,0,255,0.4)',
          letterSpacing:'0.04em',
        }}>
          🎲 Sortear aleatório
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Main ───────────────────────────────────────────────── */
type Stage='idle'|'preview'|'teamPick'|'roulette'|'loading'|'result'|'sharing'|'error';

export default function PlayerTransformer(){
  const [stage,setStage]=useState<Stage>('idle');
  const [previewUrl,setPreviewUrl]=useState<string|null>(null);
  const [playerName,setPlayerName]=useState('');
  const [team,setTeam]=useState<Team|null>(null);
  const [posIdx]=useState(()=>rnd(0,POS_ABBR.length-1));
  const [jerseyNum]=useState(()=>rnd(7,23));
  const [bday]=useState(()=>`${rnd(1,28)}-${rnd(1,12)}-${rnd(1990,2003)}`);
  const [height]=useState(()=>`1,${rnd(72,90)}`);
  const [weight]=useState(()=>String(rnd(66,84)));
  const [cardNum]=useState(()=>rnd(50,249));
  const [ovr]=useState(()=>rnd(93,99));
  const [resultUrl,setResultUrl]=useState<string|null>(null);
  const [errorMsg,setErrorMsg]=useState('');
  const [fullscreen,setFullscreen]=useState(false);
  const [cachedBlob,setCachedBlob]=useState<Blob|null>(null);
  const fileRef=useRef<HTMLInputElement>(null);
  const dataUrlRef=useRef<string>('');

  const handleFile=useCallback(async(file:File)=>{
    if(!file.type.startsWith('image/')) return;
    const d=await resizeImage(file,1536);
    dataUrlRef.current=d; setPreviewUrl(d); setStage('preview');
  },[]);

  const onInput=(e:React.ChangeEvent<HTMLInputElement>)=>{ const f=e.target.files?.[0]; if(f) handleFile(f); };
  const onDrop=(e:React.DragEvent)=>{ e.preventDefault(); const f=e.dataTransfer.files?.[0]; if(f) handleFile(f); };

  const onTeamPicked=(t:Team)=>{ setTeam(t); setTimeout(()=>runTransform(t),600); };
  const onManualPick=(t:Team)=>{ setTeam(t); runTransform(t); };

  const runTransform=async(t:Team)=>{
    setStage('loading');
    const prompt=`portrait of a soccer player wearing ${t.jersey}, looking directly at camera, slight confident smile, stadium crowd and lights background, FIFA World Cup 2026, photorealistic, professional sports photography, sharp facial features, natural skin texture`;
    try{
      const res=await fetch('/api/fal',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt,userImageDataUrl:dataUrlRef.current})});
      const data=await res.json() as {imageUrl?:string;error?:string};
      if(!res.ok||!data.imageUrl) throw new Error(data.error??'Erro desconhecido');
      setResultUrl(data.imageUrl); setStage('result');
    }catch(e){ setErrorMsg(String(e)); setStage('error'); }
  };

  const buildAndShare=async(mode:'share'|'download')=>{
    if(!resultUrl||!team) return;
    setStage('sharing');
    try{
      const blob=cachedBlob??await generateStoryBlob(resultUrl,team,playerName||'JOGADOR',posIdx,jerseyNum,bday,height,weight,cardNum,ovr);
      setCachedBlob(blob);
      const file=new File([blob],'figurinha-copa2026.png',{type:'image/png'});
      if(mode==='share'&&navigator.canShare?.({files:[file]})){
        await navigator.share({files:[file],title:`Fui convocado pela ${team.name}! 🏆`,text:'⚽ Olha minha figurinha da Copa 2026!\n\n#Copa2026 #BibCar'});
      } else {
        const url=URL.createObjectURL(blob);
        const a=document.createElement('a'); a.href=url; a.download='figurinha-copa2026.png'; a.click();
        URL.revokeObjectURL(url);
      }
    }catch{ setFullscreen(true); }
    finally{ setStage('result'); }
  };

  const reset=()=>{ setStage('idle');setPreviewUrl(null);setResultUrl(null);setErrorMsg('');setFullscreen(false);setCachedBlob(null);dataUrlRef.current='';if(fileRef.current)fileRef.current.value=''; };
  const ease=[0.22,1,0.36,1] as [number,number,number,number];

  return(
    <section className="relative py-24 px-4">

      {/* ── Section header ── */}
      <div className="max-w-3xl mx-auto text-center mb-14">
        <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6,ease}}>
          <span style={{display:'inline-block',background:'linear-gradient(135deg,rgba(127,0,255,0.25),rgba(255,223,0,0.2))',border:'1px solid rgba(193,62,255,0.45)',color:'#C13EFF',borderRadius:999,padding:'5px 20px',fontSize:12,fontWeight:800,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:18}}>✨ FIGURINHA IA · COPA 2026</span>
          <h2 style={{fontSize:'clamp(1.9rem,5vw,2.9rem)',fontWeight:900,lineHeight:1.1,color:'#fff',marginBottom:14}}>
            Vira figurinha{' '}
            <span style={{background:'linear-gradient(90deg,#7F00FF,#C13EFF,#FFDF00)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>da Copa 🏆</span>
          </h2>
          <p style={{color:'rgba(255,255,255,0.45)',fontSize:'1rem',maxWidth:460,margin:'0 auto',lineHeight:1.65}}>
            Manda sua foto de frente · IA preserva seu rosto · escolhe ou sorteia o time · gera figurinha Panini oficial
          </p>
        </motion.div>
      </div>

      <div className="max-w-xl mx-auto">
        <AnimatePresence mode="wait">

          {/* ── IDLE: Scanner upload zone ── */}
          {stage==='idle'&&(
            <motion.div key="idle" initial={{opacity:0,scale:0.97}} animate={{opacity:1,scale:1}} exit={{opacity:0}}>
              <div
                onDrop={onDrop} onDragOver={e=>e.preventDefault()}
                onClick={()=>fileRef.current?.click()}
                style={{position:'relative',borderRadius:24,background:'rgba(127,0,255,0.05)',border:'1px solid rgba(127,0,255,0.25)',padding:'56px 32px 44px',textAlign:'center',cursor:'pointer',transition:'border-color 0.2s,background 0.2s',overflow:'hidden'}}
                onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.borderColor='rgba(193,62,255,0.55)';(e.currentTarget as HTMLDivElement).style.background='rgba(127,0,255,0.09)';}}
                onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.borderColor='rgba(127,0,255,0.25)';(e.currentTarget as HTMLDivElement).style.background='rgba(127,0,255,0.05)';}}>

                {/* Scan corners */}
                <div style={{position:'absolute',top:16,left:16,width:22,height:22,borderTop:'2px solid #C13EFF',borderLeft:'2px solid #C13EFF',borderRadius:'4px 0 0 0',opacity:0.7}}/>
                <div style={{position:'absolute',top:16,right:16,width:22,height:22,borderTop:'2px solid #C13EFF',borderRight:'2px solid #C13EFF',borderRadius:'0 4px 0 0',opacity:0.7}}/>
                <div style={{position:'absolute',bottom:16,left:16,width:22,height:22,borderBottom:'2px solid #C13EFF',borderLeft:'2px solid #C13EFF',borderRadius:'0 0 0 4px',opacity:0.7}}/>
                <div style={{position:'absolute',bottom:16,right:16,width:22,height:22,borderBottom:'2px solid #C13EFF',borderRight:'2px solid #C13EFF',borderRadius:'0 0 4px 0',opacity:0.7}}/>

                {/* Scan line */}
                <motion.div
                  animate={{y:['0%','100%','0%']}}
                  transition={{repeat:Infinity,duration:3.5,ease:'easeInOut'}}
                  style={{position:'absolute',left:0,right:0,height:2,background:'linear-gradient(90deg,transparent,#C13EFF80,rgba(193,62,255,0.9),#C13EFF80,transparent)',boxShadow:'0 0 10px rgba(193,62,255,0.6)',pointerEvents:'none',zIndex:2}}
                />

                {/* Circular scanner icon */}
                <div style={{position:'relative',width:120,height:120,margin:'0 auto 24px'}}>
                  {/* Outer rotating ring */}
                  <motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:4,ease:'linear'}}
                    style={{position:'absolute',inset:0,borderRadius:'50%',border:'2px solid transparent',borderTopColor:'#C13EFF',borderBottomColor:'#7F00FF',boxShadow:'0 0 16px rgba(193,62,255,0.3)'}}/>
                  {/* Inner ring */}
                  <motion.div animate={{rotate:-360}} transition={{repeat:Infinity,duration:7,ease:'linear'}}
                    style={{position:'absolute',inset:10,borderRadius:'50%',border:'1.5px dashed rgba(127,0,255,0.45)'}}/>
                  {/* Center */}
                  <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:46}}>📸</div>
                </div>

                <p style={{color:'#fff',fontWeight:700,fontSize:'1.1rem',marginBottom:6}}>Manda sua foto de frente</p>
                <p style={{color:'rgba(255,255,255,0.38)',fontSize:'0.83rem',marginBottom:4}}>Selfie olhando para a câmera funciona melhor</p>
                <p style={{color:'rgba(255,255,255,0.25)',fontSize:'0.76rem',marginBottom:28}}>rosto bem iluminado · sem óculos escuros · câmera ou galeria</p>
                <span style={{display:'inline-block',background:'linear-gradient(135deg,#7F00FF,#A930F0)',color:'#fff',fontWeight:800,padding:'12px 32px',borderRadius:999,fontSize:'0.93rem',boxShadow:'0 6px 24px rgba(127,0,255,0.4)'}}>📷 Câmera &nbsp;·&nbsp; 🖼️ Galeria</span>
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={onInput} style={{display:'none'}}/>
            </motion.div>
          )}

          {/* ── PREVIEW ── */}
          {stage==='preview'&&previewUrl&&(
            <motion.div key="preview" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}} style={{textAlign:'center'}}>
              {/* Photo with scanning ring */}
              <div style={{position:'relative',width:196,height:196,margin:'0 auto 24px'}}>
                <motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:5,ease:'linear'}}
                  style={{position:'absolute',inset:-6,borderRadius:'50%',border:'2.5px solid transparent',borderTopColor:'#C13EFF',borderRightColor:'transparent',borderBottomColor:'#7F00FF',borderLeftColor:'transparent'}}/>
                <motion.div animate={{rotate:-360}} transition={{repeat:Infinity,duration:9,ease:'linear'}}
                  style={{position:'absolute',inset:-14,borderRadius:'50%',border:'1px dashed rgba(127,0,255,0.3)'}}/>
                <div style={{position:'absolute',inset:0,borderRadius:'50%',overflow:'hidden',border:'3px solid rgba(193,62,255,0.55)',boxShadow:'0 0 48px rgba(127,0,255,0.45),0 0 80px rgba(127,0,255,0.15)'}}>
                  <Image src={previewUrl} alt="Preview" fill style={{objectFit:'cover'}} unoptimized/>
                </div>
                {/* Scan confirmation */}
                <motion.div initial={{opacity:0,scale:0}} animate={{opacity:1,scale:1}} transition={{delay:0.6,type:'spring',stiffness:400}}
                  style={{position:'absolute',bottom:-8,right:-8,width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#7F00FF,#C13EFF)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,boxShadow:'0 0 16px rgba(127,0,255,0.6)'}}>✓</motion.div>
              </div>

              <p style={{color:'rgba(255,255,255,0.6)',marginBottom:12,fontSize:'0.93rem'}}>Qual nome vai na figurinha?</p>
              <input type="text" maxLength={14} placeholder="SEU NOME (opcional)" value={playerName}
                onChange={e=>setPlayerName(e.target.value.toUpperCase())}
                style={{display:'block',margin:'0 auto 28px',background:'rgba(127,0,255,0.07)',border:'1px solid rgba(127,0,255,0.35)',borderRadius:12,padding:'12px 20px',color:'#fff',fontSize:'1rem',fontWeight:700,letterSpacing:'0.1em',textAlign:'center',outline:'none',width:'100%',maxWidth:280,boxShadow:'0 0 16px rgba(127,0,255,0.12)'}}
              />
              <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
                <button onClick={()=>setStage('teamPick')} style={{background:'linear-gradient(135deg,#7F00FF,#FFDF00)',color:'#fff',fontWeight:900,padding:'14px 36px',borderRadius:999,border:'none',fontSize:'1rem',cursor:'pointer',boxShadow:'0 8px 28px rgba(127,0,255,0.4)'}}>⚽ Escolher time</button>
                <button onClick={reset} style={{background:'rgba(255,255,255,0.06)',color:'rgba(255,255,255,0.45)',padding:'14px 24px',borderRadius:999,border:'1px solid rgba(255,255,255,0.12)',fontSize:'0.88rem',cursor:'pointer',fontWeight:600}}>Trocar foto</button>
              </div>
            </motion.div>
          )}

          {/* ── TEAM PICKER ── */}
          {stage==='teamPick'&&(
            <motion.div key="teamPick" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
              <TeamPickerGrid onPick={onManualPick} onRandom={()=>setStage('roulette')}/>
            </motion.div>
          )}

          {/* ── ROULETTE ── */}
          {stage==='roulette'&&(
            <motion.div key="roulette" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
              <TeamRoulette onDone={onTeamPicked}/>
            </motion.div>
          )}

          {/* ── LOADING ── */}
          {stage==='loading'&&team&&(
            <motion.div key="loading" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{textAlign:'center',padding:'64px 0'}}>
              <div style={{marginBottom:16}}>
                <span style={{display:'inline-flex',alignItems:'center',gap:10,background:`linear-gradient(135deg,${team.c1}33,${team.foil[1]}22)`,border:`2px solid ${team.c1}88`,borderRadius:999,padding:'8px 20px'}}>
                  <span style={{fontSize:26}}>{team.flag}</span>
                  <span style={{color:'#fff',fontWeight:800,fontSize:'0.9rem'}}>{team.name}</span>
                </span>
              </div>
              <motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:1.4,ease:'linear'}} style={{fontSize:58,display:'inline-block',marginBottom:24}}>⚽</motion.div>
              <p style={{color:'#fff',fontWeight:700,fontSize:'1.15rem',marginBottom:8}}>Criando sua figurinha…</p>
              <p style={{color:'rgba(255,255,255,0.4)',fontSize:'0.85rem'}}>Preservando seu rosto · pode demorar ~1 min</p>
              <div style={{display:'flex',gap:8,justifyContent:'center',marginTop:24}}>
                {[0,1,2].map(i=><motion.div key={i} animate={{opacity:[0.3,1,0.3]}} transition={{repeat:Infinity,duration:1.4,delay:i*0.46}} style={{width:9,height:9,borderRadius:'50%',background:'#C13EFF'}}/>)}
              </div>
            </motion.div>
          )}

          {/* ── SHARING ── */}
          {stage==='sharing'&&(
            <motion.div key="sharing" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{textAlign:'center',padding:'64px 0'}}>
              <motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:1,ease:'linear'}} style={{fontSize:52,display:'inline-block',marginBottom:20}}>⚙️</motion.div>
              <p style={{color:'#fff',fontWeight:700}}>Gerando imagem…</p>
            </motion.div>
          )}

          {/* ── RESULT ── */}
          {stage==='result'&&resultUrl&&team&&(
            <motion.div key="result" initial={{opacity:0,scale:0.88,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0}} transition={{duration:0.55,ease}} style={{textAlign:'center'}}>
              <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{delay:0.3}} style={{marginBottom:20}}>
                <span style={{display:'inline-flex',alignItems:'center',gap:10,background:`linear-gradient(135deg,${team.c1}33,${team.foil[1]}22)`,border:`1.5px solid ${team.c1}88`,borderRadius:999,padding:'8px 22px',boxShadow:`0 0 28px ${team.c1}33`}}>
                  <span style={{fontSize:24}}>{team.flag}</span>
                  <span style={{color:'#fff',fontWeight:900,fontSize:'0.9rem'}}>Convocado pela {team.name}! 🏆</span>
                </span>
              </motion.div>

              <div style={{display:'flex',justifyContent:'center',marginBottom:28}}>
                <motion.div animate={{y:[0,-6,0]}} transition={{repeat:Infinity,duration:3.5,ease:'easeInOut'}}>
                  <FigurinhaCard imageUrl={resultUrl} team={team} name={playerName||'JOGADOR'} posIdx={posIdx} jerseyNum={jerseyNum} bday={bday} height={height} weight={weight} ovr={ovr} size={290}/>
                </motion.div>
              </div>

              <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap',maxWidth:420,margin:'0 auto 12px'}}>
                <button onClick={()=>buildAndShare('share')}
                  style={{flex:'1 1 180px',display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:team.c1,border:`2px solid ${team.foil[1]}88`,color:'#fff',fontWeight:900,padding:'14px 20px',borderRadius:14,fontSize:'0.92rem',cursor:'pointer'}}>
                  <span style={{fontSize:20}}>📲</span>
                  <div style={{textAlign:'left'}}>
                    <div style={{fontSize:'0.72rem',opacity:0.7,lineHeight:1}}>Compartilhar</div>
                    <div>Instagram / WhatsApp</div>
                  </div>
                </button>
                <button onClick={()=>buildAndShare('download')}
                  style={{flex:'1 1 130px',display:'flex',alignItems:'center',justifyContent:'center',gap:6,background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.8)',fontWeight:700,padding:'14px 18px',borderRadius:14,border:'1px solid rgba(255,255,255,0.15)',fontSize:'0.88rem',cursor:'pointer'}}>
                  ⬇ Baixar PNG
                </button>
                <button onClick={()=>setFullscreen(true)}
                  style={{flex:'1 1 100px',display:'flex',alignItems:'center',justifyContent:'center',gap:6,background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.5)',fontWeight:600,padding:'14px 14px',borderRadius:14,border:'1px solid rgba(255,255,255,0.1)',fontSize:'0.82rem',cursor:'pointer'}}>
                  🔍 Ampliar
                </button>
              </div>
              <button onClick={reset} style={{background:'transparent',color:'rgba(255,255,255,0.28)',border:'none',cursor:'pointer',fontSize:'0.78rem',marginTop:4}}>Tentar com outra foto</button>
            </motion.div>
          )}

          {/* ── ERROR ── */}
          {stage==='error'&&(
            <motion.div key="error" initial={{opacity:0}} animate={{opacity:1}} style={{textAlign:'center',padding:'48px 0'}}>
              <div style={{fontSize:52,marginBottom:14}}>😅</div>
              <p style={{color:'#ff6b6b',fontWeight:700,fontSize:'1.05rem',marginBottom:8}}>Eita, deu ruim!</p>
              <p style={{color:'rgba(255,255,255,0.4)',fontSize:'0.84rem',maxWidth:340,margin:'0 auto 28px'}}>{errorMsg.replace('Error:','').trim()}</p>
              <button onClick={reset} style={{background:'rgba(255,255,255,0.1)',color:'#fff',fontWeight:700,padding:'12px 32px',borderRadius:999,border:'1px solid rgba(255,255,255,0.2)',cursor:'pointer'}}>Tentar de novo</button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Fullscreen ── */}
      <AnimatePresence>
        {fullscreen&&resultUrl&&team&&(
          <motion.div key="fs" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            onClick={()=>setFullscreen(false)}
            style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.97)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,cursor:'pointer'}}>
            <p style={{color:'rgba(255,255,255,0.35)',fontSize:13,marginBottom:20,textAlign:'center'}}>📱 Pressione e segure para salvar · Toque fora para fechar</p>
            <div onClick={e=>e.stopPropagation()}>
              <FigurinhaCard imageUrl={resultUrl} team={team} name={playerName||'JOGADOR'} posIdx={posIdx} jerseyNum={jerseyNum} bday={bday} height={height} weight={weight} ovr={ovr} size={Math.min(300,typeof window!=='undefined'?window.innerWidth-48:280)}/>
            </div>
            <div style={{display:'flex',gap:10,marginTop:20}} onClick={e=>e.stopPropagation()}>
              <button onClick={()=>buildAndShare('share')} style={{background:team.c1,color:'#fff',fontWeight:800,padding:'11px 24px',borderRadius:999,border:`1px solid ${team.foil[1]}55`,fontSize:'0.88rem',cursor:'pointer'}}>📲 Compartilhar</button>
              <button onClick={()=>buildAndShare('download')} style={{background:'rgba(255,255,255,0.1)',color:'#fff',fontWeight:700,padding:'11px 22px',borderRadius:999,border:'1px solid rgba(255,255,255,0.2)',fontSize:'0.88rem',cursor:'pointer'}}>⬇ Baixar</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
