"""Assemble la vidéo et la musique avec normalisation EBU R128 en deux passes. Usage : mux.py video.mp4 audio.wav sortie.mp4 [lufs]
Écrit aussi sortie.norm.wav : le mixage maître normalisé (crête vraie −3 dBTP avant tout encodage avec perte),
qui sert ensuite à encoder l'Opus des WebM sans repasser par l'AAC."""
import json, subprocess, sys
v, a, out = sys.argv[1:4]; I = float(sys.argv[4]) if len(sys.argv) > 4 else -16.0
TP = -3.0
r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', a, '-af', f'loudnorm=I={I}:TP={TP}:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
m = json.loads(r[r.rindex('{'):r.rindex('}') + 1])
af = (f"loudnorm=I={I}:TP={TP}:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
      f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,aresample=48000")
wav = out.rsplit('.', 1)[0] + '.norm.wav'
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', a, '-af', af, '-c:a', 'pcm_s24le', wav], check=True)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', v, '-i', wav, '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
                '-c:a', 'aac', '-b:a', '320k', '-ar', '48000', '-shortest', '-movflags', '+faststart',
                '-metadata', 'title=Mécanique SKL · film de démonstration', '-metadata', 'comment=Rendu graphique 4K natif (pixels natifs, aucune mise à l’échelle). Musique originale.', out], check=True)
print('ok', out, wav)
