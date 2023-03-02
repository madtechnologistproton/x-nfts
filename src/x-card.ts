import { css, customElement, html, LitElement, property } from 'lit-element'
import { styleMap } from 'lit-html/directives/style-map'
import { provider as Web3Provider } from 'web3-core'

/* lit-element classes */
import './loader.ts'
import './x-card-front.ts'
import './modal.ts'
import './x-card-info.ts'

import { AssetNFT, ButtonEvent, Network, ThemeMode } from './types'
import { getNFTContract, getProvider } from './utils'
import { classMap } from 'lit-html/directives/class-map'

const HORIZONTAL_MIN_CARD_HEIGHT = '170px'
const VERT_MIN_CARD_HEIGHT = '100px'

const VERT_CARD_HEIGHT = '100px'
const VERT_CARD_WIDTH = '380px'

const VERT_CARD_WIDTH_MOBILE = '100%'

const HORIZONTAL_CARD_HEIGHT = '170px'
const HORIZONTAL_CARD_WIDTH = '100%'
const HORIZONTAL_CARD_MAX_WIDTH = '670px'

enum OrientationMode {
  Auto = 'auto',
  Manual = 'manual',
}

const MOBILE_BREAK_POINT = 600

/**
 * x-card element that manage Nft card.
 * Facilitates acquisition and distribution data between
 * components.
 * Registers <x-card> as an HTML tag.
 */
@customElement('x-card')
export class NftCard extends LitElement {
  /* User configurable properties */
  @property({ type: Boolean }) public horizontal?: boolean
  @property({ type: Boolean }) public vertical?: boolean
  @property({ type: String }) public orientationMode?: OrientationMode
  @property({ type: String }) public tokenAddress: string = ''
  @property({ type: String }) public contractAddress: string = ''
  @property({ type: String }) public baseIncomeStreamAddress: string =
    '0x3534955239dCebb283E23D8f02fe05B4cd5785e2' // Default : '0x3534955239dCebb283E23D8f02fe05B4cd5785e2'
  @property({ type: String }) public tokenId: string = ''
  @property({ type: String }) public width: string = ''
  @property({ type: String }) public height: string = ''
  @property({ type: String }) public minHeight: string = ''
  @property({ type: String }) public maxWidth: string = ''
  @property({ type: String }) public network: Network = Network.Mainnet
  @property({ type: String }) public infuraId: string = ''
  @property({ type: String }) public mode: string = ThemeMode.Light
  @property({ type: String }) public referrerAddress: string = ''

  @property({ type: Object }) private asset: AssetNFT | null = null
  @property({ type: String }) public flippedCard: boolean = false
  @property({ type: Object }) private provider: Web3Provider = null

  // Card state variables
  @property({ type: Boolean }) private loading = true
  @property({ type: Boolean }) private error = false
  @property({ type: Boolean }) private openModal = false

  static get styles() {
    return css`
      :host {
        all: initial;
      }
      p {
        margin: 0;
        -webkit-font-smoothing: antialiased;
      }
      .card {
        background-color: white;
        font-family: sans-serif;
        -webkit-font-smoothing: antialiased;
        font-style: normal;
        font-weight: normal;
        line-height: normal;
        perspective: 1000px;
        margin: auto;
        border-top:    3px solid  #BABABA;
        border-right:  3px solid #BABABA;
        border-left: 3px solid #BABABA;
        border-top-left-radius: 38px;
        border-top-right-radius: 38px;
      }
      .card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        transition: transform 0.6s;
        transform-style: preserve-3d;
        overflow: hidden;
        border-top-left-radius: 36px;
        border-top-right-radius: 36px;
      }
      .card-info {
        margin: auto;
        border-bottom:    1px solid  rgb(96, 96, 96);
        border-right:  1px solid rgb(96, 96, 96);
        border-left: 1px solid rgb(96, 96, 96);
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
      }
      .flipped-card .card-inner {
        transform: rotateY(180deg);
      }
      .card .error {
        height: 100%;
        display: flex;
        flex-flow: column;
        justify-content: center;
        text-align: center;
      }
      .card .error-moji {
        font-size: 50px;
      }
      .card .error-message {
        font-size: 16px;
      }
      .card-dark .card-inner {
        background: #1f1f1f;
      }
      .card-dark .error {
        color: white;
      }
      .card-info:not(.is-vertical) {
        display: none;
      }
      .card:not(.is-vertical)  {
        border-bottom: 3px solid  #BABABA;
        border-bottom-left-radius: 38px;
        border-bottom-right-radius: 38px;
      }
      .card:not(.is-vertical) .card-inner {
        border-bottom-left-radius: 36px;
        border-bottom-right-radius: 36px;
      }
    `
  }

  public async connectedCallback() {
    super.connectedCallback()
    this.tokenAddress = this.contractAddress
      ? this.contractAddress
      : this.tokenAddress

    /* If user sets any style overrides assume manual mode unless user has defined the mode */
    if (!this.orientationMode) {
      this.orientationMode =
        this.width || this.height || this.horizontal || this.vertical
          ? OrientationMode.Manual
          : OrientationMode.Auto
    }

    this.horizontal = this.horizontal || !this.vertical

    let vertCardWidth = VERT_CARD_WIDTH
    if (
      this.orientationMode === OrientationMode.Auto &&
      window.innerWidth < MOBILE_BREAK_POINT
    ) {
      vertCardWidth = VERT_CARD_WIDTH_MOBILE
      this.horizontal = false
    }

    // Set default dimensions
    this.width = this.width
      ? this.width
      : this.horizontal
      ? HORIZONTAL_CARD_WIDTH
      : vertCardWidth
    this.height = this.height
      ? this.height
      : this.horizontal
      ? HORIZONTAL_CARD_HEIGHT
      : VERT_CARD_HEIGHT
    this.minHeight = this.horizontal
      ? HORIZONTAL_MIN_CARD_HEIGHT
      : VERT_MIN_CARD_HEIGHT
    this.maxWidth = this.horizontal ? HORIZONTAL_CARD_MAX_WIDTH : ''

    this.provider = getProvider(this.network, this.infuraId)

    try {
      this.asset = await getNFTContract(
        this.provider,
        this.tokenAddress,
        this.tokenId,
        this.baseIncomeStreamAddress
      )
    } catch (e) {
      this.error = true
      // Probably could not find the asset
      console.error(e)
    }

    this.loading = false

    // Tell the component to update with new state
    await this.requestUpdate()
  }

  public renderErrorTemplate() {
    return html`
      <div class="error">
        <div class="error-moji">¯\\_(ツ)_/¯</div>
        <div class="error-message">Problem loading asset.</div>
      </div>
    `
  }

  public renderLoaderTemplate() {
    return html` <loader-element></loader-element> `
  }

  public renderInnerCardTemplate() {
    return html`
      <x-card-front
        .horizontal=${this.horizontal}
        @button-event="${this.eventHandler}"
        .asset=${this.asset}
        .mode=${this.mode}
        .state=${{
          network: this.network,
        }}
        .flippedCard="${this.flippedCard}"
      ></x-card-front>
    `
  }

  public render() {
    return html`
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap');
      </style>
      <modal-dialog
        .mode=${this.mode}
        .asset=${this.asset}
        .open=${this.openModal}
        @button-event="${this.eventHandler}"
      ></modal-dialog>
      <div
        class="card card-${this.mode} ${this.flippedCard
          ? 'flipped-card'
          : ''} ${!this.horizontal ? 'is-vertical' : ''} "
        style=${styleMap({
          width: this.width,
          height: this.height,
          minHeight: this.minHeight,
          maxWidth: this.maxWidth,
        })}
      >
        <div class="card-inner">
          ${this.loading
            ? this.renderLoaderTemplate()
            : this.error
            ? this.renderErrorTemplate()
            : this.renderInnerCardTemplate()}
        </div>
      </div>
      <div
        class="card-info 
        ${classMap({
          'is-vertical': !this.horizontal,
        })} "
        style=${styleMap({
          width: this.width,
          maxWidth: this.maxWidth,
        })}
      >
        <x-card-info .mode=${this.mode} .nftLink="{ss}">dddddd</x-card-info>
      </div>
    `
  }

  private flipCard() {
    this.flippedCard = !this.flippedCard
  }

  private async eventHandler(event: ButtonEvent) {
    const { detail } = event

    switch (detail.type) {
      case 'view':
        this.goToNftLink()
        break
      case 'flip':
        this.flipCard()
        break
      case 'openModal':
        this.openModal = true
        break
      case 'closeModal':
        this.openModal = false
        break
    }
  }

  private goToNftLink() {
    const url = this.referrerAddress
      ? `${this.asset?.sendTipLink}?ref=${this.referrerAddress}`
      : this.asset?.sendTipLink
    window.open(url, '_blank')
  }
}
