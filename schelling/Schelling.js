import React from 'react';

class Schelling extends React.Component {

  constructor() {
    super()
    this.state = {
      iterations: 0,
      paused: false,
      converged: false,
      width: 70,
      height: 30,
      typeOne: 40,
      typeTwo: 40,
      open: 20,
      threshold: 0.51,
      grid: [],
      openList: []
    }
    this.pause = this.pause.bind(this)
    this.reset = this.reset.bind(this)
    this.start = this.start.bind(this)
    this.getGrid = this.getGrid.bind(this)
    this.satisfied = this.satisfied.bind(this)
    this.tickSimulation = this.tickSimulation.bind(this)
    this.runSimulation = this.runSimulation.bind(this)
    this.getNeighborStatus = this.getNeighborStatus.bind(this)
    this.getNeighbors = this.getNeighbors.bind(this)
  }

  componentWillMount() {
    this.getGrid()
  }

  componentDidMount() {
    this.runSimulation()
  }

  start() {
    this.setState({
      paused: false
    })
    this.runSimulation()
  }

  pause() {
    this.setState({
      paused: true
    })
  }

  reset() {
    this.getGrid()
    this.setState({
      paused: true
    })
  }

  getGrid() {
    let grid = []
    let probDist = []
    let openList = []
    // Construct Probability Distribution
    for (var i = 0; i < this.state.typeOne; i++) {
      probDist.push('typeOne');
    }
    for (var i = 0; i < this.state.typeTwo; i++) {
      probDist.push('typeTwo');
    }
    for (var i = 0; i < this.state.open; i++) {
      probDist.push('open');
    }
    // Construct Grid 
    for(var i = 0; i < this.state.height; i++) {
      let row = []
      for(var j = 0; j < this.state.width; j++) {
        const type = probDist[Math.floor(Math.random() * probDist.length)]
        let cell = {
          i: i,
          j: j,
          type: type
        }
        if (type === 'open') {
          openList.push(cell)
        }
        row.push(cell);
      }
      grid.push(row);
    }
    this.setState({
      grid: grid,
      openList: openList,
      converged: false,
      iterations: 0
    });
  }

  runSimulation() {
    var simulation = setInterval( () => { 
      this.tickSimulation()
      if (this.state.converged || this.state.paused) {
        clearInterval(simulation)
      }
    }, 1000);
  }

  tickSimulation() {
    var iterations = this.state.iterations;
    var grid = this.state.grid;
    var openList = this.state.openList;
    var converged;
    for(var i = 0; i < this.state.height; i++) {
      converged = true;
      for(var j = 0; j < this.state.width; j++) {
        let cell = grid[i][j];
        if (!(cell.type === 'open')) {
          if(!this.satisfied(cell)) {
            let openId = Math.floor(Math.random() * openList.length)
            let open = openList[openId]
            let newCell = { i: open.i, j: open.j,type: cell.type }
            let newOpen = { i: cell.i, j: cell.j, type: 'open' }
            grid[newCell.i][newCell.j] = newCell;
            grid[i][j] = newOpen;
            openList.splice(openId, 1);
            openList.push(newOpen)
            converged = false;
          }
        }
      }
    }
    iterations += 1;
    this.setState({ 
      iterations: iterations,
      grid: grid,
      openList: openList,
      converged: converged
    })
  }

  satisfied(cell) {
    let same = 0;
    let different = 0;
    let neighbors = this.getNeighbors(cell)
    neighbors.map((neighbor) => {
      let neighborObj = this.state.grid[cell.i + neighbor[0]][cell.j + neighbor[1]];
      const status = this.getNeighborStatus(neighborObj, cell)
      same += status[0];
      different += status[1];
    })
    const neighborRatio = same / (same + different);
    return neighborRatio >= this.state.threshold ? true : false;
  }

  getNeighbors(cell) {
      const height = this.state.height - 1;
      const width = this.state.width - 1;
        if (cell.i === 0 && cell.j === 0) { // upper left
          return [[0, 1], [1, 0], [1, 1]];
        } else if (cell.i === 0 && cell.j === width) { // upper right
          return [[0, -1], [1, -1], [1, 0]];
        } else if (cell.i === height && cell.j === 0) { // bottom left
          return [[-1, 0], [-1, 1], [0, 1]];
        } else if (cell.i === height && cell.j === width) { // bottom right 
          return [[-1, -1], [-1, 0], [0, -1]];
        } else if (cell.i === 0) { // top row
          return [[0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
        } else if (cell.j === 0) { // leftmost column
          return [[-1, 0], [-1, 1], [0, 1], [1, 0], [1, 1]];
        } else if (cell.i === height) { // bottom row
          return [[-1, -1], [-1, 0], [-1, 1], [0,-1], [0, 1]];
        } else if (cell.j === width) { // rightmost column
          return [[-1, -1], [-1, 0], [0, -1], [1, -1], [1, 0]];
        } else { // inner cell
          return [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
        }
      }

  getNeighborStatus(neighbor, cell) {
    let neighborType = neighbor.type;
    let cellType = cell.type;
    if (neighborType === cellType) {
      return [1, 0]
    } else if (neighborType === 'open') {
      return [0, 0]
    } else {
      return [0, 1]
    }
  }

  render() {
    return  (
      <div className="wrapper">
        <table>
        <tbody>
        { this.state.grid.map( (row, i) => {
            return (
              <tr key={i}>
              { row.map( (cell, j) => {
                return (<Cell key={j} cell={cell}/>)
              }) }
              </tr>
            )        
        }) }
        </tbody>
        </table>
        <div className="text-center control-panel">
        { this.state.paused ?
          <button className="btn btn-primary" onTouchTap={this.start}>Start</button> :
          <button className="btn" onTouchTap={this.pause}>Pause</button>
        }
        <button className="btn btn-danger" onTouchTap={this.reset}>Reset</button>
        <h4>Generations: { this.state.iterations }</h4>
        </div>
      </div>
    )
  }
}

class Cell extends React.Component {
  render() {
    return (
      <td className={this.props.cell.type}></td>
    )
  }
}

export default Schelling;