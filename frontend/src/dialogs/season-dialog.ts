import { css, html, LitElement, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";

import "../components/dialog";
import { fireEvent, safeCustomElement } from "../ha";
import type { Localize } from "../localize";
import { overlappingSeason, randomId, SEASON_COLORS, wrapsNewYear } from "../seasons";
import { sharedStyles } from "../styles";
import type { Season } from "../types";

// Dates are picked in a leap year so 29 February can be chosen; the year is ignored.
const YEAR = 2024;
const toInput = (monthDay: string) => `${YEAR}-${monthDay}`;
const fromInput = (value: string) => value.slice(5);

/**
 * Create or edit a season: name, colour and the first and last day.
 * Fires `save` ({season}), `delete` ({season}) or `closed`.
 */
@safeCustomElement("shs-season-dialog")
export class SeasonDialog extends LitElement {
  @property({ type: Boolean }) open = false;
  /** The season to edit; null to create one. */
  @property({ attribute: false }) season: Season | null = null;
  @property({ attribute: false }) seasons: Season[] = [];
  @property({ attribute: false }) localize!: Localize;

  @state() private _draft: Season = { id: "", name: "", start: "10-15", end: "04-15", color: SEASON_COLORS[0] };

  protected willUpdate(changed: PropertyValues) {
    if (changed.has("open") && this.open) {
      this._draft = this.season
        ? { ...this.season }
        : {
            id: randomId(),
            name: "",
            start: "10-15",
            end: "04-15",
            color: SEASON_COLORS[this.seasons.length % SEASON_COLORS.length],
          };
    }
  }

  private _set(changes: Partial<Season>) {
    this._draft = { ...this._draft, ...changes };
  }

  protected render() {
    const draft = this._draft;
    const overlap = overlappingSeason(draft, this.seasons);
    const valid = draft.name.trim().length > 0 && !overlap;
    return html`<shs-dialog
      .open=${this.open}
      .heading=${this.localize(this.season ? "season_dialog.edit" : "season_dialog.new")}
      @closed=${() => fireEvent(this, "closed")}
    >
      <div class="form">
        <label class="field">
          <span>${this.localize("season_dialog.name")}</span>
          <input
            type="text"
            maxlength="50"
            .value=${draft.name}
            @input=${(ev: Event) => this._set({ name: (ev.target as HTMLInputElement).value })}
          />
        </label>
        <div class="field">
          <span id="color-label">${this.localize("season_dialog.color")}</span>
          <div class="colors" role="radiogroup" aria-labelledby="color-label">
            ${SEASON_COLORS.map(
              (color) => html`<button
                role="radio"
                aria-checked=${draft.color === color}
                aria-label=${color}
                class=${draft.color === color ? "selected" : ""}
                style="background:${color}"
                @click=${() => this._set({ color })}
              ></button>`,
            )}
          </div>
        </div>
        <div class="dates">
          <label class="field">
            <span>${this.localize("season_dialog.start")}</span>
            <input
              type="date"
              min="${YEAR}-01-01"
              max="${YEAR}-12-31"
              .value=${toInput(draft.start)}
              @change=${(ev: Event) => {
                const value = (ev.target as HTMLInputElement).value;
                if (value) this._set({ start: fromInput(value) });
              }}
            />
          </label>
          <label class="field">
            <span>${this.localize("season_dialog.end")}</span>
            <input
              type="date"
              min="${YEAR}-01-01"
              max="${YEAR}-12-31"
              .value=${toInput(draft.end)}
              @change=${(ev: Event) => {
                const value = (ev.target as HTMLInputElement).value;
                if (value) this._set({ end: fromInput(value) });
              }}
            />
          </label>
        </div>
        <p class="secondary note">
          ${this.localize("season_dialog.year")}
          ${wrapsNewYear(draft) ? this.localize("season_dialog.wraps") : nothing}
        </p>
        ${overlap
          ? html`<p class="error note" role="alert">
              ${this.localize("season_dialog.overlap", { name: overlap.name })}
            </p>`
          : nothing}
      </div>
      ${this.season
        ? html`<button
            slot="secondary"
            class="text-button danger"
            @click=${() => fireEvent(this, "delete", { season: this.season })}
          >
            ${this.localize("season_dialog.delete")}
          </button>`
        : nothing}
      <button slot="actions" class="text-button" @click=${() => fireEvent(this, "closed")}>
        ${this.localize("common.cancel")}
      </button>
      <button
        slot="actions"
        class="filled-button"
        ?disabled=${!valid}
        @click=${() => fireEvent(this, "save", { season: { ...draft, name: draft.name.trim() } })}
      >
        ${this.localize("common.save")}
      </button>
    </shs-dialog>`;
  }

  static styles = [
    sharedStyles,
    css`
      .form {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .field {
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 6px;
        font-size: 13px;
        font-weight: 600;
      }
      input[type="text"],
      input[type="date"] {
        background: var(--ha-card-background, var(--card-background-color, #fff));
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        box-sizing: border-box;
        color: var(--primary-text-color);
        color-scheme: light dark;
        font: inherit;
        font-weight: 400;
        height: 44px;
        padding: 0 10px;
        width: 100%;
      }
      .dates {
        display: flex;
        gap: 12px;
      }
      .colors {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .colors button {
        border: 3px solid transparent;
        border-radius: 50%;
        cursor: pointer;
        height: 36px;
        width: 36px;
      }
      .colors button.selected {
        border-color: var(--primary-text-color);
      }
      .note {
        font-size: 13px;
        margin: 0;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "shs-season-dialog": SeasonDialog;
  }
}
