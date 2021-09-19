import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props){
  return (
    <button className="square" onClick={props.onClick}> 
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i,k) {
    // Render Square components by lines
    let line=[];
    for(let j=i; j<k;j++){ 
      line.push(<Square
                  key={j} 
                  value={this.props.squares[j]}
                  onClick={()=>{this.props.onClick(j)}}    
                />)
      }
    return line;
    }
  // Create an array contains line-arrays containing Square components 
  drawBoard(start,end,rows){
    let newSquareLine;
    const board = [];
    for(let i=0;i<rows;i++){
      newSquareLine = this.renderSquare(start,end);
      start+=rows;
      end+=rows;
      board.push(newSquareLine)
    }
    return board
  }

  render() {
    // Render board-array by Array.map
    let board=this.drawBoard(0,10,this.props.stateBoard.length);
    return (
      board.map((squareLine, index)=>{
        return(
          <div key = {index} className="board-row">
            {squareLine}
          </div>
        )
      }))
  }
}
   
class Game extends React.Component {
  constructor(props){
    super(props);
    this.state={
      history:[{
        squares:Array(100).fill(null),
      }],
      xIsNext:true,
      stateBoard:Array(10),
      setpNumber:0,
    };
  }
  
  // Method for onClick callback
  handleClick(i){
    const history = this.state.history.slice(0, this.state.setpNumber+1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let xIsNext;
    if(squares[i]==="X" || squares[i]==="O"){
      return
    }
    squares[i]=this.state.xIsNext ? "X" : "O";
    xIsNext = !this.state.xIsNext;
    this.setState({
      history:history.concat([{
        squares:squares,
      }]), 
      setpNumber: history.length,
      xIsNext:xIsNext, 
    });
  }

  // Create a sync board to the rendered game-board, used as the base of judgment of victory or defeat   
  setCompareBoard(squares, lineNumber,squareNumInLine){
    let compareBoard=this.state.stateBoard.slice();
    let temp=0;
    for(let i=0;i<lineNumber;i++){  
      compareBoard[i]=new Array(squareNumInLine)  
      for(let j=0;j<squareNumInLine;j++){
        if(squares[j+temp]==="X"||squares[j+temp]==="O"){
          compareBoard[i][j]=squares[j+temp]
        }else{
          compareBoard[i][j]=(j+temp); 
        }
      }
      temp+=squareNumInLine;
    }
    return compareBoard
  }

  // onClick callback for rolling back by players
  jumpTo(move){
    this.setState({
      setpNumber:move,
      xIsNext:(move % 2)===0,
    })
  }

  // Method call setCompareBoard and to judge if any play wins
  theWinner=(squares)=>{
    let compareBoard=this.setCompareBoard(squares,10,10);
    console.log(compareBoard);
    for(let arrIndex=3; arrIndex<compareBoard.length-3;arrIndex++){
      for(let squIndex=3;squIndex<compareBoard[arrIndex].length-3;squIndex++){
        if(
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex][squIndex+1] && 
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex][squIndex+2] &&
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex][squIndex+3] &&
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex][squIndex-1]
          )
          {
            console.log("if implemented");
            return true;
        }
        else if(
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex+1][squIndex] &&
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex+2][squIndex] &&
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex+3][squIndex] &&
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex-1][squIndex]
          )
          {
            return true;
        }
        else if(
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex+1][squIndex-1] &&
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex+2][squIndex-2] &&
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex+3][squIndex-3] &&
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex-1][squIndex+1]
        ){
          return true;
        }
        else if(
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex-1][squIndex+1] &&
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex-2][squIndex+2] &&
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex-3][squIndex+3] &&
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex+1][squIndex-1]
        ){
          return true;
        }else{
         continue;
        }   
      }
    }
    return false
  }


  render() {
    const histroy = this.state.history.slice();
    const current = histroy[this.state.setpNumber];
    const winner=this.theWinner(current.squares)
    const moves = histroy.map((step, move)=>{   
    const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={()=>{this.jumpTo(move)}}>
            {desc}
          </button>
        </li>
      )
    })

    console.log(winner);
    let status;
    if(winner){
      status="You win!";
    }else{
      status = 'Next player: '+ (this.state.xIsNext ? "Hanna" : "Kevin");}
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i)=>this.handleClick(i)} 
            stateBoard={this.state.stateBoard}
          />
        </div>
        <div className="game-info">
          <div className="status">
            <div>{status}</div>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================



ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
