import * as React from 'react';
import { connect } from 'react-redux';
import './../style/Tasks.scss';
import Topbar from './Topbar';
import TabContent from '../components/TabContent';
import { getWebViewTitle, getWebViewSrc } from '../helper';
import { switchWorkMode, switchActiveTab, updateTaskUrls, updateTaskTitles } from '../action/userSession';

class Tasks extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.handleTabSelect = this.handleTabSelect.bind(this);
    this.handleWebViewLoad = this.handleWebViewLoad.bind(this);
  }

  public componentDidMount() {
    this.props.dispatch(switchWorkMode(true));
  }

  public handleTabSelect(evt: any) {
    this.props.dispatch(switchActiveTab(evt.currentTarget.id));
  }

  public addTabs() {
    const { dispatch, taskUrls } = this.props;
    const updatedUrls = taskUrls.concat('https://google.com');
    dispatch(updateTaskUrls(
      {
        taskUrls: updatedUrls,
        activeTab: `tab${updatedUrls.length}`
      }
    ));
  }

  public getActiveIndex(index: number, difference: number ): any {
    const { taskUrls } = this.props;
    return taskUrls[index].length ? index : this.getActiveIndex(index + difference, difference);
  }

  public removeTab(targetIndex: number) {
    const { dispatch, taskUrls, activeTab } = this.props;
    const currentIndex = Number(/\d+/.exec(activeTab)![0]) - 1;
    const currentTabs: number[] = [];
    taskUrls.map( (url: string, index: number) => {
      if(url.length > 0) { currentTabs.push(index); } 
    });

    let activeIndex;
    if (currentTabs.length === 1) { return false; }

    if (currentIndex === targetIndex) {
      if(currentTabs.indexOf(targetIndex) === currentTabs.length - 1) {
        activeIndex = this.getActiveIndex(targetIndex - 1, -1);
      }
      else {
        activeIndex = this.getActiveIndex(targetIndex + 1, 1);
      }
    } else {
      activeIndex = currentIndex;
    }
    taskUrls.splice(targetIndex, 1, '');
    dispatch(updateTaskUrls({
      taskUrls,
      activeTab: `tab${activeIndex + 1}`
    }));
    return true;
  }

  public handleWebViewLoad(webviewId: string) {
    const tabIndex = Number(/\d+/.exec(webviewId)![0]);
    const { taskTitles, dispatch, taskUrls } = this.props;
    const tabTitle = getWebViewTitle(webviewId);
    const updatedTitles = taskTitles.slice();
    const updatedUrls = taskUrls.slice();
    updatedUrls[tabIndex - 1] = getWebViewSrc(webviewId);
    updatedTitles[tabIndex - 1] = tabTitle;
    dispatch(updateTaskUrls({
      taskUrls: updatedUrls
    }))
    dispatch(updateTaskTitles(updatedTitles));
  }

  public render() {
    const { taskUrls, taskTitles, activeTab, history, credentials } = this.props;
    const nonEmptyUrls = taskUrls.filter((url:string) =>  url.length > 0);
    return (
      <div>
        <Topbar history={history} title="Tasks" />
        <div className="browser-window">
          <ul className="tab-navs">
            {
              taskUrls.map( (url: string, index: number) => {
                return url.length ? (
                <div className="tab-nav-wrapper" key={index} style={{width: `${100 / nonEmptyUrls.length}%`}}>
                  <li className={activeTab === `tab${index + 1}` ? 'active' : ''} id={`tab${index + 1}`} onClick={this.handleTabSelect}>{taskTitles[index]}</li>
                  <i className="fas fa-times-circle cross-tab" onClick={() => this.removeTab(index)} />
                </div> ) : null
              })
            }
            <button className="add-tab" onClick={() => this.addTabs()}><i className="fas fa-plus" /></button>
          </ul>
          <div className="tab-body">
            { taskUrls.map( (url: string, index: number) => {
              return url.length ? (
                <div key={index} className={activeTab === `tab${index + 1}` ? 'active' : ''}>
                  <TabContent
                    defaultUrl={url}
                    tabId={`webview${index + 1}`}
                    credentials={credentials[index]}
                    onWebViewLoad={this.handleWebViewLoad}
                  />
                </div>) : null
            })
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store: any) => {
  return ({
    taskUrls: store.profileState.taskUrls,
    taskTitles: store.profileState.taskTitles,
    credentials: store.profileState.credentials,
    activeTab: store.profileState.activeTab
  });
}
export default connect(mapStateToProps)(Tasks);