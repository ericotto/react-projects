import React from 'react';

class User extends React.Component {
  render() {
    return <tr class="leaderboard-row">
      <td>{this.props.i}</td>
      <td>
        <img src={this.props.user.img} 
          width="50"
          height="50"/>
        <span>{this.props.user.username}</span>
      </td>
      <td>{this.props.user.recent}</td>
      <td>{this.props.user.alltime}</td>
      </tr>;
  }
}

class Leaderboard extends React.Component {
 
  constructor() {
    super();
    this.state = {
      users: [],
      sort30Day: true,
      sortAllTime: false
    }
  }

  sort30Day(event) {
    if (!this.state.sort30Day) {
      let thirtyDay = this.state.users.slice(0)
      thirtyDay.sort( function(a, b) {
        return b.recent - a.recent;
      })
      this.setState({
        users: thirtyDay,
        sort30Day: true,
        sortAllTime: false
      })
    }
  }

  sortAllTime(event) {
    if (!this.state.sortAllTime) {
      let allTime = this.state.users.slice(0)
      allTime.sort( function(a, b) {
        return b.alltime - a.alltime;
      })
      this.setState({
        users: allTime,
        sort30Day: false,
        sortAllTime: true
      })
    }
  }
  
  componentDidMount() {
    $.ajax({
      url: "https://fcctop100.herokuapp.com/api/fccusers/top/recent",
      dataType: 'json',
      success: function(data) {
        var userData = data;
        this.setState({users: userData});
      }.bind(this)
    });
  }
  
  render() {
    return <div>
      <div className="page-header"><h1>Leaderboard</h1></div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th onClick={this.sort30Day.bind(this)}>30 Day Score { this.state.sort30Day ? '▼' : '' }</th>
            <th onClick={this.sortAllTime.bind(this)}>All Time Score { this.state.sortAllTime ? '▼' : '' }</th>
          </tr>
        </thead>
        <tbody>
        { this.state.users.map(function(user, i) {
            return <User user={user} key={i} i={i + 1}/>;
        })}
        </tbody>
      </table>
      </div>;
  }
}

export default Leaderboard;