const SVG_NS = "http://www.w3.org/2000/svg";
var svg = document.createElementNS(SVG_NS,'svg');
svg.setAttribute('xmlns',SVG_NS)
svg.setAttribute('id','svg')
// svg.style.border = "1px solid red"
document.body.appendChild(svg)
const im1 = new Image();
im1.src="docs/archimedean-solid-radii.png"
document.body.appendChild(im1)
const im2 = new Image();
im2.src="docs/platonic-solid-radii.png"
document.body.appendChild(im2)
const margin=10;
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
////////////////////////

const gui = new dat.GUI()
const polyhedraFolder = gui.addFolder('Polyhedra');
polyhedraFolder.open()
gui.width = 435;
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
Polyhedron = Archimedean.TruncatedTetrahedron;
Polyhedron = Archimedean.TruncatedCube;
Polyhedron = Archimedean.TruncatedOctahedron;
Polyhedron = Archimedean.Rhombicuboctahedron;
Polyhedron = Archimedean.TruncatedCuboctahedron;
Polyhedron = Archimedean.Cuboctahedron;
const sideLength = 60;//mm
////////////////////////////////////////////////////////////
let hingedPolyhedron = new HingedPolyhedron({svg, gui, sideLength, Polyhedron});
hingedPolyhedron.addEventListener('update',onResize);
/////////////////////////////////////////
const testsFolder = gui.addFolder("pseudo-tests");
// testsFolder.open();
testsFolder.add({f:function () {
    location.href = "pseudo-tests/hinge-test.html"
}},"f").name("hinge-test.html")
testsFolder.add({f:function () {
    location.href = "pseudo-tests/hingesManager-test.html"
}},"f").name("hingesManager-test.html")
testsFolder.add({f:function () {
    location.href = "pseudo-tests/notched-face-test.html"
}},"f").name("notched-face-test.html")
/////////////////////////////////////////

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
window.addEventListener('resize',onResize)
onResize()
function getSVGsize(params) {
    const bbox = svg.getBBox();
    const tw = bbox.width + Math.abs(bbox.x);
    const th = bbox.height + Math.abs(bbox.y);
    return {tw,th}    
}
function setBin() {
    
    const bin = document.createElementNS(SVG_NS, 'rect');
    let {tw, th} = getSVGsize();
    console.log('th: ', th);
    console.log('tw: ', tw);
    th = to_mm(302)
    th = to_mm(150)
    tw = to_mm(402)
    tw = to_mm(200)
    
    bin.setAttribute('id','bin')
    bin.setAttribute('width',tw)
    bin.setAttribute('height',th)
    bin.setAttribute('fill','none')
    bin.setAttribute('stroke','black')
    svg.appendChild(bin)
}


function setSvgNestClient(){
    var bins = document.getElementById('bins');
    const nester = new SvgNestClient(gui,bins);
    nester.addEventListener('nested',onNested)
    // nester.start()
}
setBin()
setSvgNestClient()
function onNested(params) {
    // console.log('params: ', params);
    
    // const files = pre_exportSVG();
    // console.log('files: ', files);
    exportSVG()
    //["dihedral0.svg", "dihedral1.svg"]
}
//https://www.rapidtables.com/convert/number/degrees-minutes-seconds-to-degrees.html
for (const polyhedronName in Archimedean) {
    if (Archimedean.hasOwnProperty(polyhedronName)) {
        const Polyhedron = Archimedean[polyhedronName];
        polyhedraFolder.add({f:()=>{
            svg.innerHTML='';
            setBin();
            gui.removeFolder(hingedPolyhedron.guiFolder)
            hingedPolyhedron = new HingedPolyhedron({svg, gui, sideLength, Polyhedron});
            
        }},'f').name(polyhedronName)
        
    }
}
console.log('Polyhedron: ', Polyhedron);