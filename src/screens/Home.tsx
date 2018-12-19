import * as React from 'react';
import './../style/App.scss';
import Login from './Login';
import Dashboard from './Dashboard';

class Home extends React.Component<any, any> {
  public render() {
    const userId = localStorage.getItem('userId');
    const { history } = this.props;
    return (
      <div>
        { userId ? <Login history={history} /> : <Dashboard history={history} /> }
      </div>
    );
  }
}

export default Home;
