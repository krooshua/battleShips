import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  /**
   * L = [3]
   * I = 4
   * dots shaped = 1
   */
  private ships: Array<number|Array<number>> = [[3], 4, 1, 1];

  /**
   * Game Board
   */
  public gameBoard: Array<Array<number>>;

  public shipsHit: number = 0;
  public gameOver: boolean = false;

  public gameLog: Array<{target: string, status: string}> = [];

  public cords: string = 'ABCDEFGHIJ';

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if(!this.gameOver) this.fire();
  }

  constructor() {
    this.setEmptyGameBoard();
    this.setShips();
  }

  setShips() {
    this.ships.forEach(ship => {
      this.setShip(ship);
    })
  }

  setShip(ship) {
    let overlap: boolean = false;
    let map = this.gameBoard.slice(0);

    /**
     * Chek if L shaped
     */
    let isL = ship.constructor === Array ? true : false;
    ship = isL ? ship[0] : ship;

    /**
     * direction: 0 - horizontal, 1 - vertical
     */
    let direction: number = Math.round(Math.random()); 
    let x: number = this.generateRandomInteger(1, 8 - Number(ship));
    let y: number = this.generateRandomInteger(1, 8 - Number(ship)); 

    /**
     * Check if overlap
     */
    for (let i = -1; i <= ship; i++) {
      if (direction == 1) {
        if (!(map[y+i][x-1] != 1 && map[y+i][x] != 1 && map[y+i][x+1] != 1)) {
          overlap = true;
          break;
        }   
      } else {
        if (!(map[y-1][x+i] != 1 && map[y][x+i] != 1 && map[y+1][x+i] != 1)) {
          overlap = true;
          break;
        } 
      }
    }  

    if(overlap) {
      this.setShip(ship);
    } else {
      /**
       * Set ship to gameboard
       */
      for (let i = -1; i <= ship; i++) {
        if (direction == 1) {
          if (i > -1 && i < Number(ship)) map[y+i][x] = 1; 
          if (isL && i == ship) {
            map[y+i-1][x+1] = 1; 
          }
        } else {
          if (i > -1 && i < Number(ship)) map[y][x+i] = 1; 
          if (isL && i == ship) {
            map[y-1][x+i-1] = 1; 
          }
        }
      }
      this.gameBoard = map.slice(0);
    }  
  }

  generateRandomInteger(min, max) {
    return Math.floor(min + Math.random()*(max+1 - min))
  }

  fire() {
    let x: number = this.generateRandomInteger(0, 9);
    let y: number = this.generateRandomInteger(0, 9);
    if (this.gameBoard[y][x] == 0 || this.gameBoard[y][x] == 1) {
      if (this.gameBoard[y][x] == 0) {
        this.gameBoard[y][x] = 2;
        this.addToLog(this.cords[y] + (x+1).toString() ,'Miss');
      }
      if (this.gameBoard[y][x] == 1) {
        this.gameBoard[y][x] = 3;
        this.shipsHit++;
        if (this.shipsHit == 10) this.gameOver = true;
        this.addToLog(this.cords[y] + (x+1).toString() ,'Hit');
      }
    } else {
      this.fire();
    }
  }

  addToLog(target: string, message: string) {
    this.gameLog.push({
      target: target,
      status: message
    })
  }

  setEmptyGameBoard() {
    this.gameBoard = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
  }

  restart() {
    this.gameOver = false;
    this.shipsHit = 0;
    this.gameLog = [];
    this.setEmptyGameBoard();
    this.setShips();
  }

}
