import * as React from 'react';
import './../style/App.scss';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchProfile, switchWorkMode, fetchTasks } from '../action/userSession';
import Topbar from './Topbar';

class Dashboard extends React.Component<any, any> {
  public componentDidMount() {
    const { dispatch } = this.props;

      dispatch(fetchTasks());
      dispatch(fetchProfile());

    dispatch(switchWorkMode(false));
  }

  public render() {
    return (
      <div>
        <Topbar history={this.props.history} title="Dashboard" />
        <div className="wrapper profile-widget">
          <div className="profile-details">
            <span><img src="start-work.png" alt="Start Work" width="230" /></span><br />
            <ul className="nav">
              <Link to="/tasks" title="Tasks">Start Working</Link>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store: any) => {
  return ({
    taskUrls: store.profileState.taskUrls,
  });
}
export default connect(mapStateToProps)(Dashboard);
