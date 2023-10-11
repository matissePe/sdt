function clean(s) {
    return s.replace(/(<([^>]+)>)/gi, "").replace(/ /g, "").replace(/\"/g, "").replace(/&nbsp;/g, "").replace(/\n/g, "").replace(/,/g, "").trim().toUpperCase().replace(/S/g, "");
}

function extractProp(prop) {
    return prop.children[2]
        ? clean(prop.children[2].children[1].children[0].innerHTML)
        : clean(prop.children[1].children[1].children[0].innerHTML);
}

function extractSelectorProp(prop) {
    return clean(prop.children[0].children[0].innerHTML);
}

document.addEventListener('dblclick', () => {

    let question = document.getElementsByClassName("qtext")

    if (question.length > 0) {
        question = clean(question[0].innerHTML)

        fetch(chrome.runtime.getURL('is.json'))
            .then(file => file.json())
            .then(file => {

                responses = file[question];

                if (responses) {
                    selector = false;

                    if (typeof responses === 'object' && responses.length === undefined) {
                        responses = Object.keys(responses);
                        selector = true;
                    }

                    responses.forEach(response => {
                        answerProp = selector
                            ? document.getElementsByClassName("answer")[0].children[0].children
                            : document.getElementsByClassName("answer")[0].children;

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

                                if (prop == response) {
                                    answerProp[i].children[1].checked = true;
                                    answerProp[i].children[0].checked = true;
                                }
                            }
                        }
                    });
                }
            })
    }
});