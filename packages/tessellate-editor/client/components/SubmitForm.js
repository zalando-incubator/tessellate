// @flow
import React, { Component } from 'react';

type Args = {|
  domain: string,
  key: string
|};

export default class SubmitForm extends Component {
  props: {|
    onSubmit: (args: Args) => void
  |};

  state: Args;

  constructor(props: Object) {
    super(props);
    this.state = {
      domain: '',
      key: ''
    };
  }

  onDomainInputChanged(e: SyntheticInputEvent) {
    e.preventDefault();
    this.setState({
      domain: e.target.value
    });
  }

  onKeyInputChanged(e: SyntheticInputEvent) {
    e.preventDefault();
    this.setState({
      key: e.target.value
    });
  }

  onSubmit(e: SyntheticInputEvent) {
    e.preventDefault();
    this.props.onSubmit({
      domain: this.state.domain,
      key: this.state.key
    });
  }

  render() {
    const publishDisabled = !this.state.domain || !this.state.key;
    return (
      <form>
        <div className="form-group row">
          <label htmlFor="domainInput">Domain</label>
          <input
            type="text"
            className="form-control"
            id="domainInput"
            placeholder="e.g. zalando.de"
            onChange={this.onDomainInputChanged.bind(this)}
            value={this.state.domain}
          />
        </div>
        <div className="form-group row">
          <label htmlFor="keyInput">Key</label>
          <input
            type="text"
            className="form-control"
            id="keyInput"
            placeholder="e.g. example"
            onChange={this.onKeyInputChanged.bind(this)}
            value={this.state.key}
          />
        </div>
        <div className="form-group row">
          <button
            type="submit"
            disabled={publishDisabled}
            className="btn btn-primary"
            onClick={this.onSubmit.bind(this)}
          >
            Publish
          </button>
        </div>
      </form>
    );
  }
}
