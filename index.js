const SVG_NS = "http://www.w3.org/2000/svg";
var svg = document.createElementNS(SVG_NS,'svg');
svg.style.border = "1px solid red"
document.body.appendChild(svg)
const im1 = new Image();
im1.src="docs/archimedean-solid-radii.png"
document.body.appendChild(im1)
const im2 = new Image();
im2.src="docs/platonic-solid-radii.png"
document.body.appendChild(im2)
const margin=10;
var gapMM = 20;
const mmppx=3.7796;
// const MMPPX=3.7796;
var h = -1;
var faceRadius = -1;
var gr;
// svg.setAttribute('width','900')
// svg.setAttribute('height','600')
var r;
var cloneTx = -1;
var cloneTy = -1;
var columns = 4;
var cloneAmount=20;
var sideLengthMM=70;
////////////////////////
var notchDMM = 3;

const gui = new dat.GUI()
gui.add(this,'setViewBox')
gui.add(this,'unsetViewBox')
gui.add(this,'setDimensions')
gui.width = 300
if(ISNW){
    gui.add(this,'exportSVG');
    gui.add(location,'reload');
    const folderDocs = gui.addFolder('docs');
    folderDocs.add({f(){shell.openItem(path.join(CWD,'./docs/dihedralAngle-hinge-formulae.svg'))}},'f').name('dihedralAngle-hinge-formulae.svg')
    folderDocs.add({f(){shell.openItem(path.join(CWD,'./docs/notch-distance.svg'))}},'f').name('notch-distance.svg')
    folderDocs.add({f(){shell.openItem(path.join(CWD,'./docs/side.svg'))}},'f').name('side.svg')
}
let Polyhedron;
Polyhedron = Dodecahedron;
Polyhedron = Cuboctahedron;
const sideLength = 70;//mm
////////////////////////////////////////////////////////////
const hingedPolyhedron = new HingedPolyhedron({svg, gui, sideLength, Polyhedron});
var folderHingesAmount = gui.addFolder('hinges amount');
var folderMM = gui.addFolder('mm');
folderMM.open();
folderMM.add(this,'sideLengthMM',50,400,0.5).name("side length(mm)").onChange(updateSideLength);
function updateSideLength(params) {
    const sideLengthPX = 3.7795*(sideLengthMM);
    hingedPolyhedron.setSideLength(sideLengthPX)
}
/////////////////////////////////////////
folderHingesAmount.add(this,'columns',1,10,1).onChange(doUpdate);
folderHingesAmount.add(this,'cloneAmount',0,40,1).onChange(doUpdate);
const testsFolder = gui.addFolder("pseudo-tests");
testsFolder.add({f:function () {
    location.href = "pseudo-tests/hinge-test.html"
}},"f").name("hinge-test.html")
testsFolder.add({f:function () {
    location.href = "pseudo-tests/hingesManager-test.html"
}},"f").name("hingesManager-test.html")
/////////////////////////////////////////
const contrlrNotchD = folderMM.add(this, 'notchDMM', 0, 150).onChange(function (v) {
    const notchDPX = 3.7795*(notchDMM);
    hingedPolyhedron.setNotchDistance(notchDPX)
});
folderMM.add(this,'gapMM',2.5,10,0.5).name("mdf calibre").onChange(function (params) {
    const gapPX = 3.7795*(gapMM);
    hingedPolyhedron.setHingeGap(gapPX)
    
});

function notchPrecompute(){
    const a = Math.PI / sidesAmount;
    const minh = s*Math.tan(a)
    const gHalves = gap / 2;
    const actualMin = minh + gHalves;
    contrlrNotchD.min(actualMin);
    contrlrNotchD.max(sideLengthMM*0.5-gap);
    if(notchDMM-gHalves<minh){
        notchDMM=actualMin;
    }
    contrlrNotchD.updateDisplay();
}
function doUpdate(params) {
    console.trace()
}
function to_mm(value) {
    return mmppx*value
    return 3.7795*value
}
function to_px(value) {
    return value/mmppx
    return 3.7795*value
}
function setViewBox(params) {
    const bbox = svg.getBBox();
    console.log('bbox: ', bbox);
    svg.setAttribute("viewBox",`0 0 ${bbox.width} ${bbox.height}`)
}
function setDimensions() {
    const bbox = svg.getBBox();
    const w = bbox.width + Math.abs(bbox.x);
    const h = bbox.height + Math.abs(bbox.y);
    svg.setAttribute("viewBox",`0 0 ${w} ${h}`)
    svg.setAttribute("width",`${w}`)
    svg.setAttribute("height", `${h}`)
}
function onResize(params) {
    const proportions = innerWidth / innerHeight;
    const isWider = proportions>1;
    // const bbox = svg.getBBox();
    // const tw = bbox.width + Math.abs(bbox.x);
    // const th = bbox.height + Math.abs(bbox.y);
    const {tw, th} = getSVGsize();
    const viewBoxString = `0 0 ${tw} ${th}`;
    svg.setAttribute("viewBox",viewBoxString)
    svg.removeAttribute("height")
    const h = isWider? innerHeight:innerWidth;
    svg.setAttribute("height", `${h}`)

}
function setDimensions3() {
    const bbox = svg.getBBox();
    const w = bbox.width + Math.abs(bbox.x);
    const h = bbox.height + Math.abs(bbox.y);
    svg.setAttribute("viewBox",`0 0 ${w} ${h}`)
    svg.setAttribute("width",`${w}`)
    svg.setAttribute("height", `${h}`)
}
function setDimensions2() {
    const bbox = svg.getBBox();
    svg.setAttribute("viewBox",`0 0 ${bbox.width} ${bbox.height}`)
    svg.setAttribute("width",`${bbox.width}`)
    svg.setAttribute("height", `${bbox.height}`)
}
function unsetViewBox(params) {
    svg.removeAttribute("viewBox")
}
window.addEventListener('resize',onResize)
onResize()
function getSVGsize(params) {
    const bbox = svg.getBBox();
    const tw = bbox.width + Math.abs(bbox.x);
    const th = bbox.height + Math.abs(bbox.y);
    return {tw,th}    
}
const bin = document.createElementNS(SVG_NS, 'rect');
const {tw, th} = getSVGsize();

bin.setAttribute('width',tw)
bin.setAttribute('height',th*0.75)
bin.setAttribute('fill','none')
bin.setAttribute('stroke','black')

svg.appendChild(bin)

console.log('SvgNest: ', SvgNest.style);
SvgNest.setbin(bin)
// SvgNest.start(progress, renderSvg);
function progress(params) {
    console.log('params: ', params);
}
function renderSvg(svglist, efficiency, placed, total){
    console.log('efficiency: ', efficiency);
    console.log('placed: ', placed);
    console.log('total: ', total);
    console.log('svglist: ', svglist);

}
