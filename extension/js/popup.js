$(document).ready(function () {

    $('#findBestMoveButtonWhite').on('click', async function () {
        await findBestMove('white')
    });

    $('#findBestMoveButtonBlack').on('click', async function () {
        await findBestMove('black')
    });

    let interpreters = allInterpreters();

    async function findBestMove(turn) {
        let currentTab = await getCurrentTab();

        // Try to match interpreter
        let matchedInterpreter = null;
        for (const interpreter of interpreters) {
            if (currentTab.url.includes(interpreter.originDomain)) {
                matchedInterpreter = interpreter;
                break;
            }
        }
        if (matchedInterpreter === null) {
            showAlert('error', 'Undefined Website', "We doesn't support this website!")
            return;
        }

        if (!matchedInterpreter.isInMatchFunc(currentTab)) {
            showAlert('error', 'Incorrect Page', "You're not in a match now!")
            return;
        }

        let boardHtml = await sendMessageToContent('getBoard', {xpath: matchedInterpreter.xpathOfBoard});
        if (boardHtml === null) {
            unknownError("capturing board data from the page");
            return;
        }

        let gameState = null;
        try {
            gameState = matchedInterpreter.extractGameState(boardHtml);
        } catch (e) {
            unknownError("extracting state of the game");
            return;
        }

        const requestBody = {
            cells: gameState,
            turn: turn
        }
        console.log(requestBody);
        $.ajax({
            url: "http://localhost:8000/best_move",
            type: "POST",
            data: JSON.stringify(requestBody),
            contentType: "application/json",
            success: function (response) {
                const bestMove = response['best_move']
                if (bestMove === null) {
                    showAlert('error', 'No result!', "Ai can't help you!");
                    return;
                }
                const fromCell = bestMove.substring(0, 2);
                const toCell = bestMove.substring(2, 4);
                const resultMessage = 'From ' + fromCell + ' To ' + toCell;
                showAlert('success', resultMessage);
            },
            error: function (xhr, status, error) {
                unknownError("requesting to backend api, " + xhr);
            }
        });
    }
});


function getCurrentTab() {
    return new Promise(function (resolve) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            const currentTab = tabs[0];
            resolve(currentTab);
        });
    });
}

function showAlert(icon, title, text) {
    let alertArgs = {
        icon: icon,
        title: title,
        text: text,
        confirmButtonText: 'OK'
    }
    sendMessageToContent('showAlert', alertArgs);
}

function sendMessageToContent(action, args) {
    return new Promise(function (resolve) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: action, args: args}, function (response) {
                resolve(response);
            });
        });
    });
}

function unknownError(when) {
    showAlert('error', 'Oops...', "Unknown error occurred when " + when + ".")
}