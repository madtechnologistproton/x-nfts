import { css, customElement, html, LitElement, property } from 'lit-element'
import { ThemeMode } from './types'

@customElement('loader-element')
export class Loader extends LitElement {
  @property({ type: String }) public mode: string = ThemeMode.Light

  static get styles() {
    return css`
      @keyframes pulse-opacity {
        0% {
          opacity: 1;
        }
        16.666% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
      .loading {
        transform: translate(-50%, -50%) rotate(30deg);
        height: 81px;
        width: 90px;
        position: absolute;
        left: 50%;
        top: 50%;
      }
      .loading .tri.upwards {
        border-top: 0;
        border-bottom: 27px solid #fff;
      }
      .loading .tri:first-child {
        left: 15px;
        border-bottom-color: #8bcbfc;
      }
      .loading .tri:nth-child(2) {
        left: 30px;
        animation-delay: 0.1s;
        border-top-color: #79c4fc;
      }
      .loading .tri:nth-child(3) {
        left: 45px;
        animation-delay: 0.2s;
        border-bottom-color: #5cb7fa;
      }
      .loading .tri:nth-child(4) {
        left: 45px;
        top: 27px;
        animation-delay: 0.3s;
        border-top-color: #41abfa;
      }
      .loading .tri:nth-child(5) {
        top: 27px;
        left: 30px;
        animation-delay: 0.4s;
        border-bottom-color: #26a1fc;
      }
      .loading .tri:nth-child(6) {
        top: 27px;
        left: 15px;
        animation-delay: 0.5s;
        border-top-color: #1c1f27;
      }
      .loading .tri,
      .loading .tri.upwards {
        border-left: 15px solid transparent;
        border-right: 15px solid transparent;
      }
      .loading .tri {
        position: absolute;
        opacity: 0;
        animation: pulse-opacity 0.6s ease-in infinite;
        border-top: 27px solid #fff;
        border-bottom: 0;
      }
    `
  }
  public render() {
    return html`
      <div class="loading">
        <div class="tri upwards"></div>
        <div class="tri"></div>
        <div class="tri upwards"></div>
        <div class="tri"></div>
        <div class="tri upwards"></div>
        <div class="tri"></div>
      </div>
    `
  }
}
