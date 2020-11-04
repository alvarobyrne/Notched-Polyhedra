// const path = require('path');
// const CWD = process.cwd();
// const fs = require('fs');
// const svg_units = require('svg-units')
// console.log('svg_units: ', svg_units);
// let conversio_factors = svg_units.conversion_factors
// console.log('conversio_factors: ', conversio_factors);
// var unitsTest = svg_units.to_user_units.mm(10)
// var unitsMMTest = svg_units.from_user_units.mm(10)
// console.log('unitsMMTest: ', unitsMMTest);
// console.log('unitsTest: ', unitsTest);
////////////////////////////////////
// var shell = nw.Shell;
const SVG_NS = "http://www.w3.org/2000/svg";
var svg = document.createElementNS(SVG_NS,'svg');
// var svgFaces = document.createElementNS(SVG_NS,'svg');
svg.style.border = "1px solid red"
document.body.appendChild(svg)
// var original = document.createElementNS(SVG_NS,'g')
// var singleFacesGroup = document.createElementNS(SVG_NS,'g')
// const facesContainer = document.createElement('div');
// document.body.appendChild(facesContainer);
//---------------------------------------
const im1 = new Image();
im1.src="docs/archimedean-solid-radii.png"
document.body.appendChild(im1)
//---------------------------------------
const im2 = new Image();
im2.src="docs/platonic-solid-radii.png"
document.body.appendChild(im2)
// facesContainer.appendChild(svgFaces);
// facesContainer.classList.add('absolutely')
// var facesGroup = document.createElementNS(SVG_NS,'g');
// facesGroup.classList.add("zoom-in")
const margin=10;
// original.setAttribute('transform',`translate(${margin},${margin})`)
// svg.appendChild(original);
// svg.appendChild(singleFacesGroup);
// svg.appendChild(facesGroup);
// var dihedralDegree = 126.25;
var gapMM = 20;
// process
// console.log('process: ', process);
const mmppx=3.7796;
const MMPPX=3.7796;
// var dist = 25;
// var w = 100;
//var s = 20;
var h = -1;
// var sidesAmount = 4;
// var sideLength = 300;
var faceRadius = -1;
// var facesAmount = 12;
// var facesColumns = 4;
var gr;
svg.setAttribute('width','900')
svg.setAttribute('height','600')
// svgFaces.setAttribute('width','900')
// svgFaces.setAttribute('height','600')
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
    // folderDocs.open();
    folderDocs.add({f(){shell.openItem(path.join(CWD,'./docs/dihedralAngle-hinge-formulae.svg'))}},'f').name('dihedralAngle-hinge-formulae.svg')
    folderDocs.add({f(){shell.openItem(path.join(CWD,'./docs/notch-distance.svg'))}},'f').name('notch-distance.svg')
    folderDocs.add({f(){shell.openItem(path.join(CWD,'./docs/side.svg'))}},'f').name('side.svg')
}
// console.log('shell: ', shell);
// gui.add(this,'doHinge');
// gui.add(this,'doCloneHinges');
// gui.add(this,'doClearClones');
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
// const facesTypes= Polyhedron.facesTypes;
// const dihedralAngles= Polyhedron.dihedralAngles;
// const sideLength = 200;//pixels
const sideLength = 70;//mm
const hingedPolyhedron = new HingedPolyhedron({svg, gui, sideLength, Polyhedron});
var folderHingesAmount = gui.addFolder('hinges amount');
// folderAmount.open();
// var folderHinge = gui.addFolder('Hinge');
// var folderCommon = gui.addFolder('Common');
// folderCommon.open();
// folderHinge.open();
var folderMM = gui.addFolder('mm');
folderMM.open();
// folderFaceType.add(this,'sidesAmount',3,12,1).onChange(doUpdate);
// folderFaceType.add(this,'facesAmount',1,12,1).onChange(doUpdate);
// folderFaceType.add(this,'facesColumns',1,12,1).onChange(doUpdate);
folderMM.add(this,'sideLengthMM',50,400,0.5).name("side length(mm)").onChange(updateSideLength);
function updateSideLength(params) {
    const sideLengthPX = 3.7795*(sideLengthMM);
    // console.log('sideLengthPX: ', sideLengthPX);
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
// folderHingesAmount.add(this,'isAutoCloning').onChange(doUpdate);
/////////////////////////////////////////
// folderHinge.add(this,'w',0,100).onChange(doUpdate);
// folderCommon.add(this,'s',0,100).onChange(doUpdate);
// folderCommon.add(this,'gap',0,100).name("mdf calibre").onChange(doUpdate);
// folderHinge.add(this,'dist',0,100).onChange(doUpdate);
// folderHinge.add(this,'dihedralDegree',0,150).onChange(doUpdate);
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
// console.log('process: ', 
// const tmpSVGPath = path.join(CWD, svgExportPath);
function exportSVG() {
    // svg.appendChild(singleFacesGroup);
    // svg.appendChild(facesGroup);
    var outerHTML = svg.outerHTML
    
    fs.writeFileSync(svgExportPath,outerHTML,'utf8')

    shell.openItem(tmpSVGPath);
    // svgFaces.appendChild(singleFacesGroup);
    // svgFaces.appendChild(facesGroup);
}
// doClone()
// setTimeout(doClone,1000)
// doHinge()
function doUpdate(params) {
    console.trace()
    // svg.innerHTML = ""

    // doHinge()
    // doFaces();
    
}
// doUpdate();
// clones.setAttribute('transform',`translate(${r+10},0)`)
function to_mm(value) {
    return mmppx*value
    return 3.7795*value
}
function to_px(value) {
    return value/mmppx
    return 3.7795*value
}
/*
function doFaces(params) {
    facesGroup.innerHTML = ""

    const face = doFace(sidesAmount, sideLength);

    for (let index = 1; index < facesAmount; index++) {
        const faceClone = face.cloneNode(true);
        facesGroup.appendChild(faceClone);
        const u = index%facesColumns
        const v = index/facesColumns|0;
        const x=(faceRadius*2+margin)*u;
        const y=(faceRadius*2+margin)*v;
        faceClone.setAttribute('transform',`translate(${x},${y})`)
    }
    
}
*/
/*
function doFace(sides,length) {
    singleFacesGroup.innerHTML = ""
    const side = document.createElementNS(SVG_NS, 'path');
    const gr = document.createElementNS(SVG_NS, 'g');
    singleFacesGroup.appendChild(gr);
    gr.appendChild(side);
    const l = to_mm(length);
    notchPrecompute(s);
    const dToVertex = to_mm(notchD );
    const g= to_mm(gap)
    const gHalves = g * 0.5;
    const h0=dToVertex;
    const h00=h0-gHalves;
    const h01=h0+gHalves;
    const h1=l-dToVertex;
    const h10=h1-gHalves;
    const h11=h1+gHalves;
    const midDist= h10-h01;
    const endDist= l-h11;
    const depth = to_mm(s);
    side.setAttribute('stroke','black')
    side.setAttribute('fill','none')
    side.setAttribute('d',`M 0 0 h ${h00} v ${depth} h ${g} v ${-depth} h ${midDist} v ${depth} h ${g} v ${-depth} h ${endDist}`);
    const theta = 360 / sides;
    const degreePerRadian = Math.PI / 180;
    const radius = 0.5*l / Math.sin(theta * degreePerRadian*0.5);
    faceRadius=radius;
    const outerAngleOffset = 90 + 0.5*theta;
    for (let index = 1; index < sides; index++) {
        const angleDegree = theta * index;
        const outerAngle = angleDegree + outerAngleOffset;
        const angle = angleDegree * degreePerRadian;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const sideN = side.cloneNode();
        gr.appendChild(sideN);
        sideN.setAttribute('transform',`translate(${x},${y}) rotate(${outerAngle})`)
    }
    side.setAttribute('transform',`translate(${radius},0) rotate(${outerAngleOffset})`)
    // gr.setAttribute('transform',`translate(${radius},${radius})`)
    return gr;
}
*/
// editor.action.refactor
// expandLineSelection
window.addEventListener('keydown',function(ev){
    if(ev.key==='F5'){location.reload()}
    if(ev.ctrlKey&&ev.key==='s'){location.reload()}
})