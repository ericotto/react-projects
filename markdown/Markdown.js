import React from 'react';
import marked from 'marked';

class Markdown extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {text: "# H1\n## H2\n\*\*bold\*\*\n1. first item\n2. second item\n "},
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(event) {
    this.setState({text: event.target.value});
  }
  
  markdown(val) {
    var markdownText = marked(val, {sanitize: true});
    return {__html: markdownText};
  }
  
  render() {
    return <div>
      <h1>Markdown Viewer</h1>
      <textarea rows='10' cols='50' 
        onChange={this.handleChange}
        value={this.state.text}/>
      <div dangerouslySetInnerHTML={this.markdown(this.state.text)} />
      </div>;
  }
}

export default Markdown;