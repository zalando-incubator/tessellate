// @flow
import React, { Component } from 'react';

export default class TextArea extends Component {
  props: {|
    value?: string
  |};

  render() {
    return (
      <form>
        <div className="form-group">
          <textarea ref="textarea" className="form-control" rows="16" value={this.props.value} />
        </div>
      </form>
    );
  }
}
