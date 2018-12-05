import * as React from 'react';
import './../style/App.scss';

class WebView extends React.Component<any, any> {
  private container: React.RefObject<HTMLInputElement>;

  public constructor(props: any) {
    super(props);
    this.container = React.createRef();
  }

  public componentDidMount() {
    const webViewContainer = this.container.current;
    if (webViewContainer) { 
      const view = webViewContainer.querySelector('webview');
      if(view) {
        view.addEventListener('did-finish-load', this.props.didFinishLoad);
        view.addEventListener('did-start-loading', this.props.didStartNavigation);
        view.addEventListener('did-stop-loading', this.props.didStopLoading);
        view.addEventListener('new-window', this.props.onNewWindow);
      };
    }
  }
  
  public render() {
    const { id, className, url } = this.props;
    return (
      <div ref={this.container}>
        <webview id={id} className={className} src={url} />
      </div>
    );
  }
}

export default WebView;