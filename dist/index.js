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
    var {
        attr,
        size,
        title
      } = props,
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
}function FaStepForward (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M384 44v424c0 6.6-5.4 12-12 12h-48c-6.6 0-12-5.4-12-12V291.6l-195.5 181C95.9 489.7 64 475.4 64 448V64c0-27.4 31.9-41.7 52.5-24.6L312 219.3V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12z"},"child":[]}]})(props);
}function FaStepBackward (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M64 468V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12v176.4l195.5-181C352.1 22.3 384 36.6 384 64v384c0 27.4-31.9 41.7-52.5 24.6L136 292.7V468c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12z"},"child":[]}]})(props);
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
}function FaExpandAlt (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M212.686 315.314L120 408l32.922 31.029c15.12 15.12 4.412 40.971-16.97 40.971h-112C10.697 480 0 469.255 0 456V344c0-21.382 25.803-32.09 40.922-16.971L72 360l92.686-92.686c6.248-6.248 16.379-6.248 22.627 0l25.373 25.373c6.249 6.248 6.249 16.378 0 22.627zm22.628-118.628L328 104l-32.922-31.029C279.958 57.851 290.666 32 312.048 32h112C437.303 32 448 42.745 448 56v112c0 21.382-25.803 32.09-40.922 16.971L376 152l-92.686 92.686c-6.248 6.248-16.379 6.248-22.627 0l-25.373-25.373c-6.249-6.248-6.249-16.378 0-22.627z"},"child":[]}]})(props);
}function FaCog (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"},"child":[]}]})(props);
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

function getSnapshot() {
    return call("get_snapshot");
}
function setMediaPlayer(player) {
    return call("set_media_player", player);
}
function getCover(title, artist, album) {
    return call("get_cover", title, artist, album);
}
function playPause() {
    return call("play_pause");
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

const emptySnapshot = {
    selectedPlayer: "",
    currentPlayer: "",
    selected: null,
    players: [],
};
const BLOCK_WIDTH = 188;
const CONTROL_GAP = 8;
const BUTTON_HEIGHT = 28;
const APP_SETTINGS_KEY = "nowPlaying.enabledApps";
const FULLSCREEN_EFFECT_SETTINGS_KEY = "nowPlaying.fullscreenEffect";
const FULLSCREEN_ROUTE = "/now-playing/fullscreen";
const qamCenterRowStyle = {
    width: "calc(100% - 28px)",
    margin: "0 auto",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
};
const centeredColumnStyle = {
    width: `${BLOCK_WIDTH}px`,
    minWidth: `${BLOCK_WIDTH}px`,
    maxWidth: `${BLOCK_WIDTH}px`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
};
const controlsWrapStyle = {
    width: `${BLOCK_WIDTH}px`,
    minWidth: `${BLOCK_WIDTH}px`,
    maxWidth: `${BLOCK_WIDTH}px`,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: `${CONTROL_GAP}px`,
};
const compactButtonStyle = {
    flex: 1,
    minWidth: 0,
    position: "relative",
    height: `${BUTTON_HEIGHT}px`,
    minHeight: `${BUTTON_HEIGHT}px`,
    padding: 0,
    lineHeight: 1,
};
const wideButtonStyle = {
    width: `${BLOCK_WIDTH}px`,
    minWidth: `${BLOCK_WIDTH}px`,
    maxWidth: `${BLOCK_WIDTH}px`,
    height: `${BUTTON_HEIGHT}px`,
    minHeight: `${BUTTON_HEIGHT}px`,
    padding: 0,
    lineHeight: 1,
};
const iconButtonStyle = {
    width: `${BUTTON_HEIGHT}px`,
    minWidth: `${BUTTON_HEIGHT}px`,
    maxWidth: `${BUTTON_HEIGHT}px`,
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
const headerRowStyle = {
    width: `${BLOCK_WIDTH}px`,
    minWidth: `${BLOCK_WIDTH}px`,
    maxWidth: `${BLOCK_WIDTH}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
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
const activeDotStyle = {
    position: "absolute",
    top: "5px",
    right: "6px",
    width: "6px",
    height: "6px",
    borderRadius: "999px",
    background: "#66c0f4",
    boxShadow: "0 0 7px rgba(102, 192, 244, 0.95)",
    pointerEvents: "none",
};
const settingsGroupLabelStyle = {
    width: `${BLOCK_WIDTH}px`,
    boxSizing: "border-box",
    padding: "0 4px",
    fontSize: "0.72em",
    fontWeight: 700,
    lineHeight: 1.2,
    opacity: 0.64,
};
const subtleRowTextStyle = {
    width: `${BLOCK_WIDTH}px`,
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.72em",
    opacity: 0.66,
    marginTop: "3px",
};
const meterBoxStyle = {
    width: `${BLOCK_WIDTH}px`,
    minWidth: `${BLOCK_WIDTH}px`,
    maxWidth: `${BLOCK_WIDTH}px`,
    boxSizing: "border-box",
    overflow: "hidden",
};
const meterTrackStyle = {
    width: `${BLOCK_WIDTH}px`,
    minWidth: `${BLOCK_WIDTH}px`,
    maxWidth: `${BLOCK_WIDTH}px`,
    height: "6px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.18)",
    overflow: "hidden",
    boxSizing: "border-box",
};
const meterFillBaseStyle = {
    height: "100%",
    borderRadius: "999px",
    background: "#66c0f4",
    transition: "width 160ms linear",
};
const marqueeShellStyle = {
    width: `${BLOCK_WIDTH}px`,
    maxWidth: `${BLOCK_WIDTH}px`,
    overflow: "hidden",
    whiteSpace: "nowrap",
    boxSizing: "border-box",
};
const translations = {
    en: {
        notPlaying: "Not playing",
        unknownArtist: "Unknown artist",
        unknownAlbum: "Unknown album",
        openApp: "Open {app}",
        refreshFailed: "Now playing refresh failed",
        coverFailed: "cover fetch failed",
        settingsApps: "Apps",
        settingsFullscreenEffect: "Fullscreen effect",
        effectGlow: "Glow",
        effectOcean: "Ocean",
        effectEnergySaver: "Energy Saver",
    },
    it: {
        notPlaying: "Non in riproduzione",
        unknownArtist: "Artista sconosciuto",
        unknownAlbum: "Album sconosciuto",
        openApp: "Apri {app}",
        refreshFailed: "Aggiornamento Now playing non riuscito",
        coverFailed: "recupero copertina non riuscito",
        settingsApps: "App",
        settingsFullscreenEffect: "Effetto fullscreen",
        effectGlow: "Bagliore",
        effectOcean: "Oceano",
        effectEnergySaver: "Risparmio energia",
    },
    es: {
        notPlaying: "No se está reproduciendo",
        unknownArtist: "Artista desconocido",
        unknownAlbum: "Album desconocido",
        openApp: "Abrir {app}",
        refreshFailed: "No se pudo actualizar Now playing",
        coverFailed: "no se pudo cargar la carátula",
        settingsApps: "Apps",
        settingsFullscreenEffect: "Efecto de pantalla completa",
        effectGlow: "Resplandor",
        effectOcean: "Océano",
        effectEnergySaver: "Ahorro de energía",
    },
    fr: {
        notPlaying: "Aucune lecture",
        unknownArtist: "Artiste inconnu",
        unknownAlbum: "Album inconnu",
        openApp: "Ouvrir {app}",
        refreshFailed: "Échec de l'actualisation de Now playing",
        coverFailed: "échec du chargement de la pochette",
        settingsApps: "Apps",
        settingsFullscreenEffect: "Effet plein écran",
        effectGlow: "Lueur",
        effectOcean: "Océan",
        effectEnergySaver: "Économie d'énergie",
    },
    de: {
        notPlaying: "Keine Wiedergabe",
        unknownArtist: "Unbekannter Künstler",
        unknownAlbum: "Unbekanntes Album",
        openApp: "{app} öffnen",
        refreshFailed: "Now playing konnte nicht aktualisiert werden",
        coverFailed: "Cover konnte nicht geladen werden",
        settingsApps: "Apps",
        settingsFullscreenEffect: "Vollbildeffekt",
        effectGlow: "Leuchten",
        effectOcean: "Ozean",
        effectEnergySaver: "Energiesparen",
    },
    pt: {
        notPlaying: "Nada em reprodução",
        unknownArtist: "Artista desconhecido",
        unknownAlbum: "Álbum desconhecido",
        openApp: "Abrir {app}",
        refreshFailed: "Falha ao atualizar Now playing",
        coverFailed: "falha ao carregar a capa",
        settingsApps: "Aplicações",
        settingsFullscreenEffect: "Efeito em ecrã inteiro",
        effectGlow: "Brilho",
        effectOcean: "Oceano",
        effectEnergySaver: "Poupança de energia",
    },
    "pt-br": {
        notPlaying: "Nada tocando",
        unknownArtist: "Artista desconhecido",
        unknownAlbum: "Álbum desconhecido",
        openApp: "Abrir {app}",
        refreshFailed: "Falha ao atualizar Now playing",
        coverFailed: "falha ao carregar a capa",
        settingsApps: "Apps",
        settingsFullscreenEffect: "Efeito em tela cheia",
        effectGlow: "Brilho",
        effectOcean: "Oceano",
        effectEnergySaver: "Economia de energia",
    },
    nl: {
        notPlaying: "Niets wordt afgespeeld",
        unknownArtist: "Onbekende artiest",
        unknownAlbum: "Onbekend album",
        openApp: "{app} openen",
        refreshFailed: "Now playing vernieuwen mislukt",
        coverFailed: "hoes laden mislukt",
        settingsApps: "Apps",
        settingsFullscreenEffect: "Fullscreen-effect",
        effectGlow: "Gloed",
        effectOcean: "Oceaan",
        effectEnergySaver: "Energiebesparing",
    },
    sv: {
        notPlaying: "Spelar inget",
        unknownArtist: "Okand artist",
        unknownAlbum: "Okant album",
        openApp: "Oppna {app}",
        refreshFailed: "Now playing kunde inte uppdateras",
        coverFailed: "kunde inte hamta omslag",
    },
    no: {
        notPlaying: "Spiller ikke",
        unknownArtist: "Ukjent artist",
        unknownAlbum: "Ukjent album",
        openApp: "Apne {app}",
        refreshFailed: "Now playing kunne ikke oppdateres",
        coverFailed: "kunne ikke hente omslag",
    },
    da: {
        notPlaying: "Afspiller ikke",
        unknownArtist: "Ukendt kunstner",
        unknownAlbum: "Ukendt album",
        openApp: "Abn {app}",
        refreshFailed: "Now playing kunne ikke opdateres",
        coverFailed: "kunne ikke hente cover",
    },
    fi: {
        notPlaying: "Ei toistoa",
        unknownArtist: "Tuntematon artisti",
        unknownAlbum: "Tuntematon albumi",
        openApp: "Avaa {app}",
        refreshFailed: "Now playing -paivitys epaonnistui",
        coverFailed: "kannen haku epaonnistui",
    },
    pl: {
        notPlaying: "Nic nie jest odtwarzane",
        unknownArtist: "Nieznany wykonawca",
        unknownAlbum: "Nieznany album",
        openApp: "Otworz {app}",
        refreshFailed: "Nie udalo sie odswiezyc Now playing",
        coverFailed: "nie udalo sie pobrac okladki",
    },
    cs: {
        notPlaying: "Nic se neprehrava",
        unknownArtist: "Neznamy interpret",
        unknownAlbum: "Nezname album",
        openApp: "Otevrit {app}",
        refreshFailed: "Now playing se nepodarilo obnovit",
        coverFailed: "nepodarilo se nacist obal",
    },
    sk: {
        notPlaying: "Nic sa neprehrava",
        unknownArtist: "Neznamy interpret",
        unknownAlbum: "Neznamy album",
        openApp: "Otvorit {app}",
        refreshFailed: "Now playing sa nepodarilo obnovit",
        coverFailed: "nepodarilo sa nacitat obal",
    },
    hu: {
        notPlaying: "Nincs lejatszas",
        unknownArtist: "Ismeretlen eloado",
        unknownAlbum: "Ismeretlen album",
        openApp: "{app} megnyitasa",
        refreshFailed: "A Now playing frissitese sikertelen",
        coverFailed: "a borito betoltese sikertelen",
    },
    ro: {
        notPlaying: "Nu se reda nimic",
        unknownArtist: "Artist necunoscut",
        unknownAlbum: "Album necunoscut",
        openApp: "Deschide {app}",
        refreshFailed: "Actualizarea Now playing a esuat",
        coverFailed: "incarcarea copertii a esuat",
    },
    tr: {
        notPlaying: "Calmiyor",
        unknownArtist: "Bilinmeyen sanatci",
        unknownAlbum: "Bilinmeyen album",
        openApp: "{app} ac",
        refreshFailed: "Now playing yenilenemedi",
        coverFailed: "kapak yuklenemedi",
    },
    el: {
        notPlaying: "Δεν αναπαραγεται",
        unknownArtist: "Αγνωστος καλλιτεχνης",
        unknownAlbum: "Αγνωστο αλμπουμ",
        openApp: "Ανοιγμα {app}",
        refreshFailed: "Αποτυχια ανανεωσης Now playing",
        coverFailed: "αποτυχια φορτωσης εξωφυλλου",
    },
    ru: {
        notPlaying: "Не воспроизводится",
        unknownArtist: "Неизвестный исполнитель",
        unknownAlbum: "Неизвестный альбом",
        openApp: "Открыть {app}",
        refreshFailed: "Не удалось обновить Now playing",
        coverFailed: "не удалось загрузить обложку",
    },
    uk: {
        notPlaying: "Не відтворюється",
        unknownArtist: "Невідомий виконавець",
        unknownAlbum: "Невідомий альбом",
        openApp: "Відкрити {app}",
        refreshFailed: "Не вдалося оновити Now playing",
        coverFailed: "не вдалося завантажити обкладинку",
        settingsApps: "Застосунки",
        settingsFullscreenEffect: "Повноекранний ефект",
        effectGlow: "Світіння",
        effectOcean: "Океан",
        effectEnergySaver: "Енергозбереження",
    },
    ja: {
        notPlaying: "再生していません",
        unknownArtist: "不明なアーティスト",
        unknownAlbum: "不明なアルバム",
        openApp: "{app}を開く",
        refreshFailed: "Now playing の更新に失敗しました",
        coverFailed: "カバーの取得に失敗しました",
        settingsApps: "アプリ",
        settingsFullscreenEffect: "全画面エフェクト",
        effectGlow: "グロー",
        effectOcean: "オーシャン",
        effectEnergySaver: "省電力",
    },
    ko: {
        notPlaying: "재생 중 아님",
        unknownArtist: "알 수 없는 아티스트",
        unknownAlbum: "알 수 없는 앨범",
        openApp: "{app} 열기",
        refreshFailed: "Now playing 새로 고침 실패",
        coverFailed: "앨범 아트 불러오기 실패",
    },
    zh: {
        notPlaying: "未在播放",
        unknownArtist: "未知艺人",
        unknownAlbum: "未知专辑",
        openApp: "打开 {app}",
        refreshFailed: "Now playing 刷新失败",
        coverFailed: "封面加载失败",
        settingsApps: "应用",
        settingsFullscreenEffect: "全屏效果",
        effectGlow: "光晕",
        effectOcean: "海洋",
        effectEnergySaver: "节能",
    },
    "zh-tw": {
        notPlaying: "未在播放",
        unknownArtist: "未知演出者",
        unknownAlbum: "未知專輯",
        openApp: "開啟 {app}",
        refreshFailed: "Now playing 重新整理失敗",
        coverFailed: "封面載入失敗",
        settingsApps: "應用程式",
        settingsFullscreenEffect: "全螢幕效果",
        effectGlow: "光暈",
        effectOcean: "海洋",
        effectEnergySaver: "節能",
    },
    ar: {
        notPlaying: "لا يتم التشغيل",
        unknownArtist: "فنان غير معروف",
        unknownAlbum: "البوم غير معروف",
        openApp: "فتح {app}",
        refreshFailed: "فشل تحديث Now playing",
        coverFailed: "فشل تحميل الغلاف",
    },
    he: {
        notPlaying: "לא מתנגן",
        unknownArtist: "אמן לא ידוע",
        unknownAlbum: "אלבום לא ידוע",
        openApp: "פתח את {app}",
        refreshFailed: "רענון Now playing נכשל",
        coverFailed: "טעינת העטיפה נכשלה",
    },
    hi: {
        notPlaying: "चल नहीं रहा",
        unknownArtist: "अज्ञात कलाकार",
        unknownAlbum: "अज्ञात एल्बम",
        openApp: "{app} खोलें",
        refreshFailed: "Now playing रीफ्रेश विफल",
        coverFailed: "कवर लोड नहीं हुआ",
    },
    id: {
        notPlaying: "Tidak diputar",
        unknownArtist: "Artis tidak dikenal",
        unknownAlbum: "Album tidak dikenal",
        openApp: "Buka {app}",
        refreshFailed: "Gagal memuat ulang Now playing",
        coverFailed: "gagal memuat sampul",
    },
    th: {
        notPlaying: "ไม่ได้เล่น",
        unknownArtist: "ศิลปินไม่ทราบชื่อ",
        unknownAlbum: "อัลบั้มไม่ทราบชื่อ",
        openApp: "เปิด {app}",
        refreshFailed: "รีเฟรช Now playing ไม่สำเร็จ",
        coverFailed: "โหลดปกไม่สำเร็จ",
    },
    vi: {
        notPlaying: "Khong phat",
        unknownArtist: "Nghe si khong xac dinh",
        unknownAlbum: "Album khong xac dinh",
        openApp: "Mo {app}",
        refreshFailed: "Khong the lam moi Now playing",
        coverFailed: "khong the tai bia",
    },
};
const languageAliases = {
    "pt-pt": "pt",
    "zh-cn": "zh",
    "zh-sg": "zh",
    "zh-hans": "zh",
    "zh-hant": "zh-tw",
    "zh-hk": "zh-tw",
    "zh-mo": "zh-tw",
    nb: "no",
    nn: "no",
};
function resolveTranslations() {
    const candidates = typeof navigator !== "undefined"
        ? [...Array.from(navigator.languages ?? []), navigator.language].filter((value) => Boolean(value))
        : [];
    for (const candidate of candidates) {
        const normalized = candidate.toLowerCase();
        const alias = languageAliases[normalized] ?? normalized;
        const base = alias.split("-")[0];
        const match = translations[alias] ?? translations[base];
        if (match)
            return match;
    }
    return translations.en;
}
function useTranslations() {
    return SP_REACT.useMemo(resolveTranslations, []);
}
function formatOpenAppLabel(template, app) {
    return template.replace("{app}", app);
}
function formatEffectLabel(t, effect) {
    switch (effect) {
        case "glow":
            return t.effectGlow ?? translations.en.effectGlow ?? "Glow";
        case "ocean":
            return t.effectOcean ?? translations.en.effectOcean ?? "Ocean";
        case "energySaver":
            return t.effectEnergySaver ?? translations.en.effectEnergySaver ?? "Energy Saver";
    }
}
const musicApps = [
    { key: "spotify", label: "Spotify", Icon: SiSpotify, open: openSpotify },
    { key: "tidal", label: "Tidal", Icon: SiTidal, open: openTidal },
    { key: "appleMusic", label: "Apple Music", Icon: SiApplemusic, open: openAppleMusic },
    { key: "deezer", label: "Deezer", Icon: FaDeezer, open: openDeezer },
    { key: "amazonMusic", label: "Amazon Music", Icon: FaAmazon, open: openAmazonMusic },
    { key: "soundCloud", label: "SoundCloud", Icon: SiSoundcloud, open: openSoundCloud },
];
const defaultEnabledAppKeys = ["spotify"];
const fullscreenEffects = [
    { key: "glow" },
    { key: "ocean" },
    { key: "energySaver" },
];
const defaultFullscreenEffect = "glow";
function normalizeEnabledAppKeys(keys) {
    if (!Array.isArray(keys))
        return defaultEnabledAppKeys;
    const knownKeys = new Set(musicApps.map((app) => app.key));
    const normalized = keys.filter((key) => typeof key === "string" && knownKeys.has(key));
    return normalized.length > 0 ? normalized : defaultEnabledAppKeys;
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
    try {
        window.localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(keys));
    }
    catch {
        // Local storage can be unavailable in some embedded contexts; the session state still works.
    }
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
function formatTime(milliseconds) {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
function MeterBar(props) {
    const value = clamp(props.value, 0, 1);
    return (SP_JSX.jsx("div", { style: meterTrackStyle, children: SP_JSX.jsx("div", { style: {
                ...meterFillBaseStyle,
                width: `${value * 100}%`,
                opacity: props.dimmed ? 0.5 : 1,
            } }) }));
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
            setShouldScroll(element.scrollWidth > parent.clientWidth + 2);
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
        }, title: props.text, children: SP_JSX.jsx("div", { ref: textRef, style: {
                ...props.style,
                display: "inline-block",
                whiteSpace: "nowrap",
                animation: shouldScroll ? `inRiproduzioneMarquee ${duration} ease-in-out infinite alternate` : undefined,
                willChange: shouldScroll ? "transform" : undefined,
            }, children: props.text }) }));
}
function CoverBox(props) {
    const { artUrl } = props;
    if (artUrl && artUrl.trim()) {
        return (SP_JSX.jsx("img", { src: artUrl, style: {
                width: `${BLOCK_WIDTH}px`,
                height: `${BLOCK_WIDTH}px`,
                objectFit: "cover",
                borderRadius: "18px",
                display: "block",
            } }));
    }
    return (SP_JSX.jsx("div", { style: {
            width: `${BLOCK_WIDTH}px`,
            height: `${BLOCK_WIDTH}px`,
            borderRadius: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden",
        }, children: SP_JSX.jsx(FaMusic, { size: 72 }) }));
}
function ProgressView(props) {
    const { current, clock, snapshotAt } = props;
    const length = Math.max(1, current?.length ?? 1);
    const basePosition = current?.position ?? 0;
    const livePosition = current?.status === "Playing" ? basePosition + Math.max(0, clock - snapshotAt) : basePosition;
    const position = clamp(livePosition, 0, length);
    const progress = length > 1 ? position / length : 0;
    return (SP_JSX.jsxs("div", { style: { ...meterBoxStyle, marginTop: "12px" }, children: [SP_JSX.jsx(MeterBar, { value: progress }), SP_JSX.jsxs("div", { style: subtleRowTextStyle, children: [SP_JSX.jsx("span", { children: formatTime(position) }), SP_JSX.jsx("span", { children: formatTime(length) })] })] }));
}
function navigateToFullscreen() {
    try {
        DFL.Navigation.CloseSideMenus();
    }
    catch {
        // Older Decky/Steam builds can throw here; navigation below still works in most cases.
    }
    window.setTimeout(() => {
        const mainWindow = DFL.Router.WindowStore?.GamepadUIMainWindowInstance ??
            DFL.Router.WindowStore?.SteamUIWindows?.[0];
        if (mainWindow?.Navigate) {
            mainWindow.Navigate(FULLSCREEN_ROUTE);
            return;
        }
        DFL.Navigation.Navigate(FULLSCREEN_ROUTE);
    }, 80);
}
function navigateBackFromFullscreen() {
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
    return (SP_JSX.jsxs("div", { className: "npFullscreenEffectLayer npGlowLayer", "aria-hidden": "true", children: [SP_JSX.jsx("span", { className: "npFullscreenGlow" }), SP_JSX.jsx("span", { className: "npFullscreenGlow" })] }));
}
function FullscreenRoute() {
    const t = useTranslations();
    const [snapshot, setSnapshot] = SP_REACT.useState(emptySnapshot);
    const [fullscreenEffect] = SP_REACT.useState(loadFullscreenEffect);
    const [coverUrl, setCoverUrl] = SP_REACT.useState("");
    const [busy, setBusy] = SP_REACT.useState(false);
    const refreshingRef = SP_REACT.useRef(false);
    const current = SP_REACT.useMemo(() => snapshot.selected ?? snapshot.players[0] ?? null, [snapshot]);
    const title = current?.title?.trim() ? current.title : t.notPlaying;
    const artist = current?.artist?.trim() ? current.artist : t.unknownArtist;
    const album = current?.album?.trim() ? current.album : t.unknownAlbum;
    const isPlaying = current?.status === "Playing";
    const canUsePrevious = !!current?.canPrevious;
    const canUsePlayPause = !!current;
    const canUseNext = !!current?.canNext;
    async function refresh(force = false) {
        if (refreshingRef.current && !force)
            return;
        refreshingRef.current = true;
        try {
            const next = await getSnapshot();
            setSnapshot(next);
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
        const timer = window.setInterval(() => void refresh(false), 400);
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
                const url = await getCover(trackTitle, trackArtist, trackAlbum);
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
    }, [current?.title, current?.artist, current?.album, t.coverFailed]);
    return (SP_JSX.jsxs(DFL.Focusable, { onCancel: navigateBackFromFullscreen, onCancelButton: navigateBackFromFullscreen, style: {
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 2147483000,
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
          position: absolute;
          inset: 0;
          width: 100vw;
          height: 100vh;
          z-index: 2147483000;
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
        html:has(.npFullscreenRoot) [class*="TopBar"] {
          opacity: 0 !important;
          pointer-events: none !important;
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

        .npFullscreenCover {
          position: absolute;
          left: clamp(64px, 5vw, 108px);
          bottom: clamp(76px, 8.4vh, 118px);
          width: clamp(170px, 13.6vw, 278px);
          height: clamp(170px, 13.6vw, 278px);
          border-radius: clamp(14px, 1.3vw, 24px);
          overflow: hidden;
          background: rgba(255,255,255,0.08);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.08);
          z-index: 2;
        }

        .npFullscreenMeta {
          position: absolute;
          left: calc(clamp(64px, 5vw, 108px) + clamp(170px, 13.6vw, 278px) + clamp(28px, 2.2vw, 48px));
          right: clamp(64px, 7vw, 144px);
          bottom: calc(clamp(76px, 8.4vh, 118px) + clamp(74px, 7.6vh, 116px));
          min-width: 0;
          z-index: 2;
        }

        .npFullscreenTitle {
          margin: 0 0 16px;
          font-size: clamp(34px, 3.1vw, 58px);
          line-height: 1.02;
          font-weight: 500;
          letter-spacing: 0;
          overflow-wrap: anywhere;
        }

        .npFullscreenText {
          margin: 0;
          font-size: clamp(23px, 2vw, 38px);
          line-height: 1.2;
          letter-spacing: 0;
          color: rgba(255,255,255,0.82);
          overflow-wrap: anywhere;
        }

        .npFullscreenControls {
          position: absolute;
          left: calc(clamp(64px, 5vw, 108px) + clamp(170px, 13.6vw, 278px) + clamp(28px, 2.2vw, 48px));
          bottom: clamp(76px, 8.4vh, 118px);
          display: flex;
          align-items: center;
          gap: clamp(18px, 1.5vw, 30px);
          z-index: 2;
        }

        .npFullscreenControlButton {
          width: clamp(70px, 5.7vw, 98px);
          min-width: clamp(70px, 5.7vw, 98px);
          height: clamp(58px, 4.2vw, 74px);
          min-height: clamp(58px, 4.2vw, 74px);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          color: rgba(255,255,255,0.96);
          background: rgba(255,255,255,0.12);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
          transition: background 140ms ease, box-shadow 140ms ease, transform 140ms ease;
        }

        .npFullscreenControlButton svg {
          width: clamp(20px, 1.7vw, 30px);
          height: clamp(20px, 1.7vw, 30px);
        }

        .npFullscreenControlButtonFocused {
          background: rgba(255,255,255,0.24);
          box-shadow:
            0 0 0 3px rgba(255,255,255,0.92),
            0 0 0 7px rgba(203,135,0,0.72),
            0 16px 44px rgba(0,0,0,0.46);
          transform: translateY(-1px);
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
            bottom: 150px;
          }

          .npFullscreenTitle {
            margin-bottom: 10px;
            font-size: 30px;
          }

          .npFullscreenText {
            font-size: 21px;
          }

          .npFullscreenControls {
            left: 226px;
            bottom: 74px;
            gap: 14px;
          }

          .npFullscreenControlButton {
            width: 62px;
            min-width: 62px;
            height: 54px;
            min-height: 54px;
          }
        }
      ` }), SP_JSX.jsxs("div", { className: "npFullscreenRoot", children: [SP_JSX.jsx(FullscreenEffectLayer, { effect: fullscreenEffect }), fullscreenEffect === "glow" ? (SP_JSX.jsx("div", { className: "npFullscreenNoise", "aria-hidden": "true" })) : null, SP_JSX.jsx("div", { className: "npFullscreenCover", children: coverUrl && coverUrl.trim() ? (SP_JSX.jsx("img", { src: coverUrl, alt: "", style: {
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
                            }, children: SP_JSX.jsx(FaMusic, { size: 92 }) })) }), SP_JSX.jsxs("div", { className: "npFullscreenMeta", children: [SP_JSX.jsx("h1", { className: "npFullscreenTitle", children: title }), SP_JSX.jsx("p", { className: "npFullscreenText", children: artist }), SP_JSX.jsx("p", { className: "npFullscreenText", children: album })] }), SP_JSX.jsxs(DFL.Focusable, { className: "npFullscreenControls", "flow-children": "horizontal", children: [SP_JSX.jsx(DFL.Focusable, { className: "npFullscreenControlButton", focusClassName: "npFullscreenControlButtonFocused", style: { opacity: canUsePrevious ? 1 : 0.38 }, onActivate: () => {
                                    if (canUsePrevious)
                                        void runAction(() => previousTrack());
                                }, onClick: () => {
                                    if (canUsePrevious)
                                        void runAction(() => previousTrack());
                                }, children: SP_JSX.jsx(FaStepBackward, {}) }), SP_JSX.jsx(DFL.Focusable, { className: "npFullscreenControlButton", focusClassName: "npFullscreenControlButtonFocused", style: { opacity: canUsePlayPause ? 1 : 0.38 }, onActivate: () => {
                                    if (canUsePlayPause)
                                        void runAction(() => playPause());
                                }, onClick: () => {
                                    if (canUsePlayPause)
                                        void runAction(() => playPause());
                                }, children: isPlaying ? SP_JSX.jsx(FaPause, {}) : SP_JSX.jsx(FaPlay, {}) }), SP_JSX.jsx(DFL.Focusable, { className: "npFullscreenControlButton", focusClassName: "npFullscreenControlButtonFocused", style: { opacity: canUseNext ? 1 : 0.38 }, onActivate: () => {
                                    if (canUseNext)
                                        void runAction(() => nextTrack());
                                }, onClick: () => {
                                    if (canUseNext)
                                        void runAction(() => nextTrack());
                                }, children: SP_JSX.jsx(FaStepForward, {}) })] })] })] }));
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
function ActiveDot(props) {
    return props.visible ? SP_JSX.jsx("span", { "aria-hidden": "true", style: activeDotStyle }) : null;
}
function SettingsView(props) {
    const t = useTranslations();
    const enabled = new Set(props.enabledAppKeys);
    return (SP_JSX.jsx(DFL.PanelSection, { children: SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: qamCenterRowStyle, children: SP_JSX.jsxs("div", { style: { ...centeredColumnStyle, overflow: "visible" }, children: [SP_JSX.jsxs("div", { style: headerRowStyle, children: [SP_JSX.jsx(DFL.DialogButton, { style: iconButtonStyle, onClick: props.onBack, children: SP_JSX.jsx(FaArrowLeft, {}) }), SP_JSX.jsx("span", {})] }), SP_JSX.jsx("div", { style: { ...settingsGroupLabelStyle, marginBottom: "6px" }, children: t.settingsApps ?? translations.en.settingsApps ?? "Apps" }), SP_JSX.jsx(DFL.Focusable, { style: { ...centeredColumnStyle, gap: "6px" }, "flow-children": "vertical", children: musicApps.map((app) => {
                                const Icon = app.Icon;
                                const isEnabled = enabled.has(app.key);
                                return (SP_JSX.jsx(DFL.DialogButton, { style: { ...wideButtonStyle, opacity: isEnabled ? 1 : 0.58 }, onClick: () => props.onToggleApp(app.key), children: SP_JSX.jsxs("span", { style: settingsButtonContentStyle, children: [SP_JSX.jsx(Icon, {}), SP_JSX.jsx("span", { children: app.label }), SP_JSX.jsx("span", { style: settingsCheckStyle, children: isEnabled ? SP_JSX.jsx(FaCheck, {}) : null })] }) }, app.key));
                            }) }), SP_JSX.jsx("div", { style: { height: "12px" } }), SP_JSX.jsx("div", { style: { ...settingsGroupLabelStyle, marginBottom: "6px" }, children: t.settingsFullscreenEffect ?? translations.en.settingsFullscreenEffect ?? "Fullscreen effect" }), SP_JSX.jsx(DFL.Focusable, { style: { ...centeredColumnStyle, gap: "6px" }, "flow-children": "vertical", children: fullscreenEffects.map((effect) => {
                                const isSelected = props.fullscreenEffect === effect.key;
                                return (SP_JSX.jsx(DFL.DialogButton, { style: { ...wideButtonStyle, opacity: isSelected ? 1 : 0.58 }, onClick: () => props.onSelectFullscreenEffect(effect.key), children: SP_JSX.jsxs("span", { style: settingsButtonContentStyle, children: [SP_JSX.jsx("span", { children: formatEffectLabel(t, effect.key) }), SP_JSX.jsx("span", { style: settingsCheckStyle, children: isSelected ? SP_JSX.jsx(FaCheck, {}) : null })] }) }, effect.key));
                            }) })] }) }) }) }));
}
function Content() {
    const t = useTranslations();
    const [showSettings, setShowSettings] = SP_REACT.useState(false);
    const [enabledAppKeys, setEnabledAppKeys] = SP_REACT.useState(loadEnabledAppKeys);
    const [fullscreenEffect, setFullscreenEffect] = SP_REACT.useState(loadFullscreenEffect);
    const [snapshot, setSnapshot] = SP_REACT.useState(emptySnapshot);
    const [snapshotAt, setSnapshotAt] = SP_REACT.useState(Date.now());
    const [clock, setClock] = SP_REACT.useState(Date.now());
    const [loading, setLoading] = SP_REACT.useState(true);
    const [busy, setBusy] = SP_REACT.useState(false);
    const [coverUrl, setCoverUrl] = SP_REACT.useState("");
    const [mediaVisible, setMediaVisible] = SP_REACT.useState(true);
    const refreshingRef = SP_REACT.useRef(false);
    const mediaKeyRef = SP_REACT.useRef("");
    const current = SP_REACT.useMemo(() => snapshot.selected ?? snapshot.players[0] ?? null, [snapshot]);
    const enabledApps = SP_REACT.useMemo(() => musicApps.filter((app) => enabledAppKeys.includes(app.key)), [enabledAppKeys]);
    const mediaKey = `${current?.id ?? ""}|${current?.title ?? ""}|${current?.artist ?? ""}|${current?.album ?? ""}`;
    async function refresh(force = false) {
        if (refreshingRef.current && !force)
            return;
        refreshingRef.current = true;
        try {
            const next = await getSnapshot();
            setSnapshot(next);
            setSnapshotAt(Date.now());
        }
        catch (error) {
            console.warn(t.refreshFailed, error);
        }
        finally {
            setLoading(false);
            refreshingRef.current = false;
        }
    }
    async function runAction(action) {
        try {
            setBusy(true);
            await action();
        }
        finally {
            window.setTimeout(() => {
                setBusy(false);
            }, 180);
        }
        void refresh(true);
        window.setTimeout(() => void refresh(true), 60);
        window.setTimeout(() => void refresh(true), 180);
    }
    function toggleEnabledApp(key) {
        setEnabledAppKeys((previous) => {
            const isEnabled = previous.includes(key);
            if (isEnabled && previous.length === 1)
                return previous;
            const next = isEnabled ? previous.filter((enabledKey) => enabledKey !== key) : [...previous, key];
            const normalized = normalizeEnabledAppKeys(next);
            saveEnabledAppKeys(normalized);
            return normalized;
        });
    }
    function selectFullscreenEffect(effect) {
        setFullscreenEffect(effect);
        saveFullscreenEffect(effect);
    }
    SP_REACT.useEffect(() => {
        void refresh(true);
        const timer = window.setInterval(() => {
            void refresh(false);
        }, 400);
        return () => window.clearInterval(timer);
    }, []);
    SP_REACT.useEffect(() => {
        const timer = window.setInterval(() => {
            setClock(Date.now());
        }, 250);
        return () => window.clearInterval(timer);
    }, []);
    SP_REACT.useEffect(() => {
        if (!mediaKeyRef.current) {
            mediaKeyRef.current = mediaKey;
            return;
        }
        if (mediaKeyRef.current === mediaKey)
            return;
        setMediaVisible(false);
        const timer = window.setTimeout(() => {
            mediaKeyRef.current = mediaKey;
            setMediaVisible(true);
        }, 90);
        return () => window.clearTimeout(timer);
    }, [mediaKey]);
    SP_REACT.useEffect(() => {
        const title = current?.title?.trim() ?? "";
        const artist = current?.artist?.trim() ?? "";
        const album = current?.album?.trim() ?? "";
        if (!title) {
            setCoverUrl("");
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                const url = await getCover(title, artist, album);
                if (cancelled)
                    return;
                if (!url) {
                    setCoverUrl("");
                    return;
                }
                const image = new Image();
                image.onload = () => {
                    if (!cancelled)
                        setCoverUrl(url);
                };
                image.onerror = () => {
                    if (!cancelled)
                        setCoverUrl(url);
                };
                image.src = url;
            }
            catch (error) {
                if (!cancelled) {
                    console.warn(t.coverFailed, error);
                }
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [current?.title, current?.artist, current?.album, t.coverFailed]);
    const title = current?.title?.trim() ? current.title : t.notPlaying;
    const artist = current?.artist?.trim() ? current.artist : t.unknownArtist;
    const album = current?.album?.trim() ? current.album : t.unknownAlbum;
    const isPlaying = current?.status === "Playing";
    const isShuffleActive = current?.shuffleActive === true;
    const repeatMode = current?.repeatMode || "None";
    const repeatActive = repeatMode !== "None";
    const controlsDisabled = loading;
    const mediaTransitionStyle = {
        opacity: mediaVisible ? 1 : 0.28,
        transform: mediaVisible ? "translateY(0)" : "translateY(2px)",
        transition: "opacity 160ms ease, transform 160ms ease",
    };
    if (showSettings) {
        return (SP_JSX.jsx(SettingsView, { enabledAppKeys: enabledAppKeys, fullscreenEffect: fullscreenEffect, onBack: () => setShowSettings(false), onSelectFullscreenEffect: selectFullscreenEffect, onToggleApp: toggleEnabledApp }));
    }
    return (SP_JSX.jsxs(DFL.PanelSection, { children: [SP_JSX.jsx("style", { children: `
        @keyframes inRiproduzioneMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-100% + ${BLOCK_WIDTH}px)); }
        }
      ` }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: qamCenterRowStyle, children: SP_JSX.jsxs("div", { style: centeredColumnStyle, children: [SP_JSX.jsxs("div", { style: mediaTransitionStyle, children: [SP_JSX.jsx(CoverBox, { artUrl: coverUrl }), SP_JSX.jsxs("div", { style: {
                                            width: `${BLOCK_WIDTH}px`,
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
                                                } })] })] }), SP_JSX.jsx(ProgressView, { current: current, clock: clock, snapshotAt: snapshotAt }), SP_JSX.jsx("div", { style: { height: "14px" } }), SP_JSX.jsxs(DFL.Focusable, { style: controlsWrapStyle, "flow-children": "horizontal", children: [SP_JSX.jsx(DFL.DialogButton, { style: compactButtonStyle, disabled: controlsDisabled || !current?.canPrevious, onClick: () => void runAction(() => previousTrack()), children: SP_JSX.jsx(FaStepBackward, {}) }), SP_JSX.jsx(DFL.DialogButton, { style: compactButtonStyle, disabled: controlsDisabled || !current, onClick: () => void runAction(() => playPause()), children: isPlaying ? SP_JSX.jsx(FaPause, {}) : SP_JSX.jsx(FaPlay, {}) }), SP_JSX.jsx(DFL.DialogButton, { style: compactButtonStyle, disabled: controlsDisabled || !current?.canNext, onClick: () => void runAction(() => nextTrack()), children: SP_JSX.jsx(FaStepForward, {}) })] }), SP_JSX.jsx("div", { style: { height: "8px" } }), SP_JSX.jsxs(DFL.Focusable, { style: controlsWrapStyle, "flow-children": "horizontal", children: [SP_JSX.jsxs(DFL.DialogButton, { style: { ...compactButtonStyle, opacity: isShuffleActive ? 1 : 0.58 }, disabled: controlsDisabled || !current?.canShuffle, onClick: () => void runAction(() => shuffle()), children: [SP_JSX.jsx(ActiveDot, { visible: isShuffleActive }), SP_JSX.jsx(FaRandom, {})] }), SP_JSX.jsxs(DFL.DialogButton, { style: { ...compactButtonStyle, opacity: repeatActive ? 1 : 0.58 }, disabled: controlsDisabled || !current?.canRepeat, onClick: () => void runAction(() => repeat()), children: [SP_JSX.jsx(ActiveDot, { visible: repeatActive }), SP_JSX.jsx(RepeatIcon, { repeatMode: repeatMode })] })] }), snapshot.players.length > 1 ? (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx("div", { style: { height: "14px" } }), snapshot.players.map((player) => (SP_JSX.jsx(DFL.DialogButton, { style: wideButtonStyle, onClick: () => void runAction(async () => {
                                            await setMediaPlayer(player.id);
                                        }), children: SP_JSX.jsx("span", { style: buttonContentStyle, children: (player.id === snapshot.selectedPlayer ? "\u2022 " : "") + player.name }) }, player.id)))] })) : null, enabledApps.length > 0 ? (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx("div", { style: { height: "10px" } }), SP_JSX.jsx(DFL.Focusable, { style: { ...centeredColumnStyle, gap: "6px" }, "flow-children": "vertical", children: enabledApps.map((app) => {
                                            const Icon = app.Icon;
                                            return (SP_JSX.jsx(DFL.DialogButton, { style: wideButtonStyle, onClick: () => void runAction(app.open), children: SP_JSX.jsxs("span", { style: buttonContentStyle, children: [SP_JSX.jsx(Icon, {}), formatOpenAppLabel(t.openApp, app.label)] }) }, app.key));
                                        }) }), SP_JSX.jsx("div", { style: { height: "6px" } }), SP_JSX.jsxs(DFL.Focusable, { style: controlsWrapStyle, "flow-children": "horizontal", children: [SP_JSX.jsx(DFL.DialogButton, { style: splitWideButtonStyle, onClick: navigateToFullscreen, children: SP_JSX.jsx(FaExpandAlt, {}) }), SP_JSX.jsx(DFL.DialogButton, { style: splitWideButtonStyle, onClick: () => setShowSettings(true), children: SP_JSX.jsx(FaCog, {}) })] })] })) : null] }) }) })] }));
}
var index = definePlugin(() => {
    routerHook.addRoute(FULLSCREEN_ROUTE, FullscreenRoute);
    return {
        name: "Now Playing",
        titleView: SP_JSX.jsx("div", { children: "Now Playing" }),
        content: SP_JSX.jsx(Content, {}),
        icon: SP_JSX.jsx(FaMusic, {}),
        onDismount() {
            routerHook.removeRoute(FULLSCREEN_ROUTE);
        },
    };
});

export { index as default };
//# sourceMappingURL=index.js.map
