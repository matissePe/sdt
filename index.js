function clean(s) {
    return s.replace(/(<([^>]+)>)/gi, "").replace(/ /g, "").replace(/\"/g, "").replace(/&nbsp;/g, "").replace(/\n/g, "").replace(/,/g, "").trim().toUpperCase().replace(/S/g, "");
}

function cleanQuestion(q) {
    return clean(q).replace(/[0-9]RÉPONECORRECTE$/g, "").replace(/[0-9]RÉPONE$/g, "").replace(/PLUIEURRÉPONE$/g, "").replace(/\(PLUIEURBONNERÉPONE\)/g, "").replace(/&AMP;/g, "").replace(/-/g, "")
}

function extractProp(prop) {
    if (prop.children[2] && prop.children[2].children[1].children[0] != undefined) {
        return clean(prop.children[2].children[1].children[0].innerHTML);
    }
    else if (prop.children[2] && prop.children[2].children[1] != undefined) {
        return clean(prop.children[2].children[1].innerHTML);
    }
    else if (prop.children[1].children.length != 0 && prop.children[1].children[1].children[0] != undefined) {
        return clean(prop.children[1].children[1].children[0].innerHTML);
    }
    else if (prop.children[1].children[1] != undefined && prop.children[1].children[1].innerHTML) {
        return clean(prop.children[1].children[1].innerHTML);
    }
    else {
        return clean(prop.children[1].innerHTML);
    }
}

function extractSelectorProp(prop) {
    return clean(prop.children[0].children[0].innerHTML);
}

let file = null;
fetch("https://raw.githubusercontent.com/matissePe/sdt/moodle-ubs/is.json")
    .then(f => f.json())
    .then(f => file = f);

document.addEventListener('dblclick', () => {
    let questions = document.getElementsByClassName("qtext");

    for (let qIndex in questions) {
        const question = cleanQuestion(questions[qIndex].innerHTML);
        responses = file[question];
        console.log(question);

        if (responses) {
            selector = false;

            if (typeof responses === 'object' && responses.length === undefined) {
                responses = Object.keys(responses);
                selector = true;
            }

            responses.forEach(response => {
                answerProp = selector
                    ? document.getElementsByClassName("answer")[qIndex].children[0].children
                    : document.getElementsByClassName("answer")[qIndex].children;

                for (let i = 0; i < answerProp.length; i++) {

                    // if selector menu
                    if (selector) {
                        let prop = extractSelectorProp(answerProp[i]);
                        if (prop == response) {
                            responseSelector = file[question][response];
                            selectorPropositions = answerProp[i].children[1].children[1].children;

                            for (let j = 0; j < selectorPropositions.length; j++) {
                                if (clean(selectorPropositions[j].innerHTML) == responseSelector) {
                                    selectorPropositions[j].selected = true;
                                }
                            }
                        }
                    }

                    // if radio button or checkbox
                    else {
                        let prop = extractProp(answerProp[i]);
                        console.log(prop);

                        if (prop == response) {
                            answerProp[i].children[1].checked = true;
                            answerProp[i].children[0].checked = true;
                        }
                    }
                }
            });
        }
    }
});
