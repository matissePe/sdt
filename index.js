function clean(s) {
    return s.replace(/(<([^>]+)>)/gi, "").replace(/ /g, "").replace(/\"/g, "").replace(/&nbsp;/g, "").replace(/\n/g, "").replace(/,/g, "").trim().toUpperCase().replace(/S/g, "")
}

document.addEventListener('dblclick', () => {

    let question = document.getElementsByClassName("qtext")

    if (question.length > 0) {
        question = clean(question[0].innerHTML)

        fetch(chrome.runtime.getURL('is.json')) 
            .then(file => file.json())
            .then(file => {
                
                responses = file[question]

                responses.forEach(response => {
                    let answerProp = document.getElementsByClassName("answer")[0].children
                    
                    for (let i = 0; i < answerProp.length; i++) {
                        let prop = clean(answerProp[i].children[2].children[1].children[0].innerHTML)

                        if (prop == response) {
                            answerProp[i].children[1].checked = true
                            break;
                        }
                    }
                });
            })
    }
});