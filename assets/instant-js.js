window.Instant = window.Instant || {};
window.Instant.initializedVersion = window.Instant?.initializedVersion || null;
window.Instant.initializedListeners = !!window.Instant?.initializedListeners;
window.Instant.initializedSwiper = !!window.Instant?.initializedSwiper;
window.Instant.initSwiper =
  window.Instant?.initSwiper ||
  (() => {
    window.Instant.initializedSwiper ||
      ((window.Instant.initializedSwiper = !0),
      window.Instant.initializedListeners && window.__instantInitSliders?.());
  });
(() => {
  var hn = new RegExp("^i[a-zA-Z0-9]{16}(-[a-zA-Z0-9]{16})*$"),
    oe = (t) => hn.test(t),
    wt = (t) => (oe(t) ? t.substring(1, 16 + 1) : t),
    q = (t) => {
      let e = Array.from(t.classList);
      return e.find((n) => oe(n)) ?? e[0];
    },
    rt = (t) => {
      let e = t.getAttribute("data-instant-repeater-index");
      return `${wt(q(t))}${e != null ? `_${e}` : ""}`;
    },
    pt = (t) => {
      let e = t.parentElement;
      return e instanceof HTMLSpanElement ? pt(e) : e;
    },
    Ot = (t, e) => {
      let n = t.querySelectorAll('[type="application/json"]'),
        o,
        i,
        r;
      return (
        Array.from(n).forEach((s) => {
          s.id.startsWith(`variants__${e}--`) && (o = JSON.parse(s.innerHTML)),
            s.id.startsWith(`options__${e}--`) && (i = JSON.parse(s.innerHTML)),
            s.id.startsWith(`selling_plans__${e}--`) &&
              (r = JSON.parse(s.innerHTML));
        }),
        { variants: o, options: i, sellingPlans: r }
      );
    };
  var Ft = (t, e) => {
      t.forEach((n) => {
        let o = n.closest(".__instant")?.getAttribute("data-section-id");
        if (o && e[o]) {
          let i = q(n),
            s = new DOMParser()
              .parseFromString(e[o], "text/html")
              .querySelector(`.${i}`);
          if (s) {
            n.innerHTML = s.innerHTML;
            let a = s.getAttribute("style");
            a ? n.setAttribute("style", a) : n.removeAttribute("style");
          }
        }
      });
    },
    ie = async () => {
      let t = [],
        e = Array.from(
          document.querySelectorAll(
            '[data-instant-dynamic-content-source="CART_COUNT"]'
          )
        );
      e.forEach((i) => {
        if (t.length >= 5) return;
        let r = i.closest(".__instant")?.getAttribute("data-section-id");
        r && !t.includes(r) && t.push(r);
      });
      let n = new URLSearchParams();
      t.forEach((i) => n.append("sections[]", i));
      let o = await fetch(`cart?${n.toString()}`).then((i) => {
        if (!i.ok) throw new Error();
        return i.json();
      });
      Ft(e, o);
    };
  var re = () => {
    window.Instant.api = { updateCart: ie };
  };
  var se = () => {
    window.Shopify?.shop &&
      document.querySelector(".__instant") &&
      fetch(`https://static-api.instant.so/public/site/${window.Shopify.shop}`)
        .then((t) => t.json())
        .then((t) => {
          if (t?.shoccwBadge) {
            let e = () =>
                new DOMParser().parseFromString(t.showccBadge, "text/html").body
                  .firstChild,
              n = document.body.appendChild(e()),
              o = new MutationObserver((i) => {
                i.forEach((r) => {
                  if (
                    (r.type === "childList" &&
                      [...r.removedNodes].includes(n)) ||
                    r.type === "attributes"
                  ) {
                    o.disconnect(), n && n.parentNode && n.remove();
                    let s = e();
                    (n = document.body.appendChild(s)),
                      o.observe(n, { attributes: !0 }),
                      o.observe(document.body, { childList: !0 });
                  }
                });
              });
            o.observe(n, { attributes: !0 }),
              o.observe(document.body, { childList: !0 });
          }
        });
  };
  var ae = (t, e = !1) => {
      t.forEach((n) => {
        let o = n.querySelector(
          ':scope > [data-instant-type="accordion-content"]'
        );
        if (o) {
          let i = o.style.transitionDuration;
          (o.style.transitionDuration = "0s"),
            o.style.setProperty(
              "--instant-accordion-content-height",
              "initial"
            ),
            o.style.setProperty("--instant-accordion-content-width", "initial");
          let { height: r, width: s } = o.getBoundingClientRect();
          (o.style.transitionDuration = i),
            o.style.setProperty("--instant-accordion-content-height", "0"),
            o.style.setProperty("--instant-accordion-content-width", "0");
          let a = () => {
            r &&
              o.style.setProperty(
                "--instant-accordion-content-height",
                `${r}px`
              ),
              s &&
                o.style.setProperty(
                  "--instant-accordion-content-width",
                  `${s}px`
                );
          };
          e
            ? a()
            : "requestAnimationFrame" in window
            ? window.requestAnimationFrame(a)
            : setTimeout(a, 16);
        }
      });
    },
    ce = (t) => {
      let e = t.querySelectorAll('[data-instant-type="accordion-container"]');
      Array.from(e)
        .reverse()
        .forEach((n) => {
          let o = n.getAttribute("data-is-multi-open-enabled") === "true",
            i = n.querySelectorAll(
              ':scope > [data-instant-type="accordion-item"]'
            );
          ae(Array.from(i), !0),
            Array.from(i).forEach((r) => {
              let s = r.querySelector(
                ':scope > [data-instant-type="accordion-header"]'
              );
              s &&
                s.addEventListener("click", () => {
                  let a = r.getAttribute("data-state") === "open";
                  r.setAttribute("data-state", a ? "closed" : "open"),
                    a || ae([r]),
                    o ||
                      Array.from(i).forEach((c) => {
                        c !== r &&
                          c.getAttribute("data-state") === "open" &&
                          c.setAttribute("data-state", "closed");
                      });
                });
            });
        });
    };
  var le = (t) => {
    let e = t.querySelectorAll('[data-instant-type="countdown"]');
    Array.from(e).forEach((n) => {
      let o = n.getAttribute("data-instant-countdown-date"),
        i = n.getAttribute("data-instant-countdown-time-zone"),
        r = n.getAttribute("data-instant-countdown-minutes"),
        s = n.getAttribute("data-instant-countdown-is-persistent") === "true",
        a = n.getAttribute("data-instant-countdown-leading-zeros") === "true",
        c = !!o,
        l = ["DAYS", "HOURS", "MINUTES", "SECONDS"],
        [d, u, f, g] = l.map((p) =>
          n.querySelectorAll(
            `[data-instant-dynamic-content-source="COUNTDOWN_${p}"] span`
          )
        ),
        E = (p) => {
          let _ = new Date(),
            T = _.getTime(),
            O = (c ? -_.getTimezoneOffset() : 0) * 60 * 1e3;
          return p - T + O;
        },
        y = (p) => {
          let _ = p.toString();
          return a ? _.padStart(2, "0") : _;
        },
        v,
        b = `instant-countdown-end-${n.id}`,
        S = sessionStorage.getItem(b);
      if (c) v = o ? new Date(o).getTime() : new Date().getTime();
      else if (S && s) v = Number(S);
      else {
        let p = new Date().getTime() + (r ? Number(r) : 0) * 60 * 1e3;
        s && !window?.Shopify?.designMode && sessionStorage.setItem(b, `${p}`),
          (v = p);
      }
      let A = (() => {
          let p = new Date();
          p.setSeconds(0, 0);
          let _ = p.toLocaleString("en-US", {
              timeZone: i ?? "Etc/UTC",
              hourCycle: "h23",
            }),
            T = /(\d+)\/(\d+)\/(\d+), (\d+):(\d+)/.exec(_);
          if (T) {
            let [O, L, H, N, V, B] = T.map(Number),
              x = Date.UTC(N, L - 1, H, V, B);
            return Math.floor((x - p.getTime()) / (1e3 * 60));
          }
          return 0;
        })(),
        w = (c ? A : 0) * 60 * 1e3,
        M = v - w,
        k = 0,
        R = (p) => {
          let _ = Math.ceil(E(M) / 1e3),
            T = 0,
            O = 0,
            L = 0,
            H = 0;
          p - k >= 1e3 &&
            (_ > 0 &&
              ((H = Math.floor(_ / (24 * 60 * 60))),
              (L = Math.floor((_ / (60 * 60)) % 24)),
              (O = Math.floor((_ / 60) % 60)),
              (T = Math.floor(_ % 60))),
            d.length === 0 && H > 0 && (L = L + H * 24),
            u.length === 0 && L > 0 && (O = O + L * 60),
            f.length === 0 && O > 0 && (T = T + O * 60),
            Array.from(d).forEach((N) => {
              N.innerHTML = `${y(H)}`;
            }),
            Array.from(u).forEach((N) => {
              N.innerHTML = `${y(L)}`;
            }),
            Array.from(f).forEach((N) => {
              N.innerHTML = `${y(O)}`;
            }),
            Array.from(g).forEach((N) => {
              N.innerHTML = `${y(T)}`;
            }),
            (k = p)),
            _ >= 0 && requestAnimationFrame(R);
        };
      requestAnimationFrame(R);
    });
  };
  var Q = Math.min,
    F = Math.max,
    St = Math.round,
    Lt = Math.floor,
    et = (t) => ({ x: t, y: t }),
    yn = { left: "right", right: "left", bottom: "top", top: "bottom" },
    bn = { start: "end", end: "start" };
  function Ut(t, e, n) {
    return F(t, Q(e, n));
  }
  function st(t, e) {
    return typeof t == "function" ? t(e) : t;
  }
  function X(t) {
    return t.split("-")[0];
  }
  function gt(t) {
    return t.split("-")[1];
  }
  function Ht(t) {
    return t === "x" ? "y" : "x";
  }
  function zt(t) {
    return t === "y" ? "height" : "width";
  }
  function nt(t) {
    return ["top", "bottom"].includes(X(t)) ? "y" : "x";
  }
  function Wt(t) {
    return Ht(nt(t));
  }
  function de(t, e, n) {
    n === void 0 && (n = !1);
    let o = gt(t),
      i = Wt(t),
      r = zt(i),
      s =
        i === "x"
          ? o === (n ? "end" : "start")
            ? "right"
            : "left"
          : o === "start"
          ? "bottom"
          : "top";
    return e.reference[r] > e.floating[r] && (s = Tt(s)), [s, Tt(s)];
  }
  function ue(t) {
    let e = Tt(t);
    return [Ct(t), e, Ct(e)];
  }
  function Ct(t) {
    return t.replace(/start|end/g, (e) => bn[e]);
  }
  function An(t, e, n) {
    let o = ["left", "right"],
      i = ["right", "left"],
      r = ["top", "bottom"],
      s = ["bottom", "top"];
    switch (t) {
      case "top":
      case "bottom":
        return n ? (e ? i : o) : e ? o : i;
      case "left":
      case "right":
        return e ? r : s;
      default:
        return [];
    }
  }
  function fe(t, e, n, o) {
    let i = gt(t),
      r = An(X(t), n === "start", o);
    return (
      i && ((r = r.map((s) => s + "-" + i)), e && (r = r.concat(r.map(Ct)))), r
    );
  }
  function Tt(t) {
    return t.replace(/left|right|bottom|top/g, (e) => yn[e]);
  }
  function En(t) {
    return { top: 0, right: 0, bottom: 0, left: 0, ...t };
  }
  function me(t) {
    return typeof t != "number"
      ? En(t)
      : { top: t, right: t, bottom: t, left: t };
  }
  function lt(t) {
    let { x: e, y: n, width: o, height: i } = t;
    return {
      width: o,
      height: i,
      top: n,
      left: e,
      right: e + o,
      bottom: n + i,
      x: e,
      y: n,
    };
  }
  function pe(t, e, n) {
    let { reference: o, floating: i } = t,
      r = nt(e),
      s = Wt(e),
      a = zt(s),
      c = X(e),
      l = r === "y",
      d = o.x + o.width / 2 - i.width / 2,
      u = o.y + o.height / 2 - i.height / 2,
      f = o[a] / 2 - i[a] / 2,
      g;
    switch (c) {
      case "top":
        g = { x: d, y: o.y - i.height };
        break;
      case "bottom":
        g = { x: d, y: o.y + o.height };
        break;
      case "right":
        g = { x: o.x + o.width, y: u };
        break;
      case "left":
        g = { x: o.x - i.width, y: u };
        break;
      default:
        g = { x: o.x, y: o.y };
    }
    switch (gt(e)) {
      case "start":
        g[s] -= f * (n && l ? -1 : 1);
        break;
      case "end":
        g[s] += f * (n && l ? -1 : 1);
        break;
    }
    return g;
  }
  var ge = async (t, e, n) => {
    let {
        placement: o = "bottom",
        strategy: i = "absolute",
        middleware: r = [],
        platform: s,
      } = n,
      a = r.filter(Boolean),
      c = await (s.isRTL == null ? void 0 : s.isRTL(e)),
      l = await s.getElementRects({ reference: t, floating: e, strategy: i }),
      { x: d, y: u } = pe(l, o, c),
      f = o,
      g = {},
      E = 0;
    for (let y = 0; y < a.length; y++) {
      let { name: v, fn: b } = a[y],
        {
          x: S,
          y: I,
          data: A,
          reset: w,
        } = await b({
          x: d,
          y: u,
          initialPlacement: o,
          placement: f,
          strategy: i,
          middlewareData: g,
          rects: l,
          platform: s,
          elements: { reference: t, floating: e },
        });
      (d = S ?? d),
        (u = I ?? u),
        (g = { ...g, [v]: { ...g[v], ...A } }),
        w &&
          E <= 50 &&
          (E++,
          typeof w == "object" &&
            (w.placement && (f = w.placement),
            w.rects &&
              (l =
                w.rects === !0
                  ? await s.getElementRects({
                      reference: t,
                      floating: e,
                      strategy: i,
                    })
                  : w.rects),
            ({ x: d, y: u } = pe(l, f, c))),
          (y = -1));
    }
    return { x: d, y: u, placement: f, strategy: i, middlewareData: g };
  };
  async function _t(t, e) {
    var n;
    e === void 0 && (e = {});
    let { x: o, y: i, platform: r, rects: s, elements: a, strategy: c } = t,
      {
        boundary: l = "clippingAncestors",
        rootBoundary: d = "viewport",
        elementContext: u = "floating",
        altBoundary: f = !1,
        padding: g = 0,
      } = st(e, t),
      E = me(g),
      v = a[f ? (u === "floating" ? "reference" : "floating") : u],
      b = lt(
        await r.getClippingRect({
          element:
            (n = await (r.isElement == null ? void 0 : r.isElement(v))) ==
              null || n
              ? v
              : v.contextElement ||
                (await (r.getDocumentElement == null
                  ? void 0
                  : r.getDocumentElement(a.floating))),
          boundary: l,
          rootBoundary: d,
          strategy: c,
        })
      ),
      S =
        u === "floating"
          ? { x: o, y: i, width: s.floating.width, height: s.floating.height }
          : s.reference,
      I = await (r.getOffsetParent == null
        ? void 0
        : r.getOffsetParent(a.floating)),
      A = (await (r.isElement == null ? void 0 : r.isElement(I)))
        ? (await (r.getScale == null ? void 0 : r.getScale(I))) || {
            x: 1,
            y: 1,
          }
        : { x: 1, y: 1 },
      w = lt(
        r.convertOffsetParentRelativeRectToViewportRelativeRect
          ? await r.convertOffsetParentRelativeRectToViewportRelativeRect({
              elements: a,
              rect: S,
              offsetParent: I,
              strategy: c,
            })
          : S
      );
    return {
      top: (b.top - w.top + E.top) / A.y,
      bottom: (w.bottom - b.bottom + E.bottom) / A.y,
      left: (b.left - w.left + E.left) / A.x,
      right: (w.right - b.right + E.right) / A.x,
    };
  }
  var he = function (t) {
    return (
      t === void 0 && (t = {}),
      {
        name: "flip",
        options: t,
        async fn(e) {
          var n, o;
          let {
              placement: i,
              middlewareData: r,
              rects: s,
              initialPlacement: a,
              platform: c,
              elements: l,
            } = e,
            {
              mainAxis: d = !0,
              crossAxis: u = !0,
              fallbackPlacements: f,
              fallbackStrategy: g = "bestFit",
              fallbackAxisSideDirection: E = "none",
              flipAlignment: y = !0,
              ...v
            } = st(t, e);
          if ((n = r.arrow) != null && n.alignmentOffset) return {};
          let b = X(i),
            S = nt(a),
            I = X(a) === a,
            A = await (c.isRTL == null ? void 0 : c.isRTL(l.floating)),
            w = f || (I || !y ? [Tt(a)] : ue(a)),
            M = E !== "none";
          !f && M && w.push(...fe(a, y, E, A));
          let k = [a, ...w],
            R = await _t(e, v),
            p = [],
            _ = ((o = r.flip) == null ? void 0 : o.overflows) || [];
          if ((d && p.push(R[b]), u)) {
            let H = de(i, s, A);
            p.push(R[H[0]], R[H[1]]);
          }
          if (
            ((_ = [..._, { placement: i, overflows: p }]),
            !p.every((H) => H <= 0))
          ) {
            var T, O;
            let H = (((T = r.flip) == null ? void 0 : T.index) || 0) + 1,
              N = k[H];
            if (N)
              return {
                data: { index: H, overflows: _ },
                reset: { placement: N },
              };
            let V =
              (O = _.filter((B) => B.overflows[0] <= 0).sort(
                (B, x) => B.overflows[1] - x.overflows[1]
              )[0]) == null
                ? void 0
                : O.placement;
            if (!V)
              switch (g) {
                case "bestFit": {
                  var L;
                  let B =
                    (L = _.filter((x) => {
                      if (M) {
                        let U = nt(x.placement);
                        return U === S || U === "y";
                      }
                      return !0;
                    })
                      .map((x) => [
                        x.placement,
                        x.overflows
                          .filter((U) => U > 0)
                          .reduce((U, vt) => U + vt, 0),
                      ])
                      .sort((x, U) => x[1] - U[1])[0]) == null
                      ? void 0
                      : L[0];
                  B && (V = B);
                  break;
                }
                case "initialPlacement":
                  V = a;
                  break;
              }
            if (i !== V) return { reset: { placement: V } };
          }
          return {};
        },
      }
    );
  };
  async function vn(t, e) {
    let { placement: n, platform: o, elements: i } = t,
      r = await (o.isRTL == null ? void 0 : o.isRTL(i.floating)),
      s = X(n),
      a = gt(n),
      c = nt(n) === "y",
      l = ["left", "top"].includes(s) ? -1 : 1,
      d = r && c ? -1 : 1,
      u = st(e, t),
      {
        mainAxis: f,
        crossAxis: g,
        alignmentAxis: E,
      } = typeof u == "number"
        ? { mainAxis: u, crossAxis: 0, alignmentAxis: null }
        : { mainAxis: 0, crossAxis: 0, alignmentAxis: null, ...u };
    return (
      a && typeof E == "number" && (g = a === "end" ? E * -1 : E),
      c ? { x: g * d, y: f * l } : { x: f * l, y: g * d }
    );
  }
  var ye = function (t) {
      return (
        t === void 0 && (t = 0),
        {
          name: "offset",
          options: t,
          async fn(e) {
            var n, o;
            let { x: i, y: r, placement: s, middlewareData: a } = e,
              c = await vn(e, t);
            return s === ((n = a.offset) == null ? void 0 : n.placement) &&
              (o = a.arrow) != null &&
              o.alignmentOffset
              ? {}
              : { x: i + c.x, y: r + c.y, data: { ...c, placement: s } };
          },
        }
      );
    },
    be = function (t) {
      return (
        t === void 0 && (t = {}),
        {
          name: "shift",
          options: t,
          async fn(e) {
            let { x: n, y: o, placement: i } = e,
              {
                mainAxis: r = !0,
                crossAxis: s = !1,
                limiter: a = {
                  fn: (v) => {
                    let { x: b, y: S } = v;
                    return { x: b, y: S };
                  },
                },
                ...c
              } = st(t, e),
              l = { x: n, y: o },
              d = await _t(e, c),
              u = nt(X(i)),
              f = Ht(u),
              g = l[f],
              E = l[u];
            if (r) {
              let v = f === "y" ? "top" : "left",
                b = f === "y" ? "bottom" : "right",
                S = g + d[v],
                I = g - d[b];
              g = Ut(S, g, I);
            }
            if (s) {
              let v = u === "y" ? "top" : "left",
                b = u === "y" ? "bottom" : "right",
                S = E + d[v],
                I = E - d[b];
              E = Ut(S, E, I);
            }
            let y = a.fn({ ...e, [f]: g, [u]: E });
            return { ...y, data: { x: y.x - n, y: y.y - o } };
          },
        }
      );
    },
    Ae = function (t) {
      return (
        t === void 0 && (t = {}),
        {
          options: t,
          fn(e) {
            let { x: n, y: o, placement: i, rects: r, middlewareData: s } = e,
              { offset: a = 0, mainAxis: c = !0, crossAxis: l = !0 } = st(t, e),
              d = { x: n, y: o },
              u = nt(i),
              f = Ht(u),
              g = d[f],
              E = d[u],
              y = st(a, e),
              v =
                typeof y == "number"
                  ? { mainAxis: y, crossAxis: 0 }
                  : { mainAxis: 0, crossAxis: 0, ...y };
            if (c) {
              let I = f === "y" ? "height" : "width",
                A = r.reference[f] - r.floating[I] + v.mainAxis,
                w = r.reference[f] + r.reference[I] - v.mainAxis;
              g < A ? (g = A) : g > w && (g = w);
            }
            if (l) {
              var b, S;
              let I = f === "y" ? "width" : "height",
                A = ["top", "left"].includes(X(i)),
                w =
                  r.reference[u] -
                  r.floating[I] +
                  ((A && ((b = s.offset) == null ? void 0 : b[u])) || 0) +
                  (A ? 0 : v.crossAxis),
                M =
                  r.reference[u] +
                  r.reference[I] +
                  (A ? 0 : ((S = s.offset) == null ? void 0 : S[u]) || 0) -
                  (A ? v.crossAxis : 0);
              E < w ? (E = w) : E > M && (E = M);
            }
            return { [f]: g, [u]: E };
          },
        }
      );
    },
    Ee = function (t) {
      return (
        t === void 0 && (t = {}),
        {
          name: "size",
          options: t,
          async fn(e) {
            let { placement: n, rects: o, platform: i, elements: r } = e,
              { apply: s = () => {}, ...a } = st(t, e),
              c = await _t(e, a),
              l = X(n),
              d = gt(n),
              u = nt(n) === "y",
              { width: f, height: g } = o.floating,
              E,
              y;
            l === "top" || l === "bottom"
              ? ((E = l),
                (y =
                  d ===
                  ((await (i.isRTL == null ? void 0 : i.isRTL(r.floating)))
                    ? "start"
                    : "end")
                    ? "left"
                    : "right"))
              : ((y = l), (E = d === "end" ? "top" : "bottom"));
            let v = g - c.top - c.bottom,
              b = f - c.left - c.right,
              S = Q(g - c[E], v),
              I = Q(f - c[y], b),
              A = !e.middlewareData.shift,
              w = S,
              M = I;
            if (
              (u ? (M = d || A ? Q(I, b) : b) : (w = d || A ? Q(S, v) : v),
              A && !d)
            ) {
              let R = F(c.left, 0),
                p = F(c.right, 0),
                _ = F(c.top, 0),
                T = F(c.bottom, 0);
              u
                ? (M =
                    f - 2 * (R !== 0 || p !== 0 ? R + p : F(c.left, c.right)))
                : (w =
                    g - 2 * (_ !== 0 || T !== 0 ? _ + T : F(c.top, c.bottom)));
            }
            await s({ ...e, availableWidth: M, availableHeight: w });
            let k = await i.getDimensions(r.floating);
            return f !== k.width || g !== k.height
              ? { reset: { rects: !0 } }
              : {};
          },
        }
      );
    };
  function dt(t) {
    return we(t) ? (t.nodeName || "").toLowerCase() : "#document";
  }
  function W(t) {
    var e;
    return (
      (t == null || (e = t.ownerDocument) == null ? void 0 : e.defaultView) ||
      window
    );
  }
  function Z(t) {
    var e;
    return (e = (we(t) ? t.ownerDocument : t.document) || window.document) ==
      null
      ? void 0
      : e.documentElement;
  }
  function we(t) {
    return t instanceof Node || t instanceof W(t).Node;
  }
  function K(t) {
    return t instanceof Element || t instanceof W(t).Element;
  }
  function G(t) {
    return t instanceof HTMLElement || t instanceof W(t).HTMLElement;
  }
  function ve(t) {
    return typeof ShadowRoot > "u"
      ? !1
      : t instanceof ShadowRoot || t instanceof W(t).ShadowRoot;
  }
  function yt(t) {
    let { overflow: e, overflowX: n, overflowY: o, display: i } = Y(t);
    return (
      /auto|scroll|overlay|hidden|clip/.test(e + o + n) &&
      !["inline", "contents"].includes(i)
    );
  }
  function Te(t) {
    return ["table", "td", "th"].includes(dt(t));
  }
  function Pt(t) {
    return [":popover-open", ":modal"].some((e) => {
      try {
        return t.matches(e);
      } catch {
        return !1;
      }
    });
  }
  function Rt(t) {
    let e = Nt(),
      n = K(t) ? Y(t) : t;
    return (
      n.transform !== "none" ||
      n.perspective !== "none" ||
      (n.containerType ? n.containerType !== "normal" : !1) ||
      (!e && (n.backdropFilter ? n.backdropFilter !== "none" : !1)) ||
      (!e && (n.filter ? n.filter !== "none" : !1)) ||
      ["transform", "perspective", "filter"].some((o) =>
        (n.willChange || "").includes(o)
      ) ||
      ["paint", "layout", "strict", "content"].some((o) =>
        (n.contain || "").includes(o)
      )
    );
  }
  function Se(t) {
    let e = ot(t);
    for (; G(e) && !ut(e); ) {
      if (Rt(e)) return e;
      if (Pt(e)) return null;
      e = ot(e);
    }
    return null;
  }
  function Nt() {
    return typeof CSS > "u" || !CSS.supports
      ? !1
      : CSS.supports("-webkit-backdrop-filter", "none");
  }
  function ut(t) {
    return ["html", "body", "#document"].includes(dt(t));
  }
  function Y(t) {
    return W(t).getComputedStyle(t);
  }
  function xt(t) {
    return K(t)
      ? { scrollLeft: t.scrollLeft, scrollTop: t.scrollTop }
      : { scrollLeft: t.scrollX, scrollTop: t.scrollY };
  }
  function ot(t) {
    if (dt(t) === "html") return t;
    let e = t.assignedSlot || t.parentNode || (ve(t) && t.host) || Z(t);
    return ve(e) ? e.host : e;
  }
  function Le(t) {
    let e = ot(t);
    return ut(e)
      ? t.ownerDocument
        ? t.ownerDocument.body
        : t.body
      : G(e) && yt(e)
      ? e
      : Le(e);
  }
  function ht(t, e, n) {
    var o;
    e === void 0 && (e = []), n === void 0 && (n = !0);
    let i = Le(t),
      r = i === ((o = t.ownerDocument) == null ? void 0 : o.body),
      s = W(i);
    if (r) {
      let a = qt(s);
      return e.concat(
        s,
        s.visualViewport || [],
        yt(i) ? i : [],
        a && n ? ht(a) : []
      );
    }
    return e.concat(i, ht(i, [], n));
  }
  function qt(t) {
    return t.parent && Object.getPrototypeOf(t.parent) ? t.frameElement : null;
  }
  function Ie(t) {
    let e = Y(t),
      n = parseFloat(e.width) || 0,
      o = parseFloat(e.height) || 0,
      i = G(t),
      r = i ? t.offsetWidth : n,
      s = i ? t.offsetHeight : o,
      a = St(n) !== r || St(o) !== s;
    return a && ((n = r), (o = s)), { width: n, height: o, $: a };
  }
  function Kt(t) {
    return K(t) ? t : t.contextElement;
  }
  function bt(t) {
    let e = Kt(t);
    if (!G(e)) return et(1);
    let n = e.getBoundingClientRect(),
      { width: o, height: i, $: r } = Ie(e),
      s = (r ? St(n.width) : n.width) / o,
      a = (r ? St(n.height) : n.height) / i;
    return (
      (!s || !Number.isFinite(s)) && (s = 1),
      (!a || !Number.isFinite(a)) && (a = 1),
      { x: s, y: a }
    );
  }
  var wn = et(0);
  function Me(t) {
    let e = W(t);
    return !Nt() || !e.visualViewport
      ? wn
      : { x: e.visualViewport.offsetLeft, y: e.visualViewport.offsetTop };
  }
  function Tn(t, e, n) {
    return e === void 0 && (e = !1), !n || (e && n !== W(t)) ? !1 : e;
  }
  function ft(t, e, n, o) {
    e === void 0 && (e = !1), n === void 0 && (n = !1);
    let i = t.getBoundingClientRect(),
      r = Kt(t),
      s = et(1);
    e && (o ? K(o) && (s = bt(o)) : (s = bt(t)));
    let a = Tn(r, n, o) ? Me(r) : et(0),
      c = (i.left + a.x) / s.x,
      l = (i.top + a.y) / s.y,
      d = i.width / s.x,
      u = i.height / s.y;
    if (r) {
      let f = W(r),
        g = o && K(o) ? W(o) : o,
        E = f,
        y = qt(E);
      for (; y && o && g !== E; ) {
        let v = bt(y),
          b = y.getBoundingClientRect(),
          S = Y(y),
          I = b.left + (y.clientLeft + parseFloat(S.paddingLeft)) * v.x,
          A = b.top + (y.clientTop + parseFloat(S.paddingTop)) * v.y;
        (c *= v.x),
          (l *= v.y),
          (d *= v.x),
          (u *= v.y),
          (c += I),
          (l += A),
          (E = W(y)),
          (y = qt(E));
      }
    }
    return lt({ width: d, height: u, x: c, y: l });
  }
  function Sn(t) {
    let { elements: e, rect: n, offsetParent: o, strategy: i } = t,
      r = i === "fixed",
      s = Z(o),
      a = e ? Pt(e.floating) : !1;
    if (o === s || (a && r)) return n;
    let c = { scrollLeft: 0, scrollTop: 0 },
      l = et(1),
      d = et(0),
      u = G(o);
    if (
      (u || (!u && !r)) &&
      ((dt(o) !== "body" || yt(s)) && (c = xt(o)), G(o))
    ) {
      let f = ft(o);
      (l = bt(o)), (d.x = f.x + o.clientLeft), (d.y = f.y + o.clientTop);
    }
    return {
      width: n.width * l.x,
      height: n.height * l.y,
      x: n.x * l.x - c.scrollLeft * l.x + d.x,
      y: n.y * l.y - c.scrollTop * l.y + d.y,
    };
  }
  function Ln(t) {
    return Array.from(t.getClientRects());
  }
  function Oe(t) {
    return ft(Z(t)).left + xt(t).scrollLeft;
  }
  function Pn(t) {
    let e = Z(t),
      n = xt(t),
      o = t.ownerDocument.body,
      i = F(e.scrollWidth, e.clientWidth, o.scrollWidth, o.clientWidth),
      r = F(e.scrollHeight, e.clientHeight, o.scrollHeight, o.clientHeight),
      s = -n.scrollLeft + Oe(t),
      a = -n.scrollTop;
    return (
      Y(o).direction === "rtl" && (s += F(e.clientWidth, o.clientWidth) - i),
      { width: i, height: r, x: s, y: a }
    );
  }
  function xn(t, e) {
    let n = W(t),
      o = Z(t),
      i = n.visualViewport,
      r = o.clientWidth,
      s = o.clientHeight,
      a = 0,
      c = 0;
    if (i) {
      (r = i.width), (s = i.height);
      let l = Nt();
      (!l || (l && e === "fixed")) && ((a = i.offsetLeft), (c = i.offsetTop));
    }
    return { width: r, height: s, x: a, y: c };
  }
  function In(t, e) {
    let n = ft(t, !0, e === "fixed"),
      o = n.top + t.clientTop,
      i = n.left + t.clientLeft,
      r = G(t) ? bt(t) : et(1),
      s = t.clientWidth * r.x,
      a = t.clientHeight * r.y,
      c = i * r.x,
      l = o * r.y;
    return { width: s, height: a, x: c, y: l };
  }
  function Pe(t, e, n) {
    let o;
    if (e === "viewport") o = xn(t, n);
    else if (e === "document") o = Pn(Z(t));
    else if (K(e)) o = In(e, n);
    else {
      let i = Me(t);
      o = { ...e, x: e.x - i.x, y: e.y - i.y };
    }
    return lt(o);
  }
  function Ce(t, e) {
    let n = ot(t);
    return n === e || !K(n) || ut(n)
      ? !1
      : Y(n).position === "fixed" || Ce(n, e);
  }
  function Mn(t, e) {
    let n = e.get(t);
    if (n) return n;
    let o = ht(t, [], !1).filter((a) => K(a) && dt(a) !== "body"),
      i = null,
      r = Y(t).position === "fixed",
      s = r ? ot(t) : t;
    for (; K(s) && !ut(s); ) {
      let a = Y(s),
        c = Rt(s);
      !c && a.position === "fixed" && (i = null),
        (
          r
            ? !c && !i
            : (!c &&
                a.position === "static" &&
                !!i &&
                ["absolute", "fixed"].includes(i.position)) ||
              (yt(s) && !c && Ce(t, s))
        )
          ? (o = o.filter((d) => d !== s))
          : (i = a),
        (s = ot(s));
    }
    return e.set(t, o), o;
  }
  function On(t) {
    let { element: e, boundary: n, rootBoundary: o, strategy: i } = t,
      s = [
        ...(n === "clippingAncestors"
          ? Pt(e)
            ? []
            : Mn(e, this._c)
          : [].concat(n)),
        o,
      ],
      a = s[0],
      c = s.reduce((l, d) => {
        let u = Pe(e, d, i);
        return (
          (l.top = F(u.top, l.top)),
          (l.right = Q(u.right, l.right)),
          (l.bottom = Q(u.bottom, l.bottom)),
          (l.left = F(u.left, l.left)),
          l
        );
      }, Pe(e, a, i));
    return {
      width: c.right - c.left,
      height: c.bottom - c.top,
      x: c.left,
      y: c.top,
    };
  }
  function Cn(t) {
    let { width: e, height: n } = Ie(t);
    return { width: e, height: n };
  }
  function Hn(t, e, n) {
    let o = G(e),
      i = Z(e),
      r = n === "fixed",
      s = ft(t, !0, r, e),
      a = { scrollLeft: 0, scrollTop: 0 },
      c = et(0);
    if (o || (!o && !r))
      if (((dt(e) !== "body" || yt(i)) && (a = xt(e)), o)) {
        let u = ft(e, !0, r, e);
        (c.x = u.x + e.clientLeft), (c.y = u.y + e.clientTop);
      } else i && (c.x = Oe(i));
    let l = s.left + a.scrollLeft - c.x,
      d = s.top + a.scrollTop - c.y;
    return { x: l, y: d, width: s.width, height: s.height };
  }
  function jt(t) {
    return Y(t).position === "static";
  }
  function xe(t, e) {
    return !G(t) || Y(t).position === "fixed"
      ? null
      : e
      ? e(t)
      : t.offsetParent;
  }
  function He(t, e) {
    let n = W(t);
    if (Pt(t)) return n;
    if (!G(t)) {
      let i = ot(t);
      for (; i && !ut(i); ) {
        if (K(i) && !jt(i)) return i;
        i = ot(i);
      }
      return n;
    }
    let o = xe(t, e);
    for (; o && Te(o) && jt(o); ) o = xe(o, e);
    return o && ut(o) && jt(o) && !Rt(o) ? n : o || Se(t) || n;
  }
  var _n = async function (t) {
    let e = this.getOffsetParent || He,
      n = this.getDimensions,
      o = await n(t.floating);
    return {
      reference: Hn(t.reference, await e(t.floating), t.strategy),
      floating: { x: 0, y: 0, width: o.width, height: o.height },
    };
  };
  function Rn(t) {
    return Y(t).direction === "rtl";
  }
  var Nn = {
    convertOffsetParentRelativeRectToViewportRelativeRect: Sn,
    getDocumentElement: Z,
    getClippingRect: On,
    getOffsetParent: He,
    getElementRects: _n,
    getClientRects: Ln,
    getDimensions: Cn,
    getScale: bt,
    isElement: K,
    isRTL: Rn,
  };
  function qn(t, e) {
    let n = null,
      o,
      i = Z(t);
    function r() {
      var a;
      clearTimeout(o), (a = n) == null || a.disconnect(), (n = null);
    }
    function s(a, c) {
      a === void 0 && (a = !1), c === void 0 && (c = 1), r();
      let { left: l, top: d, width: u, height: f } = t.getBoundingClientRect();
      if ((a || e(), !u || !f)) return;
      let g = Lt(d),
        E = Lt(i.clientWidth - (l + u)),
        y = Lt(i.clientHeight - (d + f)),
        v = Lt(l),
        S = {
          rootMargin: -g + "px " + -E + "px " + -y + "px " + -v + "px",
          threshold: F(0, Q(1, c)) || 1,
        },
        I = !0;
      function A(w) {
        let M = w[0].intersectionRatio;
        if (M !== c) {
          if (!I) return s();
          M
            ? s(!1, M)
            : (o = setTimeout(() => {
                s(!1, 1e-7);
              }, 1e3));
        }
        I = !1;
      }
      try {
        n = new IntersectionObserver(A, { ...S, root: i.ownerDocument });
      } catch {
        n = new IntersectionObserver(A, S);
      }
      n.observe(t);
    }
    return s(!0), r;
  }
  function _e(t, e, n, o) {
    o === void 0 && (o = {});
    let {
        ancestorScroll: i = !0,
        ancestorResize: r = !0,
        elementResize: s = typeof ResizeObserver == "function",
        layoutShift: a = typeof IntersectionObserver == "function",
        animationFrame: c = !1,
      } = o,
      l = Kt(t),
      d = i || r ? [...(l ? ht(l) : []), ...ht(e)] : [];
    d.forEach((b) => {
      i && b.addEventListener("scroll", n, { passive: !0 }),
        r && b.addEventListener("resize", n);
    });
    let u = l && a ? qn(l, n) : null,
      f = -1,
      g = null;
    s &&
      ((g = new ResizeObserver((b) => {
        let [S] = b;
        S &&
          S.target === l &&
          g &&
          (g.unobserve(e),
          cancelAnimationFrame(f),
          (f = requestAnimationFrame(() => {
            var I;
            (I = g) == null || I.observe(e);
          }))),
          n();
      })),
      l && !c && g.observe(l),
      g.observe(e));
    let E,
      y = c ? ft(t) : null;
    c && v();
    function v() {
      let b = ft(t);
      y &&
        (b.x !== y.x ||
          b.y !== y.y ||
          b.width !== y.width ||
          b.height !== y.height) &&
        n(),
        (y = b),
        (E = requestAnimationFrame(v));
    }
    return (
      n(),
      () => {
        var b;
        d.forEach((S) => {
          i && S.removeEventListener("scroll", n),
            r && S.removeEventListener("resize", n);
        }),
          u?.(),
          (b = g) == null || b.disconnect(),
          (g = null),
          c && cancelAnimationFrame(E);
      }
    );
  }
  var Re = ye;
  var Ne = be,
    qe = he,
    ke = Ee;
  var $e = Ae,
    De = (t, e, n) => {
      let o = new Map(),
        i = { platform: Nn, ...n },
        r = { ...i.platform, _c: o };
      return ge(t, e, { ...i, platform: r });
    };
  var kt = (t, e = !1) => {
      let n = t.getAttribute("data-instant-overlay-pointer-events");
      if (t.getAttribute("data-state") === "open") {
        if (n === "AUTO") {
          let i = document.querySelectorAll('[data-instant-type="overlay"]');
          if (
            !Array.from(i).find(
              (r) =>
                r.id !== q(t) &&
                r.getAttribute("data-state") === "open" &&
                r.getAttribute("data-instant-overlay-pointer-events") === "AUTO"
            )
          ) {
            let r = window.__instantOverlayBodyOverflow;
            (document.body.style.overflow = r || ""),
              delete window.__instantOverlayBodyOverflow;
          }
        }
        ((e && n === "AUTO") || !e) && t.setAttribute("data-state", "closed");
      } else {
        if (n === "AUTO" && typeof window.__instantOverlayBodyOverflow > "u") {
          let i = document.body.style.overflow;
          (window.__instantOverlayBodyOverflow = i),
            (document.body.style.overflow = "hidden");
        }
        t.setAttribute("data-state", "open");
      }
    },
    Yt = (t, e) => {
      let n = t.getAttribute("data-instant-action-id"),
        o;
      return (
        n
          ? (o = document.querySelector(`.i${n}`))
          : (o = t.closest(`[data-instant-type="${e}"]`)),
        o
      );
    },
    At = (t, e, n, o) => {
      let i = Yt(t, e);
      if (i)
        if (e === "overlay") kt(i);
        else {
          let r = i.parentElement;
          if (!r) return;
          let s = t.getAttribute("data-instant-action-id"),
            a = document.querySelectorAll(
              `[data-instant-action-id="${s}"][data-instant-state="active"]`
            ),
            c = r.getAttribute("data-state"),
            l = n || (c === "open" ? "close" : "open");
          a.length > 0 &&
            a.forEach((u) => {
              u !== t &&
                (u.setAttribute("data-instant-state", "inactive"),
                (u.style.pointerEvents = ""));
            });
          let d = document.body;
          d.getAttribute("safe-polygon") ||
            ((d.style.pointerEvents = "none"),
            d.setAttribute("safe-polygon", ""),
            (t.style.pointerEvents = "auto"),
            (r.style.pointerEvents = "auto")),
            Gt(i, t, l, o);
        }
    },
    Be = (t) => {
      let e = t.querySelectorAll('[data-instant-type="overlay"]');
      Array.from(e).forEach((n) => {
        let o = n.getAttribute("data-instant-overlay-scroll-offset"),
          i = n.getAttribute("data-instant-overlay-delay"),
          r =
            n.getAttribute("data-instant-overlay-is-close-persistent") ===
            "true",
          s = n.getAttribute("data-instant-overlay-pointer-events"),
          a = window?.Shopify?.designMode,
          c,
          l = `instant-overlay-inner-${q(n)}`;
        if (r && !a) {
          let d = sessionStorage.getItem(l),
            u = n.innerHTML;
          u !== d && (sessionStorage.setItem(l, u), (c = !0));
        } else c = !0;
        if (c && !a) {
          if (o) {
            let d = Number(o),
              u = !1,
              f = () => {
                if (window.scrollY < d) {
                  u = !1;
                  return;
                }
                n.getAttribute("data-state") === "open" || kt(n), (u = !0);
              },
              g = () => {
                u || (window.requestAnimationFrame(f), (u = !0));
              };
            window.addEventListener("scroll", g);
          } else if (i) {
            let d = Number(i);
            setTimeout(() => {
              n.getAttribute("data-state") === "open" || kt(n);
            }, d);
          }
        }
        s === "AUTO" &&
          n.addEventListener("click", (d) => {
            d.target === d.currentTarget && kt(n, !0);
          });
      });
    };
  var Ve = (t, e) => {
      let [n, o] = t,
        i = !1,
        r = e.length;
      for (let s = 0, a = r - 1; s < r; a = s++) {
        let [c, l] = e[s] || [0, 0],
          [d, u] = e[a] || [0, 0];
        l >= o != u >= o && n <= ((d - c) * (o - l)) / (u - l) + c && (i = !i);
      }
      return i;
    },
    kn = (t, e) =>
      t[0] >= e.x &&
      t[0] <= e.x + e.width &&
      t[1] >= e.y &&
      t[1] <= e.y + e.height,
    Qt = (t, e) => {
      if (!t || !e) return !1;
      let n = e.getRootNode?.();
      if (t.contains(e)) return !0;
      if (n && n instanceof ShadowRoot) {
        let o = e;
        for (; o; ) {
          if (t === o) return !0;
          o = o.parentNode || o.host;
        }
      }
      return !1;
    },
    $n = (t) => ("composedPath" in t ? t.composedPath()[0] : t.target),
    Dn = (t = {}) => {
      let { buffer: e = 0.5 } = t,
        n,
        o = !1,
        i = null,
        r = null,
        s = performance.now();
      function a(l, d) {
        let u = performance.now(),
          f = u - s;
        if (i === null || r === null || f === 0)
          return (i = l), (r = d), (s = u), null;
        let g = l - i,
          E = d - r,
          v = Math.sqrt(g * g + E * E) / f;
        return (i = l), (r = d), (s = u), v;
      }
      return ({ x: l, y: d, placement: u, elements: f, onClose: g }) =>
        function (y) {
          function v() {
            clearTimeout(n), g();
          }
          if (
            (clearTimeout(n),
            !f.domReference ||
              !f.floating ||
              u == null ||
              l == null ||
              d == null)
          )
            return;
          let { clientX: b, clientY: S } = y,
            I = [b, S],
            A = $n(y),
            w = y.type === "mouseleave",
            M = Qt(f.floating, A),
            k = Qt(f.domReference, A),
            R = f.domReference.getBoundingClientRect(),
            p = f.floating.getBoundingClientRect(),
            _ = u.split("-")[0],
            T = l > p.right - p.width / 2,
            O = d > p.bottom - p.height / 2,
            L = kn(I, R),
            H = p.width > R.width,
            N = p.height > R.height,
            V = (H ? R : p).left,
            B = (H ? R : p).right,
            x = (N ? R : p).top,
            U = (N ? R : p).bottom;
          if (M && ((o = !0), !w)) return;
          if ((k && (o = !1), k && !w)) {
            o = !0;
            return;
          }
          if (
            (w &&
              y.relatedTarget instanceof Element &&
              Qt(f.floating, y.relatedTarget)) ||
            f.floating.querySelectorAll(
              '.instant-dropdown--wrapper[data-state="open"]'
            ).length > 0
          )
            return;
          let ct = [];
          switch (_) {
            case "top":
              ct = [
                [V, R.top + 1],
                [V, p.bottom - 1],
                [B, p.bottom - 1],
                [B, R.top + 1],
              ];
              break;
            case "bottom":
              ct = [
                [V, p.top + 1],
                [V, R.bottom - 1],
                [B, R.bottom - 1],
                [B, p.top + 1],
              ];
              break;
            case "left":
              ct = [
                [p.right - 1, U],
                [p.right - 1, x],
                [R.left + 1, x],
                [R.left + 1, U],
              ];
              break;
            case "right":
              ct = [
                [R.right - 1, U],
                [R.right - 1, x],
                [p.left + 1, x],
                [p.left + 1, U],
              ];
              break;
          }
          function Jt([$, D]) {
            switch (_) {
              case "top": {
                let J = [H ? $ + e / 2 : T ? $ + e * 4 : $ - e * 4, D + e + 1],
                  tt = [H ? $ - e / 2 : T ? $ + e * 4 : $ - e * 4, D + e + 1],
                  it = [
                    [p.left, T || H ? p.bottom - e : p.top],
                    [p.right, T ? (H ? p.bottom - e : p.top) : p.bottom - e],
                  ];
                return [J, tt, ...it];
              }
              case "bottom": {
                let J = [H ? $ + e / 2 : T ? $ + e * 4 : $ - e * 4, D - e],
                  tt = [H ? $ - e / 2 : T ? $ + e * 4 : $ - e * 4, D - e],
                  it = [
                    [p.left, T || H ? p.top + e : p.bottom],
                    [p.right, T ? (H ? p.top + e : p.bottom) : p.top + e],
                  ];
                return [J, tt, ...it];
              }
              case "left": {
                let J = [$ + e + 1, N ? D + e / 2 : O ? D + e * 4 : D - e * 4],
                  tt = [$ + e + 1, N ? D - e / 2 : O ? D + e * 4 : D - e * 4];
                return [
                  ...[
                    [O || N ? p.right - e : p.left, p.top],
                    [O ? (N ? p.right - e : p.left) : p.right - e, p.bottom],
                  ],
                  J,
                  tt,
                ];
              }
              case "right": {
                let J = [$ - e, N ? D + e / 2 : O ? D + e * 4 : D - e * 4],
                  tt = [$ - e, N ? D - e / 2 : O ? D + e * 4 : D - e * 4],
                  it = [
                    [O || N ? p.left + e : p.right, p.top],
                    [O ? (N ? p.left + e : p.right) : p.left + e, p.bottom],
                  ];
                return [J, tt, ...it];
              }
            }
          }
          if (!Ve([b, S], ct)) {
            if (o && !L) return v();
            if (!w) {
              let $ = a(y.clientX, y.clientY);
              if ($ !== null && $ < 0.1) return v();
            }
            Ve([b, S], Jt([l, d])) ? o || (n = window.setTimeout(v, 40)) : v();
          }
        };
    },
    It = (t, e, n) => {
      let o = document.body,
        i = n ? n === "close" : e.getAttribute("data-state") === "open",
        r = (s) => {
          if (
            e?.getAttribute("data-state") === "open" &&
            !e.children[0].contains(s.target)
          ) {
            let c = e.querySelector('[data-instant-type="dropdown"]'),
              l = document.querySelectorAll(
                `[data-instant-action-id="${wt(
                  q(c)
                )}"][data-instant-state="active"]`
              );
            It(l, e, "close");
          }
        };
      if (i)
        o.hasAttribute("safe-polygon") &&
          !o.querySelector(
            '.instant-dropdown--wrapper[data-state="open"] .instant-dropdown--wrapper[data-state="open"]'
          ) &&
          ((o.style.pointerEvents = ""),
          o.removeAttribute("safe-polygon"),
          (e.style.pointerEvents = "")),
          e.setAttribute("data-state", "closed"),
          t.forEach((a) => {
            a.setAttribute("data-instant-state", "inactive"),
              (a.style.pointerEvents = "");
          }),
          e.cleanup && (e.cleanup(), delete e.cleanup),
          e
            .querySelectorAll(
              '.instant-dropdown--wrapper[data-state="open"] > [data-instant-type="dropdown"]'
            )
            .forEach((a) => {
              let c = a.parentElement,
                l = document.querySelectorAll(
                  `[data-instant-action-id="${wt(
                    q(a)
                  )}"][data-instant-state="active"]`
                );
              It(l, c, "close");
            }),
          document.removeEventListener("click", r);
      else {
        if (
          (e.setAttribute("data-state", "open"),
          t.forEach((s) => s.setAttribute("data-instant-state", "active")),
          !e.cleanup)
        ) {
          let s = e.querySelector('[data-instant-type="dropdown"]');
          s && t[0] && Gt(s, t[0], "open");
        }
        document.addEventListener("click", r);
      }
    },
    Bn = (t, e) => {
      let n = { x: e.x, y: e.y },
        o = { x: t.x, y: t.y },
        i = { x: e.x + e.width, y: e.y + e.height },
        r = { x: t.x + t.width, y: t.y + t.height };
      return n.x < o.x && i.x < o.x
        ? "left"
        : n.x > r.x && i.x > r.x
        ? "right"
        : n.y < o.y && i.y < o.y
        ? "top"
        : "bottom";
    },
    Vn = (t, e, n, o, i, r, s) => {
      De(t, e, {
        strategy: "fixed",
        placement: o,
        middleware: [
          Re(i),
          Ne({ limiter: $e() }),
          qe({
            fallbackStrategy: "initialPlacement",
            fallbackPlacements: ["bottom", "right", "left", "top"],
          }),
          ke({
            apply({ rects: a, elements: c }) {
              Object.assign(c.floating.style, {
                minWidth: `${a.reference.width}px`,
                minHeight: `${a.reference.height}px`,
              }),
                c.floating.style.setProperty(
                  "--instant-reference-width",
                  `${a.reference.width}px`
                ),
                c.floating.style.setProperty(
                  "--instant-reference-height",
                  `${a.reference.height}px`
                );
            },
          }),
        ],
      }).then(({ x: a, y: c, placement: l }) => {
        let d = Bn(n.getBoundingClientRect(), e.getBoundingClientRect());
        if (
          (Object.assign(e.style, { left: `${a}px`, top: `${c}px` }),
          e.setAttribute("data-instant-dropdown-placement", l),
          r)
        ) {
          let u = Dn(),
            f = (g) => {
              e.getAttribute("data-state") === "open"
                ? u({
                    elements: { floating: e, domReference: n },
                    x: a,
                    y: c,
                    placement: d,
                    onClose: () => {
                      document.removeEventListener("mousemove", f),
                        It([n], e, "close");
                    },
                  })(g)
                : document.removeEventListener("mousemove", f);
            };
          document.addEventListener("mousemove", f);
        } else It([n], e, s);
      });
    },
    Gt = (t, e, n, o = !1) => {
      let i = t.getAttribute("data-instant-dropdown-placement"),
        r = t.getAttribute("data-instant-dropdown-offset"),
        s = Number(r) || 0,
        a = t.parentNode,
        c = a.parentNode;
      return (
        a.cleanup && a.cleanup(),
        (a.cleanup = _e(c, a, () => {
          Vn(c, a, e, i, s, o, n);
        })),
        a.cleanup
      );
    },
    Fe = (t) => {
      let e = t.querySelectorAll('[data-instant-type="dropdown"]');
      Array.from(e).forEach((n) => {
        let o = n.querySelectorAll(
            '*[data-instant-action-type]:not([data-instant-action-on-hover]):not([data-instant-action-type="open-dropdown"])'
          ),
          i = n.parentElement,
          s = window.getComputedStyle(n).zIndex;
        i &&
          (i.style.setProperty("z-index", s),
          n.style.setProperty("z-index", "auto")),
          Array.from(o).forEach((a) => {
            a.addEventListener("click", (c) => {
              c.preventDefault(), c.stopPropagation();
              let l = c.currentTarget;
              if (!l || !(l instanceof HTMLElement)) return null;
              let d = document.querySelectorAll(
                `[data-instant-action-id="${wt(
                  q(n)
                )}"][data-instant-state="active"]`
              );
              It(d, i, "close");
            });
          });
      });
    },
    Ue = (t) => {
      let e = t.querySelectorAll(
        '[data-instant-action-type="open-dropdown"][data-instant-action-on-hover]'
      );
      Array.from(e).forEach((n) => {
        let i = Yt(n, "dropdown")?.parentNode;
        i &&
          (n.addEventListener("mouseenter", () => {
            let r = document.body;
            r.getAttribute("safe-polygon") ||
              ((r.style.pointerEvents = "none"),
              r.setAttribute("safe-polygon", ""),
              (n.style.pointerEvents = "auto"),
              (i.style.pointerEvents = "auto")),
              At(n, "dropdown", "open");
          }),
          n.addEventListener("mouseleave", () => {
            At(n, "dropdown", "close", !0);
          }),
          n.addEventListener("click", (r) => {
            r.preventDefault(), r.stopPropagation();
          }));
      });
    };
  var Fn = (t, e) => t?.replace(/:(-?\d+)/, `:${e}`),
    Un = (t) => t.match(/:(-?\d+)/)?.[1],
    $t = ({
      variantId: t,
      scope: e,
      scopeId: n,
      quantity: o,
      selectedSellingPlan: i,
      skipVariantUrlUpdate: r,
    }) => {
      let s = e.getAttribute("data-instant-form-product-url"),
        a = e.closest(".__instant")?.getAttribute("data-section-id"),
        l = ["PRICE", "COMPARE_AT", "SAVED_AMOUNT", "SAVED_PERCENTAGE"]
          .map((L) => `[data-instant-dynamic-content-source="${L}"]`)
          .join(", "),
        d = e.querySelectorAll(l),
        f = [
          "SKU",
          "VARIANT_TITLE",
          "VARIANT_METAFIELD",
          "OPTION1",
          "OPTION2",
          "OPTION3",
          "QUANTITY_AVAILABLE",
        ]
          .map((L) => `[data-instant-dynamic-content-source="${L}"]`)
          .join(", "),
        g = e.querySelectorAll(f),
        E = e.querySelectorAll(
          'fieldset[data-instant-type="VARIANT_PICKER"] select option'
        ),
        y = e.querySelectorAll(
          'fieldset[data-instant-type="VARIANT_PICKER"] input[type="radio"]'
        ),
        v = e.querySelectorAll(
          'img[data-instant-dynamic-content-source="FEATURED_IMAGE"]'
        ),
        b = e.querySelectorAll(
          'img[data-instant-dynamic-content-source="REPEATER"]'
        ),
        I = ["add-to-cart", "redirect-to-cart", "redirect-to-checkout"]
          .map((L) => `[data-instant-action-type="${L}"]`)
          .join(", "),
        A = e.querySelectorAll(I),
        w = '[data-instant-action-type="open-page"]',
        M = e.querySelectorAll(w),
        k = e.querySelectorAll(
          '[data-instant-action-type="select-variant-option"]'
        ),
        R = e.querySelectorAll(
          '[data-instant-action-type="select-selling-plan"]'
        ),
        p = e.querySelectorAll(
          'fieldset[data-instant-type="SELLING_PLAN_PICKER"] input[type="radio"]'
        ),
        _ = e.querySelectorAll(
          'fieldset[data-instant-type="SELLING_PLAN_PICKER"] select'
        ),
        T = e.querySelectorAll("[data-instant-conditional]");
      if (!t) {
        for (let L of [...d, ...g])
          L?.closest("[data-instant-form-product-url]") === e &&
            L &&
            (L.innerHTML = "&nbsp;");
        for (let L of A)
          L.closest("[data-instant-form-product-url]") === e &&
            L &&
            L.setAttribute("data-instant-disabled", "true");
        for (let L of E)
          if (L?.closest("[data-instant-form-product-url]") === e && L) {
            let H = L?.closest(
                'fieldset[data-instant-type="VARIANT_PICKER"]'
              )?.querySelector(
                'span[data-instant-type="selected-variant-option"]'
              ),
              N = L.closest("select");
            L.value === N?.value
              ? (L.setAttribute("selected", ""),
                H && (H.innerHTML = L.innerHTML))
              : L.removeAttribute("selected");
          }
        return;
      }
      if (
        !r &&
        e.closest('[data-instant-layout="PRODUCT_TEMPLATE"]') &&
        e.getAttribute("data-instant-type") === "root"
      ) {
        let L = new URL(window.location.toString()),
          H = L.searchParams.get("variant"),
          N = e.getAttribute("data-instant-form-variant-id");
        (H || t !== N) &&
          (L.searchParams.set("variant", t),
          window.history.replaceState({}, "", L.toString()));
      }
      let O = new URLSearchParams({ variant: t, section_id: a });
      i?.sellingPlanId && O.set("selling_plan", i.sellingPlanId),
        fetch(`${s}?${O.toString()}`)
          .then((L) => L.text())
          .then((L) => {
            let H = new DOMParser().parseFromString(L, "text/html"),
              N = e.getAttribute("data-instant-form-product-url"),
              [V, B] = n.split("_"),
              x = H.querySelector(
                `.i${V}${
                  B != null ? `[data-instant-repeater-index="${B}"]` : ""
                }[data-instant-form-product-url="${N}"]`
              );
            if (!x) {
              console.warn("Could not find source element in response");
              return;
            }
            let vt = ["PRICE", "COMPARE_AT", "SAVED_AMOUNT", "SAVED_PERCENTAGE"]
                .map((m) => `[data-instant-dynamic-content-source="${m}"]`)
                .join(", "),
              ct = Array.from(x.querySelectorAll(vt)),
              $ = [
                "SKU",
                "VARIANT_TITLE",
                "VARIANT_METAFIELD",
                "OPTION1",
                "OPTION2",
                "OPTION3",
                "QUANTITY_AVAILABLE",
              ]
                .map((m) => `[data-instant-dynamic-content-source="${m}"]`)
                .join(", "),
              D = Array.from(x.querySelectorAll($)),
              J = Array.from(
                x?.querySelectorAll(
                  'fieldset[data-instant-type="VARIANT_PICKER"] input[type="radio"]'
                )
              ),
              tt = Array.from(
                x?.querySelectorAll(
                  'fieldset[data-instant-type="VARIANT_PICKER"] select option'
                )
              ),
              it = Array.from(
                x?.querySelectorAll(
                  '[data-instant-action-type="select-variant-option"]'
                )
              ),
              sn = Array.from(
                x?.querySelectorAll(
                  'fieldset[data-instant-type="SELLING_PLAN_PICKER"] input[type="radio"]'
                )
              ),
              an = Array.from(
                x?.querySelectorAll(
                  'fieldset[data-instant-type="SELLING_PLAN_PICKER"] select'
                )
              ),
              cn = Array.from(
                x?.querySelectorAll(
                  'span[data-instant-type="selected-selling-plan-option"]'
                )
              ),
              ln = ["add-to-cart", "redirect-to-cart", "redirect-to-checkout"]
                .map((m) => `[data-instant-action-type="${m}"]`)
                .join(", "),
              dn = Array.from(x?.querySelectorAll(ln)),
              un = Array.from(
                x?.querySelectorAll('[data-instant-action-type="open-page"]')
              ),
              fn = Array.from(
                x?.querySelectorAll(
                  'img[data-instant-dynamic-content-source="FEATURED_IMAGE"]'
                )
              ),
              mn = Array.from(
                x?.querySelectorAll(
                  'img[data-instant-dynamic-content-source="REPEATER"]'
                )
              ),
              pn = Array.from(
                x?.querySelectorAll("[data-instant-conditional]")
              ),
              Bt = document.querySelector(
                `input[name="${n}__selling-plan-id"]`
              ),
              te = document.querySelector(
                `input[name="${n}__selling-plan-name"]`
              ),
              ee = !1,
              gn = e.querySelectorAll(
                'span[data-instant-type="selected-selling-plan-option"]'
              );
            for (let m of gn) {
              let P = q(m),
                h = cn.find((C) => q(C) === P);
              h?.closest("[data-instant-form-product-url]") === x &&
                h &&
                (m.innerHTML = h.innerHTML);
            }
            for (let m of p) {
              let P = sn.find((h) => h.id === m.id);
              if (P?.closest("[data-instant-form-product-url]") === x && P) {
                let h = P.getAttribute("data-instant-disabled");
                h
                  ? m.setAttribute("data-instant-disabled", h)
                  : m.removeAttribute("data-instant-disabled"),
                  P.hasAttribute("checked")
                    ? (m.checked = !0)
                    : (m.checked = !1),
                  (m.value = P.value);
                let C;
                if ((m.labels && ([C] = Array.from(m.labels)), C)) {
                  let z;
                  if ((P.labels && ([z] = Array.from(P.labels)), z)) {
                    C.innerHTML = z.innerHTML;
                    let j = z.getAttribute("title");
                    j && C.setAttribute("title", j);
                  }
                }
              }
            }
            for (let m of _) {
              let P = an.find((h) => h.id === m.id);
              P?.closest("[data-instant-form-product-url]") === x &&
                (m.innerHTML = P.innerHTML);
            }
            for (let m of d) {
              let P = q(m),
                h = ct.find((C) => q(C) === P);
              if (h?.closest("[data-instant-form-product-url]") === x && h) {
                ee ? (m.innerHTML = "&nbsp;") : (m.innerHTML = h.innerHTML);
                let C = h.getAttribute("style");
                C ? m.setAttribute("style", C) : m.removeAttribute("style");
              }
            }
            for (let m of R) {
              let P = q(m),
                h = Array.from(
                  x?.querySelectorAll(
                    '[data-instant-action-type="select-selling-plan"]'
                  )
                ).find((mt) => q(mt) === P);
              if (h?.closest("[data-instant-form-product-url]") !== x) continue;
              let C = m?.querySelectorAll(
                  '[data-instant-type="SELLING_PLAN_PICKER"]'
                ),
                z = decodeURIComponent(
                  h.getAttribute("data-instant-selling-plan-name")
                ),
                j = h.getAttribute("data-instant-selling-plan-id");
              if (!i && j === "one-time-purchase") {
                m.setAttribute("data-instant-state", "active");
                continue;
              }
              if (i?.sellingPlanId === j || i?.sellingPlanName === z) {
                m.setAttribute("data-instant-state", "active"),
                  h.getAttribute("data-instant-disabled") === "true" &&
                    (ee = !0);
                continue;
              }
              if (
                C?.length > 0 &&
                i &&
                i.sellingPlanId !== "one-time-purchase"
              ) {
                m.setAttribute("data-instant-state", "active");
                let mt = Array.from(m.querySelectorAll(vt));
                for (let Vt of mt) {
                  let ne = Vt.getAttribute(
                    "data-instant-dynamic-content-source"
                  );
                  ne === "PRICE"
                    ? (Vt.innerHTML = i.price)
                    : ne === "COMPARE_AT" && (Vt.innerHTML = i.compareAtPrice);
                }
                continue;
              }
              m.setAttribute("data-instant-state", "inactive");
            }
            for (let m of g) {
              let P = q(m),
                h = D.find((C) => q(C) === P);
              h?.closest("[data-instant-form-product-url]") === x &&
                h &&
                (m.innerHTML = h.innerHTML);
            }
            for (let m of y) {
              let P = J.find((h) => h.id === m.id);
              if (P?.closest("[data-instant-form-product-url]") === x && P) {
                let h = P.getAttribute("data-instant-disabled");
                h
                  ? m.setAttribute("data-instant-disabled", h)
                  : m.removeAttribute("data-instant-disabled"),
                  P.hasAttribute("checked")
                    ? (m.checked = !0)
                    : (m.checked = !1);
                let C;
                if ((m.labels && ([C] = Array.from(m.labels)), C)) {
                  let z;
                  if ((P.labels && ([z] = Array.from(P.labels)), z)) {
                    let j = z.getAttribute("title");
                    j && C.setAttribute("title", j);
                  }
                }
              }
            }
            for (let m of E) {
              let P = tt.find((h) => h.id === m.id);
              if (P?.closest("[data-instant-form-product-url]") === x && P) {
                let h = P.getAttribute("data-instant-disabled");
                h
                  ? m.setAttribute("data-instant-disabled", h)
                  : m.removeAttribute("data-instant-disabled"),
                  (m.textContent = P.textContent);
                let C = m
                  ?.closest('fieldset[data-instant-type="VARIANT_PICKER"]')
                  ?.querySelector(
                    'span[data-instant-type="selected-variant-option"]'
                  );
                P.hasAttribute("selected")
                  ? (m.setAttribute("selected", ""),
                    C && (C.innerHTML = P.innerHTML))
                  : m.removeAttribute("selected");
              }
            }
            for (let m of v) {
              let P = q(pt(m)),
                h = fn.find((C) => q(pt(C)) === P);
              h?.closest("[data-instant-form-product-url]") === x &&
                h &&
                ((m.src = h.src),
                (m.sizes = h.sizes),
                (m.srcset = h.srcset),
                (m.alt = h.alt),
                (m.height = h.height),
                (m.width = h.width));
            }
            for (let m of b) {
              if (
                window.is_rubik_active &&
                x.closest('[data-instant-layout="PRODUCT_TEMPLATE"]') &&
                x.getAttribute("data-instant-type") === "root"
              )
                continue;
              let P = mn.find(
                (h) =>
                  h.getAttribute("data-instant-repeater-id") ===
                    m.getAttribute("data-instant-repeater-id") &&
                  h.getAttribute("data-instant-repeater-index") ===
                    m.getAttribute("data-instant-repeater-index")
              );
              if (P?.closest("[data-instant-form-product-url]") === x && P) {
                (m.src = P.src),
                  (m.sizes = P.sizes),
                  (m.srcset = P.srcset),
                  (m.alt = P.alt),
                  (m.height = P.height),
                  (m.width = P.width);
                let h = m.closest(".instant-slider");
                h?.swiper &&
                  h.swiper.realIndex !== 0 &&
                  h?.closest("[data-instant-form-product-url]") === e &&
                  h.swiper.slideTo(0, 0);
              }
            }
            for (let m of A) {
              let P = q(m),
                h = dn.find((C) => q(C) === P);
              if (h?.closest("[data-instant-form-product-url]") === x && h) {
                h.getAttribute("data-instant-disabled") === "true"
                  ? m.setAttribute("data-instant-disabled", "true")
                  : m.removeAttribute("data-instant-disabled");
                for (let mt of R)
                  mt.getAttribute("data-instant-state") === "active" &&
                    mt.getAttribute("data-instant-disabled") === "true" &&
                    m.setAttribute("data-instant-disabled", "true");
                m.setAttribute("data-instant-action-variant-id", t);
                let z = parseInt(Un(h.href) ?? "1", 10),
                  j = h.href;
                o && z === 1 && (j = Fn(j, String(o))), (m.href = j);
              }
            }
            for (let m of M) {
              let P = q(m),
                h = un.find((C) => q(C) === P);
              if (h?.closest("[data-instant-form-product-url]") === x && h) {
                let C = new URL(h.href);
                C.searchParams.set("variant", t), (m.href = C.toString());
              }
            }
            for (let m of k) {
              let P = q(m),
                h = it.find((C) => q(C) === P);
              h?.closest("[data-instant-form-product-url]") === x &&
                h &&
                (m.setAttribute(
                  "data-instant-state",
                  h.getAttribute("data-instant-state") ?? "inactive"
                ),
                m.setAttribute(
                  "data-instant-disabled",
                  h.getAttribute("data-instant-disabled") ?? ""
                ));
            }
            i ||
              (te && te.remove(),
              Bt && Bt.value !== "one-time-purchase" && Bt.remove());
            for (let m of T) {
              let P = q(m),
                h = pn.find((z) => q(z) === P);
              if (h?.closest("[data-instant-form-product-url]") !== x) continue;
              let C = h.getAttribute("style");
              C ? m.setAttribute("style", C) : m.removeAttribute("style");
            }
          });
    },
    at = (t, e, n) => {
      let o = t.querySelector(`input[name="${e}"]`);
      if (o) {
        o.value = n;
        return;
      }
      let i = document.createElement("input");
      t.appendChild(i),
        i.setAttribute("type", "hidden"),
        i.setAttribute("name", e),
        i.setAttribute("value", n);
    },
    ze = (t) => {
      let e = t.querySelectorAll("[data-instant-product-recommendations]");
      Array.from(e).forEach((n) => {
        let o = n?.parentElement,
          i = n.getAttribute("data-instant-product-recommendations");
        if (o && i) {
          if (n.getAttribute("data-instant-observed")) return;
          n.setAttribute("data-instant-observed", "true");
          let r = (a, c) => {
            if (!a[0].isIntersecting) return;
            c.unobserve(o);
            let l = n.getAttribute("data-url");
            l &&
              fetch(l)
                .then((d) => d.text())
                .then((d) => {
                  let f = new DOMParser()
                    .parseFromString(d, "text/html")
                    .querySelector(
                      `[data-instant-product-recommendations-output="${i}"]`
                    );
                  f &&
                    f.innerHTML.trim().length &&
                    (n.insertAdjacentHTML("afterend", f.innerHTML),
                    o && Mt(o),
                    n.remove());
                })
                .catch((d) => {
                  console.error(d);
                });
          };
          new IntersectionObserver(r, {
            rootMargin: "0px 0px 200px 0px",
          }).observe(o);
        }
      });
    };
  var Dt = (t) => t.querySelector("kaching-bundles-kkblock");
  // document.addEventListener("kaching-bundles-block-loaded", (t) => {
  //   if ("detail" in t) {
  //     let { component: e } = t.detail,
  //       n = e.closest("[data-instant-form-product-url]");
  //     if (n) {
  //       let o = rt(n);
  //       (window.kachingBundlesDisableAddToCartHandling = !0),
  //         e.addEventListener("variant-selected", (i) => {
  //           if ("detail" in i) {
  //             let { variantId: r } = i.detail;
  //             $t({
  //               variantId: r,
  //               scope: n,
  //               scopeId: o,
  //               quantity: 1,
  //               skipVariantUrlUpdate: !0,
  //             });
  //           }
  //         });
  //     }
  //   }
  // });
  var Xt = (t) => t?.replace(/gid:\/\/shopify\/.*\//im, ""),
    zn = (t, e) => (e ? t?.find((n) => n.id === Number(Xt(e))) : t?.[0]),
    We = (t) => {
      let e = t.querySelectorAll(
        ".__instant form[data-instant-form-product-url]"
      );
      Array.from(e).forEach((n) => {
        let o = n.querySelectorAll(
          'input[data-instant-dynamic-content-source="QUANTITY_SELECT"]'
        );
        Array.from(o).forEach((i) => {
          i.addEventListener("input", (r) => {
            let s = i.getAttribute("min") ?? "1",
              a = i.getAttribute("max") ?? "999",
              c = parseInt(i.value, 10);
            r.target instanceof HTMLInputElement &&
              (c = parseInt(r.target.value, 10)),
              s && c < parseInt(s, 10) && (i.value = s),
              a && c > parseInt(a, 10) && (i.value = a),
              isNaN(c) && (i.value = s),
              i.dispatchEvent(new Event("change", { bubbles: !0 }));
          });
        }),
          n.addEventListener("change", (i) => {
            let r = new FormData(i?.currentTarget),
              s = i.target?.closest("[data-instant-form-product-url]");
            if (!s) {
              console.warn("No scope found for form change event");
              return;
            }
            let a = rt(s);
            if (
              i.target instanceof HTMLSelectElement &&
              i.target.name.endsWith("__selling_plan")
            ) {
              let T = s.querySelectorAll(`select[name="${i.target.name}"]`);
              Array.from(T).forEach((O) => {
                O !== i.target && (O.value = i.target.value);
              });
            }
            if (
              i.target?.closest("kaching-bundles-block") ||
              i.target?.name?.startsWith("properties[")
            )
              return;
            if (i.target?.name === "quantity") {
              let T = parseInt(i.target?.value, 10);
              isNaN(T) && (T = 1);
              let O = s.querySelectorAll(
                'input[data-instant-dynamic-content-source="QUANTITY_SELECT"]'
              );
              for (let L of O) L.value = T.toString();
            }
            let c = s?.getAttribute("data-instant-form-variant-id"),
              l = s?.getAttribute("data-instant-form-selling-plan-id"),
              { variants: d, options: u, sellingPlans: f } = Ot(s, a),
              g = zn(d, c),
              E = [];
            for (let [T, O] of r)
              T.startsWith(a) &&
                E.push({
                  key: decodeURIComponent(T.replace(`${a}__`, "")),
                  value: String(O),
                });
            let y = [g?.option1, g?.option2, g?.option3],
              v = [];
            if (u)
              for (let T of u)
                v.push(
                  E.find(({ key: O }) => O === T.name)?.value ??
                    y[T.position - 1]
                );
            let b = d
              ? d?.find(({ option1: T, option2: O, option3: L }) => {
                  let H = [T, O, L].filter(Boolean),
                    N = v.filter(Boolean);
                  return H.every((V, B) => V === N[B]);
                })?.id
              : c;
            if (i.target?.name?.endsWith("__selling_plan")) {
              let T = i.target?.value;
              if (T === "one-time-purchase")
                at(s, `${a}__selling-plan-id`, "one-time-purchase"),
                  at(s, `${a}__selling-plan-name`, "One Time Purchase");
              else {
                let O = f?.find(
                  (L) =>
                    L.variantId === b?.toString() &&
                    (L.sellingPlanId === T || L.sellingPlanName === T)
                );
                O &&
                  (at(s, `${a}__selling-plan-id`, O.sellingPlanId),
                  at(s, `${a}__selling-plan-name`, O.sellingPlanName));
              }
            }
            let S = document.querySelector(
                `input[name="${a}__selling-plan-id"]`
              ),
              I = document.querySelector(
                `input[name="${a}__selling-plan-name"]`
              ),
              A = Xt(S?.value),
              w = Xt(I?.value),
              M = f?.find(
                (T) =>
                  T.variantId === b.toString() &&
                  (T.sellingPlanId === A?.toString() ||
                    T.sellingPlanName ===
                      decodeURIComponent(w?.toString() ?? ""))
              );
            !M &&
              A !== "one-time-purchase" &&
              (M = f?.find(
                (T) => T.variantId === b.toString() && T.sellingPlanId === l
              )),
              !M &&
                A &&
                A !== "one-time-purchase" &&
                (M = f?.find((T) => T.variantId === b.toString()));
            let k = s.querySelector('input[name="id"]'),
              R = s.querySelector('input[name="selling_plan"]');
            k && b && (k.value = b.toString()),
              R && (R.value = A === "one-time-purchase" || !A ? "" : A);
            let p = r.get("quantity"),
              _ = Dt(s);
            _ &&
              ((_.currentVariantId = parseInt(b)),
              p && (_.quantity = parseInt(p.toString()))),
              $t({
                variantId: b,
                scope: s,
                scopeId: a,
                quantity: p,
                selectedSellingPlan: M,
              });
          });
      }),
        Array.from(e).forEach((n) => {
          n.dispatchEvent(new Event("change"));
        });
    };
  var Wn = (t) => {
      let e = document.getElementById(`i${t}`);
      e && e.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    jn = (t) =>
      "checkVisibility" in t ? !t.checkVisibility() : t.offsetParent === null,
    Zt = (t, e) => {
      e
        ? (t.classList.add("instant-loading"),
          t.style.setProperty("cursor", "wait"),
          t.setAttribute("disabled", "disabled"))
        : (t.classList.remove("instant-loading"),
          t.style.removeProperty("cursor"),
          t.removeAttribute("disabled"));
    },
    Kn = (t, e) => {
      let n = t.closest("[data-instant-form-product-url]");
      if (!n) return;
      let o = n.querySelector(
        '[data-instant-dynamic-content-source="QUANTITY_SELECT"]'
      );
      if (!o) return;
      let i = parseInt(o?.value, 10);
      isNaN(i) && (i = 1);
      let r = e === "increment" ? i + 1 : i - 1;
      r < 1 ||
        r > 999 ||
        ((o.value = r.toString()),
        o.dispatchEvent(new Event("change", { bubbles: !0 })));
    },
    Yn = (t) => {
      let e = t.closest("[data-instant-form-product-url]");
      if (!e) return null;
      let n = rt(e),
        o = `${n}__${t.getAttribute("data-instant-option-name")}`,
        i = t.getAttribute("data-instant-option-value") ?? "",
        r = e.querySelectorAll(`input[name^="${n}__"]`),
        s = [];
      for (let a of r) a.name === o && s.push(a);
      if (s?.length === 1) s[0].value = i;
      else if (s?.length > 1)
        s.forEach((a) => {
          a.checked = a.value === t.getAttribute("data-instant-option-value");
        });
      else {
        let a = document.createElement("input");
        e.appendChild(a),
          a.setAttribute("type", "hidden"),
          a.setAttribute("name", o),
          a.setAttribute("value", i);
      }
      e.dispatchEvent(new Event("change", { cancelable: !0, bubbles: !0 }));
    },
    Gn = (t) => {
      let e = t.closest("[data-instant-form-product-url]");
      if (!e) return null;
      let n = rt(e);
      at(
        e,
        `${n}__selling-plan-id`,
        t.getAttribute("data-instant-selling-plan-id") ?? ""
      ),
        at(
          e,
          `${n}__selling-plan-name`,
          t.getAttribute("data-instant-selling-plan-name") ?? ""
        );
      let o = e.querySelectorAll(
        '[data-instant-type="SELLING_PLAN_PICKER"] select'
      );
      Array.from(o).forEach((i) => {
        i.value = t.getAttribute("data-instant-selling-plan-id") ?? "";
      }),
        e.dispatchEvent(new Event("change", { cancelable: !0, bubbles: !0 }));
    },
    je = async (t) => {
      let e = t.getAttribute("data-instant-action-type"),
        n = t.getAttribute("data-instant-action-id"),
        o = t.getAttribute("data-instant-action-variant-id");
      if (
        t.getAttribute("data-instant-disabled") === "true" &&
        !["select-variant-option", "select-selling-plan"].includes(e)
      )
        return !0;
      switch (e) {
        case "add-to-cart":
        case "redirect-to-cart":
        case "redirect-to-checkout":
          let r = new URL(t.href).pathname.split(":").pop() ?? "1",
            s = t.getAttribute("data-instant-discount-code"),
            a = t.getAttribute("data-instant-clear-cart") === "true",
            c = t.closest("[data-instant-form-product-url]");
          if (!c) return null;
          let l = rt(c),
            d = c.querySelector(`input[name="${l}__selling-plan-id"]`),
            u = c.querySelector(`input[name="${l}__selling-plan-name"]`),
            f = c.getAttribute("data-instant-form-selling-plan-id"),
            { sellingPlans: g } = Ot(c, l);
          if (d?.value || u?.value)
            if (d?.value === "one-time-purchase") f = null;
            else {
              let A = g.find(
                (w) =>
                  (w.sellingPlanId === d?.value ||
                    w.sellingPlanName === decodeURIComponent(u?.value ?? "")) &&
                  w.variantId === o
              );
              A?.sellingPlanId && (f = A.sellingPlanId);
            }
          Zt(t, !0),
            a &&
              (await fetch(`${window.Shopify?.routes?.root}cart/clear.js`, {
                method: "POST",
              }).catch((A) => {
                console.error("Failed to clear cart", A);
              })),
            s &&
              ((document.cookie = `discount_code=${s}; path=/`),
              await fetch(`${window.Shopify?.routes?.root}discount/${s}`).catch(
                (A) => {
                  console.error("Failed to set discount code", A);
                }
              ));
          let E,
            y = [];
          e === "add-to-cart" &&
            ((E = Array.from(
              document.querySelectorAll(
                '[data-instant-dynamic-content-source="CART_COUNT"]'
              )
            )),
            E.forEach((A) => {
              if (y.length >= 5) return;
              let w = A.closest(".__instant")?.getAttribute("data-section-id");
              w && !y.includes(w) && y.push(w);
            }));
          let v = [],
            b = Dt(c);
          if (b) v.push(...b.items());
          else {
            v.push({
              id: parseInt(o, 10),
              quantity: parseInt(r, 10),
              ...(f && f !== "one-time-purchase"
                ? { selling_plan: parseInt(f, 10) }
                : {}),
            });
            let A = c.querySelectorAll('input[name^="properties["]');
            if (A.length > 0) {
              let w = {};
              for (let M of A) {
                if (jn(M)) continue;
                if (!M.checkValidity())
                  return M.reportValidity(), Zt(t, !1), !0;
                let k = M.name.match(/properties\[(.*?)\]/)?.[1];
                k &&
                  M.value &&
                  (M.type !== "radio" || M.checked) &&
                  (w[k] = M.value);
              }
              v.forEach((M) => {
                M.properties = w;
              });
            }
          }
          let S = { items: v, sections: y.length > 0 ? y.join(",") : void 0 };
          fetch(`${window.Shopify?.routes?.root}cart/add.js`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(S),
          })
            .then((A) => {
              if (!A.ok) throw new Error();
              switch (e) {
                case "redirect-to-cart":
                  window.location.href = `${window.Shopify?.routes?.root}cart`;
                  break;
                case "redirect-to-checkout":
                  window.location.href = `${window.Shopify?.routes?.root}checkout`;
                  break;
                case "add-to-cart":
                default:
                  let w = new CustomEvent("instant:add-to-cart", {
                    bubbles: !1,
                  });
                  document.dispatchEvent(w),
                    A.json().then(({ sections: M }) => {
                      Ft(E, M);
                    });
              }
            })
            .catch(() => {
              let A = document.createElement("form");
              A.setAttribute("method", "POST"),
                A.setAttribute(
                  "action",
                  `${window.Shopify?.routes?.root}cart/add`
                ),
                A.setAttribute("novalidate", "novalidate"),
                [
                  ["id", o ?? ""],
                  ["product-id", n ?? ""],
                  ["form_type", "product"],
                  ["quantity", r],
                  ["utf8", "\u2713"],
                ].forEach(([w, M]) => {
                  let k = document.createElement("input");
                  k.setAttribute("type", "hidden"),
                    k.setAttribute("name", w),
                    k.setAttribute("value", M),
                    A.appendChild(k);
                }),
                document.body.appendChild(A),
                A.submit();
            })
            .finally(() => {
              Zt(t, !1);
            });
          break;
        case "scroll-to-section":
          n && Wn(n);
          break;
        case "quantity-increment":
        case "quantity-decrement":
          Kn(t, e === "quantity-increment" ? "increment" : "decrement");
          break;
        case "select-variant-option":
          Yn(t);
          break;
        case "select-selling-plan":
          Gn(t);
          break;
        case "open-dropdown":
          At(t, "dropdown");
          break;
        case "open-overlay":
          At(t, "overlay");
          break;
        case "trigger-cart":
          let I = new CustomEvent("instant:open-cart", { bubbles: !1 });
          document.dispatchEvent(I);
          break;
        case "open-page":
        case "open-cart":
          return !1;
        default:
          return console.warn(`Unknown instant action type: ${e}`), !1;
      }
      return !0;
    },
    Ke = (t) => {
      let e = t.querySelectorAll(
        [
          'a[data-instant-action-type]:not([data-instant-action-type^="open-"]):not([data-instant-action-on-hover])',
          "button[data-instant-action-type]:not([data-instant-action-on-hover])",
          "div[data-instant-action-type]:not([data-instant-action-on-hover])",
        ].join(", ")
      );
      Array.from(e).forEach((o) => {
        o.addEventListener("click", (i) => {
          i.preventDefault(), i.stopPropagation();
          let r = i.currentTarget;
          return !r || !(r instanceof HTMLElement) ? null : (je(r), !1);
        });
      });
      let n = document.querySelectorAll(
        ".__instant div[href], .__instant form[href]"
      );
      Array.from(n).forEach((o) => {
        o.addEventListener("click", (i) => {
          let r = i.currentTarget;
          if (!r || !(r instanceof HTMLElement)) return null;
          let s = pt(i.target);
          i.target instanceof HTMLLabelElement ||
            i.target instanceof HTMLInputElement ||
            i.target instanceof HTMLFieldSetElement ||
            i.target instanceof HTMLAnchorElement ||
            i.target instanceof HTMLButtonElement ||
            s instanceof HTMLAnchorElement ||
            s instanceof HTMLButtonElement ||
            s instanceof HTMLInputElement ||
            s instanceof HTMLLabelElement ||
            s instanceof HTMLFieldSetElement ||
            (i.preventDefault(),
            i.stopPropagation(),
            je(r).then((a) => {
              if (a) return;
              let c = r.getAttribute("href"),
                l = r.getAttribute("target"),
                d = r.getAttribute("rel");
              c && window.open(c, l || "_self", d || void 0);
            }));
        });
      });
    };
  var Et = "instant-scroll-trigger--hidden";
  function Qn(t, e, n) {
    t.forEach((o) => {
      let i = o.target;
      o.isIntersecting
        ? (i.classList.contains(Et) && i.classList.remove(Et),
          n || e.unobserve(i))
        : n && i.classList.add(Et);
    });
  }
  var Ye = (t) => {
    let e = t.querySelectorAll(".instant-scroll-trigger");
    e.length !== 0 &&
      e.forEach((n) => {
        let o =
            n.getAttribute("data-instant-scroll-into-view-replay") === "true",
          i = n.getAttribute("data-instant-scroll-into-view-offset")
            ? Number(n.getAttribute("data-instant-scroll-into-view-offset"))
            : 0;
        if (window.getComputedStyle(n).position === "fixed") {
          let s = !1,
            a = () => {
              if (window.scrollY < i) {
                o && n.classList.add(Et), (s = !1);
                return;
              }
              n.classList.contains(Et) && n.classList.remove(Et), (s = !1);
            },
            c = () => {
              s || (window.requestAnimationFrame(a), (s = !0));
            };
          window.addEventListener("scroll", c);
        } else
          new IntersectionObserver((a, c) => Qn(a, c, o), {
            root: document,
            threshold: 0,
            rootMargin: `${-i}px 0px`,
          }).observe(n);
      });
  };
  var Ge = (t, e) => {
      let n = document.querySelector(`.i${t}`),
        o = document.querySelectorAll(`[data-instant-tab-id="${t}"]`);
      if (e) for (let i of e) i.setAttribute("data-instant-state", "closed");
      if ((n && n.setAttribute("data-instant-state", "open"), o))
        for (let i of o) {
          let s = i?.parentNode?.querySelectorAll(
            `:scope > [data-instant-type="tabs-trigger"]:not([data-instant-tab-id="${t}"])`
          );
          if (s)
            for (let a of s) a.setAttribute("data-instant-state", "inactive");
          i.setAttribute("data-instant-state", "active");
        }
    },
    Qe = (t, e) => {
      let n = document.querySelector(`.i${t}`);
      if (e) for (let o of e) o.style.setProperty("display", "none");
      n && n.style.removeProperty("display");
    },
    Xe = (t) => {
      let e = t.querySelectorAll('[data-instant-type="tabs-container"]'),
        n = t?.querySelectorAll('[data-instant-type="tabs-trigger"]');
      Array.from(e).forEach((o) => {
        let s = o
          ?.querySelector('[data-instant-type="tabs-pane"]')
          ?.parentNode?.querySelectorAll(
            ':scope > [data-instant-type="tabs-pane"]'
          );
        s?.[0]?.id &&
          (Qe(s[0].id, s), window.requestAnimationFrame(() => Ge(s[0].id, s)));
      }),
        Array.from(n).forEach((o) => {
          let i = o.getAttribute("data-instant-tabs-id"),
            r = o.getAttribute("data-instant-tab-id");
          if (i && r) {
            let l = document
              .querySelector(`.i${i}`)
              ?.querySelector('[data-instant-type="tabs-pane"]')
              ?.parentNode?.querySelectorAll(
                ':scope > [data-instant-type="tabs-pane"]'
              );
            n &&
              l &&
              o.addEventListener("click", () => {
                let d = o.getAttribute("data-instant-tab-id") || "";
                Qe(d, l), window.requestAnimationFrame(() => Ge(d, l));
              });
          }
        });
    };
  var Ze = (t) => {
    let e = t.querySelectorAll('[data-instant-type="ticker"]');
    Array.from(e)
      .reverse()
      .forEach((n) => {
        let o = n.querySelector(".instant-ticker-initial-child-container"),
          i = o?.closest(".instant-ticker"),
          r = i?.nextElementSibling,
          s = [i, r],
          a = n.getAttribute("data-instant-ticker-is-reversed") === "true",
          c = +(n.getAttribute("data-instant-ticker-speed") || 50),
          l = n.getAttribute("data-instant-ticker-pause") === "true" || !1;
        if (n && o) {
          let d = o.children,
            u = 1,
            f = 0,
            g = () => {
              let y = n.getBoundingClientRect(),
                v = o.getBoundingClientRect();
              if (y && v) {
                let b = Math.min(y.width, 9999),
                  S = v.width,
                  I = window.getComputedStyle(o),
                  A = I.columnGap
                    ? typeof I.columnGap == "number"
                      ? `${I.columnGap}px`
                      : I.columnGap
                    : "0px";
                n.style.setProperty("--gap", A),
                  (u = S && b && S < b ? Math.ceil(b / S) : 1),
                  (f = (S * u) / c);
              }
              n.style.getPropertyValue("--multiplier") !== `${u}` &&
                (i && i.replaceChildren(o),
                r && (r.innerHTML = ""),
                Array.from(s).forEach((b, S) => {
                  b &&
                    [...Array(Math.max(0, S === 0 ? u - 1 : u))].forEach(() => {
                      Array.from(d).forEach((I) => {
                        let A = I.cloneNode(!0);
                        b.appendChild(A);
                      });
                    });
                })),
                n.style.setProperty("--play", "running"),
                n.style.setProperty("--direction", a ? "reverse" : "normal"),
                n.style.setProperty("--duration", `${f}s`),
                n.style.setProperty(
                  "--pause-on-hover",
                  l ? "paused" : "running"
                ),
                n.style.setProperty("--multiplier", `${u}`),
                /^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
                  n.querySelectorAll('img[loading="lazy"]').forEach((S) => {
                    S.loading = "eager";
                  });
            };
          g();
          let E = new ResizeObserver(g);
          E.observe(n), E.observe(o);
        }
      });
  };
  var Je = (t) => {
      let e = t.querySelectorAll("iframe.tiktok__autoplay");
      Array.from(e).forEach((n) => {
        let o = n.getAttribute("src") ?? "";
        en(o, n);
      });
    },
    tn = (t) => {
      let e = t.querySelectorAll(
        ".instant-video-fill__controls, .video-fill__controls"
      );
      Array.from(e).forEach((n) => {
        let o = n.closest(".instant-video-fill__wrapper, .video-fill__wrapper"),
          i = o?.querySelector("video");
        o &&
          i &&
          n.addEventListener("click", () => {
            i.paused
              ? (i.play(), o.setAttribute("data-paused", "false"))
              : (i.pause(), o.setAttribute("data-paused", "true"));
          });
      });
    },
    en = (t, e) => {
      let n = t.split("/").pop();
      e.setAttribute("name", `__tt_embed__${n}`),
        window.addEventListener("message", (o) => {
          try {
            let i = JSON.parse(o.data);
            i.height &&
              document
                .querySelector(`[name="${i.signalSource}"]`)
                ?.closest(".instant-video__container, .video__container")
                ?.setAttribute(
                  "style",
                  `height:${i.height}px;width:325px;border-radius:8px 8px 8px 8px;overflow:hidden`
                );
          } catch {}
        });
    },
    nn = (t) => {
      let e = t.querySelectorAll(
        "article.instant-video__wrapper, article.video__wrapper"
      );
      Array.from(e).forEach((o) => {
        o.addEventListener("click", () => {
          if (
            !o.querySelector("iframe") &&
            o.getAttribute("data-type") !== "external"
          ) {
            let i = o.getAttribute("data-src") ?? "",
              r = o.getAttribute("data-title") ?? "",
              s = document.createElement("iframe");
            (s.className = "instant-video__iframe"),
              s.setAttribute("src", i),
              s.setAttribute("title", r),
              s.setAttribute("frameborder", "0"),
              s.setAttribute(
                "allow",
                "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              ),
              s.setAttribute("allowfullscreen", "allowfullscreen"),
              o.style.setProperty("background-image", "none"),
              i?.includes("tiktok") && en(i, s),
              o.appendChild(s);
          } else if (
            !o.querySelector("video") &&
            o.getAttribute("data-type") === "external"
          ) {
            let i = o.getAttribute("data-src") ?? "",
              r = document.createElement("video");
            (r.className = "instant-video__player"),
              r.setAttribute("autoplay", "true"),
              r.setAttribute("controls", "true"),
              r.setAttribute("playsInline", "true"),
              r.setAttribute("src", i),
              o.style.setProperty("background-image", "none"),
              o.appendChild(r);
          }
        });
      });
      let n = t.querySelectorAll(".instant-video-fill__wrapper");
      Array.from(n).forEach((o) => {
        let i = o.querySelector("video");
        i &&
          i
            .play()
            .then(() => {})
            .catch(() => {
              let r = o.querySelector(".instant-video-fill__overlay"),
                s = i.getAttribute("poster") ?? "",
                a = document.createElement("img");
              a.setAttribute("src", s),
                (a.className = "instant-video-fill__video"),
                r ? o.insertBefore(a, r) : o.append(a);
            });
      });
    };
  var Xn = (t) => {
      let e = t.querySelectorAll(".instant-localization-select select");
      Array.from(e).forEach((n) => {
        let o = n;
        o.addEventListener("change", (i) => {
          let r =
              o.name.split("--")[1] === "language"
                ? "locale_code"
                : "country_code",
            s = document.createElement("form");
          (s.action = "/localization"),
            (s.method = "post"),
            [
              { name: "form_type", value: "localization" },
              { name: "_method", value: "put" },
              { name: "return_to", value: window.location.pathname },
              { name: r, value: i.target.value },
            ].forEach((c) => {
              let l = document.createElement("input");
              (l.type = "hidden"),
                (l.name = c.name),
                (l.value = c.value),
                s.appendChild(l);
            }),
            document.body.appendChild(s),
            s.submit();
        });
      });
    },
    Mt = (t) => {
      window.Instant.initializedListeners = !0;
      let e = document;
      if (t)
        if (t instanceof Element) e = t;
        else {
          let n = document.getElementById(t);
          n && (e = n);
        }
      ce(e),
        le(e),
        Ke(e),
        Be(e),
        Fe(e),
        Ue(e),
        ze(e),
        nn(e),
        Ye(e),
        Xe(e),
        Ze(e),
        Je(e),
        window.__instantInitSliders?.(e),
        tn(e),
        We(e),
        Xn(e);
    };
  var on = (t) => {
    if (!window.Instant.initializedSwiper) {
      if (t.querySelector('[data-instant-type="slider"]')) {
        let r = document.createElement("script");
        (r.onload = window.Instant.initSwiper),
          (r.src =
            window.Instant.swiperScriptUrl ||
            "https://client.instant.so/scripts/swiper-bundle.min.js"),
          document.body.appendChild(r);
      }
      return;
    }
    let e = {},
      n = (r, s = "slider") => {
        if (r && r.id) {
          let a = document.getElementById(`instant-slider-${r.id}-params`),
            c = r.closest(".__instant")?.getAttribute("data-section-id"),
            l = r.getAttribute("data-instant-slider-id");
          try {
            if (a?.innerHTML) {
              let d = JSON.parse(a.innerHTML);
              if (
                (c &&
                  d.navigation &&
                  ((d.navigation.nextEl = `[data-section-id='${c}'] ${d.navigation.nextEl}`),
                  (d.navigation.prevEl = `[data-section-id='${c}'] ${d.navigation.prevEl}`)),
                d.pagination)
              ) {
                let u = document.querySelector(
                    `[data-section-id='${c}'] ${d.pagination.el}`
                  ),
                  f = u?.querySelector(".instant-slider-pagination-bullet");
                if (u && f) {
                  let g = q(f);
                  d.pagination.renderBullet = (E, y) =>
                    `<span class="${y} ${g}"></span>`;
                }
              }
              if (
                ((d.on = d.on || {}),
                (d.on.changeDirection = (u) => {
                  if (u.params.direction === "horizontal") {
                    let f = r.querySelector(":scope > .instant-slider-wrapper");
                    f && (f.style.height = "");
                  }
                }),
                s === "thumbnails")
              ) {
                let u = new Swiper(r, d);
                e[`${l}`] = u;
              } else
                d.thumbs &&
                  e?.[`${l}`] &&
                  (d.thumbs = { swiper: e?.[`${l}`], ...d.thumbs }),
                  new Swiper(r, d);
            }
          } catch {}
        }
      },
      o = t.querySelectorAll('[data-instant-type="thumbnails"]');
    Array.from(o).forEach((r) => {
      n(r, "thumbnails");
    });
    let i = t.querySelectorAll('[data-instant-type="slider"]');
    Array.from(i).forEach((r) => {
      n(r);
    });
  };
  window.__instantInitSliders = (t = document) => {
    on(t);
  };
  var rn = () => {
    Mt(),
      se(),
      re(),
      window?.Shopify?.designMode &&
        document.addEventListener("shopify:section:load", (t) => {
          let e = `shopify-section-${t.detail.sectionId}`;
          e && Mt(e);
        });
  };
  document.readyState !== "loading"
    ? rn()
    : document.addEventListener("DOMContentLoaded", () => {
        rn();
      });
})();
