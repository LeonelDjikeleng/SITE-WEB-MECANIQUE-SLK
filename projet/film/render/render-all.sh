#!/bin/bash
# Rendu parallèle (3 processus) puis assemblage sans réencodage. Usage : render-all.sh h|v principal|court sortie.mp4 [dpr]
set -e
MODE=$1; CUT=$2; OUT=$3; DPR=${4:-2}; FPS=30
D=$(dirname "$OUT")/parts-$MODE-$CUT; mkdir -p "$D"; rm -f "$D"/*.mp4
DUR=$(node -e "const c={principal:42,court:15}; console.log(c['$CUT'])")
TOTAL=$(python3 -c "print(round($DUR*$FPS))"); K=3; STEP=$(( (TOTAL + K - 1) / K ))
for i in 0 1 2; do A=$((i*STEP)); Z=$(( (i+1)*STEP )); node "$(dirname "$0")/render.mjs" $MODE $CUT "$D/p$i.mp4" $FPS $DPR $A $Z & done
wait
printf "file '%s'\n" "$D"/p0.mp4 "$D"/p1.mp4 "$D"/p2.mp4 > "$D/list.txt"
ffmpeg -y -loglevel error -f concat -safe 0 -i "$D/list.txt" -c copy "$OUT"
ffprobe -v error -show_entries stream=width,height,nb_frames -of csv=p=0 "$OUT"
