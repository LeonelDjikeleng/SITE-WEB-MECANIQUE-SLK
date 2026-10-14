"""Musique et design sonore originaux du film Mécanique SKL (composés par code, aucun échantillon tiers).
Usage : python3 audio.py principal|court sortie.wav
120 bpm : les coupes du montage tombent sur les temps (0,5 s)."""
import sys, wave
import numpy as np

SR = 48000
CUTS = {
    'principal': [('hook', 3.5), ('identity', 5.5), ('general', 4.5), ('tires', 4.5), ('rec', 4.5), ('manifest', 6), ('promise', 6), ('cta', 7.5)],
    'court': [('hook', 2), ('identity', 3.5), ('general', 1.5), ('tires', 1.5), ('rec', 1.5), ('cta', 4.5)],
}
name, out = sys.argv[1], sys.argv[2]
cut = CUTS[name]
DUR = sum(d for _, d in cut)
N = int(DUR * SR) + SR
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)
t_all = np.arange(N) / SR

def add(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N: return
    sig = sig[:N - i] * gain
    L[i:i + len(sig)] += sig * np.sqrt(0.5 * (1 - pan))
    R[i:i + len(sig)] += sig * np.sqrt(0.5 * (1 + pan))

def env(n, a=0.005, r=0.3, curve=4.0):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / r * curve / 4)
    return e

def lowpass(x, fc):
    # filtre récursif simple à un pôle, appliqué deux fois
    a = np.exp(-2 * np.pi * fc / SR)
    for _ in range(2):
        y = np.empty_like(x); acc = 0.0
        for k in range(len(x)):
            acc = (1 - a) * x[k] + a * acc; y[k] = acc
        x = y
    return x

def lp_fast(x, fc):
    # passe-bas par FFT (rapide pour les longues nappes)
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / np.sqrt(1 + (f / fc) ** 4)
    return np.fft.irfft(X, len(x))

def hp_fast(x, fc):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= (f / fc) ** 2 / np.sqrt(1 + (f / fc) ** 4)
    return np.fft.irfft(X, len(x))

def kick(g=1.0):
    n = int(.45 * SR); t = np.arange(n) / SR
    f = 46 + 90 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7.5) * g * .62

def boom():
    n = int(2.6 * SR); t = np.arange(n) / SR
    f = 34 + 60 * np.exp(-t * 6)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.6)
    nz = lp_fast(rng.standard_normal(n), 900) * np.exp(-t * 9) * .35
    return s + nz

def clap():
    n = int(.25 * SR); t = np.arange(n) / SR
    nz = hp_fast(rng.standard_normal(n), 1200)
    e = np.exp(-t * 26) + 0.6 * np.exp(-np.maximum(t - .012, 0) * 30) * (t > .012)
    return nz * e * .5

def hat(g=1.0):
    n = int(.06 * SR); t = np.arange(n) / SR
    return hp_fast(rng.standard_normal(n), 7000) * np.exp(-t * 80) * .25 * g

def tick():   # tic de lampe d'inspection
    n = int(.12 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 2350 * t) * .5 + np.sin(2 * np.pi * 3520 * t) * .3) * np.exp(-t * 55) * .6

def ratchet(clicks=7, rate=26):   # cliquet de clé
    out = np.zeros(int((clicks / rate + .1) * SR))
    for c in range(clicks):
        n = int(.018 * SR); t = np.arange(n) / SR
        s = hp_fast(rng.standard_normal(n), 2500) * np.exp(-t * 400) * (0.9 - c * .05)
        i = int(c / rate * SR); out[i:i + n] += s
    return out * .9

def whoosh(d=1.6, up=True):
    n = int(d * SR); t = np.arange(n) / SR
    nz = rng.standard_normal(n)
    nz = lp_fast(nz, 2200)
    shape = np.sin(np.pi * t / d) ** 2 if not up else (t / d) ** 2.2
    return nz * shape * .35

def stamp():
    n = int(.6 * SR); t = np.arange(n) / SR
    f = 70 + 120 * np.exp(-t * 40)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 10) + lp_fast(rng.standard_normal(n), 1500) * np.exp(-t * 35) * .4) * .9

def pen(d=0.4):
    n = int(d * SR); t = np.arange(n) / SR
    nz = hp_fast(rng.standard_normal(n), 3000) * (0.5 + 0.5 * np.sin(2 * np.pi * 9 * t) ** 2)
    return nz * np.sin(np.pi * t / d) * .12

def bell(f0=880.0, d=3.5):
    n = int(d * SR); t = np.arange(n) / SR
    s = sum(a * np.sin(2 * np.pi * f0 * m * t) * np.exp(-t * k) for a, m, k in [(1, 1, 1.2), (.5, 2.01, 2.2), (.3, 2.76, 3), (.2, 5.4, 5)])
    return s * .18 * np.minimum(1, t / .004)

def pad(freqs, d, g=.12, fc=1400, attack=1.2, release=1.5):
    n = int(d * SR); t = np.arange(n) / SR
    s = np.zeros(n)
    for f in freqs:
        for det in (-0.12, 0.0, 0.11):
            ff = f * 2 ** (det / 12)
            ph = rng.random() * 2 * np.pi
            s += (2 * ((ff * t + ph / (2 * np.pi)) % 1) - 1) * .33   # dents de scie douces
    s = lp_fast(s, fc)
    e = np.minimum(1, t / attack) * np.minimum(1, (d - t) / release).clip(0)
    return s * e * g * 1.9 / max(1, len(freqs))

def bass(f, d, g=.32):
    n = int(d * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + .25 * np.sin(2 * np.pi * 2 * f * t)
    return s * np.minimum(1, t / .01) * np.exp(-t * 1.4) * g

# accords (la mineur → fa → do → sol), fréquences
A2, C3, E3, F2, G2, A3, C4, E4, F3, G3, B3, D4 = 110, 130.81, 164.81, 87.31, 98, 220, 261.63, 329.63, 174.61, 196, 246.94, 293.66
CHORDS = [(A2, [A3, C4, E4]), (F2, [F3, A3, C4]), (C3, [G3, C4, E4]), (G2, [G3, B3, D4])]

starts = {}; acc = 0
for n_, d in cut:
    starts[n_] = (acc, d); acc += d

# ---- ouverture ----
add(boom(), 0.02, .9)
h0, hd = starts['hook']
add(whoosh(hd - .3, up=False), .35, .9, pan=-.3)          # trait de lumière
add(whoosh(1.4, up=True), max(0, hd - 1.4), .7)            # montée vers la coupe

# ---- nappe + groove ----
groove_from = starts['identity'][0]
groove_to = starts['manifest'][0] if 'manifest' in starts else starts['cta'][0]
full_to = starts['cta'][0]
bar = 2.0
k = 0; t = groove_from
while t < full_to - 1e-6:
    root, ch = CHORDS[(k // 2) % 4]
    d = min(bar, full_to - t)
    add(pad(ch, d + 1.4, g=.16 if t < groove_to else .2, fc=1100 if t < groove_to else 1600, attack=.6, release=1.2), t, 1.0)
    add(bass(root, d, g=.3 if t >= groove_from + 2 else .18), t, 1.0)
    for b in range(4):
        tb = t + b * .5
        if tb >= full_to: break
        if b % 2 == 0: add(kick(.9 if t < groove_to else .7), tb)
        if t >= starts['general'][0] and t < groove_to:
            if b % 2 == 1: add(clap(), tb, .55, pan=.1)
            for e in range(2): add(hat(.8 if e else .5), tb + e * .25, 1.0, pan=.25)
    k += 1; t += bar

# ---- accents synchronisés aux images ----
i0, idd = starts['identity']; add(ratchet(), i0 + 1.1, .7, pan=-.2)
g0, gd = starts['general']
for i in range(5):
    p = .12 + i * .16
    if p * gd * .9 < gd: add(tick(), g0 + p * gd * .9, .8, pan=-.4 + i * .2)
add(ratchet(5, 30), starts['tires'][0] + .1, .6, pan=.2)
add(ratchet(6, 24), starts['rec'][0] + .1, .6, pan=-.2)
if 'manifest' in starts:
    m0, _ = starts['manifest']
    for i in range(3): add(kick(.5), m0 + .3 + i * 1.25, 1.0); add(tick(), m0 + .3 + i * 1.25, .35)
if 'promise' in starts:
    p0, pd = starts['promise']
    for i in range(4): add(pen(.35), p0 + .9 + i * .35, 1.0, pan=.3)
    add(stamp(), p0 + 2.62, .8)
    add(whoosh(1.0, up=True), p0 + pd - 1.0, .45)

# ---- carte finale : résolution en do majeur, cloche ----
c0, cd = starts['cta']
add(pad([C3 * 2, E3 * 2, G3 * 2, C4 * 2], cd + .2, g=.34, fc=2000, attack=.25, release=2.5), c0, 1.0)
add(bass(C3, 3.2, .3), c0)
add(kick(.6), c0)
add(bell(523.25, 4), c0 + 1.9, 1.6, pan=-.15)
add(bell(783.99, 4), c0 + 2.05, 1.0, pan=.2)

# ---- mixage ----
mix = np.stack([L, R], 1)[:int(DUR * SR)]
fade = int(.9 * SR); mix[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 1.5
mix /= max(1e-9, np.abs(mix).max()) / .89
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('ok', out, round(DUR, 2), 's')
