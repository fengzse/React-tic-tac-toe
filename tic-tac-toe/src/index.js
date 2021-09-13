import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*
class Square extends React.Component {
  
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
}
*/

function Square(props){
  return (
    <button className="square" onClick={props.onClick}>
      {props.value};
    </button>
  );
}

class Board extends React.Component {
  constructor(props){
    super(props);
    this.state={
      squares:Array(9).fill(null),
    }
  }

  hanleClick(i){
    const squares=this.state.squares.slice();
    /*slice() 方法返回一个新的数组对象，这一对象是一个由 begin 和 end 决定的原数组的浅拷贝（包括 begin，不包括end）
      原始数组不会被改变, slice()不加参数既是浅复制原数组所有元素 */
    
    squares[i]="X";
    this.setState({squares:squares});
  }

  renderSquare(i) {
    // 渲染Square组件（Board里的每个小方块都是一个button），并且随着Board实例的每次渲染都渲染一个新的Square组件
    return <Square 
              value={this.state.squares[i]}
              onClick={()=>{this.hanleClick(i)}} 
            />;
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
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

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
