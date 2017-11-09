import fetch = require('isomorphic-fetch');
import yaml = require('js-yaml');
import React = require('react');
import FileLoader from '../components/FileLoader';
import SubmitForm from '../components/SubmitForm';
import TextArea from '../components/TextArea';

type Props = {
  bundleTarget: string;
};

type State = {
  currentFile?: File;
  fileContent?: string;
  status: string;
};

export default class Root extends React.Component<Props, State> {
  constructor(props?: Props) {
    super(props);
    this.state = {
      status: ''
    };
  }

  private parseFileContent(file?: File, content?: string): string | undefined {
    if (file && (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) && content) {
      return JSON.stringify(yaml.safeLoad(content));
    } else {
      return content;
    }
  }

  private onFileChanged(file?: File) {
    if (!file) {
      this.setState({
        currentFile: undefined,
        fileContent: undefined
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      this.setState({
        currentFile: file,
        fileContent: reader.result
      });
    reader.onerror = e =>
      this.setState({
        status: `Error: ${e}`
      });
    reader.readAsText(file);
  }

  private async onPublishContent(args: { domain: string; key: string }) {
    this.setState({
      status: 'publishing...'
    });
    try {
      const response = await fetch(`${this.props.bundleTarget}/${args.domain}/${args.key}`, {
        method: 'POST',
        headers: new Headers({
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }),
        body: this.parseFileContent(this.state.currentFile, this.state.fileContent)
      });
      this.setState({
        status: `${response.status} - ${response.statusText}`
      });
    } catch (e) {
      this.setState({
        status: `Error: ${e.message}`
      });
    }
  }

  public render() {
    return (
      <div className="container" style={{ padding: '1em 0' }}>
        <div className="row">
          <div className="col-md-8">
            <TextArea value={this.state.fileContent} />
          </div>
          <div className="col-md-4">
            <FileLoader
              currentFile={this.state.currentFile}
              onFileChanged={this.onFileChanged.bind(this)}
            />
            <SubmitForm onSubmit={this.onPublishContent.bind(this)} />
            <div>{this.state.status}</div>
          </div>
        </div>
      </div>
    );
  }
}
