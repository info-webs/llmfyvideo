// Flujo reutilizable de una herramienta del dashboard, tal como lo haría un usuario:
// clic en el menú → clic en el campo → teclear la URL → pulsar el botón → modal de progreso → scroll a los resultados.
import React from "react";
import type { LucideIcon } from "lucide-react";
import { AppWindow, CONTENT, formPoints, GhostPage, navPoint, OverviewPage, PageHead, ProgressModal, SampleNote, UrlCard, type GroupId, type NavKey } from "./product";
import { Camera, Cursor, EASE, focus, useProg, useT, useTypewriter, type CamKey, type CursorPoint } from "./motion";
import type { Cue } from "./audio";

export const RES_TOP = 420; // y (en el contenido) donde empiezan los resultados, bajo el formulario

export type ToolSpec = {
  nav: NavKey; open: GroupId; prev: NavKey; route: string; crumb: string;
  icon: LucideIcon; title: string; sub: string; badge?: React.ReactNode;
  form: { label?: string; placeholder: string; url: string; button: string; icon?: LucideIcon; helper?: string; credit?: string };
  modal: { title?: string; steps: string[]; eta?: string };
  times: { nav: number; field: number; type: number; cps?: number; button: number; modal: number; modalDur: number; results: number };
  plan?: string;
};

export const bump = (t: number, at: number, width = 0.14) => 1 - Math.min(1, Math.abs(t - (at + 0.06)) / width);

/** Efectos de sonido del flujo (tiempos en segundos de diseño). */
export function toolCues(spec: ToolSpec): Cue[] {
  const T = spec.times, cps = T.cps ?? 26;
  const keys: Cue[] = [];
  const n = Math.min(14, Math.floor((spec.form.url.length / cps) / 0.16));
  for (let i = 0; i < n; i++) keys.push({ at: T.type + 0.1 + i * 0.16, sfx: (["key1", "key2", "key3"] as const)[i % 3], vol: 0.2 });
  return [
    { at: T.nav, sfx: "click", vol: 0.45 },
    { at: T.field, sfx: "click", vol: 0.4 },
    ...keys,
    { at: T.button, sfx: "click", vol: 0.5 },
    { at: T.results - 0.1, sfx: "whooshSoft", vol: 0.4 },
  ];
}

/** Recorrido estándar del cursor: menú → campo → botón → reposo sobre los resultados. */
export function defaultToolPath(spec: ToolSpec, startAt = { x: 1420, y: 560 }): CursorPoint[] {
  const T = spec.times, nav = navPoint(spec.open, spec.nav), fp = formPoints();
  return [
    { t: T.nav - 1.1, x: startAt.x, y: startAt.y },
    { t: T.nav, x: nav.x, y: nav.y, click: true },
    { t: T.field, x: fp.input.x, y: fp.input.y, click: true },
    { t: T.type + 0.9, x: fp.input.x + 120, y: fp.input.y + 60 },
    { t: T.button, x: fp.button.x, y: fp.button.y, click: true },
    { t: T.results + 0.5, x: 1340, y: 640 },
  ];
}

export const ToolFlow: React.FC<{
  spec: ToolSpec; scroll?: number; cam?: CamKey[]; extra?: React.ReactNode; startAt?: { x: number; y: number }; children?: React.ReactNode;
  /** Sustituye la tarjeta de URL (formularios con varios campos). El que lo use debe animarse con useT. */
  formNode?: React.ReactNode; resTop?: number; path?: CursorPoint[];
}> = ({ spec, scroll = 330, cam, extra, startAt = { x: 1420, y: 560 }, children, formNode, resTop = RES_TOP, path: pathOverride }) => {
  const { t } = useT();
  const T = spec.times;
  const { shown, caret } = useTypewriter(spec.form.url, T.type, T.cps ?? 26);
  const pageIn = useProg(T.nav + 0.15, 0.6), formIn = useProg(T.nav + 0.3, 0.7);
  const prevOpacity = 1 - useProg(T.nav + 0.05, 0.3);
  const sc = useProg(T.results - 0.15, 1.0, EASE.inOut) * scroll;
  const pressed = Math.max(0, bump(t, T.button));
  const modalP = (t - T.modal) / T.modalDur;
  const credits = t < T.button + 0.05 ? "150 créditos" : "149 créditos";
  const creditPulse = Math.max(0, 1 - Math.abs(t - (T.button + 0.1)) / 0.35);

  const path: CursorPoint[] = pathOverride ?? defaultToolPath(spec, startAt);
  const defaultCam: CamKey[] = [
    { t: 0, s: 1, x: 0, y: 0 },
    focus(T.field - 0.5, CONTENT.x + 520, CONTENT.y + 290, 1.06),
    focus(T.button + 0.5, CONTENT.x + 520, CONTENT.y + 290, 1.06),
    { t: T.results, s: 1.0, x: 0, y: 0 },
  ];

  return (
    <Camera keys={cam ?? defaultCam} drift={5}>
      <AppWindow route={spec.route} open={spec.open} active={spec.nav} prev={spec.prev} switchAt={T.nav + 0.05} credits={credits} creditPulse={creditPulse} plan={spec.plan}>
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${-sc}px)` }}>
          {prevOpacity > 0.01 && (spec.prev === "overview" ? <OverviewPage opacity={prevOpacity} /> : <GhostPage opacity={prevOpacity} />)}
          <PageHead icon={spec.icon} title={spec.title} sub={spec.sub} crumb={spec.crumb} badge={spec.badge} opacity={pageIn} />
          {formNode ?? (
            <UrlCard
              label={spec.form.label} placeholder={spec.form.placeholder} value={shown} caret={caret && t < T.button} focus={t > T.field && t < T.button + 0.1}
              button={spec.form.button} icon={spec.form.icon} pressed={pressed} ready={shown.length > 8} helper={spec.form.helper} credit={spec.form.credit} opacity={formIn}
            />
          )}
          <div style={{ position: "absolute", left: 0, top: resTop, width: CONTENT.w }}>{t >= T.results - 0.3 && children}</div>
        </div>
        <ProgressModal progress={modalP} steps={spec.modal.steps} title={spec.modal.title} eta={spec.modal.eta} />
      </AppWindow>
      <SampleNote />
      {extra}
      <Cursor path={path} />
    </Camera>
  );
};

/** Coordenadas del escenario de un punto de los resultados (tras el scroll). */
export const resPt = (x: number, y: number, scroll = 330) => ({ x: CONTENT.x + x, y: CONTENT.y + RES_TOP + y - scroll });

/** Ventana del dashboard sin formulario: para escenas con varias páginas seguidas (la barra lateral se desliza de una a otra). */
export const AppFlow: React.FC<{
  active: NavKey; prev?: NavKey; open: GroupId | null; switchAt: number; route: string; path?: CursorPoint[]; cam?: CamKey[]; extra?: React.ReactNode;
  plan?: string; credits?: string; creditPulse?: number; children?: React.ReactNode;
}> = ({ active, prev, open, switchAt, route, path, cam, extra, plan, credits, creditPulse, children }) => (
  <Camera keys={cam ?? [{ t: 0, s: 1, x: 0, y: 0 }]} drift={5}>
    <AppWindow route={route} open={open} active={active} prev={prev} switchAt={switchAt} plan={plan} credits={credits} creditPulse={creditPulse}>
      {children}
    </AppWindow>
    <SampleNote />
    {extra}
    {path && <Cursor path={path} />}
  </Camera>
);
