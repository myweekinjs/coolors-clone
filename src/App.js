import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import Clipboard from 'react-clipboard.js';

const ColourText = ({text}) => {
  const [copied, setCopied] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [copiedInterval, setCopiedInterval] = useState(null);

  useEffect(() => {
    const onIntervalComplete = () => {
      setCopiedInterval(null)
      setCopied(false)
    }

    if (copied) {
      setCopiedInterval(setInterval(onIntervalComplete, 1500))
    }

    return () => {
      setCopiedInterval(null)
    }
  }, [copied]);

  return (
    <Clipboard component="a" data-clipboard-text={text} onSuccess={() => setCopied(true)}>
      {copied ? "Copied" : `#${text}`}
    </Clipboard>
  )
}

const HexGenerator = ({ history, match }) => {
  const [colours, setColours] = useState();
  const { params } = match

  const generateHexColours = (length = 5) => {
    let available = '1234567890abcdef';
    let availableLength = available.length;
    let list = [];
    for (let i = 0; i < length; i++) {
      let hex = "";

      for (let x = 0; x < 6; x++) {
        hex += available.charAt(Math.floor(Math.random() * availableLength));
      }

      list.push(hex);
    }

    history.push(`/${list.join('-')}`)
    setColours(list)
  }

  useEffect(() => {
    const generateOnSpace = function(ev) {
      const code = ev.keyCode
      if (code === 32) {
        ev.preventDefault();
        generateHexColours();
      }
    }

    const { hex: paramColours } = params

    if (paramColours) {
      const brokenUp = paramColours.split("-").filter((c) => c.length === 6);
      if ( brokenUp.length === 5) {
        setColours(brokenUp)
      }
      else {
        generateHexColours();
      }
    }
    else {
      generateHexColours();
    }


    document.addEventListener("keydown", generateOnSpace);

    return () => {
      document.removeEventListener("keydown", generateOnSpace)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="app-container">
      <div className="colours-grid">
        {
          colours && colours.map((c, i) => (
            <div className="colour" key={i}>
              <div style={{ background: `#${c}` }} />
              <ColourText text={c} />
            </div>
          ))
        }
      </div>

      <p className="helper-text">Press "Space" to generate new colours</p>
    </div>
  )
}

const App = () => {
  return (
    <Router>
      <Route exact path={["/", "/:hex"]} component={HexGenerator} />
    </Router>
  );
}

export default App;
