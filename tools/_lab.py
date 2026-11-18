import json, sys
K = sys.argv[1]
L = json.load(open(f'src/{K}.json'))
print(",".join(f"{s['u']}{s['set'][:7]}{'C' if s['close'] else ''}" for s in L['shots']))
