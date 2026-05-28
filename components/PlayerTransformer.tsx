'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

/* ─── Teams ──────────────────────────────────────────────── */
const TEAMS = [
  { name: 'Brasil',    flag: '🇧🇷', abbr: 'BRA', pos: 'POS', c1: '#009C3B', c2: '#FFD700', dark: '#003314', text: '#FFD700', jersey: 'yellow and green Brazil Seleção Brasileira number 10 soccer jersey' },
  { name: 'Argentina', flag: '🇦🇷', abbr: 'ARG', pos: 'POS', c1: '#5BB8F5', c2: '#FFFFFF', dark: '#0a2d4d', text: '#FFFFFF', jersey: 'light blue and white Argentina Albiceleste number 10 soccer jersey' },
  { name: 'França',    flag: '🇫🇷', abbr: 'FRA', pos: 'POS', c1: '#1A3A8F', c2: '#EF4135', dark: '#070f2b', text: '#EF4135', jersey: 'dark blue France Les Bleus number 10 soccer jersey' },
  { name: 'Alemanha',  flag: '🇩🇪', abbr: 'GER', pos: 'POS', c1: '#888888', c2: '#FFFFFF', dark: '#111111', text: '#FFFFFF', jersey: 'white Germany national team number 8 soccer jersey' },
  { name: 'Portugal',  flag: '🇵🇹', abbr: 'POR', pos: 'POS', c1: '#C8102E', c2: '#FFD700', dark: '#3a0008', text: '#FFD700', jersey: 'red Portugal national team number 7 soccer jersey' },
  { name: 'Espanha',   flag: '🇪🇸', abbr: 'ESP', pos: 'POS', c1: '#AA151B', c2: '#F1BF00', dark: '#340004', text: '#F1BF00', jersey: 'red Spain La Roja number 10 soccer jersey' },
  { name: 'Holanda',   flag: '🇳🇱', abbr: 'NED', pos: 'POS', c1: '#FF5F00', c2: '#FFFFFF', dark: '#4a1a00', text: '#FFFFFF', jersey: 'orange Netherlands Oranje number 10 soccer jersey' },
  { name: 'Itália',    flag: '🇮🇹', abbr: 'ITA', pos: 'POS', c1: '#0057A8', c2: '#FFFFFF', dark: '#00173a', text: '#FFFFFF', jersey: 'blue Italy Azzurri number 9 soccer jersey' },
  { name: 'Inglaterra',flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', abbr: 'ENG', pos: 'POS', c1: '#CF091D', c2: '#FFFFFF', dark: '#300005', text: '#FFFFFF', jersey: 'white England Three Lions number 10 soccer jersey' },
  { name: 'Marrocos',  flag: '🇲🇦', abbr: 'MAR', pos: 'POS', c1: '#C1272D', c2: '#FFD700', dark: '#350006', text: '#FFD700', jersey: 'red Morocco national team number 9 soccer jersey' },
  { name: 'Japão',     flag: '🇯🇵', abbr: 'JPN', pos: 'POS', c1: '#003087', c2: '#BC002D', dark: '#00092a', text: '#BC002D', jersey: 'dark blue Japan Samurai Blue number 10 soccer jersey' },
  { name: 'Uruguai',   flag: '🇺🇾', abbr: 'URU', pos: 'POS', c1: '#5AABD6', c2: '#FFFFFF', dark: '#001635', text: '#FFFFFF', jersey: 'light blue Uruguay Celeste number 10 soccer jersey' },
];
type Team = typeof TEAMS[0];
const POS_ABBR = ['ATK','MEI','PNT','CA','CAM'];
const CARD_NUMS = Array.from({ length: 200 }, (_, i) => i + 50);
function rnd(a:number,b:number){ return Math.floor(Math.random()*(b-a+1))+a; }
function pick<T>(arr:T[]):T{ return arr[Math.floor(Math.random()*arr.length)]; }
function randomStats(){ return { PAC:rnd(88,99), DRI:rnd(87,99), FIN:rnd(86,99), PAS:rnd(88,99), FIS:rnd(85,97) }; }
type Stats = ReturnType<typeof randomStats>;

/* ─── Helpers ────────────────────────────────────────────── */
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

/* ─── Canvas Story 1080×1920 ─────────────────────────────── */
async function generateStoryBlob(resultUrl:string, team:Team, name:string, posAbbr:string, stats:Stats, cardNum:number):Promise<Blob>{
  const W=1080,H=1920;
  const canvas=document.createElement('canvas');
  canvas.width=W; canvas.height=H;
  const ctx=canvas.getContext('2d')!;

  const proxyUrl=`/api/fal/proxy-image?url=${encodeURIComponent(resultUrl)}`;
  const [playerImg,logoImg]=await Promise.all([loadImg(proxyUrl),loadImg('/logo.png')]);

  // BG
  const bg=ctx.createLinearGradient(0,0,W,H);
  bg.addColorStop(0,team.dark); bg.addColorStop(0.55,'#060606'); bg.addColorStop(1,'#030303');
  ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);

  // diagonal lines
  ctx.save(); ctx.strokeStyle=team.c1+'25'; ctx.lineWidth=4;
  for(let i=-H;i<W+H;i+=40){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i+H,H);ctx.stroke();}
  ctx.restore();

  // top glow
  const tg=ctx.createRadialGradient(W/2,0,0,W/2,0,800);
  tg.addColorStop(0,team.c1+'55'); tg.addColorStop(1,'transparent');
  ctx.fillStyle=tg; ctx.fillRect(0,0,W,H);

  // headline
  ctx.textAlign='center'; ctx.font='bold 72px Arial';
  ctx.fillStyle=team.text; ctx.fillText('FUI CONVOCADO!',W/2,200);
  ctx.font='42px Arial'; ctx.fillStyle='rgba(255,255,255,0.6)';
  ctx.fillText(`${team.flag}  ${team.name}  ·  Copa 2026`,W/2,268);

  // ── Card ──
  const cW=560,cH=800,cX=(W-cW)/2,cY=330,cR=22;
  const ovr=Math.round((stats.PAC+stats.DRI+stats.FIN+stats.PAS+stats.FIS)/5);

  // rainbow border wrapper
  ctx.save();
  rrect(ctx,cX-5,cY-5,cW+10,cH+10,cR+5);
  const rb=ctx.createLinearGradient(cX,cY,cX+cW,cY+cH);
  ['#ff0044','#ff8800','#ffff00','#00ff88','#0088ff','#8800ff','#ff0088'].forEach((c,i,a)=>rb.addColorStop(i/(a.length-1),c));
  ctx.strokeStyle=rb; ctx.lineWidth=6; ctx.stroke();
  ctx.restore();

  // card clip
  ctx.save();
  rrect(ctx,cX,cY,cW,cH,cR); ctx.clip();

  // card bg
  const cbg=ctx.createLinearGradient(cX,cY,cX+cW,cY+cH);
  cbg.addColorStop(0,team.dark); cbg.addColorStop(1,'#080808');
  ctx.fillStyle=cbg; ctx.fillRect(cX,cY,cW,cH);

  // card diagonal lines
  ctx.strokeStyle=team.c1+'20'; ctx.lineWidth=3;
  for(let i=-cH;i<cW+cH;i+=28){ctx.beginPath();ctx.moveTo(cX+i,cY);ctx.lineTo(cX+i+cH,cY+cH);ctx.stroke();}

  // header strip
  const hH=88;
  const hg=ctx.createLinearGradient(cX,cY,cX+cW,cY+hH);
  hg.addColorStop(0,team.c1); hg.addColorStop(1,team.dark);
  ctx.fillStyle=hg; ctx.fillRect(cX,cY,cW,hH);

  // header content
  ctx.font=`bold 36px Arial`; ctx.fillStyle='#fff'; ctx.textAlign='left';
  ctx.fillText(team.flag+' '+team.abbr,cX+20,cY+56);
  ctx.font='bold 26px Arial'; ctx.textAlign='center';
  ctx.fillStyle=team.text; ctx.fillText('COPA MUNDO 2026',cX+cW/2,cY+56);
  ctx.font='22px Arial'; ctx.fillStyle='rgba(255,255,255,0.4)';
  ctx.textAlign='right'; ctx.fillText(`#${cardNum}`,cX+cW-18,cY+56);

  // photo
  const pY=cY+hH;
  ctx.drawImage(playerImg,cX,pY,cW,cH-hH);

  // bottom fade
  const fade=ctx.createLinearGradient(0,cY+cH-300,0,cY+cH);
  fade.addColorStop(0,'transparent'); fade.addColorStop(0.4,team.dark+'bb'); fade.addColorStop(1,'#080808');
  ctx.fillStyle=fade; ctx.fillRect(cX,cY+cH-300,cW,300);

  // OVR/POS left badge
  ctx.fillStyle='rgba(0,0,0,0.65)';
  rrect(ctx,cX+14,cY+hH+14,82,104,12); ctx.fill();
  ctx.font='bold 52px Arial'; ctx.fillStyle=team.text; ctx.textAlign='center';
  ctx.fillText(String(ovr),cX+55,cY+hH+68);
  ctx.font='bold 22px Arial'; ctx.fillStyle='rgba(255,255,255,0.55)';
  ctx.fillText(posAbbr,cX+55,cY+hH+90);
  ctx.font='bold 18px Arial'; ctx.fillStyle='rgba(255,255,255,0.3)';
  ctx.fillText(team.flag,cX+55,cY+hH+112);

  // name
  const nY=cY+cH-210;
  ctx.save(); ctx.shadowColor=team.c1; ctx.shadowBlur=24;
  ctx.font=`bold ${name.length>10?50:60}px Arial`; ctx.fillStyle='#fff'; ctx.textAlign='left';
  ctx.fillText(name.toUpperCase(),cX+16,nY); ctx.restore();
  ctx.font='bold 24px Arial'; ctx.fillStyle=team.text; ctx.textAlign='left';
  ctx.fillText(posAbbr+' · '+team.name,cX+16,nY+34);

  // stats
  const sKeys=Object.keys(stats) as (keyof Stats)[];
  const sW=(cW-32)/5;
  sKeys.forEach((k,i)=>{
    const sx=cX+16+i*sW,sy=nY+52;
    ctx.fillStyle='rgba(0,0,0,0.6)'; rrect(ctx,sx,sy,sW-8,62,8); ctx.fill();
    ctx.font='bold 30px Arial'; ctx.fillStyle=team.text; ctx.textAlign='center';
    ctx.fillText(String(stats[k]),sx+(sW-8)/2,sy+38);
    ctx.font='16px Arial'; ctx.fillStyle='rgba(255,255,255,0.4)';
    ctx.fillText(k,sx+(sW-8)/2,sy+56);
  });

  // bibcar
  const lS=44; ctx.drawImage(logoImg,cX+cW-lS-12,cY+cH-lS-10,lS,lS);
  ctx.font='bold 22px Arial'; ctx.fillStyle='rgba(255,255,255,0.5)';
  ctx.textAlign='right'; ctx.fillText('BIBCAR',cX+cW-lS-18,cY+cH-14);

  ctx.restore();

  // bottom tags
  const bY=cY+cH+80;
  ctx.font='bold 40px Arial'; ctx.fillStyle='rgba(255,255,255,0.7)';
  ctx.textAlign='center'; ctx.fillText('#Copa2026  #BibCar  #FigurinhaIA',W/2,bY);
  ctx.font='28px Arial'; ctx.fillStyle='rgba(255,255,255,0.3)';
  ctx.fillText('bibcarbrasil.com.br',W/2,bY+50);
  const bLS=60; ctx.drawImage(logoImg,W/2-bLS/2,bY+70,bLS,bLS);

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
    setTimeout(step,delay);
    return()=>{stopped=true;};
  },[]);// eslint-disable-line
  const t=done?winner.current:TEAMS[idx];
  return(
    <div style={{textAlign:'center',padding:'48px 0'}}>
      <p style={{color:'rgba(255,255,255,0.4)',fontSize:12,letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:20}}>Sorteando seu time…</p>
      <motion.div key={t.abbr} initial={{opacity:0,scale:0.88}} animate={{opacity:1,scale:1}} transition={{duration:0.06}}
        style={{display:'inline-flex',flexDirection:'column',alignItems:'center',gap:10,background:`linear-gradient(135deg,${t.c1}33,${t.c2}18)`,border:`2px solid ${t.c1}88`,borderRadius:20,padding:'22px 44px',minWidth:220}}>
        <span style={{fontSize:60}}>{t.flag}</span>
        <span style={{color:'#fff',fontWeight:900,fontSize:24,letterSpacing:'0.04em'}}>{t.name}</span>
        <span style={{color:t.text,fontWeight:700,fontSize:13,letterSpacing:'0.2em'}}>{t.abbr}</span>
      </motion.div>
    </div>
  );
}

/* ─── Figurinha Card HTML ────────────────────────────────── */
function FigurinhaCard({imageUrl,team,name,posAbbr,stats,cardNum,size=300}:{
  imageUrl:string;team:Team;name:string;posAbbr:string;stats:Stats;cardNum:number;size?:number;
}){
  const s=size/300, H=Math.round(440*s);
  const ovr=Math.round((stats.PAC+stats.DRI+stats.FIN+stats.PAS+stats.FIS)/5);

  return(
    // Rainbow border wrapper
    <div style={{
      padding:3*s,borderRadius:20*s,
      background:'linear-gradient(135deg,#ff0044,#ff8800,#ffff00,#00ff88,#0088ff,#8800ff,#ff0088)',
      boxShadow:`0 0 40px ${team.c1}88, 0 0 80px ${team.c1}44, 0 24px 60px rgba(0,0,0,0.8)`,
      display:'inline-block',
    }}>
      <div style={{
        position:'relative',width:size,height:H,borderRadius:18*s,overflow:'hidden',
        background:`linear-gradient(155deg,${team.dark} 0%,#060606 100%)`,
      }}>
        {/* diagonal lines */}
        <div style={{position:'absolute',inset:0,backgroundImage:`repeating-linear-gradient(135deg,${team.c1}18 0,${team.c1}18 2px,transparent 2px,transparent 22px)`}} />
        {/* top glow */}
        <div style={{position:'absolute',top:0,left:0,right:0,height:H*0.45,background:`radial-gradient(ellipse at 50% 0%,${team.c1}55,transparent 70%)`}} />

        {/* Holographic rainbow shimmer */}
        <motion.div
          animate={{x:['-120%','220%']}}
          transition={{repeat:Infinity,duration:4,ease:'linear',repeatDelay:2.5}}
          style={{
            position:'absolute',inset:0,zIndex:15,pointerEvents:'none',
            background:'linear-gradient(105deg,transparent 25%,rgba(255,0,68,0.12) 32%,rgba(255,136,0,0.12) 36%,rgba(255,255,0,0.12) 40%,rgba(0,255,136,0.12) 44%,rgba(0,136,255,0.12) 48%,rgba(136,0,255,0.12) 52%,transparent 60%)',
          }}
        />

        {/* Header strip */}
        <div style={{
          position:'absolute',top:0,left:0,right:0,height:46*s,
          background:`linear-gradient(90deg,${team.c1},${team.dark}ee)`,
          display:'flex',alignItems:'center',justifyContent:'space-between',
          padding:`0 ${12*s}px`,zIndex:5,
          borderBottom:`1px solid ${team.text}33`,
        }}>
          <div style={{display:'flex',alignItems:'center',gap:6*s}}>
            <span style={{fontSize:18*s}}>{team.flag}</span>
            <span style={{color:'#fff',fontWeight:900,fontSize:12*s,letterSpacing:'0.12em'}}>{team.abbr}</span>
          </div>
          <span style={{color:team.text,fontWeight:800,fontSize:9*s,letterSpacing:'0.18em',opacity:0.9}}>COPA MUNDO 2026</span>
          <span style={{color:'rgba(255,255,255,0.35)',fontSize:9*s,fontWeight:700}}>#{cardNum}</span>
        </div>

        {/* Player photo */}
        <div style={{position:'absolute',top:46*s,left:0,right:0,bottom:0}}>
          <Image
            src={imageUrl} alt="Jogador" fill unoptimized
            style={{objectFit:'cover',objectPosition:'center 8%'}}
          />
          {/* bottom vignette */}
          <div style={{position:'absolute',bottom:0,left:0,right:0,height:H*0.52,background:`linear-gradient(to top,#060606 0%,${team.dark}dd 30%,transparent 100%)`}} />
          {/* side vignettes for cinematic look */}
          <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse at 50% 50%,transparent 55%,rgba(0,0,0,0.5) 100%)`}} />
        </div>

        {/* OVR / POS / FLAG badge */}
        <div style={{
          position:'absolute',top:(46+12)*s,left:10*s,zIndex:6,
          background:'rgba(0,0,0,0.7)',backdropFilter:'blur(8px)',
          borderRadius:10*s,padding:`${5*s}px ${10*s}px`,
          border:`1px solid ${team.text}55`,
          textAlign:'center',minWidth:44*s,
        }}>
          <div style={{color:team.text,fontSize:28*s,fontWeight:900,lineHeight:1}}>{ovr}</div>
          <div style={{color:'rgba(255,255,255,0.6)',fontSize:8*s,fontWeight:700,letterSpacing:'0.08em',lineHeight:1.4}}>OVR</div>
          <div style={{color:team.text,fontSize:8*s,fontWeight:800,letterSpacing:'0.1em',marginTop:3*s}}>{posAbbr}</div>
          <div style={{fontSize:12*s,marginTop:2*s}}>{team.flag}</div>
        </div>

        {/* Bottom info */}
        <div style={{position:'absolute',bottom:0,left:0,right:0,padding:`0 ${12*s}px ${9*s}px`,zIndex:6}}>
          {/* Name */}
          <div style={{
            color:'#fff',fontSize:(name.length>10?17:21)*s,fontWeight:900,
            letterSpacing:'0.06em',textTransform:'uppercase',lineHeight:1.05,
            textShadow:`0 0 20px ${team.c1},0 2px 8px rgba(0,0,0,0.9)`,
            marginBottom:2*s,
          }}>{name||'JOGADOR'}</div>

          {/* Position + team */}
          <div style={{color:team.text,fontSize:8*s,fontWeight:700,letterSpacing:'0.16em',marginBottom:7*s,opacity:0.9}}>
            {posAbbr}  ·  {team.name.toUpperCase()}
          </div>

          {/* Stats — 5 columns like FUT */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:3*s,marginBottom:7*s}}>
            {(Object.keys(stats) as (keyof Stats)[]).map(k=>(
              <div key={k} style={{
                background:'rgba(0,0,0,0.6)',backdropFilter:'blur(6px)',
                border:`1px solid ${team.c1}55`,borderRadius:5*s,
                padding:`${3*s}px 0`,textAlign:'center',
              }}>
                <div style={{color:team.text,fontSize:13*s,fontWeight:900,lineHeight:1}}>{stats[k]}</div>
                <div style={{color:'rgba(255,255,255,0.4)',fontSize:6.5*s,letterSpacing:'0.06em'}}>{k}</div>
              </div>
            ))}
          </div>

          {/* BibCar */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end',gap:4*s,borderTop:`1px solid ${team.c1}33`,paddingTop:5*s}}>
            <div style={{width:16*s,height:16*s,borderRadius:3*s,overflow:'hidden',border:'1px solid rgba(255,255,255,0.2)',flexShrink:0}}>
              <Image src="/logo.png" alt="BibCar" width={16} height={16} style={{objectFit:'cover',width:'100%',height:'100%'}} />
            </div>
            <span style={{color:'rgba(255,255,255,0.55)',fontSize:8.5*s,fontWeight:700,letterSpacing:'0.12em'}}>BIBCAR</span>
          </div>
        </div>
      </div>
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
  const [posAbbr]=useState(()=>pick(POS_ABBR));
  const [stats]=useState(randomStats);
  const [cardNum]=useState(()=>pick(CARD_NUMS));
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
    const prompt=`person wearing ${t.jersey}, Maracanã stadium crowd background, FIFA World Cup 2026, athletic confident stance, professional sports photography, sharp focus, dramatic lighting`;
    try{
      const res=await fetch('/api/fal',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({imageDataUrl:dataUrlRef.current,prompt})});
      const data=await res.json() as {imageUrl?:string;error?:string};
      if(!res.ok||!data.imageUrl) throw new Error(data.error??'Erro desconhecido');
      setResultUrl(data.imageUrl); setStage('result');
    }catch(e){ setErrorMsg(String(e)); setStage('error'); }
  };

  const buildAndShare=async(mode:'share'|'download')=>{
    if(!resultUrl||!team) return;
    setStage('sharing');
    try{
      const blob=cachedBlob??await generateStoryBlob(resultUrl,team,playerName||'JOGADOR',posAbbr,stats,cardNum);
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
      {/* Heading */}
      <div className="max-w-3xl mx-auto text-center mb-14">
        <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6,ease}}>
          <span style={{display:'inline-block',background:'linear-gradient(135deg,rgba(0,156,59,0.25),rgba(255,223,0,0.2))',border:'1px solid rgba(255,223,0,0.35)',color:'#FFDF00',borderRadius:999,padding:'4px 18px',fontSize:13,fontWeight:700,letterSpacing:'0.08em',marginBottom:18}}>
            ✨ FIGURINHA IA · COPA 2026
          </span>
          <h2 style={{fontSize:'clamp(1.9rem,5vw,2.9rem)',fontWeight:900,lineHeight:1.1,color:'#fff',marginBottom:14}}>
            Vira figurinha{' '}
            <span style={{background:'linear-gradient(90deg,#009C3B,#FFDF00)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>da Copa 🏆</span>
          </h2>
          <p style={{color:'rgba(255,255,255,0.5)',fontSize:'1rem',maxWidth:460,margin:'0 auto'}}>
            Manda sua foto · IA preserva seu rosto · sorteia time · gera figurinha instagramável
          </p>
        </motion.div>
      </div>

      <div className="max-w-xl mx-auto">
        <AnimatePresence mode="wait">

          {/* IDLE */}
          {stage==='idle'&&(
            <motion.div key="idle" initial={{opacity:0,scale:0.97}} animate={{opacity:1,scale:1}} exit={{opacity:0}}>
              <div onDrop={onDrop} onDragOver={e=>e.preventDefault()} onClick={()=>fileRef.current?.click()}
                style={{border:'2px dashed rgba(255,223,0,0.35)',borderRadius:24,background:'rgba(0,156,59,0.05)',padding:'56px 32px',textAlign:'center',cursor:'pointer',transition:'all 0.2s'}}
                onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.borderColor='rgba(255,223,0,0.65)';(e.currentTarget as HTMLDivElement).style.background='rgba(0,156,59,0.1)';}}
                onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.borderColor='rgba(255,223,0,0.35)';(e.currentTarget as HTMLDivElement).style.background='rgba(0,156,59,0.05)';}}>
                <div style={{fontSize:64,marginBottom:16}}>📸</div>
                <p style={{color:'#fff',fontWeight:700,fontSize:'1.15rem',marginBottom:8}}>Manda sua foto</p>
                <p style={{color:'rgba(255,255,255,0.4)',fontSize:'0.88rem',marginBottom:28}}>Rosto preservado · time sorteado · figurinha oficial</p>
                <span style={{display:'inline-block',background:'linear-gradient(135deg,#009C3B,#007a2e)',color:'#fff',fontWeight:700,padding:'12px 32px',borderRadius:999,fontSize:'0.95rem'}}>Escolher Foto</span>
              </div>
              <input ref={fileRef} type="file" accept="image/*" capture="user" onChange={onInput} style={{display:'none'}} />
            </motion.div>
          )}

          {/* PREVIEW */}
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
                <button onClick={()=>setStage('roulette')} style={{background:'linear-gradient(135deg,#009C3B,#FFDF00)',color:'#051505',fontWeight:900,padding:'14px 36px',borderRadius:999,border:'none',fontSize:'1rem',cursor:'pointer',letterSpacing:'0.04em'}}>🎲 Sortear meu time!</button>
                <button onClick={reset} style={{background:'rgba(255,255,255,0.07)',color:'rgba(255,255,255,0.5)',padding:'14px 24px',borderRadius:999,border:'1px solid rgba(255,255,255,0.15)',fontSize:'0.9rem',cursor:'pointer',fontWeight:600}}>Trocar foto</button>
              </div>
            </motion.div>
          )}

          {/* ROULETTE */}
          {stage==='roulette'&&(
            <motion.div key="roulette" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
              <TeamRoulette onDone={onTeamPicked} />
            </motion.div>
          )}

          {/* LOADING */}
          {stage==='loading'&&team&&(
            <motion.div key="loading" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{textAlign:'center',padding:'64px 0'}}>
              <div style={{fontSize:52,marginBottom:16}}>{team.flag}</div>
              <motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:1.4,ease:'linear'}} style={{fontSize:58,display:'inline-block',marginBottom:24}}>⚽</motion.div>
              <p style={{color:'#fff',fontWeight:700,fontSize:'1.15rem',marginBottom:8}}>Criando sua figurinha…</p>
              <p style={{color:'rgba(255,255,255,0.4)',fontSize:'0.88rem'}}>Preservando seu rosto · ~1 minuto ⏱</p>
              <div style={{display:'flex',gap:8,justifyContent:'center',marginTop:24}}>
                {[0,1,2].map(i=><motion.div key={i} animate={{opacity:[0.3,1,0.3]}} transition={{repeat:Infinity,duration:1.4,delay:i*0.46}} style={{width:9,height:9,borderRadius:'50%',background:team.text}}/>)}
              </div>
            </motion.div>
          )}

          {/* SHARING */}
          {stage==='sharing'&&(
            <motion.div key="sharing" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{textAlign:'center',padding:'64px 0'}}>
              <motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:1,ease:'linear'}} style={{fontSize:52,display:'inline-block',marginBottom:20}}>⚙️</motion.div>
              <p style={{color:'#fff',fontWeight:700,fontSize:'1.05rem'}}>Gerando imagem…</p>
            </motion.div>
          )}

          {/* RESULT */}
          {stage==='result'&&resultUrl&&team&&(
            <motion.div key="result" initial={{opacity:0,scale:0.88,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0}} transition={{duration:0.55,ease}} style={{textAlign:'center'}}>
              <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{delay:0.3}} style={{marginBottom:20}}>
                <span style={{display:'inline-flex',alignItems:'center',gap:10,background:`linear-gradient(135deg,${team.c1}33,${team.text}18)`,border:`1.5px solid ${team.c1}88`,borderRadius:999,padding:'8px 20px'}}>
                  <span style={{fontSize:22}}>{team.flag}</span>
                  <span style={{color:'#fff',fontWeight:900,fontSize:'0.9rem',letterSpacing:'0.05em'}}>Convocado pela {team.name}! 🏆</span>
                </span>
              </motion.div>

              <div style={{display:'flex',justifyContent:'center',marginBottom:28}}>
                <motion.div animate={{y:[0,-8,0]}} transition={{repeat:Infinity,duration:3.2,ease:'easeInOut'}}>
                  <FigurinhaCard imageUrl={resultUrl} team={team} name={playerName||'JOGADOR'} posAbbr={posAbbr} stats={stats} cardNum={cardNum} size={288}/>
                </motion.div>
              </div>

              <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap',maxWidth:420,margin:'0 auto 12px'}}>
                <button onClick={()=>buildAndShare('share')}
                  style={{flex:'1 1 180px',display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:`linear-gradient(135deg,${team.c1},${team.dark})`,border:`2px solid ${team.text}66`,color:'#fff',fontWeight:900,padding:'14px 20px',borderRadius:14,fontSize:'0.92rem',cursor:'pointer'}}>
                  <span style={{fontSize:20}}>📲</span>
                  <div style={{textAlign:'left'}}>
                    <div style={{fontSize:'0.75rem',opacity:0.7,lineHeight:1}}>Compartilhar</div>
                    <div>Instagram / WhatsApp</div>
                  </div>
                </button>
                <button onClick={()=>buildAndShare('download')}
                  style={{flex:'1 1 130px',display:'flex',alignItems:'center',justifyContent:'center',gap:6,background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.8)',fontWeight:700,padding:'14px 18px',borderRadius:14,border:'1px solid rgba(255,255,255,0.15)',fontSize:'0.88rem',cursor:'pointer'}}>
                  ⬇ Baixar PNG
                </button>
                <button onClick={()=>setFullscreen(true)}
                  style={{flex:'1 1 120px',display:'flex',alignItems:'center',justifyContent:'center',gap:6,background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.5)',fontWeight:600,padding:'14px 16px',borderRadius:14,border:'1px solid rgba(255,255,255,0.1)',fontSize:'0.84rem',cursor:'pointer'}}>
                  🔍 Ampliar
                </button>
              </div>
              <button onClick={reset} style={{background:'transparent',color:'rgba(255,255,255,0.3)',border:'none',cursor:'pointer',fontSize:'0.8rem',marginTop:4}}>Tentar com outra foto</button>
            </motion.div>
          )}

          {/* ERROR */}
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

      {/* FULLSCREEN MODAL */}
      <AnimatePresence>
        {fullscreen&&resultUrl&&team&&(
          <motion.div key="fs" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            onClick={()=>setFullscreen(false)}
            style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.96)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,cursor:'pointer'}}>
            <p style={{color:'rgba(255,255,255,0.4)',fontSize:13,marginBottom:20,textAlign:'center'}}>📱 Pressione e segure para salvar · Toque fora para fechar</p>
            <div onClick={e=>e.stopPropagation()}>
              <FigurinhaCard imageUrl={resultUrl} team={team} name={playerName||'JOGADOR'} posAbbr={posAbbr} stats={stats} cardNum={cardNum} size={Math.min(300,typeof window!=='undefined'?window.innerWidth-48:280)}/>
            </div>
            <div style={{display:'flex',gap:10,marginTop:20}} onClick={e=>e.stopPropagation()}>
              <button onClick={()=>buildAndShare('share')} style={{background:`linear-gradient(135deg,${team.c1},${team.dark})`,color:'#fff',fontWeight:800,padding:'11px 24px',borderRadius:999,border:`1px solid ${team.text}55`,fontSize:'0.88rem',cursor:'pointer'}}>📲 Compartilhar</button>
              <button onClick={()=>buildAndShare('download')} style={{background:'rgba(255,255,255,0.1)',color:'#fff',fontWeight:700,padding:'11px 22px',borderRadius:999,border:'1px solid rgba(255,255,255,0.2)',fontSize:'0.88rem',cursor:'pointer'}}>⬇ Baixar</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
