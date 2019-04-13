from pprint import pprint
import json

items=[]

with open('prea.txt','r') as f:
    state = 0
    item = None
    for line in f.readlines():
        line = line.rstrip()
        if (len(line)==0):
            continue
        if line.startswith('Question'):
            if item!=None:
                items.append(item)
            item={}
            ofs = line.index(':')+1
            item['q'] = line[ofs:].lstrip()
            item['c'] = []
        elif line.startswith(' '):
            if line[1]=='*':
                item['a'] = [line[4:]]
                item['c'].append(line[4:])
            else:
                item['c'].append(line[3:])
        else:
            item['q']+='<BR>'+line
    items.append(item)

print(json.dumps(items,indent=2))
