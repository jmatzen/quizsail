from pprint import pprint
import json

with open('data1.txt','r') as f:
    state = 0
    questions = []
    for line in f.readlines():
#        print(state,line)
        if state==0:
            q = line.strip()
            choices=[]
            answers=[]
            state = 1
        elif state==1:
            if '---' in line:
                state=2
            else: 
                choices.append(line.strip())
        elif state==2:
            if '===' in line:
                state=0
                questions.append({
                    'q': q,
                    'c': choices,
                    'a': answers
                })
            else: 
                answers.append(line.strip())
    print(json.dumps(questions, indent=3))


