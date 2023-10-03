chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("Message action: " + request.action);
    console.log("Message args: " + request.args);
    if (request.action === 'showAlert') {
        Swal.fire(request.args);
        sendResponse({status: true});
    } else if (request.action === 'getBoard') {
        sendResponse(getBoard(request.args.xpath))
    } else {
        sendResponse({status: false});
    }
});


function getBoard(xpath) {
    console.log("Xpath: " + xpath);
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.outerHTML;
}