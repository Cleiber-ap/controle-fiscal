import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/pages/Dashboard/index.jsx");import { createHotContext as __vite__createHotContext } from "/@vite/client";
var _s2 = $RefreshSig$();
import.meta.hot = __vite__createHotContext("/src/pages/Dashboard/index.tsx");
import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=28bdd564";
const useEffect = __vite__cjsImport0_react["useEffect"];
const useRef = __vite__cjsImport0_react["useRef"];
const useState = __vite__cjsImport0_react["useState"];
import { historicoAPI, dasAPI, empresasAPI } from "/src/api/endpoints.ts";
var _jsxFileName = "C:/projetos/controle-fiscal/frontend/src/pages/Dashboard/index.tsx";
import __vite__cjsImport2_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=28bdd564";
const _jsxDEV = __vite__cjsImport2_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$();
const MESES = [
	"Jan",
	"Fev",
	"Mar",
	"Abr",
	"Mai",
	"Jun",
	"Jul",
	"Ago",
	"Set",
	"Out",
	"Nov",
	"Dez"
];
const MESES_FULL = [
	"Janeiro",
	"Fevereiro",
	"Março",
	"Abril",
	"Maio",
	"Junho",
	"Julho",
	"Agosto",
	"Setembro",
	"Outubro",
	"Novembro",
	"Dezembro"
];
const PAL = [
	"#4F8EF7",
	"#34D399",
	"#F472B6",
	"#A78BFA",
	"#FB923C",
	"#F87171"
];
function fmtK(v) {
	if (v >= 1e6) return "R$" + (v / 1e6).toFixed(1) + "M";
	if (v >= 1e3) return "R$" + (v / 1e3).toFixed(0) + "K";
	return "R$" + v.toFixed(0);
}
function fmtR(v) {
	return "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}
export default function Dashboard() {
	_s2();
	_s();
	const canvasRef = useRef(null);
	const animRef = useRef(0);
	const [historico, setHistorico] = useState([]);
	const [das, setDas] = useState([]);
	const [empresas, setEmpresas] = useState([]);
	const [loading, setLoading] = useState(true);
	const [periodo, setPeriodo] = useState("12m");
	const [comparar, setComparar] = useState([]);
	const [customA, setCustomA] = useState({
		mesIni: 1,
		anoIni: 2025,
		mesFim: 12,
		anoFim: 2025
	});
	const [customB, setCustomB] = useState({
		mesIni: 1,
		anoIni: 2024,
		mesFim: 12,
		anoFim: 2024
	});
	const [customC, setCustomC] = useState({
		mesIni: "",
		anoIni: "",
		mesFim: "",
		anoFim: ""
	});
	const [customAtivo, setCustomAtivo] = useState(false);
	const [customLabel, setCustomLabel] = useState("");
	const now = new Date();
	const mesAntIdx = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
	const anoAnt = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
	const anoAtual = now.getFullYear();
	useEffect(() => {
		Promise.all([
			historicoAPI.listar(1).then((r) => r.data),
			historicoAPI.listar(2).then((r) => r.data),
			dasAPI.listar(1).then((r) => r.data),
			dasAPI.listar(2).then((r) => r.data),
			empresasAPI.listar().then((r) => r.data)
		]).then(([h1, h2, d1, d2, emp]) => {
			setHistorico([...h1, ...h2]);
			setDas([...d1, ...d2]);
			setEmpresas(emp);
		}).catch(() => {}).finally(() => setLoading(false));
	}, []);
	// Calcular KPIs
	const histSix = historico.filter((r) => r.empresa_id === 1);
	const histEnova = historico.filter((r) => r.empresa_id === 2);
	const empSix = empresas.find((e) => e.nome === "SIX") || { aliquota_das: .088324 };
	const empEnova = empresas.find((e) => e.nome === "ENOVA") || { aliquota_das: .093254 };
	const vSixMes = histSix.find((r) => r.ano === anoAnt && r.mes === mesAntIdx + 1)?.valor || 0;
	const vEnovaMes = histEnova.find((r) => r.ano === anoAnt && r.mes === mesAntIdx + 1)?.valor || 0;
	const totalMes = vSixMes + vEnovaMes;
	const vSixAno = histSix.filter((r) => r.ano === anoAtual).reduce((s, r) => s + r.valor, 0);
	const vEnovaAno = histEnova.filter((r) => r.ano === anoAtual).reduce((s, r) => s + r.valor, 0);
	const totalAno = vSixAno + vEnovaAno;
	const impTotal = vSixMes * empSix.aliquota_das + vEnovaMes * empEnova.aliquota_das;
	// Preparar anos disponíveis
	const anosDisp = [...new Set(historico.map((r) => r.ano))].sort((a, b) => b - a);
	const anosAsc = [...anosDisp].sort((a, b) => a - b);
	// Preparar dados do gráfico
	function getTotal(ano, mes) {
		const s = histSix.find((r) => r.ano === ano && r.mes === mes)?.valor || 0;
		const e = histEnova.find((r) => r.ano === ano && r.mes === mes)?.valor || 0;
		return s + e;
	}
	function getPeriodos() {
		const cutoff = new Date(now.getFullYear(), now.getMonth() - (periodo === "6m" ? 6 : periodo === "12m" ? 12 : periodo === "24m" ? 24 : 120), 1);
		const res = [];
		for (let ano of anosAsc) {
			for (let mes = 1; mes <= 12; mes++) {
				const d = new Date(ano, mes - 1, 1);
				if (d >= cutoff && d <= now) {
					if (historico.some((r) => r.ano === ano && r.mes === mes)) {
						res.push({
							ano,
							mes,
							label: MESES[mes - 1] + "/" + String(ano).slice(2)
						});
					}
				}
			}
		}
		return res;
	}
	function getRangeMonths(mesIni, anoIni, mesFim, anoFim) {
		const res = [];
		for (let ano = anoIni; ano <= anoFim; ano++) {
			const mStart = ano === anoIni ? mesIni : 1;
			const mEnd = ano === anoFim ? mesFim : 12;
			for (let mes = mStart; mes <= mEnd; mes++) {
				res.push({
					ano,
					mes,
					label: MESES[mes - 1] + "/" + String(ano).slice(2)
				});
			}
		}
		return res;
	}
	// Desenhar gráfico no canvas
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || loading) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		cancelAnimationFrame(animRef.current);
		const PAD = {
			top: 28,
			right: 16,
			bottom: 28,
			left: 52
		};
		const W = canvas.offsetWidth;
		const H = canvas.offsetHeight;
		canvas.width = W;
		canvas.height = H;
		const cW = W - PAD.left - PAD.right;
		const cH = H - PAD.top - PAD.bottom;
		let series = [];
		if (customAtivo) {
			const pA = getRangeMonths(customA.mesIni, customA.anoIni, customA.mesFim, customA.anoFim);
			const pB = getRangeMonths(customB.mesIni, customB.anoIni, customB.mesFim, customB.anoFim);
			const maxLen = Math.max(pA.length, pB.length);
			const pos = Array.from({ length: maxLen }, (_, i) => i).filter((i) => {
				const vA = pA[i] ? getTotal(pA[i].ano, pA[i].mes) : 0;
				const vB = pB[i] ? getTotal(pB[i].ano, pB[i].mes) : 0;
				return vA > 0 || vB > 0;
			});
			series = [{
				label: "A: " + customLabel.split(" | ")[0]?.replace("A: ", ""),
				color: "#4F8EF7",
				data: pos.map((i) => pA[i] ? getTotal(pA[i].ano, pA[i].mes) : 0),
				labels: pos.map((i) => pA[i]?.label || "")
			}, {
				label: "B: " + customLabel.split(" | ")[1]?.replace("B: ", ""),
				color: "#A78BFA",
				data: pos.map((i) => pB[i] ? getTotal(pB[i].ano, pB[i].mes) : 0),
				labels: pos.map((i) => pB[i]?.label || "")
			}];
			if (customC.anoIni && customC.anoFim) {
				const pC = getRangeMonths(parseInt(customC.mesIni), parseInt(customC.anoIni), parseInt(customC.mesFim), parseInt(customC.anoFim));
				const posC = Array.from({ length: Math.max(maxLen, pC.length) }, (_, i) => i).filter((i) => pC[i] ? getTotal(pC[i].ano, pC[i].mes) > 0 : false);
				series.push({
					label: "C",
					color: "#FBBF24",
					data: posC.map((i) => pC[i] ? getTotal(pC[i].ano, pC[i].mes) : 0),
					labels: posC.map((i) => pC[i]?.label || "")
				});
			}
		} else {
			const periods = getPeriodos();
			const mainData = periods.map((p) => getTotal(p.ano, p.mes));
			series = [{
				label: "SIX+ENOVA",
				color: "#4F8EF7",
				data: mainData,
				labels: periods.map((p) => p.label)
			}];
			comparar.forEach((yr, ci) => {
				series.push({
					label: String(yr),
					color: PAL[ci % PAL.length],
					data: periods.map((p) => getTotal(yr, p.mes)),
					labels: periods.map((p) => p.label)
				});
			});
		}
		const nBars = series[0]?.data.length || 0;
		if (!nBars) return;
		const allVals = series.flatMap((s) => s.data);
		const maxV = Math.max(...allVals, 1);
		const gridSteps = 8;
		const groupW = cW / nBars;
		const barSeries = series.filter((_, i) => i === 0);
		const lineSeries = series.filter((_, i) => i > 0);
		const barW = Math.max(4, Math.min(28, groupW * .8 / Math.max(barSeries.length, 1)));
		const groupOffset = -(barSeries.length - 1) * barW / 2;
		function fmtK2(v) {
			if (v >= 1e6) return "R$" + (v / 1e6).toFixed(1) + "M";
			if (v >= 1e3) return "R$" + (v / 1e3).toFixed(0) + "K";
			return "R$" + v.toFixed(0);
		}
		let progress = 0;
		const start = performance.now();
		const dur = 800;
		function draw(ts) {
			progress = Math.min(1, (ts - start) / dur);
			const ease = 1 - Math.pow(1 - progress, 3);
			ctx.clearRect(0, 0, W, H);
			// Grid
			ctx.font = "11px monospace";
			ctx.textAlign = "right";
			for (let i = 0; i <= gridSteps; i++) {
				const v = maxV * i / gridSteps;
				const y = PAD.top + cH - cH * i / gridSteps;
				ctx.strokeStyle = i === 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)";
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(PAD.left, y);
				ctx.lineTo(PAD.left + cW, y);
				ctx.stroke();
				if (i > 0) {
					ctx.fillStyle = "#7B82A0";
					ctx.fillText(fmtK2(v), PAD.left - 4, y + 4);
				}
			}
			// Barras animadas
			if (customAtivo) {
				const nS = series.length;
				const bW2 = Math.max(4, Math.min(22, groupW * .85 / nS));
				const gOff = -(nS - 1) * bW2 / 2;
				series.forEach((s, si) => {
					ctx.fillStyle = s.color;
					s.data.forEach((v, i) => {
						const delay = i / nBars * .5;
						const lp = Math.max(0, Math.min(1, (ease - delay) / (1 - .5)));
						const bH = v / maxV * cH * lp;
						const x = PAD.left + groupW * i + groupW / 2 + gOff + si * bW2;
						const y = PAD.top + cH - bH;
						ctx.globalAlpha = .85;
						ctx.beginPath();
						if (ctx.roundRect) ctx.roundRect(x, y, bW2 - 1, Math.max(0, bH), 2);
						else ctx.rect(x, y, bW2 - 1, Math.max(0, bH));
						ctx.fill();
					});
					ctx.globalAlpha = 1;
				});
				// Labels X
				ctx.textAlign = "center";
				ctx.fillStyle = "#7B82A0";
				ctx.font = "10px monospace";
				series[0].labels.forEach((lbl, i) => {
					ctx.fillText(lbl, PAD.left + groupW * i + groupW / 2, PAD.top + cH + 16);
				});
				// Legenda
				let lx = PAD.left;
				ctx.font = "11px sans-serif";
				ctx.textAlign = "left";
				series.forEach((s) => {
					ctx.fillStyle = s.color;
					ctx.fillRect(lx, 8, 10, 10);
					ctx.fillStyle = "#7B82A0";
					ctx.fillText(s.label || "", lx + 14, 18);
					lx += ctx.measureText(s.label || "").width + 34;
				});
			} else {
				// Barras principais
				barSeries.forEach((s, si) => {
					s.data.forEach((v, i) => {
						const delay = i / nBars * .4;
						const lp = Math.max(0, Math.min(1, (ease - delay) / .6));
						const bH = v / maxV * cH * lp;
						const x = PAD.left + groupW * i + groupW / 2 + groupOffset + si * barW;
						const y = PAD.top + cH - bH;
						ctx.fillStyle = s.color + "CC";
						ctx.beginPath();
						if (ctx.roundRect) ctx.roundRect(x, y, barW - 1, Math.max(0, bH), 2);
						else ctx.rect(x, y, barW - 1, Math.max(0, bH));
						ctx.fill();
					});
				});
				// Linhas de comparação
				lineSeries.forEach((s) => {
					ctx.strokeStyle = s.color;
					ctx.lineWidth = 2;
					ctx.setLineDash([4, 3]);
					ctx.globalAlpha = .8 * ease;
					ctx.beginPath();
					s.data.forEach((v, i) => {
						const x = PAD.left + groupW * i + groupW / 2;
						const y = PAD.top + cH - v / maxV * cH;
						if (i === 0) ctx.moveTo(x, y);
						else ctx.lineTo(x, y);
					});
					ctx.stroke();
					ctx.setLineDash([]);
					ctx.globalAlpha = 1;
				});
				// Labels X
				ctx.textAlign = "center";
				ctx.fillStyle = "#7B82A0";
				ctx.font = "10px monospace";
				const skip = Math.ceil(nBars / 20);
				series[0].labels.forEach((lbl, i) => {
					if (i % skip !== 0 && i !== nBars - 1) return;
					ctx.fillText(lbl, PAD.left + groupW * i + groupW / 2, PAD.top + cH + 16);
				});
				// Legenda linhas
				if (lineSeries.length > 0) {
					let lx = PAD.left;
					ctx.font = "11px sans-serif";
					ctx.textAlign = "left";
					lineSeries.forEach((s) => {
						ctx.fillStyle = s.color;
						ctx.fillRect(lx, 8, 20, 3);
						ctx.fillStyle = "#7B82A0";
						ctx.fillText(s.label, lx + 24, 18);
						lx += ctx.measureText(s.label).width + 48;
					});
				}
			}
			if (progress < 1) animRef.current = requestAnimationFrame(draw);
		}
		animRef.current = requestAnimationFrame(draw);
		return () => cancelAnimationFrame(animRef.current);
	}, [
		historico,
		periodo,
		comparar,
		customAtivo,
		customLabel
	]);
	function toggleComparar(ano) {
		setComparar((prev) => prev.includes(ano) ? prev.filter((a) => a !== ano) : [...prev, ano]);
		setCustomAtivo(false);
	}
	function setPeriodoClick(p) {
		setPeriodo(p);
		setCustomAtivo(false);
		setComparar([]);
	}
	function aplicarCustom() {
		const labelA = `${MESES[customA.mesIni - 1]}/${customA.anoIni} > ${MESES[customA.mesFim - 1]}/${customA.anoFim}`;
		const labelB = `${MESES[customB.mesIni - 1]}/${customB.anoIni} > ${MESES[customB.mesFim - 1]}/${customB.anoFim}`;
		setCustomLabel(`A: ${labelA} | B: ${labelB}`);
		setCustomAtivo(true);
	}
	function limparCustom() {
		setCustomAtivo(false);
		setCustomLabel("");
	}
	const btnStyle = (ativo, color = "#4F8EF7", bg = "#1C2E52") => ({
		padding: "4px 10px",
		borderRadius: "5px",
		fontSize: "11px",
		fontWeight: 600,
		cursor: "pointer",
		border: `1px solid ${ativo ? color + "55" : "#252836"}`,
		background: ativo ? bg : "#1A1D2A",
		color: ativo ? color : "#7B82A0",
		fontFamily: "inherit"
	});
	const selectStyle = {
		padding: "3px 6px",
		background: "#13161F",
		border: "1px solid #252836",
		borderRadius: "4px",
		fontSize: "11px",
		color: "#E8EAF0",
		outline: "none",
		fontFamily: "inherit"
	};
	if (loading) return /* @__PURE__ */ _jsxDEV("div", {
		style: {
			padding: "40px",
			color: "#7B82A0"
		},
		children: "Carregando..."
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 321,
		columnNumber: 23
	}, this);
	return /* @__PURE__ */ _jsxDEV("div", { children: [
		/* @__PURE__ */ _jsxDEV("div", {
			style: {
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				marginBottom: "4px"
			},
			children: [/* @__PURE__ */ _jsxDEV("div", {
				style: {
					display: "flex",
					alignItems: "center",
					gap: "6px",
					fontSize: "11px",
					color: "#4A5070"
				},
				children: [
					/* @__PURE__ */ _jsxDEV("span", { children: "Dashboard" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 328,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ _jsxDEV("span", {
						style: { margin: "0 4px" },
						children: "›"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 329,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ _jsxDEV("span", {
						style: { color: "#7B82A0" },
						children: "Painel"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 330,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 327,
				columnNumber: 9
			}, this), /* @__PURE__ */ _jsxDEV("div", {
				style: {
					fontSize: "12px",
					color: "#7B82A0"
				},
				children: [
					[
						"Domingo",
						"Segunda-feira",
						"Terça-feira",
						"Quarta-feira",
						"Quinta-feira",
						"Sexta-feira",
						"Sábado"
					][now.getDay()],
					", ",
					now.getDate(),
					" de ",
					MESES_FULL[now.getMonth()],
					" de ",
					now.getFullYear()
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 332,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 326,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ _jsxDEV("div", {
			style: {
				fontSize: "11px",
				fontWeight: 600,
				textTransform: "uppercase",
				letterSpacing: "1.2px",
				color: "#4A5070",
				marginBottom: "10px",
				display: "flex",
				alignItems: "center",
				gap: "8px"
			},
			children: ["Faturamento — Comparativo por Período", /* @__PURE__ */ _jsxDEV("div", { style: {
				flex: 1,
				height: "1px",
				background: "#252836"
			} }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 342,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 340,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ _jsxDEV("div", {
			style: {
				background: "#13161F",
				border: "1px solid #252836",
				borderRadius: "14px",
				padding: "16px 16px 12px",
				marginBottom: "16px"
			},
			children: [/* @__PURE__ */ _jsxDEV("div", {
				style: {
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					flexWrap: "wrap",
					gap: "10px",
					marginBottom: "16px"
				},
				children: [
					/* @__PURE__ */ _jsxDEV("div", {
						style: {
							display: "flex",
							gap: "14px",
							fontSize: "11px"
						},
						children: [/* @__PURE__ */ _jsxDEV("span", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: "5px"
							},
							children: [/* @__PURE__ */ _jsxDEV("span", { style: {
								width: "10px",
								height: "10px",
								borderRadius: "2px",
								background: "#4F8EF7",
								opacity: .7,
								display: "inline-block"
							} }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 350,
								columnNumber: 15
							}, this), /* @__PURE__ */ _jsxDEV("span", {
								style: { color: "#7B82A0" },
								children: "Período atual (SIX+ENOVA)"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 351,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 349,
							columnNumber: 13
						}, this), /* @__PURE__ */ _jsxDEV("span", {
							style: {
								color: "#7B82A0",
								fontSize: "10px"
							},
							children: "· linhas = anos comparados"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 353,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 348,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "8px",
							flexWrap: "wrap"
						},
						children: [
							/* @__PURE__ */ _jsxDEV("span", {
								style: {
									fontSize: "10px",
									fontWeight: 600,
									textTransform: "uppercase",
									letterSpacing: "1px",
									color: "#4A5070"
								},
								children: "Período"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 356,
								columnNumber: 13
							}, this),
							[
								"6m",
								"12m",
								"24m",
								"tudo"
							].map((p) => /* @__PURE__ */ _jsxDEV("button", {
								onClick: () => setPeriodoClick(p),
								style: btnStyle(!customAtivo && periodo === p),
								children: p === "6m" ? "6 meses" : p === "12m" ? "12 meses" : p === "24m" ? "24 meses" : "Tudo"
							}, p, false, {
								fileName: _jsxFileName,
								lineNumber: 358,
								columnNumber: 15
							}, this)),
							/* @__PURE__ */ _jsxDEV("div", { style: {
								width: "1px",
								height: "20px",
								background: "#252836"
							} }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 362,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ _jsxDEV("span", {
								style: {
									fontSize: "10px",
									fontWeight: 600,
									textTransform: "uppercase",
									letterSpacing: "1px",
									color: "#4A5070"
								},
								children: "Comparar com"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 363,
								columnNumber: 13
							}, this),
							anosDisp.map((ano) => /* @__PURE__ */ _jsxDEV("button", {
								onClick: () => toggleComparar(ano),
								style: btnStyle(comparar.includes(ano), PAL[anosDisp.indexOf(ano) % PAL.length], PAL[anosDisp.indexOf(ano) % PAL.length] + "22"),
								children: ano
							}, ano, false, {
								fileName: _jsxFileName,
								lineNumber: 365,
								columnNumber: 15
							}, this))
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 355,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						style: {
							width: "100%",
							padding: "12px 16px",
							background: "#1A1D2A",
							border: "1px solid #252836",
							borderRadius: "8px"
						},
						children: [/* @__PURE__ */ _jsxDEV("div", {
							style: {
								fontSize: "10px",
								fontWeight: 600,
								textTransform: "uppercase",
								letterSpacing: "1px",
								color: "#4A5070",
								marginBottom: "10px"
							},
							children: "Comparativo personalizado"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 373,
							columnNumber: 13
						}, this), /* @__PURE__ */ _jsxDEV("div", {
							style: {
								display: "flex",
								flexDirection: "column",
								gap: "8px"
							},
							children: [
								/* @__PURE__ */ _jsxDEV("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "6px",
										flexWrap: "wrap"
									},
									children: /* @__PURE__ */ _jsxDEV("div", {
										style: {
											display: "flex",
											alignItems: "center",
											gap: "6px",
											padding: "6px 10px",
											background: "rgba(79,142,247,0.08)",
											border: "1px solid rgba(79,142,247,0.25)",
											borderRadius: "6px"
										},
										children: [
											/* @__PURE__ */ _jsxDEV("span", {
												style: {
													fontSize: "10px",
													fontWeight: 700,
													color: "#4F8EF7",
													minWidth: "14px"
												},
												children: "A"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 378,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("select", {
												style: selectStyle,
												value: customA.mesIni,
												onChange: (e) => setCustomA((p) => ({
													...p,
													mesIni: +e.target.value
												})),
												children: MESES.map((m, i) => /* @__PURE__ */ _jsxDEV("option", {
													value: i + 1,
													children: m
												}, i, false, {
													fileName: _jsxFileName,
													lineNumber: 380,
													columnNumber: 42
												}, this))
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 379,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("select", {
												style: selectStyle,
												value: customA.anoIni,
												onChange: (e) => setCustomA((p) => ({
													...p,
													anoIni: +e.target.value
												})),
												children: anosAsc.map((a) => /* @__PURE__ */ _jsxDEV("option", {
													value: a,
													children: a
												}, a, false, {
													fileName: _jsxFileName,
													lineNumber: 383,
													columnNumber: 39
												}, this))
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 382,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("span", {
												style: {
													fontSize: "10px",
													color: "#4A5070"
												},
												children: "até"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 385,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("select", {
												style: selectStyle,
												value: customA.mesFim,
												onChange: (e) => setCustomA((p) => ({
													...p,
													mesFim: +e.target.value
												})),
												children: MESES.map((m, i) => /* @__PURE__ */ _jsxDEV("option", {
													value: i + 1,
													children: m
												}, i, false, {
													fileName: _jsxFileName,
													lineNumber: 387,
													columnNumber: 42
												}, this))
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 386,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("select", {
												style: selectStyle,
												value: customA.anoFim,
												onChange: (e) => setCustomA((p) => ({
													...p,
													anoFim: +e.target.value
												})),
												children: anosAsc.map((a) => /* @__PURE__ */ _jsxDEV("option", {
													value: a,
													children: a
												}, a, false, {
													fileName: _jsxFileName,
													lineNumber: 390,
													columnNumber: 39
												}, this))
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 389,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 377,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 376,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "8px"
									},
									children: /* @__PURE__ */ _jsxDEV("span", {
										style: {
											fontSize: "10px",
											fontWeight: 600,
											color: "#4A5070",
											paddingLeft: "4px"
										},
										children: "comparado com"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 395,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 394,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "6px",
										flexWrap: "wrap"
									},
									children: /* @__PURE__ */ _jsxDEV("div", {
										style: {
											display: "flex",
											alignItems: "center",
											gap: "6px",
											padding: "6px 10px",
											background: "rgba(167,139,250,0.08)",
											border: "1px solid rgba(167,139,250,0.25)",
											borderRadius: "6px"
										},
										children: [
											/* @__PURE__ */ _jsxDEV("span", {
												style: {
													fontSize: "10px",
													fontWeight: 700,
													color: "#A78BFA",
													minWidth: "14px"
												},
												children: "B"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 400,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("select", {
												style: selectStyle,
												value: customB.mesIni,
												onChange: (e) => setCustomB((p) => ({
													...p,
													mesIni: +e.target.value
												})),
												children: MESES.map((m, i) => /* @__PURE__ */ _jsxDEV("option", {
													value: i + 1,
													children: m
												}, i, false, {
													fileName: _jsxFileName,
													lineNumber: 402,
													columnNumber: 42
												}, this))
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 401,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("select", {
												style: selectStyle,
												value: customB.anoIni,
												onChange: (e) => setCustomB((p) => ({
													...p,
													anoIni: +e.target.value
												})),
												children: anosAsc.map((a) => /* @__PURE__ */ _jsxDEV("option", {
													value: a,
													children: a
												}, a, false, {
													fileName: _jsxFileName,
													lineNumber: 405,
													columnNumber: 39
												}, this))
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 404,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("span", {
												style: {
													fontSize: "10px",
													color: "#4A5070"
												},
												children: "até"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 407,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("select", {
												style: selectStyle,
												value: customB.mesFim,
												onChange: (e) => setCustomB((p) => ({
													...p,
													mesFim: +e.target.value
												})),
												children: MESES.map((m, i) => /* @__PURE__ */ _jsxDEV("option", {
													value: i + 1,
													children: m
												}, i, false, {
													fileName: _jsxFileName,
													lineNumber: 409,
													columnNumber: 42
												}, this))
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 408,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("select", {
												style: selectStyle,
												value: customB.anoFim,
												onChange: (e) => setCustomB((p) => ({
													...p,
													anoFim: +e.target.value
												})),
												children: anosAsc.map((a) => /* @__PURE__ */ _jsxDEV("option", {
													value: a,
													children: a
												}, a, false, {
													fileName: _jsxFileName,
													lineNumber: 412,
													columnNumber: 39
												}, this))
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 411,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 399,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 398,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "8px"
									},
									children: /* @__PURE__ */ _jsxDEV("span", {
										style: {
											fontSize: "10px",
											fontWeight: 600,
											color: "#4A5070",
											paddingLeft: "4px"
										},
										children: "comparado com"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 417,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 416,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "6px",
										flexWrap: "wrap"
									},
									children: /* @__PURE__ */ _jsxDEV("div", {
										style: {
											display: "flex",
											alignItems: "center",
											gap: "6px",
											padding: "6px 10px",
											background: "rgba(251,191,36,0.08)",
											border: "1px solid rgba(251,191,36,0.25)",
											borderRadius: "6px"
										},
										children: [
											/* @__PURE__ */ _jsxDEV("span", {
												style: {
													fontSize: "10px",
													fontWeight: 700,
													color: "#FBBF24",
													minWidth: "14px"
												},
												children: "C"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 422,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("span", {
												style: {
													fontSize: "10px",
													color: "#4A5070",
													fontStyle: "italic"
												},
												children: "opcional —"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 423,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("select", {
												style: selectStyle,
												value: customC.mesIni,
												onChange: (e) => setCustomC((p) => ({
													...p,
													mesIni: e.target.value
												})),
												children: [/* @__PURE__ */ _jsxDEV("option", {
													value: "",
													children: "—"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 425,
													columnNumber: 21
												}, this), MESES.map((m, i) => /* @__PURE__ */ _jsxDEV("option", {
													value: i + 1,
													children: m
												}, i, false, {
													fileName: _jsxFileName,
													lineNumber: 426,
													columnNumber: 42
												}, this))]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 424,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("select", {
												style: selectStyle,
												value: customC.anoIni,
												onChange: (e) => setCustomC((p) => ({
													...p,
													anoIni: e.target.value
												})),
												children: [/* @__PURE__ */ _jsxDEV("option", {
													value: "",
													children: "—"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 429,
													columnNumber: 21
												}, this), anosAsc.map((a) => /* @__PURE__ */ _jsxDEV("option", {
													value: a,
													children: a
												}, a, false, {
													fileName: _jsxFileName,
													lineNumber: 430,
													columnNumber: 39
												}, this))]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 428,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("span", {
												style: {
													fontSize: "10px",
													color: "#4A5070"
												},
												children: "até"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 432,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("select", {
												style: selectStyle,
												value: customC.mesFim,
												onChange: (e) => setCustomC((p) => ({
													...p,
													mesFim: e.target.value
												})),
												children: [/* @__PURE__ */ _jsxDEV("option", {
													value: "",
													children: "—"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 434,
													columnNumber: 21
												}, this), MESES.map((m, i) => /* @__PURE__ */ _jsxDEV("option", {
													value: i + 1,
													children: m
												}, i, false, {
													fileName: _jsxFileName,
													lineNumber: 435,
													columnNumber: 42
												}, this))]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 433,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("select", {
												style: selectStyle,
												value: customC.anoFim,
												onChange: (e) => setCustomC((p) => ({
													...p,
													anoFim: e.target.value
												})),
												children: [/* @__PURE__ */ _jsxDEV("option", {
													value: "",
													children: "—"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 438,
													columnNumber: 21
												}, this), anosAsc.map((a) => /* @__PURE__ */ _jsxDEV("option", {
													value: a,
													children: a
												}, a, false, {
													fileName: _jsxFileName,
													lineNumber: 439,
													columnNumber: 39
												}, this))]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 437,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 421,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 420,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "8px",
										marginTop: "4px"
									},
									children: [
										/* @__PURE__ */ _jsxDEV("button", {
											onClick: aplicarCustom,
											style: {
												padding: "5px 16px",
												background: "#1C2E52",
												border: "1px solid rgba(79,142,247,0.3)",
												borderRadius: "5px",
												color: "#4F8EF7",
												fontSize: "11px",
												fontWeight: 600,
												cursor: "pointer",
												fontFamily: "inherit"
											},
											children: "Comparar"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 444,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ _jsxDEV("button", {
											onClick: limparCustom,
											style: {
												padding: "5px 10px",
												background: "#13161F",
												border: "1px solid #252836",
												borderRadius: "5px",
												color: "#7B82A0",
												fontSize: "11px",
												cursor: "pointer",
												fontFamily: "inherit"
											},
											children: "Limpar"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 445,
											columnNumber: 17
										}, this),
										customLabel && /* @__PURE__ */ _jsxDEV("span", {
											style: {
												fontSize: "10px",
												color: "#34D399"
											},
											children: customLabel
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 446,
											columnNumber: 33
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 443,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 374,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 372,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 347,
				columnNumber: 9
			}, this), /* @__PURE__ */ _jsxDEV("div", {
				style: {
					position: "relative",
					width: "100%",
					height: "460px"
				},
				children: /* @__PURE__ */ _jsxDEV("canvas", {
					ref: canvasRef,
					style: {
						width: "100%",
						height: "100%",
						display: "block"
					}
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 454,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 453,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 345,
			columnNumber: 7
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 324,
		columnNumber: 5
	}, this);
}
_s2(Dashboard, "aRq2/gMIFkXq47COe9u2Kp30SNo=");
_c2 = Dashboard;
_s(Dashboard, "czzIh1AF6g26MJa/tJDrEOJdErU=");
_c = Dashboard;
var _c;
$RefreshReg$(_c, "Dashboard");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/pages/Dashboard/index.tsx?t=1773753050501";
if (import.meta.hot && !inWebWorker) {
	if (!window.$RefreshReg$) {
		throw new Error("@vitejs/plugin-react can't detect preamble. Something is wrong.");
	}
	const currentExports = __vite_react_currentExports;
	queueMicrotask(() => {
		RefreshRuntime.registerExportsForReactRefresh("C:/projetos/controle-fiscal/frontend/src/pages/Dashboard/index.tsx", currentExports);
		import.meta.hot.accept((nextExports) => {
			if (!nextExports) return;
			const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/projetos/controle-fiscal/frontend/src/pages/Dashboard/index.tsx", currentExports, nextExports);
			if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
		});
	});
}
function $RefreshReg$(type, id) {
	return RefreshRuntime.register(type, "C:/projetos/controle-fiscal/frontend/src/pages/Dashboard/index.tsx" + " " + id);
}
function $RefreshSig$() {
	return RefreshRuntime.createSignatureFunctionForTransform();
}
var _c2;
$RefreshReg$(_c2, "Dashboard");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
import * as __vite_react_currentExports from "/src/pages/Dashboard/index.jsx";
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }

  const currentExports = __vite_react_currentExports;
  queueMicrotask(() => {
    RefreshRuntime.registerExportsForReactRefresh("C:/projetos/controle-fiscal/frontend/src/pages/Dashboard/index.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/projetos/controle-fiscal/frontend/src/pages/Dashboard/index.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) { return RefreshRuntime.register(type, "C:/projetos/controle-fiscal/frontend/src/pages/Dashboard/index.jsx" + ' ' + id); }
function $RefreshSig$() { return RefreshRuntime.createSignatureFunctionForTransform(); }

//# sourceMappingURL=data:application/json;base64,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S0FBUztjQUNsRSx3QkFBQyxVQUFEO0tBQVEsS0FBSztLQUFXLE9BQU87TUFBRSxPQUFPO01BQVEsUUFBUTtNQUFRLFNBQVM7TUFBUztLQUFJOzs7OztJQUNsRjs7OztZQUNGOzs7Ozs7RUFDRjs7Ozs7Ozs7NkNBRVQiLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VzIjpbImluZGV4LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IGhpc3Rvcmljb0FQSSwgZGFzQVBJLCBlbXByZXNhc0FQSSB9IGZyb20gJy4uLy4uL2FwaS9lbmRwb2ludHMnXG5cbmludGVyZmFjZSBIaXN0b3JpY29JdGVtIHsgaWQ6IG51bWJlcjsgZW1wcmVzYV9pZDogbnVtYmVyOyBhbm86IG51bWJlcjsgbWVzOiBudW1iZXI7IHZhbG9yOiBudW1iZXIgfVxuaW50ZXJmYWNlIERhc0l0ZW0geyBpZDogbnVtYmVyOyBlbXByZXNhX2lkOiBudW1iZXI7IGFubzogbnVtYmVyOyBtZXM6IG51bWJlcjsgdmFsb3I6IG51bWJlciB9XG5cbmNvbnN0IE1FU0VTID0gWydKYW4nLCdGZXYnLCdNYXInLCdBYnInLCdNYWknLCdKdW4nLCdKdWwnLCdBZ28nLCdTZXQnLCdPdXQnLCdOb3YnLCdEZXonXVxuY29uc3QgTUVTRVNfRlVMTCA9IFsnSmFuZWlybycsJ0ZldmVyZWlybycsJ01hcsOnbycsJ0FicmlsJywnTWFpbycsJ0p1bmhvJywnSnVsaG8nLCdBZ29zdG8nLCdTZXRlbWJybycsJ091dHVicm8nLCdOb3ZlbWJybycsJ0RlemVtYnJvJ11cbmNvbnN0IFBBTCA9IFsnIzRGOEVGNycsJyNBNzhCRkEnLCcjRkJCRjI0JywnIzM0RDM5OScsJyNGQjkyM0MnLCcjRjg3MTcxJ11cblxuZnVuY3Rpb24gZm10Syh2OiBudW1iZXIpIHtcbiAgaWYgKHYgPj0gMTAwMDAwMCkgcmV0dXJuICdSJCcgKyAodiAvIDEwMDAwMDApLnRvRml4ZWQoMSkgKyAnTSdcbiAgaWYgKHYgPj0gMTAwMCkgcmV0dXJuICdSJCcgKyAodiAvIDEwMDApLnRvRml4ZWQoMCkgKyAnSydcbiAgcmV0dXJuICdSJCcgKyB2LnRvRml4ZWQoMClcbn1cbmZ1bmN0aW9uIGZtdFIodjogbnVtYmVyKSB7XG4gIHJldHVybiAnUiQgJyArIHYudG9Mb2NhbGVTdHJpbmcoJ3B0LUJSJywgeyBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDIgfSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRGFzaGJvYXJkKCkge1xuICBjb25zdCBjYW52YXNSZWYgPSB1c2VSZWY8SFRNTENhbnZhc0VsZW1lbnQ+KG51bGwpXG4gIGNvbnN0IGFuaW1SZWYgPSB1c2VSZWY8bnVtYmVyPigwKVxuXG4gIGNvbnN0IFtoaXN0b3JpY28sIHNldEhpc3Rvcmljb10gPSB1c2VTdGF0ZTxIaXN0b3JpY29JdGVtW10+KFtdKVxuICBjb25zdCBbZGFzLCBzZXREYXNdID0gdXNlU3RhdGU8RGFzSXRlbVtdPihbXSlcbiAgY29uc3QgW2VtcHJlc2FzLCBzZXRFbXByZXNhc10gPSB1c2VTdGF0ZTxhbnlbXT4oW10pXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpXG5cbiAgY29uc3QgW3BlcmlvZG8sIHNldFBlcmlvZG9dID0gdXNlU3RhdGU8JzZtJyB8ICcxMm0nIHwgJzI0bScgfCAndHVkbyc+KCcxMm0nKVxuICBjb25zdCBbY29tcGFyYXIsIHNldENvbXBhcmFyXSA9IHVzZVN0YXRlPG51bWJlcltdPihbXSlcbiAgY29uc3QgW2N1c3RvbUEsIHNldEN1c3RvbUFdID0gdXNlU3RhdGUoeyBtZXNJbmk6IDEsIGFub0luaTogMjAyNSwgbWVzRmltOiAxMiwgYW5vRmltOiAyMDI1IH0pXG4gIGNvbnN0IFtjdXN0b21CLCBzZXRDdXN0b21CXSA9IHVzZVN0YXRlKHsgbWVzSW5pOiAxLCBhbm9Jbmk6IDIwMjQsIG1lc0ZpbTogMTIsIGFub0ZpbTogMjAyNCB9KVxuICBjb25zdCBbY3VzdG9tQywgc2V0Q3VzdG9tQ10gPSB1c2VTdGF0ZSh7IG1lc0luaTogJycsIGFub0luaTogJycsIG1lc0ZpbTogJycsIGFub0ZpbTogJycgfSlcbiAgY29uc3QgW2N1c3RvbUF0aXZvLCBzZXRDdXN0b21BdGl2b10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2N1c3RvbUxhYmVsLCBzZXRDdXN0b21MYWJlbF0gPSB1c2VTdGF0ZSgnJylcblxuICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpXG4gIGNvbnN0IG1lc0FudElkeCA9IG5vdy5nZXRNb250aCgpID09PSAwID8gMTEgOiBub3cuZ2V0TW9udGgoKSAtIDFcbiAgY29uc3QgYW5vQW50ID0gbm93LmdldE1vbnRoKCkgPT09IDAgPyBub3cuZ2V0RnVsbFllYXIoKSAtIDEgOiBub3cuZ2V0RnVsbFllYXIoKVxuICBjb25zdCBhbm9BdHVhbCA9IG5vdy5nZXRGdWxsWWVhcigpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBQcm9taXNlLmFsbChbXG4gICAgICBoaXN0b3JpY29BUEkubGlzdGFyKDEpLnRoZW4ociA9PiByLmRhdGEpLFxuICAgICAgaGlzdG9yaWNvQVBJLmxpc3RhcigyKS50aGVuKHIgPT4gci5kYXRhKSxcbiAgICAgIGRhc0FQSS5saXN0YXIoMSkudGhlbihyID0+IHIuZGF0YSksXG4gICAgICBkYXNBUEkubGlzdGFyKDIpLnRoZW4ociA9PiByLmRhdGEpLFxuICAgICAgZW1wcmVzYXNBUEkubGlzdGFyKCkudGhlbihyID0+IHIuZGF0YSksXG4gICAgXSkudGhlbigoW2gxLCBoMiwgZDEsIGQyLCBlbXBdKSA9PiB7XG4gICAgICBzZXRIaXN0b3JpY28oWy4uLmgxLCAuLi5oMl0pXG4gICAgICBzZXREYXMoWy4uLmQxLCAuLi5kMl0pXG4gICAgICBzZXRFbXByZXNhcyhlbXApXG4gICAgfSkuY2F0Y2goKCkgPT4ge30pLmZpbmFsbHkoKCkgPT4gc2V0TG9hZGluZyhmYWxzZSkpXG4gIH0sIFtdKVxuXG4gIC8vIENhbGN1bGFyIEtQSXNcbiAgY29uc3QgaGlzdFNpeCA9IGhpc3Rvcmljby5maWx0ZXIociA9PiByLmVtcHJlc2FfaWQgPT09IDEpXG4gIGNvbnN0IGhpc3RFbm92YSA9IGhpc3Rvcmljby5maWx0ZXIociA9PiByLmVtcHJlc2FfaWQgPT09IDIpXG4gIGNvbnN0IGVtcFNpeCA9IGVtcHJlc2FzLmZpbmQoZSA9PiBlLm5vbWUgPT09ICdTSVgnKSB8fCB7IGFsaXF1b3RhX2RhczogMC4wODgzMjQgfVxuICBjb25zdCBlbXBFbm92YSA9IGVtcHJlc2FzLmZpbmQoZSA9PiBlLm5vbWUgPT09ICdFTk9WQScpIHx8IHsgYWxpcXVvdGFfZGFzOiAwLjA5MzI1NCB9XG5cbiAgY29uc3QgdlNpeE1lcyA9IGhpc3RTaXguZmluZChyID0+IHIuYW5vID09PSBhbm9BbnQgJiYgci5tZXMgPT09IG1lc0FudElkeCArIDEpPy52YWxvciB8fCAwXG4gIGNvbnN0IHZFbm92YU1lcyA9IGhpc3RFbm92YS5maW5kKHIgPT4gci5hbm8gPT09IGFub0FudCAmJiByLm1lcyA9PT0gbWVzQW50SWR4ICsgMSk/LnZhbG9yIHx8IDBcbiAgY29uc3QgdG90YWxNZXMgPSB2U2l4TWVzICsgdkVub3ZhTWVzXG4gIGNvbnN0IHZTaXhBbm8gPSBoaXN0U2l4LmZpbHRlcihyID0+IHIuYW5vID09PSBhbm9BdHVhbCkucmVkdWNlKChzLCByKSA9PiBzICsgci52YWxvciwgMClcbiAgY29uc3QgdkVub3ZhQW5vID0gaGlzdEVub3ZhLmZpbHRlcihyID0+IHIuYW5vID09PSBhbm9BdHVhbCkucmVkdWNlKChzLCByKSA9PiBzICsgci52YWxvciwgMClcbiAgY29uc3QgdG90YWxBbm8gPSB2U2l4QW5vICsgdkVub3ZhQW5vXG4gIGNvbnN0IGltcFRvdGFsID0gdlNpeE1lcyAqIGVtcFNpeC5hbGlxdW90YV9kYXMgKyB2RW5vdmFNZXMgKiBlbXBFbm92YS5hbGlxdW90YV9kYXNcblxuICAvLyBQcmVwYXJhciBhbm9zIGRpc3BvbsOtdmVpc1xuICBjb25zdCBhbm9zRGlzcCA9IFsuLi5uZXcgU2V0KGhpc3Rvcmljby5tYXAociA9PiByLmFubykpXS5zb3J0KChhLCBiKSA9PiBiIC0gYSlcbiAgY29uc3QgYW5vc0FzYyA9IFsuLi5hbm9zRGlzcF0uc29ydCgoYSwgYikgPT4gYSAtIGIpXG5cbiAgLy8gUHJlcGFyYXIgZGFkb3MgZG8gZ3LDoWZpY29cbiAgZnVuY3Rpb24gZ2V0VG90YWwoYW5vOiBudW1iZXIsIG1lczogbnVtYmVyKSB7XG4gICAgY29uc3QgcyA9IGhpc3RTaXguZmluZChyID0+IHIuYW5vID09PSBhbm8gJiYgci5tZXMgPT09IG1lcyk/LnZhbG9yIHx8IDBcbiAgICBjb25zdCBlID0gaGlzdEVub3ZhLmZpbmQociA9PiByLmFubyA9PT0gYW5vICYmIHIubWVzID09PSBtZXMpPy52YWxvciB8fCAwXG4gICAgcmV0dXJuIHMgKyBlXG4gIH1cblxuICBmdW5jdGlvbiBnZXRQZXJpb2RvcygpIHtcbiAgICBjb25zdCBjdXRvZmYgPSBuZXcgRGF0ZShub3cuZ2V0RnVsbFllYXIoKSwgbm93LmdldE1vbnRoKCkgLSAocGVyaW9kbyA9PT0gJzZtJyA/IDYgOiBwZXJpb2RvID09PSAnMTJtJyA/IDEyIDogcGVyaW9kbyA9PT0gJzI0bScgPyAyNCA6IDEyMCksIDEpXG4gICAgY29uc3QgcmVzID0gW11cbiAgICBmb3IgKGxldCBhbm8gb2YgYW5vc0FzYykge1xuICAgICAgZm9yIChsZXQgbWVzID0gMTsgbWVzIDw9IDEyOyBtZXMrKykge1xuICAgICAgICBjb25zdCBkID0gbmV3IERhdGUoYW5vLCBtZXMgLSAxLCAxKVxuICAgICAgICBpZiAoZCA+PSBjdXRvZmYgJiYgZCA8PSBub3cpIHtcbiAgICAgICAgICBpZiAoaGlzdG9yaWNvLnNvbWUociA9PiByLmFubyA9PT0gYW5vICYmIHIubWVzID09PSBtZXMpKSB7XG4gICAgICAgICAgICByZXMucHVzaCh7IGFubywgbWVzLCBsYWJlbDogTUVTRVNbbWVzIC0gMV0gKyAnLycgKyBTdHJpbmcoYW5vKS5zbGljZSgyKSB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzXG4gIH1cblxuICBmdW5jdGlvbiBnZXRSYW5nZU1vbnRocyhtZXNJbmk6IG51bWJlciwgYW5vSW5pOiBudW1iZXIsIG1lc0ZpbTogbnVtYmVyLCBhbm9GaW06IG51bWJlcikge1xuICAgIGNvbnN0IHJlcyA9IFtdXG4gICAgZm9yIChsZXQgYW5vID0gYW5vSW5pOyBhbm8gPD0gYW5vRmltOyBhbm8rKykge1xuICAgICAgY29uc3QgbVN0YXJ0ID0gYW5vID09PSBhbm9JbmkgPyBtZXNJbmkgOiAxXG4gICAgICBjb25zdCBtRW5kID0gYW5vID09PSBhbm9GaW0gPyBtZXNGaW0gOiAxMlxuICAgICAgZm9yIChsZXQgbWVzID0gbVN0YXJ0OyBtZXMgPD0gbUVuZDsgbWVzKyspIHtcbiAgICAgICAgcmVzLnB1c2goeyBhbm8sIG1lcywgbGFiZWw6IE1FU0VTW21lcyAtIDFdICsgJy8nICsgU3RyaW5nKGFubykuc2xpY2UoMikgfSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc1xuICB9XG5cbiAgLy8gRGVzZW5oYXIgZ3LDoWZpY28gbm8gY2FudmFzXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgY2FudmFzID0gY2FudmFzUmVmLmN1cnJlbnRcbiAgICBpZiAoIWNhbnZhcyB8fCBsb2FkaW5nKSByZXR1cm5cbiAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuICAgIGlmICghY3R4KSByZXR1cm5cblxuICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKGFuaW1SZWYuY3VycmVudClcblxuICAgIGNvbnN0IFBBRCA9IHsgdG9wOiAyOCwgcmlnaHQ6IDE2LCBib3R0b206IDI4LCBsZWZ0OiA1MiB9XG4gICAgY29uc3QgVyA9IGNhbnZhcy5vZmZzZXRXaWR0aFxuICAgIGNvbnN0IEggPSBjYW52YXMub2Zmc2V0SGVpZ2h0XG4gICAgY2FudmFzLndpZHRoID0gV1xuICAgIGNhbnZhcy5oZWlnaHQgPSBIXG4gICAgY29uc3QgY1cgPSBXIC0gUEFELmxlZnQgLSBQQUQucmlnaHRcbiAgICBjb25zdCBjSCA9IEggLSBQQUQudG9wIC0gUEFELmJvdHRvbVxuXG4gICAgbGV0IHNlcmllczogeyBsYWJlbDogc3RyaW5nOyBjb2xvcjogc3RyaW5nOyBkYXRhOiBudW1iZXJbXTsgbGFiZWxzOiBzdHJpbmdbXSB9W10gPSBbXVxuXG4gICAgaWYgKGN1c3RvbUF0aXZvKSB7XG4gICAgICBjb25zdCBwQSA9IGdldFJhbmdlTW9udGhzKGN1c3RvbUEubWVzSW5pLCBjdXN0b21BLmFub0luaSwgY3VzdG9tQS5tZXNGaW0sIGN1c3RvbUEuYW5vRmltKVxuICAgICAgY29uc3QgcEIgPSBnZXRSYW5nZU1vbnRocyhjdXN0b21CLm1lc0luaSwgY3VzdG9tQi5hbm9JbmksIGN1c3RvbUIubWVzRmltLCBjdXN0b21CLmFub0ZpbSlcbiAgICAgIGNvbnN0IG1heExlbiA9IE1hdGgubWF4KHBBLmxlbmd0aCwgcEIubGVuZ3RoKVxuICAgICAgY29uc3QgcG9zID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogbWF4TGVuIH0sIChfLCBpKSA9PiBpKS5maWx0ZXIoaSA9PiB7XG4gICAgICAgIGNvbnN0IHZBID0gcEFbaV0gPyBnZXRUb3RhbChwQVtpXS5hbm8sIHBBW2ldLm1lcykgOiAwXG4gICAgICAgIGNvbnN0IHZCID0gcEJbaV0gPyBnZXRUb3RhbChwQltpXS5hbm8sIHBCW2ldLm1lcykgOiAwXG4gICAgICAgIHJldHVybiB2QSA+IDAgfHwgdkIgPiAwXG4gICAgICB9KVxuICAgICAgc2VyaWVzID0gW1xuICAgICAgICB7IGxhYmVsOiAnQTogJyArIGN1c3RvbUxhYmVsLnNwbGl0KCcgfCAnKVswXT8ucmVwbGFjZSgnQTogJywgJycpLCBjb2xvcjogJyM0RjhFRjcnLCBkYXRhOiBwb3MubWFwKGkgPT4gcEFbaV0gPyBnZXRUb3RhbChwQVtpXS5hbm8sIHBBW2ldLm1lcykgOiAwKSwgbGFiZWxzOiBwb3MubWFwKGkgPT4gcEFbaV0/LmxhYmVsIHx8ICcnKSB9LFxuICAgICAgICB7IGxhYmVsOiAnQjogJyArIGN1c3RvbUxhYmVsLnNwbGl0KCcgfCAnKVsxXT8ucmVwbGFjZSgnQjogJywgJycpLCBjb2xvcjogJyNBNzhCRkEnLCBkYXRhOiBwb3MubWFwKGkgPT4gcEJbaV0gPyBnZXRUb3RhbChwQltpXS5hbm8sIHBCW2ldLm1lcykgOiAwKSwgbGFiZWxzOiBwb3MubWFwKGkgPT4gcEJbaV0/LmxhYmVsIHx8ICcnKSB9LFxuICAgICAgXVxuICAgICAgaWYgKGN1c3RvbUMuYW5vSW5pICYmIGN1c3RvbUMuYW5vRmltKSB7XG4gICAgICAgIGNvbnN0IHBDID0gZ2V0UmFuZ2VNb250aHMocGFyc2VJbnQoY3VzdG9tQy5tZXNJbmkpLCBwYXJzZUludChjdXN0b21DLmFub0luaSksIHBhcnNlSW50KGN1c3RvbUMubWVzRmltKSwgcGFyc2VJbnQoY3VzdG9tQy5hbm9GaW0pKVxuICAgICAgICBjb25zdCBwb3NDID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogTWF0aC5tYXgobWF4TGVuLCBwQy5sZW5ndGgpIH0sIChfLCBpKSA9PiBpKS5maWx0ZXIoaSA9PiBwQ1tpXSA/IGdldFRvdGFsKHBDW2ldLmFubywgcENbaV0ubWVzKSA+IDAgOiBmYWxzZSlcbiAgICAgICAgc2VyaWVzLnB1c2goeyBsYWJlbDogJ0MnLCBjb2xvcjogJyNGQkJGMjQnLCBkYXRhOiBwb3NDLm1hcChpID0+IHBDW2ldID8gZ2V0VG90YWwocENbaV0uYW5vLCBwQ1tpXS5tZXMpIDogMCksIGxhYmVsczogcG9zQy5tYXAoaSA9PiBwQ1tpXT8ubGFiZWwgfHwgJycpIH0pXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHBlcmlvZHMgPSBnZXRQZXJpb2RvcygpXG4gICAgICBjb25zdCBtYWluRGF0YSA9IHBlcmlvZHMubWFwKHAgPT4gZ2V0VG90YWwocC5hbm8sIHAubWVzKSlcbiAgICAgIHNlcmllcyA9IFt7IGxhYmVsOiAnU0lYK0VOT1ZBJywgY29sb3I6ICcjNEY4RUY3JywgZGF0YTogbWFpbkRhdGEsIGxhYmVsczogcGVyaW9kcy5tYXAocCA9PiBwLmxhYmVsKSB9XVxuICAgICAgY29tcGFyYXIuZm9yRWFjaCgoeXIsIGNpKSA9PiB7XG4gICAgICAgIHNlcmllcy5wdXNoKHsgbGFiZWw6IFN0cmluZyh5ciksIGNvbG9yOiBQQUxbKGNpICsgMSkgJSBQQUwubGVuZ3RoXSwgZGF0YTogcGVyaW9kcy5tYXAocCA9PiBnZXRUb3RhbCh5ciwgcC5tZXMpKSwgbGFiZWxzOiBwZXJpb2RzLm1hcChwID0+IHAubGFiZWwpIH0pXG4gICAgICB9KVxuICAgIH1cblxuICAgIGNvbnN0IG5CYXJzID0gc2VyaWVzWzBdPy5kYXRhLmxlbmd0aCB8fCAwXG4gICAgaWYgKCFuQmFycykgcmV0dXJuXG5cbiAgICBjb25zdCBhbGxWYWxzID0gc2VyaWVzLmZsYXRNYXAocyA9PiBzLmRhdGEpXG4gICAgY29uc3QgbWF4ViA9IE1hdGgubWF4KC4uLmFsbFZhbHMsIDEpXG4gICAgY29uc3QgZ3JpZFN0ZXBzID0gOFxuICAgIGNvbnN0IGdyb3VwVyA9IGNXIC8gbkJhcnNcbiAgICBjb25zdCBiYXJTZXJpZXMgPSBzZXJpZXMuZmlsdGVyKChfLCBpKSA9PiBpID09PSAwKVxuICAgIGNvbnN0IGxpbmVTZXJpZXMgPSBzZXJpZXMuZmlsdGVyKChfLCBpKSA9PiBpID4gMClcbiAgICBjb25zdCBiYXJXID0gTWF0aC5tYXgoNCwgTWF0aC5taW4oMjgsIChncm91cFcgKiAwLjgpIC8gTWF0aC5tYXgoYmFyU2VyaWVzLmxlbmd0aCwgMSkpKVxuICAgIGNvbnN0IGdyb3VwT2Zmc2V0ID0gLShiYXJTZXJpZXMubGVuZ3RoIC0gMSkgKiBiYXJXIC8gMlxuXG4gICAgZnVuY3Rpb24gZm10SzIodjogbnVtYmVyKSB7XG4gICAgICBpZiAodiA+PSAxMDAwMDAwKSByZXR1cm4gJ1IkJyArICh2IC8gMTAwMDAwMCkudG9GaXhlZCgxKSArICdNJ1xuICAgICAgaWYgKHYgPj0gMTAwMCkgcmV0dXJuICdSJCcgKyAodiAvIDEwMDApLnRvRml4ZWQoMCkgKyAnSydcbiAgICAgIHJldHVybiAnUiQnICsgdi50b0ZpeGVkKDApXG4gICAgfVxuXG4gICAgbGV0IHByb2dyZXNzID0gMFxuICAgIGNvbnN0IHN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICBjb25zdCBkdXIgPSA4MDBcblxuICAgIGZ1bmN0aW9uIGRyYXcodHM6IG51bWJlcikge1xuICAgICAgcHJvZ3Jlc3MgPSBNYXRoLm1pbigxLCAodHMgLSBzdGFydCkgLyBkdXIpXG4gICAgICBjb25zdCBlYXNlID0gMSAtIE1hdGgucG93KDEgLSBwcm9ncmVzcywgMylcblxuICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBXLCBIKVxuXG4gICAgICAvLyBHcmlkXG4gICAgICBjdHguZm9udCA9ICcxMXB4IG1vbm9zcGFjZSdcbiAgICAgIGN0eC50ZXh0QWxpZ24gPSAncmlnaHQnXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBncmlkU3RlcHM7IGkrKykge1xuICAgICAgICBjb25zdCB2ID0gbWF4ViAqIGkgLyBncmlkU3RlcHNcbiAgICAgICAgY29uc3QgeSA9IFBBRC50b3AgKyBjSCAtIChjSCAqIGkgLyBncmlkU3RlcHMpXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGkgPT09IDAgPyAncmdiYSgyNTUsMjU1LDI1NSwwLjIpJyA6ICdyZ2JhKDI1NSwyNTUsMjU1LDAuMDcpJ1xuICAgICAgICBjdHgubGluZVdpZHRoID0gMVxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7IGN0eC5tb3ZlVG8oUEFELmxlZnQsIHkpOyBjdHgubGluZVRvKFBBRC5sZWZ0ICsgY1csIHkpOyBjdHguc3Ryb2tlKClcbiAgICAgICAgaWYgKGkgPiAwKSB7IGN0eC5maWxsU3R5bGUgPSAnIzdCODJBMCc7IGN0eC5maWxsVGV4dChmbXRLMih2KSwgUEFELmxlZnQgLSA0LCB5ICsgNCkgfVxuICAgICAgfVxuXG4gICAgICAvLyBCYXJyYXMgYW5pbWFkYXNcbiAgICAgIGlmIChjdXN0b21BdGl2bykge1xuICAgICAgICBjb25zdCBuUyA9IHNlcmllcy5sZW5ndGhcbiAgICAgICAgY29uc3QgYlcyID0gTWF0aC5tYXgoNCwgTWF0aC5taW4oMjIsIChncm91cFcgKiAwLjg1KSAvIG5TKSlcbiAgICAgICAgY29uc3QgZ09mZiA9IC0oblMgLSAxKSAqIGJXMiAvIDJcbiAgICAgICAgc2VyaWVzLmZvckVhY2goKHMsIHNpKSA9PiB7XG4gICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHMuY29sb3JcbiAgICAgICAgICBzLmRhdGEuZm9yRWFjaCgodiwgaSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGVsYXkgPSBpIC8gbkJhcnMgKiAwLjVcbiAgICAgICAgICAgIGNvbnN0IGxwID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgKGVhc2UgLSBkZWxheSkgLyAoMSAtIDAuNSkpKVxuICAgICAgICAgICAgY29uc3QgYkggPSB2IC8gbWF4ViAqIGNIICogbHBcbiAgICAgICAgICAgIGNvbnN0IHggPSBQQUQubGVmdCArIGdyb3VwVyAqIGkgKyBncm91cFcgLyAyICsgZ09mZiArIHNpICogYlcyXG4gICAgICAgICAgICBjb25zdCB5ID0gUEFELnRvcCArIGNIIC0gYkhcbiAgICAgICAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IDAuODVcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKVxuICAgICAgICAgICAgaWYgKGN0eC5yb3VuZFJlY3QpIGN0eC5yb3VuZFJlY3QoeCwgeSwgYlcyIC0gMSwgTWF0aC5tYXgoMCwgYkgpLCAyKVxuICAgICAgICAgICAgZWxzZSBjdHgucmVjdCh4LCB5LCBiVzIgLSAxLCBNYXRoLm1heCgwLCBiSCkpXG4gICAgICAgICAgICBjdHguZmlsbCgpXG4gICAgICAgICAgfSlcbiAgICAgICAgICBjdHguZ2xvYmFsQWxwaGEgPSAxXG4gICAgICAgIH0pXG4gICAgICAgIC8vIExhYmVscyBYXG4gICAgICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJzsgY3R4LmZpbGxTdHlsZSA9ICcjN0I4MkEwJzsgY3R4LmZvbnQgPSAnMTBweCBtb25vc3BhY2UnXG4gICAgICAgIHNlcmllc1swXS5sYWJlbHMuZm9yRWFjaCgobGJsLCBpKSA9PiB7XG4gICAgICAgICAgY3R4LmZpbGxUZXh0KGxibCwgUEFELmxlZnQgKyBncm91cFcgKiBpICsgZ3JvdXBXIC8gMiwgUEFELnRvcCArIGNIICsgMTYpXG4gICAgICAgIH0pXG4gICAgICAgIC8vIExlZ2VuZGFcbiAgICAgICAgbGV0IGx4ID0gUEFELmxlZnQ7IGN0eC5mb250ID0gJzExcHggc2Fucy1zZXJpZic7IGN0eC50ZXh0QWxpZ24gPSAnbGVmdCdcbiAgICAgICAgc2VyaWVzLmZvckVhY2goKHMpID0+IHtcbiAgICAgICAgICBjdHguZmlsbFN0eWxlID0gcy5jb2xvcjsgY3R4LmZpbGxSZWN0KGx4LCA4LCAxMCwgMTApXG4gICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjN0I4MkEwJzsgY3R4LmZpbGxUZXh0KHMubGFiZWwgfHwgJycsIGx4ICsgMTQsIDE4KVxuICAgICAgICAgIGx4ICs9IGN0eC5tZWFzdXJlVGV4dChzLmxhYmVsIHx8ICcnKS53aWR0aCArIDM0XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBCYXJyYXMgcHJpbmNpcGFpc1xuICAgICAgICBiYXJTZXJpZXMuZm9yRWFjaCgocywgc2kpID0+IHtcbiAgICAgICAgICBzLmRhdGEuZm9yRWFjaCgodiwgaSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGVsYXkgPSBpIC8gbkJhcnMgKiAwLjRcbiAgICAgICAgICAgIGNvbnN0IGxwID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgKGVhc2UgLSBkZWxheSkgLyAwLjYpKVxuICAgICAgICAgICAgY29uc3QgYkggPSB2IC8gbWF4ViAqIGNIICogbHBcbiAgICAgICAgICAgIGNvbnN0IHggPSBQQUQubGVmdCArIGdyb3VwVyAqIGkgKyBncm91cFcgLyAyICsgZ3JvdXBPZmZzZXQgKyBzaSAqIGJhcldcbiAgICAgICAgICAgIGNvbnN0IHkgPSBQQUQudG9wICsgY0ggLSBiSFxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHMuY29sb3IgKyAnQ0MnXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKClcbiAgICAgICAgICAgIGlmIChjdHgucm91bmRSZWN0KSBjdHgucm91bmRSZWN0KHgsIHksIGJhclcgLSAxLCBNYXRoLm1heCgwLCBiSCksIDIpXG4gICAgICAgICAgICBlbHNlIGN0eC5yZWN0KHgsIHksIGJhclcgLSAxLCBNYXRoLm1heCgwLCBiSCkpXG4gICAgICAgICAgICBjdHguZmlsbCgpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgICAgLy8gTGluaGFzIGRlIGNvbXBhcmHDp8Ojb1xuICAgICAgICBsaW5lU2VyaWVzLmZvckVhY2goKHMpID0+IHtcbiAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBzLmNvbG9yXG4gICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDJcbiAgICAgICAgICBjdHguc2V0TGluZURhc2goWzQsIDNdKVxuICAgICAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IDAuOCAqIGVhc2VcbiAgICAgICAgICBjdHguYmVnaW5QYXRoKClcbiAgICAgICAgICBzLmRhdGEuZm9yRWFjaCgodiwgaSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeCA9IFBBRC5sZWZ0ICsgZ3JvdXBXICogaSArIGdyb3VwVyAvIDJcbiAgICAgICAgICAgIGNvbnN0IHkgPSBQQUQudG9wICsgY0ggLSAodiAvIG1heFYgKiBjSClcbiAgICAgICAgICAgIGlmIChpID09PSAwKSBjdHgubW92ZVRvKHgsIHkpOyBlbHNlIGN0eC5saW5lVG8oeCwgeSlcbiAgICAgICAgICB9KVxuICAgICAgICAgIGN0eC5zdHJva2UoKVxuICAgICAgICAgIGN0eC5zZXRMaW5lRGFzaChbXSlcbiAgICAgICAgICBjdHguZ2xvYmFsQWxwaGEgPSAxXG4gICAgICAgIH0pXG4gICAgICAgIC8vIExhYmVscyBYXG4gICAgICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJzsgY3R4LmZpbGxTdHlsZSA9ICcjN0I4MkEwJzsgY3R4LmZvbnQgPSAnMTBweCBtb25vc3BhY2UnXG4gICAgICAgIGNvbnN0IHNraXAgPSBNYXRoLmNlaWwobkJhcnMgLyAyMClcbiAgICAgICAgc2VyaWVzWzBdLmxhYmVscy5mb3JFYWNoKChsYmwsIGkpID0+IHtcbiAgICAgICAgICBpZiAoaSAlIHNraXAgIT09IDAgJiYgaSAhPT0gbkJhcnMgLSAxKSByZXR1cm5cbiAgICAgICAgICBjdHguZmlsbFRleHQobGJsLCBQQUQubGVmdCArIGdyb3VwVyAqIGkgKyBncm91cFcgLyAyLCBQQUQudG9wICsgY0ggKyAxNilcbiAgICAgICAgfSlcbiAgICAgICAgLy8gTGVnZW5kYSBsaW5oYXNcbiAgICAgICAgaWYgKGxpbmVTZXJpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGxldCBseCA9IFBBRC5sZWZ0OyBjdHguZm9udCA9ICcxMXB4IHNhbnMtc2VyaWYnOyBjdHgudGV4dEFsaWduID0gJ2xlZnQnXG4gICAgICAgICAgbGluZVNlcmllcy5mb3JFYWNoKHMgPT4ge1xuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHMuY29sb3I7IGN0eC5maWxsUmVjdChseCwgOCwgMjAsIDMpXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyM3QjgyQTAnOyBjdHguZmlsbFRleHQocy5sYWJlbCwgbHggKyAyNCwgMTgpXG4gICAgICAgICAgICBseCArPSBjdHgubWVhc3VyZVRleHQocy5sYWJlbCkud2lkdGggKyA0OFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHByb2dyZXNzIDwgMSkgYW5pbVJlZi5jdXJyZW50ID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpXG4gICAgfVxuXG4gICAgYW5pbVJlZi5jdXJyZW50ID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpXG4gICAgcmV0dXJuICgpID0+IGNhbmNlbEFuaW1hdGlvbkZyYW1lKGFuaW1SZWYuY3VycmVudClcbiAgfSwgW2hpc3RvcmljbywgcGVyaW9kbywgY29tcGFyYXIsIGN1c3RvbUF0aXZvLCBjdXN0b21MYWJlbF0pXG5cbiAgZnVuY3Rpb24gdG9nZ2xlQ29tcGFyYXIoYW5vOiBudW1iZXIpIHtcbiAgICBzZXRDb21wYXJhcihwcmV2ID0+IHByZXYuaW5jbHVkZXMoYW5vKSA/IHByZXYuZmlsdGVyKGEgPT4gYSAhPT0gYW5vKSA6IFsuLi5wcmV2LCBhbm9dKVxuICAgIHNldEN1c3RvbUF0aXZvKGZhbHNlKVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0UGVyaW9kb0NsaWNrKHA6ICc2bScgfCAnMTJtJyB8ICcyNG0nIHwgJ3R1ZG8nKSB7XG4gICAgc2V0UGVyaW9kbyhwKVxuICAgIHNldEN1c3RvbUF0aXZvKGZhbHNlKVxuICAgIHNldENvbXBhcmFyKFtdKVxuICB9XG5cbiAgZnVuY3Rpb24gYXBsaWNhckN1c3RvbSgpIHtcbiAgICBjb25zdCBsYWJlbEEgPSBgJHtNRVNFU1tjdXN0b21BLm1lc0luaSAtIDFdfS8ke2N1c3RvbUEuYW5vSW5pfSA+ICR7TUVTRVNbY3VzdG9tQS5tZXNGaW0gLSAxXX0vJHtjdXN0b21BLmFub0ZpbX1gXG4gICAgY29uc3QgbGFiZWxCID0gYCR7TUVTRVNbY3VzdG9tQi5tZXNJbmkgLSAxXX0vJHtjdXN0b21CLmFub0luaX0gPiAke01FU0VTW2N1c3RvbUIubWVzRmltIC0gMV19LyR7Y3VzdG9tQi5hbm9GaW19YFxuICAgIHNldEN1c3RvbUxhYmVsKGBBOiAke2xhYmVsQX0gfCBCOiAke2xhYmVsQn1gKVxuICAgIHNldEN1c3RvbUF0aXZvKHRydWUpXG4gIH1cblxuICBmdW5jdGlvbiBsaW1wYXJDdXN0b20oKSB7XG4gICAgc2V0Q3VzdG9tQXRpdm8oZmFsc2UpXG4gICAgc2V0Q3VzdG9tTGFiZWwoJycpXG4gIH1cblxuICBjb25zdCBidG5TdHlsZSA9IChhdGl2bzogYm9vbGVhbiwgY29sb3IgPSAnIzRGOEVGNycsIGJnID0gJyMxQzJFNTInKSA9PiAoe1xuICAgIHBhZGRpbmc6ICc0cHggMTBweCcsIGJvcmRlclJhZGl1czogJzVweCcsIGZvbnRTaXplOiAnMTFweCcsIGZvbnRXZWlnaHQ6IDYwMCxcbiAgICBjdXJzb3I6ICdwb2ludGVyJywgYm9yZGVyOiBgMXB4IHNvbGlkICR7YXRpdm8gPyBjb2xvciArICc1NScgOiAnIzI1MjgzNid9YCxcbiAgICBiYWNrZ3JvdW5kOiBhdGl2byA/IGJnIDogJyMxQTFEMkEnLCBjb2xvcjogYXRpdm8gPyBjb2xvciA6ICcjN0I4MkEwJyxcbiAgICBmb250RmFtaWx5OiAnaW5oZXJpdCcsXG4gIH0gYXMgUmVhY3QuQ1NTUHJvcGVydGllcylcblxuICBjb25zdCBzZWxlY3RTdHlsZSA9IHtcbiAgICBwYWRkaW5nOiAnM3B4IDZweCcsIGJhY2tncm91bmQ6ICcjMTMxNjFGJywgYm9yZGVyOiAnMXB4IHNvbGlkICMyNTI4MzYnLFxuICAgIGJvcmRlclJhZGl1czogJzRweCcsIGZvbnRTaXplOiAnMTFweCcsIGNvbG9yOiAnI0U4RUFGMCcsIG91dGxpbmU6ICdub25lJyxcbiAgICBmb250RmFtaWx5OiAnaW5oZXJpdCcsXG4gIH0gYXMgUmVhY3QuQ1NTUHJvcGVydGllc1xuXG4gIGlmIChsb2FkaW5nKSByZXR1cm4gPGRpdiBzdHlsZT17eyBwYWRkaW5nOiAnNDBweCcsIGNvbG9yOiAnIzdCODJBMCcgfX0+Q2FycmVnYW5kby4uLjwvZGl2PlxuXG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIHsvKiBCcmVhZGNydW1iICsgZGF0YSAqL31cbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJywgbWFyZ2luQm90dG9tOiAnNHB4JyB9fT5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICc2cHgnLCBmb250U2l6ZTogJzExcHgnLCBjb2xvcjogJyM0QTUwNzAnIH19PlxuICAgICAgICAgIDxzcGFuPkRhc2hib2FyZDwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBzdHlsZT17eyBtYXJnaW46ICcwIDRweCcgfX0+4oC6PC9zcGFuPlxuICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiAnIzdCODJBMCcgfX0+UGFpbmVsPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBmb250U2l6ZTogJzEycHgnLCBjb2xvcjogJyM3QjgyQTAnIH19PlxuICAgICAgICAgIHtbJ0RvbWluZ28nLCAnU2VndW5kYS1mZWlyYScsICdUZXLDp2EtZmVpcmEnLCAnUXVhcnRhLWZlaXJhJywgJ1F1aW50YS1mZWlyYScsICdTZXh0YS1mZWlyYScsICdTw6FiYWRvJ11bbm93LmdldERheSgpXX0sIHtub3cuZ2V0RGF0ZSgpfSBkZSB7TUVTRVNfRlVMTFtub3cuZ2V0TW9udGgoKV19IGRlIHtub3cuZ2V0RnVsbFllYXIoKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuXG5cbiAgICAgIHsvKiBHcsOhZmljbyAqL31cbiAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6ICcxMXB4JywgZm9udFdlaWdodDogNjAwLCB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJywgbGV0dGVyU3BhY2luZzogJzEuMnB4JywgY29sb3I6ICcjNEE1MDcwJywgbWFyZ2luQm90dG9tOiAnMTBweCcsIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzhweCcgfX0+XG4gICAgICAgIEZhdHVyYW1lbnRvIOKAlCBDb21wYXJhdGl2byBwb3IgUGVyw61vZG9cbiAgICAgICAgPGRpdiBzdHlsZT17eyBmbGV4OiAxLCBoZWlnaHQ6ICcxcHgnLCBiYWNrZ3JvdW5kOiAnIzI1MjgzNicgfX0gLz5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8ZGl2IHN0eWxlPXt7IGJhY2tncm91bmQ6ICcjMTMxNjFGJywgYm9yZGVyOiAnMXB4IHNvbGlkICMyNTI4MzYnLCBib3JkZXJSYWRpdXM6ICcxNHB4JywgcGFkZGluZzogJzE2cHggMTZweCAxMnB4JywgbWFyZ2luQm90dG9tOiAnMTZweCcgfX0+XG4gICAgICAgIHsvKiBDb250cm9sZXMgcGVyw61vZG8gKi99XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJywgZmxleFdyYXA6ICd3cmFwJywgZ2FwOiAnMTBweCcsIG1hcmdpbkJvdHRvbTogJzE2cHgnIH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBnYXA6ICcxNHB4JywgZm9udFNpemU6ICcxMXB4JyB9fT5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzVweCcgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IHdpZHRoOiAnMTBweCcsIGhlaWdodDogJzEwcHgnLCBib3JkZXJSYWRpdXM6ICcycHgnLCBiYWNrZ3JvdW5kOiAnIzRGOEVGNycsIG9wYWNpdHk6IDAuNywgZGlzcGxheTogJ2lubGluZS1ibG9jaycgfX0gLz5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6ICcjN0I4MkEwJyB9fT5QZXLDrW9kbyBhdHVhbCAoU0lYK0VOT1ZBKTwvc3Bhbj5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiAnIzdCODJBMCcsIGZvbnRTaXplOiAnMTBweCcgfX0+wrcgbGluaGFzID0gYW5vcyBjb21wYXJhZG9zPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnOHB4JywgZmxleFdyYXA6ICd3cmFwJyB9fT5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMTBweCcsIGZvbnRXZWlnaHQ6IDYwMCwgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsIGxldHRlclNwYWNpbmc6ICcxcHgnLCBjb2xvcjogJyM0QTUwNzAnIH19PlBlcsOtb2RvPC9zcGFuPlxuICAgICAgICAgICAgeyhbJzZtJywgJzEybScsICcyNG0nLCAndHVkbyddIGFzIGNvbnN0KS5tYXAocCA9PiAoXG4gICAgICAgICAgICAgIDxidXR0b24ga2V5PXtwfSBvbkNsaWNrPXsoKSA9PiBzZXRQZXJpb2RvQ2xpY2socCl9IHN0eWxlPXtidG5TdHlsZSghY3VzdG9tQXRpdm8gJiYgcGVyaW9kbyA9PT0gcCl9PlxuICAgICAgICAgICAgICAgIHtwID09PSAnNm0nID8gJzYgbWVzZXMnIDogcCA9PT0gJzEybScgPyAnMTIgbWVzZXMnIDogcCA9PT0gJzI0bScgPyAnMjQgbWVzZXMnIDogJ1R1ZG8nfVxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzFweCcsIGhlaWdodDogJzIwcHgnLCBiYWNrZ3JvdW5kOiAnIzI1MjgzNicgfX0gLz5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMTBweCcsIGZvbnRXZWlnaHQ6IDYwMCwgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsIGxldHRlclNwYWNpbmc6ICcxcHgnLCBjb2xvcjogJyM0QTUwNzAnIH19PkNvbXBhcmFyIGNvbTwvc3Bhbj5cbiAgICAgICAgICAgIHthbm9zRGlzcC5tYXAoYW5vID0+IChcbiAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e2Fub30gb25DbGljaz17KCkgPT4gdG9nZ2xlQ29tcGFyYXIoYW5vKX0gc3R5bGU9e2J0blN0eWxlKGNvbXBhcmFyLmluY2x1ZGVzKGFubyksIFBBTFthbm9zRGlzcC5pbmRleE9mKGFubykgJSBQQUwubGVuZ3RoXSwgUEFMW2Fub3NEaXNwLmluZGV4T2YoYW5vKSAlIFBBTC5sZW5ndGhdICsgJzIyJyl9PlxuICAgICAgICAgICAgICAgIHthbm99XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7LyogQ29tcGFyYXRpdm8gcGVyc29uYWxpemFkbyAqL31cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIHBhZGRpbmc6ICcxMnB4IDE2cHgnLCBiYWNrZ3JvdW5kOiAnIzFBMUQyQScsIGJvcmRlcjogJzFweCBzb2xpZCAjMjUyODM2JywgYm9yZGVyUmFkaXVzOiAnOHB4JyB9fT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6ICcxMHB4JywgZm9udFdlaWdodDogNjAwLCB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJywgbGV0dGVyU3BhY2luZzogJzFweCcsIGNvbG9yOiAnIzRBNTA3MCcsIG1hcmdpbkJvdHRvbTogJzEwcHgnIH19PkNvbXBhcmF0aXZvIHBlcnNvbmFsaXphZG88L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnOHB4JyB9fT5cbiAgICAgICAgICAgICAgey8qIFBlcsOtb2RvIEEgKi99XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnNnB4JywgZmxleFdyYXA6ICd3cmFwJyB9fT5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzZweCcsIHBhZGRpbmc6ICc2cHggMTBweCcsIGJhY2tncm91bmQ6ICdyZ2JhKDc5LDE0MiwyNDcsMC4wOCknLCBib3JkZXI6ICcxcHggc29saWQgcmdiYSg3OSwxNDIsMjQ3LDAuMjUpJywgYm9yZGVyUmFkaXVzOiAnNnB4JyB9fT5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMTBweCcsIGZvbnRXZWlnaHQ6IDcwMCwgY29sb3I6ICcjNEY4RUY3JywgbWluV2lkdGg6ICcxNHB4JyB9fT5BPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPHNlbGVjdCBzdHlsZT17c2VsZWN0U3R5bGV9IHZhbHVlPXtjdXN0b21BLm1lc0luaX0gb25DaGFuZ2U9e2UgPT4gc2V0Q3VzdG9tQShwID0+ICh7IC4uLnAsIG1lc0luaTogK2UudGFyZ2V0LnZhbHVlIH0pKX0+XG4gICAgICAgICAgICAgICAgICAgIHtNRVNFUy5tYXAoKG0sIGkpID0+IDxvcHRpb24ga2V5PXtpfSB2YWx1ZT17aSArIDF9PnttfTwvb3B0aW9uPil9XG4gICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgIDxzZWxlY3Qgc3R5bGU9e3NlbGVjdFN0eWxlfSB2YWx1ZT17Y3VzdG9tQS5hbm9Jbml9IG9uQ2hhbmdlPXtlID0+IHNldEN1c3RvbUEocCA9PiAoeyAuLi5wLCBhbm9Jbmk6ICtlLnRhcmdldC52YWx1ZSB9KSl9PlxuICAgICAgICAgICAgICAgICAgICB7YW5vc0FzYy5tYXAoYSA9PiA8b3B0aW9uIGtleT17YX0gdmFsdWU9e2F9PnthfTwvb3B0aW9uPil9XG4gICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMTBweCcsIGNvbG9yOiAnIzRBNTA3MCcgfX0+YXTDqTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzZWxlY3Qgc3R5bGU9e3NlbGVjdFN0eWxlfSB2YWx1ZT17Y3VzdG9tQS5tZXNGaW19IG9uQ2hhbmdlPXtlID0+IHNldEN1c3RvbUEocCA9PiAoeyAuLi5wLCBtZXNGaW06ICtlLnRhcmdldC52YWx1ZSB9KSl9PlxuICAgICAgICAgICAgICAgICAgICB7TUVTRVMubWFwKChtLCBpKSA9PiA8b3B0aW9uIGtleT17aX0gdmFsdWU9e2kgKyAxfT57bX08L29wdGlvbj4pfVxuICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICA8c2VsZWN0IHN0eWxlPXtzZWxlY3RTdHlsZX0gdmFsdWU9e2N1c3RvbUEuYW5vRmltfSBvbkNoYW5nZT17ZSA9PiBzZXRDdXN0b21BKHAgPT4gKHsgLi4ucCwgYW5vRmltOiArZS50YXJnZXQudmFsdWUgfSkpfT5cbiAgICAgICAgICAgICAgICAgICAge2Fub3NBc2MubWFwKGEgPT4gPG9wdGlvbiBrZXk9e2F9IHZhbHVlPXthfT57YX08L29wdGlvbj4pfVxuICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzhweCcgfX0+XG4gICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6ICcxMHB4JywgZm9udFdlaWdodDogNjAwLCBjb2xvcjogJyM0QTUwNzAnLCBwYWRkaW5nTGVmdDogJzRweCcgfX0+Y29tcGFyYWRvIGNvbTwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIHsvKiBQZXLDrW9kbyBCICovfVxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzZweCcsIGZsZXhXcmFwOiAnd3JhcCcgfX0+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICc2cHgnLCBwYWRkaW5nOiAnNnB4IDEwcHgnLCBiYWNrZ3JvdW5kOiAncmdiYSgxNjcsMTM5LDI1MCwwLjA4KScsIGJvcmRlcjogJzFweCBzb2xpZCByZ2JhKDE2NywxMzksMjUwLDAuMjUpJywgYm9yZGVyUmFkaXVzOiAnNnB4JyB9fT5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMTBweCcsIGZvbnRXZWlnaHQ6IDcwMCwgY29sb3I6ICcjQTc4QkZBJywgbWluV2lkdGg6ICcxNHB4JyB9fT5CPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPHNlbGVjdCBzdHlsZT17c2VsZWN0U3R5bGV9IHZhbHVlPXtjdXN0b21CLm1lc0luaX0gb25DaGFuZ2U9e2UgPT4gc2V0Q3VzdG9tQihwID0+ICh7IC4uLnAsIG1lc0luaTogK2UudGFyZ2V0LnZhbHVlIH0pKX0+XG4gICAgICAgICAgICAgICAgICAgIHtNRVNFUy5tYXAoKG0sIGkpID0+IDxvcHRpb24ga2V5PXtpfSB2YWx1ZT17aSArIDF9PnttfTwvb3B0aW9uPil9XG4gICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgIDxzZWxlY3Qgc3R5bGU9e3NlbGVjdFN0eWxlfSB2YWx1ZT17Y3VzdG9tQi5hbm9Jbml9IG9uQ2hhbmdlPXtlID0+IHNldEN1c3RvbUIocCA9PiAoeyAuLi5wLCBhbm9Jbmk6ICtlLnRhcmdldC52YWx1ZSB9KSl9PlxuICAgICAgICAgICAgICAgICAgICB7YW5vc0FzYy5tYXAoYSA9PiA8b3B0aW9uIGtleT17YX0gdmFsdWU9e2F9PnthfTwvb3B0aW9uPil9XG4gICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMTBweCcsIGNvbG9yOiAnIzRBNTA3MCcgfX0+YXTDqTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzZWxlY3Qgc3R5bGU9e3NlbGVjdFN0eWxlfSB2YWx1ZT17Y3VzdG9tQi5tZXNGaW19IG9uQ2hhbmdlPXtlID0+IHNldEN1c3RvbUIocCA9PiAoeyAuLi5wLCBtZXNGaW06ICtlLnRhcmdldC52YWx1ZSB9KSl9PlxuICAgICAgICAgICAgICAgICAgICB7TUVTRVMubWFwKChtLCBpKSA9PiA8b3B0aW9uIGtleT17aX0gdmFsdWU9e2kgKyAxfT57bX08L29wdGlvbj4pfVxuICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICA8c2VsZWN0IHN0eWxlPXtzZWxlY3RTdHlsZX0gdmFsdWU9e2N1c3RvbUIuYW5vRmltfSBvbkNoYW5nZT17ZSA9PiBzZXRDdXN0b21CKHAgPT4gKHsgLi4ucCwgYW5vRmltOiArZS50YXJnZXQudmFsdWUgfSkpfT5cbiAgICAgICAgICAgICAgICAgICAge2Fub3NBc2MubWFwKGEgPT4gPG9wdGlvbiBrZXk9e2F9IHZhbHVlPXthfT57YX08L29wdGlvbj4pfVxuICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzhweCcgfX0+XG4gICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6ICcxMHB4JywgZm9udFdlaWdodDogNjAwLCBjb2xvcjogJyM0QTUwNzAnLCBwYWRkaW5nTGVmdDogJzRweCcgfX0+Y29tcGFyYWRvIGNvbTwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIHsvKiBQZXLDrW9kbyBDIOKAlCBvcGNpb25hbCAqL31cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICc2cHgnLCBmbGV4V3JhcDogJ3dyYXAnIH19PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnNnB4JywgcGFkZGluZzogJzZweCAxMHB4JywgYmFja2dyb3VuZDogJ3JnYmEoMjUxLDE5MSwzNiwwLjA4KScsIGJvcmRlcjogJzFweCBzb2xpZCByZ2JhKDI1MSwxOTEsMzYsMC4yNSknLCBib3JkZXJSYWRpdXM6ICc2cHgnIH19PlxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6ICcxMHB4JywgZm9udFdlaWdodDogNzAwLCBjb2xvcjogJyNGQkJGMjQnLCBtaW5XaWR0aDogJzE0cHgnIH19PkM8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogJzEwcHgnLCBjb2xvcjogJyM0QTUwNzAnLCBmb250U3R5bGU6ICdpdGFsaWMnIH19Pm9wY2lvbmFsIOKAlDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzZWxlY3Qgc3R5bGU9e3NlbGVjdFN0eWxlfSB2YWx1ZT17Y3VzdG9tQy5tZXNJbml9IG9uQ2hhbmdlPXtlID0+IHNldEN1c3RvbUMocCA9PiAoeyAuLi5wLCBtZXNJbmk6IGUudGFyZ2V0LnZhbHVlIH0pKX0+XG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj7igJQ8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAge01FU0VTLm1hcCgobSwgaSkgPT4gPG9wdGlvbiBrZXk9e2l9IHZhbHVlPXtpICsgMX0+e219PC9vcHRpb24+KX1cbiAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgICAgPHNlbGVjdCBzdHlsZT17c2VsZWN0U3R5bGV9IHZhbHVlPXtjdXN0b21DLmFub0luaX0gb25DaGFuZ2U9e2UgPT4gc2V0Q3VzdG9tQyhwID0+ICh7IC4uLnAsIGFub0luaTogZS50YXJnZXQudmFsdWUgfSkpfT5cbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPuKAlDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICB7YW5vc0FzYy5tYXAoYSA9PiA8b3B0aW9uIGtleT17YX0gdmFsdWU9e2F9PnthfTwvb3B0aW9uPil9XG4gICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMTBweCcsIGNvbG9yOiAnIzRBNTA3MCcgfX0+YXTDqTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzZWxlY3Qgc3R5bGU9e3NlbGVjdFN0eWxlfSB2YWx1ZT17Y3VzdG9tQy5tZXNGaW19IG9uQ2hhbmdlPXtlID0+IHNldEN1c3RvbUMocCA9PiAoeyAuLi5wLCBtZXNGaW06IGUudGFyZ2V0LnZhbHVlIH0pKX0+XG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj7igJQ8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAge01FU0VTLm1hcCgobSwgaSkgPT4gPG9wdGlvbiBrZXk9e2l9IHZhbHVlPXtpICsgMX0+e219PC9vcHRpb24+KX1cbiAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgICAgPHNlbGVjdCBzdHlsZT17c2VsZWN0U3R5bGV9IHZhbHVlPXtjdXN0b21DLmFub0ZpbX0gb25DaGFuZ2U9e2UgPT4gc2V0Q3VzdG9tQyhwID0+ICh7IC4uLnAsIGFub0ZpbTogZS50YXJnZXQudmFsdWUgfSkpfT5cbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPuKAlDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICB7YW5vc0FzYy5tYXAoYSA9PiA8b3B0aW9uIGtleT17YX0gdmFsdWU9e2F9PnthfTwvb3B0aW9uPil9XG4gICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnOHB4JywgbWFyZ2luVG9wOiAnNHB4JyB9fT5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e2FwbGljYXJDdXN0b219IHN0eWxlPXt7IHBhZGRpbmc6ICc1cHggMTZweCcsIGJhY2tncm91bmQ6ICcjMUMyRTUyJywgYm9yZGVyOiAnMXB4IHNvbGlkIHJnYmEoNzksMTQyLDI0NywwLjMpJywgYm9yZGVyUmFkaXVzOiAnNXB4JywgY29sb3I6ICcjNEY4RUY3JywgZm9udFNpemU6ICcxMXB4JywgZm9udFdlaWdodDogNjAwLCBjdXJzb3I6ICdwb2ludGVyJywgZm9udEZhbWlseTogJ2luaGVyaXQnIH19PkNvbXBhcmFyPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtsaW1wYXJDdXN0b219IHN0eWxlPXt7IHBhZGRpbmc6ICc1cHggMTBweCcsIGJhY2tncm91bmQ6ICcjMTMxNjFGJywgYm9yZGVyOiAnMXB4IHNvbGlkICMyNTI4MzYnLCBib3JkZXJSYWRpdXM6ICc1cHgnLCBjb2xvcjogJyM3QjgyQTAnLCBmb250U2l6ZTogJzExcHgnLCBjdXJzb3I6ICdwb2ludGVyJywgZm9udEZhbWlseTogJ2luaGVyaXQnIH19PkxpbXBhcjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIHtjdXN0b21MYWJlbCAmJiA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogJzEwcHgnLCBjb2xvcjogJyMzNEQzOTknIH19PntjdXN0b21MYWJlbH08L3NwYW4+fVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogQ2FudmFzIGRvIGdyw6FmaWNvICovfVxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICc0NjBweCcgfX0+XG4gICAgICAgICAgPGNhbnZhcyByZWY9e2NhbnZhc1JlZn0gc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScsIGRpc3BsYXk6ICdibG9jaycgfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuIl0sImZpbGUiOiJDOi9wcm9qZXRvcy9jb250cm9sZS1maXNjYWwvZnJvbnRlbmQvc3JjL3BhZ2VzL0Rhc2hib2FyZC9pbmRleC5qc3gifQ==