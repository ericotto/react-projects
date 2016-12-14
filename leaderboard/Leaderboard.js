import React from 'react';

class LeaderboardHeader extends React.Component {
  render() {
    return <thead>
      <th>Username</th>
      <th>30 Day Score</th>
      <th>All Time Score</th>
    </thead>;
  }
}

class User extends React.Component {
  render() {
    return <tr>
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
      users: []
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
      <table className="table table-striped">
        <LeaderboardHeader />
        <tbody>
        { this.state.users.map(function(user) {
            return <User user={user} />;
        })}
        </tbody>
      </table>
      </div>;
  }
}

export default Leaderboard;