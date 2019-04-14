
let inputs = [];
let labels = {};

var state = null;
var content = null;

const source=getParam('src') || 'c857';
const allowQuickComplete = parseInt(getParam('quick')) || 1;

const MAX_WORKING = 10;

function start() {
    console.log("starting!", getParam('session'));

    let session = getParam('session')

    if (session==null) {
        session = makeid(128);
        document.location=document.location+`&session=${session}`;
        return;
    }

    fetch(`${source}.json`)
        .then((res)=>res.json())
        .then(json=>{
            content = json;
            const session = getParam('session');
            return fetch(`state/${session}`);
        })
        .then((res)=>{
            console.log(res.status);
            if (res.status==404) {
                state = {
                    complete: [],
                    working: [],
                    unseen: []
                }
                // initialize unseen array
                for (let  i = 0; i != content.length; ++i) {
                    state.unseen.push({index: i, count: 0, tries: 0});
                }
                show();
                return;
            }
            return res.json();
        })
        .then(json=>{
            if (json) {
                state=json;
                show();    
            }
        });

}

function show() {
    // if the working set is at max, grab a question fro the working set
    if (state.working.length==MAX_WORKING) {
        const nextid = Math.floor(Math.random()*state.working.length/2);
        const nextitem = state.working.splice(nextid, 1);
        state.working.push(nextitem[0]);
    
    }
    // else grab a question from the unseen set
    // only if there is not working set or the current item as been tried
    else if (state.working.length==0||cur().ref.tries>0) {
        if (state.working.length < MAX_WORKING && !state.unseen.empty()) {
            let randomUnseen = Math.floor(Math.random() * state.unseen.length);
            let item = state.unseen.splice(randomUnseen, 1)[0];
            state.working.push(item);
        }
    }
    


    saveState(()=>{
            
        E("stats").html = `mastered: ${state.complete.length} <BR>`
            + `in-flight:  ${state.working.length}<BR>`
            + `unseen: ${state.unseen.length}`;
        inputs = {};
        labels = {};

        const currentItem = cur();
        
        E("question").html = `${currentItem.item.q}`;
        E("choice_form").html = null;
        E("result").html = null;

        // shuffle choices
        shuffle(currentItem.item.c);

        const numChoices = currentItem.item.c.length;
        const numAnswers = currentItem.item.a.length;

        currentItem.item.c.forEach((val,index)=>{
            const div = New("DIV");
            div.attr("class", "input")
            if (numAnswers>1) {
                const input = New("INPUT")
                    .attr("type", "checkbox")
                    .attr("id", `radio_${index}`)
                    .attr("value", val)
                    .attr("name", `answer_${index}`);
                inputs[val] = input;
                const label = New("LABEL")
                    .attr("for", `radio_${index}`);
                label.text = val;
                labels[val] = label;
                div.append(input);
                div.append(label);
            } else {
                if (numChoices>1) {
                    const input = New("INPUT")
                        .attr("type", "radio")
                        .attr("id", `radio_${index}`)
                        .attr("value", val)
                        .attr("name", `answer`);
                    const label = New("LABEL")
                        .attr("for", `radio_${index}`);
                    label.text = val;
                    div.append(input);
                    div.append(label);
                    labels[val] = label;
                    inputs[val] = input;
                } else {
                    inputs = New("INPUT")
                        .attr("type", "text")
                        .attr("id", "answer")
                        .attr("autocomplete", "off")
                        .attr("name", "answer");
                    const label = New("DIV");
                    label.text = currentItem.item.c;
                    div.append(label);
                    div.append(inputs);
                }
                
            }
            E("choice_form").append(div);
        });
        E("choice_form")
        .child("DIV")
            .attr("id", "submit")
            .child("INPUT")
                .attr("value","Submit")
                .attr("type","button")
                .attr("id","submitbtn")
                .attr("onclick","submitAnswer()");
    });

}

/**
 * return reference to current question
 */
function cur() {
    if (state.working.empty()) {
        return null;
    }
    let questionRef = state.working[state.working.length-1];
    return state.working.empty() ? null : {
        item: content[questionRef.index],
        ref: questionRef
    }
}

function submitAnswer() {
    console.log('submit!')
    const currentItem = cur();
    const item = currentItem.item;
    const answers = item.a;
    const numChoices = currentItem.item.c.length;
    const numAnswers = answers.length;

    let correct = true;

    if (numAnswers==1 && numChoices==1) {
        // handle the case where there was only one correct answer
        // and only once choice, which means the answer
        // had to be typed in.
        console.log(inputs.value.toUpperCase());
        if (inputs.value.toUpperCase()!==currentItem.item.a[0].toUpperCase()) {
            correct = false;
            inputs.e.style.backgroundColor = 'red';
        } else {
            inputs.e.style.backgroundColor = '#009f00';            
        }
    } else {
        // first, make sure all of the correct were checked true
        answers.forEach((val,i)=>{
            if (inputs[val].checked===false) {
                correct = false;
                labels[val].e.style.color = '#009f00';
            } else {
                labels[val].e.style.color = 'red';
            }
        });
        // second make sure none of the checked answers are incorrect
        console.log(answers);
        for (i in inputs) {
            console.log(i, inputs[i].checked, answers.includes(i));
            if (inputs[i].checked) {
                if ( answers.includes(i)) {
                    labels[i].e.style.color = '#009f00';                
                } else {
                    correct = false;
                    labels[i].e.style.color = 'red';
                        
                }
            } else {

            }
        }

    }
    console.log(`answer is ${correct}`)
    E("result").text = correct ? "CORRECT!" : `WRONG! The correct answer is ${answers}`;
    E("submitbtn").attr("onclick", 'show()').value = "Next Question";
    if (!('tries' in currentItem.ref)) {
        currentItem.ref.tries = 0;
    }
    ++currentItem.ref.tries;
    if (correct===true) {
        if (allowQuickComplete===1 && currentItem.ref.tries===1) {
            currentItem.ref.count=3;
        } else
         {
            currentItem.ref.count+=1;
        }
        if (currentItem.ref.count>=3) {
            state.complete.push(currentItem.ref);
            state.working.pop();
        }
    } else {
        currentItem.ref.count = 0;
    }
}

class Element {
    constructor (e) {
        this.e = e;
    }
    set html(val) {
        this.e.innerHTML = val;
    }
    set text(val) {
        this.e.innerText = val;
    }
    set value(val) {
        this.e.value = val;
    }
    attr(key,val)  {
        this.e.setAttribute(key, val);
        return this;
    }
    append(elem) {
        this.e.appendChild(elem.e);
        return this;
    }
    child(type) {
        const e = document.createElement(type);
        this.e.appendChild(e);
        return new Element(e);
    }
    set visible(val) {
        if (val===true) {
            this.e.style.display = "block";
        } else if (val===false) {
            this.e.style.display = "none";
        }
    }
    get value() {
        return this.e.value;
    }
    get checked() {
        return this.e.checked;
    }
}


function New(type) {
    return new Element(document.createElement(type));
}

function E(id) {
    return new Element(document.getElementById(id));
}

function sessionName() {
    return E('session_name').value;
}

function log(...args) {
    console.log(args.concat.apply);
}

Array.prototype.empty =  function() {
    return this.length==0;
}

function shuffle(a) {
    console.log(a);
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function getParam(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
       return decodeURIComponent(name[1]);
 }

 function saveState(callback) {
    const session = getParam('session');
    fetch(`state/${session}`, {
        method: 'POST',
        cache: 'no-cache',
        headers: { 'content-type': 'application/json'},
        body: JSON.stringify(state)
    }).then((req)=>{
        if (req.status==200)  {
            // show();
            callback();
        }
    });
 }

 function makeid(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }