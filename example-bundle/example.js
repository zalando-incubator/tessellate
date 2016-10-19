import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Grid, Headline, Image, Panel, Text } from 'z-shop-ui'
import Styles from 'z-shop-ui/dist/z-shop-ui.css'

/**
 * Root class of the fragment bundle can be rendered on the server.
 */
export class Fragment extends Component {
  render() {
    return <Grid>
      <Grid.Item span={{xs: 12, m: 12}}>
        <Headline level={1}>Welcome to {this.props.requestURI}!</Headline>
      </Grid.Item>
      <Grid.Item span={{xs: 12, m: 6}}>
        <Image altText="Caturday" src="http://i.giphy.com/3o6gaW2l0FJB0jt7MY.gif"/>
      </Grid.Item>
      <Grid.Item span={{xs: 12, m: 6}}>
        <Panel>
          <Text>
            Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.<br/><br/>
            Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated content in real-time will have multiple touchpoints for offshoring.
          </Text>
        </Panel>
      </Grid.Item>
    </Grid>
  }
}

/**
 * Render function will be called by the Mosaic layout engine in the browser.
 * @param element - DOM root element to mount React component on.
 */
export default function render(element) {
  // Fetch inlined properties.
  const props = JSON.parse(element.getAttribute('data-props'))

  ReactDOM.render(<Fragment {...props}/>, element)
}
