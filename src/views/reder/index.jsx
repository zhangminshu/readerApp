import React, { Component } from "react";
import { createGlobalStyle } from "styled-components";
import { ReactReader } from "./modules";
import {
  Container,
  ReaderContainer,
  Bar,
  Logo,
  CloseButton,
  CloseIcon,
  FontSizeButton
} from "./Components";

const storage = global.localStorage || null;

const GlobalStyle = createGlobalStyle`
  * {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    margin: 0;
    padding: 0;
    color: inherit;
    font-size: inherit;
    font-weight: 300;
    line-height: 1.4;
    word-break: break-word;
  }
  html {
    font-size: 62.5%;
  }
  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    font-size: 1.8rem;
    background: #333;
    position: absolute;
    height: 100%;
    width: 100%;
    color: #fff;
  }
`;

class RederPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullscreen: true,
      location:
        storage && storage.getItem("epub-location")
          ? storage.getItem("epub-location")
          : 2,
      largeText: false
    };
    this.rendition = null;
  }


  onLocationChanged = location => {
    this.setState(
      {
        location
      },
      () => {
        storage && storage.setItem("epub-location", location);
      }
    );
  };

  onToggleFontSize = () => {
    const nextState = !this.state.largeText;
    this.setState(
      {
        largeText: nextState
      },
      () => {
        this.rendition.themes.fontSize(nextState ? "140%" : "100%");
      }
    );
  };

  getRendition = rendition => {
    // Set inital font-size, and add a pointer to rendition for later updates
    const { largeText } = this.state;
    this.rendition = rendition;
    rendition.themes.fontSize(largeText ? "140%" : "100%");
  };

  render() {
    const { fullscreen, location } = this.state;
    const bookInfo = JSON.parse(sessionStorage.getItem('bookInfo'));
    const bookUrl ="https://"+ bookInfo.url.split("://")[1];
    const bookTitle = bookInfo.title;
    return (
      <Container>
        <GlobalStyle />
        <ReaderContainer fullscreen={fullscreen}>
          <ReactReader
            url={bookUrl}
            locationChanged={this.onLocationChanged}
            title={bookTitle}
            location={location}
            getRendition={this.getRendition}
          />
          {/* <FontSizeButton onClick={this.onToggleFontSize}>
            Toggle font-size
          </FontSizeButton> */}
        </ReaderContainer>
      </Container>
    );
  }
}

export default RederPage;
