'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

/* ─── Teams ──────────────────────────────────────────────── */
const TEAMS = [
  { name: 'Brasil',    flag: '🇧🇷', abbr: 'BRA', c1: '#00843D', c2: '#FFCD00', foil: ['#00843D','#005c2b','#009940'], text: '#FFCD00', jersey: 'yellow and green Brazil Seleção Brasileira soccer jersey' },
  { name: 'Argentina', flag: '🇦🇷', abbr: 'ARG', c1: '#6CACE4', c2: '#FFFFFF', foil: ['#b8860b','#daa520','#ffd700'], text: '#003087', jersey: 'light blue and white Argentina Albiceleste stripes soccer jersey' },
  { name: 'França',    flag: '🇫🇷', abbr: 'FRA', c1: '#002395', c2: '#FFFFFF', foil: ['#b8860b','#daa520','#ffd700'], text: '#002395', jersey: 'dark blue France Les Bleus soccer jersey' },
  { name: 'Alemanha',  flag: '🇩🇪', abbr: 'GER', c1: '#000000', c2: '#FFFFFF', foil: ['#888','#aaa','#ccc'], text: '#000000', jersey: 'white Germany national team soccer jersey' },
  { name: 'Portugal',  flag: '🇵🇹', abbr: 'POR', c1: '#C8102E', c2: '#FFFFFF', foil: ['#b8860b','#daa520','#ffd700'], text: '#C8102E', jersey: 'red Portugal national team soccer jersey' },
  { name: 'Espanha',   flag: '🇪🇸', abbr: 'ESP', c1: '#AA151B', c2: '#FFFFFF', foil: ['#AA151B','#c0392b','#e74c3c'], text: '#AA151B', jersey: 'red Spain La Roja soccer jersey' },
  { name: 'Holanda',   flag: '🇳🇱', abbr: 'NED', c1: '#FF4F00', c2: '#FFFFFF', foil: ['#b8860b','#daa520','#ffd700'], text: '#FF4F00', jersey: 'orange Netherlands Oranje soccer jersey' },
  { name: 'Itália',    flag: '🇮🇹', abbr: 'ITA', c1: '#0066CC', c2: '#FFFFFF', foil: ['#0066CC','#0047a0','#003d8a'], text: '#0066CC', jersey: 'blue Italy Azzurri soccer jersey' },
  { name: 'Inglaterra',flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', abbr: 'ENG', c1: '#CF091D', c2: '#FFFFFF', foil: ['#b8860b','#daa520','#ffd700'], text: '#CF091D', jersey: 'white England Three Lions soccer jersey' },
  { name: 'Marrocos',  flag: '🇲🇦', abbr: 'MAR', c1: '#C1272D', c2: '#FFFFFF', foil: ['#b8860b','#daa520','#ffd700'], text: '#C1272D', jersey: 'red Morocco national team soccer jersey' },
  { name: 'Japão',     flag: '🇯🇵', abbr: 'JPN', c1: '#003087', c2: '#FFFFFF', foil: ['#003087','#001a4d','#002470'], text: '#003087', jersey: 'dark blue Japan Samurai Blue soccer jersey' },
  { name: 'Uruguai',   flag: '🇺🇾', abbr: 'URU', c1: '#4B9CD3', c2: '#FFFFFF', foil: ['#b8860b','#daa520','#ffd700'], text: '#003087', jersey: 'light blue Uruguay Celeste soccer jersey' },
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
// Crop tight to face: top 50% of height, centered — just face and neck, no body/background
function cropFaceArea(dataUrl:string):Promise<string>{
  return new Promise((res,rej)=>{
    const img=new window.Image();
    img.onload=()=>{
      const side=Math.min(img.width,Math.round(img.height*0.50));
      const x=Math.round((img.width-side)/2);
      const c=document.createElement('canvas');
      c.width=512; c.height=512;
      c.getContext('2d')!.drawImage(img,x,0,side,side,0,0,512,512);
      res(c.toDataURL('image/jpeg',0.92));
    };
    img.onerror=rej; img.src=dataUrl;
  });
}
function loadImg(src:string):Promise<HTMLImageElement>{
  return new Promise((res,rej)=>{
    const img=new window.Image();
    img.crossOrigin='anonymous';
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
    // outer border glow
    <div style={{
      display:'inline-block',borderRadius:14*s,
      padding:3*s,
      background:`linear-gradient(135deg,${f1},${f2},${f3},${f2},${f1})`,
      boxShadow:`0 0 30px ${team.c1}66, 0 20px 60px rgba(0,0,0,0.7)`,
    }}>
      <div style={{
        position:'relative',width:size,height:H,borderRadius:12*s,overflow:'hidden',
        background:`linear-gradient(145deg,${f1} 0%,${f2} 25%,${f3} 50%,${f2} 75%,${f1} 100%)`,
      }}>

        {/* Gold foil crinkle texture */}
        <div style={{position:'absolute',inset:0,
          backgroundImage:`repeating-linear-gradient(45deg,rgba(255,255,255,0.10) 0,rgba(255,255,255,0) 4px,rgba(0,0,0,0.06) 8px),repeating-linear-gradient(-45deg,rgba(255,255,255,0.07) 0,rgba(255,255,255,0) 5px,rgba(0,0,0,0.05) 10px)`,
        }}/>

        {/* Huge background jersey number */}
        <div style={{
          position:'absolute',right:-6*s,bottom:botH+10*s,
          fontSize:220*s,fontWeight:900,fontStyle:'italic',lineHeight:1,
          color:team.c1,opacity:0.22,userSelect:'none',letterSpacing:'-0.04em',
          zIndex:1,
        }}>{jerseyNum}</div>

        {/* Shimmer sweep */}
        <motion.div
          animate={{x:['-150%','200%']}}
          transition={{repeat:Infinity,duration:4.5,ease:'linear',repeatDelay:3}}
          style={{position:'absolute',inset:0,zIndex:5,pointerEvents:'none',
            background:'linear-gradient(105deg,transparent 28%,rgba(255,255,255,0.22) 45%,rgba(255,255,255,0.3) 50%,rgba(255,255,255,0.22) 55%,transparent 72%)',
          }}
        />

        {/* ── TOP STRIP ── */}
        <div style={{
          position:'absolute',top:0,left:0,right:0,height:topH,
          background:team.c1,
          display:'flex',alignItems:'center',justifyContent:'space-between',
          padding:`0 ${10*s}px`,zIndex:6,
        }}>
          {/* FIFA */}
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:0}}>
            <span style={{color:'#fff',fontWeight:900,fontStyle:'italic',fontSize:14*s,letterSpacing:'0.06em',lineHeight:1}}>FIFA</span>
            <span style={{color:'rgba(255,255,255,0.6)',fontSize:6*s,letterSpacing:'0.15em',lineHeight:1}}>WORLD CUP</span>
          </div>
          {/* Trophy icon */}
          <span style={{color:team.text,fontSize:9*s,fontWeight:700,letterSpacing:'0.12em'}}>COPA MUNDO 2026</span>
          {/* Flag */}
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:20*s,lineHeight:1}}>{team.flag}</div>
            <div style={{color:'rgba(255,255,255,0.7)',fontSize:8*s,fontWeight:700,letterSpacing:'0.1em'}}>{team.abbr}</div>
          </div>
        </div>

        {/* ── PLAYER PHOTO ── */}
        <div style={{
          position:'absolute',top:topH,left:0,right:0,bottom:botH,
          zIndex:2,
        }}>
          <Image src={imageUrl} alt="Player" fill unoptimized
            style={{objectFit:'cover',objectPosition:'center top'}}
          />
          {/* subtle bottom fade into white */}
          <div style={{
            position:'absolute',bottom:0,left:0,right:0,height:60*s,
            background:'linear-gradient(to top,rgba(255,255,255,0.8),transparent)',
          }}/>
          {/* OVR badge */}
          <div style={{
            position:'absolute',top:10*s,left:10*s,
            background:'rgba(0,0,0,0.72)',borderRadius:8*s,
            padding:`${6*s}px ${10*s}px`,textAlign:'center',minWidth:42*s,
          }}>
            <div style={{color:team.text,fontWeight:900,fontSize:28*s,lineHeight:1,fontStyle:'italic'}}>{ovr}</div>
            <div style={{color:'rgba(255,255,255,0.5)',fontWeight:700,fontSize:8*s,letterSpacing:'0.12em'}}>OVR</div>
          </div>
        </div>

        {/* ── WHITE BOTTOM BAR ── */}
        <div style={{
          position:'absolute',bottom:0,left:0,right:0,height:botH,
          background:'#ffffff',
          zIndex:6,
          padding:`${8*s}px ${10*s}px ${6*s}px`,
          display:'flex',flexDirection:'column',justifyContent:'space-between',
        }}>
          {/* Player name */}
          <div>
            <div style={{
              fontSize:(name.length>12?14:17)*s,fontWeight:800,
              color:'#111',letterSpacing:'0.01em',lineHeight:1.1,
              textTransform:'uppercase',
            }}>
              {name.includes(' ')
                ? <>{name.split(' ').slice(0,-1).join(' ')}{' '}<strong>{name.split(' ').slice(-1)[0]}</strong></>
                : <strong>{name}</strong>
              }
            </div>
            {/* Bio */}
            <div style={{fontSize:8*s,color:'#666',marginTop:2*s,letterSpacing:'0.03em'}}>
              {bday}&nbsp;&nbsp;|&nbsp;&nbsp;{height} m&nbsp;&nbsp;|&nbsp;&nbsp;{weight} kg
            </div>
          </div>

          {/* Club bar */}
          <div style={{
            background:team.c1,borderRadius:4*s,
            padding:`${3*s}px ${8*s}px`,
            display:'flex',alignItems:'center',justifyContent:'space-between',
          }}>
            <span style={{color:'#fff',fontSize:9*s,fontWeight:700,letterSpacing:'0.05em'}}>
              BibCar FC&nbsp;·&nbsp;{POSITIONS_FULL[posIdx]}
            </span>
            {/* BibCar logo replacing Panini */}
            <div style={{display:'flex',alignItems:'center',gap:4*s}}>
              <div style={{width:18*s,height:18*s,borderRadius:3*s,overflow:'hidden',flexShrink:0,background:'#fff'}}>
                <Image src="/logo.png" alt="BibCar" width={18} height={18} style={{objectFit:'contain',width:'100%',height:'100%'}} />
              </div>
              <span style={{color:team.text,fontSize:9*s,fontWeight:900,letterSpacing:'0.1em'}}>BIBCAR</span>
            </div>
          </div>

          {/* Bottom flag row */}
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
async function generateStoryBlob(
  resultUrl:string, team:Team, name:string, posIdx:number,
  jerseyNum:number, bday:string, height:string, weight:string, cardNum:number, ovr:number
):Promise<Blob>{
  const W=1080, H=1920;
  const canvas=document.createElement('canvas');
  canvas.width=W; canvas.height=H;
  const ctx=canvas.getContext('2d')!;

  const proxyUrl=`/api/fal/proxy-image?url=${encodeURIComponent(resultUrl)}`;
  const [playerImg,logoImg]=await Promise.all([loadImg(proxyUrl),loadImg('/logo.png')]);

  const [f1,f2,f3]=team.foil;

  // ── Page background ──
  const bg=ctx.createLinearGradient(0,0,W,H);
  bg.addColorStop(0,'#111'); bg.addColorStop(0.5,'#1a1a1a'); bg.addColorStop(1,'#0d0d0d');
  ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
  ctx.strokeStyle=team.c1+'30'; ctx.lineWidth=4;
  for(let i=-H;i<W+H;i+=50){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i+H,H);ctx.stroke();}

  // top radial glow
  const tg=ctx.createRadialGradient(W/2,0,0,W/2,0,700);
  tg.addColorStop(0,team.c1+'44'); tg.addColorStop(1,'transparent');
  ctx.fillStyle=tg; ctx.fillRect(0,0,W,H);

  // ── Top headline ──
  ctx.textAlign='center';
  ctx.font='bold 80px Arial'; ctx.fillStyle='#ffffff';
  ctx.fillText('FUI CONVOCADO!',W/2,180);
  ctx.font='42px Arial'; ctx.fillStyle='rgba(255,255,255,0.55)';
  ctx.fillText(`${team.flag}  Seleção de ${team.name}  ·  Copa 2026`,W/2,246);

  // ── Card ──
  const cW=620, cH=868, cX=(W-cW)/2, cY=300, cR=18;
  const topH=80, botH=210;

  // border glow
  ctx.save();
  rrect(ctx,cX-4,cY-4,cW+8,cH+8,cR+4);
  const border=ctx.createLinearGradient(cX,cY,cX+cW,cY+cH);
  [f1,f2,f3,f2,f1].forEach((c,i,a)=>border.addColorStop(i/(a.length-1),c));
  ctx.strokeStyle=border; ctx.lineWidth=7; ctx.stroke();
  ctx.restore();

  // card clip
  ctx.save();
  rrect(ctx,cX,cY,cW,cH,cR); ctx.clip();

  // foil background
  const foil=ctx.createLinearGradient(cX,cY,cX+cW,cY+cH);
  [f1,f2,f3,f2,f1].forEach((c,i,a)=>foil.addColorStop(i/(a.length-1),c));
  ctx.fillStyle=foil; ctx.fillRect(cX,cY,cW,cH);

  // foil texture
  ctx.save();
  for(let i=-cH;i<cW+cH;i+=12){
    ctx.strokeStyle=`rgba(255,255,255,0.07)`; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(cX+i,cY); ctx.lineTo(cX+i+cH,cY+cH); ctx.stroke();
  }
  ctx.restore();

  // big jersey number in background
  ctx.save();
  ctx.globalAlpha=0.18; ctx.fillStyle=team.c1;
  ctx.font=`bold italic 400px Arial`; ctx.textAlign='right';
  ctx.fillText(String(jerseyNum),cX+cW-10,cY+topH+cH*0.7);
  ctx.globalAlpha=1; ctx.restore();

  // header strip
  ctx.fillStyle=team.c1;
  ctx.fillRect(cX,cY,cW,topH);
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

  // player photo — crop from top of image (shows face+upper body of full-body shot)
  const pY=cY+topH, pH=cH-topH-botH;
  const srcH=Math.round(playerImg.naturalHeight*(cW/playerImg.naturalWidth));
  const srcCropH=Math.min(playerImg.naturalHeight,Math.round(playerImg.naturalHeight*(pH/srcH)));
  ctx.drawImage(playerImg,0,0,playerImg.naturalWidth,srcCropH,cX,pY,cW,pH);

  // fade into white
  const fade=ctx.createLinearGradient(0,pY+pH-120,0,pY+pH);
  fade.addColorStop(0,'transparent'); fade.addColorStop(1,'rgba(255,255,255,0.9)');
  ctx.fillStyle=fade; ctx.fillRect(cX,pY+pH-120,cW,120);

  // white bottom bar
  ctx.fillStyle='#ffffff';
  ctx.fillRect(cX,cY+cH-botH,cW,botH);

  // Name
  const nName=name.toUpperCase();
  const parts=nName.split(' ');
  const firstName=parts.slice(0,-1).join(' ');
  const lastName=parts.slice(-1)[0]||nName;
  const nY=cY+cH-botH+48;
  ctx.fillStyle='#111';
  if(firstName){
    ctx.font=`500 ${nName.length>12?38:46}px Arial`; ctx.textAlign='left';
    ctx.fillText(firstName+' ',cX+18,nY);
    const fw=ctx.measureText(firstName+' ').width;
    ctx.font=`bold ${nName.length>12?38:46}px Arial`;
    ctx.fillText(lastName,cX+18+fw,nY);
  } else {
    ctx.font=`bold ${nName.length>12?38:46}px Arial`; ctx.textAlign='left';
    ctx.fillText(lastName,cX+18,nY);
  }

  // bio
  ctx.font='22px Arial'; ctx.fillStyle='#777'; ctx.textAlign='left';
  ctx.fillText(`${bday}  |  ${height} m  |  ${weight} kg`,cX+18,nY+34);

  // club bar
  ctx.fillStyle=team.c1;
  rrect(ctx,cX+12,cY+cH-botH+90,cW-24,52,8); ctx.fill();
  ctx.font='bold 24px Arial'; ctx.fillStyle='#fff'; ctx.textAlign='left';
  ctx.fillText(`BibCar FC · ${POSITIONS_FULL[posIdx]}`,cX+24,cY+cH-botH+122);
  // logo
  ctx.drawImage(logoImg,cX+cW-80,cY+cH-botH+95,44,44);
  ctx.font='bold 20px Arial'; ctx.fillStyle=team.text; ctx.textAlign='right';
  ctx.fillText('BIBCAR',cX+cW-84,cY+cH-botH+120);

  // flag bottom right
  ctx.font='32px Arial'; ctx.textAlign='right';
  ctx.fillText(team.flag,cX+cW-12,cY+cH-12);
  ctx.font='bold 16px Arial'; ctx.fillStyle='#999';
  ctx.fillText(`#${cardNum}`,cX+20,cY+cH-14);

  // OVR badge top-left of photo
  ctx.fillStyle='rgba(0,0,0,0.72)';
  rrect(ctx,cX+14,cY+topH+14,80,96,12); ctx.fill();
  ctx.font='bold 54px Arial'; ctx.fillStyle=team.text; ctx.textAlign='center';
  ctx.fillText(String(ovr),cX+54,cY+topH+68);
  ctx.font='bold 18px Arial'; ctx.fillStyle='rgba(255,255,255,0.5)';
  ctx.fillText('OVR',cX+54,cY+topH+88);

  ctx.restore();

  // ── Bottom ──
  const bY=cY+cH+70;
  ctx.font='bold 40px Arial'; ctx.fillStyle='rgba(255,255,255,0.7)';
  ctx.textAlign='center'; ctx.fillText('#Copa2026  #BibCar  #FigurinhaIA',W/2,bY);
  ctx.font='28px Arial'; ctx.fillStyle='rgba(255,255,255,0.3)';
  ctx.fillText('bibcarbrasil.com.br',W/2,bY+46);
  ctx.drawImage(logoImg,W/2-30,bY+60,60,60);

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
      <p style={{color:'rgba(255,255,255,0.4)',fontSize:12,letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:20}}>Sorteando seu time…</p>
      <motion.div key={t.abbr} initial={{opacity:0,scale:0.88}} animate={{opacity:1,scale:1}} transition={{duration:0.06}}
        style={{display:'inline-flex',flexDirection:'column',alignItems:'center',gap:10,background:`linear-gradient(135deg,${t.c1}33,${t.foil[1]}22)`,border:`2px solid ${t.c1}88`,borderRadius:20,padding:'22px 44px',minWidth:220}}>
        <span style={{fontSize:60}}>{t.flag}</span>
        <span style={{color:'#fff',fontWeight:900,fontSize:24}}>{t.name}</span>
        <span style={{color:t.c1,fontWeight:700,fontSize:13,letterSpacing:'0.2em'}}>{t.abbr}</span>
      </motion.div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────── */
type Stage='idle'|'preview'|'roulette'|'loading'|'result'|'sharing'|'error';

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
    const d=await resizeImage(file);
    dataUrlRef.current=d; setPreviewUrl(d); setStage('preview');
  },[]);

  const onInput=(e:React.ChangeEvent<HTMLInputElement>)=>{ const f=e.target.files?.[0]; if(f) handleFile(f); };
  const onDrop=(e:React.DragEvent)=>{ e.preventDefault(); const f=e.dataTransfer.files?.[0]; if(f) handleFile(f); };
  const onTeamPicked=(t:Team)=>{ setTeam(t); setTimeout(()=>runTransform(t),600); };

  const runTransform=async(t:Team)=>{
    setStage('loading');
    const prompt=`full body professional soccer player wearing ${t.jersey}, dynamic action pose on green grass football pitch, FIFA World Cup 2026, stadium with crowd, dramatic sports photography, sharp focus, photorealistic, high quality, 8k`;
    try{
      // Crop to face area before sending — removes background/clothing context that confuses AI
      const faceCrop=await cropFaceArea(dataUrlRef.current);
      const res=await fetch('/api/fal',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({imageDataUrl:faceCrop,prompt})});
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
      <div className="max-w-3xl mx-auto text-center mb-14">
        <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6,ease}}>
          <span style={{display:'inline-block',background:'linear-gradient(135deg,rgba(0,156,59,0.25),rgba(255,223,0,0.2))',border:'1px solid rgba(255,223,0,0.35)',color:'#FFDF00',borderRadius:999,padding:'4px 18px',fontSize:13,fontWeight:700,letterSpacing:'0.08em',marginBottom:18}}>✨ FIGURINHA IA · COPA 2026</span>
          <h2 style={{fontSize:'clamp(1.9rem,5vw,2.9rem)',fontWeight:900,lineHeight:1.1,color:'#fff',marginBottom:14}}>
            Vira figurinha{' '}
            <span style={{background:'linear-gradient(90deg,#009C3B,#FFDF00)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>da Copa 🏆</span>
          </h2>
          <p style={{color:'rgba(255,255,255,0.5)',fontSize:'1rem',maxWidth:460,margin:'0 auto'}}>
            Manda sua foto de frente · IA preserva seu rosto · sorteia time · gera figurinha Panini oficial
          </p>
        </motion.div>
      </div>

      <div className="max-w-xl mx-auto">
        <AnimatePresence mode="wait">

          {stage==='idle'&&(
            <motion.div key="idle" initial={{opacity:0,scale:0.97}} animate={{opacity:1,scale:1}} exit={{opacity:0}}>
              <div onDrop={onDrop} onDragOver={e=>e.preventDefault()} onClick={()=>fileRef.current?.click()}
                style={{border:'2px dashed rgba(255,223,0,0.35)',borderRadius:24,background:'rgba(0,156,59,0.05)',padding:'56px 32px',textAlign:'center',cursor:'pointer',transition:'all 0.2s'}}
                onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.borderColor='rgba(255,223,0,0.65)';(e.currentTarget as HTMLDivElement).style.background='rgba(0,156,59,0.1)';}}
                onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.borderColor='rgba(255,223,0,0.35)';(e.currentTarget as HTMLDivElement).style.background='rgba(0,156,59,0.05)';}}>
                <div style={{fontSize:64,marginBottom:16}}>📸</div>
                <p style={{color:'#fff',fontWeight:700,fontSize:'1.15rem',marginBottom:6}}>Manda sua foto de frente</p>
                <p style={{color:'rgba(255,255,255,0.4)',fontSize:'0.85rem',marginBottom:6}}>Selfie olhando para a câmera funciona melhor</p>
                <p style={{color:'rgba(255,255,255,0.28)',fontSize:'0.78rem',marginBottom:28}}>rosto bem iluminado · sem óculos escuros</p>
                <span style={{display:'inline-block',background:'linear-gradient(135deg,#009C3B,#007a2e)',color:'#fff',fontWeight:700,padding:'12px 32px',borderRadius:999,fontSize:'0.95rem'}}>Escolher Foto</span>
              </div>
              <input ref={fileRef} type="file" accept="image/*" capture="user" onChange={onInput} style={{display:'none'}} />
            </motion.div>
          )}

          {stage==='preview'&&previewUrl&&(
            <motion.div key="preview" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}} style={{textAlign:'center'}}>
              <div style={{position:'relative',width:180,height:180,margin:'0 auto 24px',borderRadius:'50%',overflow:'hidden',border:'3px solid rgba(255,223,0,0.5)',boxShadow:'0 0 40px rgba(0,156,59,0.4)'}}>
                <Image src={previewUrl} alt="Preview" fill style={{objectFit:'cover'}} unoptimized />
              </div>
              <p style={{color:'rgba(255,255,255,0.65)',marginBottom:14,fontSize:'0.95rem'}}>Qual nome vai na figurinha?</p>
              <input type="text" maxLength={14} placeholder="SEU NOME (opcional)" value={playerName}
                onChange={e=>setPlayerName(e.target.value.toUpperCase())}
                style={{display:'block',margin:'0 auto 28px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,223,0,0.3)',borderRadius:12,padding:'12px 20px',color:'#fff',fontSize:'1rem',fontWeight:700,letterSpacing:'0.1em',textAlign:'center',outline:'none',width:'100%',maxWidth:280}}
              />
              <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
                <button onClick={()=>setStage('roulette')} style={{background:'linear-gradient(135deg,#009C3B,#FFDF00)',color:'#051505',fontWeight:900,padding:'14px 36px',borderRadius:999,border:'none',fontSize:'1rem',cursor:'pointer'}}>🎲 Sortear meu time!</button>
                <button onClick={reset} style={{background:'rgba(255,255,255,0.07)',color:'rgba(255,255,255,0.5)',padding:'14px 24px',borderRadius:999,border:'1px solid rgba(255,255,255,0.15)',fontSize:'0.9rem',cursor:'pointer',fontWeight:600}}>Trocar foto</button>
              </div>
            </motion.div>
          )}

          {stage==='roulette'&&(
            <motion.div key="roulette" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
              <TeamRoulette onDone={onTeamPicked} />
            </motion.div>
          )}

          {stage==='loading'&&team&&(
            <motion.div key="loading" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{textAlign:'center',padding:'64px 0'}}>
              <div style={{fontSize:52,marginBottom:16}}>{team.flag}</div>
              <motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:1.4,ease:'linear'}} style={{fontSize:58,display:'inline-block',marginBottom:24}}>⚽</motion.div>
              <p style={{color:'#fff',fontWeight:700,fontSize:'1.15rem',marginBottom:8}}>Criando sua figurinha…</p>
              <p style={{color:'rgba(255,255,255,0.4)',fontSize:'0.85rem'}}>Preservando seu rosto · pode demorar ~1 min</p>
              <div style={{display:'flex',gap:8,justifyContent:'center',marginTop:24}}>
                {[0,1,2].map(i=><motion.div key={i} animate={{opacity:[0.3,1,0.3]}} transition={{repeat:Infinity,duration:1.4,delay:i*0.46}} style={{width:9,height:9,borderRadius:'50%',background:team.text}}/>)}
              </div>
            </motion.div>
          )}

          {stage==='sharing'&&(
            <motion.div key="sharing" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{textAlign:'center',padding:'64px 0'}}>
              <motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:1,ease:'linear'}} style={{fontSize:52,display:'inline-block',marginBottom:20}}>⚙️</motion.div>
              <p style={{color:'#fff',fontWeight:700}}>Gerando imagem…</p>
            </motion.div>
          )}

          {stage==='result'&&resultUrl&&team&&(
            <motion.div key="result" initial={{opacity:0,scale:0.88,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0}} transition={{duration:0.55,ease}} style={{textAlign:'center'}}>
              <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{delay:0.3}} style={{marginBottom:20}}>
                <span style={{display:'inline-flex',alignItems:'center',gap:10,background:`linear-gradient(135deg,${team.c1}33,${team.foil[1]}22)`,border:`1.5px solid ${team.c1}88`,borderRadius:999,padding:'8px 20px'}}>
                  <span style={{fontSize:22}}>{team.flag}</span>
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
