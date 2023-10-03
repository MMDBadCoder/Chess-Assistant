from typing import List

from pydantic import BaseModel


class ResponseModel(BaseModel):
    best_move: str


class ChessCell(BaseModel):
    x: int
    y: int
    color: str
    element: str


class RequestModel(BaseModel):
    cells: List[ChessCell]
    turn: str

    def to_fen(self):

        fen = ""
        empty_count = 0

        for rank in range(7, -1, -1):
            for file in range(8):
                cell = next((cell for cell in self.cells if cell.x == file and cell.y == rank), None)
                if cell:
                    if empty_count > 0:
                        fen += str(empty_count)
                        empty_count = 0
                    element = cell.element[0]
                    fen += element.upper() if cell.color == "white" else element.lower()
                else:
                    empty_count += 1

            if empty_count > 0:
                fen += str(empty_count)
            if rank > 0:
                fen += "/"

            empty_count = 0

        fen += f" {self.turn[0].lower()} - - 0 1"  # Assuming white to move
        return fen
