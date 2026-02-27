const { useState, useEffect, useRef } = React;

const C = {
  phaseA: '#e74c3c', phaseB: '#3498db', phaseC: '#2ecc71',
  efield: '#f39c12', bfield: '#9b59b6', dust: '#e67e22',
  safe: '#27ae60', danger: '#e74c3c', cyan: '#00bcd4',
  bg: '#0f1923', card: '#1a2535', border: '#2c3e50',
  text: '#ecf0f1', sub: '#95a5a6',
};

const chapters = [
  { id:0, icon:'⚡', title:'What is EMF?',       subtitle:'The invisible force around power lines',  color:'#f39c12' },
  { id:1, icon:'🗼', title:'Tower & Wires',       subtitle:'How power lines are arranged',            color:'#3498db' },
  { id:2, icon:'🌊', title:'3-Phase Power',       subtitle:'Three waves working together',            color:'#2ecc71' },
  { id:3, icon:'💡', title:'Electric Field',      subtitle:'The push from voltage',                   color:'#f39c12' },
  { id:4, icon:'🧲', title:'Magnetic Field',      subtitle:'The force from current',                  color:'#9b59b6' },
  { id:5, icon:'🌡️', title:'Temperature',        subtitle:'Heat changes everything',                 color:'#e74c3c' },
  { id:6, icon:'💨', title:'Wind Effect',         subtitle:'Wires swing in the wind',                 color:'#3498db' },
  { id:7, icon:'🌫️', title:'Dust Particles',     subtitle:'Tiny particles get charged',              color:'#e67e22' },
  { id:8, icon:'💧', title:'Humidity',            subtitle:'How moisture affects the field',          color:'#00bcd4' },
  { id:9, icon:'🛡️', title:'Safety Zones',       subtitle:'Are you safe here?',                      color:'#27ae60' },
  { id:10, icon:'⚡', title:'Load Current',       subtitle:'How load changes wire glow & EMF',        color:'#e74c3c' },
];

// ── Reusable UI ───────────────────────────────────────────────────────────────
function Card({ children, style }) {
  return <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:16, marginBottom:16, ...style }}>{children}</div>;
}
function Label({ children }) {
  return <div style={{ color:C.sub, fontSize:12, marginBottom:8, letterSpacing:'0.5px' }}>{children}</div>;
}
function Slider({ label, val, set, min, max, unit, color }) {
  return (
    <div style={{ marginBottom:12 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
        <span style={{ color:C.sub, fontSize:13 }}>{label}</span>
        <span style={{ color:color||C.efield, fontWeight:'bold', fontSize:13 }}>{val}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={val} onChange={e=>set(+e.target.value)} style={{ width:'100%', accentColor:color||C.efield }}/>
    </div>
  );
}
function TipBox({ tips, color }) {
  return (
    <div style={{ background:`linear-gradient(135deg,${color||C.efield}18,${C.card})`, border:`1px solid ${color||C.efield}44`, borderRadius:10, padding:10, marginTop:10 }}>
      <div style={{ color:color||C.efield, fontWeight:'bold', fontSize:12, marginBottom:6, display:'flex', alignItems:'center', gap:6 }}>
        <span style={{ fontSize:16 }}>💡</span> Did You Know? — Quick Tips
      </div>
      {tips.map((t,i)=>(
        <div key={i} style={{ display:'flex', gap:8, padding:'5px 0', borderBottom:i<tips.length-1?`1px solid ${C.border}`:'none' }}>
          <span style={{ color:color||C.efield, fontWeight:'bold', fontSize:13, flexShrink:0 }}>›</span>
          <span style={{ color:C.sub, fontSize:12, lineHeight:1.5 }}>{t}</span>
        </div>
      ))}
    </div>
  );
}
function InfoBox({ color, children }) {
  return <div style={{ marginTop:10, padding:10, background:`${color}15`, borderRadius:8, fontSize:13, color:C.text }}>{children}</div>;
}

// ── Animated Canvases ─────────────────────────────────────────────────────────
function WaveCanvas({ time }) {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'), W=c.width, H=c.height;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=C.bg; ctx.fillRect(0,0,W,H);
    // grid
    ctx.strokeStyle='#1e2d3d'; ctx.lineWidth=1;
    for(let y=0;y<=H;y+=H/4){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
    for(let x=0;x<=W;x+=40){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    ctx.strokeStyle='#2c3e50'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(0,H/2); ctx.lineTo(W,H/2); ctx.stroke();
    // waves
    [{color:C.phaseA,phase:0},{color:C.phaseB,phase:2*Math.PI/3},{color:C.phaseC,phase:-2*Math.PI/3}].forEach(({color,phase})=>{
      ctx.beginPath(); ctx.strokeStyle=color; ctx.lineWidth=2.5;
      ctx.shadowColor=color; ctx.shadowBlur=4;
      for(let x=0;x<W;x++){
        const y=H/2-Math.sin((x/W)*4*Math.PI+time+phase)*(H/2-20);
        x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.stroke(); ctx.shadowBlur=0;
      const dotX=((time%(2*Math.PI))/(2*Math.PI))*W;
      const dotY=H/2-Math.sin(time+phase)*(H/2-20);
      ctx.beginPath(); ctx.arc(dotX<0?dotX+W:dotX,dotY,6,0,Math.PI*2);
      ctx.fillStyle=color; ctx.fill();
    });
    // sum line
    ctx.beginPath(); ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.lineWidth=1.5; ctx.setLineDash([4,4]);
    for(let x=0;x<W;x++){
      const t=(x/W)*4*Math.PI+time;
      const sum=Math.sin(t)+Math.sin(t+2*Math.PI/3)+Math.sin(t-2*Math.PI/3);
      const y=H/2-sum*(H/2-20)/3;
      x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.font='11px sans-serif';
    ctx.fillText('Sum = 0 (white dashed)',8,14);
  },[time]);
  return <canvas ref={ref} width={520} height={160} style={{borderRadius:8,width:'100%'}}/>;
}

function TowerDiagram({ time, temp=25, wind=0, load=50, voltage=200 }) {
  const ref = useRef();
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const ctx=c.getContext('2d'), W=c.width, H=c.height;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=C.bg; ctx.fillRect(0,0,W,H);
    const cx=W/2, groundY=H-40, towerTop=80, wireY=towerTop+30, spacing=90;
    const sag=18+Math.max(0,(temp-20)*0.4);
    const swing=(wind/30)*35;
    const vFactor=voltage/500;
    // ground
    ctx.fillStyle='#2d4a22'; ctx.fillRect(0,groundY,W,H-groundY);
    ctx.fillStyle='#3d6b2e'; ctx.fillRect(0,groundY,W,8);
    // tower
    ctx.strokeStyle='#7f8c8d'; ctx.lineWidth=4;
    ctx.beginPath();
    ctx.moveTo(cx-10,groundY); ctx.lineTo(cx-20,towerTop);
    ctx.moveTo(cx+10,groundY); ctx.lineTo(cx+20,towerTop);
    ctx.moveTo(cx-20,towerTop); ctx.lineTo(cx+20,towerTop);
    ctx.stroke();
    ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(cx-spacing-10,wireY); ctx.lineTo(cx+spacing+10,wireY); ctx.stroke();
    // wires
    const wireColors=[C.phaseA,C.phaseB,C.phaseC];
    const wireXs=[cx-spacing,cx,cx+spacing];
    wireXs.forEach((wx,i)=>{
      const nx=wx+swing, ny=wireY-(Math.abs(swing)*0.15);
      ctx.beginPath(); ctx.strokeStyle=wireColors[i]; ctx.lineWidth=2;
      ctx.shadowColor=wireColors[i]; ctx.shadowBlur=6;
      for(let x=nx-60;x<=nx+60;x++){
        const s=sag*Math.pow((x-nx)/60,2);
        const y=ny+s;
        x===nx-60?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.stroke(); ctx.shadowBlur=0;
      const glow=Math.abs(Math.sin(time+i*2*Math.PI/3));
      const loadFactor=load/100;
      ctx.shadowColor=wireColors[i]; ctx.shadowBlur=4+loadFactor*24;
      ctx.beginPath(); ctx.arc(nx,ny,8,0,Math.PI*2);
      ctx.fillStyle=wireColors[i]; ctx.globalAlpha=0.2+0.8*glow*loadFactor+0.2*loadFactor; ctx.fill(); ctx.globalAlpha=1; ctx.shadowBlur=0;
      ctx.strokeStyle=wireColors[i]; ctx.lineWidth=2; ctx.stroke();
      ctx.fillStyle=wireColors[i]; ctx.font='bold 12px sans-serif'; ctx.textAlign='center';
      ctx.fillText(['A','B','C'][i],nx,ny-16);
      // E-field radial glow driven by voltage
      if(vFactor>0.05){
        const eRadius=18+vFactor*55;
        const eGrad=ctx.createRadialGradient(nx,ny,4,nx,ny,eRadius);
        eGrad.addColorStop(0,'rgba(243,156,18,'+(0.15+vFactor*0.5).toFixed(2)+')');
        eGrad.addColorStop(1,'rgba(243,156,18,0)');
        ctx.globalCompositeOperation='lighter';
        ctx.beginPath(); ctx.arc(nx,ny,eRadius,0,Math.PI*2);
        ctx.fillStyle=eGrad; ctx.fill();
        ctx.globalCompositeOperation='source-over';
      }
    });
    // height annotation
    ctx.strokeStyle='#f39c12'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(cx+spacing+40,wireY); ctx.lineTo(cx+spacing+40,groundY); ctx.stroke();
    ctx.fillStyle='#f39c12'; ctx.font='11px sans-serif'; ctx.textAlign='center';
    ctx.fillText('Height H',cx+spacing+62,(wireY+groundY)/2);
    // person
    ctx.fillStyle='#ecf0f1';
    ctx.beginPath(); ctx.arc(cx-160,groundY-20,8,0,Math.PI*2); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx-160,groundY-12); ctx.lineTo(cx-160,groundY-2);
    ctx.moveTo(cx-168,groundY-8); ctx.lineTo(cx-152,groundY-8);
    ctx.strokeStyle='#ecf0f1'; ctx.lineWidth=2; ctx.stroke();
    ctx.fillStyle='#ecf0f1'; ctx.font='10px sans-serif'; ctx.textAlign='center';
    ctx.fillText('You',cx-160,groundY+12);
    // wind arrows
    if(wind>0){
      ctx.strokeStyle='#3498db'; ctx.lineWidth=2;
      for(let i=0;i<4;i++){
        const ax=20+i*18, ay=100+i*12;
        ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(ax+35,ay); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ax+35,ay); ctx.lineTo(ax+27,ay-5); ctx.lineTo(ax+27,ay+5); ctx.closePath();
        ctx.fillStyle='#3498db'; ctx.fill();
      }
    }
    // E-field lines from wires to ground (voltage-driven)
    ctx.lineWidth=1;
    wireXs.forEach((wx,i)=>{
      const nx=wx+swing;
      for(let j=-2;j<=2;j++){
        ctx.strokeStyle='rgba(243,156,18,'+(0.04+vFactor*0.14).toFixed(2)+')';
        ctx.beginPath(); ctx.moveTo(nx+j*8,wireY+15);
        ctx.quadraticCurveTo(nx+j*18,(wireY+groundY)/2,nx+j*24,groundY); ctx.stroke();
      }
    });
    // voltage label
    ctx.fillStyle='#f39c12'; ctx.font='bold 11px sans-serif'; ctx.textAlign='left';
    ctx.fillText(voltage+' kV',10,20);
    ctx.fillStyle=C.sub; ctx.font='11px sans-serif';
    ctx.fillText('Load: '+load+'%',10,34);
    ctx.textAlign='left';
  },[time,temp,wind,load,voltage]);
  return <canvas ref={ref} width={520} height={280} style={{borderRadius:8,width:'100%'}}/>;
}

// ── Load + Voltage Field Canvas ──────────────────────────────────────────────
function LoadFieldCanvas({ time, load, voltage }) {
  const ref = useRef();
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const ctx=c.getContext('2d'), W=c.width, H=c.height;
    ctx.clearRect(0,0,W,H); ctx.fillStyle=C.bg; ctx.fillRect(0,0,W,H);
    const loadF=load/100, vF=voltage/500;
    const cx=W/2, groundY=H-30, wireY=40, spacing=110;
    const wireXs=[cx-spacing,cx,cx+spacing];
    const wireColors=[C.phaseA,C.phaseB,C.phaseC];
    // ground
    ctx.fillStyle='#2d4a22'; ctx.fillRect(0,groundY,W,H-groundY);
    // E-field lines (voltage-driven)
    wireXs.forEach((wx)=>{
      for(let j=-3;j<=3;j++){
        const alpha=0.06+vF*0.18;
        ctx.strokeStyle='rgba(243,156,18,'+alpha.toFixed(2)+')';
        ctx.lineWidth=1+vF*1.5;
        ctx.beginPath(); ctx.moveTo(wx+j*6,wireY+12);
        ctx.quadraticCurveTo(wx+j*20,(wireY+groundY)/2,wx+j*32,groundY);
        ctx.stroke();
      }
    });
    // B-field concentric rings (load-driven)
    wireXs.forEach((wx,i)=>{
      const phase=Math.sin(time+i*2*Math.PI/3);
      const bStr=loadF*Math.abs(phase);
      for(let r=1;r<=5;r++){
        const radius=14+r*16;
        ctx.beginPath(); ctx.arc(wx,wireY,radius,0,Math.PI*2);
        ctx.strokeStyle='rgba(155,89,182,'+(bStr*(0.35-r*0.05)).toFixed(2)+')';
        ctx.lineWidth=2; ctx.stroke();
      }
    });
    // wires
    wireXs.forEach((wx,i)=>{
      // E-field glow (voltage)
      const eR=14+vF*50;
      const eG=ctx.createRadialGradient(wx,wireY,4,wx,wireY,eR);
      eG.addColorStop(0,'rgba(243,156,18,'+(0.2+vF*0.55).toFixed(2)+')');
      eG.addColorStop(1,'rgba(243,156,18,0)');
      ctx.globalCompositeOperation='lighter';
      ctx.beginPath(); ctx.arc(wx,wireY,eR,0,Math.PI*2); ctx.fillStyle=eG; ctx.fill();
      ctx.globalCompositeOperation='source-over';
      // B-field glow (load)
      const bR=10+loadF*40;
      const bG=ctx.createRadialGradient(wx,wireY,4,wx,wireY,bR);
      bG.addColorStop(0,'rgba(155,89,182,'+(0.15+loadF*0.5).toFixed(2)+')');
      bG.addColorStop(1,'rgba(155,89,182,0)');
      ctx.globalCompositeOperation='lighter';
      ctx.beginPath(); ctx.arc(wx,wireY,bR,0,Math.PI*2); ctx.fillStyle=bG; ctx.fill();
      ctx.globalCompositeOperation='source-over';
      // wire dot
      const glow=Math.abs(Math.sin(time+i*2*Math.PI/3));
      ctx.beginPath(); ctx.arc(wx,wireY,8,0,Math.PI*2);
      ctx.shadowColor=wireColors[i]; ctx.shadowBlur=6+loadF*20;
      ctx.fillStyle=wireColors[i]; ctx.globalAlpha=0.3+0.7*glow*loadF+0.15*vF; ctx.fill();
      ctx.globalAlpha=1; ctx.shadowBlur=0;
      ctx.strokeStyle=wireColors[i]; ctx.lineWidth=2; ctx.stroke();
      ctx.fillStyle=wireColors[i]; ctx.font='bold 11px sans-serif'; ctx.textAlign='center';
      ctx.fillText(['A','B','C'][i],wx,wireY-14);
    });
    // measurement bars at ground
    const barY=groundY+6, barH=16;
    // E-field bar
    ctx.fillStyle='rgba(243,156,18,0.15)'; ctx.fillRect(8,barY,W/2-16,barH);
    ctx.fillStyle='#f39c12'; ctx.fillRect(8,barY,(W/2-16)*vF,barH);
    ctx.fillStyle='#fff'; ctx.font='bold 10px sans-serif'; ctx.textAlign='left';
    ctx.fillText('E: '+voltage+' kV',12,barY+12);
    // B-field bar
    ctx.fillStyle='rgba(155,89,182,0.15)'; ctx.fillRect(W/2+8,barY,W/2-16,barH);
    ctx.fillStyle='#9b59b6'; ctx.fillRect(W/2+8,barY,(W/2-16)*loadF,barH);
    ctx.fillStyle='#fff'; ctx.textAlign='left';
    ctx.fillText('B: '+load+'% load',W/2+12,barY+12);
    // legend
    ctx.textAlign='left'; ctx.font='11px sans-serif';
    ctx.fillStyle='#f39c12'; ctx.fillText('\u2501 E-field (voltage-driven)',8,H-4);
    ctx.fillStyle='#9b59b6'; ctx.fillText('\u25CB B-field (load-driven)',W/2+8,H-4);
  },[time,load,voltage]);
  return <canvas ref={ref} width={520} height={300} style={{borderRadius:8,width:'100%'}}/>;
}

function FieldHeatmap({ type, time }) {
  const ref = useRef();
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const ctx=c.getContext('2d'), W=c.width, H=c.height;
    const img=ctx.createImageData(W,H);
    const wireXs=[W*0.3,W*0.5,W*0.7], wireY=H*0.15;
    const phases=[0,2*Math.PI/3,-2*Math.PI/3];
    for(let py=0;py<H;py++) for(let px=0;px<W;px++){
      let vx=0, vy=0;
      wireXs.forEach((wx,i)=>{
        const dx=px-wx, dy=py-wireY;
        const r2=dx*dx+dy*dy+20;
        const phaseVal=Math.sin(time+phases[i]);
        if(type==='electric'){ vx += phaseVal*dx/r2; vy += phaseVal*dy/r2; }
        else { vx -= phaseVal*dy/r2; vy += phaseVal*dx/r2; }
      });
      const mag=Math.sqrt(vx*vx+vy*vy);
      const norm=Math.min(mag*80,1);
      const idx=(py*W+px)*4;
      if(type==='electric'){ img.data[idx]=Math.floor(255*norm); img.data[idx+1]=Math.floor(120*norm); img.data[idx+2]=0; }
      else { img.data[idx]=Math.floor(120*norm); img.data[idx+1]=0; img.data[idx+2]=Math.floor(255*norm); }
      img.data[idx+3]=220;
    }
    ctx.putImageData(img,0,0);
    wireXs.forEach((wx,i)=>{
      const colors=[C.phaseA,C.phaseB,C.phaseC];
      ctx.beginPath(); ctx.arc(wx,wireY,8,0,Math.PI*2); ctx.fillStyle=colors[i]; ctx.fill();
    });
    ctx.fillStyle='#2d4a22'; ctx.fillRect(0,H-20,W,20);
    ctx.fillStyle='#ecf0f1'; ctx.font='11px sans-serif'; ctx.fillText('Ground',8,H-6);
    ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(W-120,8,112,36);
    ctx.fillStyle=type==='electric'?'#f39c12':'#9b59b6'; ctx.fillRect(W-116,14,14,14);
    ctx.fillStyle='#ecf0f1'; ctx.font='11px sans-serif';
    ctx.fillText(type==='electric'?'Strong E-field':'Strong B-field',W-98,25);
    ctx.fillStyle='#333'; ctx.fillRect(W-116,30,14,8);
    ctx.fillStyle='#ecf0f1'; ctx.fillText('Weak field',W-98,40);
  },[time,type]);
  return <canvas ref={ref} width={520} height={220} style={{borderRadius:8,width:'100%'}}/>;
}

function DustCanvas({ time }) {
  const ref = useRef();
  const particles = useRef(Array.from({length:30},()=>({
    x:80+Math.random()*360, y:180+Math.random()*60,
    vx:(Math.random()-0.5)*0.5, vy:-Math.random()*0.8,
    r:2+Math.random()*3, charge:Math.random(),
  })));
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const ctx=c.getContext('2d'), W=c.width, H=c.height;
    ctx.clearRect(0,0,W,H); ctx.fillStyle=C.bg; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#2d4a22'; ctx.fillRect(0,H-30,W,30);
    const wireXs=[W*0.3,W*0.5,W*0.7], wireY=50;
    const wireColors=[C.phaseA,C.phaseB,C.phaseC];
    wireXs.forEach((wx,i)=>{
      ctx.beginPath(); ctx.arc(wx,wireY,8,0,Math.PI*2);
      ctx.fillStyle=wireColors[i]; ctx.shadowColor=wireColors[i]; ctx.shadowBlur=10; ctx.fill(); ctx.shadowBlur=0;
    });
    ctx.strokeStyle='rgba(243,156,18,0.15)'; ctx.lineWidth=1;
    for(let i=0;i<8;i++){
      const wx=wireXs[1];
      ctx.beginPath(); ctx.moveTo(wx,wireY+8);
      ctx.quadraticCurveTo(wx+(i-3.5)*30,H/2,wx+(i-3.5)*50,H-30); ctx.stroke();
    }
    particles.current.forEach(p=>{
      let fx=0, fy=0;
      wireXs.forEach(wx=>{
        const dx=wx-p.x, dy=wireY-p.y, dist=Math.sqrt(dx*dx+dy*dy);
        if(dist>20){ fx+=(dx/dist)*p.charge*0.3; fy+=(dy/dist)*p.charge*0.3; }
      });
      p.vx+=fx*0.05; p.vy+=fy*0.05-0.02; p.vx*=0.98; p.vy*=0.98; p.x+=p.vx; p.y+=p.vy;
      if(p.y<wireY+10||p.y>H-30||p.x<0||p.x>W){
        p.x=80+Math.random()*360; p.y=H-35; p.vx=(Math.random()-0.5)*0.5; p.vy=-Math.random()*0.5;
      }
      const col=p.charge>0.7?C.danger:p.charge>0.4?'#f39c12':C.sub;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=col; ctx.globalAlpha=0.8; ctx.fill(); ctx.globalAlpha=1;
    });
    ctx.font='11px sans-serif';
    ctx.fillStyle=C.danger; ctx.fillText('● Highly charged',8,20);
    ctx.fillStyle='#f39c12'; ctx.fillText('● Moderately charged',8,35);
    ctx.fillStyle=C.sub; ctx.fillText('● Low charge',8,50);
  },[time]);
  return <canvas ref={ref} width={520} height={240} style={{borderRadius:8,width:'100%'}}/>;
}

function HumidityCanvas({ humidity, load=50 }) {
  const ref = useRef();
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const ctx=c.getContext('2d'), W=c.width, H=c.height;
    const haze=humidity/100;
    const loadFactor=load/100;
    const drops=Array.from({length:Math.floor(humidity*0.6+10)},()=>({
      x:Math.random()*W, y:Math.random()*H, vy:1.5+Math.random()*2, r:Math.random()*2+1, alpha:0.3+Math.random()*0.5,
    }));
    const animRef={current:null};
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      // sky gradient
      const sky=ctx.createLinearGradient(0,0,0,H);
      sky.addColorStop(0,'#0f1923');
      sky.addColorStop(1,`rgb(${Math.round(27+haze*40)},${Math.round(42+haze*50)},${Math.round(58+haze*60)})`);
      ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);
      ctx.fillStyle=`rgba(100,160,200,${haze*0.15})`; ctx.fillRect(0,0,W,H);
      // ground
      ctx.fillStyle='#2d4a22'; ctx.fillRect(0,H-28,W,28);
      ctx.fillStyle='#3d6b2e'; ctx.fillRect(0,H-28,W,6);

      // ── transmission tower ──────────────────────────────────
      const cx=W/2, groundY=H-28;
      const towerTop=28, crossArmY=50;
      const spacing=100;
      // tower legs
      ctx.strokeStyle='#7f8c8d'; ctx.lineWidth=4; ctx.lineCap='round';
      ctx.beginPath();
      ctx.moveTo(cx-8,groundY); ctx.lineTo(cx-16,towerTop);
      ctx.moveTo(cx+8,groundY); ctx.lineTo(cx+16,towerTop);
      // tower top cap
      ctx.moveTo(cx-16,towerTop); ctx.lineTo(cx+16,towerTop);
      ctx.stroke();
      // cross arm
      ctx.lineWidth=3;
      ctx.beginPath(); ctx.moveTo(cx-spacing-8,crossArmY); ctx.lineTo(cx+spacing+8,crossArmY); ctx.stroke();
      // diagonal braces on tower
      ctx.lineWidth=2;
      ctx.beginPath();
      ctx.moveTo(cx-8,groundY-20); ctx.lineTo(cx-16,towerTop+20);
      ctx.moveTo(cx+8,groundY-20); ctx.lineTo(cx+16,towerTop+20);
      ctx.stroke();

      // ── wires with catenary sag ──────────────────────────────
      const wireColors=[C.phaseA,C.phaseB,C.phaseC];
      const wireXs=[cx-spacing, cx, cx+spacing];
      const wireY=crossArmY;
      const sag=14;
      wireXs.forEach((wx,i)=>{
        // insulator (short vertical line from crossarm to wire start)
        ctx.strokeStyle='#aaa'; ctx.lineWidth=2;
        ctx.beginPath(); ctx.moveTo(wx,crossArmY); ctx.lineTo(wx,crossArmY+8); ctx.stroke();
        // catenary wire
        ctx.beginPath();
        ctx.strokeStyle=wireColors[i]; ctx.lineWidth=2.5;
        const glowBlur=4+loadFactor*26;
        ctx.shadowColor=wireColors[i]; ctx.shadowBlur=glowBlur;
        for(let x=wx-75;x<=wx+75;x+=3){
          const frac=(x-wx)/75;
          const y=wireY+8+sag*frac*frac;
          x===wx-75?ctx.moveTo(x,y):ctx.lineTo(x,y);
        }
        ctx.stroke(); ctx.shadowBlur=0;
        // wire attachment circle
        ctx.beginPath(); ctx.arc(wx,wireY+8,6,0,Math.PI*2);
        ctx.fillStyle=wireColors[i]; ctx.fill();
        ctx.fillStyle=wireColors[i]; ctx.font='bold 11px sans-serif'; ctx.textAlign='center';
        ctx.fillText(['A','B','C'][i],wx,wireY-2);
        // ── corona glow (humidity driven, load amplified) ──────
        if(humidity>35){
          const coronaStr=haze*(0.4+0.6*loadFactor);
          const arc=ctx.createRadialGradient(wx,wireY+8,4,wx,wireY+8,24+coronaStr*50);
          arc.addColorStop(0,`rgba(155,89,182,${Math.min(coronaStr*0.65,0.85)})`);
          arc.addColorStop(1,'rgba(155,89,182,0)');
          ctx.globalCompositeOperation='lighter';
          ctx.fillStyle=arc; ctx.beginPath(); ctx.arc(wx,wireY+8,24+coronaStr*50,0,Math.PI*2); ctx.fill();
          ctx.globalCompositeOperation='source-over';
        }
        if(humidity>60){
          const arc2=ctx.createRadialGradient(wx,wireY+8,4,wx,wireY+8,16+(haze-0.6)*40*loadFactor);
          arc2.addColorStop(0,`rgba(0,188,212,${(haze-0.6)*0.55*loadFactor})`);
          arc2.addColorStop(1,'rgba(0,188,212,0)');
          ctx.fillStyle=arc2; ctx.beginPath(); ctx.arc(wx,wireY+8,16+(haze-0.6)*40*loadFactor,0,Math.PI*2); ctx.fill();
        }
      });
      ctx.textAlign='left'; ctx.lineCap='butt';

      // ── electric field lines ─────────────────────────────────
      ctx.strokeStyle=`rgba(243,156,18,${0.04+loadFactor*0.11})`; ctx.lineWidth=1;
      for(let i=0;i<7;i++){
        const fx=cx+(i-3)*44;
        ctx.beginPath(); ctx.moveTo(fx,wireY+22);
        ctx.quadraticCurveTo(fx+(i-3)*12,H/2,fx+(i-3)*22,H-28); ctx.stroke();
      }

      // ── rain drops ──────────────────────────────────────────
      drops.forEach(d=>{
        d.y+=d.vy; if(d.y>H){ d.y=0; d.x=Math.random()*W; }
        ctx.beginPath(); ctx.moveTo(d.x,d.y); ctx.lineTo(d.x-1,d.y+d.r*4);
        ctx.strokeStyle=`rgba(100,180,220,${d.alpha*(humidity/100)})`; ctx.lineWidth=1.2; ctx.stroke();
      });

      // ── labels ──────────────────────────────────────────────
      ctx.fillStyle='#00bcd4'; ctx.font='bold 12px sans-serif';
      ctx.fillText(`Humidity: ${humidity}%`,8,16);
      ctx.fillStyle='#e74c3c';
      ctx.fillText(`Load: ${load}%`,8,30);
      ctx.fillStyle=C.sub; ctx.font='11px sans-serif';
      ctx.fillText(humidity<40?'Dry — low leakage/corona':humidity<70?'Moderate — some corona noise':'High — intense corona + leakage',8,44);
      animRef.current=requestAnimationFrame(draw);
    };
    draw();
    return ()=>cancelAnimationFrame(animRef.current);
  },[humidity,load]);
  return <canvas ref={ref} width={520} height={280} style={{borderRadius:8,width:'100%'}}/>;
}

function SafetyMeter({ distance }) {
  const maxDist=100, dangerZone=15, cautionZone=40;
  const pct=distance/maxDist;
  const isDanger=distance<=dangerZone, isCaution=distance>dangerZone&&distance<=cautionZone;
  const color=isDanger?C.danger:isCaution?'#f39c12':C.safe;
  const label=isDanger?'🚨 DANGER ZONE':isCaution?'⚠️ CAUTION ZONE':'✅ SAFE ZONE';
  const desc=isDanger?'EMF levels exceed safety limits. Do not stay here!':isCaution?'EMF levels are elevated. Limit time spent here.':'EMF levels are within safe limits. All good!';
  return (
    <div style={{padding:16}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
        <span style={{color:C.sub,fontSize:13}}>Distance: <b style={{color:C.text}}>{distance}m</b></span>
        <span style={{color,fontWeight:'bold',fontSize:14}}>{label}</span>
      </div>
      <div style={{position:'relative',height:28,borderRadius:14,overflow:'hidden',background:'#0f1923',border:'1px solid #2c3e50'}}>
        <div style={{position:'absolute',left:0,top:0,height:'100%',width:`${(dangerZone/maxDist)*100}%`,background:'rgba(231,76,60,0.4)'}}/>
        <div style={{position:'absolute',left:`${(dangerZone/maxDist)*100}%`,top:0,height:'100%',width:`${((cautionZone-dangerZone)/maxDist)*100}%`,background:'rgba(243,156,18,0.3)'}}/>
        <div style={{position:'absolute',left:`${(cautionZone/maxDist)*100}%`,top:0,height:'100%',width:`${((maxDist-cautionZone)/maxDist)*100}%`,background:'rgba(39,174,96,0.3)'}}/>
        <div style={{position:'absolute',left:`${pct*100}%`,top:0,width:4,height:'100%',background:color,transform:'translateX(-50%)',borderRadius:2}}/>
        <div style={{position:'absolute',left:`${pct*100}%`,top:'50%',transform:'translate(-50%,-50%)',width:18,height:18,borderRadius:'50%',background:color,border:'2px solid white'}}/>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:4,fontSize:11,color:C.sub}}>
        <span style={{color:C.danger}}>0m Danger</span>
        <span style={{color:'#f39c12'}}>15m Caution</span>
        <span style={{color:C.safe}}>40m+ Safe</span>
        <span>100m</span>
      </div>
      <div style={{marginTop:12,padding:12,borderRadius:8,background:`${color}22`,border:`1px solid ${color}55`,color:C.text,fontSize:13}}>{desc}</div>
      <div style={{marginTop:12}}>
        {[
          {label:'Electric Field',value:Math.max(0, 1 / (1 + Math.pow(distance/15, 2))),color:'#f39c12',limit:'Limit: 5.0 kV/m'},
          {label:'Magnetic Field',value:Math.max(0, 1 / (1 + Math.pow(distance/20, 2))),color:'#9b59b6',limit:'Limit: 200 µT'},
        ].map(({label,value,color:col,limit})=>(
          <div key={label} style={{marginBottom:8}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:3}}>
              <span style={{color:C.sub}}>{label}</span>
              <span style={{color:C.sub}}>{limit}</span>
            </div>
            <div style={{height:10,borderRadius:5,background:'#0f1923',overflow:'hidden'}}>
              <div style={{height:'100%',width:`${value*100}%`,background:col,borderRadius:5,transition:'width 0.3s'}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// SVG-based visuals (crisp, no canvas needed)
function TempEffect({ temp }) {
  const sag = 12 + ((temp - 20) / 60) * 28;
  const height = Math.max(20, 80 - sag); // 68 at 20C, 40 at 80C
  const isHot = temp > 50;
  const color = isHot ? C.danger : temp > 35 ? '#f39c12' : C.safe;
  
  // As height decreases, ground level fields increase significantly! (Inverse squareish relation)
  const baseHeight = 68;
  const relativeFieldStrength = Math.pow(baseHeight / height, 1.5); // 1.0x at 20C -> ~2.2x at 80C

  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox="0 0 520 220" style={{ width: '100%', borderRadius: 8, background: C.bg }}>
        {/* Heat haze effect when hot */}
        {isHot && (
          <g opacity={(temp - 50) / 30}>
            {Array.from({ length: 8 }).map((_, i) => (
              <path key={`heat-${i}`} d={`M${40 + i * 60},170 Q${50 + i * 60 + Math.sin(temp) * 10},120 ${40 + i * 60},70`} fill="none" stroke="#e74c3c" strokeWidth="2" opacity="0.3" strokeDasharray="5,5" />
            ))}
          </g>
        )}

        <rect x="0" y="170" width="520" height="50" fill="#2d4a22" />
        <line x1="260" y1="170" x2="250" y2="40" stroke="#7f8c8d" strokeWidth="4" />
        <line x1="260" y1="170" x2="270" y2="40" stroke="#7f8c8d" strokeWidth="4" />
        <line x1="250" y1="40" x2="270" y2="40" stroke="#7f8c8d" strokeWidth="4" />
        <line x1="150" y1="60" x2="370" y2="60" stroke="#7f8c8d" strokeWidth="3" />
        
        {/* Wires */}
        {[150, 260, 370].map((wx, i) => {
          const colors = [C.phaseA, C.phaseB, C.phaseC];
          const pts = [];
          for (let x = wx - 55; x <= wx + 55; x += 5) {
            pts.push(`${x},${60 + sag * Math.pow((x - wx) / 55, 2)}`);
          }
          const lowY = 60 + sag;
          return (
            <g key={i}>
              <polyline points={pts.join(' ')} fill="none" stroke={colors[i]} strokeWidth="2.5" />
              <circle cx={wx} cy={60} r="7" fill={colors[i]} />
              
              {/* E-Field concentration around the lowest point of the sagging wire */}
              <circle cx={wx} cy={lowY} r={10 + relativeFieldStrength * 8} fill="#f39c12" opacity={0.1 + (temp-20)*0.005} />
            </g>
          );
        })}
        
        {/* Distance measurement */}
        <line x1="420" y1={60 + sag} x2="420" y2="170" stroke={color} strokeWidth="1.5" strokeDasharray="4,2" />
        <text x="435" y={(60 + sag + 170) / 2} fill={color} fontSize="12" dominantBaseline="middle" fontWeight="bold">H={Math.round(height)}m</text>
        <text x="260" y={60 + sag + 20} fill={color} fontSize="11" textAnchor="middle">Sag: {Math.round(sag)}m</text>
        
        <text x="10" y="20" fill={color} fontSize="13" fontWeight="bold">Temp: {temp}°C</text>
        <text x="10" y="38" fill={C.sub} fontSize="11">{isHot ? 'Hot — higher corona risk & low ground clearance' : 'Cool — optimal clearance, normal permittivity'}</text>

        {/* Meters at ground level */}
        <rect x="20" y="178" width="160" height="12" rx="6" fill="#0f1923" stroke="#f39c1233" />
        <rect x="21" y="179" width={Math.min(158, 40 * relativeFieldStrength)} height="10" rx="5" fill="#f39c12" />
        <text x="190" y="188" fill="#f39c12" fontSize="10" fontWeight="bold">Ground E-Field ({(relativeFieldStrength).toFixed(1)}x)</text>

        <rect x="20" y="196" width="160" height="12" rx="6" fill="#0f1923" stroke="#9b59b633" />
        <rect x="21" y="197" width={Math.min(158, 40 * relativeFieldStrength)} height="10" rx="5" fill="#9b59b6" />
        <text x="190" y="206" fill="#9b59b6" fontSize="10" fontWeight="bold">Ground B-Field ({(relativeFieldStrength).toFixed(1)}x)</text>
      </svg>
    </div>
  );
}

function WindEffect({ wind }) {
  const swing=(wind/30)*35;
  return (
    <svg viewBox="0 0 520 200" style={{width:'100%',borderRadius:8,background:C.bg}}>
      <rect x="0" y="170" width="520" height="30" fill="#2d4a22"/>
      <line x1="260" y1="170" x2="250" y2="40" stroke="#7f8c8d" strokeWidth="4"/>
      <line x1="260" y1="170" x2="270" y2="40" stroke="#7f8c8d" strokeWidth="4"/>
      <line x1="250" y1="40" x2="270" y2="40" stroke="#7f8c8d" strokeWidth="4"/>
      <line x1="150" y1="60" x2="370" y2="60" stroke="#7f8c8d" strokeWidth="3"/>
      {wind>0&&Array.from({length:5},(_,i)=>(
        <g key={i}>
          <line x1={20+i*20} y1={80+i*15} x2={60+i*20} y2={80+i*15} stroke="#3498db" strokeWidth="2"/>
          <polygon points={`${60+i*20},${80+i*15} ${52+i*20},${76+i*15} ${52+i*20},${84+i*15}`} fill="#3498db"/>
        </g>
      ))}
      {[150,260,370].map((wx,i)=>{
        const colors=[C.phaseA,C.phaseB,C.phaseC];
        const nx=wx+swing, ny=60-(Math.abs(swing)*0.15);
        return (<g key={i}>
          <circle cx={wx} cy={60} r="7" fill={colors[i]} opacity="0.2"/>
          <line x1={wx} y1={60} x2={nx} y2={ny} stroke={colors[i]} strokeWidth="2" strokeDasharray="4,3"/>
          <circle cx={nx} cy={ny} r="7" fill={colors[i]}/>
        </g>);
      })}
      <text x="10" y="20" fill="#3498db" fontSize="13" fontWeight="bold">Wind: {wind} m/s</text>
      <text x="10" y="38" fill={C.sub} fontSize="11">{wind>20?'Strong wind — wires swing far!':wind>10?'Moderate wind — noticeable swing':'Light wind — small displacement'}</text>
      <text x="10" y="55" fill={C.sub} fontSize="11">Swing: {Math.round(swing)}m sideways</text>
    </svg>
  );
}

// ── Chapter Content ───────────────────────────────────────────────────────────
function ChapterContent({ id, time, temp, setTemp, wind, setWind, humidity, setHumidity, distance, setDistance, fieldType, setFieldType, load, setLoad, voltage, setVoltage }) {

  if(id===0) return (
    <div>
      <Card>
        <div style={{fontSize:15,color:C.text,lineHeight:1.7,marginBottom:12}}>
          <b style={{color:'#f39c12'}}>EMF (Electromagnetic Field)</b> is an invisible force that surrounds any wire carrying electricity — just like how a magnet has an invisible pull around it.
        </div>
        <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
          {[{icon:'💡',label:'Electric Field',desc:'Created by voltage (like pressure in a pipe)',color:'#f39c12'},{icon:'🧲',label:'Magnetic Field',desc:'Created by current (like water flowing)',color:'#9b59b6'}].map(({icon,label,desc,color})=>(
            <div key={label} style={{flex:1,minWidth:180,background:`${color}11`,border:`1px solid ${color}44`,borderRadius:10,padding:12}}>
              <div style={{fontSize:28,marginBottom:6}}>{icon}</div>
              <div style={{color,fontWeight:'bold',marginBottom:4}}>{label}</div>
              <div style={{color:C.sub,fontSize:13}}>{desc}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <Label>🎯 REAL-WORLD ANALOGY</Label>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          {[{icon:'🚿',text:'Voltage = Water pressure in a pipe'},{icon:'💧',text:'Current = Water actually flowing'},{icon:'📡',text:'EMF = The invisible ripple around the pipe'},{icon:'📏',text:'Distance = Your protection — farther is safer'}].map(({icon,text})=>(
            <div key={text} style={{flex:1,minWidth:160,background:'#ffffff08',borderRadius:8,padding:'8px 12px',fontSize:13,color:C.text}}>
              <span style={{fontSize:20,marginRight:8}}>{icon}</span>{text}
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <Label>📊 KEY FACTS AT A GLANCE</Label>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {[{val:'50 Hz',label:'Power frequency',color:'#3498db'},{val:'5.0 kV/m',label:'E-field safety limit',color:'#f39c12'},{val:'200 µT',label:'B-field safety limit',color:'#9b59b6'},{val:'40+ m',label:'Recommended distance',color:'#27ae60'}].map(({val,label,color})=>(
            <div key={label} style={{flex:1,minWidth:100,textAlign:'center',background:`${color}15`,border:`1px solid ${color}44`,borderRadius:10,padding:'10px 6px'}}>
              <div style={{color,fontSize:18,fontWeight:'bold'}}>{val}</div>
              <div style={{color:C.sub,fontSize:11,marginTop:4}}>{label}</div>
            </div>
          ))}
        </div>
      </Card>
      <TipBox color="#f39c12" tips={['EMF is not the same as radiation — it is a low-frequency field, very different from X-rays or gamma rays.','Your home appliances also produce EMF, but at much lower levels than transmission lines.','The Earth itself has a natural magnetic field — power lines add a tiny amount on top of it.','Turning off appliances at the wall reduces E-field exposure inside your home.']}/>
    </div>
  );

  if(id===1) return (
    <div>
      <Card>
        <Label>🗼 LIVE TOWER VIEW — glow intensity shows current load</Label>
        <Slider label="Load Current" val={load} set={setLoad} min={0} max={100} unit="%" color="#9b59b6"/>
        <TowerDiagram time={time} temp={temp} wind={wind} load={load}/>
      </Card>
      <Card>
        <Label>📖 WHAT YOU'RE SEEING</Label>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          {[{color:C.phaseA,label:'Phase A (Red)',desc:'First wire — leads the cycle'},{color:C.phaseB,label:'Phase B (Blue)',desc:'Second wire — 1/3 cycle behind'},{color:C.phaseC,label:'Phase C (Green)',desc:'Third wire — 2/3 cycle behind'}].map(({color,label,desc})=>(
            <div key={label} style={{flex:1,minWidth:140,borderLeft:`3px solid ${color}`,paddingLeft:10}}>
              <div style={{color,fontWeight:'bold',fontSize:13}}>{label}</div>
              <div style={{color:C.sub,fontSize:12}}>{desc}</div>
            </div>
          ))}
        </div>
        <InfoBox color="#f39c12"><b style={{color:'#f39c12'}}>Catenary Sag:</b> Wires don't hang straight — they curve downward due to gravity, like a skipping rope held at both ends.</InfoBox>
      </Card>
      <TipBox color="#3498db" tips={['Towers are typically 30–60 m tall — taller towers mean wires are farther from the ground.','The wires are not touching the tower — they hang from insulators to prevent electricity from flowing into the steel.','Ground wires at the very top protect against lightning strikes.','Wire sag is intentional — it allows for thermal expansion on hot days without snapping.']}/>
    </div>
  );

  if(id===2) return (
    <div>
      <Card>
        <Label>🌊 LIVE 3-PHASE WAVES — watch the dots ride the waves</Label>
        <WaveCanvas time={time}/>
      </Card>
      <Card>
        <Label>🧠 SIMPLE EXPLANATION</Label>
        <div style={{fontSize:14,color:C.text,lineHeight:1.8}}>Imagine three people on swings, each starting their swing at a different time. They're all swinging at the same speed, but they're never at the same point at the same time.</div>
        <div style={{marginTop:12,display:'flex',gap:8,flexWrap:'wrap'}}>
          {[{icon:'🔴',label:'Phase A',val:`${(Math.sin(time)*100).toFixed(0)}%`,color:C.phaseA},{icon:'🔵',label:'Phase B',val:`${(Math.sin(time+2*Math.PI/3)*100).toFixed(0)}%`,color:C.phaseB},{icon:'🟢',label:'Phase C',val:`${(Math.sin(time-2*Math.PI/3)*100).toFixed(0)}%`,color:C.phaseC}].map(({icon,label,val,color})=>(
            <div key={label} style={{flex:1,minWidth:100,textAlign:'center',background:`${color}15`,borderRadius:10,padding:10}}>
              <div style={{fontSize:22}}>{icon}</div>
              <div style={{color,fontWeight:'bold'}}>{label}</div>
              <div style={{color:C.text,fontSize:18,fontWeight:'bold'}}>{val}</div>
            </div>
          ))}
        </div>
        <InfoBox color="#27ae60"><b style={{color:'#27ae60'}}>Magic fact:</b> The three waves always cancel each other out perfectly — their sum is always zero! This is why 3-phase power is so efficient.</InfoBox>
      </Card>
      <TipBox color="#2ecc71" tips={['If all 3 phases were in sync, the combined field would be 3× stronger — the 120° offset reduces the total field.','The frequency is 50 Hz in most of the world (60 Hz in USA/Canada) — that means 50 full cycles per second.','A perfectly balanced 3-phase system produces zero net magnetic field at a distance — real lines are never perfectly balanced.','This is why some spots under a line have stronger fields than others — phase imbalance!']}/>
    </div>
  );

  if(id===3) return (
    <div>
      <Card>
        <Label>💡 ELECTRIC FIELD MAP — Brighter = stronger electric field</Label>
        <FieldHeatmap type="electric" time={time}/>
      </Card>
      <Card>
        <Label>📖 HOW TO READ THIS MAP</Label>
        <div style={{fontSize:14,color:C.text,lineHeight:1.8}}>The orange/yellow glow shows where the electric field is strongest — right near the wires. As you move away (downward toward the ground), the color fades, meaning the field gets weaker. The ground itself acts like a shield.</div>
        <InfoBox color="#3498db"><b style={{color:'#3498db'}}>Key insight:</b> The field drops off quickly with distance. At ground level, the field is already much weaker than right under the wires.</InfoBox>
      </Card>
      <TipBox color="#f39c12" tips={['E-field exists even when no current flows — just having voltage on the wire is enough.','Metal objects (cars, buildings) block the E-field — you get less exposure inside a car under a line.','The E-field is measured in kV/m (kilovolts per metre). ICNIRP limit for public is 5 kV/m.','Trees and hedges can reduce E-field by up to 90% — a natural shield!']}/>
    </div>
  );

  if(id===4) return (
    <div>
      <Card>
        <Label>🧲 MAGNETIC FIELD MAP</Label>
        <FieldHeatmap type="magnetic" time={time}/>
      </Card>
      <Card>
        <Label>🧠 BIOT-SAVART IN PLAIN ENGLISH</Label>
        <div style={{fontSize:14,color:C.text,lineHeight:1.8}}>Every wire carrying current creates a magnetic field that wraps around it in circles — like rings around a finger. The more current, the stronger the rings. The farther you are, the weaker they get.</div>
        <div style={{marginTop:12,display:'flex',gap:10,flexWrap:'wrap'}}>
          {[{icon:'🔌',label:'More current',effect:'Stronger magnetic field',color:'#9b59b6'},{icon:'📏',label:'More distance',effect:'Weaker magnetic field',color:'#27ae60'},{icon:'🔄',label:'3 phases together',effect:'Fields partially cancel',color:'#3498db'}].map(({icon,label,effect,color})=>(
            <div key={label} style={{flex:1,minWidth:140,background:`${color}11`,border:`1px solid ${color}33`,borderRadius:8,padding:10}}>
              <div style={{fontSize:22}}>{icon}</div>
              <div style={{color,fontWeight:'bold',fontSize:13}}>{label}</div>
              <div style={{color:C.sub,fontSize:12}}>{effect}</div>
            </div>
          ))}
        </div>
      </Card>
      <TipBox color="#9b59b6" tips={['Unlike E-fields, B-fields pass through most materials — walls, cars, and trees do NOT block them.','B-field is measured in microtesla (µT). ICNIRP public limit is 200 µT.','The B-field is stronger during peak electricity demand hours (morning & evening).','Underground cables have much lower B-fields at the surface because the 3 phases are close together and cancel out.']}/>
    </div>
  );

  if(id===5) return (
    <div>
      <Card>
        <Label>🌡️ DRAG THE SLIDER — watch the wire sag change</Label>
        <Slider label="Temperature" val={temp} set={setTemp} min={20} max={80} unit="°C" color="#e74c3c"/>
        <TempEffect temp={temp}/>
      </Card>
      <Card>
        <Label>📖 WHY DOES HEAT MATTER?</Label>
        <div style={{fontSize:14,color:C.text,lineHeight:1.8}}>Metal expands when hot — just like a metal bridge gets slightly longer on a hot day. Power line wires do the same. When they expand, they sag lower toward the ground.</div>
        <div style={{marginTop:12,display:'flex',gap:8,flexWrap:'wrap'}}>
          {[{t:'20°C',sag:'12m',status:'Baseline',color:'#27ae60'},{t:'40°C',sag:'21m',status:'Warm',color:'#f39c12'},{t:'60°C',sag:'31m',status:'Hot!',color:'#e74c3c'},{t:'80°C',sag:'40m',status:'Danger!',color:'#c0392b'}].map(({t,sag,status,color})=>(
            <div key={t} style={{flex:1,minWidth:80,textAlign:'center',background:`${color}15`,borderRadius:8,padding:8}}>
              <div style={{color,fontWeight:'bold'}}>{t}</div>
              <div style={{color:C.text,fontSize:13}}>Sag: {sag}</div>
              <div style={{color:C.sub,fontSize:11}}>{status}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <Label>🔬 PHYSICS: TEMPERATURE vs PERMITTIVITY</Label>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <div style={{background:'#0f1923',border:'1px solid #f39c1255',padding:10,borderRadius:8}}>
            <div style={{color:'#f39c12',fontWeight:'bold',fontSize:13,marginBottom:4}}>⚡ Electric Field (E) & Permittivity (ε)</div>
            <div style={{color:C.text,fontSize:12,lineHeight:1.5}}>As air heats up, its density decreases. Less dense air has a slightly lower dielectric permittivity (ε). Heat reduces the <b>Dielectric Strength</b> of air, making it easier for the E-field to break down the air and cause corona discharge.</div>
          </div>
          <div style={{background:'#0f1923',border:'1px solid #9b59b655',padding:10,borderRadius:8}}>
            <div style={{color:'#9b59b6',fontWeight:'bold',fontSize:13,marginBottom:4}}>🧲 Magnetic Field (H) & Permeability (μ)</div>
            <div style={{color:C.text,fontSize:12,lineHeight:1.5}}>Temperature changes have almost <b>zero effect</b> on the magnetic permeability (μ) of air. The H-field passes through hot air exactly the same as cold air. However, hotter wires sag closer to the ground, which means the H-field at ground level will feel stronger!</div>
          </div>
        </div>
      </Card>
      <TipBox color="#e74c3c" tips={['At 60°C, a wire can sag 2–3 m more than at 20°C — that is significant for ground clearance.','Engineers design towers with extra height to ensure safe clearance even on the hottest days.','Cold weather tightens the wire (less sag) — winter EMF readings at ground level are typically lower.','Ice buildup in winter adds weight and can cause extra sag — a double effect!']}/>
    </div>
  );

  if(id===6) return (
    <div>
      <Card>
        <Label>💨 DRAG THE SLIDER — watch wires swing sideways</Label>
        <Slider label="Wind Speed" val={wind} set={setWind} min={0} max={30} unit=" m/s" color="#3498db"/>
        <WindEffect wind={wind}/>
      </Card>
      <Card>
        <Label>📖 WHY DOES WIND MATTER?</Label>
        <div style={{fontSize:14,color:C.text,lineHeight:1.8}}>Wind pushes the wires sideways like pushing a hanging rope. When wires swing, they move closer to each other or to nearby structures — changing the field pattern below.</div>
        <InfoBox color="#3498db"><b style={{color:'#3498db'}}>Ghost circles</b> show the original wire positions. <b style={{color:C.phaseA}}>Solid circles</b> show where the wires actually are in the wind.</InfoBox>
        <div style={{marginTop:8,display:'flex',gap:8,flexWrap:'wrap'}}>
          {[{speed:'0 m/s',label:'Calm',color:'#27ae60'},{speed:'10 m/s',label:'Breezy',color:'#f39c12'},{speed:'20 m/s',label:'Strong',color:'#e74c3c'},{speed:'30 m/s',label:'Storm!',color:'#c0392b'}].map(({speed,label,color})=>(
            <div key={speed} style={{flex:1,minWidth:80,textAlign:'center',background:`${color}15`,borderRadius:8,padding:8}}>
              <div style={{color,fontWeight:'bold',fontSize:13}}>{speed}</div>
              <div style={{color:C.sub,fontSize:12}}>{label}</div>
            </div>
          ))}
        </div>
      </Card>
      <TipBox color="#3498db" tips={['Wind cooling allows wires to carry more current without overheating — good for the grid!','At wind speeds above 20 m/s, wires can swing several metres — the field hotspot moves with them.','Galloping (large slow oscillations) can happen in icy wind — dangerous for the tower structure.','Wind direction matters: crosswind causes maximum swing, headwind causes minimum swing.']}/>
    </div>
  );

  if(id===7) return (
    <div>
      <Card>
        <Label>🌫️ LIVE DUST SIMULATION — particles get charged and move</Label>
        <DustCanvas time={time}/>
      </Card>
      <Card>
        <Label>📖 HOW DUST GETS CHARGED</Label>
        <div style={{fontSize:14,color:C.text,lineHeight:1.8}}>When a dust particle floats near a power line, the electric field "charges" it — like rubbing a balloon on your hair. Once charged, the particle is attracted or repelled by the field.</div>
        <div style={{marginTop:12,display:'flex',gap:10,flexWrap:'wrap'}}>
          {[{icon:'🌫️',step:'1. Dust floats up',color:C.sub},{icon:'⚡',step:'2. E-field charges it',color:'#f39c12'},{icon:'🎯',step:'3. Pulled toward wire',color:'#e74c3c'},{icon:'💥',step:'4. Deposits on surface',color:'#9b59b6'}].map(({icon,step,color})=>(
            <div key={step} style={{flex:1,minWidth:120,background:`${color}11`,border:`1px solid ${color}33`,borderRadius:8,padding:10,textAlign:'center'}}>
              <div style={{fontSize:24}}>{icon}</div>
              <div style={{color,fontSize:12,marginTop:4}}>{step}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <Label>🔬 PHYSICS: DUST vs PERMITTIVITY</Label>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <div style={{background:'#0f1923',border:'1px solid #e67e2255',padding:10,borderRadius:8}}>
            <div style={{color:'#e67e22',fontWeight:'bold',fontSize:13,marginBottom:4}}>⚡ Local Permittivity (ε) Distortion</div>
            <div style={{color:C.text,fontSize:12,lineHeight:1.5}}>Solid dust particles have a much <b>higher permittivity</b> than plain air. When dust enters the E-field, the field lines bend and concentrate around the particles. This local distortion heavily increases the risk of spark/corona.</div>
          </div>
          <div style={{background:'#0f1923',border:'1px solid #9b59b655',padding:10,borderRadius:8}}>
            <div style={{color:'#9b59b6',fontWeight:'bold',fontSize:13,marginBottom:4}}>🧲 Magnetic Permeability (μ)</div>
            <div style={{color:C.text,fontSize:12,lineHeight:1.5}}>Common dust (sand, dirt) is non-magnetic. Because its magnetic permeability (μ) equals that of free space, dust has <b>no effect</b> on the Magnetic Field (H).</div>
          </div>
        </div>
      </Card>
      <TipBox color="#e67e22" tips={['Corona discharge creates a faint hissing or crackling sound you can sometimes hear near high-voltage lines.','Charged dust can deposit on insulators, causing "flashover" — a dangerous short circuit.','In desert regions, dust storms are a major maintenance challenge for power lines.','The corona effect also produces ozone (O₃) — you may smell it near very high-voltage lines.','Washing insulators regularly prevents dust buildup and keeps the line safe.']}/>
    </div>
  );

  if(id===8) return (
    <div>
      <Card>
        <Label>💧 HUMIDITY SLIDER — rain intensity & corona glow</Label>
        <Slider label="Humidity" val={humidity} set={setHumidity} min={0} max={100} unit="%" color="#00bcd4"/>
        <HumidityCanvas humidity={humidity} load={load}/>
      </Card>
      <Card>
        <Label>📊 LIVE EFFECTS</Label>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          {[
            {icon:'⚡',label:'Air Conductivity',val:humidity<40?'Low':humidity<70?'Medium':'High',color:'#00bcd4'},
            {icon:'🌀',label:'Corona Effect',val:humidity>60?'Highly Active':'Low',color:'#9b59b6'},
            {icon:'💦',label:'Leakage Risk',val:humidity>70?'High':humidity>40?'Med':'Low',color:C.danger},
            {icon:'💡',label:'E-Field Change',val:`${humidity>50?'−':'+'}${Math.abs(Math.round((humidity-50)*0.3))}%`,color:'#f39c12'},
          ].map(({icon,label,val,color})=>(
            <div key={label} style={{background:'#0f1923',borderRadius:8,padding:10,textAlign:'center',border:`1px solid ${color}33`}}>
              <div style={{fontSize:20}}>{icon}</div>
              <div style={{color,fontWeight:'bold',fontSize:16}}>{val}</div>
              <div style={{color:C.sub,fontSize:11}}>{label}</div>
            </div>
          ))}
        </div>
        <InfoBox color="#00bcd4">💧 Humid air and rain create water droplets on lines. These act as sharp points, which dramatically <b>increases</b> corona discharge and creates the crackling sound you hear.</InfoBox>
      </Card>
      <Card>
        <Label>🔬 PHYSICS: HUMIDITY vs PERMITTIVITY</Label>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <div style={{background:'#0f1923',border:'1px solid #00bcd455',padding:10,borderRadius:8}}>
            <div style={{color:'#00bcd4',fontWeight:'bold',fontSize:13,marginBottom:4}}>⚡ High Permittivity of Water (εr ≈ 80)</div>
            <div style={{color:C.text,fontSize:12,lineHeight:1.5}}>Pure air has a relative permittivity of ~1. Liquid water has a massive permittivity of ~80! When humidity forms droplets in the air or on wires, it severely warps the surrounding E-field and increases the medium's average permittivity, leading to heavy leakage.</div>
          </div>
          <div style={{background:'#0f1923',border:'1px solid #9b59b655',padding:10,borderRadius:8}}>
            <div style={{color:'#9b59b6',fontWeight:'bold',fontSize:13,marginBottom:4}}>🧲 Magnetic Permeability (μ)</div>
            <div style={{color:C.text,fontSize:12,lineHeight:1.5}}>Water is slightly diamagnetic, but effectively its magnetic permeability is identical to air. Rain, fog, or high humidity have <b>zero impact</b> on the transmission of the Magnetic Field (H).</div>
          </div>
        </div>
      </Card>
      <TipBox color="#00bcd4" tips={['Humid air has higher permittivity — this slightly reduces the ambient E-field strength.','At very high humidity (above 80%), water films form on insulators, creating leakage current paths.','Water droplets act as sharp emission points, which is why lines buzz loudly in rain or fog.','Fog and mist are extreme humidity cases — they can cause visible purple corona glow at night.','Power companies wash insulators regularly in humid coastal regions to prevent flashover.']}/>
    </div>
  );

  if(id===9) return (
    <div>
      <Card>
        <Label>🛡️ DRAG TO FIND YOUR SAFE DISTANCE</Label>
        <Slider label="Your distance from the power line" val={distance} set={setDistance} min={1} max={100} unit="m" color="#27ae60"/>
        <SafetyMeter distance={distance}/>
      </Card>
      <Card>
        <Label>📋 ICNIRP 2020 SAFETY GUIDELINES (SIMPLIFIED)</Label>
        <div style={{fontSize:14,color:C.text,lineHeight:1.8,marginBottom:10}}>ICNIRP is the international body that sets safety limits for EMF exposure. Think of it like a speed limit — but for invisible fields.</div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {[{zone:'Under the line',dist:'0–15m',risk:'High',color:'#e74c3c',icon:'🚨'},{zone:'Near the line',dist:'15–40m',risk:'Moderate',color:'#f39c12',icon:'⚠️'},{zone:'Away from line',dist:'40m+',risk:'Low',color:'#27ae60',icon:'✅'}].map(({zone,dist,risk,color,icon})=>(
            <div key={zone} style={{flex:1,minWidth:120,background:`${color}15`,border:`1px solid ${color}44`,borderRadius:10,padding:12,textAlign:'center'}}>
              <div style={{fontSize:28}}>{icon}</div>
              <div style={{color,fontWeight:'bold',fontSize:13}}>{zone}</div>
              <div style={{color:C.sub,fontSize:12}}>{dist}</div>
              <div style={{color:C.text,fontSize:12,marginTop:4}}>Risk: {risk}</div>
            </div>
          ))}
        </div>
      </Card>
      <TipBox color="#27ae60" tips={['Distance is your best protection — field drops fast with distance.','Limit time spent directly under high-voltage lines.','Trees & buildings provide partial E-field shielding.','Metal roofs block most E-field indoors.','Hot days = more sag = stronger field at ground level — be extra careful in summer!']}/>
    </div>
  );

  if(id===10) return (
    <div>
      {/* ── Prominent Voltage Slider ── */}
      <Card style={{background:'linear-gradient(135deg,#f39c1222,#1a2535)',border:'1px solid #f39c1255'}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
          <span style={{fontSize:36}}>🔌</span>
          <div>
            <div style={{color:'#f39c12',fontWeight:'bold',fontSize:16}}>Line Voltage</div>
            <div style={{color:C.sub,fontSize:12}}>Controls the Electric Field (E) strength</div>
          </div>
          <div style={{marginLeft:'auto',background:'#f39c1222',border:'2px solid #f39c12',borderRadius:12,padding:'8px 18px',textAlign:'center'}}>
            <div style={{color:'#f39c12',fontSize:28,fontWeight:'bold',lineHeight:1}}>{voltage}</div>
            <div style={{color:C.sub,fontSize:11}}>kV</div>
          </div>
        </div>
        <input type="range" min={11} max={500} step={1} value={voltage} onChange={e=>setVoltage(+e.target.value)} style={{width:'100%',accentColor:'#f39c12',height:8}}/>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:C.sub,marginTop:4}}>
          <span>11 kV</span><span>66 kV</span><span>132 kV</span><span>220 kV</span><span>400 kV</span><span>500 kV</span>
        </div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:8}}>
          {[11,33,66,132,220,400,500].map(v=>(
            <button key={v} onClick={()=>setVoltage(v)} style={{padding:'4px 10px',borderRadius:8,border:voltage===v?'2px solid #f39c12':'1px solid #2c3e50',background:voltage===v?'#f39c1233':'#0f1923',color:voltage===v?'#f39c12':C.sub,fontSize:12,fontWeight:'bold',cursor:'pointer'}}>{v} kV</button>
          ))}
        </div>
      </Card>

      {/* ── Load Slider ── */}
      <Card style={{background:'linear-gradient(135deg,#9b59b622,#1a2535)',border:'1px solid #9b59b655'}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
          <span style={{fontSize:36}}>⚡</span>
          <div>
            <div style={{color:'#9b59b6',fontWeight:'bold',fontSize:16}}>Load Current</div>
            <div style={{color:C.sub,fontSize:12}}>Controls the Magnetic Field (B) strength</div>
          </div>
          <div style={{marginLeft:'auto',background:'#9b59b622',border:'2px solid #9b59b6',borderRadius:12,padding:'8px 18px',textAlign:'center'}}>
            <div style={{color:'#9b59b6',fontSize:28,fontWeight:'bold',lineHeight:1}}>{load}</div>
            <div style={{color:C.sub,fontSize:11}}>%</div>
          </div>
        </div>
        <input type="range" min={0} max={100} value={load} onChange={e=>setLoad(+e.target.value)} style={{width:'100%',accentColor:'#9b59b6',height:8}}/>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:C.sub,marginTop:4}}>
          <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
        </div>
      </Card>

      {/* ── Combined field canvas ── */}
      <Card>
        <Label>🔬 LIVE FIELD VIEW — E-field (orange) from voltage + B-field (purple) from load</Label>
        <LoadFieldCanvas time={time} load={load} voltage={voltage}/>
      </Card>

      {/* ── Tower view ── */}
      <Card>
        <Label>🗼 TOWER VIEW — wire glow = load, orange halo = voltage</Label>
        <TowerDiagram time={time} temp={temp} wind={wind} load={load} voltage={voltage}/>
      </Card>

      {/* ── Load levels ── */}
      <Card>
        <Label>📊 LOAD LEVELS EXPLAINED</Label>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {[{pct:'0%',label:'No load',desc:'Wires cold & dim — no current flowing',color:'#95a5a6'},{pct:'25%',label:'Light load',desc:'Off-peak hours, e.g. 2 am',color:'#27ae60'},{pct:'50%',label:'Normal load',desc:'Typical daytime demand',color:'#f39c12'},{pct:'75%',label:'Heavy load',desc:'Peak demand, hot afternoon',color:'#e74c3c'},{pct:'100%',label:'Full rated',desc:'Maximum design current',color:'#c0392b'}].map(({pct,label,desc,color})=>(
            <div key={pct} style={{flex:1,minWidth:90,textAlign:'center',background:`${color}15`,borderRadius:10,padding:'10px 6px',border:`1px solid ${color}44`}}>
              <div style={{color,fontWeight:'bold',fontSize:16}}>{pct}</div>
              <div style={{color:C.text,fontSize:12,fontWeight:'bold',marginTop:2}}>{label}</div>
              <div style={{color:C.sub,fontSize:11,marginTop:3}}>{desc}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Voltage levels ── */}
      <Card>
        <Label>🔌 COMMON VOLTAGE LEVELS</Label>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          {[{kv:'11 kV',use:'Local distribution',color:'#27ae60'},{kv:'33 kV',use:'Sub-transmission',color:'#2ecc71'},{kv:'66 kV',use:'Regional transmission',color:'#f39c12'},{kv:'132 kV',use:'High voltage grid',color:'#e67e22'},{kv:'220 kV',use:'Extra-high voltage',color:'#e74c3c'},{kv:'400–500 kV',use:'Ultra-high voltage',color:'#c0392b'}].map(({kv,use,color})=>(
            <div key={kv} style={{flex:1,minWidth:80,textAlign:'center',background:`${color}15`,borderRadius:10,padding:'8px 4px',border:`1px solid ${color}44`}}>
              <div style={{color,fontWeight:'bold',fontSize:14}}>{kv}</div>
              <div style={{color:C.sub,fontSize:10,marginTop:3}}>{use}</div>
            </div>
          ))}
        </div>
        <InfoBox color="#f39c12">💡 <b style={{color:'#f39c12'}}>Voltage drives the Electric Field:</b> Higher voltage = stronger E-field around the wires = wider orange glow. Even with zero load current, voltage alone creates an E-field!</InfoBox>
      </Card>

      {/* ── Field strength bars ── */}
      <Card>
        <Label>📈 LOAD &amp; VOLTAGE vs FIELD STRENGTH</Label>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {[
            {label:'Electric Field (E)',value:voltage/500,color:'#f39c12',formula:'E ∝ V ('+voltage+' kV)'},
            {label:'Magnetic Field (B)',value:load/100,color:'#9b59b6',formula:'B ∝ I ('+load+'%)'},
            {label:'Wire Temperature',value:Math.min((load/100)**2,1),color:'#e74c3c',formula:'Heat ∝ I²'},
            {label:'Corona Risk',value:Math.min((voltage/300)*(0.5+load/200),1),color:'#e67e22',formula:'↑ voltage & load'},
          ].map(({label,value,color,formula})=>(
            <div key={label}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:3}}>
                <span style={{color:C.sub}}>{label}</span>
                <span style={{color:C.sub,fontStyle:'italic'}}>{formula}</span>
              </div>
              <div style={{height:14,borderRadius:7,background:'#0f1923',overflow:'hidden',border:'1px solid #2c3e5066'}}>
                <div style={{height:'100%',width:`${value*100}%`,background:`linear-gradient(90deg,${color}88,${color})`,borderRadius:7,transition:'width 0.3s'}}/>
              </div>
            </div>
          ))}
        </div>
        <InfoBox color="#9b59b6">🧲 <b style={{color:'#9b59b6'}}>Key difference:</b> The <b>E-field</b> depends on <b>voltage</b> (always present when energised). The <b>B-field</b> depends on <b>current</b> (changes with demand). Both drop off with distance.</InfoBox>
      </Card>
      <TipBox color="#e74c3c" tips={['A 200 kV line can carry 1000–2000 A at full load — enough to power a small city.','Even at 0% load, the E-field exists because the line is still energised at its rated voltage.','Higher voltage lines need wider right-of-way corridors because the E-field extends farther.','During summer heatwaves, load peaks at the same time wires are already sagging from heat — a double risk.','The magnetic field is strongest directly under the line and falls off rapidly with distance.','Smart grids can reroute load to reduce field exposure in populated areas.','11 kV lines (neighbourhood poles) produce much weaker E-fields than 220 kV towers.']}/>
    </div>
  );

  return null;
}

// ── Main App ──────────────────────────────────────────────────────────────────
function App() {
  const [chapter, setChapter] = useState(0);
  const [time, setTime]       = useState(0);
  const [temp, setTemp]       = useState(25);
  const [wind, setWind]       = useState(5);
  const [humidity, setHumidity] = useState(50);
  const [distance, setDistance] = useState(50);
  const [fieldType, setFieldType] = useState('electric');
  const [load, setLoad]           = useState(50);
  const [voltage, setVoltage]     = useState(200);

  useEffect(()=>{
    const id=setInterval(()=>setTime(t=>t+0.05),50);
    return ()=>clearInterval(id);
  },[]);

  const cur = chapters[chapter];

  return (
    <div style={{background:C.bg,minHeight:'100vh',fontFamily:'system-ui,sans-serif',color:C.text}}>
      {/* Header */}
      <div style={{background:'linear-gradient(135deg,#0f1923 0%,#1a2535 100%)',borderBottom:`1px solid ${C.border}`,padding:'16px 20px'}}>
        <div style={{fontSize:22,fontWeight:'bold',color:'#f39c12'}}>⚡ EMF Visual Explorer</div>
        <div style={{fontSize:13,color:C.sub,marginTop:2}}>Understand power line fields — no math needed</div>
      </div>

      {/* Chapter nav */}
      <div style={{overflowX:'auto',padding:'12px 16px',background:'#111c28',borderBottom:`1px solid ${C.border}`}}>
        <div style={{display:'flex',gap:8,minWidth:'max-content'}}>
          {chapters.map(ch=>(
            <button key={ch.id} onClick={()=>setChapter(ch.id)} style={{
              padding:'8px 14px',borderRadius:10,border:'none',cursor:'pointer',
              background:chapter===ch.id?ch.color:C.card,
              color:chapter===ch.id?'#000':C.sub,
              fontWeight:chapter===ch.id?'bold':'normal',
              fontSize:13,whiteSpace:'nowrap',transition:'all 0.2s',
              boxShadow:chapter===ch.id?`0 0 12px ${ch.color}66`:'none',
            }}>
              {ch.icon} {ch.title}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{maxWidth:620,margin:'0 auto',padding:'20px 16px'}}>
        {/* Chapter header */}
        <div style={{marginBottom:20,padding:'14px 16px',background:`linear-gradient(135deg,${cur.color}22,${C.card})`,borderRadius:12,border:`1px solid ${cur.color}44`}}>
          <div style={{fontSize:32,marginBottom:4}}>{cur.icon}</div>
          <div style={{fontSize:18,fontWeight:'bold',color:cur.color}}>{cur.title}</div>
          <div style={{fontSize:13,color:C.sub,marginTop:2}}>{cur.subtitle}</div>
        </div>

        <ChapterContent id={chapter} time={time} temp={temp} setTemp={setTemp} wind={wind} setWind={setWind} humidity={humidity} setHumidity={setHumidity} distance={distance} setDistance={setDistance} fieldType={fieldType} setFieldType={setFieldType} load={load} setLoad={setLoad} voltage={voltage} setVoltage={setVoltage}/>

        {/* Chapter navigation */}
        <div style={{display:'flex',justifyContent:'space-between',marginTop:24,paddingTop:16,borderTop:`1px solid ${C.border}`}}>
          <button onClick={()=>setChapter(Math.max(0,chapter-1))} disabled={chapter===0} style={{padding:'8px 16px',borderRadius:8,border:'none',cursor:chapter===0?'default':'pointer',background:chapter===0?C.card:C.border,color:chapter===0?C.sub:C.text,fontSize:13,opacity:chapter===0?0.5:1}}>← Previous</button>
          <span style={{color:C.sub,fontSize:12,alignSelf:'center'}}>{chapter+1} / {chapters.length}</span>
          <button onClick={()=>setChapter(Math.min(chapters.length-1,chapter+1))} disabled={chapter===chapters.length-1} style={{padding:'8px 16px',borderRadius:8,border:'none',cursor:chapter===chapters.length-1?'default':'pointer',background:chapter===chapters.length-1?C.card:cur.color,color:chapter===chapters.length-1?C.sub:'#000',fontSize:13,fontWeight:'bold',opacity:chapter===chapters.length-1?0.5:1}}>Next →</button>
        </div>
      </div>
    </div>
  );
}