import { mdiAlertCircleOutline, mdiDeleteOutline, mdiDownload, mdiMenu, mdiPencilOutline, mdiPlus, mdiThermostat } from "@mdi/js";
import { css, html, LitElement, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import { repeat } from "lit/directives/repeat.js";

import { BANDS, OFF_COLOR } from "../colors";
import { addRoom, removeRoom, resetSeasons, saveRoom, saveSeasons, setAway } from "../api";
import "../components/dialog";
import "../components/program-card";
import "../components/resume-row";
import "../components/season-bar";
import "../dialogs/entity-picker-dialog";
import "../dialogs/season-dialog";
import { firstWeekday, formatIsoTime, uses12h, weekdayName, zonedTime } from "../format";
import { canTurnOff, entityName, fireEvent, safeCustomElement, showToast } from "../ha";
import type { Localize } from "../localize";
import { orderedDays, WEEKDAYS } from "../schedule";
import {
  dayOfYear,
  formatMonthDay,
  freeDays,
  fromDayOfYear,
  formatMonthDayValue,
  parseMonthDay,
  randomId,
  seasonContains,
  uncoveredRanges,
  type MonthDay,
} from "../seasons";
import { roomStatusText } from "../status";
import { renderSwitch, sharedStyles, toolbarStyles } from "../styles";
import { FAHRENHEIT, formatTemperature, limitsFor } from "../temperature";
import type { Block, HomeAssistant, PanelState, Program, Room, Season } from "../types";

const SAVE_DELAY = 700;

const defaultBlocks = (unit: string): Block[] =>
  unit === FAHRENHEIT
    ? [
        { start: "00:00", temperature: 63 },
        { start: "06:30", temperature: 68 },
        { start: "22:30", temperature: 63 },
      ]
    : [
        { start: "00:00", temperature: 17 },
        { start: "06:30", temperature: 20 },
        { start: "22:30", temperature: 17 },
      ];

/** Today's month and day in the Home Assistant time zone. */
const todayMonthDay = (timeZone?: string): MonthDay => {
  try {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone, month: "numeric", day: "numeric" }).formatToParts(
      new Date(),
    );
    const part = (type: string) => Number(parts.find((p) => p.type === type)?.value);
    return [part("month"), part("day")];
  } catch {
    const now = new Date();
    return [now.getMonth() + 1, now.getDate()];
  }
};

/** The whole panel: entity, Away, seasons, what happens now and the programs of a season. */
@safeCustomElement("shs-main-view")
export class MainView extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) state!: PanelState;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) localize!: Localize;

  @state() private _entityId?: string;
  @state() private _seasonId?: string;
  /** Unsaved or in-flight programs, keyed "entity|season". */
  @state() private _drafts: Record<string, Program[]> = {};
  @state() private _addOpen = false;
  @state() private _removeOpen = false;
  @state() private _resetOpen = false;
  @state() private _seasonDialog: { season: Season | null } | null = null;
  @state() private _deleteSeason: Season | null = null;
  @state() private _deleteProgram: Program | null = null;
  @state() private _rename: { program: Program; name: string } | null = null;

  private _timers = new Map<string, number>();
  /** Saves in flight per key; a draft is kept until all of them are done. */
  private _inflight = new Map<string, number>();

  disconnectedCallback() {
    super.disconnectedCallback();
    for (const key of [...this._timers.keys()]) this._flush(key);
  }

  protected willUpdate(changed: PropertyValues) {
    if (!changed.has("state")) return;
    // Fresh data from the server replaces drafts that are not waiting to be saved.
    const drafts = Object.fromEntries(
      Object.entries(this._drafts).filter(([key]) => this._timers.has(key) || this._inflight.has(key)),
    );
    if (Object.keys(drafts).length !== Object.keys(this._drafts).length) this._drafts = drafts;
    if (!this._room && this.state.rooms.length) this._entityId = this.state.rooms[0].entity_id;
    if (!this._season) this._seasonId = this.state.season ?? this.state.seasons[0]?.id;
  }

  private get _readOnly() {
    return !this.hass.user?.is_admin;
  }

  private get _room(): Room | undefined {
    return this.state.rooms.find((room) => room.entity_id === this._entityId);
  }

  private get _season(): Season | undefined {
    return this.state.seasons.find((season) => season.id === this._seasonId);
  }

  private _key(seasonId: string) {
    return `${this._entityId}|${seasonId}`;
  }

  private _programs(room: Room, seasonId: string): Program[] {
    return this._drafts[`${room.entity_id}|${seasonId}`] ?? room.programs[seasonId] ?? [];
  }

  private _error(err: any) {
    showToast(this, this.localize("error.save", { error: err?.message ?? String(err) }));
  }

  private async _call(promise: Promise<unknown>) {
    try {
      await promise;
    } catch (err) {
      this._error(err);
    }
  }

  // ------------------------------------------------------------------
  // Saving programs

  private _setPrograms(seasonId: string, programs: Program[], delay = SAVE_DELAY) {
    const key = this._key(seasonId);
    this._drafts = { ...this._drafts, [key]: programs };
    const timer = this._timers.get(key);
    if (timer !== undefined) clearTimeout(timer);
    this._timers.set(
      key,
      window.setTimeout(() => this._flush(key), delay),
    );
  }

  private async _flush(key: string) {
    const timer = this._timers.get(key);
    if (timer !== undefined) clearTimeout(timer);
    this._timers.delete(key);
    const programs = this._drafts[key];
    if (!programs) return;
    const [entityId, seasonId] = key.split("|");
    this._inflight.set(key, (this._inflight.get(key) ?? 0) + 1);
    try {
      await saveRoom(this.hass, entityId, { programs: { [seasonId]: programs } });
    } catch (err) {
      this._error(err);
    } finally {
      const count = (this._inflight.get(key) ?? 1) - 1;
      if (count > 0) this._inflight.set(key, count);
      else this._inflight.delete(key);
      if (!this._timers.has(key) && !this._inflight.has(key)) {
        const { [key]: _done, ...rest } = this._drafts;
        this._drafts = rest;
      }
    }
  }

  private _updateProgram(seasonId: string, programs: Program[], id: string, changes: Partial<Program>, delay?: number) {
    this._setPrograms(
      seasonId,
      programs.map((program) => (program.id === id ? { ...program, ...changes } : program)),
      delay,
    );
  }

  private _toggleDay(seasonId: string, programs: Program[], id: string, day: string) {
    const target = programs.find((program) => program.id === id)!;
    const adding = !target.days.includes(day);
    const sortDays = (days: string[]) => WEEKDAYS.filter((weekday) => days.includes(weekday));
    this._setPrograms(
      seasonId,
      programs.map((program) => {
        if (program.id === id) {
          return { ...program, days: adding ? sortDays([...program.days, day]) : program.days.filter((d) => d !== day) };
        }
        return adding ? { ...program, days: program.days.filter((d) => d !== day) } : program;
      }),
      0,
    );
  }

  private _addProgram(seasonId: string, programs: Program[]) {
    const days = freeDays(programs, WEEKDAYS);
    const name = this.localize(days.length === 7 ? "programs.every_day" : "programs.new_name");
    this._setPrograms(
      seasonId,
      [...programs, { id: randomId(), name, days, blocks: defaultBlocks(this.state.unit) }],
      0,
    );
  }

  private _duplicate(seasonId: string, programs: Program[], program: Program) {
    const copy: Program = {
      id: randomId(),
      name: this.localize("programs.copy", { name: program.name }).slice(0, 50),
      days: [],
      blocks: program.blocks.map((block) => ({ ...block })),
    };
    const index = programs.indexOf(program);
    this._setPrograms(seasonId, [...programs.slice(0, index + 1), copy, ...programs.slice(index + 1)], 0);
  }

  // ------------------------------------------------------------------
  // Seasons and rooms

  private async _saveSeason(season: Season) {
    this._seasonDialog = null;
    const exists = this.state.seasons.some((s) => s.id === season.id);
    const seasons = exists
      ? this.state.seasons.map((s) => (s.id === season.id ? season : s))
      : [...this.state.seasons, season];
    await this._call(saveSeasons(this.hass, seasons));
    this._seasonId = season.id;
  }

  /** Forget unsaved edits whose entity or season is about to be deleted. */
  private _discard(matches: (entityId: string, seasonId: string) => boolean) {
    const drafts = { ...this._drafts };
    for (const key of new Set([...Object.keys(drafts), ...this._timers.keys()])) {
      const [entityId, seasonId] = key.split("|");
      if (!matches(entityId, seasonId)) continue;
      const timer = this._timers.get(key);
      if (timer !== undefined) clearTimeout(timer);
      this._timers.delete(key);
      delete drafts[key];
    }
    this._drafts = drafts;
  }

  private async _removeSeason(season: Season) {
    this._deleteSeason = null;
    this._discard((_, seasonId) => seasonId === season.id);
    await this._call(saveSeasons(this.hass, this.state.seasons.filter((s) => s.id !== season.id)));
    if (this._seasonId === season.id) this._seasonId = undefined;
  }

  private async _addRoom(entityId: string) {
    this._addOpen = false;
    try {
      await addRoom(this.hass, entityId);
      this._entityId = entityId;
    } catch (err) {
      this._error(err);
    }
  }

  private async _removeRoom() {
    this._removeOpen = false;
    const entityId = this._entityId!;
    this._entityId = undefined;
    this._discard((id) => id === entityId);
    await this._call(removeRoom(this.hass, entityId));
  }

  // ------------------------------------------------------------------
  // Rendering

  protected render() {
    const showMenu = this.narrow || this.hass.dockedSidebar === "always_hidden";
    const room = this._room;
    return html`
      <div class="toolbar">
        ${showMenu
          ? html`<ha-icon-button
              .path=${mdiMenu}
              .label=${"Menu"}
              @click=${() => fireEvent(this, "hass-toggle-menu")}
            ></ha-icon-button>`
          : nothing}
        <div class="title">${this.localize("title")}</div>
        <label class="away">
          <span>${this.localize("away.label")}</span>
          ${renderSwitch(this.state.away, (away) => this._call(setAway(this.hass, away)), this.localize("away.label"))}
        </label>
      </div>

      <div class="content">
        ${this._readOnly ? html`<p class="secondary notice">${this.localize("read_only")}</p>` : nothing}
        ${room ? this._renderEntity(room) : this._renderEmpty()} ${this._renderSeasons()}
        ${room
          ? html`<div class="columns">
              ${this._renderNow(room)}
              <section class="programs">${this._renderPrograms(room)}</section>
            </div>`
          : nothing}
      </div>
      ${this._renderDialogs(room)}
    `;
  }

  private _renderEmpty() {
    return html`<ha-card class="empty">
      <ha-svg-icon .path=${mdiThermostat}></ha-svg-icon>
      <h2>${this.localize("entity.none_title")}</h2>
      <p class="secondary">${this.localize("entity.none_text")}</p>
      ${this._readOnly
        ? nothing
        : html`<button class="filled-button" @click=${() => (this._addOpen = true)}>
            ${this.localize("entity.add")}
          </button>`}
    </ha-card>`;
  }

  private _renderEntity(room: Room) {
    const stateObj = this.hass.states[room.entity_id];
    const current = stateObj?.attributes.current_temperature;
    const unit = this.state.unit;
    return html`<ha-card class="entity">
      <div class="entity-main">
        <label class="field-label" for="entity">${this.localize("entity.label")}</label>
        ${this.state.rooms.length > 1
          ? html`<select
              id="entity"
              .value=${room.entity_id}
              @change=${(ev: Event) => (this._entityId = (ev.target as HTMLSelectElement).value)}
            >
              ${this.state.rooms.map(
                (r) =>
                  html`<option value=${r.entity_id} ?selected=${r.entity_id === room.entity_id}>
                    ${entityName(this.hass, r.entity_id)} · ${r.entity_id}
                  </option>`,
              )}
            </select>`
          : html`<div id="entity" class="entity-name">
              ${entityName(this.hass, room.entity_id)} <span class="secondary">· ${room.entity_id}</span>
            </div>`}
        ${typeof current === "number"
          ? html`<span class="secondary small"
              >${this.localize("entity.measured", {
                temperature: formatTemperature(current, unit, 0.1, false, this.hass.locale.language),
              })}</span
            >`
          : nothing}
      </div>
      <div class="entity-actions">
        <label class="switch-label">
          <span class="small">${this.localize("entity.enabled")}</span>
          ${renderSwitch(
            room.enabled,
            (enabled) => this._call(saveRoom(this.hass, room.entity_id, { enabled })),
            this.localize("entity.enabled"),
            this._readOnly,
          )}
        </label>
        ${this._readOnly
          ? nothing
          : html`<ha-icon-button
                .path=${mdiPlus}
                .label=${this.localize("entity.add")}
                @click=${() => (this._addOpen = true)}
              ></ha-icon-button>
              <ha-icon-button
                .path=${mdiDeleteOutline}
                .label=${this.localize("entity.remove")}
                @click=${() => (this._removeOpen = true)}
              ></ha-icon-button>`}
      </div>
    </ha-card>`;
  }

  private _renderSeasons() {
    const language = this.hass.locale.language;
    const today = dayOfYear(todayMonthDay(this.hass.config.time_zone));
    const gaps = uncoveredRanges(this.state.seasons);
    const ranges = gaps
      .map(
        ([first, last]) =>
          `${formatMonthDay(formatMonthDayValue(fromDayOfYear(first)), language, "short")} – ${formatMonthDay(
            formatMonthDayValue(fromDayOfYear(last)),
            language,
            "short",
          )}`,
      )
      .join(", ");
    const room = this._room;

    return html`<ha-card class="seasons">
      <div class="section-header">
        <div class="heading">
          <h2>${this.localize("seasons.title")}</h2>
          <span class="secondary small">${this.localize("seasons.subtitle")}</span>
        </div>
        ${this._readOnly
          ? nothing
          : html`<button class="outlined-button" @click=${() => (this._resetOpen = true)}>
                <ha-svg-icon .path=${mdiDownload}></ha-svg-icon>${this.localize("seasons.reset")}
              </button>
              <button class="filled-button small" @click=${() => (this._seasonDialog = { season: null })}>
                <ha-svg-icon .path=${mdiPlus}></ha-svg-icon>${this.localize("seasons.new")}
              </button>`}
      </div>
      <shs-season-bar
        .seasons=${this.state.seasons}
        .selected=${this._seasonId ?? null}
        .today=${today}
        .language=${language}
        .localize=${this.localize}
        @select=${(ev: CustomEvent) => (this._seasonId = ev.detail.id)}
      ></shs-season-bar>
      <span class="secondary small">
        ${gaps.length ? this.localize("seasons.outside", { ranges }) : this.localize("seasons.always")}
      </span>
      <div class="season-list">
        ${this.state.seasons.map((season) => {
          const count = room ? this._programs(room, season.id).length : 0;
          const programs = !room
            ? ""
            : count === 0
              ? this.localize("seasons.programs_none")
              : count === 1
                ? this.localize("seasons.programs_one")
                : this.localize("seasons.programs", { count: String(count) });
          const selected = season.id === this._seasonId;
          return html`<div class="season ${selected ? "selected" : ""}" style="--season-color:${season.color ?? "#607d8b"}">
            <button class="season-select" aria-pressed=${selected} @click=${() => (this._seasonId = season.id)}>
              <span class="dot"></span>
              <span class="season-text">
                <span class="season-name"
                  >${season.name}
                  ${season.id === this.state.season
                    ? html`<span class="badge">${this.localize("seasons.today")}</span>`
                    : nothing}</span
                >
                <span class="secondary small"
                  >${formatMonthDay(season.start, language, "short")} → ${formatMonthDay(season.end, language, "short")}${programs
                    ? ` · ${programs}`
                    : ""}</span
                >
              </span>
            </button>
            ${this._readOnly
              ? nothing
              : html`<ha-icon-button
                  .path=${mdiPencilOutline}
                  .label=${this.localize("seasons.edit", { name: season.name })}
                  @click=${() => (this._seasonDialog = { season })}
                ></ha-icon-button>`}
          </div>`;
        })}
      </div>
    </ha-card>`;
  }

  private _renderNow(room: Room) {
    const unit = this.state.unit;
    const language = this.hass.locale.language;
    const limits = limitsFor(this.hass.states[room.entity_id], unit);
    const status = room.status;
    const season = this.state.seasons.find((s) => s.id === status.season);
    const program = season ? room.programs[season.id]?.find((p) => p.id === status.program) : undefined;
    const statusText = roomStatusText(room, this.localize, {
      unit,
      step: 0.5,
      h12: uses12h(this.hass),
      language,
      timeZone: this.hass.config.time_zone,
    });
    const nextSeason = this._nextSeason();
    const h12 = uses12h(this.hass);
    const timeZone = this.hass.config.time_zone;
    const at = (iso: string | null) => (iso ? formatIsoTime(iso, h12, timeZone) : null);
    const named = (name: string | null | undefined, text: string) =>
      name ? this.localize("status.named", { name, status: text }) : text;
    const block = named(
      status.name,
      status.start || status.end ? `${at(status.start) ?? "…"} – ${at(status.end) ?? "…"}` : this.localize("now.none"),
    );
    const next =
      status.end === null
        ? this.localize("now.none")
        : `${at(status.end)} → ${named(
            status.next_name,
            status.next_temperature === null
              ? this.localize("now.off")
              : formatTemperature(status.next_temperature, unit, 0.5, false, language),
          )}`;
    const temperature =
      status.temperature === null
        ? this.localize("now.off")
        : formatTemperature(status.temperature, unit, 0.5, false, language);
    const awayText =
      this.hass.states[room.entity_id]?.attributes.preset_modes?.includes("away")
        ? this.localize("away.preset")
        : this.localize("away.temperature", {
            temperature: formatTemperature(this.state.away_temperature, unit, limits.step, false, language),
          });

    const overridden = room.enabled && status.overridden && !this.state.away;
    return html`<ha-card class="now ${overridden ? "overridden" : ""}">
      <div class="section-header">
        <h2>${this.localize("now.title")}</h2>
      </div>
      ${overridden
        ? html`<shs-resume-row
            .hass=${this.hass}
            .entityId=${room.entity_id}
            .localize=${this.localize}
            .until=${at(status.end) ?? ""}
          ></shs-resume-row>`
        : nothing}
      ${this.state.away
        ? html`<div class="away-banner">
            <strong>${this.localize("away.active")}</strong>
            <span class="small">${awayText}</span>
          </div>`
        : html`<div class="big">
              ${overridden
                ? html`<span class="value manual">${this._actualTarget(room) ?? temperature}</span>
                    <span class="secondary small"
                      >${this.localize("now.manual", { scheduled: temperature })}</span
                    >`
                : html`<span class="value">${room.enabled ? temperature : "—"}</span>
                    <span class="${statusText.error ? "error" : "secondary"} small">${statusText.text}</span>`}
            </div>
            <dl>
              <div>
                <dt>${this.localize("now.season")}</dt>
                <dd>${season?.name ?? this.localize("now.none")}</dd>
              </div>
              <div>
                <dt>${this.localize("now.program")}</dt>
                <dd>${program?.name ?? this.localize("now.none")}</dd>
              </div>
              <div>
                <dt>${this.localize("now.block")}</dt>
                <dd>${block}</dd>
              </div>
              <div>
                <dt>${this.localize("now.next")}</dt>
                <dd>${next}</dd>
              </div>
              <div>
                <dt>${this.localize("now.next_season")}</dt>
                <dd>
                  ${nextSeason
                    ? `${nextSeason.name} · ${formatMonthDay(nextSeason.start, language)}`
                    : this.localize("now.none")}
                </dd>
              </div>
            </dl>`}
      ${overridden ? nothing : html`<span class="secondary small">${this.localize("now.manual_hint")}</span>`}
    </ha-card>`;
  }

  /** What the thermostat was set to by hand: its target temperature, or off. */
  private _actualTarget(room: Room): string | null {
    const entity = this.hass.states[room.entity_id];
    if (!entity) return null;
    if (entity.state === "off") return this.localize("now.off");
    const target = entity.attributes.temperature;
    return typeof target === "number"
      ? formatTemperature(target, this.state.unit, 0.5, false, this.hass.locale.language)
      : null;
  }

  private _nextSeason(): Season | undefined {
    const today = dayOfYear(todayMonthDay(this.hass.config.time_zone));
    let best: Season | undefined;
    let bestDistance = Infinity;
    for (const season of this.state.seasons) {
      const distance = (dayOfYear(parseMonthDay(season.start)) - today + 366) % 366;
      if (distance > 0 && distance < bestDistance) {
        best = season;
        bestDistance = distance;
      }
    }
    return best;
  }

  private _renderPrograms(room: Room) {
    const season = this._season;
    if (!season) return nothing;
    const programs = this._programs(room, season.id);
    const language = this.hass.locale.language;
    const unit = this.state.unit;
    const stateObj = this.hass.states[room.entity_id];
    const limits = limitsFor(stateObj, unit);
    const days = orderedDays(firstWeekday(this.hass));
    const free = days.filter((day) => !programs.some((program) => program.days.includes(day)));
    const now = zonedTime(new Date(), this.hass.config.time_zone);
    const today = todayMonthDay(this.hass.config.time_zone);
    const seasonIsToday = seasonContains(season, today);
    const dayName = (day: string) => weekdayName(language, WEEKDAYS.indexOf(day as (typeof WEEKDAYS)[number]));

    return html`
      <div class="section-header">
        <div class="heading">
          <h2><span class="dot" style="--season-color:${season.color ?? "#607d8b"}"></span>${this.localize(
            "programs.title",
            { season: season.name },
          )}</h2>
          <span class="secondary small">${this.localize("programs.hint")}</span>
        </div>
        ${this._readOnly
          ? nothing
          : html`<button class="filled-button small" @click=${() => this._addProgram(season.id, programs)}>
              <ha-svg-icon .path=${mdiPlus}></ha-svg-icon>${this.localize("programs.new")}
            </button>`}
      </div>
      <div class="legend" aria-label=${this.localize("programs.legend")}>
        ${this._legend(unit, language).map(
          ({ color, label }) => html`<span><span class="swatch" style="background:${color}"></span>${label}</span>`,
        )}
      </div>
      ${!programs.length
        ? html`<div class="warning" role="status">
            <ha-svg-icon .path=${mdiAlertCircleOutline}></ha-svg-icon>${this.localize("programs.empty")}
          </div>`
        : free.length
          ? html`<div class="warning" role="status">
              <ha-svg-icon .path=${mdiAlertCircleOutline}></ha-svg-icon>${this.localize("programs.uncovered", {
                days: free.map(dayName).join(", "),
              })}
            </div>`
          : nothing}
      ${keyed(
        `${room.entity_id}|${season.id}`,
        repeat(
          programs,
          (program) => program.id,
          (program) => html`<shs-program-card
          .program=${program}
          .others=${programs.filter((p) => p.id !== program.id)}
          .days=${days}
          .unit=${unit}
          .limits=${limits}
          .canTurnOff=${canTurnOff(stateObj)}
          .language=${language}
          .h12=${uses12h(this.hass)}
          .readOnly=${this._readOnly}
          .now=${seasonIsToday && program.days.includes(WEEKDAYS[now.weekday]) ? now.minutes : null}
          .localize=${this.localize}
          @day-toggled=${(ev: CustomEvent) => this._toggleDay(season.id, programs, program.id, ev.detail.day)}
          @blocks-changed=${(ev: CustomEvent) =>
            this._updateProgram(season.id, programs, program.id, { blocks: ev.detail.blocks })}
          @rename=${() => (this._rename = { program, name: program.name })}
          @duplicate=${() => this._duplicate(season.id, programs, program)}
          @delete=${() => (this._deleteProgram = program)}
        ></shs-program-card>`,
        ),
      )}
    `;
  }

  /** Legend entries for the colour bands, e.g. "≤16°", "17–18°", "≥21°", "Off". */
  private _legend(unit: string, language: string): { color: string; label: string }[] {
    const fahrenheit = unit === FAHRENHEIT;
    const show = (celsius: number) =>
      formatTemperature(fahrenheit ? Math.round((celsius * 9) / 5 + 32) : celsius, unit, 1, true, language);
    const entries = BANDS.map((band, i) => {
      const previous = BANDS[i - 1];
      const label = !previous
        ? `≤${show(band.upTo)}`
        : band.upTo === Infinity
          ? `≥${show(previous.upTo + 1)}`
          : `${show(previous.upTo + 1).replace("°", "")}–${show(band.upTo)}`;
      return { color: `var(--shs-color-${band.name}, ${band.color})`, label };
    });
    return [...entries, { color: `var(--shs-color-off, ${OFF_COLOR})`, label: this.localize("block.off") }];
  }

  private _renderDialogs(room: Room | undefined) {
    const season = this._season;
    const programs = room && season ? this._programs(room, season.id) : [];
    const scheduled = new Set(this.state.rooms.map((r) => r.entity_id));
    const name = room ? entityName(this.hass, room.entity_id) : "";
    return html`
      <shs-entity-picker-dialog
        .hass=${this.hass}
        .open=${this._addOpen}
        .heading=${this.localize("entity.choose")}
        .emptyText=${this.localize("entity.no_thermostats")}
        .entityIds=${Object.keys(this.hass.states).filter((id) => id.startsWith("climate.") && !scheduled.has(id))}
        .localize=${this.localize}
        @closed=${() => (this._addOpen = false)}
        @picked=${(ev: CustomEvent) => this._addRoom(ev.detail.entityIds[0])}
      ></shs-entity-picker-dialog>

      <shs-season-dialog
        .open=${this._seasonDialog !== null}
        .season=${this._seasonDialog?.season ?? null}
        .seasons=${this.state.seasons}
        .localize=${this.localize}
        @closed=${() => (this._seasonDialog = null)}
        @save=${(ev: CustomEvent) => this._saveSeason(ev.detail.season)}
        @delete=${(ev: CustomEvent) => {
          this._seasonDialog = null;
          this._deleteSeason = ev.detail.season;
        }}
      ></shs-season-dialog>

      ${this._confirm(
        this._removeOpen,
        this.localize("entity.remove"),
        this.localize("entity.remove_text", { name }),
        this.localize("common.delete"),
        () => this._removeRoom(),
        () => (this._removeOpen = false),
      )}
      ${this._confirm(
        this._resetOpen,
        this.localize("seasons.reset_title"),
        this.localize("seasons.reset_text"),
        this.localize("common.replace"),
        async () => {
          this._resetOpen = false;
          await this._call(resetSeasons(this.hass));
        },
        () => (this._resetOpen = false),
      )}
      ${this._confirm(
        this._deleteSeason !== null,
        this.localize("season_dialog.delete"),
        this.localize("season_dialog.delete_text", { name: this._deleteSeason?.name ?? "" }),
        this.localize("common.delete"),
        () => this._removeSeason(this._deleteSeason!),
        () => (this._deleteSeason = null),
      )}
      ${this._confirm(
        this._deleteProgram !== null,
        this.localize("programs.delete", { name: this._deleteProgram?.name ?? "" }),
        this.localize("programs.delete_text", { name: this._deleteProgram?.name ?? "" }),
        this.localize("common.delete"),
        () => {
          const id = this._deleteProgram!.id;
          this._deleteProgram = null;
          if (season) this._setPrograms(season.id, programs.filter((p) => p.id !== id), 0);
        },
        () => (this._deleteProgram = null),
      )}

      <shs-dialog
        .open=${this._rename !== null}
        .heading=${this._rename ? this.localize("programs.rename", { name: this._rename.program.name }) : ""}
        @closed=${() => (this._rename = null)}
      >
        <label class="field">
          <span>${this.localize("programs.name")}</span>
          <input
            type="text"
            maxlength="50"
            .value=${this._rename?.name ?? ""}
            @input=${(ev: Event) =>
              this._rename && (this._rename = { ...this._rename, name: (ev.target as HTMLInputElement).value })}
          />
        </label>
        <button slot="actions" class="text-button" @click=${() => (this._rename = null)}>
          ${this.localize("common.cancel")}
        </button>
        <button
          slot="actions"
          class="filled-button"
          ?disabled=${!this._rename?.name.trim()}
          @click=${() => {
            const rename = this._rename!;
            this._rename = null;
            if (season) this._updateProgram(season.id, programs, rename.program.id, { name: rename.name.trim() }, 0);
          }}
        >
          ${this.localize("common.save")}
        </button>
      </shs-dialog>
    `;
  }

  private _confirm(
    open: boolean,
    heading: string,
    text: string,
    confirm: string,
    onConfirm: () => void,
    onClose: () => void,
  ) {
    return html`<shs-dialog .open=${open} .heading=${heading} @closed=${onClose}>
      <p>${text}</p>
      <button slot="actions" class="text-button" @click=${onClose}>${this.localize("common.cancel")}</button>
      <button slot="actions" class="filled-button danger" @click=${onConfirm}>${confirm}</button>
    </shs-dialog>`;
  }

  static styles = [
    sharedStyles,
    toolbarStyles,
    css`
      :host {
        display: block;
        font-size: 14px;
      }
      .toolbar .title {
        font-size: 18px;
      }
      .away {
        align-items: center;
        cursor: pointer;
        display: flex;
        font-size: 14px;
        gap: 8px;
        margin-inline-end: 4px;
      }
      .content {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin: 0 auto;
        max-width: 1180px;
        padding: 16px 16px 32px;
      }
      ha-card {
        padding: 14px 16px;
      }
      h2 {
        align-items: center;
        display: flex;
        font-size: 17px;
        font-weight: 600;
        gap: 8px;
        margin: 0;
      }
      .small {
        font-size: 13px;
      }
      .notice {
        margin: 0;
        text-align: center;
      }
      .section-header {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .heading {
        display: flex;
        flex: 1 1 200px;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }
      .filled-button.small,
      .outlined-button {
        align-items: center;
        display: inline-flex;
        font-size: 14px;
        gap: 6px;
        min-height: 40px;
        padding: 0 16px;
      }
      .outlined-button {
        background: none;
        border: 1px solid var(--divider-color);
        border-radius: 18px;
        color: var(--primary-text-color);
        cursor: pointer;
        font: inherit;
        font-weight: 500;
      }
      .filled-button ha-svg-icon,
      .outlined-button ha-svg-icon {
        --mdc-icon-size: 18px;
      }
      .empty {
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 28px 16px;
        text-align: center;
      }
      .empty ha-svg-icon {
        color: var(--secondary-text-color);
        --mdc-icon-size: 44px;
      }
      .empty p {
        margin: 0 0 8px;
        max-width: 480px;
      }
      .entity {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 8px 16px;
      }
      .entity-main {
        display: flex;
        flex: 1 1 260px;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
      }
      .field-label {
        color: var(--secondary-text-color);
        font-size: 13px;
        font-weight: 600;
      }
      .entity-name {
        font-size: 16px;
        font-weight: 600;
      }
      select,
      .field input {
        background: var(--ha-card-background, var(--card-background-color, #fff));
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        box-sizing: border-box;
        color: var(--primary-text-color);
        font: inherit;
        height: 40px;
        padding: 0 10px;
        width: 100%;
      }
      .entity-actions {
        align-items: center;
        display: flex;
        gap: 4px;
      }
      .switch-label {
        align-items: center;
        display: flex;
        gap: 8px;
        margin-inline-end: 4px;
      }
      ha-icon-button {
        --mdc-icon-button-size: 40px;
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color);
      }
      .seasons {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .season-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .season {
        align-items: center;
        border: 2px solid var(--divider-color);
        border-radius: 10px;
        display: flex;
        flex: 1 1 150px;
        gap: 2px;
        min-width: 0;
        padding: 2px 2px 2px 10px;
      }
      .season.selected {
        border-color: var(--season-color);
      }
      .season-select {
        align-items: center;
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        display: flex;
        flex: 1;
        font: inherit;
        gap: 8px;
        min-height: 44px;
        min-width: 0;
        padding: 0;
        text-align: start;
      }
      .season-text {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .season-name {
        align-items: center;
        display: flex;
        font-weight: 600;
        gap: 6px;
      }
      .dot {
        background: var(--season-color);
        border-radius: 50%;
        flex-shrink: 0;
        height: 10px;
        width: 10px;
      }
      .badge {
        background: color-mix(in srgb, var(--primary-color) 15%, transparent);
        border-radius: 999px;
        color: var(--primary-color);
        font-size: 10px;
        font-weight: 600;
        padding: 1px 6px;
      }
      .columns {
        align-items: flex-start;
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
      }
      .now {
        box-sizing: border-box;
        display: flex;
        flex: 1 1 260px;
        flex-direction: column;
        gap: 12px;
      }
      .big {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .big .value {
        font-size: 34px;
        font-weight: 700;
        letter-spacing: -0.02em;
      }
      .now.overridden {
        box-shadow: inset 0 0 0 2px var(--warning-color, #ff9800);
      }
      .big .value.manual {
        color: color-mix(in srgb, var(--warning-color, #ff9800) 80%, var(--primary-text-color));
      }
      dl {
        display: grid;
        gap: 10px 12px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        margin: 0;
      }
      dt {
        color: var(--secondary-text-color);
        font-size: 12px;
      }
      dd {
        font-weight: 600;
        margin: 0;
      }
      .away-banner {
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 10px 12px;
      }
      .programs {
        display: flex;
        flex: 999 1 520px;
        flex-direction: column;
        gap: 12px;
        min-width: 0;
      }
      .legend {
        color: var(--secondary-text-color);
        display: flex;
        flex-wrap: wrap;
        font-size: 12px;
        gap: 4px 14px;
      }
      .legend > span {
        align-items: center;
        display: inline-flex;
        gap: 4px;
      }
      .swatch {
        border-radius: 3px;
        display: inline-block;
        height: 10px;
        width: 10px;
      }
      .warning {
        align-items: center;
        background: color-mix(in srgb, var(--warning-color, #ff9800) 14%, transparent);
        border-radius: 10px;
        display: flex;
        font-size: 13px;
        gap: 8px;
        padding: 10px 12px;
      }
      .warning ha-svg-icon {
        color: var(--warning-color, #ff9800);
        flex-shrink: 0;
        --mdc-icon-size: 18px;
      }
      .field {
        display: flex;
        flex-direction: column;
        font-size: 13px;
        font-weight: 600;
        gap: 6px;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "shs-main-view": MainView;
  }
}
