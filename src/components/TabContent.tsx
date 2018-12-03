import * as React from 'react';
import './../style/Tasks.scss';
import WebView from './WebView';
import { goForward,
  goBack,
  reloadUrl,
  loadUrl,
  getWebViewSrc,
  viewCanGoBack,
  viewCanGoForward,
  autoLogin,
} from '../helper';

class TabContent extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      omniValue: this.props.defaultUrl,
      isBackBtnActive: false,
      isForwardBtnActive: false,
      isPageLoading: true,
      pageLoadCount: 1,
    }
  }

  public handleGoBack() {
    const { tabId } = this.props;
    this.setState({
      isPageLoading: true
    });
    goBack(tabId);
  }

  public handleGoForward() {
    const { tabId } = this.props;
    this.setState({
      isPageLoading: true
    });
    goForward(tabId);
  }

  public handleReload() {
    const { tabId } = this.props;
    this.setState({
      isPageLoading: true
    });
    reloadUrl(tabId);
  }

  public handleOmniBoxEnter(evt: React.KeyboardEvent<HTMLInputElement>) {
    const { tabId } = this.props;
    const value = evt.currentTarget.value;
    if(evt.which === 13) {
      if (value.indexOf('.com') > 0) {
        const https = value.slice(0, 8).toLowerCase();
        if (https === 'https://') {
          loadUrl(tabId, value);
        } else {
          loadUrl(tabId, `https://${value}`);
        }
      } else if (value.indexOf('127.0.0.1') > -1 || value.indexOf('localhost') > -1) {
        const url = value.indexOf('http://') > -1 ? value : `http://${value}`;
        loadUrl(tabId, url);
      } else {
        loadUrl(tabId, `https://www.google.com.np/search?q=${value}`);
      }
      this.setState({
        isPageLoading: true
      });;
    }
  }

  public handleOmniBoxChange(evt: React.FormEvent<HTMLInputElement>) {
    const value = evt.currentTarget.value;
    this.setState({
      omniValue: value,
    });
  }

  public handleWebViewLoad() {
    const { tabId, credentials } = this.props;
    const { pageLoadCount } = this.state;
    this.props.onWebViewLoad(tabId);
    if (credentials && pageLoadCount === 1) {
      autoLogin(tabId, credentials);
    }
    this.setState({
      isBackBtnActive: viewCanGoBack(tabId),
      isForwardBtnActive: viewCanGoForward(tabId),
      omniValue: getWebViewSrc(tabId),
      isPageLoading: false,
      pageLoadCount: pageLoadCount + 1,
    });
  }

  public handleDidStartNavigation() {
    const { tabId } = this.props;
    this.setState({
      isBackBtnActive: viewCanGoBack(tabId),
      isForwardBtnActive: viewCanGoForward(tabId),
      isPageLoading: true,
    });
  }

  public handleDidStopLoading() {
    const { tabId } = this.props;
    this.setState({
      isBackBtnActive: viewCanGoBack(tabId),
      isForwardBtnActive: viewCanGoForward(tabId),
      omniValue: getWebViewSrc(tabId),
      isPageLoading: false,
    });
  }

  public render() {
    return (
      <div className="browser-window">
        <div className="tab-content">
          <nav id="navigation">
            <div id="back">
              <i className={`fas fa-arrow-left ${this.state.isBackBtnActive ? 'active' : ''}`} aria-hidden="true" onClick={() => this.handleGoBack()} />
            </div>
            <div id="forward">
              <i className={`fas fa-arrow-right ${this.state.isForwardBtnActive ? 'active' : ''}`} aria-hidden="true" onClick={() => this.handleGoForward()} />
            </div>
            <div id="refresh">
              <i className={`fas fa-redo active ${this.state.isPageLoading ? 'load' : ''}`} aria-hidden="true" onClick={() => this.handleReload()} />
            </div>
            <div id="omnibox">
              <input
                type="text"
                id="url"
                onKeyPress={evt => this.handleOmniBoxEnter(evt)}
                onChange={evt => this.handleOmniBoxChange(evt)}
                value={this.state.omniValue}
              />
            </div>
          </nav>
          <div className="browser-view">
            <WebView
              id={this.props.tabId}
              className="page"
              url={this.props.defaultUrl}
              didFinishLoad={() => this.handleWebViewLoad()}
              didStartNavigation={() => this.handleDidStartNavigation()}
              didStopLoading={() => this.handleDidStopLoading()}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default TabContent;