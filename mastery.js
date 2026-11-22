/* Math Genius V3.7 mastery + adaptive scaffold (hints/guided) + learning-path engine.
   Additive & backward-compatible with V3.1–V3.6 learner evidence. */
(function(){
  const DAY=86400000,INTERVALS=[1,3,7,14,30],clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

  // Rough pedagogical order / skill groups for Grade 3 path
  const PATH_GROUPS=[
    {id:'number',title:'Number sense',vi:'Cảm nhận số',ids:['place','words','pattern','round','digits','moreless']},
    {id:'addsub',title:'Addition & Subtraction',vi:'Cộng trừ',ids:['sumdiff','add','sub','mentaladd','estimate','morethan','wbword','twostep']},
    {id:'multables',title:'Multiplication tables',vi:'Bảng nhân',ids:['mdreview','t6','t7','t8','t9','tblword']},
    {id:'multdiv',title:'Multiplication & Division',vi:'Nhân chia',ids:['qr','mdh','mdsign','mdlong','mdword']},
    {id:'measure',title:'Measurement & Money',vi:'Đo lường & Tiền',ids:['money','lenm','lenkm','lenus','mass','lboz','cap','gal']},
    {id:'datafrac',title:'Data, Fractions & Geometry',vi:'Dữ liệu, Phân số & Hình học',ids:['bar','tabdata','frac','equiv','time','time2','angle','area','perim']}
  ];

  // Soft prerequisites (topic -> list of recommended prior topics)
  const PREREQ={
    twostep:['add','sub'], wbword:['add','sub'], mdlong:['mdreview','t6','t7','t8','t9'],
    mdword:['mdreview','t6','t7'], tblword:['t6','t7','t8','t9'],
    estimate:['add','sub'], morethan:['add','sub'],
    equiv:['frac'], area:['perim'], perim:['lenm'],
    qr:['mdreview'], mdh:['mdreview']
  };

  const evidence=(D,id)=>{D.skillEvidence=D.skillEvidence||{};return D.skillEvidence[id]||(D.skillEvidence[id]={attempts:[],streak:0,interval:-1,nextReviewAt:0,lastAt:0});};

  function record(D,q,correct,hints,level,errorType){
    if(!q||!q.tid)return;
    const e=evidence(D,q.tid),now=Date.now();
    const attempt={at:now,correct:!!correct,hints:clamp(+hints||0,0,3),level:clamp(+level||1,1,4)};
    if(errorType)attempt.errorType=String(errorType);
    e.attempts.push(attempt);
    if(e.attempts.length>40)e.attempts=e.attempts.slice(-40);
    e.streak=correct?(e.streak||0)+1:0;
    e.lastAt=now;
    // Lightweight knowledge-component tallies from error reflections
    if(!correct&&errorType){
      e.kc=e.kc||{};
      e.kc[errorType]=(e.kc[errorType]||0)+1;
    }
    if(correct){
      e.interval=Math.min(INTERVALS.length-1,Math.max(0,(e.interval||0)+(hints?0:1)));
      e.nextReviewAt=now+INTERVALS[e.interval]*DAY;
    }else{
      e.interval=0;
      e.nextReviewAt=now+DAY;
    }
    D.skillEvidence[q.tid]=e;
    D.dailyLearning=D.dailyLearning||{};
    const key=new Date(now-new Date(now).getTimezoneOffset()*60000).toISOString().slice(0,10);
    const day=D.dailyLearning[key]||(D.dailyLearning[key]={answered:0,correct:0});
    day.answered++;
    if(correct)day.correct++;
    const keys=Object.keys(D.dailyLearning).sort();
    keys.slice(0,Math.max(0,keys.length-90)).forEach(k=>delete D.dailyLearning[k]);
  }

  function assess(D,id){
    const raw=(D.skillEvidence||{})[id],a=raw&&Array.isArray(raw.attempts)?raw.attempts:[];
    if(!a.length){
      const legacy=(D.tp||{})[id]||{},n=legacy.t||0,pct=n?Math.round((legacy.c||0)/n*100):0;
      return {status:n>=3?'developing':'emerging',label:n?'Previous progress':'Starting',pct,attempts:n,due:false,confidence:n?'Legacy totals; detailed evidence starts in V3.1':'Need more evidence',hintRate:n?(legacy.hints||0)/(3*n):0,streak:0,legacy:true};
    }
    const recent=a.slice(-12),n=recent.length,correct=recent.filter(x=>x.correct).length,pct=n?Math.round(correct/n*100):0;
    const hintRate=n?recent.reduce((s,x)=>s+(x.hints||0),0)/(3*n):0;
    const age=raw?.lastAt?Date.now()-raw.lastAt:Infinity;
    const due=!!raw?.nextReviewAt&&raw.nextReviewAt<=Date.now();
    let status='emerging',label='Starting',confidence='Need more evidence';
    if(n>=5&&pct>=80&&hintRate<=.25&&(raw.streak||0)>=2){status='secure';label='Secure';confidence='Consistent evidence';}
    else if(n>=3){status='developing';label='Developing';confidence='Building evidence';}
    if(due||(age>21*DAY&&n>0)){status='review';label='Review due';}
    return {status,label,pct,attempts:n,due,confidence,hintRate,streak:raw?.streak||0};
  }

  function recommendedLevel(D,id){
    const v=assess(D,id);
    if(v.legacy){
      const p=(D.tp||{})[id]||{},n=p.t||0,a=n?Math.round((p.c||0)/n*100):0,h=n?(p.hints||0)/(3*n):0;
      if(n<5)return 1;
      if(a>=90&&h<.2&&(D.err?.[id]||0)<=1&&n>=8)return 4;
      if(a>=85&&h<.35)return 3;
      if(a>=65)return 2;
      return 1;
    }
    if(v.attempts<5)return 1;
    if(v.status==='secure'&&v.pct>=95&&v.hintRate<.12)return 4;
    if(v.pct>=85&&v.hintRate<.3)return 3;
    if(v.pct>=65)return 2;
    return 1;
  }

  /** Adaptive level for the *next* question inside a live session.
      sessionStats = {correct, total, hints, recentCorrectStreak} */
  function adaptiveLevel(D,id,sessionStats){
    let base=recommendedLevel(D,id);
    if(!sessionStats||!sessionStats.total)return base;
    const {correct=0,total=0,hints=0,recentCorrectStreak=0}=sessionStats;
    const acc=total?correct/total:0;
    const hintRate=total?hints/(3*total):0;
    if(total>=3){
      if(acc>=0.85&&hintRate<0.15&&recentCorrectStreak>=2)base=Math.min(4,base+1);
      else if(acc<0.5||hintRate>0.45)base=Math.max(1,base-1);
      else if(acc<0.65)base=Math.max(1,base-1);
    }
    return base;
  }

  function dailyProgress(D){
    const now=Date.now(),key=new Date(now-new Date(now).getTimezoneOffset()*60000).toISOString().slice(0,10);
    const d=(D.dailyLearning||{})[key]||{};
    return {done:d.answered||0,goal:D.dailyGoal||10,correct:d.correct||0};
  }

  function recommend(D,T){
    const ranked=T.map(t=>({t,v:assess(D,t.id)})).sort((a,b)=>{
      const score=x=>(x.v.due?100:0)+(x.v.attempts?Math.max(0,80-x.v.pct):50)+(x.v.status==='emerging'?15:0);
      return score(b)-score(a);
    });
    const top=ranked[0];
    return top?{id:top.t.id,title:top.t.t,reason:top.v.due?'scheduled review':top.v.attempts?`${top.v.pct}% recent accuracy`:'new skill'}:null;
  }

  function summary(D,T){
    const all=T.map(t=>assess(D,t.id));
    return {
      secure:all.filter(x=>x.status==='secure').length,
      developing:all.filter(x=>x.status==='developing').length,
      emerging:all.filter(x=>x.status==='emerging').length,
      due:all.filter(x=>x.due||x.status==='review').length,
      needsSupport:all.filter(x=>x.status==='emerging'||x.status==='review'||(x.status==='developing'&&x.pct<60)).length
    };
  }

  /** Build a short ordered learning path (next 4–6 recommended topics). */
  function getLearningPath(D,T){
    const byId=Object.fromEntries(T.map(t=>[t.id,t]));
    const assessed=T.map(t=>({t,v:assess(D,t.id)}));
    const path=[];
    const seen=new Set();

    // 1. Due reviews first
    assessed.filter(x=>x.v.due||x.v.status==='review')
      .sort((a,b)=>(a.v.pct||0)-(b.v.pct||0))
      .forEach(x=>{if(!seen.has(x.t.id)){path.push({...x,reason:'Review due'});seen.add(x.t.id);}});

    // 2. Weak developing / emerging that have prerequisites mostly ready
    const weak=assessed.filter(x=>!seen.has(x.t.id)&&(x.v.status==='emerging'||(x.v.status==='developing'&&x.v.pct<70)))
      .sort((a,b)=>{
        // Prefer topics whose prereqs are secure/developing
        const prereqScore=id=>{
          const pr=PREREQ[id]||[];
          if(!pr.length)return 1;
          const ready=pr.filter(p=>{const v=assess(D,p);return v.status==='secure'||v.status==='developing'||v.attempts>=3;}).length;
          return ready/pr.length;
        };
        return prereqScore(b.t.id)-prereqScore(a.t.id)||(a.v.pct||0)-(b.v.pct||0);
      });
    weak.forEach(x=>{if(path.length<6&&!seen.has(x.t.id)){path.push({...x,reason:x.v.attempts?`Needs practice (${x.v.pct}%)`:'New skill'});seen.add(x.t.id);}});

    // 3. Fill from path groups in order if still short
    for(const g of PATH_GROUPS){
      for(const id of g.ids){
        if(path.length>=6)break;
        if(seen.has(id)||!byId[id])continue;
        const v=assess(D,id);
        if(v.status==='secure'&&!v.due)continue;
        path.push({t:byId[id],v,reason:v.attempts?'Continue path':'Next in sequence'});
        seen.add(id);
      }
    }
    return path.slice(0,6);
  }

  /** Parent-friendly overview by skill group */
  function parentOverview(D,T){
    const groups=PATH_GROUPS.map(g=>{
      const items=g.ids.map(id=>{
        const topic=T.find(t=>t.id===id);
        if(!topic)return null;
        const v=assess(D,id);
        return {id,title:topic.t,vi:topic.vi,v};
      }).filter(Boolean);
      const secure=items.filter(i=>i.v.status==='secure').length;
      const developing=items.filter(i=>i.v.status==='developing').length;
      const needs=items.filter(i=>i.v.status==='emerging'||i.v.status==='review'||(i.v.status==='developing'&&i.v.pct<60)).length;
      const avgPct=items.length?Math.round(items.reduce((s,i)=>s+(i.v.pct||0),0)/items.length):0;
      return {...g,items,secure,developing,needs,avgPct,total:items.length};
    });
    return groups;
  }

  function needsSupportList(D,T,limit=8){
    return T.map(t=>({t,v:assess(D,t.id)}))
      .filter(x=>x.v.status==='emerging'||x.v.status==='review'||(x.v.status==='developing'&&x.v.pct<65)||x.v.due)
      .sort((a,b)=>{
        const score=x=>(x.v.due?30:0)+(x.v.status==='emerging'?20:0)+(x.v.status==='review'?25:0)+Math.max(0,70-(x.v.pct||0));
        return score(b)-score(a);
      })
      .slice(0,limit);
  }


  /**
   * Adaptive scaffolding decision from live session stats + topic history.
   * Returns intensity 0–3 and concrete UI flags.
   * 0 = independent / minimal help
   * 1 = light (normal)
   * 2 = supported (guided-like, first hint ready)
   * 3 = strong support (auto first hint, encourage tutor, softer difficulty already handled elsewhere)
   */
  function adaptiveScaffold(D,id,sessionStats){
    const v=assess(D,id||'');
    const s=sessionStats||{correct:0,total:0,hints:0,recentCorrectStreak:0};
    const total=s.total||0, acc=total?s.correct/total:1, hintRate=total?s.hints/(3*Math.max(1,total)):0;
    const streak=s.recentCorrectStreak||0;
    let intensity=1; // default light
    let reason='steady';

    // Strong struggle signals
    if(total>=2 && (acc<0.4 || (acc<0.55 && hintRate>0.4) || streak===0 && total>=3 && acc<0.6)){
      intensity=3; reason='struggling';
    } else if(total>=2 && (acc<0.65 || hintRate>0.3 || (v.status==='emerging'&&acc<0.75))){
      intensity=2; reason='needs support';
    } else if(total>=3 && acc>=0.85 && hintRate<0.15 && streak>=2){
      intensity=0; reason='confident';
    } else if(total>=2 && acc>=0.75 && hintRate<0.25){
      intensity=1; reason='steady';
    }

    // Topic history can nudge up support
    if(v.status==='emerging'||v.status==='review'||(v.hintRate||0)>0.35){
      intensity=Math.min(3,intensity+1);
      if(reason==='steady')reason='topic needs support';
    }
    if(v.status==='secure'&&v.pct>=90&&intensity>=2&&acc>=0.7){
      intensity=Math.max(0,intensity-1);
    }

    return {
      intensity, // 0–3
      reason,
      forceGuided: intensity>=2,
      autoFirstHint: intensity>=3,
      maxHints: intensity>=3?3:intensity===0?2:3,
      encourageTutor: intensity>=2,
      reduceScaffold: intensity===0,
      label: intensity===0?'Independent':intensity===1?'Light support':intensity===2?'Guided support':'Strong support'
    };
  }


  /** Dominant knowledge-component weakness for a topic (from error reflections). */
  function topKnowledgeGap(D,id){
    const e=(D.skillEvidence||{})[id];
    if(!e||!e.kc)return null;
    const entries=Object.entries(e.kc).sort((a,b)=>b[1]-a[1]);
    if(!entries.length)return null;
    const labels={calculation:'Calculation slips',read_question:'Misread questions',operation_choice:'Wrong operation',concept:'Concept gap',unsure:'Unsure'};
    return {type:entries[0][0],count:entries[0][1],label:labels[entries[0][0]]||entries[0][0]};
  }

  /** Whether prerequisites for a topic are mostly ready (for path unlock UI). */
  function prereqReady(D,id){
    const pr=PREREQ[id]||[];
    if(!pr.length)return {ready:true,ratio:1,missing:[]};
    const missing=[];
    let ok=0;
    pr.forEach(p=>{
      const v=assess(D,p);
      if(v.status==='secure'||(v.status==='developing'&&v.pct>=60)||v.attempts>=5)ok++;
      else missing.push(p);
    });
    return {ready:ok>=Math.ceil(pr.length*0.6),ratio:pr.length?ok/pr.length:1,missing};
  }

  /** Learning path enriched with unlock status + KC gap. */
  function getLearningPathDetailed(D,T){
    const base=getLearningPath(D,T);
    return base.map(item=>{
      const id=item.t.id;
      const unlock=prereqReady(D,id);
      const gap=topKnowledgeGap(D,id);
      return {...item,unlock,gap};
    });
  }

  window.MGMastery={
    record,assess,recommendedLevel,adaptiveLevel,adaptiveScaffold,dailyProgress,recommend,summary,
    getLearningPath,getLearningPathDetailed,parentOverview,needsSupportList,PATH_GROUPS,
    topKnowledgeGap,prereqReady
  };
})();
