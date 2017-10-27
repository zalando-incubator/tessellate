import React = require('react');

type Props = {
  value?: string;
};

export default class TextArea extends React.Component<Props> {
  public render() {
    return (
      <form>
        <div className="form-group">
          <textarea className="form-control" rows={16} value={this.props.value} />
        </div>
      </form>
    );
  }
}
