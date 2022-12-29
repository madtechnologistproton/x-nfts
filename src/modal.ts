import { css, customElement, html, LitElement, property } from 'lit-element'
import { classMap } from 'lit-html/directives/class-map'
import { AssetNFT, ThemeMode } from './types'

@customElement('modal-dialog')
export class Modal extends LitElement {
  @property({ type: Object }) public asset: AssetNFT | null = null
  @property({ type: Boolean }) public open: boolean = false
  @property({ type: String }) public mode: string = ThemeMode.Light

  static get styles() {
    return css`
      :host {
        font-family: Arial, Helvetica, sans-serif;
      }
      .asset-modal {
        opacity: 0;
        position: absolute;
        top: 0px;
        z-index: 10;
        transition: opacity 0.25s ease-in;
      }
      .asset-modal:not(.asset-modal-open) {
        visibility: hidden;
      }
      .asset-modal.asset-modal-open {
        align-items: center;
        display: flex;
        justify-content: center;
        width: 100%;
        height: 100%;
        opacity: 1;
        visibility: visible;
      }
      .asset-modal-overlay {
        background: rgba(0, 0, 0, 0.8);
        height: 100%;
        width: 100%;
        position: relative;
      }
      .asset-modal-dialog {
        background: #ffffff;
        border-radius: 13px;
        max-width: 600px;
        padding: 1rem;
        position: absolute;
        overflow: scroll;
        height: fit-content;
        max-height: 90%;
      }
      .asset-modal-dialog .asset-modal-title {
        margin: 0 0 10px;
      }
      .asset-modal-dialog .asset-modal-close-button {
        background-color: #d81e5b;
        color: white;
        font-size: 16px;
        padding: 15px 32px;
        border: none;
        border-radius: 10px;
        text-decoration: none;
        display: inline-block;
        margin-top: 10px;
        cursor: pointer;
        float: right;
      }
      .asset-modal-dark .asset-modal-dialog {
        background-color: #1f1f1f;
        color: white;
      }
    `
  }

  public render() {
    if (!this.asset) {
      return undefined
    }

    const { data = {} } = this.asset
    return html`
      <div
        class="${classMap({
          'asset-modal': true,
          'asset-modal-open': this.open,
          'asset-modal-dark': this.mode === ThemeMode.Dark,
        })}"
      >
        <div class="asset-modal-overlay"></div>
        <div class="asset-modal-dialog">
          <h1 class="asset-modal-title">Owner metadata</h1>
          <div class="asset-modal-content" class="content">
            ${this.getMetadataTemplate(data)}
          </div>
          <button
            class="asset-modal-close-button"
            @click="${(e: any) => this.eventHandler(e, 'closeModal')}"
          >
            Close
          </button>
        </div>
      </div>
    `
  }

  private getMetadataTemplate(data: { [key: string]: string }) {
    const metadataKey = Object.keys(data)
    if (metadataKey.length > 0) {
      return html`
        <div class="asset-modal-metadata">
          ${metadataKey.map((key) => {
            return html`<p key="${key}" class="asset-modal-metadata-text">
              ${key}: ${data[key]}
            </p>`
          })}
        </div>
      `
    }
    return html`
      <div>
        <div class="asset-modal-metadata">No metadata</div>
      </div>
    `
  }

  private eventHandler(_event: any, type: string) {
    const buttonEvent = new CustomEvent('button-event', {
      detail: {
        type,
      },
    })
    this.dispatchEvent(buttonEvent)
  }
}
