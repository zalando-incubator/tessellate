// @flow
import React, { Component } from 'react'
import fetch from 'isomorphic-fetch'
import FileLoader from '../components/FileLoader'
import TextArea from '../components/TextArea'

export default class Root extends Component {
  state: {
    currentFile?: File;
    fileContent?: string;
  }

  constructor(props: Object) {
    super(props)
    this.state = {}
  }

  onFileChanged(file?: File) {
    if (!file) {
      this.setState({
       currentFile: undefined,
       fileContent: undefined
      })
      return
    }
    const reader = new FileReader()
    reader.onload = e => this.setState({
      currentFile: file,
      fileContent: e.target.result
    })
    reader.onerror = e => console.error(e)
    reader.readAsText(file)
  }

  onPublishContent() {
    fetch('http://localhost:3001/bundles/zalando.de/example', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: this.state.fileContent
    })
    .then(data => console.log('Succes', data))
    .catch(error => console.error(error))
  }

  render() {
    const publishDisabled = !this.state.fileContent

    return <div className="container" style={{padding: '1em 0'}}>
      <div className="row">
        <div className="col-md-8">
          <TextArea value={this.state.fileContent}/>
        </div>
        <div className="col-md-4">
          <FileLoader
            currentFile={this.state.currentFile}
            onFileChanged={this.onFileChanged.bind(this)}/>
          <button type="submit"
            disabled={publishDisabled}
            className="btn btn-primary"
            onClick={this.onPublishContent.bind(this)}>Publish content</button>
        </div>
      </div>
    </div>
  }
}
