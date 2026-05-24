import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from './store/auth';
import { readingApi } from './services/api';
import { TAROT_CARDS, SPREADS } from '@tarot/shared';
import type { TarotCard } from '@tarot/shared';

// ==================== SVG CARD ILLUSTRATIONS ====================
// Detailed SVG scenes for each Major Arcana card (Rider-Waite inspired)
const MajorArcanaSVG: Record<number, () => React.ReactNode> = {
  // 0 - The Fool
  0: () => (
    <svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg">
      {/* Sky & mountains */}
      <defs><linearGradient id="sky0" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffe4a0"/><stop offset="100%" stopColor="#ffd060"/></linearGradient></defs>
      <rect width="200" height="280" fill="url(#sky0)"/>
      <path d="M0 180 L40 120 L80 150 L120 100 L160 130 L200 90 L200 280 L0 280Z" fill="#6b8e5a" opacity="0.6"/>
      <path d="M0 200 L60 160 L100 180 L140 140 L200 170 L200 280 L0 280Z" fill="#4a6e3a" opacity="0.7"/>
      {/* Cliff edge */}
      <path d="M60 200 L80 195 L100 200 L100 280 L60 280Z" fill="#8b7355"/>
      <path d="M60 200 L100 200 L105 198 L95 195 L65 198Z" fill="#a08060"/>
      {/* The Fool figure */}
      <circle cx="80" cy="120" r="10" fill="#f5d5b0"/>{/* head */}
      <path d="M72 130 L80 128 L88 130 L86 165 L74 165Z" fill="#e82020"/>{/* red tunic */}
      <path d="M70 132 L60 150 L68 148Z" fill="#f5d5b0"/>{/* left arm */}
      <path d="M90 132 L100 145 L92 147Z" fill="#f5d5b0"/>{/* right arm */}
      <path d="M74 165 L70 200 L78 198 L80 165Z" fill="#4a4a8a"/>{/* left leg */}
      <path d="M86 165 L90 200 L82 198 L80 165" fill="#4a4a8a"/>{/* right leg */}
      {/* Hat */}
      <path d="M65 118 Q80 100 95 118" fill="#e82020"/>
      <path d="M68 118 L80 108 L92 118" fill="#ff3030"/>
      {/* White rose */}
      <circle cx="62" cy="148" r="4" fill="#fff" opacity="0.9"/>
      <circle cx="62" cy="148" r="2" fill="#ffe0e0"/>
      {/* Bag on stick */}
      <line x1="98" y1="145" x2="110" y2="120" stroke="#8b7355" strokeWidth="2"/>
      <rect x="106" y="116" width="10" height="12" rx="2" fill="#c8a050"/>
      {/* Small dog */}
      <ellipse cx="92" cy="195" rx="8" ry="5" fill="#f5f5f5"/>
      <circle cx="98" cy="191" r="4" fill="#f5f5f5"/>
      <circle cx="99" cy="190" r="1" fill="#333"/>
      {/* Sun */}
      <circle cx="160" cy="40" r="20" fill="#ffd700" opacity="0.8"/>
      {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
        <line key={a} x1={160+Math.cos(a*Math.PI/180)*22} y1={40+Math.sin(a*Math.PI/180)*22}
              x2={160+Math.cos(a*Math.PI/180)*30} y2={40+Math.sin(a*Math.PI/180)*30}
              stroke="#ffd700" strokeWidth="2" opacity="0.6"/>
      ))}
      {/* White flower */}
      <circle cx="65" cy="250" r="3" fill="#fff"/>
      <circle cx="72" cy="255" r="2.5" fill="#fff"/>
    </svg>
  ),
  // 1 - The Magician
  1: () => (
    <svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffe8b0"/><stop offset="100%" stopColor="#e8d090"/></linearGradient></defs>
      <rect width="200" height="280" fill="url(#sky1)"/>
      {/* Garden background */}
      <path d="M0 160 Q50 140 100 155 Q150 170 200 150 L200 280 L0 280Z" fill="#3a8040" opacity="0.4"/>
      {/* Table with tools */}
      <rect x="55" y="180" width="90" height="5" rx="1" fill="#8b6040"/>
      <rect x="60" y="185" width="4" height="40" fill="#8b6040"/>
      <rect x="136" y="185" width="4" height="40" fill="#8b6040"/>
      {/* Pentacle on table */}
      <circle cx="100" cy="175" r="8" fill="none" stroke="#ffd700" strokeWidth="1.5"/>
      <path d="M100 167 L103 174 L110 174 L104 178 L107 185 L100 181 L93 185 L96 178 L90 174 L97 174Z" fill="#ffd700"/>
      {/* Cup */}
      <path d="M70 173 L78 173 L76 180 L72 180Z" fill="#c0c0c0"/>
      {/* Sword */}
      <line x1="120" y1="168" x2="120" y2="180" stroke="#c0c0c0" strokeWidth="1.5"/>
      <line x1="116" y1="172" x2="124" y2="172" stroke="#c0c0c0" strokeWidth="1"/>
      {/* Wand */}
      <line x1="130" y1="170" x2="130" y2="182" stroke="#8b5020" strokeWidth="2"/>
      {/* The Magician figure */}
      <circle cx="100" cy="100" r="12" fill="#f5d5b0"/>{/* head */}
      <path d="M88 112 L100 108 L112 112 L110 170 L90 170Z" fill="#e8e8e8"/>{/* white robe */}
      <path d="M88 112 L82 110 L88 108Z" fill="#e82020"/>{/* red cloak left */}
      <path d="M112 112 L118 110 L112 108Z" fill="#e82020"/>{/* red cloak right */}
      <path d="M88 112 L70 160 L90 155 L90 170Z" fill="#e82020" opacity="0.8"/>{/* cloak drape */}
      <path d="M112 112 L130 160 L110 155 L110 170Z" fill="#e82020" opacity="0.8"/>
      {/* Raised hand with wand */}
      <line x1="108" y1="115" x2="115" y2="70" stroke="#8b5020" strokeWidth="2.5"/>
      <circle cx="115" cy="65" r="3" fill="#ffd700"/>
      {/* Infinity symbol */}
      <path d="M90 75 Q85 68 90 62 Q95 56 100 62 Q105 56 110 62 Q115 68 110 75 Q105 80 100 75 Q95 80 90 75Z" fill="none" stroke="#ffd700" strokeWidth="1.5"/>
      {/* Pointing down hand */}
      <path d="M92 115 L80 140 L85 142 L92 118" fill="#f5d5b0"/>
      {/* Red roses */}
      <circle cx="30" cy="160" r="3" fill="#e03030"/>
      <circle cx="35" cy="155" r="2.5" fill="#e03030"/>
      <line x1="30" y1="163" x2="30" y2="200" stroke="#2a6020" strokeWidth="1.5"/>
      <line x1="35" y1="158" x2="33" y2="180" stroke="#2a6020" strokeWidth="1"/>
      {/* White lilies */}
      <path d="M160 155 Q165 145 170 155" fill="#fff" opacity="0.8"/>
      <path d="M165 155 Q170 145 175 155" fill="#fff" opacity="0.8"/>
      <line x1="165" y1="155" x2="165" y2="200" stroke="#2a6020" strokeWidth="1.5"/>
      {/* Infinity glow */}
      <ellipse cx="100" cy="68" rx="18" ry="10" fill="#ffd700" opacity="0.1"/>
    </svg>
  ),
  // 2 - High Priestess
  2: () => (
    <svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a1a40"/><stop offset="100%" stopColor="#2a2a50"/></linearGradient></defs>
      <rect width="200" height="280" fill="url(#sky2)"/>
      {/* Two pillars */}
      <rect x="25" y="80" width="20" height="200" fill="#2a2a50" stroke="#c0c0c0" strokeWidth="1"/>
      <rect x="155" y="80" width="20" height="200" fill="#2a2a50" stroke="#c0c0c0" strokeWidth="1"/>
      <text x="35" y="110" fill="#c0c0c0" fontSize="12" textAnchor="middle" fontFamily="serif">B</text>
      <text x="165" y="110" fill="#c0c0c0" fontSize="12" textAnchor="middle" fontFamily="serif">J</text>
      {/* Veil between pillars */}
      <path d="M45 80 Q100 100 155 80 L155 200 Q100 210 45 200Z" fill="#1a1a3a" opacity="0.5"/>
      {/* Pomegranates on veil */}
      <circle cx="80" cy="130" r="4" fill="#8b2040"/>
      <circle cx="100" cy="120" r="4" fill="#8b2040"/>
      <circle cx="120" cy="130" r="4" fill="#8b2040"/>
      <circle cx="90" cy="145" r="4" fill="#8b2040"/>
      <circle cx="110" cy="145" r="4" fill="#8b2040"/>
      {/* The Priestess */}
      <circle cx="100" cy="110" r="11" fill="#f5d5b0"/>{/* head */}
      {/* Crown with moon */}
      <path d="M88 102 L100 92 L112 102" fill="none" stroke="#c0c0c0" strokeWidth="1.5"/>
      <circle cx="100" cy="92" r="4" fill="#fff" opacity="0.8"/>
      <path d="M100 88 Q105 90 100 96 Q98 90 100 88" fill="#1a1a3a"/>
      {/* Blue robe */}
      <path d="M88 120 L80 220 L120 220 L112 120Z" fill="#2a3a8a"/>
      <path d="M85 120 L75 220 L80 220 L88 120Z" fill="#3a4a9a" opacity="0.7"/>
      <path d="M115 120 L125 220 L120 220 L112 120Z" fill="#3a4a9a" opacity="0.7"/>
      {/* Cross on chest */}
      <line x1="100" y1="125" x2="100" y2="145" stroke="#ffd700" strokeWidth="1.5"/>
      <line x1="93" y1="133" x2="107" y2="133" stroke="#ffd700" strokeWidth="1.5"/>
      {/* Scroll labeled TORA */}
      <rect x="88" y="155" width="24" height="14" rx="2" fill="#d8c080"/>
      <text x="100" y="165" fill="#6a5030" fontSize="6" textAnchor="middle" fontFamily="serif">TORA</text>
      {/* Crescent moon at feet */}
      <path d="M85 240 Q100 225 115 240 Q100 235 85 240" fill="#c0c0ff" opacity="0.6"/>
      {/* Water at feet */}
      <path d="M45 250 Q70 245 100 250 Q130 255 155 250 L155 280 L45 280Z" fill="#2a4a8a" opacity="0.4"/>
      <path d="M50 255 Q80 250 100 255 Q120 260 150 255" fill="none" stroke="#4a6aaa" strokeWidth="0.5" opacity="0.5"/>
    </svg>
  ),
  // 3 - The Empress
  3: () => (
    <svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="sky3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#90d890"/><stop offset="100%" stopColor="#60b060"/></linearGradient></defs>
      <rect width="200" height="280" fill="url(#sky3)"/>
      {/* Wheat field */}
      {Array.from({length:20}).map((_,i)=>(
        <line key={i} x1={10+i*10} y1={220+Math.sin(i)*5} x2={12+i*10} y2={200+Math.sin(i)*5}
              stroke="#d4a020" strokeWidth="1.5"/>
      ))}
      {/* Throne */}
      <path d="M50 140 L50 250 L150 250 L150 140 Q100 130 50 140Z" fill="#8b3030"/>
      <path d="M55 145 L55 245 L145 245 L145 145 Q100 137 55 145Z" fill="#a04040"/>
      {/* Heart on throne */}
      <path d="M95 160 Q95 152 100 155 Q105 152 105 160 L100 170Z" fill="#e04040"/>
      {/* The Empress */}
      <circle cx="100" cy="90" r="12" fill="#f5d5b0"/>{/* head */}
      {/* Crown of 12 stars */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map(a=>(
        <circle key={a} cx={100+Math.cos(a*Math.PI/180)*16} cy={90+Math.sin(a*Math.PI/180)*16}
                r="2" fill="#ffd700"/>
      ))}
      {/* Flowing white gown */}
      <path d="M85 102 L60 230 L140 230 L115 102Z" fill="#e8e0d0"/>
      <path d="M85 102 L55 230 L60 230 L88 102Z" fill="#d8d0c0" opacity="0.7"/>
      <path d="M115 102 L145 230 L140 230 L112 102Z" fill="#d8d0c0" opacity="0.7"/>
      {/* Red velvet cloak */}
      <path d="M88 102 L40 240 L80 240 L90 120Z" fill="#a02020" opacity="0.7"/>
      <path d="M112 102 L160 240 L120 240 L110 120Z" fill="#a02020" opacity="0.7"/>
      {/* Pomegranate pattern */}
      <circle cx="75" cy="180" r="3" fill="#8b2040"/>
      <circle cx="125" cy="175" r="3" fill="#8b2040"/>
      {/* Scepter */}
      <line x1="50" y1="110" x2="50" y2="180" stroke="#ffd700" strokeWidth="2"/>
      <circle cx="50" cy="108" r="4" fill="#ffd700"/>
      {/* Shield with venus symbol */}
      <circle cx="150" cy="180" r="12" fill="#4a8a4a"/>
      <circle cx="150" cy="177" r="6" fill="none" stroke="#ffd700" strokeWidth="1.5"/>
      <line x1="150" y1="183" x2="150" y2="192" stroke="#ffd700" strokeWidth="1.5"/>
      <line x1="146" y1="187" x2="154" y2="187" stroke="#ffd700" strokeWidth="1.5"/>
      {/* Birds */}
      <path d="M20 30 Q25 25 30 30" fill="none" stroke="#fff" strokeWidth="1"/>
      <path d="M170 40 Q175 35 180 40" fill="none" stroke="#fff" strokeWidth="1"/>
    </svg>
  ),
};

// Fallback for cards without custom SVG - generates a thematic scene
function DefaultMajorSVG({card}: {card: TarotCard}) {
  const art = {
    symbol: ['☆','☿','☽','♀','♂','♃','❤','⚡','∞','🏮','☸','⚖','☋','🦋','🍷','⛧','🔥','★','🌙','☀','📯','🌍'][card.cardNumber] || '✦',
    bg1: ['#ffe4a0','#ffe8b0','#1a1a40','#90d890','#8b4040','#d8d0c0','#ffe0a0','#a0c0e0','#d0e8d0','#3a3a50','#d8c8a0','#c8d8e8','#3a5040','#4a3a2a','#e0d0b0','#2a1a1a','#3a2a2a','#a0d0f0','#1a2a4a','#ffe080','#a0b0d0','#d0c0a0'][card.cardNumber] || '#d8c8a0',
    bg2: ['#ffd060','#e8d090','#2a2a50','#60b060','#6b2020','#b0a880','#e0b060','#7090b0','#a0c0a0','#2a2a30','#b0a080','#a0b0c0','#2a3a30','#3a2a1a','#c0b090','#1a0a0a','#2a1a1a','#70a0c0','#0a1a3a','#ffc040','#8090b0','#b0a080'][card.cardNumber] || '#b0a080',
  };
  return (
    <svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`bg${card.cardNumber}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={art.bg1}/>
          <stop offset="100%" stopColor={art.bg2}/>
        </linearGradient>
      </defs>
      <rect width="200" height="280" fill={`url(#bg${card.cardNumber})`}/>
      {/* Ground */}
      <path d="M0 200 Q50 190 100 195 Q150 200 200 190 L200 280 L0 280Z" fill={art.bg2} opacity="0.5"/>
      {/* Decorative border lines */}
      <rect x="8" y="8" width="184" height="264" rx="4" fill="none" stroke="rgba(200,152,80,0.3)" strokeWidth="1"/>
      <rect x="12" y="12" width="176" height="256" rx="3" fill="none" stroke="rgba(200,152,80,0.15)" strokeWidth="0.5"/>
      {/* Central figure area */}
      <circle cx="100" cy="120" r="50" fill="rgba(0,0,0,0.1)"/>
      {/* Symbol */}
      <text x="100" y="135" textAnchor="middle" fontSize="48" fill="rgba(200,152,80,0.8)">{art.symbol}</text>
      {/* Stars/decorations */}
      <circle cx="30" cy="30" r="2" fill="#ffd700" opacity="0.4"/>
      <circle cx="170" cy="40" r="1.5" fill="#ffd700" opacity="0.3"/>
      <circle cx="50" cy="250" r="1.5" fill="#ffd700" opacity="0.3"/>
      <circle cx="150" cy="260" r="2" fill="#ffd700" opacity="0.4"/>
    </svg>
  );
}

// Minor Arcana SVG scene generator
function MinorArcanaSVG({card}: {card: TarotCard}) {
  const suit = card.suit || 'wands';
  const themes: Record<string, {bg1:string; bg2:string; accent:string; icon:string}> = {
    wands: {bg1:'#3a1800', bg2:'#1a0a00', accent:'#e86830', icon:'🪄'},
    cups: {bg1:'#0a1830', bg2:'#040c18', accent:'#3a8ae8', icon:'🏆'},
    swords: {bg1:'#1a1a30', bg2:'#0a0a18', accent:'#8888cc', icon:'⚔'},
    pentacles: {bg1:'#0a200a', bg2:'#041004', accent:'#48a858', icon:'⭐'},
  };
  const t = themes[suit];
  const count = card.cardNumber;
  const isCourt = count > 10;

  const positions: Array<{x:number;y:number}> = [];
  if (!isCourt) {
    if (count === 1) positions.push({x:100,y:130});
    else if (count === 2) positions.push({x:100,y:100},{x:100,y:170});
    else if (count === 3) positions.push({x:100,y:85},{x:70,y:150},{x:130,y:150});
    else if (count === 4) positions.push({x:75,y:100},{x:125,y:100},{x:75,y:170},{x:125,y:170});
    else if (count === 5) positions.push({x:75,y:90},{x:125,y:90},{x:100,y:140},{x:70,y:180},{x:130,y:180});
    else if (count === 6) {for(let r=0;r<2;r++)for(let c=0;c<3;c++)positions.push({x:65+c*35,y:90+r*55});}
    else if (count === 7) {for(let r=0;r<2;r++)for(let c=0;c<3;c++)positions.push({x:65+c*35,y:80+r*50});positions.push({x:100,y:180});}
    else if (count === 8) {for(let r=0;r<2;r++)for(let c=0;c<4;c++)positions.push({x:55+c*30,y:85+r*55});}
    else if (count === 9) {for(let r=0;r<3;r++)for(let c=0;c<3;c++)positions.push({x:65+c*35,y:70+r*45});}
    else if (count === 10) {for(let r=0;r<2;r++)for(let c=0;c<4;c++)positions.push({x:55+c*30,y:80+r*55});positions.push({x:85,y:190},{x:115,y:190});}
  }

  return (
    <svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`ms${suit}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={t.bg1}/>
          <stop offset="100%" stopColor={t.bg2}/>
        </linearGradient>
      </defs>
      <rect width="200" height="280" fill={`url(#ms${suit})`}/>
      <rect x="8" y="8" width="184" height="264" rx="4" fill="none" stroke={t.accent} strokeWidth="0.5" opacity="0.3"/>

      {!isCourt ? (
        // Pip cards - show suit symbols
        positions.map((p, i) => (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" fontSize="24" fill={t.accent} opacity="0.9"
                style={{filter:`drop-shadow(0 0 4px ${t.accent})`}}>{t.icon}</text>
        ))
      ) : (
        // Court cards - show figure
        <g>
          {/* Background scene */}
          <path d="M0 200 Q50 180 100 190 Q150 200 200 185 L200 280 L0 280Z" fill={t.bg2} opacity="0.5"/>
          {/* Throne/platform */}
          <rect x="60" y="160" width="80" height="8" rx="2" fill={t.accent} opacity="0.3"/>
          {/* Figure body */}
          <circle cx="100" cy="100" r="14" fill="#f5d5b0"/>{/* head */}
          <path d="M84 114 L100 110 L116 114 L114 190 L86 190Z" fill={t.accent} opacity="0.7"/>{/* robe */}
          {/* Crown/headdress */}
          {count === 13 && <path d="M86 90 L92 80 L100 88 L108 80 L114 90" fill="#ffd700" stroke="#ffd700" strokeWidth="1"/>}
          {count === 14 && <path d="M86 90 L100 78 L114 90" fill="#ffd700" stroke="#ffd700" strokeWidth="1"/>}
          {/* Symbol held */}
          <text x="100" y="155" textAnchor="middle" fontSize="28" fill={t.accent}
                style={{filter:`drop-shadow(0 0 6px ${t.accent})`}}>{t.icon}</text>
          {/* Staff for Knight */}
          {count === 12 && <line x1="70" y1="90" x2="50" y2="220" stroke={t.accent} strokeWidth="2.5" opacity="0.6"/>}
          {/* Decorative elements */}
          <circle cx="40" cy="50" r="2" fill="#ffd700" opacity="0.3"/>
          <circle cx="160" cy="60" r="1.5" fill="#ffd700" opacity="0.25"/>
        </g>
      )}
    </svg>
  );
}

function getCardSVG(card: TarotCard): React.ReactNode {
  if (card.arcanaType === 'major') {
    if (MajorArcanaSVG[card.cardNumber]) return MajorArcanaSVG[card.cardNumber]();
    return <DefaultMajorSVG card={card}/>;
  }
  return <MinorArcanaSVG card={card}/>;
}

// ==================== CARD COMPONENT ====================
const ROMAN: Record<number, string> = {0:'0',1:'I',2:'II',3:'III',4:'IV',5:'V',6:'VI',7:'VII',8:'VIII',9:'IX',10:'X',11:'XI',12:'XII',13:'XIII',14:'XIV',15:'XV',16:'XVI',17:'XVII',18:'XVIII',19:'XIX',20:'XX',21:'XXI'};
const MINOR_FACE: Record<number, string> = {1:'A',2:'2',3:'3',4:'4',5:'5',6:'6',7:'7',8:'8',9:'9',10:'10',11:'Pg',12:'Kn',13:'Qn',14:'Kg'};

function getTheme(card: TarotCard) {
  if (card.arcanaType === 'major') return {c1:'#c89850', c2:'#e8c878', glow:'rgba(200,152,80,0.35)'};
  const t: Record<string, {c1:string;c2:string;glow:string}> = {
    wands:{c1:'#e86830',c2:'#ff9944',glow:'rgba(232,104,48,0.3)'},
    cups:{c1:'#3a8ae8',c2:'#70b8ff',glow:'rgba(58,138,232,0.3)'},
    swords:{c1:'#8888cc',c2:'#b8b8ee',glow:'rgba(136,136,204,0.3)'},
    pentacles:{c1:'#48a858',c2:'#78d888',glow:'rgba(72,168,88,0.3)'},
  };
  return t[card.suit || 'wands'];
}

// Lightweight card back for deck (no SVG, pure CSS)
function CardBack({w=118, h=182}: {w?: number; h?: number}) {
  return (
    <div className="tc-back-only" style={{width: w, height: h}}>
      <div className="tc-back-glow"/>
      <div className="tc-back-frame"/>
      <div className="tc-back-pattern"/>
      <div className="tc-back-center">
        <div className="tc-back-medallion">
          <div className="tc-back-inner-ring">✦</div>
        </div>
      </div>
      <div className="tc-back-corner-tl"/><div className="tc-back-corner-tr"/>
      <div className="tc-back-corner-bl"/><div className="tc-back-corner-br"/>
    </div>
  );
}

function TarotCardView({card, flipped, reversed, size='normal'}: {
  card: TarotCard; flipped: boolean; reversed?: boolean; size?: 'normal'|'small'|'tiny';
}) {
  const w = size === 'tiny' ? 52 : size === 'small' ? 78 : 118;
  const h = size === 'tiny' ? 82 : size === 'small' ? 122 : 182;
  const th = getTheme(card);

  return (
    <div className={`tc ${flipped ? 'flipped' : ''} ${reversed ? 'reversed' : ''}`}
      style={{'--w': w+'px', '--h': h+'px', '--mc': th.c1, '--gc': th.glow} as any}>
      <div className="tc-inner">
        {/* BACK */}
        <div className="tc-back">
          <div className="tc-back-glow"/>
          <div className="tc-back-frame"/>
          <div className="tc-back-pattern"/>
          <div className="tc-back-center">
            <div className="tc-back-medallion">
              <div className="tc-back-inner-ring">✦</div>
            </div>
          </div>
          <div className="tc-back-corner-tl"/><div className="tc-back-corner-tr"/>
          <div className="tc-back-corner-bl"/><div className="tc-back-corner-br"/>
        </div>
        {/* FRONT with SVG illustration */}
        <div className={`tc-front ${card.arcanaType === 'major' ? 'tc-f-major' : 'tc-f-minor tc-f-'+card.suit}`}>
          <div className="tc-f-outer-frame"/>
          <div className="tc-f-inner-frame"/>
          <div className="tc-f-top">
            {card.arcanaType === 'major'
              ? <span className="tc-f-num-major">{ROMAN[card.cardNumber]}</span>
              : <span className="tc-f-num-minor">{MINOR_FACE[card.cardNumber]}</span>}
          </div>
          <div className="tc-f-art-area">
            <div className="tc-f-svg-art">{getCardSVG(card)}</div>
          </div>
          <div className="tc-f-bottom">
            <div className="tc-f-name" style={{color: th.c1}}>{card.nameZh}</div>
            <div className="tc-f-name-en">{card.nameEn}</div>
          </div>
          <div className="tc-f-deco-tl"/><div className="tc-f-deco-tr"/>
          <div className="tc-f-deco-bl"/><div className="tc-f-deco-br"/>
        </div>
      </div>
    </div>
  );
}

// ==================== DECK ====================
function DeckDrawer({count, onComplete}: {count: number; onComplete: (cards: {card: TarotCard; orientation: string}[]) => void}) {
  const [deck] = useState<TarotCard[]>(() => [...TAROT_CARDS].sort(() => Math.random() - 0.5));
  const [drawn, setDrawn] = useState<{card: TarotCard; orientation: string}[]>([]);
  const [extracted, setExtracted] = useState<Set<number>>(new Set());
  const [revealPhase, setRevealPhase] = useState(false);
  const [revealIdx, setRevealIdx] = useState(-1);

  const pickCard = (idx: number) => {
    if (drawn.length >= count || extracted.has(idx)) return;
    const card = deck[idx];
    if (!card) return;
    const orientation = Math.random() > 0.5 ? 'upright' : 'reversed';
    setExtracted(prev => { const n = new Set(prev); n.add(idx); return n; });
    setDrawn(prev => [...prev, {card, orientation}]);
  };

  const startReveal = () => { setRevealPhase(true); setRevealIdx(0); };
  const nextReveal = () => { if (revealIdx < drawn.length - 1) setRevealIdx(revealIdx + 1); else onComplete(drawn); };

  if (revealPhase && revealIdx >= 0 && revealIdx < drawn.length) {
    const dc = drawn[revealIdx];
    if (!dc?.card) return <div className="loading">加载中...</div>;
    return (
      <div className="reveal-area">
        <div className="reveal-title">翻 开 你 的 命 运 之 牌</div>
        <div className="reveal-sub">第 {revealIdx + 1} / {drawn.length} 张</div>
        <div className="reveal-card-wrap">
          <TarotCardView card={dc.card} flipped={true} reversed={dc.orientation === 'reversed'}/>
        </div>
        <div className="reveal-name">{dc.card.nameZh}</div>
        <div className={`reveal-orient ${dc.orientation}`}>
          {dc.orientation === 'reversed' ? '↓ 逆位' : '↑ 正位'}
        </div>
        <div className="reveal-kw">{(dc.card as any)[dc.orientation]?.keywords?.join(' · ') || ''}</div>
        <button className="btn-reveal" onClick={nextReveal}>
          {revealIdx < drawn.length - 1 ? '翻开下一张' : '查看解读结果'}
        </button>
      </div>
    );
  }

  const EDGE = 9;
  const DECK_W = 130;
  const STACK_W = deck.length * EDGE + DECK_W;

  return (
    <div className="deck-page">
      <div className="deck-top-bar">
        <div className="deck-counter">已选 {drawn.length} / {count}</div>
        <div className="deck-tip">鼠标移到右侧边缘选牌，点击确认抽取</div>
      </div>
      {drawn.length > 0 && (
        <div className="drawn-h-row">
          {drawn.map((d, i) => {
            if (!d?.card) return null;
            return <div key={i} className="drawn-h-slot" style={{animationDelay: i * 0.1 + 's'}}>
              <TarotCardView card={d.card} flipped={false} size="small"/>
            </div>;
          })}
        </div>
      )}
      {deck.length > 0 && drawn.length < count && (
        <div className="h-deck-area">
          <div className="h-deck" style={{width: STACK_W, height: 260}}>
            {deck.map((card, idx) => {
              if (!card || extracted.has(idx)) return null;
              return (
                <div key={card.id}
                  className="h-deck-card"
                  style={{left: idx * EDGE, zIndex: idx + 1}}
                  onClick={() => pickCard(idx)}>
                  <CardBack/>
                  <div className="h-deck-hitzone"/>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {drawn.length === count && <button className="btn-start-reveal" onClick={startReveal}>✦ 开始翻牌 ✦</button>}
    </div>
  );
}

// ==================== STARS ====================
function Stars() {
  const stars = useMemo(() => Array.from({length: 50}, (_, i) => ({
    id: i, l: Math.random() * 100 + '%', t: Math.random() * 100 + '%',
    d: Math.random() * 5 + 's', s: (Math.random() * 2 + 0.5) + 'px', o: Math.random() * 0.4 + 0.05,
  })), []);
  return <div className="stars">{stars.map(s => <div key={s.id} className="star" style={{left: s.l, top: s.t, animationDelay: s.d, width: s.s, height: s.s, opacity: s.o}}/>)}</div>;
}

function Nav({page, setPage}: {page: string; setPage: (p: string) => void}) {
  return <nav className="nav">
    {[{k:'home',i:'🔮',l:'占卜'},{k:'library',i:'📿',l:'牌典'},{k:'history',i:'📜',l:'记录'},{k:'profile',i:'👤',l:'我的'}].map(n => (
      <button key={n.k} className={`nav-item ${page === n.k ? 'active' : ''}`} onClick={() => setPage(n.k)}>
        <span className="nav-icon">{n.i}</span>{n.l}</button>
    ))}</nav>;
}

function LoginPage() {
  const [u, setU] = useState(''); const [p, setP] = useState(''); const [err, setErr] = useState(''); const [ld, setLd] = useState(false);
  const [reg, setReg] = useState(false); const [email, setEmail] = useState(''); const [nick, setNick] = useState('');
  const {login, register} = useAuth();
  const go = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setLd(true);
    try { if (reg) await register(u, email, p, nick || u); else await login(u, p); }
    catch (e: any) { setErr(e.message); } finally { setLd(false); }
  };
  return <div className="auth-page"><Stars/>
    <div className="auth-logo">🔮</div>
    <div className="auth-title">塔罗占卜</div>
    <div className="auth-sub">{reg ? '开启你的塔罗之旅' : '探索命运的奥秘'}</div>
    <form className="auth-form" onSubmit={go}>
      <input className="input" placeholder="用户名" value={u} onChange={e => setU(e.target.value)}/>
      {reg && <input className="input" placeholder="邮箱" value={email} onChange={e => setEmail(e.target.value)}/>}
      {reg && <input className="input" placeholder="昵称" value={nick} onChange={e => setNick(e.target.value)}/>}
      <input className="input" type="password" placeholder="密码" value={p} onChange={e => setP(e.target.value)}/>
      {err && <p style={{color:'var(--error)', fontSize:13, marginBottom:8}}>{err}</p>}
      <button className="btn-primary" disabled={ld}>{ld ? '请稍候...' : reg ? '注册' : '登录'}</button>
      <button className="link-btn" type="button" onClick={() => setReg(!reg)}>{reg ? '已有账号？返回登录' : '还没有账号？立即注册'}</button>
    </form></div>;
}

function HomePage({setPage, setFlowData}: any) {
  const user = useAuth((s: any) => s.user);
  const idx = new Date().getDate() % TAROT_CARDS.length; const daily = TAROT_CARDS[idx];
  const cats = [{k:'love',l:'💕 感情',d:'爱情、关系、桃花运'},{k:'career',l:'💼 事业',d:'工作、学业、发展'},
    {k:'finance',l:'💰 财运',d:'投资、收入、财务'},{k:'health',l:'🌿 健康',d:'身心、养生、状态'},
    {k:'general',l:'✨ 综合',d:'整体运势、日常指引'}];
  return <div className="page">
    <div className="header"><div><div className="header-greeting">你好，{user?.nickname || '探索者'}</div>
      <div className="header-coins">🪙 {user?.coinBalance || 0} 金币</div></div>
      <button className="btn-coin" onClick={() => setPage('profile')}>充值</button></div>
    <div className="daily-card"><div className="daily-label">✨ 每日一牌</div>
      <div className="daily-content">
        <TarotCardView card={daily} flipped={true} size="small"/>
        <div style={{flex:1, paddingLeft:8}}>
          <div style={{fontSize:18, fontWeight:'bold'}}>{daily.nameZh}</div>
          <div style={{fontSize:11, color:'var(--text-muted)'}}>{daily.nameEn}</div>
          <div style={{fontSize:13, color:'var(--gold)', marginTop:8}}>{daily.upright.keywords.join(' · ')}</div>
          <div style={{fontSize:12, color:'var(--text-secondary)', marginTop:6, lineHeight:1.6}}>{daily.upright.general.slice(0, 55)}...</div>
        </div>
      </div></div>
    <div className="section-title">选择占卜方向</div>
    <div className="categories">{cats.map(c => (
      <div key={c.k} className="category-card" onClick={() => {setFlowData({category: c.k}); setPage('question');}}>
        <div className="cat-label">{c.l}</div><div className="cat-desc">{c.d}</div></div>))}</div>
    <div className="section-title">快速入口</div>
    <div className="quick-actions">
      <div className="quick-btn" onClick={() => {setFlowData({category:'general'}); setPage('question');}}>
        <div className="quick-icon">🔮</div><div className="quick-text">快速占卜</div></div>
      <div className="quick-btn" onClick={() => setPage('library')}>
        <div className="quick-icon">📿</div><div className="quick-text">塔罗牌典</div></div></div>
  </div>;
}

function QuestionPage({flowData, setFlowData, setPage}: any) {
  const [q, setQ] = useState('');
  const cn: any = {love:'感情',career:'事业',finance:'财运',health:'健康',general:'综合'};
  const sg: any = {love:['我的感情近期会有什么变化？','我与TA的关系会如何发展？'],
    career:['我的事业发展方向如何？','换工作是否是好的选择？'],finance:['近期财运如何？'],
    health:['近期健康需要注意什么？'],general:['我近期的整体运势如何？','我目前最需要关注什么？']};
  return <div className="page">
    <button className="back-btn" onClick={() => setPage('home')}>← 返回</button>
    <div className="page-title">提出你的问题</div>
    <div className="page-sub">关于{cn[flowData.category] || '综合'}运势</div>
    <textarea className="textarea" placeholder="在此输入你的问题..." value={q} onChange={e => setQ(e.target.value)} maxLength={200}/>
    <div className="char-count">{q.length}/200</div>
    <div style={{color:'var(--text-secondary)', fontSize:13, margin:'12px 0 8px'}}>💡 选择或自定义</div>
    <div className="suggestions">{(sg[flowData.category] || sg.general).map((s: string, i: number) => <div key={i} className="suggest-chip" onClick={() => setQ(s)}>{s}</div>)}</div>
    <button className="bottom-btn" onClick={() => {if (q.trim()) {setFlowData({...flowData, question: q.trim()}); setPage('spread');}}}>下一步 · 选择牌阵</button>
  </div>;
}

function SpreadPage({flowData, setFlowData, setPage}: any) {
  const [tier, setTier] = useState('free');
  const dl: any = {beginner:'入门', intermediate:'进阶', advanced:'高级'};
  return <div className="page">
    <button className="back-btn" onClick={() => setPage('question')}>← 返回</button>
    <div className="page-title">选择牌阵</div>
    <div className="tier-row">
      <div className={`tier-card ${tier === 'free' ? 'active' : ''}`} onClick={() => setTier('free')}>
        <div className="tier-icon">🔮</div><div className="tier-title">免费解读</div>
        <div className="tier-desc">预设规则引擎</div><div className="tier-price">免费</div></div>
      <div className={`tier-card premium ${tier === 'deep' ? 'active' : ''}`} onClick={() => setTier('deep')}>
        <div className="tier-icon">✨</div><div className="tier-title">深度解析</div>
        <div className="tier-desc">AI 智能解读</div><div className="tier-price">🪙 5 金币</div></div></div>
    {SPREADS.map((s: any) => (
      <div key={s.id} className="spread-card" onClick={() => {setFlowData({...flowData, spreadType: s.type, tier, cardCount: s.cardCount}); setPage('draw');}}>
        <div className="spread-header"><span className="spread-name">{s.nameZh}</span>
          <span className={`difficulty ${s.difficulty}`}>{dl[s.difficulty]}</span></div>
        <div className="spread-desc">{s.description}</div>
        <div className="spread-meta">🃏 需要抽取 {s.cardCount} 张牌</div></div>))}
  </div>;
}

function DrawPage({flowData, setPage, setResult}: any) {
  const spread = SPREADS.find((s: any) => s.type === flowData.spreadType) || SPREADS[1];
  const refresh = useAuth((s: any) => s.refresh);
  const [loading, setLoading] = useState(false);
  const handleComplete = async () => {
    setLoading(true);
    try {
      const res: any = await readingApi.create({question: flowData.question, category: flowData.category, spreadType: flowData.spreadType, tier: flowData.tier || 'free'});
      await refresh(); setResult(res.data); setPage('result');
    } catch (e: any) { alert(e.message); } finally { setLoading(false); }
  };
  return <div className="page">
    <button className="back-btn" onClick={() => setPage('spread')}>← 返回</button>
    <div className="page-title" style={{textAlign:'center'}}>{spread.nameZh}</div>
    <div className="page-sub" style={{textAlign:'center'}}>静心冥想你的问题，从牌堆中抽取 {spread.cardCount} 张牌</div>
    <DeckDrawer count={spread.cardCount} onComplete={handleComplete}/>
    {loading && <div className="loading" style={{marginTop:20}}>🔮 解读中...</div>}
  </div>;
}

function ResultPage({result, setPage}: any) {
  const [expanded, setExpanded] = useState<any>({cards: true});
  const [upgrading, setUpgrading] = useState(false);
  const refresh = useAuth((s: any) => s.refresh);
  const toggle = (k: string) => setExpanded((p: any) => ({...p, [k]: !p[k]}));
  const upgrade = async () => {
    if (!confirm('升级AI深度解析将消耗5金币')) return;
    setUpgrading(true);
    try { await readingApi.upgrade(result.id); await refresh(); window.location.reload(); }
    catch (e: any) { alert(e.message); } finally { setUpgrading(false); }
  };
  if (!result?.result) return <div className="loading">加载中...</div>;
  const r = result.result; const drawnCards = result.drawnCards || [];
  const sections = [
    {k:'overall',t:'牌阵整体解读',x:r.overallInterpretation},{k:'div',t:'占卜结果',x:r.divinationResult},
    {k:'adv',t:'建议',x:r.advice},{k:'pro',t:'谶语',x:r.prophecy},
    {k:'fut',t:'未来趋势',x:r.futureTrends},{k:'not',t:'注意事项',x:r.notes}];
  const icon: any = {overall:'🌟',div:'🔮',adv:'💡',pro:'📜',fut:'🌈',not:'⚠️'};
  return <div className="reading-page">
    <button className="back-btn" onClick={() => setPage('home')}>← 返回首页</button>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <div className="page-title">占卜解读</div>
      <span className="tier-badge">{result.tier === 'deep' ? '✨ 深度解析' : '🔮 基础解读'}</span></div>
    <div className="question-card"><div className="q-label">你的问题</div><div className="q-text">{result.question}</div></div>
    <div className="result-cards">{drawnCards.filter((dc: any) => dc?.card).map((dc: any, i: number) => (
      <div key={i} className="result-card-slot">
        <TarotCardView card={dc.card} flipped={true} reversed={dc.orientation === 'reversed'} size="small"/>
        <div className="position-name">{dc.position?.nameZh || ''}</div>
        <div style={{fontSize:10, color: dc.orientation === 'reversed' ? 'var(--error)' : 'var(--success)'}}>
          {dc.orientation === 'reversed' ? '↓ 逆位' : '↑ 正位'}</div></div>))}</div>
    <div className="thinking-card"><div className="thinking-title">🧠 思考过程</div>
      {[['goal','目标'],['progress','进度'],['intent','意图'],['attitude','态度'],['thinking','思考'],['action','行动'],['ability','能力']].map(([k,l]) => (
        <div key={k} className="thinking-row"><span className="thinking-label">（{l}）</span><span className="thinking-value">{r.thinkingProcess[k]}</span></div>))}</div>
    <div className="section-card"><div className="section-header" onClick={() => toggle('cards')}>
      <span className="section-title-text">🃏 牌面解读</span><span className="section-toggle">{expanded.cards ? '▼' : '▶'}</span></div>
      {expanded.cards && <div className="section-content">{r.cardInterpretations.map((ci: any, i: number) => (
        <div key={i} className="card-interp"><div className="interp-title">{ci.positionName}：{ci.cardName}</div>
          <div className="interp-text">{ci.interpretation}</div></div>))}</div>}</div>
    {sections.map(s => <div key={s.k} className="section-card">
      <div className="section-header" onClick={() => toggle(s.k)}>
        <span className="section-title-text">{icon[s.k]} {s.t}</span>
        <span className="section-toggle">{expanded[s.k] ? '▼' : '▶'}</span></div>
      {expanded[s.k] && <div className="section-content"><div className="section-text">{s.x}</div></div>}</div>)}
    {result.tier === 'free' && <button className="upgrade-btn" onClick={upgrade} disabled={upgrading}>✨ 升级为AI深度解析 · 🪙 5金币</button>}
  </div>;
}

function HistoryPage({setPage, setResult}: any) {
  const [items, setItems] = useState<any[]>([]); const [ld, setLd] = useState(true);
  const ce: any = {love:'💕',career:'💼',finance:'💰',health:'🌿',general:'✨'};
  const cl: any = {love:'感情',career:'事业',finance:'财运',health:'健康',general:'综合'};
  useEffect(() => { readingApi.list().then((r: any) => setItems(r.data)).finally(() => setLd(false)); }, []);
  if (ld) return <div className="loading">加载中...</div>;
  return <div className="page"><div className="header"><div className="header-greeting">占卜记录</div></div>
    {items.length === 0 ? <div style={{textAlign:'center', marginTop:60}}><div style={{fontSize:42}}>🔮</div><p style={{color:'var(--text-secondary)', marginTop:12}}>还没有占卜记录</p></div>
    : items.map((r: any) => <div key={r.id} className="history-card" onClick={() => {setResult(r); setPage('result');}}>
      <div className="history-header"><span className="history-cat">{ce[r.category] || '✨'} {cl[r.category] || '综合'}</span>
        <span className="history-date">{new Date(r.createdAt).toLocaleDateString('zh-CN')}</span></div>
      <div className="history-q">{r.question}</div></div>)}</div>;
}

function LibraryPage() {
  const [filter, setFilter] = useState('all'); const [search, setSearch] = useState(''); const [sel, setSel] = useState<any>(null);
  const [orient, setOrient] = useState<'upright'|'reversed'>('upright');
  const list = TAROT_CARDS.filter((c: any) => {
    if (filter === 'major' && c.arcanaType !== 'major') return false;
    if (filter === 'minor' && c.arcanaType !== 'minor') return false;
    if (search && !c.nameZh.includes(search) && !c.nameEn.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  if (sel) { const card = sel; const m = card[orient];
    return <div className="page">
      <button className="back-btn" onClick={() => setSel(null)}>← 返回牌典</button>
      <div style={{display:'flex', justifyContent:'center', marginBottom:16}}>
        <TarotCardView card={card} flipped={true} reversed={orient === 'reversed'}/></div>
      <div className="orientation-toggle">
        <button className={`orient-btn ${orient === 'upright' ? 'active' : ''}`} onClick={() => setOrient('upright')}>正位 ↑</button>
        <button className={`orient-btn ${orient === 'reversed' ? 'active' : ''}`} onClick={() => setOrient('reversed')}>逆位 ↓</button></div>
      <div className="keywords">{m.keywords.map((k: string, i: number) => <span key={i} className="keyword">{k}</span>)}</div>
      <div className="section-card"><div className="section-content" style={{paddingTop:14}}>
        {[['牌面描述', card.description],['象征意义', card.symbolism],['综合', m.general],['感情', m.love],['事业', m.career],['财运', m.finance],['健康', m.health]].map(([t,v], i) => (
          <React.Fragment key={i}><div style={{color:'var(--gold)', fontWeight:'bold', margin: i === 0 ? '0 0 6px' : '12px 0 6px'}}>{t}</div>
            <div className="section-text">{v}</div></React.Fragment>))}</div></div></div>;
  }
  return <div className="page"><div className="header"><div className="header-greeting">塔罗牌典</div></div>
    <div className="page-sub">探索78张塔罗牌</div>
    <input className="search-input" placeholder="搜索牌名..." value={search} onChange={e => setSearch(e.target.value)}/>
    <div className="filter-row">{[['all','全部'],['major','大阿卡那'],['minor','小阿卡那']].map(([k,l]) => (
      <button key={k} className={`filter-tab ${filter === k ? 'active' : ''}`} onClick={() => setFilter(k!)}>{l}</button>))}</div>
    <div style={{color:'var(--text-muted)', fontSize:11, marginBottom:8}}>共 {list.length} 张牌</div>
    <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, paddingBottom:20}}>
      {list.map((card: any) => <div key={card.id} style={{textAlign:'center', cursor:'pointer'}} onClick={() => setSel(card)}>
        <TarotCardView card={card} flipped={true}/>
        <div style={{fontSize:11, color:'var(--text-secondary)', marginTop:4}}>{card.nameZh}</div></div>)}</div></div>;
}

function ProfilePage({setPage}: any) {
  const {user, logout} = useAuth();
  return <div className="page"><div className="header"><div className="header-greeting">个人中心</div></div>
    <div className="profile-card"><div className="avatar">🔮</div>
      <div className="nickname">{user?.nickname || '探索者'}</div><div className="username">@{user?.username}</div></div>
    <div style={{display:'flex', gap:12, marginBottom:20, alignItems:'center'}}>
      <div style={{flex:1, background:'var(--bg-card)', border:'1px solid var(--border-gold)', borderRadius:12, padding:14, textAlign:'center'}}>
        <div style={{fontSize:20, color:'var(--gold)', fontWeight:'bold'}}>🪙 {user?.coinBalance || 0}</div>
        <div style={{fontSize:11, color:'var(--text-muted)', marginTop:4}}>金币余额</div></div>
      <button className="btn-coin" style={{padding:'14px 24px'}}>充值</button></div>
    <div className="menu-item" onClick={() => setPage('history')}>
      <span className="menu-icon">📜</span><span className="menu-label">占卜记录</span><span className="menu-arrow">›</span></div>
    <div className="menu-item" onClick={() => setPage('library')}>
      <span className="menu-icon">📿</span><span className="menu-label">塔罗牌典</span><span className="menu-arrow">›</span></div>
    <button className="btn-logout" onClick={logout}>退出登录</button></div>;
}

export default function App() {
  const {authed, loading, restore} = useAuth();
  const [page, setPage] = useState('home');
  const [flowData, setFlowData] = useState<any>({});
  const [result, setResult] = useState<any>(null);
  useEffect(() => { restore(); }, []);
  if (loading) return <div className="loading" style={{minHeight:'100vh'}}>加载中...</div>;
  if (!authed) return <LoginPage/>;
  const P: any = {
    home: <HomePage setPage={setPage} setFlowData={setFlowData}/>,
    question: <QuestionPage flowData={flowData} setFlowData={setFlowData} setPage={setPage}/>,
    spread: <SpreadPage flowData={flowData} setFlowData={setFlowData} setPage={setPage}/>,
    draw: <DrawPage flowData={flowData} setPage={setPage} setResult={setResult}/>,
    result: <ResultPage result={result} setPage={setPage}/>,
    history: <HistoryPage setPage={setPage} setResult={setResult}/>,
    library: <LibraryPage/>,
    profile: <ProfilePage setPage={setPage}/>,
  };
  const nav = ['home','library','history','profile'].includes(page);
  return <div className="app"><Stars/><div style={{position:'relative', zIndex:1}}>{P[page] || P.home}</div>
    {nav && <Nav page={page} setPage={setPage}/>}</div>;
}
