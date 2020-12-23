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
const fileFolder = gui.addFolder('File');
const viewFolder = gui.addFolder('View');
const polyhedraFolder = gui.addFolder('Polyhedra');
polyhedraFolder.open()
gui.width = 435;
if(ISNW){
    fileFolder.add(this,'exportSVG');
    fileFolder.add(location,'reload');
    const folderDocs = gui.addFolder('docs');
    folderDocs.add({f(){shell.openItem(path.join(CWD,'./docs/dihedralAngle-hinge-formulae.svg'))}},'f').name('dihedralAngle-hinge-formulae.svg')
    folderDocs.add({f(){shell.openItem(path.join(CWD,'./docs/notch-distance.svg'))}},'f').name('notch-distance.svg')
    folderDocs.add({f(){shell.openItem(path.join(CWD,'./docs/side.svg'))}},'f').name('side.svg')
}
viewFolder.add(this,'setNaturalSize').name("1:1");
viewFolder.add(this,'onResize').name("fit to view");
var isResizing = true;
var isMarkingHinges = true;
viewFolder.add(this,'isResizing').name('is fitting').onChange((value)=>{
    console.log('value: ', value);
    if(!value){
        setNaturalSize()
    }else{
        onResize()
    }
})
const valueController = viewFolder.add({f:400},'f',300,1000,1).onChange((value)=>{
    svg.setAttribute("height", `${value}`)
})
// gui.add(this,'isMarkingHinges')
let Polyhedron;
Polyhedron = Platonic.Dodecahedron;
Polyhedron = Archimedean.TruncatedTetrahedron;
Polyhedron = Archimedean.TruncatedCube;
Polyhedron = Archimedean.TruncatedOctahedron;
Polyhedron = Archimedean.Rhombicuboctahedron;
Polyhedron = Archimedean.TruncatedCuboctahedron;
Polyhedron = Archimedean.Cuboctahedron;
const sideLength = 60;//mm
////////////////////////////////////////////////////////////
let hingedPolyhedron = new HingedPolyhedron({svg, gui, sideLength, Polyhedron,isMarkingHinges});
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
    if(!isResizing)return
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
    // console.log('h: ', h);
    svg.setAttribute("height", `${h}`)
    valueController.setValue(h)

}
function setNaturalSize() {
    const proportions = innerWidth / innerHeight;
    const isWider = proportions>1;
    // const bbox = svg.getBBox();
    // const tw = bbox.width + Math.abs(bbox.x);
    // const th = bbox.height + Math.abs(bbox.y);
    const viewBoxString = `0 0 ${innerWidth} ${innerHeight}`;
    svg.setAttribute("viewBox",viewBoxString)
    svg.removeAttribute("height")
    const h = isWider? innerHeight:innerWidth;
    svg.setAttribute("height", `${h}`)

}
window.addEventListener('resize',onResize)
onResize()
// isResizing = false;
// setNaturalSize();
function getSVGsize(params) {
    const bbox = svg.getBBox();
    const tw = bbox.width + Math.abs(bbox.x);
    const th = bbox.height + Math.abs(bbox.y);
    return {tw,th}    
}
function setBin() {
    
    const bin = document.createElementNS(SVG_NS, 'rect');
    let {tw, th} = getSVGsize();
    // console.log('th: ', th);
    // console.log('tw: ', tw);
    const margin = 3;
    th = to_mm(250-margin);
    tw = to_mm(350-margin);

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
    // exportSVG()
    //["dihedral0.svg", "dihedral1.svg"]
}
//https://www.rapidtables.com/convert/number/degrees-minutes-seconds-to-degrees.html
for (const polyhedronName in Archimedean) {
    if (Archimedean.hasOwnProperty(polyhedronName)) {
        const Polyhedron = Archimedean[polyhedronName];
        polyhedraFolder.add({f:()=>{
            pickPolyhedron(Polyhedron);
        }},'f').name(polyhedronName)
        
    }
}

function pickPolyhedron(Polyhedron) {
    svg.innerHTML = '';
    setBin();
    gui.removeFolder(hingedPolyhedron.guiFolder);
    hingedPolyhedron.removeEventListener('update', onResize);
    hingedPolyhedron = new HingedPolyhedron({ svg, gui, sideLength, Polyhedron ,isMarkingHinges});
    hingedPolyhedron.addEventListener('update', onResize);
    onResize();
}
const polyhedraNames = Object.keys(Archimedean);
var polyhedronIndex = 1;
setInterval(()=>{
    return
    const polyhedronName = polyhedraNames[polyhedronIndex];
    console.log('polyhedronName: ', polyhedronName);
    pickPolyhedron(Archimedean[polyhedronName])
    polyhedronIndex++
    if(polyhedronIndex>=polyhedraNames.length)
        polyhedronIndex=0;
},2000)
function closeAllGuiFolders() {
    const folders = gui.__folders;
    for (const folderKey in folders) {
        if (folders.hasOwnProperty(folderKey)) {
            const folder = folders[folderKey];
            folder.close()
            
        }
    }
}
closeAllGuiFolders()