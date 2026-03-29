// ── AUDIO / SOUND EFFECTS ─────────────────────────────────────────────────
// Web Audio API sound effects for correct/wrong answer feedback

export function playSound(correct){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    const osc=ctx.createOscillator();
    const gain=ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    if(correct){
      osc.type='sine'; osc.frequency.value=660;
      gain.gain.setValueAtTime(0.25,ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.5);
      osc.start(); osc.stop(ctx.currentTime+0.5);
    } else {
      osc.type='sawtooth'; osc.frequency.value=180;
      gain.gain.setValueAtTime(0.18,ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.35);
      osc.start(); osc.stop(ctx.currentTime+0.35);
    }
  }catch(e){}
}
