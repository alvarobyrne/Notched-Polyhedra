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
const MMPPX=3.7796;
var h = -1;
var faceRadius = -1;
var gr;
svg.setAttribute('width','900')
svg.setAttribute('height','600')
var r;
var cloneTx = -1;
var cloneTy = -1;
var columns = 4;
var cloneAmount=20;
var sideLengthMM=70;
////////////////////////
var notchDMM = 3;

const gui = new dat.GUI()
gui.width = 300
if(ISNW){
    gui.add(this,'exportSVG');
    gui.add(location,'reload');
    const folderDocs = gui.addFolder('docs');
    folderDocs.add({f(){shell.openItem(path.join(CWD,'./docs/dihedralAngle-hinge-formulae.svg'))}},'f').name('dihedralAngle-hinge-formulae.svg')
    folderDocs.add({f(){shell.openItem(path.join(CWD,'./docs/notch-distance.svg'))}},'f').name('notch-distance.svg')
    folderDocs.add({f(){shell.openItem(path.join(CWD,'./docs/side.svg'))}},'f').name('side.svg')
}
const Cuboctahedron = {
    facesTypes:[
        {sides:3,amount:4},
        {sides:4,amount:4}
    ],
    dihedralAngles:[125.26],
    volume:(side)=>5/3*Math.SQRT2*side*side*side,
    radii:{inner:0.75,side:0.866603,outer:1}
};
const Dodecahedron = {facesTypes:[5],dihedralAngles:[116.57],volume:(side)=>1/4+(15+7*Math.sqrt(5))*side*side*side};
const concreteDodecahedronPlanter1Volume = Dodecahedron.volume(3);
console.log('concreteDodecahedronPlanter1Volume: ', concreteDodecahedronPlanter1Volume);
let Polyhedron;
Polyhedron = Dodecahedron;
Polyhedron = Cuboctahedron;
const sideLength = 70;//mm
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
