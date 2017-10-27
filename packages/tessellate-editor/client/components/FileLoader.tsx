import React = require('react');

type Props = {
  currentFile?: File;
  onFileChanged: (file?: File) => void;
};

export default class FileLoader extends React.Component<Props> {
  private onFileChanged: React.ChangeEventHandler<HTMLInputElement> = e => {
    e.preventDefault();
    if (e.target.files) {
      this.props.onFileChanged(e.target.files[0]);
    } else {
      this.props.onFileChanged();
    }
  };

  public render() {
    return (
      <form>
        <div className="form-group">
          <input
            type="file"
            className="form-control-file"
            id="exampleInputFile"
            accept=".json,.yaml,.yml"
            max="1"
            onChange={this.onFileChanged}
          />
        </div>
      </form>
    );
  }
}
