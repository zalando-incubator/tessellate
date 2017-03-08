// @flow
import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import yaml from 'js-yaml';
import FileLoader from '../components/FileLoader';
import TextArea from '../components/TextArea';
import SubmitForm from '../components/SubmitForm';

export default class Root extends Component {
  props: {
    options: Object
  };

  state: {
    currentFile?: File,
    fileContent?: string,
    status: string
  };

  constructor(props: Object) {
    super(props);
    this.state = {
      status: ''
    };
  }

  parseFileContent(file?: File, content?: string): ?string {
    if (file && (file.name.endsWith('.yaml') || file.name.endsWith('.yml'))) {
      return JSON.stringify(yaml.safeLoad(content));
    } else {
      return content;
    }
  }

  onFileChanged(file?: File) {
    if (!file) {
      this.setState({
        currentFile: undefined,
        fileContent: undefined
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = e => this.setState({
      currentFile: file,
      fileContent: e.target.result
    });
    reader.onerror = e => this.setState({
      status: `Error: ${e}`
    });
    reader.readAsText(file);
  }

  onPublishContent(args: {| domain: string, key: string |}) {
    this.setState({
      status: 'publishing...'
    });
    fetch(`${this.props.options.BUNDLE_TARGET}/${args.domain}/${args.key}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: this.parseFileContent(this.state.currentFile, this.state.fileContent)
    })
      .then(response => {
        return this.setState({
          status: `${response.status} - ${response.statusText}`
        });
      })
      .catch(error => {
        this.setState({
          status: `Error: ${error.message}`
        });
      });
  }

  render() {
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
