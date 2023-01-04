import { css, customElement, html, LitElement, property } from 'lit-element'

import { classMap } from 'lit-html/directives/class-map'
import { styleMap } from 'lit-html/directives/style-map'
/* lit-element classes */
import { AssetNFT, State, ThemeMode } from './types'
const noImage =
  'https://raw.githubusercontent.com/madtechnologistproton/x-nfts/de818da1b88db9dafeefb682909222a013cc2158/src/images/no-image.svg'
@customElement('x-card-front')
export class NftCardFrontTemplate extends LitElement {
  @property({ type: Object }) public asset: AssetNFT | null = null
  @property({ type: String }) public mode: string = ThemeMode.Light
  @property({ type: Boolean }) public horizontal!: boolean
  @property({ type: Object }) public state!: State
  @property({ type: Boolean }) public flippedCard: boolean = false
  static get styles() {
    return css`
      .card-front.is-flipped {
        display: none;
      }
      .card-front {
        position: absolute;
        backface-visibility: hidden;
        background: #ffffff;
        border-radius: 5px;
        display: flex;
        position: relative;
        width: 100%;
        height: 100%;
        transform: translateY(0);
        overflow: hidden;
      }
      .is-vertical {
      }
      .card-front p {
        margin: 0;
      }

      .asset-image-container {
        border-right: 1px solid #e2e6ef;
        background-size: cover;
        box-sizing: border-box;
        aspect-ratio: 1 / 1;
      }

      .asset-image {
        background-size: contain;
        background-position: center center;
        background-repeat: no-repeat;
        height: 100%;
        box-sizing: border-box;
      }

      .asset-details-container {
        padding: 20px;
        align-items: center;
        overflow: hidden;
      }

      .asset-detail {
        display: flex;
      }
      .asset-detail .asset-detail-type {
        height: 35px;
        font-size: 12px;
        margin-right: 10px;
      }
      .asset-detail .asset-detail-badge {
        width: 54px;
        height: 30px;
        font-size: 12px;
      }
      .asset-metadata {
        font-weight: 400;
        text-align: left;
        cursor: pointer;
      }
      .asset-metadata-text {
        width: auto;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .asset-info {
        grid-column: 1 / 3;
        font-size: 12px;
        text-align: left;
        margin-top: 10px;
      }
      .asset-info .asset-info-nft-link {
        color: #3291e9;
        font-weight: 600;
      }
      .asset-detail-price {
        align-items: flex-end;
        font-size: 18px;
        font-weight: 400;
        display: flex;
        flex-flow: row;
        justify-content: flex-end;
        line-height: 15px;
        text-align: right;
        padding: 6px 0;
      }
      .asset-action {
        padding-top: 20px;
      }
      .asset-action-buy {
        grid-column-start: 1;
        grid-column-end: 3;
      }
      .asset-action-buy button {
        width: fit-content;
        background: #3291e9;
        border-radius: 20px;
        height: 35px;
        color: white;
        font-weight: bold;
        letter-spacing: 0.5px;
        cursor: pointer;
        transition: 200ms;
        outline: none;
        border-style: none;
        text-transform: uppercase;
      }
      .is-vertical .asset-action-buy button {
        font-size: 10px;
        height: 25px;
      }
      .asset-action-buy button:hover {
        background: rgb(21, 61, 98);
      }
      .asset-link {
        text-decoration: none;
        color: #222222;
      }
      .is-vertical .asset-info {
        display: none;
      }
      .is-vertical .asset-details-container {
        padding: 10px;
      }
      .card-front-dark {
        background-color: #1f1f1f;
      }
      .card-front-dark .asset-metadata-text,
      .card-front-dark .asset-info {
        color: white;
      }
      .card-front-dark .asset-image-container {
        border-right: 1px solid #606060;
      }
      .card-front.is-vertical .asset-image-container {
        padding: 10px;
      }
      .card-front.is-vertical .asset-image-container .asset-image {
        border-radius: 20px;
      }
      .card-front.is-vertical .asset-metadata-text {
        font-size: 15px;
      }
    `
  }

  /**
   * Implement `render` to define a template for your element.
   */
  public render() {
    if (!this.asset) {
      return undefined // If there is no asset then we can't render
    }

    const { nftLink, displaytext } = this.asset
    
    return html`
      <div style="height: 100%;">
        <div
          class="card-front ${classMap({
            'is-vertical': !this.horizontal,
            'is-flipped': this.flippedCard,
            'card-front-dark': this.mode === ThemeMode.Dark,
          })}"
        >
          ${this.getAssetImageTemplate()}
          <div class="asset-details-container">
            ${this.getMetadataTemplate(displaytext as string)}
            <div class="asset-action">
              <div class="asset-action-buy">${this.getButtonTemplate()}</div>
              <div class="asset-info">
                <p>
                  This content is set by the owner of
                  <a
                    class="asset-info-nft-link"
                    href="${nftLink}"
                    target="_blank"
                    >this NFT</a
                  >. Whoever owns the NFT can update the sponsor/ad info on the
                  page
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="asset-info-vertical">
          <p>
            This content is set by the owner of
            <a class="asset-info-nft-link" href="${nftLink}" target="_blank"
              >this NFT</a
            >. Whoever owns the NFT can update the sponsor/ad info on the page
          </p>
        </div>
      </div>
    `
  }

  /*
   * EventHandler - Dispatch event allowing parent to handle click event
   * '_event' isn't used here but it's needed to call the handler
   */
  public eventHandler(_event: any, type: string) {
    const buttonEvent = new CustomEvent('button-event', {
      detail: {
        type,
      },
    })
    this.dispatchEvent(buttonEvent)
  }

  private getAssetImageTemplate() {
    if (!this.asset) {
      return undefined
    }
    const { imageUrl, nftLink } = this.asset
    return html`
      <div class="asset-image-container">
        <a href="${nftLink}" target="_blank">
          <div
            class="asset-image"
            style=${styleMap({
              'background-image': `url(${imageUrl || noImage})`,
            })}
          ></div>
        </a>
      </div>
    `
  }

  private getButtonTemplate() {
    return html`
      <button @click="${(e: any) => this.eventHandler(e, 'view')}">
        Send tip to the owner
      </button>
    `
  }

  private getMetadataTemplate(displaytext: string) {
    if (displaytext.length > 0) {
      return html`
        <div
          title="Click to view detail"
          class="asset-metadata"
          @click="${(e: any) => this.eventHandler(e, 'openModal')}"
        >
          <p class="asset-metadata-text">${displaytext}</p>
        </div>
      `
    }
    return html` <div><p class="asset-metadata-text">No display text</p></div> `
  }
}
