import { Link } from 'wouter';
import { ArrowDown, ArrowRight, Check, CircleDot, ShieldCheck, Workflow, Zap } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const steps = [
  { n: '01', title: 'Notice the break.', text: 'Every run is watched. When a workflow drifts, the signal is captured with its logs, context and blast radius.' },
  { n: '02', title: 'Understand the why.', text: 'A diagnosis connects the failure to its likely cause, then proposes a small, reviewable correction.' },
  { n: '03', title: 'Recover with proof.', text: 'Your team stays in control. Approve the patch, retry the run, and verify the system is healthy again.' },
];

export default function Story() {
  const storyRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: storyRef, offset: ['start start', 'end end'] });
  const rotateX = useTransform(scrollYProgress, [0, .25, .58, 1], [-16, 13, -8, 18]);
  const rotateY = useTransform(scrollYProgress, [0, .32, .7, 1], [-20, 14, -10, 19]);
  const ringRotateZ = useTransform(scrollYProgress, [0, 1], [-8, 28]);
  const lift = useTransform(scrollYProgress, [0, .28, .62, 1], [0, -42, 24, 90]);
  const scale = useTransform(scrollYProgress, [0, .26, .62, 1], [.78, 1.04, .9, .72]);
  const glow = useTransform(scrollYProgress, [0, .3, .72, 1], [.35, .9, .62, .24]);
  const methodDepth = useTransform(scrollYProgress, [.14, .32, .55], [54, 0, -24]);
  const methodTilt = useTransform(scrollYProgress, [.14, .32, .55], [5, 0, -2]);
  const guardrailDepth = useTransform(scrollYProgress, [.38, .58, .78], [48, 0, -18]);
  const calloutLift = useTransform(scrollYProgress, [.64, .82, 1], [30, 0, -12]);

  return <main ref={storyRef} className="story-shell story-grain overflow-x-clip">
    <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
      <a href="/" className="flex items-center gap-3 text-sm font-extrabold tracking-tight"><span className="grid size-9 place-items-center rounded-xl bg-[#41D9C5] text-[#0C2029]"><Workflow size={19}/></span> SELF / HEALING</a>
      <nav className="hidden items-center gap-8 text-xs text-[#c3d5d0] md:flex"><a href="#method" className="hover:text-white">How it works</a><a href="#guardrails" className="hover:text-white">Guardrails</a><span className="mono text-[10px] text-[#9bb0ad]">SYSTEM STATUS · OPERATIONAL</span></nav>
      <Link href="/console" className="flex items-center gap-2 rounded-full bg-[#41D9C5] px-4 py-2.5 text-xs font-bold text-[#0C2029] transition hover:bg-[#75ead9]">Open command center <ArrowRight size={14}/></Link>
    </header>

    <section className="relative min-h-[210vh]">
      <div className="sticky top-0 flex h-[100dvh] min-h-[650px] items-center overflow-hidden">
        <div className="story-grid absolute inset-0 opacity-60"/>
        <div className="absolute left-[7%] top-[20%] hidden mono text-[10px] uppercase tracking-[.2em] text-[#a3b7b1] md:block">Autonomous recovery / 01</div>
        <motion.div style={{ opacity: reduceMotion ? .3 : glow }} className="absolute right-[12%] top-[24%] size-[32vw] max-size-[420px] rounded-full bg-[#41D9C5]/10 blur-[70px]"/>
        <div className="relative z-[1] mx-auto grid w-full max-w-[1380px] items-center gap-6 px-6 pb-16 pt-12 md:grid-cols-[1.1fr_.9fr] md:px-14">
          <motion.div className="max-w-[700px]" initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .75, ease: [.2, .8, .2, 1] }}>
            <div className="mb-8 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.2em] text-[#41D9C5]"><span className="pulse-dot size-2 rounded-full bg-[#41D9C5]"/> Built for the moment after failure</div>
            <h1 className="display rise text-[clamp(3.5rem,8vw,7.8rem)] leading-[.91]">When systems<br/>stumble, <span className="text-[#41D9C5]">recover.</span></h1>
            <p className="mt-8 max-w-[490px] text-base leading-7 text-[#c0d0cb] md:text-lg">A recovery layer for the workflows your business depends on. See what broke. Know why. Choose what happens next.</p>
            <div className="mt-9 flex flex-wrap items-center gap-4"><Link href="/console" className="flex items-center gap-3 rounded-full bg-[#41D9C5] px-6 py-4 text-sm font-bold text-[#0C2029] transition hover:bg-[#75ead9]">Explore the console <ArrowRight size={16}/></Link><a href="#method" className="flex items-center gap-2 px-3 py-4 text-sm text-[#c0d0cb]">See the system <ArrowDown size={15}/></a></div>
          </motion.div>
          <div className="story-scene story-depth relative h-[550px] md:h-[680px]" aria-label="Scroll-reactive 3D recovery system visualization">
            <div className="absolute right-1 top-[8%] mono text-[9px] leading-6 tracking-[.12em] text-[#9bb0ad]">SIMULATED TELEMETRY<br/><span className="text-[#41D9C5]">RUN / 08F2</span></div>
            <motion.div style={reduceMotion ? { scale: .9 } : { y: lift, scale, rotateX, rotateY, transformPerspective: 1100 }} className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d] md:h-[500px] md:w-[500px]">
              <motion.div style={reduceMotion ? { rotateX: 70 } : { rotateX: 70, rotateZ: ringRotateZ }} className="scene-orb absolute inset-[4%]"/>
              <div className="scene-orb absolute inset-[10%] [transform:rotateY(70deg)] border-[#d9ebe5]/35"/>
              <div className="scene-orb absolute inset-[17%] [transform:rotateX(55deg)_rotateY(25deg)] border-[#41D9C5]/65"/>
              <div className="scene-core absolute left-1/2 top-1/2 size-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full"/>
              <div className="absolute left-[8%] top-[27%] grid size-10 place-items-center rounded-xl border border-[#41D9C5]/30 bg-[#17343d] text-[#41D9C5] shadow-xl"><Zap size={17}/></div>
              <div className="absolute bottom-[20%] right-[8%] grid size-10 place-items-center rounded-xl border border-[#41D9C5]/30 bg-[#17343d] text-[#41D9C5]"><ShieldCheck size={17}/></div>
              <div className="absolute left-[23%] top-[78%] grid size-8 place-items-center rounded-full bg-[#bdf5e9] text-[#0C2029]"><Check size={15}/></div>
            </motion.div>
            <div className="absolute bottom-[8%] left-[4%] w-[190px] border-l border-[#41D9C5]/60 pl-4"><div className="mono text-[9px] tracking-[.15em] text-[#9bb0ad]">RECOVERY LOOP</div><div className="mt-2 text-sm font-semibold">Observe → Explain → Repair</div></div>
            <div className="absolute bottom-[13%] right-[2%] flex items-center gap-2 rounded-full border border-white/10 bg-[#17313a]/90 px-3 py-2 text-[10px] text-[#d5e3dc] backdrop-blur"><CircleDot size={12} className="text-[#41D9C5]"/> Workflow simulation</div>
          </div>
        </div>
        <div className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 mono text-center text-[9px] tracking-[.2em] text-[#9bb0ad]">SCROLL TO TRACE A RECOVERY</div>
      </div>
    </section>

    <motion.section id="method" style={reduceMotion ? undefined : { y: methodDepth, rotateX: methodTilt, transformPerspective: 1200 }} className="story-depth relative border-t border-[#224252]/20 bg-[#E4E8DE] px-6 py-24 text-[#0C2029] md:px-14 md:py-32">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="mono text-[10px] uppercase tracking-[.2em] text-[#16796e]">A calmer kind of incident response</p><h2 className="display mt-5 max-w-[700px] text-5xl leading-[.98] md:text-7xl">Recovery should be<br/>a <span className="text-[#16796e]">controlled sequence.</span></h2></div><p className="max-w-[300px] text-sm leading-6 text-[#435c5b]">No black-box fixes. Each action has a reason, a human boundary and a verification step.</p></div>
        <div className="grid border-t border-[#b8c9c1] md:grid-cols-3">{steps.map((step, i) => <motion.article key={step.n} initial={reduceMotion ? false : { opacity: 0, y: 26, rotateY: -5 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, rotateY: 0 }} viewport={{ once: true, amount: .35 }} transition={{ duration: .55, delay: i * .1 }} className="story-depth-card border-b border-[#b8c9c1] py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"><div className="mono text-xs text-[#16796e]">{step.n} / 0{i + 1}</div><h3 className="display mt-8 text-3xl">{step.title}</h3><p className="mt-4 max-w-[300px] text-sm leading-6 text-[#526764]">{step.text}</p></motion.article>)}</div>
      </div>
    </motion.section>

    <motion.section id="guardrails" style={reduceMotion ? undefined : { y: guardrailDepth, transformPerspective: 1200 }} className="story-depth relative overflow-hidden px-6 py-24 md:px-14 md:py-32">
      <div className="story-grid absolute inset-0 opacity-50"/><div className="relative mx-auto grid max-w-[1240px] gap-14 md:grid-cols-[.85fr_1.15fr] md:items-center">
        <motion.div initial={reduceMotion ? false : { opacity: 0, x: -24 }} whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true, amount: .35 }} transition={{ duration: .6 }}><p className="mono text-[10px] uppercase tracking-[.2em] text-[#41D9C5]">Trust is an operating principle</p><h2 className="display mt-5 text-5xl leading-[.98] md:text-7xl">The human stays<br/>in the <span className="text-[#41D9C5]">loop.</span></h2><p className="mt-6 max-w-[420px] text-sm leading-7 text-[#c0d0cb]">Set approval rules per workflow. Inspect the diagnosis and patch. Approve or reject with a clear audit trail. Then verify the retry.</p></motion.div>
        <motion.div initial={reduceMotion ? false : { opacity: 0, y: 34, rotateX: 8 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .7, ease: [.2, .8, .2, 1] }} className="relative rounded-[22px] border border-white/10 bg-[#17313a] p-5 shadow-2xl md:p-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-5"><div><div className="mono text-[9px] tracking-[.15em] text-[#9bb0ad]">INCIDENT / SH-2048</div><div className="mt-2 text-lg font-semibold">Payload contract changed</div></div><span className="rounded-full bg-[#f2b75a]/15 px-3 py-1 text-[10px] text-[#f2b75a]">AWAITING APPROVAL</span></div>
          <div className="grid gap-5 py-6 md:grid-cols-2"><div><div className="mono text-[9px] tracking-widest text-[#9bb0ad]">ROOT CAUSE</div><p className="mt-2 text-xs leading-5 text-[#d1dfd9]">The downstream event now expects `account_ref`; this workflow still sends `account_id`.</p></div><div><div className="mono text-[9px] tracking-widest text-[#9bb0ad]">PROPOSED PATCH</div><p className="mt-2 text-xs leading-5 text-[#d1dfd9]">Map account_id → account_ref before dispatch. No unrelated fields changed.</p></div></div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5"><div className="flex items-center gap-2 text-[10px] text-[#41D9C5]"><ShieldCheck size={15}/> Example diagnosis · 94% confidence</div><div className="flex gap-2"><span className="rounded-lg border border-white/15 px-4 py-2 text-xs text-[#d8e3dd]">Reject</span><span className="rounded-lg bg-[#41D9C5] px-4 py-2 text-xs font-bold text-[#0C2029]">Approve recovery</span></div></div>
        </motion.div>
      </div>
    </motion.section>
    <motion.section style={reduceMotion ? undefined : { y: calloutLift }} className="bg-[#41D9C5] px-6 py-20 text-[#0C2029] md:px-14 md:py-28"><div className="mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-8 md:flex-row md:items-end"><div><p className="mono text-[10px] uppercase tracking-[.2em]">Start with one workflow</p><h2 className="display mt-4 text-5xl leading-[.95] md:text-7xl">Make the next failure<br/>a little less dramatic.</h2></div><Link href="/console" className="flex items-center gap-3 rounded-full bg-[#0C2029] px-6 py-4 text-sm font-bold text-[#E4E8DE] transition hover:bg-[#224252]">Enter the command center <ArrowRight size={16}/></Link></div></motion.section>
    <footer className="flex flex-col justify-between gap-3 px-6 py-7 text-[10px] text-[#9bb0ad] md:flex-row md:px-14"><span>SELF / HEALING — AUTONOMOUS RECOVERY SYSTEM</span><span className="mono">OBSERVABILITY WITH A WAY BACK.</span></footer>
  </main>;
}
