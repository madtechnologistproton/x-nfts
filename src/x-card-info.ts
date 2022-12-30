import { css, customElement, html, LitElement, property } from 'lit-element'
import { ThemeMode } from './types'

@customElement('x-card-info')
export class Loader extends LitElement {
  @property({ type: String }) public mode: string = ThemeMode.Light
  @property({ type: String }) public nftLink: string = ''

  static get styles() {
    return css`
      .asset-info {
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
        border-top: 1px solid rgb(226, 230, 239);

      }
      .asset-info.dark {
        background-color: #1f1f1f;
        border-top: 1px solid rgb(96, 96, 96);
      }
      .asset-info p {
        margin: 0px;
        padding: 5px 10px;
        font-size: 12px;
        text-align: center;
      }
      .asset-info.dark p {
        color: white;
      }
      .asset-info .asset-info-nft-link {
        color: #3291e9;
        font-weight: 600;
      }
    `
  }
  public render() {
    return html`
      <div class="asset-info ${this.mode}">
        <p>
          This content is set by the owner of
          <a class="asset-info-nft-link" href="${this.nftLink}" target="_blank"
            >this NFT</a
          >. Whoever owns the NFT can update the sponsor/ad info on the page
        </p>
      </div>
    `
  }
}
