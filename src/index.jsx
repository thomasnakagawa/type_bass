import React from 'react';
import {render} from 'react-dom';
import howler from 'howler';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      charIndex: 0,
      timeSig: '4/4',
      drums: false,
      fillBars: false,
      showAdvanced: false,
    };

    this.sounds = {
      // letters arranged by how frequently they appear in english
      e: new Howl({urls: ['sounds/b1.wav']}),// root
      t: new Howl({urls: ['sounds/fsharp1.wav']}),// 5th
      a: new Howl({urls: ['sounds/e1.wav']}),// 4th
      o: new Howl({urls: ['sounds/b2.wav']}),// octave
      i: new Howl({urls: ['sounds/d1.wav']}),// 3rd
      n: new Howl({urls: ['sounds/a1.wav']}),// 7th
      s: new Howl({urls: ['sounds/b1mute.wav']}),// low mute
      h: new Howl({urls: ['sounds/b2mute.wav']}),// hight mute
      r: new Howl({urls: ['sounds/csharp1.wav']}),// 2nd
      d: new Howl({urls: ['sounds/g1.wav']}),// 6th
      l: new Howl({urls: ['sounds/blue.wav']}),// bluenote
      c: new Howl({urls: ['sounds/fsharp0.wav']}),// low 5th
      u: new Howl({urls: ['sounds/e0.wav']}), // low 4th
      m: new Howl({urls: ['sounds/b1slap.wav']}),// slap1
      w: new Howl({urls: ['sounds/b2slap.wav']}),// slap8
      f: new Howl({urls: ['sounds/fsharp1slap.wav']}),// slap5
      g: new Howl({urls: ['sounds/a1slap.wav']}),// slap7
      y: new Howl({urls: ['sounds/muteslaplow.wav']}),// low mute slap
      p: new Howl({urls: ['sounds/muteslaphigh.wav']}),// high mute slap
      b: new Howl({urls: ['sounds/doublenote.wav']}),// double notes
      v: new Howl({urls: ['sounds/doublemute.wav']}),// double mutes
      k: new Howl({urls: ['sounds/harmonic1.wav']}),// harmonic1
      j: new Howl({urls: ['sounds/harmonic2.wav']}),// harmonic2
      x: new Howl({urls: ['sounds/powerchord.wav']}),// power chord
      q: new Howl({urls: ['sounds/jazzchord.wav']}),// jazz chord
      z: new Howl({urls: ['sounds/slapchord.wav']}),// slap chord

      kick: new Howl({urls: ['sounds/drums/kick.wav'], volume: '0.2'}),
      hat: new Howl({urls: ['sounds/drums/hat.wav'], volume: '0.03'}),
      snare: new Howl({urls: ['sounds/drums/snare.wav'], volume: '0.15'}),

    }
  }

	componentDidMount() {
    window.setInterval(() => {
      this.playNote();
    }, 180);
  }


  playNote() {
    let input = this.formatText(this.addBarFill(this.getInput()));

    this.setState({charIndex: this.state.charIndex+1});
    if (this.state.charIndex >= input.length) {
      this.setState({charIndex: 0});
    }
    let char = input.charAt(this.state.charIndex);
    if (char) {
      if (this.sounds[char]) this.sounds[char].play();
    }

    if (this.state.drums && input.length > 0) {
      // kick
      let i = this.state.charIndex;
      if (this.getKick(i)){
        this.sounds['kick'].play();
      }
      // snare
      if (this.getSnare(i)){
        this.sounds['snare'].play();
      }

      // snare
      if (this.getHat(i)){
        this.sounds['hat'].play();
      }
    }
  }

  getSnare(i) {
    return (this.state.timeSig === '4/4' && i % 4 === 2) ||
           (this.state.timeSig === '3/4' && i % 6 !== 0 && i % 2 == 0) ||
           (this.state.timeSig === '6/8' && i % 6 === 3) ||
           (this.state.timeSig === '4/2' && i % 2 === 1);
  }

  getKick(i) {
    return (this.state.timeSig === '4/4' && i % 4 === 0) ||
           (this.state.timeSig === '3/4' && i % 6 === 0) ||
           (this.state.timeSig === '6/8' && i % 6 === 0) ||
           (this.state.timeSig === '4/2' && i % 2 === 0);
  }

  getHat(i) {
    return (this.state.timeSig === '4/4' && i % 2 === 0) ||
           (this.state.timeSig === '3/4' && i % 2 === 0) ||
           (this.state.timeSig === '6/8' && i % 3 === 0) ||
           (this.state.timeSig === '4/2');
  }

  getInput() {
    if (document.getElementById("textbox")) {
      return (document.getElementById("textbox").value);
    }
    return '';
  }

  formatText(text) {
    return text.toLowerCase().replace('\n', '');
  }

  addBarFill(input) {
    if (this.state.fillBars) {
      if (this.state.timeSig === '4/4') {
        input = (input).concat(' '.repeat((input.length % 4)=== 0 ? 0 :4 - (input.length % 4)));
      }
      if (this.state.timeSig === '6/8') {
        input = (input).concat(' '.repeat((input.length % 6)=== 0 ? 0 :6 - (input.length % 6)));
      }
      if (this.state.timeSig === '3/4') {
        input = (input).concat(' '.repeat((input.length % 6)=== 0 ? 0 :6 - (input.length % 6)));
      }
      if (this.state.timeSig === '4/2') {
        input = (input).concat(' '.repeat((input.length % 2)=== 0 ? 0 :2 - (input.length % 2)));
      }
    }
    return input;
  }

  get dotsOverlay() {
    if (!document.getElementById("textbox")) return;

    const actualInput = this.addBarFill(this.getInput());
    const lines = actualInput.split('\n');
    let output = [];
    lines.forEach((lineElement, lineIndex) => {
      output.push(
        <div key={lineIndex} className='dot-row'>
          {this.generateDotRow(lineElement)}
        </div>
      );
    });

    return (
      <div className='dots-overlay'>
        {output}
      </div>
    );
  }

  generateDotRow(text) {
    let charIndex = 0;
    let dots = [];
    while (charIndex < text.length) {
      let style = {}
      if (charIndex === this.state.charIndex) {
        style = {border: 'solid 1px black'}
      }
      if ((this.state.fillBars || this.state.drums) && this.state.showAdvanced && this.getKick(charIndex)) {
        dots.push(<div key={charIndex} className='dot' style={Object.assign({backgroundColor: 'red'}, style)}/>);
      }
      else if ((this.state.fillBars || this.state.drums) && this.state.showAdvanced && this.getSnare(charIndex)){
        dots.push(<div key={charIndex} className='dot' style={Object.assign({backgroundColor: 'blue'}, style)}/>);
      }else {
        dots.push(<div key={charIndex} className='dot' style={Object.assign({backgroundColor: 'lightGrey'}, style)}/>);
      }
      charIndex++;
    }
    return dots;
  }

  get advancedFeatures() {
    if (this.state.showAdvanced) {
      return (
        <div>
          <div className='row'>
            <p>Drums</p>
            <input
              type="checkbox"
              checked={this.state.drums}
              onChange={(e) => {this.setState({ drums: e.target.checked });}}
            />
          </div>
          <div className='row'>
            <p>4/4</p>
            <input type="radio" 
                   value='4/4' 
                   checked={this.state.timeSig === '4/4'} 
                   onChange={(e) => {this.setState({ timeSig: e.target.value });}} />
            <div className='space'/>
            <p>6/8</p>
            <input type="radio"
                   value='6/8' 
                   checked={this.state.timeSig === '6/8'} 
                   onChange={(e) => {this.setState({ timeSig: e.target.value });}} />
          </div>
          <div className='row'>
            <p>Fill partial measures</p>
            <input
              type="checkbox"
              checked={this.state.fillBars}
              onChange={(e) => {this.setState({ fillBars: e.target.checked });}}
            />
          </div>
        </div>
      );
    }

    return (
      <div className='link-button' onClick={() => {this.setState({showAdvanced: true, drums: true, fillBars: true});}}>Advanced features</div>
    );
  }


  render () {
    return (
      <div className='site'>
        <h1>type_bass</h1>
        <div className='input-box'>
          <textarea autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
            cols={this.addBarFill(this.getInput()).length}
            rows={1}
            type='text'
            className='input-area'
            id='textbox'
            placeholder='type something!'
            onChange={(e) => {
              document.getElementById("textbox").value = this.formatText(e.target.value);
            }}
          />
          {this.dotsOverlay}
        </div>
        {this.advancedFeatures}
      </div>
    );
  }
}

render(<App/>, document.getElementById('app'));