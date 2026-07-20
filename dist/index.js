const manifest = {"name":"Now Playing"};
const API_VERSION = 2;
const internalAPIConnection = window.__DECKY_SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_deckyLoaderAPIInit;
if (!internalAPIConnection) {
    throw new Error('[@decky/api]: Failed to connect to the loader as as the loader API was not initialized. This is likely a bug in Decky Loader.');
}
let api;
try {
    api = internalAPIConnection.connect(API_VERSION, manifest.name);
}
catch {
    api = internalAPIConnection.connect(1, manifest.name);
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version 1. Some features may not work.`);
}
if (api._version != API_VERSION) {
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version ${api._version}. Some features may not work.`);
}
const call = api.call;
const routerHook = api.routerHook;
const toaster = api.toaster;
const definePlugin = (fn) => {
    return (...args) => {
        return fn(...args);
    };
};

var DefaultContext = {
  color: undefined,
  size: undefined,
  className: undefined,
  style: undefined,
  attr: undefined
};
var IconContext = SP_REACT.createContext && /*#__PURE__*/SP_REACT.createContext(DefaultContext);

var _excluded = ["attr", "size", "title"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function Tree2Element(tree) {
  return tree && tree.map((node, i) => /*#__PURE__*/SP_REACT.createElement(node.tag, _objectSpread({
    key: i
  }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
  return props => /*#__PURE__*/SP_REACT.createElement(IconBase, _extends({
    attr: _objectSpread({}, data.attr)
  }, props), Tree2Element(data.child));
}
function IconBase(props) {
  var elem = conf => {
    var attr = props.attr,
      size = props.size,
      title = props.title,
      svgProps = _objectWithoutProperties(props, _excluded);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + " " : "") + props.className;
    return /*#__PURE__*/SP_REACT.createElement("svg", _extends({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className: className,
      style: _objectSpread(_objectSpread({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && /*#__PURE__*/SP_REACT.createElement("title", null, title), props.children);
  };
  return IconContext !== undefined ? /*#__PURE__*/SP_REACT.createElement(IconContext.Consumer, null, conf => elem(conf)) : elem(DefaultContext);
}

// THIS FILE IS AUTO GENERATED
function FaDeezer (props) {
  return GenIcon({"attr":{"viewBox":"0 0 576 512"},"child":[{"tag":"path","attr":{"d":"M451.46,244.71H576V172H451.46Zm0-173.89v72.67H576V70.82Zm0,275.06H576V273.2H451.46ZM0,447.09H124.54V374.42H0Zm150.47,0H275V374.42H150.47Zm150.52,0H425.53V374.42H301Zm150.47,0H576V374.42H451.46ZM301,345.88H425.53V273.2H301Zm-150.52,0H275V273.2H150.47Zm0-101.17H275V172H150.47Z"},"child":[]}]})(props);
}function FaAmazon (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z"},"child":[]}]})(props);
}function FaUser (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"},"child":[]}]})(props);
}function FaTv (props) {
  return GenIcon({"attr":{"viewBox":"0 0 640 512"},"child":[{"tag":"path","attr":{"d":"M592 0H48A48 48 0 0 0 0 48v320a48 48 0 0 0 48 48h240v32H112a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H352v-32h240a48 48 0 0 0 48-48V48a48 48 0 0 0-48-48zm-16 352H64V64h512z"},"child":[]}]})(props);
}function FaTimes (props) {
  return GenIcon({"attr":{"viewBox":"0 0 352 512"},"child":[{"tag":"path","attr":{"d":"M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"},"child":[]}]})(props);
}function FaSyncAlt (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M370.72 133.28C339.458 104.008 298.888 87.962 255.848 88c-77.458.068-144.328 53.178-162.791 126.85-1.344 5.363-6.122 9.15-11.651 9.15H24.103c-7.498 0-13.194-6.807-11.807-14.176C33.933 94.924 134.813 8 256 8c66.448 0 126.791 26.136 171.315 68.685L463.03 40.97C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.749zM32 296h134.059c21.382 0 32.09 25.851 16.971 40.971l-41.75 41.75c31.262 29.273 71.835 45.319 114.876 45.28 77.418-.07 144.315-53.144 162.787-126.849 1.344-5.363 6.122-9.15 11.651-9.15h57.304c7.498 0 13.194 6.807 11.807 14.176C478.067 417.076 377.187 504 256 504c-66.448 0-126.791-26.136-171.315-68.685L48.97 471.03C33.851 486.149 8 475.441 8 454.059V320c0-13.255 10.745-24 24-24z"},"child":[]}]})(props);
}function FaStepForward (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M384 44v424c0 6.6-5.4 12-12 12h-48c-6.6 0-12-5.4-12-12V291.6l-195.5 181C95.9 489.7 64 475.4 64 448V64c0-27.4 31.9-41.7 52.5-24.6L312 219.3V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12z"},"child":[]}]})(props);
}function FaStepBackward (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M64 468V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12v176.4l195.5-181C352.1 22.3 384 36.6 384 64v384c0 27.4-31.9 41.7-52.5 24.6L136 292.7V468c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12z"},"child":[]}]})(props);
}function FaSignOutAlt (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z"},"child":[]}]})(props);
}function FaSearch (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"},"child":[]}]})(props);
}function FaRedoAlt (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M256.455 8c66.269.119 126.437 26.233 170.859 68.685l35.715-35.715C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.75c-30.864-28.899-70.801-44.907-113.23-45.273-92.398-.798-170.283 73.977-169.484 169.442C88.764 348.009 162.184 424 256 424c41.127 0 79.997-14.678 110.629-41.556 4.743-4.161 11.906-3.908 16.368.553l39.662 39.662c4.872 4.872 4.631 12.815-.482 17.433C378.202 479.813 319.926 504 256 504 119.034 504 8.001 392.967 8 256.002 7.999 119.193 119.646 7.755 256.455 8z"},"child":[]}]})(props);
}function FaRandom (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M504.971 359.029c9.373 9.373 9.373 24.569 0 33.941l-80 79.984c-15.01 15.01-40.971 4.49-40.971-16.971V416h-58.785a12.004 12.004 0 0 1-8.773-3.812l-70.556-75.596 53.333-57.143L352 336h32v-39.981c0-21.438 25.943-31.998 40.971-16.971l80 79.981zM12 176h84l52.781 56.551 53.333-57.143-70.556-75.596A11.999 11.999 0 0 0 122.785 96H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12zm372 0v39.984c0 21.46 25.961 31.98 40.971 16.971l80-79.984c9.373-9.373 9.373-24.569 0-33.941l-80-79.981C409.943 24.021 384 34.582 384 56.019V96h-58.785a12.004 12.004 0 0 0-8.773 3.812L96 336H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h110.785c3.326 0 6.503-1.381 8.773-3.812L352 176h32z"},"child":[]}]})(props);
}function FaPlay (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"},"child":[]}]})(props);
}function FaPause (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z"},"child":[]}]})(props);
}function FaMusic (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M470.38 1.51L150.41 96A32 32 0 0 0 128 126.51v261.41A139 139 0 0 0 96 384c-53 0-96 28.66-96 64s43 64 96 64 96-28.66 96-64V214.32l256-75v184.61a138.4 138.4 0 0 0-32-3.93c-53 0-96 28.66-96 64s43 64 96 64 96-28.65 96-64V32a32 32 0 0 0-41.62-30.49z"},"child":[]}]})(props);
}function FaList (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M80 368H16a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16zm0-320H16A16 16 0 0 0 0 64v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16zm0 160H16a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16zm416 176H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z"},"child":[]}]})(props);
}function FaListOl (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M61.77 401l17.5-20.15a19.92 19.92 0 0 0 5.07-14.19v-3.31C84.34 356 80.5 352 73 352H16a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h22.83a157.41 157.41 0 0 0-11 12.31l-5.61 7c-4 5.07-5.25 10.13-2.8 14.88l1.05 1.93c3 5.76 6.29 7.88 12.25 7.88h4.73c10.33 0 15.94 2.44 15.94 9.09 0 4.72-4.2 8.22-14.36 8.22a41.54 41.54 0 0 1-15.47-3.12c-6.49-3.88-11.74-3.5-15.6 3.12l-5.59 9.31c-3.72 6.13-3.19 11.72 2.63 15.94 7.71 4.69 20.38 9.44 37 9.44 34.16 0 48.5-22.75 48.5-44.12-.03-14.38-9.12-29.76-28.73-34.88zM496 224H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 320H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM16 160h64a8 8 0 0 0 8-8v-16a8 8 0 0 0-8-8H64V40a8 8 0 0 0-8-8H32a8 8 0 0 0-7.14 4.42l-8 16A8 8 0 0 0 24 64h8v64H16a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8zm-3.91 160H80a8 8 0 0 0 8-8v-16a8 8 0 0 0-8-8H41.32c3.29-10.29 48.34-18.68 48.34-56.44 0-29.06-25-39.56-44.47-39.56-21.36 0-33.8 10-40.46 18.75-4.37 5.59-3 10.84 2.8 15.37l8.58 6.88c5.61 4.56 11 2.47 16.12-2.44a13.44 13.44 0 0 1 9.46-3.84c3.33 0 9.28 1.56 9.28 8.75C51 248.19 0 257.31 0 304.59v4C0 316 5.08 320 12.09 320z"},"child":[]}]})(props);
}function FaImage (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M464 448H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48v288c0 26.51-21.49 48-48 48zM112 120c-30.928 0-56 25.072-56 56s25.072 56 56 56 56-25.072 56-56-25.072-56-56-56zM64 384h384V272l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L208 320l-55.515-55.515c-4.686-4.686-12.284-4.686-16.971 0L64 336v48z"},"child":[]}]})(props);
}function FaHome (props) {
  return GenIcon({"attr":{"viewBox":"0 0 576 512"},"child":[{"tag":"path","attr":{"d":"M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"},"child":[]}]})(props);
}function FaFolder (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M464 128H272l-64-64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48z"},"child":[]}]})(props);
}function FaFileAudio (props) {
  return GenIcon({"attr":{"viewBox":"0 0 384 512"},"child":[{"tag":"path","attr":{"d":"M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm-64 268c0 10.7-12.9 16-20.5 8.5L104 376H76c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h28l35.5-36.5c7.6-7.6 20.5-2.2 20.5 8.5v136zm33.2-47.6c9.1-9.3 9.1-24.1 0-33.4-22.1-22.8 12.2-56.2 34.4-33.5 27.2 27.9 27.2 72.4 0 100.4-21.8 22.3-56.9-10.4-34.4-33.5zm86-117.1c54.4 55.9 54.4 144.8 0 200.8-21.8 22.4-57-10.3-34.4-33.5 36.2-37.2 36.3-96.5 0-133.8-22.1-22.8 12.3-56.3 34.4-33.5zM384 121.9v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"},"child":[]}]})(props);
}function FaFileAlt (props) {
  return GenIcon({"attr":{"viewBox":"0 0 384 512"},"child":[{"tag":"path","attr":{"d":"M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-64c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-72v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm96-114.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"},"child":[]}]})(props);
}function FaExternalLinkAlt (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"},"child":[]}]})(props);
}function FaExpandArrowsAlt (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M448 344v112a23.94 23.94 0 0 1-24 24H312c-21.39 0-32.09-25.9-17-41l36.2-36.2L224 295.6 116.77 402.9 153 439c15.09 15.1 4.39 41-17 41H24a23.94 23.94 0 0 1-24-24V344c0-21.4 25.89-32.1 41-17l36.19 36.2L184.46 256 77.18 148.7 41 185c-15.1 15.1-41 4.4-41-17V56a23.94 23.94 0 0 1 24-24h112c21.39 0 32.09 25.9 17 41l-36.2 36.2L224 216.4l107.23-107.3L295 73c-15.09-15.1-4.39-41 17-41h112a23.94 23.94 0 0 1 24 24v112c0 21.4-25.89 32.1-41 17l-36.19-36.2L263.54 256l107.28 107.3L407 327.1c15.1-15.2 41-4.5 41 16.9z"},"child":[]}]})(props);
}function FaExpandAlt (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M212.686 315.314L120 408l32.922 31.029c15.12 15.12 4.412 40.971-16.97 40.971h-112C10.697 480 0 469.255 0 456V344c0-21.382 25.803-32.09 40.922-16.971L72 360l92.686-92.686c6.248-6.248 16.379-6.248 22.627 0l25.373 25.373c6.249 6.248 6.249 16.378 0 22.627zm22.628-118.628L328 104l-32.922-31.029C279.958 57.851 290.666 32 312.048 32h112C437.303 32 448 42.745 448 56v112c0 21.382-25.803 32.09-40.922 16.971L376 152l-92.686 92.686c-6.248 6.248-16.379 6.248-22.627 0l-25.373-25.373c-6.249-6.248-6.249-16.378 0-22.627z"},"child":[]}]})(props);
}function FaDownload (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"},"child":[]}]})(props);
}function FaCompactDisc (props) {
  return GenIcon({"attr":{"viewBox":"0 0 496 512"},"child":[{"tag":"path","attr":{"d":"M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zM88 256H56c0-105.9 86.1-192 192-192v32c-88.2 0-160 71.8-160 160zm160 96c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96zm0-128c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32z"},"child":[]}]})(props);
}function FaCog (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"},"child":[]}]})(props);
}function FaClock (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M256,8C119,8,8,119,8,256S119,504,256,504,504,393,504,256,393,8,256,8Zm92.49,313h0l-20,25a16,16,0,0,1-22.49,2.5h0l-67-49.72a40,40,0,0,1-15-31.23V112a16,16,0,0,1,16-16h32a16,16,0,0,1,16,16V256l58,42.5A16,16,0,0,1,348.49,321Z"},"child":[]}]})(props);
}function FaChevronRight (props) {
  return GenIcon({"attr":{"viewBox":"0 0 320 512"},"child":[{"tag":"path","attr":{"d":"M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"},"child":[]}]})(props);
}function FaCheck (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"},"child":[]}]})(props);
}function FaArrowLeft (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"},"child":[]}]})(props);
}

// THIS FILE IS AUTO GENERATED
function SiTidal (props) {
  return GenIcon({"attr":{"role":"img","viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"d":"M12.012 3.992L8.008 7.996 4.004 3.992 0 7.996 4.004 12l4.004-4.004L12.012 12l-4.004 4.004 4.004 4.004 4.004-4.004L12.012 12l4.004-4.004-4.004-4.004zM16.042 7.996l3.979-3.979L24 7.996l-3.979 3.979z"},"child":[]}]})(props);
}function SiSpotify (props) {
  return GenIcon({"attr":{"role":"img","viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"d":"M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"},"child":[]}]})(props);
}function SiSoundcloud (props) {
  return GenIcon({"attr":{"role":"img","viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"d":"M23.999 14.165c-.052 1.796-1.612 3.169-3.4 3.169h-8.18a.68.68 0 0 1-.675-.683V7.862a.747.747 0 0 1 .452-.724s.75-.513 2.333-.513a5.364 5.364 0 0 1 2.763.755 5.433 5.433 0 0 1 2.57 3.54c.282-.08.574-.121.868-.12.884 0 1.73.358 2.347.992s.948 1.49.922 2.373ZM10.721 8.421c.247 2.98.427 5.697 0 8.672a.264.264 0 0 1-.53 0c-.395-2.946-.22-5.718 0-8.672a.264.264 0 0 1 .53 0ZM9.072 9.448c.285 2.659.37 4.986-.006 7.655a.277.277 0 0 1-.55 0c-.331-2.63-.256-5.02 0-7.655a.277.277 0 0 1 .556 0Zm-1.663-.257c.27 2.726.39 5.171 0 7.904a.266.266 0 0 1-.532 0c-.38-2.69-.257-5.21 0-7.904a.266.266 0 0 1 .532 0Zm-1.647.77a26.108 26.108 0 0 1-.008 7.147.272.272 0 0 1-.542 0 27.955 27.955 0 0 1 0-7.147.275.275 0 0 1 .55 0Zm-1.67 1.769c.421 1.865.228 3.5-.029 5.388a.257.257 0 0 1-.514 0c-.21-1.858-.398-3.549 0-5.389a.272.272 0 0 1 .543 0Zm-1.655-.273c.388 1.897.26 3.508-.01 5.412-.026.28-.514.283-.54 0-.244-1.878-.347-3.54-.01-5.412a.283.283 0 0 1 .56 0Zm-1.668.911c.4 1.268.257 2.292-.026 3.572a.257.257 0 0 1-.514 0c-.241-1.262-.354-2.312-.023-3.572a.283.283 0 0 1 .563 0Z"},"child":[]}]})(props);
}function SiApplemusic (props) {
  return GenIcon({"attr":{"role":"img","viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"d":"M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 001.57-.1c.822-.106 1.596-.35 2.295-.81a5.046 5.046 0 001.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.045-1.773-.6-1.943-1.536a1.88 1.88 0 011.038-2.022c.323-.16.67-.25 1.018-.324.378-.082.758-.153 1.134-.24.274-.063.457-.23.51-.516a.904.904 0 00.02-.193c0-1.815 0-3.63-.002-5.443a.725.725 0 00-.026-.185c-.04-.15-.15-.243-.304-.234-.16.01-.318.035-.475.066-.76.15-1.52.303-2.28.456l-2.325.47-1.374.278c-.016.003-.032.01-.048.013-.277.077-.377.203-.39.49-.002.042 0 .086 0 .13-.002 2.602 0 5.204-.003 7.805 0 .42-.047.836-.215 1.227-.278.64-.77 1.04-1.434 1.233-.35.1-.71.16-1.075.172-.96.036-1.755-.6-1.92-1.544-.14-.812.23-1.685 1.154-2.075.357-.15.73-.232 1.108-.31.287-.06.575-.116.86-.177.383-.083.583-.323.6-.714v-.15c0-2.96 0-5.922.002-8.882 0-.123.013-.25.042-.37.07-.285.273-.448.546-.518.255-.066.515-.112.774-.165.733-.15 1.466-.296 2.2-.444l2.27-.46c.67-.134 1.34-.27 2.01-.403.22-.043.442-.088.663-.106.31-.025.523.17.554.482.008.073.012.148.012.223.002 1.91.002 3.822 0 5.732z"},"child":[]}]})(props);
}

function getSourceBehaviorSettings() {
    return call("get_source_behavior_settings");
}
function setSourceBehaviorSettings(autoLaunch, closeOnSwitch) {
    return call("set_source_behavior_settings", autoLaunch, closeOnSwitch);
}
const emptySnapshotValue = () => ({
    selectedPlayer: "",
    currentPlayer: "",
    selected: null,
    players: [],
});
function normalizeSnapshot(value) {
    if (!value || typeof value !== "object")
        return emptySnapshotValue();
    const raw = value;
    const players = Array.isArray(raw.players)
        ? raw.players.filter((entry) => Boolean(entry && typeof entry === "object"))
        : [];
    const selected = raw.selected && typeof raw.selected === "object"
        ? raw.selected
        : players.find((entry) => entry.isSelected || entry.isCurrent) ?? players[0] ?? null;
    const selectedPlayer = typeof raw.selectedPlayer === "string"
        ? raw.selectedPlayer
        : String(selected?.id ?? "");
    const currentPlayer = typeof raw.currentPlayer === "string"
        ? raw.currentPlayer
        : selectedPlayer;
    return { selectedPlayer, currentPlayer, selected, players };
}
async function getSnapshot() {
    try {
        return normalizeSnapshot(await call("get_snapshot"));
    }
    catch {
        return emptySnapshotValue();
    }
}
function getTopbarEnabled() {
    return call("get_topbar_enabled");
}
function setTopbarEnabled(enabled) {
    return call("set_topbar_enabled", enabled);
}
function getTopbarLeft() {
    return call("get_topbar_left");
}
function setTopbarLeft(enabled) {
    return call("set_topbar_left", enabled);
}
function setMediaPlayer(player) {
    return call("set_media_player", player);
}
function getCover(title, artist, album) {
    return call("get_cover", title, artist, album);
}
function getCoverForService(service, title, artist, album) {
    return call("get_cover_for_service", service, title, artist, album);
}
function getCoverSource() {
    return call("get_cover_source");
}
function setCoverSource(source) {
    return call("set_cover_source", source);
}
function playPause() {
    return call("play_pause");
}
function pauseExternalPlayback() {
    return call("pause_external_playback");
}
function nextTrack() {
    return call("next");
}
function previousTrack() {
    return call("previous");
}
function openSpotify() {
    return call("open_spotify");
}
function openTidal() {
    return call("open_tidal");
}
function openAppleMusic() {
    return call("open_apple_music");
}
function openDeezer() {
    return call("open_deezer");
}
function openAmazonMusic() {
    return call("open_amazon_music");
}
function openSoundCloud() {
    return call("open_soundcloud");
}
function shuffle() {
    return call("shuffle");
}
function repeat() {
    return call("repeat");
}
function getAppVolume(service = "") {
    return call("get_app_volume", service);
}
let lastVolumeRevision = Date.now() * 1000;
function setAppVolume(volume, service = "") {
    lastVolumeRevision = Math.max(lastVolumeRevision + 1, Date.now() * 1000);
    return call("set_app_volume", volume, service, lastVolumeRevision);
}
function exportDiagnosticLog() {
    return call("export_diagnostic_log");
}
function restartPluginServices() {
    const request = call("restart_plugin_services");
    return new Promise((resolve) => {
        const timer = globalThis.setTimeout(() => resolve({ ok: false, message: "Plugin service recovery exceeded 35 seconds. Export diagnostics for details." }), 35000);
        request.then((result) => {
            globalThis.clearTimeout(timer);
            resolve(result);
        }).catch((error) => {
            globalThis.clearTimeout(timer);
            resolve({ ok: false, message: String(error?.message ?? error ?? "Plugin service restart failed") });
        });
    });
}
function reportDiagnosticEvent(category, event, details = {}) {
    return call("report_diagnostic_event", category, event, details);
}
function isMusicAppRunning(appKey) {
    return call("is_music_app_running", appKey);
}
function closeMusicApp(appKey) {
    return call("close_music_app", appKey);
}
function getSpotifySettings() {
    return call("get_spotify_settings");
}
function setSpotifyCompactSavedTracks(enabled) {
    return call("set_spotify_compact_saved_tracks", enabled);
}
function refreshSpotifyCache() {
    return call("refresh_spotify_cache");
}
function setSpotifyAudioQuality(quality) {
    return call("set_spotify_audio_quality", quality);
}
function clearSpotifyAudioCache() {
    return call("clear_spotify_audio_cache");
}
function setSpotifyClientId(clientId) {
    return call("set_spotify_client_id", clientId);
}
function beginSpotifyAuth() {
    return call("begin_spotify_auth");
}
function getSpotifyAuthStatus() {
    return call("get_spotify_auth_status");
}
function disconnectSpotify() {
    return call("disconnect_spotify");
}
function openSpotifyDashboard() {
    return call("open_spotify_dashboard");
}
function openExternalUrl(url) {
    return call("open_external_url", url);
}
function spotifyGetHome() {
    return call("spotify_get_home");
}
function spotifySearch(query, offset = 0) {
    return call("spotify_search", query, offset);
}
function spotifyGetLibrary(section, offset = 0, maxItems = 300) {
    return call("spotify_get_library", section, offset, maxItems);
}
function spotifyGetDetail(kind, itemId) {
    return call("spotify_get_detail", kind, itemId);
}
function spotifyGetCurrentAlbum(title, artist, album) {
    return call("spotify_get_current_album", title, artist, album);
}
function getSpotifyApiStatus() {
    return call("get_spotify_api_status");
}
function spotifyGetPlaybackState() {
    return call("spotify_get_playback_state");
}
function spotifyPlayerCommand(command, value = -1) {
    return call("spotify_player_command", command, value);
}
function spotifyPlay(uri, contextUri = "", offsetUri = "") {
    return call("spotify_play", uri, contextUri, offsetUri);
}
function spotifyPlayItems(uris, startIndex = 0) {
    return call("spotify_play_items", uris, startIndex);
}
function searchArtistBackgrounds(provider, artistId, artistName, source = "all") {
    return call("search_artist_backgrounds", provider, artistId, artistName, source);
}
function applyArtistBackground(provider, artistId, artistName, candidateId) {
    return call("apply_artist_background", provider, artistId, artistName, candidateId);
}
function buildSpotifyArtistCache() {
    return call("build_spotify_artist_cache");
}
function getSpotifyArtistCacheProgress() {
    return call("get_spotify_artist_cache_progress");
}
function getSpotifyArtistCacheStats() {
    return call("get_spotify_artist_cache_stats");
}
function clearSpotifyArtistCache() {
    return call("clear_spotify_artist_cache");
}
function clearManualArtistBackgrounds(provider) {
    return call("clear_manual_artist_backgrounds", provider);
}
function getArtistBackgroundProviderSettings() {
    return call("get_artist_background_provider_settings");
}
function setFanartApiKey(apiKey) {
    return call("set_fanart_api_key", apiKey);
}
function setActiveService(service) {
    return call("set_active_service", service);
}
function getActiveService() {
    return call("get_active_service");
}
function getLocalMusicSettings() {
    return call("get_local_music_settings");
}
function addLocalMusicFolder(folder) {
    return call("add_local_music_folder", folder);
}
function removeLocalMusicFolder(folder) {
    return call("remove_local_music_folder", folder);
}
function listLocalMusicDirectory(path) {
    return call("list_local_music_directory", path);
}
function addLocalMusicFile(path) {
    return call("add_local_music_file", path);
}
function removeLocalMusicFile(path) {
    return call("remove_local_music_file", path);
}
function scanLocalMusic() {
    return call("scan_local_music");
}
function getLocalMusicHome() {
    return call("get_local_music_home");
}
function getLocalMusicLibrary(section, offset = 0, limit = 300) {
    return call("get_local_music_library", section, offset, limit);
}
function searchLocalMusic(query) {
    return call("search_local_music", query);
}
function getLocalMusicDetail(kind, itemId) {
    return call("get_local_music_detail", kind, itemId);
}
function getArtistBackground(artistName) {
    return call("get_artist_background", artistName);
}
function getLocalMusicCover(coverId) {
    return call("get_local_music_cover", coverId);
}
function getLocalMusicArtistProfile(artistId, artistName) {
    return call("get_local_music_artist_profile", artistId, artistName);
}
function clearLocalMusicCache() {
    return call("clear_local_music_cache");
}
function buildLocalMusicCache() {
    return call("build_local_music_cache");
}
function getLocalMusicCacheProgress() {
    return call("get_local_music_cache_progress");
}
function updateLocalMusicFrontendState(state) {
    return call("update_local_music_frontend_state", state);
}
function getLocalMusicStreamBase() {
    return call("get_local_music_stream_base");
}
function openLocalMusic() {
    return call("open_local_music");
}

var en = {
	core: {
		back: "Back",
		coverFailed: "cover fetch failed",
		coverSourceOnline: "Online | High resolution",
		coverSourceWindows: "Windows | Faster",
		effectCoverBlur: "Cover Blur",
		effectEnergySaver: "Energy Saver",
		effectGlow: "Glow",
		effectOcean: "Ocean",
		localMusicLabel: "Your Music",
		notPlaying: "Play something",
		openApp: "Open {app}",
		closeApp: "Close {app}",
		refreshFailed: "Now playing refresh failed",
		restartServices: "Restart plugin services",
		restartServicesDescription: "Restarts MediaBridge and the bundled Now Playing helpers without restarting Steam.",
		restartServicesFailed: "Unable to restart plugin services",
		restartServicesSuccess: "Plugin services restarted",
		settingsApps: "Source",
		settingsCoverSource: "Album cover display",
		settingsFullscreenEffect: "Fullscreen visual effects",
		settingsLabel: "Settings",
		settingsRecovery: "Recovery",
		topbarLeft: "Move clock and track to the left",
		topbarSection: "Top bar",
		topbarTrack: "Show track in the top bar",
		unknownAlbum: "Unknown album",
		unknownArtist: "Unknown artist",
		volume: "Volume",
		openCurrentAlbum: "Open current album",
		autoLaunchSources: "Automatically open source apps",
		autoLaunchSourcesDescription: "Opens the selected service app only when it is not already running.",
		closeSourcesOnSwitch: "Close the previous source app",
		closeSourcesOnSwitchDescription: "Closes the previous service app after playback has been paused when you switch source.",
		artistBackgroundSettings: "Background settings",
		chooseArtistBackground: "Choose artist background",
		artistBackgroundDescription: "Choose an online image. The selected background is downloaded, saved locally and used for this artist.",
		searchingBackgrounds: "Searching for available backgrounds…",
		noBackgroundsFound: "No suitable backgrounds were found.",
		resolution: "Resolution",
		downloadAndApply: "Download and apply",
		downloadingBackground: "Downloading background…",
		backgroundApplied: "Background downloaded and applied",
		backgroundApplyFailed: "Unable to apply the background",
		refreshBackgrounds: "Search again",
		currentBackground: "Current background",
		restartServicesInProgress: "Restarting plugin services…",
		backgroundSource: "Background source",
		allBackgroundSources: "All sources",
		spotifyBackgroundSource: "Spotify",
		fanartBackgroundSource: "fanart.tv",
		exportDiagnosticLog: "Export diagnostic log",
		diagnosticLogDescription: "Creates a safe diagnostic file in Downloads with player, MediaBridge and artwork errors. API keys and tokens are removed.",
		diagnosticLogExported: "Diagnostic log saved to {path}",
		diagnosticLogExportFailed: "Could not export the diagnostic log",
		backgroundSearchTimedOut: "Background search timed out. Try again."
	},
	spotify: {
		album: "Album",
		albums: "Albums",
		albumsAndSingles: "Albums and singles",
		apiPaused: "API paused · {time}",
		apiPausedTitle: "API paused",
		apiPausedWait: "Wait a little longer",
		apiPausedDetail: "Spotify API is temporarily paused. Try again in {time}. Local playback controls remain available.",
		appDescriptionCopied: "App description copied",
		appDescriptionLabel: "App description* (required)",
		appDescriptionValue: "Personal Spotify Web API connection for the Now Playing Decky Loader plugin on Windows.",
		appNameCopied: "App name copied",
		appNameLabel: "App name* (required)",
		appNameValue: "Playhub Now Playing",
		artist: "Artist",
		artists: "Artists",
		audioQuality: "Audio quality",
		back: "Back",
		cacheExplanation: "Spotify library data is cached locally. Use Refresh only when you want Now Playing to call Spotify again and update the cached content.",
		clearMusicCache: "Clear Spotify music cache",
		clearingMusicCache: "Clearing Spotify music cache...",
		changeInSettings: "Change in Settings",
		clientId: "Spotify Client ID",
		clientIdSaved: "Client ID saved",
		compactSavedTracks: "Compact saved tracks view",
		compactSavedTracksCard: "To reduce Spotify API usage, saved tracks are shown as Play and Shuffle actions by default instead of loading the entire list.",
		compactSavedTracksDescription: "Enabled by default. Saved tracks show Play and Shuffle without loading the full list, reducing Spotify API requests.",
		completeSignIn: "Complete the sign-in in your browser, then return to Steam.",
		connect: "Connect Spotify",
		connected: "Connected",
		connectedAs: "Connected as {name}",
		hideDetails: "Hide details",
		showDetails: "Show details",
		copyAppDescription: "Copy app description",
		copyAppName: "Copy app name",
		copyRedirectUri: "Copy redirect URI",
		developerTerms: "Accept the Developer Terms of Service and Design Guidelines, then click Save.",
		disconnect: "Disconnect Spotify",
		enableSpotify: "Enable Spotify",
		followedArtists: "Artists",
		fullscreen: "Fullscreen",
		genericError: "Something went wrong",
		home: "Home",
		library: "Library",
		limitedPlaylist: "Spotify only exposes track lists for playlists you own or collaborate on. You can still play this playlist.",
		loadingSpotify: "Loading Spotify…",
		noAlbums: "No albums available.",
		noPlayback: "Play something",
		noResults: "No results found.",
		noTracks: "No tracks available.",
		nothingHere: "Nothing here yet.",
		nowPlaying: "Now playing",
		openDashboard: "Spotify Developer Dashboard",
		personalMode: "Personal Web API mode",
		play: "Play",
		playlist: "Playlist",
		playlists: "Playlists",
		popularTracks: "Popular tracks",
		premiumNote: "Spotify Premium is required for playback control in Development Mode. Your Client ID and authorization tokens stay on this PC.",
		queue: "Queue",
		queueEmpty: "There are no upcoming tracks.",
		redirectCopied: "Redirect URL copied",
		redirectUri: "Redirect URL",
		refresh: "Refresh",
		repeat: "Repeat",
		requestFailed: "Spotify request failed",
		saveClientId: "Save Client ID",
		savedAlbums: "Albums",
		savedTracks: "Saved tracks",
		search: "Search",
		searchSpotify: "Search Spotify",
		seeAll: "See all",
		selectSpotifyHint: "Select Spotify in the Source section to show the Spotify browser in Now Playing.",
		settings: "Settings",
		settingsDescription: "Browse your Spotify library, search the catalog and play directly through Playhub Now Playing. Connect your own Spotify developer Client ID to continue.",
		setupGuide: "Setup guide",
		setupSteps: [
			"Open the Spotify Developer site, click “Log in” in the top-right corner and sign in to your Spotify account.",
			"After signing in, click your profile in the top-right corner, choose “Dashboard”, then click “Create app”.",
			"In “App name* (required)”, enter the app name shown below.",
			"In “App description* (required)”, enter the description shown below.",
			"Leave “Website” empty.",
			"In “Redirect URIs* (required)”, add the URL shown below exactly as written.",
			"Under “Which API/SDKs are you planning to use?”, select both “Web API” and “Web Playback SDK”. Do not select Ads API, iOS or Android.",
			"Accept the Developer Terms of Service and Design Guidelines, then click Save.",
			"Open the new app, copy its Client ID, paste it below and connect Spotify. A Client Secret is not required."
		],
		showLess: "Show less",
		shuffle: "Shuffle",
		spotifyBigPicture: "Big Picture",
		tracks: "Tracks",
		unableStartAuthorization: "Unable to start Spotify authorization",
		unableStartPlayback: "Unable to start playback",
		untitled: "Untitled",
		volume: "Volume",
		webApiOnly: "Select Web API and Web Playback SDK",
		websiteOptional: "Website — optional",
		welcomeBack: "Welcome back, {name}",
		yourMusicInsideSteam: "Your music, inside Steam",
		yourPlaylists: "Your playlists",
		artistCacheTitle: "Artist background cache",
		artistCacheDescription: "Downloads high-resolution backgrounds only for the artists you follow on Spotify.",
		createArtistCache: "Create artist background cache",
		artistCacheBuilding: "Creating artist background cache…",
		artistCacheProgress: "Downloading background: {name}",
		artistCacheCreated: "Spotify artist background cache created",
		artistCacheNoFavorites: "No followed artists were found.",
		clearArtistCache: "Clear artist background cache",
		artistCacheClearing: "Clearing artist background cache…",
		artistCacheCleared: "Spotify artist background cache cleared",
		cacheSize: "Downloaded assets",
		newForYou: "Recommended for you",
		manualBackgrounds: "User-selected backgrounds",
		musicCacheDescription: "Spotify audio is cached locally up to 1 GB. Older files are removed automatically when the limit is reached.",
		manualBackgroundsDescription: "These artist backgrounds are kept when the image cache is cleared.",
		removeManualBackgrounds: "Remove all selected artist backgrounds",
		manualBackgroundsRemoving: "Removing selected artist backgrounds…",
		manualBackgroundsRemoved: "Selected artist backgrounds removed"
	},
	localMusic: {
		albums: "Albums",
		albumsCount: "Albums",
		artist: "Artist",
		artists: "Artists",
		artistsCount: "Artists",
		back: "Back",
		bigPicture: "Big Picture",
		cacheBuilding: "Creating image cache…",
		cacheCleared: "Image cache cleared",
		cacheCreated: "Image cache created",
		chooseFolder: "Choose music folder",
		chooseSomething: "Play something",
		clearCache: "Clear image cache",
		createCache: "Create image cache",
		formats: "MP3, AAC, M4A, FLAC, OGG, Opus and WAV are played through Steam Chromium. WMA, AIFF, APE, WavPack and MKA remain indexed when their metadata can be read.",
		fullscreen: "Fullscreen",
		home: "Home",
		library: "Library",
		noFolders: "No music folders added yet.",
		noResults: "No results found.",
		nothingHere: "Your local library is empty. Choose a folder and scan it from Settings.",
		nowPlaying: "Now playing",
		openFolderError: "Unable to open the Decky folder picker",
		play: "Play",
		playerError: "Local music player error",
		queue: "Queue",
		queueEmpty: "There are no upcoming tracks.",
		recentAlbums: "Recently added albums",
		remove: "Remove",
		repeat: "Repeat",
		scan: "Scan library",
		scanComplete: "Local music library updated",
		scanning: "Scanning library…",
		search: "Search",
		searchMusic: "Search Your Music",
		settings: "Settings",
		settingsDescription: "Choose one or more folders. Now Playing scans all subfolders, reads embedded tags and artwork, and builds a controller-friendly local music library.",
		shuffle: "Shuffle",
		tracks: "Tracks",
		tracksCount: "Tracks",
		volume: "Volume",
		yourMusic: "Your Music",
		cacheProgressScanning: "Scanning the music library…",
		cacheProgressProfile: "Downloading artist image: {name}",
		cacheProgressBackground: "Downloading artist background: {name}",
		cacheSize: "Downloaded assets",
		cacheProgressRemoving: "Removing cached asset: {name}",
		cacheClearing: "Clearing image cache…",
		fanartProvider: "fanart.tv",
		fanartProviderDescription: "Optional: add a personal fanart.tv API key to include its high-resolution artist backgrounds in search results and cache creation.",
		fanartApiKey: "fanart.tv API key",
		fanartApiPage: "Get the API",
		saveFanartApiKey: "Save fanart.tv API key",
		saved: "Saved",
		manualBackgrounds: "User-selected backgrounds",
		manualBackgroundsDescription: "These artist backgrounds are kept when the image cache is cleared.",
		removeManualBackgrounds: "Remove all selected artist backgrounds",
		manualBackgroundsRemoving: "Removing selected artist backgrounds…",
		manualBackgroundsRemoved: "Selected artist backgrounds removed",
		pickerTitle: "Choose local music",
		addCurrentFolder: "Add this folder",
		openPath: "Go",
		noAudioFiles: "No folders or supported audio files here."
	},
	runtime: {
		localMediaError: "Unable to play the local audio file",
		noPlayableLocalTracks: "No playable local tracks",
		localPlaybackStartFailed: "Unable to start local playback",
		localAudioRecoveryFailed: "Local audio recovery failed",
		openCurrentSpotifyAlbumFailed: "Unable to open the current Spotify album",
		openCurrentLocalAlbumFailed: "Unable to open the current local album",
		unsupportedLocalFormat: "This audio format is not supported by Steam Chromium",
		localPlayerUnavailable: "The local audio player is unavailable",
		currentLocalAlbumUnavailable: "The current local album is unavailable",
		currentSpotifyAlbumUnavailable: "The current Spotify album is unavailable",
		windowsOnly: "This plugin works only on Windows",
		helperStartFailed: "The plugin helper could not be started correctly",
		folderNotFound: "Folder not found",
		localTrackNotFound: "Local music track not found",
		localFileUnavailable: "The local music file is unavailable",
		localPlayerNotRunning: "The local music player is not running",
		localPlayerNoResponse: "The local music player did not respond",
		spotifyInvalidTokenResponse: "Spotify returned an invalid token response",
		spotifyAuthorizationExpired: "The Spotify authorization session expired",
		spotifyFinishingConnection: "Finishing the Spotify connection…",
		spotifyEnterClientId: "Enter your Spotify Client ID first",
		spotifyWaitingAuthorization: "Waiting for Spotify authorization…",
		spotifyNotConnected: "Spotify is not connected",
		spotifyRefreshTokenFailed: "Spotify did not return a new access token",
		spotifyInvalidApiPath: "Invalid Spotify API path",
		spotifyInvalidResponse: "Spotify returned an invalid response",
		spotifyActionDenied: "Spotify denied this action. Premium or an additional permission may be required",
		spotifyNoActiveDevice: "Spotify could not find an active playback device",
		spotifyDisabled: "Spotify is disabled",
		spotifyConnectFirst: "Connect Spotify in the plugin settings first",
		spotifyUnknownLibrarySection: "Unknown Spotify library section",
		spotifyInvalidItem: "Invalid Spotify item",
		spotifyNoCurrentAlbum: "No Spotify album is available for the current track",
		spotifyAlbumLookupFailed: "Spotify could not find the album for the current track",
		spotifyOpenAppStartTrack: "Open Spotify on this PC, start any song once, then try again",
		spotifyUnknownPlayerCommand: "Unknown Spotify player command",
		spotifyNoPlayableItems: "No playable Spotify items",
		spotifyMissingUri: "Missing Spotify URI",
		spotifyInvalidUri: "Invalid Spotify URI",
		backgroundChoiceExpired: "This background choice has expired. Search again.",
		invalidBackgroundChoice: "This background choice is no longer valid.",
		backgroundDownloadFailed: "The selected image could not be downloaded.",
		unsupportedBackgroundImage: "The selected image format is not supported.",
		invalidArtist: "The selected artist is not valid.",
		artistNameRequired: "An artist name is required.",
		spotifyArtistCacheBusy: "The Spotify artist cache is already being created.",
		spotifyArtistCacheInUse: "The Spotify artist cache is busy.",
		restartServicesTimedOut: "Plugin service restart timed out",
		restartServicesAlreadyRunning: "A plugin service restart is already running",
		mediaBridgeRestartFailed: "MediaBridge did not restart correctly",
		pluginServiceRestartFailed: "Plugin service restart failed"
	}
};
var it = {
	core: {
		back: "Indietro",
		coverFailed: "recupero copertina non riuscito",
		coverSourceOnline: "Online | Alta risoluzione",
		coverSourceWindows: "Windows | Più rapida",
		effectCoverBlur: "Cover Blur",
		effectEnergySaver: "Risparmio energia",
		effectGlow: "Bagliore",
		effectOcean: "Oceano",
		localMusicLabel: "La tua musica",
		notPlaying: "Riproduci qualcosa",
		openApp: "Apri {app}",
		closeApp: "Chiudi {app}",
		refreshFailed: "Aggiornamento Now playing non riuscito",
		restartServices: "Riavvia i servizi del plugin",
		restartServicesDescription: "Riavvia MediaBridge e gli helper inclusi in Now Playing senza riavviare Steam.",
		restartServicesFailed: "Impossibile riavviare i servizi del plugin",
		restartServicesSuccess: "Servizi del plugin riavviati",
		settingsApps: "Sorgente",
		settingsCoverSource: "Visualizzazione cover album",
		settingsFullscreenEffect: "Effetti visivi fullscreen",
		settingsLabel: "Impostazioni",
		settingsRecovery: "Ripristino",
		topbarLeft: "Sposta orario e brano a sinistra",
		topbarSection: "Barra superiore",
		topbarTrack: "Visualizza brano nella top bar",
		unknownAlbum: "Album sconosciuto",
		unknownArtist: "Artista sconosciuto",
		volume: "Volume",
		openCurrentAlbum: "Apri album corrente",
		autoLaunchSources: "Apri automaticamente le app delle sorgenti",
		autoLaunchSourcesDescription: "Apre l’app del servizio selezionato solo se non è già in esecuzione.",
		closeSourcesOnSwitch: "Chiudi l’app della sorgente precedente",
		closeSourcesOnSwitchDescription: "Quando cambi sorgente, mette in pausa la riproduzione e chiude l’app del servizio precedente.",
		artistBackgroundSettings: "Impostazioni sfondo",
		chooseArtistBackground: "Scegli lo sfondo dell’artista",
		artistBackgroundDescription: "Scegli un’immagine online. Lo sfondo selezionato verrà scaricato, salvato localmente e usato per questo artista.",
		searchingBackgrounds: "Ricerca degli sfondi disponibili…",
		noBackgroundsFound: "Non è stato trovato alcuno sfondo adatto.",
		resolution: "Risoluzione",
		downloadAndApply: "Scarica e applica",
		downloadingBackground: "Download dello sfondo…",
		backgroundApplied: "Sfondo scaricato e applicato",
		backgroundApplyFailed: "Impossibile applicare lo sfondo",
		refreshBackgrounds: "Cerca di nuovo",
		currentBackground: "Sfondo attuale",
		restartServicesInProgress: "Riavvio dei servizi del plugin…",
		backgroundSource: "Fonte degli sfondi",
		allBackgroundSources: "Tutte le fonti",
		spotifyBackgroundSource: "Spotify",
		fanartBackgroundSource: "fanart.tv",
		exportDiagnosticLog: "Esporta log diagnostico",
		diagnosticLogDescription: "Crea in Download un file diagnostico sicuro con stato del player, MediaBridge ed errori degli artwork. Chiavi API e token vengono rimossi.",
		diagnosticLogExported: "Log diagnostico salvato in {path}",
		diagnosticLogExportFailed: "Impossibile esportare il log diagnostico",
		backgroundSearchTimedOut: "La ricerca degli sfondi ha impiegato troppo tempo. Riprova."
	},
	spotify: {
		album: "Album",
		albums: "Album",
		albumsAndSingles: "Album e singoli",
		apiPaused: "API in pausa · {time}",
		apiPausedTitle: "API in pausa",
		apiPausedWait: "Attendi ancora",
		apiPausedDetail: "L’API Spotify è temporaneamente in pausa. Riprova tra {time}. I controlli locali del player restano disponibili.",
		appDescriptionCopied: "Descrizione app copiata",
		appDescriptionLabel: "App description* (required)",
		appDescriptionValue: "Connessione personale Spotify Web API per il plugin Now Playing di Decky Loader su Windows.",
		appNameCopied: "Nome app copiato",
		appNameLabel: "App name* (required)",
		appNameValue: "Playhub Now Playing",
		artist: "Artista",
		artists: "Artisti",
		back: "Indietro",
		audioQuality: "Qualità audio",
		cacheExplanation: "I dati della libreria Spotify vengono salvati in cache locale. Usa Aggiorna solo quando vuoi chiamare nuovamente Spotify e aggiornare i contenuti in cache.",
		clearMusicCache: "Svuota la cache musicale di Spotify",
		clearingMusicCache: "Svuotamento della cache musicale di Spotify…",
		musicCacheDescription: "L’audio di Spotify viene salvato nella cache locale fino a 1 GB. I file più vecchi vengono rimossi automaticamente al raggiungimento del limite.",
		changeInSettings: "Modifica nelle impostazioni",
		clientId: "Client ID Spotify",
		clientIdSaved: "Client ID salvato",
		compactSavedTracks: "Brani salvati compatti",
		compactSavedTracksCard: "Per limitare l’utilizzo dell’API Spotify, i brani salvati mostrano per impostazione predefinita solo le azioni Riproduci e Casuale invece dell’elenco completo.",
		compactSavedTracksDescription: "Attiva per impostazione predefinita. I brani salvati mostrano Riproduci e Casuale senza caricare l’elenco completo, riducendo le richieste all’API Spotify.",
		completeSignIn: "Completa l'accesso nel browser, poi torna a Steam.",
		connect: "Collega Spotify",
		connected: "Collegato",
		connectedAs: "Collegato come {name}",
		hideDetails: "Nascondi dettagli",
		showDetails: "Mostra dettagli",
		copyAppDescription: "Copia descrizione app",
		copyAppName: "Copia nome app",
		copyRedirectUri: "Copia URI di reindirizzamento",
		developerTerms: "Accetta i Developer Terms of Service e le Design Guidelines, poi clicca Save.",
		disconnect: "Disconnetti Spotify",
		enableSpotify: "Abilita Spotify",
		followedArtists: "Artisti",
		fullscreen: "Schermo intero",
		genericError: "Qualcosa è andato storto",
		home: "Home",
		library: "Libreria",
		limitedPlaylist: "Spotify mostra i brani solo per le playlist che possiedi o a cui collabori. Puoi comunque riprodurre questa playlist.",
		loadingSpotify: "Caricamento di Spotify…",
		noAlbums: "Nessun album disponibile.",
		noPlayback: "Riproduci qualcosa",
		noResults: "Nessun risultato.",
		noTracks: "Nessun brano disponibile.",
		nothingHere: "Non c'è ancora nulla qui.",
		nowPlaying: "In riproduzione",
		openDashboard: "Spotify Developer Dashboard",
		personalMode: "Modalità Web API personale",
		play: "Riproduci",
		playlist: "Playlist",
		playlists: "Playlist",
		popularTracks: "Brani più popolari",
		premiumNote: "Spotify Premium è necessario per controllare la riproduzione in Development Mode. Il Client ID e i token di autorizzazione restano su questo PC.",
		queue: "Coda",
		queueEmpty: "Non ci sono brani successivi in coda.",
		redirectCopied: "URL di indirizzamento copiato",
		redirectUri: "URL di indirizzamento",
		refresh: "Aggiorna",
		repeat: "Ripeti",
		requestFailed: "Richiesta Spotify non riuscita",
		saveClientId: "Salva Client ID",
		savedAlbums: "Album",
		savedTracks: "Brani salvati",
		search: "Cerca",
		searchSpotify: "Cerca su Spotify",
		seeAll: "Vedi tutti",
		selectSpotifyHint: "Seleziona Spotify nella sezione Sorgente per mostrare il browser Spotify in Now Playing.",
		settings: "Impostazioni",
		settingsDescription: "Sfoglia la tua libreria Spotify, cerca nel catalogo e avvia la riproduzione nell'app desktop di Spotify. Questa modalità opzionale usa il tuo Client ID sviluppatore Spotify.",
		setupGuide: "Guida alla configurazione",
		setupSteps: [
			"Apri il sito Spotify Developer, clicca “Log in” in alto a destra ed effettua l'accesso al tuo account Spotify.",
			"Dopo l'accesso, clicca il tuo profilo in alto a destra, seleziona “Dashboard” e poi clicca “Create app”.",
			"Nel campo “App name* (required)” inserisci il nome mostrato qui sotto.",
			"Nel campo “App description* (required)” inserisci la descrizione mostrata qui sotto.",
			"Lascia “Website” vuoto.",
			"Nel campo “Redirect URIs* (required)” aggiungi esattamente l'URL mostrato qui sotto.",
			"In “Which API/SDKs are you planning to use?” seleziona sia “Web API” sia “Web Playback SDK”. Non selezionare Ads API, iOS o Android.",
			"Accetta i Developer Terms of Service e le Design Guidelines, poi clicca Save.",
			"Apri la nuova app, copia il Client ID, incollalo qui sotto e collega Spotify. Il Client Secret non è necessario."
		],
		showLess: "Mostra meno",
		shuffle: "Casuale",
		spotifyBigPicture: "Big Picture",
		tracks: "Brani",
		unableStartAuthorization: "Impossibile avviare l’autorizzazione Spotify",
		unableStartPlayback: "Impossibile avviare la riproduzione",
		untitled: "Senza titolo",
		volume: "Volume",
		webApiOnly: "Seleziona Web API e Web Playback SDK",
		websiteOptional: "Website — facoltativo",
		welcomeBack: "Bentornato, {name}",
		yourMusicInsideSteam: "La tua musica, dentro Steam",
		yourPlaylists: "Le tue playlist",
		artistCacheTitle: "Cache sfondi artisti",
		artistCacheDescription: "Scarica sfondi in alta risoluzione soltanto per gli artisti che segui su Spotify.",
		createArtistCache: "Crea cache sfondi artisti",
		artistCacheBuilding: "Creazione cache sfondi artisti…",
		artistCacheProgress: "Download sfondo: {name}",
		artistCacheCreated: "Cache degli sfondi Spotify creata",
		artistCacheNoFavorites: "Non è stato trovato alcun artista seguito.",
		clearArtistCache: "Svuota cache sfondi artisti",
		artistCacheClearing: "Svuotamento cache sfondi artisti…",
		artistCacheCleared: "Cache sfondi artisti Spotify svuotata",
		cacheSize: "Asset scaricati",
		newForYou: "Consigliati per te",
		manualBackgrounds: "Sfondi scelti dall’utente",
		manualBackgroundsDescription: "Questi sfondi degli artisti vengono mantenuti quando svuoti la cache immagini.",
		removeManualBackgrounds: "Rimuovi tutti gli sfondi scelti per gli artisti",
		manualBackgroundsRemoving: "Rimozione degli sfondi scelti per gli artisti…",
		manualBackgroundsRemoved: "Sfondi scelti per gli artisti rimossi"
	},
	localMusic: {
		albums: "Album",
		albumsCount: "Album",
		artist: "Artista",
		artists: "Artisti",
		artistsCount: "Artisti",
		back: "Indietro",
		bigPicture: "Big Picture",
		cacheBuilding: "Creazione cache in corso…",
		cacheCleared: "Cache immagini svuotata",
		cacheCreated: "Cache immagini creata",
		chooseFolder: "Scegli cartella musicale",
		chooseSomething: "Riproduci qualcosa",
		clearCache: "Svuota cache immagini",
		createCache: "Crea cache immagini",
		formats: "MP3, AAC, M4A, FLAC, OGG, Opus e WAV vengono riprodotti tramite Chromium di Steam. WMA, AIFF, APE, WavPack e MKA restano indicizzati quando i metadati sono leggibili.",
		fullscreen: "Schermo intero",
		home: "Home",
		library: "Libreria",
		noFolders: "Non hai ancora aggiunto cartelle musicali.",
		noResults: "Nessun risultato.",
		nothingHere: "La libreria locale è vuota. Scegli una cartella e analizzala dalle Impostazioni.",
		nowPlaying: "In riproduzione",
		openFolderError: "Impossibile aprire il selettore cartelle di Decky",
		play: "Riproduci",
		playerError: "Errore del player musicale locale",
		queue: "Coda",
		queueEmpty: "Non ci sono brani successivi in coda.",
		recentAlbums: "Album aggiunti di recente",
		remove: "Rimuovi",
		repeat: "Ripeti",
		scan: "Analizza libreria",
		scanComplete: "Libreria musicale locale aggiornata",
		scanning: "Analisi della libreria…",
		search: "Cerca",
		searchMusic: "Cerca in La tua musica",
		settings: "Impostazioni",
		settingsDescription: "Scegli una o più cartelle. Now Playing analizza tutte le sottocartelle, legge tag e copertine incorporate e crea una libreria locale navigabile con il controller.",
		shuffle: "Casuale",
		tracks: "Brani",
		tracksCount: "Brani",
		volume: "Volume",
		yourMusic: "La tua musica",
		cacheProgressScanning: "Scansione della libreria musicale…",
		cacheProgressProfile: "Download immagine artista: {name}",
		cacheProgressBackground: "Download sfondo artista: {name}",
		cacheSize: "Asset scaricati",
		cacheProgressRemoving: "Rimozione asset dalla cache: {name}",
		cacheClearing: "Svuotamento cache immagini…",
		fanartProvider: "fanart.tv",
		fanartProviderDescription: "Facoltativo: aggiungi una chiave API personale di fanart.tv per includere i suoi sfondi degli artisti in alta risoluzione nei risultati e nella creazione della cache.",
		fanartApiKey: "Chiave API fanart.tv",
		fanartApiPage: "Ottieni la API",
		saveFanartApiKey: "Salva chiave API fanart.tv",
		saved: "Salvato",
		manualBackgrounds: "Sfondi scelti dall’utente",
		manualBackgroundsDescription: "Questi sfondi degli artisti vengono mantenuti quando svuoti la cache immagini.",
		removeManualBackgrounds: "Rimuovi tutti gli sfondi scelti per gli artisti",
		manualBackgroundsRemoving: "Rimozione degli sfondi scelti per gli artisti…",
		manualBackgroundsRemoved: "Sfondi scelti per gli artisti rimossi",
		pickerTitle: "Scegli musica locale",
		addCurrentFolder: "Aggiungi questa cartella",
		openPath: "Vai",
		noAudioFiles: "Qui non ci sono cartelle o file audio supportati."
	},
	runtime: {
		localMediaError: "Impossibile riprodurre il file audio locale",
		noPlayableLocalTracks: "Nessun brano locale riproducibile",
		localPlaybackStartFailed: "Impossibile avviare la riproduzione locale",
		localAudioRecoveryFailed: "Ripristino dell’audio locale non riuscito",
		openCurrentSpotifyAlbumFailed: "Impossibile aprire l’album Spotify corrente",
		openCurrentLocalAlbumFailed: "Impossibile aprire l’album locale corrente",
		unsupportedLocalFormat: "Questo formato audio non è supportato da Chromium di Steam",
		localPlayerUnavailable: "Il player audio locale non è disponibile",
		currentLocalAlbumUnavailable: "L’album locale corrente non è disponibile",
		currentSpotifyAlbumUnavailable: "L’album Spotify corrente non è disponibile",
		windowsOnly: "Questo plugin funziona solo su Windows",
		helperStartFailed: "Impossibile avviare correttamente l’helper del plugin",
		folderNotFound: "Cartella non trovata",
		localTrackNotFound: "Brano locale non trovato",
		localFileUnavailable: "Il file musicale locale non è disponibile",
		localPlayerNotRunning: "Il player musicale locale non è in esecuzione",
		localPlayerNoResponse: "Il player musicale locale non risponde",
		spotifyInvalidTokenResponse: "Spotify ha restituito una risposta token non valida",
		spotifyAuthorizationExpired: "La sessione di autorizzazione Spotify è scaduta",
		spotifyFinishingConnection: "Completamento della connessione a Spotify…",
		spotifyEnterClientId: "Inserisci prima il Client ID di Spotify",
		spotifyWaitingAuthorization: "In attesa dell’autorizzazione Spotify…",
		spotifyNotConnected: "Spotify non è collegato",
		spotifyRefreshTokenFailed: "Spotify non ha restituito un nuovo token di accesso",
		spotifyInvalidApiPath: "Percorso API Spotify non valido",
		spotifyInvalidResponse: "Spotify ha restituito una risposta non valida",
		spotifyActionDenied: "Spotify ha negato questa azione. Potrebbe essere richiesto Premium o un permesso aggiuntivo",
		spotifyNoActiveDevice: "Spotify non ha trovato un dispositivo di riproduzione attivo",
		spotifyDisabled: "Spotify è disabilitato",
		spotifyConnectFirst: "Collega prima Spotify nelle impostazioni del plugin",
		spotifyUnknownLibrarySection: "Sezione della libreria Spotify sconosciuta",
		spotifyInvalidItem: "Elemento Spotify non valido",
		spotifyNoCurrentAlbum: "Nessun album Spotify disponibile per il brano corrente",
		spotifyAlbumLookupFailed: "Spotify non è riuscito a trovare l’album del brano corrente",
		spotifyOpenAppStartTrack: "Apri Spotify su questo PC, avvia una canzone e riprova",
		spotifyUnknownPlayerCommand: "Comando del player Spotify sconosciuto",
		spotifyNoPlayableItems: "Nessun elemento Spotify riproducibile",
		spotifyMissingUri: "URI Spotify mancante",
		spotifyInvalidUri: "URI Spotify non valido",
		backgroundChoiceExpired: "Questa scelta dello sfondo è scaduta. Esegui di nuovo la ricerca.",
		invalidBackgroundChoice: "Questa scelta dello sfondo non è più valida.",
		backgroundDownloadFailed: "Non è stato possibile scaricare l’immagine selezionata.",
		unsupportedBackgroundImage: "Il formato dell’immagine selezionata non è supportato.",
		invalidArtist: "L’artista selezionato non è valido.",
		artistNameRequired: "È necessario specificare il nome dell’artista.",
		spotifyArtistCacheBusy: "La cache degli artisti Spotify è già in fase di creazione.",
		spotifyArtistCacheInUse: "La cache degli artisti Spotify è occupata.",
		restartServicesTimedOut: "Il riavvio dei servizi del plugin ha superato il tempo limite",
		restartServicesAlreadyRunning: "È già in corso un riavvio dei servizi del plugin",
		mediaBridgeRestartFailed: "MediaBridge non si è riavviato correttamente",
		pluginServiceRestartFailed: "Riavvio dei servizi del plugin non riuscito"
	}
};
var es = {
	core: {
		back: "Atrás",
		coverFailed: "no se pudo cargar la portada",
		coverSourceOnline: "En línea | Alta resolución",
		coverSourceWindows: "Windows | Más rápido",
		effectCoverBlur: "Portada desenfocada",
		effectEnergySaver: "Ahorro de energía",
		effectGlow: "Resplandor",
		effectOcean: "Océano",
		localMusicLabel: "Tu música",
		notPlaying: "Reproduce algo",
		openApp: "Abrir {app}",
		closeApp: "Cerrar {app}",
		refreshFailed: "No se pudo actualizar Now Playing",
		restartServices: "Reiniciar servicios del plugin",
		restartServicesDescription: "Reinicia MediaBridge y los asistentes incluidos de Now Playing sin reiniciar Steam.",
		restartServicesFailed: "No se pudieron reiniciar los servicios del plugin",
		restartServicesSuccess: "Servicios del plugin reiniciados",
		settingsApps: "Fuente",
		settingsCoverSource: "Visualización de la portada",
		settingsFullscreenEffect: "Efectos visuales a pantalla completa",
		settingsLabel: "Ajustes",
		settingsRecovery: "Recuperación",
		topbarLeft: "Mover el reloj y la canción a la izquierda",
		topbarSection: "Barra superior",
		topbarTrack: "Mostrar la canción en la barra superior",
		unknownAlbum: "Álbum desconocido",
		unknownArtist: "Artista desconocido",
		volume: "Volumen",
		openCurrentAlbum: "Abrir el álbum actual",
		autoLaunchSources: "Abrir automáticamente las apps de las fuentes",
		autoLaunchSourcesDescription: "Abre la app del servicio seleccionado solo si aún no está en ejecución.",
		closeSourcesOnSwitch: "Cerrar la app de la fuente anterior",
		closeSourcesOnSwitchDescription: "Al cambiar de fuente, pausa la reproducción y cierra la app del servicio anterior.",
		artistBackgroundSettings: "Ajustes de fondo",
		chooseArtistBackground: "Elegir fondo del artista",
		artistBackgroundDescription: "Elige una imagen en línea. El fondo seleccionado se descargará, se guardará localmente y se usará para este artista.",
		searchingBackgrounds: "Buscando fondos disponibles…",
		noBackgroundsFound: "No se encontraron fondos adecuados.",
		resolution: "Resolución",
		downloadAndApply: "Descargar y aplicar",
		downloadingBackground: "Descargando fondo…",
		backgroundApplied: "Fondo descargado y aplicado",
		backgroundApplyFailed: "No se pudo aplicar el fondo",
		refreshBackgrounds: "Buscar de nuevo",
		currentBackground: "Fondo actual",
		restartServicesInProgress: "Reiniciando los servicios del plugin…",
		backgroundSource: "Fuente de fondos",
		allBackgroundSources: "Todas las fuentes",
		spotifyBackgroundSource: "Spotify",
		fanartBackgroundSource: "fanart.tv",
		exportDiagnosticLog: "Exportar registro de diagnóstico",
		diagnosticLogDescription: "Crea en Descargas un archivo de diagnóstico seguro con el estado del reproductor, MediaBridge y los errores de las imágenes. Se eliminan claves API y tokens.",
		diagnosticLogExported: "Registro de diagnóstico guardado en {path}",
		diagnosticLogExportFailed: "No se pudo exportar el registro de diagnóstico",
		backgroundSearchTimedOut: "La búsqueda de fondos ha tardado demasiado. Inténtalo de nuevo."
	},
	spotify: {
		album: "Álbum",
		albums: "Álbumes",
		albumsAndSingles: "Álbumes y sencillos",
		apiPaused: "API en pausa · {time}",
		apiPausedTitle: "API en pausa",
		apiPausedWait: "Espera un poco más",
		apiPausedDetail: "La API de Spotify está temporalmente en pausa. Vuelve a intentarlo en {time}. Los controles locales de reproducción siguen disponibles.",
		appDescriptionCopied: "Descripción de la aplicación copiada",
		appDescriptionLabel: "App description* (required)",
		appDescriptionValue: "Conexión personal a la API web de Spotify para el plugin Now Playing de Decky Loader en Windows.",
		appNameCopied: "Nombre de la aplicación copiado",
		appNameLabel: "App name* (required)",
		appNameValue: "Playhub Now Playing",
		artist: "Artista",
		artists: "Artistas",
		back: "Atrás",
		audioQuality: "Calidad de audio",
		cacheExplanation: "Los datos de la biblioteca de Spotify se guardan en caché local. Usa Actualizar solo cuando quieras consultar Spotify de nuevo y renovar el contenido en caché.",
		clearMusicCache: "Borrar la caché de música de Spotify",
		clearingMusicCache: "Borrando la caché de música de Spotify…",
		musicCacheDescription: "El audio de Spotify se almacena en caché localmente hasta 1 GB. Los archivos más antiguos se eliminan automáticamente al alcanzar el límite.",
		changeInSettings: "Cambiar en Ajustes",
		clientId: "Client ID de Spotify",
		clientIdSaved: "Client ID guardado",
		compactSavedTracks: "Vista compacta de canciones guardadas",
		compactSavedTracksCard: "Para reducir el uso de la API de Spotify, las canciones guardadas muestran de forma predeterminada solo las acciones Reproducir y Aleatorio, en lugar de cargar la lista completa.",
		compactSavedTracksDescription: "Activada de forma predeterminada. Las canciones guardadas muestran Reproducir y Aleatorio sin cargar la lista completa, lo que reduce las solicitudes a la API de Spotify.",
		completeSignIn: "Completa el inicio de sesión en el navegador y vuelve a Steam.",
		connect: "Conectar Spotify",
		connected: "Conectado",
		connectedAs: "Conectado como {name}",
		hideDetails: "Ocultar detalles",
		showDetails: "Mostrar detalles",
		copyAppDescription: "Copiar descripción de la aplicación",
		copyAppName: "Copiar nombre de la aplicación",
		copyRedirectUri: "Copiar URI de redirección",
		developerTerms: "Acepta los Términos del servicio para desarrolladores y las Directrices de diseño y, después, pulsa Save.",
		disconnect: "Desconectar Spotify",
		enableSpotify: "Activar Spotify",
		followedArtists: "Artistas",
		fullscreen: "Pantalla completa",
		genericError: "Algo ha salido mal",
		home: "Inicio",
		library: "Biblioteca",
		limitedPlaylist: "Spotify solo muestra las listas de canciones de las playlists que posees o en las que colaboras. Aun así, puedes reproducir esta playlist.",
		loadingSpotify: "Cargando Spotify…",
		noAlbums: "No hay álbumes disponibles.",
		noPlayback: "Reproduce algo",
		noResults: "No se encontraron resultados.",
		noTracks: "No hay canciones disponibles.",
		nothingHere: "Todavía no hay nada aquí.",
		nowPlaying: "En reproducción",
		openDashboard: "Panel de desarrolladores de Spotify",
		personalMode: "Modo personal de Web API",
		play: "Reproducir",
		playlist: "Playlist",
		playlists: "Playlists",
		popularTracks: "Canciones populares",
		premiumNote: "Se necesita Spotify Premium para controlar la reproducción en Development Mode. Tu Client ID y los tokens de autorización permanecen en este PC.",
		queue: "Cola",
		queueEmpty: "No hay próximas canciones en la cola.",
		redirectCopied: "URL de redirección copiada",
		redirectUri: "URL de redirección",
		refresh: "Actualizar",
		repeat: "Repetir",
		requestFailed: "La solicitud a Spotify ha fallado",
		saveClientId: "Guardar Client ID",
		savedAlbums: "Álbumes",
		savedTracks: "Canciones guardadas",
		search: "Buscar",
		searchSpotify: "Buscar en Spotify",
		seeAll: "Ver todo",
		selectSpotifyHint: "Selecciona Spotify en la sección Fuente para mostrar el navegador de Spotify en Now Playing.",
		settings: "Ajustes",
		settingsDescription: "Explora tu biblioteca de Spotify, busca en el catálogo e inicia la reproducción en la aplicación de escritorio de Spotify. Este modo opcional utiliza tu propio Client ID de desarrollador de Spotify.",
		setupGuide: "Guía de configuración",
		setupSteps: [
			"Abre el sitio Spotify Developer, pulsa “Log in” en la esquina superior derecha e inicia sesión con tu cuenta de Spotify.",
			"Tras iniciar sesión, pulsa tu perfil en la esquina superior derecha, elige “Dashboard” y después “Create app”.",
			"En “App name* (required)”, introduce el nombre de la aplicación que aparece abajo.",
			"En “App description* (required)”, introduce la descripción que aparece abajo.",
			"Deja “Website” vacío.",
			"En “Redirect URIs* (required)”, añade exactamente la URL que aparece abajo.",
			"En “Which API/SDKs are you planning to use?”, selecciona “Web API” y “Web Playback SDK”. No selecciones Ads API, iOS ni Android.",
			"Acepta los Términos del servicio para desarrolladores y las Directrices de diseño y, después, pulsa Save.",
			"Abre la nueva aplicación, copia su Client ID, pégalo abajo y conecta Spotify. No se necesita un Client Secret."
		],
		showLess: "Ver menos",
		shuffle: "Aleatorio",
		spotifyBigPicture: "Big Picture",
		tracks: "Canciones",
		unableStartAuthorization: "No se pudo iniciar la autorización de Spotify",
		unableStartPlayback: "No se pudo iniciar la reproducción",
		untitled: "Sin título",
		volume: "Volumen",
		webApiOnly: "Selecciona Web API y Web Playback SDK",
		websiteOptional: "Website — opcional",
		welcomeBack: "Te damos la bienvenida, {name}",
		yourMusicInsideSteam: "Tu música dentro de Steam",
		yourPlaylists: "Tus playlists",
		artistCacheTitle: "Caché de fondos de artistas",
		artistCacheDescription: "Descarga fondos de alta resolución solo para los artistas que sigues en Spotify.",
		createArtistCache: "Crear caché de fondos de artistas",
		artistCacheBuilding: "Creando la caché de fondos de artistas…",
		artistCacheProgress: "Descargando fondo: {name}",
		artistCacheCreated: "Se creó la caché de fondos de Spotify",
		artistCacheNoFavorites: "No se encontraron artistas seguidos.",
		clearArtistCache: "Vaciar caché de fondos de artistas",
		artistCacheClearing: "Vaciando la caché de fondos de artistas…",
		artistCacheCleared: "Caché de fondos de artistas de Spotify vaciada",
		cacheSize: "Recursos descargados",
		newForYou: "Recomendado para ti",
		manualBackgrounds: "Fondos elegidos por el usuario",
		manualBackgroundsDescription: "Estos fondos de artistas se conservan al vaciar la caché de imágenes.",
		removeManualBackgrounds: "Eliminar todos los fondos de artista elegidos",
		manualBackgroundsRemoving: "Eliminando los fondos de artista elegidos…",
		manualBackgroundsRemoved: "Fondos de artista elegidos eliminados"
	},
	localMusic: {
		albums: "Álbumes",
		albumsCount: "Álbumes",
		artist: "Artista",
		artists: "Artistas",
		artistsCount: "Artistas",
		back: "Atrás",
		bigPicture: "Big Picture",
		cacheBuilding: "Creando caché de imágenes…",
		cacheCleared: "Caché de imágenes vaciada",
		cacheCreated: "Caché de imágenes creada",
		chooseFolder: "Elegir carpeta de música",
		chooseSomething: "Reproduce algo",
		clearCache: "Vaciar caché de imágenes",
		createCache: "Crear caché de imágenes",
		formats: "MP3, AAC, M4A, FLAC, OGG, Opus y WAV se reproducen mediante Chromium de Steam. WMA, AIFF, APE, WavPack y MKA siguen indexados cuando se pueden leer sus metadatos.",
		fullscreen: "Pantalla completa",
		home: "Inicio",
		library: "Biblioteca",
		noFolders: "Todavía no has añadido carpetas de música.",
		noResults: "No se encontraron resultados.",
		nothingHere: "Tu biblioteca local está vacía. Elige una carpeta y analízala desde Ajustes.",
		nowPlaying: "En reproducción",
		openFolderError: "No se pudo abrir el selector de carpetas de Decky",
		play: "Reproducir",
		playerError: "Error del reproductor de música local",
		queue: "Cola",
		queueEmpty: "No hay próximas canciones en la cola.",
		recentAlbums: "Álbumes añadidos recientemente",
		remove: "Eliminar",
		repeat: "Repetir",
		scan: "Analizar biblioteca",
		scanComplete: "Biblioteca de música local actualizada",
		scanning: "Analizando la biblioteca…",
		search: "Buscar",
		searchMusic: "Buscar en Tu música",
		settings: "Ajustes",
		settingsDescription: "Elige una o varias carpetas. Now Playing analiza todas las subcarpetas, lee las etiquetas y portadas incrustadas y crea una biblioteca local compatible con el mando.",
		shuffle: "Aleatorio",
		tracks: "Canciones",
		tracksCount: "Canciones",
		volume: "Volumen",
		yourMusic: "Tu música",
		cacheProgressScanning: "Analizando la biblioteca musical…",
		cacheProgressProfile: "Descargando imagen del artista: {name}",
		cacheProgressBackground: "Descargando fondo del artista: {name}",
		cacheSize: "Recursos descargados",
		cacheProgressRemoving: "Eliminando recurso de la caché: {name}",
		cacheClearing: "Vaciando la caché de imágenes…",
		fanartProvider: "fanart.tv",
		fanartProviderDescription: "Opcional: añade una clave API personal de fanart.tv para incluir sus fondos de artistas en alta resolución en los resultados y al crear la caché.",
		fanartApiKey: "Clave API de fanart.tv",
		fanartApiPage: "Obtener la API",
		saveFanartApiKey: "Guardar clave API de fanart.tv",
		saved: "Guardado",
		manualBackgrounds: "Fondos elegidos por el usuario",
		manualBackgroundsDescription: "Estos fondos de artistas se conservan al vaciar la caché de imágenes.",
		removeManualBackgrounds: "Eliminar todos los fondos de artista elegidos",
		manualBackgroundsRemoving: "Eliminando los fondos de artista elegidos…",
		manualBackgroundsRemoved: "Fondos de artista elegidos eliminados",
		pickerTitle: "Elegir música local",
		addCurrentFolder: "Añadir esta carpeta",
		openPath: "Ir",
		noAudioFiles: "Aquí no hay carpetas ni archivos de audio compatibles."
	},
	runtime: {
		localMediaError: "No se puede reproducir el archivo de audio local",
		noPlayableLocalTracks: "No hay canciones locales reproducibles",
		localPlaybackStartFailed: "No se pudo iniciar la reproducción local",
		localAudioRecoveryFailed: "No se pudo recuperar el audio local",
		openCurrentSpotifyAlbumFailed: "No se pudo abrir el álbum actual de Spotify",
		openCurrentLocalAlbumFailed: "No se pudo abrir el álbum local actual",
		unsupportedLocalFormat: "Este formato de audio no es compatible con Chromium de Steam",
		localPlayerUnavailable: "El reproductor de audio local no está disponible",
		currentLocalAlbumUnavailable: "El álbum local actual no está disponible",
		currentSpotifyAlbumUnavailable: "El álbum actual de Spotify no está disponible",
		windowsOnly: "Este plugin solo funciona en Windows",
		helperStartFailed: "No se pudo iniciar correctamente el componente auxiliar del plugin",
		folderNotFound: "No se encontró la carpeta",
		localTrackNotFound: "No se encontró la pista local",
		localFileUnavailable: "El archivo de música local no está disponible",
		localPlayerNotRunning: "El reproductor de música local no está en ejecución",
		localPlayerNoResponse: "El reproductor de música local no responde",
		spotifyInvalidTokenResponse: "Spotify devolvió una respuesta de token no válida",
		spotifyAuthorizationExpired: "La sesión de autorización de Spotify ha caducado",
		spotifyFinishingConnection: "Finalizando la conexión con Spotify…",
		spotifyEnterClientId: "Introduce primero tu Client ID de Spotify",
		spotifyWaitingAuthorization: "Esperando la autorización de Spotify…",
		spotifyNotConnected: "Spotify no está conectado",
		spotifyRefreshTokenFailed: "Spotify no devolvió un nuevo token de acceso",
		spotifyInvalidApiPath: "Ruta de la API de Spotify no válida",
		spotifyInvalidResponse: "Spotify devolvió una respuesta no válida",
		spotifyActionDenied: "Spotify rechazó esta acción. Puede que necesites Premium o un permiso adicional",
		spotifyNoActiveDevice: "Spotify no encontró ningún dispositivo de reproducción activo",
		spotifyDisabled: "Spotify está desactivado",
		spotifyConnectFirst: "Conecta Spotify primero en los ajustes del plugin",
		spotifyUnknownLibrarySection: "Sección desconocida de la biblioteca de Spotify",
		spotifyInvalidItem: "Elemento de Spotify no válido",
		spotifyNoCurrentAlbum: "No hay ningún álbum de Spotify disponible para la pista actual",
		spotifyAlbumLookupFailed: "Spotify no pudo encontrar el álbum de la pista actual",
		spotifyOpenAppStartTrack: "Abre Spotify en este PC, reproduce una canción una vez y vuelve a intentarlo",
		spotifyUnknownPlayerCommand: "Comando desconocido del reproductor de Spotify",
		spotifyNoPlayableItems: "No hay elementos reproducibles en Spotify",
		spotifyMissingUri: "Falta el URI de Spotify",
		spotifyInvalidUri: "URI de Spotify no válido",
		backgroundChoiceExpired: "Esta selección de fondo ha caducado. Vuelve a buscar.",
		invalidBackgroundChoice: "Esta selección de fondo ya no es válida.",
		backgroundDownloadFailed: "No se pudo descargar la imagen seleccionada.",
		unsupportedBackgroundImage: "El formato de la imagen seleccionada no es compatible.",
		invalidArtist: "El artista seleccionado no es válido.",
		artistNameRequired: "Se necesita el nombre del artista.",
		spotifyArtistCacheBusy: "La caché de artistas de Spotify ya se está creando.",
		spotifyArtistCacheInUse: "La caché de artistas de Spotify está ocupada.",
		restartServicesTimedOut: "El reinicio de los servicios del plugin superó el tiempo de espera",
		restartServicesAlreadyRunning: "Ya hay un reinicio de los servicios del plugin en curso",
		mediaBridgeRestartFailed: "MediaBridge no se reinició correctamente",
		pluginServiceRestartFailed: "No se pudieron reiniciar los servicios del plugin"
	}
};
var fr = {
	core: {
		back: "Retour",
		coverFailed: "échec du chargement de la pochette",
		coverSourceOnline: "En ligne | Haute résolution",
		coverSourceWindows: "Windows | Plus rapide",
		effectCoverBlur: "Pochette floutée",
		effectEnergySaver: "Économie d’énergie",
		effectGlow: "Lueur",
		effectOcean: "Océan",
		localMusicLabel: "Votre musique",
		notPlaying: "Lancez une lecture",
		openApp: "Ouvrir {app}",
		closeApp: "Fermer {app}",
		refreshFailed: "Échec de l’actualisation de Now Playing",
		restartServices: "Redémarrer les services du plugin",
		restartServicesDescription: "Redémarre MediaBridge et les utilitaires Now Playing inclus sans redémarrer Steam.",
		restartServicesFailed: "Impossible de redémarrer les services du plugin",
		restartServicesSuccess: "Services du plugin redémarrés",
		settingsApps: "Source",
		settingsCoverSource: "Affichage de la pochette",
		settingsFullscreenEffect: "Effets visuels en plein écran",
		settingsLabel: "Paramètres",
		settingsRecovery: "Récupération",
		topbarLeft: "Déplacer l’horloge et le morceau à gauche",
		topbarSection: "Barre supérieure",
		topbarTrack: "Afficher le morceau dans la barre supérieure",
		unknownAlbum: "Album inconnu",
		unknownArtist: "Artiste inconnu",
		volume: "Volume",
		openCurrentAlbum: "Ouvrir l’album actuel",
		autoLaunchSources: "Ouvrir automatiquement les applications des sources",
		autoLaunchSourcesDescription: "Ouvre l’application du service sélectionné uniquement si elle n’est pas déjà lancée.",
		closeSourcesOnSwitch: "Fermer l’application de la source précédente",
		closeSourcesOnSwitchDescription: "Lors d’un changement de source, met la lecture en pause puis ferme l’application du service précédent.",
		artistBackgroundSettings: "Paramètres de l’arrière-plan",
		chooseArtistBackground: "Choisir l’arrière-plan de l’artiste",
		artistBackgroundDescription: "Choisissez une image en ligne. L’arrière-plan sélectionné sera téléchargé, enregistré localement et utilisé pour cet artiste.",
		searchingBackgrounds: "Recherche des arrière-plans disponibles…",
		noBackgroundsFound: "Aucun arrière-plan adapté n’a été trouvé.",
		resolution: "Résolution",
		downloadAndApply: "Télécharger et appliquer",
		downloadingBackground: "Téléchargement de l’arrière-plan…",
		backgroundApplied: "Arrière-plan téléchargé et appliqué",
		backgroundApplyFailed: "Impossible d’appliquer l’arrière-plan",
		refreshBackgrounds: "Rechercher à nouveau",
		currentBackground: "Arrière-plan actuel",
		restartServicesInProgress: "Redémarrage des services du plugin…",
		backgroundSource: "Source des arrière-plans",
		allBackgroundSources: "Toutes les sources",
		spotifyBackgroundSource: "Spotify",
		fanartBackgroundSource: "fanart.tv",
		exportDiagnosticLog: "Exporter le journal de diagnostic",
		diagnosticLogDescription: "Crée dans Téléchargements un fichier de diagnostic sécurisé avec l’état du lecteur, MediaBridge et les erreurs d’illustration. Les clés API et jetons sont supprimés.",
		diagnosticLogExported: "Journal de diagnostic enregistré dans {path}",
		diagnosticLogExportFailed: "Impossible d’exporter le journal de diagnostic",
		backgroundSearchTimedOut: "La recherche d’arrière-plans a expiré. Réessayez."
	},
	spotify: {
		album: "Album",
		albums: "Albums",
		albumsAndSingles: "Albums et singles",
		apiPaused: "API en pause · {time}",
		apiPausedTitle: "API en pause",
		apiPausedWait: "Patientez encore",
		apiPausedDetail: "L’API Spotify est temporairement en pause. Réessayez dans {time}. Les commandes de lecture locales restent disponibles.",
		appDescriptionCopied: "Description de l’application copiée",
		appDescriptionLabel: "App description* (required)",
		appDescriptionValue: "Connexion personnelle à l’API Web Spotify pour le plugin Now Playing de Decky Loader sous Windows.",
		appNameCopied: "Nom de l’application copié",
		appNameLabel: "App name* (required)",
		appNameValue: "Playhub Now Playing",
		artist: "Artiste",
		artists: "Artistes",
		back: "Retour",
		audioQuality: "Qualité audio",
		cacheExplanation: "Les données de la bibliothèque Spotify sont mises en cache localement. Utilisez Actualiser uniquement lorsque vous souhaitez interroger de nouveau Spotify et mettre à jour le contenu en cache.",
		clearMusicCache: "Vider le cache musical Spotify",
		clearingMusicCache: "Suppression du cache musical Spotify…",
		musicCacheDescription: "L’audio Spotify est mis en cache localement jusqu’à 1 Go. Les fichiers les plus anciens sont supprimés automatiquement lorsque la limite est atteinte.",
		changeInSettings: "Modifier dans les Paramètres",
		clientId: "Client ID Spotify",
		clientIdSaved: "Client ID enregistré",
		compactSavedTracks: "Affichage compact des titres enregistrés",
		compactSavedTracksCard: "Pour réduire l’utilisation de l’API Spotify, les titres enregistrés affichent par défaut uniquement les actions Lire et Lecture aléatoire au lieu de charger la liste complète.",
		compactSavedTracksDescription: "Activé par défaut. Les titres enregistrés affichent Lire et Lecture aléatoire sans charger la liste complète, ce qui réduit les requêtes à l’API Spotify.",
		completeSignIn: "Terminez la connexion dans votre navigateur, puis revenez dans Steam.",
		connect: "Connecter Spotify",
		connected: "Connecté",
		connectedAs: "Connecté en tant que {name}",
		hideDetails: "Masquer les détails",
		showDetails: "Afficher les détails",
		copyAppDescription: "Copier la description de l’application",
		copyAppName: "Copier le nom de l’application",
		copyRedirectUri: "Copier l’URI de redirection",
		developerTerms: "Acceptez les Conditions d’utilisation pour les développeurs et les Directives de conception, puis cliquez sur Save.",
		disconnect: "Déconnecter Spotify",
		enableSpotify: "Activer Spotify",
		followedArtists: "Artistes",
		fullscreen: "Plein écran",
		genericError: "Une erreur s’est produite",
		home: "Accueil",
		library: "Bibliothèque",
		limitedPlaylist: "Spotify n’affiche la liste des titres que pour les playlists que vous possédez ou auxquelles vous collaborez. Vous pouvez tout de même lire cette playlist.",
		loadingSpotify: "Chargement de Spotify…",
		noAlbums: "Aucun album disponible.",
		noPlayback: "Lancez une lecture",
		noResults: "Aucun résultat.",
		noTracks: "Aucun morceau disponible.",
		nothingHere: "Il n’y a encore rien ici.",
		nowPlaying: "Lecture en cours",
		openDashboard: "Tableau de bord Spotify Developer",
		personalMode: "Mode Web API personnel",
		play: "Lire",
		playlist: "Playlist",
		playlists: "Playlists",
		popularTracks: "Titres populaires",
		premiumNote: "Spotify Premium est requis pour contrôler la lecture en Development Mode. Votre Client ID et vos jetons d’autorisation restent sur ce PC.",
		queue: "File d’attente",
		queueEmpty: "Aucun morceau à venir dans la file d’attente.",
		redirectCopied: "URL de redirection copiée",
		redirectUri: "URL de redirection",
		refresh: "Actualiser",
		repeat: "Répéter",
		requestFailed: "Échec de la requête Spotify",
		saveClientId: "Enregistrer le Client ID",
		savedAlbums: "Albums",
		savedTracks: "Titres enregistrés",
		search: "Rechercher",
		searchSpotify: "Rechercher sur Spotify",
		seeAll: "Tout afficher",
		selectSpotifyHint: "Sélectionnez Spotify dans la section Source pour afficher le navigateur Spotify dans Now Playing.",
		settings: "Paramètres",
		settingsDescription: "Parcourez votre bibliothèque Spotify, recherchez dans le catalogue et lancez la lecture dans l’application de bureau Spotify. Ce mode facultatif utilise votre propre Client ID de développeur Spotify.",
		setupGuide: "Guide de configuration",
		setupSteps: [
			"Ouvrez le site Spotify Developer, cliquez sur « Log in » en haut à droite et connectez-vous à votre compte Spotify.",
			"Une fois connecté, cliquez sur votre profil en haut à droite, choisissez « Dashboard », puis cliquez sur « Create app ».",
			"Dans « App name* (required) », saisissez le nom de l’application indiqué ci-dessous.",
			"Dans « App description* (required) », saisissez la description indiquée ci-dessous.",
			"Laissez « Website » vide.",
			"Dans « Redirect URIs* (required) », ajoutez exactement l’URL indiquée ci-dessous.",
			"Sous « Which API/SDKs are you planning to use? », sélectionnez « Web API » et « Web Playback SDK ». Ne sélectionnez pas Ads API, iOS ou Android.",
			"Acceptez les Conditions d’utilisation pour les développeurs et les Directives de conception, puis cliquez sur Save.",
			"Ouvrez la nouvelle application, copiez son Client ID, collez-le ci-dessous et connectez Spotify. Aucun Client Secret n’est nécessaire."
		],
		showLess: "Afficher moins",
		shuffle: "Lecture aléatoire",
		spotifyBigPicture: "Big Picture",
		tracks: "Morceaux",
		unableStartAuthorization: "Impossible de lancer l’autorisation Spotify",
		unableStartPlayback: "Impossible de démarrer la lecture",
		untitled: "Sans titre",
		volume: "Volume",
		webApiOnly: "Sélectionner Web API et Web Playback SDK",
		websiteOptional: "Website — facultatif",
		welcomeBack: "Bon retour, {name}",
		yourMusicInsideSteam: "Votre musique dans Steam",
		yourPlaylists: "Vos playlists",
		artistCacheTitle: "Cache des arrière-plans d’artistes",
		artistCacheDescription: "Télécharge des arrière-plans haute résolution uniquement pour les artistes que vous suivez sur Spotify.",
		createArtistCache: "Créer le cache des arrière-plans",
		artistCacheBuilding: "Création du cache des arrière-plans…",
		artistCacheProgress: "Téléchargement de l’arrière-plan : {name}",
		artistCacheCreated: "Cache des arrière-plans Spotify créé",
		artistCacheNoFavorites: "Aucun artiste suivi n’a été trouvé.",
		clearArtistCache: "Vider le cache des arrière-plans d’artistes",
		artistCacheClearing: "Vidage du cache des arrière-plans d’artistes…",
		artistCacheCleared: "Cache des arrière-plans d’artistes Spotify vidé",
		cacheSize: "Ressources téléchargées",
		newForYou: "Recommandé pour vous",
		manualBackgrounds: "Arrière-plans choisis par l’utilisateur",
		manualBackgroundsDescription: "Ces arrière-plans d’artistes sont conservés lorsque le cache d’images est vidé.",
		removeManualBackgrounds: "Supprimer tous les arrière-plans d’artistes choisis",
		manualBackgroundsRemoving: "Suppression des arrière-plans d’artistes choisis…",
		manualBackgroundsRemoved: "Arrière-plans d’artistes choisis supprimés"
	},
	localMusic: {
		albums: "Albums",
		albumsCount: "Albums",
		artist: "Artiste",
		artists: "Artistes",
		artistsCount: "Artistes",
		back: "Retour",
		bigPicture: "Big Picture",
		cacheBuilding: "Création du cache d’images…",
		cacheCleared: "Cache d’images vidé",
		cacheCreated: "Cache d’images créé",
		chooseFolder: "Choisir un dossier de musique",
		chooseSomething: "Lancez une lecture",
		clearCache: "Vider le cache d’images",
		createCache: "Créer le cache d’images",
		formats: "Les fichiers MP3, AAC, M4A, FLAC, OGG, Opus et WAV sont lus via Chromium de Steam. Les fichiers WMA, AIFF, APE, WavPack et MKA restent indexés lorsque leurs métadonnées peuvent être lues.",
		fullscreen: "Plein écran",
		home: "Accueil",
		library: "Bibliothèque",
		noFolders: "Aucun dossier de musique n’a encore été ajouté.",
		noResults: "Aucun résultat.",
		nothingHere: "Votre bibliothèque locale est vide. Choisissez un dossier et analysez-le depuis les Paramètres.",
		nowPlaying: "Lecture en cours",
		openFolderError: "Impossible d’ouvrir le sélecteur de dossiers Decky",
		play: "Lire",
		playerError: "Erreur du lecteur de musique locale",
		queue: "File d’attente",
		queueEmpty: "Aucun morceau à venir dans la file d’attente.",
		recentAlbums: "Albums ajoutés récemment",
		remove: "Supprimer",
		repeat: "Répéter",
		scan: "Analyser la bibliothèque",
		scanComplete: "Bibliothèque musicale locale mise à jour",
		scanning: "Analyse de la bibliothèque…",
		search: "Rechercher",
		searchMusic: "Rechercher dans Votre musique",
		settings: "Paramètres",
		settingsDescription: "Choisissez un ou plusieurs dossiers. Now Playing analyse tous les sous-dossiers, lit les tags et pochettes intégrés, puis crée une bibliothèque musicale locale adaptée à la manette.",
		shuffle: "Lecture aléatoire",
		tracks: "Morceaux",
		tracksCount: "Morceaux",
		volume: "Volume",
		yourMusic: "Votre musique",
		cacheProgressScanning: "Analyse de la bibliothèque musicale…",
		cacheProgressProfile: "Téléchargement de l’image de l’artiste : {name}",
		cacheProgressBackground: "Téléchargement de l’arrière-plan de l’artiste : {name}",
		cacheSize: "Ressources téléchargées",
		cacheProgressRemoving: "Suppression de l’élément du cache : {name}",
		cacheClearing: "Vidage du cache d’images…",
		fanartProvider: "fanart.tv",
		fanartProviderDescription: "Facultatif : ajoutez une clé API personnelle fanart.tv pour inclure ses arrière-plans d’artistes en haute résolution dans les résultats et la création du cache.",
		fanartApiKey: "Clé API fanart.tv",
		fanartApiPage: "Obtenir l'API",
		saveFanartApiKey: "Enregistrer la clé API fanart.tv",
		saved: "Enregistré",
		manualBackgrounds: "Arrière-plans choisis par l’utilisateur",
		manualBackgroundsDescription: "Ces arrière-plans d’artistes sont conservés lorsque le cache d’images est vidé.",
		removeManualBackgrounds: "Supprimer tous les arrière-plans d’artistes choisis",
		manualBackgroundsRemoving: "Suppression des arrière-plans d’artistes choisis…",
		manualBackgroundsRemoved: "Arrière-plans d’artistes choisis supprimés",
		pickerTitle: "Choisir de la musique locale",
		addCurrentFolder: "Ajouter ce dossier",
		openPath: "Aller",
		noAudioFiles: "Aucun dossier ni fichier audio compatible ici."
	},
	runtime: {
		localMediaError: "Impossible de lire le fichier audio local",
		noPlayableLocalTracks: "Aucun morceau local lisible",
		localPlaybackStartFailed: "Impossible de démarrer la lecture locale",
		localAudioRecoveryFailed: "Échec de la récupération de l’audio local",
		openCurrentSpotifyAlbumFailed: "Impossible d’ouvrir l’album Spotify actuel",
		openCurrentLocalAlbumFailed: "Impossible d’ouvrir l’album local actuel",
		unsupportedLocalFormat: "Ce format audio n’est pas pris en charge par Chromium de Steam",
		localPlayerUnavailable: "Le lecteur audio local n’est pas disponible",
		currentLocalAlbumUnavailable: "L’album local actuel n’est pas disponible",
		currentSpotifyAlbumUnavailable: "L’album Spotify actuel n’est pas disponible",
		windowsOnly: "Ce plugin fonctionne uniquement sous Windows",
		helperStartFailed: "Le composant auxiliaire du plugin n’a pas pu démarrer correctement",
		folderNotFound: "Dossier introuvable",
		localTrackNotFound: "Morceau local introuvable",
		localFileUnavailable: "Le fichier musical local n’est pas disponible",
		localPlayerNotRunning: "Le lecteur de musique local n’est pas en cours d’exécution",
		localPlayerNoResponse: "Le lecteur de musique local ne répond pas",
		spotifyInvalidTokenResponse: "Spotify a renvoyé une réponse de jeton non valide",
		spotifyAuthorizationExpired: "La session d’autorisation Spotify a expiré",
		spotifyFinishingConnection: "Finalisation de la connexion à Spotify…",
		spotifyEnterClientId: "Saisissez d’abord votre Client ID Spotify",
		spotifyWaitingAuthorization: "En attente de l’autorisation Spotify…",
		spotifyNotConnected: "Spotify n’est pas connecté",
		spotifyRefreshTokenFailed: "Spotify n’a pas renvoyé de nouveau jeton d’accès",
		spotifyInvalidApiPath: "Chemin d’API Spotify non valide",
		spotifyInvalidResponse: "Spotify a renvoyé une réponse non valide",
		spotifyActionDenied: "Spotify a refusé cette action. Premium ou une autorisation supplémentaire peut être nécessaire",
		spotifyNoActiveDevice: "Spotify n’a trouvé aucun appareil de lecture actif",
		spotifyDisabled: "Spotify est désactivé",
		spotifyConnectFirst: "Connectez d’abord Spotify dans les paramètres du plugin",
		spotifyUnknownLibrarySection: "Section inconnue de la bibliothèque Spotify",
		spotifyInvalidItem: "Élément Spotify non valide",
		spotifyNoCurrentAlbum: "Aucun album Spotify n’est disponible pour le morceau actuel",
		spotifyAlbumLookupFailed: "Spotify n’a pas trouvé l’album du morceau actuel",
		spotifyOpenAppStartTrack: "Ouvrez Spotify sur ce PC, lancez une chanson, puis réessayez",
		spotifyUnknownPlayerCommand: "Commande du lecteur Spotify inconnue",
		spotifyNoPlayableItems: "Aucun élément Spotify lisible",
		spotifyMissingUri: "URI Spotify manquant",
		spotifyInvalidUri: "URI Spotify non valide",
		backgroundChoiceExpired: "Ce choix d’arrière-plan a expiré. Relancez la recherche.",
		invalidBackgroundChoice: "Ce choix d’arrière-plan n’est plus valide.",
		backgroundDownloadFailed: "Impossible de télécharger l’image sélectionnée.",
		unsupportedBackgroundImage: "Le format de l’image sélectionnée n’est pas pris en charge.",
		invalidArtist: "L’artiste sélectionné n’est pas valide.",
		artistNameRequired: "Le nom de l’artiste est requis.",
		spotifyArtistCacheBusy: "Le cache des artistes Spotify est déjà en cours de création.",
		spotifyArtistCacheInUse: "Le cache des artistes Spotify est occupé.",
		restartServicesTimedOut: "Le redémarrage des services du plugin a dépassé le délai imparti",
		restartServicesAlreadyRunning: "Un redémarrage des services du plugin est déjà en cours",
		mediaBridgeRestartFailed: "MediaBridge ne s’est pas redémarré correctement",
		pluginServiceRestartFailed: "Échec du redémarrage des services du plugin"
	}
};
var de = {
	core: {
		back: "Zurück",
		coverFailed: "Cover konnte nicht geladen werden",
		coverSourceOnline: "Online | Hohe Auflösung",
		coverSourceWindows: "Windows | Schneller",
		effectCoverBlur: "Cover-Unschärfe",
		effectEnergySaver: "Energiesparmodus",
		effectGlow: "Leuchten",
		effectOcean: "Ozean",
		localMusicLabel: "Deine Musik",
		notPlaying: "Spiele etwas ab",
		openApp: "{app} öffnen",
		closeApp: "{app} schließen",
		refreshFailed: "Now Playing konnte nicht aktualisiert werden",
		restartServices: "Plugin-Dienste neu starten",
		restartServicesDescription: "Startet MediaBridge und die mitgelieferten Now-Playing-Hilfsprogramme neu, ohne Steam neu zu starten.",
		restartServicesFailed: "Plugin-Dienste konnten nicht neu gestartet werden",
		restartServicesSuccess: "Plugin-Dienste neu gestartet",
		settingsApps: "Quelle",
		settingsCoverSource: "Albumcover-Anzeige",
		settingsFullscreenEffect: "Vollbild-Effekte",
		settingsLabel: "Einstellungen",
		settingsRecovery: "Wiederherstellung",
		topbarLeft: "Uhr und Titel nach links verschieben",
		topbarSection: "Obere Leiste",
		topbarTrack: "Titel in der oberen Leiste anzeigen",
		unknownAlbum: "Unbekanntes Album",
		unknownArtist: "Unbekannter Interpret",
		volume: "Lautstärke",
		openCurrentAlbum: "Aktuelles Album öffnen",
		autoLaunchSources: "Quellen-Apps automatisch öffnen",
		autoLaunchSourcesDescription: "Öffnet die App des ausgewählten Dienstes nur, wenn sie noch nicht läuft.",
		closeSourcesOnSwitch: "App der vorherigen Quelle schließen",
		closeSourcesOnSwitchDescription: "Pausiert beim Quellenwechsel die Wiedergabe und schließt anschließend die App des vorherigen Dienstes.",
		artistBackgroundSettings: "Hintergrundeinstellungen",
		chooseArtistBackground: "Künstlerhintergrund auswählen",
		artistBackgroundDescription: "Wähle ein Online-Bild aus. Der gewählte Hintergrund wird heruntergeladen, lokal gespeichert und für diesen Künstler verwendet.",
		searchingBackgrounds: "Verfügbare Hintergründe werden gesucht…",
		noBackgroundsFound: "Keine geeigneten Hintergründe gefunden.",
		resolution: "Auflösung",
		downloadAndApply: "Herunterladen und anwenden",
		downloadingBackground: "Hintergrund wird heruntergeladen…",
		backgroundApplied: "Hintergrund heruntergeladen und angewendet",
		backgroundApplyFailed: "Hintergrund konnte nicht angewendet werden",
		refreshBackgrounds: "Erneut suchen",
		currentBackground: "Aktueller Hintergrund",
		restartServicesInProgress: "Plugin-Dienste werden neu gestartet…",
		backgroundSource: "Hintergrundquelle",
		allBackgroundSources: "Alle Quellen",
		spotifyBackgroundSource: "Spotify",
		fanartBackgroundSource: "fanart.tv",
		exportDiagnosticLog: "Diagnoseprotokoll exportieren",
		diagnosticLogDescription: "Erstellt im Download-Ordner eine sichere Diagnosedatei mit Player-, MediaBridge- und Artwork-Fehlern. API-Schlüssel und Tokens werden entfernt.",
		diagnosticLogExported: "Diagnoseprotokoll gespeichert unter {path}",
		diagnosticLogExportFailed: "Diagnoseprotokoll konnte nicht exportiert werden",
		backgroundSearchTimedOut: "Die Hintergrundsuche hat zu lange gedauert. Versuche es erneut."
	},
	spotify: {
		album: "Album",
		albums: "Alben",
		albumsAndSingles: "Alben und Singles",
		apiPaused: "API pausiert · {time}",
		apiPausedTitle: "API pausiert",
		apiPausedWait: "Bitte noch etwas warten",
		apiPausedDetail: "Die Spotify-API ist vorübergehend pausiert. Versuche es in {time} erneut. Lokale Wiedergabesteuerungen bleiben verfügbar.",
		appDescriptionCopied: "App-Beschreibung kopiert",
		appDescriptionLabel: "App description* (required)",
		appDescriptionValue: "Persönliche Spotify-Web-API-Verbindung für das Now-Playing-Plugin von Decky Loader unter Windows.",
		appNameCopied: "App-Name kopiert",
		appNameLabel: "App name* (required)",
		appNameValue: "Playhub Now Playing",
		artist: "Interpret",
		artists: "Interpreten",
		back: "Zurück",
		audioQuality: "Audioqualität",
		cacheExplanation: "Spotify-Bibliotheksdaten werden lokal zwischengespeichert. Verwende Aktualisieren nur, wenn Now Playing Spotify erneut abfragen und den Cache erneuern soll.",
		clearMusicCache: "Spotify-Musikcache leeren",
		clearingMusicCache: "Spotify-Musikcache wird geleert…",
		musicCacheDescription: "Spotify-Audio wird lokal bis zu 1 GB zwischengespeichert. Ältere Dateien werden beim Erreichen des Limits automatisch entfernt.",
		changeInSettings: "In den Einstellungen ändern",
		clientId: "Spotify Client ID",
		clientIdSaved: "Client ID gespeichert",
		compactSavedTracks: "Kompakte Ansicht gespeicherter Titel",
		compactSavedTracksCard: "Um Spotify-API-Anfragen zu reduzieren, werden für gespeicherte Titel standardmäßig nur Abspielen und Zufallswiedergabe angezeigt, statt die vollständige Liste zu laden.",
		compactSavedTracksDescription: "Standardmäßig aktiviert. Gespeicherte Titel zeigen Abspielen und Zufallswiedergabe, ohne die vollständige Liste zu laden. Dadurch werden Spotify-API-Anfragen reduziert.",
		completeSignIn: "Schließe die Anmeldung im Browser ab und kehre dann zu Steam zurück.",
		connect: "Spotify verbinden",
		connected: "Verbunden",
		connectedAs: "Verbunden als {name}",
		hideDetails: "Details ausblenden",
		showDetails: "Details anzeigen",
		copyAppDescription: "App-Beschreibung kopieren",
		copyAppName: "App-Namen kopieren",
		copyRedirectUri: "Weiterleitungs-URI kopieren",
		developerTerms: "Akzeptiere die Developer Terms of Service und Design Guidelines und klicke anschließend auf Save.",
		disconnect: "Spotify trennen",
		enableSpotify: "Spotify aktivieren",
		followedArtists: "Interpreten",
		fullscreen: "Vollbild",
		genericError: "Etwas ist schiefgelaufen",
		home: "Start",
		library: "Bibliothek",
		limitedPlaylist: "Spotify zeigt Titellisten nur für Playlists an, die dir gehören oder an denen du mitarbeitest. Du kannst diese Playlist trotzdem abspielen.",
		loadingSpotify: "Spotify wird geladen…",
		noAlbums: "Keine Alben verfügbar.",
		noPlayback: "Spiele etwas ab",
		noResults: "Keine Ergebnisse gefunden.",
		noTracks: "Keine Titel verfügbar.",
		nothingHere: "Hier ist noch nichts.",
		nowPlaying: "Aktuelle Wiedergabe",
		openDashboard: "Spotify Developer Dashboard",
		personalMode: "Persönlicher Web-API-Modus",
		play: "Abspielen",
		playlist: "Playlist",
		playlists: "Playlists",
		popularTracks: "Beliebte Titel",
		premiumNote: "Spotify Premium ist für die Wiedergabesteuerung im Development Mode erforderlich. Deine Client ID und Autorisierungstoken bleiben auf diesem PC.",
		queue: "Warteschlange",
		queueEmpty: "Keine weiteren Titel in der Warteschlange.",
		redirectCopied: "Weiterleitungs-URL kopiert",
		redirectUri: "Weiterleitungs-URL",
		refresh: "Aktualisieren",
		repeat: "Wiederholen",
		requestFailed: "Spotify-Anfrage fehlgeschlagen",
		saveClientId: "Client ID speichern",
		savedAlbums: "Alben",
		savedTracks: "Gespeicherte Titel",
		search: "Suchen",
		searchSpotify: "Spotify durchsuchen",
		seeAll: "Alle anzeigen",
		selectSpotifyHint: "Wähle Spotify im Bereich Quelle aus, um den Spotify-Browser in Now Playing anzuzeigen.",
		settings: "Einstellungen",
		settingsDescription: "Durchsuche deine Spotify-Bibliothek und den Katalog und starte die Wiedergabe in der Spotify-Desktop-App. Dieser optionale Modus verwendet deine eigene Spotify-Entwickler-Client-ID.",
		setupGuide: "Einrichtungsanleitung",
		setupSteps: [
			"Öffne die Spotify-Developer-Website, klicke oben rechts auf „Log in“ und melde dich bei deinem Spotify-Konto an.",
			"Klicke nach der Anmeldung oben rechts auf dein Profil, wähle „Dashboard“ und klicke dann auf „Create app“.",
			"Gib unter „App name* (required)“ den unten angezeigten App-Namen ein.",
			"Gib unter „App description* (required)“ die unten angezeigte Beschreibung ein.",
			"Lasse „Website“ leer.",
			"Füge unter „Redirect URIs* (required)“ die unten angezeigte URL exakt ein.",
			"Wähle unter „Which API/SDKs are you planning to use?“ sowohl „Web API“ als auch „Web Playback SDK“. Wähle weder Ads API noch iOS oder Android.",
			"Akzeptiere die Developer Terms of Service und Design Guidelines und klicke anschließend auf Save.",
			"Öffne die neue App, kopiere ihre Client ID, füge sie unten ein und verbinde Spotify. Ein Client Secret ist nicht erforderlich."
		],
		showLess: "Weniger anzeigen",
		shuffle: "Zufallswiedergabe",
		spotifyBigPicture: "Big Picture",
		tracks: "Titel",
		unableStartAuthorization: "Spotify-Autorisierung konnte nicht gestartet werden",
		unableStartPlayback: "Wiedergabe konnte nicht gestartet werden",
		untitled: "Ohne Titel",
		volume: "Lautstärke",
		webApiOnly: "Web API und Web Playback SDK auswählen",
		websiteOptional: "Website — optional",
		welcomeBack: "Willkommen zurück, {name}",
		yourMusicInsideSteam: "Deine Musik in Steam",
		yourPlaylists: "Deine Playlists",
		artistCacheTitle: "Cache für Künstlerhintergründe",
		artistCacheDescription: "Lädt hochauflösende Hintergründe nur für Künstler herunter, denen du auf Spotify folgst.",
		createArtistCache: "Cache für Künstlerhintergründe erstellen",
		artistCacheBuilding: "Cache für Künstlerhintergründe wird erstellt…",
		artistCacheProgress: "Hintergrund wird heruntergeladen: {name}",
		artistCacheCreated: "Spotify-Künstlerhintergründe wurden zwischengespeichert",
		artistCacheNoFavorites: "Keine gefolgten Künstler gefunden.",
		clearArtistCache: "Cache für Künstlerhintergründe leeren",
		artistCacheClearing: "Cache für Künstlerhintergründe wird geleert…",
		artistCacheCleared: "Spotify-Cache für Künstlerhintergründe geleert",
		cacheSize: "Heruntergeladene Assets",
		newForYou: "Für dich empfohlen",
		manualBackgrounds: "Vom Benutzer ausgewählte Hintergründe",
		manualBackgroundsDescription: "Diese Künstlerhintergründe bleiben beim Leeren des Bildcaches erhalten.",
		removeManualBackgrounds: "Alle ausgewählten Künstlerhintergründe entfernen",
		manualBackgroundsRemoving: "Ausgewählte Künstlerhintergründe werden entfernt…",
		manualBackgroundsRemoved: "Ausgewählte Künstlerhintergründe entfernt"
	},
	localMusic: {
		albums: "Alben",
		albumsCount: "Alben",
		artist: "Interpret",
		artists: "Interpreten",
		artistsCount: "Interpreten",
		back: "Zurück",
		bigPicture: "Big Picture",
		cacheBuilding: "Bild-Cache wird erstellt…",
		cacheCleared: "Bild-Cache geleert",
		cacheCreated: "Bild-Cache erstellt",
		chooseFolder: "Musikordner auswählen",
		chooseSomething: "Spiele etwas ab",
		clearCache: "Bild-Cache leeren",
		createCache: "Bild-Cache erstellen",
		formats: "MP3, AAC, M4A, FLAC, OGG, Opus und WAV werden über Steam Chromium wiedergegeben. WMA, AIFF, APE, WavPack und MKA bleiben indiziert, sofern ihre Metadaten gelesen werden können.",
		fullscreen: "Vollbild",
		home: "Start",
		library: "Bibliothek",
		noFolders: "Noch keine Musikordner hinzugefügt.",
		noResults: "Keine Ergebnisse gefunden.",
		nothingHere: "Deine lokale Bibliothek ist leer. Wähle unter Einstellungen einen Ordner aus und scanne ihn.",
		nowPlaying: "Aktuelle Wiedergabe",
		openFolderError: "Der Decky-Ordnerdialog konnte nicht geöffnet werden",
		play: "Abspielen",
		playerError: "Fehler im lokalen Musikplayer",
		queue: "Warteschlange",
		queueEmpty: "Keine weiteren Titel in der Warteschlange.",
		recentAlbums: "Kürzlich hinzugefügte Alben",
		remove: "Entfernen",
		repeat: "Wiederholen",
		scan: "Bibliothek scannen",
		scanComplete: "Lokale Musikbibliothek aktualisiert",
		scanning: "Bibliothek wird gescannt…",
		search: "Suchen",
		searchMusic: "Deine Musik durchsuchen",
		settings: "Einstellungen",
		settingsDescription: "Wähle einen oder mehrere Ordner aus. Now Playing durchsucht alle Unterordner, liest eingebettete Tags und Cover und erstellt eine controllerfreundliche lokale Musikbibliothek.",
		shuffle: "Zufallswiedergabe",
		tracks: "Titel",
		tracksCount: "Titel",
		volume: "Lautstärke",
		yourMusic: "Deine Musik",
		cacheProgressScanning: "Musikbibliothek wird durchsucht…",
		cacheProgressProfile: "Künstlerbild wird heruntergeladen: {name}",
		cacheProgressBackground: "Künstlerhintergrund wird heruntergeladen: {name}",
		cacheSize: "Heruntergeladene Assets",
		cacheProgressRemoving: "Zwischengespeichertes Element wird entfernt: {name}",
		cacheClearing: "Bild-Cache wird geleert…",
		fanartProvider: "fanart.tv",
		fanartProviderDescription: "Optional: Füge einen persönlichen fanart.tv-API-Schlüssel hinzu, um hochauflösende Künstlerhintergründe in Suchergebnissen und beim Cache-Aufbau zu verwenden.",
		fanartApiKey: "fanart.tv-API-Schlüssel",
		fanartApiPage: "API abrufen",
		saveFanartApiKey: "fanart.tv-API-Schlüssel speichern",
		saved: "Gespeichert",
		manualBackgrounds: "Vom Benutzer ausgewählte Hintergründe",
		manualBackgroundsDescription: "Diese Künstlerhintergründe bleiben beim Leeren des Bildcaches erhalten.",
		removeManualBackgrounds: "Alle ausgewählten Künstlerhintergründe entfernen",
		manualBackgroundsRemoving: "Ausgewählte Künstlerhintergründe werden entfernt…",
		manualBackgroundsRemoved: "Ausgewählte Künstlerhintergründe entfernt",
		pickerTitle: "Lokale Musik auswählen",
		addCurrentFolder: "Diesen Ordner hinzufügen",
		openPath: "Los",
		noAudioFiles: "Hier gibt es keine Ordner oder unterstützten Audiodateien."
	},
	runtime: {
		localMediaError: "Die lokale Audiodatei kann nicht wiedergegeben werden",
		noPlayableLocalTracks: "Keine abspielbaren lokalen Titel",
		localPlaybackStartFailed: "Lokale Wiedergabe konnte nicht gestartet werden",
		localAudioRecoveryFailed: "Lokale Audiowiedergabe konnte nicht wiederhergestellt werden",
		openCurrentSpotifyAlbumFailed: "Das aktuelle Spotify-Album konnte nicht geöffnet werden",
		openCurrentLocalAlbumFailed: "Das aktuelle lokale Album konnte nicht geöffnet werden",
		unsupportedLocalFormat: "Dieses Audioformat wird von Steam Chromium nicht unterstützt",
		localPlayerUnavailable: "Der lokale Audioplayer ist nicht verfügbar",
		currentLocalAlbumUnavailable: "Das aktuelle lokale Album ist nicht verfügbar",
		currentSpotifyAlbumUnavailable: "Das aktuelle Spotify-Album ist nicht verfügbar",
		windowsOnly: "Dieses Plugin funktioniert nur unter Windows",
		helperStartFailed: "Die Hilfskomponente des Plugins konnte nicht richtig gestartet werden",
		folderNotFound: "Ordner nicht gefunden",
		localTrackNotFound: "Lokaler Titel nicht gefunden",
		localFileUnavailable: "Die lokale Musikdatei ist nicht verfügbar",
		localPlayerNotRunning: "Der lokale Musikplayer wird nicht ausgeführt",
		localPlayerNoResponse: "Der lokale Musikplayer antwortet nicht",
		spotifyInvalidTokenResponse: "Spotify hat eine ungültige Token-Antwort zurückgegeben",
		spotifyAuthorizationExpired: "Die Spotify-Autorisierungssitzung ist abgelaufen",
		spotifyFinishingConnection: "Spotify-Verbindung wird abgeschlossen…",
		spotifyEnterClientId: "Gib zuerst deine Spotify Client ID ein",
		spotifyWaitingAuthorization: "Warten auf Spotify-Autorisierung…",
		spotifyNotConnected: "Spotify ist nicht verbunden",
		spotifyRefreshTokenFailed: "Spotify hat kein neues Zugriffstoken zurückgegeben",
		spotifyInvalidApiPath: "Ungültiger Spotify-API-Pfad",
		spotifyInvalidResponse: "Spotify hat eine ungültige Antwort zurückgegeben",
		spotifyActionDenied: "Spotify hat diese Aktion abgelehnt. Premium oder eine zusätzliche Berechtigung kann erforderlich sein",
		spotifyNoActiveDevice: "Spotify konnte kein aktives Wiedergabegerät finden",
		spotifyDisabled: "Spotify ist deaktiviert",
		spotifyConnectFirst: "Verbinde Spotify zuerst in den Plugin-Einstellungen",
		spotifyUnknownLibrarySection: "Unbekannter Bereich der Spotify-Bibliothek",
		spotifyInvalidItem: "Ungültiges Spotify-Element",
		spotifyNoCurrentAlbum: "Für den aktuellen Titel ist kein Spotify-Album verfügbar",
		spotifyAlbumLookupFailed: "Spotify konnte das Album des aktuellen Titels nicht finden",
		spotifyOpenAppStartTrack: "Öffne Spotify auf diesem PC, starte einmal einen Titel und versuche es erneut",
		spotifyUnknownPlayerCommand: "Unbekannter Spotify-Player-Befehl",
		spotifyNoPlayableItems: "Keine abspielbaren Spotify-Elemente",
		spotifyMissingUri: "Spotify-URI fehlt",
		spotifyInvalidUri: "Ungültige Spotify-URI",
		backgroundChoiceExpired: "Diese Hintergrundauswahl ist abgelaufen. Suche erneut.",
		invalidBackgroundChoice: "Diese Hintergrundauswahl ist nicht mehr gültig.",
		backgroundDownloadFailed: "Das ausgewählte Bild konnte nicht heruntergeladen werden.",
		unsupportedBackgroundImage: "Das Format des ausgewählten Bildes wird nicht unterstützt.",
		invalidArtist: "Der ausgewählte Künstler ist ungültig.",
		artistNameRequired: "Ein Künstlername ist erforderlich.",
		spotifyArtistCacheBusy: "Der Spotify-Künstlercache wird bereits erstellt.",
		spotifyArtistCacheInUse: "Der Spotify-Künstlercache ist belegt.",
		restartServicesTimedOut: "Zeitüberschreitung beim Neustart der Plugin-Dienste",
		restartServicesAlreadyRunning: "Die Plugin-Dienste werden bereits neu gestartet",
		mediaBridgeRestartFailed: "MediaBridge wurde nicht ordnungsgemäß neu gestartet",
		pluginServiceRestartFailed: "Neustart der Plugin-Dienste fehlgeschlagen"
	}
};
var ru = {
	core: {
		back: "Назад",
		coverFailed: "не удалось загрузить обложку",
		coverSourceOnline: "Онлайн | Высокое разрешение",
		coverSourceWindows: "Windows | Быстрее",
		effectCoverBlur: "Размытие обложки",
		effectEnergySaver: "Энергосбережение",
		effectGlow: "Свечение",
		effectOcean: "Океан",
		localMusicLabel: "Ваша музыка",
		notPlaying: "Включите что-нибудь",
		openApp: "Открыть {app}",
		closeApp: "Закрыть {app}",
		refreshFailed: "Не удалось обновить Now Playing",
		restartServices: "Перезапустить службы плагина",
		restartServicesDescription: "Перезапускает MediaBridge и встроенные вспомогательные службы Now Playing без перезапуска Steam.",
		restartServicesFailed: "Не удалось перезапустить службы плагина",
		restartServicesSuccess: "Службы плагина перезапущены",
		settingsApps: "Источник",
		settingsCoverSource: "Отображение обложки альбома",
		settingsFullscreenEffect: "Визуальные эффекты в полноэкранном режиме",
		settingsLabel: "Настройки",
		settingsRecovery: "Восстановление",
		topbarLeft: "Переместить часы и название трека влево",
		topbarSection: "Верхняя панель",
		topbarTrack: "Показывать трек на верхней панели",
		unknownAlbum: "Неизвестный альбом",
		unknownArtist: "Неизвестный исполнитель",
		volume: "Громкость",
		openCurrentAlbum: "Открыть текущий альбом",
		autoLaunchSources: "Автоматически открывать приложения источников",
		autoLaunchSourcesDescription: "Открывает приложение выбранного сервиса, только если оно ещё не запущено.",
		closeSourcesOnSwitch: "Закрывать приложение предыдущего источника",
		closeSourcesOnSwitchDescription: "При смене источника приостанавливает воспроизведение и закрывает приложение предыдущего сервиса.",
		artistBackgroundSettings: "Настройки фона",
		chooseArtistBackground: "Выбрать фон исполнителя",
		artistBackgroundDescription: "Выберите изображение из сети. Оно будет загружено, сохранено локально и использовано для этого исполнителя.",
		searchingBackgrounds: "Поиск доступных фонов…",
		noBackgroundsFound: "Подходящие фоны не найдены.",
		resolution: "Разрешение",
		downloadAndApply: "Загрузить и применить",
		downloadingBackground: "Загрузка фона…",
		backgroundApplied: "Фон загружен и применён",
		backgroundApplyFailed: "Не удалось применить фон",
		refreshBackgrounds: "Искать снова",
		currentBackground: "Текущий фон",
		restartServicesInProgress: "Перезапуск служб плагина…",
		backgroundSource: "Источник фонов",
		allBackgroundSources: "Все источники",
		spotifyBackgroundSource: "Spotify",
		fanartBackgroundSource: "fanart.tv",
		exportDiagnosticLog: "Экспортировать журнал диагностики",
		diagnosticLogDescription: "Создаёт в папке «Загрузки» безопасный файл диагностики с состоянием проигрывателя, MediaBridge и ошибками изображений. Ключи API и токены удаляются.",
		diagnosticLogExported: "Журнал диагностики сохранён: {path}",
		diagnosticLogExportFailed: "Не удалось экспортировать журнал диагностики",
		backgroundSearchTimedOut: "Время ожидания поиска фонов истекло. Повторите попытку."
	},
	spotify: {
		album: "Альбом",
		albums: "Альбомы",
		albumsAndSingles: "Альбомы и синглы",
		apiPaused: "API приостановлен · {time}",
		apiPausedTitle: "API приостановлен",
		apiPausedWait: "Подождите ещё немного",
		apiPausedDetail: "API Spotify временно приостановлен. Повторите попытку через {time}. Локальные элементы управления воспроизведением остаются доступными.",
		appDescriptionCopied: "Описание приложения скопировано",
		appDescriptionLabel: "App description* (required)",
		appDescriptionValue: "Персональное подключение к Spotify Web API для плагина Now Playing в Decky Loader на Windows.",
		appNameCopied: "Название приложения скопировано",
		appNameLabel: "App name* (required)",
		appNameValue: "Playhub Now Playing",
		artist: "Исполнитель",
		artists: "Исполнители",
		back: "Назад",
		audioQuality: "Качество звука",
		cacheExplanation: "Данные медиатеки Spotify сохраняются в локальном кэше. Используйте «Обновить» только тогда, когда нужно снова обратиться к Spotify и обновить кэш.",
		clearMusicCache: "Очистить кэш музыки Spotify",
		clearingMusicCache: "Очистка кэша музыки Spotify…",
		musicCacheDescription: "Аудио Spotify хранится в локальном кэше объёмом до 1 ГБ. При достижении лимита самые старые файлы удаляются автоматически.",
		changeInSettings: "Изменить в Настройках",
		clientId: "Client ID Spotify",
		clientIdSaved: "Client ID сохранён",
		compactSavedTracks: "Компактный вид сохранённых треков",
		compactSavedTracksCard: "Чтобы сократить число запросов к API Spotify, для сохранённых треков по умолчанию отображаются только действия «Воспроизвести» и «Перемешать», без загрузки полного списка.",
		compactSavedTracksDescription: "Включено по умолчанию. Для сохранённых треков показываются действия «Воспроизвести» и «Перемешать» без загрузки полного списка, что уменьшает число запросов к API Spotify.",
		completeSignIn: "Завершите вход в браузере, затем вернитесь в Steam.",
		connect: "Подключить Spotify",
		connected: "Подключено",
		connectedAs: "Подключено как {name}",
		hideDetails: "Скрыть подробности",
		showDetails: "Показать подробности",
		copyAppDescription: "Копировать описание приложения",
		copyAppName: "Копировать название приложения",
		copyRedirectUri: "Скопировать URI перенаправления",
		developerTerms: "Примите Developer Terms of Service и Design Guidelines, затем нажмите Save.",
		disconnect: "Отключить Spotify",
		enableSpotify: "Включить Spotify",
		followedArtists: "Исполнители",
		fullscreen: "На весь экран",
		genericError: "Что-то пошло не так",
		home: "Главная",
		library: "Медиатека",
		limitedPlaylist: "Spotify показывает списки треков только для ваших плейлистов и плейлистов, где вы являетесь соавтором. При этом сам плейлист всё равно можно воспроизвести.",
		loadingSpotify: "Загрузка Spotify…",
		noAlbums: "Нет доступных альбомов.",
		noPlayback: "Включите что-нибудь",
		noResults: "Ничего не найдено.",
		noTracks: "Нет доступных треков.",
		nothingHere: "Здесь пока ничего нет.",
		nowPlaying: "Сейчас играет",
		openDashboard: "Панель Spotify Developer",
		personalMode: "Персональный режим Web API",
		play: "Воспроизвести",
		playlist: "Плейлист",
		playlists: "Плейлисты",
		popularTracks: "Популярные треки",
		premiumNote: "Для управления воспроизведением в Development Mode требуется Spotify Premium. Ваш Client ID и токены авторизации хранятся только на этом ПК.",
		queue: "Очередь",
		queueEmpty: "В очереди нет следующих треков.",
		redirectCopied: "URL перенаправления скопирован",
		redirectUri: "URL перенаправления",
		refresh: "Обновить",
		repeat: "Повтор",
		requestFailed: "Ошибка запроса к Spotify",
		saveClientId: "Сохранить Client ID",
		savedAlbums: "Альбомы",
		savedTracks: "Сохранённые треки",
		search: "Поиск",
		searchSpotify: "Поиск в Spotify",
		seeAll: "Показать все",
		selectSpotifyHint: "Выберите Spotify в разделе «Источник», чтобы открыть браузер Spotify в Now Playing.",
		settings: "Настройки",
		settingsDescription: "Просматривайте медиатеку Spotify, ищите музыку в каталоге и запускайте воспроизведение в настольном приложении Spotify. Этот необязательный режим использует ваш собственный Client ID разработчика Spotify.",
		setupGuide: "Руководство по настройке",
		setupSteps: [
			"Откройте сайт Spotify Developer, нажмите «Log in» в правом верхнем углу и войдите в свою учётную запись Spotify.",
			"После входа нажмите на профиль в правом верхнем углу, выберите «Dashboard», затем нажмите «Create app».",
			"В поле «App name* (required)» введите название приложения, указанное ниже.",
			"В поле «App description* (required)» введите описание, указанное ниже.",
			"Оставьте поле «Website» пустым.",
			"В поле «Redirect URIs* (required)» точно добавьте URL, указанный ниже.",
			"В разделе «Which API/SDKs are you planning to use?» выберите «Web API» и «Web Playback SDK». Не выбирайте Ads API, iOS или Android.",
			"Примите Developer Terms of Service и Design Guidelines, затем нажмите Save.",
			"Откройте созданное приложение, скопируйте Client ID, вставьте его ниже и подключите Spotify. Client Secret не требуется."
		],
		showLess: "Показать меньше",
		shuffle: "Перемешать",
		spotifyBigPicture: "Big Picture",
		tracks: "Треки",
		unableStartAuthorization: "Не удалось начать авторизацию Spotify",
		unableStartPlayback: "Не удалось запустить воспроизведение",
		untitled: "Без названия",
		volume: "Громкость",
		webApiOnly: "Выберите Web API и Web Playback SDK",
		websiteOptional: "Website — необязательно",
		welcomeBack: "С возвращением, {name}",
		yourMusicInsideSteam: "Ваша музыка в Steam",
		yourPlaylists: "Ваши плейлисты",
		artistCacheTitle: "Кэш фонов исполнителей",
		artistCacheDescription: "Загружает фоны высокого разрешения только для исполнителей, на которых вы подписаны в Spotify.",
		createArtistCache: "Создать кэш фонов исполнителей",
		artistCacheBuilding: "Создание кэша фонов исполнителей…",
		artistCacheProgress: "Загрузка фона: {name}",
		artistCacheCreated: "Кэш фонов исполнителей Spotify создан",
		artistCacheNoFavorites: "Исполнители, на которых вы подписаны, не найдены.",
		clearArtistCache: "Очистить кэш фонов исполнителей",
		artistCacheClearing: "Очистка кэша фонов исполнителей…",
		artistCacheCleared: "Кэш фонов исполнителей Spotify очищен",
		cacheSize: "Загруженные ресурсы",
		newForYou: "Рекомендовано для вас",
		manualBackgrounds: "Фоны, выбранные пользователем",
		manualBackgroundsDescription: "Эти фоны исполнителей сохраняются при очистке кэша изображений.",
		removeManualBackgrounds: "Удалить все выбранные фоны исполнителей",
		manualBackgroundsRemoving: "Удаление выбранных фонов исполнителей…",
		manualBackgroundsRemoved: "Выбранные фоны исполнителей удалены"
	},
	localMusic: {
		albums: "Альбомы",
		albumsCount: "Альбомы",
		artist: "Исполнитель",
		artists: "Исполнители",
		artistsCount: "Исполнители",
		back: "Назад",
		bigPicture: "Big Picture",
		cacheBuilding: "Создание кэша изображений…",
		cacheCleared: "Кэш изображений очищен",
		cacheCreated: "Кэш изображений создан",
		chooseFolder: "Выбрать папку с музыкой",
		chooseSomething: "Включите что-нибудь",
		clearCache: "Очистить кэш изображений",
		createCache: "Создать кэш изображений",
		formats: "MP3, AAC, M4A, FLAC, OGG, Opus и WAV воспроизводятся через Chromium в Steam. WMA, AIFF, APE, WavPack и MKA остаются в каталоге, если их метаданные удаётся прочитать.",
		fullscreen: "На весь экран",
		home: "Главная",
		library: "Медиатека",
		noFolders: "Папки с музыкой ещё не добавлены.",
		noResults: "Ничего не найдено.",
		nothingHere: "Локальная медиатека пуста. Выберите папку и запустите сканирование в Настройках.",
		nowPlaying: "Сейчас играет",
		openFolderError: "Не удалось открыть выбор папки Decky",
		play: "Воспроизвести",
		playerError: "Ошибка локального музыкального проигрывателя",
		queue: "Очередь",
		queueEmpty: "В очереди нет следующих треков.",
		recentAlbums: "Недавно добавленные альбомы",
		remove: "Удалить",
		repeat: "Повтор",
		scan: "Сканировать медиатеку",
		scanComplete: "Локальная музыкальная медиатека обновлена",
		scanning: "Сканирование медиатеки…",
		search: "Поиск",
		searchMusic: "Поиск в разделе «Ваша музыка»",
		settings: "Настройки",
		settingsDescription: "Выберите одну или несколько папок. Now Playing просканирует все вложенные папки, прочитает встроенные теги и обложки и создаст локальную музыкальную медиатеку, удобную для управления геймпадом.",
		shuffle: "Перемешать",
		tracks: "Треки",
		tracksCount: "Треки",
		volume: "Громкость",
		yourMusic: "Ваша музыка",
		cacheProgressScanning: "Сканирование музыкальной библиотеки…",
		cacheProgressProfile: "Загрузка изображения исполнителя: {name}",
		cacheProgressBackground: "Загрузка фона исполнителя: {name}",
		cacheSize: "Загруженные ресурсы",
		cacheProgressRemoving: "Удаление ресурса из кэша: {name}",
		cacheClearing: "Очистка кэша изображений…",
		fanartProvider: "fanart.tv",
		fanartProviderDescription: "Необязательно: добавьте личный API-ключ fanart.tv, чтобы использовать его фоны исполнителей высокого разрешения в результатах и при создании кэша.",
		fanartApiKey: "API-ключ fanart.tv",
		fanartApiPage: "Получить API",
		saveFanartApiKey: "Сохранить API-ключ fanart.tv",
		saved: "Сохранено",
		manualBackgrounds: "Фоны, выбранные пользователем",
		manualBackgroundsDescription: "Эти фоны исполнителей сохраняются при очистке кэша изображений.",
		removeManualBackgrounds: "Удалить все выбранные фоны исполнителей",
		manualBackgroundsRemoving: "Удаление выбранных фонов исполнителей…",
		manualBackgroundsRemoved: "Выбранные фоны исполнителей удалены",
		pickerTitle: "Выбрать локальную музыку",
		addCurrentFolder: "Добавить эту папку",
		openPath: "Перейти",
		noAudioFiles: "Здесь нет папок или поддерживаемых аудиофайлов."
	},
	runtime: {
		localMediaError: "Не удаётся воспроизвести локальный аудиофайл",
		noPlayableLocalTracks: "Нет доступных для воспроизведения локальных треков",
		localPlaybackStartFailed: "Не удалось запустить локальное воспроизведение",
		localAudioRecoveryFailed: "Не удалось восстановить локальное аудио",
		openCurrentSpotifyAlbumFailed: "Не удалось открыть текущий альбом Spotify",
		openCurrentLocalAlbumFailed: "Не удалось открыть текущий локальный альбом",
		unsupportedLocalFormat: "Этот аудиоформат не поддерживается Chromium в Steam",
		localPlayerUnavailable: "Локальный аудиопроигрыватель недоступен",
		currentLocalAlbumUnavailable: "Текущий локальный альбом недоступен",
		currentSpotifyAlbumUnavailable: "Текущий альбом Spotify недоступен",
		windowsOnly: "Этот плагин работает только в Windows",
		helperStartFailed: "Не удалось правильно запустить вспомогательный компонент плагина",
		folderNotFound: "Папка не найдена",
		localTrackNotFound: "Локальный трек не найден",
		localFileUnavailable: "Локальный музыкальный файл недоступен",
		localPlayerNotRunning: "Локальный музыкальный проигрыватель не запущен",
		localPlayerNoResponse: "Локальный музыкальный проигрыватель не отвечает",
		spotifyInvalidTokenResponse: "Spotify вернул недопустимый ответ с токеном",
		spotifyAuthorizationExpired: "Сеанс авторизации Spotify истёк",
		spotifyFinishingConnection: "Завершение подключения к Spotify…",
		spotifyEnterClientId: "Сначала введите Client ID Spotify",
		spotifyWaitingAuthorization: "Ожидание авторизации Spotify…",
		spotifyNotConnected: "Spotify не подключён",
		spotifyRefreshTokenFailed: "Spotify не вернул новый токен доступа",
		spotifyInvalidApiPath: "Недопустимый путь Spotify API",
		spotifyInvalidResponse: "Spotify вернул недопустимый ответ",
		spotifyActionDenied: "Spotify отклонил это действие. Может потребоваться Premium или дополнительное разрешение",
		spotifyNoActiveDevice: "Spotify не нашёл активное устройство воспроизведения",
		spotifyDisabled: "Spotify отключён",
		spotifyConnectFirst: "Сначала подключите Spotify в настройках плагина",
		spotifyUnknownLibrarySection: "Неизвестный раздел медиатеки Spotify",
		spotifyInvalidItem: "Недопустимый элемент Spotify",
		spotifyNoCurrentAlbum: "Для текущего трека нет доступного альбома Spotify",
		spotifyAlbumLookupFailed: "Spotify не удалось найти альбом текущего трека",
		spotifyOpenAppStartTrack: "Откройте Spotify на этом ПК, запустите любую песню и повторите попытку",
		spotifyUnknownPlayerCommand: "Неизвестная команда проигрывателя Spotify",
		spotifyNoPlayableItems: "Нет доступных для воспроизведения элементов Spotify",
		spotifyMissingUri: "Отсутствует URI Spotify",
		spotifyInvalidUri: "Недопустимый URI Spotify",
		backgroundChoiceExpired: "Срок действия выбранного фона истёк. Выполните поиск снова.",
		invalidBackgroundChoice: "Этот вариант фона больше недоступен.",
		backgroundDownloadFailed: "Не удалось скачать выбранное изображение.",
		unsupportedBackgroundImage: "Формат выбранного изображения не поддерживается.",
		invalidArtist: "Выбран некорректный исполнитель.",
		artistNameRequired: "Необходимо указать имя исполнителя.",
		spotifyArtistCacheBusy: "Кэш исполнителей Spotify уже создаётся.",
		spotifyArtistCacheInUse: "Кэш исполнителей Spotify занят.",
		restartServicesTimedOut: "Превышено время ожидания перезапуска служб плагина",
		restartServicesAlreadyRunning: "Перезапуск служб плагина уже выполняется",
		mediaBridgeRestartFailed: "MediaBridge не удалось перезапустить корректно",
		pluginServiceRestartFailed: "Не удалось перезапустить службы плагина"
	}
};
var ja = {
	core: {
		back: "戻る",
		coverFailed: "カバー画像を取得できませんでした",
		coverSourceOnline: "オンライン | 高解像度",
		coverSourceWindows: "Windows | 高速",
		effectCoverBlur: "カバーぼかし",
		effectEnergySaver: "省電力",
		effectGlow: "グロー",
		effectOcean: "オーシャン",
		localMusicLabel: "マイミュージック",
		notPlaying: "何かを再生",
		openApp: "{app} を開く",
		closeApp: "{app} を閉じる",
		refreshFailed: "Now Playing を更新できませんでした",
		restartServices: "プラグインサービスを再起動",
		restartServicesDescription: "Steamを再起動せずに、MediaBridgeとNow Playing付属のヘルパーを再起動します。",
		restartServicesFailed: "プラグインサービスを再起動できませんでした",
		restartServicesSuccess: "プラグインサービスを再起動しました",
		settingsApps: "ソース",
		settingsCoverSource: "アルバムカバー表示",
		settingsFullscreenEffect: "フルスクリーン視覚効果",
		settingsLabel: "設定",
		settingsRecovery: "復旧",
		topbarLeft: "時計と曲名を左側に移動",
		topbarSection: "トップバー",
		topbarTrack: "トップバーに曲名を表示",
		unknownAlbum: "不明なアルバム",
		unknownArtist: "不明なアーティスト",
		volume: "音量",
		openCurrentAlbum: "現在のアルバムを開く",
		autoLaunchSources: "ソースのアプリを自動で開く",
		autoLaunchSourcesDescription: "選択したサービスのアプリが起動していない場合にのみ開きます。",
		closeSourcesOnSwitch: "前のソースのアプリを閉じる",
		closeSourcesOnSwitchDescription: "ソースを切り替えると、再生を一時停止してから前のサービスのアプリを閉じます。",
		artistBackgroundSettings: "背景設定",
		chooseArtistBackground: "アーティストの背景を選択",
		artistBackgroundDescription: "オンライン画像を選択します。選んだ背景はダウンロードしてローカルに保存され、このアーティストに使用されます。",
		searchingBackgrounds: "利用可能な背景を検索しています…",
		noBackgroundsFound: "適切な背景が見つかりませんでした。",
		resolution: "解像度",
		downloadAndApply: "ダウンロードして適用",
		downloadingBackground: "背景をダウンロードしています…",
		backgroundApplied: "背景をダウンロードして適用しました",
		backgroundApplyFailed: "背景を適用できませんでした",
		refreshBackgrounds: "もう一度検索",
		currentBackground: "現在の背景",
		restartServicesInProgress: "プラグインサービスを再起動しています…",
		backgroundSource: "背景の取得元",
		allBackgroundSources: "すべての取得元",
		spotifyBackgroundSource: "Spotify",
		fanartBackgroundSource: "fanart.tv",
		exportDiagnosticLog: "診断ログをエクスポート",
		diagnosticLogDescription: "プレイヤー、MediaBridge、アートワークのエラーを含む安全な診断ファイルをダウンロード フォルダーに作成します。API キーとトークンは削除されます。",
		diagnosticLogExported: "診断ログを {path} に保存しました",
		diagnosticLogExportFailed: "診断ログをエクスポートできませんでした",
		backgroundSearchTimedOut: "背景の検索がタイムアウトしました。もう一度お試しください。"
	},
	spotify: {
		album: "アルバム",
		albums: "アルバム",
		albumsAndSingles: "アルバムとシングル",
		apiPaused: "API一時停止中 · {time}",
		apiPausedTitle: "API一時停止中",
		apiPausedWait: "もう少しお待ちください",
		apiPausedDetail: "Spotify APIは一時的に停止しています。{time}後にもう一度お試しください。ローカルの再生操作は引き続き利用できます。",
		appDescriptionCopied: "アプリの説明をコピーしました",
		appDescriptionLabel: "App description* (required)",
		appDescriptionValue: "Windows版Decky LoaderのNow Playingプラグイン用の個人Spotify Web API接続。",
		appNameCopied: "アプリ名をコピーしました",
		appNameLabel: "App name* (required)",
		appNameValue: "Playhub Now Playing",
		artist: "アーティスト",
		artists: "アーティスト",
		back: "戻る",
		audioQuality: "音質",
		cacheExplanation: "Spotifyライブラリのデータはローカルにキャッシュされます。Spotifyへ再度問い合わせてキャッシュを更新したい場合だけ「更新」を使用してください。",
		clearMusicCache: "Spotify の音楽キャッシュを消去",
		clearingMusicCache: "Spotify の音楽キャッシュを消去しています…",
		musicCacheDescription: "Spotify の音声は最大 1 GB までローカルにキャッシュされます。上限に達すると、古いファイルから自動的に削除されます。",
		changeInSettings: "設定で変更",
		clientId: "Spotify Client ID",
		clientIdSaved: "Client IDを保存しました",
		compactSavedTracks: "保存済み曲のコンパクト表示",
		compactSavedTracksCard: "Spotify APIの使用量を抑えるため、保存済み曲は一覧全体を読み込まず、初期状態では「再生」と「シャッフル」だけを表示します。",
		compactSavedTracksDescription: "初期状態で有効です。保存済み曲の一覧全体を読み込まずに「再生」と「シャッフル」を表示し、Spotify APIへのリクエストを減らします。",
		completeSignIn: "ブラウザーでサインインを完了してからSteamに戻ってください。",
		connect: "Spotifyに接続",
		connected: "接続済み",
		connectedAs: "{name} として接続中",
		hideDetails: "詳細を非表示",
		showDetails: "詳細を表示",
		copyAppDescription: "アプリの説明をコピー",
		copyAppName: "アプリ名をコピー",
		copyRedirectUri: "リダイレクト URI をコピー",
		developerTerms: "Developer Terms of ServiceとDesign Guidelinesに同意し、Saveをクリックしてください。",
		disconnect: "Spotifyから切断",
		enableSpotify: "Spotifyを有効化",
		followedArtists: "アーティスト",
		fullscreen: "フルスクリーン",
		genericError: "問題が発生しました",
		home: "ホーム",
		library: "ライブラリ",
		limitedPlaylist: "Spotifyで曲一覧を表示できるのは、自分が所有または共同編集しているプレイリストだけです。このプレイリスト自体は再生できます。",
		loadingSpotify: "Spotifyを読み込み中…",
		noAlbums: "利用できるアルバムがありません。",
		noPlayback: "何かを再生",
		noResults: "結果が見つかりませんでした。",
		noTracks: "利用できる曲がありません。",
		nothingHere: "まだ何もありません。",
		nowPlaying: "再生中",
		openDashboard: "Spotify Developer Dashboard",
		personalMode: "個人用Web APIモード",
		play: "再生",
		playlist: "プレイリスト",
		playlists: "プレイリスト",
		popularTracks: "人気の曲",
		premiumNote: "Development Modeで再生を操作するにはSpotify Premiumが必要です。Client IDと認証トークンはこのPC内に保存されます。",
		queue: "キュー",
		queueEmpty: "次に再生する曲はありません。",
		redirectCopied: "リダイレクトURLをコピーしました",
		redirectUri: "リダイレクトURL",
		refresh: "更新",
		repeat: "リピート",
		requestFailed: "Spotifyへのリクエストに失敗しました",
		saveClientId: "Client IDを保存",
		savedAlbums: "アルバム",
		savedTracks: "保存済みの曲",
		search: "検索",
		searchSpotify: "Spotifyを検索",
		seeAll: "すべて表示",
		selectSpotifyHint: "ソースでSpotifyを選択すると、Now PlayingにSpotifyブラウザーが表示されます。",
		settings: "設定",
		settingsDescription: "Spotifyライブラリの閲覧、カタログ検索、Spotifyデスクトップアプリでの再生開始ができます。この任意機能では、自分のSpotify開発者Client IDを使用します。",
		setupGuide: "設定ガイド",
		setupSteps: [
			"Spotify Developerサイトを開き、右上の「Log in」をクリックしてSpotifyアカウントにサインインします。",
			"サインイン後、右上のプロフィールをクリックし、「Dashboard」を選んでから「Create app」をクリックします。",
			"「App name* (required)」に、下に表示されているアプリ名を入力します。",
			"「App description* (required)」に、下に表示されている説明を入力します。",
			"「Website」は空欄のままにします。",
			"「Redirect URIs* (required)」に、下に表示されているURLをそのまま追加します。",
			"「Which API/SDKs are you planning to use?」では「Web API」と「Web Playback SDK」を選択します。Ads API、iOS、Androidは選択しないでください。",
			"Developer Terms of ServiceとDesign Guidelinesに同意し、Saveをクリックします。",
			"作成したアプリを開き、Client IDをコピーして下に貼り付け、Spotifyに接続します。Client Secretは不要です。"
		],
		showLess: "折りたたむ",
		shuffle: "シャッフル",
		spotifyBigPicture: "Big Picture",
		tracks: "曲",
		unableStartAuthorization: "Spotify認証を開始できませんでした",
		unableStartPlayback: "再生を開始できませんでした",
		untitled: "タイトルなし",
		volume: "音量",
		webApiOnly: "Web APIとWeb Playback SDKを選択",
		websiteOptional: "Website — 任意",
		welcomeBack: "おかえりなさい、{name}",
		yourMusicInsideSteam: "Steamの中のあなたの音楽",
		yourPlaylists: "あなたのプレイリスト",
		artistCacheTitle: "アーティスト背景キャッシュ",
		artistCacheDescription: "Spotifyでフォローしているアーティストだけ、高解像度の背景をダウンロードします。",
		createArtistCache: "アーティスト背景キャッシュを作成",
		artistCacheBuilding: "アーティスト背景キャッシュを作成しています…",
		artistCacheProgress: "背景をダウンロード中: {name}",
		artistCacheCreated: "Spotifyアーティスト背景キャッシュを作成しました",
		artistCacheNoFavorites: "フォロー中のアーティストが見つかりませんでした。",
		clearArtistCache: "アーティスト背景キャッシュを消去",
		artistCacheClearing: "アーティスト背景キャッシュを消去中…",
		artistCacheCleared: "Spotify のアーティスト背景キャッシュを消去しました",
		cacheSize: "ダウンロード済みアセット",
		newForYou: "あなたへのおすすめ",
		manualBackgrounds: "ユーザーが選択した背景",
		manualBackgroundsDescription: "これらのアーティスト背景は、画像キャッシュを消去しても保持されます。",
		removeManualBackgrounds: "選択したアーティスト背景をすべて削除",
		manualBackgroundsRemoving: "選択したアーティスト背景を削除しています…",
		manualBackgroundsRemoved: "選択したアーティスト背景を削除しました"
	},
	localMusic: {
		albums: "アルバム",
		albumsCount: "アルバム",
		artist: "アーティスト",
		artists: "アーティスト",
		artistsCount: "アーティスト",
		back: "戻る",
		bigPicture: "Big Picture",
		cacheBuilding: "画像キャッシュを作成中…",
		cacheCleared: "画像キャッシュを消去しました",
		cacheCreated: "画像キャッシュを作成しました",
		chooseFolder: "音楽フォルダーを選択",
		chooseSomething: "何かを再生",
		clearCache: "画像キャッシュを消去",
		createCache: "画像キャッシュを作成",
		formats: "MP3、AAC、M4A、FLAC、OGG、Opus、WAVはSteam Chromium経由で再生されます。WMA、AIFF、APE、WavPack、MKAは、メタデータを読み取れる場合はライブラリに登録されます。",
		fullscreen: "フルスクリーン",
		home: "ホーム",
		library: "ライブラリ",
		noFolders: "音楽フォルダーはまだ追加されていません。",
		noResults: "結果が見つかりませんでした。",
		nothingHere: "ローカルライブラリは空です。設定でフォルダーを選択してスキャンしてください。",
		nowPlaying: "再生中",
		openFolderError: "Deckyのフォルダー選択画面を開けませんでした",
		play: "再生",
		playerError: "ローカル音楽プレイヤーでエラーが発生しました",
		queue: "キュー",
		queueEmpty: "次に再生する曲はありません。",
		recentAlbums: "最近追加したアルバム",
		remove: "削除",
		repeat: "リピート",
		scan: "ライブラリをスキャン",
		scanComplete: "ローカル音楽ライブラリを更新しました",
		scanning: "ライブラリをスキャン中…",
		search: "検索",
		searchMusic: "マイミュージックを検索",
		settings: "設定",
		settingsDescription: "1つ以上のフォルダーを選択してください。Now Playingがすべてのサブフォルダーをスキャンし、埋め込みタグとアートワークを読み取って、コントローラーで操作しやすいローカル音楽ライブラリを作成します。",
		shuffle: "シャッフル",
		tracks: "曲",
		tracksCount: "曲",
		volume: "音量",
		yourMusic: "マイミュージック",
		cacheProgressScanning: "音楽ライブラリをスキャンしています…",
		cacheProgressProfile: "アーティスト画像をダウンロード中: {name}",
		cacheProgressBackground: "アーティスト背景をダウンロード中: {name}",
		cacheSize: "ダウンロード済みアセット",
		cacheProgressRemoving: "キャッシュ済み素材を削除中: {name}",
		cacheClearing: "画像キャッシュを消去中…",
		fanartProvider: "fanart.tv",
		fanartProviderDescription: "任意: 個人用の fanart.tv API キーを追加すると、高解像度のアーティスト背景を検索結果やキャッシュ作成に利用できます。",
		fanartApiKey: "fanart.tv API キー",
		fanartApiPage: "APIを取得",
		saveFanartApiKey: "fanart.tv API キーを保存",
		saved: "保存しました",
		manualBackgrounds: "ユーザーが選択した背景",
		manualBackgroundsDescription: "これらのアーティスト背景は、画像キャッシュを消去しても保持されます。",
		removeManualBackgrounds: "選択したアーティスト背景をすべて削除",
		manualBackgroundsRemoving: "選択したアーティスト背景を削除しています…",
		manualBackgroundsRemoved: "選択したアーティスト背景を削除しました",
		pickerTitle: "ローカル音楽を選択",
		addCurrentFolder: "このフォルダーを追加",
		openPath: "移動",
		noAudioFiles: "フォルダーまたは対応する音声ファイルがありません。"
	},
	runtime: {
		localMediaError: "ローカル音声ファイルを再生できません",
		noPlayableLocalTracks: "再生できるローカル曲がありません",
		localPlaybackStartFailed: "ローカル再生を開始できませんでした",
		localAudioRecoveryFailed: "ローカル音声を復旧できませんでした",
		openCurrentSpotifyAlbumFailed: "現在のSpotifyアルバムを開けませんでした",
		openCurrentLocalAlbumFailed: "現在のローカルアルバムを開けませんでした",
		unsupportedLocalFormat: "この音声形式はSteam Chromiumでサポートされていません",
		localPlayerUnavailable: "ローカル音声プレイヤーを利用できません",
		currentLocalAlbumUnavailable: "現在のローカルアルバムは利用できません",
		currentSpotifyAlbumUnavailable: "現在のSpotifyアルバムは利用できません",
		windowsOnly: "このプラグインはWindowsでのみ動作します",
		helperStartFailed: "プラグインの補助コンポーネントを正しく起動できませんでした",
		folderNotFound: "フォルダーが見つかりません",
		localTrackNotFound: "ローカル曲が見つかりません",
		localFileUnavailable: "ローカル音楽ファイルを利用できません",
		localPlayerNotRunning: "ローカル音楽プレイヤーが起動していません",
		localPlayerNoResponse: "ローカル音楽プレイヤーが応答しません",
		spotifyInvalidTokenResponse: "Spotifyから無効なトークン応答が返されました",
		spotifyAuthorizationExpired: "Spotifyの認証セッションが期限切れです",
		spotifyFinishingConnection: "Spotifyへの接続を完了しています…",
		spotifyEnterClientId: "先にSpotifyのClient IDを入力してください",
		spotifyWaitingAuthorization: "Spotifyの認証を待っています…",
		spotifyNotConnected: "Spotifyに接続されていません",
		spotifyRefreshTokenFailed: "Spotifyから新しいアクセストークンが返されませんでした",
		spotifyInvalidApiPath: "Spotify APIのパスが無効です",
		spotifyInvalidResponse: "Spotifyから無効な応答が返されました",
		spotifyActionDenied: "Spotifyがこの操作を拒否しました。Premiumまたは追加の権限が必要な場合があります",
		spotifyNoActiveDevice: "Spotifyで再生中のデバイスが見つかりませんでした",
		spotifyDisabled: "Spotifyは無効です",
		spotifyConnectFirst: "先にプラグイン設定でSpotifyに接続してください",
		spotifyUnknownLibrarySection: "不明なSpotifyライブラリセクションです",
		spotifyInvalidItem: "Spotify項目が無効です",
		spotifyNoCurrentAlbum: "現在の曲に利用できるSpotifyアルバムがありません",
		spotifyAlbumLookupFailed: "現在の曲のアルバムをSpotifyで見つけられませんでした",
		spotifyOpenAppStartTrack: "このPCでSpotifyを開き、曲を一度再生してから再試行してください",
		spotifyUnknownPlayerCommand: "不明なSpotifyプレイヤーコマンドです",
		spotifyNoPlayableItems: "再生できるSpotify項目がありません",
		spotifyMissingUri: "Spotify URIがありません",
		spotifyInvalidUri: "Spotify URIが無効です",
		backgroundChoiceExpired: "この背景候補は期限切れです。もう一度検索してください。",
		invalidBackgroundChoice: "この背景候補は無効になりました。",
		backgroundDownloadFailed: "選択した画像をダウンロードできませんでした。",
		unsupportedBackgroundImage: "選択した画像形式はサポートされていません。",
		invalidArtist: "選択したアーティストは無効です。",
		artistNameRequired: "アーティスト名が必要です。",
		spotifyArtistCacheBusy: "Spotifyアーティストキャッシュはすでに作成中です。",
		spotifyArtistCacheInUse: "Spotify のアーティストキャッシュは使用中です。",
		restartServicesTimedOut: "プラグインサービスの再起動がタイムアウトしました",
		restartServicesAlreadyRunning: "プラグインサービスはすでに再起動中です",
		mediaBridgeRestartFailed: "MediaBridgeを正常に再起動できませんでした",
		pluginServiceRestartFailed: "プラグインサービスの再起動に失敗しました"
	}
};
var ko = {
	core: {
		back: "뒤로",
		coverFailed: "앨범 아트를 불러오지 못했습니다",
		coverSourceOnline: "온라인 | 고해상도",
		coverSourceWindows: "Windows | 빠른 로딩",
		effectCoverBlur: "커버 블러",
		effectEnergySaver: "절전 모드",
		effectGlow: "글로우",
		effectOcean: "오션",
		localMusicLabel: "내 음악",
		notPlaying: "음악을 재생하세요",
		openApp: "{app} 열기",
		closeApp: "{app} 닫기",
		refreshFailed: "Now Playing을 새로 고치지 못했습니다",
		restartServices: "플러그인 서비스 다시 시작",
		restartServicesDescription: "Steam을 다시 시작하지 않고 MediaBridge와 Now Playing에 포함된 도우미를 다시 시작합니다.",
		restartServicesFailed: "플러그인 서비스를 다시 시작하지 못했습니다",
		restartServicesSuccess: "플러그인 서비스를 다시 시작했습니다",
		settingsApps: "소스",
		settingsCoverSource: "앨범 커버 표시",
		settingsFullscreenEffect: "전체 화면 시각 효과",
		settingsLabel: "설정",
		settingsRecovery: "복구",
		topbarLeft: "시계와 곡 정보를 왼쪽으로 이동",
		topbarSection: "상단 바",
		topbarTrack: "상단 바에 곡 정보 표시",
		unknownAlbum: "알 수 없는 앨범",
		unknownArtist: "알 수 없는 아티스트",
		volume: "볼륨",
		openCurrentAlbum: "현재 앨범 열기",
		autoLaunchSources: "소스 앱 자동 실행",
		autoLaunchSourcesDescription: "선택한 서비스 앱이 실행 중이 아닐 때만 엽니다.",
		closeSourcesOnSwitch: "이전 소스 앱 닫기",
		closeSourcesOnSwitchDescription: "소스를 바꾸면 재생을 일시 정지한 뒤 이전 서비스 앱을 닫습니다.",
		artistBackgroundSettings: "배경 설정",
		chooseArtistBackground: "아티스트 배경 선택",
		artistBackgroundDescription: "온라인 이미지를 선택하세요. 선택한 배경은 다운로드되어 로컬에 저장되고 이 아티스트에 사용됩니다.",
		searchingBackgrounds: "사용 가능한 배경을 찾는 중…",
		noBackgroundsFound: "적합한 배경을 찾지 못했습니다.",
		resolution: "해상도",
		downloadAndApply: "다운로드 후 적용",
		downloadingBackground: "배경 다운로드 중…",
		backgroundApplied: "배경을 다운로드하고 적용했습니다",
		backgroundApplyFailed: "배경을 적용할 수 없습니다",
		refreshBackgrounds: "다시 검색",
		currentBackground: "현재 배경",
		restartServicesInProgress: "플러그인 서비스를 다시 시작하는 중…",
		backgroundSource: "배경 소스",
		allBackgroundSources: "모든 소스",
		spotifyBackgroundSource: "Spotify",
		fanartBackgroundSource: "fanart.tv",
		exportDiagnosticLog: "진단 로그 내보내기",
		diagnosticLogDescription: "플레이어, MediaBridge 및 아트워크 오류가 포함된 안전한 진단 파일을 다운로드 폴더에 만듭니다. API 키와 토큰은 제거됩니다.",
		diagnosticLogExported: "진단 로그를 {path}에 저장했습니다",
		diagnosticLogExportFailed: "진단 로그를 내보낼 수 없습니다",
		backgroundSearchTimedOut: "배경 검색 시간이 초과되었습니다. 다시 시도하세요."
	},
	spotify: {
		album: "앨범",
		albums: "앨범",
		albumsAndSingles: "앨범 및 싱글",
		apiPaused: "API 일시 중지 · {time}",
		apiPausedTitle: "API 일시 중지",
		apiPausedWait: "잠시만 더 기다려 주세요",
		apiPausedDetail: "Spotify API가 일시적으로 중지되었습니다. {time} 후 다시 시도하세요. 로컬 재생 컨트롤은 계속 사용할 수 있습니다.",
		appDescriptionCopied: "앱 설명을 복사했습니다",
		appDescriptionLabel: "App description* (required)",
		appDescriptionValue: "Windows용 Decky Loader의 Now Playing 플러그인을 위한 개인 Spotify Web API 연결입니다.",
		appNameCopied: "앱 이름을 복사했습니다",
		appNameLabel: "App name* (required)",
		appNameValue: "Playhub Now Playing",
		artist: "아티스트",
		artists: "아티스트",
		back: "뒤로",
		audioQuality: "오디오 품질",
		cacheExplanation: "Spotify 라이브러리 데이터는 로컬에 캐시됩니다. Spotify에 다시 요청해 캐시를 갱신하려는 경우에만 새로 고침을 사용하세요.",
		clearMusicCache: "Spotify 음악 캐시 지우기",
		clearingMusicCache: "Spotify 음악 캐시를 지우는 중…",
		musicCacheDescription: "Spotify 오디오는 최대 1GB까지 로컬에 캐시됩니다. 한도에 도달하면 오래된 파일부터 자동으로 삭제됩니다.",
		changeInSettings: "설정에서 변경",
		clientId: "Spotify Client ID",
		clientIdSaved: "Client ID를 저장했습니다",
		compactSavedTracks: "저장한 곡 간단히 보기",
		compactSavedTracksCard: "Spotify API 사용량을 줄이기 위해 저장한 곡은 전체 목록을 불러오는 대신 기본적으로 재생 및 셔플 작업만 표시합니다.",
		compactSavedTracksDescription: "기본적으로 켜져 있습니다. 저장한 곡의 전체 목록을 불러오지 않고 재생과 셔플을 표시해 Spotify API 요청을 줄입니다.",
		completeSignIn: "브라우저에서 로그인을 완료한 뒤 Steam으로 돌아오세요.",
		connect: "Spotify 연결",
		connected: "연결됨",
		connectedAs: "{name}(으)로 연결됨",
		hideDetails: "세부 정보 숨기기",
		showDetails: "세부 정보 표시",
		copyAppDescription: "앱 설명 복사",
		copyAppName: "앱 이름 복사",
		copyRedirectUri: "리디렉션 URI 복사",
		developerTerms: "Developer Terms of Service와 Design Guidelines에 동의한 다음 Save를 클릭하세요.",
		disconnect: "Spotify 연결 해제",
		enableSpotify: "Spotify 사용",
		followedArtists: "아티스트",
		fullscreen: "전체 화면",
		genericError: "문제가 발생했습니다",
		home: "홈",
		library: "라이브러리",
		limitedPlaylist: "Spotify는 내가 소유하거나 공동 작업 중인 플레이리스트에 대해서만 곡 목록을 제공합니다. 그래도 이 플레이리스트를 재생할 수는 있습니다.",
		loadingSpotify: "Spotify 불러오는 중…",
		noAlbums: "사용 가능한 앨범이 없습니다.",
		noPlayback: "음악을 재생하세요",
		noResults: "검색 결과가 없습니다.",
		noTracks: "사용 가능한 곡이 없습니다.",
		nothingHere: "아직 아무것도 없습니다.",
		nowPlaying: "재생 중",
		openDashboard: "Spotify Developer Dashboard",
		personalMode: "개인 Web API 모드",
		play: "재생",
		playlist: "플레이리스트",
		playlists: "플레이리스트",
		popularTracks: "인기 곡",
		premiumNote: "Development Mode에서 재생을 제어하려면 Spotify Premium이 필요합니다. Client ID와 인증 토큰은 이 PC에만 저장됩니다.",
		queue: "대기열",
		queueEmpty: "다음에 재생할 곡이 없습니다.",
		redirectCopied: "리디렉션 URL을 복사했습니다",
		redirectUri: "리디렉션 URL",
		refresh: "새로 고침",
		repeat: "반복",
		requestFailed: "Spotify 요청에 실패했습니다",
		saveClientId: "Client ID 저장",
		savedAlbums: "앨범",
		savedTracks: "저장한 곡",
		search: "검색",
		searchSpotify: "Spotify 검색",
		seeAll: "모두 보기",
		selectSpotifyHint: "소스 섹션에서 Spotify를 선택하면 Now Playing에 Spotify 브라우저가 표시됩니다.",
		settings: "설정",
		settingsDescription: "Spotify 라이브러리를 둘러보고 카탈로그를 검색한 뒤 Spotify 데스크톱 앱에서 재생을 시작할 수 있습니다. 이 선택 기능은 사용자의 Spotify 개발자 Client ID를 사용합니다.",
		setupGuide: "설정 안내",
		setupSteps: [
			"Spotify Developer 사이트를 열고 오른쪽 위의 “Log in”을 클릭해 Spotify 계정에 로그인합니다.",
			"로그인 후 오른쪽 위의 프로필을 클릭하고 “Dashboard”를 선택한 다음 “Create app”을 클릭합니다.",
			"“App name* (required)”에 아래에 표시된 앱 이름을 입력합니다.",
			"“App description* (required)”에 아래에 표시된 설명을 입력합니다.",
			"“Website”는 비워 둡니다.",
			"“Redirect URIs* (required)”에 아래 URL을 표시된 그대로 추가합니다.",
			"“Which API/SDKs are you planning to use?”에서 “Web API”와 “Web Playback SDK”를 선택합니다. Ads API, iOS 또는 Android는 선택하지 마세요.",
			"Developer Terms of Service와 Design Guidelines에 동의한 다음 Save를 클릭합니다.",
			"새 앱을 열어 Client ID를 복사하고 아래에 붙여 넣은 뒤 Spotify를 연결합니다. Client Secret은 필요하지 않습니다."
		],
		showLess: "접기",
		shuffle: "셔플",
		spotifyBigPicture: "Big Picture",
		tracks: "곡",
		unableStartAuthorization: "Spotify 인증을 시작하지 못했습니다",
		unableStartPlayback: "재생을 시작하지 못했습니다",
		untitled: "제목 없음",
		volume: "볼륨",
		webApiOnly: "Web API와 Web Playback SDK 선택",
		websiteOptional: "Website — 선택 사항",
		welcomeBack: "다시 오신 것을 환영합니다, {name}",
		yourMusicInsideSteam: "Steam 안의 내 음악",
		yourPlaylists: "내 플레이리스트",
		artistCacheTitle: "아티스트 배경 캐시",
		artistCacheDescription: "Spotify에서 팔로우한 아티스트의 고해상도 배경만 다운로드합니다.",
		createArtistCache: "아티스트 배경 캐시 만들기",
		artistCacheBuilding: "아티스트 배경 캐시 만드는 중…",
		artistCacheProgress: "배경 다운로드 중: {name}",
		artistCacheCreated: "Spotify 아티스트 배경 캐시를 만들었습니다",
		artistCacheNoFavorites: "팔로우한 아티스트를 찾지 못했습니다.",
		clearArtistCache: "아티스트 배경 캐시 비우기",
		artistCacheClearing: "아티스트 배경 캐시 비우는 중…",
		artistCacheCleared: "Spotify 아티스트 배경 캐시를 비웠습니다",
		cacheSize: "다운로드한 에셋",
		newForYou: "회원님을 위한 추천",
		manualBackgrounds: "사용자가 선택한 배경",
		manualBackgroundsDescription: "이 아티스트 배경은 이미지 캐시를 비워도 유지됩니다.",
		removeManualBackgrounds: "선택한 아티스트 배경 모두 제거",
		manualBackgroundsRemoving: "선택한 아티스트 배경을 제거하는 중…",
		manualBackgroundsRemoved: "선택한 아티스트 배경을 제거했습니다"
	},
	localMusic: {
		albums: "앨범",
		albumsCount: "앨범",
		artist: "아티스트",
		artists: "아티스트",
		artistsCount: "아티스트",
		back: "뒤로",
		bigPicture: "Big Picture",
		cacheBuilding: "이미지 캐시 생성 중…",
		cacheCleared: "이미지 캐시를 비웠습니다",
		cacheCreated: "이미지 캐시를 생성했습니다",
		chooseFolder: "음악 폴더 선택",
		chooseSomething: "음악을 재생하세요",
		clearCache: "이미지 캐시 비우기",
		createCache: "이미지 캐시 만들기",
		formats: "MP3, AAC, M4A, FLAC, OGG, Opus, WAV는 Steam Chromium을 통해 재생됩니다. WMA, AIFF, APE, WavPack, MKA는 메타데이터를 읽을 수 있는 경우 라이브러리에 계속 표시됩니다.",
		fullscreen: "전체 화면",
		home: "홈",
		library: "라이브러리",
		noFolders: "아직 음악 폴더를 추가하지 않았습니다.",
		noResults: "검색 결과가 없습니다.",
		nothingHere: "로컬 라이브러리가 비어 있습니다. 설정에서 폴더를 선택하고 스캔하세요.",
		nowPlaying: "재생 중",
		openFolderError: "Decky 폴더 선택기를 열 수 없습니다",
		play: "재생",
		playerError: "로컬 음악 플레이어 오류",
		queue: "대기열",
		queueEmpty: "다음에 재생할 곡이 없습니다.",
		recentAlbums: "최근 추가한 앨범",
		remove: "삭제",
		repeat: "반복",
		scan: "라이브러리 스캔",
		scanComplete: "로컬 음악 라이브러리를 업데이트했습니다",
		scanning: "라이브러리 스캔 중…",
		search: "검색",
		searchMusic: "내 음악 검색",
		settings: "설정",
		settingsDescription: "하나 이상의 폴더를 선택하세요. Now Playing은 모든 하위 폴더를 스캔하고 내장 태그와 앨범 아트를 읽어 컨트롤러로 편하게 탐색할 수 있는 로컬 음악 라이브러리를 만듭니다.",
		shuffle: "셔플",
		tracks: "곡",
		tracksCount: "곡",
		volume: "볼륨",
		yourMusic: "내 음악",
		cacheProgressScanning: "음악 라이브러리 스캔 중…",
		cacheProgressProfile: "아티스트 이미지 다운로드 중: {name}",
		cacheProgressBackground: "아티스트 배경 다운로드 중: {name}",
		cacheSize: "다운로드한 에셋",
		cacheProgressRemoving: "캐시된 자산 삭제 중: {name}",
		cacheClearing: "이미지 캐시 비우는 중…",
		fanartProvider: "fanart.tv",
		fanartProviderDescription: "선택 사항: 개인 fanart.tv API 키를 추가하면 고해상도 아티스트 배경을 검색 결과와 캐시 생성에 포함할 수 있습니다.",
		fanartApiKey: "fanart.tv API 키",
		fanartApiPage: "API 받기",
		saveFanartApiKey: "fanart.tv API 키 저장",
		saved: "저장됨",
		manualBackgrounds: "사용자가 선택한 배경",
		manualBackgroundsDescription: "이 아티스트 배경은 이미지 캐시를 비워도 유지됩니다.",
		removeManualBackgrounds: "선택한 아티스트 배경 모두 제거",
		manualBackgroundsRemoving: "선택한 아티스트 배경을 제거하는 중…",
		manualBackgroundsRemoved: "선택한 아티스트 배경을 제거했습니다",
		pickerTitle: "로컬 음악 선택",
		addCurrentFolder: "이 폴더 추가",
		openPath: "이동",
		noAudioFiles: "여기에 폴더나 지원되는 오디오 파일이 없습니다."
	},
	runtime: {
		localMediaError: "로컬 오디오 파일을 재생할 수 없습니다",
		noPlayableLocalTracks: "재생할 수 있는 로컬 곡이 없습니다",
		localPlaybackStartFailed: "로컬 재생을 시작하지 못했습니다",
		localAudioRecoveryFailed: "로컬 오디오를 복구하지 못했습니다",
		openCurrentSpotifyAlbumFailed: "현재 Spotify 앨범을 열지 못했습니다",
		openCurrentLocalAlbumFailed: "현재 로컬 앨범을 열지 못했습니다",
		unsupportedLocalFormat: "이 오디오 형식은 Steam Chromium에서 지원되지 않습니다",
		localPlayerUnavailable: "로컬 오디오 플레이어를 사용할 수 없습니다",
		currentLocalAlbumUnavailable: "현재 로컬 앨범을 사용할 수 없습니다",
		currentSpotifyAlbumUnavailable: "현재 Spotify 앨범을 사용할 수 없습니다",
		windowsOnly: "이 플러그인은 Windows에서만 작동합니다",
		helperStartFailed: "플러그인 보조 구성 요소를 올바르게 시작하지 못했습니다",
		folderNotFound: "폴더를 찾을 수 없습니다",
		localTrackNotFound: "로컬 곡을 찾을 수 없습니다",
		localFileUnavailable: "로컬 음악 파일을 사용할 수 없습니다",
		localPlayerNotRunning: "로컬 음악 플레이어가 실행 중이 아닙니다",
		localPlayerNoResponse: "로컬 음악 플레이어가 응답하지 않습니다",
		spotifyInvalidTokenResponse: "Spotify에서 잘못된 토큰 응답을 반환했습니다",
		spotifyAuthorizationExpired: "Spotify 인증 세션이 만료되었습니다",
		spotifyFinishingConnection: "Spotify 연결을 완료하는 중…",
		spotifyEnterClientId: "먼저 Spotify Client ID를 입력하세요",
		spotifyWaitingAuthorization: "Spotify 인증을 기다리는 중…",
		spotifyNotConnected: "Spotify가 연결되어 있지 않습니다",
		spotifyRefreshTokenFailed: "Spotify에서 새 액세스 토큰을 반환하지 않았습니다",
		spotifyInvalidApiPath: "Spotify API 경로가 올바르지 않습니다",
		spotifyInvalidResponse: "Spotify에서 잘못된 응답을 반환했습니다",
		spotifyActionDenied: "Spotify에서 이 작업을 거부했습니다. Premium 또는 추가 권한이 필요할 수 있습니다",
		spotifyNoActiveDevice: "Spotify에서 활성 재생 장치를 찾지 못했습니다",
		spotifyDisabled: "Spotify가 비활성화되어 있습니다",
		spotifyConnectFirst: "먼저 플러그인 설정에서 Spotify를 연결하세요",
		spotifyUnknownLibrarySection: "알 수 없는 Spotify 라이브러리 섹션입니다",
		spotifyInvalidItem: "잘못된 Spotify 항목입니다",
		spotifyNoCurrentAlbum: "현재 곡에 사용할 수 있는 Spotify 앨범이 없습니다",
		spotifyAlbumLookupFailed: "Spotify에서 현재 곡의 앨범을 찾지 못했습니다",
		spotifyOpenAppStartTrack: "이 PC에서 Spotify를 열고 곡을 한 번 재생한 다음 다시 시도하세요",
		spotifyUnknownPlayerCommand: "알 수 없는 Spotify 플레이어 명령입니다",
		spotifyNoPlayableItems: "재생할 수 있는 Spotify 항목이 없습니다",
		spotifyMissingUri: "Spotify URI가 없습니다",
		spotifyInvalidUri: "Spotify URI가 올바르지 않습니다",
		backgroundChoiceExpired: "이 배경 선택이 만료되었습니다. 다시 검색하세요.",
		invalidBackgroundChoice: "이 배경 선택은 더 이상 유효하지 않습니다.",
		backgroundDownloadFailed: "선택한 이미지를 다운로드할 수 없습니다.",
		unsupportedBackgroundImage: "선택한 이미지 형식은 지원되지 않습니다.",
		invalidArtist: "선택한 아티스트가 올바르지 않습니다.",
		artistNameRequired: "아티스트 이름이 필요합니다.",
		spotifyArtistCacheBusy: "Spotify 아티스트 캐시가 이미 생성 중입니다.",
		spotifyArtistCacheInUse: "Spotify 아티스트 캐시가 사용 중입니다.",
		restartServicesTimedOut: "플러그인 서비스 다시 시작 시간이 초과되었습니다",
		restartServicesAlreadyRunning: "플러그인 서비스를 이미 다시 시작하고 있습니다",
		mediaBridgeRestartFailed: "MediaBridge가 올바르게 다시 시작되지 않았습니다",
		pluginServiceRestartFailed: "플러그인 서비스 다시 시작에 실패했습니다"
	}
};
var zh = {
	core: {
		back: "返回",
		coverFailed: "无法加载封面",
		coverSourceOnline: "在线 | 高分辨率",
		coverSourceWindows: "Windows | 更快",
		effectCoverBlur: "封面模糊",
		effectEnergySaver: "节能模式",
		effectGlow: "辉光",
		effectOcean: "海洋",
		localMusicLabel: "你的音乐",
		notPlaying: "播放点什么",
		openApp: "打开 {app}",
		closeApp: "关闭 {app}",
		refreshFailed: "无法刷新 Now Playing",
		restartServices: "重启插件服务",
		restartServicesDescription: "无需重启 Steam，即可重启 MediaBridge 和 Now Playing 自带的辅助程序。",
		restartServicesFailed: "无法重启插件服务",
		restartServicesSuccess: "插件服务已重启",
		settingsApps: "来源",
		settingsCoverSource: "专辑封面显示",
		settingsFullscreenEffect: "全屏视觉效果",
		settingsLabel: "设置",
		settingsRecovery: "恢复",
		topbarLeft: "将时钟和曲目信息移到左侧",
		topbarSection: "顶部栏",
		topbarTrack: "在顶部栏显示曲目",
		unknownAlbum: "未知专辑",
		unknownArtist: "未知艺人",
		volume: "音量",
		openCurrentAlbum: "打开当前专辑",
		autoLaunchSources: "自动打开来源应用",
		autoLaunchSourcesDescription: "仅在所选服务的应用尚未运行时将其打开。",
		closeSourcesOnSwitch: "关闭上一个来源应用",
		closeSourcesOnSwitchDescription: "切换来源时，先暂停播放，再关闭上一个服务的应用。",
		artistBackgroundSettings: "背景设置",
		chooseArtistBackground: "选择艺人背景",
		artistBackgroundDescription: "选择一张在线图片。所选背景将下载并保存在本地，用于该艺人。",
		searchingBackgrounds: "正在搜索可用背景…",
		noBackgroundsFound: "未找到合适的背景。",
		resolution: "分辨率",
		downloadAndApply: "下载并应用",
		downloadingBackground: "正在下载背景…",
		backgroundApplied: "背景已下载并应用",
		backgroundApplyFailed: "无法应用背景",
		refreshBackgrounds: "重新搜索",
		currentBackground: "当前背景",
		restartServicesInProgress: "正在重启插件服务…",
		backgroundSource: "背景来源",
		allBackgroundSources: "所有来源",
		spotifyBackgroundSource: "Spotify",
		fanartBackgroundSource: "fanart.tv",
		exportDiagnosticLog: "导出诊断日志",
		diagnosticLogDescription: "在“下载”文件夹中创建安全的诊断文件，其中包含播放器、MediaBridge 和图片错误。API 密钥和令牌会被移除。",
		diagnosticLogExported: "诊断日志已保存到 {path}",
		diagnosticLogExportFailed: "无法导出诊断日志",
		backgroundSearchTimedOut: "背景搜索超时。请重试。"
	},
	spotify: {
		album: "专辑",
		albums: "专辑",
		albumsAndSingles: "专辑和单曲",
		apiPaused: "API 已暂停 · {time}",
		apiPausedTitle: "API 已暂停",
		apiPausedWait: "请再稍等片刻",
		apiPausedDetail: "Spotify API 暂时处于暂停状态。请在 {time} 后重试。本地播放控制仍可使用。",
		appDescriptionCopied: "已复制应用说明",
		appDescriptionLabel: "App description* (required)",
		appDescriptionValue: "用于 Windows 版 Decky Loader 的 Now Playing 插件的个人 Spotify Web API 连接。",
		appNameCopied: "已复制应用名称",
		appNameLabel: "App name* (required)",
		appNameValue: "Playhub Now Playing",
		artist: "艺人",
		artists: "艺人",
		back: "返回",
		audioQuality: "音质",
		cacheExplanation: "Spotify 资料库数据会缓存在本地。只有需要再次请求 Spotify 并更新缓存内容时才使用“刷新”。",
		clearMusicCache: "清除 Spotify 音乐缓存",
		clearingMusicCache: "正在清除 Spotify 音乐缓存…",
		musicCacheDescription: "Spotify 音频会在本地缓存，最多占用 1 GB。达到上限后会自动删除最旧的文件。",
		changeInSettings: "在设置中更改",
		clientId: "Spotify Client ID",
		clientIdSaved: "Client ID 已保存",
		compactSavedTracks: "精简显示已保存曲目",
		compactSavedTracksCard: "为减少 Spotify API 的使用量，已保存曲目默认只显示“播放”和“随机播放”操作，而不会加载完整列表。",
		compactSavedTracksDescription: "默认启用。已保存曲目无需加载完整列表即可显示“播放”和“随机播放”，从而减少对 Spotify API 的请求。",
		completeSignIn: "请在浏览器中完成登录，然后返回 Steam。",
		connect: "连接 Spotify",
		connected: "已连接",
		connectedAs: "已作为 {name} 连接",
		hideDetails: "隐藏详情",
		showDetails: "显示详情",
		copyAppDescription: "复制应用说明",
		copyAppName: "复制应用名称",
		copyRedirectUri: "复制重定向 URI",
		developerTerms: "接受 Developer Terms of Service 和 Design Guidelines，然后点击 Save。",
		disconnect: "断开 Spotify",
		enableSpotify: "启用 Spotify",
		followedArtists: "艺人",
		fullscreen: "全屏",
		genericError: "出现了问题",
		home: "主页",
		library: "资料库",
		limitedPlaylist: "Spotify 只会提供你拥有或参与协作的播放列表的曲目清单。你仍然可以播放此播放列表。",
		loadingSpotify: "正在加载 Spotify…",
		noAlbums: "没有可用专辑。",
		noPlayback: "播放点什么",
		noResults: "未找到结果。",
		noTracks: "没有可用曲目。",
		nothingHere: "这里还没有内容。",
		nowPlaying: "正在播放",
		openDashboard: "Spotify Developer Dashboard",
		personalMode: "个人 Web API 模式",
		play: "播放",
		playlist: "播放列表",
		playlists: "播放列表",
		popularTracks: "热门曲目",
		premiumNote: "在 Development Mode 中控制播放需要 Spotify Premium。你的 Client ID 和授权令牌会保留在这台电脑上。",
		queue: "播放队列",
		queueEmpty: "队列中没有接下来要播放的曲目。",
		redirectCopied: "已复制重定向 URL",
		redirectUri: "重定向 URL",
		refresh: "刷新",
		repeat: "重复",
		requestFailed: "Spotify 请求失败",
		saveClientId: "保存 Client ID",
		savedAlbums: "专辑",
		savedTracks: "已保存曲目",
		search: "搜索",
		searchSpotify: "搜索 Spotify",
		seeAll: "查看全部",
		selectSpotifyHint: "在“来源”中选择 Spotify，即可在 Now Playing 中显示 Spotify 浏览器。",
		settings: "设置",
		settingsDescription: "浏览你的 Spotify 资料库、搜索音乐目录，并在 Spotify 桌面应用中开始播放。此可选模式使用你自己的 Spotify 开发者 Client ID。",
		setupGuide: "设置指南",
		setupSteps: [
			"打开 Spotify Developer 网站，点击右上角的“Log in”，然后登录你的 Spotify 帐户。",
			"登录后，点击右上角的个人资料，选择“Dashboard”，再点击“Create app”。",
			"在“App name* (required)”中输入下方显示的应用名称。",
			"在“App description* (required)”中输入下方显示的说明。",
			"将“Website”留空。",
			"在“Redirect URIs* (required)”中严格按下方显示的内容添加 URL。",
			"在“Which API/SDKs are you planning to use?”下选择“Web API”和“Web Playback SDK”。不要选择 Ads API、iOS 或 Android。",
			"接受 Developer Terms of Service 和 Design Guidelines，然后点击 Save。",
			"打开新建的应用，复制 Client ID，将其粘贴到下方并连接 Spotify。无需 Client Secret。"
		],
		showLess: "收起",
		shuffle: "随机播放",
		spotifyBigPicture: "Big Picture",
		tracks: "曲目",
		unableStartAuthorization: "无法开始 Spotify 授权",
		unableStartPlayback: "无法开始播放",
		untitled: "无标题",
		volume: "音量",
		webApiOnly: "选择 Web API 和 Web Playback SDK",
		websiteOptional: "Website — 可选",
		welcomeBack: "欢迎回来，{name}",
		yourMusicInsideSteam: "在 Steam 中畅听你的音乐",
		yourPlaylists: "你的播放列表",
		artistCacheTitle: "艺人背景缓存",
		artistCacheDescription: "仅为你在 Spotify 上关注的艺人下载高分辨率背景。",
		createArtistCache: "创建艺人背景缓存",
		artistCacheBuilding: "正在创建艺人背景缓存…",
		artistCacheProgress: "正在下载背景：{name}",
		artistCacheCreated: "Spotify 艺人背景缓存已创建",
		artistCacheNoFavorites: "未找到已关注的艺人。",
		clearArtistCache: "清除艺人背景缓存",
		artistCacheClearing: "正在清除艺人背景缓存…",
		artistCacheCleared: "已清除 Spotify 艺人背景缓存",
		cacheSize: "已下载资源",
		newForYou: "为你推荐",
		manualBackgrounds: "用户选择的背景",
		manualBackgroundsDescription: "清除图片缓存时会保留这些艺人背景。",
		removeManualBackgrounds: "移除所有已选择的艺人背景",
		manualBackgroundsRemoving: "正在移除已选择的艺人背景…",
		manualBackgroundsRemoved: "已移除所选艺人背景"
	},
	localMusic: {
		albums: "专辑",
		albumsCount: "专辑",
		artist: "艺人",
		artists: "艺人",
		artistsCount: "艺人",
		back: "返回",
		bigPicture: "Big Picture",
		cacheBuilding: "正在创建图片缓存…",
		cacheCleared: "图片缓存已清空",
		cacheCreated: "图片缓存已创建",
		chooseFolder: "选择音乐文件夹",
		chooseSomething: "播放点什么",
		clearCache: "清空图片缓存",
		createCache: "创建图片缓存",
		formats: "MP3、AAC、M4A、FLAC、OGG、Opus 和 WAV 通过 Steam Chromium 播放。只要能够读取元数据，WMA、AIFF、APE、WavPack 和 MKA 仍会被编入索引。",
		fullscreen: "全屏",
		home: "主页",
		library: "资料库",
		noFolders: "尚未添加音乐文件夹。",
		noResults: "未找到结果。",
		nothingHere: "本地资料库为空。请在设置中选择文件夹并进行扫描。",
		nowPlaying: "正在播放",
		openFolderError: "无法打开 Decky 文件夹选择器",
		play: "播放",
		playerError: "本地音乐播放器出错",
		queue: "播放队列",
		queueEmpty: "队列中没有接下来要播放的曲目。",
		recentAlbums: "最近添加的专辑",
		remove: "移除",
		repeat: "重复",
		scan: "扫描资料库",
		scanComplete: "本地音乐资料库已更新",
		scanning: "正在扫描资料库…",
		search: "搜索",
		searchMusic: "搜索你的音乐",
		settings: "设置",
		settingsDescription: "选择一个或多个文件夹。Now Playing 会扫描所有子文件夹，读取内嵌标签和封面，并建立便于使用手柄浏览的本地音乐资料库。",
		shuffle: "随机播放",
		tracks: "曲目",
		tracksCount: "曲目",
		volume: "音量",
		yourMusic: "你的音乐",
		cacheProgressScanning: "正在扫描音乐库…",
		cacheProgressProfile: "正在下载艺人图片：{name}",
		cacheProgressBackground: "正在下载艺人背景：{name}",
		cacheSize: "已下载资源",
		cacheProgressRemoving: "正在删除缓存资源：{name}",
		cacheClearing: "正在清除图片缓存…",
		fanartProvider: "fanart.tv",
		fanartProviderDescription: "可选：添加个人 fanart.tv API 密钥，以便在搜索结果和创建缓存时使用其高分辨率艺人背景。",
		fanartApiKey: "fanart.tv API 密钥",
		fanartApiPage: "获取 API",
		saveFanartApiKey: "保存 fanart.tv API 密钥",
		saved: "已保存",
		manualBackgrounds: "用户选择的背景",
		manualBackgroundsDescription: "清除图片缓存时会保留这些艺人背景。",
		removeManualBackgrounds: "移除所有已选择的艺人背景",
		manualBackgroundsRemoving: "正在移除已选择的艺人背景…",
		manualBackgroundsRemoved: "已移除所选艺人背景",
		pickerTitle: "选择本地音乐",
		addCurrentFolder: "添加此文件夹",
		openPath: "前往",
		noAudioFiles: "此处没有文件夹或支持的音频文件。"
	},
	runtime: {
		localMediaError: "无法播放本地音频文件",
		noPlayableLocalTracks: "没有可播放的本地曲目",
		localPlaybackStartFailed: "无法开始本地播放",
		localAudioRecoveryFailed: "无法恢复本地音频",
		openCurrentSpotifyAlbumFailed: "无法打开当前 Spotify 专辑",
		openCurrentLocalAlbumFailed: "无法打开当前本地专辑",
		unsupportedLocalFormat: "Steam Chromium 不支持此音频格式",
		localPlayerUnavailable: "本地音频播放器不可用",
		currentLocalAlbumUnavailable: "当前本地专辑不可用",
		currentSpotifyAlbumUnavailable: "当前 Spotify 专辑不可用",
		windowsOnly: "此插件仅支持 Windows",
		helperStartFailed: "无法正确启动插件辅助组件",
		folderNotFound: "找不到文件夹",
		localTrackNotFound: "找不到本地曲目",
		localFileUnavailable: "本地音乐文件不可用",
		localPlayerNotRunning: "本地音乐播放器未运行",
		localPlayerNoResponse: "本地音乐播放器没有响应",
		spotifyInvalidTokenResponse: "Spotify 返回了无效的令牌响应",
		spotifyAuthorizationExpired: "Spotify 授权会话已过期",
		spotifyFinishingConnection: "正在完成 Spotify 连接…",
		spotifyEnterClientId: "请先输入 Spotify Client ID",
		spotifyWaitingAuthorization: "正在等待 Spotify 授权…",
		spotifyNotConnected: "Spotify 尚未连接",
		spotifyRefreshTokenFailed: "Spotify 未返回新的访问令牌",
		spotifyInvalidApiPath: "Spotify API 路径无效",
		spotifyInvalidResponse: "Spotify 返回了无效响应",
		spotifyActionDenied: "Spotify 拒绝了此操作。可能需要 Premium 或额外权限",
		spotifyNoActiveDevice: "Spotify 找不到正在播放的设备",
		spotifyDisabled: "Spotify 已禁用",
		spotifyConnectFirst: "请先在插件设置中连接 Spotify",
		spotifyUnknownLibrarySection: "未知的 Spotify 音乐库分类",
		spotifyInvalidItem: "Spotify 项目无效",
		spotifyNoCurrentAlbum: "当前曲目没有可用的 Spotify 专辑",
		spotifyAlbumLookupFailed: "Spotify 找不到当前曲目的专辑",
		spotifyOpenAppStartTrack: "请在此电脑上打开 Spotify，播放任意歌曲后再试",
		spotifyUnknownPlayerCommand: "未知的 Spotify 播放器命令",
		spotifyNoPlayableItems: "没有可播放的 Spotify 项目",
		spotifyMissingUri: "缺少 Spotify URI",
		spotifyInvalidUri: "Spotify URI 无效",
		backgroundChoiceExpired: "此背景选项已过期，请重新搜索。",
		invalidBackgroundChoice: "此背景选项已失效。",
		backgroundDownloadFailed: "无法下载所选图片。",
		unsupportedBackgroundImage: "不支持所选图片的格式。",
		invalidArtist: "所选艺人无效。",
		artistNameRequired: "需要提供艺人名称。",
		spotifyArtistCacheBusy: "Spotify 艺人缓存已在创建中。",
		spotifyArtistCacheInUse: "Spotify 艺人缓存正忙。",
		restartServicesTimedOut: "插件服务重启超时",
		restartServicesAlreadyRunning: "插件服务已在重启中",
		mediaBridgeRestartFailed: "MediaBridge 未能正确重启",
		pluginServiceRestartFailed: "插件服务重启失败"
	}
};
var catalogs = {
	en: en,
	it: it,
	es: es,
	fr: fr,
	de: de,
	"pt-br": {
	core: {
		back: "Voltar",
		coverFailed: "não foi possível carregar a capa",
		coverSourceOnline: "Online | Alta resolução",
		coverSourceWindows: "Windows | Mais rápido",
		effectCoverBlur: "Capa desfocada",
		effectEnergySaver: "Economia de energia",
		effectGlow: "Brilho",
		effectOcean: "Oceano",
		localMusicLabel: "Sua Música",
		notPlaying: "Reproduza algo",
		openApp: "Abrir {app}",
		closeApp: "Fechar {app}",
		refreshFailed: "Não foi possível atualizar o Now Playing",
		restartServices: "Reiniciar serviços do plugin",
		restartServicesDescription: "Reinicia o MediaBridge e os auxiliares incluídos do Now Playing sem reiniciar o Steam.",
		restartServicesFailed: "Não foi possível reiniciar os serviços do plugin",
		restartServicesSuccess: "Serviços do plugin reiniciados",
		settingsApps: "Fonte",
		settingsCoverSource: "Exibição da capa do álbum",
		settingsFullscreenEffect: "Efeitos visuais em tela cheia",
		settingsLabel: "Configurações",
		settingsRecovery: "Recuperação",
		topbarLeft: "Mover o relógio e a faixa para a esquerda",
		topbarSection: "Barra superior",
		topbarTrack: "Mostrar a faixa na barra superior",
		unknownAlbum: "Álbum desconhecido",
		unknownArtist: "Artista desconhecido",
		volume: "Volume",
		openCurrentAlbum: "Abrir álbum atual",
		autoLaunchSources: "Abrir automaticamente os apps das fontes",
		autoLaunchSourcesDescription: "Abre o app do serviço selecionado somente se ele ainda não estiver em execução.",
		closeSourcesOnSwitch: "Fechar o app da fonte anterior",
		closeSourcesOnSwitchDescription: "Ao trocar de fonte, pausa a reprodução e fecha o app do serviço anterior.",
		artistBackgroundSettings: "Configurações do plano de fundo",
		chooseArtistBackground: "Escolher plano de fundo do artista",
		artistBackgroundDescription: "Escolha uma imagem online. O plano de fundo selecionado será baixado, salvo localmente e usado para este artista.",
		searchingBackgrounds: "Procurando planos de fundo disponíveis…",
		noBackgroundsFound: "Nenhum plano de fundo adequado foi encontrado.",
		resolution: "Resolução",
		downloadAndApply: "Baixar e aplicar",
		downloadingBackground: "Baixando plano de fundo…",
		backgroundApplied: "Plano de fundo baixado e aplicado",
		backgroundApplyFailed: "Não foi possível aplicar o plano de fundo",
		refreshBackgrounds: "Procurar novamente",
		currentBackground: "Plano de fundo atual",
		restartServicesInProgress: "Reiniciando os serviços do plugin…",
		backgroundSource: "Fonte dos planos de fundo",
		allBackgroundSources: "Todas as fontes",
		spotifyBackgroundSource: "Spotify",
		fanartBackgroundSource: "fanart.tv",
		exportDiagnosticLog: "Exportar log de diagnóstico",
		diagnosticLogDescription: "Cria em Downloads um arquivo de diagnóstico seguro com o estado do player, MediaBridge e erros de imagens. Chaves de API e tokens são removidos.",
		diagnosticLogExported: "Log de diagnóstico salvo em {path}",
		diagnosticLogExportFailed: "Não foi possível exportar o log de diagnóstico",
		backgroundSearchTimedOut: "A busca de planos de fundo demorou demais. Tente novamente."
	},
	spotify: {
		album: "Álbum",
		albums: "Álbuns",
		albumsAndSingles: "Álbuns e singles",
		apiPaused: "API pausada · {time}",
		apiPausedTitle: "API pausada",
		apiPausedWait: "Aguarde mais um pouco",
		apiPausedDetail: "A API do Spotify está temporariamente pausada. Tente novamente em {time}. Os controles locais de reprodução continuam disponíveis.",
		appDescriptionCopied: "Descrição do aplicativo copiada",
		appDescriptionLabel: "App description* (required)",
		appDescriptionValue: "Conexão pessoal com a API Web do Spotify para o plugin Now Playing do Decky Loader no Windows.",
		appNameCopied: "Nome do aplicativo copiado",
		appNameLabel: "App name* (required)",
		appNameValue: "Playhub Now Playing",
		artist: "Artista",
		artists: "Artistas",
		back: "Voltar",
		audioQuality: "Qualidade do áudio",
		cacheExplanation: "Os dados da biblioteca do Spotify ficam armazenados em cache local. Use Atualizar apenas quando quiser consultar o Spotify novamente e atualizar o conteúdo em cache.",
		clearMusicCache: "Limpar cache de músicas do Spotify",
		clearingMusicCache: "Limpando cache de músicas do Spotify…",
		musicCacheDescription: "O áudio do Spotify é armazenado localmente em cache até 1 GB. Os arquivos mais antigos são removidos automaticamente quando o limite é atingido.",
		changeInSettings: "Alterar nas Configurações",
		clientId: "Client ID do Spotify",
		clientIdSaved: "Client ID salvo",
		compactSavedTracks: "Visualização compacta de faixas salvas",
		compactSavedTracksCard: "Para reduzir o uso da API do Spotify, as faixas salvas mostram por padrão apenas as ações Reproduzir e Aleatório em vez de carregar a lista completa.",
		compactSavedTracksDescription: "Ativada por padrão. As faixas salvas mostram Reproduzir e Aleatório sem carregar a lista completa, reduzindo as solicitações à API do Spotify.",
		completeSignIn: "Conclua o login no navegador e volte ao Steam.",
		connect: "Conectar Spotify",
		connected: "Conectado",
		connectedAs: "Conectado como {name}",
		hideDetails: "Ocultar detalhes",
		showDetails: "Mostrar detalhes",
		copyAppDescription: "Copiar descrição do aplicativo",
		copyAppName: "Copiar nome do aplicativo",
		copyRedirectUri: "Copiar URI de redirecionamento",
		developerTerms: "Aceite os Termos de Serviço para Desenvolvedores e as Diretrizes de Design e clique em Save.",
		disconnect: "Desconectar Spotify",
		enableSpotify: "Ativar Spotify",
		followedArtists: "Artistas",
		fullscreen: "Tela cheia",
		genericError: "Algo deu errado",
		home: "Início",
		library: "Biblioteca",
		limitedPlaylist: "O Spotify só mostra a lista de faixas de playlists que são suas ou das quais você é colaborador. Ainda assim, você pode reproduzir esta playlist.",
		loadingSpotify: "Carregando Spotify…",
		noAlbums: "Nenhum álbum disponível.",
		noPlayback: "Reproduza algo",
		noResults: "Nenhum resultado encontrado.",
		noTracks: "Nenhuma faixa disponível.",
		nothingHere: "Ainda não há nada aqui.",
		nowPlaying: "Em reprodução",
		openDashboard: "Painel do Spotify Developer",
		personalMode: "Modo pessoal da Web API",
		play: "Reproduzir",
		playlist: "Playlist",
		playlists: "Playlists",
		popularTracks: "Faixas populares",
		premiumNote: "O Spotify Premium é necessário para controlar a reprodução no Development Mode. Seu Client ID e os tokens de autorização permanecem neste PC.",
		queue: "Fila",
		queueEmpty: "Não há próximas faixas na fila.",
		redirectCopied: "URL de redirecionamento copiada",
		redirectUri: "URL de redirecionamento",
		refresh: "Atualizar",
		repeat: "Repetir",
		requestFailed: "Falha na solicitação ao Spotify",
		saveClientId: "Salvar Client ID",
		savedAlbums: "Álbuns",
		savedTracks: "Faixas salvas",
		search: "Pesquisar",
		searchSpotify: "Pesquisar no Spotify",
		seeAll: "Ver tudo",
		selectSpotifyHint: "Selecione Spotify na seção Fonte para mostrar o navegador do Spotify no Now Playing.",
		settings: "Configurações",
		settingsDescription: "Navegue pela sua biblioteca do Spotify, pesquise no catálogo e inicie a reprodução no aplicativo do Spotify para desktop. Este modo opcional usa seu próprio Client ID de desenvolvedor do Spotify.",
		setupGuide: "Guia de configuração",
		setupSteps: [
			"Abra o site Spotify Developer, clique em “Log in” no canto superior direito e entre na sua conta do Spotify.",
			"Depois de entrar, clique no seu perfil no canto superior direito, escolha “Dashboard” e clique em “Create app”.",
			"Em “App name* (required)”, digite o nome do aplicativo mostrado abaixo.",
			"Em “App description* (required)”, digite a descrição mostrada abaixo.",
			"Deixe “Website” em branco.",
			"Em “Redirect URIs* (required)”, adicione exatamente a URL mostrada abaixo.",
			"Em “Which API/SDKs are you planning to use?”, selecione “Web API” e “Web Playback SDK”. Não selecione Ads API, iOS ou Android.",
			"Aceite os Termos de Serviço para Desenvolvedores e as Diretrizes de Design e clique em Save.",
			"Abra o novo aplicativo, copie o Client ID, cole-o abaixo e conecte o Spotify. Não é necessário um Client Secret."
		],
		showLess: "Mostrar menos",
		shuffle: "Aleatório",
		spotifyBigPicture: "Big Picture",
		tracks: "Faixas",
		unableStartAuthorization: "Não foi possível iniciar a autorização do Spotify",
		unableStartPlayback: "Não foi possível iniciar a reprodução",
		untitled: "Sem título",
		volume: "Volume",
		webApiOnly: "Selecione Web API e Web Playback SDK",
		websiteOptional: "Website — opcional",
		welcomeBack: "Boas-vindas de volta, {name}",
		yourMusicInsideSteam: "Sua música dentro do Steam",
		yourPlaylists: "Suas playlists",
		artistCacheTitle: "Cache de planos de fundo dos artistas",
		artistCacheDescription: "Baixa planos de fundo em alta resolução somente para os artistas que você segue no Spotify.",
		createArtistCache: "Criar cache de planos de fundo",
		artistCacheBuilding: "Criando cache de planos de fundo…",
		artistCacheProgress: "Baixando plano de fundo: {name}",
		artistCacheCreated: "Cache de planos de fundo do Spotify criada",
		artistCacheNoFavorites: "Nenhum artista seguido foi encontrado.",
		clearArtistCache: "Limpar cache de fundos de artistas",
		artistCacheClearing: "Limpando o cache de fundos de artistas…",
		artistCacheCleared: "Cache de fundos de artistas do Spotify limpo",
		cacheSize: "Recursos baixados",
		newForYou: "Recomendado para você",
		manualBackgrounds: "Fundos escolhidos pelo usuário",
		manualBackgroundsDescription: "Esses fundos de artistas são mantidos ao limpar o cache de imagens.",
		removeManualBackgrounds: "Remover todos os fundos de artistas escolhidos",
		manualBackgroundsRemoving: "Removendo os fundos de artistas escolhidos…",
		manualBackgroundsRemoved: "Fundos de artistas escolhidos removidos"
	},
	localMusic: {
		albums: "Álbuns",
		albumsCount: "Álbuns",
		artist: "Artista",
		artists: "Artistas",
		artistsCount: "Artistas",
		back: "Voltar",
		bigPicture: "Big Picture",
		cacheBuilding: "Criando cache de imagens…",
		cacheCleared: "Cache de imagens limpo",
		cacheCreated: "Cache de imagens criado",
		chooseFolder: "Escolher pasta de músicas",
		chooseSomething: "Reproduza algo",
		clearCache: "Limpar cache de imagens",
		createCache: "Criar cache de imagens",
		formats: "MP3, AAC, M4A, FLAC, OGG, Opus e WAV são reproduzidos pelo Chromium do Steam. WMA, AIFF, APE, WavPack e MKA continuam indexados quando seus metadados podem ser lidos.",
		fullscreen: "Tela cheia",
		home: "Início",
		library: "Biblioteca",
		noFolders: "Nenhuma pasta de músicas foi adicionada ainda.",
		noResults: "Nenhum resultado encontrado.",
		nothingHere: "Sua biblioteca local está vazia. Escolha uma pasta e faça a análise nas Configurações.",
		nowPlaying: "Em reprodução",
		openFolderError: "Não foi possível abrir o seletor de pastas do Decky",
		play: "Reproduzir",
		playerError: "Erro no player de música local",
		queue: "Fila",
		queueEmpty: "Não há próximas faixas na fila.",
		recentAlbums: "Álbuns adicionados recentemente",
		remove: "Remover",
		repeat: "Repetir",
		scan: "Analisar biblioteca",
		scanComplete: "Biblioteca de músicas local atualizada",
		scanning: "Analisando a biblioteca…",
		search: "Pesquisar",
		searchMusic: "Pesquisar em Sua Música",
		settings: "Configurações",
		settingsDescription: "Escolha uma ou mais pastas. O Now Playing analisa todas as subpastas, lê tags e capas incorporadas e cria uma biblioteca de músicas local fácil de usar com controle.",
		shuffle: "Aleatório",
		tracks: "Faixas",
		tracksCount: "Faixas",
		volume: "Volume",
		yourMusic: "Sua Música",
		cacheProgressScanning: "Escaneando a biblioteca de músicas…",
		cacheProgressProfile: "Baixando imagem do artista: {name}",
		cacheProgressBackground: "Baixando plano de fundo do artista: {name}",
		cacheSize: "Recursos baixados",
		cacheProgressRemoving: "Removendo recurso do cache: {name}",
		cacheClearing: "Limpando o cache de imagens…",
		fanartProvider: "fanart.tv",
		fanartProviderDescription: "Opcional: adicione uma chave de API pessoal do fanart.tv para incluir fundos de artistas em alta resolução nos resultados e na criação do cache.",
		fanartApiKey: "Chave de API do fanart.tv",
		fanartApiPage: "Obter a API",
		saveFanartApiKey: "Salvar chave de API do fanart.tv",
		saved: "Salvo",
		manualBackgrounds: "Fundos escolhidos pelo usuário",
		manualBackgroundsDescription: "Esses fundos de artistas são mantidos ao limpar o cache de imagens.",
		removeManualBackgrounds: "Remover todos os fundos de artistas escolhidos",
		manualBackgroundsRemoving: "Removendo os fundos de artistas escolhidos…",
		manualBackgroundsRemoved: "Fundos de artistas escolhidos removidos",
		pickerTitle: "Escolher música local",
		addCurrentFolder: "Adicionar esta pasta",
		openPath: "Ir",
		noAudioFiles: "Não há pastas nem arquivos de áudio compatíveis aqui."
	},
	runtime: {
		localMediaError: "Não foi possível reproduzir o arquivo de áudio local",
		noPlayableLocalTracks: "Nenhuma faixa local pode ser reproduzida",
		localPlaybackStartFailed: "Não foi possível iniciar a reprodução local",
		localAudioRecoveryFailed: "Não foi possível recuperar o áudio local",
		openCurrentSpotifyAlbumFailed: "Não foi possível abrir o álbum atual do Spotify",
		openCurrentLocalAlbumFailed: "Não foi possível abrir o álbum local atual",
		unsupportedLocalFormat: "Este formato de áudio não é compatível com o Chromium do Steam",
		localPlayerUnavailable: "O player de áudio local não está disponível",
		currentLocalAlbumUnavailable: "O álbum local atual não está disponível",
		currentSpotifyAlbumUnavailable: "O álbum atual do Spotify não está disponível",
		windowsOnly: "Este plugin funciona apenas no Windows",
		helperStartFailed: "Não foi possível iniciar corretamente o componente auxiliar do plugin",
		folderNotFound: "Pasta não encontrada",
		localTrackNotFound: "Faixa local não encontrada",
		localFileUnavailable: "O arquivo de música local não está disponível",
		localPlayerNotRunning: "O player de música local não está em execução",
		localPlayerNoResponse: "O player de música local não respondeu",
		spotifyInvalidTokenResponse: "O Spotify retornou uma resposta de token inválida",
		spotifyAuthorizationExpired: "A sessão de autorização do Spotify expirou",
		spotifyFinishingConnection: "Finalizando a conexão com o Spotify…",
		spotifyEnterClientId: "Digite primeiro o seu Client ID do Spotify",
		spotifyWaitingAuthorization: "Aguardando a autorização do Spotify…",
		spotifyNotConnected: "O Spotify não está conectado",
		spotifyRefreshTokenFailed: "O Spotify não retornou um novo token de acesso",
		spotifyInvalidApiPath: "Caminho da API do Spotify inválido",
		spotifyInvalidResponse: "O Spotify retornou uma resposta inválida",
		spotifyActionDenied: "O Spotify recusou esta ação. Pode ser necessário ter Premium ou uma permissão adicional",
		spotifyNoActiveDevice: "O Spotify não encontrou nenhum dispositivo de reprodução ativo",
		spotifyDisabled: "O Spotify está desativado",
		spotifyConnectFirst: "Conecte o Spotify primeiro nas configurações do plugin",
		spotifyUnknownLibrarySection: "Seção desconhecida da biblioteca do Spotify",
		spotifyInvalidItem: "Item do Spotify inválido",
		spotifyNoCurrentAlbum: "Nenhum álbum do Spotify está disponível para a faixa atual",
		spotifyAlbumLookupFailed: "O Spotify não encontrou o álbum da faixa atual",
		spotifyOpenAppStartTrack: "Abra o Spotify neste PC, reproduza uma música e tente novamente",
		spotifyUnknownPlayerCommand: "Comando desconhecido do player do Spotify",
		spotifyNoPlayableItems: "Não há itens reproduzíveis no Spotify",
		spotifyMissingUri: "URI do Spotify ausente",
		spotifyInvalidUri: "URI do Spotify inválido",
		backgroundChoiceExpired: "Esta seleção de plano de fundo expirou. Pesquise novamente.",
		invalidBackgroundChoice: "Esta seleção de plano de fundo não é mais válida.",
		backgroundDownloadFailed: "Não foi possível baixar a imagem selecionada.",
		unsupportedBackgroundImage: "O formato da imagem selecionada não é compatível.",
		invalidArtist: "O artista selecionado não é válido.",
		artistNameRequired: "É necessário informar o nome do artista.",
		spotifyArtistCacheBusy: "O cache de artistas do Spotify já está sendo criado.",
		spotifyArtistCacheInUse: "O cache de artistas do Spotify está ocupado.",
		restartServicesTimedOut: "O reinício dos serviços do plugin excedeu o tempo limite",
		restartServicesAlreadyRunning: "Já há um reinício dos serviços do plugin em andamento",
		mediaBridgeRestartFailed: "O MediaBridge não reiniciou corretamente",
		pluginServiceRestartFailed: "Falha ao reiniciar os serviços do plugin"
	}
},
	ru: ru,
	ja: ja,
	ko: ko,
	zh: zh
};

const DEFAULT_LOCALE = "en";
const localeAliases = {
    english: "en",
    "en-us": "en",
    "en-gb": "en",
    italian: "it",
    spanish: "es",
    latam: "es",
    "spanish-latam": "es",
    "es-es": "es",
    "es-mx": "es",
    "es-419": "es",
    french: "fr",
    "fr-fr": "fr",
    "fr-ca": "fr",
    german: "de",
    "de-de": "de",
    brazilian: "pt-br",
    pt: "pt-br",
    "pt-br": "pt-br",
    // European Portuguese is not bundled yet. A complete English fallback is
    // preferable to showing Brazilian wording as though it were locale-native.
    "pt-pt": "en",
    russian: "ru",
    "ru-ru": "ru",
    japanese: "ja",
    "ja-jp": "ja",
    koreana: "ko",
    korean: "ko",
    "ko-kr": "ko",
    schinese: "zh",
    "simplified-chinese": "zh",
    "zh-cn": "zh",
    "zh-sg": "zh",
    "zh-hans": "zh",
    // Traditional Chinese is a different written locale; do not silently
    // substitute Simplified Chinese. Keep the interface internally consistent.
    tchinese: "en",
    "traditional-chinese": "en",
    "zh-tw": "en",
    "zh-hk": "en",
    "zh-mo": "en",
    "zh-hant": "en",
};
function browserLanguageCandidates() {
    if (typeof navigator === "undefined")
        return [];
    const values = [...Array.from(navigator.languages ?? []), navigator.language];
    return values
        .map((value) => String(value ?? "").trim().toLowerCase().split("_").join("-"))
        .filter(Boolean);
}
function resolveLocale(candidates = browserLanguageCandidates()) {
    for (const candidate of candidates) {
        const direct = localeAliases[candidate] ?? candidate;
        if (direct in catalogs)
            return direct;
        const base = candidate.split("-")[0];
        const aliasedBase = localeAliases[base] ?? base;
        if (aliasedBase in catalogs)
            return aliasedBase;
    }
    return DEFAULT_LOCALE;
}
function getTranslations(section) {
    const locale = resolveLocale();
    return {
        ...catalogs.en[section],
        ...catalogs[locale][section],
    };
}
function formatTranslation(template, values) {
    return Object.entries(values).reduce((text, [key, value]) => text.split(`{${key}}`).join(String(value)), template);
}
const runtimeMessageKeys = {
    "Local music player is not running": "localPlayerNotRunning",
    "Local music player did not respond": "localPlayerNoResponse",
    "Local music file is unavailable": "localFileUnavailable",
    "Questo plugin funziona solo su Windows": "windowsOnly",
    "Windows only": "windowsOnly",
    "Helper C# non avviato correttamente": "helperStartFailed",
    "Folder not found": "folderNotFound",
    "Local music track not found": "localTrackNotFound",
    "Spotify returned an invalid token response": "spotifyInvalidTokenResponse",
    "Spotify authorization session expired": "spotifyAuthorizationExpired",
    "Finishing Spotify connection": "spotifyFinishingConnection",
    "Enter your Spotify Client ID first": "spotifyEnterClientId",
    "Waiting for Spotify authorization": "spotifyWaitingAuthorization",
    "Spotify is not connected": "spotifyNotConnected",
    "Spotify did not return a new access token": "spotifyRefreshTokenFailed",
    "Invalid Spotify API path": "spotifyInvalidApiPath",
    "Spotify returned an invalid response": "spotifyInvalidResponse",
    "Spotify denied this action. Premium or an additional permission may be required": "spotifyActionDenied",
    "Spotify could not find an active playback device": "spotifyNoActiveDevice",
    "Spotify is disabled": "spotifyDisabled",
    "Connect Spotify in the plugin settings first": "spotifyConnectFirst",
    "Unknown Spotify library section": "spotifyUnknownLibrarySection",
    "Invalid Spotify item": "spotifyInvalidItem",
    "No Spotify album is available for the current track": "spotifyNoCurrentAlbum",
    "Spotify could not find the album for the current track": "spotifyAlbumLookupFailed",
    "Open Spotify on this PC, start any song once, then try again": "spotifyOpenAppStartTrack",
    "Unknown Spotify player command": "spotifyUnknownPlayerCommand",
    "No playable Spotify items": "spotifyNoPlayableItems",
    "Missing Spotify URI": "spotifyMissingUri",
    "Invalid Spotify URI": "spotifyInvalidUri",
    "No playable local tracks": "noPlayableLocalTracks",
    "Background choice expired. Search again": "backgroundChoiceExpired",
    "Invalid background choice": "invalidBackgroundChoice",
    "The selected image could not be downloaded": "backgroundDownloadFailed",
    "The selected image is not supported": "unsupportedBackgroundImage",
    "Invalid artist": "invalidArtist",
    "Artist name is required": "artistNameRequired",
    "Spotify artist cache is already being created": "spotifyArtistCacheBusy",
    "Spotify artist cache is busy": "spotifyArtistCacheInUse",
    "Plugin service restart timed out": "restartServicesTimedOut",
    "Plugin service restart is already running": "restartServicesAlreadyRunning",
    "MediaBridge did not restart correctly": "mediaBridgeRestartFailed",
    "Plugin service restart failed": "pluginServiceRestartFailed",
};
function localizeRuntimeMessage(message, fallback = "") {
    const raw = String(message ?? "").trim();
    if (!raw)
        return fallback;
    const normalized = raw.startsWith("Error: ") ? raw.slice(7).trim() : raw;
    const key = runtimeMessageKeys[normalized];
    return key ? String(getTranslations("runtime")[key]) : raw;
}
Object.freeze(Object.keys(catalogs));

const emptyState = {
    track: null,
    queue: [],
    index: -1,
    status: "Stopped",
    position: 0,
    length: 0,
    volume: 100,
    shuffleActive: false,
    repeatMode: "None",
    canPrevious: false,
    canNext: false,
    error: "",
};
const LEGACY_LOCAL_SESSION_STORAGE_KEY = "nowPlaying:lastLocalTrack:v1";
function normalizeTrack$2(entry) {
    return entry?.track ?? entry?.item ?? entry;
}
class LocalAudioEngine {
    constructor() {
        this.audio = null;
        this.state = { ...emptyState };
        this.listeners = new Set();
        this.streamBase = "";
        this.streamBasePromise = null;
        this.loadingToken = 0;
        this.syncTimer = 0;
        this.lastBackendSyncAt = 0;
        this.originalQueue = [];
        this.recoveryAttempts = 0;
        this.recoveryInFlight = false;
        this.lastProgressAt = 0;
        this.stallRecoveryTimer = 0;
        this.subscribe = (listener) => {
            this.listeners.add(listener);
            return () => {
                this.listeners.delete(listener);
            };
        };
        this.getSnapshot = () => this.state;
        if (typeof window === "undefined")
            return;
        // Local playback is intentionally session-only. Older builds persisted the
        // last track/queue/position, which could overwrite the live player state
        // whenever QAM, Big Picture or Settings remounted. Remove that legacy entry
        // once and never restore playback state from disk again.
        try {
            window.localStorage?.removeItem(LEGACY_LOCAL_SESSION_STORAGE_KEY);
        }
        catch {
            // Storage can be unavailable in restricted Steam CEF contexts.
        }
    }
    clearStallRecoveryTimer() {
        if (this.stallRecoveryTimer)
            window.clearTimeout(this.stallRecoveryTimer);
        this.stallRecoveryTimer = 0;
    }
    scheduleStallRecovery(reason) {
        if (this.state.status !== "Playing" || this.recoveryInFlight || this.recoveryAttempts >= 2)
            return;
        this.clearStallRecoveryTimer();
        const progressMarker = this.lastProgressAt;
        this.stallRecoveryTimer = window.setTimeout(() => {
            this.stallRecoveryTimer = 0;
            if (this.state.status !== "Playing" || this.recoveryInFlight || this.recoveryAttempts >= 2)
                return;
            if (this.lastProgressAt !== progressMarker || Date.now() - this.lastProgressAt < 2400)
                return;
            void this.reloadAt(this.state.position, reason);
        }, 2800);
    }
    ensureAudio() {
        if (this.audio || typeof Audio === "undefined")
            return this.audio;
        const audio = new Audio();
        audio.preload = "auto";
        audio.volume = Math.max(0, Math.min(1, this.state.volume / 100));
        audio.addEventListener("timeupdate", () => {
            this.lastProgressAt = Date.now();
            this.clearStallRecoveryTimer();
            this.patch({ position: Math.max(0, Math.floor((audio.currentTime || 0) * 1000)) });
            this.scheduleStallRecovery("progress-timeout");
        });
        audio.addEventListener("durationchange", () => {
            const duration = Number.isFinite(audio.duration) ? Math.max(0, Math.floor(audio.duration * 1000)) : 0;
            this.patch({ length: duration || Number(this.state.track?.duration_ms || 0) });
        });
        audio.addEventListener("loadedmetadata", () => {
            const duration = Number.isFinite(audio.duration) ? Math.max(0, Math.floor(audio.duration * 1000)) : 0;
            this.patch({ length: duration || Number(this.state.track?.duration_ms || 0), error: "" });
        });
        audio.addEventListener("play", () => {
            this.lastProgressAt = Date.now();
            this.patch({ status: "Playing", error: "" });
            this.scheduleStallRecovery("progress-timeout");
        });
        audio.addEventListener("pause", () => {
            this.clearStallRecoveryTimer();
            if (!audio.ended && !this.recoveryInFlight)
                this.patch({ status: this.state.track ? "Paused" : "Stopped" });
        });
        audio.addEventListener("ended", () => void this.handleEnded());
        audio.addEventListener("stalled", () => this.scheduleStallRecovery("stalled"));
        audio.addEventListener("waiting", () => this.scheduleStallRecovery("waiting"));
        audio.addEventListener("error", () => {
            if (this.recoveryInFlight)
                return;
            if (this.state.track && this.state.status === "Playing" && this.recoveryAttempts < 2) {
                void this.reloadAt(this.state.position, "media-error");
                return;
            }
            const code = audio.error?.code ?? 0;
            const t = getTranslations("runtime");
            const message = code === 4 ? t.unsupportedLocalFormat : t.localMediaError;
            this.patch({ status: "Stopped", error: message });
        });
        this.audio = audio;
        return audio;
    }
    restoreLastTrack() {
        // Kept as a compatibility no-op for callers compiled against older builds.
        // Playback state now comes only from this live singleton.
        return Promise.resolve(this.state);
    }
    initialize() {
        if (this.streamBase)
            return Promise.resolve(this.streamBase);
        if (!this.streamBasePromise) {
            this.streamBasePromise = getLocalMusicStreamBase()
                .then((value) => {
                this.streamBase = String(value || "").replace(/\/$/, "");
                return this.streamBase;
            })
                .finally(() => { this.streamBasePromise = null; });
        }
        return this.streamBasePromise;
    }
    streamUrl(track) {
        const id = encodeURIComponent(String(track?.id ?? ""));
        return `${this.streamBase}/track/${id}`;
    }
    emit(syncBackend = true) {
        for (const listener of this.listeners)
            listener();
        if (this.syncTimer)
            window.clearTimeout(this.syncTimer);
        this.syncTimer = 0;
        if (!syncBackend)
            return;
        const elapsed = Date.now() - this.lastBackendSyncAt;
        const delay = Math.max(180, 750 - elapsed);
        this.syncTimer = window.setTimeout(() => {
            this.syncTimer = 0;
            this.lastBackendSyncAt = Date.now();
            const state = this.state;
            void updateLocalMusicFrontendState({
                track: state.track,
                index: state.index,
                queueLength: state.queue.length,
                status: state.status,
                position: state.position,
                length: state.length,
                volume: state.volume,
                shuffleActive: state.shuffleActive,
                repeatMode: state.repeatMode,
                canPrevious: state.canPrevious,
                canNext: state.canNext,
            }).catch(() => { });
        }, delay);
    }
    patch(update) {
        this.state = { ...this.state, ...update };
        this.emit();
    }
    async playItems(entries, startIndex = 0) {
        const sourceQueue = entries.map(normalizeTrack$2).filter((track) => track?.id);
        if (!sourceQueue.length)
            throw new Error(getTranslations("runtime").noPlayableLocalTracks);
        const requestedIndex = Math.max(0, Math.min(Math.floor(startIndex || 0), sourceQueue.length - 1));
        this.originalQueue = [...sourceQueue];
        const queue = this.state.shuffleActive
            ? [sourceQueue[requestedIndex], ...this.shuffleEntries(sourceQueue.filter((_, index) => index !== requestedIndex))]
            : sourceQueue;
        const index = this.state.shuffleActive ? 0 : requestedIndex;
        this.state = {
            ...this.state,
            queue,
            index,
            track: queue[index],
            position: 0,
            length: Number(queue[index]?.duration_ms || 0),
            canPrevious: true,
            canNext: true,
            error: "",
        };
        this.emit();
        await this.loadCurrent(true);
        return this.state;
    }
    async loadCurrent(autoPlay) {
        const audio = this.ensureAudio();
        const track = this.state.queue[this.state.index];
        if (!audio || !track)
            throw new Error(getTranslations("runtime").localPlayerUnavailable);
        await this.initialize();
        const token = ++this.loadingToken;
        this.recoveryAttempts = 0;
        this.recoveryInFlight = false;
        this.clearStallRecoveryTimer();
        this.lastProgressAt = Date.now();
        audio.pause();
        audio.src = `${this.streamUrl(track)}?v=${encodeURIComponent(String(track?.modifiedAt ?? track?.id ?? Date.now()))}`;
        audio.load();
        this.patch({ track, position: 0, length: Number(track?.duration_ms || 0), status: autoPlay ? "Paused" : "Stopped", error: "" });
        if (autoPlay) {
            try {
                await audio.play();
            }
            catch (error) {
                if (token !== this.loadingToken)
                    return;
                const message = String(error?.message ?? error ?? getTranslations("runtime").localPlaybackStartFailed);
                this.patch({ status: "Stopped", error: message });
                throw error;
            }
        }
    }
    async playPause() {
        const audio = this.ensureAudio();
        if (!audio)
            return this.state;
        if ((!this.state.track && this.state.queue.length) || (this.state.track && !audio.src))
            await this.loadCurrent(true);
        else if (audio.paused)
            await audio.play();
        else
            audio.pause();
        return this.state;
    }
    async next() {
        if (!this.state.queue.length)
            return this.state;
        let index = this.state.index;
        if (index < this.state.queue.length - 1)
            index += 1;
        else if (this.state.repeatMode === "All") {
            if (this.state.shuffleActive && this.originalQueue.length > 1) {
                const currentId = String(this.state.track?.id ?? "");
                let queue = this.shuffleEntries(this.originalQueue);
                if (String(queue[0]?.id ?? "") === currentId) {
                    const replacement = queue.findIndex((track) => String(track?.id ?? "") !== currentId);
                    if (replacement > 0)
                        [queue[0], queue[replacement]] = [queue[replacement], queue[0]];
                }
                this.patch({ queue, index: 0, track: queue[0], position: 0 });
                await this.loadCurrent(true);
                return this.state;
            }
            index = 0;
        }
        else
            return this.state;
        this.patch({ index, track: this.state.queue[index], position: 0 });
        await this.loadCurrent(true);
        return this.state;
    }
    async previous() {
        const audio = this.ensureAudio();
        if (audio && audio.currentTime > 4) {
            audio.currentTime = 0;
            this.patch({ position: 0 });
            return this.state;
        }
        if (!this.state.queue.length)
            return this.state;
        let index = this.state.index;
        index = index > 0 ? index - 1 : (this.state.repeatMode === "All" ? this.state.queue.length - 1 : 0);
        this.patch({ index, track: this.state.queue[index], position: 0 });
        await this.loadCurrent(true);
        return this.state;
    }
    async playIndex(index) {
        if (!this.state.queue.length)
            return this.state;
        const nextIndex = Math.max(0, Math.min(Math.floor(index || 0), this.state.queue.length - 1));
        if (nextIndex === this.state.index) {
            const audio = this.ensureAudio();
            if (audio?.paused)
                await audio.play();
            return this.state;
        }
        this.patch({ index: nextIndex, track: this.state.queue[nextIndex], position: 0 });
        await this.loadCurrent(true);
        return this.state;
    }
    async command(command) {
        if (command === "play_pause")
            return this.playPause();
        if (command === "next")
            return this.next();
        if (command === "previous")
            return this.previous();
        if (command === "shuffle") {
            const shuffleActive = !this.state.shuffleActive;
            const currentId = String(this.state.track?.id ?? "");
            if (shuffleActive) {
                const prefix = this.state.index >= 0 ? this.state.queue.slice(0, this.state.index + 1) : [];
                const future = this.state.index >= 0 ? this.state.queue.slice(this.state.index + 1) : this.state.queue;
                this.patch({ shuffleActive, queue: [...prefix, ...this.shuffleEntries(future)] });
            }
            else {
                const restored = this.originalQueue.length ? [...this.originalQueue] : [...this.state.queue];
                const restoredIndex = Math.max(0, restored.findIndex((track) => String(track?.id ?? "") === currentId));
                this.patch({ shuffleActive, queue: restored, index: restoredIndex, track: restored[restoredIndex] ?? this.state.track });
            }
            return this.state;
        }
        const next = this.state.repeatMode === "None" ? "All" : this.state.repeatMode === "All" ? "One" : "None";
        this.patch({ repeatMode: next });
        return this.state;
    }
    stop() {
        const audio = this.ensureAudio();
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
        this.patch({ status: "Stopped", position: 0 });
        return this.state;
    }
    setVolume(value) {
        const volume = Math.max(0, Math.min(100, Math.round(value)));
        const audio = this.ensureAudio();
        if (audio)
            audio.volume = volume / 100;
        this.patch({ volume });
        return this.state;
    }
    seek(ms) {
        const audio = this.ensureAudio();
        if (!audio)
            return;
        audio.currentTime = Math.max(0, ms / 1000);
    }
    destroy() {
        if (this.syncTimer)
            window.clearTimeout(this.syncTimer);
        this.syncTimer = 0;
        this.lastBackendSyncAt = 0;
        if (this.audio) {
            this.audio.pause();
            this.audio.removeAttribute("src");
            this.audio.load();
        }
        this.audio = null;
        this.originalQueue = [];
        this.recoveryAttempts = 0;
        this.recoveryInFlight = false;
        this.clearStallRecoveryTimer();
        this.state = { ...emptyState };
        this.emit(false);
    }
    async handleEnded() {
        const expectedLength = Math.max(Number(this.state.length || 0), Number(this.state.track?.duration_ms || 0));
        const actualPosition = Math.max(Number(this.state.position || 0), Math.floor((this.audio?.currentTime || 0) * 1000));
        if (expectedLength > 0 && expectedLength - actualPosition > 2500 && this.recoveryAttempts < 2) {
            await this.reloadAt(Math.min(expectedLength - 1000, actualPosition + 80), "premature-ended");
            return;
        }
        if (this.state.repeatMode === "One") {
            await this.loadCurrent(true);
            return;
        }
        if (this.state.index < this.state.queue.length - 1 || this.state.repeatMode === "All") {
            await this.next();
            return;
        }
        this.patch({ status: "Stopped", position: this.state.length });
    }
    shuffleEntries(entries) {
        const result = [...entries];
        for (let index = result.length - 1; index > 0; index -= 1) {
            const swap = Math.floor(Math.random() * (index + 1));
            [result[index], result[swap]] = [result[swap], result[index]];
        }
        return result;
    }
    async reloadAt(positionMs, reason) {
        const audio = this.ensureAudio();
        const track = this.state.track;
        if (!audio || !track || this.recoveryInFlight || this.recoveryAttempts >= 2)
            return;
        await this.initialize();
        this.recoveryInFlight = true;
        this.clearStallRecoveryTimer();
        this.recoveryAttempts += 1;
        const token = ++this.loadingToken;
        const shouldResume = this.state.status === "Playing";
        const resumeAt = Math.max(0, Number(positionMs || 0));
        try {
            audio.pause();
            audio.src = `${this.streamUrl(track)}?v=${encodeURIComponent(String(track?.modifiedAt ?? track?.id ?? "track"))}&recover=${Date.now()}&reason=${encodeURIComponent(reason)}`;
            audio.load();
            await new Promise((resolve, reject) => {
                let settled = false;
                const finish = (error) => {
                    if (settled)
                        return;
                    settled = true;
                    window.clearTimeout(timeout);
                    audio.removeEventListener("loadedmetadata", ready);
                    audio.removeEventListener("canplay", ready);
                    audio.removeEventListener("error", failed);
                    if (error)
                        reject(error);
                    else
                        resolve();
                };
                const ready = () => finish();
                const failed = () => finish(new Error(getTranslations("runtime").localAudioRecoveryFailed));
                const timeout = window.setTimeout(() => finish(), 4500);
                audio.addEventListener("loadedmetadata", ready, { once: true });
                audio.addEventListener("canplay", ready, { once: true });
                audio.addEventListener("error", failed, { once: true });
            });
            if (token !== this.loadingToken)
                return;
            const maximum = Number.isFinite(audio.duration) && audio.duration > 0 ? Math.max(0, audio.duration * 1000 - 250) : resumeAt;
            audio.currentTime = Math.max(0, Math.min(resumeAt, maximum)) / 1000;
            this.lastProgressAt = Date.now();
            this.patch({ position: Math.floor(audio.currentTime * 1000), error: "" });
            if (shouldResume)
                await audio.play();
        }
        catch (error) {
            if (token === this.loadingToken)
                this.patch({ error: String(error?.message ?? error ?? getTranslations("runtime").localAudioRecoveryFailed) });
        }
        finally {
            if (token === this.loadingToken)
                this.recoveryInFlight = false;
        }
    }
}
const localAudioPlayer = new LocalAudioEngine();
function useLocalAudioState() {
    return SP_REACT.useSyncExternalStore(localAudioPlayer.subscribe, localAudioPlayer.getSnapshot, localAudioPlayer.getSnapshot);
}

function ArtistBackgroundPicker({ provider, artistId, artistName, onBack, onApplied, }) {
    const t = SP_REACT.useMemo(() => getTranslations("core"), []);
    const [items, setItems] = SP_REACT.useState([]);
    const [loading, setLoading] = SP_REACT.useState(true);
    const [applyingId, setApplyingId] = SP_REACT.useState("");
    const [error, setError] = SP_REACT.useState("");
    const [failedPreviews, setFailedPreviews] = SP_REACT.useState({});
    const [loadedPreviews, setLoadedPreviews] = SP_REACT.useState({});
    const searchRevisionRef = SP_REACT.useRef(0);
    const accent = provider === "spotify" ? "#1DB954" : "#D9A337";
    const search = SP_REACT.useCallback(async () => {
        const revision = ++searchRevisionRef.current;
        setLoading(true);
        setError("");
        setFailedPreviews({});
        setLoadedPreviews({});
        void reportDiagnosticEvent("artwork", "search_started", { provider, artistId, artistName }).catch(() => { });
        let timeoutId = 0;
        try {
            const result = await Promise.race([
                searchArtistBackgrounds(provider, artistId, artistName, "all"),
                new Promise((_, reject) => {
                    timeoutId = window.setTimeout(() => reject(new Error(t.backgroundSearchTimedOut)), 16000);
                }),
            ]);
            if (revision !== searchRevisionRef.current)
                return;
            if (!result.ok)
                throw new Error(result.error || t.backgroundApplyFailed);
            const nextItems = Array.isArray(result.data?.items) ? result.data.items : [];
            setItems(nextItems);
            void reportDiagnosticEvent("artwork", "search_completed", { provider, artistId, artistName, count: nextItems.length }).catch(() => { });
        }
        catch (reason) {
            if (revision !== searchRevisionRef.current)
                return;
            setItems([]);
            const message = localizeRuntimeMessage(reason?.message ?? String(reason), t.backgroundApplyFailed);
            setError(message);
            void reportDiagnosticEvent("artwork", "search_failed", { provider, artistId, artistName, error: message }).catch(() => { });
        }
        finally {
            if (timeoutId)
                window.clearTimeout(timeoutId);
            if (revision === searchRevisionRef.current)
                setLoading(false);
        }
    }, [artistId, artistName, provider, t.backgroundApplyFailed, t.backgroundSearchTimedOut]);
    SP_REACT.useEffect(() => {
        void search();
        return () => { searchRevisionRef.current += 1; };
    }, [search]);
    SP_REACT.useEffect(() => {
        let disposed = false;
        const objectUrls = [];
        const controllers = [];
        const queue = items.filter((candidate) => Boolean(candidate.previewUrl));
        let cursor = 0;
        const worker = async () => {
            while (!disposed) {
                const candidate = queue[cursor++];
                if (!candidate)
                    return;
                const controller = new AbortController();
                controllers.push(controller);
                const timer = window.setTimeout(() => controller.abort(), 12000);
                try {
                    const response = await fetch(candidate.previewUrl, { cache: "force-cache", signal: controller.signal });
                    if (!response.ok)
                        throw new Error(`HTTP ${response.status}`);
                    const blob = await response.blob();
                    if (!blob.type.startsWith("image/") || blob.size < 256)
                        throw new Error("Invalid image preview");
                    const objectUrl = URL.createObjectURL(blob);
                    objectUrls.push(objectUrl);
                    if (!disposed)
                        setLoadedPreviews((current) => ({ ...current, [candidate.id]: objectUrl }));
                }
                catch {
                    if (!disposed)
                        setFailedPreviews((current) => ({ ...current, [candidate.id]: true }));
                }
                finally {
                    window.clearTimeout(timer);
                }
            }
        };
        void Promise.all([worker(), worker()]);
        return () => {
            disposed = true;
            controllers.forEach((controller) => controller.abort());
            objectUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [items]);
    async function apply(candidate) {
        if (applyingId)
            return;
        setApplyingId(candidate.id);
        setError("");
        void reportDiagnosticEvent("artwork", "apply_started", { provider, artistId, artistName, candidateId: candidate.id, source: candidate.source }).catch(() => { });
        try {
            const result = await applyArtistBackground(provider, artistId, artistName, candidate.id);
            if (!result.ok || !result.url)
                throw new Error(result.error || t.backgroundApplyFailed);
            setItems((current) => current.map((item) => ({ ...item, selected: item.id === candidate.id })));
            onApplied(result.url);
            toaster.toast({ title: artistName, body: t.backgroundApplied, duration: 2600 });
            void reportDiagnosticEvent("artwork", "apply_completed", { provider, artistId, artistName, candidateId: candidate.id, source: candidate.source }).catch(() => { });
        }
        catch (reason) {
            const message = localizeRuntimeMessage(reason?.message ?? String(reason), t.backgroundApplyFailed);
            setError(message);
            toaster.toast({ title: artistName, body: message, duration: 3600 });
            void reportDiagnosticEvent("artwork", "apply_failed", { provider, artistId, artistName, candidateId: candidate.id, source: candidate.source, error: message }).catch(() => { });
        }
        finally {
            setApplyingId("");
        }
    }
    return (SP_JSX.jsxs(DFL.Focusable, { "flow-children": "vertical", style: { width: "100%" }, children: [SP_JSX.jsx(DFL.DialogButton, { style: { width: 112, minWidth: 112, height: 38, padding: 0, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.035)" }, onClick: onBack, children: SP_JSX.jsxs("span", { style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }, children: [SP_JSX.jsx(FaArrowLeft, { size: 12 }), " ", t.back] }) }), SP_JSX.jsxs("div", { style: { marginTop: 26 }, children: [SP_JSX.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12, opacity: .58, textTransform: "uppercase", letterSpacing: ".12em", fontSize: 12, fontWeight: 700 }, children: [SP_JSX.jsx(FaCog, {}), " ", t.artistBackgroundSettings] }), SP_JSX.jsx("h1", { style: { margin: "10px 0 0", fontSize: "clamp(44px,5vw,72px)", lineHeight: 1.02, letterSpacing: "-.045em", fontWeight: 610 }, children: artistName }), SP_JSX.jsx("p", { style: { maxWidth: 920, margin: "14px 0 0", fontSize: 18, lineHeight: 1.5, opacity: .62 }, children: t.artistBackgroundDescription })] }), loading ? (SP_JSX.jsxs("div", { style: { marginTop: 24, display: "flex", alignItems: "center", gap: 10, fontSize: 19, opacity: .65 }, children: [SP_JSX.jsx(FaSyncAlt, { className: "npArtistBackgroundSpin" }), " ", t.searchingBackgrounds] })) : null, !loading && items.length ? (SP_JSX.jsx(DFL.Focusable, { "flow-children": "grid", style: { display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 18, marginTop: 32 }, children: items.map((candidate) => {
                    const applying = applyingId === candidate.id;
                    return (SP_JSX.jsx(DFL.DialogButton, { className: `npArtistBackgroundCandidate${candidate.selected ? " npArtistBackgroundCandidateSelected" : ""}`, disabled: Boolean(applyingId), onClick: () => void apply(candidate), style: {
                            position: "relative",
                            width: "100%",
                            minWidth: 0,
                            height: "auto",
                            minHeight: 0,
                            padding: 0,
                            overflow: "hidden",
                            borderRadius: 14,
                            border: candidate.selected ? `2px solid ${accent}` : "1px solid rgba(255,255,255,.10)",
                            background: candidate.selected ? `linear-gradient(145deg, ${accent}22, rgba(255,255,255,.035))` : "rgba(255,255,255,.045)",
                            boxShadow: candidate.selected ? `0 0 0 1px ${accent}55, 0 0 30px ${accent}55, 0 18px 50px rgba(0,0,0,.34)` : "none",
                        }, children: SP_JSX.jsxs("span", { style: { width: "100%", display: "block", textAlign: "left" }, children: [SP_JSX.jsxs("span", { style: { position: "relative", width: "100%", aspectRatio: "16 / 9", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "rgba(255,255,255,.055)" }, children: [SP_JSX.jsxs("span", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, opacity: loadedPreviews[candidate.id] ? 0 : .42, transition: "opacity .16s ease" }, children: [SP_JSX.jsx(FaImage, { size: 42 }), SP_JSX.jsx("span", { style: { fontSize: 12 }, children: candidate.source })] }), loadedPreviews[candidate.id] && !failedPreviews[candidate.id] ? (SP_JSX.jsx("span", { "aria-hidden": "true", style: {
                                                position: "absolute",
                                                inset: 0,
                                                display: "block",
                                                backgroundImage: `url(${JSON.stringify(loadedPreviews[candidate.id])})`,
                                                backgroundPosition: "center",
                                                backgroundRepeat: "no-repeat",
                                                backgroundSize: "cover",
                                            } })) : null, candidate.selected ? SP_JSX.jsx("span", { style: { position: "absolute", top: 10, right: 10, width: 28, height: 28, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.72)", color: "#fff" }, children: SP_JSX.jsx(FaCheck, { size: 13 }) }) : null, applying ? SP_JSX.jsxs("span", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: "rgba(0,0,0,.72)", color: "#fff", fontSize: 16 }, children: [SP_JSX.jsx(FaDownload, { className: "npArtistBackgroundPulse" }), " ", t.downloadingBackground] }) : null] }), SP_JSX.jsxs("span", { style: { display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", alignItems: "center", gap: 12, padding: "12px 14px 13px" }, children: [SP_JSX.jsxs("span", { style: { minWidth: 0 }, children: [SP_JSX.jsx("strong", { style: { display: "block", fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: candidate.source }), SP_JSX.jsxs("span", { style: { display: "block", marginTop: 4, fontSize: 13, opacity: .58 }, children: [t.resolution, ": ", candidate.width, " \u00D7 ", candidate.height] })] }), SP_JSX.jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, opacity: .74 }, children: [SP_JSX.jsx(FaDownload, { size: 12 }), " ", candidate.selected ? t.currentBackground : t.downloadAndApply] })] })] }) }, candidate.id));
                }) })) : null, !loading && !items.length ? SP_JSX.jsx("div", { style: { marginTop: 32, padding: 24, borderRadius: 14, background: "rgba(255,255,255,.04)", fontSize: 19, opacity: .62 }, children: error || t.noBackgroundsFound }) : null, error && items.length ? SP_JSX.jsx("div", { style: { marginTop: 18, color: "#ff9a9a", fontSize: 16 }, children: error }) : null, SP_JSX.jsx(DFL.DialogButton, { style: { width: 190, minWidth: 190, height: 44, marginTop: 24 }, disabled: loading || Boolean(applyingId), onClick: () => void search(), children: SP_JSX.jsxs("span", { style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }, children: [SP_JSX.jsx(FaSyncAlt, {}), " ", t.refreshBackgrounds] }) }), SP_JSX.jsx("style", { children: `
        @keyframes npArtistBackgroundSpin { to { transform: rotate(360deg); } }
        @keyframes npArtistBackgroundPulse { from { opacity:.5; transform:scale(.94); } to { opacity:1; transform:scale(1.05); } }
        .npArtistBackgroundSpin { animation: npArtistBackgroundSpin .85s linear infinite; }
        .npArtistBackgroundPulse { animation: npArtistBackgroundPulse .7s ease-in-out infinite alternate; }
        .npArtistBackgroundCandidate, .npArtistBackgroundCandidate * { color:#fff!important; }
        .npArtistBackgroundCandidate:hover, .npArtistBackgroundCandidate:focus, .npArtistBackgroundCandidate.gpfocus { color:#fff!important; border-color:${accent}!important; box-shadow:0 0 0 1px ${accent}55,0 0 26px ${accent}44,0 18px 50px rgba(0,0,0,.34)!important; }
        .npArtistBackgroundCandidateSelected:hover, .npArtistBackgroundCandidateSelected:focus, .npArtistBackgroundCandidateSelected.gpfocus { box-shadow:0 0 0 1px ${accent}88,0 0 38px ${accent}77,0 18px 50px rgba(0,0,0,.38)!important; }
      ` })] }));
}

const STORAGE_KEY = "nowPlaying:sourceVolumes:v1";
const SOURCE_VOLUME_CHANGED_EVENT = "nowPlaying:source-volume-changed";
function clampVolume(value, fallback = 100) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric))
        return fallback;
    return Math.max(0, Math.min(100, Math.round(numeric)));
}
function readAll() {
    if (typeof window === "undefined")
        return {};
    try {
        const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
        if (!parsed || typeof parsed !== "object")
            return {};
        return Object.fromEntries(Object.entries(parsed).map(([key, value]) => [key, clampVolume(value)]));
    }
    catch {
        return {};
    }
}
function getSavedSourceVolume(source, fallback = 100) {
    const key = String(source || "").trim();
    if (!key)
        return clampVolume(fallback);
    const values = readAll();
    return Object.prototype.hasOwnProperty.call(values, key) ? clampVolume(values[key], fallback) : clampVolume(fallback);
}
function saveSourceVolume(source, value, origin = "plugin") {
    const key = String(source || "").trim();
    const volume = clampVolume(value);
    if (!key || typeof window === "undefined")
        return volume;
    try {
        const values = readAll();
        values[key] = volume;
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
        window.dispatchEvent(new CustomEvent(SOURCE_VOLUME_CHANGED_EVENT, { detail: { source: key, volume, origin } }));
    }
    catch {
        // Embedded CEF can temporarily deny storage; live volume still applies.
    }
    return volume;
}

function SmoothProgressFill({ position, duration, playing, sampledAt, style }) {
    const fillRef = SP_REACT.useRef(null);
    SP_REACT.useEffect(() => {
        let frame = 0;
        const base = Math.max(0, Number(position || 0));
        const total = Math.max(1, Number(duration || 1));
        const receivedAt = Math.max(0, Number(sampledAt || Date.now()));
        const draw = () => {
            const elapsed = playing ? Math.max(0, Date.now() - receivedAt) : 0;
            const ratio = Math.max(0, Math.min(1, (base + elapsed) / total));
            if (fillRef.current)
                fillRef.current.style.transform = `scaleX(${ratio})`;
            if (playing && ratio < 1)
                frame = window.requestAnimationFrame(draw);
        };
        draw();
        return () => {
            if (frame)
                window.cancelAnimationFrame(frame);
        };
    }, [duration, playing, position, sampledAt]);
    return (SP_JSX.jsx("div", { ref: fillRef, "aria-hidden": "true", style: { width: "100%", transform: "scaleX(0)", transformOrigin: "left center", willChange: "transform", ...style } }));
}
function SmoothProgressTime({ position, duration, playing, sampledAt, format }) {
    const labelRef = SP_REACT.useRef(null);
    SP_REACT.useEffect(() => {
        let timer = 0;
        const base = Math.max(0, Number(position || 0));
        const total = Math.max(0, Number(duration || 0));
        const receivedAt = Math.max(0, Number(sampledAt || Date.now()));
        const draw = () => {
            const elapsed = playing ? Math.max(0, Date.now() - receivedAt) : 0;
            const current = Math.min(total || Number.MAX_SAFE_INTEGER, base + elapsed);
            const label = format(current);
            if (labelRef.current && labelRef.current.textContent !== label)
                labelRef.current.textContent = label;
            if (playing && (!total || current < total))
                timer = window.setTimeout(draw, 200);
        };
        draw();
        return () => {
            if (timer)
                window.clearTimeout(timer);
        };
    }, [duration, format, playing, position, sampledAt]);
    return SP_JSX.jsx("span", { ref: labelRef, children: format(Math.max(0, Number(position || 0))) });
}

const SPOTIFY_GREEN = "#1DB954";
const SPOTIFY_PLAYBACK_CHANGED_EVENT = "nowPlaying:spotify-playback-changed";
let sharedSpotifyPlayback = null;
let sharedSpotifyPlaybackAt = 0;
function publishSpotifyPlaybackSnapshot(player) {
    const now = Date.now();
    let next = player ? { ...player } : null;
    if (next && sharedSpotifyPlayback) {
        const sameTrack = String(next.id ?? "") === String(sharedSpotifyPlayback.id ?? "")
            && String(next.title ?? "") === String(sharedSpotifyPlayback.title ?? "")
            && String(next.artist ?? "") === String(sharedSpotifyPlayback.artist ?? "")
            && String(next.album ?? "") === String(sharedSpotifyPlayback.album ?? "");
        if (sameTrack && next.status === "Playing" && sharedSpotifyPlayback.status === "Playing") {
            const elapsed = Math.max(0, now - sharedSpotifyPlaybackAt);
            const duration = Math.max(0, Number(next.length || sharedSpotifyPlayback.length || 0));
            const projected = Math.max(0, Number(sharedSpotifyPlayback.position || 0) + elapsed);
            const incoming = Math.max(0, Number(next.position || 0));
            next.position = Math.min(duration || Number.MAX_SAFE_INTEGER, Math.max(incoming, projected - 250));
        }
    }
    sharedSpotifyPlayback = next;
    sharedSpotifyPlaybackAt = now;
    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(SPOTIFY_PLAYBACK_CHANGED_EVENT, { detail: sharedSpotifyPlayback }));
    }
}
function getSharedSpotifyPlaybackSnapshot() {
    return sharedSpotifyPlayback ? { ...sharedSpotifyPlayback } : null;
}
function getSharedSpotifyPlaybackTimestamp() {
    return sharedSpotifyPlaybackAt;
}
function notifySpotifyPlaybackChanged() {
    window.dispatchEvent(new CustomEvent(SPOTIFY_PLAYBACK_CHANGED_EVENT));
}
const controlHeight = 34;
const fullButtonStyle = {
    width: "100%",
    minWidth: "100%",
    maxWidth: "100%",
    minHeight: `${controlHeight}px`,
    padding: 0,
    lineHeight: 1,
};
const iconButtonStyle = {
    width: `${controlHeight}px`,
    minWidth: `${controlHeight}px`,
    maxWidth: `${controlHeight}px`,
    height: `${controlHeight}px`,
    minHeight: `${controlHeight}px`,
    padding: 0,
};
const sectionLabelStyle = {
    padding: "0 4px",
    margin: "14px 0 6px",
    fontSize: "0.74em",
    fontWeight: 800,
    letterSpacing: "0.035em",
    textTransform: "uppercase",
    opacity: 0.62,
};
const settingsCardStyle = {
    width: "100%",
    boxSizing: "border-box",
    borderRadius: "10px",
    border: "1px solid rgba(29,185,84,0.28)",
    background: "linear-gradient(145deg, rgba(29,185,84,0.12), rgba(0,0,0,0.22))",
    padding: "12px",
};
function resolveSpotifyTranslations() {
    return getTranslations("spotify");
}
function useSpotifyTranslations() {
    return SP_REACT.useMemo(resolveSpotifyTranslations, []);
}
function formatSpotifyText(template, values) {
    return formatTranslation(template, values);
}
function isSpotifyRateLimitMessage(message) {
    return /rate limit|too many requests/i.test(String(message ?? ""));
}
function formatCountdown(totalSeconds) {
    const value = Math.max(0, Math.floor(Number(totalSeconds || 0)));
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = value % 60;
    return hours > 0
        ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
        : `${minutes}:${String(seconds).padStart(2, "0")}`;
}
function spotifyPausedPlayer$1(t) {
    return {
        id: "spotify-api-paused",
        name: "Spotify API",
        title: t.apiPausedTitle,
        artist: t.apiPausedWait,
        album: "",
        status: "Paused",
        length: 0,
        position: 0,
        volume: 0,
        canNext: false,
        canPrevious: false,
        canPlay: false,
        canPause: false,
        canTogglePlayPause: false,
        canShuffle: false,
        canRepeat: false,
        shuffleActive: false,
        repeatMode: "Off",
        isSelected: true,
        isCurrent: true,
    };
}
function imageUrl(item) {
    const images = item?.images ?? item?.album?.images ?? [];
    if (!Array.isArray(images) || !images.length)
        return "";
    const medium = images.find((entry) => Number(entry?.width || 0) >= 160) ?? images[0];
    return String(medium?.url ?? "");
}
function highestResolutionImageUrl(item) {
    const images = item?.images ?? item?.album?.images ?? [];
    if (!Array.isArray(images) || !images.length)
        return "";
    const sorted = [...images].filter((entry) => entry?.url).sort((left, right) => {
        const leftSize = Number(left?.width || 0) * Number(left?.height || 0);
        const rightSize = Number(right?.width || 0) * Number(right?.height || 0);
        return rightSize - leftSize;
    });
    return String(sorted[0]?.url ?? "");
}
function spotifyPlaybackToSnapshot(payload) {
    const item = payload?.item;
    if (!item || !item?.name)
        return null;
    const artists = Array.isArray(item?.artists)
        ? item.artists.map((artist) => artist?.name).filter(Boolean).join(", ")
        : String(item?.show?.name ?? "");
    const repeat = String(payload?.repeat_state ?? "off");
    return {
        id: "spotify-api",
        name: "Spotify",
        title: String(item?.name ?? ""),
        artist: artists,
        album: String(item?.album?.name ?? item?.show?.name ?? ""),
        status: payload?.is_playing ? "Playing" : "Paused",
        length: Number(item?.duration_ms ?? 0),
        position: Number(payload?.progress_ms ?? 0),
        canNext: true,
        canPrevious: true,
        canPlay: true,
        canPause: true,
        canTogglePlayPause: true,
        isSelected: true,
        isCurrent: true,
        canShuffle: true,
        canRepeat: true,
        shuffleActive: Boolean(payload?.shuffle_state),
        repeatMode: repeat === "context" ? "List" : repeat === "track" ? "Track" : "Off",
        artworkUrl: highestResolutionImageUrl(item),
    };
}
function artistText$1(item) {
    const artists = item?.artists;
    if (Array.isArray(artists) && artists.length) {
        return artists.map((artist) => artist?.name).filter(Boolean).join(", ");
    }
    const singleArtist = typeof item?.artist === "string"
        ? item.artist
        : String(item?.artist?.name ?? "");
    if (singleArtist.trim())
        return singleArtist.trim();
    if (String(item?.type ?? "").toLowerCase() === "album")
        return "";
    return String(item?.owner?.display_name ?? item?.publisher ?? "Spotify");
}
function normalizeTrack$1(entry) {
    return entry?.track ?? entry?.item ?? entry;
}
function normalizeAlbum(entry) {
    return entry?.album ?? entry;
}
function itemType$1(item) {
    const type = String(item?.type ?? "").toLowerCase();
    if (type === "track" || type === "album" || type === "artist" || type === "playlist")
        return type;
    const uri = String(item?.uri ?? "");
    if (uri.startsWith("spotify:track:"))
        return "track";
    if (uri.startsWith("spotify:album:"))
        return "album";
    if (uri.startsWith("spotify:artist:"))
        return "artist";
    if (uri.startsWith("spotify:playlist:"))
        return "playlist";
    return "unknown";
}
function showError$1(message) {
    const t = resolveSpotifyTranslations();
    toaster.toast({ title: "Spotify", body: localizeRuntimeMessage(message, t.genericError), duration: 4500 });
}
function SpotifyLogoTitle({ subtitle }) {
    return (SP_JSX.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }, children: [SP_JSX.jsx(SiSpotify, { size: 24, color: "#fff", style: { flexShrink: 0 } }), SP_JSX.jsxs("span", { style: { minWidth: 0 }, children: [SP_JSX.jsx("strong", { style: { display: "block", fontSize: "1em", lineHeight: 1.1, fontWeight: 620 }, children: "Spotify" }), subtitle ? SP_JSX.jsx("span", { style: { display: "block", fontSize: "0.72em", opacity: 0.62, marginTop: "2px" }, children: subtitle }) : null] })] }));
}
function SpotifyArtwork({ url, size = 42, round = false }) {
    const radius = round ? "50%" : "5px";
    return (SP_JSX.jsx("div", { style: {
            width: `${size}px`,
            height: `${size}px`,
            minWidth: `${size}px`,
            borderRadius: radius,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.42)",
        }, children: url ? (SP_JSX.jsx("img", { src: url, style: { width: "100%", height: "100%", objectFit: "cover" } })) : (SP_JSX.jsx(FaMusic, { size: Math.max(14, Math.round(size * 0.38)) })) }));
}
function SpotifyRow({ item, subtitle, onActivate, leadingImage, roundImage, sideAction, buttonRef, preferredFocus, }) {
    const t = resolveSpotifyTranslations();
    const mainButton = (SP_JSX.jsx(DFL.DialogButton, { ref: buttonRef, preferredFocus: preferredFocus, className: "npSpotifyResultButton", style: {
            ...fullButtonStyle,
            width: sideAction ? "auto" : "100%",
            minWidth: 0,
            maxWidth: sideAction ? "none" : "100%",
            flex: sideAction ? 1 : undefined,
            height: "54px",
            minHeight: "54px",
            marginBottom: sideAction ? 0 : "6px",
            overflow: "hidden",
        }, onClick: onActivate, children: SP_JSX.jsxs("span", { style: {
                width: "100%",
                minWidth: 0,
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                gap: "9px",
                padding: "5px 8px",
                textAlign: "left",
            }, children: [SP_JSX.jsx(SpotifyArtwork, { url: leadingImage ?? imageUrl(item), size: 42, round: roundImage }), SP_JSX.jsxs("span", { style: { minWidth: 0, flex: 1 }, children: [SP_JSX.jsx("strong", { style: {
                                display: "block",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                fontSize: "0.88em",
                                lineHeight: 1.15,
                            }, children: String(item?.name ?? t.untitled) }), SP_JSX.jsx("span", { style: {
                                display: "block",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                fontSize: "0.72em",
                                lineHeight: 1.25,
                                minHeight: "1.25em",
                                paddingBottom: "2px",
                                opacity: 0.62,
                                marginTop: "3px",
                            }, children: subtitle ?? artistText$1(item) })] }), !sideAction ? SP_JSX.jsx("span", { style: { display: "inline-flex", alignItems: "center", opacity: 0.68 }, children: SP_JSX.jsx(FaChevronRight, { size: 12 }) }) : null] }) }));
    if (!sideAction)
        return mainButton;
    return (SP_JSX.jsxs(DFL.Focusable, { style: { display: "flex", alignItems: "stretch", gap: "6px", width: "100%", marginBottom: "6px" }, "flow-children": "horizontal", children: [mainButton, SP_JSX.jsx(DFL.DialogButton, { style: { ...iconButtonStyle, height: "54px", minHeight: "54px", width: "38px", minWidth: "38px", maxWidth: "38px" }, "aria-label": sideAction.label, onClick: sideAction.onActivate, children: sideAction.icon })] }));
}
function SpotifyPlusSettingsPanel({ selectedService, onSettingsChanged, }) {
    const t = useSpotifyTranslations();
    const [settings, setSettings] = SP_REACT.useState({
        enabled: false,
        clientId: "",
        redirectUri: "http://127.0.0.1:43821/callback",
        authenticated: false,
        compactSavedTracks: true,
        audioQuality: 320,
    });
    const [clientId, setClientId] = SP_REACT.useState("");
    const [authState, setAuthState] = SP_REACT.useState("idle");
    const [statusText, setStatusText] = SP_REACT.useState("");
    const [busy, setBusy] = SP_REACT.useState(false);
    const [settingsReady, setSettingsReady] = SP_REACT.useState(false);
    const [setupDetailsOpen, setSetupDetailsOpen] = SP_REACT.useState(false);
    const [audioCacheBusy, setAudioCacheBusy] = SP_REACT.useState(false);
    const [artistCacheBusy, setArtistCacheBusy] = SP_REACT.useState(false);
    const [refreshBusy, setRefreshBusy] = SP_REACT.useState(false);
    const [artistCacheProgress, setArtistCacheProgress] = SP_REACT.useState({ active: false, phase: "idle", current: "", completed: 0, total: 0 });
    const [artistCacheStats, setArtistCacheStats] = SP_REACT.useState({ bytes: 0, files: 0 });
    const pollRef = SP_REACT.useRef(0);
    const artistCachePollRef = SP_REACT.useRef(0);
    const applySettings = SP_REACT.useCallback((next) => {
        setSettings(next);
        setClientId(next.clientId ?? "");
        onSettingsChanged?.(next);
    }, [onSettingsChanged]);
    const reload = SP_REACT.useCallback(async () => {
        try {
            applySettings(await getSpotifySettings());
        }
        catch (error) {
            showError$1(error?.message ?? String(error));
        }
        finally {
            setSettingsReady(true);
        }
    }, [applySettings]);
    const reloadArtistCacheStats = SP_REACT.useCallback(async () => {
        try {
            setArtistCacheStats(await getSpotifyArtistCacheStats());
        }
        catch {
            // Keep the last known size if the filesystem is momentarily unavailable.
        }
    }, []);
    SP_REACT.useEffect(() => {
        void reload();
        void reloadArtistCacheStats();
        return () => {
            if (pollRef.current)
                window.clearInterval(pollRef.current);
            if (artistCachePollRef.current)
                window.clearInterval(artistCachePollRef.current);
        };
    }, [reload, reloadArtistCacheStats]);
    SP_REACT.useEffect(() => {
        if (settings.authenticated)
            setSetupDetailsOpen(false);
    }, [settings.authenticated]);
    const beginPolling = SP_REACT.useCallback(() => {
        if (pollRef.current)
            window.clearInterval(pollRef.current);
        pollRef.current = window.setInterval(async () => {
            try {
                const status = await getSpotifyAuthStatus();
                setAuthState(status.state);
                setStatusText(localizeRuntimeMessage(status.message ?? ""));
                if (status.authenticated || status.state === "error") {
                    if (pollRef.current)
                        window.clearInterval(pollRef.current);
                    pollRef.current = 0;
                    applySettings(status);
                    setBusy(false);
                }
            }
            catch {
                // Keep waiting; the callback may still be in progress.
            }
        }, 900);
    }, [applySettings]);
    async function toggleCompactSavedTracks() {
        try {
            setBusy(true);
            const next = await setSpotifyCompactSavedTracks(!settings.compactSavedTracks);
            applySettings(next);
        }
        catch (error) {
            showError$1(error?.message ?? String(error));
        }
        finally {
            setBusy(false);
        }
    }
    async function setAudioQuality(quality) {
        if ((settings.audioQuality ?? 320) === quality)
            return;
        try {
            setBusy(true);
            applySettings(await setSpotifyAudioQuality(quality));
        }
        catch (error) {
            showError$1(error?.message ?? String(error));
        }
        finally {
            setBusy(false);
        }
    }
    async function clearAudioCache() {
        try {
            setAudioCacheBusy(true);
            const result = await clearSpotifyAudioCache();
            if (!result.ok)
                showError$1(result.error ?? t.genericError);
        }
        catch (error) {
            showError$1(error?.message ?? String(error));
        }
        finally {
            setAudioCacheBusy(false);
        }
    }
    async function saveClientId() {
        try {
            setBusy(true);
            const next = await setSpotifyClientId(clientId);
            applySettings(next);
            toaster.toast({ title: "Spotify", body: t.clientIdSaved, duration: 2200 });
        }
        catch (error) {
            showError$1(error?.message ?? String(error));
        }
        finally {
            setBusy(false);
        }
    }
    async function connect() {
        try {
            setBusy(true);
            if (clientId.trim() !== settings.clientId) {
                const next = await setSpotifyClientId(clientId);
                applySettings(next);
            }
            const result = await beginSpotifyAuth();
            if (!result.ok)
                throw new Error(result.error || t.unableStartAuthorization);
            setAuthState("waiting");
            setStatusText(t.completeSignIn);
            beginPolling();
        }
        catch (error) {
            setBusy(false);
            showError$1(error?.message ?? String(error));
        }
    }
    async function disconnect() {
        try {
            setBusy(true);
            applySettings(await disconnectSpotify());
            clearSpotifyLibrarySessionCaches();
            setAuthState("idle");
            setStatusText("");
        }
        catch (error) {
            showError$1(error?.message ?? String(error));
        }
        finally {
            setBusy(false);
        }
    }
    const refreshArtistCacheProgress = SP_REACT.useCallback(async () => {
        try {
            const progress = await getSpotifyArtistCacheProgress();
            setArtistCacheProgress(progress);
            setArtistCacheBusy(Boolean(progress.active));
            if (!progress.active && artistCachePollRef.current) {
                window.clearInterval(artistCachePollRef.current);
                artistCachePollRef.current = 0;
                void reloadArtistCacheStats();
            }
        }
        catch {
            // Keep the last visible progress during a transient Decky call failure.
        }
    }, [reloadArtistCacheStats]);
    SP_REACT.useEffect(() => {
        let mounted = true;
        void getSpotifyArtistCacheProgress().then((progress) => {
            if (!mounted)
                return;
            setArtistCacheProgress(progress);
            setArtistCacheBusy(Boolean(progress.active));
            if (progress.active)
                beginArtistCachePolling();
        }).catch(() => { });
        return () => { mounted = false; };
    }, [refreshArtistCacheProgress]);
    function beginArtistCachePolling() {
        if (artistCachePollRef.current)
            window.clearInterval(artistCachePollRef.current);
        void refreshArtistCacheProgress();
        artistCachePollRef.current = window.setInterval(() => void refreshArtistCacheProgress(), 400);
    }
    async function createArtistCache() {
        if (artistCacheBusy || !settings.authenticated)
            return;
        setArtistCacheBusy(true);
        setArtistCacheProgress({ active: true, phase: "loading", current: "", completed: 0, total: 0 });
        beginArtistCachePolling();
        try {
            const result = await buildSpotifyArtistCache();
            if (!result?.ok)
                throw new Error(result?.error || t.requestFailed);
            const artists = Number(result.data?.artists || 0);
            toaster.toast({
                title: "Spotify",
                body: artists > 0 ? t.artistCacheCreated : t.artistCacheNoFavorites,
                duration: 3000,
            });
        }
        catch (error) {
            showError$1(error?.message ?? String(error));
        }
        finally {
            void refreshArtistCacheProgress();
        }
    }
    async function clearArtistCache() {
        if (artistCacheBusy)
            return;
        setArtistCacheBusy(true);
        setArtistCacheProgress({ active: true, phase: "clearing", current: "", completed: 0, total: 0 });
        beginArtistCachePolling();
        try {
            const result = await clearSpotifyArtistCache();
            if (!result?.ok)
                throw new Error(result?.error || t.requestFailed);
            toaster.toast({ title: "Spotify", body: t.artistCacheCleared, duration: 2600 });
        }
        catch (error) {
            showError$1(error?.message ?? String(error));
        }
        finally {
            void refreshArtistCacheProgress();
            void reloadArtistCacheStats();
        }
    }
    async function clearManualBackgrounds() {
        if (artistCacheBusy || Number(artistCacheStats.manualFiles || 0) <= 0)
            return;
        setArtistCacheBusy(true);
        setArtistCacheProgress({ active: true, phase: "clearing_manual", current: "", completed: 0, total: Number(artistCacheStats.manualFiles || 0) });
        beginArtistCachePolling();
        try {
            const result = await clearManualArtistBackgrounds("spotify");
            if (!result?.ok)
                throw new Error(result?.error || t.requestFailed);
            toaster.toast({ title: "Spotify", body: t.manualBackgroundsRemoved, duration: 2600 });
        }
        catch (error) {
            showError$1(error?.message ?? String(error));
        }
        finally {
            void refreshArtistCacheProgress();
            void reloadArtistCacheStats();
        }
    }
    async function copyText(value) {
        const text = String(value ?? "");
        if (!text)
            return false;
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
                return true;
            }
        }
        catch {
            // Steam CEF may expose Clipboard without granting write permission.
        }
        try {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.setAttribute("readonly", "true");
            textarea.style.position = "fixed";
            textarea.style.left = "-9999px";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            const copied = document.execCommand("copy");
            textarea.remove();
            return copied;
        }
        catch {
            return false;
        }
    }
    async function copySetupValue(value, successMessage) {
        const copied = await copyText(value);
        toaster.toast({
            title: "Spotify",
            body: copied ? successMessage : value,
            duration: copied ? 2000 : 5000,
        });
    }
    function setupValueField(label, value, copyLabel, successMessage, multiline = false) {
        return (SP_JSX.jsxs("div", { style: { marginTop: "7px", marginBottom: "10px" }, children: [SP_JSX.jsx("label", { style: { display: "block", fontSize: "0.68em", opacity: 0.62, marginBottom: "4px" }, children: label }), multiline ? (SP_JSX.jsx("textarea", { readOnly: true, value: value, onFocus: (event) => event.currentTarget.select(), onClick: (event) => event.currentTarget.select(), style: {
                        width: "100%", minHeight: "58px", boxSizing: "border-box", resize: "none", padding: "8px",
                        borderRadius: "7px", background: "rgba(0,0,0,0.28)", border: "1px solid rgba(255,255,255,0.1)",
                        color: "inherit", fontFamily: "inherit", fontSize: "0.68em", lineHeight: 1.35, userSelect: "text",
                        WebkitUserSelect: "text", cursor: "text",
                    } })) : (SP_JSX.jsx("input", { readOnly: true, type: "text", value: value, onFocus: (event) => event.currentTarget.select(), onClick: (event) => event.currentTarget.select(), style: {
                        width: "100%", boxSizing: "border-box", padding: "8px", borderRadius: "7px",
                        background: "rgba(0,0,0,0.28)", border: "1px solid rgba(255,255,255,0.1)", color: "inherit",
                        fontFamily: label === t.redirectUri ? "monospace" : "inherit", fontSize: "0.68em", userSelect: "text",
                        WebkitUserSelect: "text", cursor: "text",
                    } })), SP_JSX.jsx("div", { style: { height: "6px" } }), SP_JSX.jsx(DFL.DialogButton, { style: fullButtonStyle, onClick: () => void copySetupValue(value, successMessage), children: SP_JSX.jsx("span", { children: copyLabel }) })] }));
    }
    return (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx("div", { style: sectionLabelStyle, children: "Spotify" }), SP_JSX.jsxs("div", { className: "npSpotifySettingsCard", style: settingsCardStyle, children: [SP_JSX.jsx("style", { children: `
          .npSpotifySettingsCard button,.npSpotifySettingsCard button *{color:#fff!important;text-align:left!important}
          .npSpotifySettingsCard button{font-size:.82em!important;transition:background 120ms ease,border-color 120ms ease,box-shadow 120ms ease!important}
          .npSpotifySettingsCard button span{font-size:1em!important}
          .npSpotifySettingsCard button>span{width:100%!important;box-sizing:border-box!important;display:flex!important;align-items:center!important;justify-content:flex-start!important;text-align:left!important;padding:0 10px!important;gap:7px!important;line-height:1.15!important}
          .npSpotifySettingsCard button:hover,.npSpotifySettingsCard button:focus,.npSpotifySettingsCard button.gpfocus{color:#fff!important;background:rgba(255,255,255,.12)!important;border-color:rgba(255,255,255,.24)!important;box-shadow:0 0 0 1px rgba(29,185,84,.28),0 0 18px rgba(29,185,84,.15)!important}
          .npSpotifySettingsCard .npSpotifyConnectButton{color:#fff!important;background:rgba(29,185,84,.72)!important}
          .npSpotifySettingsCard .npSpotifyConnectButton:hover,.npSpotifySettingsCard .npSpotifyConnectButton:focus,.npSpotifySettingsCard .npSpotifyConnectButton.gpfocus{background:#27d260!important;color:#fff!important;border-color:rgba(255,255,255,.34)!important;box-shadow:0 0 0 2px rgba(255,255,255,.62),0 0 22px rgba(29,185,84,.34)!important}
        ` }), SP_JSX.jsx(SpotifyLogoTitle, { subtitle: t.personalMode }), SP_JSX.jsx("p", { style: { fontSize: "0.74em", lineHeight: 1.42, opacity: 0.74, margin: "10px 0" }, children: t.settingsDescription }), selectedService !== "spotify" ? (SP_JSX.jsx("div", { style: { fontSize: "0.72em", opacity: 0.64, marginBottom: "9px" }, children: t.selectSpotifyHint })) : null, settingsReady && settings.authenticated ? (SP_JSX.jsx(DFL.DialogButton, { style: { ...fullButtonStyle, marginTop: "12px" }, onClick: () => setSetupDetailsOpen((open) => !open), children: SP_JSX.jsx("span", { style: { justifyContent: "center", textAlign: "center" }, children: setupDetailsOpen ? t.hideDetails : t.showDetails }) })) : null, settingsReady && (!settings.authenticated || setupDetailsOpen) ? (SP_JSX.jsxs("div", { style: { marginTop: "12px" }, children: [SP_JSX.jsx("div", { style: { fontSize: "0.72em", fontWeight: 800, marginBottom: "8px" }, children: t.setupGuide }), SP_JSX.jsx("ol", { style: { margin: 0, padding: "0 0 0 20px", fontSize: "0.71em", lineHeight: 1.45 }, children: t.setupSteps.map((step, index) => (SP_JSX.jsxs("li", { style: { marginBottom: "10px", opacity: 0.82 }, children: [SP_JSX.jsx("span", { children: step }), index === 0 ? (SP_JSX.jsx("div", { style: { marginTop: "7px" }, children: SP_JSX.jsx(DFL.DialogButton, { style: fullButtonStyle, onClick: () => void openSpotifyDashboard(), children: SP_JSX.jsxs("span", { children: [SP_JSX.jsx(FaExternalLinkAlt, {}), " ", t.openDashboard] }) }) })) : null, index === 2 ? setupValueField(t.appNameLabel, t.appNameValue, t.copyAppName, t.appNameCopied) : null, index === 3 ? setupValueField(t.appDescriptionLabel, t.appDescriptionValue, t.copyAppDescription, t.appDescriptionCopied, true) : null, index === 4 ? (SP_JSX.jsx("div", { style: { marginTop: "6px", padding: "7px 8px", borderRadius: "7px", background: "rgba(255,255,255,0.045)", fontSize: "0.96em", opacity: 0.78 }, children: t.websiteOptional })) : null, index === 5 ? setupValueField(t.redirectUri, settings.redirectUri, t.copyRedirectUri, t.redirectCopied) : null, index === 6 ? (SP_JSX.jsx("div", { style: { marginTop: "6px", padding: "7px 8px", borderRadius: "7px", background: "rgba(29,185,84,0.10)", border: "1px solid rgba(29,185,84,0.2)", fontSize: "0.96em", fontWeight: 700 }, children: t.webApiOnly })) : null, index === 7 ? (SP_JSX.jsx("div", { style: { marginTop: "6px", padding: "7px 8px", borderRadius: "7px", background: "rgba(255,255,255,0.045)", fontSize: "0.96em", opacity: 0.78 }, children: t.developerTerms })) : null] }, `${index}-${step}`))) }), SP_JSX.jsx("label", { style: { display: "block", fontSize: "0.68em", opacity: 0.58, marginBottom: "4px" }, children: t.clientId }), SP_JSX.jsx("input", { type: "text", value: clientId, spellCheck: false, autoComplete: "off", onChange: (event) => setClientId(event.currentTarget.value), onFocus: (event) => event.currentTarget.select(), style: {
                                    width: "100%",
                                    boxSizing: "border-box",
                                    padding: "9px 10px",
                                    borderRadius: "7px",
                                    background: "rgba(0,0,0,0.28)",
                                    border: "1px solid rgba(255,255,255,0.12)",
                                    color: "inherit",
                                    fontFamily: "monospace",
                                    fontSize: "0.72em",
                                    userSelect: "text",
                                    WebkitUserSelect: "text",
                                    cursor: "text",
                                } }), SP_JSX.jsx("div", { style: { height: "6px" } }), SP_JSX.jsx(DFL.DialogButton, { style: fullButtonStyle, disabled: busy || !clientId.trim(), onClick: () => void saveClientId(), children: SP_JSX.jsx("span", { children: t.saveClientId }) }), SP_JSX.jsx("div", { style: { height: "8px" } }), settings.authenticated ? (SP_JSX.jsx(DFL.DialogButton, { style: fullButtonStyle, disabled: busy, onClick: () => void disconnect(), children: SP_JSX.jsxs("span", { children: [SP_JSX.jsx(FaSignOutAlt, {}), " ", t.disconnect] }) })) : (SP_JSX.jsx(DFL.DialogButton, { className: "npSpotifyConnectButton", style: { ...fullButtonStyle, background: SPOTIFY_GREEN, color: "#fff" }, disabled: busy || !clientId.trim(), onClick: () => void connect(), children: SP_JSX.jsxs("span", { style: { fontWeight: 800 }, children: [SP_JSX.jsx(SiSpotify, {}), " ", t.connect] }) })), authState === "waiting" || statusText ? (SP_JSX.jsx("div", { style: { marginTop: "8px", fontSize: "0.7em", opacity: authState === "error" ? 1 : 0.68, color: authState === "error" ? "#ff7777" : "inherit" }, children: statusText })) : null, SP_JSX.jsx("p", { style: { margin: "10px 0 0", fontSize: "0.67em", lineHeight: 1.42, opacity: 0.54 }, children: t.premiumNote })] })) : null, SP_JSX.jsxs("div", { style: { marginTop: "12px", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.08)" }, children: [SP_JSX.jsx("p", { style: { margin: "0 2px 9px", fontSize: "0.67em", lineHeight: 1.42, opacity: 0.56 }, children: t.cacheExplanation }), SP_JSX.jsx(DFL.DialogButton, { style: fullButtonStyle, disabled: refreshBusy, onClick: () => {
                                    setRefreshBusy(true);
                                    void refreshSpotifyCache().finally(() => setRefreshBusy(false));
                                }, children: SP_JSX.jsxs("span", { children: [SP_JSX.jsx(FaSyncAlt, { className: refreshBusy ? "npRestartSpin" : undefined }), " ", t.refresh] }) }), SP_JSX.jsx("div", { style: { height: "12px" } }), SP_JSX.jsx("div", { style: { fontSize: "0.76em", fontWeight: 700, marginBottom: "7px" }, children: t.audioQuality }), SP_JSX.jsx(DFL.Focusable, { style: { display: "flex", flexDirection: "column", gap: "6px", width: "100%" }, "flow-children": "vertical", children: [96, 160, 320].map((quality) => {
                                    const active = (settings.audioQuality ?? 320) === quality;
                                    return (SP_JSX.jsx(DFL.DialogButton, { disabled: busy, style: {
                                            ...fullButtonStyle,
                                            minWidth: "100%",
                                            maxWidth: "100%",
                                            background: active ? "rgba(29,185,84,.72)" : undefined,
                                            color: "#fff",
                                        }, onClick: () => void setAudioQuality(quality), children: SP_JSX.jsxs("span", { style: { justifyContent: "center", textAlign: "center", width: "100%" }, children: [quality, " kbps"] }) }, quality));
                                }) }), SP_JSX.jsx("p", { style: { margin: "7px 2px 10px", fontSize: "0.67em", lineHeight: 1.4, opacity: 0.56 }, children: t.musicCacheDescription }), SP_JSX.jsx(DFL.DialogButton, { style: fullButtonStyle, disabled: audioCacheBusy, onClick: () => void clearAudioCache(), children: SP_JSX.jsxs("span", { children: [SP_JSX.jsx(FaTimes, {}), " ", audioCacheBusy ? t.clearingMusicCache : t.clearMusicCache] }) }), SP_JSX.jsx(DFL.DialogButton, { style: { ...fullButtonStyle, marginTop: "8px", opacity: settings.compactSavedTracks !== false ? 1 : 0.66 }, disabled: busy, onClick: () => void toggleCompactSavedTracks(), children: SP_JSX.jsxs("span", { style: { width: "100%", display: "flex", alignItems: "center", padding: "0 10px", boxSizing: "border-box", gap: "8px" }, children: [SP_JSX.jsx(FaList, {}), SP_JSX.jsx("span", { children: t.compactSavedTracks }), SP_JSX.jsx("span", { style: { marginLeft: "auto", color: settings.compactSavedTracks !== false ? SPOTIFY_GREEN : "inherit" }, children: settings.compactSavedTracks !== false ? SP_JSX.jsx(FaCheck, {}) : null })] }) }), SP_JSX.jsx("p", { style: { margin: "7px 2px 10px", fontSize: "0.67em", lineHeight: 1.4, opacity: 0.56 }, children: t.compactSavedTracksDescription }), SP_JSX.jsxs("div", { style: { marginTop: "12px", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.08)" }, children: [SP_JSX.jsx("div", { style: { fontSize: "0.76em", fontWeight: 700, marginBottom: "5px" }, children: t.artistCacheTitle }), SP_JSX.jsx("p", { style: { margin: "0 2px 9px", fontSize: "0.67em", lineHeight: 1.42, opacity: 0.56 }, children: t.artistCacheDescription }), SP_JSX.jsx(DFL.DialogButton, { style: { ...fullButtonStyle, opacity: settings.authenticated ? 1 : .5 }, disabled: !settings.authenticated || artistCacheBusy, onClick: () => void createArtistCache(), children: SP_JSX.jsxs("span", { children: [SP_JSX.jsx(FaSyncAlt, { className: artistCacheBusy && artistCacheProgress.phase !== "clearing" ? "npRestartSpin" : undefined }), " ", artistCacheBusy && artistCacheProgress.phase !== "clearing" ? t.artistCacheBuilding : t.createArtistCache] }) }), SP_JSX.jsx(DFL.DialogButton, { style: { ...fullButtonStyle, marginTop: "6px", opacity: artistCacheStats.files > 0 ? 1 : .58 }, disabled: artistCacheBusy || artistCacheStats.files <= 0, onClick: () => void clearArtistCache(), children: SP_JSX.jsxs("span", { children: [SP_JSX.jsx(FaTimes, {}), " ", artistCacheProgress.phase === "clearing" ? t.artistCacheClearing : t.clearArtistCache] }) }), SP_JSX.jsx(DFL.DialogButton, { style: { ...fullButtonStyle, marginTop: "6px", opacity: Number(artistCacheStats.manualFiles || 0) > 0 ? 1 : .58 }, disabled: artistCacheBusy || Number(artistCacheStats.manualFiles || 0) <= 0, onClick: () => void clearManualBackgrounds(), children: SP_JSX.jsxs("span", { children: [SP_JSX.jsx(FaTimes, {}), " ", artistCacheProgress.phase === "clearing_manual" ? t.manualBackgroundsRemoving : t.removeManualBackgrounds] }) }), SP_JSX.jsx("p", { style: { margin: "7px 2px 0", fontSize: "0.65em", lineHeight: 1.4, opacity: 0.52 }, children: t.manualBackgroundsDescription }), (artistCacheBusy || ["complete", "cleared", "manual_cleared", "error"].includes(artistCacheProgress.phase)) ? (SP_JSX.jsxs("div", { style: { marginTop: "9px", padding: "8px 9px", borderRadius: 7, background: "rgba(255,255,255,.045)", overflow: "hidden" }, children: [SP_JSX.jsx("div", { style: { fontSize: "0.67em", lineHeight: 1.35, opacity: artistCacheProgress.phase === "error" ? 1 : .68, color: artistCacheProgress.phase === "error" ? "#ff7777" : "inherit", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: artistCacheProgress.phase === "error"
                                                    ? localizeRuntimeMessage(artistCacheProgress.error || t.requestFailed)
                                                    : artistCacheProgress.phase === "cleared"
                                                        ? t.artistCacheCleared
                                                        : artistCacheProgress.phase === "manual_cleared"
                                                            ? t.manualBackgroundsRemoved
                                                            : artistCacheProgress.current
                                                                ? `${artistCacheProgress.phase === "clearing" ? t.artistCacheClearing : artistCacheProgress.phase === "clearing_manual" ? t.manualBackgroundsRemoving : t.artistCacheProgress}: ${artistCacheProgress.current}`
                                                                : `${artistCacheProgress.phase === "clearing" ? t.artistCacheClearing : artistCacheProgress.phase === "clearing_manual" ? t.manualBackgroundsRemoving : t.artistCacheProgress}: ${artistCacheProgress.completed}/${artistCacheProgress.total}` }), SP_JSX.jsx("div", { style: { height: "4px", marginTop: "6px", borderRadius: 999, overflow: "hidden", background: "rgba(255,255,255,.1)" }, children: SP_JSX.jsx("div", { style: { width: `${artistCacheProgress.total > 0 ? Math.min(100, (artistCacheProgress.completed / artistCacheProgress.total) * 100) : (artistCacheBusy ? 18 : 100)}%`, height: "100%", background: SPOTIFY_GREEN, transition: "width 180ms ease" } }) })] })) : null, SP_JSX.jsxs("div", { style: { marginTop: 7, padding: "7px 9px", borderRadius: 7, background: "rgba(255,255,255,.035)", display: "grid", gap: 5, fontSize: ".66em" }, children: [SP_JSX.jsxs("div", { style: { display: "flex", justifyContent: "space-between", gap: 8 }, children: [SP_JSX.jsx("span", { style: { opacity: .58 }, children: t.cacheSize }), SP_JSX.jsxs("strong", { children: [(Math.max(0, Number(artistCacheStats.bytes || 0)) / (1024 * 1024)).toFixed(2), " MB"] })] }), SP_JSX.jsxs("div", { style: { display: "flex", justifyContent: "space-between", gap: 8 }, children: [SP_JSX.jsx("span", { style: { opacity: .58 }, children: t.manualBackgrounds }), SP_JSX.jsxs("strong", { children: [(Math.max(0, Number(artistCacheStats.manualBytes || 0)) / (1024 * 1024)).toFixed(2), " MB"] })] })] })] })] })] })] }));
}
const spotifyLibrarySessionCache = new Map();
function clearSpotifyLibrarySessionCaches() {
    spotifyLibrarySessionCache.clear();
}
function SpotifyBrowserContent({ openAlbumRequest, onOpenBigPicture, onOpenSettings }) {
    const t = useSpotifyTranslations();
    const [tab, setTab] = SP_REACT.useState("home");
    const [home, setHome] = SP_REACT.useState(null);
    const [searchTerm, setSearchTerm] = SP_REACT.useState("");
    const [searchResults, setSearchResults] = SP_REACT.useState(null);
    const [librarySection, setLibrarySection] = SP_REACT.useState("tracks");
    const [library, setLibrary] = SP_REACT.useState(null);
    const [detail, setDetail] = SP_REACT.useState(null);
    const [detailHistory, setDetailHistory] = SP_REACT.useState([]);
    const [detailData, setDetailData] = SP_REACT.useState(null);
    const [showAllArtistAlbums, setShowAllArtistAlbums] = SP_REACT.useState(false);
    const [loading, setLoading] = SP_REACT.useState(false);
    const [rateLimitStatus, setRateLimitStatus] = SP_REACT.useState({ active: false, remainingSeconds: 0, until: 0 });
    const [settingsReady, setSettingsReady] = SP_REACT.useState(false);
    const [compactSavedTracks, setCompactSavedTracks] = SP_REACT.useState(true);
    const requestSerial = SP_REACT.useRef(0);
    const browserRootRef = SP_REACT.useRef(null);
    const firstTrackRef = SP_REACT.useRef(null);
    const firstResultRef = SP_REACT.useRef(null);
    const pendingFocusKeyRef = SP_REACT.useRef("");
    const pendingListFocusRef = SP_REACT.useRef(false);
    const lastExternalAlbumNonceRef = SP_REACT.useRef(0);
    const requestListFocus = SP_REACT.useCallback(() => {
        // Keep focus on the control the user activated.
    }, []);
    const run = SP_REACT.useCallback(async (work, onSuccess) => {
        const serial = requestSerial.current + 1;
        requestSerial.current = serial;
        setLoading(true);
        try {
            const result = await work();
            if (serial !== requestSerial.current)
                return;
            if (!result?.ok)
                throw new Error(result?.error || t.requestFailed);
            onSuccess(result.data);
        }
        catch (error) {
            if (serial === requestSerial.current) {
                const message = error?.message ?? String(error);
                if (isSpotifyRateLimitMessage(message)) {
                    void getSpotifyApiStatus().then(setRateLimitStatus).catch(() => { });
                }
                else {
                    showError$1(message);
                }
            }
        }
        finally {
            if (serial === requestSerial.current)
                setLoading(false);
        }
    }, [t.requestFailed]);
    const requestDetail = SP_REACT.useCallback((next) => {
        setDetail(next);
        setDetailData(null);
        setShowAllArtistAlbums(false);
        void run(() => spotifyGetDetail(next.kind, next.id), setDetailData);
    }, [run]);
    const loadHome = SP_REACT.useCallback(() => {
        void run(() => spotifyGetHome(), setHome);
    }, [run]);
    const loadLibrary = SP_REACT.useCallback((section, focusItems = true, force = false) => {
        if (focusItems)
            requestListFocus();
        setLibrarySection(section);
        setDetail(null);
        setDetailHistory([]);
        setShowAllArtistAlbums(false);
        const cached = spotifyLibrarySessionCache.get(section);
        if (!force && cached) {
            setLibrary(cached);
            setLoading(false);
            return;
        }
        void run(() => spotifyGetLibrary(section, 0, section === "tracks" ? 50 : 100), (value) => {
            spotifyLibrarySessionCache.set(section, value);
            setLibrary(value);
        });
    }, [requestListFocus, run]);
    const executeSearch = SP_REACT.useCallback(() => {
        const query = searchTerm.trim();
        if (query.length < 2 || loading)
            return;
        setDetail(null);
        setDetailHistory([]);
        setShowAllArtistAlbums(false);
        requestListFocus();
        void run(() => spotifySearch(query), setSearchResults);
    }, [loading, requestListFocus, run, searchTerm]);
    SP_REACT.useEffect(() => {
        let cancelled = false;
        void getSpotifySettings().then((value) => {
            if (cancelled)
                return;
            setCompactSavedTracks(value.compactSavedTracks !== false);
            setSettingsReady(true);
        }).catch(() => {
            if (!cancelled)
                setSettingsReady(true);
        });
        return () => { cancelled = true; };
    }, []);
    SP_REACT.useEffect(() => {
        if (!settingsReady)
            return;
        loadHome();
    }, [loadHome, settingsReady]);
    SP_REACT.useEffect(() => {
        if (!settingsReady) {
            setRateLimitStatus({ active: false, remainingSeconds: 0, until: 0 });
            return;
        }
        let cancelled = false;
        const refreshRateLimit = async () => {
            try {
                const status = await getSpotifyApiStatus();
                if (!cancelled)
                    setRateLimitStatus(status);
            }
            catch {
                // Local status lookup only; keep the previous value on a transient Decky call failure.
            }
        };
        void refreshRateLimit();
        const timer = window.setInterval(() => void refreshRateLimit(), 1000);
        return () => {
            cancelled = true;
            window.clearInterval(timer);
        };
    }, [settingsReady]);
    SP_REACT.useEffect(() => {
        if (!openAlbumRequest?.id || openAlbumRequest.nonce === lastExternalAlbumNonceRef.current)
            return;
        lastExternalAlbumNonceRef.current = openAlbumRequest.nonce;
        setDetailHistory([]);
        requestDetail({ kind: "album", id: openAlbumRequest.id, title: openAlbumRequest.title || t.album });
    }, [openAlbumRequest?.id, openAlbumRequest?.nonce, openAlbumRequest?.title, requestDetail, t.album]);
    const navigateBack = SP_REACT.useCallback((event) => {
        if (!detail)
            return false;
        event?.preventDefault?.();
        event?.stopPropagation?.();
        const previous = detailHistory[detailHistory.length - 1];
        if (previous) {
            setDetailHistory((history) => history.slice(0, -1));
            requestDetail(previous);
        }
        else {
            requestSerial.current += 1;
            setLoading(false);
            setDetail(null);
            setDetailData(null);
            setShowAllArtistAlbums(false);
            pendingFocusKeyRef.current = "";
            requestListFocus();
        }
        return true;
    }, [detail, detailHistory, requestDetail, requestListFocus]);
    SP_REACT.useEffect(() => {
        if (!detail)
            return;
        const onKeyDown = (event) => {
            if (event.key !== "Escape")
                return;
            navigateBack(event);
        };
        document.addEventListener("keydown", onKeyDown, true);
        return () => document.removeEventListener("keydown", onKeyDown, true);
    }, [detail, navigateBack]);
    async function play(uri, contextUri = "", offsetUri = "") {
        if (rateLimitStatus.active) {
            toaster.toast({ title: "Spotify API", body: formatSpotifyText(t.apiPausedDetail, { time: formatCountdown(rateLimitStatus.remainingSeconds) }), duration: 5000 });
            return;
        }
        localAudioPlayer.stop();
        try {
            const result = await spotifyPlay(uri, contextUri, offsetUri);
            if (!result.ok)
                throw new Error(result.error || t.unableStartPlayback);
            notifySpotifyPlaybackChanged();
        }
        catch (error) {
            showError$1(error?.message ?? String(error));
        }
    }
    async function playTrackList(entries, startIndex = 0) {
        if (rateLimitStatus.active) {
            toaster.toast({ title: "Spotify API", body: formatSpotifyText(t.apiPausedDetail, { time: formatCountdown(rateLimitStatus.remainingSeconds) }), duration: 5000 });
            return;
        }
        localAudioPlayer.stop();
        const uris = entries
            .map(normalizeTrack$1)
            .map((track) => String(track?.uri ?? ""))
            .filter((uri) => uri.startsWith("spotify:track:") || uri.startsWith("spotify:episode:"));
        if (!uris.length)
            return;
        try {
            const result = await spotifyPlayItems(uris, Math.max(0, Math.min(startIndex, uris.length - 1)));
            if (!result.ok)
                throw new Error(result.error || t.unableStartPlayback);
            notifySpotifyPlaybackChanged();
        }
        catch (error) {
            showError$1(error?.message ?? String(error));
        }
    }
    function toDetail(item) {
        const type = itemType$1(item);
        if (type !== "album" && type !== "playlist" && type !== "artist")
            return null;
        const id = String(item?.id ?? "");
        if (!id)
            return null;
        return { kind: type, id, title: String(item?.name ?? type) };
    }
    function openDetail(item) {
        const next = toDetail(item);
        if (!next)
            return;
        if (detail)
            setDetailHistory((history) => [...history, detail]);
        else
            setDetailHistory([]);
        requestDetail(next);
    }
    function activateItem(item) {
        const type = itemType$1(item);
        if (type === "track") {
            void play(String(item?.uri ?? ""));
        }
        else if (type === "album" || type === "playlist" || type === "artist") {
            openDetail(item);
        }
    }
    function renderTrackRows(entries, contextUri = "", albumImage = "", playAsList = false, focusFirst = false, focusRef = firstTrackRef) {
        const playableEntries = entries.filter((entry) => Boolean(normalizeTrack$1(entry)?.uri));
        return playableEntries.map((entry, index) => {
            const track = normalizeTrack$1(entry);
            const art = imageUrl(track) || albumImage;
            return (SP_JSX.jsx(SpotifyRow, { item: track, buttonRef: focusFirst && index === 0 ? focusRef : undefined, preferredFocus: focusFirst && index === 0 && pendingListFocusRef.current, leadingImage: art, subtitle: artistText$1(track), onActivate: () => {
                    if (playAsList)
                        void playTrackList(playableEntries, index);
                    else
                        void play(String(track.uri), contextUri, String(track.uri));
                } }, `${track.id ?? track.uri}-${index}`));
        });
    }
    const homePlaylists = SP_REACT.useMemo(() => home?.playlists?.items ?? [], [home]);
    function tabButton(key, label, icon) {
        const selected = tab === key && !detail;
        return (SP_JSX.jsx(DFL.DialogButton, { style: { flex: 1, minWidth: 0, height: "32px", minHeight: "32px", padding: 0, opacity: selected ? 1 : 0.58 }, onClick: () => {
                requestSerial.current += 1;
                requestListFocus();
                setDetail(null);
                setDetailData(null);
                setDetailHistory([]);
                setShowAllArtistAlbums(false);
                setTab(key);
                if (key === "home" && !home)
                    loadHome();
                if (key === "library" && !library)
                    loadLibrary(librarySection);
            }, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", fontSize: "0.72em" }, children: [icon, label] }) }));
    }
    function renderDetail() {
        if (!detail)
            return null;
        const payload = detailData;
        const item = payload?.item;
        const kind = detail.kind;
        const contextUri = String(item?.uri ?? `spotify:${kind}:${detail.id}`);
        const art = imageUrl(item);
        const trackEntries = payload?.tracks?.items ?? [];
        const popularTracks = payload?.topTracks?.tracks ?? [];
        const albums = payload?.albums?.items ?? [];
        const visibleAlbums = showAllArtistAlbums ? albums : albums.slice(0, 8);
        const primaryArtist = Array.isArray(item?.artists) ? item.artists.find((artist) => artist?.id) : null;
        return (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(DFL.DialogButton, { style: fullButtonStyle, onClick: (event) => navigateBack(event), children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "7px", justifyContent: "center", fontSize: "0.8em" }, children: [SP_JSX.jsx(FaArrowLeft, {}), " ", t.back] }) }), SP_JSX.jsx("div", { style: { height: "10px" } }), SP_JSX.jsxs("div", { style: {
                        display: "flex",
                        gap: "10px",
                        padding: "10px",
                        borderRadius: "10px",
                        background: "linear-gradient(145deg, rgba(29,185,84,0.18), rgba(0,0,0,0.24))",
                        border: "1px solid rgba(29,185,84,0.25)",
                    }, children: [SP_JSX.jsx(SpotifyArtwork, { url: art, size: 72, round: kind === "artist" }), SP_JSX.jsxs("div", { style: { minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }, children: [SP_JSX.jsx("span", { style: { fontSize: "0.68em", opacity: 0.55, textTransform: "uppercase", fontWeight: 800 }, children: kind === "artist" ? t.artist : kind === "album" ? t.album : t.playlist }), SP_JSX.jsx("strong", { style: { fontSize: "1em", lineHeight: 1.16, marginTop: "4px" }, children: String(item?.name ?? detail.title) }), SP_JSX.jsx("span", { style: { fontSize: "0.7em", opacity: 0.62, marginTop: "4px" }, children: kind === "artist" ? t.artist : artistText$1(item) })] })] }), SP_JSX.jsx("div", { style: { height: "8px" } }), SP_JSX.jsx(DFL.DialogButton, { style: { ...fullButtonStyle, background: SPOTIFY_GREEN, color: "#fff" }, onClick: () => void play(contextUri), children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontWeight: 800, fontSize: "0.8em" }, children: [SP_JSX.jsx(FaPlay, {}), " ", t.play] }) }), kind === "album" && primaryArtist ? (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx("div", { style: { height: "6px" } }), SP_JSX.jsx(DFL.DialogButton, { style: fullButtonStyle, onClick: () => openDetail(primaryArtist), children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.8em", fontWeight: 700 }, children: [SP_JSX.jsx(FaUser, {}), " ", t.artist] }) })] })) : null, kind === "artist" ? (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx("div", { style: sectionLabelStyle, children: t.popularTracks }), popularTracks.length ? renderTrackRows(popularTracks, "", art, true, true) : !loading ? (SP_JSX.jsx("div", { style: { fontSize: "0.74em", opacity: 0.58, padding: "8px" }, children: t.noTracks })) : null, SP_JSX.jsx("div", { style: sectionLabelStyle, children: t.albumsAndSingles }), visibleAlbums.length ? visibleAlbums.map((album, index) => (SP_JSX.jsx(SpotifyRow, { item: album, onActivate: () => openDetail(album) }, `${album.id}-${index}`))) : !loading ? SP_JSX.jsx("div", { style: { fontSize: "0.74em", opacity: 0.58, padding: "8px" }, children: t.noAlbums }) : null, albums.length > 8 ? (SP_JSX.jsx(DFL.DialogButton, { style: fullButtonStyle, onClick: () => setShowAllArtistAlbums((value) => !value), children: SP_JSX.jsx("span", { style: { fontSize: "0.78em", fontWeight: 700 }, children: showAllArtistAlbums ? t.showLess : t.seeAll }) })) : null] })) : (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx("div", { style: sectionLabelStyle, children: t.tracks }), trackEntries.length ? renderTrackRows(trackEntries, contextUri, art, false, true) : !loading ? (SP_JSX.jsx("div", { style: { fontSize: "0.72em", lineHeight: 1.4, opacity: 0.58, padding: "8px" }, children: payload?.limited ? t.limitedPlaylist : t.noTracks })) : null] }))] }));
    }
    function renderHome() {
        return (SP_JSX.jsx(SP_JSX.Fragment, { children: homePlaylists.length ? (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx("div", { style: sectionLabelStyle, children: t.yourPlaylists }), homePlaylists.map((item, index) => (SP_JSX.jsx(SpotifyRow, { item: item, buttonRef: index === 0 ? firstResultRef : undefined, preferredFocus: index === 0 && pendingListFocusRef.current, onActivate: () => activateItem(item), sideAction: { icon: SP_JSX.jsx(FaPlay, { size: 12 }), label: t.play, onActivate: () => void play(String(item?.uri ?? "")) } }, `${item.id}-${index}`)))] })) : null }));
    }
    function renderSearch() {
        const tracks = (searchResults?.tracks?.items ?? []).slice(0, 10);
        const albums = (searchResults?.albums?.items ?? []).slice(0, 10);
        const artists = (searchResults?.artists?.items ?? []).slice(0, 10);
        const playlists = (searchResults?.playlists?.items ?? []).slice(0, 10);
        const firstCategory = artists.length ? "artists" : albums.length ? "albums" : tracks.length ? "tracks" : playlists.length ? "playlists" : "";
        return (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx("div", { style: { height: "8px" } }), SP_JSX.jsx(DFL.TextField, { label: t.searchSpotify, value: searchTerm, onChange: (value) => setSearchTerm(typeof value === "string" ? value : String(value?.target?.value ?? "")), onKeyDown: (event) => {
                        if (event?.key === "Enter" || event?.keyCode === 13) {
                            event?.preventDefault?.();
                            executeSearch();
                        }
                    } }), SP_JSX.jsx("div", { style: { height: "6px" } }), SP_JSX.jsx(DFL.DialogButton, { style: { ...fullButtonStyle, background: SPOTIFY_GREEN, color: "#fff" }, disabled: loading || searchTerm.trim().length < 2, onClick: executeSearch, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontWeight: 800, fontSize: "0.8em" }, children: [SP_JSX.jsx(FaSearch, {}), " ", t.search] }) }), artists.length ? SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx("div", { style: sectionLabelStyle, children: t.artists }), artists.map((item, index) => SP_JSX.jsx(SpotifyRow, { item: item, buttonRef: firstCategory === "artists" && index === 0 ? firstResultRef : undefined, preferredFocus: firstCategory === "artists" && index === 0 && pendingListFocusRef.current, roundImage: true, onActivate: () => openDetail(item) }, `${item.id}-${index}`))] }) : null, albums.length ? SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx("div", { style: sectionLabelStyle, children: t.albums }), albums.map((item, index) => SP_JSX.jsx(SpotifyRow, { item: item, buttonRef: firstCategory === "albums" && index === 0 ? firstResultRef : undefined, preferredFocus: firstCategory === "albums" && index === 0 && pendingListFocusRef.current, onActivate: () => openDetail(item) }, `${item.id}-${index}`))] }) : null, tracks.length ? SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx("div", { style: sectionLabelStyle, children: t.tracks }), renderTrackRows(tracks, "", "", false, firstCategory === "tracks", firstResultRef)] }) : null, playlists.length ? SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx("div", { style: sectionLabelStyle, children: t.playlists }), playlists.filter(Boolean).map((item, index) => SP_JSX.jsx(SpotifyRow, { item: item, buttonRef: firstCategory === "playlists" && index === 0 ? firstResultRef : undefined, preferredFocus: firstCategory === "playlists" && index === 0 && pendingListFocusRef.current, onActivate: () => openDetail(item), sideAction: { icon: SP_JSX.jsx(FaPlay, { size: 12 }), label: t.play, onActivate: () => void play(String(item?.uri ?? "")) } }, `${item.id}-${index}`))] }) : null, searchResults && !tracks.length && !albums.length && !artists.length && !playlists.length && !loading ? (SP_JSX.jsx("div", { style: { fontSize: "0.74em", opacity: 0.58, padding: "14px 8px", textAlign: "center" }, children: t.noResults })) : null] }));
    }
    function renderLibrary() {
        const sectionIcons = {
            tracks: SP_JSX.jsx(FaMusic, {}),
            albums: SP_JSX.jsx(FaCompactDisc, {}),
            playlists: SP_JSX.jsx(FaList, {}),
            artists: SP_JSX.jsx(FaUser, {}),
        };
        const sectionLabels = {
            tracks: t.savedTracks,
            albums: t.savedAlbums,
            playlists: t.playlists,
            artists: t.followedArtists,
        };
        const items = librarySection === "artists"
            ? (library?.artists?.items ?? [])
            : (library?.items ?? []);
        return (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx("div", { style: { height: "8px" } }), SP_JSX.jsx(DFL.Focusable, { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", width: "100%" }, "flow-children": "grid", children: ["tracks", "albums", "playlists", "artists"].map((section) => (SP_JSX.jsx(DFL.DialogButton, { style: { ...fullButtonStyle, minWidth: 0, opacity: librarySection === section ? 1 : 0.58 }, onClick: () => loadLibrary(section, false), children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.74em", textTransform: "capitalize" }, children: [sectionIcons[section], " ", sectionLabels[section]] }) }, section))) }), SP_JSX.jsx("div", { style: sectionLabelStyle, children: sectionLabels[librarySection] }), librarySection === "tracks" && items.length ? (SP_JSX.jsxs(DFL.Focusable, { "flow-children": "horizontal", style: { display: "flex", gap: "6px", marginBottom: "7px" }, children: [SP_JSX.jsx(DFL.DialogButton, { style: { ...fullButtonStyle, flex: 1, minWidth: 0, background: SPOTIFY_GREEN, color: "#050505" }, onClick: () => void playTrackList(items.slice(0, 50), 0), children: SP_JSX.jsxs("span", { style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontWeight: 800, fontSize: "0.8em" }, children: [SP_JSX.jsx(FaPlay, {}), " ", t.play] }) }), SP_JSX.jsx(DFL.DialogButton, { style: { ...fullButtonStyle, flex: 1, minWidth: 0 }, onClick: () => { const shuffled = [...items.slice(0, 50)].sort(() => Math.random() - .5); void playTrackList(shuffled, 0); }, children: SP_JSX.jsxs("span", { style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontWeight: 700, fontSize: "0.8em" }, children: [SP_JSX.jsx(FaRandom, {}), " ", t.shuffle] }) })] })) : null, librarySection === "tracks" && compactSavedTracks ? (SP_JSX.jsxs("div", { style: { ...settingsCardStyle, marginTop: "8px", padding: "10px", fontSize: "0.7em", lineHeight: 1.42, opacity: 0.82 }, children: [SP_JSX.jsx("div", { children: t.compactSavedTracksCard }), onOpenSettings ? SP_JSX.jsx(DFL.DialogButton, { style: { ...fullButtonStyle, marginTop: "8px" }, onClick: onOpenSettings, children: SP_JSX.jsx("span", { style: { fontSize: "0.82em" }, children: t.changeInSettings }) }) : null] })) : null, librarySection === "tracks" ? (compactSavedTracks ? null : renderTrackRows(items.slice(0, 50), "", "", true, true, firstResultRef)) : items.map((entry, index) => {
                    const item = librarySection === "albums" ? normalizeAlbum(entry) : entry;
                    return (SP_JSX.jsx(SpotifyRow, { item: item, buttonRef: index === 0 ? firstResultRef : undefined, preferredFocus: index === 0 && pendingListFocusRef.current, roundImage: librarySection === "artists", onActivate: () => activateItem(item), sideAction: librarySection === "playlists" ? { icon: SP_JSX.jsx(FaPlay, { size: 12 }), label: t.play, onActivate: () => void play(String(item?.uri ?? "")) } : undefined }, `${item?.id ?? index}-${index}`));
                }), !items.length && !loading ? SP_JSX.jsx("div", { style: { fontSize: "0.74em", opacity: 0.58, padding: "12px 8px", textAlign: "center" }, children: t.nothingHere }) : null] }));
    }
    return (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx("style", { children: `
        .npSpotifyBrowser button:focus,
        .npSpotifyBrowser button.gpfocus {
          box-shadow: 0 0 0 1px rgba(29,185,84,0.55), 0 0 18px rgba(29,185,84,0.2) !important;
        }
        .npSpotifyBrowser input:focus {
          border-color: ${SPOTIFY_GREEN} !important;
        }
        .npSpotifyResultButton {
          scroll-margin-top: 64px;
        }
        .npSpotifyNavDock {
          position: sticky;
          top: -1px;
          z-index: 4;
          width: calc(100% + 8px);
          box-sizing: border-box;
          margin: -2px -4px 0;
          padding: 6px 4px 8px;
          background: transparent;
        }
        .npSpotifyBigPictureButton,
        .npSpotifyBigPictureButton:hover,
        .npSpotifyBigPictureButton:focus,
        .npSpotifyBigPictureButton.gpfocus,
        .npSpotifyBigPictureButton * {
          color: #fff !important;
        }
      ` }), SP_JSX.jsxs(DFL.Focusable, { ref: browserRootRef, className: "npSpotifyBrowser", "flow-children": "vertical", onCancel: detail ? navigateBack : undefined, onCancelButton: detail ? navigateBack : undefined, style: { width: "100%", boxSizing: "border-box" }, children: [SP_JSX.jsx("div", { "aria-hidden": "true", style: {
                            height: "2px",
                            margin: "2px 4px 4px",
                            borderRadius: "999px",
                            background: "linear-gradient(90deg, transparent, rgba(29,185,84,0.62), transparent)",
                            boxShadow: "0 0 14px rgba(29,185,84,0.24)",
                        } }), !detail ? (SP_JSX.jsxs("div", { className: "npSpotifyNavDock", children: [onOpenBigPicture ? (SP_JSX.jsx(DFL.DialogButton, { className: "npSpotifyBigPictureButton", style: {
                                    ...fullButtonStyle,
                                    marginBottom: "6px",
                                    border: "1px solid rgba(255,255,255,0.075)",
                                    background: "rgba(255,255,255,0.025)",
                                }, onClick: onOpenBigPicture, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "0.76em", fontWeight: 430, letterSpacing: "0.012em", color: "#fff" }, children: [SP_JSX.jsx(FaTv, { size: 12 }), " ", t.spotifyBigPicture] }) })) : null, rateLimitStatus.active ? (SP_JSX.jsx(DFL.DialogButton, { style: {
                                    ...fullButtonStyle,
                                    minHeight: "28px",
                                    margin: "-2px 0 6px",
                                    background: "transparent",
                                    opacity: 0.78,
                                }, onClick: () => toaster.toast({
                                    title: "Spotify API",
                                    body: formatSpotifyText(t.apiPausedDetail, { time: formatCountdown(rateLimitStatus.remainingSeconds) }),
                                    duration: 5000,
                                }), children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.68em", fontWeight: 500, color: "rgba(255,215,125,0.95)" }, children: [SP_JSX.jsx(FaClock, { size: 10 }), " ", formatSpotifyText(t.apiPaused, { time: formatCountdown(rateLimitStatus.remainingSeconds) })] }) })) : null, SP_JSX.jsxs(DFL.Focusable, { style: { display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "6px", width: "100%" }, "flow-children": "grid", children: [tabButton("home", t.home, SP_JSX.jsx(FaHome, {})), tabButton("search", t.search, SP_JSX.jsx(FaSearch, {})), SP_JSX.jsx("div", { style: { gridColumn: "1 / -1", minWidth: 0 }, children: tabButton("library", t.library, SP_JSX.jsx(FaList, {})) })] })] })) : null, loading ? (SP_JSX.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", padding: "10px", fontSize: "0.72em", opacity: 0.62 }, children: [SP_JSX.jsx(FaClock, {}), " ", t.loadingSpotify] })) : null, detail ? renderDetail() : tab === "home" ? renderHome() : tab === "search" ? renderSearch() : renderLibrary()] })] }));
}
function formatTrackDuration(value) {
    const totalSeconds = Math.max(0, Math.floor(Number(value || 0) / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
function releaseYear(item) {
    const value = String(item?.release_date ?? "").trim();
    const match = value.match(/^\d{4}/);
    return match?.[0] ?? "";
}
function spotifyDirectionFromKey(key) {
    if (key === "ArrowLeft" || key === "Left")
        return -1;
    if (key === "ArrowRight" || key === "Right")
        return 1;
    return 0;
}
function spotifyDirectionFromGamepadButton(button) {
    if (button === DFL.GamepadButton.DIR_LEFT)
        return -1;
    if (button === DFL.GamepadButton.DIR_RIGHT)
        return 1;
    return 0;
}
function spotifyGridDirectionFromKey(key) {
    if (key === "ArrowLeft" || key === "Left")
        return -1;
    if (key === "ArrowRight" || key === "Right")
        return 1;
    if (key === "ArrowUp" || key === "Up")
        return -6;
    if (key === "ArrowDown" || key === "Down")
        return 6;
    return 0;
}
function spotifyGridDirectionFromGamepad(button) {
    if (button === DFL.GamepadButton.DIR_LEFT)
        return -1;
    if (button === DFL.GamepadButton.DIR_RIGHT)
        return 1;
    if (button === DFL.GamepadButton.DIR_UP)
        return -6;
    if (button === DFL.GamepadButton.DIR_DOWN)
        return 6;
    return 0;
}
const spotifyGridFocusMoveState = new WeakMap();
function stopSpotifyDirectionalEvent(event) {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    event?.stopImmediatePropagation?.();
    event?.nativeEvent?.stopImmediatePropagation?.();
}
function moveSpotifySixColumnGridFocus(event, delta) {
    if (!delta)
        return false;
    const eventTarget = event?.target;
    const activeTarget = typeof document !== "undefined" ? document.activeElement : null;
    const current = eventTarget?.closest?.("[data-np-grid-index]")
        ?? activeTarget?.closest?.("[data-np-grid-index]");
    const grid = current?.closest?.("[data-np-six-grid]");
    if (!current || !grid)
        return false;
    const currentIndex = Number(current.getAttribute("data-np-grid-index"));
    if (!Number.isFinite(currentIndex))
        return false;
    const column = currentIndex % 6;
    if ((delta === -1 && column === 0) || (delta === 1 && column === 5))
        return false;
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    const previousMove = spotifyGridFocusMoveState.get(grid);
    if (previousMove && previousMove.delta === delta && now - previousMove.at < 220) {
        stopSpotifyDirectionalEvent(event);
        return true;
    }
    const next = grid.querySelector(`[data-np-grid-index="${currentIndex + delta}"]`);
    if (!next)
        return false;
    spotifyGridFocusMoveState.set(grid, { at: now, delta });
    stopSpotifyDirectionalEvent(event);
    next.scrollIntoView?.({ block: "nearest", inline: "nearest" });
    next.focus?.({ preventScroll: true });
    return true;
}
function SpotifyTvCard({ item, onActivate, round = false, preferredFocus = false, buttonRef, focusKey, gridIndex, }) {
    const t = resolveSpotifyTranslations();
    const title = String(item?.name ?? t.untitled);
    const subtitle = itemType$1(item) === "album" && releaseYear(item)
        ? `${artistText$1(item)} · ${releaseYear(item)}`
        : artistText$1(item);
    return (SP_JSX.jsx(DFL.DialogButton, { ref: buttonRef, preferredFocus: preferredFocus, className: "npSpotifyTvCard", ...{
            "data-np-focus-key": focusKey || undefined,
            "data-np-grid-index": Number.isFinite(gridIndex) ? gridIndex : undefined,
            onFocus: (event) => event?.currentTarget?.scrollIntoView?.({ block: "nearest", inline: "nearest", behavior: "smooth" }),
        }, onClick: onActivate, style: {
            width: "100%",
            minWidth: 0,
            height: "auto",
            minHeight: 0,
            padding: "10px",
            borderRadius: "12px",
            overflow: "hidden",
            textAlign: "left",
        }, children: SP_JSX.jsxs("span", { style: { display: "flex", flexDirection: "column", width: "100%", height: "100%", minWidth: 0 }, children: [SP_JSX.jsx("span", { style: {
                        width: "100%",
                        aspectRatio: "1 / 1",
                        borderRadius: round ? "50%" : "8px",
                        overflow: "hidden",
                        background: "rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 18px 42px rgba(0,0,0,0.3)",
                    }, children: imageUrl(item) ? (SP_JSX.jsx("img", { src: imageUrl(item), style: { width: "100%", height: "100%", objectFit: "cover" } })) : (SP_JSX.jsx(FaMusic, { size: 42, style: { opacity: 0.45 } })) }), SP_JSX.jsx("strong", { style: { marginTop: "12px", fontSize: "16px", lineHeight: 1.15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 650 }, children: title }), SP_JSX.jsx("span", { style: { marginTop: "5px", fontSize: "13px", opacity: 0.58, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: subtitle })] }) }));
}
function SpotifyTvTrack({ track, index, onActivate, preferredFocus = false, buttonRef, showArtwork = true, }) {
    const normalized = normalizeTrack$1(track);
    return (SP_JSX.jsx(DFL.DialogButton, { ref: buttonRef, preferredFocus: preferredFocus, className: "npSpotifyTvTrack", ...{ onFocus: (event) => event?.currentTarget?.scrollIntoView?.({ block: "nearest", inline: "nearest", behavior: "smooth" }) }, onClick: onActivate, style: {
            width: "100%",
            minWidth: "100%",
            height: "66px",
            minHeight: "66px",
            padding: "0 16px",
            borderRadius: "10px",
            marginBottom: "6px",
            textAlign: "left",
        }, children: SP_JSX.jsxs("span", { style: {
                display: "grid",
                gridTemplateColumns: showArtwork ? "32px 48px minmax(0,1fr) auto" : "32px minmax(0,1fr) auto",
                alignItems: "center",
                gap: showArtwork ? "13px" : "16px",
                width: "100%",
            }, children: [SP_JSX.jsx("span", { style: { opacity: 0.45, fontVariantNumeric: "tabular-nums", textAlign: "right" }, children: index + 1 }), showArtwork ? SP_JSX.jsx(SpotifyArtwork, { url: imageUrl(normalized), size: 44 }) : null, SP_JSX.jsxs("span", { style: { minWidth: 0 }, children: [SP_JSX.jsx("strong", { style: { display: "block", fontSize: "16px", fontWeight: 620, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: String(normalized?.name ?? "") }), SP_JSX.jsx("span", { style: { display: "block", marginTop: "4px", opacity: 0.56, fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: artistText$1(normalized) })] }), SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "14px", opacity: 0.62 }, children: [normalized?.duration_ms ? SP_JSX.jsx("span", { style: { fontVariantNumeric: "tabular-nums", fontSize: "13px" }, children: formatTrackDuration(normalized.duration_ms) }) : null, SP_JSX.jsx(FaPlay, { size: 13 })] })] }) }));
}
function SpotifyBigPicture({ onExit, onOpenVisualizer, onOpenSettings }) {
    const t = useSpotifyTranslations();
    const coreT = SP_REACT.useMemo(() => getTranslations("core"), []);
    const [tab, setTab] = SP_REACT.useState("home");
    const [librarySection, setLibrarySection] = SP_REACT.useState("tracks");
    const [history, setHistory] = SP_REACT.useState([]);
    const [detail, setDetail] = SP_REACT.useState(null);
    const [detailData, setDetailData] = SP_REACT.useState(null);
    const [home, setHome] = SP_REACT.useState(null);
    const [library, setLibrary] = SP_REACT.useState(null);
    const [searchTerm, setSearchTerm] = SP_REACT.useState("");
    const [searchResults, setSearchResults] = SP_REACT.useState(null);
    const [loading, setLoading] = SP_REACT.useState(false);
    const [snapshot, setSnapshot] = SP_REACT.useState(() => {
        const player = getSharedSpotifyPlaybackSnapshot();
        return { selectedPlayer: player?.id ?? "", currentPlayer: player?.id ?? "", selected: player, players: player ? [player] : [] };
    });
    const [snapshotAt, setSnapshotAt] = SP_REACT.useState(Date.now());
    const [coverUrl, setCoverUrl] = SP_REACT.useState("");
    const [appVolume, setAppVolume$1] = SP_REACT.useState(100);
    const [volumeReady, setVolumeReady] = SP_REACT.useState(false);
    const [rateLimitStatus, setRateLimitStatus] = SP_REACT.useState({ active: false, remainingSeconds: 0, until: 0 });
    const [settingsReady, setSettingsReady] = SP_REACT.useState(false);
    const [compactSavedTracks, setCompactSavedTracks] = SP_REACT.useState(true);
    const [showAllDetail, setShowAllDetail] = SP_REACT.useState(false);
    const [restoreFocusKey, setRestoreFocusKey] = SP_REACT.useState("");
    const [backgroundSettingsOpen, setBackgroundSettingsOpen] = SP_REACT.useState(false);
    const requestSerial = SP_REACT.useRef(0);
    const firstContentRef = SP_REACT.useRef(null);
    const playerCoverRef = SP_REACT.useRef(null);
    const scrollRef = SP_REACT.useRef(null);
    const snapshotBusyRef = SP_REACT.useRef(false);
    const coverRequestRef = SP_REACT.useRef(0);
    const coverClearTimerRef = SP_REACT.useRef(0);
    const volumeTimerRef = SP_REACT.useRef(0);
    const volumeValueRef = SP_REACT.useRef(100);
    const volumeInteractionAtRef = SP_REACT.useRef(0);
    const volumeCommitInFlightRef = SP_REACT.useRef(false);
    const volumeCommitQueuedRef = SP_REACT.useRef(false);
    const volumeCommitRetryRef = SP_REACT.useRef(0);
    const volumeObservedRef = SP_REACT.useRef({ value: -1, count: 0 });
    const pendingRestoreFocusKeyRef = SP_REACT.useRef("");
    const restoreFocusTimersRef = SP_REACT.useRef([]);
    const restoringTabRef = SP_REACT.useRef(null);
    const restoringTabUntilRef = SP_REACT.useRef(0);
    const spotifyPlaybackCacheRef = SP_REACT.useRef({ at: 0, player: null, lastValidAt: 0 });
    const rateLimitActiveRef = SP_REACT.useRef(false);
    const current = SP_REACT.useMemo(() => snapshot.selected ?? snapshot.players?.[0] ?? null, [snapshot]);
    const hasCurrent = Boolean(current?.title);
    const mediaKey = `${current?.id ?? ""}|${current?.title ?? ""}|${current?.artist ?? ""}|${current?.album ?? ""}`;
    const isPlaying = current?.status === "Playing";
    const durationMs = Math.max(0, Number(current?.length || 0));
    const basePositionMs = Math.max(0, Number(current?.position || 0));
    const stablePlayerArtwork = coverUrl || String(current?.artworkUrl ?? "");
    const albumGlowImage = detail?.kind === "artist"
        ? ""
        : detail?.kind === "album"
            ? imageUrl(detailData?.item)
            : (stablePlayerArtwork || imageUrl(home?.playlists?.items?.[0]));
    const artistBackgroundImage = detail?.kind === "artist" ? String(detailData?.backgroundImage ?? "") : "";
    const artistBackgroundFallback = detail?.kind === "artist" ? String(detailData?.backgroundFallbackImage ?? "") : "";
    const artistHeroImage = artistBackgroundImage || artistBackgroundFallback;
    const artistHeroIsFallback = Boolean(!artistBackgroundImage && artistBackgroundFallback);
    const refreshRateLimitStatus = SP_REACT.useCallback(async () => {
        try {
            const status = await getSpotifyApiStatus();
            rateLimitActiveRef.current = Boolean(status.active);
            setRateLimitStatus((previous) => (previous.active === status.active
                && previous.remainingSeconds === status.remainingSeconds
                && previous.until === status.until
                ? previous
                : status));
        }
        catch {
            // This is a local backend status call. Preserve the last value on failure.
        }
    }, []);
    const currentLocation = SP_REACT.useCallback(() => {
        const active = document.activeElement;
        const focusKey = active?.closest?.("[data-np-focus-key]")?.getAttribute("data-np-focus-key") ?? "";
        if (detail)
            return { kind: "detail", detail, focusKey };
        return { kind: "tab", tab, librarySection, focusKey };
    }, [detail, librarySection, tab]);
    const clearRestoreFocusTimers = SP_REACT.useCallback(() => {
        restoreFocusTimersRef.current.forEach((timer) => window.clearTimeout(timer));
        restoreFocusTimersRef.current = [];
    }, []);
    const restoreCardFocus = SP_REACT.useCallback((focusKey) => {
        const key = String(focusKey ?? "");
        clearRestoreFocusTimers();
        if (!key) {
            restoreFocusTimersRef.current = [window.setTimeout(() => firstContentRef.current?.focus?.(), 80)];
            return;
        }
        pendingRestoreFocusKeyRef.current = key;
        setRestoreFocusKey(key);
        const delays = [40, 120, 260, 520, 900, 1400];
        const attempt = () => {
            if (pendingRestoreFocusKeyRef.current !== key)
                return;
            const escaped = typeof CSS !== "undefined" && CSS.escape ? CSS.escape(key) : key.replace(/["\\]/g, "\\$&");
            const root = document.querySelector(".npSpotifyBig");
            const element = root?.querySelector(`[data-np-focus-key="${escaped}"]`) ?? document.querySelector(`[data-np-focus-key="${escaped}"]`);
            if (!element)
                return;
            element.scrollIntoView?.({ block: "nearest", inline: "nearest" });
            element.focus?.({ preventScroll: true });
            if (document.activeElement === element) {
                setRestoreFocusKey(key);
                restoringTabRef.current = null;
                restoringTabUntilRef.current = 0;
            }
        };
        restoreFocusTimersRef.current = delays.map((delay) => window.setTimeout(attempt, delay));
        restoreFocusTimersRef.current.push(window.setTimeout(() => {
            restoringTabRef.current = null;
            restoringTabUntilRef.current = 0;
        }, 1600));
    }, [clearRestoreFocusTimers]);
    const handleApiError = SP_REACT.useCallback((message) => {
        if (isSpotifyRateLimitMessage(message)) {
            void refreshRateLimitStatus();
            return;
        }
        showError$1(String(message ?? t.requestFailed));
    }, [refreshRateLimitStatus, t.requestFailed]);
    const run = SP_REACT.useCallback(async (work, onSuccess, minimumVisibleMs = 0) => {
        const serial = ++requestSerial.current;
        const startedAt = Date.now();
        setLoading(true);
        try {
            const result = await work();
            if (serial !== requestSerial.current)
                return;
            if (!result?.ok)
                throw new Error(result?.error || t.requestFailed);
            onSuccess(result.data);
        }
        catch (error) {
            if (serial === requestSerial.current)
                handleApiError(error?.message ?? String(error));
        }
        finally {
            const remaining = minimumVisibleMs - (Date.now() - startedAt);
            if (remaining > 0)
                await new Promise((resolve) => window.setTimeout(resolve, remaining));
            if (serial === requestSerial.current)
                setLoading(false);
        }
    }, [handleApiError, t.requestFailed]);
    const scrollPageTop = SP_REACT.useCallback(() => {
        scrollRef.current?.scrollTo?.({ top: 0, behavior: "smooth" });
    }, []);
    const focusFirst = SP_REACT.useCallback(() => {
        // Do not redirect focus away from tabs, category buttons, or the control used to navigate.
    }, []);
    const refreshSnapshot = SP_REACT.useCallback(async (force = false) => {
        if (snapshotBusyRef.current || rateLimitActiveRef.current)
            return;
        const now = Date.now();
        if (!force && now - spotifyPlaybackCacheRef.current.at < 3500)
            return;
        snapshotBusyRef.current = true;
        try {
            try {
                const result = await spotifyGetPlaybackState();
                const apiPlayer = result?.ok ? spotifyPlaybackToSnapshot(result.data) : null;
                const previous = spotifyPlaybackCacheRef.current;
                spotifyPlaybackCacheRef.current = apiPlayer
                    ? { at: now, player: apiPlayer, lastValidAt: now }
                    : { at: now, player: now - previous.lastValidAt <= 12000 ? previous.player : null, lastValidAt: previous.lastValidAt };
                if (apiPlayer) {
                    // Publish title, artwork, timing and controls as one complete payload.
                    // Between API polls the clock interpolates progress locally; the same
                    // stale API position is never re-published every few hundred ms.
                    publishSpotifyPlaybackSnapshot(apiPlayer);
                }
                else if (!spotifyPlaybackCacheRef.current.player) {
                    publishSpotifyPlaybackSnapshot(null);
                }
            }
            catch {
                // Preserve the latest complete Spotify API payload through a transient
                // Spotify Connect handoff or a short network failure.
            }
        }
        finally {
            snapshotBusyRef.current = false;
        }
    }, []);
    SP_REACT.useEffect(() => {
        const syncSharedPlayback = (event) => {
            const detail = event instanceof CustomEvent ? event.detail : undefined;
            const player = detail && typeof detail === "object" ? detail : getSharedSpotifyPlaybackSnapshot();
            const now = getSharedSpotifyPlaybackTimestamp() || Date.now();
            if (!player) {
                spotifyPlaybackCacheRef.current = { at: now, player: null, lastValidAt: spotifyPlaybackCacheRef.current.lastValidAt };
                setSnapshot({ selectedPlayer: "", currentPlayer: "", selected: null, players: [] });
                setSnapshotAt(now);
                return;
            }
            spotifyPlaybackCacheRef.current = { at: now, player, lastValidAt: now };
            setSnapshot({ selectedPlayer: player.id, currentPlayer: player.id, selected: player, players: [player] });
            setSnapshotAt(now);
        };
        window.addEventListener(SPOTIFY_PLAYBACK_CHANGED_EVENT, syncSharedPlayback);
        return () => window.removeEventListener(SPOTIFY_PLAYBACK_CHANGED_EVENT, syncSharedPlayback);
    }, []);
    const loadHome = SP_REACT.useCallback(() => {
        focusFirst();
        void run(() => spotifyGetHome(), setHome);
    }, [focusFirst, run]);
    const loadLibrary = SP_REACT.useCallback((section, force = false) => {
        setLibrarySection(section);
        focusFirst();
        const cached = spotifyLibrarySessionCache.get(section);
        if (!force && cached) {
            setLibrary(cached);
            setLoading(false);
            return;
        }
        void run(() => spotifyGetLibrary(section, 0, section === "tracks" ? 50 : 0), (value) => {
            spotifyLibrarySessionCache.set(section, value);
            setLibrary(value);
        });
    }, [focusFirst, run]);
    const requestDetail = SP_REACT.useCallback((next) => {
        setBackgroundSettingsOpen(false);
        setDetail(next);
        setDetailData(null);
        setShowAllDetail(false);
        focusFirst();
        void run(() => spotifyGetDetail(next.kind, next.id), setDetailData, 900);
    }, [focusFirst, run]);
    const openDetail = SP_REACT.useCallback((item, focusKey = "") => {
        const type = itemType$1(item);
        if (type !== "album" && type !== "playlist" && type !== "artist")
            return;
        const id = String(item?.id ?? "");
        if (!id)
            return;
        const location = currentLocation();
        setHistory((items) => [...items, focusKey ? { ...location, focusKey } : location]);
        requestDetail({ kind: type, id, title: String(item?.name ?? type) });
    }, [currentLocation, requestDetail]);
    const switchTab = SP_REACT.useCallback((next) => {
        // Ignore a stale Home selection only during the brief restore window after a
        // detail page. Deliberate tab changes remain available immediately.
        if (restoringTabRef.current && Date.now() < restoringTabUntilRef.current) {
            // Ignore only a transient Home request while the saved parent page is being
            // restored. Any deliberate change to another tab cancels the guard.
            if (next === "home" && restoringTabRef.current !== "home")
                return;
            if (next !== tab) {
                restoringTabRef.current = null;
                restoringTabUntilRef.current = 0;
            }
        }
        if (next === tab && !detail)
            return;
        clearRestoreFocusTimers();
        requestSerial.current += 1;
        setLoading(false);
        pendingRestoreFocusKeyRef.current = "";
        setRestoreFocusKey("");
        setDetail(null);
        setDetailData(null);
        setHistory([]);
        setTab(next);
        focusFirst();
        if (next === "home" && !home)
            loadHome();
        if (next === "library")
            loadLibrary(librarySection);
    }, [clearRestoreFocusTimers, detail, focusFirst, home, librarySection, loadHome, loadLibrary, tab]);
    const handleRootButtonDown = SP_REACT.useCallback((event) => {
        if (detail)
            return;
        const button = event?.detail?.button;
        if (button !== DFL.GamepadButton.BUMPER_LEFT && button !== DFL.GamepadButton.BUMPER_RIGHT)
            return;
        event?.preventDefault?.();
        event?.stopPropagation?.();
        const tabs = ["home", "search", "library", "settings"];
        const index = Math.max(0, tabs.indexOf(tab));
        const delta = button === DFL.GamepadButton.BUMPER_RIGHT ? 1 : -1;
        const next = tabs[(index + delta + tabs.length) % tabs.length];
        if (next === "settings")
            onOpenSettings?.();
        else
            switchTab(next);
        window.setTimeout(() => {
            const root = document.querySelector(".npSpotifyTvRoot");
            const content = root?.querySelector(".npSpotifyTabContent");
            if (content) {
                content.style.transform = "none";
                content.style.left = "0";
                content.style.width = "100%";
            }
            scrollRef.current?.scrollTo?.({ top: 0, left: 0, behavior: "auto" });
        }, 0);
    }, [detail, onOpenSettings, switchTab, tab]);
    const restoreLocation = SP_REACT.useCallback((location) => {
        requestSerial.current += 1;
        setLoading(false);
        if (location.kind === "detail") {
            requestDetail(location.detail);
            restoreCardFocus(location.focusKey);
            return;
        }
        restoringTabRef.current = location.tab;
        restoringTabUntilRef.current = Date.now() + 900;
        setDetail(null);
        setDetailData(null);
        setTab(location.tab);
        setLibrarySection(location.librarySection ?? "tracks");
        if (location.tab === "home" && !home)
            loadHome();
        if (location.tab === "library")
            loadLibrary(location.librarySection ?? "tracks");
        restoreCardFocus(location.focusKey);
    }, [home, library, loadHome, loadLibrary, requestDetail, restoreCardFocus]);
    const navigateBack = SP_REACT.useCallback((event) => {
        event?.preventDefault?.();
        event?.stopPropagation?.();
        if (backgroundSettingsOpen) {
            setBackgroundSettingsOpen(false);
            return true;
        }
        const previous = history[history.length - 1];
        if (previous) {
            setHistory((items) => items.slice(0, -1));
            restoreLocation(previous);
            return true;
        }
        onExit();
        return true;
    }, [backgroundSettingsOpen, history, onExit, restoreLocation]);
    SP_REACT.useEffect(() => {
        let cancelled = false;
        void getSpotifySettings().then((value) => {
            if (cancelled)
                return;
            setCompactSavedTracks(value.compactSavedTracks !== false);
            setSettingsReady(true);
        }).catch(() => {
            if (!cancelled)
                setSettingsReady(true);
        });
        return () => { cancelled = true; };
    }, []);
    SP_REACT.useEffect(() => {
        if (!settingsReady)
            return;
        loadHome();
    }, [loadHome, settingsReady]);
    SP_REACT.useEffect(() => () => clearRestoreFocusTimers(), [clearRestoreFocusTimers]);
    SP_REACT.useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key !== "Escape")
                return;
            navigateBack(event);
        };
        document.addEventListener("keydown", onKeyDown, true);
        return () => document.removeEventListener("keydown", onKeyDown, true);
    }, [navigateBack]);
    SP_REACT.useEffect(() => {
        rateLimitActiveRef.current = rateLimitStatus.active;
        if (rateLimitStatus.active) {
            const paused = spotifyPausedPlayer$1(t);
            setSnapshot({ selectedPlayer: paused.id, currentPlayer: paused.id, selected: paused, players: [paused] });
            setSnapshotAt(Date.now());
            publishSpotifyPlaybackSnapshot(paused);
            return;
        }
        spotifyPlaybackCacheRef.current = { ...spotifyPlaybackCacheRef.current, at: 0 };
        void refreshSnapshot(true);
    }, [rateLimitStatus.active, refreshSnapshot, t]);
    SP_REACT.useEffect(() => {
        void refreshSnapshot();
        const timer = window.setInterval(() => void refreshSnapshot(), 1000);
        return () => window.clearInterval(timer);
    }, [refreshSnapshot]);
    SP_REACT.useEffect(() => {
        void refreshRateLimitStatus();
        const timer = window.setInterval(() => void refreshRateLimitStatus(), 1000);
        return () => window.clearInterval(timer);
    }, [refreshRateLimitStatus]);
    SP_REACT.useEffect(() => {
        const requestId = ++coverRequestRef.current;
        if (!current?.title) {
            if (!coverClearTimerRef.current) {
                coverClearTimerRef.current = window.setTimeout(() => {
                    coverClearTimerRef.current = 0;
                    setCoverUrl("");
                }, 1200);
            }
            return;
        }
        if (coverClearTimerRef.current) {
            window.clearTimeout(coverClearTimerRef.current);
            coverClearTimerRef.current = 0;
        }
        let cancelled = false;
        const commitPreloadedCover = (url) => {
            if (!url || url === coverUrl)
                return;
            const image = new Image();
            image.onload = () => {
                if (!cancelled && requestId === coverRequestRef.current)
                    setCoverUrl(url);
            };
            image.src = url;
        };
        const immediateArtwork = String(current.artworkUrl ?? "");
        if (immediateArtwork) {
            commitPreloadedCover(immediateArtwork);
            return () => { cancelled = true; };
        }
        void getCoverForService("spotify", current.title ?? "", current.artist ?? "", current.album ?? "")
            .then((url) => {
            if (url)
                commitPreloadedCover(url);
        })
            .catch(() => { });
        return () => { cancelled = true; };
    }, [current?.artworkUrl, mediaKey]);
    SP_REACT.useEffect(() => () => {
        if (coverClearTimerRef.current)
            window.clearTimeout(coverClearTimerRef.current);
    }, []);
    SP_REACT.useEffect(() => {
        let cancelled = false;
        const timers = [];
        const saved = getSavedSourceVolume("spotify", 100);
        volumeValueRef.current = saved;
        setAppVolume$1(saved);
        setVolumeReady(false);
        const initialize = async () => {
            if (cancelled)
                return;
            try {
                const startedAt = Date.now();
                const result = await getAppVolume("spotify");
                if (cancelled || volumeInteractionAtRef.current > startedAt)
                    return;
                if (result?.ok) {
                    const actual = Math.max(0, Math.min(100, Number(result.volume ?? saved)));
                    volumeValueRef.current = actual;
                    setAppVolume$1(actual);
                    saveSourceVolume("spotify", actual, "observed");
                    setVolumeReady(true);
                    return;
                }
            }
            catch {
                // The background player may still be creating its Windows audio session.
            }
            try {
                const applied = await setAppVolume(volumeValueRef.current, "spotify");
                if (!cancelled)
                    setVolumeReady(Boolean(applied?.ok && !applied.stale));
            }
            catch {
                if (!cancelled)
                    setVolumeReady(false);
            }
        };
        [0, 1400, 4200].forEach((delay) => timers.push(window.setTimeout(() => void initialize(), delay)));
        const syncVolume = (event) => {
            const detail = event instanceof CustomEvent ? event.detail : null;
            if (detail?.source !== "spotify")
                return;
            const next = Math.max(0, Math.min(100, Number(detail.volume ?? saved)));
            if (detail.origin !== "observed")
                volumeInteractionAtRef.current = Date.now();
            volumeValueRef.current = next;
            volumeObservedRef.current = { value: next, count: 0 };
            setAppVolume$1(next);
            setVolumeReady(true);
        };
        window.addEventListener(SOURCE_VOLUME_CHANGED_EVENT, syncVolume);
        return () => {
            cancelled = true;
            timers.forEach((timer) => window.clearTimeout(timer));
            window.removeEventListener(SOURCE_VOLUME_CHANGED_EVENT, syncVolume);
        };
    }, []);
    SP_REACT.useEffect(() => {
        let cancelled = false;
        let reading = false;
        const refreshVolume = async () => {
            if (reading || volumeCommitInFlightRef.current || volumeTimerRef.current)
                return;
            if (Date.now() - volumeInteractionAtRef.current < 800)
                return;
            reading = true;
            const startedAt = Date.now();
            try {
                const result = await getAppVolume("spotify");
                if (cancelled || !result?.ok || volumeInteractionAtRef.current > startedAt)
                    return;
                const next = Math.max(0, Math.min(100, Number(result.volume ?? volumeValueRef.current)));
                const displayed = volumeValueRef.current;
                const differs = Math.abs(next - displayed) > 2;
                if (result.origin !== "spotify-connect" && differs && Date.now() - volumeInteractionAtRef.current < 15000) {
                    if (!volumeCommitInFlightRef.current && !volumeTimerRef.current) {
                        volumeCommitRetryRef.current = 0;
                        volumeTimerRef.current = window.setTimeout(() => {
                            volumeTimerRef.current = 0;
                            flushVolumeCommit();
                        }, 80);
                    }
                    return;
                }
                if (differs && result.origin !== "spotify-connect") {
                    const observed = volumeObservedRef.current;
                    volumeObservedRef.current = observed.value === next
                        ? { value: next, count: observed.count + 1 }
                        : { value: next, count: 1 };
                    if (volumeObservedRef.current.count < 2)
                        return;
                }
                else {
                    volumeObservedRef.current = { value: next, count: 0 };
                }
                volumeValueRef.current = next;
                setAppVolume$1(next);
                setVolumeReady(true);
                saveSourceVolume("spotify", next, "observed");
            }
            catch {
                if (!cancelled)
                    setVolumeReady(false);
            }
            finally {
                reading = false;
            }
        };
        const initialTimer = window.setTimeout(() => void refreshVolume(), 1600);
        const timer = window.setInterval(() => void refreshVolume(), 2500);
        return () => {
            cancelled = true;
            window.clearTimeout(initialTimer);
            window.clearInterval(timer);
        };
    }, []);
    SP_REACT.useEffect(() => {
        const onFocusIn = (event) => {
            const target = event.target;
            if (target?.closest?.(".npSpotifyCustomTab"))
                scrollPageTop();
        };
        document.addEventListener("focusin", onFocusIn, true);
        return () => document.removeEventListener("focusin", onFocusIn, true);
    }, [scrollPageTop]);
    async function executeSearch() {
        const query = searchTerm.trim();
        if (query.length < 2 || loading)
            return;
        focusFirst();
        void run(() => spotifySearch(query), setSearchResults);
    }
    async function play(uri, contextUri = "", offsetUri = "") {
        if (rateLimitStatus.active) {
            toaster.toast({ title: "Spotify API", body: formatSpotifyText(t.apiPausedDetail, { time: formatCountdown(rateLimitStatus.remainingSeconds) }), duration: 5000 });
            return;
        }
        localAudioPlayer.stop();
        spotifyPlaybackCacheRef.current = { ...spotifyPlaybackCacheRef.current, at: 0 };
        try {
            const result = await spotifyPlay(uri, contextUri, offsetUri);
            if (!result?.ok)
                throw new Error(result?.error || t.unableStartPlayback);
            notifySpotifyPlaybackChanged();
            [100, 380, 900].forEach((delay) => window.setTimeout(() => void refreshSnapshot(), delay));
        }
        catch (error) {
            handleApiError(error?.message ?? String(error));
        }
    }
    async function playTrackList(entries, startIndex = 0) {
        if (rateLimitStatus.active) {
            toaster.toast({ title: "Spotify API", body: formatSpotifyText(t.apiPausedDetail, { time: formatCountdown(rateLimitStatus.remainingSeconds) }), duration: 5000 });
            return;
        }
        localAudioPlayer.stop();
        const normalizedEntries = entries.map(normalizeTrack$1).filter(Boolean);
        spotifyPlaybackCacheRef.current = { ...spotifyPlaybackCacheRef.current, at: 0 };
        const uris = normalizedEntries
            .map((track) => String(track?.uri ?? ""))
            .filter((uri) => uri.startsWith("spotify:track:") || uri.startsWith("spotify:episode:"));
        if (!uris.length)
            return;
        try {
            const result = await spotifyPlayItems(uris, Math.max(0, Math.min(startIndex, uris.length - 1)));
            if (!result?.ok)
                throw new Error(result?.error || t.unableStartPlayback);
            notifySpotifyPlaybackChanged();
            [100, 380, 900].forEach((delay) => window.setTimeout(() => void refreshSnapshot(), delay));
        }
        catch (error) {
            handleApiError(error?.message ?? String(error));
        }
    }
    function patchSpotifyPlayer(update) {
        const cached = spotifyPlaybackCacheRef.current;
        if (cached.player)
            spotifyPlaybackCacheRef.current = { ...cached, player: update(cached.player) };
        setSnapshot((previous) => {
            const player = previous.selected ?? previous.players?.[0];
            if (!player)
                return previous;
            const next = update(player);
            return { selectedPlayer: next.id, currentPlayer: next.id, selected: next, players: [next] };
        });
        setSnapshotAt(Date.now());
        const player = spotifyPlaybackCacheRef.current.player;
        if (player)
            publishSpotifyPlaybackSnapshot(player);
    }
    function runSpotifyPlayerAction(action, optimistic) {
        optimistic?.();
        void action().then(() => {
            notifySpotifyPlaybackChanged();
            spotifyPlaybackCacheRef.current = { ...spotifyPlaybackCacheRef.current, at: 0 };
        }).catch(() => { });
        [140, 620, 1600].forEach((delay) => window.setTimeout(() => void refreshSnapshot(true), delay));
    }
    function changeVolume(value) {
        const next = Math.max(0, Math.min(100, Math.round(Number(value || 0))));
        volumeInteractionAtRef.current = Date.now();
        volumeValueRef.current = next;
        volumeObservedRef.current = { value: next, count: 0 };
        volumeCommitRetryRef.current = 0;
        setAppVolume$1(next);
        setVolumeReady(true);
        saveSourceVolume("spotify", next);
        if (volumeCommitInFlightRef.current) {
            volumeCommitQueuedRef.current = true;
            return;
        }
        if (volumeTimerRef.current)
            window.clearTimeout(volumeTimerRef.current);
        volumeTimerRef.current = window.setTimeout(() => {
            volumeTimerRef.current = 0;
            flushVolumeCommit();
        }, 45);
    }
    function flushVolumeCommit() {
        if (volumeCommitInFlightRef.current) {
            volumeCommitQueuedRef.current = true;
            return;
        }
        const requested = volumeValueRef.current;
        volumeCommitQueuedRef.current = false;
        volumeCommitInFlightRef.current = true;
        void setAppVolume(requested, "spotify")
            .then((result) => {
            if (!result?.ok) {
                setVolumeReady(false);
                return;
            }
            if (result.stale)
                return;
            setVolumeReady(true);
            if (volumeValueRef.current !== requested)
                return;
            const confirmed = Math.max(0, Math.min(100, Number(result.volume ?? requested)));
            if (Math.abs(confirmed - requested) <= 2) {
                volumeCommitRetryRef.current = 0;
                volumeValueRef.current = confirmed;
                setAppVolume$1(confirmed);
            }
            else if (volumeCommitRetryRef.current < 3) {
                volumeCommitRetryRef.current += 1;
                volumeCommitQueuedRef.current = true;
            }
        })
            .catch(() => setVolumeReady(false))
            .finally(() => {
            volumeCommitInFlightRef.current = false;
            if (volumeCommitQueuedRef.current || volumeValueRef.current !== requested) {
                volumeCommitQueuedRef.current = false;
                volumeTimerRef.current = window.setTimeout(() => {
                    volumeTimerRef.current = 0;
                    flushVolumeCommit();
                }, 80);
            }
        });
    }
    function nudgeVolume(delta) {
        changeVolume(volumeValueRef.current + delta);
    }
    function handleVolumeKeyDown(event) {
        const direction = spotifyDirectionFromKey(event.key);
        if (!direction)
            return;
        event.preventDefault();
        event.stopPropagation();
        nudgeVolume(direction);
    }
    function handleVolumeButtonDown(event) {
        const direction = spotifyDirectionFromGamepadButton(event?.detail?.button);
        if (!direction)
            return;
        event.preventDefault?.();
        event.stopPropagation?.();
        nudgeVolume(direction);
    }
    async function openCurrentAlbum() {
        if (!current?.title)
            return;
        try {
            const result = await spotifyGetCurrentAlbum(current.title ?? "", current.artist ?? "", current.album ?? "");
            if (!result?.ok)
                throw new Error(result?.error || t.requestFailed);
            const album = result.data?.album;
            if (album?.id)
                openDetail(album);
        }
        catch (error) {
            handleApiError(error?.message ?? String(error));
        }
    }
    const renderCardRow = (title, items, round = false, firstRow = false) => {
        if (!items.length)
            return null;
        return (SP_JSX.jsxs("section", { className: "npSpotifyTvShelf", style: { marginTop: "28px" }, children: [SP_JSX.jsx("h2", { style: { margin: "0 0 13px", fontSize: "25px", letterSpacing: "-0.02em", fontWeight: 650 }, children: title }), SP_JSX.jsx(DFL.Focusable, { className: "npSpotifyTvRow", "flow-children": "horizontal", style: { display: "grid", gridAutoFlow: "column", gridAutoColumns: "calc((100% - 60px) / 6)", gap: "12px", overflowX: "auto", overflowY: "hidden", width: "100%", padding: "8px 0 24px", scrollPaddingInline: "0px" }, children: items.slice(0, 20).map((item, index) => (SP_JSX.jsx(SpotifyTvCard, { item: normalizeAlbum(item), round: round, buttonRef: firstRow && index === 0 ? firstContentRef : undefined, focusKey: `shelf:${title}:${itemType$1(normalizeAlbum(item))}:${String(normalizeAlbum(item)?.id ?? index)}`, onActivate: () => openDetail(normalizeAlbum(item)) }, `${item?.id ?? index}-${index}`))) })] }));
    };
    function renderPlayerCard() {
        return (SP_JSX.jsxs(DFL.Focusable, { className: "npSpotifyNowPlayingCard", "flow-children": "grid", style: {
                position: "relative",
                display: "grid",
                gridTemplateColumns: "320px minmax(0, 1fr) minmax(330px, 24vw)",
                gap: "clamp(22px, 3vw, 44px)",
                alignItems: "stretch",
                width: "100%",
                minHeight: "368px",
                padding: "24px",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.09)",
                background: "linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.045) 48%, rgba(0,0,0,0.16))",
                backdropFilter: "blur(28px)",
                boxShadow: "0 24px 80px rgba(0,0,0,0.28)",
                overflow: "hidden",
            }, children: [stablePlayerArtwork ? (SP_JSX.jsx("div", { className: "npSpotifyPlayerGlow", "aria-hidden": "true", style: {
                        position: "absolute",
                        inset: "-40% -16% -70% -16%",
                        background: `url(${stablePlayerArtwork}) center/cover no-repeat`,
                        filter: "blur(110px) saturate(1.55)",
                        opacity: 0.34,
                        transform: "scale(1.1)",
                        pointerEvents: "none",
                    } })) : null, SP_JSX.jsx(DFL.DialogButton, { ref: playerCoverRef, className: "npSpotifyCoverButton", disabled: !current?.title || rateLimitStatus.active, ...{ onFocus: scrollPageTop }, onClick: () => { if (!rateLimitStatus.active)
                        void openCurrentAlbum(); }, style: {
                        position: "relative",
                        width: "320px",
                        minWidth: "320px",
                        height: "320px",
                        minHeight: "320px",
                        padding: 0,
                        borderRadius: "14px",
                        overflow: "hidden",
                        background: "rgba(255,255,255,0.06)",
                        boxShadow: "0 24px 70px rgba(0,0,0,0.42)",
                    }, children: stablePlayerArtwork ? (SP_JSX.jsx("img", { src: stablePlayerArtwork, style: { width: "100%", height: "100%", objectFit: "cover", display: "block" } })) : (SP_JSX.jsx("span", { style: { display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }, children: rateLimitStatus.active ? SP_JSX.jsx(FaClock, { size: 64, style: { opacity: 0.42 } }) : SP_JSX.jsx(FaMusic, { size: 64, style: { opacity: 0.3 } }) })) }), SP_JSX.jsx("div", { style: { position: "relative", minWidth: 0, alignSelf: "center" }, children: hasCurrent ? SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx("span", { style: { display: "block", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.14em", opacity: 0.58, fontWeight: 620 }, children: t.nowPlaying }), SP_JSX.jsx("h1", { style: { margin: "9px 0 0", fontSize: "clamp(38px, 4vw, 68px)", lineHeight: 1.08, letterSpacing: "-0.045em", fontWeight: 610, paddingBottom: "0.12em" }, children: String(current?.title ?? "") }), SP_JSX.jsx("div", { style: { marginTop: "12px", fontSize: "clamp(18px, 1.7vw, 27px)", opacity: 0.72, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: current?.artist }), rateLimitStatus.active ? SP_JSX.jsx("div", { style: { marginTop: "7px", fontSize: "16px", opacity: 0.58, fontVariantNumeric: "tabular-nums" }, children: formatCountdown(rateLimitStatus.remainingSeconds) }) : current?.album ? SP_JSX.jsx("div", { style: { marginTop: "7px", fontSize: "16px", opacity: 0.45, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: current.album }) : null, !rateLimitStatus.active ? SP_JSX.jsxs("div", { style: { marginTop: "28px" }, children: [SP_JSX.jsx("div", { style: { height: "5px", borderRadius: "999px", background: "rgba(255,255,255,0.16)", overflow: "hidden" }, children: SP_JSX.jsx(SmoothProgressFill, { position: basePositionMs, duration: durationMs, playing: isPlaying, sampledAt: snapshotAt, style: { height: "100%", background: "#fff", borderRadius: "999px" } }) }), SP_JSX.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "13px", opacity: 0.48, fontVariantNumeric: "tabular-nums" }, children: [SP_JSX.jsx(SmoothProgressTime, { position: basePositionMs, duration: durationMs, playing: isPlaying, sampledAt: snapshotAt, format: formatTrackDuration }), SP_JSX.jsx("span", { children: formatTrackDuration(durationMs) })] })] }) : null] }) : SP_JSX.jsx("h1", { style: { margin: 0, fontSize: "clamp(34px, 3.4vw, 58px)", lineHeight: 1.08, letterSpacing: "-0.04em", fontWeight: 610 }, children: t.noPlayback }) }), SP_JSX.jsx("div", { style: { position: "relative", minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }, children: SP_JSX.jsxs(DFL.Focusable, { "flow-children": "vertical", style: { display: "flex", flexDirection: "column", gap: "10px", alignItems: "stretch" }, children: [SP_JSX.jsxs(DFL.Focusable, { "flow-children": "horizontal", style: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px" }, children: [SP_JSX.jsx(DFL.DialogButton, { disabled: !hasCurrent || !current?.canPrevious, ...{ onFocus: scrollPageTop }, onClick: () => runSpotifyPlayerAction(() => spotifyPlayerCommand("previous")), style: { width: "100%", minWidth: 0, height: "58px", minHeight: "58px", padding: 0 }, children: SP_JSX.jsx(FaStepBackward, { size: 18 }) }), SP_JSX.jsx(DFL.DialogButton, { disabled: !hasCurrent || (!current?.canTogglePlayPause && !(current?.canPlay || current?.canPause)), ...{ onFocus: scrollPageTop }, onClick: () => runSpotifyPlayerAction(() => spotifyPlayerCommand(isPlaying ? "pause" : "play"), () => patchSpotifyPlayer((player) => ({ ...player, status: isPlaying ? "Paused" : "Playing" }))), style: { width: "100%", minWidth: 0, height: "58px", minHeight: "58px", padding: 0 }, children: isPlaying ? SP_JSX.jsx(FaPause, { size: 21 }) : SP_JSX.jsx(FaPlay, { size: 21 }) }), SP_JSX.jsx(DFL.DialogButton, { disabled: !hasCurrent || !current?.canNext, ...{ onFocus: scrollPageTop }, onClick: () => runSpotifyPlayerAction(() => spotifyPlayerCommand("next")), style: { width: "100%", minWidth: 0, height: "58px", minHeight: "58px", padding: 0 }, children: SP_JSX.jsx(FaStepForward, { size: 18 }) })] }), SP_JSX.jsxs(DFL.Focusable, { "flow-children": "horizontal", style: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" }, children: [SP_JSX.jsxs(DFL.DialogButton, { disabled: !hasCurrent || !current?.canShuffle, "aria-label": t.shuffle, onClick: () => runSpotifyPlayerAction(() => spotifyPlayerCommand("shuffle", current?.shuffleActive ? 0 : 1), () => patchSpotifyPlayer((player) => ({ ...player, shuffleActive: !player.shuffleActive }))), style: { position: "relative", width: "100%", minWidth: 0, height: "46px", minHeight: "46px", padding: 0, opacity: current?.shuffleActive ? 1 : .62 }, children: [SP_JSX.jsx(FaRandom, { size: 16 }), current?.shuffleActive ? SP_JSX.jsx("span", { "aria-hidden": "true", style: { position: "absolute", top: 7, right: 8, width: 6, height: 6, borderRadius: 999, background: SPOTIFY_GREEN, boxShadow: `0 0 8px ${SPOTIFY_GREEN}` } }) : null] }), SP_JSX.jsxs(DFL.DialogButton, { disabled: !hasCurrent || !current?.canRepeat, "aria-label": t.repeat, onClick: () => runSpotifyPlayerAction(() => spotifyPlayerCommand("repeat", current?.repeatMode === "Off" ? 1 : current?.repeatMode === "List" ? 2 : 0), () => patchSpotifyPlayer((player) => ({ ...player, repeatMode: player.repeatMode === "Off" ? "List" : player.repeatMode === "List" ? "Track" : "Off" }))), style: { position: "relative", width: "100%", minWidth: 0, height: "46px", minHeight: "46px", padding: 0, opacity: current?.repeatMode && !["None", "Off"].includes(current.repeatMode) ? 1 : .62 }, children: [SP_JSX.jsx(FaRedoAlt, { size: 16 }), current?.repeatMode && !["None", "Off"].includes(current.repeatMode) ? SP_JSX.jsx("span", { "aria-hidden": "true", style: { position: "absolute", top: 7, right: 8, width: 6, height: 6, borderRadius: 999, background: SPOTIFY_GREEN, boxShadow: `0 0 8px ${SPOTIFY_GREEN}` } }) : null] })] }), onOpenVisualizer ? (SP_JSX.jsx(DFL.DialogButton, { className: "npSpotifyBigPictureButton", disabled: rateLimitStatus.active, "aria-label": t.fullscreen, ...{ onFocus: scrollPageTop }, onClick: onOpenVisualizer, style: { width: "100%", minWidth: 0, height: "46px", minHeight: "46px", border: "1px solid rgba(255,255,255,0.075)", background: "rgba(255,255,255,0.025)" }, children: SP_JSX.jsxs("span", { style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: ".82em", fontWeight: 430 }, children: [SP_JSX.jsx(FaExpandArrowsAlt, { size: 13 }), " ", t.fullscreen] }) })) : null, SP_JSX.jsxs(DFL.Focusable, { className: "npSpotifyAppVolume", focusClassName: "npSpotifyAppVolumeFocused", noFocusRing: true, onActivate: () => undefined, onButtonDown: handleVolumeButtonDown, onKeyDown: handleVolumeKeyDown, role: "slider", tabIndex: 0, ...{ focusable: true }, "aria-label": t.volume, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": Math.round(appVolume), style: { gridColumn: "1 / -1", opacity: volumeReady && !rateLimitStatus.active ? 1 : 0.46 }, children: [SP_JSX.jsx("span", { children: t.volume }), SP_JSX.jsx("input", { type: "range", value: Math.round(appVolume), min: 0, max: 100, step: 1, disabled: !volumeReady || rateLimitStatus.active, tabIndex: -1, onChange: (event) => changeVolume(Number(event.currentTarget.value)) }), SP_JSX.jsxs("strong", { children: [Math.round(appVolume), "%"] })] })] }) })] }));
    }
    function renderHomeTv() {
        const playlists = (home?.playlists?.items ?? []).filter(Boolean);
        return (SP_JSX.jsxs(SP_JSX.Fragment, { children: [renderPlayerCard(), renderCardRow(t.yourPlaylists, playlists), renderCardRow(t.newForYou, (home?.newForYou?.items ?? []).map(normalizeAlbum).filter(Boolean))] }));
    }
    function renderSearchTv() {
        const tracks = (searchResults?.tracks?.items ?? []).slice(0, 10);
        const albums = (searchResults?.albums?.items ?? []).slice(0, 10);
        const artists = (searchResults?.artists?.items ?? []).slice(0, 10);
        const playlists = (searchResults?.playlists?.items ?? []).filter(Boolean).slice(0, 10);
        const firstType = artists.length ? "artist" : albums.length ? "album" : tracks.length ? "track" : playlists.length ? "playlist" : "input";
        return (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsxs("div", { style: { width: "100%" }, onFocusCapture: scrollPageTop, children: [SP_JSX.jsx(DFL.TextField, { label: t.searchSpotify, value: searchTerm, style: { width: "100%", minWidth: "100%" }, onChange: (value) => setSearchTerm(typeof value === "string" ? value : String(value?.target?.value ?? "")), onKeyDown: (event) => {
                                if (event?.key === "Enter" || event?.keyCode === 13) {
                                    event?.preventDefault?.();
                                    void executeSearch();
                                }
                            } }), SP_JSX.jsx(DFL.DialogButton, { ref: firstType === "input" ? firstContentRef : undefined, style: { width: "180px", minWidth: "180px", height: "46px", marginTop: "10px" }, disabled: searchTerm.trim().length < 2 || loading, ...{ onFocus: scrollPageTop }, onClick: () => void executeSearch(), children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: 550 }, children: [SP_JSX.jsx(FaSearch, {}), " ", t.search] }) })] }), renderCardRow(t.artists, artists, true, firstType === "artist"), renderCardRow(t.albums, albums, false, firstType === "album"), tracks.length ? (SP_JSX.jsxs("section", { style: { marginTop: "28px" }, children: [SP_JSX.jsx("h2", { style: { fontSize: "25px", marginBottom: "13px", fontWeight: 650 }, children: t.tracks }), SP_JSX.jsx(DFL.Focusable, { "flow-children": "vertical", children: tracks.map((track, index) => (SP_JSX.jsx(SpotifyTvTrack, { track: track, index: index, onActivate: () => void playTrackList(tracks, index) }, `${track?.id ?? index}-${index}`))) })] })) : null, renderCardRow(t.playlists, playlists, false, firstType === "playlist"), searchResults && !tracks.length && !albums.length && !artists.length && !playlists.length && !loading ? (SP_JSX.jsx("div", { style: { marginTop: "38px", fontSize: "19px", opacity: 0.55 }, children: t.noResults })) : null] }));
    }
    function switchLibrarySection(next) {
        if (librarySection === next && library) {
            focusFirst();
            return;
        }
        loadLibrary(next);
    }
    function renderLibraryTv() {
        const labels = {
            tracks: t.savedTracks,
            albums: t.albums,
            playlists: t.playlists,
            artists: t.artists,
        };
        const entries = librarySection === "artists" ? (library?.artists?.items ?? []) : (library?.items ?? []);
        const visible = entries;
        return (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(DFL.Focusable, { "flow-children": "horizontal", style: { display: "flex", gap: "9px", marginTop: "4px" }, children: ["tracks", "albums", "playlists", "artists"].map((section) => (SP_JSX.jsx(DFL.DialogButton, { ...{ onFocus: scrollPageTop }, onClick: () => switchLibrarySection(section), style: { width: "166px", minWidth: "166px", height: "44px", borderRadius: "999px", opacity: librarySection === section ? 1 : 0.58 }, children: SP_JSX.jsx("span", { style: { fontWeight: librarySection === section ? 650 : 500 }, children: labels[section] }) }, section))) }), SP_JSX.jsx("h2", { style: { margin: "26px 0 13px", fontSize: "27px", fontWeight: 650 }, children: labels[librarySection] }), librarySection === "tracks" ? (SP_JSX.jsxs(SP_JSX.Fragment, { children: [entries.length ? (SP_JSX.jsxs(DFL.Focusable, { "flow-children": "horizontal", style: { display: "flex", gap: "10px", marginBottom: "16px" }, children: [SP_JSX.jsx(DFL.DialogButton, { style: { width: "190px", minWidth: "190px", height: "46px" }, onClick: () => void playTrackList(entries.slice(0, 50), 0), children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: 550 }, children: [SP_JSX.jsx(FaPlay, {}), " ", t.play] }) }), SP_JSX.jsx(DFL.DialogButton, { style: { width: "190px", minWidth: "190px", height: "46px" }, onClick: () => { const shuffled = [...entries.slice(0, 50)].sort(() => Math.random() - .5); void playTrackList(shuffled, 0); }, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: 550 }, children: [SP_JSX.jsx(FaRandom, {}), " ", t.shuffle] }) })] })) : null, compactSavedTracks ? (SP_JSX.jsxs("div", { style: { width: "390px", maxWidth: "100%", padding: "18px", borderRadius: "14px", border: "1px solid rgba(29,185,84,.24)", background: "rgba(29,185,84,.08)", lineHeight: 1.48, opacity: .84 }, children: [SP_JSX.jsx("div", { children: t.compactSavedTracksCard }), onOpenSettings ? SP_JSX.jsx(DFL.DialogButton, { className: "npSpotifyBigPictureButton", style: { width: "100%", minWidth: "100%", height: "44px", marginTop: "12px", whiteSpace: "nowrap" }, onClick: onOpenSettings, children: SP_JSX.jsx("span", { style: { fontSize: ".82em", whiteSpace: "nowrap" }, children: t.changeInSettings }) }) : null] })) : (SP_JSX.jsx(DFL.Focusable, { "flow-children": "vertical", children: visible.slice(0, 50).map((track, index) => (SP_JSX.jsx(SpotifyTvTrack, { track: track, index: index, onActivate: () => void playTrackList(entries.slice(0, 50), index) }, `${normalizeTrack$1(track)?.id ?? index}-${index}`))) }))] })) : (SP_JSX.jsx(DFL.Focusable, { ...{ "data-np-six-grid": `spotify-library-${librarySection}` }, "flow-children": "grid", navEntryPreferPosition: restoreFocusKey ? DFL.NavEntryPositionPreferences.PREFERRED_CHILD : DFL.NavEntryPositionPreferences.MAINTAIN_X, onKeyDownCapture: (event) => moveSpotifySixColumnGridFocus(event, spotifyGridDirectionFromKey(event?.key)), onGamepadDirection: (event) => moveSpotifySixColumnGridFocus(event, spotifyGridDirectionFromGamepad(event?.detail?.button)), style: { display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: "14px", alignItems: "start" }, children: visible.map((entry, index) => {
                        const item = librarySection === "albums" ? normalizeAlbum(entry) : entry;
                        const focusKey = `library:${librarySection}:${itemType$1(item)}:${String(item?.id ?? index)}`;
                        return (SP_JSX.jsx(SpotifyTvCard, { item: item, round: librarySection === "artists", gridIndex: index, focusKey: focusKey, preferredFocus: restoreFocusKey === focusKey, onActivate: () => openDetail(item, focusKey) }, `${item?.id ?? index}-${index}`));
                    }) })), !entries.length && !loading ? SP_JSX.jsx("div", { style: { fontSize: "19px", opacity: 0.55 }, children: t.nothingHere }) : null] }));
    }
    const backButton = (overlay = false) => (SP_JSX.jsx(DFL.DialogButton, { className: "npSpotifyBackButton npSpotifyBigPictureButton", onClick: navigateBack, style: {
            position: overlay ? "absolute" : "relative",
            top: overlay ? "20px" : undefined,
            left: overlay ? "28px" : undefined,
            zIndex: 5,
            width: "108px",
            minWidth: "108px",
            height: "34px",
            minHeight: "34px",
            padding: 0,
            border: "1px solid rgba(255,255,255,0.075)",
            background: "rgba(255,255,255,0.035)",
        }, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.72em", fontWeight: 430, color: "#fff" }, children: [SP_JSX.jsx(FaArrowLeft, { size: 11 }), " ", t.back] }) }));
    function renderDetailTv() {
        if (!detail)
            return null;
        const item = detailData?.item;
        const tracks = detail.kind === "artist" ? (detailData?.topTracks?.tracks ?? []) : (detailData?.tracks?.items ?? []);
        const albums = detailData?.albums?.items ?? [];
        const visibleTracks = showAllDetail ? tracks : tracks.slice(0, 50);
        const contextUri = String(item?.uri ?? `spotify:${detail.kind}:${detail.id}`);
        const albumArtist = item?.artists?.[0];
        const albumYear = detail.kind === "album" ? releaseYear(item) : "";
        const isArtist = detail.kind === "artist";
        const isAlbum = detail.kind === "album";
        if (backgroundSettingsOpen && isArtist) {
            return SP_JSX.jsx(ArtistBackgroundPicker, { provider: "spotify", artistId: String(item?.id ?? detail.id ?? ""), artistName: String(item?.name ?? detail.title ?? ""), onBack: () => setBackgroundSettingsOpen(false), onApplied: (url) => setDetailData((currentData) => currentData ? { ...currentData, backgroundImage: url } : currentData) });
        }
        if (isArtist) {
            return (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsxs("section", { className: "npSpotifyArtistHero", style: {
                            position: "relative",
                            width: "100vw",
                            height: "min(56.25vw, 720px)",
                            minHeight: "430px",
                            margin: "-18px -56px 0",
                            overflow: "hidden",
                            background: "#090909",
                        }, children: [artistHeroImage ? (SP_JSX.jsx("img", { src: artistHeroImage, onError: () => {
                                    setDetailData((currentData) => currentData ? (currentData.backgroundImage
                                        ? { ...currentData, backgroundImage: "" }
                                        : { ...currentData, backgroundFallbackImage: "" }) : currentData);
                                }, style: {
                                    position: "absolute",
                                    inset: artistHeroIsFallback ? "-8%" : 0,
                                    width: artistHeroIsFallback ? "116%" : "100%",
                                    height: artistHeroIsFallback ? "116%" : "100%",
                                    objectFit: "cover",
                                    objectPosition: "center center",
                                    filter: artistHeroIsFallback ? "blur(30px) saturate(1.35) brightness(.72)" : "none",
                                    transform: artistHeroIsFallback ? "scale(1.06)" : "none",
                                } })) : null, SP_JSX.jsx("div", { "aria-hidden": "true", style: {
                                    position: "absolute",
                                    inset: 0,
                                    background: "linear-gradient(90deg, rgba(0,0,0,0.66) 0%, rgba(0,0,0,0.04) 62%, rgba(0,0,0,0.14) 100%), linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.08) 52%, rgba(0,0,0,0.72) 80%, #000 100%)",
                                } }), backButton(true), SP_JSX.jsxs("div", { style: { position: "absolute", left: "46px", right: "46px", bottom: "46px", zIndex: 2 }, children: [SP_JSX.jsx("h1", { style: { margin: 0, fontSize: "clamp(58px, 7vw, 102px)", lineHeight: 1, letterSpacing: "-0.052em", fontWeight: 610 }, children: String(item?.name ?? detail.title) }), SP_JSX.jsx(DFL.DialogButton, { ref: !tracks.length ? firstContentRef : undefined, style: { width: "156px", minWidth: "156px", height: "48px", marginTop: "22px" }, onClick: () => void play(contextUri), children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: 560 }, children: [SP_JSX.jsx(FaPlay, {}), " ", t.play] }) })] })] }), SP_JSX.jsxs("section", { style: { marginTop: "22px" }, children: [SP_JSX.jsx("h2", { style: { margin: "0 0 13px", fontSize: "27px", fontWeight: 650 }, children: t.popularTracks }), SP_JSX.jsx(DFL.Focusable, { "flow-children": "vertical", children: visibleTracks.map((track, index) => (SP_JSX.jsx(SpotifyTvTrack, { track: track, index: index, onActivate: () => void playTrackList(tracks, index) }, `${normalizeTrack$1(track)?.id ?? index}-${index}`))) }), !tracks.length && !loading ? SP_JSX.jsx("div", { style: { fontSize: "19px", opacity: 0.55 }, children: t.noTracks }) : null] }), albums.length ? renderCardRow(t.albumsAndSingles, albums) : null, SP_JSX.jsx(DFL.DialogButton, { className: "npSpotifyBigPictureButton", style: { width: "250px", minWidth: "250px", height: "48px", marginTop: "26px" }, onClick: () => setBackgroundSettingsOpen(true), children: SP_JSX.jsxs("span", { style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }, children: [SP_JSX.jsx(FaCog, {}), " ", coreT.artistBackgroundSettings] }) })] }));
        }
        return (SP_JSX.jsxs(SP_JSX.Fragment, { children: [backButton(false), SP_JSX.jsxs("div", { style: {
                        display: "grid",
                        gridTemplateColumns: "250px minmax(0,1fr)",
                        alignItems: "end",
                        gap: "32px",
                        marginTop: "20px",
                        minHeight: "250px",
                    }, children: [SP_JSX.jsx("div", { style: { width: "250px", height: "250px", borderRadius: "16px", overflow: "hidden", boxShadow: "0 30px 86px rgba(0,0,0,0.48)", background: "rgba(255,255,255,0.08)" }, children: imageUrl(item) ? SP_JSX.jsx("img", { src: imageUrl(item), style: { width: "100%", height: "100%", objectFit: "cover" } }) : SP_JSX.jsx(FaMusic, { size: 68, style: { margin: "91px", opacity: 0.4 } }) }), SP_JSX.jsxs("div", { style: { minWidth: 0, paddingBottom: "8px" }, children: [SP_JSX.jsx("div", { style: { textTransform: "uppercase", letterSpacing: "0.13em", fontSize: "12px", fontWeight: 650, opacity: 0.58 }, children: isAlbum ? t.album : t.playlist }), SP_JSX.jsx("h1", { style: { margin: "10px 0 0", fontSize: "56px", lineHeight: 1.02, letterSpacing: "-0.052em", fontWeight: 610 }, children: String(item?.name ?? detail.title) }), SP_JSX.jsxs("div", { style: { marginTop: "15px", fontSize: "17px", opacity: 0.64 }, children: [artistText$1(item), albumYear ? ` · ${albumYear}` : ""] }), SP_JSX.jsxs(DFL.Focusable, { "flow-children": "horizontal", style: { display: "flex", alignItems: "center", gap: "10px", marginTop: "22px" }, children: [SP_JSX.jsx(DFL.DialogButton, { ref: !tracks.length ? firstContentRef : undefined, style: { width: "156px", minWidth: "156px", height: "48px" }, onClick: () => void play(contextUri), children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: 560 }, children: [SP_JSX.jsx(FaPlay, {}), " ", t.play] }) }), isAlbum && albumArtist?.id ? (SP_JSX.jsx(DFL.DialogButton, { style: { width: "156px", minWidth: "156px", height: "48px" }, onClick: () => openDetail({ ...albumArtist, type: "artist" }), children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: 520 }, children: [SP_JSX.jsx(FaUser, {}), " ", t.artist] }) })) : null] })] })] }), SP_JSX.jsxs("section", { style: { marginTop: "30px" }, children: [SP_JSX.jsx("h2", { style: { margin: "0 0 13px", fontSize: "27px", fontWeight: 650 }, children: t.tracks }), SP_JSX.jsx(DFL.Focusable, { "flow-children": "vertical", children: visibleTracks.map((track, index) => (SP_JSX.jsx(SpotifyTvTrack, { track: track, index: index, showArtwork: !isAlbum, onActivate: () => isAlbum
                                    ? void play(String(normalizeTrack$1(track)?.uri ?? ""), contextUri, String(normalizeTrack$1(track)?.uri ?? ""))
                                    : void playTrackList(tracks, index) }, `${normalizeTrack$1(track)?.id ?? index}-${index}`))) }), !tracks.length && !loading ? SP_JSX.jsx("div", { style: { fontSize: "19px", opacity: 0.55 }, children: t.noTracks }) : null, tracks.length > visibleTracks.length ? (SP_JSX.jsx(DFL.DialogButton, { style: { width: "190px", minWidth: "190px", height: "44px", marginTop: "15px" }, onClick: () => setShowAllDetail(true), children: t.seeAll })) : null] })] }));
    }
    const renderTabPage = (page, content) => (SP_JSX.jsx("main", { ref: tab === page ? scrollRef : undefined, className: "npSpotifyTvScroll", style: { position: "absolute", inset: 0, height: "auto", overflowY: "auto", overflowX: "hidden", padding: "112px 56px 300px", scrollPaddingTop: 112, scrollPaddingBottom: 250, zIndex: 10 }, children: SP_JSX.jsx("div", { className: "npSpotifyTabContent", style: { position: "relative", zIndex: 1, width: "100%" }, children: content }) }, page));
    const activeTabContent = tab === "home"
        ? renderHomeTv()
        : tab === "search"
            ? renderSearchTv()
            : renderLibraryTv();
    return (SP_JSX.jsxs(DFL.Focusable, { className: "npSpotifyTvRoot npFullscreenRoot", "flow-children": "vertical", onCancel: navigateBack, onCancelButton: navigateBack, onButtonDown: handleRootButtonDown, style: { position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: 10, background: "#070707", color: "#fff", overflow: "hidden", outline: "none" }, children: [SP_JSX.jsx("style", { children: `
        .npSpotifyTvRoot, .npSpotifyTvRoot * { box-sizing: border-box; }
        .npSpotifyTvRoot button { transition: background 120ms ease, box-shadow 120ms ease, opacity 120ms ease !important; }
        .npSpotifyTvRoot button:focus, .npSpotifyTvRoot button.gpfocus { transform: none !important; z-index: 12; }
        .npSpotifyTvRoot button, .npSpotifyTvRoot [tabindex] { scroll-margin-top: 112px; }
        .npSpotifyCustomTabs { z-index: 200 !important; isolation: isolate; transform: none !important; }
        .npSpotifyTvScroll { z-index: 10 !important; }
        .npSpotifyTabContent { left: 0 !important; right: auto !important; width: 100% !important; max-width: 100% !important; transform-origin: center top !important; }
        body > [class*="virtualkeyboard"], body > [class*="VirtualKeyboard"], body [class*="virtualkeyboard_Keyboard"], body [class*="VirtualKeyboard_Keyboard"] { z-index: 2147483647 !important; }
        .npSpotifyTvCard:focus, .npSpotifyTvCard.gpfocus, .npSpotifyTvTrack:focus, .npSpotifyTvTrack.gpfocus { transform: none !important; }
        .npSpotifyTvCard { width:100% !important; min-width:0 !important; max-width:100% !important; margin:0 !important; }
        .npSpotifyCoverButton:focus, .npSpotifyCoverButton.gpfocus { box-shadow: 0 0 0 3px rgba(255,255,255,0.88), 0 0 0 6px rgba(29,185,84,0.48), 0 24px 70px rgba(0,0,0,0.42) !important; }
        .npSpotifyTvRow { scroll-padding-inline: 0; overscroll-behavior-inline: contain; }
        .npSpotifyTvRow::-webkit-scrollbar { display:none; }
        .npSpotifyTvScroll::-webkit-scrollbar { width:7px; height:7px; }
        .npSpotifyTvScroll::-webkit-scrollbar-thumb { background:rgba(255,255,255,.16); border-radius:999px; }
        .npSpotifyTvRoot input { font-size: 21px !important; }
        .npSpotifyBigPictureButton, .npSpotifyBigPictureButton * { color: #fff !important; }
        .npSpotifyBigPictureButton:hover, .npSpotifyBigPictureButton:focus, .npSpotifyBigPictureButton.gpfocus { color:#fff!important;background:rgba(255,255,255,.13)!important;border-color:rgba(255,255,255,.25)!important;box-shadow:0 0 0 1px rgba(29,185,84,.30),0 0 20px rgba(29,185,84,.17)!important; }
        .npSpotifyAppVolume {
          box-sizing: border-box;
          display: grid;
          grid-template-columns: 84px minmax(0, 1fr) 52px;
          align-items: center;
          gap: 10px;
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 8px 10px;
          border-radius: 7px;
          border: 1px solid rgba(255,255,255,0.075);
          background: rgba(255,255,255,0.025);
          color: rgba(255,255,255,0.84);
          font-size: 15px;
          line-height: 1.15;
          outline: none;
          overflow: hidden;
        }
        .npSpotifyAppVolume.npSpotifyAppVolumeFocused, .npSpotifyAppVolume:focus-visible {
          border-color: rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.13);
          box-shadow: 0 0 0 1px rgba(29,185,84,0.30), 0 0 20px rgba(29,185,84,0.17);
        }
        .npSpotifyAppVolume span, .npSpotifyAppVolume strong { min-width: 0; font-size: 1em; line-height: 1.15; font-weight: 500; }
        .npSpotifyAppVolume strong { text-align: right; font-weight: 700; }
        .npSpotifyAppVolume input[type="range"] { min-width: 0; width: 100%; height: 18px; margin: 0; padding: 0; accent-color: #1DB954; }
        .npSpotifyAppVolume input[type="range"]::-webkit-slider-runnable-track { height: 6px; border-radius: 999px; background: rgba(255,255,255,0.18); }
        .npSpotifyAppVolume input[type="range"]::-webkit-slider-thumb { width: 14px; height: 14px; margin-top: -4px; border-radius: 999px; }
        .npSpotifyCustomTab, .npSpotifyCustomTab * { color:#fff!important; }
        .npSpotifyCustomTab { border:1px solid rgba(255,255,255,.075)!important; background:rgba(255,255,255,.025)!important; }
        .npSpotifyCustomTab:hover, .npSpotifyCustomTab:focus, .npSpotifyCustomTab.gpfocus { background:rgba(255,255,255,.13)!important; border-color:rgba(255,255,255,.25)!important; box-shadow:0 0 0 1px rgba(29,185,84,.30),0 0 20px rgba(29,185,84,.17)!important; }
        .npSpotifyCustomTabActive { background:rgba(29,185,84,.18)!important; border-color:rgba(29,185,84,.46)!important; }
        .npSpotifyTvScroll { position:absolute!important; inset:0!important; height:auto!important; min-height:0!important; overflow-y:auto!important; overflow-x:hidden!important; overscroll-behavior:contain; }
        .npSpotifyPlayerGlow { animation: npSpotifyPlayerGlow 5.6s ease-in-out infinite alternate; transform-origin:50% 50%; }
        @keyframes npSpotifyPlayerGlow { from { transform:scale(1.02); opacity:.28; } to { transform:scale(1.12); opacity:.42; } }
        .npSpotifyTabContent { animation: npSpotifyTabEnter 150ms ease both; }
        @keyframes npSpotifyTabEnter { from { opacity: 0.78; } to { opacity: 1; } }
        .npSpotifyArtistLoading { position:absolute; inset:0; z-index:260; display:flex; align-items:center; justify-content:center; background:#000; pointer-events:auto; }
        .npSpotifyArtistLoadingLogo { color:#fff; animation:npSpotifyArtistLoadingPulse 2.4s ease-in-out infinite; }
        .npSpotifyArtistPageReady { animation:npSpotifyArtistPageReveal 480ms ease both; }
        @keyframes npSpotifyArtistLoadingPulse { 0%,100% { opacity:.18; transform:scale(.94); } 50% { opacity:1; transform:scale(1); } }
        @keyframes npSpotifyArtistPageReveal { from { opacity:0; } to { opacity:1; } }
      ` }), albumGlowImage ? (SP_JSX.jsx("div", { "aria-hidden": "true", style: { position: "absolute", inset: "-34% -22% -30% -10%", background: `url(${albumGlowImage}) center/cover no-repeat`, filter: "blur(138px) saturate(1.58)", opacity: 0.52, transform: "scale(1.34)", pointerEvents: "none", zIndex: 0 } })) : null, SP_JSX.jsx("div", { "aria-hidden": "true", style: { position: "absolute", inset: 0, zIndex: 0, background: detail?.kind === "artist" ? "#000" : "linear-gradient(90deg, rgba(7,7,7,0.66) 0%, rgba(7,7,7,0.26) 46%, rgba(7,7,7,0.20) 100%), linear-gradient(180deg, rgba(7,7,7,0.03), rgba(7,7,7,0.50) 76%, #070707 100%)", pointerEvents: "none" } }), loading && detail && ["artist", "album", "playlist"].includes(detail.kind) ? (SP_JSX.jsx("div", { className: "npSpotifyArtistLoading", role: "status", "aria-label": t.loadingSpotify, children: SP_JSX.jsx(SiSpotify, { className: "npSpotifyArtistLoadingLogo", size: 112 }) })) : null, rateLimitStatus.active ? (SP_JSX.jsx("div", { "aria-live": "polite", style: { position: "absolute", top: "20px", right: "28px", zIndex: 90, width: "210px", minWidth: "210px", height: "34px", minHeight: "34px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "7px", background: "rgba(35,26,10,0.48)", border: "1px solid rgba(255,211,120,0.18)", pointerEvents: "none", textAlign: "center" }, children: SP_JSX.jsxs("span", { style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", fontSize: "0.72em", color: "rgba(255,220,145,0.96)", textAlign: "center" }, children: [SP_JSX.jsx(FaClock, {}), " ", formatSpotifyText(t.apiPaused, { time: formatCountdown(rateLimitStatus.remainingSeconds) })] }) })) : loading && !detail ? (SP_JSX.jsxs("div", { style: { position: "absolute", top: "28px", right: "32px", display: "flex", alignItems: "center", gap: "8px", opacity: 0.58, zIndex: 24 }, children: [SP_JSX.jsx(FaSyncAlt, { className: "npSpotifyTvLoadingIcon" }), " ", t.loadingSpotify] })) : null, !detail ? (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(DFL.Focusable, { className: "npSpotifyCustomTabs", "flow-children": "horizontal", style: { position: "absolute", top: 24, left: 56, zIndex: 200, display: "flex", alignItems: "center", gap: 8 }, children: [[
                                "home", t.home, FaHome,
                            ], [
                                "search", t.search, FaSearch,
                            ], [
                                "library", t.library, FaList,
                            ], [
                                "settings", t.settings, FaCog,
                            ]].map(([id, label, Icon]) => (SP_JSX.jsx(DFL.DialogButton, { className: `npSpotifyCustomTab${id !== "settings" && tab === id ? " npSpotifyCustomTabActive" : ""}`, onClick: () => id === "settings" ? onOpenSettings?.() : switchTab(id), style: { width: 138, minWidth: 138, height: 38, minHeight: 38, padding: 0 }, children: SP_JSX.jsxs("span", { style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: ".76em", fontWeight: 540 }, children: [SP_JSX.jsx(Icon, { size: 13 }), " ", label] }) }, id))) }), renderTabPage(tab, activeTabContent)] })) : (SP_JSX.jsx("main", { ref: scrollRef, className: "npSpotifyTvScroll", style: { position: "absolute", inset: 0, overflowY: "auto", overflowX: "hidden", padding: "18px 56px 300px", scrollPaddingBottom: 250, zIndex: 2 }, children: SP_JSX.jsx("div", { className: detailData && !loading ? "npSpotifyArtistPageReady" : undefined, style: { position: "relative", zIndex: 1, width: "100%" }, children: renderDetailTv() }) }))] }));
}
const SpotifyBrowser = SP_REACT.memo(SpotifyBrowserContent);

const LOCAL_ACCENT = "#D9A337";
const COVER_CACHE = new Map();
const ARTIST_PROFILE_CACHE = new Map();
function setBoundedImageCache(cache, key, value, limit) {
    if (cache.has(key))
        cache.delete(key);
    cache.set(key, value);
    while (cache.size > limit) {
        const oldest = cache.keys().next().value;
        if (oldest === undefined)
            break;
        cache.delete(oldest);
    }
}
function resolveLocalTranslations() {
    return getTranslations("localMusic");
}
function useLocalTranslations() {
    return SP_REACT.useMemo(resolveLocalTranslations, []);
}
function artistText(item) {
    const artists = item?.artists ?? item?.album?.artists;
    if (Array.isArray(artists) && artists.length)
        return artists.map((artist) => artist?.name).filter(Boolean).join(", ");
    return "";
}
function normalizeTrack(entry) {
    return entry?.track ?? entry?.item ?? entry;
}
function itemType(item) {
    const type = String(item?.type ?? "").toLowerCase();
    if (type === "track" || type === "album" || type === "artist")
        return type;
    const uri = String(item?.uri ?? "");
    if (uri.startsWith("local:track:"))
        return "track";
    if (uri.startsWith("local:album:"))
        return "album";
    if (uri.startsWith("local:artist:"))
        return "artist";
    return "unknown";
}
function formatDuration(ms) {
    const seconds = Math.max(0, Math.floor(Number(ms || 0) / 1000));
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
function showError(message) {
    const t = resolveLocalTranslations();
    toaster.toast({ title: t.yourMusic, body: localizeRuntimeMessage(message, t.playerError), duration: 4200 });
}
function directionFromKey$1(key) {
    if (key === "ArrowLeft" || key === "Left")
        return -1;
    if (key === "ArrowRight" || key === "Right")
        return 1;
    return 0;
}
function directionFromGamepad(button) {
    if (button === DFL.GamepadButton.DIR_LEFT)
        return -1;
    if (button === DFL.GamepadButton.DIR_RIGHT)
        return 1;
    return 0;
}
function gridDirectionFromKey(key) {
    if (key === "ArrowLeft" || key === "Left")
        return -1;
    if (key === "ArrowRight" || key === "Right")
        return 1;
    if (key === "ArrowUp" || key === "Up")
        return -6;
    if (key === "ArrowDown" || key === "Down")
        return 6;
    return 0;
}
function gridDirectionFromGamepad(button) {
    if (button === DFL.GamepadButton.DIR_LEFT)
        return -1;
    if (button === DFL.GamepadButton.DIR_RIGHT)
        return 1;
    if (button === DFL.GamepadButton.DIR_UP)
        return -6;
    if (button === DFL.GamepadButton.DIR_DOWN)
        return 6;
    return 0;
}
const localGridFocusMoveState = new WeakMap();
function stopDirectionalEvent(event) {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    event?.stopImmediatePropagation?.();
    event?.nativeEvent?.stopImmediatePropagation?.();
}
function moveSixColumnGridFocus(event, delta) {
    if (!delta)
        return false;
    const eventTarget = event?.target;
    const activeTarget = typeof document !== "undefined" ? document.activeElement : null;
    const current = eventTarget?.closest?.("[data-np-grid-index]")
        ?? activeTarget?.closest?.("[data-np-grid-index]");
    const grid = current?.closest?.("[data-np-six-grid]");
    if (!current || !grid)
        return false;
    const currentIndex = Number(current.getAttribute("data-np-grid-index"));
    if (!Number.isFinite(currentIndex))
        return false;
    const column = currentIndex % 6;
    if ((delta === -1 && column === 0) || (delta === 1 && column === 5))
        return false;
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    const previousMove = localGridFocusMoveState.get(grid);
    if (previousMove && previousMove.delta === delta && now - previousMove.at < 220) {
        stopDirectionalEvent(event);
        return true;
    }
    const nextIndex = currentIndex + delta;
    const next = grid.querySelector(`[data-np-grid-index="${nextIndex}"]`);
    if (!next)
        return false;
    localGridFocusMoveState.set(grid, { at: now, delta });
    stopDirectionalEvent(event);
    next.scrollIntoView?.({ block: "nearest", inline: "nearest" });
    next.focus?.();
    return true;
}
function useLocalCover(coverId) {
    const key = String(coverId ?? "");
    const [url, setUrl] = SP_REACT.useState(() => COVER_CACHE.get(key) ?? "");
    SP_REACT.useEffect(() => {
        let cancelled = false;
        if (!key) {
            setUrl("");
            return;
        }
        const cached = COVER_CACHE.get(key);
        if (cached) {
            setUrl(cached);
            return;
        }
        void getLocalMusicCover(key).then((value) => {
            if (cancelled)
                return;
            if (value)
                setBoundedImageCache(COVER_CACHE, key, value, 600);
            setUrl(value || "");
        }).catch(() => { });
        return () => { cancelled = true; };
    }, [key]);
    return url;
}
function useLocalArtistProfile(item) {
    const id = String(item?.id ?? item?.artists?.[0]?.id ?? "");
    const name = String(item?.name ?? item?.artists?.[0]?.name ?? "");
    const key = `${id}|${name}`;
    const [url, setUrl] = SP_REACT.useState(() => ARTIST_PROFILE_CACHE.get(key) ?? "");
    SP_REACT.useEffect(() => {
        let cancelled = false;
        if (!id || !name) {
            setUrl("");
            return;
        }
        const cached = ARTIST_PROFILE_CACHE.get(key);
        if (cached) {
            setUrl(cached);
            return;
        }
        void getLocalMusicArtistProfile(id, name).then((value) => {
            if (cancelled)
                return;
            if (value)
                setBoundedImageCache(ARTIST_PROFILE_CACHE, key, value, 300);
            setUrl(value || "");
        }).catch(() => { });
        return () => { cancelled = true; };
    }, [id, key, name]);
    return url;
}
function LocalArtwork({ item, size = 52, round = false }) {
    const coverId = String(item?.coverId ?? item?.album?.coverId ?? "");
    const coverUrl = useLocalCover(coverId);
    const profileUrl = useLocalArtistProfile(round || itemType(item) === "artist" ? item : null);
    const url = profileUrl || coverUrl;
    return (SP_JSX.jsx("span", { style: { width: size, minWidth: size, height: size, borderRadius: round ? "50%" : "7px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,.08)" }, children: url ? SP_JSX.jsx("img", { loading: "lazy", src: url, style: { width: "100%", height: "100%", objectFit: "cover" } }) : SP_JSX.jsx(FaMusic, { style: { opacity: .42 } }) }));
}
function joinWindowsPath(base, name) {
    return `${base.replace(/[\\/]$/, "")}\\${name}`;
}
function parentWindowsPath(path) {
    const normalized = path.replace(/[\\/]+$/, "");
    const slash = Math.max(normalized.lastIndexOf("\\"), normalized.lastIndexOf("/"));
    if (slash <= 2)
        return normalized.slice(0, 3) || "C:\\";
    return normalized.slice(0, slash);
}
function LocalMusicPickerModal({ initialPath, closeModal, onAdd }) {
    const t = useLocalTranslations();
    const [listing, setListing] = SP_REACT.useState({ ok: true, path: initialPath, dirs: [], files: [] });
    const [manualPath, setManualPath] = SP_REACT.useState(initialPath);
    const [loading, setLoading] = SP_REACT.useState(true);
    const [adding, setAdding] = SP_REACT.useState(false);
    const load = SP_REACT.useCallback(async (path) => {
        setLoading(true);
        try {
            const result = await listLocalMusicDirectory(path);
            if (!result.ok)
                throw new Error(result.error || t.openFolderError);
            setListing(result);
            setManualPath(result.path);
        }
        catch (error) {
            showError(String(error?.message ?? error ?? t.openFolderError));
        }
        finally {
            setLoading(false);
        }
    }, [t.openFolderError]);
    SP_REACT.useEffect(() => { void load(initialPath); }, [initialPath, load]);
    async function add(kind, path) {
        if (adding)
            return;
        setAdding(true);
        try {
            if (await onAdd(kind, path))
                closeModal();
        }
        finally {
            setAdding(false);
        }
    }
    return (SP_JSX.jsxs(DFL.ModalRoot, { closeModal: closeModal, onCancel: closeModal, onEscKeypress: closeModal, children: [SP_JSX.jsx("style", { children: `
        .npLocalPicker button{text-align:left!important}
        .npLocalPicker button>span{justify-content:flex-start!important}
        .npLocalPicker button.npLocalPickerBack>span{width:100%!important;height:100%!important;padding:0!important;display:flex!important;align-items:center!important;justify-content:center!important}
        .npLocalPicker button.npLocalPickerGo{position:relative!important;width:84px!important;min-width:84px!important;max-width:84px!important;padding:0!important}
        .npLocalPicker button.npLocalPickerGo>span{position:static!important;width:100%!important;height:100%!important;padding:0!important}
        .npLocalPicker button.npLocalPickerGo span.npLocalPickerGoLabel{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;padding:0!important;display:flex!important;align-items:center!important;justify-content:center!important;text-align:center!important;pointer-events:none!important}
        .npLocalPicker button.npLocalPickerConfirm{color:#fff!important;background:linear-gradient(135deg,rgba(217,163,55,.96),rgba(179,124,22,.96))!important;border:1px solid rgba(255,226,159,.42)!important;box-shadow:0 8px 24px rgba(128,82,7,.24)!important}
        .npLocalPicker button.npLocalPickerConfirm:hover,.npLocalPicker button.npLocalPickerConfirm:focus,.npLocalPicker button.npLocalPickerConfirm.gpfocus{background:linear-gradient(135deg,#e1ad43,#c18a24)!important;border-color:rgba(255,244,211,.78)!important;box-shadow:0 0 0 2px rgba(255,255,255,.72),0 0 24px rgba(217,163,55,.38)!important}
      ` }), SP_JSX.jsxs(DFL.Focusable, { className: "npLocalPicker", "flow-children": "vertical", style: { position: "fixed", left: "50%", top: "50%", transform: "translate(-50%,-50%)", zIndex: 10000, width: "min(46rem, calc(100vw - 72px))", height: "min(42rem, calc(100vh - 72px))", maxWidth: "100%", display: "grid", gridTemplateRows: "auto auto auto minmax(0,1fr)", gap: 10, padding: 18, borderRadius: 8, border: "1px solid rgba(255,255,255,.16)", background: "rgba(16,17,18,.98)", boxShadow: "0 28px 90px rgba(0,0,0,.72)", overflow: "hidden", boxSizing: "border-box" }, children: [SP_JSX.jsx("div", { style: { fontSize: "1.25rem", fontWeight: 700, marginBottom: 12 }, children: t.pickerTitle }), SP_JSX.jsxs(DFL.Focusable, { "flow-children": "horizontal", style: { display: "grid", gridTemplateColumns: "auto minmax(0,1fr) auto", gap: 8 }, children: [SP_JSX.jsx(DFL.DialogButton, { className: "npLocalPickerBack", style: { width: 46, minWidth: 46, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }, disabled: loading || adding, onClick: () => void load(parentWindowsPath(listing.path)), children: SP_JSX.jsx("span", { children: SP_JSX.jsx(FaArrowLeft, {}) }) }), SP_JSX.jsx(DFL.TextField, { value: manualPath, onChange: (event) => setManualPath(event.target.value), style: { width: "100%" } }), SP_JSX.jsx(DFL.DialogButton, { className: "npLocalPickerGo", style: { width: 84, minWidth: 84, maxWidth: 84, padding: 0 }, disabled: loading || adding, onClick: () => void load(manualPath), children: SP_JSX.jsx("span", { className: "npLocalPickerGoLabel", children: t.openPath }) })] }), SP_JSX.jsx(DFL.DialogButton, { className: "npLocalPickerConfirm", style: { width: "100%", marginTop: 10 }, disabled: loading || adding, onClick: () => void add("folder", listing.path), children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: 9 }, children: [SP_JSX.jsx(FaCheck, {}), t.addCurrentFolder] }) }), SP_JSX.jsxs(DFL.Focusable, { "flow-children": "vertical", style: { minHeight: 0, overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column", gap: 6, padding: "2px 5px 2px 2px" }, children: [listing.dirs.map((dir) => (SP_JSX.jsx(DFL.DialogButton, { disabled: loading || adding, onClick: () => void load(joinWindowsPath(listing.path, dir)), children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: 9, minWidth: 0 }, children: [SP_JSX.jsx(FaFolder, {}), SP_JSX.jsx("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: dir })] }) }, `dir:${dir}`))), listing.files.map((file) => (SP_JSX.jsx(DFL.DialogButton, { disabled: loading || adding, onClick: () => void add("file", joinWindowsPath(listing.path, file)), children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: 9, minWidth: 0 }, children: [SP_JSX.jsx(FaFileAudio, {}), SP_JSX.jsx("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: file })] }) }, `file:${file}`))), !loading && !listing.dirs.length && !listing.files.length ? SP_JSX.jsx("div", { style: { padding: 14, opacity: .62 }, children: t.noAudioFiles }) : null] })] })] }));
}
function FanartSettingsPanel() {
    const t = useLocalTranslations();
    const [fanartApiKey, setFanartApiKey$1] = SP_REACT.useState("");
    const [fanartSaved, setFanartSaved] = SP_REACT.useState(false);
    const [busy, setBusy] = SP_REACT.useState(false);
    SP_REACT.useEffect(() => {
        let cancelled = false;
        void getArtistBackgroundProviderSettings().then((value) => {
            if (!cancelled)
                setFanartApiKey$1(value.fanartApiKey || "");
        }).catch(() => { });
        return () => { cancelled = true; };
    }, []);
    async function saveFanartKey() {
        setBusy(true);
        setFanartSaved(false);
        try {
            const value = await setFanartApiKey(fanartApiKey.trim());
            setFanartApiKey$1(value.fanartApiKey || "");
            setFanartSaved(true);
            window.setTimeout(() => setFanartSaved(false), 2400);
        }
        catch (error) {
            showError(error?.message ?? String(error));
        }
        finally {
            setBusy(false);
        }
    }
    return (SP_JSX.jsxs("div", { className: "npFanartSettingsPanel", style: { width: "100%" }, children: [SP_JSX.jsx("style", { children: `
        .npFanartSettingsPanel button,.npFanartSettingsPanel button *{color:#fff!important;text-align:left!important}
        .npFanartSettingsPanel button{font-size:.82em!important}
        .npFanartSettingsPanel button>span{justify-content:flex-start!important;font-size:1em!important}
        .npFanartSettingsPanel button:hover,.npFanartSettingsPanel button:focus,.npFanartSettingsPanel button.gpfocus{background:rgba(255,255,255,.12)!important;border-color:rgba(255,255,255,.24)!important;box-shadow:0 0 0 1px rgba(255,255,255,.22),0 0 18px rgba(255,255,255,.10)!important}
      ` }), SP_JSX.jsx("div", { style: { marginTop: 14, padding: "0 4px", fontSize: ".72em", fontWeight: 700, opacity: .64 }, children: t.fanartProvider }), SP_JSX.jsxs("div", { style: { marginTop: 6, padding: 12, borderRadius: 10, border: "1px solid rgba(255,255,255,.15)", background: "rgba(255,255,255,.045)" }, children: [SP_JSX.jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "flex-end" }, children: SP_JSX.jsx(DFL.DialogButton, { style: { width: "auto", minWidth: 0, height: 30, minHeight: 30, padding: "0 9px" }, onClick: () => void openExternalUrl("https://fanart.tv/get-an-api-key/"), children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: 6, fontSize: ".68em", whiteSpace: "nowrap" }, children: [SP_JSX.jsx(FaExternalLinkAlt, {}), " ", t.fanartApiPage] }) }) }), SP_JSX.jsx("p", { style: { margin: "7px 0 8px", fontSize: ".65em", lineHeight: 1.4, opacity: .56 }, children: t.fanartProviderDescription }), SP_JSX.jsx("input", { type: "password", value: fanartApiKey, spellCheck: false, autoComplete: "off", placeholder: t.fanartApiKey, onChange: (event) => { setFanartApiKey$1(event.currentTarget.value); setFanartSaved(false); }, style: { width: "100%", boxSizing: "border-box", height: 36, padding: "0 10px", borderRadius: 7, background: "rgba(0,0,0,.28)", border: "1px solid rgba(255,255,255,.12)", color: "#fff", fontFamily: "monospace", fontSize: ".68em" } }), SP_JSX.jsx(DFL.DialogButton, { style: { width: "100%", minWidth: "100%", height: 38, marginTop: 6, padding: 0 }, disabled: busy, onClick: () => void saveFanartKey(), children: SP_JSX.jsxs("span", { style: { width: "100%", display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-start", padding: "0 10px", boxSizing: "border-box", fontSize: ".82em", textAlign: "left" }, children: [fanartSaved ? SP_JSX.jsx(FaCheck, {}) : SP_JSX.jsx(FaSyncAlt, {}), " ", fanartSaved ? t.saved : t.saveFanartApiKey] }) })] })] }));
}
function LocalMusicSettingsPanel({ selectedService: _selectedService }) {
    const t = useLocalTranslations();
    const [settings, setSettings] = SP_REACT.useState({ folders: [], files: [], lastScan: 0, stats: { tracks: 0, albums: 0, artists: 0, playlists: 0, scannedAt: 0 } });
    const [busy, setBusy] = SP_REACT.useState(false);
    const [cacheBusy, setCacheBusy] = SP_REACT.useState(false);
    const [cacheProgress, setCacheProgress] = SP_REACT.useState({
        active: false,
        phase: "idle",
        current: "",
        completed: 0,
        total: 0,
    });
    const settingsPanelRef = SP_REACT.useRef(null);
    const reload = SP_REACT.useCallback(async () => setSettings(await getLocalMusicSettings()), []);
    SP_REACT.useEffect(() => { void reload(); }, [reload]);
    SP_REACT.useEffect(() => {
        if (!cacheBusy)
            return;
        let cancelled = false;
        let timer = 0;
        const poll = async () => {
            try {
                const progress = await getLocalMusicCacheProgress();
                if (!cancelled)
                    setCacheProgress(progress);
            }
            catch {
                // The cache build itself reports any final error. A missed progress poll
                // must not interrupt the operation or create a second toast.
            }
            if (!cancelled)
                timer = window.setTimeout(() => void poll(), 350);
        };
        void poll();
        return () => {
            cancelled = true;
            if (timer)
                window.clearTimeout(timer);
        };
    }, [cacheBusy]);
    async function addSelection(kind, path) {
        setBusy(true);
        try {
            const result = kind === "file" ? await addLocalMusicFile(path) : await addLocalMusicFolder(path);
            if (!result.ok)
                throw new Error(result.error || t.openFolderError);
            if (result.settings)
                setSettings(result.settings);
            window.setTimeout(() => {
                setCacheBusy(true);
                void buildLocalMusicCache()
                    .then(async (cacheResult) => {
                    if (!cacheResult.ok)
                        throw new Error(cacheResult.error || t.playerError);
                    COVER_CACHE.clear();
                    ARTIST_PROFILE_CACHE.clear();
                    if (cacheResult.settings)
                        setSettings(cacheResult.settings);
                    else
                        await reload();
                    setCacheProgress((previous) => ({ ...previous, active: false, phase: "complete", current: "", completed: previous.total || previous.completed, total: previous.total || previous.completed }));
                    window.setTimeout(() => setCacheProgress((previous) => previous.phase === "complete" ? { active: false, phase: "idle", current: "", completed: 0, total: 0 } : previous), 2600);
                    toaster.toast({ title: t.yourMusic, body: t.scanComplete, duration: 2400 });
                })
                    .catch((error) => showError(String(error?.message ?? error ?? t.playerError)))
                    .finally(() => setCacheBusy(false));
            }, 0);
            return true;
        }
        catch (error) {
            const message = String(error?.message ?? error ?? "");
            if (message && !/cancel/i.test(message))
                showError(message || t.openFolderError);
            return false;
        }
        finally {
            setBusy(false);
            window.setTimeout(() => settingsPanelRef.current?.scrollIntoView?.({ block: "nearest", inline: "nearest" }), 0);
        }
    }
    function chooseFolder() {
        let modal = null;
        const closeModal = () => modal?.Close?.();
        modal = DFL.showModal(SP_JSX.jsx(LocalMusicPickerModal, { initialPath: settings.folders[0] || settings.files?.[0]?.replace(/[\\/][^\\/]+$/, "") || "C:\\", closeModal: closeModal, onAdd: addSelection }), undefined, { strTitle: t.pickerTitle, bNeverPopOut: true, bHideActionIcons: true });
    }
    async function removeFolder(folder) {
        setBusy(true);
        try {
            const result = await removeLocalMusicFolder(folder);
            if (!result.ok)
                throw new Error(result.error || t.playerError);
            COVER_CACHE.clear();
            ARTIST_PROFILE_CACHE.clear();
            if (result.settings)
                setSettings(result.settings);
        }
        finally {
            setBusy(false);
        }
    }
    async function removeFile(path) {
        setBusy(true);
        try {
            const result = await removeLocalMusicFile(path);
            if (!result.ok)
                throw new Error(result.error || t.playerError);
            COVER_CACHE.clear();
            ARTIST_PROFILE_CACHE.clear();
            if (result.settings)
                setSettings(result.settings);
            else
                await reload();
        }
        catch (error) {
            showError(String(error?.message ?? error ?? t.playerError));
        }
        finally {
            setBusy(false);
        }
    }
    async function clearCache() {
        setBusy(true);
        setCacheBusy(true);
        try {
            const result = await clearLocalMusicCache();
            if (!result.ok)
                throw new Error(result.error || t.playerError);
            COVER_CACHE.clear();
            ARTIST_PROFILE_CACHE.clear();
            if (result.settings)
                setSettings(result.settings);
            else
                await reload();
            setCacheProgress((previous) => ({ ...previous, active: false, phase: "cleared", current: "", completed: previous.total || previous.completed, total: previous.total || previous.completed }));
            window.setTimeout(() => setCacheProgress((previous) => previous.phase === "cleared" ? { active: false, phase: "idle", current: "", completed: 0, total: 0 } : previous), 2600);
            toaster.toast({ title: t.yourMusic, body: t.cacheCleared, duration: 2200 });
        }
        catch (error) {
            showError(error?.message ?? String(error));
        }
        finally {
            setCacheBusy(false);
            setBusy(false);
        }
    }
    async function clearManualBackgrounds() {
        setBusy(true);
        setCacheBusy(true);
        try {
            const result = await clearManualArtistBackgrounds("local");
            if (!result.ok)
                throw new Error(result.error || t.playerError);
            COVER_CACHE.clear();
            ARTIST_PROFILE_CACHE.clear();
            await reload();
            setCacheProgress({ active: false, phase: "manual_cleared", current: "", completed: Number(result.data?.files || 0), total: Number(result.data?.files || 0) });
            window.setTimeout(() => setCacheProgress((previous) => previous.phase === "manual_cleared" ? { active: false, phase: "idle", current: "", completed: 0, total: 0 } : previous), 2800);
            toaster.toast({ title: t.yourMusic, body: t.manualBackgroundsRemoved, duration: 2400 });
        }
        catch (error) {
            showError(error?.message ?? String(error));
        }
        finally {
            setCacheBusy(false);
            setBusy(false);
        }
    }
    async function createCache() {
        setBusy(true);
        setCacheBusy(true);
        try {
            const result = await buildLocalMusicCache();
            if (!result.ok)
                throw new Error(result.error || t.playerError);
            COVER_CACHE.clear();
            ARTIST_PROFILE_CACHE.clear();
            if (result.settings)
                setSettings(result.settings);
            else
                await reload();
            setCacheProgress((previous) => ({ ...previous, active: false, phase: "complete", current: "", completed: previous.total || previous.completed, total: previous.total || previous.completed }));
            window.setTimeout(() => setCacheProgress((previous) => previous.phase === "complete" ? { active: false, phase: "idle", current: "", completed: 0, total: 0 } : previous), 2600);
            toaster.toast({ title: t.yourMusic, body: t.cacheCreated, duration: 2400 });
        }
        catch (error) {
            showError(error?.message ?? String(error));
        }
        finally {
            setCacheBusy(false);
            setBusy(false);
        }
    }
    async function scan() {
        setBusy(true);
        try {
            const result = await scanLocalMusic();
            if (!result.ok)
                throw new Error(result.error || t.playerError);
            await reload();
            toaster.toast({ title: t.yourMusic, body: t.scanComplete, duration: 2400 });
        }
        catch (error) {
            showError(error?.message ?? String(error));
        }
        finally {
            setBusy(false);
        }
    }
    const cacheProgressLabel = (() => {
        const name = String(cacheProgress.current || "").trim();
        if (cacheProgress.phase === "clearing")
            return cacheProgress.current ? formatTranslation(t.cacheProgressRemoving, { name: cacheProgress.current }) : t.cacheClearing;
        if (cacheProgress.phase === "cleared")
            return t.cacheCleared;
        if (cacheProgress.phase === "clearing_manual")
            return cacheProgress.current ? `${t.manualBackgroundsRemoving} ${cacheProgress.current}` : t.manualBackgroundsRemoving;
        if (cacheProgress.phase === "manual_cleared")
            return t.manualBackgroundsRemoved;
        if (cacheProgress.phase === "complete")
            return t.cacheCreated;
        if (cacheProgress.phase === "scanning")
            return t.cacheProgressScanning;
        if (cacheProgress.phase === "profile" && name)
            return formatTranslation(t.cacheProgressProfile, { name });
        if (cacheProgress.phase === "background" && name)
            return formatTranslation(t.cacheProgressBackground, { name });
        return t.cacheBuilding;
    })();
    const cacheProgressPercent = cacheProgress.total > 0
        ? Math.max(0, Math.min(100, (cacheProgress.completed / cacheProgress.total) * 100))
        : 0;
    const stats = settings.stats;
    const cacheSizeMb = Math.max(0, Number(settings.cacheBytes || 0)) / (1024 * 1024);
    const cacheSizeLabel = cacheSizeMb < 0.01 ? "0.00" : cacheSizeMb.toFixed(2);
    const manualBackgroundSizeMb = Math.max(0, Number(settings.manualBackgroundBytes || 0)) / (1024 * 1024);
    const manualBackgroundSizeLabel = manualBackgroundSizeMb < 0.01 ? "0.00" : manualBackgroundSizeMb.toFixed(2);
    return (SP_JSX.jsxs("div", { ref: settingsPanelRef, className: "npLocalSettingsPanel", style: { width: "100%" }, children: [SP_JSX.jsx("style", { children: `
        .npLocalSettingsPanel button,.npLocalSettingsPanel button *{color:#fff!important;text-align:left!important}
        .npLocalSettingsPanel button{font-size:.82em!important}
        .npLocalSettingsPanel button>span{justify-content:flex-start!important;font-size:1em!important}
        .npLocalSettingsPanel button.npLocalRemoveFolderButton>span{display:flex!important;align-items:center!important;justify-content:center!important;padding:0!important}
        .npLocalSettingsPanel button.npLocalRemoveFolderButton svg{margin:0!important}
        .npLocalSettingsPanel button:hover,.npLocalSettingsPanel button:focus,.npLocalSettingsPanel button.gpfocus{background:rgba(255,255,255,.12)!important;border-color:rgba(255,255,255,.24)!important;box-shadow:0 0 0 1px rgba(217,163,55,.28),0 0 18px rgba(217,163,55,.15)!important}
      ` }), SP_JSX.jsx("div", { style: { marginTop: 14, padding: "0 4px", fontSize: ".72em", fontWeight: 700, opacity: .64 }, children: t.yourMusic }), SP_JSX.jsxs("div", { style: { marginTop: 6, padding: 12, borderRadius: 10, border: "1px solid rgba(217,163,55,.28)", background: "linear-gradient(145deg, rgba(217,163,55,.13), rgba(0,0,0,.22))" }, children: [SP_JSX.jsx("p", { style: { margin: "0 0 8px", fontSize: ".72em", lineHeight: 1.42, opacity: .74 }, children: t.settingsDescription }), SP_JSX.jsx("p", { style: { margin: "0 0 10px", fontSize: ".66em", lineHeight: 1.38, opacity: .54 }, children: t.formats }), SP_JSX.jsx(DFL.DialogButton, { className: "npLocalSettingsButton", style: { width: "100%", minWidth: "100%", height: 38, padding: 0 }, disabled: busy, onClick: () => void chooseFolder(), children: SP_JSX.jsxs("span", { style: { width: "100%", display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-start", padding: "0 10px", boxSizing: "border-box", fontSize: ".82em", textAlign: "left" }, children: [SP_JSX.jsx(FaMusic, {}), " ", t.chooseFolder] }) }), SP_JSX.jsxs("div", { style: { marginTop: 10 }, children: [settings.folders.length ? settings.folders.map((folder) => (SP_JSX.jsxs(DFL.Focusable, { "flow-children": "horizontal", style: { display: "flex", gap: 6, marginBottom: 6 }, children: [SP_JSX.jsx("div", { style: { flex: 1, minWidth: 0, padding: "8px 9px", borderRadius: 7, background: "rgba(0,0,0,.24)", fontSize: ".67em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: folder }), SP_JSX.jsx(DFL.DialogButton, { className: "npLocalRemoveFolderButton", style: { width: 38, minWidth: 38, height: 34, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }, disabled: busy, onClick: () => void removeFolder(folder), "aria-label": t.remove, children: SP_JSX.jsx("span", { style: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }, children: SP_JSX.jsx(FaTimes, {}) }) })] }, folder))) : SP_JSX.jsx("div", { style: { fontSize: ".68em", opacity: .55, padding: "6px 2px" }, children: t.noFolders }), (settings.files || []).map((path) => (SP_JSX.jsxs(DFL.Focusable, { "flow-children": "horizontal", style: { display: "flex", gap: 6, marginBottom: 6 }, children: [SP_JSX.jsxs("div", { style: { flex: 1, minWidth: 0, padding: "8px 9px", borderRadius: 7, background: "rgba(0,0,0,.24)", fontSize: ".67em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [SP_JSX.jsx(FaFileAudio, { style: { marginRight: 7 } }), path] }), SP_JSX.jsx(DFL.DialogButton, { className: "npLocalRemoveFolderButton", style: { width: 38, minWidth: 38, height: 34, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }, disabled: busy, onClick: () => void removeFile(path), "aria-label": t.remove, children: SP_JSX.jsx("span", { style: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }, children: SP_JSX.jsx(FaTimes, {}) }) })] }, path)))] }), SP_JSX.jsx(DFL.DialogButton, { className: "npLocalSettingsButton", style: { width: "100%", minWidth: "100%", height: 38, marginTop: 5, padding: 0 }, disabled: busy || (!settings.folders.length && !(settings.files || []).length), onClick: () => void scan(), children: SP_JSX.jsxs("span", { style: { width: "100%", display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-start", padding: "0 10px", boxSizing: "border-box", fontSize: ".82em", textAlign: "left" }, children: [SP_JSX.jsx(FaSyncAlt, { className: busy ? "npLocalSpin" : "" }), " ", busy ? t.scanning : t.scan] }) }), SP_JSX.jsx(DFL.DialogButton, { className: "npLocalSettingsButton", style: { width: "100%", minWidth: "100%", height: 38, marginTop: 6, padding: 0 }, disabled: busy || cacheBusy || (!settings.folders.length && !(settings.files || []).length), onClick: () => void createCache(), children: SP_JSX.jsxs("span", { style: { width: "100%", display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-start", padding: "0 10px", boxSizing: "border-box", fontSize: ".82em", textAlign: "left" }, children: [SP_JSX.jsx(FaCompactDisc, { className: cacheBusy ? "npLocalSpin" : "" }), " ", cacheBusy ? t.cacheBuilding : t.createCache] }) }), (cacheBusy || ["complete", "cleared", "manual_cleared", "error"].includes(cacheProgress.phase)) ? (SP_JSX.jsxs("div", { style: { marginTop: 7, padding: "8px 9px", borderRadius: 7, background: "rgba(255,255,255,.045)", overflow: "hidden" }, children: [SP_JSX.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, fontSize: ".66em", lineHeight: 1.3 }, children: [SP_JSX.jsx("span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", opacity: .76 }, children: cacheProgressLabel }), cacheProgress.total > 0 ? SP_JSX.jsxs("span", { style: { flex: "0 0 auto", opacity: .5 }, children: [cacheProgress.completed, "/", cacheProgress.total] }) : null] }), SP_JSX.jsx("div", { style: { height: 3, marginTop: 6, borderRadius: 999, background: "rgba(255,255,255,.10)", overflow: "hidden" }, children: SP_JSX.jsx("div", { style: { width: cacheProgress.total > 0 ? `${cacheProgressPercent}%` : "32%", height: "100%", borderRadius: 999, background: LOCAL_ACCENT, transition: "width 180ms ease" } }) })] })) : null, SP_JSX.jsx(DFL.DialogButton, { className: "npLocalSettingsButton", style: { width: "100%", minWidth: "100%", height: 38, marginTop: 6, padding: 0 }, disabled: busy || cacheBusy, onClick: () => void clearCache(), children: SP_JSX.jsxs("span", { style: { width: "100%", display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-start", padding: "0 10px", boxSizing: "border-box", fontSize: ".82em", textAlign: "left" }, children: [SP_JSX.jsx(FaTimes, {}), " ", cacheProgress.phase === "clearing" ? t.cacheClearing : t.clearCache] }) }), SP_JSX.jsxs("div", { style: { marginTop: 7, padding: "7px 9px", borderRadius: 7, background: "rgba(255,255,255,.035)", display: "flex", justifyContent: "space-between", gap: 8, fontSize: ".66em" }, children: [SP_JSX.jsx("span", { style: { opacity: .58 }, children: t.cacheSize }), SP_JSX.jsxs("strong", { children: [cacheSizeLabel, " MB"] })] }), SP_JSX.jsxs("div", { style: { marginTop: 7, padding: "8px 9px", borderRadius: 7, background: "rgba(255,255,255,.035)" }, children: [SP_JSX.jsxs("div", { style: { display: "flex", justifyContent: "space-between", gap: 8, fontSize: ".66em" }, children: [SP_JSX.jsx("span", { style: { opacity: .58 }, children: t.manualBackgrounds }), SP_JSX.jsxs("strong", { children: [manualBackgroundSizeLabel, " MB"] })] }), SP_JSX.jsx("div", { style: { marginTop: 5, fontSize: ".63em", lineHeight: 1.35, opacity: .5 }, children: t.manualBackgroundsDescription })] }), SP_JSX.jsx(DFL.DialogButton, { className: "npLocalSettingsButton", style: { width: "100%", minWidth: "100%", minHeight: 42, marginTop: 6, padding: 0 }, disabled: busy || cacheBusy || Number(settings.manualBackgroundFiles || 0) <= 0, onClick: () => void clearManualBackgrounds(), children: SP_JSX.jsxs("span", { style: { width: "100%", display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-start", padding: "0 10px", boxSizing: "border-box", fontSize: ".82em", lineHeight: 1.18, textAlign: "left" }, children: [SP_JSX.jsx(FaTimes, {}), " ", cacheProgress.phase === "clearing_manual" ? t.manualBackgroundsRemoving : t.removeManualBackgrounds] }) }), SP_JSX.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginTop: 10, fontSize: ".67em" }, children: [[t.tracksCount, stats.tracks], [t.albumsCount, stats.albums], [t.artistsCount, stats.artists]].map(([label, value]) => (SP_JSX.jsxs("div", { style: { padding: "7px 8px", borderRadius: 7, background: "rgba(255,255,255,.045)", display: "flex", justifyContent: "space-between", gap: 6 }, children: [SP_JSX.jsx("span", { style: { opacity: .62 }, children: label }), SP_JSX.jsx("strong", { children: value })] }, String(label)))) })] })] }));
}
const qamButton = { width: "100%", minWidth: "100%", height: 38, minHeight: 38, padding: 0 };
function LocalTrackRow({ track, onActivate }) {
    return (SP_JSX.jsx(DFL.DialogButton, { style: { ...qamButton, height: 54, minHeight: 54, marginBottom: 6 }, onClick: onActivate, children: SP_JSX.jsxs("span", { style: { display: "flex", width: "100%", alignItems: "center", gap: 9, padding: "5px 8px", boxSizing: "border-box", textAlign: "left" }, children: [SP_JSX.jsx(LocalArtwork, { item: track, size: 42 }), SP_JSX.jsxs("span", { style: { minWidth: 0, flex: 1 }, children: [SP_JSX.jsx("strong", { style: { display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: ".86em" }, children: track?.name }), SP_JSX.jsx("span", { style: { display: "block", marginTop: 3, fontSize: ".7em", opacity: .6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: artistText(track) })] }), SP_JSX.jsx("span", { style: { fontSize: ".67em", opacity: .45 }, children: formatDuration(track?.duration_ms) })] }) }));
}
function LocalItemRow({ item, onActivate }) {
    return (SP_JSX.jsx(DFL.DialogButton, { style: { ...qamButton, height: 54, minHeight: 54, marginBottom: 6 }, onClick: onActivate, children: SP_JSX.jsxs("span", { style: { display: "flex", width: "100%", alignItems: "center", gap: 9, padding: "5px 8px", boxSizing: "border-box", textAlign: "left" }, children: [SP_JSX.jsx(LocalArtwork, { item: item, size: 42, round: itemType(item) === "artist" }), SP_JSX.jsxs("span", { style: { minWidth: 0, flex: 1 }, children: [SP_JSX.jsx("strong", { style: { display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: ".86em" }, children: item?.name }), SP_JSX.jsx("span", { style: { display: "block", marginTop: 3, minHeight: "1.25em", paddingBottom: 2, fontSize: ".7em", lineHeight: 1.25, opacity: .6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: artistText(item) })] })] }) }));
}
const LocalMusicBrowser = SP_REACT.memo(function LocalMusicBrowser({ openAlbumRequest, onOpenBigPicture }) {
    const t = useLocalTranslations();
    const [tab, setTab] = SP_REACT.useState("home");
    const [section, setSection] = SP_REACT.useState("tracks");
    const [home, setHome] = SP_REACT.useState({ albums: [], artists: [] });
    const [library, setLibrary] = SP_REACT.useState({ items: [] });
    const [search, setSearch] = SP_REACT.useState("");
    const [results, setResults] = SP_REACT.useState(null);
    const [detail, setDetail] = SP_REACT.useState(null);
    const [detailData, setDetailData] = SP_REACT.useState(null);
    const [history, setHistory] = SP_REACT.useState([]);
    const [loading, setLoading] = SP_REACT.useState(false);
    const audioState = useLocalAudioState();
    const lastAlbumRequestRef = SP_REACT.useRef(0);
    const previousTabRef = SP_REACT.useRef("home");
    const loadHome = SP_REACT.useCallback(async () => {
        setLoading(true);
        try {
            setHome(await getLocalMusicHome());
        }
        finally {
            setLoading(false);
        }
    }, []);
    const loadLibrary = SP_REACT.useCallback(async (next) => {
        setSection(next);
        setLoading(true);
        try {
            setLibrary(await getLocalMusicLibrary(next));
        }
        finally {
            setLoading(false);
        }
    }, []);
    const loadDetail = SP_REACT.useCallback(async (next) => {
        const data = await getLocalMusicDetail(next.kind, next.id);
        setDetailData(data);
        if (next.kind === "artist") {
            const artistName = String(data?.item?.name ?? next.title ?? "");
            if (artistName) {
                void getArtistBackground(artistName).then((url) => {
                    if (!url)
                        return;
                    setDetailData((current) => current?.item?.id === next.id ? { ...current, backgroundImage: url } : current);
                }).catch(() => { });
            }
        }
        return data;
    }, []);
    SP_REACT.useEffect(() => { void loadHome(); }, [loadHome]);
    SP_REACT.useEffect(() => {
        if (!openAlbumRequest?.id || openAlbumRequest.nonce === lastAlbumRequestRef.current)
            return;
        lastAlbumRequestRef.current = openAlbumRequest.nonce;
        setHistory([]);
        setDetail({ kind: "album", id: openAlbumRequest.id, title: openAlbumRequest.title });
        setLoading(true);
        const next = { kind: "album", id: openAlbumRequest.id, title: openAlbumRequest.title };
        void loadDetail(next).finally(() => setLoading(false));
    }, [loadDetail, openAlbumRequest?.id, openAlbumRequest?.nonce, openAlbumRequest?.title]);
    async function openDetail(item) {
        const kind = itemType(item);
        if (kind !== "album" && kind !== "artist")
            return;
        if (detail)
            setHistory((value) => [...value, detail]);
        const next = { kind, id: String(item.id), title: String(item.name ?? "") };
        setDetail(next);
        setDetailData(null);
        setLoading(true);
        try {
            await loadDetail(next);
        }
        finally {
            setLoading(false);
        }
    }
    async function playTracks(entries, index = 0) {
        try {
            await pauseExternalPlayback().catch(() => false);
            await localAudioPlayer.playItems(entries.map(normalizeTrack), index);
        }
        catch (error) {
            showError(error?.message ?? String(error));
        }
    }
    function goBack(event) {
        event?.preventDefault?.();
        event?.stopPropagation?.();
        const previous = history[history.length - 1];
        if (previous) {
            setHistory((value) => value.slice(0, -1));
            setDetail(previous);
            setDetailData(null);
            setLoading(true);
            void loadDetail(previous).finally(() => setLoading(false));
        }
        else {
            setDetail(null);
            setDetailData(null);
        }
        return true;
    }
    function renderDetail() {
        if (loading || !detailData)
            return SP_JSX.jsx("div", { style: { padding: "18px 8px", opacity: .62 }, children: t.scanning });
        const item = detailData?.item;
        if (!item)
            return SP_JSX.jsx("div", { style: { padding: "18px 8px", opacity: .62 }, children: t.nothingHere });
        const tracks = detailData?.tracks ?? [];
        const albums = detailData?.albums ?? [];
        const albumArtist = item?.artists?.[0];
        return SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(DFL.DialogButton, { className: "npLocalMinimalButton", style: { ...qamButton, marginTop: 18 }, onClick: goBack, children: SP_JSX.jsxs("span", { style: { display: "flex", gap: 7, alignItems: "center", justifyContent: "center", fontSize: ".8em" }, children: [SP_JSX.jsx(FaArrowLeft, {}), " ", t.back] }) }), SP_JSX.jsx("div", { style: { height: 8 } }), SP_JSX.jsxs("div", { style: { display: "flex", gap: 10, padding: 10, borderRadius: 10, background: "rgba(217,163,55,.10)", border: "1px solid rgba(217,163,55,.20)" }, children: [SP_JSX.jsx(LocalArtwork, { item: item, size: 70, round: detail?.kind === "artist" }), SP_JSX.jsxs("div", { style: { minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }, children: [SP_JSX.jsx("strong", { children: item?.name }), SP_JSX.jsx("span", { style: { marginTop: 4, fontSize: ".7em", opacity: .58 }, children: artistText(item) })] })] }), detail?.kind === "album" && albumArtist?.id ? SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx("div", { style: { height: 7 } }), SP_JSX.jsx(DFL.DialogButton, { style: qamButton, onClick: () => void openDetail({ ...albumArtist, type: "artist" }), children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }, children: [SP_JSX.jsx(FaUser, {}), " ", t.artist] }) })] }) : null, detail?.kind === "artist" && albums.length ? SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx("div", { style: { margin: "12px 4px 6px", fontSize: ".7em", fontWeight: 700, opacity: .62 }, children: t.albums }), albums.map((album) => SP_JSX.jsx(LocalItemRow, { item: album, onActivate: () => void openDetail(album) }, album.id))] }) : null, SP_JSX.jsx("div", { style: { margin: "12px 4px 6px", fontSize: ".7em", fontWeight: 700, opacity: .62 }, children: t.tracks }), tracks.map((track, index) => SP_JSX.jsx(LocalTrackRow, { track: track, onActivate: () => void playTracks(tracks, index) }, track.id))] });
    }
    function renderHome() {
        return SP_JSX.jsxs(SP_JSX.Fragment, { children: [home.albums?.length ? SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx("div", { style: { margin: "12px 4px 6px", fontSize: ".7em", fontWeight: 700, opacity: .62 }, children: t.recentAlbums }), home.albums.map((item) => SP_JSX.jsx(LocalItemRow, { item: item, onActivate: () => void openDetail(item) }, item.id))] }) : null, home.artists?.length ? SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx("div", { style: { margin: "12px 4px 6px", fontSize: ".7em", fontWeight: 700, opacity: .62 }, children: t.artists }), home.artists.map((item) => SP_JSX.jsx(LocalItemRow, { item: item, onActivate: () => void openDetail(item) }, item.id))] }) : null, !home.albums?.length && !home.artists?.length && !loading ? SP_JSX.jsx("div", { style: { padding: 12, fontSize: ".72em", opacity: .56 }, children: t.nothingHere }) : null] });
    }
    async function executeSearch() {
        if (search.trim().length < 2)
            return;
        setLoading(true);
        try {
            setResults(await searchLocalMusic(search));
        }
        finally {
            setLoading(false);
        }
    }
    function renderSearch() {
        const groups = [[t.tracks, results?.tracks ?? []], [t.albums, results?.albums ?? []], [t.artists, results?.artists ?? []]];
        return SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx("div", { style: { height: 8 } }), SP_JSX.jsx(DFL.TextField, { label: t.searchMusic, value: search, onChange: (value) => setSearch(typeof value === "string" ? value : String(value?.target?.value ?? "")), onKeyDown: (event) => { if (event.key === "Enter") {
                        event.preventDefault();
                        void executeSearch();
                    } } }), SP_JSX.jsx("div", { style: { height: 6 } }), SP_JSX.jsx(DFL.DialogButton, { style: qamButton, onClick: () => void executeSearch(), disabled: search.trim().length < 2, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }, children: [SP_JSX.jsx(FaSearch, {}), " ", t.search] }) }), groups.map(([label, items]) => items.length ? SP_JSX.jsxs("div", { children: [SP_JSX.jsx("div", { style: { margin: "12px 4px 6px", fontSize: ".7em", fontWeight: 700, opacity: .62 }, children: label }), items.map((item, index) => itemType(item) === "track" ? SP_JSX.jsx(LocalTrackRow, { track: item, onActivate: () => void playTracks(items, index) }, item.id) : SP_JSX.jsx(LocalItemRow, { item: item, onActivate: () => void openDetail(item) }, item.id))] }, label) : null), results && !groups.some(([, items]) => items.length) ? SP_JSX.jsx("div", { style: { padding: 12, fontSize: ".72em", opacity: .56 }, children: t.noResults }) : null] });
    }
    function renderLibrary() {
        const labels = { tracks: t.tracks, albums: t.albums, artists: t.artists };
        const items = library?.items ?? [];
        return SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx("div", { style: { height: 8 } }), SP_JSX.jsx(DFL.Focusable, { "flow-children": "grid", style: { display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 6, width: "100%" }, children: Object.keys(labels).map((key) => (SP_JSX.jsx(DFL.DialogButton, { style: { ...qamButton, minWidth: 0, padding: 0, opacity: section === key ? 1 : .58 }, onClick: () => void loadLibrary(key), children: SP_JSX.jsxs("span", { style: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: 0, fontSize: ".74em", lineHeight: 1, textAlign: "center", whiteSpace: "nowrap" }, children: [key === "tracks" ? SP_JSX.jsx(FaMusic, { size: 12 }) : key === "albums" ? SP_JSX.jsx(FaCompactDisc, { size: 12 }) : SP_JSX.jsx(FaUser, { size: 12 }), SP_JSX.jsx("span", { style: { display: "inline-flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }, children: labels[key] })] }) }, key))) }), SP_JSX.jsx("div", { style: { margin: "12px 4px 6px", fontSize: ".7em", fontWeight: 700, opacity: .62 }, children: labels[section] }), section === "tracks" && items.length ? SP_JSX.jsxs(DFL.Focusable, { "flow-children": "horizontal", style: { display: "flex", gap: 6, marginBottom: 7 }, children: [SP_JSX.jsx(DFL.DialogButton, { style: { ...qamButton, flex: 1, minWidth: 0 }, onClick: () => void playTracks(items, 0), children: SP_JSX.jsxs("span", { style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: ".74em", lineHeight: 1 }, children: [SP_JSX.jsx(FaPlay, { size: 12 }), " ", t.play] }) }), SP_JSX.jsx(DFL.DialogButton, { style: { ...qamButton, flex: 1, minWidth: 0 }, onClick: () => { const shuffled = [...items].sort(() => Math.random() - .5); void playTracks(shuffled, 0); }, children: SP_JSX.jsxs("span", { style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: ".74em", lineHeight: 1 }, children: [SP_JSX.jsx(FaRandom, { size: 12 }), " ", t.shuffle] }) })] }) : null, items.map((item, index) => section === "tracks" ? SP_JSX.jsx(LocalTrackRow, { track: item, onActivate: () => void playTracks(items, index) }, item.id) : SP_JSX.jsx(LocalItemRow, { item: item, onActivate: () => void openDetail(item) }, item.id)), !items.length && !loading ? SP_JSX.jsx("div", { style: { padding: 12, fontSize: ".72em", opacity: .56 }, children: t.nothingHere }) : null] });
    }
    function renderQueue() {
        const upcoming = audioState.index >= 0 ? audioState.queue.slice(audioState.index + 1, audioState.index + 11) : [];
        return SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx("div", { style: { margin: "12px 4px 6px", fontSize: ".7em", fontWeight: 700, opacity: .62 }, children: t.queue }), upcoming.map((track, index) => (SP_JSX.jsx(LocalTrackRow, { track: track, onActivate: () => void localAudioPlayer.playIndex(audioState.index + index + 1).catch((error) => showError(error?.message ?? String(error))) }, `${track?.id ?? index}-${index}`))), !upcoming.length ? SP_JSX.jsx("div", { style: { padding: 12, fontSize: ".72em", opacity: .56 }, children: t.queueEmpty }) : null] });
    }
    return SP_JSX.jsxs("div", { style: { width: "100%" }, children: [SP_JSX.jsx("style", { children: `
      .npLocalSpin{animation:npLocalSpin 1s linear infinite}@keyframes npLocalSpin{to{transform:rotate(360deg)}}
      .npLocalMinimalButton,.npLocalMinimalButton *{color:#fff!important}
      .npLocalMinimalButton:focus,.npLocalMinimalButton.gpfocus{background:rgba(255,255,255,.11)!important;border-color:rgba(255,255,255,.19)!important;box-shadow:0 0 0 1px rgba(217,163,55,.24),0 0 18px rgba(217,163,55,.14)!important}
      .npLocalSettingsButton,.npLocalSettingsButton *{text-align:left!important}
    ` }), SP_JSX.jsx("div", { "aria-hidden": "true", style: { height: 2, margin: "2px 4px 4px", borderRadius: 999, background: "linear-gradient(90deg,transparent,rgba(217,163,55,.68),transparent)", boxShadow: "0 0 14px rgba(217,163,55,.24)" } }), SP_JSX.jsx(DFL.DialogButton, { className: "npLocalMinimalButton", style: { ...qamButton, border: "1px solid rgba(255,255,255,.075)", background: "rgba(255,255,255,.025)" }, onClick: onOpenBigPicture, children: SP_JSX.jsxs("span", { style: { width: "100%", display: "flex", gap: 8, alignItems: "center", justifyContent: "center", fontSize: ".76em", fontWeight: 430 }, children: [SP_JSX.jsx(FaExpandArrowsAlt, { size: 12 }), " ", t.bigPicture] }) }), SP_JSX.jsx("div", { style: { height: 7 } }), SP_JSX.jsx(DFL.Focusable, { "flow-children": "grid", style: { display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 6 }, children: ["home", "library", "search", "queue"].map((key) => SP_JSX.jsx(DFL.DialogButton, { style: { width: "100%", minWidth: 0, height: 32, minHeight: 32, padding: 0, opacity: tab === key && !detail ? 1 : .58 }, onClick: () => {
                        setDetail(null);
                        setDetailData(null);
                        setHistory([]);
                        if (key === "queue") {
                            setTab((current) => current === "queue" ? previousTabRef.current : "queue");
                            return;
                        }
                        previousTabRef.current = key;
                        setTab(key);
                        if (key === "home" && !home.albums?.length)
                            void loadHome();
                        if (key === "library" && !library.items?.length)
                            void loadLibrary(section);
                    }, children: SP_JSX.jsxs("span", { style: { width: "100%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, fontSize: ".68em", lineHeight: 1, whiteSpace: "nowrap" }, children: [key === "home" ? SP_JSX.jsx(FaHome, {}) : key === "search" ? SP_JSX.jsx(FaSearch, {}) : key === "library" ? SP_JSX.jsx(FaList, {}) : SP_JSX.jsx(FaListOl, {}), key === "home" ? t.home : key === "search" ? t.search : key === "library" ? t.library : t.queue] }) }, key)) }), detail ? SP_JSX.jsx(DFL.Focusable, { "flow-children": "vertical", onCancel: goBack, onCancelButton: goBack, children: renderDetail() }) : tab === "home" ? renderHome() : tab === "search" ? renderSearch() : tab === "library" ? renderLibrary() : renderQueue()] });
});
function TvCard({ item, onActivate, round = false, focusKey, gridIndex, preferredFocus = false }) {
    return (SP_JSX.jsx(DFL.DialogButton, { preferredFocus: preferredFocus, className: "npLocalTvCard", ...{ "data-np-focus-key": focusKey || undefined, "data-np-grid-index": Number.isFinite(gridIndex) ? gridIndex : undefined }, onClick: onActivate, style: { width: "100%", minWidth: 0, height: "auto", minHeight: 0, padding: 10, borderRadius: 12, overflow: "hidden", textAlign: "left" }, children: SP_JSX.jsxs("span", { style: { display: "flex", flexDirection: "column", width: "100%", height: "100%", minWidth: 0 }, children: [SP_JSX.jsx("span", { style: { width: "100%", aspectRatio: "1/1", borderRadius: round ? "50%" : 8, overflow: "hidden", background: "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center" }, children: SP_JSX.jsx(LocalCardImage, { item: item, round: round }) }), SP_JSX.jsx("strong", { style: { marginTop: 11, fontSize: 16, lineHeight: 1.15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 650 }, children: item?.name }), SP_JSX.jsx("span", { style: { marginTop: 5, fontSize: 13, opacity: .58, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: artistText(item) || String(item?.year ?? "") })] }) }));
}
function LocalCardImage({ item, round = false }) {
    const coverId = String(item?.coverId ?? item?.album?.coverId ?? "");
    const coverUrl = useLocalCover(coverId);
    const profileUrl = useLocalArtistProfile(round || itemType(item) === "artist" ? item : null);
    const url = profileUrl || coverUrl;
    return url ? SP_JSX.jsx("img", { loading: "lazy", src: url, style: { width: "100%", height: "100%", objectFit: "cover", borderRadius: round ? "50%" : 0 } }) : SP_JSX.jsx(FaMusic, { size: 44, style: { opacity: .36 } });
}
function TvTrack({ track, index, onActivate, showArtwork = true }) {
    return (SP_JSX.jsx(DFL.DialogButton, { className: "npLocalTvTrack", onClick: onActivate, style: { width: "100%", minWidth: "100%", height: 66, minHeight: 66, padding: "0 16px", borderRadius: 10, marginBottom: 6, textAlign: "left" }, children: SP_JSX.jsxs("span", { style: { display: "grid", gridTemplateColumns: showArtwork ? "32px 48px minmax(0,1fr) auto" : "32px minmax(0,1fr) auto", alignItems: "center", gap: showArtwork ? 13 : 16, width: "100%" }, children: [SP_JSX.jsx("span", { style: { opacity: .45, fontVariantNumeric: "tabular-nums", textAlign: "right" }, children: index + 1 }), showArtwork ? SP_JSX.jsx(LocalArtwork, { item: track, size: 44 }) : null, SP_JSX.jsxs("span", { style: { minWidth: 0 }, children: [SP_JSX.jsx("strong", { style: { display: "block", fontSize: 16, fontWeight: 620, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: track?.name }), SP_JSX.jsx("span", { style: { display: "block", marginTop: 4, opacity: .56, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: artistText(track) })] }), SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", gap: 14, opacity: .62 }, children: [SP_JSX.jsx("span", { style: { fontVariantNumeric: "tabular-nums", fontSize: 13 }, children: formatDuration(track?.duration_ms) }), SP_JSX.jsx(FaPlay, { size: 13 })] })] }) }));
}
function LocalMusicBigPicture({ onExit, onOpenVisualizer, onOpenSettings }) {
    const t = useLocalTranslations();
    const coreT = SP_REACT.useMemo(() => getTranslations("core"), []);
    const [tab, setTab] = SP_REACT.useState("home");
    const [section, setSection] = SP_REACT.useState("tracks");
    const [home, setHome] = SP_REACT.useState({ albums: [], artists: [] });
    const [library, setLibrary] = SP_REACT.useState({ items: [] });
    const [search, setSearch] = SP_REACT.useState("");
    const [results, setResults] = SP_REACT.useState(null);
    const [detail, setDetail] = SP_REACT.useState(null);
    const [detailData, setDetailData] = SP_REACT.useState(null);
    const [history, setHistory] = SP_REACT.useState([]);
    const [queueExpanded, setQueueExpanded] = SP_REACT.useState(false);
    const state = useLocalAudioState();
    const [volume, setVolume] = SP_REACT.useState(() => state.volume);
    const [loading, setLoading] = SP_REACT.useState(false);
    const volumeRef = SP_REACT.useRef(100);
    const volumeTimer = SP_REACT.useRef(0);
    const volumeInteractionAtRef = SP_REACT.useRef(0);
    const playerCoverRef = SP_REACT.useRef(null);
    const rootDetailFocusKeyRef = SP_REACT.useRef("");
    const restoringTabRef = SP_REACT.useRef(null);
    const restoringTabUntilRef = SP_REACT.useRef(0);
    const restoreFocusTimersRef = SP_REACT.useRef([]);
    const [restoreFocusKey, setRestoreFocusKey] = SP_REACT.useState("");
    const [backgroundSettingsOpen, setBackgroundSettingsOpen] = SP_REACT.useState(false);
    const loadHome = SP_REACT.useCallback(async () => setHome(await getLocalMusicHome()), []);
    const loadLibrary = SP_REACT.useCallback(async (next) => { setSection(next); setLibrary(await getLocalMusicLibrary(next, 0, 100000)); }, []);
    const clearRestoreFocusTimers = SP_REACT.useCallback(() => {
        restoreFocusTimersRef.current.forEach((timer) => window.clearTimeout(timer));
        restoreFocusTimersRef.current = [];
    }, []);
    const restoreRootCardFocus = SP_REACT.useCallback(() => {
        const key = rootDetailFocusKeyRef.current;
        if (!key)
            return;
        restoringTabRef.current = tab;
        restoringTabUntilRef.current = Date.now() + 900;
        clearRestoreFocusTimers();
        setRestoreFocusKey(key);
        const delays = [40, 120, 260, 520, 900, 1400];
        const attempt = () => {
            if (rootDetailFocusKeyRef.current !== key)
                return;
            const escaped = typeof CSS !== "undefined" && CSS.escape ? CSS.escape(key) : key.replace(/["\\]/g, "\\$&");
            const root = document.querySelector(".npLocalBig");
            const element = root?.querySelector(`[data-np-focus-key="${escaped}"]`) ?? document.querySelector(`[data-np-focus-key="${escaped}"]`);
            if (!element)
                return;
            element.scrollIntoView?.({ block: "nearest", inline: "nearest" });
            element.focus?.({ preventScroll: true });
            if (document.activeElement === element) {
                restoringTabRef.current = null;
                restoringTabUntilRef.current = 0;
            }
        };
        restoreFocusTimersRef.current = delays.map((delay) => window.setTimeout(attempt, delay));
        restoreFocusTimersRef.current.push(window.setTimeout(() => {
            restoringTabRef.current = null;
            restoringTabUntilRef.current = 0;
        }, 1600));
    }, [clearRestoreFocusTimers, tab]);
    const loadBigPictureDetail = SP_REACT.useCallback(async (next) => {
        const data = await getLocalMusicDetail(next.kind, next.id);
        setDetailData(data);
        if (next.kind === "artist") {
            const artistName = String(data?.item?.name ?? next.title ?? "");
            if (artistName) {
                void getArtistBackground(artistName).then((url) => {
                    if (!url)
                        return;
                    setDetailData((current) => current?.item?.id === next.id ? { ...current, backgroundImage: url } : current);
                }).catch(() => { });
            }
        }
        return data;
    }, []);
    SP_REACT.useEffect(() => {
        const saved = getSavedSourceVolume("localMusic", state.volume);
        volumeRef.current = saved;
        setVolume(saved);
        void localAudioPlayer.initialize().then(() => localAudioPlayer.setVolume(saved));
        void loadHome();
        const syncVolume = (event) => {
            const detail = event instanceof CustomEvent ? event.detail : null;
            if (detail?.source !== "localMusic")
                return;
            const next = Math.max(0, Math.min(100, Number(detail.volume ?? saved)));
            if (detail.origin !== "observed")
                volumeInteractionAtRef.current = Date.now();
            volumeRef.current = next;
            setVolume(next);
            localAudioPlayer.setVolume(next);
        };
        window.addEventListener(SOURCE_VOLUME_CHANGED_EVENT, syncVolume);
        return () => window.removeEventListener(SOURCE_VOLUME_CHANGED_EVENT, syncVolume);
    }, [loadHome]);
    SP_REACT.useEffect(() => () => {
        if (volumeTimer.current)
            window.clearTimeout(volumeTimer.current);
        volumeTimer.current = 0;
        clearRestoreFocusTimers();
    }, [clearRestoreFocusTimers]);
    SP_REACT.useEffect(() => {
        if (Date.now() - volumeInteractionAtRef.current <= 1200)
            return;
        volumeRef.current = state.volume;
        setVolume(state.volume);
    }, [state.volume]);
    const navigateBack = SP_REACT.useCallback((event) => {
        event?.preventDefault?.();
        event?.stopPropagation?.();
        if (backgroundSettingsOpen) {
            setBackgroundSettingsOpen(false);
            return true;
        }
        const previous = history[history.length - 1];
        if (previous) {
            setHistory((value) => value.slice(0, -1));
            setDetail(previous);
            setDetailData(null);
            setLoading(true);
            void loadBigPictureDetail(previous).finally(() => setLoading(false));
            return true;
        }
        if (detail) {
            setDetail(null);
            setDetailData(null);
            restoreRootCardFocus();
            return true;
        }
        onExit();
        return true;
    }, [backgroundSettingsOpen, detail, history, loadBigPictureDetail, onExit, restoreRootCardFocus]);
    SP_REACT.useEffect(() => {
        const handler = (event) => { if (event.key === "Escape")
            navigateBack(event); };
        document.addEventListener("keydown", handler, true);
        return () => document.removeEventListener("keydown", handler, true);
    }, [navigateBack]);
    async function openDetail(item, focusKey = "") {
        const kind = itemType(item);
        if (kind !== "album" && kind !== "artist")
            return;
        setBackgroundSettingsOpen(false);
        if (detail)
            setHistory((value) => [...value, detail]);
        else {
            const active = document.activeElement;
            rootDetailFocusKeyRef.current = focusKey || active?.closest?.("[data-np-focus-key]")?.getAttribute("data-np-focus-key") || "";
            setRestoreFocusKey(rootDetailFocusKeyRef.current);
        }
        const next = { kind, id: String(item.id), title: String(item.name) };
        setDetail(next);
        setDetailData(null);
        setLoading(true);
        try {
            await loadBigPictureDetail(next);
        }
        finally {
            setLoading(false);
        }
    }
    async function playTracks(entries, index = 0) {
        try {
            await pauseExternalPlayback().catch(() => false);
            await localAudioPlayer.playItems(entries.map(normalizeTrack), index);
        }
        catch (error) {
            showError(error?.message ?? String(error));
        }
    }
    async function command(value) {
        try {
            await localAudioPlayer.command(value);
        }
        catch (error) {
            showError(error?.message ?? String(error));
        }
    }
    function changeVolume(next) {
        const value = Math.max(0, Math.min(100, Math.round(next)));
        volumeInteractionAtRef.current = Date.now();
        volumeRef.current = value;
        setVolume(value);
        saveSourceVolume("localMusic", value);
        if (volumeTimer.current)
            window.clearTimeout(volumeTimer.current);
        volumeTimer.current = window.setTimeout(() => localAudioPlayer.setVolume(volumeRef.current), 24);
    }
    function volumeKey(event) {
        const direction = directionFromKey$1(event.key);
        if (!direction)
            return;
        event.preventDefault();
        event.stopPropagation();
        changeVolume(volumeRef.current + direction);
    }
    function volumeButton(event) {
        const direction = directionFromGamepad(event?.detail?.button);
        if (!direction)
            return;
        event.preventDefault?.();
        event.stopPropagation?.();
        changeVolume(volumeRef.current + direction);
    }
    const current = state?.track;
    const hasCurrent = Boolean(current?.name);
    const currentCover = useLocalCover(current?.coverId);
    const detailCover = useLocalCover(detail?.kind === "album" ? detailData?.item?.coverId : "");
    const backgroundCover = detail?.kind === "artist" ? "" : (detail?.kind === "album" ? detailCover : currentCover);
    const currentAlbum = current?.album;
    const length = Number(state?.length ?? current?.duration_ms ?? 0);
    const position = Number(state?.position ?? 0);
    const ratio = length ? Math.max(0, Math.min(1, position / length)) : 0;
    const upcomingQueue = state.index >= 0 ? state.queue.slice(state.index + 1, state.index + 11) : [];
    const cardRow = (title, items, round = false) => items?.length ? (SP_JSX.jsxs("section", { style: { marginTop: 28 }, children: [SP_JSX.jsx("h2", { style: { margin: "0 0 13px", fontSize: 25, fontWeight: 650 }, children: title }), SP_JSX.jsx(DFL.Focusable, { className: "npLocalTvRow", "flow-children": "horizontal", style: { display: "grid", gridAutoFlow: "column", gridAutoColumns: "calc((100% - 60px) / 6)", gap: 12, overflowX: "auto", overflowY: "hidden", width: "100%", padding: "8px 0 22px", scrollPaddingInline: 0 }, children: items.slice(0, 60).map((item, index) => { const focusKey = `shelf:${title}:${itemType(item)}:${String(item?.id ?? index)}`; return SP_JSX.jsx(TvCard, { item: item, round: round, focusKey: focusKey, onActivate: () => void openDetail(item, focusKey) }, item.id); }) })] })) : null;
    function playerCard() {
        return (SP_JSX.jsxs(DFL.Focusable, { className: "npLocalPlayerCard", "flow-children": "grid", style: { position: "relative", width: "100%", display: "grid", gridTemplateColumns: "320px minmax(0,1fr) minmax(330px,24vw)", gap: "clamp(22px,3vw,44px)", alignItems: "stretch", minHeight: 368, padding: 24, borderRadius: 20, border: "1px solid rgba(255,255,255,.09)", background: "linear-gradient(135deg,rgba(255,255,255,.10),rgba(255,255,255,.045) 48%,rgba(0,0,0,.16))", backdropFilter: "blur(28px)", boxShadow: "0 24px 80px rgba(0,0,0,.30)", overflow: "hidden" }, children: [currentCover ? SP_JSX.jsx("div", { className: "npLocalPlayerGlow", "aria-hidden": "true", style: { position: "absolute", inset: "-50% -15% -70% -15%", background: `url(${currentCover}) center/cover no-repeat`, filter: "blur(110px) saturate(1.5)", opacity: .34, pointerEvents: "none" } }) : null, SP_JSX.jsx(DFL.DialogButton, { ref: playerCoverRef, className: "npLocalCoverButton", disabled: !currentAlbum?.id, onClick: () => currentAlbum?.id ? void openDetail(currentAlbum) : undefined, style: { position: "relative", width: 320, minWidth: 320, height: 320, minHeight: 320, padding: 0, borderRadius: 14, overflow: "hidden", alignSelf: "center", background: "rgba(255,255,255,.06)", boxShadow: "0 24px 70px rgba(0,0,0,.42)" }, children: currentCover ? SP_JSX.jsx("img", { src: currentCover, style: { width: "100%", height: "100%", objectFit: "cover", display: "block" } }) : SP_JSX.jsx("span", { style: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }, children: SP_JSX.jsx(FaMusic, { size: 76, style: { opacity: .3 } }) }) }), SP_JSX.jsx("div", { style: { position: "relative", minWidth: 0, alignSelf: "center" }, children: hasCurrent ? SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx("span", { style: { textTransform: "uppercase", letterSpacing: ".14em", fontSize: 12, opacity: .58, fontWeight: 620 }, children: t.nowPlaying }), SP_JSX.jsx("h1", { style: { margin: "9px 0 0", fontSize: "clamp(38px,4vw,68px)", lineHeight: 1.08, letterSpacing: "-.045em", fontWeight: 610, paddingBottom: ".12em" }, children: current?.name }), SP_JSX.jsx("div", { style: { marginTop: 12, fontSize: "clamp(18px,1.7vw,27px)", opacity: .72, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: artistText(current) }), currentAlbum?.name ? SP_JSX.jsx("div", { style: { marginTop: 7, fontSize: 16, opacity: .45, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: currentAlbum.name }) : null, SP_JSX.jsxs("div", { style: { marginTop: 28 }, children: [SP_JSX.jsx("div", { style: { height: 5, borderRadius: 999, background: "rgba(255,255,255,.16)", overflow: "hidden" }, children: SP_JSX.jsx("div", { style: { width: `${ratio * 100}%`, height: "100%", background: LOCAL_ACCENT, borderRadius: 999 } }) }), SP_JSX.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 13, opacity: .48, fontVariantNumeric: "tabular-nums" }, children: [SP_JSX.jsx("span", { children: formatDuration(position) }), SP_JSX.jsx("span", { children: formatDuration(length) })] })] })] }) : SP_JSX.jsx("h1", { style: { margin: 0, fontSize: "clamp(34px,3.4vw,58px)", lineHeight: 1.08, letterSpacing: "-.04em", fontWeight: 610 }, children: t.chooseSomething }) }), SP_JSX.jsx("div", { style: { position: "relative", minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }, children: SP_JSX.jsxs(DFL.Focusable, { "flow-children": "vertical", style: { display: "flex", flexDirection: "column", gap: 10, alignItems: "stretch" }, children: [SP_JSX.jsxs(DFL.Focusable, { "flow-children": "horizontal", style: { display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 10 }, children: [SP_JSX.jsx(DFL.DialogButton, { disabled: !hasCurrent, style: { width: "100%", minWidth: 0, height: 58, padding: 0 }, onClick: () => void command("previous"), children: SP_JSX.jsx(FaStepBackward, { size: 18 }) }), SP_JSX.jsx(DFL.DialogButton, { disabled: !hasCurrent, style: { width: "100%", minWidth: 0, height: 58, padding: 0 }, onClick: () => void command("play_pause"), children: state?.status === "Playing" ? SP_JSX.jsx(FaPause, { size: 21 }) : SP_JSX.jsx(FaPlay, { size: 21 }) }), SP_JSX.jsx(DFL.DialogButton, { disabled: !hasCurrent, style: { width: "100%", minWidth: 0, height: 58, padding: 0 }, onClick: () => void command("next"), children: SP_JSX.jsx(FaStepForward, { size: 18 }) })] }), SP_JSX.jsxs(DFL.Focusable, { "flow-children": "horizontal", style: { display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 10 }, children: [SP_JSX.jsxs(DFL.DialogButton, { disabled: !hasCurrent, "aria-label": t.shuffle, onClick: () => void localAudioPlayer.command("shuffle"), style: { position: "relative", width: "100%", minWidth: 0, height: 46, padding: 0, opacity: state.shuffleActive ? 1 : .62 }, children: [SP_JSX.jsx(FaRandom, { size: 16 }), state.shuffleActive ? SP_JSX.jsx("span", { "aria-hidden": "true", style: { position: "absolute", top: 7, right: 8, width: 6, height: 6, borderRadius: 999, background: LOCAL_ACCENT, boxShadow: `0 0 8px ${LOCAL_ACCENT}` } }) : null] }), SP_JSX.jsxs(DFL.DialogButton, { disabled: !hasCurrent, "aria-label": t.repeat, onClick: () => void localAudioPlayer.command("repeat"), style: { position: "relative", width: "100%", minWidth: 0, height: 46, padding: 0, opacity: state.repeatMode !== "None" ? 1 : .62 }, children: [SP_JSX.jsx(FaRedoAlt, { size: 16 }), state.repeatMode !== "None" ? SP_JSX.jsx("span", { "aria-hidden": "true", style: { position: "absolute", top: 7, right: 8, width: 6, height: 6, borderRadius: 999, background: LOCAL_ACCENT, boxShadow: `0 0 8px ${LOCAL_ACCENT}` } }) : null] })] }), SP_JSX.jsx(DFL.DialogButton, { className: "npLocalMinimalButton", "aria-label": t.fullscreen, onClick: onOpenVisualizer, style: { width: "100%", minWidth: 0, height: 46, minHeight: 46, border: "1px solid rgba(255,255,255,.075)", background: "rgba(255,255,255,.025)" }, children: SP_JSX.jsxs("span", { style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: ".82em", fontWeight: 430 }, children: [SP_JSX.jsx(FaExpandArrowsAlt, { size: 13 }), " ", t.fullscreen] }) }), SP_JSX.jsx(DFL.DialogButton, { className: "npLocalMinimalButton", onClick: () => setQueueExpanded((value) => !value), style: { gridColumn: "1 / -1", width: "100%", minWidth: 0, height: 46, border: "1px solid rgba(255,255,255,.075)", background: queueExpanded ? "rgba(217,163,55,.16)" : "rgba(255,255,255,.025)" }, children: SP_JSX.jsxs("span", { style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: ".82em", fontWeight: 430 }, children: [SP_JSX.jsx(FaListOl, { size: 12 }), " ", t.queue] }) }), SP_JSX.jsxs(DFL.Focusable, { className: "npLocalAppVolume", focusClassName: "npLocalAppVolumeFocused", noFocusRing: true, onActivate: () => undefined, onButtonDown: volumeButton, onKeyDown: volumeKey, role: "slider", tabIndex: 0, ...{ focusable: true }, "aria-label": t.volume, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": volume, style: { gridColumn: "1 / -1", marginTop: 0 }, children: [SP_JSX.jsx("span", { children: t.volume }), SP_JSX.jsx("input", { type: "range", min: 0, max: 100, step: 1, value: volume, tabIndex: -1, onChange: (event) => changeVolume(Number(event.currentTarget.value)) }), SP_JSX.jsxs("strong", { children: [volume, "%"] })] })] }) })] }));
    }
    function renderQueuePanel() {
        return (SP_JSX.jsxs("section", { style: { marginTop: 18, padding: 18, borderRadius: 16, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.035)" }, children: [SP_JSX.jsx("h2", { style: { margin: "0 0 13px", fontSize: 25, fontWeight: 650 }, children: t.queue }), SP_JSX.jsx(DFL.Focusable, { "flow-children": "vertical", children: upcomingQueue.map((track, index) => (SP_JSX.jsx(TvTrack, { track: track, index: index, onActivate: () => void localAudioPlayer.playIndex(state.index + index + 1) }, `${track?.id ?? index}-${index}`))) }), !upcomingQueue.length ? SP_JSX.jsx("div", { style: { fontSize: 18, opacity: .55 }, children: t.queueEmpty }) : null] }));
    }
    function renderHome() {
        return SP_JSX.jsxs(SP_JSX.Fragment, { children: [playerCard(), queueExpanded ? renderQueuePanel() : null, cardRow(t.recentAlbums, home.albums), cardRow(t.artists, home.artists, true)] });
    }
    async function executeSearch() { if (search.trim().length >= 2)
        setResults(await searchLocalMusic(search)); }
    function renderSearch() {
        return SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(DFL.TextField, { label: t.searchMusic, value: search, style: { width: "100%", minWidth: "100%" }, onChange: (value) => setSearch(typeof value === "string" ? value : String(value?.target?.value ?? "")), onKeyDown: (event) => { if (event.key === "Enter") {
                        event.preventDefault();
                        void executeSearch();
                    } } }), SP_JSX.jsx(DFL.DialogButton, { style: { width: 180, minWidth: 180, height: 46, marginTop: 10 }, onClick: () => void executeSearch(), children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }, children: [SP_JSX.jsx(FaSearch, {}), " ", t.search] }) }), cardRow(t.artists, results?.artists ?? [], true), cardRow(t.albums, results?.albums ?? []), results?.tracks?.length ? SP_JSX.jsxs("section", { style: { marginTop: 28 }, children: [SP_JSX.jsx("h2", { children: t.tracks }), results.tracks.map((track, index) => SP_JSX.jsx(TvTrack, { track: track, index: index, onActivate: () => void playTracks(results.tracks, index) }, track.id))] }) : null, results && !results.tracks?.length && !results.albums?.length && !results.artists?.length ? SP_JSX.jsx("div", { style: { marginTop: 30, opacity: .56 }, children: t.noResults }) : null] });
    }
    function renderLibrary() {
        const labels = { tracks: t.tracks, albums: t.albums, artists: t.artists };
        const items = library.items ?? [];
        const visibleItems = items;
        return SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(DFL.Focusable, { "flow-children": "horizontal", style: { display: "flex", gap: 9 }, children: Object.keys(labels).map((key) => SP_JSX.jsx(DFL.DialogButton, { style: { width: 180, minWidth: 180, height: 46, borderRadius: 999, opacity: section === key ? 1 : .58 }, onClick: () => void loadLibrary(key), children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }, children: [key === "tracks" ? SP_JSX.jsx(FaMusic, {}) : key === "albums" ? SP_JSX.jsx(FaCompactDisc, {}) : SP_JSX.jsx(FaUser, {}), labels[key]] }) }, key)) }), SP_JSX.jsx("h2", { style: { marginTop: 26 }, children: labels[section] }), section === "tracks" ? SP_JSX.jsxs(SP_JSX.Fragment, { children: [items.length ? SP_JSX.jsxs(DFL.Focusable, { "flow-children": "horizontal", style: { display: "flex", gap: 10, marginBottom: 14 }, children: [SP_JSX.jsx(DFL.DialogButton, { style: { width: 190, minWidth: 190, height: 46 }, onClick: () => void playTracks(items, 0), children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }, children: [SP_JSX.jsx(FaPlay, {}), " ", t.play] }) }), SP_JSX.jsx(DFL.DialogButton, { style: { width: 190, minWidth: 190, height: 46 }, onClick: () => { const shuffled = [...items].sort(() => Math.random() - .5); void playTracks(shuffled, 0); }, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }, children: [SP_JSX.jsx(FaRandom, {}), " ", t.shuffle] }) })] }) : null, visibleItems.map((track, index) => SP_JSX.jsx(TvTrack, { track: track, index: index, onActivate: () => void playTracks(items, index) }, track.id))] }) : SP_JSX.jsx(DFL.Focusable, { ...{ "data-np-six-grid": section }, "flow-children": "grid", navEntryPreferPosition: restoreFocusKey ? DFL.NavEntryPositionPreferences.PREFERRED_CHILD : DFL.NavEntryPositionPreferences.MAINTAIN_X, onKeyDownCapture: (event) => moveSixColumnGridFocus(event, gridDirectionFromKey(event?.key)), onGamepadDirection: (event) => moveSixColumnGridFocus(event, gridDirectionFromGamepad(event?.detail?.button)), style: { display: "grid", gridTemplateColumns: "repeat(6,minmax(0,1fr))", gap: 14 }, children: visibleItems.map((item, index) => { const focusKey = `library:${section}:${itemType(item)}:${String(item?.id ?? index)}`; return SP_JSX.jsx(TvCard, { item: item, round: section === "artists", gridIndex: index, focusKey: focusKey, preferredFocus: restoreFocusKey === focusKey, onActivate: () => void openDetail(item, focusKey) }, item.id); }) }), !items.length && !loading ? SP_JSX.jsx("div", { style: { opacity: .56 }, children: t.nothingHere }) : null] });
    }
    function renderDetail() {
        if (loading || !detailData)
            return SP_JSX.jsx("div", { style: { padding: "18px 8px", opacity: .62 }, children: t.scanning });
        const item = detailData?.item;
        if (!item)
            return SP_JSX.jsx("div", { style: { padding: "18px 8px", opacity: .62 }, children: t.nothingHere });
        const tracks = detailData?.tracks ?? [];
        const albums = detailData?.albums ?? [];
        const isArtist = detail?.kind === "artist";
        if (backgroundSettingsOpen && isArtist) {
            return SP_JSX.jsx(ArtistBackgroundPicker, { provider: "local", artistId: String(item?.id ?? detail?.id ?? ""), artistName: String(item?.name ?? detail?.title ?? ""), onBack: () => setBackgroundSettingsOpen(false), onApplied: (url) => setDetailData((current) => current ? { ...current, backgroundImage: url } : current) });
        }
        const background = String(detailData?.backgroundImage ?? item?.backgroundImage ?? "");
        const albumArtist = item?.artists?.[0];
        return SP_JSX.jsxs(SP_JSX.Fragment, { children: [isArtist && background ? SP_JSX.jsx("div", { className: "npLocalArtistHero", "aria-hidden": "true", style: { backgroundImage: `url(${background})` }, children: SP_JSX.jsx("div", {}) }) : null, SP_JSX.jsx(DFL.DialogButton, { className: "npLocalBackButton npLocalMinimalButton", onClick: navigateBack, style: { width: 108, minWidth: 108, height: 34, minHeight: 34, padding: 0, border: "1px solid rgba(255,255,255,.075)", background: "rgba(255,255,255,.025)" }, children: SP_JSX.jsxs("span", { style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: ".72em", fontWeight: 430 }, children: [SP_JSX.jsx(FaArrowLeft, { size: 11 }), " ", t.back] }) }), SP_JSX.jsxs("div", { style: { display: "grid", gridTemplateColumns: isArtist ? "1fr" : "250px minmax(0,1fr)", gap: 30, marginTop: isArtist ? 220 : 20, alignItems: "end", position: "relative" }, children: [!isArtist ? SP_JSX.jsx(LocalArtwork, { item: item, size: 250 }) : null, SP_JSX.jsxs("div", { style: { minWidth: 0 }, children: [SP_JSX.jsx("h1", { style: { fontSize: isArtist ? "clamp(62px,7vw,104px)" : 54, lineHeight: 1, margin: 0, letterSpacing: "-.045em" }, children: item?.name }), !isArtist ? SP_JSX.jsxs("div", { style: { marginTop: 12, opacity: .62 }, children: [artistText(item), item?.year ? ` · ${item.year}` : ""] }) : null, SP_JSX.jsxs(DFL.Focusable, { "flow-children": "horizontal", style: { display: "flex", gap: 10, marginTop: 20 }, children: [SP_JSX.jsx(DFL.DialogButton, { style: { width: 170, minWidth: 170, height: 48 }, onClick: () => void playTracks(tracks, 0), children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }, children: [SP_JSX.jsx(FaPlay, {}), " ", t.play] }) }), !isArtist && albumArtist?.id ? SP_JSX.jsx(DFL.DialogButton, { style: { width: 160, minWidth: 160, height: 48 }, onClick: () => void openDetail({ ...albumArtist, type: "artist" }), children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }, children: [SP_JSX.jsx(FaUser, {}), " ", t.artist] }) }) : null] })] })] }), isArtist && albums.length ? cardRow(t.albums, albums) : null, SP_JSX.jsxs("section", { style: { marginTop: 30 }, children: [SP_JSX.jsx("h2", { children: t.tracks }), tracks.map((track, index) => SP_JSX.jsx(TvTrack, { track: track, index: index, showArtwork: !isArtist, onActivate: () => void playTracks(tracks, index) }, track.id))] }), isArtist ? SP_JSX.jsx(DFL.DialogButton, { className: "npLocalMinimalButton", style: { width: 250, minWidth: 250, height: 48, marginTop: 26 }, onClick: () => setBackgroundSettingsOpen(true), children: SP_JSX.jsxs("span", { style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }, children: [SP_JSX.jsx(FaCog, {}), " ", coreT.artistBackgroundSettings] }) }) : null] });
    }
    const switchRootTab = SP_REACT.useCallback((nextTab) => {
        if (restoringTabRef.current && Date.now() < restoringTabUntilRef.current) {
            if (nextTab === "home" && restoringTabRef.current !== "home")
                return;
            if (nextTab !== tab) {
                restoringTabRef.current = null;
                restoringTabUntilRef.current = 0;
            }
        }
        if (nextTab === tab && !detail)
            return;
        clearRestoreFocusTimers();
        rootDetailFocusKeyRef.current = "";
        restoringTabRef.current = null;
        restoringTabUntilRef.current = 0;
        setRestoreFocusKey("");
        setTab(nextTab);
        setDetail(null);
        setDetailData(null);
        setHistory([]);
        if (nextTab === "home" && !home.albums?.length)
            void loadHome();
        if (nextTab === "library" && !library.items?.length)
            void loadLibrary(section);
    }, [clearRestoreFocusTimers, detail, home.albums?.length, library.items?.length, loadHome, loadLibrary, section, tab]);
    const handleRootButtonDown = SP_REACT.useCallback((event) => {
        if (detail)
            return;
        const button = event?.detail?.button;
        if (button !== DFL.GamepadButton.BUMPER_LEFT && button !== DFL.GamepadButton.BUMPER_RIGHT)
            return;
        event?.preventDefault?.();
        event?.stopPropagation?.();
        const tabs = ["home", "search", "library", "settings"];
        const currentRootTab = tab === "queue" ? "home" : tab;
        const index = Math.max(0, tabs.indexOf(currentRootTab));
        const delta = button === DFL.GamepadButton.BUMPER_RIGHT ? 1 : -1;
        const next = tabs[(index + delta + tabs.length) % tabs.length];
        if (next === "settings")
            onOpenSettings();
        else
            switchRootTab(next);
        window.setTimeout(() => {
            const root = document.querySelector(".npLocalBig");
            const content = root?.querySelector(".npLocalTabContent");
            if (content) {
                content.style.transform = "none";
                content.style.left = "0";
                content.style.width = "100%";
            }
            root?.querySelector(".npLocalTvScroll")?.scrollTo?.({ top: 0, left: 0, behavior: "auto" });
        }, 0);
    }, [detail, onOpenSettings, switchRootTab, tab]);
    const page = (content) => SP_JSX.jsx("main", { className: "npLocalTvScroll", style: { position: "absolute", inset: 0, height: "auto", overflowY: "auto", overflowX: "hidden", padding: "112px 56px 300px", scrollPaddingTop: 112, scrollPaddingBottom: 250, zIndex: 10 }, children: SP_JSX.jsx("div", { className: "npLocalTabContent", style: { position: "relative", zIndex: 1 }, children: content }) });
    const activeTabContent = tab === "home"
        ? renderHome()
        : tab === "search"
            ? renderSearch()
            : renderLibrary();
    return (SP_JSX.jsxs(DFL.Focusable, { className: "npLocalBig npFullscreenRoot", "flow-children": "vertical", onCancel: navigateBack, onCancelButton: navigateBack, onButtonDown: handleRootButtonDown, style: { position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: 10, background: "#090806", color: "#fff", overflow: "hidden" }, children: [SP_JSX.jsx("style", { children: `
        .npLocalBig,.npLocalBig *{box-sizing:border-box}
        .npLocalBig button{transition:background 120ms ease,border-color 120ms ease,box-shadow 120ms ease,opacity 120ms ease!important}
        .npLocalBig button:focus,.npLocalBig button.gpfocus{transform:none!important;z-index:12}
        .npLocalBig button,.npLocalBig [tabindex]{scroll-margin-top:112px}
        .npLocalCustomTabs{z-index:200!important;isolation:isolate;transform:none!important}
        .npLocalTvScroll{z-index:10!important}
        .npLocalTabContent{left:0!important;right:auto!important;width:100%!important;max-width:100%!important;transform-origin:center top!important}
        body > [class*="virtualkeyboard"],body > [class*="VirtualKeyboard"],body [class*="virtualkeyboard_Keyboard"],body [class*="VirtualKeyboard_Keyboard"]{z-index:2147483647!important}
        .npLocalTvCard:focus,.npLocalTvCard.gpfocus,.npLocalTvTrack:focus,.npLocalTvTrack.gpfocus{transform:none!important}
        .npLocalTvCard{width:100%!important;min-width:0!important;max-width:100%!important;margin:0!important}
        .npLocalCoverButton:focus,.npLocalCoverButton.gpfocus{box-shadow:0 0 0 3px rgba(255,255,255,.88),0 0 0 6px rgba(217,163,55,.58),0 24px 70px rgba(0,0,0,.42)!important}
        .npLocalMinimalButton,.npLocalMinimalButton *{color:#fff!important}
        .npLocalMinimalButton:hover,.npLocalMinimalButton:focus,.npLocalMinimalButton.gpfocus{background:rgba(255,255,255,.13)!important;border-color:rgba(255,255,255,.25)!important;box-shadow:0 0 0 1px rgba(217,163,55,.34),0 0 20px rgba(217,163,55,.20)!important}
        .npLocalAppVolume{display:grid;grid-template-columns:84px minmax(0,1fr) 52px;align-items:center;gap:10px;width:100%;margin-top:14px;padding:8px 10px;border-radius:7px;border:1px solid transparent;background:rgba(255,255,255,.045);outline:none;overflow:hidden}
        .npLocalAppVolumeFocused,.npLocalAppVolume:focus-visible{border-color:rgba(217,163,55,.66);box-shadow:0 0 0 1px rgba(217,163,55,.22),0 0 18px rgba(217,163,55,.18)}
        .npLocalAppVolume input[type=range]{min-width:0;width:100%;height:18px;margin:0;padding:0;accent-color:${LOCAL_ACCENT}}
        .npLocalAppVolume input[type=range]::-webkit-slider-runnable-track{height:6px;border-radius:999px;background:rgba(255,255,255,.18)}
        .npLocalAppVolume input[type=range]::-webkit-slider-thumb{width:14px;height:14px;margin-top:-4px;border-radius:999px}
        .npLocalTvRow{scroll-padding-inline:0;overscroll-behavior-inline:contain}
        .npLocalTvRow::-webkit-scrollbar{display:none}
        .npLocalTvScroll::-webkit-scrollbar{width:7px;height:7px}
        .npLocalTvScroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,.16);border-radius:999px}
        .npLocalCustomTab,.npLocalCustomTab *{color:#fff!important}
        .npLocalCustomTab{border:1px solid rgba(255,255,255,.075)!important;background:rgba(255,255,255,.025)!important}
        .npLocalCustomTab:hover,.npLocalCustomTab:focus,.npLocalCustomTab.gpfocus{background:rgba(255,255,255,.13)!important;border-color:rgba(255,255,255,.25)!important;box-shadow:0 0 0 1px rgba(217,163,55,.34),0 0 20px rgba(217,163,55,.20)!important}
        .npLocalCustomTabActive{background:rgba(217,163,55,.18)!important;border-color:rgba(217,163,55,.48)!important}
        .npLocalTvScroll{position:absolute!important;inset:0!important;height:auto!important;min-height:0!important;overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior:contain}
        .npLocalArtistHero{position:absolute;top:-18px;left:-56px;width:100vw;aspect-ratio:16/9;background-position:center top;background-size:cover;background-repeat:no-repeat;pointer-events:none;z-index:-1}
        .npLocalArtistHero>div{position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.66),rgba(0,0,0,.04) 68%,rgba(0,0,0,.14)),linear-gradient(180deg,rgba(0,0,0,.02) 42%,rgba(0,0,0,.18) 62%,rgba(0,0,0,.78) 82%,#000 100%)}
        .npLocalPlayerGlow{animation:npLocalPlayerGlow 5.6s ease-in-out infinite alternate;transform-origin:50% 50%}@keyframes npLocalPlayerGlow{from{transform:scale(1.02);opacity:.28}to{transform:scale(1.12);opacity:.42}}
        .npLocalTabContent{animation:npLocalTabEnter 150ms ease both}@keyframes npLocalTabEnter{from{opacity:.78}to{opacity:1}}
      ` }), backgroundCover ? SP_JSX.jsx("div", { "aria-hidden": "true", style: { position: "absolute", inset: "-28%", background: `url(${backgroundCover}) center/cover`, filter: "blur(130px) saturate(1.42)", opacity: detail?.kind === "album" ? .46 : .34, zIndex: 0 } }) : null, SP_JSX.jsx("div", { "aria-hidden": "true", style: { position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: detail?.kind === "artist" ? "#000" : "linear-gradient(180deg,rgba(9,8,6,.30),#090806 86%)" } }), detail ? SP_JSX.jsx("main", { className: "npLocalTvScroll", style: { position: "absolute", inset: 0, overflowY: "auto", overflowX: "hidden", padding: "18px 56px 300px", scrollPaddingBottom: 250, zIndex: 2 }, children: SP_JSX.jsx("div", { style: { position: "relative", zIndex: 1 }, children: renderDetail() }) }) : SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(DFL.Focusable, { className: "npLocalCustomTabs", "flow-children": "horizontal", style: { position: "absolute", top: 24, left: 56, zIndex: 200, display: "flex", alignItems: "center", gap: 8 }, children: [["home", t.home, FaHome], ["search", t.search, FaSearch], ["library", t.library, FaList], ["settings", t.settings, FaCog]].map(([id, label, Icon]) => (SP_JSX.jsx(DFL.DialogButton, { className: `npLocalCustomTab${id !== "settings" && tab === id ? " npLocalCustomTabActive" : ""}`, onClick: () => id === "settings" ? onOpenSettings() : switchRootTab(id), style: { width: 138, minWidth: 138, height: 38, minHeight: 38, padding: 0 }, children: SP_JSX.jsxs("span", { style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: ".76em", fontWeight: 540 }, children: [SP_JSX.jsx(Icon, { size: 13 }), " ", label] }) }, id))) }), page(activeTabContent)] })] }));
}

const emptySnapshot = {
    selectedPlayer: "",
    currentPlayer: "",
    selected: null,
    players: [],
};
function playerSnapshotNeedsRender(previous, next, previousSampleAt, nextSampleAt) {
    if (!previous || !next)
        return previous !== next;
    const stableFields = [
        "id", "name", "title", "artist", "album", "status", "length",
        "canNext", "canPrevious", "canPlay", "canPause", "canTogglePlayPause",
        "canShuffle", "canRepeat", "shuffleActive", "repeatMode", "artworkUrl",
    ];
    if (stableFields.some((key) => previous[key] !== next[key]))
        return true;
    const elapsed = previous.status === "Playing" ? Math.max(0, nextSampleAt - previousSampleAt) : 0;
    const projected = Math.min(Number(previous.length || Number.MAX_SAFE_INTEGER), Number(previous.position || 0) + elapsed);
    const tolerance = previous.status === "Playing" ? 1600 : 300;
    return Math.abs(Number(next.position || 0) - projected) > tolerance;
}
function snapshotNeedsRender(previous, next, previousSampleAt, nextSampleAt) {
    if (previous.selectedPlayer !== next.selectedPlayer || previous.currentPlayer !== next.currentPlayer)
        return true;
    const previousPlayer = previous.selected ?? previous.players?.[0] ?? null;
    const nextPlayer = next.selected ?? next.players?.[0] ?? null;
    return playerSnapshotNeedsRender(previousPlayer, nextPlayer, previousSampleAt, nextSampleAt);
}
const CONTROL_GAP = 8;
const BUTTON_HEIGHT = 28;
const APP_SETTINGS_KEY = "nowPlaying.enabledApps";
const APP_SETTINGS_CHANGED_EVENT = "nowPlaying:source-changed";
const FULLSCREEN_EFFECT_SETTINGS_KEY = "nowPlaying.fullscreenEffect";
const FULLSCREEN_ROUTE = "/now-playing/fullscreen";
const SPOTIFY_BIG_PICTURE_ROUTE = "/now-playing/spotify-big-picture";
const LOCAL_MUSIC_BIG_PICTURE_ROUTE = "/now-playing/local-music-big-picture";
const FULLSCREEN_SETTINGS_ROUTE = "/now-playing/settings-fullscreen";
const FULLSCREEN_CHROME_STYLE_ID = "np-fullscreen-chrome-style";
const qamCenterRowStyle = {
    width: "calc(100% - 12px)",
    margin: "0 auto",
    boxSizing: "border-box",
    position: "relative",
    isolation: "isolate",
    overflow: "visible",
};
const centeredColumnStyle = {
    width: "100%",
    minWidth: "100%",
    maxWidth: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    overflow: "visible",
};
const controlsWrapStyle = {
    width: "100%",
    minWidth: "100%",
    maxWidth: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: `${CONTROL_GAP}px`,
};
const compactButtonStyle = {
    flex: 1,
    minWidth: 0,
    height: `${BUTTON_HEIGHT}px`,
    minHeight: `${BUTTON_HEIGHT}px`,
    padding: 0,
    lineHeight: 1,
};
const wideButtonStyle = {
    width: "100%",
    minWidth: "100%",
    maxWidth: "100%",
    height: `${BUTTON_HEIGHT}px`,
    minHeight: `${BUTTON_HEIGHT}px`,
    padding: 0,
    lineHeight: 1,
};
const splitWideButtonStyle = {
    flex: 1,
    minWidth: 0,
    height: `${BUTTON_HEIGHT}px`,
    minHeight: `${BUTTON_HEIGHT}px`,
    padding: 0,
    lineHeight: 1,
};
const buttonContentStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "0.86em",
    lineHeight: 1,
};
const settingsButtonContentStyle = {
    ...buttonContentStyle,
    width: "100%",
    justifyContent: "flex-start",
    padding: "0 10px",
    boxSizing: "border-box",
};
const settingsCheckStyle = {
    marginLeft: "auto",
    width: "16px",
    display: "inline-flex",
    justifyContent: "center",
};
const settingsGroupLabelStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "0 4px",
    fontSize: "0.72em",
    fontWeight: 700,
    lineHeight: 1.2,
    opacity: 0.64,
};
const subtleRowTextStyle = {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.72em",
    opacity: 0.66,
    marginTop: "3px",
};
const meterBoxStyle = {
    width: "100%",
    minWidth: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    overflow: "hidden",
};
const meterTrackStyle = {
    width: "100%",
    minWidth: "100%",
    maxWidth: "100%",
    height: "6px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.18)",
    overflow: "hidden",
    boxSizing: "border-box",
};
const meterFillBaseStyle = {
    height: "100%",
    borderRadius: "999px",
    background: "var(--np-accent, #66c0f4)",
    transition: "width 160ms linear",
};
const marqueeShellStyle = {
    width: "100%",
    maxWidth: "100%",
    overflow: "hidden",
    whiteSpace: "nowrap",
    boxSizing: "border-box",
};
function resolveTranslations() {
    return getTranslations("core");
}
function useTranslations() {
    return SP_REACT.useMemo(resolveTranslations, []);
}
function formatOpenAppLabel(template, app) {
    return formatTranslation(template, { app });
}
function appDisplayLabel(app, t) {
    if (app.key === "localMusic")
        return t.localMusicLabel;
    return app.label;
}
function appProgramLabel(app) {
    return app.label;
}
function sourceVolumeStorageKey(key) {
    return key === "spotify" ? "spotify" : String(key || "");
}
function formatEffectLabel(t, effect) {
    switch (effect) {
        case "glow":
            return t.effectGlow;
        case "ocean":
            return t.effectOcean;
        case "energySaver":
            return t.effectEnergySaver;
        case "coverBlur":
            return t.effectCoverBlur;
    }
}
const musicApps = [
    { key: "localMusic", label: "Your Music", Icon: FaMusic, open: openLocalMusic },
    { key: "spotify", label: "Spotify", Icon: SiSpotify, open: openSpotify },
    { key: "tidal", label: "Tidal", Icon: SiTidal, open: openTidal },
    { key: "appleMusic", label: "Apple Music", Icon: SiApplemusic, open: openAppleMusic },
    { key: "deezer", label: "Deezer", Icon: FaDeezer, open: openDeezer },
    { key: "amazonMusic", label: "Amazon Music", Icon: FaAmazon, open: openAmazonMusic },
    { key: "soundCloud", label: "SoundCloud", Icon: SiSoundcloud, open: openSoundCloud },
];
const SERVICE_ACCENTS = {
    spotify: "#1DB954",
    tidal: "#ffffff",
    appleMusic: "#FA243C",
    deezer: "#A238FF",
    amazonMusic: "#25D1DA",
    soundCloud: "#FF5500",
    localMusic: "#D9A337",
};
function accentForKey(key) {
    return (key && SERVICE_ACCENTS[key]) || "#66c0f4";
}
const defaultEnabledAppKeys = ["localMusic"];
const defaultSourceBehaviorSettings = { autoLaunch: true, closeOnSwitch: true };
const fullscreenEffects = [
    { key: "glow" },
    { key: "ocean" },
    { key: "coverBlur" },
    { key: "energySaver" },
];
const defaultFullscreenEffect = "glow";
function normalizeEnabledAppKeys(keys) {
    const knownKeys = new Set(musicApps.map((app) => app.key));
    const arr = (Array.isArray(keys) ? keys : [keys]);
    const found = arr.find((key) => typeof key === "string" && knownKeys.has(key));
    return [found ?? defaultEnabledAppKeys[0]];
}
function loadEnabledAppKeys() {
    if (typeof window === "undefined")
        return defaultEnabledAppKeys;
    try {
        const stored = window.localStorage.getItem(APP_SETTINGS_KEY);
        if (!stored)
            return defaultEnabledAppKeys;
        return normalizeEnabledAppKeys(JSON.parse(stored));
    }
    catch {
        return defaultEnabledAppKeys;
    }
}
function saveEnabledAppKeys(keys) {
    if (typeof window === "undefined")
        return;
    const normalized = normalizeEnabledAppKeys(keys);
    try {
        window.localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(normalized));
    }
    catch {
        // Local storage can be unavailable in some embedded contexts; the session state still works.
    }
    window.dispatchEvent(new CustomEvent(APP_SETTINGS_CHANGED_EVENT, { detail: normalized }));
}
function normalizeFullscreenEffect(effect) {
    return fullscreenEffects.some((option) => option.key === effect)
        ? effect
        : defaultFullscreenEffect;
}
function loadFullscreenEffect() {
    if (typeof window === "undefined")
        return defaultFullscreenEffect;
    try {
        return normalizeFullscreenEffect(window.localStorage.getItem(FULLSCREEN_EFFECT_SETTINGS_KEY));
    }
    catch {
        return defaultFullscreenEffect;
    }
}
function saveFullscreenEffect(effect) {
    if (typeof window === "undefined")
        return;
    try {
        window.localStorage.setItem(FULLSCREEN_EFFECT_SETTINGS_KEY, effect);
    }
    catch {
        // Local storage can be unavailable in some embedded contexts; the session state still works.
    }
}
function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
function directionFromKey(key) {
    if (key === "ArrowLeft" || key === "Left")
        return "left";
    if (key === "ArrowRight" || key === "Right")
        return "right";
    return null;
}
function directionFromGamepadButton(button) {
    if (button === DFL.GamepadButton.DIR_LEFT)
        return "left";
    if (button === DFL.GamepadButton.DIR_RIGHT)
        return "right";
    return null;
}
function formatTime(milliseconds) {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
function ScrollingText(props) {
    const textRef = SP_REACT.useRef(null);
    const [shouldScroll, setShouldScroll] = SP_REACT.useState(false);
    SP_REACT.useEffect(() => {
        const measure = () => {
            const element = textRef.current;
            const parent = element?.parentElement;
            if (!element || !parent)
                return;
            const overflow = element.scrollWidth - parent.clientWidth;
            setShouldScroll(overflow > 2);
            element.style.setProperty("--np-marq", (overflow > 2 ? -(overflow + 8) : 0) + "px");
        };
        measure();
        const timer = window.setTimeout(measure, 120);
        window.addEventListener("resize", measure);
        return () => {
            window.clearTimeout(timer);
            window.removeEventListener("resize", measure);
        };
    }, [props.text]);
    const duration = `${clamp(5 + props.text.length * 0.08, 7, 14)}s`;
    return (SP_JSX.jsx("div", { style: {
            ...marqueeShellStyle,
            WebkitMaskImage: shouldScroll
                ? "linear-gradient(90deg, transparent 0, black 14px, black calc(100% - 14px), transparent 100%)"
                : undefined,
            maskImage: shouldScroll
                ? "linear-gradient(90deg, transparent 0, black 14px, black calc(100% - 14px), transparent 100%)"
                : undefined,
        }, children: SP_JSX.jsx("div", { ref: textRef, style: {
                ...props.style,
                display: "inline-block",
                whiteSpace: "nowrap",
                animation: shouldScroll ? `inRiproduzioneMarquee ${duration} ease-in-out infinite alternate` : undefined,
                willChange: shouldScroll ? "transform" : undefined,
            }, children: props.text }) }));
}
function QamGlowLayer(props) {
    const { artUrl, playing, bottomFadeTop } = props;
    if (!artUrl || !artUrl.trim())
        return null;
    return (SP_JSX.jsxs("div", { className: "npQamGlowLayer", "aria-hidden": "true", children: [SP_JSX.jsx("div", { className: "npQamGlowAnchor", children: SP_JSX.jsx("div", { className: "npQamCoverHalo", style: { opacity: playing ? 0.5 : 0 }, children: SP_JSX.jsx("img", { src: artUrl, alt: "" }) }) }), SP_JSX.jsx("div", { className: "npQamGlowVeil npQamGlowVeilTop" }), SP_JSX.jsx("div", { className: "npQamGlowVeil npQamGlowVeilBottom", style: { top: `${Math.max(0, bottomFadeTop)}px` } })] }));
}
function CoverBox(props) {
    const { artUrl, onActivate, ariaLabel, placeholderIcon, showPlaceholder = true } = props;
    const outerStyle = {
        position: "relative",
        zIndex: 2,
        width: "80%",
        margin: "6px auto 4px",
    };
    const squareStyle = {
        position: "relative",
        width: "100%",
        height: 0,
        paddingBottom: "100%",
        borderRadius: "4px",
        overflow: "hidden",
        background: artUrl && artUrl.trim() ? undefined : "rgba(255,255,255,0.08)",
        boxShadow: artUrl && artUrl.trim()
            ? "0 14px 38px rgba(0,0,0,0.55)"
            : "0 14px 38px rgba(0,0,0,0.45)",
    };
    const artwork = (SP_JSX.jsx("div", { className: "npAlbumCoverArtwork", style: squareStyle, children: artUrl && artUrl.trim() ? (SP_JSX.jsx("img", { src: artUrl, alt: "", style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" } })) : showPlaceholder ? (SP_JSX.jsx("div", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }, children: placeholderIcon ?? SP_JSX.jsx(FaMusic, { size: 96 }) })) : null }));
    if (!onActivate)
        return SP_JSX.jsx("div", { style: outerStyle, children: artwork });
    return (SP_JSX.jsx(DFL.DialogButton, { className: "npAlbumCoverButton", noFocusRing: true, "aria-label": ariaLabel, style: {
            ...outerStyle,
            display: "block",
            minWidth: 0,
            maxWidth: "80%",
            minHeight: 0,
            height: "auto",
            padding: 0,
            border: 0,
            background: "transparent",
            lineHeight: 1,
        }, onClick: onActivate, children: artwork }));
}
function ProgressView(props) {
    const { current, snapshotAt } = props;
    const length = Math.max(1, current?.length ?? 1);
    const basePosition = current?.position ?? 0;
    return (SP_JSX.jsxs("div", { style: { ...meterBoxStyle, marginTop: "12px" }, children: [SP_JSX.jsx("div", { style: meterTrackStyle, children: SP_JSX.jsx(SmoothProgressFill, { position: basePosition, duration: length, playing: current?.status === "Playing", sampledAt: snapshotAt, style: meterFillBaseStyle }) }), SP_JSX.jsxs("div", { style: subtleRowTextStyle, children: [SP_JSX.jsx(SmoothProgressTime, { position: basePosition, duration: length, playing: current?.status === "Playing", sampledAt: snapshotAt, format: formatTime }), SP_JSX.jsx("span", { children: formatTime(length) })] })] }));
}
let fullscreenChromeObservers = [];
let fullscreenChromeFrame = 0;
let fullscreenSuppressionLeaseCount = 0;
let fullscreenSuppressionReleaseTimer = 0;
const fullscreenChromeRefreshTimers = new Set();
const fullscreenTransitionLeaseTimers = new Set();
const fullscreenChromeSelectors = [
    "#header",
    '[class*="BasicFooter"]',
    '[class*="FooterLegend"]',
    '[class*="QuickAccessFooter"]',
    '[class*="GamepadFooter"]',
    '[class*="GamepadHeader"]',
    '[class*="HeaderStatus"]',
    '[class*="StatusIcons"]',
    '[class*="TopBar"]',
    '[data-np-fullscreen-chrome="true"]',
];
function fullscreenSuppressionDocuments() {
    if (typeof document === "undefined")
        return [];
    const docs = [];
    const addDocument = (candidate) => {
        try {
            const next = candidate;
            if (next?.documentElement && !docs.includes(next))
                docs.push(next);
        }
        catch {
            // Ignore inaccessible Steam windows.
        }
    };
    const addWindowDocument = (candidate) => {
        if (!candidate)
            return;
        try {
            addDocument(candidate.document);
        }
        catch { }
        try {
            addDocument(candidate.window?.document);
        }
        catch { }
        try {
            addDocument(candidate.m_Window?.document);
        }
        catch { }
        try {
            addDocument(candidate.m_popup?.document);
        }
        catch { }
        try {
            addDocument(candidate.BrowserWindow?.document);
        }
        catch { }
        try {
            addDocument(candidate.GetWindow?.()?.document);
        }
        catch { }
    };
    addDocument(document);
    try {
        addDocument(window.top?.document);
    }
    catch { }
    try {
        addDocument(window.parent?.document);
    }
    catch { }
    try {
        addDocument(window.opener?.document);
    }
    catch { }
    const store = DFL.Router?.WindowStore;
    addWindowDocument(store?.GamepadUIMainWindowInstance);
    if (Array.isArray(store?.SteamUIWindows)) {
        store.SteamUIWindows.forEach(addWindowDocument);
    }
    return docs;
}
function ensureFullscreenChromeStyle(targetDocument = document) {
    const style = targetDocument.getElementById(FULLSCREEN_CHROME_STYLE_ID);
    const css = `
    html.npFullscreenActive #header,
    html.npFullscreenActive [class*="BasicFooter"],
    html.npFullscreenActive [class*="FooterLegend"],
    html.npFullscreenActive [class*="QuickAccessFooter"],
    html.npFullscreenActive [class*="GamepadFooter"],
    html.npFullscreenActive [class*="GamepadHeader"],
    html.npFullscreenActive [class*="HeaderStatus"],
    html.npFullscreenActive [class*="StatusIcons"],
    html.npFullscreenActive [class*="TopBar"],
    html.npFullscreenActive [data-np-fullscreen-chrome="true"],
    body.npFullscreenActive #header,
    body.npFullscreenActive [class*="BasicFooter"],
    body.npFullscreenActive [class*="FooterLegend"],
    body.npFullscreenActive [class*="QuickAccessFooter"],
    body.npFullscreenActive [class*="GamepadFooter"],
    body.npFullscreenActive [class*="GamepadHeader"],
    body.npFullscreenActive [class*="HeaderStatus"],
    body.npFullscreenActive [class*="StatusIcons"],
    body.npFullscreenActive [class*="TopBar"],
    body.npFullscreenActive [data-np-fullscreen-chrome="true"] {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
      transition: none !important;
      animation: none !important;
    }
  `;
    if (style) {
        style.textContent = css;
        return;
    }
    const nextStyle = targetDocument.createElement("style");
    nextStyle.id = FULLSCREEN_CHROME_STYLE_ID;
    nextStyle.textContent = css;
    targetDocument.head.appendChild(nextStyle);
}
function isSteamVirtualKeyboardElement(element) {
    let current = element;
    for (let depth = 0; current && depth < 10; depth += 1, current = current.parentElement) {
        const className = typeof current.className === "string" ? current.className : "";
        const identity = `${current.id || ""} ${className} ${current.getAttribute("data-featuretarget") || ""} ${current.getAttribute("aria-label") || ""}`.toLowerCase();
        if (identity.includes("virtualkeyboard")
            || identity.includes("virtual-keyboard")
            || identity.includes("onscreenkeyboard")
            || identity.includes("on-screen keyboard")
            || identity.includes("keyboardmodal")
            || identity.includes("keyboard_modal"))
            return true;
    }
    return false;
}
function hideElementImmediately(element) {
    element.dataset.npFullscreenChrome = "true";
    element.style.setProperty("display", "none", "important");
    element.style.setProperty("opacity", "0", "important");
    element.style.setProperty("visibility", "hidden", "important");
    element.style.setProperty("pointer-events", "none", "important");
    element.style.setProperty("transition", "none", "important");
    element.style.setProperty("animation", "none", "important");
}
function markFullscreenChrome(targetDocument = document) {
    if (!targetDocument.documentElement.classList.contains("npFullscreenActive"))
        return;
    targetDocument.querySelectorAll(fullscreenChromeSelectors.join(",")).forEach((element) => {
        if (!element.closest(".npFullscreenRoot") && !isSteamVirtualKeyboardElement(element))
            hideElementImmediately(element);
    });
    const targetWindow = targetDocument.defaultView ?? window;
    const viewportWidth = targetWindow.innerWidth;
    const viewportHeight = targetWindow.innerHeight;
    targetDocument.querySelectorAll("body *").forEach((element) => {
        if (element.closest(".npFullscreenRoot") || element.dataset.npFullscreenChrome === "true" || isSteamVirtualKeyboardElement(element))
            return;
        const rect = element.getBoundingClientRect();
        if (rect.width < viewportWidth * 0.45 || rect.height <= 0 || rect.height > 190)
            return;
        const computed = targetWindow.getComputedStyle(element);
        if (!/^(fixed|absolute|sticky)$/.test(computed.position))
            return;
        const touchesTop = rect.top <= 12 && rect.bottom <= 194;
        const touchesBottom = rect.bottom >= viewportHeight - 12 && rect.top >= viewportHeight - 194;
        if (touchesTop || touchesBottom)
            hideElementImmediately(element);
    });
}
function markAllFullscreenChrome() {
    fullscreenSuppressionDocuments().forEach((targetDocument) => {
        ensureFullscreenChromeStyle(targetDocument);
        targetDocument.documentElement.classList.add("npFullscreenActive");
        targetDocument.body?.classList.add("npFullscreenActive");
        markFullscreenChrome(targetDocument);
    });
}
function scheduleFullscreenChromeMark() {
    if (fullscreenChromeFrame)
        window.cancelAnimationFrame(fullscreenChromeFrame);
    fullscreenChromeFrame = window.requestAnimationFrame(() => {
        fullscreenChromeFrame = 0;
        markAllFullscreenChrome();
    });
}
function scheduleFullscreenChromeBurst() {
    fullscreenChromeRefreshTimers.forEach((timer) => window.clearTimeout(timer));
    fullscreenChromeRefreshTimers.clear();
    [50, 140, 320, 650, 1100].forEach((delay) => {
        const timer = window.setTimeout(() => {
            fullscreenChromeRefreshTimers.delete(timer);
            markAllFullscreenChrome();
        }, delay);
        fullscreenChromeRefreshTimers.add(timer);
    });
}
function activateFullscreenChromeSuppression() {
    if (typeof document === "undefined")
        return;
    markAllFullscreenChrome();
    fullscreenChromeObservers.forEach((observer) => observer.disconnect());
    fullscreenChromeObservers = [];
    fullscreenSuppressionDocuments().forEach((targetDocument) => {
        if (!targetDocument.body)
            return;
        const observer = new MutationObserver(scheduleFullscreenChromeMark);
        observer.observe(targetDocument.body, { childList: true, subtree: true });
        fullscreenChromeObservers.push(observer);
    });
    scheduleFullscreenChromeBurst();
}
function deactivateFullscreenChromeSuppression() {
    if (typeof document === "undefined")
        return;
    fullscreenChromeRefreshTimers.forEach((timer) => window.clearTimeout(timer));
    fullscreenChromeRefreshTimers.clear();
    fullscreenChromeObservers.forEach((observer) => observer.disconnect());
    fullscreenChromeObservers = [];
    if (fullscreenChromeFrame)
        window.cancelAnimationFrame(fullscreenChromeFrame);
    fullscreenChromeFrame = 0;
    fullscreenSuppressionDocuments().forEach((targetDocument) => {
        targetDocument.documentElement.classList.remove("npFullscreenActive");
        targetDocument.body?.classList.remove("npFullscreenActive");
        targetDocument.querySelectorAll('[data-np-fullscreen-chrome="true"]').forEach((element) => {
            delete element.dataset.npFullscreenChrome;
            element.style.removeProperty("display");
            element.style.removeProperty("opacity");
            element.style.removeProperty("visibility");
            element.style.removeProperty("pointer-events");
            element.style.removeProperty("transition");
            element.style.removeProperty("animation");
        });
    });
}
function retainFullscreenChromeSuppression() {
    fullscreenSuppressionLeaseCount += 1;
    if (fullscreenSuppressionReleaseTimer) {
        window.clearTimeout(fullscreenSuppressionReleaseTimer);
        fullscreenSuppressionReleaseTimer = 0;
    }
    activateFullscreenChromeSuppression();
}
function releaseFullscreenChromeSuppression() {
    fullscreenSuppressionLeaseCount = Math.max(0, fullscreenSuppressionLeaseCount - 1);
    if (fullscreenSuppressionLeaseCount > 0)
        return;
    if (fullscreenSuppressionReleaseTimer)
        window.clearTimeout(fullscreenSuppressionReleaseTimer);
    fullscreenSuppressionReleaseTimer = window.setTimeout(() => {
        fullscreenSuppressionReleaseTimer = 0;
        if (fullscreenSuppressionLeaseCount > 0)
            return;
        const stillMounted = fullscreenSuppressionDocuments().some((targetDocument) => Boolean(targetDocument.querySelector(".npFullscreenRoot")));
        if (!stillMounted)
            deactivateFullscreenChromeSuppression();
    }, 700);
}
function holdFullscreenChromeSuppressionForTransition(duration = 1800) {
    retainFullscreenChromeSuppression();
    const timer = window.setTimeout(() => {
        fullscreenTransitionLeaseTimers.delete(timer);
        releaseFullscreenChromeSuppression();
    }, duration);
    fullscreenTransitionLeaseTimers.add(timer);
}
function forceRestoreFullscreenChrome() {
    fullscreenTransitionLeaseTimers.forEach((timer) => window.clearTimeout(timer));
    fullscreenTransitionLeaseTimers.clear();
    if (fullscreenSuppressionReleaseTimer)
        window.clearTimeout(fullscreenSuppressionReleaseTimer);
    fullscreenSuppressionReleaseTimer = 0;
    fullscreenSuppressionLeaseCount = 0;
    deactivateFullscreenChromeSuppression();
}
function navigateBackFromBigPicture() {
    const mainWindow = DFL.Router.WindowStore?.GamepadUIMainWindowInstance ??
        DFL.Router.WindowStore?.SteamUIWindows?.[0];
    if (mainWindow?.NavigateBack)
        mainWindow.NavigateBack();
    else
        DFL.Navigation.NavigateBack();
    // Big Picture is the outermost plugin route. Restore Steam chrome immediately,
    // then repeat while Steam rebuilds its header/footer during the route transition.
    [0, 60, 180, 420, 900].forEach((delay) => window.setTimeout(forceRestoreFullscreenChrome, delay));
}
function navigateBackToQamFromSettings() {
    const mainWindow = DFL.Router.WindowStore?.GamepadUIMainWindowInstance ??
        DFL.Router.WindowStore?.SteamUIWindows?.[0];
    const back = () => {
        if (mainWindow?.NavigateBack)
            mainWindow.NavigateBack();
        else
            DFL.Navigation.NavigateBack();
    };
    back();
    window.setTimeout(back, 120);
    [0, 80, 220, 520, 1000].forEach((delay) => window.setTimeout(forceRestoreFullscreenChrome, delay));
}
function navigateToFullscreen() {
    // Keep suppression leased across the whole Steam route transition.
    holdFullscreenChromeSuppressionForTransition();
    markAllFullscreenChrome();
    try {
        DFL.Navigation.CloseSideMenus();
    }
    catch {
        // Older Decky/Steam builds can throw here; navigation below still works in most cases.
    }
    const mainWindow = DFL.Router.WindowStore?.GamepadUIMainWindowInstance ??
        DFL.Router.WindowStore?.SteamUIWindows?.[0];
    if (mainWindow?.Navigate) {
        mainWindow.Navigate(FULLSCREEN_ROUTE);
    }
    else {
        DFL.Navigation.Navigate(FULLSCREEN_ROUTE);
    }
    // Steam can rebuild the top/footer in the same task as navigation; suppress again immediately.
    markAllFullscreenChrome();
    queueMicrotask(markAllFullscreenChrome);
    window.requestAnimationFrame(markAllFullscreenChrome);
}
function navigateToSpotifyBigPicture() {
    holdFullscreenChromeSuppressionForTransition();
    markAllFullscreenChrome();
    try {
        DFL.Navigation.CloseSideMenus();
    }
    catch {
        // Navigation still works on Steam builds where side-menu closing is unavailable.
    }
    const mainWindow = DFL.Router.WindowStore?.GamepadUIMainWindowInstance ??
        DFL.Router.WindowStore?.SteamUIWindows?.[0];
    if (mainWindow?.Navigate) {
        mainWindow.Navigate(SPOTIFY_BIG_PICTURE_ROUTE);
    }
    else {
        DFL.Navigation.Navigate(SPOTIFY_BIG_PICTURE_ROUTE);
    }
    markAllFullscreenChrome();
    queueMicrotask(markAllFullscreenChrome);
    window.requestAnimationFrame(markAllFullscreenChrome);
}
function navigateToLocalMusicBigPicture() {
    holdFullscreenChromeSuppressionForTransition();
    markAllFullscreenChrome();
    try {
        DFL.Navigation.CloseSideMenus();
    }
    catch { }
    const mainWindow = DFL.Router.WindowStore?.GamepadUIMainWindowInstance ?? DFL.Router.WindowStore?.SteamUIWindows?.[0];
    if (mainWindow?.Navigate)
        mainWindow.Navigate(LOCAL_MUSIC_BIG_PICTURE_ROUTE);
    else
        DFL.Navigation.Navigate(LOCAL_MUSIC_BIG_PICTURE_ROUTE);
    markAllFullscreenChrome();
    queueMicrotask(markAllFullscreenChrome);
    window.requestAnimationFrame(markAllFullscreenChrome);
}
function navigateToFullscreenSettings() {
    holdFullscreenChromeSuppressionForTransition();
    markAllFullscreenChrome();
    try {
        DFL.Navigation.CloseSideMenus();
    }
    catch { }
    const mainWindow = DFL.Router.WindowStore?.GamepadUIMainWindowInstance ?? DFL.Router.WindowStore?.SteamUIWindows?.[0];
    if (mainWindow?.Navigate)
        mainWindow.Navigate(FULLSCREEN_SETTINGS_ROUTE);
    else
        DFL.Navigation.Navigate(FULLSCREEN_SETTINGS_ROUTE);
    markAllFullscreenChrome();
    queueMicrotask(markAllFullscreenChrome);
    window.requestAnimationFrame(markAllFullscreenChrome);
}
function navigateBackFromFullscreen() {
    holdFullscreenChromeSuppressionForTransition();
    markAllFullscreenChrome();
    const mainWindow = DFL.Router.WindowStore?.GamepadUIMainWindowInstance ??
        DFL.Router.WindowStore?.SteamUIWindows?.[0];
    if (mainWindow?.NavigateBack) {
        mainWindow.NavigateBack();
        return;
    }
    DFL.Navigation.NavigateBack();
}
function OceanLayer() {
    const canvasRef = SP_REACT.useRef(null);
    SP_REACT.useEffect(() => {
        if (typeof window === "undefined")
            return;
        const canvasElement = canvasRef.current;
        const canvasContext = canvasElement?.getContext("2d");
        if (!canvasElement || !canvasContext)
            return;
        const canvas = canvasElement;
        const context = canvasContext;
        let animationFrame = 0;
        let lastTime = 0;
        let elapsed = 0;
        let wave = 0;
        let width = 420;
        let height = 420;
        const lineCount = 40;
        const offset = Math.PI * 3.5;
        function resizeCanvas() {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            width = Math.max(1, Math.floor(rect.width));
            height = Math.max(1, Math.floor(rect.height));
            canvas.width = Math.max(1, Math.floor(width * dpr));
            canvas.height = Math.max(1, Math.floor(height * dpr));
            context.setTransform(dpr, 0, 0, dpr, 0, 0);
            context.imageSmoothingEnabled = false;
        }
        function drawLine(position) {
            const halfWidth = width / 2;
            const halfHeight = height / 2;
            const minWidth = halfWidth * 0.25;
            const lineWidth = minWidth + halfWidth * 0.75 * position;
            const lineHeight = Math.cos(wave + position * offset) * 4;
            const range = halfHeight * 0.9;
            const x = (width - minWidth) * (1 - position);
            const y = Math.sin(wave + position * offset) *
                (range / 2 + (range / 2) * position) +
                halfHeight;
            context.globalAlpha = 0.3 + 0.65 * (1 - position);
            context.fillRect(x, y, lineWidth, lineHeight);
        }
        function render(time) {
            if (!lastTime)
                lastTime = time;
            const delta = Math.min(48, time - lastTime) / 1000;
            lastTime = time;
            elapsed += delta;
            wave += delta * 1.02;
            const hue = (11 + elapsed * 5) % 360;
            const color = `hsl(${hue}, 100%, 63%)`;
            context.globalAlpha = 1;
            context.globalCompositeOperation = "source-over";
            context.clearRect(0, 0, width, height);
            context.save();
            context.shadowBlur = 10;
            context.shadowColor = color;
            context.fillStyle = color;
            for (let index = 0; index < lineCount; index += 1) {
                drawLine(index / lineCount);
            }
            context.restore();
            animationFrame = window.requestAnimationFrame(render);
        }
        resizeCanvas();
        animationFrame = window.requestAnimationFrame(render);
        window.addEventListener("resize", resizeCanvas);
        return () => {
            window.cancelAnimationFrame(animationFrame);
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);
    return (SP_JSX.jsx("div", { className: "npFullscreenEffectLayer npOceanLayer", "aria-hidden": "true", children: SP_JSX.jsx("canvas", { ref: canvasRef, className: "npOceanCanvas" }) }));
}
function FullscreenEffectLayer(props) {
    if (props.effect === "energySaver")
        return null;
    if (props.effect === "ocean") {
        return SP_JSX.jsx(OceanLayer, {});
    }
    if (props.effect === "coverBlur") {
        return (SP_JSX.jsx("div", { className: "npFullscreenEffectLayer npCoverBlurLayer", "aria-hidden": "true", children: props.coverUrl && props.coverUrl.trim() ? (SP_JSX.jsx("img", { src: props.coverUrl, className: "npCoverBlurImage" })) : null }));
    }
    return (SP_JSX.jsxs("div", { className: "npFullscreenEffectLayer npGlowLayer", "aria-hidden": "true", children: [SP_JSX.jsx("span", { className: "npFullscreenGlow" }), SP_JSX.jsx("span", { className: "npFullscreenGlow" })] }));
}
function FullscreenRoute() {
    const t = useTranslations();
    const [snapshot, setSnapshot] = SP_REACT.useState(emptySnapshot);
    const [fullscreenEffect] = SP_REACT.useState(loadFullscreenEffect);
    const [coverUrl, setCoverUrl] = SP_REACT.useState("");
    const [busy, setBusy] = SP_REACT.useState(false);
    const [fullscreenNow, setFullscreenNow] = SP_REACT.useState(() => new Date());
    const [fullscreenWeather, setFullscreenWeather] = SP_REACT.useState("");
    const refreshingRef = SP_REACT.useRef(false);
    const localMusicFullscreen = loadEnabledAppKeys()[0] === "localMusic";
    const current = SP_REACT.useMemo(() => snapshot.selected ?? snapshot.players?.[0] ?? null, [snapshot]);
    const title = current?.title?.trim() ? current.title : t.notPlaying;
    const artist = current?.artist?.trim() ? current.artist : " ";
    const album = current?.album?.trim() ? current.album : " ";
    const isPlaying = current?.status === "Playing";
    const canUsePrevious = !busy && !!current?.canPrevious;
    const canUsePlayPause = !busy && !!current;
    const canUseNext = !busy && !!current?.canNext;
    const fullscreenTime = fullscreenNow.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    async function refresh(_force = false) {
        if (refreshingRef.current)
            return;
        refreshingRef.current = true;
        try {
            if (localMusicFullscreen) {
                const local = localAudioPlayer.getSnapshot();
                const track = local.track;
                const artist = Array.isArray(track?.artists) ? track.artists.map((value) => value?.name).filter(Boolean).join(", ") : "";
                const player = track ? {
                    id: "localMusic", name: t.localMusicLabel, title: String(track?.name ?? ""), artist, album: String(track?.album?.name ?? ""),
                    status: local.status, length: Number(local.length || track?.duration_ms || 0), position: Number(local.position || 0), canNext: local.canNext, canPrevious: local.canPrevious,
                    canPlay: true, canPause: true, canTogglePlayPause: true, isSelected: true, isCurrent: true, canShuffle: true, canRepeat: true, shuffleActive: local.shuffleActive, repeatMode: local.repeatMode === "All" ? "List" : local.repeatMode === "One" ? "Track" : "Off",
                } : null;
                setSnapshot({ selectedPlayer: player?.id ?? "", currentPlayer: player?.id ?? "", selected: player, players: player ? [player] : [] });
            }
            else {
                setSnapshot(await getSnapshot());
            }
        }
        catch (error) {
            console.warn(t.refreshFailed, error);
        }
        finally {
            refreshingRef.current = false;
        }
    }
    async function runAction(action) {
        try {
            setBusy(true);
            await action();
        }
        finally {
            window.setTimeout(() => setBusy(false), 180);
        }
        void refresh(true);
        window.setTimeout(() => void refresh(true), 80);
        window.setTimeout(() => void refresh(true), 220);
    }
    SP_REACT.useEffect(() => {
        void refresh(true);
        const timer = window.setInterval(() => void refresh(false), 600);
        return () => window.clearInterval(timer);
    }, []);
    SP_REACT.useLayoutEffect(() => {
        retainFullscreenChromeSuppression();
        return () => releaseFullscreenChromeSuppression();
    }, []);
    SP_REACT.useEffect(() => {
        const readWeather = () => {
            const state = window.__deckyWeatherTopbarState;
            const stateLabel = typeof state?.label === "string" ? state.label.trim() : "";
            if (stateLabel)
                return stateLabel;
            const badge = document.getElementById("decky-weather-topbar-badge");
            const badgeLabel = badge?.textContent?.replace(/\s+/g, " ").trim() ?? "";
            return badgeLabel;
        };
        const update = () => {
            setFullscreenNow(new Date());
            setFullscreenWeather(readWeather());
        };
        update();
        const timer = window.setInterval(update, 1000);
        return () => window.clearInterval(timer);
    }, []);
    SP_REACT.useEffect(() => {
        const trackTitle = current?.title?.trim() ?? "";
        const trackArtist = current?.artist?.trim() ?? "";
        const trackAlbum = current?.album?.trim() ?? "";
        if (!trackTitle) {
            setCoverUrl("");
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                const localTrack = localMusicFullscreen ? localAudioPlayer.getSnapshot().track : null;
                const url = localTrack?.coverId
                    ? await getLocalMusicCover(String(localTrack.coverId))
                    : await getCover(trackTitle, trackArtist, trackAlbum);
                if (!cancelled)
                    setCoverUrl(url || "");
            }
            catch (error) {
                if (!cancelled)
                    console.warn(t.coverFailed, error);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [current?.title, current?.artist, current?.album, localMusicFullscreen, t.coverFailed]);
    return (SP_JSX.jsxs(DFL.Focusable, { onCancel: navigateBackFromFullscreen, onCancelButton: navigateBackFromFullscreen, style: {
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 2147483647,
            background: "#000",
            color: "#fff",
            overflow: "hidden",
            outline: "none",
        }, children: [SP_JSX.jsx("style", { children: `
        .npFullscreenRoot,
        .npFullscreenRoot * {
          box-sizing: border-box;
        }

        .npFullscreenRoot {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          z-index: 2147483647;
          background: #000;
          overflow: hidden;
          font-family: inherit;
        }

        html:has(.npFullscreenRoot) [class*="BasicFooter"],
        html:has(.npFullscreenRoot) [class*="FooterLegend"],
        html:has(.npFullscreenRoot) [class*="QuickAccessFooter"],
        html:has(.npFullscreenRoot) [class*="GamepadFooter"],
        html:has(.npFullscreenRoot) [class*="GamepadHeader"],
        html:has(.npFullscreenRoot) [class*="HeaderStatus"],
        html:has(.npFullscreenRoot) [class*="StatusIcons"],
        html:has(.npFullscreenRoot) [class*="TopBar"],
        html.npFullscreenActive [class*="BasicFooter"],
        html.npFullscreenActive [class*="FooterLegend"],
        html.npFullscreenActive [class*="QuickAccessFooter"],
        html.npFullscreenActive [class*="GamepadFooter"],
        html.npFullscreenActive [class*="GamepadHeader"],
        html.npFullscreenActive [class*="HeaderStatus"],
        html.npFullscreenActive [class*="StatusIcons"],
        html.npFullscreenActive [class*="TopBar"] {
          opacity: 0 !important;
          pointer-events: none !important;
          visibility: hidden !important;
          transition: none !important;
        }

        .npFullscreenEffectLayer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }

        .npFullscreenGlow {
          position: absolute;
          width: 58.8vw;
          height: 58.8vw;
          min-width: 588px;
          min-height: 588px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(185,119,0,0.36) 0%, rgba(185,119,0,0.16) 28%, rgba(185,119,0,0) 67%);
          filter: blur(40px);
          opacity: 0.94;
          animation:
            npFullscreenGlowDrift 18.5s ease-in-out infinite alternate,
            npFullscreenGlowHueWarm 58s linear infinite alternate;
          will-change: transform, filter;
        }

        .npFullscreenGlow:nth-child(1) {
          left: 7vw;
          top: -4vh;
        }

        .npFullscreenGlow:nth-child(2) {
          right: 3vw;
          top: 13vh;
          width: 49vw;
          height: 49vw;
          background: radial-gradient(circle, rgba(25,119,202,0.36) 0%, rgba(25,119,202,0.16) 28%, rgba(25,119,202,0) 67%);
          animation:
            npFullscreenGlowDrift 23.8s ease-in-out infinite alternate-reverse,
            npFullscreenGlowHueCool 64s linear infinite alternate;
          opacity: 0.74;
        }

        .npOceanLayer {
          background: #000;
        }

        .npOceanCanvas {
          position: absolute;
          left: 50%;
          top: 50%;
          width: min(42.5vw, 476px);
          height: min(42.5vw, 476px);
          transform: translate3d(10%, -50%, 0);
        }

        .npFullscreenNoise {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          opacity: 0.24;
          mix-blend-mode: screen;
          background-image:
            radial-gradient(circle, rgba(255,255,255,0.2) 0, rgba(255,255,255,0.2) 0.11px, transparent 0.23px),
            radial-gradient(circle, rgba(255,214,124,0.12) 0, rgba(255,214,124,0.12) 0.1px, transparent 0.22px),
            radial-gradient(circle, rgba(65,159,244,0.1) 0, rgba(65,159,244,0.1) 0.1px, transparent 0.22px);
          background-position: 0 0, 0.45px 0.65px, 0.9px 0.25px;
          background-size: 1px 1px, 1.25px 1.25px, 1.55px 1.55px;
        }

        .npCoverBlurLayer {
          background: #000;
        }

        .npCoverBlurImage {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 126vmax;
          height: 126vmax;
          max-width: none;
          object-fit: cover;
          border-radius: 999px;
          opacity: 0.78;
          filter: blur(70px) saturate(1.68) brightness(0.72);
          transform: translate3d(-50%, -50%, 0) rotate(0deg) scale(1.13);
          animation: npCoverBlurSpin 118s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          transform-origin: 50% 50%;
          -webkit-transform-style: preserve-3d;
          -webkit-mask-image: radial-gradient(circle, black 0%, black 48%, rgba(0,0,0,0.74) 62%, transparent 78%);
          mask-image: radial-gradient(circle, black 0%, black 48%, rgba(0,0,0,0.74) 62%, transparent 78%);
        }

        .npFullscreenStatus {
          position: absolute;
          left: clamp(64px, 5vw, 108px);
          top: clamp(42px, 5vh, 74px);
          z-index: 2;
          display: flex;
          align-items: baseline;
          gap: 0.55em;
          max-width: calc(100vw - 128px);
          font-size: clamp(22px, 1.75vw, 34px);
          line-height: 1.1;
          font-weight: 700;
          color: rgba(255,255,255,1);
          opacity: 1;
          text-shadow: 0 2px 18px rgba(0,0,0,0.58);
          mix-blend-mode: normal;
          white-space: nowrap;
        }

        .npFullscreenStatusWeather {
          font-weight: 400;
          opacity: 1;
        }

        .npFullscreenCover {
          position: absolute;
          left: clamp(64px, 5vw, 108px);
          bottom: clamp(76px, 8.4vh, 118px);
          width: clamp(170px, 13.6vw, 278px);
          height: clamp(170px, 13.6vw, 278px);
          border-radius: clamp(7px, 0.65vw, 12px);
          overflow: hidden;
          background: rgba(255,255,255,0.08);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.08);
          opacity: 0.82;
          z-index: 2;
        }

        .npFullscreenMeta {
          position: absolute;
          left: calc(clamp(64px, 5vw, 108px) + clamp(170px, 13.6vw, 278px) + clamp(28px, 2.2vw, 48px));
          right: clamp(64px, 7vw, 144px);
          top: calc(100vh - clamp(76px, 8.4vh, 118px) - clamp(170px, 13.6vw, 278px));
          transform: translateY(clamp(4px, 0.32vw, 7px));
          min-width: 0;
          z-index: 2;
        }

        .npFullscreenTitle {
          margin: 0 0 16px;
          font-size: clamp(34px, 3.1vw, 58px);
          line-height: 1.02;
          font-weight: 700;
          letter-spacing: 0;
          overflow-wrap: anywhere;
          color: rgba(255,255,255,1);
          opacity: 1;
          text-shadow: 0 2px 18px rgba(0,0,0,0.58);
          mix-blend-mode: normal;
        }

        .npFullscreenText {
          margin: 0;
          font-size: clamp(23px, 2vw, 38px);
          line-height: 1.2;
          letter-spacing: 0;
          color: rgba(255,255,255,1);
          opacity: 0.72;
          overflow-wrap: anywhere;
          text-shadow: 0 2px 16px rgba(0,0,0,0.54);
          mix-blend-mode: screen;
        }

        .npFullscreenAlbum {
          opacity: 0.5;
          font-size: clamp(20px, 1.8vw, 34px);
        }

        .npFullscreenControls {
          position: absolute;
          left: calc(clamp(64px, 5vw, 108px) + clamp(170px, 13.6vw, 278px) + clamp(28px, 2.2vw, 48px));
          bottom: clamp(76px, 8.4vh, 118px);
          display: flex;
          align-items: center;
          gap: clamp(12px, 1vw, 18px);
          opacity: 0.72;
          z-index: 2;
        }

        .npFullscreenControlButton {
          width: clamp(44px, 3.4vw, 68px) !important;
          min-width: clamp(44px, 3.4vw, 68px) !important;
          max-width: clamp(44px, 3.4vw, 68px) !important;
          height: clamp(38px, 2.75vw, 48px) !important;
          min-height: clamp(38px, 2.75vw, 48px) !important;
          max-height: clamp(38px, 2.75vw, 48px) !important;
          padding: 0 !important;
          line-height: 1;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex: 0 0 clamp(44px, 3.4vw, 68px) !important;
        }

        .npFullscreenControlButton svg {
          width: clamp(13px, 1.1vw, 20px);
          height: clamp(13px, 1.1vw, 20px);
          display: block;
          margin: 0;
        }

        @keyframes npFullscreenGlowDrift {
          from { transform: translate3d(-6vw, -3vh, 0) rotate(0deg) scale(0.92); }
          to { transform: translate3d(7vw, 5vh, 0) rotate(22deg) scale(1.08); }
        }

        @keyframes npFullscreenGlowHueWarm {
          from { filter: blur(40px) hue-rotate(0deg) saturate(1); }
          50% { filter: blur(40px) hue-rotate(34deg) saturate(1.12); }
          to { filter: blur(40px) hue-rotate(-18deg) saturate(1.08); }
        }

        @keyframes npFullscreenGlowHueCool {
          from { filter: blur(40px) hue-rotate(0deg) saturate(1); }
          50% { filter: blur(40px) hue-rotate(-58deg) saturate(1.18); }
          to { filter: blur(40px) hue-rotate(38deg) saturate(1.1); }
        }

        @keyframes npCoverBlurSpin {
          from { transform: translate3d(-50%, -50%, 0) rotate(0deg) scale(1.13); }
          to { transform: translate3d(-50%, -50%, 0) rotate(360deg) scale(1.13); }
        }

        @media (max-width: 980px), (max-height: 720px) {
          .npFullscreenGlow {
            min-width: 448px;
            min-height: 448px;
          }

          .npFullscreenCover {
            left: 42px;
            bottom: 74px;
            width: 154px;
            height: 154px;
          }

          .npFullscreenMeta {
            left: 226px;
            right: 42px;
            top: calc(100vh - 74px - 154px);
            transform: translateY(4px);
          }

          .npFullscreenTitle {
            margin-bottom: 10px;
            font-size: 30px;
          }

          .npFullscreenText {
            font-size: 21px;
          }

          .npFullscreenStatus {
            left: 42px;
            top: 34px;
            max-width: calc(100vw - 84px);
            font-size: 22px;
          }

          .npFullscreenControls {
            left: 226px;
            bottom: 74px;
            gap: 14px;
          }

          .npFullscreenControlButton {
            width: 44px !important;
            min-width: 44px !important;
            max-width: 44px !important;
            height: 35px !important;
            min-height: 35px !important;
            max-height: 35px !important;
            flex-basis: 44px !important;
          }
        }
      ` }), SP_JSX.jsxs("div", { className: "npFullscreenRoot", children: [SP_JSX.jsx(FullscreenEffectLayer, { effect: fullscreenEffect, coverUrl: coverUrl }), fullscreenEffect === "glow" || fullscreenEffect === "coverBlur" ? (SP_JSX.jsx("div", { className: "npFullscreenNoise", "aria-hidden": "true" })) : null, SP_JSX.jsxs("div", { className: "npFullscreenStatus", children: [SP_JSX.jsx("span", { children: fullscreenTime }), fullscreenWeather ? SP_JSX.jsx("span", { className: "npFullscreenStatusWeather", children: fullscreenWeather }) : null] }), SP_JSX.jsx("div", { className: "npFullscreenCover", children: coverUrl && coverUrl.trim() ? (SP_JSX.jsx("img", { src: coverUrl, alt: "", style: {
                                width: "100%",
                                height: "100%",
                                display: "block",
                                objectFit: "cover",
                            } })) : (SP_JSX.jsx("div", { style: {
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "rgba(255,255,255,0.07)",
                            }, children: SP_JSX.jsx(FaMusic, { size: 92 }) })) }), SP_JSX.jsxs("div", { className: "npFullscreenMeta", children: [SP_JSX.jsx("h1", { className: "npFullscreenTitle", children: title }), SP_JSX.jsx("p", { className: "npFullscreenText", children: artist }), SP_JSX.jsx("p", { className: "npFullscreenText npFullscreenAlbum", children: album })] }), SP_JSX.jsxs(DFL.Focusable, { className: "npFullscreenControls", "flow-children": "horizontal", children: [SP_JSX.jsx(DFL.DialogButton, { className: "npFullscreenControlButton", style: { opacity: canUsePrevious ? 1 : 0.38 }, disabled: !canUsePrevious, onClick: () => {
                                    if (canUsePrevious)
                                        void runAction(() => localMusicFullscreen ? localAudioPlayer.command("previous") : previousTrack());
                                }, children: SP_JSX.jsx(FaStepBackward, {}) }), SP_JSX.jsx(DFL.DialogButton, { className: "npFullscreenControlButton", style: { opacity: canUsePlayPause ? 1 : 0.38 }, disabled: !canUsePlayPause, onClick: () => {
                                    if (canUsePlayPause)
                                        void runAction(() => localMusicFullscreen ? localAudioPlayer.command("play_pause") : playPause());
                                }, children: isPlaying ? SP_JSX.jsx(FaPause, {}) : SP_JSX.jsx(FaPlay, {}) }), SP_JSX.jsx(DFL.DialogButton, { className: "npFullscreenControlButton", style: { opacity: canUseNext ? 1 : 0.38 }, disabled: !canUseNext, onClick: () => {
                                    if (canUseNext)
                                        void runAction(() => localMusicFullscreen ? localAudioPlayer.command("next") : nextTrack());
                                }, children: SP_JSX.jsx(FaStepForward, {}) })] })] })] }));
}
function SpotifyBigPictureRoute() {
    SP_REACT.useLayoutEffect(() => {
        retainFullscreenChromeSuppression();
        return () => releaseFullscreenChromeSuppression();
    }, []);
    return SP_JSX.jsx(SpotifyBigPicture, { onExit: navigateBackFromBigPicture, onOpenVisualizer: navigateToFullscreen, onOpenSettings: navigateToFullscreenSettings });
}
function LocalMusicBigPictureRoute() {
    SP_REACT.useLayoutEffect(() => {
        retainFullscreenChromeSuppression();
        return () => releaseFullscreenChromeSuppression();
    }, []);
    return SP_JSX.jsx(LocalMusicBigPicture, { onExit: navigateBackFromBigPicture, onOpenVisualizer: navigateToFullscreen, onOpenSettings: navigateToFullscreenSettings });
}
function FullscreenSettingsRoute() {
    const t = useTranslations();
    const [enabledAppKeys, setEnabledAppKeys] = SP_REACT.useState(loadEnabledAppKeys);
    const [coverSource, setCoverSourceState] = SP_REACT.useState("online");
    const [fullscreenEffect, setFullscreenEffectState] = SP_REACT.useState(loadFullscreenEffect);
    const [topbar, setTopbar] = SP_REACT.useState(false);
    const [topbarLeft, setTopbarLeft$1] = SP_REACT.useState(false);
    const [restartingServices, setRestartingServices] = SP_REACT.useState(false);
    const [exportingDiagnostics, setExportingDiagnostics] = SP_REACT.useState(false);
    const [sourceBehavior, setSourceBehavior] = SP_REACT.useState(defaultSourceBehaviorSettings);
    const initialServiceRef = SP_REACT.useRef(loadEnabledAppKeys()[0]);
    const sourceChangedRef = SP_REACT.useRef(false);
    const backLabel = t.back;
    const settingsLabel = t.settingsLabel;
    const topbarTrackLabel = t.topbarTrack;
    const topbarLeftLabel = t.topbarLeft;
    const leaveSettings = SP_REACT.useCallback(() => {
        if (sourceChangedRef.current)
            navigateBackToQamFromSettings();
        else
            navigateBackFromFullscreen();
    }, []);
    SP_REACT.useLayoutEffect(() => {
        retainFullscreenChromeSuppression();
        return () => releaseFullscreenChromeSuppression();
    }, []);
    SP_REACT.useEffect(() => {
        void getCoverSource().then((source) => setCoverSourceState(source === "windows" ? "windows" : "online")).catch(() => { });
        void getTopbarEnabled().then((value) => setTopbar(Boolean(value))).catch(() => { });
        void getTopbarLeft().then((value) => setTopbarLeft$1(Boolean(value))).catch(() => { });
        void getSourceBehaviorSettings().then(setSourceBehavior).catch(() => { });
    }, []);
    SP_REACT.useEffect(() => {
        const onKey = (event) => {
            if (event.key !== "Escape")
                return;
            event.preventDefault();
            event.stopPropagation();
            leaveSettings();
        };
        document.addEventListener("keydown", onKey, true);
        return () => document.removeEventListener("keydown", onKey, true);
    }, [leaveSettings]);
    const toggleApp = (key) => {
        if (key === "localMusic")
            void pauseExternalPlayback().catch(() => false);
        else
            localAudioPlayer.stop();
        const next = [key];
        sourceChangedRef.current = key !== initialServiceRef.current;
        setEnabledAppKeys(next);
        saveEnabledAppKeys(next);
        void reportDiagnosticEvent("settings", "source_selected", { source: key, surface: "big-picture-settings" }).catch(() => { });
        void setActiveService(key).catch((error) => {
            void reportDiagnosticEvent("settings", "source_select_failed", { source: key, error: String(error?.message ?? error) }).catch(() => { });
        });
    };
    const selectCover = (source) => {
        setCoverSourceState(source);
        void setCoverSource(source).catch(() => { });
    };
    const selectEffect = (effect) => {
        setFullscreenEffectState(effect);
        saveFullscreenEffect(effect);
    };
    const restartServices = async () => {
        if (restartingServices)
            return;
        setRestartingServices(true);
        toaster.toast({ title: "Now Playing", body: t.restartServicesInProgress, duration: 1800 });
        try {
            const result = await restartPluginServices();
            toaster.toast({
                title: "Now Playing",
                body: result?.ok
                    ? t.restartServicesSuccess
                    : `${t.restartServicesFailed}${result?.message ? `: ${localizeRuntimeMessage(result.message)}` : ""}`,
                duration: 3400,
            });
        }
        catch (error) {
            toaster.toast({
                title: "Now Playing",
                body: `${t.restartServicesFailed}: ${localizeRuntimeMessage(error?.message ?? String(error))}`,
                duration: 3600,
            });
        }
        finally {
            setRestartingServices(false);
        }
    };
    const exportDiagnostics = async () => {
        if (exportingDiagnostics)
            return;
        setExportingDiagnostics(true);
        try {
            const result = await exportDiagnosticLog();
            toaster.toast({
                title: "Now Playing",
                body: result?.ok
                    ? formatTranslation(t.diagnosticLogExported, { path: result.path || "Downloads" })
                    : `${t.diagnosticLogExportFailed}${result?.error ? `: ${result.error}` : ""}`,
                duration: result?.ok ? 5200 : 3800,
            });
        }
        catch (error) {
            toaster.toast({ title: "Now Playing", body: `${t.diagnosticLogExportFailed}: ${error?.message ?? String(error)}`, duration: 3800 });
        }
        finally {
            setExportingDiagnostics(false);
        }
    };
    const updateSourceBehavior = async (next) => {
        setSourceBehavior(next);
        try {
            setSourceBehavior(await setSourceBehaviorSettings(next.autoLaunch, next.closeOnSwitch));
        }
        catch {
            void getSourceBehaviorSettings().then(setSourceBehavior).catch(() => { });
        }
    };
    const card = {
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        borderRadius: "18px",
        border: "1px solid rgba(255,255,255,.10)",
        background: "linear-gradient(145deg,rgba(255,255,255,.085),rgba(255,255,255,.035))",
        backdropFilter: "blur(24px)",
        padding: "20px",
        boxShadow: "0 22px 70px rgba(0,0,0,.28)",
        overflow: "hidden",
    };
    const heading = { margin: "0 0 14px", fontSize: "20px", fontWeight: 650 };
    const optionButton = { width: "100%", minWidth: "100%", height: "46px", minHeight: "46px", marginBottom: "8px", padding: 0 };
    const optionContent = { width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "0 12px", boxSizing: "border-box", textAlign: "left" };
    return (SP_JSX.jsxs(DFL.Focusable, { className: "npFullscreenRoot npFullscreenSettings", "flow-children": "vertical", onCancel: leaveSettings, onCancelButton: leaveSettings, style: { position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: 2147483647, overflowY: "auto", overflowX: "hidden", background: "radial-gradient(circle at 10% 0%, rgba(217,163,55,.18), transparent 34%), radial-gradient(circle at 92% 0%, rgba(29,185,84,.13), transparent 30%), #090909", color: "#fff", padding: "28px 48px 120px", scrollPaddingBottom: 100 }, children: [SP_JSX.jsx("style", { children: `
        .npFullscreenSettings,.npFullscreenSettings *{box-sizing:border-box}
        .npFullscreenSettings button{transition:background 120ms ease,border-color 120ms ease,box-shadow 120ms ease!important}
        .npFullscreenSettings button:focus,.npFullscreenSettings button.gpfocus{transform:none!important;background:rgba(255,255,255,.13)!important;border-color:rgba(255,255,255,.26)!important;box-shadow:0 0 0 2px rgba(255,255,255,.72),0 0 22px rgba(255,255,255,.12)!important}
        .npFullscreenSettings .npSettingsShell{width:min(1680px,100%);margin:0 auto}
        .npFullscreenSettings .npSettingsGrid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:24px;align-items:start;width:100%}
        .npFullscreenSettings .npSettingsColumn{display:flex;flex-direction:column;gap:18px;min-width:0;width:100%}
        .npFullscreenSettings .npSettingsCard button,.npFullscreenSettings .npSettingsCard button *{color:#fff!important;text-align:left!important}
        .npFullscreenSettings .npSettingsCard button{font-size:16px!important}
        .npFullscreenSettings .npSettingsCard button>span{width:100%!important;box-sizing:border-box!important;justify-content:flex-start!important;text-align:left!important;font-size:1em!important;padding-left:12px!important;padding-right:12px!important}
        .npFullscreenSettings button.npLocalRemoveFolderButton>span{justify-content:center!important;padding:0!important}
        @media(max-width:1180px){.npFullscreenSettings .npSettingsGrid{grid-template-columns:1fr}}
      ` }), SP_JSX.jsxs("div", { className: "npSettingsShell", children: [SP_JSX.jsx(DFL.DialogButton, { className: "npLocalMinimalButton", style: { width: "112px", minWidth: "112px", height: "38px", marginBottom: "18px" }, onClick: leaveSettings, children: SP_JSX.jsxs("span", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" }, children: [SP_JSX.jsx(FaArrowLeft, { size: 12 }), " ", backLabel] }) }), SP_JSX.jsxs("div", { style: { marginBottom: "26px" }, children: [SP_JSX.jsx("h1", { style: { margin: 0, fontSize: "42px", letterSpacing: "-.035em" }, children: settingsLabel }), SP_JSX.jsx("div", { style: { marginTop: 4, opacity: .52 }, children: "Now Playing 2.1.0" })] }), SP_JSX.jsxs(DFL.Focusable, { className: "npSettingsGrid", "flow-children": "grid", children: [SP_JSX.jsxs(DFL.Focusable, { className: "npSettingsColumn", "flow-children": "vertical", children: [SP_JSX.jsxs("section", { className: "npSettingsCard", style: card, children: [SP_JSX.jsx("h2", { style: heading, children: t.settingsApps }), musicApps.map((app) => {
                                                const Icon = app.Icon;
                                                const active = enabledAppKeys[0] === app.key;
                                                return SP_JSX.jsx(DFL.DialogButton, { style: { ...optionButton, opacity: active ? 1 : .58 }, onClick: () => toggleApp(app.key), children: SP_JSX.jsxs("span", { style: optionContent, children: [SP_JSX.jsx(Icon, {}), SP_JSX.jsx("span", { children: appDisplayLabel(app, t) }), SP_JSX.jsx("span", { style: { marginLeft: "auto" }, children: active ? SP_JSX.jsx(FaCheck, {}) : null })] }) }, app.key);
                                            }), SP_JSX.jsx("div", { style: { margin: "14px 2px 7px", opacity: .62, lineHeight: 1.4 }, children: t.autoLaunchSourcesDescription }), SP_JSX.jsx(DFL.DialogButton, { style: { ...optionButton, opacity: sourceBehavior.autoLaunch ? 1 : .58 }, onClick: () => void updateSourceBehavior({ ...sourceBehavior, autoLaunch: !sourceBehavior.autoLaunch }), children: SP_JSX.jsxs("span", { style: optionContent, children: [SP_JSX.jsx("span", { children: t.autoLaunchSources }), SP_JSX.jsx("span", { style: { marginLeft: "auto" }, children: sourceBehavior.autoLaunch ? SP_JSX.jsx(FaCheck, {}) : null })] }) }), SP_JSX.jsx("div", { style: { margin: "8px 2px 7px", opacity: .62, lineHeight: 1.4 }, children: t.closeSourcesOnSwitchDescription }), SP_JSX.jsx(DFL.DialogButton, { style: { ...optionButton, opacity: sourceBehavior.closeOnSwitch ? 1 : .58 }, onClick: () => void updateSourceBehavior({ ...sourceBehavior, closeOnSwitch: !sourceBehavior.closeOnSwitch }), children: SP_JSX.jsxs("span", { style: optionContent, children: [SP_JSX.jsx("span", { children: t.closeSourcesOnSwitch }), SP_JSX.jsx("span", { style: { marginLeft: "auto" }, children: sourceBehavior.closeOnSwitch ? SP_JSX.jsx(FaCheck, {}) : null })] }) })] }), SP_JSX.jsxs("section", { className: "npSettingsCard", style: card, children: [SP_JSX.jsx("h2", { style: heading, children: t.settingsCoverSource }), ["online", "windows"].map((source) => {
                                                const active = coverSource === source;
                                                const label = source === "online" ? (t.coverSourceOnline) : (t.coverSourceWindows);
                                                return SP_JSX.jsx(DFL.DialogButton, { style: { ...optionButton, opacity: active ? 1 : .58 }, onClick: () => selectCover(source), children: SP_JSX.jsxs("span", { style: optionContent, children: [SP_JSX.jsx("span", { children: label }), SP_JSX.jsx("span", { style: { marginLeft: "auto" }, children: active ? SP_JSX.jsx(FaCheck, {}) : null })] }) }, source);
                                            })] }), SP_JSX.jsxs("section", { className: "npSettingsCard", style: card, children: [SP_JSX.jsx("h2", { style: heading, children: t.settingsFullscreenEffect }), fullscreenEffects.map((effect) => {
                                                const active = fullscreenEffect === effect.key;
                                                return SP_JSX.jsx(DFL.DialogButton, { style: { ...optionButton, opacity: active ? 1 : .58 }, onClick: () => selectEffect(effect.key), children: SP_JSX.jsxs("span", { style: optionContent, children: [SP_JSX.jsx("span", { children: formatEffectLabel(t, effect.key) }), SP_JSX.jsx("span", { style: { marginLeft: "auto" }, children: active ? SP_JSX.jsx(FaCheck, {}) : null })] }) }, effect.key);
                                            })] }), SP_JSX.jsxs("section", { className: "npSettingsCard", style: card, children: [SP_JSX.jsx("h2", { style: heading, children: t.topbarSection }), SP_JSX.jsx(DFL.DialogButton, { style: { ...optionButton, opacity: topbar ? 1 : .58 }, onClick: () => { const next = !topbar; setTopbar(next); void setTopbarEnabled(next); }, children: SP_JSX.jsxs("span", { style: optionContent, children: [SP_JSX.jsx("span", { children: topbarTrackLabel }), SP_JSX.jsx("span", { style: { marginLeft: "auto" }, children: topbar ? SP_JSX.jsx(FaCheck, {}) : null })] }) }), SP_JSX.jsx(DFL.DialogButton, { style: { ...optionButton, opacity: topbar && topbarLeft ? 1 : .58 }, disabled: !topbar, onClick: () => { const next = !topbarLeft; setTopbarLeft$1(next); void setTopbarLeft(next); }, children: SP_JSX.jsxs("span", { style: optionContent, children: [SP_JSX.jsx("span", { children: topbarLeftLabel }), SP_JSX.jsx("span", { style: { marginLeft: "auto" }, children: topbar && topbarLeft ? SP_JSX.jsx(FaCheck, {}) : null })] }) }), SP_JSX.jsx("div", { style: { margin: "12px 0 8px", opacity: .58, lineHeight: 1.4 }, children: t.restartServicesDescription }), SP_JSX.jsx(DFL.DialogButton, { style: optionButton, disabled: restartingServices, onClick: () => void restartServices(), children: SP_JSX.jsxs("span", { style: optionContent, children: [SP_JSX.jsx(FaSyncAlt, { className: restartingServices ? "npRestartSpin" : undefined }), " ", t.restartServices] }) }), SP_JSX.jsx("div", { style: { margin: "14px 0 8px", opacity: .58, lineHeight: 1.4 }, children: t.diagnosticLogDescription }), SP_JSX.jsx(DFL.DialogButton, { style: optionButton, disabled: exportingDiagnostics, onClick: () => void exportDiagnostics(), children: SP_JSX.jsxs("span", { style: optionContent, children: [SP_JSX.jsx(FaFileAlt, {}), " ", t.exportDiagnosticLog] }) })] })] }), SP_JSX.jsxs(DFL.Focusable, { className: "npSettingsColumn", "flow-children": "vertical", children: [SP_JSX.jsx("section", { className: "npSettingsCard", style: card, children: SP_JSX.jsx(LocalMusicSettingsPanel, { selectedService: enabledAppKeys[0] ?? "localMusic" }) }), SP_JSX.jsx("section", { className: "npSettingsCard", style: card, children: SP_JSX.jsx(SpotifyPlusSettingsPanel, { selectedService: enabledAppKeys[0] ?? "localMusic", onSettingsChanged: () => { } }) }), SP_JSX.jsx("section", { className: "npSettingsCard", style: card, children: SP_JSX.jsx(FanartSettingsPanel, {}) })] })] })] })] }));
}
function RepeatIcon(props) {
    const isTrack = props.repeatMode === "Track";
    return (SP_JSX.jsxs("span", { style: { position: "relative", display: "inline-flex", alignItems: "center" }, children: [SP_JSX.jsx(FaRedoAlt, {}), isTrack ? (SP_JSX.jsx("span", { style: {
                    position: "absolute",
                    right: "-6px",
                    bottom: "-6px",
                    fontSize: "0.64em",
                    fontWeight: 700,
                }, children: "1" })) : null] }));
}
function SettingsView(props) {
    const t = useTranslations();
    const enabled = new Set(props.enabledAppKeys);
    const [topbar, setTopbar] = SP_REACT.useState(false);
    const [topbarLeft, setTopbarLeft$1] = SP_REACT.useState(false);
    const [restartingServices, setRestartingServices] = SP_REACT.useState(false);
    const [exportingDiagnostics, setExportingDiagnostics] = SP_REACT.useState(false);
    const [sourceBehavior, setSourceBehavior] = SP_REACT.useState(defaultSourceBehaviorSettings);
    SP_REACT.useEffect(() => {
        let ok = true;
        getTopbarEnabled().then((v) => { if (ok)
            setTopbar(!!v); }).catch(() => { });
        getTopbarLeft().then((v) => { if (ok)
            setTopbarLeft$1(!!v); }).catch(() => { });
        getSourceBehaviorSettings().then((v) => { if (ok)
            setSourceBehavior(v); }).catch(() => { });
        return () => { ok = false; };
    }, []);
    SP_REACT.useEffect(() => {
        const handleEscape = (event) => {
            if (event.key !== "Escape")
                return;
            event.preventDefault();
            event.stopPropagation();
            props.onBack();
        };
        document.addEventListener("keydown", handleEscape, true);
        return () => document.removeEventListener("keydown", handleEscape, true);
    }, [props.onBack]);
    async function updateSourceBehavior(next) {
        setSourceBehavior(next);
        try {
            setSourceBehavior(await setSourceBehaviorSettings(next.autoLaunch, next.closeOnSwitch));
        }
        catch {
            void getSourceBehaviorSettings().then(setSourceBehavior).catch(() => { });
        }
    }
    async function restartPluginServices$1() {
        if (restartingServices)
            return;
        setRestartingServices(true);
        toaster.toast({ title: "Now Playing", body: t.restartServicesInProgress, duration: 1800 });
        try {
            const result = await restartPluginServices();
            toaster.toast({
                title: "Now Playing",
                body: result?.ok
                    ? (t.restartServicesSuccess)
                    : `${t.restartServicesFailed}${result?.message ? `: ${localizeRuntimeMessage(result.message)}` : ""}`,
                duration: 3200,
            });
        }
        catch (error) {
            toaster.toast({
                title: "Now Playing",
                body: `${t.restartServicesFailed}: ${localizeRuntimeMessage(error?.message ?? String(error))}`,
                duration: 3500,
            });
        }
        finally {
            setRestartingServices(false);
        }
    }
    async function exportDiagnostics() {
        if (exportingDiagnostics)
            return;
        setExportingDiagnostics(true);
        try {
            const result = await exportDiagnosticLog();
            toaster.toast({
                title: "Now Playing",
                body: result?.ok
                    ? formatTranslation(t.diagnosticLogExported, { path: result.path || "Downloads" })
                    : `${t.diagnosticLogExportFailed}${result?.error ? `: ${result.error}` : ""}`,
                duration: result?.ok ? 5200 : 3800,
            });
        }
        catch (error) {
            toaster.toast({ title: "Now Playing", body: `${t.diagnosticLogExportFailed}: ${error?.message ?? String(error)}`, duration: 3800 });
        }
        finally {
            setExportingDiagnostics(false);
        }
    }
    return (SP_JSX.jsxs(DFL.Focusable, { className: "npSettingsViewRoot", "flow-children": "vertical", onCancel: props.onBack, onCancelButton: props.onBack, style: { width: "100%" }, children: [SP_JSX.jsx("style", { children: `
        .npSettingsViewRoot button,.npSettingsViewRoot button *{color:#fff!important;text-align:left!important}
        .npSettingsViewRoot button{font-size:.82em!important}
        .npSettingsViewRoot button>span{width:100%!important;box-sizing:border-box!important;justify-content:flex-start!important;font-size:1em!important;padding-left:10px!important;padding-right:10px!important}
        .npSettingsViewRoot button.npSettingsBackButton>span{justify-content:center!important;padding:0!important}
        .npSettingsViewRoot button:hover,.npSettingsViewRoot button:focus,.npSettingsViewRoot button.gpfocus{color:#fff!important;background:rgba(255,255,255,.12)!important;border-color:rgba(255,255,255,.24)!important;box-shadow:0 0 0 1px rgba(255,255,255,.22),0 0 18px rgba(255,255,255,.10)!important}
      ` }), SP_JSX.jsx(DFL.PanelSection, { children: SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: qamCenterRowStyle, children: SP_JSX.jsxs("div", { style: { ...centeredColumnStyle, overflow: "visible" }, children: [SP_JSX.jsx(DFL.DialogButton, { className: "npSettingsBackButton", style: { ...wideButtonStyle, marginBottom: "10px" }, onClick: props.onBack, children: SP_JSX.jsxs("span", { style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }, children: [SP_JSX.jsx(FaArrowLeft, {}), " ", t.back] }) }), SP_JSX.jsx("div", { style: { ...settingsGroupLabelStyle, marginBottom: "6px" }, children: t.settingsApps }), SP_JSX.jsx(DFL.Focusable, { style: { ...centeredColumnStyle, gap: "6px" }, "flow-children": "vertical", children: musicApps.map((app) => {
                                        const Icon = app.Icon;
                                        const isEnabled = enabled.has(app.key);
                                        return (SP_JSX.jsx(DFL.DialogButton, { style: { ...wideButtonStyle, opacity: isEnabled ? 1 : 0.58 }, onClick: () => props.onToggleApp(app.key), children: SP_JSX.jsxs("span", { style: settingsButtonContentStyle, children: [SP_JSX.jsx(Icon, {}), SP_JSX.jsx("span", { children: appDisplayLabel(app, t) }), SP_JSX.jsx("span", { style: settingsCheckStyle, children: isEnabled ? SP_JSX.jsx(FaCheck, {}) : null })] }) }, app.key));
                                    }) }), SP_JSX.jsx("div", { style: { margin: "12px 3px 6px", fontSize: ".72em", lineHeight: 1.4, opacity: .58 }, children: t.autoLaunchSourcesDescription }), SP_JSX.jsx(DFL.DialogButton, { style: { ...wideButtonStyle, height: "54px", minHeight: "54px", lineHeight: 1.25, opacity: sourceBehavior.autoLaunch ? 1 : .58 }, onClick: () => void updateSourceBehavior({ ...sourceBehavior, autoLaunch: !sourceBehavior.autoLaunch }), children: SP_JSX.jsxs("span", { style: { ...settingsButtonContentStyle, minHeight: "54px", whiteSpace: "normal", lineHeight: 1.25 }, children: [SP_JSX.jsx("span", { children: t.autoLaunchSources }), SP_JSX.jsx("span", { style: settingsCheckStyle, children: sourceBehavior.autoLaunch ? SP_JSX.jsx(FaCheck, {}) : null })] }) }), SP_JSX.jsx("div", { style: { margin: "8px 3px 6px", fontSize: ".72em", lineHeight: 1.4, opacity: .58 }, children: t.closeSourcesOnSwitchDescription }), SP_JSX.jsx(DFL.DialogButton, { style: { ...wideButtonStyle, height: "54px", minHeight: "54px", lineHeight: 1.25, opacity: sourceBehavior.closeOnSwitch ? 1 : .58 }, onClick: () => void updateSourceBehavior({ ...sourceBehavior, closeOnSwitch: !sourceBehavior.closeOnSwitch }), children: SP_JSX.jsxs("span", { style: { ...settingsButtonContentStyle, minHeight: "54px", whiteSpace: "normal", lineHeight: 1.25 }, children: [SP_JSX.jsx("span", { children: t.closeSourcesOnSwitch }), SP_JSX.jsx("span", { style: settingsCheckStyle, children: sourceBehavior.closeOnSwitch ? SP_JSX.jsx(FaCheck, {}) : null })] }) }), SP_JSX.jsx(LocalMusicSettingsPanel, { selectedService: props.enabledAppKeys[0] ?? "localMusic" }), SP_JSX.jsx(SpotifyPlusSettingsPanel, { selectedService: props.enabledAppKeys[0] ?? "localMusic", onSettingsChanged: props.onSpotifySettingsChanged }), SP_JSX.jsx(FanartSettingsPanel, {}), SP_JSX.jsx("div", { style: { height: "12px" } }), SP_JSX.jsx("div", { style: { ...settingsGroupLabelStyle, marginBottom: "6px" }, children: t.settingsCoverSource }), SP_JSX.jsx(DFL.Focusable, { style: { ...centeredColumnStyle, gap: "6px" }, "flow-children": "vertical", children: ["online", "windows"].map((source) => {
                                        const isSelected = props.coverSource === source;
                                        const label = source === "online"
                                            ? (t.coverSourceOnline)
                                            : (t.coverSourceWindows);
                                        return (SP_JSX.jsx(DFL.DialogButton, { style: { ...wideButtonStyle, opacity: isSelected ? 1 : 0.58 }, onClick: () => props.onSelectCoverSource(source), children: SP_JSX.jsxs("span", { style: settingsButtonContentStyle, children: [SP_JSX.jsx("span", { children: label }), SP_JSX.jsx("span", { style: settingsCheckStyle, children: isSelected ? SP_JSX.jsx(FaCheck, {}) : null })] }) }, source));
                                    }) }), SP_JSX.jsx("div", { style: { height: "12px" } }), SP_JSX.jsx("div", { style: { ...settingsGroupLabelStyle, marginBottom: "6px" }, children: t.settingsFullscreenEffect }), SP_JSX.jsx(DFL.Focusable, { style: { ...centeredColumnStyle, gap: "6px" }, "flow-children": "vertical", children: fullscreenEffects.map((effect) => {
                                        const isSelected = props.fullscreenEffect === effect.key;
                                        return (SP_JSX.jsx(DFL.DialogButton, { style: { ...wideButtonStyle, opacity: isSelected ? 1 : 0.58 }, onClick: () => props.onSelectFullscreenEffect(effect.key), children: SP_JSX.jsxs("span", { style: settingsButtonContentStyle, children: [SP_JSX.jsx("span", { children: formatEffectLabel(t, effect.key) }), SP_JSX.jsx("span", { style: settingsCheckStyle, children: isSelected ? SP_JSX.jsx(FaCheck, {}) : null })] }) }, effect.key));
                                    }) }), SP_JSX.jsx("div", { style: { height: "12px" } }), SP_JSX.jsx("div", { style: { ...settingsGroupLabelStyle, marginBottom: "6px" }, children: t.topbarSection }), SP_JSX.jsxs(DFL.Focusable, { style: { ...centeredColumnStyle, gap: "6px" }, "flow-children": "vertical", children: [SP_JSX.jsx(DFL.DialogButton, { style: { ...wideButtonStyle, opacity: topbar ? 1 : 0.58 }, onClick: () => { const nv = !topbar; setTopbar(nv); void setTopbarEnabled(nv); }, children: SP_JSX.jsxs("span", { style: settingsButtonContentStyle, children: [SP_JSX.jsx("span", { children: t.topbarTrack }), SP_JSX.jsx("span", { style: settingsCheckStyle, children: topbar ? SP_JSX.jsx(FaCheck, {}) : null })] }) }), SP_JSX.jsx(DFL.DialogButton, { style: { ...wideButtonStyle, opacity: topbar && topbarLeft ? 1 : 0.58 }, disabled: !topbar, onClick: () => {
                                                const nv = !topbarLeft;
                                                setTopbarLeft$1(nv);
                                                void setTopbarLeft(nv);
                                            }, children: SP_JSX.jsxs("span", { style: settingsButtonContentStyle, children: [SP_JSX.jsx("span", { children: t.topbarLeft }), SP_JSX.jsx("span", { style: settingsCheckStyle, children: topbar && topbarLeft ? SP_JSX.jsx(FaCheck, {}) : null })] }) })] }), SP_JSX.jsx("div", { style: { height: "12px" } }), SP_JSX.jsx("div", { style: { ...settingsGroupLabelStyle, marginBottom: "6px" }, children: t.settingsRecovery }), SP_JSX.jsx("div", { style: {
                                        width: "100%",
                                        marginBottom: "6px",
                                        color: "rgba(255,255,255,0.62)",
                                        fontSize: "0.82em",
                                        lineHeight: 1.35,
                                    }, children: t.restartServicesDescription }), SP_JSX.jsx(DFL.DialogButton, { style: wideButtonStyle, disabled: restartingServices, onClick: () => void restartPluginServices$1(), children: SP_JSX.jsxs("span", { style: settingsButtonContentStyle, children: [SP_JSX.jsx(FaSyncAlt, { className: restartingServices ? "npRestartSpin" : undefined }), SP_JSX.jsx("span", { children: restartingServices ? t.restartServicesInProgress : t.restartServices })] }) }), SP_JSX.jsx("div", { style: { width: "100%", margin: "12px 0 6px", color: "rgba(255,255,255,0.62)", fontSize: "0.82em", lineHeight: 1.35 }, children: t.diagnosticLogDescription }), SP_JSX.jsx(DFL.DialogButton, { style: wideButtonStyle, disabled: exportingDiagnostics, onClick: () => void exportDiagnostics(), children: SP_JSX.jsxs("span", { style: settingsButtonContentStyle, children: [SP_JSX.jsx(FaFileAlt, {}), SP_JSX.jsx("span", { children: t.exportDiagnosticLog })] }) }), SP_JSX.jsx("style", { children: `
              @keyframes npRestartSpin { to { transform: rotate(360deg); } }
              .npRestartSpin { animation: npRestartSpin .8s linear infinite; }
            ` })] }) }) }) })] }));
}
function spotifyPlaybackToPlayer(payload) {
    const item = payload?.item;
    if (!item || !item?.name)
        return null;
    const artists = Array.isArray(item?.artists)
        ? item.artists.map((artist) => artist?.name).filter(Boolean).join(", ")
        : String(item?.show?.name ?? "");
    const repeat = String(payload?.repeat_state ?? "off");
    const images = item?.album?.images ?? item?.images ?? [];
    const artworkUrl = Array.isArray(images)
        ? String([...images].filter((entry) => entry?.url).sort((left, right) => {
            const leftSize = Number(left?.width || 0) * Number(left?.height || 0);
            const rightSize = Number(right?.width || 0) * Number(right?.height || 0);
            return rightSize - leftSize;
        })[0]?.url ?? "")
        : "";
    return {
        id: "spotify-api",
        name: "Spotify",
        title: String(item?.name ?? ""),
        artist: artists,
        album: String(item?.album?.name ?? item?.show?.name ?? ""),
        status: payload?.is_playing ? "Playing" : "Paused",
        length: Number(item?.duration_ms ?? 0),
        position: Number(payload?.progress_ms ?? 0),
        canNext: true,
        canPrevious: true,
        canPlay: true,
        canPause: true,
        canTogglePlayPause: true,
        isSelected: true,
        isCurrent: true,
        canShuffle: true,
        canRepeat: true,
        shuffleActive: Boolean(payload?.shuffle_state),
        repeatMode: repeat === "context" ? "List" : repeat === "track" ? "Track" : "Off",
        artworkUrl,
        volume: Number(payload?.device?.volume_percent ?? 100),
    };
}
function spotifyPausedPlayer(t) {
    return {
        id: "spotify-api-paused",
        name: "Spotify",
        title: t.apiPausedTitle,
        artist: t.apiPausedWait,
        album: "",
        status: "Paused",
        length: 0,
        position: 0,
        canNext: false,
        canPrevious: false,
        canPlay: false,
        canPause: false,
        canTogglePlayPause: false,
        isSelected: true,
        isCurrent: true,
        canShuffle: false,
        canRepeat: false,
        shuffleActive: false,
        repeatMode: "Off",
        artworkUrl: "",
        volume: getSavedSourceVolume("spotify", 100),
    };
}
function Content() {
    const t = useTranslations();
    const spotifyT = SP_REACT.useMemo(() => getTranslations("spotify"), []);
    const [showSettings, setShowSettings] = SP_REACT.useState(false);
    const [spotifyPlus, setSpotifyPlus] = SP_REACT.useState({
        enabled: false,
        clientId: "",
        redirectUri: "http://127.0.0.1:43821/callback",
        authenticated: false,
    });
    const [spotifySettingsReady, setSpotifySettingsReady] = SP_REACT.useState(false);
    const [spotifyApiStatus, setSpotifyApiStatus] = SP_REACT.useState({ active: false, remainingSeconds: 0, until: 0 });
    const [spotifyAlbumRequest, setSpotifyAlbumRequest] = SP_REACT.useState(null);
    const [localAlbumRequest, setLocalAlbumRequest] = SP_REACT.useState(null);
    const [enabledAppKeys, setEnabledAppKeys] = SP_REACT.useState(loadEnabledAppKeys);
    const [activeServiceReady, setActiveServiceReady] = SP_REACT.useState(false);
    const [coverSource, setCoverSource$1] = SP_REACT.useState("online");
    const [fullscreenEffect, setFullscreenEffect] = SP_REACT.useState(loadFullscreenEffect);
    const [snapshot, setSnapshot] = SP_REACT.useState(emptySnapshot);
    const [snapshotAt, setSnapshotAt] = SP_REACT.useState(Date.now());
    const [loading, setLoading] = SP_REACT.useState(true);
    const [busy, setBusy] = SP_REACT.useState(false);
    const [coverUrl, setCoverUrl] = SP_REACT.useState("");
    const [coverResolving, setCoverResolving] = SP_REACT.useState(false);
    const [appVolume, setAppVolume$1] = SP_REACT.useState(100);
    const [volumeReady, setVolumeReady] = SP_REACT.useState(false);
    const [activeAppRunning, setActiveAppRunning] = SP_REACT.useState(false);
    const [mediaVisible, setMediaVisible] = SP_REACT.useState(true);
    const [bottomGlowFadeTop, setBottomGlowFadeTop] = SP_REACT.useState(520);
    const qamRootRef = SP_REACT.useRef(null);
    const volumeWrapperRef = SP_REACT.useRef(null);
    const refreshingRef = SP_REACT.useRef(false);
    const mediaKeyRef = SP_REACT.useRef("");
    const volumeCommitTimerRef = SP_REACT.useRef(0);
    const volumeValueRef = SP_REACT.useRef(100);
    const volumeInteractionAtRef = SP_REACT.useRef(0);
    const volumeCommitInFlightRef = SP_REACT.useRef(false);
    const volumeCommitQueuedRef = SP_REACT.useRef(false);
    const volumeCommitRetryRef = SP_REACT.useRef(0);
    const coverRequestRef = SP_REACT.useRef(0);
    const coverClearTimerRef = SP_REACT.useRef(0);
    const coverCacheRef = SP_REACT.useRef(new Map());
    const coverUrlRef = SP_REACT.useRef("");
    const coverIdentityRef = SP_REACT.useRef("");
    const volumeObservedRef = SP_REACT.useRef({ value: -1, count: 0 });
    const spotifyPlaybackCacheRef = SP_REACT.useRef({ at: 0, player: null, lastValidAt: 0 });
    const spotifyApiPausedRef = SP_REACT.useRef(false);
    const sourceRefreshTimersRef = SP_REACT.useRef([]);
    const volumeApplyTimersRef = SP_REACT.useRef([]);
    const volumeAppliedRef = SP_REACT.useRef(false);
    const stableCurrentRef = SP_REACT.useRef(null);
    const sourceInteractionAtRef = SP_REACT.useRef(0);
    const snapshotRef = SP_REACT.useRef(emptySnapshot);
    const snapshotAtRef = SP_REACT.useRef(Date.now());
    SP_REACT.useEffect(() => {
        snapshotRef.current = snapshot;
    }, [snapshot]);
    SP_REACT.useEffect(() => {
        const syncSource = (event) => {
            const detail = event instanceof CustomEvent ? event.detail : undefined;
            const next = detail ? normalizeEnabledAppKeys(detail) : loadEnabledAppKeys();
            setEnabledAppKeys((previous) => previous[0] === next[0] ? previous : next);
        };
        window.addEventListener(APP_SETTINGS_CHANGED_EVENT, syncSource);
        window.addEventListener("focus", syncSource);
        return () => {
            window.removeEventListener(APP_SETTINGS_CHANGED_EVENT, syncSource);
            window.removeEventListener("focus", syncSource);
        };
    }, []);
    const activeServiceKey = enabledAppKeys[0] ?? "localMusic";
    SP_REACT.useEffect(() => {
        let cancelled = false;
        let timer = 0;
        const syncBackendSource = async () => {
            try {
                const service = await getActiveService();
                if (cancelled || !musicApps.some((app) => app.key === service))
                    return;
                if (Date.now() - sourceInteractionAtRef.current < 3000)
                    return;
                const next = service;
                setEnabledAppKeys((previous) => {
                    if (previous[0] === next)
                        return previous;
                    saveEnabledAppKeys([next]);
                    return [next];
                });
            }
            catch {
                // The saved frontend choice remains usable if the backend is reloading.
            }
            finally {
                if (!cancelled) {
                    setActiveServiceReady(true);
                    timer = window.setTimeout(() => void syncBackendSource(), 1800);
                }
            }
        };
        void syncBackendSource();
        return () => {
            cancelled = true;
            if (timer)
                window.clearTimeout(timer);
        };
    }, []);
    SP_REACT.useEffect(() => {
        if (activeServiceKey === "localMusic") {
            setActiveAppRunning(false);
            return;
        }
        let cancelled = false;
        const update = async () => {
            try {
                const running = await isMusicAppRunning(activeServiceKey);
                if (!cancelled)
                    setActiveAppRunning(Boolean(running));
            }
            catch {
                if (!cancelled)
                    setActiveAppRunning(false);
            }
        };
        void update();
        const timer = window.setInterval(() => void update(), 1600);
        return () => {
            cancelled = true;
            window.clearInterval(timer);
        };
    }, [activeServiceKey]);
    const rawCurrent = SP_REACT.useMemo(() => snapshot.selected ?? snapshot.players?.[0] ?? null, [snapshot]);
    const current = SP_REACT.useMemo(() => {
        const now = Date.now();
        const previous = stableCurrentRef.current;
        const hasIdentity = Boolean(rawCurrent?.title?.trim());
        if (rawCurrent && hasIdentity) {
            const sameTrack = previous?.service === activeServiceKey
                && previous.player.id === rawCurrent.id
                && previous.player.title === rawCurrent.title
                && previous.player.artist === rawCurrent.artist;
            const player = sameTrack
                ? {
                    ...previous.player,
                    ...rawCurrent,
                    artworkUrl: rawCurrent.artworkUrl || previous.player.artworkUrl,
                    album: rawCurrent.album || previous.player.album,
                }
                : rawCurrent;
            stableCurrentRef.current = { service: activeServiceKey, at: now, player };
            return player;
        }
        if (previous?.service === activeServiceKey && now - previous.at < 4200) {
            return rawCurrent
                ? {
                    ...previous.player,
                    ...rawCurrent,
                    title: previous.player.title,
                    artist: previous.player.artist,
                    album: previous.player.album,
                    artworkUrl: previous.player.artworkUrl,
                }
                : previous.player;
        }
        return rawCurrent;
    }, [rawCurrent, activeServiceKey]);
    const enabledApps = SP_REACT.useMemo(() => musicApps.filter((app) => app.key === activeServiceKey), [activeServiceKey]);
    SP_REACT.useEffect(() => {
        if (!activeServiceReady)
            return;
        let cancelled = false;
        sourceRefreshTimersRef.current.forEach((timer) => window.clearTimeout(timer));
        sourceRefreshTimersRef.current = [];
        const activeService = activeServiceKey;
        volumeAppliedRef.current = false;
        volumeApplyTimersRef.current.forEach((timer) => window.clearTimeout(timer));
        volumeApplyTimersRef.current = [];
        coverRequestRef.current += 1;
        spotifyPlaybackCacheRef.current = { at: 0, player: null, lastValidAt: 0 };
        stableCurrentRef.current = null;
        mediaKeyRef.current = "";
        setSnapshot(emptySnapshot);
        setCoverResolving(false);
        setMediaVisible(false);
        setLoading(true);
        // Enforce one playback source even when the setting changed from the
        // fullscreen route or while QAM was unmounted. The backend serializes app
        // lifecycle changes; the frontend only restores the local player snapshot.
        if (activeService === "localMusic") {
            const saved = getSavedSourceVolume("localMusic", localAudioPlayer.getSnapshot().volume);
            volumeValueRef.current = saved;
            setAppVolume$1(saved);
            setVolumeReady(true);
            void localAudioPlayer.initialize().then(() => localAudioPlayer.setVolume(saved));
        }
        else
            localAudioPlayer.stop();
        void setActiveService(activeService).then(() => {
            if (cancelled)
                return;
            setMediaVisible(true);
            sourceRefreshTimersRef.current = [0, 220, 650, 1400, 2800].map((delay) => window.setTimeout(() => {
                if (!cancelled)
                    void refresh(true);
            }, delay));
        }).catch(() => {
            if (!cancelled) {
                setMediaVisible(true);
                setLoading(false);
                void refresh(true);
            }
        });
        return () => {
            cancelled = true;
            sourceRefreshTimersRef.current.forEach((timer) => window.clearTimeout(timer));
            sourceRefreshTimersRef.current = [];
        };
    }, [activeServiceKey, activeServiceReady]);
    const mediaKey = `${current?.id ?? ""}|${current?.title ?? ""}|${current?.artist ?? ""}|${current?.album ?? ""}`;
    const spotifyApiActive = activeServiceKey === "spotify" && spotifySettingsReady && spotifyPlus.enabled && spotifyPlus.authenticated;
    const spotifyPaused = spotifyApiActive && spotifyApiStatus.active;
    const stableMediaKey = spotifyPaused ? "spotify-api-paused" : mediaKey;
    const spotifyCoverActive = spotifyApiActive && !spotifyPaused;
    const localCoverActive = activeServiceKey === "localMusic" && Boolean(current?.title);
    SP_REACT.useEffect(() => {
        const syncSharedSpotifyPlayback = (event) => {
            if (!spotifyApiActive)
                return;
            const detail = event instanceof CustomEvent ? event.detail : null;
            const player = detail && typeof detail === "object" ? detail : null;
            if (!player) {
                spotifyPlaybackCacheRef.current = { ...spotifyPlaybackCacheRef.current, at: 0 };
                return;
            }
            const now = getSharedSpotifyPlaybackTimestamp() || Date.now();
            spotifyPlaybackCacheRef.current = { at: now, player: { ...player }, lastValidAt: now };
            setSnapshot({ selectedPlayer: player.id, currentPlayer: player.id, selected: { ...player }, players: [{ ...player }] });
            setSnapshotAt(now);
        };
        window.addEventListener(SPOTIFY_PLAYBACK_CHANGED_EVENT, syncSharedSpotifyPlayback);
        return () => window.removeEventListener(SPOTIFY_PLAYBACK_CHANGED_EVENT, syncSharedSpotifyPlayback);
    }, [spotifyApiActive]);
    async function refresh(force = false) {
        if (refreshingRef.current)
            return;
        refreshingRef.current = true;
        try {
            if (activeServiceKey === "localMusic") {
                const local = localAudioPlayer.getSnapshot();
                const track = local.track;
                const artist = Array.isArray(track?.artists) ? track.artists.map((value) => value?.name).filter(Boolean).join(", ") : "";
                const player = track ? {
                    id: "localMusic",
                    name: t.localMusicLabel,
                    title: String(track?.name ?? ""),
                    artist,
                    album: String(track?.album?.name ?? ""),
                    status: local.status,
                    length: Number(local.length || track?.duration_ms || 0),
                    position: Number(local.position || 0),
                    canNext: local.canNext,
                    canPrevious: local.canPrevious,
                    canPlay: true,
                    canPause: true,
                    canTogglePlayPause: true,
                    isSelected: true,
                    isCurrent: true,
                    canShuffle: true,
                    canRepeat: true,
                    shuffleActive: local.shuffleActive,
                    repeatMode: local.repeatMode === "All" ? "List" : local.repeatMode === "One" ? "Track" : "Off",
                } : null;
                const nextSnapshot = { selectedPlayer: player?.id ?? "", currentPlayer: player?.id ?? "", selected: player, players: player ? [player] : [] };
                const sampledAt = Date.now();
                if (snapshotNeedsRender(snapshotRef.current, nextSnapshot, snapshotAtRef.current, sampledAt)) {
                    snapshotRef.current = nextSnapshot;
                    snapshotAtRef.current = sampledAt;
                    setSnapshot(nextSnapshot);
                    setSnapshotAt(sampledAt);
                }
            }
            else if (spotifyApiActive) {
                if (spotifyApiPausedRef.current) {
                    const paused = spotifyPausedPlayer(spotifyT);
                    setSnapshot({ selectedPlayer: paused.id, currentPlayer: paused.id, selected: paused, players: [paused] });
                    setSnapshotAt(Date.now());
                    return;
                }
                const now = Date.now();
                const shouldFetch = force || now - spotifyPlaybackCacheRef.current.at >= 5000;
                if (!shouldFetch)
                    return;
                try {
                    const apiState = await spotifyGetPlaybackState();
                    if (spotifyApiPausedRef.current)
                        return;
                    const apiPlayer = apiState?.ok ? spotifyPlaybackToPlayer(apiState.data) : null;
                    const previous = spotifyPlaybackCacheRef.current;
                    spotifyPlaybackCacheRef.current = apiPlayer
                        ? { at: now, player: apiPlayer, lastValidAt: now }
                        : { at: now, player: now - previous.lastValidAt <= 12000 ? previous.player : null, lastValidAt: previous.lastValidAt };
                    if (apiPlayer) {
                        // Publish a complete Spotify API payload atomically. Reusing the
                        // cached payload between polls avoids resetting progress to an old
                        // base position several times per second.
                        setSnapshot({ selectedPlayer: apiPlayer.id, currentPlayer: apiPlayer.id, selected: apiPlayer, players: [apiPlayer] });
                        setSnapshotAt(now);
                        publishSpotifyPlaybackSnapshot(apiPlayer);
                    }
                    else if (!spotifyPlaybackCacheRef.current.player) {
                        setSnapshot((previousSnapshot) => previousSnapshot.selected?.id === "spotify-api" ? emptySnapshot : previousSnapshot);
                        setSnapshotAt(now);
                    }
                }
                catch {
                    // Retain the latest complete API payload. Windows MediaBridge must
                    // never overwrite Spotify API metadata in API mode.
                }
            }
            else {
                const nextSnapshot = await getSnapshot();
                const sampledAt = Date.now();
                if (snapshotNeedsRender(snapshotRef.current, nextSnapshot, snapshotAtRef.current, sampledAt)) {
                    snapshotRef.current = nextSnapshot;
                    snapshotAtRef.current = sampledAt;
                    setSnapshot(nextSnapshot);
                    setSnapshotAt(sampledAt);
                }
            }
        }
        catch (error) {
            console.warn(t.refreshFailed, error);
        }
        finally {
            setLoading(false);
            refreshingRef.current = false;
        }
    }
    function patchCurrentPlayer(update) {
        setSnapshot((previous) => {
            const targetId = previous.selected?.id ?? previous.players?.[0]?.id ?? "";
            if (!targetId)
                return previous;
            const players = previous.players.map((player) => player.id === targetId ? update(player) : player);
            const selected = previous.selected?.id === targetId
                ? update(previous.selected)
                : (players.find((player) => player.id === targetId) ?? previous.selected);
            if (isSpotifyApiActive && selected)
                publishSpotifyPlaybackSnapshot(selected);
            return { ...previous, selected, players };
        });
        setSnapshotAt(Date.now());
    }
    const isLocalMusicActive = enabledAppKeys[0] === "localMusic";
    const isSpotifyApiActive = spotifyApiActive;
    function previousAction() {
        return isLocalMusicActive ? localAudioPlayer.command("previous") : isSpotifyApiActive ? spotifyPlayerCommand("previous") : previousTrack();
    }
    function playPauseAction() {
        return isLocalMusicActive
            ? localAudioPlayer.command("play_pause")
            : isSpotifyApiActive
                ? spotifyPlayerCommand(current?.status === "Playing" ? "pause" : "play")
                : playPause();
    }
    function nextAction() {
        return isLocalMusicActive ? localAudioPlayer.command("next") : isSpotifyApiActive ? spotifyPlayerCommand("next") : nextTrack();
    }
    function shuffleAction() {
        return isLocalMusicActive ? localAudioPlayer.command("shuffle") : isSpotifyApiActive ? spotifyPlayerCommand("shuffle") : shuffle();
    }
    function repeatAction() {
        return isLocalMusicActive ? localAudioPlayer.command("repeat") : isSpotifyApiActive ? spotifyPlayerCommand("repeat") : repeat();
    }
    async function runAction(action, optimistic, spotifyRefreshDelays = [260, 900, 1800]) {
        const blockUi = !isSpotifyApiActive;
        if (blockUi)
            setBusy(true);
        optimistic?.();
        const pending = action();
        const delays = isSpotifyApiActive ? spotifyRefreshDelays : [45, 130, 320, 720, 1450];
        delays.forEach((delay) => {
            window.setTimeout(() => void refresh(true), delay);
        });
        try {
            await pending;
        }
        finally {
            if (blockUi)
                window.setTimeout(() => setBusy(false), 120);
        }
    }
    async function openMusicApp(app) {
        await runAction(app.open);
        [200, 700, 1500].forEach((delay) => window.setTimeout(() => {
            void isMusicAppRunning(app.key).then((running) => setActiveAppRunning(Boolean(running))).catch(() => { });
        }, delay));
    }
    async function closeMusicApp$1(app) {
        setBusy(true);
        try {
            await closeMusicApp(app.key);
            setActiveAppRunning(false);
            window.setTimeout(() => void refresh(true), 180);
        }
        finally {
            window.setTimeout(() => setBusy(false), 120);
        }
    }
    function toggleEnabledApp(key) {
        sourceInteractionAtRef.current = Date.now();
        if (key === "localMusic") {
            void pauseExternalPlayback().catch(() => false);
        }
        else {
            localAudioPlayer.stop();
        }
        setEnabledAppKeys(() => {
            const next = [key];
            saveEnabledAppKeys(next);
            return next;
        });
    }
    function selectCoverSource(source) {
        void setCoverSource(source)
            .then((saved) => setCoverSource$1(saved))
            .catch(() => setCoverSource$1(source));
    }
    function selectFullscreenEffect(effect) {
        setFullscreenEffect(effect);
        saveFullscreenEffect(effect);
    }
    async function openCurrentSpotifyAlbum() {
        if (enabledAppKeys[0] !== "spotify" || !spotifyPlus.enabled || !spotifyPlus.authenticated || !current)
            return;
        try {
            const result = await spotifyGetCurrentAlbum(current.title?.trim() ?? "", current.artist?.trim() ?? "", current.album?.trim() ?? "");
            if (!result?.ok)
                throw new Error(result?.error || getTranslations("runtime").openCurrentSpotifyAlbumFailed);
            const albumItem = result.data?.album;
            const albumId = String(albumItem?.id ?? "");
            if (!albumId)
                throw new Error(getTranslations("runtime").currentSpotifyAlbumUnavailable);
            setSpotifyAlbumRequest({
                id: albumId,
                title: String(albumItem?.name ?? current.album ?? t.unknownAlbum),
                nonce: Date.now(),
            });
        }
        catch (error) {
            toaster.toast({
                title: "Spotify",
                body: localizeRuntimeMessage(error?.message ?? String(error)),
                duration: 3500,
            });
        }
    }
    async function openCurrentLocalAlbum() {
        if (enabledAppKeys[0] !== "localMusic")
            return;
        try {
            const track = localAudioPlayer.getSnapshot().track;
            const albumItem = track?.album;
            const albumId = String(albumItem?.id ?? "");
            if (!albumId)
                throw new Error(getTranslations("runtime").currentLocalAlbumUnavailable);
            setLocalAlbumRequest({
                id: albumId,
                title: String(albumItem?.name ?? current?.album ?? t.unknownAlbum),
                nonce: Date.now(),
            });
        }
        catch (error) {
            toaster.toast({
                title: t.localMusicLabel,
                body: localizeRuntimeMessage(error?.message ?? String(error)),
                duration: 3000,
            });
        }
    }
    SP_REACT.useEffect(() => {
        let cancelled = false;
        getSpotifySettings()
            .then((settings) => {
            if (!cancelled) {
                setSpotifyPlus(settings);
                setSpotifySettingsReady(true);
            }
        })
            .catch(() => {
            if (!cancelled)
                setSpotifySettingsReady(true);
        });
        return () => {
            cancelled = true;
        };
    }, []);
    SP_REACT.useEffect(() => {
        if (!spotifyApiActive) {
            spotifyApiPausedRef.current = false;
            setSpotifyApiStatus({ active: false, remainingSeconds: 0, until: 0 });
            return;
        }
        let cancelled = false;
        const updateStatus = async () => {
            try {
                const status = await getSpotifyApiStatus();
                if (cancelled)
                    return;
                const wasPaused = spotifyApiPausedRef.current;
                spotifyApiPausedRef.current = Boolean(status.active);
                setSpotifyApiStatus((previous) => (previous.active === status.active
                    && previous.remainingSeconds === status.remainingSeconds
                    && previous.until === status.until
                    ? previous
                    : status));
                if (status.active && !wasPaused) {
                    const paused = spotifyPausedPlayer(spotifyT);
                    spotifyPlaybackCacheRef.current = { at: Date.now(), player: null, lastValidAt: 0 };
                    setMediaVisible(true);
                    setLoading(false);
                    setSnapshot({ selectedPlayer: paused.id, currentPlayer: paused.id, selected: paused, players: [paused] });
                    setSnapshotAt(Date.now());
                }
                else if (!status.active && wasPaused) {
                    spotifyPlaybackCacheRef.current = { at: 0, player: null, lastValidAt: 0 };
                    void refresh(true);
                }
            }
            catch {
                // This is a local status read; preserve the previous state on a transient RPC error.
            }
        };
        void updateStatus();
        const timer = window.setInterval(() => void updateStatus(), 1000);
        return () => {
            cancelled = true;
            window.clearInterval(timer);
        };
    }, [spotifyApiActive]);
    SP_REACT.useEffect(() => {
        if (!spotifySettingsReady && activeServiceKey === "spotify")
            return;
        let cancelled = false;
        volumeApplyTimersRef.current.forEach((timer) => window.clearTimeout(timer));
        volumeApplyTimersRef.current = [];
        volumeAppliedRef.current = false;
        const fallback = activeServiceKey === "localMusic" ? localAudioPlayer.getSnapshot().volume : 100;
        const saved = getSavedSourceVolume(sourceVolumeStorageKey(activeServiceKey), fallback);
        volumeValueRef.current = saved;
        setAppVolume$1(saved);
        setVolumeReady(activeServiceKey === "localMusic");
        const initializeVolume = async () => {
            if (cancelled)
                return;
            try {
                if (activeServiceKey === "localMusic") {
                    await localAudioPlayer.initialize();
                    if (cancelled)
                        return;
                    localAudioPlayer.setVolume(volumeValueRef.current);
                    volumeAppliedRef.current = true;
                    setVolumeReady(true);
                    return;
                }
                const startedAt = Date.now();
                const result = await getAppVolume(activeServiceKey);
                if (cancelled || volumeInteractionAtRef.current > startedAt)
                    return;
                if (result?.ok) {
                    const actual = clamp(result.volume, 0, 100);
                    volumeValueRef.current = actual;
                    setAppVolume$1(actual);
                    saveSourceVolume(sourceVolumeStorageKey(activeServiceKey), actual, "observed");
                    volumeAppliedRef.current = true;
                    setVolumeReady(true);
                    return;
                }
            }
            catch {
                // The player may still be creating its Windows audio session.
            }
            if (cancelled || (spotifyApiActive && spotifyApiPausedRef.current))
                return;
            try {
                const applied = await setAppVolume(volumeValueRef.current, activeServiceKey);
                if (!cancelled && applied?.ok && !applied.stale) {
                    volumeAppliedRef.current = true;
                    setVolumeReady(true);
                }
            }
            catch {
                if (!cancelled)
                    setVolumeReady(false);
            }
        };
        const delays = activeServiceKey === "localMusic"
            ? [0]
            : [0, 1400, 4200];
        volumeApplyTimersRef.current = delays.map((delay) => window.setTimeout(() => void initializeVolume(), delay));
        return () => {
            cancelled = true;
            volumeApplyTimersRef.current.forEach((timer) => window.clearTimeout(timer));
            volumeApplyTimersRef.current = [];
        };
    }, [activeServiceKey, spotifyApiActive, spotifySettingsReady]);
    SP_REACT.useEffect(() => {
        if (activeServiceKey !== "localMusic")
            return;
        return localAudioPlayer.subscribe(() => {
            void refresh(true);
        });
    }, [activeServiceKey]);
    SP_REACT.useEffect(() => {
        const syncVolume = (event) => {
            const detail = event instanceof CustomEvent ? event.detail : null;
            if (!detail || String(detail.source || "") !== sourceVolumeStorageKey(activeServiceKey))
                return;
            const next = clamp(Number(detail.volume), 0, 100);
            if (detail.origin !== "observed")
                volumeInteractionAtRef.current = Date.now();
            volumeValueRef.current = next;
            setAppVolume$1(next);
            setVolumeReady(true);
        };
        window.addEventListener(SOURCE_VOLUME_CHANGED_EVENT, syncVolume);
        return () => window.removeEventListener(SOURCE_VOLUME_CHANGED_EVENT, syncVolume);
    }, [activeServiceKey]);
    SP_REACT.useEffect(() => {
        let cancelled = false;
        getCoverSource()
            .then((source) => {
            if (!cancelled)
                setCoverSource$1(source === "windows" ? "windows" : "online");
        })
            .catch(() => {
            if (!cancelled)
                setCoverSource$1("online");
        });
        return () => {
            cancelled = true;
        };
    }, []);
    SP_REACT.useEffect(() => {
        void refresh(true);
        const timer = window.setInterval(() => {
            void refresh(false);
        }, 900);
        return () => window.clearInterval(timer);
    }, [activeServiceKey]);
    SP_REACT.useEffect(() => {
        let cancelled = false;
        const refreshVolume = async () => {
            if (!volumeAppliedRef.current)
                return;
            if (volumeCommitTimerRef.current || volumeCommitInFlightRef.current)
                return;
            if (Date.now() - volumeInteractionAtRef.current < 800)
                return;
            const startedAt = Date.now();
            try {
                const result = isLocalMusicActive
                    ? { ok: true, volume: localAudioPlayer.getSnapshot().volume }
                    : await getAppVolume(activeServiceKey);
                const userChangedVolumeWhileReading = volumeInteractionAtRef.current > startedAt;
                if (!cancelled && result?.ok && !userChangedVolumeWhileReading) {
                    const next = clamp(result.volume, 0, 100);
                    const displayed = volumeValueRef.current;
                    const differs = Math.abs(next - displayed) > 2;
                    if (result.origin !== "spotify-connect" && differs && Date.now() - volumeInteractionAtRef.current < 15000) {
                        if (!volumeCommitInFlightRef.current && !volumeCommitTimerRef.current) {
                            volumeCommitRetryRef.current = 0;
                            volumeCommitTimerRef.current = window.setTimeout(() => {
                                volumeCommitTimerRef.current = 0;
                                flushAppVolumeCommit();
                            }, 80);
                        }
                        return;
                    }
                    if (differs) {
                        const observed = volumeObservedRef.current;
                        volumeObservedRef.current = observed.value === next
                            ? { value: next, count: observed.count + 1 }
                            : { value: next, count: 1 };
                        // A newly-created Windows/Connect session can briefly report 100.
                        // Accept an external change only after two matching observations;
                        // plugin-originated changes arrive immediately through the shared event.
                        if (volumeObservedRef.current.count < 2)
                            return;
                    }
                    else {
                        volumeObservedRef.current = { value: next, count: 0 };
                    }
                    volumeValueRef.current = next;
                    setAppVolume$1(next);
                    setVolumeReady(true);
                    saveSourceVolume(sourceVolumeStorageKey(activeServiceKey), next, "observed");
                }
            }
            catch {
                if (!cancelled && volumeInteractionAtRef.current <= startedAt)
                    setVolumeReady(false);
            }
        };
        const initialTimer = window.setTimeout(() => void refreshVolume(), 5200);
        const timer = window.setInterval(() => void refreshVolume(), 5000);
        return () => {
            cancelled = true;
            window.clearTimeout(initialTimer);
            window.clearInterval(timer);
        };
    }, [activeServiceKey, isLocalMusicActive, isSpotifyApiActive]);
    function flushAppVolumeCommit() {
        if (volumeCommitInFlightRef.current) {
            volumeCommitQueuedRef.current = true;
            return;
        }
        const requested = volumeValueRef.current;
        volumeCommitQueuedRef.current = false;
        volumeCommitInFlightRef.current = true;
        const pendingVolume = isLocalMusicActive
            ? Promise.resolve({ ok: true, volume: localAudioPlayer.setVolume(requested).volume })
            : setAppVolume(requested, activeServiceKey);
        void pendingVolume
            .then((result) => {
            if (!result?.ok) {
                setVolumeReady(false);
                return;
            }
            if ("stale" in result && result.stale)
                return;
            volumeAppliedRef.current = true;
            setVolumeReady(true);
            // Do not snap the thumb backwards if a newer key/gamepad repeat arrived
            // while AppVolumeBridge was applying the previous value.
            if (volumeValueRef.current === requested) {
                const confirmed = clamp(result.volume, 0, 100);
                // Some Windows audio sessions briefly report their creation default
                // (100) while the requested value is already being applied. Never
                // feed that transient value back into the renderer or the UI.
                if (Math.abs(confirmed - requested) <= 2) {
                    volumeCommitRetryRef.current = 0;
                    volumeValueRef.current = confirmed;
                    setAppVolume$1(confirmed);
                }
                else if (volumeCommitRetryRef.current < 3) {
                    volumeCommitRetryRef.current += 1;
                    volumeCommitQueuedRef.current = true;
                }
            }
        })
            .catch(() => setVolumeReady(false))
            .finally(() => {
            volumeCommitInFlightRef.current = false;
            if (volumeCommitQueuedRef.current || volumeValueRef.current !== requested) {
                volumeCommitQueuedRef.current = false;
                volumeCommitTimerRef.current = window.setTimeout(() => {
                    volumeCommitTimerRef.current = 0;
                    flushAppVolumeCommit();
                }, 80);
            }
        });
    }
    function changeAppVolume(nextVolume) {
        const next = clamp(Math.round(nextVolume), 0, 100);
        volumeValueRef.current = next;
        volumeInteractionAtRef.current = Date.now();
        volumeObservedRef.current = { value: next, count: 0 };
        volumeCommitRetryRef.current = 0;
        setAppVolume$1(next);
        setVolumeReady(true);
        saveSourceVolume(sourceVolumeStorageKey(activeServiceKey), next);
        if (volumeCommitInFlightRef.current) {
            volumeCommitQueuedRef.current = true;
            return;
        }
        if (volumeCommitTimerRef.current)
            window.clearTimeout(volumeCommitTimerRef.current);
        volumeCommitTimerRef.current = window.setTimeout(() => {
            volumeCommitTimerRef.current = 0;
            flushAppVolumeCommit();
        }, 35);
    }
    function nudgeAppVolume(delta) {
        changeAppVolume(volumeValueRef.current + delta);
    }
    function handleVolumeKeyDown(event) {
        const direction = directionFromKey(event.key);
        if (!direction)
            return;
        event.preventDefault();
        event.stopPropagation();
        nudgeAppVolume(direction === "right" ? 1 : -1);
    }
    function handleVolumeButtonDown(event) {
        const direction = directionFromGamepadButton(event?.detail?.button);
        if (!direction)
            return;
        event.preventDefault?.();
        event.stopPropagation?.();
        nudgeAppVolume(direction === "right" ? 1 : -1);
    }
    SP_REACT.useEffect(() => {
        return () => {
            if (volumeCommitTimerRef.current)
                window.clearTimeout(volumeCommitTimerRef.current);
        };
    }, []);
    function handleSettingsBack() {
        setShowSettings(false);
        setLoading(true);
        setMediaVisible(false);
        window.setTimeout(() => {
            void refresh(true);
            setMediaVisible(true);
        }, 0);
    }
    SP_REACT.useEffect(() => {
        // Keep the current media fully visible while the next artwork is preloaded.
        // Toggling opacity here caused repeated flashes as metadata and cover
        // responses completed at slightly different times.
        if (!mediaKeyRef.current) {
            mediaKeyRef.current = stableMediaKey;
            setMediaVisible(true);
            return;
        }
        if (mediaKeyRef.current === stableMediaKey)
            return;
        mediaKeyRef.current = stableMediaKey;
        setMediaVisible(true);
    }, [stableMediaKey]);
    SP_REACT.useEffect(() => {
        const title = current?.title?.trim() ?? "";
        const artist = current?.artist?.trim() ?? "";
        const album = current?.album?.trim() ?? "";
        const activeService = activeServiceKey;
        const key = `${activeService}|${title.toLocaleLowerCase()}|${artist.toLocaleLowerCase()}`;
        if (!title) {
            coverRequestRef.current += 1;
            setCoverResolving(false);
            if (!coverClearTimerRef.current) {
                coverClearTimerRef.current = window.setTimeout(() => {
                    coverClearTimerRef.current = 0;
                    coverUrlRef.current = "";
                    coverIdentityRef.current = "";
                    setCoverUrl("");
                }, 1800);
            }
            return;
        }
        if (coverClearTimerRef.current) {
            window.clearTimeout(coverClearTimerRef.current);
            coverClearTimerRef.current = 0;
        }
        // Playback status, progress, shuffle, repeat, volume and late album metadata
        // must never reload the artwork for the same visible track.
        if (coverIdentityRef.current === key && coverUrlRef.current) {
            setCoverResolving(false);
            return;
        }
        const immediateArtwork = String(current?.artworkUrl ?? "");
        const requestId = coverRequestRef.current + 1;
        coverRequestRef.current = requestId;
        let cancelled = false;
        const commitPreloadedCover = (url) => {
            if (!url || (coverIdentityRef.current === key && url === coverUrlRef.current)) {
                setCoverResolving(false);
                return;
            }
            setCoverResolving(true);
            const image = new Image();
            image.onload = () => {
                if (cancelled || requestId !== coverRequestRef.current)
                    return;
                if (coverCacheRef.current.has(key))
                    coverCacheRef.current.delete(key);
                coverCacheRef.current.set(key, url);
                while (coverCacheRef.current.size > 160) {
                    const oldest = coverCacheRef.current.keys().next().value;
                    if (oldest === undefined)
                        break;
                    coverCacheRef.current.delete(oldest);
                }
                coverUrlRef.current = url;
                coverIdentityRef.current = key;
                setCoverUrl(url);
                setCoverResolving(false);
            };
            image.onerror = () => {
                if (!cancelled && requestId === coverRequestRef.current)
                    setCoverResolving(false);
            };
            image.src = url;
        };
        if (spotifyCoverActive && immediateArtwork) {
            commitPreloadedCover(immediateArtwork);
            return () => { cancelled = true; };
        }
        const cached = coverCacheRef.current.get(key);
        if (cached) {
            setCoverResolving(false);
            coverUrlRef.current = cached;
            coverIdentityRef.current = key;
            setCoverUrl(cached);
            return;
        }
        setCoverResolving(true);
        (async () => {
            try {
                const localTrack = activeServiceKey === "localMusic" ? localAudioPlayer.getSnapshot().track : null;
                const url = localTrack?.coverId
                    ? await getLocalMusicCover(String(localTrack.coverId))
                    : await getCoverForService(activeService, title, artist, album);
                if (cancelled || requestId !== coverRequestRef.current)
                    return;
                if (!url) {
                    setCoverResolving(false);
                    return;
                }
                commitPreloadedCover(url);
            }
            catch (error) {
                if (!cancelled) {
                    setCoverResolving(false);
                    console.warn(t.coverFailed, error);
                }
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [current?.title, current?.artist, current?.album, current?.artworkUrl, coverSource, spotifyCoverActive, activeServiceKey, t.coverFailed]);
    SP_REACT.useEffect(() => () => {
        if (coverClearTimerRef.current)
            window.clearTimeout(coverClearTimerRef.current);
    }, []);
    SP_REACT.useLayoutEffect(() => {
        const root = qamRootRef.current;
        const volume = volumeWrapperRef.current;
        if (!root || !volume)
            return;
        let frame = 0;
        const update = () => {
            if (frame)
                window.cancelAnimationFrame(frame);
            frame = window.requestAnimationFrame(() => {
                frame = 0;
                const rootRect = root.getBoundingClientRect();
                const volumeRect = volume.getBoundingClientRect();
                setBottomGlowFadeTop(Math.max(0, Math.round(volumeRect.top - rootRect.top - 4)));
            });
        };
        update();
        window.addEventListener("resize", update);
        const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
        observer?.observe(root);
        observer?.observe(volume);
        return () => {
            if (frame)
                window.cancelAnimationFrame(frame);
            window.removeEventListener("resize", update);
            observer?.disconnect();
        };
    }, [coverUrl, current?.title, snapshot.players.length, enabledApps.length]);
    const title = current?.title?.trim() ? current.title : t.notPlaying;
    const artist = current?.artist?.trim() ? current.artist : " ";
    const album = spotifyPaused
        ? formatTime(Math.max(0, Number(spotifyApiStatus.remainingSeconds || 0)) * 1000)
        : current?.album?.trim() ? current.album : " ";
    const isPlaying = current?.status === "Playing";
    const isShuffleActive = current?.shuffleActive === true;
    const repeatMode = current?.repeatMode || "None";
    const repeatActive = !["", "None", "Off"].includes(repeatMode);
    const controlsDisabled = loading || spotifyPaused;
    const mediaTransitionStyle = {
        opacity: mediaVisible ? 1 : 0.28,
        transform: mediaVisible ? "translateY(0)" : "translateY(2px)",
        transition: "opacity 160ms ease, transform 160ms ease",
    };
    if (showSettings) {
        return (SP_JSX.jsx(SettingsView, { enabledAppKeys: enabledAppKeys, coverSource: coverSource, fullscreenEffect: fullscreenEffect, onBack: handleSettingsBack, onSelectCoverSource: selectCoverSource, onSelectFullscreenEffect: selectFullscreenEffect, onToggleApp: toggleEnabledApp, onSpotifySettingsChanged: setSpotifyPlus }));
    }
    return (SP_JSX.jsxs(DFL.PanelSection, { children: [SP_JSX.jsx("style", { children: `
        @keyframes inRiproduzioneMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(var(--np-marq, 0px)); }
        }
        @keyframes npQamHaloSpin {
          from { transform: translate3d(-50%, -50%, 0) rotate(0deg); }
          to { transform: translate3d(-50%, -50%, 0) rotate(360deg); }
        }
        .npQamGlowLayer {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: visible;
          pointer-events: none;
        }
        .npQamGlowAnchor {
          position: absolute;
          left: 50%;
          top: 6px;
          width: 80%;
          aspect-ratio: 1 / 1;
          transform: translateX(-50%);
          overflow: visible;
        }
        .npQamCoverHalo {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 439%;
          height: 439%;
          border-radius: 999px;
          overflow: hidden;
          transform: translate3d(-50%, -50%, 0);
          transform-origin: 50% 50%;
          transition: opacity 520ms ease;
          animation: npQamHaloSpin 32s linear infinite;
          will-change: transform, opacity;
          -webkit-mask-image: radial-gradient(circle, #000 0%, #000 31%, rgba(0,0,0,0.84) 47%, rgba(0,0,0,0.38) 61%, transparent 76%, transparent 100%);
          mask-image: radial-gradient(circle, #000 0%, #000 31%, rgba(0,0,0,0.84) 47%, rgba(0,0,0,0.38) 61%, transparent 76%, transparent 100%);
        }
        .npQamCoverHalo img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          border-radius: inherit;
          filter: blur(58px) saturate(1.68);
          transform: scale(1.06);
        }
        .npQamGlowVeil {
          pointer-events: none;
          z-index: 1;
        }
        .npQamGlowVeilTop {
          position: fixed;
          left: 0;
          right: 0;
          top: 0;
          height: 220px;
          background: linear-gradient(180deg, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.88) 42%, rgba(0,0,0,0.48) 68%, rgba(0,0,0,0) 100%);
        }
        .npQamGlowVeilBottom {
          position: absolute;
          left: -32px;
          right: -32px;
          bottom: -220px;
          min-height: 420px;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0.48) 62px, rgba(0,0,0,0.9) 132px, #000 210px, #000 100%);
        }
        .npAlbumCoverButton {
          transition: transform 140ms ease, filter 140ms ease;
        }
        .npAlbumCoverButton .npAlbumCoverArtwork {
          transition: box-shadow 140ms ease, outline-color 140ms ease;
          outline: 2px solid transparent;
          outline-offset: 3px;
        }
        .npAlbumCoverButton:focus,
        .npAlbumCoverButton.gpfocus {
          transform: scale(1.012);
          filter: drop-shadow(0 0 10px color-mix(in srgb, var(--np-accent, #1DB954) 32%, transparent));
        }
        .npAlbumCoverButton:focus .npAlbumCoverArtwork,
        .npAlbumCoverButton.gpfocus .npAlbumCoverArtwork {
          outline-color: color-mix(in srgb, var(--np-accent, #1DB954) 78%, white 8%);
          box-shadow: 0 14px 38px rgba(0,0,0,0.55), 0 0 0 1px color-mix(in srgb, var(--np-accent, #1DB954) 42%, transparent);
        }
        .npAppVolume {
          box-sizing: border-box;
          display: grid;
          grid-template-columns: 78px minmax(0, 1fr) 42px;
          align-items: center;
          gap: 8px;
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 6px 8px;
          border-radius: 6px;
          border: 1px solid transparent;
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.82);
          font-size: 0.86em;
          line-height: 1.15;
          outline: none;
          overflow: hidden;
        }
        .npAppVolume.npAppVolumeFocused,
        .npAppVolume:focus-visible {
          border-color: color-mix(in srgb, var(--np-accent, #66c0f4) 62%, transparent);
          box-shadow: 0 0 0 1px color-mix(in srgb, var(--np-accent, #66c0f4) 20%, transparent), 0 0 18px color-mix(in srgb, var(--np-accent, #66c0f4) 22%, transparent);
        }
        .npAppVolume span,
        .npAppVolume strong {
          min-width: 0;
          font-size: 1em;
          line-height: 1.15;
          font-weight: 500;
        }
        .npAppVolume strong {
          text-align: right;
          font-weight: 700;
        }
        .npAppVolume input[type="range"] {
          min-width: 0;
          width: 100%;
          height: 18px;
          margin: 0;
          padding: 0;
          accent-color: var(--np-accent, #66c0f4);
        }
        .npAppVolume input[type="range"]::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.18);
        }
        .npAppVolume input[type="range"]::-webkit-slider-thumb {
          width: 14px;
          height: 14px;
          margin-top: -4px;
          border-radius: 999px;
        }
      ` }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs("div", { ref: qamRootRef, style: { ...qamCenterRowStyle, ["--np-accent"]: accentForKey(enabledAppKeys[0]) }, children: [SP_JSX.jsx(QamGlowLayer, { artUrl: coverUrl, playing: isPlaying, bottomFadeTop: bottomGlowFadeTop }), SP_JSX.jsxs("div", { style: { ...centeredColumnStyle, position: "relative", zIndex: 3 }, children: [SP_JSX.jsxs("div", { style: mediaTransitionStyle, children: [SP_JSX.jsx(CoverBox, { artUrl: coverUrl, placeholderIcon: spotifyPaused ? SP_JSX.jsx(FaClock, { size: 88, style: { opacity: 0.88 } }) : undefined, showPlaceholder: !coverResolving || spotifyPaused, ariaLabel: t.openCurrentAlbum, onActivate: spotifyPaused ? undefined : spotifyCoverActive
                                                ? () => void openCurrentSpotifyAlbum()
                                                : localCoverActive
                                                    ? () => void openCurrentLocalAlbum()
                                                    : undefined }), SP_JSX.jsxs("div", { style: {
                                                width: "100%",
                                                textAlign: "center",
                                                marginTop: "14px",
                                            }, children: [SP_JSX.jsx(ScrollingText, { text: title, style: {
                                                        fontSize: "1.08em",
                                                        fontWeight: 700,
                                                        lineHeight: 1.2,
                                                        marginBottom: "6px",
                                                    } }), SP_JSX.jsx(ScrollingText, { text: artist, style: {
                                                        opacity: 0.84,
                                                        lineHeight: 1.2,
                                                        marginBottom: "4px",
                                                    } }), SP_JSX.jsx(ScrollingText, { text: album, style: {
                                                        opacity: 0.62,
                                                        fontSize: "0.9em",
                                                        lineHeight: 1.2,
                                                    } })] })] }), spotifyPaused ? null : SP_JSX.jsx(ProgressView, { current: current, snapshotAt: snapshotAt }), SP_JSX.jsx("div", { style: { height: "14px" } }), SP_JSX.jsxs(DFL.Focusable, { style: controlsWrapStyle, "flow-children": "horizontal", children: [SP_JSX.jsx(DFL.DialogButton, { style: compactButtonStyle, disabled: controlsDisabled || !current?.canPrevious, onClick: () => void runAction(() => previousAction()), children: SP_JSX.jsx(FaStepBackward, {}) }), SP_JSX.jsx(DFL.DialogButton, { style: compactButtonStyle, disabled: controlsDisabled || !current, onClick: () => void runAction(() => playPauseAction(), () => patchCurrentPlayer((player) => ({
                                                ...player,
                                                status: player.status === "Playing" ? "Paused" : "Playing",
                                            }))), children: isPlaying ? SP_JSX.jsx(FaPause, {}) : SP_JSX.jsx(FaPlay, {}) }), SP_JSX.jsx(DFL.DialogButton, { style: compactButtonStyle, disabled: controlsDisabled || !current?.canNext, onClick: () => void runAction(() => nextAction()), children: SP_JSX.jsx(FaStepForward, {}) })] }), SP_JSX.jsx("div", { style: { height: "8px" } }), SP_JSX.jsxs(DFL.Focusable, { style: controlsWrapStyle, "flow-children": "horizontal", children: [SP_JSX.jsxs(DFL.DialogButton, { style: { ...compactButtonStyle, position: "relative", opacity: isShuffleActive ? 1 : 0.58 }, disabled: controlsDisabled || !current?.canShuffle, onClick: () => void runAction(() => shuffleAction(), () => patchCurrentPlayer((player) => ({ ...player, shuffleActive: !player.shuffleActive })), [1200]), children: [SP_JSX.jsx(FaRandom, {}), isShuffleActive ? (SP_JSX.jsx("span", { "aria-hidden": "true", style: {
                                                        position: "absolute",
                                                        top: "5px",
                                                        right: "5px",
                                                        width: "4px",
                                                        height: "4px",
                                                        borderRadius: "50%",
                                                        background: "var(--np-accent, #66c0f4)",
                                                        boxShadow: "0 0 5px var(--np-accent, #66c0f4)",
                                                        pointerEvents: "none",
                                                    } })) : null] }), SP_JSX.jsxs(DFL.DialogButton, { style: { ...compactButtonStyle, position: "relative", opacity: repeatActive ? 1 : 0.58 }, disabled: controlsDisabled || !current?.canRepeat, onClick: () => void runAction(() => repeatAction(), () => patchCurrentPlayer((player) => ({
                                                ...player,
                                                repeatMode: player.repeatMode === "Off"
                                                    ? "List"
                                                    : player.repeatMode === "List"
                                                        ? "Track"
                                                        : "Off",
                                            })), [1200]), children: [SP_JSX.jsx(RepeatIcon, { repeatMode: repeatMode }), repeatActive ? (SP_JSX.jsx("span", { "aria-hidden": "true", style: {
                                                        position: "absolute",
                                                        top: "5px",
                                                        right: "5px",
                                                        width: "4px",
                                                        height: "4px",
                                                        borderRadius: "50%",
                                                        background: "var(--np-accent, #66c0f4)",
                                                        boxShadow: "0 0 5px var(--np-accent, #66c0f4)",
                                                        pointerEvents: "none",
                                                    } })) : null] })] }), SP_JSX.jsx("div", { style: { height: "8px" } }), SP_JSX.jsxs(DFL.Focusable, { ref: volumeWrapperRef, className: "npAppVolume", focusClassName: "npAppVolumeFocused", noFocusRing: true, onActivate: () => undefined, onButtonDown: handleVolumeButtonDown, onKeyDown: handleVolumeKeyDown, role: "slider", tabIndex: 0, "aria-label": t.volume, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": Math.round(appVolume), style: { opacity: current && volumeReady ? 1 : 0.46 }, children: [SP_JSX.jsx("span", { children: t.volume }), SP_JSX.jsx("input", { type: "range", value: Math.round(appVolume), min: 0, max: 100, step: 1, disabled: !current || spotifyPaused, tabIndex: -1, onChange: (event) => changeAppVolume(Number(event.currentTarget.value)) }), SP_JSX.jsxs("strong", { children: [Math.round(appVolume), "%"] })] }), snapshot.players.length > 1 ? (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx("div", { style: { height: "14px" } }), SP_JSX.jsx(DFL.Focusable, { "flow-children": "vertical", style: { display: "flex", flexDirection: "column", gap: "6px", width: "100%" }, children: snapshot.players.map((player) => (SP_JSX.jsx(DFL.DialogButton, { style: wideButtonStyle, disabled: busy, onClick: () => void runAction(async () => {
                                                    await setMediaPlayer(player.id);
                                                }), children: SP_JSX.jsx("span", { style: buttonContentStyle, children: (player.id === snapshot.selectedPlayer ? "\u2022 " : "") + player.name }) }, player.id))) })] })) : null, SP_JSX.jsx("div", { style: { height: "10px" } }), SP_JSX.jsxs(DFL.Focusable, { style: controlsWrapStyle, "flow-children": "horizontal", children: [SP_JSX.jsx(DFL.DialogButton, { style: splitWideButtonStyle, onClick: navigateToFullscreen, children: SP_JSX.jsx(FaExpandAlt, {}) }), SP_JSX.jsx(DFL.DialogButton, { style: splitWideButtonStyle, onClick: () => setShowSettings(true), children: SP_JSX.jsx(FaCog, {}) })] }), enabledAppKeys[0] === "spotify" && spotifyPlus.enabled && spotifyPlus.authenticated ? (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx("div", { style: { height: "10px" } }), SP_JSX.jsx(SpotifyBrowser, { openAlbumRequest: spotifyAlbumRequest, onOpenBigPicture: navigateToSpotifyBigPicture, onOpenSettings: () => setShowSettings(true) })] })) : null, enabledAppKeys[0] === "localMusic" ? (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx("div", { style: { height: "10px" } }), SP_JSX.jsx(LocalMusicBrowser, { openAlbumRequest: localAlbumRequest, onOpenBigPicture: navigateToLocalMusicBigPicture })] })) : null, enabledApps.length > 0 ? (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx("div", { style: { height: "6px" } }), SP_JSX.jsx(DFL.Focusable, { style: { ...centeredColumnStyle, gap: "6px" }, "flow-children": "vertical", children: enabledApps.filter((app) => app.key !== "localMusic" && app.key !== "spotify").map((app) => {
                                                const Icon = app.Icon;
                                                return (SP_JSX.jsx(DFL.DialogButton, { style: wideButtonStyle, disabled: busy, onClick: () => void (activeAppRunning ? closeMusicApp$1(app) : openMusicApp(app)), children: SP_JSX.jsxs("span", { style: buttonContentStyle, children: [SP_JSX.jsx(Icon, {}), formatOpenAppLabel(activeAppRunning ? t.closeApp : t.openApp, appProgramLabel(app))] }) }, app.key));
                                            }) })] })) : null] })] }) })] }));
}
function NowPlayingTitle() {
    const [key, setKey] = SP_REACT.useState(loadEnabledAppKeys()[0]);
    SP_REACT.useEffect(() => {
        const syncSource = (event) => {
            const detail = event instanceof CustomEvent ? event.detail : undefined;
            const next = detail ? normalizeEnabledAppKeys(detail)[0] : loadEnabledAppKeys()[0];
            setKey((previous) => previous === next ? previous : next);
        };
        window.addEventListener(APP_SETTINGS_CHANGED_EVENT, syncSource);
        window.addEventListener("focus", syncSource);
        return () => {
            window.removeEventListener(APP_SETTINGS_CHANGED_EVENT, syncSource);
            window.removeEventListener("focus", syncSource);
        };
    }, []);
    const app = musicApps.find((a) => a.key === key);
    const Icon = app?.Icon ?? FaMusic;
    const t = resolveTranslations();
    const label = app ? appDisplayLabel(app, t) : "Now Playing";
    return (SP_JSX.jsx("div", { "aria-label": label, title: label, style: { display: "flex", alignItems: "center", justifyContent: "flex-end", width: "100%", minWidth: "34px", height: "34px", marginLeft: "auto", paddingRight: "8px", boxSizing: "border-box" }, children: SP_JSX.jsx(Icon, { size: 20, style: { display: "block", flexShrink: 0 } }) }));
}
var index = definePlugin(() => {
    routerHook.addRoute(FULLSCREEN_ROUTE, FullscreenRoute);
    routerHook.addRoute(SPOTIFY_BIG_PICTURE_ROUTE, SpotifyBigPictureRoute);
    routerHook.addRoute(LOCAL_MUSIC_BIG_PICTURE_ROUTE, LocalMusicBigPictureRoute);
    routerHook.addRoute(FULLSCREEN_SETTINGS_ROUTE, FullscreenSettingsRoute);
    return {
        name: "Now playing",
        titleView: SP_JSX.jsx(NowPlayingTitle, {}),
        content: SP_JSX.jsx(Content, {}),
        icon: SP_JSX.jsx(FaMusic, {}),
        onDismount() {
            localAudioPlayer.destroy();
            routerHook.removeRoute(FULLSCREEN_ROUTE);
            routerHook.removeRoute(SPOTIFY_BIG_PICTURE_ROUTE);
            routerHook.removeRoute(LOCAL_MUSIC_BIG_PICTURE_ROUTE);
            routerHook.removeRoute(FULLSCREEN_SETTINGS_ROUTE);
        },
    };
});

export { index as default };
//# sourceMappingURL=index.js.map
