const get_lichess_interpreter = function () {
    function isInMatch(currentTab) {
        return true;
    }

    function extractGameState(boardHtml) {
        const board = document.createElement('div');
        board.innerHTML = boardHtml;
        const widthStr = board.children[0].style.getPropertyValue('width');
        const width = parseInt(widthStr.substring(0, widthStr.length - 2));
        const cellLength = width / 8;

        let result = [];

        const squares = board.children[0].children[0].children;
        const chessElements = ['pawn', 'queen', 'king', 'bishop', 'knight', 'rook'];
        const regex = /-?\d+\.?\d*/g; // Regular expression to match numerical x and y values
        for (const square of squares) {
            const XYValues = square.style.transform.match(regex);
            const x = parseInt(XYValues[0]) / cellLength;
            const y = parseInt(XYValues[1]) / cellLength;

            const classList = square.classList;
            let color = null;
            if (classList.contains('black')) {
                color = 'black';
            } else if (classList.contains('white')) {
                color = 'white';
            } else {
                continue;
            }

            let currentElement = null;
            for (const chessElement of chessElements) {
                if (classList.contains(chessElement)) {
                    currentElement = chessElement;
                }
            }
            if (currentElement === null) {
                continue;
            }

            result.push({
                x: x,
                y: y,
                color: color,
                element: currentElement
            });
        }
        return result;
    }

    return new Interpreter(
        "lichess.org",
        isInMatch,
        "//*[@id=\"main-wrap\"]/main/div[1]/div[1]/div/cg-container",
        extractGameState
    );
};