import { css, html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";

import { fireEvent, safeCustomElement } from "../ha";
import type { Localize } from "../localize";
import { monthNames, monthWidths, seasonRanges, YEAR_DAYS } from "../seasons";
import type { Season } from "../types";

const FALLBACK_COLOR = "#607d8b";

/**
 * The year as a bar with the seasons on it; tap a season to select it.
 * Days outside every season are left grey (heating off). Fires `select` ({id}).
 */
@safeCustomElement("shs-season-bar")
export class SeasonBar extends LitElement {
  @property({ attribute: false }) seasons: Season[] = [];
  @property() selected: string | null = null;
  /** Day of the (leap) year to mark as today, 1 January = 1. */
  @property({ attribute: false }) today: number | null = null;
  @property() language = "en";
  @property({ attribute: false }) localize!: Localize;

  protected render() {
    const months = monthNames(this.language);
    const widths = monthWidths();
    return html`
      <div class="months" aria-hidden="true">
        ${months.map((name, i) => html`<span style="width:${widths[i] * 100}%">${name}</span>`)}
      </div>
      <div class="bar">
        ${this.seasons.flatMap((season) =>
          seasonRanges(season).map(([first, last]) => {
            const width = (last - first + 1) / YEAR_DAYS;
            return html`<button
              class=${season.id === this.selected ? "selected" : ""}
              style="left:${((first - 1) / YEAR_DAYS) * 100}%;width:${width *
              100}%;background:${season.color ?? FALLBACK_COLOR}"
              aria-label=${this.localize("seasons.select", { name: season.name })}
              aria-pressed=${season.id === this.selected}
              @click=${() => fireEvent(this, "select", { id: season.id })}
            >
              <span>${season.name}</span>
            </button>`;
          }),
        )}
        ${this.today === null
          ? nothing
          : html`<div class="today" style="left:${((this.today - 0.5) / YEAR_DAYS) * 100}%"></div>`}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    .months {
      color: var(--secondary-text-color);
      display: flex;
      font-size: 10px;
      margin-bottom: 4px;
      text-align: center;
    }
    .months span {
      overflow: hidden;
    }
    .bar {
      background: var(--divider-color);
      border-radius: 8px;
      height: 34px;
      position: relative;
    }
    button {
      border: none;
      border-radius: 6px;
      bottom: 0;
      color: #fff;
      container-type: inline-size;
      cursor: pointer;
      font: inherit;
      font-size: 11px;
      font-weight: 600;
      overflow: hidden;
      padding: 0;
      position: absolute;
      top: 0;
      white-space: nowrap;
    }
    button.selected {
      outline: 2px solid var(--primary-text-color);
      outline-offset: 2px;
      z-index: 1;
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    @container (max-width: 56px) {
      button span {
        visibility: hidden;
      }
    }
    .today {
      background: var(--primary-text-color);
      border-radius: 1px;
      bottom: -6px;
      pointer-events: none;
      position: absolute;
      top: -6px;
      transform: translateX(-1px);
      width: 2px;
      z-index: 2;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "shs-season-bar": SeasonBar;
  }
}
