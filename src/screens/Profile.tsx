// import axios from 'axios';
import * as React from 'react';
import { connect } from 'react-redux';
import { fetchProfile } from '../action/profile';
import Topbar from './Topbar';
import './../style/Profile.scss';

export class Profile extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  public componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchProfile());
  }

  public render() {
    const { profile } = this.props;

    return (
      <div>
        <Topbar title="Profile" />
        <div className="profile-widget">
          <div className="profile-details">
            <span><img src="avatar.png" alt="Avatar" width="200" /></span>
            <span className="name">{profile.FirstName} {profile.LastName}</span>
            <span>{profile.Email}</span>
            <span>{profile.Address}</span>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store: any) => {
  return ({
    profile: store.profileState.profile
  });
}
export default connect(mapStateToProps)(Profile);
