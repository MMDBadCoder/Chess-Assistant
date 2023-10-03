const Interpreter = class {
    originDomain;
    isInMatchFunc;
    xpathOfBoard;
    extractGameState;

    constructor(originDomain, isInMatchFunc, xpathOfBoard, extractGameState) {
        this.originDomain = originDomain;
        this.isInMatchFunc = isInMatchFunc;
        this.xpathOfBoard = xpathOfBoard;
        this.extractGameState = extractGameState;
    }
}

const allInterpreters = function () {
    return [
        get_lichess_interpreter(),
    ]
}