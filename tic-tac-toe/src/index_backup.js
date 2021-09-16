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
/*   constructor(props){
    super(props);
    this.state={
      squares:Array(100).fill(null),
      sIsNext:true,
      stateBoard:Array(10),
    };
  } */

  renderSquare(i,k) {
    // 渲染Square组件（Board里的每个小方块都是一个button），并且随着Board实例的每次渲染都渲染一行新的Square组件
    let line=[];
    //用for循环创建一行,每个元素都是一个Square组件
    for(let j=i; j<k;j++){ 
      line.push(<Square
                  key={j}   //key 属性的属性名必须使用key，不能自定义，这样React才能识别该属性是key
                  value={this.props.squares[j]}
                  /* 
                    这个j会随点击被传递给Game中Board标签里的onClick监听器的箭头函数(i)
                    onClick 回调是沿着props链从最内层的监听事件一直传递到外层onClick回调直到调用handleClick方法
                  */
                  onClick={()=>{this.props.onClick(j)}}    
                />)
      }
    return line;
    }

    /*
      再创建一个二维数组board，元素是包裹Square组件的数组line，用于在render方法中逐行渲染
    */
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
      // 通过drawBoard方法返回需要的二维数组board
      let board=this.drawBoard(0,10,this.props.stateBoard.length);
      // render()方法必须要有return，作为渲染目标，但其内部可以根据调研的函数内含多个return
      return (
        /*
          关键点在于数组调用map方法，每个map可以对逐个元素操作产生返回值return，放在外层渲染函数的return内执行Array.map
          就实现了数组元素的迭代返回，完成了类似使用循环渲染，替换了下方注释掉的逐个渲染的办法
        */
        board.map((squareLine, index)=>{
          return(
            <div key = {index} className="board-row">
              {squareLine}
            </div>
          )
        }))
        /*
        以下的逐行渲染被包含所有行的二维数组的map方法执行渲染取代
        <div>
          { <div className="board-row">
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
          </div> } 
        </div>
      ); */
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
  
  handleClick(i){
    const history = this.state.history.slice(0, this.state.setpNumber+1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    /*
      slice() 方法返回一个新的数组对象，这一对象是一个由 begin 和 end 决定的原数组的浅拷贝（包括 begin，不包括end）
      原始数组不会被改变, slice()不加参数既是浅复制原数组所有元素

      原本在此处调用了let tempBoard=this.setCompareBoard(squares,10,10)方法，绘制组件的同步图，但是
      setCompareBoard每次拿到的square都是上次点击后记录的，不是本次的，也就是是说compareBoard的更新会慢一次
      将setCompareBoard()移出点击函数，放在theWinner()函数里，这样确保setCompareBoard()需要的squares是点击后最新的
      */
    
    // 当一个square已经被点击后，禁止再次点击
    let xIsNext;
    if(squares[i]==="X" || squares[i]==="O"){
      return
    }
     
    /*
    if(this.theWinner()" || squares[i]){
      return
    }
    这里调用theWinner()使用的同样是上一次的squares，因为点击后新的squares还没有写入state
    而把theWinner放在render渲染函数里，每一次使用的squares都是上一次onClick事件后新的squares，这样仅仅setCompareBoard
    放在theWinner函数中，又只在render函数里调用theWinner的话就可以保证compareBoard的数据和页面上的棋盘同步
    */
    squares[i]=this.state.xIsNext ? "X" : "O";
    xIsNext = !this.state.xIsNext;
    this.setState({
      history:history.concat([{
        squares:squares,
      }]), 
      // 注意，此时history状态本身也在setState里，其长度还没有完成更新，history.length仍是点击回调执行前的长度
      setpNumber: history.length,
      xIsNext:xIsNext, 
      //stateBoard:tempBoard  移除stateBoard的更新
    });
  }

  setCompareBoard(squares, lineNumber,squareNumInLine){
    /*
    Array(10).fill(new Array(3).fill())创建二维数组的时候，由于是使用fill自动填充内维数组，相当于是对同一个new Array(3)
    对象引用的复制，想通过arr[i][j]改变二维数组中的某一个元素时：
      let arr = new Array(3).fill(new Array(3).fill(0));
      arr[1][1] = 2;
      //输出结果为[ [ 0, 2, 0 ], [ 0, 2, 0 ], [ 0, 2, 0 ] ]
    因此要使用嵌套for循环创建二维数组
     */ 
    let compareBoard=this.state.stateBoard.slice();
    let temp=0;
    for(let i=0;i<lineNumber;i++){  // 创建 lineNumber个二维数组，假定lineNumber为10，创建10个二维数组
      compareBoard[i]=new Array(squareNumInLine)  //初始化二维数组，squareNumInLine假定为10，即二维数组含10个元素
      for(let j=0;j<squareNumInLine;j++){
        if(squares[j+temp]==="X"||squares[j+temp]==="O"){
          compareBoard[i][j]=squares[j+temp]
        }else{
          compareBoard[i][j]=(j+temp);    // 填充元素
        }
      }
      temp+=squareNumInLine;
    }
    return compareBoard
  }

/* 
  关于在类组件中绑定事件的回调函数中的this绑定，在函数定义和回调定义中可以有两组写法：
    1. 正常定义类方法，如jumpTo(move){ }, 类方法被存储在类原型上，在事件绑定中的回调要写为箭头函数的形式,例如：
       onClick={(params)=>{this.jumpTo(params)}}, 如果写为函数指针回调 onClick={this.jumpTo} 会导致this丢失
    2. 如果要使用函数指针回调 onClick={this.jumpTo} 的形式，就需要将回调中的this绑定为当前类实例，类方法定义要改为
       jumpTo = (params) => {}, jumpTo方法被定义在类实例上，是一个实例属性，并且通过箭头函数定义属性的函数体，箭头函数
       定义的this自动被绑定为函数定义的上下文this，而不随调用方变化
*/
  jumpTo(move){
    this.setState({
      setpNumber:move,
      xIsNext:(move % 2)===0,
    })
  }

  theWinner=(squares)=>{
    /*  
    setCompareBoard同步图放在这里调用，因为theWinner会在render中调用，每次点击回调后都会更新state，而render总是会
    渲染最新的state数据，这样保证了同步图真正与state点击后的状态是一致的
    */
    let compareBoard=this.setCompareBoard(squares,10,10);
    console.log(compareBoard);
    for(let arrIndex=3; arrIndex<compareBoard.length-3;arrIndex++){
      for(let squIndex=3;squIndex<compareBoard[arrIndex].length-3;squIndex++){
        /*  
          原来的if...else块不能运行，原因如下：
          1. compareBoard[arrIndex].length 的length忘写了，关键是没有错误提示
          2. 写为length正常遍历后报错：Cannot read properties of undefined (reading '1')，其中 reading的数字可变
             排查后发现这是因为遍历超出索引边界，关键是超出索引边界的报错没有任何直接相关index boundary的提示，只是会有
             以上报错语句和超出索引边界的语句指向，记得：以上语句就是js超出索引边界的报错语句
        */
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
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex+1][squIndex+1] &&
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex+2][squIndex+2] &&
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex+3][squIndex+3] &&
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex-1][squIndex+4]
        ){
          return true;
        }
        else if(
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex-1][squIndex-1] &&
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex-2][squIndex-2] &&
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex-3][squIndex-3] &&
          compareBoard[arrIndex][squIndex]===compareBoard[arrIndex+1][squIndex+1]
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
    let winner=this.theWinner(current.squares)
    // history列表元素会增加，step映射每个列表元素，move映射元素索引。map返回一个数组
    const moves = histroy.map((step, move)=>{   // move起始值为0，对应数组第一个索引，0可转换为Boolean的false
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        /*
          每当一个列表重新渲染时，React 会根据每一项列表元素的 key 来检索上一次渲染时与每个 key 所匹配的列表项。
          如果 React 发现当前的列表有一个之前不存在的 key，那么就会创建出一个新的组件。
          如果 React 发现和之前对比少了一个 key，那么就会销毁之前对应的组件。
          如果一个组件的 key 发生了变化，这个组件会被销毁，然后使用新的 state 重新创建一份
          如果是动态列表项本身和列表元素作为被渲染的目标，那么列表及其每一个元素都需要一个key以提供给React做标识，如Board中的line
          此外不能通过 this.props.key 来获取 key。React 会通过 key 来自动判断哪些组件需要更新。组件是不能访问到它的key的
          组件的 key 值并不需要在全局都保证唯一，只需要在当前的同一级元素之间保证唯一即可
        */
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
