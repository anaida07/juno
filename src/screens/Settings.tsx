// import axios from 'axios';
import * as React from 'react';
import { connect } from 'react-redux';
import { fetchSettings } from './../action/settings';

export class Settings extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  public componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchSettings());
  }

  public render() {
    const { settings } = this.props;

    return (
      <div>
        <h2>Settings</h2>
        Name: { settings.name }
      </div>
    );
  }
}

const mapStateToProps = (store: any) => {
  console.log(store.settingsState);
  return ({
    settings: store.settingsState.settings
  });
}
export default connect(mapStateToProps)(Settings);
