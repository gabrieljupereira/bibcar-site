'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

/* ─── Teams ──────────────────────────────────────────────── */
const TEAMS = [
  { name: 'Brasil',        flag: '🇧🇷', abbr: 'BRA', c1: '#00843D', c2: '#FFCD00', foil: ['#00843D','#005c2b','#009940'], text: '#FFCD00', jersey: 'yellow and green Brazil Seleção Brasileira soccer jersey' },
  { name: 'Argentina',     flag: '🇦🇷', abbr: 'ARG', c1: '#6CACE4', c2: '#FFFFFF', foil: ['#b8860b','#daa520','#ffd700'], text: '#003087', jersey: 'light blue and white Argentina Albiceleste stripes soccer jersey' },
  { name: 'França',        flag: '🇫🇷', abbr: 'FRA', c1: '#002395', c2: '#FFFFFF', foil: ['#b8860b','#daa520','#ffd700'], text: '#FFFFFF', jersey: 'dark blue France Les Bleus soccer jersey' },
  { name: 'Alemanha',      flag: '🇩🇪', abbr: 'GER', c1: '#2a2a2a', c2: '#FFFFFF', foil: ['#888','#aaa','#ccc'],          text: '#ffffff', jersey: 'white Germany national team soccer jersey' },
  { name: 'Portugal',      flag: '🇵🇹', abbr: 'POR', c1: '#C8102E', c2: '#006600', foil: ['#b8860b','#daa520','#ffd700'], text: '#FFFFFF', jersey: 'red Portugal national team soccer jersey' },
  { name: 'Espanha',       flag: '🇪🇸', abbr: 'ESP', c1: '#AA151B', c2: '#F1BF00', foil: ['#AA151B','#c0392b','#e74c3c'], text: '#F1BF00', jersey: 'red Spain La Roja soccer jersey' },
  { name: 'Holanda',       flag: '🇳🇱', abbr: 'NED', c1: '#FF4F00', c2: '#FFFFFF', foil: ['#b8860b','#daa520','#ffd700'], text: '#FF4F00', jersey: 'orange Netherlands Oranje soccer jersey' },
  { name: 'Itália',        flag: '🇮🇹', abbr: 'ITA', c1: '#0066CC', c2: '#FFFFFF', foil: ['#0066CC','#0047a0','#003d8a'], text: '#FFFFFF', jersey: 'blue Italy Azzurri soccer jersey' },
  { name: 'Inglaterra',    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', abbr: 'ENG', c1: '#CF091D', c2: '#FFFFFF', foil: ['#b8860b','#daa520','#ffd700'], text: '#FFFFFF', jersey: 'white England Three Lions soccer jersey' },
  { name: 'Marrocos',      flag: '🇲🇦', abbr: 'MAR', c1: '#C1272D', c2: '#006233', foil: ['#b8860b','#daa520','#ffd700'], text: '#FFFFFF', jersey: 'red Morocco national team soccer jersey' },
  { name: 'Japão',         flag: '🇯🇵', abbr: 'JPN', c1: '#003087', c2: '#FFFFFF', foil: ['#003087','#001a4d','#002470'], text: '#FFFFFF', jersey: 'dark blue Japan Samurai Blue soccer jersey' },
  { name: 'Uruguai',       flag: '🇺🇾', abbr: 'URU', c1: '#4B9CD3', c2: '#FFFFFF', foil: ['#b8860b','#daa520','#ffd700'], text: '#FFFFFF', jersey: 'light blue Uruguay Celeste soccer jersey' },
  { name: 'EUA',           flag: '🇺🇸', abbr: 'USA', c1: '#B22234', c2: '#3C3B6E', foil: ['#B22234','#3C3B6E','#fff'],    text: '#FFFFFF', jersey: 'white USA national team soccer jersey with red and blue stripes' },
  { name: 'Colômbia',      flag: '🇨🇴', abbr: 'COL', c1: '#FCD116', c2: '#003087', foil: ['#b8860b','#e6bc00','#FCD116'], text: '#003087', jersey: 'yellow Colombia national team soccer jersey' },
  { name: 'México',        flag: '🇲🇽', abbr: 'MEX', c1: '#006847', c2: '#FFFFFF', foil: ['#006847','#004f36','#009060'], text: '#FFFFFF', jersey: 'green Mexico national team soccer jersey' },
  { name: 'Senegal',       flag: '🇸🇳', abbr: 'SEN', c1: '#00853F', c2: '#FDEF42', foil: ['#b8860b','#daa520','#ffd700'], text: '#FFFFFF', jersey: 'white Senegal national team soccer jersey' },
  { name: 'Croácia',       flag: '🇭🇷', abbr: 'CRO', c1: '#FF0000', c2: '#FFFFFF', foil: ['#FF0000','#cc0000','#ff4444'], text: '#FFFFFF', jersey: 'red and white checkered Croatia national team soccer jersey' },
  { name: 'Bélgica',       flag: '🇧🇪', abbr: 'BEL', c1: '#EF3340', c2: '#000000', foil: ['#EF3340','#d42d38','#ff5566'], text: '#FFCD00', jersey: 'red Belgium Red Devils soccer jersey' },
  { name: 'Austrália',     flag: '🇦🇺', abbr: 'AUS', c1: '#005c8a', c2: '#FFD700', foil: ['#005c8a','#004a70','#0072aa'], text: '#FFD700', jersey: 'yellow Australia Socceroos soccer jersey' },
  { name: 'Coreia do Sul', flag: '🇰🇷', abbr: 'KOR', c1: '#CD2E3A', c2: '#FFFFFF', foil: ['#CD2E3A','#b02535','#e03c49'], text: '#FFFFFF', jersey: 'red South Korea national team soccer jersey' },
];
type Team = typeof TEAMS[0];

const POSITIONS_FULL = ['Atacante','Meia-Atacante','Ponta Direita','Centroavante','Meia','Goleiro','Zagueiro','Lateral Direito','Lateral Esquerdo','Volante'];
const POS_ABBR       = ['ATK',     'CAM',          'PNT',         'CA',          'MEI', 'GL',     'ZAG',     'LD',             'LE',             'VOL'];

function rnd(a:number,b:number){ return Math.floor(Math.random()*(b-a+1))+a; }
function pick<T>(arr:T[]):T{ return arr[Math.floor(Math.random()*arr.length)]; }

/* ─── Image utils ────────────────────────────────────────── */
// Crop tightly around the detected face (or fall back to a smart heuristic crop),
// then resize to maxSize. PuLID works much better when the reference is a tight
// face crop rather than a full-body or scene photo.
async function prepareReferenceImage(file:File,maxSize=1024):Promise<{dataUrl:string;hint:string}>{
  return new Promise((resolve,reject)=>{
    const img=new window.Image(), url=URL.createObjectURL(file);
    img.onload=async()=>{
      URL.revokeObjectURL(url);
      let cropX=0,cropY=0,cropW=img.width,cropH=img.height,hint='Crop automático ⚡';

      // Native FaceDetector — available in Chrome 70+, Android Chrome
      if('FaceDetector' in window){
        try{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const fd=new (window as any).FaceDetector({maxDetectedFaces:1});
          const faces=await (fd.detect(img) as Promise<Array<{boundingBox:DOMRectReadOnly}>>);
          if(faces.length>0){
            const bb=faces[0].boundingBox;
            const pad=Math.max(bb.width,bb.height)*0.55;
            cropX=Math.max(0,bb.left-pad);
            cropY=Math.max(0,bb.top-pad);
            cropW=Math.min(img.width-cropX,bb.width+pad*2);
            cropH=Math.min(img.height-cropY,bb.height+pad*2);
            hint='Rosto detectado ✓';
          }
        }catch{ /* FaceDetector unavailable */ }
      }

      // Fallback heuristic: portrait → top portion; landscape → center-top square
      if(hint!=='Rosto detectado ✓'){
        if(img.height>=img.width){
          cropX=0; cropY=0; cropW=img.width; cropH=Math.min(img.height,Math.round(img.width*1.25));
        }else{
          const sz=Math.round(img.height*0.9);
          cropX=Math.round((img.width-sz)/2); cropY=0; cropW=sz; cropH=sz;
        }
      }

      const s=Math.min(1,maxSize/Math.max(cropW,cropH));
      const c=document.createElement('canvas');
      c.width=Math.round(cropW*s); c.height=Math.round(cropH*s);
      c.getContext('2d')!.drawImage(img,cropX,cropY,cropW,cropH,0,0,c.width,c.height);
      resolve({dataUrl:c.toDataURL('image/jpeg',0.92),hint});
    };
    img.onerror=reject; img.src=url;
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
function FigurinhaCard({imageUrl,team,name,posIdx,jerseyNum,bday,height,weight,ovr,stats,size=300}:{
  imageUrl:string;team:Team;name:string;posIdx:number;jerseyNum:number;
  bday:string;height:string;weight:string;ovr:number;stats:number[];size?:number;
}){
  const s=size/300;
  const H=Math.round(450*s);
  const topH=44*s;
  const botH=140*s;
  const [f1,f2,f3]=team.foil;
  const accent=team.c1==='#2a2a2a'?'#555':['#FCD116','#FFCD00','#FFD700'].includes(team.c1)?'#9a7300':team.c1;
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
        <div style={{position:'absolute',bottom:0,left:0,right:0,height:botH,background:'#ffffff',zIndex:6,padding:`${6*s}px ${10*s}px ${5*s}px`,display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
          <div>
            <div style={{fontSize:(name.length>12?13:16)*s,fontWeight:800,color:'#111',letterSpacing:'0.01em',lineHeight:1.1,textTransform:'uppercase'}}>
              {name.includes(' ')
                ? <>{name.split(' ').slice(0,-1).join(' ')}{' '}<strong>{name.split(' ').slice(-1)[0]}</strong></>
                : <strong>{name}</strong>}
            </div>
            <div style={{fontSize:7*s,color:'#777',marginTop:1*s,letterSpacing:'0.02em'}}>{bday}&nbsp;|&nbsp;{height} m&nbsp;|&nbsp;{weight} kg</div>
          </div>
          {/* Mini stats row */}
          <div style={{display:'flex',borderTop:`1px solid rgba(0,0,0,0.07)`,paddingTop:3*s}}>
            {['VEL','FIN','PAC','DRI','DEF','FIS'].map((lbl,i)=>(
              <div key={lbl} style={{flex:1,textAlign:'center'}}>
                <div style={{fontSize:11*s,fontWeight:900,color:accent,lineHeight:1}}>{stats[i]}</div>
                <div style={{fontSize:5.5*s,color:'#aaa',letterSpacing:'0.04em',lineHeight:1.2}}>{lbl}</div>
              </div>
            ))}
          </div>
          {/* Position bar — logo icon only, sem texto BIBCAR duplicado */}
          <div style={{background:team.c1,borderRadius:4*s,padding:`${3*s}px ${8*s}px`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span style={{color:'#fff',fontSize:8.5*s,fontWeight:700,letterSpacing:'0.04em'}}>BibCar FC&nbsp;·&nbsp;{POSITIONS_FULL[posIdx]}</span>
            <div style={{width:20*s,height:20*s,borderRadius:3*s,overflow:'hidden',flexShrink:0,background:'#fff'}}>
              <Image src="/logo.png" alt="BibCar" width={20} height={20} style={{objectFit:'contain',width:'100%',height:'100%'}}/>
            </div>
          </div>
          <div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:4*s}}>
            <span style={{fontSize:11*s}}>{team.flag}</span>
            <span style={{color:'#bbb',fontSize:6.5*s,letterSpacing:'0.1em'}}>{team.abbr}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Canvas Story 1080×1920 ─────────────────────────────── */
async function generateStoryBlob(resultUrl:string,team:Team,name:string,posIdx:number,jerseyNum:number,bday:string,height:string,weight:string,cardNum:number,ovr:number,stats:number[]):Promise<Blob>{
  const W=1080,H=1920;
  const canvas=document.createElement('canvas');
  canvas.width=W; canvas.height=H;
  const ctx=canvas.getContext('2d')!;
  const playerSrc=`/api/fal/proxy-image?url=${encodeURIComponent(resultUrl)}`;
  const [playerImg,logoImg]=await Promise.all([loadImg(playerSrc),loadImg('/logo.png')]);
  const [f1,f2,f3]=team.foil;
  const accent=team.c1==='#2a2a2a'?'#666':team.c1;

  /* ── Background ── */
  const bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#050505'); bg.addColorStop(0.45,accent+'18'); bg.addColorStop(1,'#030303');
  ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
  ([[W*.18,0,660,accent+'3c'],[W*.82,0,540,team.c2+'28'],[W*.5,H,820,accent+'20']] as [number,number,number,string][]).forEach(([sx,sy,sr,sc])=>{
    const sg=ctx.createRadialGradient(sx,sy,0,sx,sy,sr);
    sg.addColorStop(0,sc); sg.addColorStop(1,'transparent');
    ctx.fillStyle=sg; ctx.fillRect(0,0,W,H);
  });
  ctx.fillStyle='rgba(255,255,255,0.028)';
  for(let gx=40;gx<W;gx+=68) for(let gy=40;gy<H;gy+=68){ ctx.beginPath(); ctx.arc(gx,gy,1.8,0,Math.PI*2); ctx.fill(); }

  /* ── Equalizer bars (taller — fill bottom third) ── */
  const barN=54,barW=Math.floor(W/barN),barGap=4;
  const barFn=(i:number)=>{ const t=i/(barN-1); return Math.max(14,118+Math.sin(t*Math.PI*4)*118+Math.sin(t*Math.PI*9+.6)*64+Math.sin(t*Math.PI*16+1.3)*32); };
  for(let i=0;i<barN;i++){
    const bH=barFn(i),bX=i*barW+barGap/2;
    const g=ctx.createLinearGradient(0,H-bH,0,H); g.addColorStop(0,accent+'ee'); g.addColorStop(0.6,accent+'55'); g.addColorStop(1,accent+'0a');
    ctx.fillStyle=g; rrect(ctx,bX,H-bH,barW-barGap,bH,3); ctx.fill();
  }
  for(let i=0;i<barN;i++){
    const bH=barFn(i)*.5,bX=i*barW+barGap/2;
    const g=ctx.createLinearGradient(0,0,0,bH); g.addColorStop(0,accent+'bb'); g.addColorStop(1,accent+'00');
    ctx.fillStyle=g; rrect(ctx,bX,0,barW-barGap,bH,3); ctx.fill();
  }
  const vig=ctx.createRadialGradient(W/2,H/2,280,W/2,H/2,980);
  vig.addColorStop(0,'transparent'); vig.addColorStop(1,'rgba(0,0,0,0.62)');
  ctx.fillStyle=vig; ctx.fillRect(0,0,W,H);

  /* ── BibCar branding ── */
  ctx.save(); ctx.globalAlpha=0.6; ctx.drawImage(logoImg,W-90,22,56,56); ctx.globalAlpha=1;
  ctx.font='bold 18px Arial'; ctx.fillStyle='#C13EFF'; ctx.textAlign='right'; ctx.fillText('BibCar',W-18,100); ctx.restore();

  /* ── Header: "FUI CONVOCADO!" ── */
  ctx.textAlign='center';
  ctx.font='bold 92px Arial'; ctx.fillStyle='#ffffff'; ctx.fillText('FUI CONVOCADO!',W/2,178);

  /* ── Subtitle: colored abbr badge + team name (sem emoji — canvas não renderiza flag emoji) ── */
  const subText=`Seleção de ${team.name}  ·  Copa 2026`;
  ctx.font='36px Arial';
  const subW=ctx.measureText(subText).width;
  const bdX=W/2-subW/2-36, bdY=228;
  rrect(ctx,bdX-24,bdY,52,24,5); ctx.fillStyle=accent; ctx.fill();
  ctx.font='bold 13px Arial'; ctx.fillStyle='#fff'; ctx.textAlign='center'; ctx.fillText(team.abbr,bdX+2,bdY+17);
  ctx.font='36px Arial'; ctx.fillStyle='rgba(255,255,255,0.55)'; ctx.textAlign='center';
  ctx.fillText(subText,W/2+14,bdY+18);

  /* ── Panini Card ── */
  const cW=660,cH=860,cX=(W-cW)/2,cY=268;
  const topH=82,botH=148;

  /* Border glow */
  ctx.save(); rrect(ctx,cX-5,cY-5,cW+10,cH+10,22);
  const border=ctx.createLinearGradient(cX,cY,cX+cW,cY+cH);
  [f1,f2,f3,f2,f1].forEach((c,i,a)=>border.addColorStop(i/(a.length-1),c));
  ctx.strokeStyle=border; ctx.lineWidth=8; ctx.stroke(); ctx.restore();

  /* Card body */
  ctx.save(); rrect(ctx,cX,cY,cW,cH,18); ctx.clip();
  const foil=ctx.createLinearGradient(cX,cY,cX+cW,cY+cH);
  [f1,f2,f3,f2,f1].forEach((c,i,a)=>foil.addColorStop(i/(a.length-1),c));
  ctx.fillStyle=foil; ctx.fillRect(cX,cY,cW,cH);
  for(let i=-cH;i<cW+cH;i+=12){ ctx.strokeStyle='rgba(255,255,255,0.07)'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(cX+i,cY); ctx.lineTo(cX+i+cH,cY+cH); ctx.stroke(); }
  ctx.globalAlpha=0.18; ctx.fillStyle=team.c1;
  ctx.font='bold italic 430px Arial'; ctx.textAlign='right'; ctx.fillText(String(jerseyNum),cX+cW-10,cY+topH+cH*.72); ctx.globalAlpha=1;

  /* Card header bar */
  ctx.fillStyle=team.c1; ctx.fillRect(cX,cY,cW,topH);
  ctx.font='bold italic 34px Arial'; ctx.fillStyle='#fff'; ctx.textAlign='left'; ctx.fillText('FIFA',cX+22,cY+36);
  ctx.font='9px Arial'; ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.fillText('WORLD CUP',cX+22,cY+56);
  ctx.font='bold 28px Arial'; ctx.fillStyle=team.text; ctx.textAlign='center'; ctx.fillText('COPA MUNDO 2026',cX+cW/2,cY+50);
  /* Team abbr badge (no emoji — canvas compat) */
  rrect(ctx,cX+cW-66,cY+12,60,58,10); ctx.fillStyle='rgba(0,0,0,0.3)'; ctx.fill();
  ctx.font='bold 23px Arial'; ctx.fillStyle='#fff'; ctx.textAlign='center'; ctx.fillText(team.abbr,cX+cW-36,cY+46);
  ctx.font='bold 12px Arial'; ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.fillText('2026',cX+cW-36,cY+64);

  /* OVR badge */
  ctx.fillStyle='rgba(0,0,0,0.72)'; rrect(ctx,cX+14,cY+topH+14,86,102,12); ctx.fill();
  ctx.font='bold 58px Arial'; ctx.fillStyle='#fff'; ctx.textAlign='center'; ctx.fillText(String(ovr),cX+57,cY+topH+74);
  ctx.font='bold 18px Arial'; ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.fillText('OVR',cX+57,cY+topH+94);

  /* Player photo */
  const pY=cY+topH,pH=cH-topH-botH;
  const sc2=Math.max(cW/playerImg.naturalWidth,pH/playerImg.naturalHeight);
  const dw=playerImg.naturalWidth*sc2,dh=playerImg.naturalHeight*sc2;
  ctx.save(); rrect(ctx,cX,pY,cW,pH,0); ctx.clip();
  ctx.drawImage(playerImg,cX+(cW-dw)/2,pY,dw,dh); ctx.restore();
  const fade=ctx.createLinearGradient(0,pY+pH-110,0,pY+pH);
  fade.addColorStop(0,'transparent'); fade.addColorStop(1,'rgba(255,255,255,0.92)');
  ctx.fillStyle=fade; ctx.fillRect(cX,pY+pH-110,cW,110);

  /* White bottom section */
  const wY=cY+cH-botH;
  ctx.fillStyle='#fff'; ctx.fillRect(cX,wY,cW,botH);
  const nName=name.toUpperCase(), parts2=nName.split(' ');
  const first2=parts2.slice(0,-1).join(' '), last2=parts2.slice(-1)[0]||nName;
  const nY=wY+44;
  ctx.fillStyle='#111';
  if(first2){ ctx.font=`500 ${nName.length>12?38:46}px Arial`; ctx.textAlign='left'; ctx.fillText(first2+' ',cX+18,nY); ctx.font=`bold ${nName.length>12?38:46}px Arial`; ctx.fillText(last2,cX+18+ctx.measureText(first2+' ').width,nY); }
  else{ ctx.font=`bold ${nName.length>12?38:46}px Arial`; ctx.textAlign='left'; ctx.fillText(last2,cX+18,nY); }
  ctx.font='20px Arial'; ctx.fillStyle='#999'; ctx.fillText(`${bday}  |  ${height} m  |  ${weight} kg`,cX+18,nY+30);

  /* Position bar — logo icon only, sem texto BIBCAR duplicado */
  const barY=wY+52;
  ctx.fillStyle=team.c1; rrect(ctx,cX+12,barY,cW-24,50,8); ctx.fill();
  ctx.font='bold 23px Arial'; ctx.fillStyle='#fff'; ctx.textAlign='left'; ctx.fillText(`BibCar FC · ${POSITIONS_FULL[posIdx]}`,cX+24,barY+33);
  ctx.drawImage(logoImg,cX+cW-56,barY+5,40,40);

  /* Card number + abbr badge (sem emoji) */
  ctx.font='bold 18px Arial'; ctx.fillStyle='#ccc'; ctx.textAlign='left'; ctx.fillText(`#${cardNum}`,cX+20,cY+cH-10);
  rrect(ctx,cX+cW-60,cY+cH-30,54,20,5); ctx.fillStyle=accent; ctx.fill();
  ctx.font='bold 13px Arial'; ctx.fillStyle='#fff'; ctx.textAlign='center'; ctx.fillText(team.abbr,cX+cW-33,cY+cH-16);
  ctx.restore();

  /* ── Stats showcase row ── */
  const stY=cY+cH+22;
  const stH=114;
  const stBg=ctx.createLinearGradient(0,stY,0,stY+stH);
  stBg.addColorStop(0,'rgba(255,255,255,0.08)'); stBg.addColorStop(1,'rgba(255,255,255,0.02)');
  ctx.fillStyle=stBg; rrect(ctx,cX,stY,cW,stH,14); ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.1)'; ctx.lineWidth=1.5; rrect(ctx,cX,stY,cW,stH,14); ctx.stroke();
  const STAT_L=['VEL','FIN','PAC','DRI','DEF','FIS'];
  STAT_L.forEach((lbl,i)=>{
    const sx=cX+i*(cW/6)+cW/12, val=stats[i];
    ctx.font='bold 44px Arial';
    ctx.fillStyle=val>=92?'#FFDF00':val>=85?accent:'rgba(255,255,255,0.82)';
    ctx.textAlign='center'; ctx.fillText(String(val),sx,stY+64);
    ctx.font='bold 17px Arial'; ctx.fillStyle='rgba(255,255,255,0.38)'; ctx.fillText(lbl,sx,stY+88);
    if(i<5){ ctx.strokeStyle='rgba(255,255,255,0.08)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(cX+(i+1)*(cW/6),stY+18); ctx.lineTo(cX+(i+1)*(cW/6),stY+stH-18); ctx.stroke(); }
  });

  /* ── BibCar pill (layout 2 linhas — sem overlap) ── */
  const pillY=stY+stH+24;
  const pillW=420,pillH=82,pillX=(W-pillW)/2;
  const pg=ctx.createLinearGradient(pillX,pillY,pillX+pillW,pillY);
  pg.addColorStop(0,'#7F00FF'); pg.addColorStop(1,'#C13EFF');
  ctx.fillStyle=pg; rrect(ctx,pillX,pillY,pillW,pillH,41); ctx.fill();
  ctx.drawImage(logoImg,pillX+18,pillY+17,48,48);
  ctx.font='bold 36px Arial'; ctx.fillStyle='#fff'; ctx.textAlign='left'; ctx.fillText('BibCar',pillX+76,pillY+40);
  ctx.font='italic 20px Arial'; ctx.fillStyle='rgba(255,255,255,0.62)'; ctx.fillText('corridas da Copa',pillX+76,pillY+64);

  /* Website + hashtags */
  ctx.font='24px Arial'; ctx.fillStyle='rgba(255,255,255,0.22)'; ctx.textAlign='center'; ctx.fillText('bibcarbrasil.com.br',W/2,pillY+pillH+34);
  ctx.font='bold 34px Arial'; ctx.fillStyle='rgba(255,255,255,0.58)'; ctx.fillText('#Copa2026  #BibCar  #FigurinhaIA',W/2,pillY+pillH+78);

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
  const [stats]=useState(()=>Array.from({length:6},()=>rnd(78,99)));
  const [resultUrl,setResultUrl]=useState<string|null>(null);
  const [errorMsg,setErrorMsg]=useState('');
  const [fullscreen,setFullscreen]=useState(false);
  const [cachedBlob,setCachedBlob]=useState<Blob|null>(null);
  const [faceHint,setFaceHint]=useState('');
  const fileRef=useRef<HTMLInputElement>(null);
  const dataUrlRef=useRef<string>('');

  const handleFile=useCallback(async(file:File)=>{
    if(!file.type.startsWith('image/')) return;
    const {dataUrl,hint}=await prepareReferenceImage(file,1024);
    dataUrlRef.current=dataUrl; setPreviewUrl(dataUrl); setFaceHint(hint); setStage('preview');
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
      const blob=cachedBlob??await generateStoryBlob(resultUrl,team,playerName||'JOGADOR',posIdx,jerseyNum,bday,height,weight,cardNum,ovr,stats);
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

  const reset=()=>{ setStage('idle');setPreviewUrl(null);setResultUrl(null);setErrorMsg('');setFullscreen(false);setCachedBlob(null);setFaceHint('');dataUrlRef.current='';if(fileRef.current)fileRef.current.value=''; };
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
                <p style={{color:'rgba(255,255,255,0.38)',fontSize:'0.83rem',marginBottom:4}}>Selfie de frente, rosto bem iluminado = melhor resultado</p>
                <p style={{color:'rgba(255,255,255,0.25)',fontSize:'0.76rem',marginBottom:28}}>sem óculos escuros · sem filtros · câmera ou galeria</p>
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

              {faceHint&&(
                <div style={{display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14}}>
                  <span style={{
                    background:faceHint.includes('✓')?'rgba(74,222,128,0.1)':'rgba(255,223,0,0.08)',
                    border:`1px solid ${faceHint.includes('✓')?'rgba(74,222,128,0.35)':'rgba(255,223,0,0.28)'}`,
                    color:faceHint.includes('✓')?'#4ade80':'#FFDF00',
                    borderRadius:999,padding:'4px 14px',fontSize:11,fontWeight:700,letterSpacing:'0.05em'
                  }}>{faceHint}</span>
                </div>
              )}
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
              <p style={{color:'rgba(255,255,255,0.4)',fontSize:'0.85rem'}}>Gerando jogador · copiando seu rosto · ~40s</p>
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
                  <FigurinhaCard imageUrl={resultUrl} team={team} name={playerName||'JOGADOR'} posIdx={posIdx} jerseyNum={jerseyNum} bday={bday} height={height} weight={weight} ovr={ovr} stats={stats} size={290}/>
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
              <FigurinhaCard imageUrl={resultUrl} team={team} name={playerName||'JOGADOR'} posIdx={posIdx} jerseyNum={jerseyNum} bday={bday} height={height} weight={weight} ovr={ovr} stats={stats} size={Math.min(300,typeof window!=='undefined'?window.innerWidth-48:280)}/>
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
