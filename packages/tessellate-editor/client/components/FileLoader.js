// @flow
import React, { Component } from 'react'

export default class FileLoader extends Component {
  props: {|
    currentFile?: File;
    onFileChanged: (file?: File) => void;
  |};

  onFileChanged(e: Event) {
    e.preventDefault()
    if (e.target.files instanceof FileList)
      this.props.onFileChanged(e.target.files[0])
    else
      this.props.onFileChanged()
  }

  render() {
    const {currentFile} = this.props
    const fileContent = currentFile ? 'content!' : ''

    return (
      <form>
        <div className="form-group">
          <input type="file" className="form-control-file" id="exampleInputFile"
            accept=".json,.yaml,.yml" max="1" onChange={this.onFileChanged.bind(this)}/>
        </div>
      </form>
    )
  }
}
