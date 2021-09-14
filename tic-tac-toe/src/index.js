import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


/* class Square extends React.Component {
  
  constructor(props){
    super(props);
    this.state={
      value:this.props.value,
    }
  }
  

  render() {
    return (
      //箭头函数定义的回调保持this值始终执行定义位置的this，函数声明的this则随调用方的this而转换
      <button 
        className="square" 
        onClick={()=>{this.props.onClick()}}
      >
        {this.props.value}
      </button>
    );
  }
} */


function Square(props){
  return (
    /*props.onClick这是一个回调函数，使用函数指针即可
      在类中必须写为()=>{this.props.onClick()，如果使用onClick回调指针，this指向会出问题，class自动使用
      严格模式，this不能指向window而是undefined*/
    <button className="square" onClick={props.onClick}> 
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props){
    super(props);
    this.state={
      squares:Array(100).fill(null),
      sIsNext:true,
    };
  }

  hanleClick(i){
    const squares=this.state.squares.slice();
    /*slice() 方法返回一个新的数组对象，这一对象是一个由 begin 和 end 决定的原数组的浅拷贝（包括 begin，不包括end）
      原始数组不会被改变, slice()不加参数既是浅复制原数组所有元素 */
    let sIsNext;
    squares[i]=this.state.sIsNext ? "X" : "O";
    sIsNext = !this.state.sIsNext;
    this.setState({squares:squares, sIsNext:sIsNext});
  }

  renderSquare(i,k) {
    // 渲染Square组件（Board里的每个小方块都是一个button），并且随着Board实例的每次渲染都渲染一个新的Square组件
    let line=[];
    //用for循环创建一行
    for(let j=i; j<k;j++){ 
      line.push(<Square
                  squareNum={j} 
                  value={this.state.squares[j]}
                  onClick={()=>{this.hanleClick(j)}} 
                />)
    }
    return line;
  }

  render() {
    const status = 'Next player: '+ (this.state.sIsNext ? "Hanna" : "Kevin");
    return (
      <div>
        <div className="status">{status}</div>
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
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

function theWinner(squares, lineNumber,squareNumInLine){
  /*
  Array(10).fill(new Array(3).fill())创建二维数组的时候，由于是使用fill自动填充内维数组，相当于是对对象引用的复制
  想通过arr[i][j]改变二维数组中的某一个元素时：
    let arr = new Array(3).fill(new Array(3).fill(0));
    arr[1][1] = 2;
    //输出结果为[ [ 0, 2, 0 ], [ 0, 2, 0 ], [ 0, 2, 0 ] ]
  因此要使用嵌套for循环创建二维数组
   */ 
  let compareBoard=new Array(lineNumber);
  let temp=0;
  for(let i=0;i<lineNumber;i++){  // 创建 lineNumber个二维数组，假定lineNumber为10，创建10个二维数组
    compareBoard[i]=new Array(squareNumInLine)  //初始化二维数组，squareNumInLine假定为10，即二维数组含10个元素
    for(let j=0;j<squareNumInLine;j++){
      if(squares[j]==="X"||squares[j]==="O"){
        compareBoard[i][j]=squares[j]
      }else{
        compareBoard[i][j]=(j+temp);    // 填充元素
      }
    }
    temp+=squareNumInLine;
  }
  console.log(compareBoard)
// 
  for(let arrIndex=0; arrIndex<compareBoard.length;arrIndex++){
    for(let squIndex=0;squIndex<compareBoard[arrIndex];squIndex++ ){
      if(
        compareBoard[arrIndex][squIndex]===compareBoard[arrIndex][squIndex+1] && 
        compareBoard[arrIndex][squIndex]===compareBoard[arrIndex][squIndex+2] &&
        compareBoard[arrIndex][squIndex]===compareBoard[arrIndex][squIndex+3] &&
        compareBoard[arrIndex][squIndex]===compareBoard[arrIndex][squIndex+4]
        )
        {
          alert("Winner");
      }else if(
        compareBoard[arrIndex][squIndex]===compareBoard[arrIndex+1][squIndex] &&
        compareBoard[arrIndex][squIndex]===compareBoard[arrIndex+2][squIndex] &&
        compareBoard[arrIndex][squIndex]===compareBoard[arrIndex+3][squIndex] &&
        compareBoard[arrIndex][squIndex]===compareBoard[arrIndex+4][squIndex]
        )
        {
        alert("Winner")
      }else if(
        compareBoard[arrIndex][squIndex]===compareBoard[arrIndex+1][squIndex+1] &&
        compareBoard[arrIndex][squIndex]===compareBoard[arrIndex+2][squIndex+2] &&
        compareBoard[arrIndex][squIndex]===compareBoard[arrIndex+3][squIndex+3] &&
        compareBoard[arrIndex][squIndex]===compareBoard[arrIndex+4][squIndex+4]
      ){
        alert("Winner")
      }else if (
        compareBoard[arrIndex][squIndex]===compareBoard[arrIndex-1][squIndex-1] &&
        compareBoard[arrIndex][squIndex]===compareBoard[arrIndex-2][squIndex-2] &&
        compareBoard[arrIndex][squIndex]===compareBoard[arrIndex-3][squIndex-3] &&
        compareBoard[arrIndex][squIndex]===compareBoard[arrIndex-4][squIndex-4]
      ){
        alert("Winner")
      }
    }
  }
}
theWinner(100,10,10)
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
