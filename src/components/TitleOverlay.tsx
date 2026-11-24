import { useState } from 'react';
import { BookOpen, CheckCircle2, Clock, Lock, RotateCcw, Sliders, Swords, Volume2, VolumeX, Wrench } from 'lucide-react';
import desertImg from '../assets/images/map_desert_alamein_1795126496434.jpg';
import forestImg from '../assets/images/map_forest_ardennes_1795126493538.jpg';
import normandyImg from '../assets/images/map_normandy_valley_1795126495807.jpg';
import stalingradImg from '../assets/images/map_stalingrad_ruins_1795126496029.jpg';
import { CAMPAIGN_MISSIONS } from '../game/campaignData';
import type { CampaignSaveProgress } from '../game/campaignSave';
import { STRINGS } from '../game/i18n';
import { PRIMARY_WEAPON_IDS, SLOT2_WEAPON_IDS, WEAPONS } from '../game/rules';
import type { GameMode, Lang, MapId, WeaponId } from '../game/types';
import { WeaponIllustration } from './WeaponIllustration';

const MAP_ARTWORK: Record<MapId, { img: string; fallbackBg: string }> = {
  forest: { img: forestImg, fallbackBg: 'linear-gradient(135deg, #1f3322 0%, #3d4f38 100%)' },
  desert: { img: desertImg, fallbackBg: 'linear-gradient(135deg, #7c562c 0%, #c69a58 100%)' },
  normandy: { img: normandyImg, fallbackBg: 'linear-gradient(135deg, #2d3e34 0%, #64705e 100%)' },
  stalingrad: { img: stalingradImg, fallbackBg: 'linear-gradient(135deg, #2b2d31 0%, #5e6268 100%)' },
};

const MATCH_DURATIONS_SEC = [120, 300, 600, 900, 1200] as const;

interface TitleOverlayProps {
  lang: Lang;
  mapId: MapId;
  gameMode: GameMode;
  slot1Id: WeaponId;
  slot2Id: WeaponId;
  muted: boolean;
  matchDurationSeconds: number;
  campaignProgress: CampaignSaveProgress;
  onToggleLang: () => void;
  onToggleMute: () => void;
  onOpenSettings: () => void;
  onOpenGunsmith: () => void;
  onSelectMap: (map: MapId) => void;
  onSelectGameMode: (mode: GameMode) => void;
  onSelectSlot1: (weaponId: WeaponId) => void;
  onSelectSlot2: (weaponId: WeaponId) => void;
  onSelectMatchDuration: (seconds: number) => void;
  onStart: () => void;
  onStartCampaignMission: (missionId: number) => void;
  onResetCampaign: () => void;
}

export function TitleOverlay({
  lang,
  mapId,
  gameMode,
  slot1Id,
  slot2Id,
  muted,
  matchDurationSeconds,
  campaignProgress,
  onToggleLang,
  onToggleMute,
  onOpenSettings,
  onOpenGunsmith,
  onSelectMap,
  onSelectGameMode,
  onSelectSlot1,
  onSelectSlot2,
  onSelectMatchDuration,
  onStart,
  onStartCampaignMission,
  onResetCampaign,
}: TitleOverlayProps) {
  const t = STRINGS[lang];
  const isRtl = lang === 'ar';
  const [lobbyTab, setLobbyTab] = useState<'skirmish' | 'campaign'>('skirmish');

  const continueMissionId = Math.max(
    1,
    Math.min(campaignProgress.highestUnlockedMission, campaignProgress.lastPlayedMission || 1),
  );

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-20 flex flex-col justify-between p-2.5 sm:p-4 md:p-5 pointer-events-none"
      style={{
        background: isRtl
          ? 'linear-gradient(255deg, rgba(13,15,14,0.94) 0%, rgba(13,15,14,0.78) 58%, rgba(13,15,14,0.18) 100%)'
          : 'linear-gradient(105deg, rgba(13,15,14,0.94) 0%, rgba(13,15,14,0.78) 58%, rgba(13,15,14,0.18) 100%)',
      }}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 pointer-events-auto min-w-0">
          <div dir="ltr" className="flex items-center gap-1.5 shrink-0">
            <svg viewBox="0 0 36 36" className="w-7 h-7" aria-hidden="true">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#eab308" strokeWidth="1.8" strokeDasharray="5 3" />
              <polygon
                points="18,6 21,14 29,14 23,19 25,27 18,22 11,27 13,19 7,14 15,14"
                fill="#eab308"
              />
            </svg>
            <span className="font-display font-extrabold text-lg sm:text-xl tracking-wider text-stone-100">
              POLYFIELD
            </span>
          </div>
          <span className="hidden sm:inline text-[11px] text-stone-400 truncate">· {t.subtitle}</span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto shrink-0">
          <button
            type="button"
            data-testid="btn-open-gunsmith"
            onClick={(e) => {
              e.currentTarget.blur();
              onOpenGunsmith();
            }}
            className="h-8 px-2.5 bg-amber-500/20 border border-amber-400/80 text-amber-200 text-xs font-bold hover:bg-amber-500/35 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate max-w-[155px] sm:max-w-none">{t.gunsmithBtn}</span>
          </button>
          <button
            type="button"
            data-testid="btn-open-settings"
            onClick={(e) => {
              e.currentTarget.blur();
              onOpenSettings();
            }}
            className="h-8 px-2.5 bg-stone-900/95 border border-stone-600/70 text-stone-100 text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.settings}</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              onToggleLang();
            }}
            aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            className="h-8 px-2.5 bg-stone-900/95 border border-stone-600/70 text-stone-100 text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              onToggleMute();
            }}
            aria-label={t.mute}
            className="h-8 w-8 flex items-center justify-center bg-stone-900/95 border border-stone-600/70 text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Visual Lobby Panel */}
      <div className="w-full max-w-4xl my-auto pointer-events-auto overflow-y-auto max-h-[calc(100vh-76px)] pr-1 space-y-2.5">
        {/* Primary Experience Selector: Skirmish vs Story Campaign */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            data-testid="tab-skirmish"
            onClick={(e) => {
              e.currentTarget.blur();
              setLobbyTab('skirmish');
            }}
            className={`h-10 px-3 border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              lobbyTab === 'skirmish'
                ? 'bg-amber-500 text-stone-950 border-amber-300 shadow'
                : 'bg-stone-900/92 text-stone-200 border-stone-700 hover:bg-stone-800'
            }`}
          >
            <Swords className="w-4 h-4 shrink-0" />
            <span className="truncate">{t.skirmishModeBtn}</span>
          </button>
          <button
            type="button"
            data-testid="tab-campaign"
            onClick={(e) => {
              e.currentTarget.blur();
              setLobbyTab('campaign');
            }}
            className={`h-10 px-3 border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              lobbyTab === 'campaign'
                ? 'bg-emerald-500 text-stone-950 border-emerald-300 shadow'
                : 'bg-stone-900/92 text-stone-200 border-stone-700 hover:bg-stone-800'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span className="truncate">{t.storyCampaignBtn}</span>
          </button>
        </div>

        {lobbyTab === 'skirmish' ? (
          <>
            {/* Row 1: Game Mode & Match Duration */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <div className="md:col-span-6 grid grid-cols-3 gap-1">
                {(['conquest', 'tdm', 'hardcore'] as GameMode[]).map((gm) => (
                  <button
                    key={gm}
                    type="button"
                    data-testid={`mode-${gm}`}
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onSelectGameMode(gm);
                    }}
                    className={`h-9 px-1.5 text-[11px] font-semibold border transition-colors cursor-pointer truncate ${
                      gameMode === gm
                        ? 'bg-stone-100 text-stone-950 border-white'
                        : 'bg-stone-900/90 text-stone-200 border-stone-700 hover:bg-stone-800'
                    }`}
                  >
                    {t[gm]}
                  </button>
                ))}
              </div>

              <div className="md:col-span-6 flex items-center gap-1.5 bg-stone-950/80 border border-stone-700/80 px-2 py-1">
                <span className="flex items-center gap-1 text-[11px] font-semibold text-stone-300 shrink-0">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.matchDurationLabel}</span>
                </span>
                <div dir="ltr" className="grid grid-cols-5 gap-1 flex-1">
                  {MATCH_DURATIONS_SEC.map((sec) => {
                    const mins = Math.round(sec / 60);
                    const active = Math.abs(matchDurationSeconds - sec) < 30;
                    return (
                      <button
                        key={sec}
                        type="button"
                        data-testid={`duration-${sec}`}
                        onClick={(e) => {
                          e.currentTarget.blur();
                          onSelectMatchDuration(sec);
                        }}
                        className={`h-7 text-[11px] font-mono-nums font-bold border transition-colors cursor-pointer ${
                          active
                            ? 'bg-amber-500 text-stone-950 border-amber-300'
                            : 'bg-stone-900 text-stone-200 border-stone-700 hover:bg-stone-800'
                        }`}
                      >
                        {mins}m
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Row 2: Visual Battlefield Theater Image Cards */}
            <div>
              <div className="text-[11px] font-semibold text-stone-300 mb-1">{t.mapLabel}</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['forest', 'desert', 'normandy', 'stalingrad'] as MapId[]).map((m) => {
                  const art = MAP_ARTWORK[m];
                  const active = mapId === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      data-testid={`map-${m}`}
                      onClick={(e) => {
                        e.currentTarget.blur();
                        onSelectMap(m);
                      }}
                      style={{ background: art.fallbackBg }}
                      className={`relative h-16 sm:h-20 overflow-hidden border transition-colors cursor-pointer group text-start ${
                        active
                          ? 'border-amber-400 ring-1 ring-amber-400/60'
                          : 'border-stone-700/90 opacity-85 hover:opacity-100 hover:border-stone-500'
                      }`}
                    >
                      <img
                        src={art.img}
                        alt={t[m]}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            'linear-gradient(to top, rgba(10,12,11,0.92) 0%, rgba(10,12,11,0.28) 58%, rgba(10,12,11,0.08) 100%)',
                        }}
                      />
                      <div className="relative h-full flex items-end justify-between px-2 py-1.5">
                        <span
                          className={`text-xs font-bold leading-tight truncate ${
                            active ? 'text-amber-300' : 'text-stone-100'
                          }`}
                        >
                          {t[m]}
                        </span>
                        {active && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 3: Visual Weapon Cards (Slot 1 + Slot 2) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <div className="text-[11px] font-semibold text-stone-300 mb-1">{t.slot1Label}</div>
                <div className="grid grid-cols-1 gap-1 max-h-[168px] overflow-y-auto pr-0.5">
                  {PRIMARY_WEAPON_IDS.map((wId) => {
                    const spec = WEAPONS[wId];
                    const active = slot1Id === wId;
                    return (
                      <button
                        key={wId}
                        type="button"
                        data-testid={`weapon-s1-${wId}`}
                        onClick={(e) => {
                          e.currentTarget.blur();
                          onSelectSlot1(wId);
                        }}
                        className={`px-2 py-1 text-start border flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                          active
                            ? 'bg-stone-100 text-stone-950 border-white'
                            : 'bg-stone-900/92 text-stone-200 border-stone-700 hover:bg-stone-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className={`shrink-0 overflow-hidden border ${
                              active ? 'bg-stone-200 border-stone-400' : 'bg-stone-950/75 border-stone-800'
                            }`}
                          >
                            <WeaponIllustration weaponId={wId} className="w-20 h-7" />
                          </div>
                          <span className="text-[11px] font-bold truncate">
                            {lang === 'ar' ? spec.nameAr : spec.nameEn}
                          </span>
                        </div>
                        <span dir="ltr" className="text-[10px] font-mono-nums opacity-75 shrink-0">
                          {spec.magSize}/{spec.reserveMax}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col justify-between gap-1.5">
                <div>
                  <div className="text-[11px] font-semibold text-amber-300 mb-1">{t.slot2Label}</div>
                  <div className="grid grid-cols-1 gap-1 max-h-[124px] overflow-y-auto pr-0.5">
                    {SLOT2_WEAPON_IDS.map((wId) => {
                      const spec = WEAPONS[wId];
                      const active = slot2Id === wId;
                      return (
                        <button
                          key={wId}
                          type="button"
                          data-testid={`weapon-s2-${wId}`}
                          onClick={(e) => {
                            e.currentTarget.blur();
                            onSelectSlot2(wId);
                          }}
                          className={`px-2 py-1 text-start border flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                            active
                              ? 'bg-amber-400 text-stone-950 border-amber-200'
                              : 'bg-stone-900/92 text-stone-200 border-stone-700 hover:bg-stone-800'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className={`shrink-0 overflow-hidden border ${
                                active ? 'bg-amber-300 border-amber-600' : 'bg-stone-950/75 border-stone-800'
                              }`}
                            >
                              <WeaponIllustration weaponId={wId} className="w-20 h-7" />
                            </div>
                            <span className="text-[11px] font-bold truncate">
                              {lang === 'ar' ? spec.nameAr : spec.nameEn}
                            </span>
                          </div>
                          <span dir="ltr" className="text-[10px] font-mono-nums opacity-75 shrink-0">
                            {spec.magSize}/{spec.reserveMax}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="px-2 py-1 bg-stone-950/85 border border-stone-700/80 text-[10px] text-stone-300 flex items-center justify-between gap-2">
                  <span className="truncate">{t.slot3Label} · {t.gadgetsBadge}</span>
                  <span dir="ltr" className="font-mono-nums text-amber-300 shrink-0">7/56</span>
                </div>
              </div>
            </div>

            {/* Deploy Button */}
            <button
              type="button"
              data-start="true"
              onClick={(e) => {
                e.currentTarget.blur();
                onStart();
              }}
              className="w-full h-10 bg-amber-500 hover:bg-amber-400 text-stone-950 font-display text-lg font-bold tracking-wider uppercase border border-amber-300 transition-colors cursor-pointer shadow-lg"
            >
              {t.deploy}
            </button>
          </>
        ) : (
          /* STORY CAMPAIGN VIEW ("ON THE FRONTLINE — JORDAN") */
          <div
            data-testid="campaign-lobby-panel"
            className="bg-stone-950/88 border border-emerald-500/40 p-3 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-2.5">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold tracking-wide text-emerald-400">
                  {t.campaignTitle}
                </h2>
                <p className="text-[11px] text-stone-300">{t.campaignSubtitle}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  data-testid="btn-campaign-continue"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    onStartCampaignMission(continueMissionId);
                  }}
                  className="h-9 px-3.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs border border-emerald-300 cursor-pointer"
                >
                  {t.campaignContinueBtn} #{continueMissionId}
                </button>
                <button
                  type="button"
                  data-testid="btn-campaign-reset"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    onResetCampaign();
                  }}
                  title={t.campaignResetBtn}
                  className="h-9 px-2.5 bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs border border-stone-700 cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.campaignResetBtn}</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {([1, 2, 3, 4] as const).map((actNum) => {
                const missions = CAMPAIGN_MISSIONS.filter((m) => m.act === actNum);
                const actHeading =
                  lang === 'ar' ? missions[0]?.actTitleAr : missions[0]?.actTitleEn;
                return (
                  <div key={actNum} className="space-y-1.5">
                    <div className="text-[11px] font-bold tracking-wider text-amber-400 uppercase border-b border-stone-800 pb-0.5">
                      {actHeading}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
                      {missions.map((m) => {
                        const unlocked = m.id <= campaignProgress.highestUnlockedMission;
                        const completed = campaignProgress.completedMissions.includes(m.id);
                        return (
                          <button
                            key={m.id}
                            type="button"
                            disabled={!unlocked}
                            data-testid={`campaign-mission-${m.id}`}
                            onClick={(e) => {
                              e.currentTarget.blur();
                              if (unlocked) onStartCampaignMission(m.id);
                            }}
                            className={`p-2 border text-start flex flex-col justify-between gap-1.5 transition-colors ${
                              unlocked
                                ? 'bg-stone-900/95 border-stone-700 hover:border-emerald-400 hover:bg-stone-800/90 cursor-pointer'
                                : 'bg-stone-950/70 border-stone-800/80 opacity-55 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1.5">
                              <div className="min-w-0">
                                <div className="text-[10px] font-mono-nums font-bold text-stone-400">
                                  M{m.id} · {lang === 'ar' ? m.locationAr : m.locationEn}
                                </div>
                                <div className="text-xs font-bold text-stone-100 truncate">
                                  {lang === 'ar' ? m.titleAr : m.titleEn}
                                </div>
                              </div>
                              {completed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : !unlocked ? (
                                <Lock className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                              ) : null}
                            </div>
                            <div className="text-[10px] text-stone-400 line-clamp-1">
                              {unlocked
                                ? lang === 'ar'
                                  ? m.subtitleAr
                                  : m.subtitleEn
                                : t.campaignLockedMsg}
                            </div>
                            {unlocked && (
                              <div className="flex items-center justify-between pt-0.5 text-[10px] font-bold">
                                <span className={completed ? 'text-emerald-400' : 'text-amber-400'}>
                                  {completed ? t.campaignReplayBtn : t.campaignPlayBtn}
                                </span>
                                {completed && (
                                  <span className="px-1 bg-emerald-950 text-emerald-300 border border-emerald-600/50 text-[9px]">
                                    {t.campaignCompletedBadge}
                                  </span>
                                )}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Hint */}
      <div className="text-[11px] text-stone-300 tracking-wide truncate">
        {t.controlsHint}
      </div>
    </div>
  );
}
