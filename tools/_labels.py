import json, sys
L = json.load(open('src/shots_%s.json' % sys.argv[1]))
print(",".join("%d%s%s" % (s['u'], s['set'][:7], 'C' if s.get('close') else '') for s in L['shots']))
