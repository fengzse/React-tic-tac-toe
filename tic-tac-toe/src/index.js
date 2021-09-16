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
    // render Square components by lines
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

  render() {
    // can be rendered by loop
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0,10)}
        </div> 
        <div className="board-row">
          {this.renderSquare(10,20)}
        </div>
        <div className="board-row">
          {this.renderSquare(20,30)}
        </div>
        <div className="board-row">
          {this.renderSquare(30,40)}
        </div>
        <div className="board-row">
          {this.renderSquare(40,50)}
        </div>
        <div className="board-row">
          {this.renderSquare(50,60)}
        </div>
        <div className="board-row">
          {this.renderSquare(60,70)}
        </div>
        <div className="board-row">
          {this.renderSquare(70,80)}
        </div>
        <div className="board-row">
          {this.renderSquare(80,90)}
        </div>
        <div className="board-row">
          {this.renderSquare(90,100)}
        </div>
      </div>
    );
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
  
  hanleClick(i){
    const history = this.state.history.slice(0, this.state.setpNumber+1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let xIsNext;
    
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

  jumpTo(move){
    this.setState({
      setpNumber:move,
      xIsNext:(move % 2)===0,
    })
  }

  theWinner=(squares)=>{
    let compareBoard=this.setCompareBoard(squares,10,10);
    console.log(compareBoard);
    for(let arrIndex=0; arrIndex<compareBoard.length;arrIndex++){
      for(let squIndex=0;squIndex<compareBoard[arrIndex];squIndex++ ){
        // these if blocks didn't work
        if(
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex][squIndex+1] && 
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex][squIndex+2] &&
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex][squIndex+3] &&
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex][squIndex+4]
          )
          {
            return true;
        }else if(
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex+1][squIndex] &&
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex+2][squIndex] &&
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex+3][squIndex] &&
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex+4][squIndex]
          )
          {
            return true;
        }else if(
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex+1][squIndex+1] &&
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex+2][squIndex+2] &&
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex+3][squIndex+3] &&
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex+4][squIndex+4]
        ){
          return true;
        }else if (
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex-1][squIndex-1] &&
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex-2][squIndex-2] &&
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex-3][squIndex-3] &&
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex-4][squIndex-4]
        ){
          return true;
        }   
      }
    }
    return false;
  }


  render() {
    const histroy = this.state.history.slice();
    const current = histroy[this.state.setpNumber];
    let winner=this.theWinner(current.squares)
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
            onClick={(i)=>this.hanleClick(i)} 
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
